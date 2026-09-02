/**
 * The shape of everything under `src/generated/`.
 *
 * These types are the contract between the generators and the UI. They are
 * hand-written here and re-exported to the app through `src/generated/types.ts`
 * so a screen type-checks against the real snapshot rather than against an
 * interface that drifted from it.
 */

/**
 * Which slot a project occupies on the site. Derived from GitHub topics, most
 * specific first - see `TIER_TOPICS`.
 */
export type Tier = 'flagship' | 'active' | 'lab' | 'archive';

/**
 * Topic -> tier, in precedence order. A repo carrying several is assigned the
 * first match, so `portfolio` alongside `portfolio-lab` reads as lab rather
 * than depending on the order GitHub returns topics in.
 */
export const TIER_TOPICS: readonly (readonly [string, Tier])[] = Object.freeze([
  ['portfolio-flagship', 'flagship'],
  ['portfolio-archive', 'archive'],
  ['portfolio-lab', 'lab'],
  ['portfolio', 'active'],
]);

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
  readonly image: string | null;
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
  /**
   * Self-assessed, from the overrides, and only where byte volume misleads.
   * Null means the volume speaks for itself.
   */
  readonly proficiency: string | null;
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
  readonly generatedAt: string;
  readonly projects: number;
  readonly repos: number;
  /** Embeds probed, and how many answered. */
  readonly embeds: { readonly checked: number; readonly live: number };
}
