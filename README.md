# bjui

Shared React UI component library and design tokens for the bjsdman homelab suite, published as `@bjsdman/bjui`. It is the single source of visual truth for [bjhomesite](https://github.com/bjsdman/bjhomesite) and [bjlandingpage](https://github.com/bjsdman/bjlandingpage). Visual changes land here first and reach the apps through a version bump.

## What's in it

| Export | Purpose |
|--------|---------|
| `Header`, `Footer`, `PageLayout` | Page shell and navigation |
| `ServiceCard`, `StatusBadge` | Service tiles and up/down/degraded status |
| `Drawer` | Slide-in panel |
| `@bjsdman/bjui/tailwind/preset` | Tailwind preset (colors, typography, shadows, animations) |
| `@bjsdman/bjui/tokens.css` | CSS custom properties (`--color-primary-*`, `--color-accent-*`, …) |

Everything public is exported from `src/index.ts`. Consumers never import component files directly.

## Install

Consumers currently pin a git tag:

```json
"@bjsdman/bjui": "github:bjsdman/bjui#v1.0.4"
```

The package is also published to GitHub Packages (`.npmrc` scopes `@bjsdman` to `npm.pkg.github.com` and needs `NODE_AUTH_TOKEN`).

```tsx
import { PageLayout, ServiceCard } from '@bjsdman/bjui';
import '@bjsdman/bjui/tokens.css';
```

Peer dependencies: `react` and `react-dom` ^19.

## Development

```bash
npm install
npm run dev         # tsup watch build
npm run build       # ESM + CJS + .d.ts into dist/
npm run lint
npm run type-check
npm test            # vitest (components + token snapshots)
```

## Design system

- Token values live in `src/tailwind/tokens.css` and `src/tailwind/tokens/*.ts`. Never hardcode colors or spacing in components.
- Component spec: [`docs/design-system.md`](docs/design-system.md)
- Visual regression: [`docs/visual-regression.md`](docs/visual-regression.md)
- Components target WCAG 2.1 AA.

## Release

| Event | Workflow | Result |
|-------|----------|--------|
| PR to `main` | `ci.yml` | lint, type-check, test, build |
| Push to `main` | `publish.yml` | auto patch bump → tag `vX.Y.Z` → publish to GitHub Packages → Mattermost notice |
| Push to `main` that already changed `version` | `publish.yml` | no bump; tag that version → publish (use for minor/major) |
| Push touching only `**.md`, `docs/**`, `site-assets/**` | — | nothing; no version cut |

Every published version has a matching tag; tags are created only by the workflow, never by hand.

Tailwind preset and token changes affect every consumer, so treat them as breaking.
