# bjui Design System — v2 (BMJ Strategies)

**Version:** 2.0 — shipped in bjui v1.0.0 (`ee91824`)
**Date:** 2026-04-29 (revised 2026-05-01; promoted to this repo 2026-10-17)
**Author:** Yuri (UI/UX Designer); reconciled by Max (2026-05-01)
**Status:** Live. The token source of truth is the code: `src/tailwind/tokens.css` and `src/tailwind/tokens/*.ts`. This document describes them; when the two disagree, fix whichever is wrong.
**Supersedes:** v0.1.0-draft (indigo), kept at [`archive/design-system-v0.1.md`](archive/design-system-v0.1.md)

> The planning record for this design (design handoff, decision log D1–D4, risks, testability review) lives in the homelab-vault `90-archive/projects/bmj-rebrand/`. References below to `design-reconciliation.md`, `testability-review.md` and `design_handoff/` point there.

---

## 1. Overview

This is the design system update for the BMJ Strategies visual identity. It governs all UI products in the `bjsdman` homelab suite — `bjui` (the shared component library), `bjhomesite`, and `bjlandingpage`. Visual identity, token values, component behavior, and page layouts defined here are locked. Per-project drift is not permitted.

This is a **holistic update**, not a per-project override. v0.1's indigo/slate dark theme is retired in full.
---

## 2. Brand foundations

The BMJ Strategies brand identity centers on a deep, hand-lettered burnt-orange script wordmark, presented against rich darks (navy / charcoal) with cream as the warm text surface. The voice is grounded, confident, established — not playful, not hyper-modern. The rebrand should feel **like a finished piece of finely-printed stationery**, not a SaaS dashboard.

**Theme direction (decided 2026-05-01 — see design-reconciliation.md D1):** The design handoff delivers a dark-only implementation. The new theme is **dark/navy as the single mode** — `#080f1a` as page background, cream-toned neutrals for text. Light mode and a theme toggle are deferred to a future release; the hi-fi mockup in `brianmjones.html` is entirely dark and has no light-mode design authority behind it.

---

## 3. Design tokens

The canonical token values are in `src/tailwind/tokens.css` (Tailwind v4 `@theme`) and mirrored in `src/tailwind/tokens/*.ts` for the Tailwind preset. `src/test/tokens.spec.ts` locks the palette and contrast ratios. This section documents the token families and their usage.

### 3.1 Color — Primary (Navy)

Navy is the primary surface color. Replaces the old indigo primary and the separate `navy-*` family.

| Token | Hex | Usage |
|---|---|---|
| `color-primary-50`  | `#e8f0f7` | Lightest tint |
| `color-primary-100` | `#c3d4ea` | Light text on dark backgrounds |
| `color-primary-200` | `#8aaad4` | Disabled text |
| `color-primary-300` | `#5a7db5` | Placeholder text on dark |
| `color-primary-400` | `#3d5f96` | Muted icon fill |
| `color-primary-500` | `#2d4875` | Mid-tone, active nav underlines |
| `color-primary-600` | `#243a5e` | Subtle borders, inactive states |
| `color-primary-700` | `#1c2e4a` | **Borders, dividers** |
| `color-primary-800` | `#132035` | **Elevated surface, hover state bg** |
| `color-primary-900` | `#0d1624` | **Card / surface background** |
| `color-primary-950` | `#080f1a` | **Page background (darkest)** |

### 3.2 Color — Accent (Copper)

Copper/orange is the single brand accent. Used for CTA buttons, links, highlights, and hover states. Do not expand its usage beyond these roles.

| Token | Hex | Usage |
|---|---|---|
| `color-accent-100` | `#f8dcc8` | Background tint for copper elements |
| `color-accent-200` | `#f0b080` | Very light copper tint |
| `color-accent-300` | `#e8924e` | Light copper, icon fills |
| `color-accent-400` | `#d97030` | **Hover state, italic headline color** |
| `color-accent-500` | `#c55e15` | **Primary accent — CTA buttons, links, highlights** |
| `color-accent-600` | `#a84c10` | Hover state for copper elements |
| `color-accent-700` | `#8c3e0a` | Dark copper, pressed state |

