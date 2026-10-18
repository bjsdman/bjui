/**
 * DataTable — acceptance tests for filament-tracker Phase 1b (bjsdman/bjui#7).
 *
 * Each describe block names the AC it covers. Tests drive the table through the
 * DOM the way a user or assistive tech would (roles, names, aria-* state),
 * not through component internals.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';

import { DataTable } from '../components/DataTable';
import type { DataTableColumn, DataTableProps } from '../index';

// ─── Fixture ─────────────────────────────────────────────────────────────────

interface Spool {
  id: string;
  name: string;
  price: number | null;
  brand?: string;
  color: string;
  notes: string;
  archived?: boolean;
}

const ROWS: Spool[] = [
  { id: 'a', name: 'PLA Red', price: 20, brand: 'Bambu', color: 'red', notes: 'n-a' },
  { id: 'b', name: 'petg blue', price: null, brand: 'Polymaker', color: 'blue', notes: 'n-b' },
  { id: 'c', name: 'ABS item10', price: 5, brand: undefined, color: 'black', notes: 'n-c' },
  { id: 'd', name: 'ABS item9', price: 100, brand: 'Elegoo', color: 'white', notes: 'n-d' },
];

const COLUMNS: DataTableColumn<Spool>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name, sortValue: (r) => r.name },
  { id: 'price', header: 'Price', cell: (r) => (r.price ?? '—'), sortValue: (r) => r.price, align: 'right' },
  { id: 'brand', header: 'Brand', cell: (r) => r.brand ?? '', sortValue: (r) => r.brand },
  { id: 'color', header: <span>Colour swatch</span>, headerLabel: 'Color', cell: (r) => r.color },
  { id: 'notes', header: 'Notes', cell: (r) => r.notes },
];

const DEFAULT_ORDER = ['Name', 'Price', 'Brand', 'Color', 'Notes'];
const LABEL_BY_ID: Record<string, string> = { name: 'Name', price: 'Price', brand: 'Brand', color: 'Color', notes: 'Notes' };
const ID_BY_LABEL: Record<string, string> = Object.fromEntries(Object.entries(LABEL_BY_ID).map(([id, l]) => [l, id]));
const STORAGE_KEY = 'bjui.datatable.spools.columnOrder';

function renderTable(props: Partial<DataTableProps<Spool>> = {}) {
  return render(
    <DataTable<Spool>
      tableId="spools"
      columns={COLUMNS}
      rows={ROWS}
      getRowId={(r) => r.id}
      {...props}
    />,
  );
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function table() {
  return screen.getByRole('table');
}

/** Data <th> elements in display order (skips the expander column if present). */
function dataHeaders(): HTMLTableCellElement[] {
  const ths = Array.from(table().querySelectorAll<HTMLTableCellElement>('thead th'));
  return ths.filter((th) => th.hasAttribute('data-column-id'));
}

/** Plain-text column labels in display order. */
function headerOrder(): string[] {
  return dataHeaders().map((h) => LABEL_BY_ID[h.getAttribute('data-column-id')!]);
}

/** Body rows that represent data (not detail rows, not the empty-state row). */
function dataRows(): HTMLTableRowElement[] {
  return Array.from(table().querySelectorAll<HTMLTableRowElement>('tbody tr[data-row-id]'));
}

function rowIds(): string[] {
  return dataRows().map((tr) => tr.getAttribute('data-row-id')!);
}

function th(label: string): HTMLTableCellElement {
  const el = table().querySelector<HTMLTableCellElement>(`thead th[data-column-id="${ID_BY_LABEL[label]}"]`);
  if (!el) throw new Error(`no header for ${label}`);
  return el;
}

function sortButton(label: string) {
  return within(th(label)).getByRole('button', { name: label });
}

function handle(label: string) {
  return screen.getByRole('button', { name: `Move column ${label}` });
}

