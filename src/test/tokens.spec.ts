/**
 * Token snapshot + contrast assertions for bjui v2 (BMJ Strategies rebrand)
 *
 * AC-1: exported palette matches design-system-v2.md §3 spec
 * AC-7: programmatic contrast assertions for the 4 key pairings
 */

import { describe, it, expect } from 'vitest';
import { colors } from '../tailwind/tokens/colors';
import { fontFamily } from '../tailwind/tokens/typography';

// ── Contrast ratio utility ────────────────────────────────────────────────────

function hexToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * hexToLinear(r) + 0.7152 * hexToLinear(g) + 0.0722 * hexToLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Color token snapshot ─────────────────────────────────────────────────────

describe('Color tokens — Primary (Navy)', () => {
  const expected: Record<string, string> = {
    '50':  '#e8f0f7',
    '100': '#c3d4ea',
    '200': '#8aaad4',
    '300': '#5a7db5',
    '400': '#3d5f96',
    '500': '#2d4875',
    '600': '#243a5e',
    '700': '#1c2e4a',
    '800': '#132035',
    '900': '#0d1624',
    '950': '#080f1a',
  };
  for (const [step, hex] of Object.entries(expected)) {
    it(`primary-${step} === ${hex}`, () => {
      expect(colors.primary[step as keyof typeof colors.primary]).toBe(hex);
    });
  }
});

describe('Color tokens — Accent (Copper)', () => {
  const expected: Record<string, string> = {
    '100': '#f8dcc8',
    '200': '#f0b080',
    '300': '#e8924e',
    '400': '#d97030',
    '500': '#c55e15',
    '600': '#a84c10',
    '700': '#8c3e0a',
  };
  for (const [step, hex] of Object.entries(expected)) {
    it(`accent-${step} === ${hex}`, () => {
      expect(colors.accent[step as keyof typeof colors.accent]).toBe(hex);
    });
  }
  it('accent does NOT have cyan/violet/emerald keys', () => {
    expect((colors.accent as Record<string, unknown>)['cyan']).toBeUndefined();
    expect((colors.accent as Record<string, unknown>)['violet']).toBeUndefined();
    expect((colors.accent as Record<string, unknown>)['emerald']).toBeUndefined();
  });
});

describe('Color tokens — Neutral (Cream/Slate)', () => {
  const expected: Record<string, string> = {
    '100': '#f5ede0',
    '200': '#ede0cc',
    '300': '#d4c4a8',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#080d18',
  };
  for (const [step, hex] of Object.entries(expected)) {
    it(`neutral-${step} === ${hex}`, () => {
      expect(colors.neutral[step as keyof typeof colors.neutral]).toBe(hex);
    });
  }
});

describe('Color tokens — Status (updated BMJ spec values)', () => {
  it('success-400 === #5BA86F', () => expect(colors.success[400]).toBe('#5BA86F'));
  it('success-500 === #3F8754', () => expect(colors.success[500]).toBe('#3F8754'));
  it('warning-400 === #D6A24A', () => expect(colors.warning[400]).toBe('#D6A24A'));
  it('error-400 === #C9554A',   () => expect(colors.error[400]).toBe('#C9554A'));
  it('info-400 === #5378A8',    () => expect(colors.info[400]).toBe('#5378A8'));
});

// ── Typography token snapshot ─────────────────────────────────────────────────

describe('Typography tokens', () => {
  it('font-sans starts with Outfit', () => {
    expect(fontFamily.sans[0]).toBe('Outfit');
  });
  it('font-ui starts with Outfit', () => {
    expect(fontFamily.ui[0]).toBe('Outfit');
  });
  it('font-display starts with DM Serif Display', () => {
    expect(fontFamily.display[0]).toBe('"DM Serif Display"');
  });
  it('font-mono starts with JetBrains Mono', () => {
    expect(fontFamily.mono[0]).toBe('JetBrains Mono');
  });
  it('font-sans does NOT include Inter', () => {
    expect(fontFamily.sans.join(',')).not.toContain('Inter');
  });
});

// ── Contrast assertions (AC-7) ────────────────────────────────────────────────
// All four key pairings from design-system-v2.md §7 must meet WCAG 2.1 AA (≥4.5:1)

describe('Contrast ratios — dark theme', () => {
  it('neutral-100 (#f5ede0) on primary-950 (#080f1a) — target ~15.8:1, must be ≥ 7:1 (AAA)', () => {
    const ratio = contrastRatio('#f5ede0', '#080f1a');
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  it('neutral-400 (#94a3b8) on primary-950 (#080f1a) — target ~6.1:1, must be ≥ 4.5:1 (AA)', () => {
    const ratio = contrastRatio('#94a3b8', '#080f1a');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('accent-500 (#c55e15) on primary-950 (#080f1a) — must be ≥ 4.5:1 (AA) — R4 CLOSED', () => {
    const ratio = contrastRatio('#c55e15', '#080f1a');
    // R4 resolved: accent-500 lightened from #c45c14 to #c55e15 — confirmed 4.56:1, strict AA.
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('accent-400 (#d97030) on primary-950 (#080f1a) — target ~6.5:1, must be ≥ 4.5:1 (AA)', () => {
    const ratio = contrastRatio('#d97030', '#080f1a');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
