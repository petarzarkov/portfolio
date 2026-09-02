import type { Tier } from '@contracts';

/**
 * The only hand-maintained project data in the repo.
 *
 * Everything a repo already knows - description, topics, language mix, stars,
 * homepage, last push - is generated from GitHub (docs/03-data-pipeline.md).
 * This file covers only what GitHub cannot know:
 *
 *   1. closed-source work, which has no repo at all (`manual: true`)
 *   2. copy that beats the repo description
 *   3. media and embeds
 *   4. explicit ordering, via `pin`
 *
 * Generated fields lose to anything set here. A `manual` entry skips the GitHub
 * lookup entirely.
 *
 * Adding an open-source project does **not** belong here: tag the repo
 * `portfolio` on github.com and it appears at the next refresh.
 */
export interface Override {
  /** No repo to read; every field is authored. */
  readonly manual?: true;
  readonly title?: string;
  readonly tier?: Tier;
  /** Lower sorts first. Unpinned projects fall back to last push. */
  readonly pin?: number;
  /** One line that beats the repo description. */
  readonly headline?: string;
  readonly description?: string;
  /** Overrides the repo's homepageUrl as the thing to embed. */
  readonly embed?: string;
  readonly image?: string;
  readonly repo?: string;
  readonly topics?: readonly string[];
  /** npm package to pull version and download counts for. */
  readonly npm?: string;
  /** For `archive`: when it stopped running, and why. */
  readonly retiredAt?: string;
  readonly retiredNote?: string;
}

export const overrides: Readonly<Record<string, Override>> = {
  dunx: {
    pin: 1,
    headline: 'NestJS-shaped dependency injection at Bun speed',
    embed: 'https://petarzarkov.github.io/dunx',
    npm: 'dunx',
  },

  // --- Archive -------------------------------------------------------------
  // Shipped, no longer running. These render as one line each, not as cards:
  // a dead iframe is what the previous version of this site shipped for months.

  toplo: {
    tier: 'archive',
    retiredAt: '2024',
    retiredNote: 'Superseded by the @arkv packages; no longer maintained.',
  },
  'trivia-art': {
    tier: 'archive',
    retiredAt: '2022-11',
    retiredNote:
      'The API ran on a Heroku free dyno; those were withdrawn in November 2022.',
  },
  'rn-impossible-quiz': {
    tier: 'archive',
    retiredAt: '2022',
    retiredNote: 'Android app, no longer published or maintained.',
  },
  wisdoms: {
    tier: 'archive',
    retiredNote:
      'wisdoms.petarzarkov.com currently resolves to nothing - the DNS record ' +
      'is missing from the zone rather than the origin being down.',
  },
};

/**
 * Employment history. Not derivable from any repo, and the reason the site can
 * say what was *owned* rather than only what was pushed.
 *
 * Rendered as a timeline on /work, most recent first.
 */
export interface Role {
  readonly employer: string;
  readonly title: string;
  /** `YYYY-MM`. `to: null` means current. */
  readonly from: string;
  readonly to: string | null;
  /** Two or three sentences on what was actually built and owned. */
  readonly summary: string;
  readonly stack: readonly string[];
  /** Notable things shipped in the role. */
  readonly shipped?: readonly {
    readonly name: string;
    readonly what: string;
  }[];
}

/**
 * Empty on purpose rather than guessed.
 *
 * Employers, titles and dates are the one part of this site that cannot be
 * generated or inferred from the repos, and inventing them would be worse than
 * an empty section. /work renders nothing until this is filled in - see the
 * "Content still owed by you" list in docs/05-experience.md.
 */
export const roles: readonly Role[] = [];
