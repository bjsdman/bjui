# bjui

Shared UI component library for the bjsdman homelab suite. Published as `@bjsdman/bjui`.

---

## Purpose

Single source of truth for all UI components, design tokens, and layout patterns used across `bjhomesite` and `bjlandingpage`. Per-project component drift is not permitted — if something needs to change visually, it changes here first.

---

## Stack

- React + TypeScript
- Tailwind CSS (config in `src/tailwind/`)
- Peer dependencies: `react`, `react-dom`
- Published via GitHub Packages (GHCR / npm registry per `.npmrc`)

---

## Components

```
src/components/
  Header.tsx
  Footer.tsx
  PageLayout.tsx
  ServiceCard.tsx
  StatusBadge.tsx  — service status pill; optional `tone` (success | warning | error | info | neutral) for non-status uses
  Drawer.tsx       — right-side modal panel: focus in/out, Tab trap, Escape/overlay close, scroll lock
  DataTable.tsx    — sortable, expandable, column-reorderable table (keyboard + drag), excluded-row filter
src/
  index.ts      — public exports (everything consumed by other repos comes from here)
  tailwind/     — shared Tailwind config/preset and tokens.css
  test/         — vitest + Testing Library component tests (one file per component)
```

**DataTable notes.** Column order persists in `localStorage` under
`bjui.datatable.<tableId>.columnOrder`, so `tableId` must be stable and unique per
page. Storage is read after mount (SSR-safe) and every storage call is guarded.
Reordering has a keyboard path ("Move column" handle, ArrowLeft/ArrowRight,
announced in a polite live region) to meet WCAG 2.2 SC 2.5.7 Dragging Movements;
never ship a drag-only interaction.

---

## Scripts

```bash
npm run dev        # watch mode build
npm run build      # production build
npm run lint       # eslint
npm run type-check # tsc --noEmit
npm test           # vitest (CI also runs the test-gate on agent PRs)
```

---

## Design System

The authoritative design spec lives at `docs/design-system.md` (authored by Yuri). It defines:
- Design tokens (colors, typography, spacing, radius, shadow)
- Component variants and states
- Layout patterns
- Accessibility requirements

**Before adding or modifying any component:** read `docs/design-system.md`. Tokens are not to be hardcoded — use the defined CSS variables or Tailwind tokens.

---

## Publishing

This package is consumed by other repos as `@bjsdman/bjui`. Merge to `main` and `publish.yml` does the rest: patch bump, git tag `vX.Y.Z`, publish. **Do not bump `package.json` for a patch** and **do not push tags by hand** — tags are created only by the workflow.

- **Minor/major (manual bypass):** run `npm version minor --no-git-tag-version` (or `major`) and merge. The workflow sees the version changed, skips the auto-bump, and tags that version.
- **Docs-only** changes (`**.md`, `docs/**`, `site-assets/**`) do not cut a version.

Consumer repos pin a git tag (`github:bjsdman/bjui#vX.Y.Z`) and must move that pin to pick up changes.

---

## Key Rules

- All exports must go through `src/index.ts` — nothing is consumed by direct file import
- Components must be accessible (WCAG 2.2 AA) — Yuri reviews before merge
- Every component has tests in `src/test/`. A change under `src/components/`, `src/tailwind/` or `src/index.ts` needs a test change (CI test-gate; `tokens.css` counts as functional)
- No application logic here — pure UI primitives only
- Tailwind config changes affect all consumers — treat as breaking changes