> Note on hex change: Yuri's original spec used `#A05C2E` (sampled from PPTX). The handoff used `#c45c14` (extracted from the actual logo PNG files); this was subsequently lightened to `#c55e15` to achieve strict WCAG AA 4.5:1 against `primary-950` (R4 closed 2026-05-02). The handoff value remains the authoritative source hue. See design-reconciliation.md D2.

### 3.3 Color — Neutral (Cream/Slate text)

Warm cream-leaning neutrals for text on dark surfaces. Replaces the separate `cream-*` and `slate-*` families from the original spec.

| Token | Hex | Usage |
|---|---|---|
| `color-neutral-100` | `#f5ede0` | **Primary text on dark backgrounds** |
| `color-neutral-200` | `#ede0cc` | Secondary text |
| `color-neutral-300` | `#d4c4a8` | Tertiary text |
| `color-neutral-400` | `#94a3b8` | Muted text, meta, labels |
| `color-neutral-500` | `#64748b` | Faint text, placeholders |
| `color-neutral-600` | `#475569` | Disabled text |
| `color-neutral-700` | `#334155` | Subtle on-light borders |
| `color-neutral-800` | `#1e293b` | Dark borders |
| `color-neutral-850` | `#172032` | Dark surface step between 800 and 900 |
| `color-neutral-900` | `#0f172a` | Dark surface alt |
| `color-neutral-950` | `#080d18` | Darkest neutral |

### 3.4 Color — Status (unchanged)

Success, warning, error, and info scales are preserved from v0.1. No changes to hues or values.

| Token | Hex | Usage |
|---|---|---|
| `color-success-400` | `#5BA86F` | Online status, success states |
| `color-success-500` | `#3F8754` | Success button, success text |
| `color-success-700` | `#285E38` | Success bg tint |
| `color-warning-400` | `#D6A24A` | Degraded / warning amber |
| `color-warning-500` | `#B5832D` | Warning button, warning text |
| `color-warning-700` | `#7A5417` | Warning bg tint |
| `color-error-400`   | `#C9554A` | Offline / error |
| `color-error-500`   | `#A33C32` | Destructive button, error text |
| `color-error-700`   | `#6E261E` | Error bg tint |
| `color-info-400`    | `#5378A8` | Info, neutral notice |
| `color-info-500`    | `#3A5A85` | Info button, link variant |
| `color-info-700`    | `#22385A` | Info bg tint |
| `color-{success,warning,error,info}-900` | `#14532d` / `#713f12` / `#7f1d1d` / `#1e3a5f` | Deep status backgrounds |

> Status badge mapping (preserved from v0.1 contract): success → online, warning → degraded, error → offline, info → unknown/checking.

### 3.5 Semantic CSS variables

Defined on `:root` in `src/tailwind/tokens.css`:

```css
:root {
  --color-bg:            theme('colors.primary.950');  /* #080f1a */
  --color-surface:       theme('colors.primary.900');  /* #0d1624 */
  --color-surface-2:     theme('colors.primary.800');  /* #132035 */
  --color-border:        theme('colors.primary.700');  /* #1c2e4a */
  --color-border-subtle: theme('colors.primary.600');  /* #243a5e */
  --color-text:          theme('colors.neutral.100');  /* #f5ede0 */
  --color-text-muted:    theme('colors.neutral.400');  /* #94a3b8 */
  --color-text-faint:    theme('colors.neutral.500');  /* #64748b */
  --color-accent:        theme('colors.accent.500');   /* #c55e15 */
  --color-accent-hi:     theme('colors.accent.400');   /* #d97030 */
  --color-accent-dark:   theme('colors.accent.600');   /* #a84c10 */
}
```

### 3.6 Removed accents

v0.1's `color-accent-cyan`, `color-accent-violet`, `color-accent-emerald` are removed. The brand intentionally restricts accent use to copper (`accent-*`) only. Decorative accents that don't carry semantic meaning should be omitted, not invented.

### 3.7 Typography

The brand wordmark is hand-lettered script — used **only** as the logo asset (PNG), never as UI typography.

UI typography stack **(updated from original spec — see design-reconciliation.md D3):**

| Family | Stack | Usage |
|---|---|---|
| `font-sans` / `font-ui` | `Outfit, ui-sans-serif, system-ui, sans-serif` | All UI text, body, labels, nav |
| `font-display` | `'DM Serif Display', ui-serif, Georgia, serif` | Headlines (h1, h2, h3), hero text |
| `font-mono` | `JetBrains Mono, Fira Code, ui-monospace, monospace` | Code, terminal output, metric values |

