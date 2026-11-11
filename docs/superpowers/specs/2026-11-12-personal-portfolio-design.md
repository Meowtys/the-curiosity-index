# Personal Portfolio Website ("The Curiosity Index") — Design Specification

**Date:** 2026-11-12
**Author:** Westen Dasig (`@Meowtys`)
**Repository:** `the-curiosity-index`
**Approach:** Editorial Single-Column Index (Approach 1 — inspired by `paco.fyi`, `flawlessnitin.com`, `remi-jara.fr`, and `manishtamang.com`)

---

## 1. Purpose, Audience & Goals

### Primary Intent
Build a fast, accessible, low-maintenance personal portfolio website pairing **Westen Dasig** as the primary identity with **The Curiosity Index** as the creative direction and subtitle.

### Target Audience
1. **Primary (Peers & Builders — Digital Index / Showcase):** Showcase real software and hardware builds, architectural decisions, community involvement, and technical curiosity through substantive MDX case studies.
2. **Secondary (Recruiters & Hiring Managers):** Provide immediate clarity on who Westen is, what he builds (`Laravel`, `React`, `Flutter`, `Python`, `PHP`, `TypeScript`), his academic and community background in Dumaguete, Philippines, and direct ways to get in touch.

### Non-Goals
- No heavy animations, splash preloaders, or gimmicky scroll-jacking.
- No client-side JavaScript bundles by default (no React/Vue/Svelte islands, no client-side theme toggle scripts, no analytics scripts unless explicitly requested later).
- No CMS, database, or backend server; no contact form submission endpoints.
- No public repository links for private source repositories (`here-next`, `here-web`, `jb2k-website`, `susg-voting-system`).

---

## 2. Technology Stack & Constraints

- **Framework:** Astro (static output `output: 'static'`, no SSR adapter) with strict TypeScript (`astro/tsconfigs/strict`).
- **Styling:** Tailwind CSS v4 configured via `npx astro add tailwind` (`@tailwindcss/vite`) + `@tailwindcss/typography` for MDX case-study prose.
- **Content:** `@astrojs/mdx` with Astro's typed Content Layer API (`src/content.config.ts` using `glob` loader over `src/content/projects/*.mdx` and Zod validation).
- **SEO & Discovery:** `@astrojs/sitemap` with `site: 'https://the-curiosity-index.pages.dev'` in `astro.config.mjs` (ready to update if a custom domain is connected later).
- **Deployment Target:** Cloudflare Pages via Wrangler CLI (static `dist/` directory).
- **Visual Direction & Design System:**
  - During implementation setup, visual direction (palette, typography pairing, spacing tokens, and favicon) will be selected with `ui-ux-pro-max` and codified into `PRODUCT.md` and `DESIGN.md` using `impeccable` before building UI components.
  - Light and dark themes follow system preference automatically via CSS `prefers-color-scheme` (`color-scheme: light dark` and semantic CSS custom properties).
  - Motion is static/subtle by default and disabled under `@media (prefers-reduced-motion: reduce)`.

---

## 3. Information Architecture & Routes

All pages render inside a centered single-column reading container (`max-w-[46rem]` / `736px` with responsive `px-5 sm:px-8` horizontal padding) wrapped by `src/layouts/BaseLayout.astro`.

### Global Layout (`src/layouts/BaseLayout.astro`)
- **Skip Link:** `<a href="#main-content">` visually hidden until focused (`sr-only focus:not-sr-only`), jumping straight to `<main id="main-content">`.
- **Header (`src/components/Header.astro`):**
  - Left: Brand link to `/` displaying **Westen Dasig** and subtitle **`The Curiosity Index`**.
  - Right: Semantic `<nav aria-label="Primary">` with links to `/projects`, `/about`, and `/contact`, marking the active route with `aria-current="page"`.
- **Footer (`src/components/Footer.astro`):**
  - Left: Copyright & location note (`Westen Dasig · Dumaguete, Philippines`).
  - Right: Direct links (`Email`, `GitHub`, `LinkedIn`).

### Route Specifications (`src/pages/`)

#### 3.1 Home (`src/pages/index.astro` → `/`)
1. **Hero / Identity Section:**
   - `h1`: **Westen Dasig** with subtitle **The Curiosity Index**.
   - Role & location line: *CS Student at Foundation University Dumaguete · Full-Stack Builder*.
   - Intro bio: *"I'm Westen, a computer science student interested in exploring different areas of technology. I spend my time building software, working with hardware, and learning about things that catch my curiosity."*
   - Quick action links: `Read case studies →` (`/projects`), `About & background` (`/about`), and direct email (`mailto:westendasig2003@gmail.com`).