function liveRegion(container: HTMLElement) {
  const el = container.querySelector('[aria-live="polite"]');
  if (!el) throw new Error('no aria-live="polite" region');
  return el;
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Structure ───────────────────────────────────────────────────────────────

describe('DataTable — structure', () => {
  it('renders semantic table / thead / tbody inside an overflow-x-auto wrapper', () => {
    renderTable();
    const t = table();
    expect(t.tagName).toBe('TABLE');
    expect(t.querySelector('thead')).toBeInTheDocument();
    expect(t.querySelector('tbody')).toBeInTheDocument();
    expect(t.parentElement).toHaveClass('overflow-x-auto');
  });

  it('renders one data row per row, cells via column.cell', () => {
    renderTable();
    expect(rowIds()).toEqual(['a', 'b', 'c', 'd']);
    expect(within(dataRows()[0]).getByText('PLA Red')).toBeInTheDocument();
    expect(within(dataRows()[1]).getByText('—')).toBeInTheDocument();
  });

  it('renders a ReactNode header as given', () => {
    renderTable();
    expect(screen.getByText('Colour swatch')).toBeInTheDocument();
  });

  it('renders a visually-hidden caption when caption is given', () => {
    renderTable({ caption: 'Filament spools' });
    const caption = table().querySelector('caption');
    expect(caption).toHaveTextContent('Filament spools');
    expect(caption).toHaveClass('sr-only');
    expect(screen.getByRole('table', { name: 'Filament spools' })).toBeInTheDocument();
  });

  it('renders no caption when caption is omitted', () => {
    renderTable();
    expect(table().querySelector('caption')).not.toBeInTheDocument();
  });

  it('right-aligns cells for align="right" columns', () => {
    renderTable();
    expect(th('Price')).toHaveClass('text-right');
    const priceIdx = dataHeaders().indexOf(th('Price'));
    const firstRowCells = dataRows()[0].querySelectorAll('td');
    expect(firstRowCells[priceIdx]).toHaveClass('text-right');
  });

  it('renders emptyMessage when there are no rows', () => {
    renderTable({ rows: [], emptyMessage: 'No spools yet' });
    expect(screen.getByText('No spools yet')).toBeInTheDocument();
    expect(dataRows()).toHaveLength(0);
  });

  it('uses no hard-coded hex colours in inline styles', () => {
    const { container } = renderTable({ renderExpanded: (r) => r.notes, isRowExcluded: () => false });
    container.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
      expect(el.getAttribute('style')).not.toMatch(/#[0-9a-f]{3,8}/i);
    });
  });
});

// ─── AC1.2 sort ──────────────────────────────────────────────────────────────

