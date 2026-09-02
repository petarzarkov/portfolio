import { describe, expect, test } from 'bun:test';
import type { RawContributions, RawRepo } from './github';
import {
  aggregateLanguages,
  cleanTopics,
  manualProject,
  sortProjects,
  streaks,
  tierOf,
  toActivity,
  topicsOf,
  toProject,
} from './transform';
import type { ContributionDay, Project } from '../../src/contracts/portfolio';

import repoFixture from './__fixtures__/repos.json';
import contributionsFixture from './__fixtures__/contributions.json';

const repos = repoFixture as unknown as RawRepo[];

const byName = (name: string): RawRepo => {
  const found = repos.find((repo) => repo.name === name);
  if (!found) throw new Error(`fixture has no repo ${name}`);
  return found;
};

/** The fixture is real API output, so nothing in it is tagged yet. */
const tagged = (repo: RawRepo, ...topics: string[]): RawRepo => ({
  ...repo,
  repositoryTopics: {
    nodes: [...topicsOf(repo), ...topics].map((name) => ({ topic: { name } })),
  },
});

describe('tierOf', () => {
  test('maps each control topic to its tier', () => {
    expect(tierOf(['portfolio-flagship'])).toBe('flagship');
    expect(tierOf(['portfolio'])).toBe('active');
    expect(tierOf(['portfolio-lab'])).toBe('lab');
    expect(tierOf(['portfolio-archive'])).toBe('archive');
  });

  test('an untagged repo is not on the site', () => {
    expect(tierOf(['bun', 'typescript'])).toBeNull();
    expect(tierOf([])).toBeNull();
  });

  test('the most specific topic wins regardless of order', () => {
    // The whole reason precedence is a declared list rather than a find():
    // GitHub does not promise an order, so this must not depend on one.
    expect(tierOf(['portfolio', 'portfolio-lab'])).toBe('lab');
    expect(tierOf(['portfolio-lab', 'portfolio'])).toBe('lab');
    expect(tierOf(['portfolio', 'portfolio-flagship'])).toBe('flagship');
    expect(tierOf(['portfolio-archive', 'portfolio-lab'])).toBe('archive');
  });
});

describe('cleanTopics', () => {
  test('strips control topics so they cannot render as tech chips', () => {
    expect(cleanTopics(['portfolio', 'portfolio-lab', 'bun', 'oxc'])).toEqual([
      'bun',
      'oxc',
    ]);
  });

  test('sorts, so chip order does not churn between runs', () => {
    expect(cleanTopics(['typescript', 'bun'])).toEqual(['bun', 'typescript']);
  });
});