2. **Selected Projects Section (`h2: Selected Work`):**
   - Renders the 3 featured projects ordered by `order` (`1` Here!, `2` JB2K Mods, `3` SUSG Voting System) using `ProjectCard.astro`.
   - Each card displays status badge (`Open Beta`, `Live`, `In Development`), timeline (`2023 · Rebuilt 2026`, `2026 · Production`, `2024 · Rebuilt 2026`), title, subtitle, concise description, stack tags, primary link to `/projects/[slug]`, and secondary external link to `liveUrl` (when defined).
3. **Curiosity & Community Section (`h2: Curiosity & Community`):**
   - Brief overview of hardware tinkering and repair (**WesTech**, 2020–Present) alongside local tech community involvement in Dumaguete (hosted the **SugarPy Meetup Event** in Sept 2025; Teaching Assistant at **re:load Agentic AI Edition** assisting on Python & LangGraph AI agents).
   - Link to `/about` for the full background.
4. **Contact Callout Section (`h2: Get in Touch`):**
   - Direct links to `mailto:westendasig2003@gmail.com`, LinkedIn, and GitHub.

#### 3.2 Projects Index (`src/pages/projects/index.astro` → `/projects`)
- `h1`: **Projects & Case Studies** with a short intro on building across mobile, web, and campus infrastructure.
- Full list of entries from the `projects` collection sorted by `order` ascending, rendered via `ProjectCard.astro`.

#### 3.3 Project Case Study (`src/pages/projects/[slug].astro` → `/projects/[slug]`)
- Statically generated via `getStaticPaths()` from the `projects` content collection.
- **Structured Case Study Header:**
  - Back link (`← All projects` to `/projects`).
  - Status badge (`Open Beta`, `Live`, `In Development`), category badge (`Software`), and timeline (`2023 · Rebuilt 2026`, `2024 · Rebuilt 2026`, `2026 · Production`).
  - `h1`: Project `title` and `subtitle`.
  - Metadata grid: **Role**, **Timeline**, **Status**, **Stack** tags, and **Live Site** link (or `"Private build / In development"` notice when `liveUrl` is absent).
  - Optional cover/diagram visual (`cover` + `coverAlt`) rendered via `<Image />` from `astro:assets` if/when supplied (none at launch).
- **MDX Body (`<article class="prose ...">`):**
  - Styled with `@tailwindcss/typography` adapted to the site's light/dark CSS custom properties.
- **Case Study Footer Navigation:**
  - Previous / Next project links for sequential reading.

#### 3.4 About (`src/pages/about.astro` → `/about`)
- `h1`: **About Westen Dasig**.
- **Narrative Bio:** Expanded story covering full-stack building, software quality/testing, hardware repair & custom PC building (**WesTech**), and learning driven by curiosity.
- **Experience & Community (`h2: Experience & Community`):**
  - **WesTech (2020–Present)** — Local hardware repair and custom PC business repairing computers and phones and building custom PCs.
  - **SugarPy Meetup Event (Sept 2025)** — Hosted the SugarPy Meetup event (Negros Island Python User Group) at DICT Digital Transformation Center in Dumaguete City, bringing together students and engineers for Python, FastAPI, and RAG/Generative AI workshops.
  - **re:load Agentic AI Edition (Sept 2025)** — Teaching Assistant supporting the hands-on workshop *"Building AI Agents with Python using LangGraph"* led by Jouella Fabe (Senior Software Engineer, PagerDuty).
- **Education (`h2: Education`):**
  - **Foundation University** (Dumaguete City, Philippines) — Bachelor of Science (BS) in Computer Science.
- **Technical Toolbox (`h2: Stack & Tools`):**
  - **Languages & Backend:** PHP 8.2–8.4, Laravel 13, Python, Dart, TypeScript, JavaScript, SQL (MariaDB / MySQL / SQLite).
  - **Frontend & Mobile:** Flutter, React 19, Inertia.js, Astro, Tailwind CSS v4, HTML5/CSS3.
  - **Data, ML & Cloud:** Google ML Kit, TensorFlow Lite (MobileFaceNet), Firebase (Auth, Cloud Firestore, Security Rules), Railway, Vercel, Cloudflare Pages.
  - **Quality & Testing:** PHPUnit, PHPStan (Larastan Level 7), Laravel Pint, Flutter Test, Firestore Rules Testing, WCAG 2.2 AA auditing.

