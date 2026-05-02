# Visual Regression Testing — bjui v2

## Overview

Visual regression baselines guard against unintended visual changes to components. bjui uses Playwright for page-level baselines; component-level baselines are captured via the token snapshot tests in `src/test/tokens.spec.ts`.

## Baseline files

Component visual-regression baselines are stored alongside the test files (e.g. `src/test/__snapshots__/`). CI fails on > 0.5% pixel diff.

## When to update baselines

Baselines MUST be regenerated when:
- Intentional visual changes are made (e.g. token values change, component styles change)
- The rebrand is applied (first baseline after v2.0 ships is the canonical source)

Baselines must NOT be auto-regenerated on CI — only regenerate manually and commit the result.

## How to regenerate

```bash
# From the bjui repo root:
npx playwright test --update-snapshots
git add src/test/__snapshots__/
git commit -m "test: update visual-regression baselines [describe why]"
```

## Components covered (v2.0 — dark theme only)

1. Header (default nav, with items, mobile state)
2. Footer (with links, with logo)
3. PageLayout (wraps both)
4. ServiceCard (online/offline/degraded/unknown states)
5. StatusBadge (all 4 states × 3 sizes)
6. Drawer (open state)

Light-mode baselines are deferred to v2.1 (dark-only in v2.0).

## Notes

- v0.1 baselines are intentionally invalid after the rebrand — they were reset as part of v2.0
- The new baselines are the canonical source of truth for BMJ Strategies visual identity
- If a token change would cause > 0.5% diff, that is the correct CI behaviour — update intentionally, not automatically