Both Outfit and DM Serif Display are Google Fonts. Import:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
```

> Inter is no longer used in v2.0. This supersedes the "Inter locked" statement in the original draft. See design-reconciliation.md D3.

#### Type scale (from handoff mockup)

| Role | Class | Size | Weight | Font |
|---|---|---|---|---|
| Hero headline | `font-display text-[clamp(2.8rem,5.5vw,5rem)]` | fluid | 400 | DM Serif Display |
| Section title | `font-display text-[clamp(2rem,3.5vw,3rem)]` | fluid | 400 | DM Serif Display |
| About title | `font-display text-[clamp(2rem,3vw,2.6rem)]` | fluid | 400 | DM Serif Display |
| Body | `text-base` | 1rem | 400 | Outfit, line-height 1.75 |
| Eyebrow/label | `text-[0.75rem] font-semibold tracking-[0.14em] uppercase` | 0.75rem | 600 | Outfit |
| Nav links | `text-sm font-medium tracking-[0.06em] uppercase` | 0.875rem | 500 | Outfit |
| Service name | `text-[1.1rem] font-semibold` | 1.1rem | 600 | Outfit |
| Footer copy | `text-[0.8rem]` | 0.8rem | 400 | Outfit |

#### Tracking and leading tokens

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `tracking-eyebrow` | `0.14em` | | `leading-heading` | `1.08` |
| `tracking-label` | `0.18em` | | `leading-body` | `1.75` |
| `tracking-nav` | `0.06em` | | `leading-body-lg` | `1.80` |
| `tracking-btn` | `0.04em` | | `leading-loose` | `1.65` |
| `tracking-form` | `0.10em` | | | |

Font-size tokens `xs`–`5xl` follow the Tailwind default scale (0.75rem–3rem).

### 3.8 Spacing, radius, shadow

Radius updated to match handoff (was: Tailwind defaults with minor overrides):

| Token | Value | Usage |
|---|---|---|
| `rounded` (DEFAULT) | `6px` | Buttons, inputs, small elements |
| `rounded-lg` | `12px` | Cards, service grid container |
| `rounded-xl` | `16px` | Hero logo, large images |
| `rounded-sm` / `rounded-md` / `rounded-2xl` / `rounded-full` | `4px` / `8px` / `20px` / `9999px` | Small chips, mid elements, large panels, pills |

Spacing: Tailwind default scale unchanged.

Brand shadows (`shadow-sm`/`DEFAULT`/`md`/`lg` are the Tailwind defaults):

| Token | Value | Usage |
|---|---|---|
| `shadow-logo` | `0 0 0 1px rgba(197,94,21,0.25), 0 24px 80px rgba(197,94,21,0.20), 0 8px 32px rgba(0,0,0,0.50)` | Hero logo image |
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.3)` | Cards |
| `shadow-card-lg` | `0 8px 40px rgba(0,0,0,0.4)` | Elevated / hovered cards |
| `shadow-copper` | `0 0 24px rgba(197,94,21,0.25)` | Copper glow elements |
| `shadow-glow-copper` | `0 0 0 3px rgba(197,94,21,0.3)` | Copper focus/selection ring |
| `shadow-glow-success` | `0 0 8px rgba(91,168,111,0.4)` | Online status dot glow |

### 3.9 Animations

| Token | Value | Usage |
|---|---|---|
| `animate-ping` | `ping 1s cubic-bezier(0,0,0.2,1) infinite` | Live status dot |
| `animate-pulse-subtle` | `pulse-subtle 2s ease-in-out infinite` (opacity 1→0.5) | Checking / loading states |

### 3.10 Focus rings

| Token | Value | Usage |
|---|---|---|
| Focus visible | `outline: 2px solid accent-500; outline-offset: 2px` | All interactive elements |

---

## 4. Theme

**Single dark theme (decided 2026-05-01 — see design-reconciliation.md D1).**

Light mode and a theme toggle are not part of v2.0. The dark theme below is the only supported mode.

