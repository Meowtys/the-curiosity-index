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
  assert.match(site, /Tanjay City, Philippines/);
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

test('site.ts exports EXPLORING and CORE_STACK and TechBadge component exists with SVG logos', () => {
  const site = fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8');
  assert.match(site, /export const EXPLORING/);
  assert.match(site, /export const CORE_STACK/);
  assert.doesNotMatch(site, /I'm Westen,/, 'SITE.bio should not repeat name right below hero h1');
  const badgePath = path.join(root, 'src/components/TechBadge.astro');
  assert.ok(fs.existsSync(badgePath), 'src/components/TechBadge.astro must exist');
  const badge = fs.readFileSync(badgePath, 'utf8');
  assert.match(badge, /<svg\b/, 'TechBadge must render inline SVG logos');
});
