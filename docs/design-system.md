# bjui Design System
**Version:** 0.1.0-draft  
**Date:** 2026-04-03  
**Author:** Yuri (UI/UX Designer)  
**Status:** Draft — held for bjui repo creation by Jimmy

---

## Overview

This document is the authoritative design system spec for all UI products in the bjsdman homelab suite. It governs:
- **bjui** — shared component library (`@bjsdman/bjui`)
- **bjhomesite** — internal homelab dashboard
- **bjlandingpage** — public-facing landing page

Visual identity, token values, component behavior, and page layouts defined here are locked once established. Per-project drift is not permitted. Changes go through a design system update — not a one-off override.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Brand / Primary
| Token | Hex | Usage |
|---|---|---|
| `color-primary-50` | `#eef2ff` | Light backgrounds, hover states |
| `color-primary-100` | `#e0e7ff` | Subtle fills, selected state bg |
| `color-primary-200` | `#c7d2fe` | Borders, dividers on light bg |
| `color-primary-300` | `#a5b4fc` | Inactive icons, secondary labels |
| `color-primary-400` | `#818cf8` | Hover on interactive elements |
| `color-primary-500` | `#6366f1` | **Primary brand color** — buttons, links, focus rings |
| `color-primary-600` | `#4f46e5` | Pressed/active state |
| `color-primary-700` | `#4338ca` | Dark backgrounds, nav active |
| `color-primary-800` | `#3730a3` | Deep brand, footer accents |
| `color-primary-900` | `#312e81` | High-contrast dark brand |
| `color-primary-950` | `#1e1b4b` | Near-black brand, dark theme bg |

#### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `color-neutral-0` | `#ffffff` | White — light surfaces |
| `color-neutral-50` | `#f8fafc` | App background (light mode) |
| `color-neutral-100` | `#f1f5f9` | Card backgrounds (light) |
| `color-neutral-200` | `#e2e8f0` | Borders, dividers |
| `color-neutral-300` | `#cbd5e1` | Disabled borders |
| `color-neutral-400` | `#94a3b8` | Placeholder text, disabled icons |
| `color-neutral-500` | `#64748b` | Secondary text |
| `color-neutral-600` | `#475569` | Body text (light mode) |
| `color-neutral-700` | `#334155` | Headings (light mode) |
| `color-neutral-800` | `#1e293b` | Card bg (dark mode), strong text |
| `color-neutral-850` | `#172033` | Sidebar / panel bg (dark mode) |
| `color-neutral-900` | `#0f172a` | App background (dark mode) |
| `color-neutral-950` | `#080d18` | Deep dark — overlays, modals bg |

#### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `color-success-400` | `#4ade80` | Online status, success states |
| `color-success-500` | `#22c55e` | Success button, success text dark |
| `color-success-900` | `#14532d` | Success bg (dark mode) |
| `color-warning-400` | `#facc15` | Degraded status, warnings |
| `color-warning-500` | `#eab308` | Warning icon, warning text |
| `color-warning-900` | `#713f12` | Warning bg (dark mode) |
| `color-error-400` | `#f87171` | Offline status, error states |
| `color-error-500` | `#ef4444` | Error text, destructive actions |
| `color-error-900` | `#7f1d1d` | Error bg (dark mode) |
| `color-info-400` | `#60a5fa` | Unknown/checking status, info |
| `color-info-500` | `#3b82f6` | Info text, neutral badges |
| `color-info-900` | `#1e3a5f` | Info bg (dark mode) |

#### Accent / Monospace Highlight
| Token | Hex | Usage |
|---|---|---|
| `color-accent-cyan` | `#22d3ee` | Metric values, code, terminal output |
| `color-accent-violet` | `#a78bfa` | Hover accents, decorative highlights |
| `color-accent-emerald` | `#34d399` | Positive delta indicators |

---

### 1.2 Typography

#### Font Families
```
font-sans:   "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif
font-mono:   "JetBrains Mono", "Fira Code", ui-monospace, "Cascadia Code", monospace
```
- **Inter** — primary UI font. Used for all headings, body, labels, buttons.
- **JetBrains Mono** — used for status values, metrics, IP addresses, service URLs, code blocks, terminal output. This is the homelab accent — lean into it.