| Surface | Token | Hex |
|---|---|---|
| `--color-bg` / page background | `primary-950` | `#080f1a` |
| `--color-surface` / card bg | `primary-900` | `#0d1624` |
| `--color-surface-2` / elevated bg | `primary-800` | `#132035` |
| `--color-border` | `primary-700` | `#1c2e4a` |
| `--color-border-subtle` | `primary-600` | `#243a5e` |
| `--color-text` | `neutral-100` | `#f5ede0` |
| `--color-text-muted` | `neutral-400` | `#94a3b8` |
| `--color-text-faint` | `neutral-500` | `#64748b` |
| `--color-accent` | `accent-500` | `#c55e15` |
| `--color-accent-hi` | `accent-400` | `#d97030` |

Both consumer apps: `<body class="bg-primary-950 text-neutral-100 font-sans antialiased">`. The `<html className="dark">` approach is replaced by direct token usage — there is no `darkMode: 'class'` toggle needed because dark is the only mode.

---

## 5. Components — variant deltas from v0.1

Components retain their existing API. Only visual treatment changes.

### 5.1 Header

- Background: `rgba(8, 15, 26, 0.88)` with `backdrop-filter: blur(16px)` (frosted nav)
- Fixed height: `68px`
- Border-bottom: `1px solid rgba(28, 46, 74, 0.5)` (= `primary-700` at 50%)
- Brand logo: `ScriptLogoBlueLetterOrangeEdgeSlateBack.png`, height `40px`
- Nav links: `text-neutral-400`, hover `text-neutral-100` with `accent-500` underline slide-in
- CTA button: border `rgba(197,94,21,0.4)`, text `accent-500`, hover bg `rgba(197,94,21,0.12)`

> Theme-toggle button removed from scope for v2.0.

### 5.2 Footer

- Background: `primary-950`
- Border-top: `primary-700`
- Text: `neutral-500`
- Logo: `ScriptLogoBlueLetterOrangeEdgeSlateBack.png`, height `28px`, opacity `0.7`
- Copyright: `"© 2026 Brian M. Jones"`, `text-[0.8rem] text-neutral-500`
- Links: `text-neutral-500`, hover `accent-500`

### 5.3 PageLayout

- Page background: `primary-950`
- Max-width content rail: responsive with `clamp(24px, 6vw, 100px)` horizontal padding
- Vertical rhythm: `100px` top+bottom padding per major section
- No structural change to component API

### 5.4 ServiceCard

- Background: `primary-900`
- Border: `1px solid primary-700`
- Padding: `36px 32px`
- Radius: `12px`
- Hover: bg `primary-800`, border `rgba(197,94,21,0.35)`, `translateY(-2px)`
- Top accent bar: `2px` gradient `accent-600 → accent-400`, `scaleX 0→1` on hover
- Icon container: `44×44px`, bg `rgba(197,94,21,0.12)`, radius `10px`, color `accent-500`
- Service name: `text-neutral-100`
- Description: `text-neutral-400`, line-height 1.65
- Link: `text-accent-500`, arrow, gap animates on hover

### 5.5 StatusBadge

- Online: `color-success-500` text on `color-success-400` 12% alpha bg (CSS: `background-color: rgb(from theme(colors.success-400) r g b / 0.12)`)
- Degraded: `color-warning-500` text on `color-warning-400` 12% alpha bg
- Offline: `color-error-500` text on `color-error-400` 12% alpha bg
- Unknown / Checking: `color-info-500` text on `color-info-400` 12% alpha bg
- Neutral badge: `primary-700` bg, `neutral-400` text
- Icon dot: solid color, 6px diameter
- 4px gap between dot and label, 8px horizontal padding, 2px vertical padding, radius `full`

### 5.6 Drawer

- Background: `primary-900`
- Border: `primary-700`
- Overlay backdrop: `rgba(8,15,26,0.7)`
- Width: 360px on lg, 100vw on sm
- Slide-in transition: 200ms ease-out

---

## 6. Logo & favicon assets

**Asset source: PNG files. Masters are in `design_handoff/assets/` in the vault; the four logo PNGs are also committed at `src/assets/brand/` (not published in the npm package). SVG React components are deferred — see design-reconciliation.md D4.**

| Asset | File | Usage |
|---|---|---|
| Nav logo, hero, footer | `ScriptLogoBlueLetterOrangeEdgeSlateBack.png` | Primary logo on dark backgrounds |
| About section accent | `ScriptLogoOrangeLetterBlueEdgeSlateBack.png` | Orange-letter variant |
| Favicon source | `CrammedArtsyLogoV1.png` | Monogram — crop/process for .ico and apple-touch-icon |
| Light bg context | `ScriptLogoOutlined.png` | Reference only; not used in v2.0 UI |
| Reference sheets | `LOGOS_V1_Stack.png`, `MarketingStuff.png`, `MarketingStuffLIghtBG.png` | Reference only |

