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
  assert.match(site, /eGetinnz/);
  assert.match(site, /Software Quality Assurance Intern/);
  assert.match(site, /Crawl4AI/);
  assert.match(site, /Trafilatura/);
  assert.match(site, /WesTech/);
  assert.match(site, /Tanjay City, Philippines/);
  assert.match(site, /2020/);
  assert.match(site, /SugarPy/);
  assert.match(site, /Foundation University/);
  assert.match(site, /Silliman University/);
  assert.match(site, /2021 – 2025/);
  assert.match(site, /2025 – 2027/);
  assert.match(site, /Bachelor of Science \(BS\) in Computer Science/);

  const expBlock = site.slice(site.indexOf('export const EXPERIENCE'), site.indexOf('export const EDUCATION'));
  assert.ok(
    expBlock.indexOf('eGetinnz') < expBlock.indexOf('SugarPy') &&
      expBlock.indexOf('SugarPy') < expBlock.indexOf('re:load') &&
      expBlock.indexOf('re:load') < expBlock.indexOf('WesTech'),
    'EXPERIENCE must be ordered newest start date first (eGetinnz -> SugarPy -> re:load -> WesTech)',
  );
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

test('global.css defines explicit prefers-reduced-motion: reduce rule disabling transitions', () => {
  const css = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
  assert.match(css, /transition:\s*none/);
});

test('ProjectCard uses compact horizontal row layout with a constrained side thumbnail on sm+ screens', () => {
  const card = fs.readFileSync(path.join(root, 'src/components/ProjectCard.astro'), 'utf8');
  assert.match(card, /\bsm:flex-row\b/, 'ProjectCard must use sm:flex-row for compact horizontal rows');
  assert.match(card, /\bsm:w-48\b/, 'ProjectCard cover thumbnail must be constrained to sm:w-48');
  assert.match(card, /aspect-\[16\/10\]/, 'ProjectCard cover thumbnail must enforce a uniform 16:10 aspect ratio');
  assert.match(card, /\bobject-cover\b/, 'ProjectCard cover thumbnail must use object-cover');
  assert.doesNotMatch(card, /w-\[calc\(100%\+/, 'ProjectCard must not use full-bleed cover banners');
  assert.match(card, /\bafter:inset-0\b/, 'ProjectCard title link must stretch across the card');
  assert.match(card, /TechBadge/, 'ProjectCard must render TechBadge stack pills with logos');
});

test('all three project cover PNGs share uniform 1472x920 (16:10) dimensions', () => {
  const covers = ['here.png', 'jb2k-mods.png', 'susg-voting-system.png'];
  for (const name of covers) {
    const buf = fs.readFileSync(path.join(root, 'src/assets/projects', name));
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    assert.equal(width, 1472, `${name} width must be 1472, got ${width}`);
    assert.equal(height, 920, `${name} height must be 920, got ${height}`);
  }
});

test('meta descriptions in site.ts and project frontmatter stay within 160 characters', () => {
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  const siteDescription = site.match(/description:\s*\r?\n?\s*'([^']+)'/)?.[1];
  assert.ok(siteDescription, 'SITE.description must exist');
  assert.ok(siteDescription.length <= 160, `SITE.description is ${siteDescription.length} chars`);

  for (const file of ['here.mdx', 'jb2k-mods.mdx', 'susg-voting-system.mdx']) {
    const body = fs.readFileSync(path.join(root, 'src/content/projects', file), 'utf8');
    const description = body.match(/^description:\s*"([^"]+)"/m)?.[1];
    assert.ok(description, `${file} must have a description`);
    assert.ok(description.length <= 160, `${file} description is ${description.length} chars`);
  }
});

test('audit fixes: tap targets, status-derived fallback, accurate copy, and documented tokens', () => {
  const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

  const css = read('src/styles/global.css');
  assert.match(css, /\.tap-target::before/, 'global.css must define a .tap-target hit-area expander');
  assert.match(css, /44px/, '.tap-target must expand hit areas to 44px');
  for (const rel of [
    'src/components/Header.astro',
    'src/components/Footer.astro',
    'src/components/ProjectCard.astro',
    'src/pages/contact.astro',
    'src/pages/index.astro',
  ]) {
    assert.match(read(rel), /tap-target/, `${rel} links must use .tap-target`);
  }

  const header = read('src/components/Header.astro');
  assert.match(header, /<ul[^>]*role="list"/, 'Header nav list must declare role="list"');

  const card = read('src/components/ProjectCard.astro');
  assert.match(card, /priority\?: boolean/, 'ProjectCard must accept a priority prop');

  const caseStudy = read('src/pages/projects/[slug].astro');
  assert.doesNotMatch(
    caseStudy,
    /Private deployment · Currently in development/,
    'Deployment fallback must derive from status instead of a hardcoded label',
  );

  assert.doesNotMatch(read('PRODUCT.md'), /`PHP 8\.2`/, 'PRODUCT.md must list SUSG as PHP 8.4');
  assert.match(read('src/content/projects/here.mdx').split('---')[2], /PDF/, 'Here! prose must mention PDF export');
  assert.doesNotMatch(read('src/pages/404.astro'), /case studies below/, '404 copy must not reference content below');

  const design = read('DESIGN.md');
  assert.match(design, /--badge-live-bg/, 'DESIGN.md must document status badge tokens');
  assert.match(design, /tap-target/, 'DESIGN.md must document the tap-target pattern');

  assert.match(read('src/components/TechBadge.astro'), /'html'/, 'TechBadge must have a dedicated HTML/CSS icon');
});

