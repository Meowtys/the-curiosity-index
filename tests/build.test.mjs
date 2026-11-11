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

    // Verify heading levels never skip (e.g. h1 -> h3 without h2)
    const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      assert.ok(
        levels[i] <= levels[i - 1] + 1,
        `${rel} skipped heading level from h${levels[i - 1]} to h${levels[i]}`,
      );
    }

    if (rel === '404.html') {
      assert.match(html, /<meta\s+name="robots"\s+content="noindex"/i, '404.html must be noindex');
    } else {
      assert.doesNotMatch(html, /<meta\s+name="robots"\s+content="noindex"/i, `${rel} must not be noindex`);
    }

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
