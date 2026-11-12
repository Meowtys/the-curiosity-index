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

test('every built page ships only tiny self-hosted Astro module JS, required SEO/OG tags, single h1, skip link, and valid internal links', () => {
  const titles = new Set();
  for (const rel of expectedPages) {
    const html = fs.readFileSync(path.join(distDir, rel), 'utf8');

    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    assert.ok(scripts.length > 0 && scripts.length <= 5, `${rel} expected 1-5 lightweight scripts, got ${scripts.length}`);
    let pageJsBytes = 0;
    for (const [, attrs, inlineBody] of scripts) {
      const srcMatch = attrs.match(/src="([^"]+)"/i);
      if (srcMatch) {
        assert.match(srcMatch[1], /^\/_astro\/[^"]+\.js$/, `${rel} must not load third-party scripts: ${srcMatch[1]}`);
        const jsPath = path.join(distDir, srcMatch[1].replace(/^\//, ''));
        assert.ok(fs.existsSync(jsPath), `Missing bundled script in dist: ${srcMatch[1]}`);
        pageJsBytes += fs.statSync(jsPath).size;
      } else {
        assert.match(
          inlineBody,
          /ambient-ascii|meowtys-cat|theme-toggle|curiosity_theme|gh-hover-status/,
          `${rel} inline script must only be ambient, cat, theme, or GitHub heatmap hover controller`,
        );
        pageJsBytes += Buffer.byteLength(inlineBody, 'utf8');
      }
    }
    assert.ok(pageJsBytes <= 10 * 1024, `${rel} total client JS must stay <= 10 KB, got ${pageJsBytes} bytes`);
    assert.match(html, /id="theme-toggle"/, `${rel} missing #theme-toggle switch`);
    assert.match(html, /role="switch"/, `${rel} missing role="switch" on theme toggle`);
    assert.match(html, /id="ambient-ascii"/, `${rel} missing #ambient-ascii backdrop canvas`);
    assert.match(html, /id="meowtys-cat"/, `${rel} missing #meowtys-cat companion canvas`);
    assert.match(html, /id="cat-toggle"/, `${rel} missing #cat-toggle button`);
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
    assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/westendasig\.pages\.dev\//i, `${rel} missing canonical URL`);
    assert.match(html, /<meta\s+property="og:title"\s+content="[^"]+"/i, `${rel} missing og:title`);
    assert.match(html, /<meta\s+property="og:description"\s+content="[^"]+"/i, `${rel} missing og:description`);
    if (rel !== '404.html') {
      const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="https:\/\/westendasig\.pages\.dev(\/[^"]+)"/i);
      assert.ok(ogImageMatch?.[1], `${rel} missing og:image tag`);
      assert.match(html, /<meta\s+name="twitter:card"\s+content="summary_large_image"/i, `${rel} missing summary_large_image twitter:card`);
      assert.match(html, /<meta\s+name="twitter:image"\s+content="https:\/\/westendasig\.pages\.dev\/[^"]+"/i, `${rel} missing twitter:image tag`);
      const ogAssetRel = ogImageMatch[1].replace(/^\//, '');
      assert.ok(fs.existsSync(path.join(distDir, ogAssetRel)), `${rel} og:image points to missing file in dist: ${ogImageMatch[1]}`);
    }
    assert.doesNotMatch(html, /href="undefined"|src="undefined"/i, `${rel} contains undefined link/asset`);

    for (const match of html.matchAll(/href="(\/(?!\/)[^"#?]*)/g)) {
      const target = match[1];
      if (target === '/' || target.startsWith('/favicon')) continue;
      // Cloudflare Pages 308-redirects /page to /page/, so page links must carry the slash.
      if (!/\.[a-z0-9]+$/i.test(target)) {
        assert.ok(target.endsWith('/'), `${rel} links to ${target} without a trailing slash`);
      }
      const clean = target.replace(/^\/|\/$/g, '');
      const hasFile = fs.existsSync(path.join(distDir, clean)) || fs.existsSync(path.join(distDir, clean, 'index.html'));
      assert.ok(hasFile, `${rel} has broken internal link: ${target}`);
    }
  }
  assert.equal(titles.size, expectedPages.length, 'Every page must have a unique <title>');
});

test('public pages ship short meta descriptions, social image alt text, and an eager first cover', () => {
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  for (const rel of expectedPages.filter((p) => p !== '404.html')) {
    const html = fs.readFileSync(path.join(distDir, rel), 'utf8');
    const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] ?? '');
    assert.ok(description.length <= 160, `${rel} meta description is ${description.length} chars`);
    assert.match(html, /<meta\s+property="og:image:alt"\s+content="[^"]+"/i, `${rel} missing og:image:alt`);
    assert.match(html, /<meta\s+name="twitter:image:alt"\s+content="[^"]+"/i, `${rel} missing twitter:image:alt`);
  }

  const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const homeHeader = homeHtml.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? '';
  assert.match(homeHeader, /aria-current="page"/, 'home brand link must carry aria-current="page" on /');

  for (const rel of ['index.html', 'projects/index.html']) {
    const html = fs.readFileSync(path.join(distDir, rel), 'utf8');
    const firstImg = html.match(/<img\b[^>]*>/i)?.[0] ?? '';
    assert.match(firstImg, /loading="eager"/, `${rel} first project cover must load eagerly`);
    assert.match(firstImg, /fetchpriority="high"/, `${rel} first project cover must use fetchpriority="high"`);
  }
});

test('sitemap excludes 404 and includes all public routes', () => {
  const indexXml = fs.readFileSync(path.join(distDir, 'sitemap-index.xml'), 'utf8');
  const chunkMatch = indexXml.match(/<loc>https:\/\/westendasig\.pages\.dev\/([^<]+)<\/loc>/);
  assert.ok(chunkMatch?.[1], 'sitemap-index.xml must reference a sitemap file');
  const sitemapXml = fs.readFileSync(path.join(distDir, chunkMatch[1]), 'utf8');
  assert.match(sitemapXml, /\/projects\/here\/?</);
  assert.match(sitemapXml, /\/projects\/jb2k-mods\/?</);
  assert.match(sitemapXml, /\/projects\/susg-voting-system\/?</);
  assert.match(sitemapXml, /\/about\/?</);
  assert.match(sitemapXml, /\/contact\/?</);
  assert.doesNotMatch(sitemapXml, /\/404/);
});

test('built home and case study pages include Currently Exploring, Core Stack, and SVG tech stack logos', () => {
  const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  assert.match(homeHtml, /Currently Exploring/i, 'index.html must include Currently Exploring section');
  assert.match(homeHtml, /Core Stack/i, 'index.html must include Core Stack section');
  assert.match(homeHtml, /<svg\b/i, 'index.html must include inline SVG stack logos');

  const hereHtml = fs.readFileSync(path.join(distDir, 'projects/here/index.html'), 'utf8');
  assert.match(hereHtml, /<svg\b/i, 'case study page must include inline SVG stack logos');

  const homeHeader = homeHtml.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? '';
  assert.match(homeHeader, />WD</, 'home header must include WD monogram badge');
  assert.match(homeHeader, /The Curiosity Index/, 'home header must include The Curiosity Index');
  assert.doesNotMatch(homeHeader, /Westen Dasig/, 'home header must not repeat Westen Dasig above hero h1');

  assert.match(homeHtml, /Experience &amp; Community|Experience & Community/, 'home page must show Experience & Community heading');
  assert.doesNotMatch(homeHtml, /Hardware &amp; Community|Hardware & Community/, 'home page must not show Hardware & Community heading');
  assert.match(homeHtml, /eGetinnz/, 'home page must include eGetinnz internship');
  assert.match(homeHtml, /GitHub Activity/, 'home page must include GitHub Activity section');
  assert.match(homeHtml, /1,354<\/span>\s+contributions on GitHub in the last year\./, 'home page must include a space between 1,354 and contributions');
  assert.match(homeHtml, /@Meowtys/, 'home page GitHub Activity section must link to @Meowtys');
  assert.match(homeHtml, /class="gh-cell"/, 'home page must render SVG .gh-cell day squares at build time');
  assert.match(homeHtml, /id="gh-hover-status"/, 'home page must include #gh-hover-status readout');

  const aboutHtml = fs.readFileSync(path.join(distDir, 'about/index.html'), 'utf8');
  assert.match(aboutHtml, /Silliman University/, 'about page must include Silliman University in Education');
  assert.match(aboutHtml, /eGetinnz/, 'about page must include eGetinnz internship in Experience');
  assert.match(aboutHtml, /Software Quality Assurance Intern/, 'about page must include Software Quality Assurance Intern role');

  const detailsMatches = [...aboutHtml.matchAll(/<details\b([^>]*)>/gi)];
  assert.equal(detailsMatches.length, 6, 'about page must render 6 collapsible details cards (4 Experience + 2 Education)');
  const openCount = detailsMatches.filter(([, attrs]) => /\bopen\b/i.test(attrs)).length;
  assert.equal(openCount, 2, 'about page must leave exactly 2 details cards open by default (first Experience + first Education)');
});