describe('DataTable — AC1.2 sort', () => {
  it('sortable headers are <button>s inside <th>; non-sortable headers have no sort button', () => {
    renderTable();
    for (const label of ['Name', 'Price', 'Brand']) {
      const btn = sortButton(label);
      expect(btn.tagName).toBe('BUTTON');
      expect(btn.closest('th')).toBe(th(label));
    }
    expect(within(th('Notes')).queryByRole('button', { name: 'Notes' })).not.toBeInTheDocument();
    expect(within(th('Color')).queryByRole('button', { name: /colour swatch|color/i })).not.toBeInTheDocument();
  });

  it('sortable <th> carry aria-sort="none" until sorted; non-sortable carry none', () => {
    renderTable();
    expect(th('Name')).toHaveAttribute('aria-sort', 'none');
    expect(th('Price')).toHaveAttribute('aria-sort', 'none');
    expect(th('Notes')).not.toHaveAttribute('aria-sort');
  });

  it('click toggles asc → desc and updates aria-sort', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Name'));
    expect(th('Name')).toHaveAttribute('aria-sort', 'ascending');
    await user.click(sortButton('Name'));
    expect(th('Name')).toHaveAttribute('aria-sort', 'descending');
    await user.click(sortButton('Name'));
    expect(th('Name')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorting a new column resets the previous column to aria-sort="none"', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Name'));
    await user.click(sortButton('Price'));
    expect(th('Name')).toHaveAttribute('aria-sort', 'none');
    expect(th('Price')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('Enter activates the sort button', async () => {
    const user = userEvent.setup();
    renderTable();
    sortButton('Price').focus();
    await user.keyboard('{Enter}');
    expect(th('Price')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('Space activates the sort button', async () => {
    const user = userEvent.setup();
    renderTable();
    sortButton('Price').focus();
    await user.keyboard(' ');
    expect(th('Price')).toHaveAttribute('aria-sort', 'ascending');
    await user.keyboard(' ');
    expect(th('Price')).toHaveAttribute('aria-sort', 'descending');
  });

  it('numeric values compare as numbers', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Price'));
    expect(rowIds()).toEqual(['c', 'a', 'd', 'b']); // 5, 20, 100, null
  });

  it('null sorts last ascending AND descending', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Price'));
    expect(rowIds().at(-1)).toBe('b');
    await user.click(sortButton('Price'));
    expect(rowIds()).toEqual(['d', 'a', 'c', 'b']); // 100, 20, 5, null
  });

  it('undefined sorts last ascending AND descending', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Brand'));
    expect(rowIds()).toEqual(['a', 'd', 'b', 'c']); // Bambu, Elegoo, Polymaker, undefined
    await user.click(sortButton('Brand'));
    expect(rowIds()).toEqual(['b', 'd', 'a', 'c']);
  });

  it('strings use localeCompare with numeric collation (item9 < item10, case-insensitive order)', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(sortButton('Name'));
    // ASCII order would put "PLA Red" before "petg blue" and "item10" before "item9".
    expect(rowIds()).toEqual(['d', 'c', 'b', 'a']);
  });

  it('applies defaultSort on first render', () => {
    renderTable({ defaultSort: { columnId: 'price', direction: 'desc' } });
    expect(th('Price')).toHaveAttribute('aria-sort', 'descending');
    expect(rowIds()).toEqual(['d', 'a', 'c', 'b']);
  });

  it('does not mutate the rows prop', async () => {
    const user = userEvent.setup();
    const rows = [...ROWS];
    renderTable({ rows });
    await user.click(sortButton('Price'));
    expect(rows.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

// ─── AC1.2 expand ────────────────────────────────────────────────────────────

describe('DataTable — AC1.2 expand', () => {
  const renderExpanded = (r: Spool) => <p>Details: {r.notes}</p>;

  it('no expand buttons when renderExpanded is absent', () => {
    renderTable();
    expect(screen.queryAllByRole('button', { name: /show details/i })).toHaveLength(0);
  });

  it("each row's first cell holds a button with aria-expanded=false and aria-controls", () => {
    renderTable({ renderExpanded });
    for (const tr of dataRows()) {
      const firstCell = tr.cells[0];
      const btn = within(firstCell).getByRole('button', { name: /show details for/i });
      expect(btn).toHaveAttribute('aria-expanded', 'false');
      expect(btn.getAttribute('aria-controls')).toBeTruthy();
    }
  });

  it('aria-controls ids are unique per row', () => {
    renderTable({ renderExpanded });
    const ids = screen
      .getAllByRole('button', { name: /show details for/i })
      .map((b) => b.getAttribute('aria-controls'));
    expect(new Set(ids).size).toBe(ROWS.length);
  });

  it('uses rowLabel for the accessible name when given', () => {
    renderTable({ renderExpanded, rowLabel: (r) => r.name });
    expect(screen.getByRole('button', { name: 'Show details for PLA Red' })).toBeInTheDocument();
  });

  it('toggling renders, then removes, a following <tr> with one full-width <td> matching aria-controls', async () => {
    const user = userEvent.setup();
    renderTable({ renderExpanded, rowLabel: (r) => r.name });
    const btn = screen.getByRole('button', { name: 'Show details for PLA Red' });

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    const controls = btn.getAttribute('aria-controls')!;
    const detailCell = document.getElementById(controls)!;
    expect(detailCell).toBeInTheDocument();
    expect(detailCell.tagName).toBe('TD');
    expect(detailCell).toHaveTextContent('Details: n-a');

    const detailRow = detailCell.closest('tr')!;
    expect(detailRow.cells).toHaveLength(1);
    const headerCount = table().querySelectorAll('thead th').length;
    expect((detailCell as HTMLTableCellElement).colSpan).toBe(headerCount);
    // It is the row immediately after the data row.
    expect(btn.closest('tr')!.nextElementSibling).toBe(detailRow);

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(controls)).not.toBeInTheDocument();
  });

  it('is keyboard operable (Enter and Space)', async () => {
    const user = userEvent.setup();
    renderTable({ renderExpanded, rowLabel: (r) => r.name });
    const btn = screen.getByRole('button', { name: 'Show details for petg blue' });
    btn.focus();
    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('rows expand independently', async () => {
    const user = userEvent.setup();
    renderTable({ renderExpanded, rowLabel: (r) => r.name });
    await user.click(screen.getByRole('button', { name: 'Show details for PLA Red' }));
    await user.click(screen.getByRole('button', { name: 'Show details for ABS item9' }));
    expect(screen.getByText('Details: n-a')).toBeInTheDocument();
    expect(screen.getByText('Details: n-d')).toBeInTheDocument();
    expect(screen.queryByText('Details: n-b')).not.toBeInTheDocument();
  });
});

// ─── AC1.5 reorder ───────────────────────────────────────────────────────────

describe('DataTable — AC1.5 reorder (keyboard / non-pointer path)', () => {
  it('each header has a "Move column <label>" handle; headerLabel names ReactNode headers', () => {
    renderTable();
    for (const label of DEFAULT_ORDER) {
      expect(handle(label)).toBeInTheDocument();
      expect(handle(label).closest('th')).toBe(th(label));
    }
  });

  it('ArrowRight / ArrowLeft move the focused column one position', () => {
    renderTable();
    const h = handle('Name');
    h.focus();
    fireEvent.keyDown(h, { key: 'ArrowRight' });
    expect(headerOrder()).toEqual(['Price', 'Name', 'Brand', 'Color', 'Notes']);
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(headerOrder()).toEqual(['Price', 'Brand', 'Name', 'Color', 'Notes']);
    fireEvent.keyDown(handle('Name'), { key: 'ArrowLeft' });
    expect(headerOrder()).toEqual(['Price', 'Name', 'Brand', 'Color', 'Notes']);
  });

  it('moves body cells along with the header', () => {
    renderTable();
    fireEvent.keyDown(handle('Notes'), { key: 'ArrowLeft' });
    expect(headerOrder()).toEqual(['Name', 'Price', 'Brand', 'Notes', 'Color']);
    const cells = Array.from(dataRows()[0].querySelectorAll('td')).map((td) => td.textContent);
    expect(cells).toEqual(['PLA Red', '20', 'Bambu', 'n-a', 'red']);
  });

  it('announces the move in an aria-live="polite" region', () => {
    const { container } = renderTable();
    fireEvent.keyDown(handle('Price'), { key: 'ArrowLeft' });
    expect(liveRegion(container)).toHaveTextContent('Price moved to position 1 of 5');
    fireEvent.keyDown(handle('Price'), { key: 'ArrowRight' });
    expect(liveRegion(container)).toHaveTextContent('Price moved to position 2 of 5');
  });

  it('keeps focus on the moved handle', () => {
    renderTable();
    handle('Brand').focus();
    fireEvent.keyDown(handle('Brand'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(handle('Brand'));
    fireEvent.keyDown(handle('Brand'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(handle('Brand'));
    expect(headerOrder()[0]).toBe('Brand');
  });

  it('does nothing past the edges', () => {
    renderTable();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowLeft' });
    fireEvent.keyDown(handle('Notes'), { key: 'ArrowRight' });
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
  });

  it('Reset columns appears only when order differs from default and restores it', async () => {
    const user = userEvent.setup();
    renderTable();
    expect(screen.queryByRole('button', { name: 'Reset columns' })).not.toBeInTheDocument();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    await user.click(screen.getByRole('button', { name: 'Reset columns' }));
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
    expect(screen.queryByRole('button', { name: 'Reset columns' })).not.toBeInTheDocument();
  });

  it('Reset button disappears again when the user moves columns back to default', () => {
    renderTable();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'Reset columns' })).toBeInTheDocument();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowLeft' });
    expect(screen.queryByRole('button', { name: 'Reset columns' })).not.toBeInTheDocument();
  });

  it('reorderable={false} hides handles, disables drag and never shows Reset', () => {
    renderTable({ reorderable: false });
    expect(screen.queryAllByRole('button', { name: /^move column/i })).toHaveLength(0);
    for (const h of dataHeaders()) {
      expect(h.getAttribute('draggable')).not.toBe('true');
    }
    expect(screen.queryByRole('button', { name: 'Reset columns' })).not.toBeInTheDocument();
  });
});

describe('DataTable — AC1.5 reorder (drag and drop)', () => {
  function drag(from: string, to: string) {
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => ''), effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(th(from), { dataTransfer });
    fireEvent.dragOver(th(to), { dataTransfer });
    fireEvent.drop(th(to), { dataTransfer });
    fireEvent.dragEnd(th(from), { dataTransfer });
  }

  it('headers are HTML5 draggable', () => {
    renderTable();
    for (const h of dataHeaders()) expect(h).toHaveAttribute('draggable', 'true');
  });

  it('dragover calls preventDefault so drop is allowed', () => {
    renderTable();
    fireEvent.dragStart(th('Name'), { dataTransfer: { setData: vi.fn() } });
    const ev = new Event('dragover', { bubbles: true, cancelable: true });
    th('Brand').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
  });

  it('dropping a header on another moves it to that position (leftward)', () => {
    renderTable();
    drag('Notes', 'Price');
    expect(headerOrder()).toEqual(['Name', 'Notes', 'Price', 'Brand', 'Color']);
  });

  it('dropping a header on another moves it to that position (rightward)', () => {
    renderTable();
    drag('Name', 'Brand');
    expect(headerOrder()).toEqual(['Price', 'Brand', 'Name', 'Color', 'Notes']);
  });

  it('announces drag moves too', () => {
    const { container } = renderTable();
    drag('Notes', 'Price');
    expect(liveRegion(container)).toHaveTextContent('Notes moved to position 2 of 5');
  });

  it('dropping on itself is a no-op', () => {
    renderTable();
    drag('Brand', 'Brand');
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
  });

  it('drag is ignored when reorderable={false}', () => {
    renderTable({ reorderable: false });
    drag('Notes', 'Name');
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
  });
});

describe('DataTable — AC1.5 persistence', () => {
  it('persists order to localStorage under bjui.datatable.<tableId>.columnOrder', () => {
    renderTable();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual([
      'price', 'name', 'brand', 'color', 'notes',
    ]);
  });

  it('restores persisted order on mount', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['notes', 'name', 'price', 'brand', 'color']));
    renderTable();
    expect(headerOrder()).toEqual(['Notes', 'Name', 'Price', 'Brand', 'Color']);
  });

  it('Reset clears the persisted order', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['notes', 'name', 'price', 'brand', 'color']));
    renderTable();
    await user.click(screen.getByRole('button', { name: 'Reset columns' }));
    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored === null || JSON.parse(stored).join() === 'name,price,brand,color,notes').toBe(true);
  });

  it('drops persisted ids that no longer exist', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['ghost', 'notes', 'name', 'price', 'brand', 'color']));
    renderTable();
    expect(headerOrder()).toEqual(['Notes', 'Name', 'Price', 'Brand', 'Color']);
  });

  it('appends new columns (not in the persisted order) in their default position', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['notes', 'name', 'price', 'brand']));
    renderTable(); // 'color' is new relative to storage; default index 3
    expect(headerOrder()).toEqual(['Notes', 'Name', 'Price', 'Color', 'Brand']);
  });

  it('ignores malformed stored JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    renderTable();
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
  });

  it('survives localStorage.getItem throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    renderTable();
    expect(headerOrder()).toEqual(DEFAULT_ORDER);
  });

  it('survives localStorage.setItem throwing and still reorders in memory', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    renderTable();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(headerOrder()).toEqual(['Price', 'Name', 'Brand', 'Color', 'Notes']);
  });

  it('is SSR-safe: renderToString works and never touches localStorage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const html = renderToString(
      <DataTable<Spool> tableId="spools" columns={COLUMNS} rows={ROWS} getRowId={(r) => r.id} />,
    );
    expect(html).toContain('<table');
    expect(getItem).not.toHaveBeenCalled();
  });
});