#### Type Scale
| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-xs` | 12px / 0.75rem | 1rem | 400 | Labels, captions, badge text |
| `text-sm` | 14px / 0.875rem | 1.25rem | 400 | Secondary text, table cells, descriptions |
| `text-base` | 16px / 1rem | 1.5rem | 400 | Body text, default |
| `text-lg` | 18px / 1.125rem | 1.75rem | 500 | Card titles, section subheads |
| `text-xl` | 20px / 1.25rem | 1.75rem | 600 | Component headings |
| `text-2xl` | 24px / 1.5rem | 2rem | 600 | Page section titles |
| `text-3xl` | 30px / 1.875rem | 2.25rem | 700 | Page headings |
| `text-4xl` | 36px / 2.25rem | 2.5rem | 700 | Hero headings (landing page) |
| `text-5xl` | 48px / 3rem | 1 | 800 | Display / hero (landing page only) |

#### Font Weights
| Token | Value | Usage |
|---|---|---|
| `font-normal` | 400 | Body, descriptions |
| `font-medium` | 500 | Labels, nav items, UI elements |
| `font-semibold` | 600 | Headings, card titles, buttons |
| `font-bold` | 700 | Page titles, strong emphasis |
| `font-extrabold` | 800 | Display/hero only |

#### Monospace Usage Rules
Use `font-mono` for:
- IP addresses, ports, hostnames
- Service URLs
- Status metrics (uptime %, response time ms)
- Version numbers
- All `<code>` and `<pre>` blocks
- StatusBadge text

---

### 1.3 Spacing Scale

Base unit: 4px (0.25rem)

| Token | px | rem | Usage |
|---|---|---|---|
| `spacing-0` | 0 | 0 | — |
| `spacing-0.5` | 2px | 0.125rem | Hairline gaps |
| `spacing-1` | 4px | 0.25rem | Icon internal padding |
| `spacing-1.5` | 6px | 0.375rem | Compact badge padding |
| `spacing-2` | 8px | 0.5rem | Tight internal padding |
| `spacing-3` | 12px | 0.75rem | Standard compact padding |
| `spacing-4` | 16px | 1rem | Default element padding |
| `spacing-5` | 20px | 1.25rem | Form field padding |
| `spacing-6` | 24px | 1.5rem | Card internal padding |
| `spacing-8` | 32px | 2rem | Section padding, card gaps |
| `spacing-10` | 40px | 2.5rem | Large section gaps |
| `spacing-12` | 48px | 3rem | Header height, hero padding |
| `spacing-16` | 64px | 4rem | Page section separation |
| `spacing-20` | 80px | 5rem | Hero vertical padding |
| `spacing-24` | 96px | 6rem | Large hero separation |

Grid gutter: `spacing-6` (24px) desktop, `spacing-4` (16px) mobile.  
Page max-width: `1280px` (container-xl). Side padding: `spacing-6` desktop, `spacing-4` mobile.

---

### 1.4 Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-none` | 0 | — |
| `rounded-sm` | 2px | Subtle rounding, table cells |
| `rounded` | 4px | Badges, tags, small elements |
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards, panels |
| `rounded-xl` | 12px | Modal containers, large cards |
| `rounded-2xl` | 16px | Hero containers |
| `rounded-full` | 9999px | Status dot, avatar |

Cards use `rounded-lg` (8px). Buttons use `rounded-md` (6px). Status dot uses `rounded-full`.

---

### 1.5 Shadow Levels
| Token | Value | Usage |
|---|---|---|
| `shadow-none` | none | Flat elements |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle card lift |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Default card |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)` | Hover card state |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, dropdowns |
| `shadow-glow-primary` | `0 0 0 3px rgba(99,102,241,0.3)` | Focus ring |
| `shadow-glow-success` | `0 0 8px rgba(34,197,94,0.4)` | Online service card accent |

Dark mode: reduce shadow opacity by 50%, rely more on border-based definition.

---

### 1.6 Z-Index Scale
| Token | Value | Usage |
|---|---|---|
| `z-0` | 0 | Base |
| `z-10` | 10 | Cards, interactive elements |
| `z-20` | 20 | Dropdowns, tooltips |
| `z-30` | 30 | Fixed nav, sticky header |
| `z-40` | 40 | Modal overlay |
| `z-50` | 50 | Modal content, toast notifications |

---

## 2. Component Specs

### 2.1 Header

**Purpose:** Site-wide top navigation bar. Present on all pages of both bjhomesite and bjlandingpage. Responsive.

#### Structure
```
[Logo/Wordmark]   [Nav Links]   [Right Actions: theme toggle, profile/status]
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `siteName` | `string` | required | Displayed wordmark text |
| `logoIcon` | `ReactNode` | optional | SVG icon left of wordmark |
| `navItems` | `NavItem[]` | `[]` | Navigation links |
| `rightSlot` | `ReactNode` | optional | Right side actions slot |
| `sticky` | `boolean` | `true` | Whether header is position:sticky |
| `transparent` | `boolean` | `false` | Transparent bg for hero overlay |