test('AmbientBackdrop and PixelCat components exist and honor motion, desktop, and pointer guardrails', () => {
  const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

  const backdrop = read('src/components/AmbientBackdrop.astro');
  assert.match(backdrop, /id="ambient-ascii"/, 'AmbientBackdrop must render #ambient-ascii canvas');
  assert.match(backdrop, /aria-hidden="true"/, 'AmbientBackdrop canvas must be aria-hidden');
  assert.match(backdrop, /pointer-events-none/, 'AmbientBackdrop canvas must be pointer-events-none');
  assert.match(backdrop, /prefers-reduced-motion: reduce/, 'AmbientBackdrop must respect prefers-reduced-motion');
  assert.match(backdrop, /visibilitychange/, 'AmbientBackdrop must pause when tab is hidden');

  const cat = read('src/components/PixelCat.astro');
  assert.match(cat, /id="meowtys-cat"/, 'PixelCat must render #meowtys-cat canvas');
  assert.match(cat, /id="cat-toggle"/, 'PixelCat must expose #cat-toggle corner button');
  assert.match(cat, /tap-target/, 'PixelCat toggle button must include .tap-target');
  assert.match(cat, /w-fit/, 'PixelCat toggle button must shrink-wrap to content width (w-fit)');
  assert.match(
    read('src/styles/global.css'),
    /\.tap-target:not\([^)]*\.fixed/,
    '.tap-target must exclude .fixed elements so unlayered CSS never overrides position: fixed',
  );
  assert.match(cat, /aria-pressed/, 'PixelCat toggle button must expose aria-pressed state');
  assert.match(cat, /min-width:\s*1024px/, 'PixelCat must be desktop-only (>=1024px)');
  assert.match(cat, /prefers-reduced-motion: reduce/, 'PixelCat must respect prefers-reduced-motion');
  assert.match(cat, /localStorage/, 'PixelCat must persist mute/hide toggle in localStorage');
  assert.doesNotMatch(cat, /steerAwayFromContent/, 'PixelCat must pass freely over page content without getting stuck');
  assert.match(cat, /'meow'/, 'PixelCat must support a meow state when clicked');
  assert.match(cat, /pointerdown/, 'PixelCat must listen for pointerdown clicks without blocking links');
  assert.match(cat, /id="cat-meow-label"/, 'PixelCat must render floating meow text element');
  assert.match(cat, />meow~</, 'PixelCat meow label must show meow~ text');
  assert.match(cat, /await\s+audioCtx\.resume\(\)/, 'PixelCat must await audioCtx.resume() before scheduling nodes');
  assert.match(cat, /MEOW_COOLDOWN_MS/, 'PixelCat must rate-limit repeated meow clicks with a cooldown');
  assert.match(cat, /sessionStorage/, 'PixelCat must persist position across page navigations in sessionStorage');
  assert.match(cat, /curiosity_cat_state/, 'PixelCat must save and restore curiosity_cat_state');
  assert.match(cat, /pagehide/, 'PixelCat must flush position to sessionStorage before page unload');

  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /AmbientBackdrop/, 'BaseLayout must include AmbientBackdrop');
  assert.match(layout, /PixelCat/, 'BaseLayout must include PixelCat');
  assert.doesNotMatch(read('PRODUCT.md'), /Zero client-side JavaScript by default\./, 'PRODUCT.md must reflect lightweight ambient/cat enhancement instead of strict zero JS');
  assert.match(read('DESIGN.md'), /ambient-ascii|Ambient Backdrop/i, 'DESIGN.md must document ambient backdrop & pixel cat surface');
});

