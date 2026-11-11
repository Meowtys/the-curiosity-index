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

test('global.css defines explicit prefers-reduced-motion: reduce rule disabling transitions', () => {
  const css = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
  assert.match(css, /transition:\s*none/);
});