#### NavItem type
```ts
type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
}
```

#### Visual Spec
- **Height:** 64px (spacing-16) desktop, 56px mobile
- **Background:** `color-neutral-900` dark / `color-neutral-0` light — never transparent unless `transparent=true`
- **Border bottom:** 1px `color-neutral-800` (dark) / `color-neutral-200` (light)
- **Logo:** `font-mono`, `font-semibold`, `text-lg`, `color-primary-400` — monospace wordmark reinforces homelab identity
- **Nav links:** `text-sm`, `font-medium`, `color-neutral-400` default, `color-primary-400` active, `color-neutral-200` hover
- **Active indicator:** 2px bottom border `color-primary-500` on active nav item
- **Right slot:** icon buttons, 36x36px hit target, `rounded-md`
- **Mobile:** hamburger menu at `<768px`, nav collapses to drawer/dropdown

#### States
- Default, hover (link), active (current page), focus (keyboard — `shadow-glow-primary`)
- Sticky: adds `shadow-sm` when scrolled past 8px

#### Accessibility
- `<header>` landmark role
- `<nav>` with `aria-label="Main navigation"`
- Active item has `aria-current="page"`
- Mobile menu button: `aria-expanded`, `aria-controls`

---

### 2.2 Footer

**Purpose:** Minimal bottom footer. Present on all pages. Functional, not decorative.

