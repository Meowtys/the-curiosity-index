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
- `--fg`: `#141413` (Deep carbon ink — 17.6:1 on `--bg`)
- `--fg-muted`: `#52504C` (Warm graphite — 7.5:1 on `--bg`, 6.9:1 on `--bg-elevated`)
- `--border`: `#D6D1C7` (1px hairline divider)
- `--border-strong`: `#78736A` (Interactive control boundary — 4.3:1 on `--bg`)
- `--accent`: `#9A3412` (Editorial rust-vermilion — 7.4:1 on `--bg`)
- `--accent-soft`: `#FFEDD5` (Selection & subtle highlight tint)

### Dark Mode (`@media (prefers-color-scheme: dark)`)
- `--bg`: `#111110` (Matte carbon canvas)
- `--bg-elevated`: `#1A1917` (Elevated graphite surface)
- `--fg`: `#F3F1EC` (Crisp warm parchment — 16.5:1 on `--bg`)
- `--fg-muted`: `#B5B0A6` (Muted stone — 8.6:1 on `--bg`, 8.0:1 on `--bg-elevated`)
- `--border`: `#2C2A27` (1px dark hairline divider)
- `--border-strong`: `#78736A` (Interactive control boundary — 3.9:1 on `--bg`)
- `--accent`: `#FB923C` (Warm signal amber — 8.3:1 on `--bg`)
- `--accent-soft`: `#3B2106` (Selection & subtle highlight tint)

## Browser Surfaces & Motion
- `color-scheme: light dark` set on `:root` and `<meta name="color-scheme" content="light dark">` in `<head>`.
- Custom `::selection`, `accent-color`, `caret-color`, `scrollbar-color`, and link `text-underline-offset: 0.22em`.
- Motion is opt-in (`@media (prefers-reduced-motion: no-preference)` for `scroll-behavior: smooth`); hover/focus states use crisp color and border shifts without spatial bounce.