// ─── AC1.6a excluded filter ──────────────────────────────────────────────────

describe('DataTable — AC1.6a excluded filter', () => {
  const isRowExcluded = (r: Spool) => r.id === 'b' || r.id === 'd';

  it('renders an unchecked "Show excluded (N)" checkbox when any row is excluded', () => {
    renderTable({ isRowExcluded });
    const cb = screen.getByRole('checkbox', { name: 'Show excluded (2)' });
    expect(cb).not.toBeChecked();
  });

  it('hides excluded rows while unchecked', () => {
    renderTable({ isRowExcluded });
    expect(rowIds()).toEqual(['a', 'c']);
  });

  it('shows excluded rows with data-excluded="true" and a neutral badge when checked', async () => {
    const user = userEvent.setup();
    renderTable({ isRowExcluded });
    await user.click(screen.getByRole('checkbox', { name: 'Show excluded (2)' }));
    expect(rowIds()).toEqual(['a', 'b', 'c', 'd']);

    const excluded = dataRows().filter((tr) => tr.getAttribute('data-excluded') === 'true');
    expect(excluded.map((tr) => tr.getAttribute('data-row-id'))).toEqual(['b', 'd']);
    for (const tr of excluded) {
      const badge = within(tr).getByRole('status', { name: 'Excluded' });
      expect(badge).toHaveTextContent('Excluded');
      expect(badge).toHaveClass('bg-primary-700', 'text-neutral-400');
    }
    // Non-excluded rows carry no marker and no badge.
    const included = dataRows().filter((tr) => !tr.hasAttribute('data-excluded'));
    expect(included).toHaveLength(2);
    for (const tr of included) expect(within(tr).queryByRole('status')).not.toBeInTheDocument();
  });

  it('excluded rows get reduced emphasis via a token text class', async () => {
    const user = userEvent.setup();
    renderTable({ isRowExcluded });
    await user.click(screen.getByRole('checkbox'));
    const excluded = table().querySelector('tr[data-excluded="true"]')!;
    expect(excluded.className).toMatch(/\btext-neutral-\d{3}\b/);
  });

  it('uses excludedLabel for the badge', async () => {
    const user = userEvent.setup();
    renderTable({ isRowExcluded, excludedLabel: 'Archived' });
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getAllByRole('status', { name: 'Archived' })).toHaveLength(2);
  });

  it('count stays visible after checking', async () => {
    const user = userEvent.setup();
    renderTable({ isRowExcluded });
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox', { name: 'Show excluded (2)' })).toBeChecked();
  });

  it('no checkbox when no row is excluded', () => {
    renderTable({ isRowExcluded: () => false });
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(rowIds()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('no checkbox when isRowExcluded is not given', () => {
    renderTable();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('when every row is excluded the count is still visible and the empty message shows', () => {
    renderTable({ isRowExcluded: () => true, emptyMessage: 'Nothing to show' });
    expect(screen.getByRole('checkbox', { name: 'Show excluded (4)' })).toBeInTheDocument();
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
    expect(dataRows()).toHaveLength(0);
  });
});

// ─── Exports ─────────────────────────────────────────────────────────────────

describe('DataTable — public exports', () => {
  it('is exported from the package entry point', async () => {
    const mod = await import('../index');
    expect(mod.DataTable).toBe(DataTable);
  });
});