#### Structure
```
[Left: copyright + site name]   [Center: links]   [Right: cluster status indicator]
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `siteName` | `string` | required | — |
| `links` | `FooterLink[]` | `[]` | Link groups |
| `clusterStatus` | `'online' \| 'degraded' \| 'offline' \| 'unknown'` | optional | Drives right-side StatusBadge |
| `year` | `number` | current year | Copyright year |

#### Visual Spec
- **Height:** auto, min 56px
- **Background:** `color-neutral-950` dark / `color-neutral-100` light
- **Top border:** 1px `color-neutral-800` (dark) / `color-neutral-200` (light)
- **Text:** `text-xs`, `color-neutral-500`
- **Links:** `color-neutral-400` hover `color-primary-400`, no underline
- **Cluster status:** `StatusBadge` size=`sm`, label="Cluster", right-aligned. Font: `font-mono`.
- **Padding:** `spacing-6` vertical, `spacing-8` horizontal

#### Accessibility
- `<footer>` landmark
- Links have descriptive text (no "click here")

---

### 2.3 PageLayout

**Purpose:** Wraps every page. Composes Header + Footer + main content area. Handles consistent page structure.

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Main content |
| `header` | `HeaderProps` | required | Passed through to Header |
| `footer` | `FooterProps` | optional | Passed through to Footer |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Content max-width |
| `padded` | `boolean` | `true` | Whether to apply horizontal page padding |
| `className` | `string` | optional | Additional class on main |

#### Max-width values
| Value | CSS | px |
|---|---|---|
| `sm` | `max-w-2xl` | 672px |
| `md` | `max-w-4xl` | 896px |
| `lg` | `max-w-5xl` | 1024px |
| `xl` | `max-w-7xl` | 1280px |
| `full` | `max-w-full` | 100% |

#### Visual Spec
- **Layout:** flex-col, min-h-screen. Main grows to fill (`flex-1`).
- **Background:** `color-neutral-900` (dark default)
- **Main padding:** `spacing-8` top, `spacing-6` horizontal (desktop), `spacing-4` (mobile)
- **Subtle texture option:** a 1px dot-grid pattern using `background-image` SVG at 5% opacity — optional, off by default, enabled via `texture` prop

---

### 2.4 ServiceCard

**Purpose:** Displays a single homelab service in the dashboard grid. The primary data display unit of bjhomesite.

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | required | Service display name |
| `description` | `string` | optional | Short description |
| `url` | `string` | optional | Service URL (clickable) |
| `status` | `StatusValue` | `'unknown'` | Current status — drives StatusBadge |
| `icon` | `ReactNode` | optional | Service icon (SVG, 24x24) |
| `category` | `string` | optional | Tag label (e.g. "Media", "Monitoring") |
| `responseTime` | `number` | optional | Response time in ms |
| `uptime` | `number` | optional | Uptime % (0–100) |
| `lastChecked` | `Date` | optional | Last health-check timestamp |
| `onClick` | `() => void` | optional | Card click handler |
| `href` | `string` | optional | Wraps card in link if provided |

#### Visual Spec
- **Size:** flexible width (fits grid), min-height 140px
- **Background:** `color-neutral-800` (dark) / `color-neutral-100` (light)
- **Border:** 1px `color-neutral-700` default; `color-primary-700` on hover; `color-success-900` tint when status=online
- **Border radius:** `rounded-lg` (8px)
- **Shadow:** `shadow-sm` default, `shadow-md` on hover
- **Hover:** border color shift, `shadow-md`, translate-y -1px (subtle lift)
- **Padding:** `spacing-6` (24px) all sides
- **Transition:** 150ms ease-out on border, shadow, transform

#### Internal layout
```
┌─────────────────────────────────────────┐
│  [Icon 32px]  [Name text-lg semibold]   │
│               [Category tag text-xs]    │
│                                         │
│  [Description text-sm neutral-400]      │
│                                         │
│  ─────────────────────────────────────  │
│  [StatusBadge]   [Response: 42ms mono]  │
│  [URL text-xs mono neutral-400]         │
└─────────────────────────────────────────┘
```

- **Name:** `text-lg`, `font-semibold`, `color-neutral-100`
- **Description:** `text-sm`, `color-neutral-400`, max 2 lines (line-clamp-2)
- **URL:** `text-xs`, `font-mono`, `color-neutral-500` — shown below status row, truncated
- **Response time:** `text-xs`, `font-mono`, `color-accent-cyan`, right-aligned in status row
- **Category tag:** `text-xs`, `font-medium`, `bg-neutral-700`, `color-neutral-300`, `rounded`, `px-2 py-0.5`
- **Icon area:** 32x32px, `color-primary-400` default (passes through SVG currentColor)
- **Divider:** 1px `color-neutral-700/50`

#### States
- Default
- Hover (lift, border change)
- Loading (skeleton — pulsing bg on all content areas)
- Clicked / active (scale 0.99, instant)

#### Accessibility
- If `href` or `onClick`: wrap in `<a>` or `<button>` with full card as hit target
- `aria-label` = `"${name} — ${status}"` if no description
- Status conveyed via both color and text (not color-only)

---

### 2.5 StatusBadge

**Purpose:** Displays service health status. Used inside ServiceCard and Footer. Standalone-usable.

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `'online' \| 'offline' \| 'degraded' \| 'unknown'` | required | Status state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `showLabel` | `boolean` | `true` | Show/hide text label |
| `showDot` | `boolean` | `true` | Show/hide status dot |
| `label` | `string` | optional | Override default label text |
| `pulse` | `boolean` | auto | Pulse animation on online status |

#### Status values
| Status | Dot color | Background | Text color | Default label |
|---|---|---|---|---|
| `online` | `color-success-400` | `color-success-900/30` | `color-success-400` | `ONLINE` |
| `offline` | `color-error-400` | `color-error-900/30` | `color-error-400` | `OFFLINE` |
| `degraded` | `color-warning-400` | `color-warning-900/30` | `color-warning-400` | `DEGRADED` |
| `unknown` | `color-info-400` | `color-info-900/30` | `color-info-400` | `UNKNOWN` |

#### Size spec
| Size | Dot | Font | Padding | Height |
|---|---|---|---|---|
| `sm` | 6px | `text-xs` (11px) | `px-1.5 py-0.5` | 20px |
| `md` | 8px | `text-xs` (12px) | `px-2 py-1` | 24px |
| `lg` | 10px | `text-sm` (14px) | `px-3 py-1.5` | 32px |

#### Visual Spec
- **Font:** `font-mono`, `font-medium`, uppercase label text
- **Border radius:** `rounded` (4px) for badge bg, `rounded-full` for dot
- **Pulse animation:** online status only — dot pulses with `animate-ping` ring using `color-success-400/40`
- **Dot:** filled circle, left of label if `showLabel=true`

#### Accessibility
- `role="status"` on badge element
- `aria-label` = full status string (e.g. "Service status: online")
- Color is supplemented by text and shape — never color-only

---

## 3. Tailwind Preset Structure

The `@bjsdman/bjui` package exports a Tailwind CSS preset. Consuming apps extend it rather than redefining tokens.

### 3.1 Preset file structure in bjui repo
```
bjui/
  tailwind/
    preset.ts         ← main export
    tokens/
      colors.ts       ← all color token values
      typography.ts   ← font families, size scale
      spacing.ts      ← custom spacing extensions
      shadows.ts      ← custom shadow values
      animations.ts   ← custom keyframes + animations
