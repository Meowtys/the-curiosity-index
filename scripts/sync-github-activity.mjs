import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const USERNAME = process.env.GITHUB_USER || 'Meowtys';
const TARGET_PATH = path.resolve('src/data/github.json');

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

async function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'the-curiosity-index-sync',
      },
      body: JSON.stringify({
        query: GRAPHQL_QUERY,
        variables: { login: USERNAME },
      }),
    });

    if (!res.ok) {
      throw new Error(`GitHub API HTTP ${res.status}: ${await res.text()}`);
    }

    const json = await res.json();
    if (json.errors?.length) {
      throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }
    return json.data.user.contributionsCollection.contributionCalendar;
  }

  // Fallback to local gh CLI if token is not passed in environment
  const stdout = execSync(
    `gh api graphql -F login=${USERNAME} -f query="${GRAPHQL_QUERY.replace(/\n\s*/g, ' ')}"`,
    { encoding: 'utf8' },
  );
  const json = JSON.parse(stdout);
  return json.data.user.contributionsCollection.contributionCalendar;
}

async function main() {
  console.log(`[sync:github] Fetching contribution calendar for @${USERNAME}...`);
  const calendar = await fetchCalendar();

  if (!calendar || typeof calendar.totalContributions !== 'number' || !Array.isArray(calendar.weeks)) {
    throw new Error('Invalid calendar payload returned from GitHub API');
  }

  const compact = {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => [
        day.date,
        day.contributionCount,
        LEVEL_MAP[day.contributionLevel] ?? 0,
      ]),
    ),
  };

  const formatted = JSON.stringify(compact);
  fs.writeFileSync(TARGET_PATH, formatted + '\n', 'utf8');
  console.log(`[sync:github] Successfully updated ${TARGET_PATH}`);
  console.log(`[sync:github] Total contributions: ${compact.total.toLocaleString()} across ${compact.weeks.length} weeks`);
}

main().catch((err) => {
  console.error('[sync:github] Error syncing calendar:', err.message);
  process.exit(1);
});