test('Header theme toggle, FOUC guard, CSS overrides, and live canvas/cat sync exist', () => {
  const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

  const header = read('src/components/Header.astro');
  assert.match(header, /id="theme-toggle"/, 'Header must render #theme-toggle button');
  assert.match(header, /role="switch"/, 'Header theme toggle must expose role="switch"');
  assert.match(header, /tap-target/, 'Header theme toggle must include .tap-target');
  assert.match(header, /theme-icon-sun/, 'Header theme toggle must include sun icon');
  assert.match(header, /theme-icon-moon/, 'Header theme toggle must include moon icon');
  assert.match(header, /curiosity_theme/, 'Header theme toggle must persist curiosity_theme in localStorage');

  const head = read('src/components/BaseHead.astro');
  assert.match(head, /curiosity_theme/, 'BaseHead must apply saved curiosity_theme before paint to avoid FOUC');
  assert.match(head, /dataset\.theme/, 'BaseHead boot script must set document.documentElement.dataset.theme');

  const css = read('src/styles/global.css');
  assert.match(css, /:root\[data-theme='dark'\]|:root\[data-theme="dark"\]/, 'global.css must define explicit dark theme tokens');
  assert.match(css, /not\(\[data-theme=["']light["']\]\)/, 'global.css dark media query must respect explicit light override');

  assert.match(read('src/components/AmbientBackdrop.astro'), /dataset\.theme/, 'AmbientBackdrop must read explicit data-theme override');
  assert.match(read('src/components/PixelCat.astro'), /MutationObserver/, 'PixelCat must redraw when data-theme changes');
  assert.match(read('DESIGN.md'), /theme-toggle|data-theme/, 'DESIGN.md must document the header theme toggle');
});

test('about.astro uses native collapsible details cards with the first Experience and Education items open', () => {
  const about = fs.readFileSync(path.join(root, 'src/pages/about.astro'), 'utf8');
  assert.match(about, /<details[\s\S]*open=\{index === 0\}/, 'about.astro must expand the first item by default');
  assert.match(about, /<summary\b/, 'about.astro must use accessible <summary> rows inside <details>');
  assert.match(about, /accordion-chevron/, 'about.astro summaries must render an accordion chevron');
});

test('GitHubActivity component, github.json data, and heatmap CSS tokens exist and render on homepage', () => {
  const ghJsonPath = path.join(root, 'src/data/github.json');
  const ghCompPath = path.join(root, 'src/components/GitHubActivity.astro');
  assert.ok(fs.existsSync(ghJsonPath), 'src/data/github.json must exist');
  assert.ok(fs.existsSync(ghCompPath), 'src/components/GitHubActivity.astro must exist');

  const ghData = JSON.parse(fs.readFileSync(ghJsonPath, 'utf8'));
  assert.ok(typeof ghData.total === 'number' && ghData.total >= 1000, 'github.json must hold valid total contributions');
  assert.ok(ghData.weeks.length >= 52 && ghData.weeks.length <= 54, 'github.json must hold 52-54 weeks of contributions');

  const comp = fs.readFileSync(ghCompPath, 'utf8');
  assert.match(comp, /GitHub Activity/, 'GitHubActivity must render GitHub Activity heading');
  assert.match(comp, /@Meowtys/, 'GitHubActivity must link to @Meowtys');
  assert.match(comp, /tap-target/, 'GitHubActivity profile link must use .tap-target');
  assert.match(comp, /border-hairline/, 'GitHubActivity Variation A must wrap the calendar in a border-hairline card');
  assert.match(comp, /id="gh-hover-status"/, 'GitHubActivity must expose #gh-hover-status live readout');

  const css = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  for (let level = 0; level <= 4; level++) {
    assert.match(css, new RegExp(`--gh-${level}:`), `global.css must define --gh-${level} token`);
  }
  assert.match(css, /\.gh-cell\[data-level=['"]4['"]\]/, 'global.css must map .gh-cell[data-level] fills');

  const indexPage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  const projectsIdx = indexPage.indexOf('Projects');
  const ghIdx = indexPage.indexOf('<GitHubActivity');
  const stackIdx = indexPage.indexOf('Core Stack');
  assert.ok(
    projectsIdx !== -1 && ghIdx > projectsIdx && ghIdx < stackIdx,
    'index.astro must render <GitHubActivity /> between Projects and Core Stack',
  );
});

test('contact.astro has 1-click email copy button and case study pages provide zero-dependency image lightbox', () => {
  const contact = fs.readFileSync(path.join(root, 'src/pages/contact.astro'), 'utf8');
  assert.match(contact, /id="copy-email-btn"/, 'contact.astro must have #copy-email-btn');
  assert.match(contact, /id="copy-email-text"/, 'contact.astro must have #copy-email-text');
  assert.match(contact, /data-email=/, 'contact.astro copy button must carry data-email');
  assert.match(contact, /navigator\.clipboard\.writeText/, 'contact.astro must copy email using clipboard API');

  const caseStudy = fs.readFileSync(path.join(root, 'src/pages/projects/[slug].astro'), 'utf8');
  assert.match(caseStudy, /id="image-lightbox"/, 'projects/[slug].astro must render #image-lightbox dialog');
  assert.match(caseStudy, /id="lightbox-close"/, 'projects/[slug].astro must render #lightbox-close button');
  assert.match(caseStudy, /id="lightbox-img"/, 'projects/[slug].astro must render #lightbox-img preview');
  assert.match(caseStudy, /lightbox-trigger/, 'projects/[slug].astro must wrap zoomable figures in .lightbox-trigger buttons');
  assert.match(caseStudy, /showModal\(\)/, 'projects/[slug].astro must use native showModal() API');
});

test('sync-github-activity script and GitHub Actions workflows exist and validate', () => {
  const scriptPath = path.join(root, 'scripts/sync-github-activity.mjs');
  const workflowPath = path.join(root, '.github/workflows/sync-github-activity.yml');
  const ciPath = path.join(root, '.github/workflows/ci.yml');
  const pkgPath = path.join(root, 'package.json');

  assert.ok(fs.existsSync(scriptPath), 'scripts/sync-github-activity.mjs must exist');
  assert.ok(fs.existsSync(workflowPath), '.github/workflows/sync-github-activity.yml must exist');
  assert.ok(fs.existsSync(ciPath), '.github/workflows/ci.yml must exist');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.equal(pkg.scripts?.['sync:github'], 'node scripts/sync-github-activity.mjs', 'package.json must declare sync:github script');

  const workflow = fs.readFileSync(workflowPath, 'utf8');
  assert.match(workflow, /cron:\s*['"]0 0 \* \* 0['"]/, 'sync-github-activity.yml must run weekly on cron');
  assert.match(workflow, /workflow_dispatch/, 'sync-github-activity.yml must support manual trigger');
  assert.match(workflow, /npm run sync:github/, 'sync-github-activity.yml must invoke npm run sync:github');
});

test('BaseHead and global.css load clean sans-serif (Geist) and JetBrains Mono web fonts without Instrument Serif', () => {
  const head = fs.readFileSync(path.join(root, 'src/components/BaseHead.astro'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  assert.match(head, /fonts\.googleapis\.com/);
  assert.match(head, /family=Geist/);
  assert.match(head, /JetBrains\+Mono/);
  assert.doesNotMatch(head, /Instrument\+Serif/);
  assert.match(css, /'Geist'/);
  assert.doesNotMatch(css, /Instrument Serif/);
});

test('site.ts exports EXPLORING, CORE_STACK, and getStatusBadgeClass, and TechBadge component exists with SVG logos', () => {
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  assert.match(site, /export const EXPLORING/);
  assert.match(site, /export const CORE_STACK/);
  assert.match(site, /export function getStatusBadgeClass/);
  assert.doesNotMatch(site, /I'm Westen,/, 'SITE.bio should not repeat name right below hero h1');

  const card = fs.readFileSync(path.join(root, 'src/components/ProjectCard.astro'), 'utf8');
  const caseStudy = fs.readFileSync(path.join(root, 'src/pages/projects/[slug].astro'), 'utf8');
  assert.match(card, /getStatusBadgeClass/, 'ProjectCard must use shared getStatusBadgeClass helper');
  assert.doesNotMatch(card, /badge-status badge-live/, 'ProjectCard must not inline duplicate badge ternary');
  assert.match(caseStudy, /getStatusBadgeClass/, 'Case study page must use shared getStatusBadgeClass helper');
  assert.doesNotMatch(caseStudy, /badge-status badge-live/, 'Case study page must not inline duplicate badge ternary');

  const badgePath = path.join(root, 'src/components/TechBadge.astro');
  assert.ok(fs.existsSync(badgePath), 'src/components/TechBadge.astro must exist');
  const badge = fs.readFileSync(badgePath, 'utf8');
  assert.match(badge, /<svg\b/, 'TechBadge must render inline SVG logos');
  const evenOddMatches = badge.match(/fill-rule="evenodd"/g) ?? [];
  assert.ok(
    evenOddMatches.length >= 2,
    'TechBadge TypeScript and JavaScript icons must use fill-rule="evenodd" so inner TS/JS letters cut out instead of rendering as a solid square',
  );

  const indexPage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  assert.match(indexPage, /Experience & Community/, 'Home page must title the experience section Experience & Community');
  assert.doesNotMatch(indexPage, /Hardware & Community/, 'Home page must not title the experience section Hardware & Community');
});