```

### 3.2 preset.ts shape
```ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { colors } from './tokens/colors';
import { fontFamily, fontSize } from './tokens/typography';
import { boxShadow, keyframes, animation } from './tokens/shadows';

const preset: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      boxShadow,
      keyframes,
      animation,
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [typography],
};

export default preset;
```

### 3.3 How consuming apps use it
```ts
// bjhomesite/tailwind.config.ts
import bjuiPreset from '@bjsdman/bjui/tailwind/preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@bjsdman/bjui/src/**/*.{ts,tsx}', // ← scan bjui components
  ],
  presets: [bjuiPreset],
  theme: {
    extend: {
      // App-specific overrides only — not color/typography
    },
  },
};

export default config;
```

### 3.4 Dark mode strategy
- `darkMode: 'class'` — the `dark` class is toggled on `<html>` element
- All components use both light and dark variants: `bg-neutral-100 dark:bg-neutral-800`
- Default render target is dark mode (homelab context)
- bjlandingpage may default to light mode — both must work

---

## 4. Visual Direction

### 4.1 Aesthetic Statement

The bjsdman homelab UI is **technical, clean, and fast**. It looks like it was built by someone who runs servers for fun — not corporate SaaS. It respects the user's intelligence and screen space.

Concretely:
- **Dark by default.** The primary environment is a dashboard you look at for long sessions. Dark backgrounds, carefully chosen contrast ratios.
- **Monospace as accent.** `JetBrains Mono` appears for values that are "data" — IPs, uptime %, response times, URLs. This creates a clear visual language: "this is information, not UI copy."
- **Indigo-primary palette.** Not green-hacker, not blue-enterprise. Indigo sits at the intersection of technical and refined.
- **Minimal motion.** Transitions exist to orient, not entertain. 150ms ease-out. The pulse on the online status dot is the most animated thing on the page.
- **Grid structure over decoration.** Service cards in clean grids. No hero gradients on the dashboard. Save the subtle background texture (dot grid) for empty states only.
- **Status is the hero.** The most important information on the dashboard is whether services are up. StatusBadge is prominent, legible, and uses both color and text.
- **Borders define space.** Cards are defined by a 1px border and a slight shadow, not heavy backgrounds. This keeps the UI feeling lightweight even when dense.

### 4.2 What NOT to do
- No gradient blobs, glassmorphism, or heavy blur effects on the dashboard
- No full-bleed hero images on bjhomesite
- No rounded-2xl on cards (too bubbly)
- No bright white backgrounds on the dashboard
- No icon-only status (always pair with text label)
- No Comic Sans, system serif, or web fonts with licensing restrictions

### 4.3 Landing page exception
bjlandingpage is public-facing and can use more expressive visual elements:
- Light mode default with dark mode support
- Hero section may use a subtle gradient (indigo to slate, max 15% opacity overlay on dark bg)
- Larger type scale for marketing copy
- Still uses the same design tokens — no custom colors

---

## 5. Wireframe-Level Page Layouts

### 5.1 bjhomesite — Main Dashboard

**Route:** `/` (authenticated)  
**Grid:** 12-column, spacing-6 gap

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: [logo "homelab"] [Dashboard | Services | Admin] [...]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ STATUS SUMMARY BAR ────────────────────────────────────────┐ │
│  │  ● 12 Online   ⚠ 1 Degraded   ✕ 0 Offline   ? 2 Unknown   │ │
│  │  Last updated: 14s ago [font-mono text-xs]                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Category filter tabs: All | Media | Monitoring | Network | +] │
│                                                                   │
│  ┌─ SERVICE GRID (auto-fill, min 280px, gap-6) ────────────────┐ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │ ServiceCard │ │ ServiceCard │ │ ServiceCard │  ...       │ │
│  │  │             │ │             │ │             │            │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│  │  │ ServiceCard │ │ ServiceCard │ │ ServiceCard │  ...       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER: [© 2026 bjsdman]  [GitHub]  [Cluster: ● ONLINE]       │
└─────────────────────────────────────────────────────────────────┘
```

