/**
 * DataTable — sortable, expandable, column-reorderable table primitive.
 *
 *  - Sort: sortable headers are buttons inside <th>; <th aria-sort> carries state.
 *    null/undefined/NaN always sort last, in both directions.
 *  - Expand: optional detail row per row, toggled by a real button
 *    (aria-expanded + aria-controls) in the row's first cell.
 *  - Reorder: HTML5 drag-and-drop on headers, plus a keyboard path for
 *    WCAG 2.2 SC 2.5.7 (a "Move column" handle; ArrowLeft/ArrowRight move one
 *    position, announced through a polite live region). Order persists in
 *    localStorage under `bjui.datatable.<tableId>.columnOrder`.
 *  - Excluded rows: hidden by default behind a "Show excluded (N)" checkbox, so
 *    the count is always visible and nothing disappears silently.
 *
 * SSR: nothing touches `window` during render; storage is read in an effect, so
 * the server and first client render both use the default column order.
 */

'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, ChevronsUpDown, GripVertical } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

// ─── Public types ─────────────────────────────────────────────────────────────

export type DataTableSortValue = string | number | null | undefined;
export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableSort {
  columnId: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Column is sortable iff present. */
  sortValue?: (row: T) => DataTableSortValue;
  align?: 'left' | 'right';
  /** Plain-text name for announcements and handle labels when `header` is not a string. */
  headerLabel?: string;
}

export interface DataTableProps<T> {
  /** localStorage key: `bjui.datatable.${tableId}.columnOrder`. */
  tableId: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Rows are expandable iff present. */
  renderExpanded?: (row: T) => React.ReactNode;
  /** Accessible name of a row for the expand button: "Show details for <rowLabel>". */
  rowLabel?: (row: T) => string;
  defaultSort?: DataTableSort;
  isRowExcluded?: (row: T) => boolean;
  /** Badge text on excluded rows. Default 'Excluded'. */
  excludedLabel?: string;
  /** Rendered as a visually-hidden <caption> (and so names the table). */
  caption?: string;
  /** Default true. */
  reorderable?: boolean;
  emptyMessage?: React.ReactNode;
}

// ─── Pure helpers (exported for tests, not from the package entry) ──────────

export function columnOrderStorageKey(tableId: string): string {
  return `bjui.datatable.${tableId}.columnOrder`;
}

/**
 * Merge a persisted order with the current columns: unknown ids are dropped,
 * duplicates collapse, and columns missing from the persisted order are
 * inserted at their default index (i.e. appended when they are last by default).
 */
export function reconcileColumnOrder(persisted: readonly string[], defaultIds: readonly string[]): string[] {
  const known = new Set(defaultIds);
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of persisted) {
    if (known.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  defaultIds.forEach((id, defaultIndex) => {
    if (!seen.has(id)) {
      seen.add(id);
      result.splice(Math.min(defaultIndex, result.length), 0, id);
    }
  });
  return result;
}

function isMissing(v: DataTableSortValue): v is null | undefined {
  return v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));
}

/** Ascending comparison of two present values. */
export function compareSortValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/** Stable sort; missing values go last regardless of direction. */
export function sortRows<T>(
  rows: readonly T[],
  sortValue: (row: T) => DataTableSortValue,
  direction: DataTableSortDirection,
): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return rows
    .map((row) => ({ row, value: sortValue(row) }))
    .sort((x, y) => {
      const xm = isMissing(x.value);
      const ym = isMissing(y.value);
      if (xm || ym) return xm === ym ? 0 : xm ? 1 : -1;
      return sign * compareSortValues(x.value as string | number, y.value as string | number);
    })
    .map((entry) => entry.row);
}

