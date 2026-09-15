/**
 * The shape of everything under `src/generated/`.
 *
 * These types are the contract between the generators and the UI. They are
 * hand-written here and re-exported to the app through `src/generated/types.ts`
 * so a screen type-checks against the real snapshot rather than against an
 * interface that drifted from it.
 */

/** Which slot a project occupies on the site. */
export type Tier = 'flagship' | 'active' | 'lab' | 'archive';

/**
 * The one topic that puts a repo on the site. It says nothing about rank,
 * because a topic is public: `portfolio-lab` on a repo told every visitor its
 * author considered it a toy, and `portfolio-flagship` made a claim the repo
 * then had to live up to. Rank is set in `overrides.ts` instead, which nobody
 * reads off the repo page.
 */
export const MEMBER_TOPIC = 'portfolio';

export interface LanguageSlice {
  readonly name: string;
  readonly bytes: number;
  /** 0-1 of this project's total. */
  readonly share: number;
  /** GitHub's canonical colour, or null for languages it has none for. */
  readonly color: string | null;
}

export interface Release {
  readonly tag: string;
  readonly publishedAt: string;
}

export interface NpmInfo {
  readonly name: string;
  readonly version: string;
  readonly weeklyDownloads: number;
}

/** Result of probing an external URL at generation time. */
export interface EmbedStatus {
  readonly url: string;
  readonly status: 'live' | 'offline';
  readonly code: number;
  readonly ms: number;
  readonly checkedAt: string;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  /** Override copy, else the repo description. */
  readonly headline: string | null;
  readonly description: string | null;
  readonly tier: Tier;
  /** Explicit ordering from the overrides; unpinned projects sort by pushedAt. */
  readonly pin: number | null;
  readonly repo: string | null;
  readonly homepage: string | null;
  readonly stars: number;
  readonly forks: number;
  /** Repo topics with the `portfolio*` control topics stripped out. */
  readonly topics: readonly string[];
  readonly languages: readonly LanguageSlice[];
  readonly license: string | null;
  readonly createdAt: string | null;
  readonly pushedAt: string | null;
  readonly release: Release | null;
  readonly npm: NpmInfo | null;
  readonly embed: EmbedStatus | null;
  /** Why an archived project stopped running, from the overrides. */
  readonly retiredAt: string | null;
  readonly retiredNote: string | null;
  /** `manual` entries have no repo and skip the GitHub lookup entirely. */
  readonly source: 'github' | 'manual';
}

export interface LanguageTotal {
  readonly name: string;
  readonly bytes: number;
  /** 0-1 of all bytes across every owned repo. */
  readonly share: number;
  readonly color: string | null;
  /** How many repos contain it. */
  readonly repos: number;
}

export interface Languages {
  /** Top N by bytes, with the long tail folded into a single `Other`. */
  readonly top: readonly LanguageTotal[];
  readonly totalBytes: number;
  /** Repos counted, including private ones. */
  readonly repoCount: number;
}

export interface ContributionDay {
  readonly date: string;
  readonly count: number;
}

export interface Activity {
  readonly totalContributions: number;
  readonly commits: number;
  /** Contributions to private repos, which GitHub reports only as a count. */
  readonly restricted: number;
  readonly pullRequests: number;
  readonly reviews: number;
  readonly issues: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly days: readonly ContributionDay[];
}

export interface Meta {
  readonly generatedAt: string | null;
  readonly projects: number;
  readonly repos: number;
  /** Embeds probed, and how many answered. */
  readonly embeds: { readonly checked: number; readonly live: number };
}