#### 3.5 Contact (`src/pages/contact.astro` → `/contact`)
- `h1`: **Contact**.
- Short note inviting messages about software/hardware projects, QA/full-stack opportunities, or local tech community events in Dumaguete.
- Semantic definition list / card rows with direct links:
  - **Email:** [`westendasig2003@gmail.com`](mailto:westendasig2003@gmail.com)
  - **LinkedIn:** [`linkedin.com/in/westen-dasig`](https://www.linkedin.com/in/westen-dasig/)
  - **GitHub:** [`github.com/Meowtys`](https://github.com/Meowtys)

#### 3.6 Not Found (`src/pages/404.astro` → `/404.html`)
- Semantic 404 page with a clear message and link back to `/`.

---

## 4. Content Collection Schema & Case Studies

### 4.1 Content Collection Configuration (`src/content.config.ts`)
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
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
    }),
});

export const collections = { projects };
```

### 4.2 Initial MDX Case Studies (`src/content/projects/`)

1. **`src/content/projects/here.mdx` — Here! (`order: 1`)**
   - **Metadata:** `status: "Open Beta"`, `timeline: "2023 · Rebuilt 2026"`, `category: "Software"`, `role: "Creator & Lead Developer"`, `liveUrl: "https://youre-here.vercel.app"`, `tags: ["Flutter", "TensorFlow Lite", "Google ML Kit", "Firebase Firestore", "Astro"]`.
   - **Case Study Sections:**
     - *The Problem:* Long queues and manual spreadsheet encoding at student organization general assemblies and campus events, plus unreliable venue Wi-Fi.
     - *Why the 2023 Prototype Stalled:* Originally started in 2023 (with Sheikha Encabo and Earlan Josh Sabillano) using AWS Rekognition via Cloud Functions — incurred per-scan cloud API costs and failed when campus connectivity dropped.
     - *The 2026 Ground-Up Rebuild (100% On-Device Biometrics):* Replaced cloud vision calls with Google ML Kit face detection and an embedded MobileFaceNet TFLite model generating face embeddings directly on the checker's Android phone, reducing per-scan cloud cost to zero.
     - *Offline-First Multi-Checker Sync & Governance:* Pre-caches enrolled biometric templates (`Synced · Offline ready`), keys attendance records by `$uid~$timestamp` to eliminate multi-entrance race conditions when syncing to Cloud Firestore, enforces consent-first registration/deletion, and provides Owner/Admin/Member RBAC, audit logs, and check-in velocity analytics.

2. **`src/content/projects/jb2k-mods.mdx` — JB2K Mods (`order: 2`)**
   - **Metadata:** `status: "Live"`, `timeline: "2026 · Production"`, `category: "Software"`, `role: "Full-Stack Developer"`, `liveUrl: "https://jb2k.shop"`, `tags: ["Laravel 13", "PHP 8.4", "Inertia 3", "React 19", "TypeScript", "Tailwind CSS 4", "SQLite"]`.
   - **Case Study Sections:**
     - *The Problem:* Managing custom NBA 2K (2K25, 2K26, 2K27) player cyberface commissions previously relied on scattered DMs without structured specifications or status visibility for buyers.
     - *Public Commission & Live Preview Flow:* Built a guided commission intake (`/commission`) with a real-time interactive player card preview that updates as the requester fills in player name, game version, mod type (Modium vs. non-Modium), Imgur reference links, and Ko-fi username.
     - *Order Tracking & Persistent Audio Experience:* Generates a unique `JB2K-XXXXXXXX` tracking ID for `/track` (`Submitted → In review → In progress → Completed`) with optional Resend email confirmation, plus a persistent Inertia 3 + React 19 soundtrack dock that continues playing across page navigations.
     - *Hardened Admin Queue & CI Quality Gates:* Private admin dashboard for reviewing, filtering, and advancing commissions and managing soundtrack playlists, secured with Laravel Fortify two-factor authentication and passkeys, validated by PHPStan (Larastan level 7), Laravel Pint, and PHPUnit feature tests, deployed on Railway with a persistent SQLite volume.

3. **`src/content/projects/susg-voting-system.mdx` — SUSG Voting System (`order: 3`)**
   - **Metadata:** `status: "In Development"`, `timeline: "2024 · Rebuilt 2026"`, `category: "Software"`, `role: "Project Lead & Maintainer"`, `tags: ["PHP 8.2", "MariaDB", "Tailwind CSS 4", "Vanilla JS", "WCAG 2.2 AA"]` (`liveUrl` omitted while in development).
   - **Case Study Sections:**
     - *The Problem:* Replacing Silliman University Student Government's LMS-based voting workflow with a dedicated, mobile-friendly election platform where students vote from any phone or laptop and Comelec manages the entire election from an admin dashboard.
     - *From 2024 Team Project to 2026 Rebuild:* Started in 2024 as a student team project and rebuilt/expanded in 2026 with strict security, accessibility, and operational tooling.
     - *Security & Server-Enforced Ballot Integrity:* Enforces one ballot per student per election (with explicit abstain support and pre-submit ballot review), derives college scoping strictly from the voter's server-side database record (ignoring client-supplied `college_id`), protects all state changes with CSRF tokens, bcrypt password hashing, rate-limited login throttling, and `.htaccess` isolation of non-public directories.
     - *Atomic Live-Results Caching & 843-Check Regression Suite:* Serves real-time election results to both voters and Comelec through `LiveResultsCache.php` using exclusive file locks and atomic file replacement outside the web root, backed by WCAG 2.2 AA compliance and 18 automated regression check scripts (843 checks).

---

## 5. File Tree & Component Architecture

```text
the-curiosity-index/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── PRODUCT.md                         # Created via impeccable init
├── DESIGN.md                          # Created via impeccable init
├── public/
│   ├── favicon.svg                    # Crisp SVG favicon (light/dark adaptive)
│   └── robots.txt                     # Allows indexing + points to sitemap-index.xml
└── src/
    ├── content.config.ts              # Zod schema for projects collection
    ├── components/
    │   ├── BaseHead.astro             # Title, meta description, canonical, OG tags, favicon
    │   ├── Header.astro               # Brand + primary navigation
    │   ├── Footer.astro               # Colophon + direct contact links
    │   └── ProjectCard.astro          # Hairline-bordered project summary card
    ├── content/
    │   └── projects/
    │       ├── here.mdx
    │       ├── jb2k-mods.mdx
    │       └── susg-voting-system.mdx
    ├── data/
    │   └── site.ts                    # Author bio, social links, experience, education, skills
    ├── layouts/
    │   └── BaseLayout.astro           # Semantic HTML shell, skip-link, Header, <main>, Footer
    ├── pages/
    │   ├── index.astro                # Home page
    │   ├── about.astro                # About, community, experience, education, stack
    │   ├── contact.astro              # Direct contact links (mailto, LinkedIn, GitHub)
    │   ├── 404.astro                  # Custom 404 page
    │   └── projects/
    │       ├── index.astro            # Projects index page
    │       └── [slug].astro           # MDX case study detail page
    └── styles/
        └── global.css                 # Tailwind v4 @import "tailwindcss"; @plugin "@tailwindcss/typography"; + design tokens
