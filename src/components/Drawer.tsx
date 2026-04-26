/**
 * Drawer — reusable right-side panel primitive
 *
 * Provides the overlay + panel shell with:
 *  - slide-in animation (right edge)
 *  - focus trap (keyboard navigation confined to drawer while open)
 *  - Escape key to close
 *  - body scroll lock while open
 *  - aria: role="dialog" aria-modal="true"
 *  - overlay click to close; panel click does not propagate to overlay
 *
 * Usage:
 *   <Drawer
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     title="Queue"
 *     titleId="my-drawer-title"
 *     triggerRef={triggerButtonRef}
 *   >
 *     {children}
 *   </Drawer>
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Used for aria-labelledby. Must be unique on the page. */
  titleId: string;
  children: React.ReactNode;
  /** Ref to the element that triggered the drawer — focus returns here on close. */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

// Selectors for focusable elements (standard ARIA spec list)
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function Drawer({ open, onClose, title, titleId, children, triggerRef }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── Focus management ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      // Move focus to close button on open
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      // Return focus to trigger element on close
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    }
  }, [open, triggerRef]);

  // ── Focus trap ─────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
        ).filter((el) => el.offsetParent !== null); // skip hidden elements

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [open, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'fixed right-0 top-0 z-50 h-full w-full max-w-md',
          'bg-neutral-900 border-l border-neutral-700',
          'flex flex-col',
          'translate-x-0 transition-transform duration-200 ease-out',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-700 flex-shrink-0">
          <h2
            id={titleId}
            className="text-sm font-semibold text-neutral-100 font-mono"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close activity queue"
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Panel body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
