/**
 * Every decision the pipeline makes, as pure functions over already-fetched
 * data. The I/O lives in `github.ts`, `embeds.ts` and `npm.ts`; this is what
 * `transform.test.ts` exercises against fixtures, offline and deterministically.
 */
import type { Override } from '../../src/data/overrides';
import type {
  Activity,
  ContributionDay,
  LanguageSlice,
  LanguageTotal,
  Languages,
  Project,
  Tier,
} from '../../src/contracts/portfolio';
import { TIER_TOPICS } from '../../src/contracts/portfolio';
import type { RawContributions, RawRepo } from './github';

/**
 * A repo's tier, or null when it carries no `portfolio*` topic and so is not on
 * the site at all. Precedence is `TIER_TOPICS` order, not GitHub's topic order,
 * so `portfolio` alongside `portfolio-lab` is deterministic.
 */
export const tierOf = (topics: readonly string[]): Tier | null => {
  for (const [topic, tier] of TIER_TOPICS) {
    if (topics.includes(topic)) return tier;
  }
  return null;
};

/** Control topics are plumbing; they must not render as tech chips. */
export const cleanTopics = (topics: readonly string[]): string[] =>
  topics.filter((topic) => !topic.startsWith('portfolio')).sort();

export const topicsOf = (repo: RawRepo): string[] =>
  repo.repositoryTopics.nodes.map((node) => node.topic.name);

const slicesOf = (repo: RawRepo): LanguageSlice[] => {
  const total = repo.languages?.totalSize ?? 0;
  if (total === 0) return [];
  return (repo.languages?.edges ?? []).map((edge) => ({
    name: edge.node.name,
    bytes: edge.size,
    share: edge.size / total,
    color: edge.node.color,
  }));
};

/**
 * One repo plus its override into a `Project`. Every generated field loses to
 * the override, which is the whole contract of `src/data/overrides.ts`.
 */
export const toProject = (
  repo: RawRepo,
  override: Override | undefined,
  tier: Tier,
): Project => ({
  slug: repo.name,
  title: override?.title ?? repo.name,
  headline: override?.headline ?? null,
  description: override?.description ?? repo.description,
  tier: override?.tier ?? tier,
  pin: override?.pin ?? null,
  repo: override?.repo ?? repo.url,
  // An empty homepageUrl is common on GitHub and is not a URL.
  homepage:
    override?.embed ??
    (repo.homepageUrl !== null && repo.homepageUrl !== ''
      ? repo.homepageUrl
      : null),
  stars: repo.stargazerCount,
  forks: repo.forkCount,
  topics: override?.topics ?? cleanTopics(topicsOf(repo)),
  languages: slicesOf(repo),
  license: repo.licenseInfo?.spdxId ?? null,
  createdAt: repo.createdAt,
  pushedAt: repo.pushedAt,
  release:
    repo.latestRelease && repo.latestRelease.publishedAt
      ? {
          tag: repo.latestRelease.tagName,
          publishedAt: repo.latestRelease.publishedAt,
        }
      : null,
  npm: null,
  embed: null,
  retiredAt: override?.retiredAt ?? null,
  retiredNote: override?.retiredNote ?? null,
  source: 'github',
});

/** An override with no repo behind it, for closed-source work. */
export const manualProject = (slug: string, override: Override): Project => ({
  slug,
  title: override.title ?? slug,
  headline: override.headline ?? null,
  description: override.description ?? null,
  tier: override.tier ?? 'active',
  pin: override.pin ?? null,
  repo: override.repo ?? null,
  homepage: override.embed ?? null,
  stars: 0,
  forks: 0,
  topics: override.topics ?? [],
  languages: [],
  license: null,
  createdAt: null,
  pushedAt: null,
  release: null,
  npm: null,
  embed: null,
  retiredAt: override.retiredAt ?? null,
  retiredNote: override.retiredNote ?? null,
  source: 'manual',
});

const TIER_ORDER: Record<Tier, number> = {
  flagship: 0,
  active: 1,
  lab: 2,
  archive: 3,
};

/**
 * Tier first, then explicit pins, then most recently pushed. A project with no
 * `pushedAt` (a manual one) sorts last within its tier rather than first, which
 * is what an empty string would do.
 */
