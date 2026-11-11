# Personal Portfolio ("The Curiosity Index") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Westen Dasig's static, accessible, zero-client-JS personal portfolio and MDX project case-study site ("The Curiosity Index") ready for Cloudflare Pages.

**Architecture:** Static Astro 5+ site using strict TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`) with `@tailwindcss/typography`, typed `@astrojs/mdx` content collections (`src/content/projects/*.mdx`), and CSS `prefers-color-scheme` semantic tokens inside a centered `max-w-[46rem]` single-column layout. Visual tokens and typography are established via `ui-ux-pro-max` and documented in `PRODUCT.md` / `DESIGN.md` via `impeccable` before UI components are built.

**Tech Stack:** Astro (`output: 'static'`), TypeScript (`astro/tsconfigs/strict`), Tailwind CSS v4 (`@tailwindcss/vite`), `@tailwindcss/typography`, `@astrojs/mdx`, `@astrojs/sitemap`, Node `node:test`, `browser-use`, `lighthouse`.

**Spec:** `docs/superpowers/specs/2026-11-12-personal-portfolio-design.md`

---

## Global Constraints

- Astro static output (`output: 'static'`, no SSR adapter) + strict TypeScript (`astro/tsconfigs/strict`).
- Tailwind CSS v4 via `npx astro add tailwind` (never deprecated `@astrojs/tailwind`) + `@tailwindcss/typography`.
- MDX (`@astrojs/mdx`) + `@astrojs/sitemap` with `site: 'https://the-curiosity-index.pages.dev'`.
- Zero client-side JS by default: no React/UI framework, no `<script>` tags emitted on any page, no client-side theme toggle scripts.
- Ask before adding unapproved npm dependencies/integrations, deploying, or connecting a custom domain.
- No public GitHub repo links on project cards/case studies (all four project repos are private).
- Direct contact links only: `mailto:westendasig2003@gmail.com`, `https://www.linkedin.com/in/westen-dasig/`, `https://github.com/Meowtys`.
- Verified biographical facts only: **WesTech** (local computer/phone repair & custom PC building, 2020–Present), **SugarPy Meetup Event** (hosted Sept 2025), **re:load Agentic AI Edition** (Teaching Assistant Sept 2025), **Foundation University** Dumaguete (`Bachelor of Science (BS) in Computer Science`), **SUSG Voting System** (started 2024, rebuilt 2026, in development), **Here!** (started 2023, rebuilt 2026, Open Beta at `https://youre-here.vercel.app`), **JB2K Mods** (2026 · Production, Full-Stack Developer, live at `https://jb2k.shop`).
- Respect `prefers-reduced-motion` (preserve state feedback without harsh `0.01ms` blanket kills; eliminate spatial motion/transitions when reduced) and `prefers-color-scheme` (`light` and `dark`).
- Semantic HTML, keyboard navigable (`skip-link` to `#main-content`, logical tab order, visible `:focus-visible`), WCAG 2.2 AA contrast (≥ 4.5:1 normal text, ≥ 3:1 large text/borders).
- Per-page `<title>`, `<meta name="description">`, `<link rel="canonical">`, and Open Graph tags.
- `browser-use` used ONLY on `localhost` (`npm run preview` / `npm run dev`) — never sign in, submit forms, or use Browser Use Cloud.
- "Done" means: `npx astro check` clean, `npm test` passing, `npm run build` passes, every route inspected in `browser-use` at `375px`, `768px`, and `1280px` (light & dark mode) with zero overflow/broken links/console errors, and `npx lighthouse` ≥ 95 in Performance, Accessibility, Best Practices, and SEO.

## Review Focus

1. **Missing `liveUrl` or `cover` handling:** `SUSG Voting System` has no `liveUrl`, and none of the three projects ship cover images at launch. Cards and case study headers must omit absent links/images cleanly without rendering `href="undefined"`, broken `<img>` tags, or placeholder links to private repos. → Pinned in Task 3 (`src/content.config.ts`) & Task 6 (`tests/build.test.mjs`).
2. **Dark/light contrast & typography prose drift:** `@tailwindcss/typography` default `.prose` styles can revert to low-contrast grays in dark mode unless mapped to our semantic CSS custom properties. → Pinned in Task 2 (`src/styles/global.css`) & Task 7 (`impeccable audit` + `browser-use`).
3. **Accidental client-side JS emission:** Astro or third-party integrations must not inject unexpected `<script>` tags into `dist/**/*.html`. → Pinned in Task 6 (`tests/build.test.mjs`).
4. **Canonical URL, sitemap & Open Graph completeness:** Every route (including `/404` and dynamic `/projects/[slug]`) must emit a unique `<title>`, `<meta name="description">`, valid `https://the-curiosity-index.pages.dev/...` canonical URL, and appear in `dist/sitemap-index.xml` (excluding 404). → Pinned in Task 4 (`BaseHead.astro`) & Task 6 (`tests/build.test.mjs`).
5. **Narrow mobile (375px) horizontal overflow & focus visibility:** Long tech-stack pills, URLs, or MDX prose blocks can cause horizontal scrolling on 375px viewports, and missing `:focus-visible` styles break keyboard accessibility. → Pinned in Task 5 (responsive page layouts) & Task 7 (`browser-use` 375px/768px/1280px + Lighthouse ≥ 95).

