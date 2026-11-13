import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const USERNAME = process.env.GITHUB_USER || 'Meowtys';
const TARGET_PATH = path.resolve('src/data/github.json');
const USER_AGENT = 'the-curiosity-index-sync';

const GRAPHQL_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/**
 * Parse GitHub's public contributions calendar HTML fragment into `{ total, weeks }`.
 * Respects GitHub's "Include private contributions on my profile" setting without requiring a PAT.
 */
export function parseContributionsHtml(html) {
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);
  if (!totalMatch) {
    throw new Error('Could not find annual contribution total in GitHub profile HTML');
  }
  const total = Number(totalMatch[1].replace(/,/g, ''));

  const tipCounts = new Map();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const forId = m[1].match(/for="([^"]+)"/)?.[1];
    if (!forId) continue;
    const text = m[2].trim();
    const countMatch = text.match(/^([\d,]+)\s+contributions?\b/i);
    tipCounts.set(forId, countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0);
  }

  const columns = new Map();
  for (const m of html.matchAll(/<td\b([^>]*)>/g)) {
    const attrs = m[1];
    const date = attrs.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const ixRaw = attrs.match(/data-ix="(\d+)"/)?.[1];
    const id = attrs.match(/id="([^"]+)"/)?.[1];
    const levelRaw = attrs.match(/data-level="(\d)"/)?.[1];
    if (!date || ixRaw === undefined || !id || levelRaw === undefined) continue;

    const col = Number(ixRaw);
    if (!columns.has(col)) columns.set(col, []);
    columns.get(col).push([date, tipCounts.get(id) ?? 0, Number(levelRaw)]);
  }

  const weeks = [...columns.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, days]) => days.sort((a, b) => a[0].localeCompare(b[0])));

  return { total, weeks };
}

/** Normalize a GitHub GraphQL `contributionCalendar` object into compact JSON format. */
export function normalizeGraphQLCalendar(calendar) {
  if (!calendar || typeof calendar.totalContributions !== 'number' || !Array.isArray(calendar.weeks)) {
    throw new Error('Invalid calendar payload returned from GitHub GraphQL API');
  }

  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => [
        day.date,
        day.contributionCount,
        LEVEL_MAP[day.contributionLevel] ?? 0,
      ]),
    ),
  };
}

/** Validate compact calendar structure before persisting so corrupted responses never overwrite live data. */
export function validateCalendar(data) {
  if (!data || typeof data.total !== 'number' || !Number.isFinite(data.total) || data.total <= 0) {
    throw new Error('Validated calendar total must be a positive number');
  }
  if (!Array.isArray(data.weeks) || data.weeks.length < 52 || data.weeks.length > 54) {
    throw new Error(`Expected 52-54 calendar weeks, received ${data.weeks?.length ?? 0}`);
  }

  for (let i = 0; i < data.weeks.length; i++) {
    const week = data.weeks[i];
    const isLast = i === data.weeks.length - 1;
    if (!Array.isArray(week) || week.length === 0 || (!isLast && week.length !== 7) || week.length > 7) {
      throw new Error(`Invalid day count (${week?.length ?? 0}) in calendar week ${i}`);
    }
    for (const day of week) {
      if (
        !Array.isArray(day) ||
        day.length !== 3 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(day[0]) ||
        !Number.isInteger(day[1]) ||
        day[1] < 0 ||
        !Number.isInteger(day[2]) ||
        day[2] < 0 ||
        day[2] > 4
      ) {
        throw new Error(`Invalid calendar day tuple: ${JSON.stringify(day)}`);
      }
    }
  }
}

async function fetchFromGraphQL(token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY,
      variables: { login: USERNAME },
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
  }
  return normalizeGraphQLCalendar(json.data.user.contributionsCollection.contributionCalendar);
}

async function fetchFromProfileHtml() {
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
    headers: {
      Accept: 'text/html',
      'User-Agent': USER_AGENT,
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub contributions fragment HTTP ${res.status}`);
  }
  return parseContributionsHtml(await res.text());
}

/**
 * Fetch the full contribution calendar.
 * Note: intentionally ignores repo-scoped `GITHUB_TOKEN` because GitHub Actions installation tokens
 * exclude private contributions outside the triggering repo; prefers `GH_CONTRIB_TOKEN` or GitHub's
 * public profile fragment (which includes private activity when profile visibility is enabled).
 */
export async function fetchCalendar() {
  const userPat = process.env.GH_CONTRIB_TOKEN;
  if (userPat) {
    return fetchFromGraphQL(userPat);
  }

  try {
    return await fetchFromProfileHtml();
  } catch (err) {
    if (process.env.GITHUB_ACTIONS === 'true') {
      throw err;
    }
    const stdout = execSync(
      `gh api graphql -F login=${USERNAME} -f query="${GRAPHQL_QUERY.replace(/\n\s*/g, ' ')}"`,
      { encoding: 'utf8' },
    );
    const json = JSON.parse(stdout);
    return normalizeGraphQLCalendar(json.data.user.contributionsCollection.contributionCalendar);
  }
}

async function main() {
  console.log(`[sync:github] Fetching contribution calendar for @${USERNAME}...`);
  const compact = await fetchCalendar();
  validateCalendar(compact);

  fs.writeFileSync(TARGET_PATH, JSON.stringify(compact) + '\n', 'utf8');
  console.log(`[sync:github] Successfully updated ${TARGET_PATH}`);
  console.log(`[sync:github] Total contributions: ${compact.total.toLocaleString()} across ${compact.weeks.length} weeks`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((err) => {
    console.error('[sync:github] Error syncing calendar:', err.message);
    process.exit(1);
  });
}
