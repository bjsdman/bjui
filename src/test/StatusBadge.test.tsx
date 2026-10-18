/**
 * StatusBadge — status (legacy) lock + tone (new) behaviour.
 *
 * The "status output is unchanged" block captures the exact markup rendered by
 * v1.0.10 for each status, so widening the API with `tone` cannot silently alter
 * what existing callers (ServiceCard, Footer, consumer apps) render.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatusBadge } from '../components/StatusBadge';
import type { StatusTone } from '../index';

// Captured from v1.0.10 (main @ 5b11856) — do not edit to make a test pass.
const V1_0_10_MARKUP = {
  online:
    '<span role="status" aria-label="Service status: online" style="background-color: rgba(91, 168, 111, 0.12);" class="inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase text-success-500 text-xs px-2 py-1"><span class="relative inline-flex items-center justify-center"><span class="rounded-full bg-success-400 w-2 h-2"></span><span class="absolute rounded-full animate-ping opacity-75 bg-success-400 w-2 h-2"></span></span><span>ONLINE</span></span>',
  offline:
    '<span role="status" aria-label="Service status: offline" style="background-color: rgba(201, 85, 74, 0.12);" class="inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase text-error-500 text-xs px-2 py-1"><span class="relative inline-flex items-center justify-center"><span class="rounded-full bg-error-400 w-2 h-2"></span></span><span>OFFLINE</span></span>',
  degraded:
    '<span role="status" aria-label="Service status: degraded" style="background-color: rgba(214, 162, 74, 0.12);" class="inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase text-warning-500 text-xs px-2 py-1"><span class="relative inline-flex items-center justify-center"><span class="rounded-full bg-warning-400 w-2 h-2"></span></span><span>DEGRADED</span></span>',
  unknown:
    '<span role="status" aria-label="Service status: unknown" style="background-color: rgba(83, 120, 168, 0.12);" class="inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase text-info-500 text-xs px-2 py-1"><span class="relative inline-flex items-center justify-center"><span class="rounded-full bg-info-400 w-2 h-2"></span></span><span>UNKNOWN</span></span>',
} as const;

describe('StatusBadge — status output is unchanged (v1.0.10 lock)', () => {
  for (const status of ['online', 'offline', 'degraded', 'unknown'] as const) {
    it(`status="${status}" renders byte-for-byte identical markup`, () => {
      const { container } = render(<StatusBadge status={status} />);
      expect(container.innerHTML).toBe(V1_0_10_MARKUP[status]);
    });
  }

  it('custom label keeps the "Service status:" aria-label prefix', () => {
    render(<StatusBadge status="offline" label="DOWN" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Service status: down');
  });

  it('online still pulses by default; pulse={false} disables it', () => {
    const { container, rerender } = render(<StatusBadge status="online" />);
    expect(container.querySelector('.animate-ping')).toBeInTheDocument();
    rerender(<StatusBadge status="online" pulse={false} />);
    expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
  });

  it('size classes are unchanged', () => {
    const { container, rerender } = render(<StatusBadge status="online" size="sm" />);
    expect(container.firstElementChild).toHaveClass('text-[11px]', 'px-1.5', 'py-0.5');
    rerender(<StatusBadge status="online" size="lg" />);
    expect(container.firstElementChild).toHaveClass('text-sm', 'px-3', 'py-1.5');
  });
});

describe('StatusBadge — tone', () => {
  const coloured: Array<[StatusTone, string, string]> = [
    ['success', 'text-success-500', 'bg-success-400'],
    ['warning', 'text-warning-500', 'bg-warning-400'],
    ['error', 'text-error-500', 'bg-error-400'],
    ['info', 'text-info-500', 'bg-info-400'],
  ];

  for (const [tone, textClass, dotClass] of coloured) {
    it(`tone="${tone}" uses the ${tone} token classes`, () => {
      const { container } = render(<StatusBadge tone={tone} label="Thing" />);
      const badge = container.firstElementChild as HTMLElement;
      expect(badge).toHaveClass(textClass);
      expect(container.querySelector(`.${dotClass}`)).toBeInTheDocument();
    });
  }

  it('tone="neutral" uses primary-700 bg and neutral-400 text (design-system §5.5)', () => {
    const { container } = render(<StatusBadge tone="neutral" label="Excluded" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge).toHaveClass('bg-primary-700', 'text-neutral-400');
    expect(badge.getAttribute('style') ?? '').not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it('aria-label is the label itself, not "Service status: ..."', () => {
    render(<StatusBadge tone="neutral" label="Excluded" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Excluded');
    expect(screen.getByText('Excluded')).toBeInTheDocument();
  });

  it('default label is the tone in upper case', () => {
    render(<StatusBadge tone="warning" />);
    expect(screen.getByText('WARNING')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'WARNING');
  });

  it('does not pulse by default, even for success', () => {
    const { container } = render(<StatusBadge tone="success" label="Done" />);
    expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
  });

  it('pulse={true} still opts in', () => {
    const { container } = render(<StatusBadge tone="info" label="Syncing" pulse />);
    expect(container.querySelector('.animate-ping')).toBeInTheDocument();
  });

  it('tone overrides status colours when both are given', () => {
    const { container } = render(<StatusBadge status="online" tone="error" label="Mismatch" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge).toHaveClass('text-error-500');
    expect(badge).not.toHaveClass('text-success-500');
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Mismatch');
  });

  it('with neither status nor tone it falls back to the unknown status rendering', () => {
    const { container } = render(<StatusBadge />);
    expect(container.innerHTML).toBe(V1_0_10_MARKUP.unknown);
  });
});