---

### Task 1: Scaffold Astro Project, Decided Integrations, and Strict TypeScript

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `public/robots.txt`
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: Working Astro static build pipeline with `@tailwindcss/vite`, `@tailwindcss/typography`, `@astrojs/mdx`, `@astrojs/sitemap`, `astro check`, and `npm test` (`node --test`).

- [ ] **Step 1: Initialize `package.json` and install the decided Astro stack (without clobbering `docs/`)**

Run in `c:\Users\Westen\Documents\GitHub\the-curiosity-index`:
```powershell
npm init -y
npm install astro
npx astro add tailwind mdx sitemap --yes
npm install @tailwindcss/typography
npm install -D @astrojs/check typescript
```
Verify: `package.json` exists and `node_modules` installs cleanly with only the decided stack packages (`@astrojs/tailwind` is NOT installed).

- [ ] **Step 2: Configure `package.json` scripts and ESM module type**

Run:
```powershell
npm pkg set type="module" private=true --json
npm pkg set scripts.dev="astro dev" scripts.build="astro build" scripts.preview="astro preview" scripts.check="astro check" scripts.test="node --test tests/*.test.mjs"
```
Verify: `package.json` has `"type": "module"` and all five scripts (`dev`, `build`, `preview`, `check`, `test`).

- [ ] **Step 3: Write `.gitignore`, `tsconfig.json`, `astro.config.mjs`, and `public/robots.txt`**

Create `.gitignore`:
```gitignore
# build output
dist/
.astro/

# dependencies
node_modules/

# environment
.env
.env.*
!.env.example

# logs & OS
npm-debug.log*
.DS_Store
Thumbs.db
```

Create `tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://the-curiosity-index.pages.dev',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/404') && !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Create `public/robots.txt`:
```text
User-agent: *
Allow: /

Sitemap: https://the-curiosity-index.pages.dev/sitemap-index.xml
```

- [ ] **Step 4: Create placeholder `src/styles/global.css` and `src/pages/index.astro` smoke route to verify toolchain**

Create `src/styles/global.css`:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

Create temporary smoke `src/pages/index.astro`:
```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Smoke Check</title>
  </head>
  <body>
    <main>Smoke</main>
  </body>