describe('toProject', () => {
  test('reads a real repo without an override', () => {
    const project = toProject(
      tagged(byName('dunx'), 'portfolio'),
      undefined,
      'active',
    );

    expect(project.slug).toBe('dunx');
    expect(project.source).toBe('github');
    expect(project.repo).toBe('https://github.com/petarzarkov/dunx');
    expect(project.stars).toBeGreaterThan(0);
    expect(project.topics).not.toContain('portfolio');
    expect(project.languages[0]?.name).toBe('TypeScript');
    // Shares are a fraction of the repo's own total, so they sum to 1.
    const total = project.languages.reduce((sum, l) => sum + l.share, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  test('every generated field loses to the override', () => {
    const project = toProject(
      byName('dunx'),
      {
        title: 'dunx!',
        headline: 'a headline',
        tier: 'flagship',
        pin: 1,
        embed: 'https://example.com',
        topics: ['only', 'these'],
      },
      'active',
    );

    expect(project.title).toBe('dunx!');
    expect(project.headline).toBe('a headline');
    expect(project.tier).toBe('flagship');
    expect(project.pin).toBe(1);
    expect(project.homepage).toBe('https://example.com');
    expect(project.topics).toEqual(['only', 'these']);
  });

  test('an empty homepageUrl is null, not an empty string', () => {
    // GitHub returns "" rather than null for a cleared homepage, and "" would
    // have been probed as an embed URL and rendered as a link.
    const repo: RawRepo = { ...byName('dunx'), homepageUrl: '' };
    expect(toProject(repo, undefined, 'active').homepage).toBeNull();
  });

  test('a repo with no languages yields no slices rather than dividing by zero', () => {
    const repo: RawRepo = { ...byName('dunx'), languages: null };
    expect(toProject(repo, undefined, 'lab').languages).toEqual([]);
  });

  test('a release with no publishedAt is not a release', () => {
    const repo: RawRepo = {
      ...byName('dunx'),
      latestRelease: { tagName: 'v1', publishedAt: null },
    };
    expect(toProject(repo, undefined, 'active').release).toBeNull();
  });
});

describe('manualProject', () => {
  test('needs no repo and is marked as authored', () => {
    const project = manualProject('rocket-crash', {
      manual: true,
      title: 'Rocket Crash',
      tier: 'archive',
    });

    expect(project.source).toBe('manual');
    expect(project.repo).toBeNull();
    expect(project.tier).toBe('archive');
    expect(project.languages).toEqual([]);
  });
});

describe('sortProjects', () => {
  const stub = (over: Partial<Project>): Project => ({
    ...manualProject(over.slug ?? 'x', {}),
    ...over,
  });

  test('tier first, then pin, then most recent push', () => {
    const sorted = sortProjects([
      stub({ slug: 'old-active', tier: 'active', pushedAt: '2020-01-01' }),
      stub({ slug: 'archived', tier: 'archive', pushedAt: '2026-01-01' }),
      stub({ slug: 'new-active', tier: 'active', pushedAt: '2026-01-01' }),
      stub({ slug: 'flag', tier: 'flagship', pushedAt: '2019-01-01' }),
      stub({ slug: 'lab', tier: 'lab', pushedAt: '2026-06-01' }),
    ]);

    expect(sorted.map((p) => p.slug)).toEqual([
      'flag',
      'new-active',
      'old-active',
      'lab',
      'archived',
    ]);
  });

  test('a pinned project beats a more recent unpinned one in its tier', () => {
    const sorted = sortProjects([
      stub({ slug: 'recent', tier: 'active', pushedAt: '2026-09-01' }),
      stub({ slug: 'pinned', tier: 'active', pushedAt: '2020-01-01', pin: 1 }),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(['pinned', 'recent']);
  });

  test('a project with no pushedAt sorts last in its tier, not first', () => {
    const sorted = sortProjects([
      stub({ slug: 'undated', tier: 'active', pushedAt: null }),
      stub({ slug: 'dated', tier: 'active', pushedAt: '2019-01-01' }),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(['dated', 'undated']);
  });
});

describe('aggregateLanguages', () => {
  const repo = (langs: [string, number][]): RawRepo => ({
    ...byName('dunx'),
    languages: {
      totalSize: langs.reduce((sum, [, size]) => sum + size, 0),
      edges: langs.map(([name, size]) => ({
        size,
        node: { name, color: null },
      })),
    },
  });

  test('sums bytes across repos and counts how many contain each language', () => {
    const result = aggregateLanguages([
      repo([
        ['TypeScript', 100],
        ['CSS', 10],
      ]),
      repo([['TypeScript', 300]]),
    ]);

    expect(result.totalBytes).toBe(410);
    expect(result.repoCount).toBe(2);
    expect(result.top[0]).toMatchObject({
      name: 'TypeScript',
      bytes: 400,
      repos: 2,
    });
    expect(result.top[0]?.share).toBeCloseTo(400 / 410, 5);
  });

  test('folds the long tail into Other above the threshold', () => {
    const langs = Array.from({ length: 12 }, (_, i): [string, number] => [
      `Lang${i}`,
      1000 - i * 10,
    ]);
    const result = aggregateLanguages([repo(langs)], {}, 8);

    expect(result.top).toHaveLength(9);
    expect(result.top.at(-1)?.name).toBe('Other');
    // Other carries the repo count of everything it swallowed.
    expect(result.top.at(-1)?.repos).toBe(4);
  });

  test('a tail below the threshold is dropped rather than shown as Other', () => {
    // 8 big languages and one 1-byte straggler: 1/8001 is under 0.5%, so a row
    // reading "Other 0.0%" would be noise.
    const langs: [string, number][] = [
      ...Array.from({ length: 8 }, (_, i): [string, number] => [
        `Big${i}`,
        1000,
      ]),
      ['Tiny', 1],
    ];
    const result = aggregateLanguages([repo(langs)], {}, 8);

    expect(result.top).toHaveLength(8);
    expect(result.top.map((l) => l.name)).not.toContain('Other');
  });

  test('attaches a proficiency label only where one is declared', () => {
    const result = aggregateLanguages(
      [
        repo([
          ['Go', 100],
          ['TypeScript', 500],
        ]),
      ],
      { Go: 'beginner' },
    );

    expect(result.top.find((l) => l.name === 'Go')?.proficiency).toBe(
      'beginner',
    );
    expect(
      result.top.find((l) => l.name === 'TypeScript')?.proficiency,
    ).toBeNull();
  });

  test('no languages at all is empty, not a division by zero', () => {
    const result = aggregateLanguages([{ ...byName('dunx'), languages: null }]);
    expect(result).toEqual({ top: [], totalBytes: 0, repoCount: 1 });
  });
});

describe('streaks', () => {
  const days = (...counts: number[]): ContributionDay[] =>
    counts.map((count, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      count,
    }));

  test('longest is the longest run anywhere in the year', () => {
    expect(streaks(days(1, 1, 1, 0, 1, 1)).longest).toBe(3);
  });

  test('current counts back from the end', () => {
    expect(streaks(days(1, 0, 1, 1, 1)).current).toBe(3);
  });

  test('a bare today does not end a live streak', () => {
    // GitHub's calendar always includes today. Without this, a streak that is
    // alive reads as 0 every morning until the first commit.
    expect(streaks(days(1, 1, 1, 0)).current).toBe(3);
  });

  test('but yesterday being empty does end it', () => {
    expect(streaks(days(1, 1, 0, 0)).current).toBe(0);
  });

  test('an empty calendar is zero, not NaN', () => {
    expect(streaks([])).toEqual({ current: 0, longest: 0 });
  });
});

describe('toActivity', () => {
  test('flattens the real calendar and keeps the totals', () => {
    const raw = contributionsFixture as unknown as RawContributions;
    const activity = toActivity(raw);

    // 53 weeks of 7, minus however many days the final partial week has.
    expect(activity.days.length).toBeGreaterThan(360);
    expect(activity.days.length).toBeLessThanOrEqual(371);
    expect(activity.commits).toBe(raw.totalCommitContributions);
    expect(activity.restricted).toBe(raw.restrictedContributionsCount);
    expect(activity.longestStreak).toBeGreaterThanOrEqual(
      activity.currentStreak,
    );
    // Private contributions outnumber public ones on this account; if this ever
    // reads 0, the "include private contributions" profile setting went off.
    expect(activity.restricted).toBeGreaterThan(0);
  });
});