export const sortProjects = (projects: readonly Project[]): Project[] =>
  [...projects].sort((a, b) => {
    if (a.tier !== b.tier) return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (a.pin !== b.pin) return (a.pin ?? Infinity) - (b.pin ?? Infinity);
    return (b.pushedAt ?? '').localeCompare(a.pushedAt ?? '');
  });

/**
 * Bytes per language across every owned repo, private included.
 *
 * Top `limit` by size, with everything below folded into a single `Other` when
 * it clears `threshold`. Without that fold, Dockerfile and Shell get the same
 * row as TypeScript - the same rule the profile repo's LanguagesGenerator uses.
 */
export const aggregateLanguages = (
  repos: readonly RawRepo[],
  limit = 8,
  threshold = 0.005,
): Languages => {
  // Forks are somebody else's code. The `bun` fork alone is 26 MB of Zig, which
  // read as 13% of everything written on this account and made Zig the second
  // language on a skills map its owner has never written a line of.
  const owned = repos.filter((repo) => !repo.isFork);

  const totals = new Map<
    string,
    { bytes: number; color: string | null; repos: Set<string> }
  >();

  for (const repo of owned) {
    for (const edge of repo.languages?.edges ?? []) {
      const found = totals.get(edge.node.name);
      if (found) {
        found.bytes += edge.size;
        found.repos.add(repo.name);
      } else {
        totals.set(edge.node.name, {
          bytes: edge.size,
          color: edge.node.color,
          repos: new Set([repo.name]),
        });
      }
    }
  }

  const totalBytes = [...totals.values()].reduce((sum, l) => sum + l.bytes, 0);
  if (totalBytes === 0) {
    return { top: [], totalBytes: 0, repoCount: owned.length };
  }

  const ranked = [...totals.entries()]
    .map(([name, value]): LanguageTotal => ({
      name,
      bytes: value.bytes,
      share: value.bytes / totalBytes,
      color: value.color,
      repos: value.repos.size,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const top = ranked.slice(0, limit);
  const tail = ranked.slice(limit);
  const tailBytes = tail.reduce((sum, l) => sum + l.bytes, 0);
  const tailShare = tailBytes / totalBytes;

  if (tail.length > 0 && tailShare > threshold) {
    // Distinct repos, not the sum of the tail's counts: one repo with four tail
    // languages is one repo, and summing read as 354 of a possible 155.
    const tailNames = tail.map((l) => l.name);
    const tailRepos = new Set<string>();
    for (const [name, value] of totals) {
      if (tailNames.includes(name)) {
        for (const repo of value.repos) tailRepos.add(repo);
      }
    }

    top.push({
      name: 'Other',
      bytes: tailBytes,
      share: tailShare,
      color: '#64748b',
      repos: tailRepos.size,
    });
  }

  return { top, totalBytes, repoCount: owned.length };
};

/**
 * Longest and current run of days with at least one contribution.
 *
 * The current streak is counted backwards from the end and tolerates a bare
 * today: GitHub's calendar always includes today, so a run that is alive but
 * has had no commit *yet today* would otherwise read as zero.
 */
export const streaks = (
  days: readonly ContributionDay[],
): { current: number; longest: number } => {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    if (run > longest) longest = run;
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (!day) break;
    if (day.count > 0) {
      current += 1;
      continue;
    }
    // Today with nothing on it does not end a streak; yesterday does.
    if (i === days.length - 1) continue;
    break;
  }

  return { current, longest };
};

export const toActivity = (raw: RawContributions): Activity => {
  const days: ContributionDay[] = raw.contributionCalendar.weeks.flatMap(
    (week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
  );
  const { current, longest } = streaks(days);

  return {
    totalContributions: raw.contributionCalendar.totalContributions,
    commits: raw.totalCommitContributions,
    restricted: raw.restrictedContributionsCount,
    pullRequests: raw.totalPullRequestContributions,
    reviews: raw.totalPullRequestReviewContributions,
    issues: raw.totalIssueContributions,
    currentStreak: current,
    longestStreak: longest,
    days,
  };
};
