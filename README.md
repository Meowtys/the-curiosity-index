# Westen Dasig — The Curiosity Index

Personal portfolio and engineering index of **Westen Dasig** (*John Westen Rey Dasig*), Computer Science student at Foundation University Dumaguete and Full-Stack Builder based in Tanjay City, Philippines.

Live site: **[westendasig.pages.dev](https://westendasig.pages.dev)**

---

## Featured Case Studies

- **[Here!](https://westendasig.pages.dev/projects/here/)** (`2023 · Rebuilt 2026`, Open Beta) — Face-first, offline-first Android attendance platform built with Flutter, Google ML Kit, MobileFaceNet TFLite, Firebase, and an Astro web portal.
- **[JB2K Mods](https://westendasig.pages.dev/projects/jb2k-mods/)** (`2026 · Production`, Live) — Full-stack commission request, live player-card preview, self-serve order tracking, and 2FA/passkey admin platform built with Laravel 13, PHP 8.4, Inertia 3, React 19, TypeScript, Tailwind CSS 4, and SQLite.
- **[SUSG Voting System](https://westendasig.pages.dev/projects/susg-voting-system/)** (`2024 · Rebuilt 2026`, In Development) — Purpose-built campus election and Comelec administration system for Silliman University Student Government using PHP 8.4, MariaDB, Tailwind CSS 4, and vanilla JavaScript.

---

## Highlights & Craft

- **Editorial Single-Column Architecture:** Built as static HTML with Astro, `@astrojs/mdx`, `@astrojs/sitemap`, and Tailwind CSS v4 (`@tailwindcss/typography`).
- **Light & Dark Theme Switcher:** Explicit `[data-theme]` token overrides (`#FAF8F5` archival paper and `#111110` matte carbon) paired with a pre-paint FOUC guard in `BaseHead.astro`, `localStorage` persistence, and a `32×32px` Sun/Moon `role="switch"` in the header.
- **WCAG 2.2 AA/AAA Focus & Tap Targets:** Verified token contrast (`6.37:1`–`17.39:1`), `44×44px` `.tap-target` hit-area expansion on compact links, sequential headings, skip navigation, forced-colors outlines, and `prefers-reduced-motion` support.
- **Responsive Asset Pipeline:** Uniform `16:10` (`1472×920`) studio cover art, responsive WebP gallery variants, eager above-the-fold first cover loading, and full `og:image` / `twitter:image` social preview metadata.
- **Subtle Interactive Personality (`< 10 KB` Total Client JS):**
  - `AmbientBackdrop.astro` renders a pointer-reactive `JetBrains Mono` ASCII margin field weighted away from centered reading copy.
  - `PixelCat.astro` adds a desktop-only (`>= 1024px`) `Meowtys` pixel cat that follows the cursor, naps (`z`/`Z`) when idle, hides via a top-left toggle persisted in `localStorage`, and responds with a floating `meow~` label and rate-limited Web Audio meow when clicked.

---

## Project Structure

```text
├── .github/workflows/
│   ├── ci.yml                    # Typecheck, build, test, and trigger deploy on main
│   ├── deploy.yml                # Reusable Cloudflare Pages deploy workflow
│   └── sync-github-activity.yml  # Weekly GitHub calendar sync + auto-deploy
├── public/
│   ├── favicon.svg
│   ├── og-default.png
│   └── robots.txt
├── scripts/
│   └── sync-github-activity.mjs  # Refreshes src/data/github.json from GitHub activity
├── src/
│   ├── assets/projects/          # 1472x920 covers + WebP case study screenshots
│   ├── components/               # AmbientBackdrop, BaseHead, GitHubActivity, Header, Footer, PixelCat, ProjectCard, TechBadge
│   ├── content/projects/         # MDX case studies (here, jb2k-mods, susg-voting-system)
│   ├── data/                     # site.ts + cached github.json heatmap data
│   ├── layouts/BaseLayout.astro
│   ├── pages/                    # /, /projects/, /projects/[slug]/, /about/, /contact/, /404
│   └── styles/global.css         # Theme tokens, badge styles, .tap-target, typography overrides
├── tests/
│   ├── content.test.mjs          # Content, accessibility, image dimension & guardrail tests
│   └── build.test.mjs            # Static dist HTML, SEO/OG, link, script budget & sitemap checks
├── DESIGN.md                     # Semantic tokens, contrast ratios & interactive surface spec
├── PRODUCT.md                    # Product context & editorial guardrails
└── astro.config.mjs
```

---

## Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Refresh GitHub contribution heatmap JSON
npm run sync:github

# Run Astro & TypeScript diagnostics
npm run check

# Build static production site into dist/
npm run build

# Run automated content & built-output verification tests
npm test

# Preview the built site locally
npm run preview
```

---

## Automation & Deployment

- **CI & Production Deploy (`.github/workflows/ci.yml` + `deploy.yml`):** Every pull request and push to `main` runs `astro check`, `astro build`, and `node --test`. Pushes to `main` automatically invoke the reusable `deploy.yml` workflow (`cloudflare/wrangler-action@v3`) once `CLOUDFLARE_API_TOKEN` (Pages Edit scope) and `CLOUDFLARE_ACCOUNT_ID` are set in GitHub Repository Secrets.
- **Weekly Activity Sync (`.github/workflows/sync-github-activity.yml`):** Runs Sundays at `00:00 UTC` (or manually via `workflow_dispatch`), refreshes `src/data/github.json` from GitHub's profile activity calendar (preserving private contribution counts without repo-scoped token truncation), re-runs full verification, commits changes to `main`, and chains directly into `deploy.yml`.

---

## License

- **Code:** [MIT License](./LICENSE) — Components, layouts, CSS tokens, build config, and tests may be reused with attribution.
- **Content & Assets:** **All Rights Reserved** — See [LICENSE-CONTENT](./LICENSE-CONTENT). Personal copy (`src/content/`, `src/data/`), screenshots (`src/assets/`), and brand graphics (`public/`) are excluded from the MIT license and may not be republished without permission.