```

---

## 6. Accessibility, Performance & SEO Standards

1. **Zero Client JS by Default:** No `<script>` tags emitted on any route.
2. **Theme & Motion:**
   - Light and dark mode tokens defined in CSS custom properties using `@media (prefers-color-scheme: dark)` and `color-scheme: light dark`.
   - `@media (prefers-reduced-motion: reduce)` disables all transitions and animations.
3. **Accessibility (WCAG 2.2 AA):**
   - Contrast ratio ≥ 4.5:1 for normal text and ≥ 3:1 for large text and UI borders/badges in both light and dark modes.
   - Visible `:focus-visible` outline (`2px solid` accent color with `2px` offset) on every link and interactive element.
   - Strict heading hierarchy (`h1` once per page, sequential `h2` → `h3`), landmark elements (`<header>`, `<nav>`, `<main id="main-content">`, `<article>`, `<footer>`), and descriptive link text.
4. **Per-Page Metadata (`src/components/BaseHead.astro`):**
   - Unique `<title>` (`<Page Title> — Westen Dasig | The Curiosity Index`), `<meta name="description">`, `<link rel="canonical" href={canonicalURL}>`, Open Graph (`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, and optional `og:image`), and Twitter card metadata on every page.

---

## 7. Verification & Acceptance Criteria ("Done" Definition)

The project is complete only when all of the following pass with fresh evidence:
1. **Type & Astro Check:** `npx astro check` reports `0 errors`, `0 warnings`, `0 hints`.
2. **Production Build:** `npm run build` exits `0` and outputs static HTML, optimized assets, and `sitemap-index.xml` in `dist/`.
3. **Visual & Interactive Verification (`browser-use`):**
   - Every route (`/`, `/projects`, `/projects/here`, `/projects/jb2k-mods`, `/projects/susg-voting-system`, `/about`, `/contact`, `/404`) inspected against `npm run preview` at **mobile (`375px`)**, **tablet (`768px`)**, and **desktop (`1280px`)** widths in both **light** and **dark** modes.
   - Verified zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`), intact links, logical keyboard `Tab` order, visible `:focus-visible` rings, and zero console errors.
4. **Lighthouse Audit (`npx lighthouse`):**
   - Run against `npm run preview` and score **≥ 95** in all four categories: **Performance**, **Accessibility**, **Best Practices**, and **SEO**.