**Status Summary Bar:**
- Background: `color-neutral-800`, border `color-neutral-700`, `rounded-lg`, `px-6 py-3`
- Each counter: `font-mono text-sm` with status dot
- "Last updated" timestamp: `font-mono text-xs color-neutral-500`
- Auto-refreshes — timestamp updates in place

**Category Filter Tabs:**
- Horizontal scrollable on mobile
- Active tab: `color-primary-500` underline + text, bg: `color-neutral-800`
- Inactive: `color-neutral-400`
- "+" is an admin shortcut (add service) — only visible to authenticated admin

**Service Grid:**
- CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Desktop: typically 3–4 cards wide
- Tablet (768px): 2 columns
- Mobile (480px): 1 column

**Empty State (no services in category):**
- Centered text: "No services in this category"
- Subtle dot-grid background texture
- "Add Service" button if admin

---

### 5.2 bjhomesite — Admin UI

**Route:** `/admin` (no auth — accepted risk, documented in Rex's security review)  
**Layout:** Sidebar + main content

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
├──────────────────┬──────────────────────────────────────────────┤
│  SIDEBAR         │  MAIN CONTENT                                 │
│  (240px)         │                                               │
│  ┌────────────┐  │  ┌─ PAGE TITLE ───────────────────────────┐  │
│  │ ▸ Services │  │  │  Service Management                     │  │
│  │ ▸ Categor. │  │  └─────────────────────────────────────────┘  │
│  │ ▸ Settings │  │                                               │
│  │            │  │  [+ Add Service]  [Search: ________]         │
│  │            │  │                                               │
│  │            │  │  ┌─ SERVICE TABLE ─────────────────────────┐ │
│  │            │  │  │ Name     Status   URL        Category    │ │
│  │            │  │  │ ──────────────────────────────────────── │ │
│  │            │  │  │ Jellyfin ● ONLINE /jellyfin  Media  [✎][✕]│
│  │            │  │  │ Seerr    ● ONLINE /seerr     Media  [✎][✕]│
│  │            │  │  │ Grafana  ⚠ DEGRAD /grafana   Monitor[✎][✕]│
│  │            │  │  └─────────────────────────────────────────┘ │
│  └────────────┘  │                                               │
│                  │  ─── divider ───                              │
│                  │                                               │
│                  │  ┌─ ADD/EDIT SERVICE FORM ─────────────────┐ │
│                  │  │  Service Name: [________________]        │ │
│                  │  │  URL:          [________________]        │ │
│                  │  │  Description:  [________________]        │ │
│                  │  │  Category:     [dropdown ▼]              │ │
│                  │  │  Icon:         [file upload / URL]       │ │
│                  │  │                                           │ │
│                  │  │  ── Credentials (optional) ──            │ │
│                  │  │  Username:     [________________]        │ │
│                  │  │  Password:     [••••••••] [show]         │ │
│                  │  │  Notes:        [textarea]                │ │
│                  │  │                                           │ │
│                  │  │  [Cancel]  [Save Service]                │ │
│                  │  └─────────────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────────────┘
```

**Sidebar:**
- Width: 240px fixed desktop, collapsible on tablet, hidden (hamburger) on mobile
- Background: `color-neutral-850`
- Border right: 1px `color-neutral-700`
- Nav items: `text-sm font-medium`, left-padded `px-4 py-2`
- Active: `bg-neutral-800 color-primary-400 border-l-2 border-primary-500`

**Service Table:**
- `text-sm`, alternating row bg: transparent / `color-neutral-800/30`
- Status column: `StatusBadge` size=`sm`
- URL column: `font-mono text-xs color-neutral-400`
- Edit/delete actions: icon buttons, right-aligned

**Add/Edit Form:**
- Inline below table (slide-in or accordion on mobile)
- Or: modal on desktop — design decision deferred to Jimmy; both valid
- Credential fields: password field has show/hide toggle
- Form uses same spacing/input tokens as rest of system

**Credential Config Panel:**
- Displayed inline in the form when "has credentials" is checked
- Password stored encrypted (see Rex's review for encryption requirements)
- "View credential" action exists but is audit-logged (future phase)

---

### 5.3 bjlandingpage — Home / Landing Page

**Route:** `/`  
**Mode:** Light default (dark mode available)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: [logo] [About | Contact]  [→ Dashboard (internal)]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ HERO ─────────────────────────────────────────────────────┐ │
│  │                                                              │ │
│  │         Running my own internet.                            │ │
│  │         (text-5xl font-extrabold, max-w-3xl)               │ │
│  │                                                              │ │
│  │  Self-hosted infrastructure for media, monitoring,         │ │
│  │  and automation. Built on Kubernetes.                       │ │
│  │  (text-xl color-neutral-500, max-w-2xl)                    │ │
│  │                                                              │ │
│  │  [View Services →]  [About]                                │ │
│  │  (primary btn)      (ghost btn)                             │ │
│  │                                                              │ │
│  │  Subtle: dot-grid pattern bg, indigo gradient at top edge  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ SERVICES OVERVIEW ────────────────────────────────────────┐ │
│  │  "What's running"  (text-2xl font-bold)                     │ │
│  │                                                              │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │ Jellyfin │ │  Seerr   │ │ Grafana  │ │Mattermost│      │ │
│  │  │ [icon]   │ │ [icon]   │ │ [icon]   │ │ [icon]   │      │ │
│  │  │ Media    │ │ Media    │ │ Monitor  │ │   Chat   │      │ │
│  │  │ ● Online │ │ ● Online │ │ ● Online │ │ ● Online │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  (Simplified ServiceCard variant — no description, URL)    │ │
│  │  4-column grid desktop, 2 tablet, 1 mobile                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ HOMELAB PITCH ─────────────────────────────────────────────┐ │
│  │  3-column feature highlights:                               │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐             │ │
│  │  │ [icon]     │ │ [icon]     │ │ [icon]     │             │ │
│  │  │ No cloud   │ │ Always on  │ │ Open stack │             │ │
│  │  │ depend.    │ │ HA cluster │ │ K8s + FOSS │             │ │
│  │  │ (text-sm)  │ │ (text-sm)  │ │ (text-sm)  │             │ │
│  │  └────────────┘ └────────────┘ └────────────┘             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER: [© 2026 bjsdman] [GitHub] [About] [Contact]           │
└─────────────────────────────────────────────────────────────────┘
```

**Hero:**
- Vertical padding: `py-20` (80px) desktop, `py-12` (48px) mobile
- Max-width content: `max-w-3xl` for heading, `max-w-2xl` for subtext
- CTA buttons: `rounded-md`, primary filled + ghost variant
- Background: `color-neutral-50` light, no full-bleed image. Optional: very subtle radial gradient `from-primary-100 to-transparent` at top-left, 20% opacity max.

**Services Overview:**
- Simplified ServiceCard: icon + name + category + StatusBadge only (no description, no URL)
- `ServiceCard` variant prop `compact={true}` — Jimmy implements as a variant, not a new component

---

### 5.4 bjlandingpage — About Page

**Route:** `/about`

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ PAGE HEADER ───────────────────────────────────────────────┐ │
│  │  About  (text-3xl font-bold)                                │ │
│  │  The homelab behind bjsdman.  (text-lg color-neutral-500)  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ TWO-COLUMN LAYOUT (8/4 split) ────────────────────────────┐ │
│  │  LEFT (8 cols):                                             │ │
│  │  Narrative text — who runs this, why, what's interesting.  │ │
│  │  text-base, max-w-prose, proper line-height.               │ │
│  │  @tailwindcss/typography prose class applied.              │ │
│  │                                                              │ │
│  │  RIGHT (4 cols):                                            │ │
│  │  ┌────────────────────────┐                                │ │
│  │  │  CLUSTER SPEC CARD     │                                │ │
│  │  │  Nodes: 3              │                                │ │
│  │  │  K8s: v1.28 [mono]    │                                │ │
│  │  │  CNI: Cilium [mono]   │                                │ │
│  │  │  Storage: Longhorn    │                                │ │
│  │  │  LB: MetalLB          │                                │ │
│  │  └────────────────────────┘                                │ │
│  │  Spec card: font-mono for values, neutral-800 bg card      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Responsive:** On mobile, right column (spec card) moves above the narrative text.

---

### 5.5 bjlandingpage — Contact Page

**Route:** `/contact`

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ PAGE HEADER ───────────────────────────────────────────────┐ │
│  │  Contact  (text-3xl font-bold)                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ CENTERED FORM (max-w-lg centered) ────────────────────────┐ │
│  │                                                              │ │
│  │  Name:     [_________________________________]              │ │
│  │  Email:    [_________________________________]              │ │
│  │  Subject:  [_________________________________]              │ │
│  │  Message:  [                                 ]              │ │
│  │            [                  textarea 4 rows]              │ │
│  │                                                              │ │
│  │  reCAPTCHA or honeypot field (implementation TBD)          │ │
│  │                                                              │ │
│  │           [Send Message →]  (primary button)               │ │
│  │                                                              │ │
│  │  ── Or reach me at: ──                                      │ │
│  │  GitHub: github.com/bjsdman  (link, font-mono)             │ │
│  │  Email:  bjsdman@gmail.com   (link, font-mono)             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Form inputs:**
- Height: 40px (text-sm), `rounded-md`, `border color-neutral-300 dark:border-neutral-600`
- Focus ring: `shadow-glow-primary`, border `color-primary-500`
- Background: `color-neutral-0 dark:bg-neutral-800`
- Submit button: full-width on mobile

**Contact form backend:** Not in scope for this design system doc. Implementation note for Jimmy: contact form action should be a Next.js server action or API route — no client-side email library.

---

## 6. Responsive Breakpoints

Standard Tailwind breakpoints — no customization needed:
| Breakpoint | Min-width | Notes |
|---|---|---|
| `sm` | 640px | — |
| `md` | 768px | Tablet — 2-col grids |
| `lg` | 1024px | Desktop — full layouts |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | — |

Mobile-first approach. All components specify mobile layout as default, then `md:` / `lg:` overrides.

---

## 7. Animation & Motion

**Principle:** Motion for orientation, not decoration.

| Token | Value | Usage |
|---|---|---|
| `transition-default` | `150ms ease-out` | Card hover, button hover |
| `transition-slow` | `300ms ease-out` | Panel open/close, mobile nav |
| `animate-pulse-dot` | custom ping keyframe | StatusBadge online dot |
| `animate-skeleton` | pulse 1.5s ease-in-out infinite | Loading skeleton |

Custom keyframe for ping (already in Tailwind as `animate-ping`):
```css
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
```

---

## 8. Open Questions / Flagged Items

1. **Contact form backend** — no decision on email service (Resend, Nodemailer, etc.). Flag to Brian before Jimmy implements contact page.
2. **ServiceCard compact variant** — props interface TBD. Yuri recommends `variant="compact"` prop rather than a separate component. Confirm with Archie.
3. **Authentication on bjhomesite** — dashboard is currently internal-only, admin has no auth. Rex documents this as accepted risk. If auth is added later, Header needs a user avatar / logout slot — the `rightSlot` prop handles this.
4. **Cluster status in Footer** — Footer needs access to a status API endpoint. Coordinate with Archie on where this comes from (proxy API route).
5. **Icon library** — not decided. Recommendation: `lucide-react` (MIT, tree-shakeable, consistent stroke style). Flag to Archie.
6. **Font loading** — Inter and JetBrains Mono via `next/font` (Google Fonts + self-hosted fallback). Jimmy to implement in PageLayout.

---

*Document status: DRAFT. Held for bjui repo creation. Commit target: `bjsdman/bjui/docs/design-system.md`*