All PNGs are 1408×768 RGBA with transparent backgrounds.

> Future cleanup task: obtain or produce clean SVG sources for the BMJ wordmark and monogram, then replace PNGs with SVG React components in `bjui/src/assets/brand/`. Not required for v2.0.

Asset deployment: PNGs are copied into each consumer's `public/` folder. They are not shipped through the `bjui` package (too large for npm; Next.js metadata APIs prefer `public/`).

---

## 7. Accessibility

WCAG 2.1 AA is the floor. **Updated for dark-only theme and new token values (2026-05-01).**

Dark theme contrast ratios (verified for the single theme):

| Pairing | Ratio | Result |
|---|---|---|
| `neutral-100` (`#f5ede0`) on `primary-950` (`#080f1a`) | ~15.8:1 | AAA |
| `neutral-400` (`#94a3b8`) on `primary-950` (`#080f1a`) | ~6.1:1 | AA |
| `accent-500` (`#c55e15`) on `primary-950` (`#080f1a`) | 4.56:1 | AA (normal text) — R4 CLOSED |
| `accent-400` (`#d97030`) on `primary-950` (`#080f1a`) | ~6.5:1 | AA |

> R4 CLOSED (2026-05-02): `accent-500` lightened from `#c45c14` (4.47:1 — below AA) to `#c55e15` (4.56:1 — strict AA). Does not reach AAA (7:1). Contrast assertions in `tokens.spec.ts` updated to assert ≥ 4.5:1.

- Focus rings: `outline: 2px solid accent-500; outline-offset: 2px`, never removed
- Status badges convey state via icon + text, never color alone (preserved from v0.1)
- All interactive elements have a visible non-color hover/focus state

> **Steve testability flag preserved:** Contrast assertions should be programmatic tests, not manual claims. See `testability-review.md`.

---

## 8. Migration map (v0.1 → v2)

What changed from v0.1 (historical reference for anyone porting old code):

| v0.1 token | v2 token |
|---|---|
| `color-primary-*` (indigo) | Removed. CTAs/accent use `color-accent-*` (copper). Structure uses `color-primary-*` (navy). |
| `color-neutral-*` (slate) | `color-neutral-*` (new cream/slate values) + `color-primary-*` (dark surfaces) |
| `color-accent-cyan/violet/emerald` | **Removed.** Use `color-accent-*` (copper) or omit. |
| `shadow-glow-primary` rgba(99,102,241,...) | `shadow-copper` rgba(197,94,21,...) |
| `bg-neutral-900 text-neutral-100` (consumer apps) | `bg-primary-950 text-neutral-100` (dark only) |
| `<html className="dark">` (hardcoded) | `<body class="bg-primary-950 text-neutral-100 font-sans antialiased">` — dark only, no toggle |
| `font-sans` Inter | `font-sans` Outfit |
| No display font | `font-display` DM Serif Display (h1, h2, h3) |
| Four color families (primary/navy/cream/slate) | Three families (primary/accent/neutral) |

---

## 9. What's locked vs. open

**Locked (changing requires another holistic design system update):**

- Three-color palette and tonal scales above
- Dark-only theme posture for v2.0
- Outfit (sans/UI) and DM Serif Display (display/headline) as UI typefaces
- JetBrains Mono (mono) unchanged
- Component visual treatments described in §5
- PNG logo assets as the v2.0 logo delivery mechanism

**Open (carried forward from the planning phase — not yet confirmed resolved):**

- Exact pixel measurements for logo in the Header (40px is the handoff spec — visual weight test against Outfit nav links needed)
- Favicon quality from `CrammedArtsyLogoV1.png` at 16px — review in browser; escalate if quality is unacceptable
- Hero imagery for bjlandingpage — `brianmjones.html` mockup is the guide; implement in Next.js
- `bjhomesite` dashboard-specific review: if any component uses `accent` for a non-copper purpose (e.g., a status color override), document and resolve before merge
- Light mode for v2.1 (deferred by D1; token structure does not preclude it)