</html>
```

- [ ] **Step 5: Run `npx astro check` and `npm run build` to verify scaffolding**

Run:
```powershell
npx astro check
npm run build
```
Expected: `astro check` reports `0 errors`, `0 warnings`; `npm run build` exits `0` and produces `dist/index.html` and `dist/sitemap-index.xml`.

- [ ] **Step 6: Commit scaffolding**

```powershell
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore public/robots.txt src/styles/global.css src/pages/index.astro
git commit -m "chore: scaffold Astro with Tailwind v4, MDX, sitemap, and strict TypeScript"
```

---

### Task 2: Visual Direction (`ui-ux-pro-max`), Product & Design System (`impeccable`), Favicon, and CSS Tokens

**Files:**
- Create: `PRODUCT.md`
- Create: `DESIGN.md`
- Create: `public/favicon.svg`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: Semantic CSS custom properties in `src/styles/global.css` (`--bg`, `--bg-elevated`, `--fg`, `--fg-muted`, `--border`, `--border-strong`, `--accent`, `--accent-soft`, `--badge-*`), typography variables (`--font-display`, `--font-sans`, `--font-mono`), `@tailwindcss/typography` theme mapping, adaptive `prefers-color-scheme` dark tokens, `prefers-reduced-motion` rules, and `:focus-visible` outlines.

- [ ] **Step 1: Run `ui-ux-pro-max` for visual direction (style, palette, typography, favicon)**

Run Python search script inside `ui-ux-pro-max` skill directory:
```powershell
python "$HOME\.agents\skills\ui-ux-pro-max\scripts\search.py" "minimal editorial developer portfolio warm clean" --design-system --variance 3 --motion 1 --density 4 -p "The Curiosity Index"
python "$HOME\.agents\skills\ui-ux-pro-max\scripts\search.py" "editorial serif sans monospace pairing" --domain typography
python "$HOME\.agents\skills\ui-ux-pro-max\scripts\search.py" "minimal developer dark light contrast" --domain color
```
Record the verified palette, typography pairing, and anti-patterns from the tool output (do not invent unverified results; adapt system/CSS font stack or Google Fonts with fallback if needed without adding unapproved npm packages).

- [ ] **Step 2: Consult `modern-web-guidance` for dark-mode CSS, typography, and reduced-motion best practices**

Run:
```powershell
npx.cmd -y modern-web-guidance@latest search "color-scheme prefers-color-scheme" --skill-version 2026_10_16-6654652b
npx.cmd -y modern-web-guidance@latest search "prefers-reduced-motion accessibility" --skill-version 2026_10_16-6654652b
```
Retrieve matching guide IDs via `npx.cmd -y modern-web-guidance@latest retrieve "<ids>"` and apply every relevant guidance rule.

- [ ] **Step 3: Execute `impeccable` `init` (`PRODUCT.md`) and `new-work` (`DESIGN.md`)**

1. Check `C:\Users\Westen\.gemini\config\skills\impeccable\scripts\impeccable.cmd context` (or fallback per `impeccable/SKILL.md` if launcher unavailable).
2. Read `impeccable/reference/init.md`, `impeccable/reference/new-work.md`, and `impeccable/reference/craft-floor.md`.
3. Write `PRODUCT.md` (strictly confirmed product truth from `docs/superpowers/specs/2026-11-12-personal-portfolio-design.md`, zero visual recipes) and `DESIGN.md` (documenting the exact visual world, light/dark semantic tokens, serif/sans/mono hierarchy, hairline-border language, spacing rhythm, and `Read`/`Experience` surface mode).

- [ ] **Step 4: Create `public/favicon.svg` and finalize `src/styles/global.css`**

Create `public/favicon.svg` as a crisp geometric monogram/index mark (`CI` or clean editorial index mark) supporting light and dark preferences via embedded `<style>@media (prefers-color-scheme: dark) { ... }</style>`, keeping contrast high in browser tabs.

Update `src/styles/global.css` with:
- `@import "tailwindcss";`
- `@plugin "@tailwindcss/typography";`
- `:root` with `color-scheme: light dark;`, light mode surface/text/border/accent tokens (warm off-white paper canvas, deep ink text, hairline neutral borders, restrained high-contrast accent verified ≥ 4.5:1 AA).
- `@media (prefers-color-scheme: dark)` overriding semantic custom properties (deep matte charcoal surface, crisp off-white text, subtle dark hairline borders, WCAG AA contrast accent).
- `@theme` block exposing font families and custom color tokens to Tailwind utilities (`bg-surface`, `bg-surface-elevated`, `text-ink`, `text-ink-muted`, `border-hairline`, `text-accent`, etc.).
- Base styles: `html { scroll-behavior: smooth; }`, `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }`, skip-link styles, `@media (prefers-reduced-motion: reduce)` (`scroll-behavior: auto; transition: none;` on animated elements without killing static focus/color states), and `.prose` variable overrides so `@tailwindcss/typography` reads `--fg`, `--fg-muted`, `--border`, `--accent` cleanly in both themes.

- [ ] **Step 5: Verify contrast math, `npx astro check`, and `npm run build`**

Run a quick Node check verifying WCAG AA contrast ratio (≥ 4.5:1) for light and dark token pairs, then:
```powershell
npx astro check
npm run build
```
Expected: Both exit `0`; contrast ratios ≥ 4.5:1 for all text/background and badge/background pairs.

- [ ] **Step 6: Commit design system docs, favicon, and CSS tokens**

```powershell
git add PRODUCT.md DESIGN.md public/favicon.svg src/styles/global.css
git commit -m "design: establish product/design docs, adaptive favicon, and theme tokens"
```

---

### Task 3: Author Data (`src/data/site.ts`), Typed Collection Schema (`src/content.config.ts`), and 3 MDX Case Studies

**Files:**
- Create: `src/data/site.ts`
- Create: `src/content.config.ts`
- Create: `src/content/projects/here.mdx`
- Create: `src/content/projects/jb2k-mods.mdx`
- Create: `src/content/projects/susg-voting-system.mdx`
- Create: `tests/content.test.mjs`

**Interfaces:**
- Produces `src/data/site.ts` exports: `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`, `EXPERIENCE`, `EDUCATION`, `TOOLBOX`.
- Produces `projects` collection in `src/content.config.ts` with schema fields: `title`, `subtitle`, `description`, `date`, `timeline`, `status`, `category`, `role`, `tags`, `featured`, `order`, optional `liveUrl`, optional `repoUrl`, optional `cover`, optional `coverAlt` (plus Zod `.refine` requiring `coverAlt` whenever `cover` is supplied).

- [ ] **Step 1: Write failing content validation test (`tests/content.test.mjs`)**

Create `tests/content.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('content.config.ts and site.ts exist with required exports', () => {
  const configPath = path.join(root, 'src/content.config.ts');
  const sitePath = path.join(root, 'src/data/site.ts');
  assert.ok(fs.existsSync(configPath), 'src/content.config.ts must exist');
  assert.ok(fs.existsSync(sitePath), 'src/data/site.ts must exist');

  const site = fs.readFileSync(sitePath, 'utf8');
  assert.match(site, /westendasig2003@gmail\.com/);
  assert.match(site, /https:\/\/www\.linkedin\.com\/in\/westen-dasig\//);
  assert.match(site, /https:\/\/github\.com\/Meowtys/);
  assert.match(site, /WesTech/);
  assert.match(site, /2020/);
  assert.match(site, /SugarPy/);
  assert.match(site, /Foundation University/);
  assert.match(site, /Bachelor of Science \(BS\) in Computer Science/);
});

test('all three project MDX files exist, carry accurate timelines, and leak no repoUrl', () => {
  const projectsDir = path.join(root, 'src/content/projects');
  const expected = ['here.mdx', 'jb2k-mods.mdx', 'susg-voting-system.mdx'];
  for (const file of expected) {
    const full = path.join(projectsDir, file);
    assert.ok(fs.existsSync(full), `Missing ${file}`);
    const body = fs.readFileSync(full, 'utf8');
    assert.doesNotMatch(body, /^repoUrl:/m, `${file} must not expose private repoUrl`);
  }

  const susg = fs.readFileSync(path.join(projectsDir, 'susg-voting-system.mdx'), 'utf8');
  assert.match(susg, /2024/);
  assert.doesNotMatch(susg, /liveUrl:/m, 'SUSG Voting System has no liveUrl while in development');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/content.test.mjs`
Expected: FAIL because `src/content.config.ts`, `src/data/site.ts`, and `src/content/projects/*.mdx` do not exist yet.

- [ ] **Step 3: Create `src/data/site.ts` and `src/content.config.ts`**

Create `src/data/site.ts` containing strictly confirmed data:
- `SITE`:
  - `name: 'Westen Dasig'`
  - `fullName: 'John Westen Rey Dasig'`
  - `subtitle: 'The Curiosity Index'`
  - `role: 'CS Student at Foundation University Dumaguete · Full-Stack Builder'`
  - `location: 'Dumaguete City, Philippines'`
  - `bio: "I'm Westen, a computer science student interested in exploring different areas of technology. I spend my time building software, working with hardware, and learning about things that catch my curiosity."`
  - `email: 'westendasig2003@gmail.com'`
  - `siteUrl: 'https://the-curiosity-index.pages.dev'`
  - `description: "Westen Dasig — The Curiosity Index. Computer science student, full-stack builder, and hardware tinkerer in Dumaguete City."`
- `NAV_LINKS`: `Projects` (`/projects`), `About` (`/about`), `Contact` (`/contact`).
- `SOCIAL_LINKS`: `Email` (`mailto:westendasig2003@gmail.com`), `GitHub` (`https://github.com/Meowtys`), `LinkedIn` (`https://www.linkedin.com/in/westen-dasig/`).
- `EXPERIENCE`:
  - `WesTech` (`2020 – Present`, `Founder & Technician`): Local computer and phone repair shop and custom PC building service.
  - `SugarPy Meetup Event` (`September 2025`, `Host`): Hosted the hands-on SugarPy Meetup (Negros Island Python User Group) at DICT Digital Transformation Center in Dumaguete City covering Python, FastAPI, and RAG/Generative AI.
  - `re:load Agentic AI Edition` (`September 2025`, `Teaching Assistant`): Assisted participants with Python and LangGraph environment setup and debugging during the hands-on AI agents workshop led by Jouella Fabe (Senior Software Engineer, PagerDuty).
- `EDUCATION`:
  - `Foundation University` (`Dumaguete City, Philippines`): `Bachelor of Science (BS) in Computer Science`.
- `TOOLBOX`:
  - Grouped arrays for Languages & Backend (`PHP 8.2–8.4`, `Laravel 13`, `Python`, `Dart`, `TypeScript`, `JavaScript`, `MariaDB`, `SQLite`), Frontend & Mobile (`Flutter`, `React 19`, `Inertia.js`, `Astro`, `Tailwind CSS v4`, `HTML5 / CSS3`), ML & Cloud (`Google ML Kit`, `TensorFlow Lite`, `Firebase Auth & Firestore`, `Cloudflare Pages`, `Railway`, `Vercel`), Quality & Hardware (`PHPUnit`, `PHPStan / Larastan`, `Flutter Test`, `WCAG 2.2 AA`, `PC & Mobile Hardware Diagnostics`).

Create `src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        timeline: z.string(),
        status: z.enum(['Live', 'Open Beta', 'In Development', 'Archived']),
        category: z.enum(['Software', 'Hardware', 'Experiment']),
        role: z.string(),
        tags: z.array(z.string()).min(1),
        featured: z.boolean().default(true),
        order: z.number().int(),
        liveUrl: z.string().url().optional(),
        repoUrl: z.string().url().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt?.trim()), {
        message: 'coverAlt is required whenever cover is provided',
        path: ['coverAlt'],
      }),
});

export const collections = { projects };
```

- [ ] **Step 4: Write `here.mdx`, `jb2k-mods.mdx`, and `susg-voting-system.mdx`**

Write each `.mdx` file under `src/content/projects/` with accurate frontmatter (`repoUrl` omitted, `cover` omitted, `SUSG` timeline `"2024 · Rebuilt 2026"` with no `liveUrl`) and grounded engineering prose covering Problem & Context, Architecture / Rebuild Decisions, Security / Reliability / Testing, and Current Outcome.

- [ ] **Step 5: Run `node --test tests/content.test.mjs` and `npx astro check`**

Run:
```powershell
node --test tests/content.test.mjs
npx astro check
```
Expected: Both PASS (`0 errors`, schema compiles and validates all 3 `.mdx` files).

- [ ] **Step 6: Commit site data, content config, and MDX case studies**

```powershell
git add src/data/site.ts src/content.config.ts src/content/projects tests/content.test.mjs
git commit -m "content: add typed projects collection, author data, and 3 MDX case studies"
```

---

### Task 4: Core Layout & Shared Components (`BaseHead`, `Header`, `Footer`, `ProjectCard`, `BaseLayout`)

**Files:**
- Create: `src/components/BaseHead.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `SITE`, `NAV_LINKS`, `SOCIAL_LINKS` from `src/data/site.ts`; `CollectionEntry<'projects'>` from `astro:content`.
- Produces:
  - `BaseHead.astro`: Props `{ title: string; description: string; image?: string; type?: 'website' | 'article'; noindex?: boolean }`.
  - `BaseLayout.astro`: Props `{ title: string; description: string; image?: string; type?: 'website' | 'article'; noindex?: boolean }`.
  - `ProjectCard.astro`: Props `{ slug: string; data: CollectionEntry<'projects'>['data'] }`.

- [ ] **Step 1: Consult `modern-web-guidance` if needed for landmark semantics or skip-link / external link security attributes**

Run:
```powershell
npx.cmd -y modern-web-guidance@latest search "skip link keyboard navigation" --skill-version 2026_10_16-6654652b
```
Apply retrieved guidance (or verify via `list` if no match).

- [ ] **Step 2: Create `src/components/BaseHead.astro`**

Emit `<meta charset="utf-8" />`, `<meta name="viewport" content="width=device-width, initial-scale=1" />`, `<meta name="color-scheme" content="light dark" />`, `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`, `<title>{fullTitle}</title>`, `<meta name="description" content={description} />`, `<link rel="canonical" href={canonicalURL} />` (constructed from `new URL(Astro.url.pathname, Astro.site)`), Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`, `og:site_name`, and conditional `og:image`), Twitter metadata (`twitter:card`, `twitter:title`, `twitter:description`), and optional `<meta name="robots" content="noindex" />` when `noindex` is true (used on `/404`).

- [ ] **Step 3: Create `src/components/Header.astro` and `src/components/Footer.astro`**

- `Header.astro`:
  - Semantic `<header>` with hairline bottom border (`border-b border-hairline`).
  - Left: `<a href="/">` displaying **Westen Dasig** and a muted subtitle/eyebrow **`The Curiosity Index`** (responsive wrap cleanly down to 375px without horizontal overflow).
  - Right: `<nav aria-label="Primary">` rendering `NAV_LINKS` (`Projects`, `About`, `Contact`). Active state detected via normalized `Astro.url.pathname` (`pathname === link.href` or `pathname.startsWith(link.href + '/')`), setting `aria-current="page"` and strong foreground styling. Links meet touch-target spacing/padding cleanly.
- `Footer.astro`:
  - Semantic `<footer>` with hairline top border (`border-t border-hairline`), displaying `Westen Dasig · Dumaguete City, Philippines` and inline links for `Email`, `GitHub`, and `LinkedIn` (with accessible labels and `rel="noopener noreferrer"` on `https://` links).

- [ ] **Step 4: Create `src/components/ProjectCard.astro` and `src/layouts/BaseLayout.astro`**

- `ProjectCard.astro`:
  - Semantic `<article>` with hairline border (`border border-hairline`), crisp padding, subtle border highlight on hover (`transition-colors` disabled under `prefers-reduced-motion`).
  - Top row: Status badge (`Open Beta`, `Live`, `In Development`) + `timeline` (`2023 · Rebuilt 2026`, etc.) + `category`.
  - Heading (`h2` or `h3` configurable via optional `headingLevel` prop `'h2' | 'h3'` defaulting to `'h2'` so document heading hierarchy stays strictly sequential on both `/` and `/projects`!) linking to `/projects/${slug}` (`title` + `subtitle`).
  - Concise `description` and wrapping list (`flex-wrap`) of stack `tags` (with `break-words` so 375px viewports never overflow).
  - Footer action row: `Read case study →` (`/projects/${slug}`) and, ONLY when `data.liveUrl` is present, an external link `Visit live site ↗` (`target="_blank" rel="noopener noreferrer"`). Never renders a `repoUrl` link when `data.repoUrl` is absent.
- `BaseLayout.astro`:
  - `<html lang="en">` wrapping `<head><BaseHead ... /></head>`, `<body>`, `<a href="#main-content" class="skip-link">Skip to main content</a>`, `<Header />`, `<main id="main-content" tabindex="-1">` inside `mx-auto w-full max-w-[46rem] px-5 sm:px-8`, and `<Footer />`.

- [ ] **Step 5: Run `npx astro check` to verify strict TypeScript types across all components**

Run: `npx astro check`
Expected: `0 errors`, `0 warnings`, `0 hints`.

- [ ] **Step 6: Commit layout and UI components**

```powershell
git add src/components src/layouts/BaseLayout.astro
git commit -m "feat: add BaseHead, Header, Footer, ProjectCard, and BaseLayout components"
```

---

### Task 5: Build All Portfolio Pages (`/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, `/404`)

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout.astro`, `ProjectCard.astro`, `getCollection('projects')`, `render()` from `astro:content`, `<Image />` from `astro:assets`, and `SITE`, `EXPERIENCE`, `EDUCATION`, `TOOLBOX`, `SOCIAL_LINKS` from `src/data/site.ts`.

- [ ] **Step 1: Implement `src/pages/index.astro`**

- Hero section (`h1`: **Westen Dasig** with eyebrow/subtitle **The Curiosity Index**, role line, bio paragraph, and quick inline links to `/projects`, `/about`, and `mailto:westendasig2003@gmail.com`).
- `Selected Work` (`h2`) listing featured projects sorted by `order` ascending via `<ProjectCard headingLevel="h3" ... />`, plus a `View all projects →` link.
- `Curiosity & Community` (`h2`) summarizing **WesTech** (hardware repair & custom PC building, 2020–Present), hosting the **SugarPy Meetup Event** (Sept 2025), and serving as Teaching Assistant at **re:load Agentic AI Edition** (Sept 2025), linking to `/about`.
- `Get in Touch` (`h2`) with direct links (`mailto:westendasig2003@gmail.com`, LinkedIn, GitHub).

- [ ] **Step 2: Implement `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro`**

- `projects/index.astro`: `h1` **Projects & Case Studies**, concise subtitle, and full sorted list of projects rendered with `<ProjectCard headingLevel="h2" ... />`.
- `projects/[slug].astro`:
  - `getStaticPaths()` returning `{ params: { slug: entry.id }, props: { entry, prev, next } }` sorted by `order` ascending (`prev`/`next` computed cleanly in `getStaticPaths`!).
  - Renders back link (`← All projects`), status/category/timeline row, `h1` (`entry.data.title`) + subtitle, semantic `<dl>` metadata grid (Role, Timeline, Status, Stack, and Live Site or `"Private / In Development"` text when `liveUrl` is omitted), optional `<Image src={entry.data.cover} alt={entry.data.coverAlt ?? ''} />` when `cover` exists, `<article class="prose max-w-none"><Content /></article>`, and sequential Previous/Next project links.

- [ ] **Step 3: Implement `src/pages/about.astro`, `src/pages/contact.astro`, and `src/pages/404.astro`**

- `about.astro`: `h1` **About Westen Dasig**, narrative paragraphs covering CS studies, full-stack building, software QA mindset, and hardware repair/custom PC building (`WesTech`), followed by `Experience & Community` (`h2`), `Education` (`h2`), and `Stack & Tools` (`h2`) rendered cleanly from `src/data/site.ts`.
- `contact.astro`: `h1` **Contact**, short welcoming note, and clean hairline-bordered semantic `<dl>` / link list for Email (`mailto:westendasig2003@gmail.com`), LinkedIn, and GitHub.
- `404.astro`: `noindex={true}`, `h1` **Page not found**, concise message, and link back to `/`.

- [ ] **Step 4: Run `npx astro check` and `npm run build`**

Run:
```powershell
npx astro check
npm run build
```
Expected: `0 errors`, clean static build generating all 8 HTML files in `dist/`.

- [ ] **Step 5: Commit all pages**

```powershell
git add src/pages
git commit -m "feat: implement home, projects index, MDX case studies, about, contact, and 404 pages"
```

---

### Task 6: Automated Build Output, SEO, Zero-JS, and Link Integrity Tests

**Files:**
- Create: `tests/build.test.mjs`

**Interfaces:**
- Consumes: Built `dist/` artifacts generated by `npm run build`.

- [ ] **Step 1: Write `tests/build.test.mjs` covering Review Focus items 1, 3, and 4**

Create `tests/build.test.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

const expectedPages = [
  'index.html',
  'projects/index.html',
  'projects/here/index.html',
  'projects/jb2k-mods/index.html',
  'projects/susg-voting-system/index.html',
  'about/index.html',
  'contact/index.html',
  '404.html',
];

test('dist contains all expected static HTML pages and sitemap-index.xml', () => {
  for (const rel of expectedPages) {
    assert.ok(fs.existsSync(path.join(distDir, rel)), `Missing dist/${rel}`);
  }
  assert.ok(fs.existsSync(path.join(distDir, 'sitemap-index.xml')), 'Missing sitemap-index.xml');
});

test('every built page has zero client JS, required SEO/OG tags, single h1, skip link, and valid internal links', () => {
  const titles = new Set();
  for (const rel of expectedPages) {
    const html = fs.readFileSync(path.join(distDir, rel), 'utf8');

    assert.doesNotMatch(html, /<script\b/i, `${rel} must ship zero client <script> tags`);
    assert.match(html, /<a[^>]+href="#main-content"/i, `${rel} missing skip link`);
    assert.match(html, /<main[^>]+id="main-content"/i, `${rel} missing #main-content`);

    const h1Count = (html.match(/<h1\b/gi) || []).length;
    assert.equal(h1Count, 1, `${rel} must have exactly one <h1>, got ${h1Count}`);

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    assert.ok(titleMatch?.[1]?.trim(), `${rel} missing <title>`);
    titles.add(titleMatch[1].trim());

    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/i, `${rel} missing meta description`);
    assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/the-curiosity-index\.pages\.dev\//i, `${rel} missing canonical URL`);
    assert.match(html, /<meta\s+property="og:title"\s+content="[^"]+"/i, `${rel} missing og:title`);
    assert.match(html, /<meta\s+property="og:description"\s+content="[^"]+"/i, `${rel} missing og:description`);
    assert.doesNotMatch(html, /href="undefined"|src="undefined"/i, `${rel} contains undefined link/asset`);

    for (const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)) {
      const target = match[1];
      if (target === '/' || target.startsWith('/favicon')) continue;
      const clean = target.replace(/^\/|\/$/g, '');
      const hasFile = fs.existsSync(path.join(distDir, clean)) || fs.existsSync(path.join(distDir, clean, 'index.html'));
      assert.ok(hasFile, `${rel} has broken internal link: ${target}`);
    }
  }
  assert.equal(titles.size, expectedPages.length, 'Every page must have a unique <title>');
});

test('sitemap excludes 404 and includes all public routes', () => {
  const indexXml = fs.readFileSync(path.join(distDir, 'sitemap-index.xml'), 'utf8');
  const chunkMatch = indexXml.match(/<loc>https:\/\/the-curiosity-index\.pages\.dev\/([^<]+)<\/loc>/);
  assert.ok(chunkMatch?.[1], 'sitemap-index.xml must reference a sitemap file');
  const sitemapXml = fs.readFileSync(path.join(distDir, chunkMatch[1]), 'utf8');
  assert.match(sitemapXml, /\/projects\/here\/?</);
  assert.match(sitemapXml, /\/projects\/jb2k-mods\/?</);
  assert.match(sitemapXml, /\/projects\/susg-voting-system\/?</);
  assert.match(sitemapXml, /\/about\/?</);
  assert.match(sitemapXml, /\/contact\/?</);
  assert.doesNotMatch(sitemapXml, /\/404/);
});
```

- [ ] **Step 2: Run build + full test suite**

Run:
```powershell
npm run build
npm test
```
Expected: All tests in `tests/content.test.mjs` and `tests/build.test.mjs` PASS.

- [ ] **Step 3: Commit build verification suite**

```powershell
git add tests/build.test.mjs
git commit -m "test: verify static build output, SEO metadata, zero JS, and internal links"
```

---

### Task 7: `impeccable` Audit & Polish, `browser-use` Multi-Viewport & Light/Dark Inspection, Lighthouse ≥ 95, and Final Verification

**Files:**
- Modify: Any component/style files flagged by `impeccable audit`, `browser-use`, or `lighthouse` (only within scope).

- [ ] **Step 1: Start `npm run preview` as a background daemon and run `impeccable audit`**

Start `npm run preview` (note exact localhost URL/port, e.g. `http://localhost:4321`).
Read `impeccable/reference/audit.md` and run `impeccable audit` (plus detector check if available: `C:\Users\Westen\.gemini\config\skills\impeccable\scripts\impeccable.cmd detect ...`).
Document all P0–P3 findings; fix any P0/P1/P2 findings (`impeccable/reference/polish.md`) and re-verify.

- [ ] **Step 2: Inspect every route in `browser-use` at 375px, 768px, and 1280px (light & dark mode)**

Read `C:\Users\Westen\.gemini\config\skills\browser-use\SKILL.md` first, then run `browser-use` against `http://localhost:4321` covering:
- Routes: `/`, `/projects`, `/projects/here`, `/projects/jb2k-mods`, `/projects/susg-voting-system`, `/about`, `/contact`, `/404`.
- Viewports: `375x812` (mobile), `768x1024` (tablet), `1280x800` (desktop) via CDP `Emulation.setDeviceMetricsOverride`.
- Color schemes: `light` and `dark` via CDP `Emulation.setEmulatedMedia(features=[{"name":"prefers-color-scheme","value":"dark"}])` and `"light"`.
- Checks:
  - Take screenshots across viewports and themes and inspect them visually via `read_file`.
  - Verify `document.documentElement.scrollWidth <= window.innerWidth` at all widths.
  - Verify zero console/page errors via `Runtime` / `Log` or report explicitly if any capability is unsupported.
  - Verify keyboard `Tab` order and visible `:focus-visible` outline by stepping focus with `press_key("Tab")` from the skip link through nav and cards.
  - Verify all internal links resolve cleanly (`status < 400`).

- [ ] **Step 3: Run `npx lighthouse` against `npm run preview`**

Run:
```powershell
npx.cmd lighthouse http://localhost:4321 --output=json --output=html --output-path=./.lighthouse-home --chrome-flags="--headless"
npx.cmd lighthouse http://localhost:4321/projects/here --output=json --output-path=./.lighthouse-project --chrome-flags="--headless"
```
Verify **Performance ≥ 95**, **Accessibility ≥ 95**, **Best Practices ≥ 95**, **SEO ≥ 95**. Fix any issues found, re-build, re-verify, and remove temporary `.lighthouse-*` report files before committing.

- [ ] **Step 4: Run `superpowers:verification-before-completion` final gates**

Stop preview server after checks, rebuild clean, and run:
```powershell
npx astro check
npm run build
npm test
git status -s
```
Expected: All checks pass with zero errors, zero warnings, clean git working tree (or clean final polish commit). Do not deploy (`wrangler pages deploy`) or connect a domain without explicit user approval.
