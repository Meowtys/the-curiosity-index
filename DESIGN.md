# Design System — The Curiosity Index

## Surface Mode & Visual World
- **Primary Mode:** Read + Experience (Editorial Single-Column Index).
- **Visual Direction:** Warm archival paper in light mode and deep matte carbon ink in dark mode, structured by 1px hairline rules (`--border`), generous vertical rhythm, tabular numerals for timelines/metrics, and zero decorative bloat.
- **Layout Spine:** Single centered reading column (`max-w-[46rem]` / `736px`) with `px-5 sm:px-8` horizontal padding.

## Typography
- **Display / Headings (`--font-display`):** `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` — clean neo-grotesque clarity with balanced line wrapping (`text-wrap: balance`) and tight tracking (`-0.02em`).
- **Body / UI (`--font-sans`):** `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` — comfortable `65ch–72ch` measure, `1.65` line height.
- **Technical / Dates / Code (`--font-mono`):** `'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace` — used strictly for timelines (`2023 · Rebuilt 2026`), stack tags, and code snippets with `font-variant-numeric: tabular-nums`.
- **Craft Rule:** Never place a small uppercase kicker/eyebrow above an `<h1>`/`<h2>` heading; let the heading lead and place subtitles or metadata below it.

## Semantic Color Tokens (WCAG 2.2 AA Verified)

### Light Mode (`prefers-color-scheme: light` default)
- `--bg`: `#FAF8F5` (Warm archival paper)
- `--bg-elevated`: `#F2EFE9` (Warm stone card/panel surface)
- `--fg`: `#141413` (Deep carbon ink — 17.39:1 on `--bg`)
- `--fg-muted`: `#52504C` (Warm graphite — 7.59:1 on `--bg`, 7.01:1 on `--bg-elevated`)
- `--border`: `#D6D1C7` (1px hairline divider)
- `--border-strong`: `#78736A` (Interactive control boundary — 4.44:1 on `--bg`)
- `--accent`: `#9A3412` (Editorial rust-vermilion — 6.89:1 on `--bg`, 6.37:1 on `--bg-elevated`)
- `--accent-soft`: `#FFEDD5` (Selection & subtle highlight tint)
- Status badges (`padding: 0.25rem 0.5rem`):
  - Live: `--badge-live-bg` `#DCFCE7` / `--badge-live-fg` `#14532D` (8.3:1) / `--badge-live-border` `#86EFAC`
  - Open Beta: `--badge-beta-bg` `#DBEAFE` / `--badge-beta-fg` `#1E3A8A` (8.49:1) / `--badge-beta-border` `#93C5FD`
  - In Development: `--badge-dev-bg` `#FEF3C7` / `--badge-dev-fg` `#78350F` (8.15:1) / `--badge-dev-border` `#FCD34D`
  - Archived (`.badge-archived`): `--bg-elevated` / `--fg-muted` / `--border-strong`

### Dark Mode (`@media (prefers-color-scheme: dark)`)
- `--bg`: `#111110` (Matte carbon canvas)
- `--bg-elevated`: `#1A1917` (Elevated graphite surface)
- `--fg`: `#F3F1EC` (Crisp warm parchment — 16.74:1 on `--bg`)
- `--fg-muted`: `#B5B0A6` (Muted stone — 8.75:1 on `--bg`, 8.14:1 on `--bg-elevated`)
- `--border`: `#2C2A27` (1px dark hairline divider)
- `--border-strong`: `#78736A` (Interactive control boundary — 4.01:1 on `--bg`)
- `--accent`: `#FB923C` (Warm signal amber — 8.35:1 on `--bg`, 7.76:1 on `--bg-elevated`)
- `--accent-soft`: `#3B2106` (Selection & subtle highlight tint)
- Status badges:
  - Live: `--badge-live-bg` `#142E1F` / `--badge-live-fg` `#86EFAC` (10.38:1) / `--badge-live-border` `#166534`
  - Open Beta: `--badge-beta-bg` `#172554` / `--badge-beta-fg` `#93C5FD` (8.15:1) / `--badge-beta-border` `#1E40AF`
  - In Development: `--badge-dev-bg` `#3B2106` / `--badge-dev-fg` `#FCD34D` (10.36:1) / `--badge-dev-border` `#92400E`
  - Archived (`.badge-archived`): `--bg-elevated` / `--fg-muted` / `--border-strong`

## Browser Surfaces, Touch Targets & Motion
- `color-scheme: light dark` set on `:root` and `<meta name="color-scheme" content="light dark">` in `<head>`.
- Custom `::selection`, `accent-color`, `caret-color`, `scrollbar-color`, and link `text-underline-offset: 0.22em`.
- Compact navigation, footer, contact, and card links use the `.tap-target` `::before` pseudo-element helper to expand hit areas to `44×44px` without distorting compact visual density (never applied to stretched-link `ProjectCard` headings so the `<article>` remains the card positioning container).
- Motion is opt-in (`@media (prefers-reduced-motion: no-preference)` for `scroll-behavior: smooth`); hover/focus states use crisp color and border shifts without spatial bounce.

## Ambient Backdrop & Interactive Layering
- **Ambient ASCII Margin Canvas (`#ambient-ascii`):** Fixed `pointer-events-none` full-viewport `<canvas>` (`z-0`) rendering faint monospace glyphs (`JetBrains Mono`) weighted heavily toward wide desktop side margins (`SPINE_HALF = 376px`) with subtle cursor/click accent highlights using live light/dark tokens; renders a calm static frame under `prefers-reduced-motion: reduce` and pauses on hidden tabs.
- **Desktop Pixel Cat (`#meowtys-cat`):** Desktop-only (`>= 1024px`) `32×32` procedural `Meowtys` pixel sprite (`--fg`, `--bg`, `--accent`) that roams freely across the viewport toward the cursor (`pointer-events-none`), purrs with rosy cheeks, a bobbing pixel heart, floating `purr~` text, and an audible 26Hz-trilled bandpass Web Audio purr when clicked without blocking links, naps (`z`/`Z`) after idling, respects `prefers-reduced-motion`, adapts live when `data-theme` switches, and exposes a top-left corner `#cat-toggle` persisted in `localStorage`.
- **Header Theme Switch (`#theme-toggle`):** Circular `32×32px` (`tap-target` `44×44px`) `role="switch"` sun/moon button beside the primary nav links that toggles `html[data-theme="dark" | "light"]`, persists `curiosity_theme` in `localStorage`, and initializes pre-paint in `BaseHead.astro` to prevent FOUC while falling back cleanly to OS `prefers-color-scheme`.
