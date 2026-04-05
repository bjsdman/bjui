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
  StatusBadge.tsx
src/
  index.ts      — public exports (everything consumed by other repos comes from here)
  tailwind/     — shared Tailwind config/preset
```

---

## Scripts

```bash
npm run dev        # watch mode build
npm run build      # production build
npm run lint       # eslint
npm run type-check # tsc --noEmit
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

This package is consumed by other repos as `@bjsdman/bjui`. After any change:
1. Bump the version in `package.json`
2. Run `npm run build`
3. Commit and push — the GitHub Actions workflow handles publishing

Consumer repos (`bjhomesite`, `bjlandingpage`) must update their dependency version to pick up changes.

---

## Key Rules

- All exports must go through `src/index.ts` — nothing is consumed by direct file import
- Components must be accessible (WCAG 2.1 AA) — Yuri reviews before merge
- No application logic here — pure UI primitives only
- Tailwind config changes affect all consumers — treat as breaking changes