function readStoredOrder(key: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeStoredOrder(key: string, order: string[] | null): void {
  try {
    if (order) window.localStorage.setItem(key, JSON.stringify(order));
    else window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable (private mode, quota, blocked): order still works in memory.
  }
}

function sameOrder(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

function columnLabel<T>(column: DataTableColumn<T>): string {
  if (column.headerLabel) return column.headerLabel;
  if (typeof column.header === 'string' || typeof column.header === 'number') return String(column.header);
  return column.id;
}

// ─── Styles (theme tokens only) ──────────────────────────────────────────────

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500';

const ARIA_SORT: Record<DataTableSortDirection, 'ascending' | 'descending'> = {
  asc: 'ascending',
  desc: 'descending',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DataTable<T>({
  tableId,
  columns,
  rows,
  getRowId,
  renderExpanded,
  rowLabel,
  defaultSort,
  isRowExcluded,
  excludedLabel = 'Excluded',
  caption,
  reorderable = true,
  emptyMessage = 'No rows to display.',
}: DataTableProps<T>) {
  const uid = useId();
  const storageKey = columnOrderStorageKey(tableId);

  // ── Column order ───────────────────────────────────────────────────────────
  // null = default order. Persisted ids are kept raw and reconciled at render,
  // so columns added/removed later are handled without rewriting storage.
  const [storedOrder, setStoredOrder] = useState<string[] | null>(null);

  useEffect(() => {
    if (!reorderable) return;
    const persisted = readStoredOrder(storageKey);
    // Reading storage must happen after mount (SSR + hydration safety), so the
    // state update belongs in this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (persisted) setStoredOrder(persisted);
  }, [storageKey, reorderable]);

  const defaultIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const orderIds = useMemo(
    () => (reorderable && storedOrder ? reconcileColumnOrder(storedOrder, defaultIds) : defaultIds),
    [reorderable, storedOrder, defaultIds],
  );
  const columnsById = useMemo(() => new Map(columns.map((c) => [c.id, c])), [columns]);
  const orderedColumns = orderIds.map((id) => columnsById.get(id)!);
  const isDefaultOrder = sameOrder(orderIds, defaultIds);

  const [announcement, setAnnouncement] = useState('');
  const handleRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusId = useRef<string | null>(null);

  // Re-focus the moved handle after React re-orders the header cells: moving a
  // focused node in the DOM can drop focus in some browsers.
  useEffect(() => {
    const id = pendingFocusId.current;
    if (id === null) return;
    pendingFocusId.current = null;
    const el = handleRefs.current.get(id);
    if (el && document.activeElement !== el) el.focus();
  });

  const commitOrder = useCallback(
    (next: string[]) => {
      const normalized = sameOrder(next, defaultIds) ? null : next;
      setStoredOrder(normalized);
      writeStoredOrder(storageKey, normalized);
    },
    [defaultIds, storageKey],
  );

  const moveColumn = useCallback(
    (columnId: string, toIndex: number) => {
      const fromIndex = orderIds.indexOf(columnId);
      if (fromIndex === -1 || toIndex < 0 || toIndex >= orderIds.length || toIndex === fromIndex) return false;
      const next = orderIds.filter((id) => id !== columnId);
      next.splice(toIndex, 0, columnId);
      commitOrder(next);
      const column = columnsById.get(columnId)!;
      setAnnouncement(`${columnLabel(column)} moved to position ${toIndex + 1} of ${next.length}`);
      return true;
    },
    [orderIds, columnsById, commitOrder],
  );

  const resetColumns = () => {
    commitOrder(defaultIds);
    setAnnouncement('Columns reset to default order');
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, columnId: string) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const index = orderIds.indexOf(columnId);
    const target = e.key === 'ArrowLeft' ? index - 1 : index + 1;
    pendingFocusId.current = columnId;
    if (!moveColumn(columnId, target)) {
      const column = columnsById.get(columnId)!;
      setAnnouncement(`${columnLabel(column)} is already at position ${index + 1} of ${orderIds.length}`);
    }
  };

  // ── Drag and drop ──────────────────────────────────────────────────────────
  // The dragged id lives in a ref rather than dataTransfer: getData() is empty
  // during dragover in browsers, and drops from outside the table are ignored.
  const draggedId = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const dragHandlers = (columnId: string) =>
    reorderable
      ? {
          draggable: true,
          onDragStart: (e: React.DragEvent) => {
            draggedId.current = columnId;
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData?.('text/plain', columnId);
            }
          },
          onDragOver: (e: React.DragEvent) => {
            if (draggedId.current === null) return;
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
            if (dragOverId !== columnId) setDragOverId(columnId);
          },
          onDragLeave: () => setDragOverId((cur) => (cur === columnId ? null : cur)),
          onDrop: (e: React.DragEvent) => {
            const from = draggedId.current;
            if (from === null) return;
            e.preventDefault();
            draggedId.current = null;
            setDragOverId(null);
            if (from !== columnId) moveColumn(from, orderIds.indexOf(columnId));
          },
          onDragEnd: () => {
            draggedId.current = null;
            setDragOverId(null);
          },
        }
      : {};

  // ── Sorting ────────────────────────────────────────────────────────────────
  const [sort, setSort] = useState<DataTableSort | null>(defaultSort ?? null);
  const sortColumn = sort ? columnsById.get(sort.columnId) : undefined;

  const toggleSort = (columnId: string) => {
    setSort((cur) =>
      cur?.columnId === columnId
        ? { columnId, direction: cur.direction === 'asc' ? 'desc' : 'asc' }
        : { columnId, direction: 'asc' },
    );
  };

  // ── Excluded rows ──────────────────────────────────────────────────────────
  const [showExcluded, setShowExcluded] = useState(false);
  const excludedIds = useMemo(() => {
    const ids = new Set<string>();
    if (isRowExcluded) for (const row of rows) if (isRowExcluded(row)) ids.add(getRowId(row));
    return ids;
  }, [rows, isRowExcluded, getRowId]);
  const excludedCount = excludedIds.size;

  const displayRows = useMemo(() => {
    const visible = showExcluded ? rows : rows.filter((r) => !excludedIds.has(getRowId(r)));
    return sortColumn?.sortValue && sort ? sortRows(visible, sortColumn.sortValue, sort.direction) : visible;
  }, [rows, showExcluded, excludedIds, getRowId, sortColumn, sort]);

  // ── Expansion ──────────────────────────────────────────────────────────────
  const expandable = Boolean(renderExpanded);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const toggleExpanded = (rowId: string) =>
    setExpanded((cur) => {
      const next = new Set(cur);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  const detailsId = (rowId: string) => `${uid}-details-${encodeURIComponent(rowId)}`;

  const colCount = orderedColumns.length + (expandable ? 1 : 0);
  const showReset = reorderable && !isDefaultOrder;
  const showToolbar = excludedCount > 0 || showReset;

  return (
    <div className="w-full font-sans">
      {showToolbar && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-400">
          {excludedCount > 0 ? (
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showExcluded}
                onChange={(e) => setShowExcluded(e.target.checked)}
                className={`h-4 w-4 accent-accent-500 ${FOCUS_RING}`}
              />
              Show excluded ({excludedCount})
            </label>
          ) : (
            <span />
          )}
          {showReset && (
            <button
              type="button"
              onClick={resetColumns}
              className={`rounded px-2 py-1 text-neutral-400 transition-colors hover:bg-primary-800 hover:text-neutral-100 ${FOCUS_RING}`}
            >
              Reset columns
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-primary-700 bg-primary-900">
        <table className="w-full border-collapse text-sm text-neutral-100">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-primary-700">
              {expandable && (
                <th scope="col" className="w-10 px-2 py-3">
                  <span className="sr-only">Details</span>
                </th>
              )}
              {orderedColumns.map((column) => {
                const label = columnLabel(column);
                const sortable = Boolean(column.sortValue);
                const active = sortable && sort?.columnId === column.id;
                const right = column.align === 'right';
                return (
                  <th
                    key={column.id}
                    scope="col"
                    data-column-id={column.id}
                    aria-sort={sortable ? (active && sort ? ARIA_SORT[sort.direction] : 'none') : undefined}
                    {...dragHandlers(column.id)}
                    className={[
                      'whitespace-nowrap px-4 py-3 align-middle text-xs font-semibold uppercase tracking-eyebrow text-neutral-400',
                      right ? 'text-right' : 'text-left',
                      dragOverId === column.id ? 'bg-primary-800' : '',
                    ].join(' ')}
                  >
                    <div className={`flex items-center gap-1 ${right ? 'justify-end' : 'justify-start'}`}>
                      {reorderable && (
                        <button
                          type="button"
                          ref={(el) => {
                            if (el) handleRefs.current.set(column.id, el);
                            else handleRefs.current.delete(column.id);
                          }}
                          aria-label={`Move column ${label}`}
                          onKeyDown={(e) => onHandleKeyDown(e, column.id)}
                          className={`inline-flex h-6 w-6 cursor-grab items-center justify-center rounded-sm text-neutral-400 transition-colors hover:text-neutral-100 ${FOCUS_RING}`}
                        >
                          <GripVertical size={14} aria-hidden="true" />
                        </button>
                      )}
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.id)}
                          className={[
                            'inline-flex min-h-6 items-center gap-1 rounded-sm font-semibold uppercase tracking-eyebrow transition-colors hover:text-neutral-100',
                            active ? 'text-neutral-100' : '',
                            FOCUS_RING,
                          ].join(' ')}
                        >
                          {column.header}
                          {active && sort?.direction === 'asc' && <ArrowUp size={12} aria-hidden="true" />}
                          {active && sort?.direction === 'desc' && <ArrowDown size={12} aria-hidden="true" />}
                          {!active && <ChevronsUpDown size={12} aria-hidden="true" className="opacity-60" />}
                        </button>
                      ) : (
                        <span>{column.header}</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-neutral-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {displayRows.map((row, index) => {
              const rowId = getRowId(row);
              const excluded = excludedIds.has(rowId);
              const isOpen = expandable && expanded.has(rowId);
              const name = rowLabel ? rowLabel(row) : `row ${index + 1}`;
              return (
                <React.Fragment key={rowId}>
                  <tr
                    data-row-id={rowId}
                    data-excluded={excluded ? 'true' : undefined}
                    className={[
                      'border-b border-primary-700/50 transition-colors hover:bg-primary-800',
                      excluded ? 'text-neutral-400' : '',
                    ].join(' ')}
                  >
                    {expandable && (
                      <td className="w-10 px-2 py-2 align-middle">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={detailsId(rowId)}
                          aria-label={`Show details for ${name}`}
                          onClick={() => toggleExpanded(rowId)}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition-colors hover:bg-primary-800 hover:text-neutral-100 ${FOCUS_RING}`}
                        >
                          <ChevronRight
                            size={16}
                            aria-hidden="true"
                            className={`transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-90' : ''}`}
                          />
                        </button>
                      </td>
                    )}
                    {orderedColumns.map((column, colIndex) => (
                      <td
                        key={column.id}
                        className={`px-4 py-3 align-middle ${column.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        {column.cell(row)}
                        {excluded && colIndex === 0 && (
                          <span className="ml-2 inline-block align-middle">
                            <StatusBadge tone="neutral" label={excludedLabel} size="sm" showDot={false} />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  {isOpen && renderExpanded && (
                    <tr className="border-b border-primary-700/50 bg-primary-950">
                      <td id={detailsId(rowId)} colSpan={colCount} className="px-4 py-4 text-neutral-200">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
