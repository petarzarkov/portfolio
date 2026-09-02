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
 * Employment history, from LinkedIn.
 *
 * Not derivable from any repository, and the reason the site can say what was
 * *owned* rather than only what was pushed. Rendered as a timeline on /work,
 * most recent first, with consecutive roles at one employer grouped.
 */
export interface Role {
  readonly employer: string;
  readonly title: string;
  /** `YYYY-MM`. `to: null` means current. */
  readonly from: string;
  readonly to: string | null;
  readonly employment?: string;
  readonly location?: string;
  readonly summary?: string;
  readonly achievements?: readonly string[];
  readonly stack?: readonly string[];
}

export const roles: readonly Role[] = [
  {
    employer: 'dunx',
    title: 'Founder',
    from: '2026-08',
    to: null,
    employment: 'Seasonal',
    location: 'Sofia, Bulgaria · Remote',
    summary: 'Launched the dunx open source framework.',
    stack: ['typescript', 'bun', 'dependency-injection', 'oxc'],
  },
  {
    employer: 'Pateplay',
    title: 'Software Engineering Manager',
    from: '2026-02',
    to: null,
    employment: 'Full-time',
    location: 'Sofia, Bulgaria · On-site',
  },
  {
    employer: 'LimeChain',
    title: 'Technical Team Lead',
    from: '2025-07',
    to: '2026-02',
    employment: 'Full-time',
    location: 'Hybrid',
    summary:
      'Led technical delivery and the engineering team for Isogonal, an institutional-grade crypto trading and asset management platform, bridging implementation and business requirements.',
    achievements: [
      'Migrated the backend from microservices to a monolith to get MVP 1 out, then refactored back to microservices (RabbitMQ, RPC and PubSub, Turborepo) for MVP 2 scalability.',
      'Led institutional execution and custody integrations — Coinbase Prime, Komainu, OKX — resolving API blockers directly with vendor teams and contributing fixes upstream to their open-source SDKs.',
      'Built a CI/CD pipeline on GitHub Actions with automated E2E tests running full Node servers and databases, and cut frontend hot-reload from ~30s to ~3ms by moving off Next.js.',
      'Mentored the team on backend architecture and the Node ecosystem, and introduced tooling to raise the floor on code review.',
    ],
    stack: [
      'typescript',
      'nodejs',
      'rabbitmq',
      'turborepo',
      'github-actions',
      'aws',
    ],
  },
  {
    employer: 'Pwrteams',
    title: 'Lead Software Engineer',
    from: '2023-09',
    to: '2025-06',
    employment: 'Full-time',
    location: 'Sofia, Bulgaria · Hybrid',
    summary:
      'Backend for WeShop, a social commerce platform aggregating products from the major affiliate networks — AWIN, Tradedoubler, eBay, Rakuten, CJ, Impact — across UK and US territories.',
    achievements: [
      'Maintained 8+ services in Node, TypeScript, NestJS and Express: platform API, admin backend, mobile API and a directory service.',
      'Built a high-throughput offer pipeline over millions of products with incremental delta updates, RocksDB state and Elasticsearch indexing.',
      'Designed a global username uniqueness service guaranteeing cross-territory data integrity, and real-time social features on Socket.IO with the Redis adapter.',
      'Ran the AWS estate: Aurora Postgres serverless, Elasticsearch clusters, Lambda@Edge image optimisation, ECS and CloudFront, with Terraform modules and SSM Parameter Store for config.',
      'Testing across the pyramid: Jest units, Testcontainers integration, Cucumber BDD end to end.',
    ],
    stack: [
      'nodejs',
      'typescript',
      'nestjs',
      'postgresql',
      'elasticsearch',
      'redis',
      'aws',
      'terraform',
      'docker',
      'graphql',
    ],
  },
  {
    employer: 'DraftKings',
    title: 'Lead Software Engineer',
    from: '2021-11',
    to: '2023-09',
    employment: 'Full-time',
    location: 'Remote',
    summary:
      'Casino gaming platform infrastructure serving millions of users across multiple US states. Took the Rocket crash game from concept to production, where it became a major revenue driver for DraftKings Casino.',
    achievements: [
      'Delivered Rocket end to end — backend, frontend, Cucumber automation and the CI/CD behind it on Docker, Octopus Deploy, BitBucket and Bamboo.',
      'Built and maintained 50+ microservices across the casino platform: game adapters, content management, real-time transaction processing.',
      'Owned Over Under (dice) across FE, BE and CI/CD, with full Pytest coverage and billions of AWS-run simulations for regulatory compliance.',
      'Integrated 10+ third-party game providers — NetEnt, Playtech, Microgaming, Evolution, IGT — through custom adapters.',
      'Wrote the shared libraries and service templates the wider organisation built on.',
    ],
    stack: [
      'typescript',
      'nodejs',
      'nestjs',
      'react',
      'postgresql',
      'docker',
      'kubernetes',
      'jenkins',
      'jest',
      'cucumber',
    ],
  },
  {
    employer: 'DraftKings',
    title: 'Senior Software Engineer',
    from: '2020-06',
    to: '2021-11',
    employment: 'Full-time',
    location: 'Remote',
    stack: ['nodejs', 'typescript', 'api-gateway'],
  },
  {
    employer: 'DraftKings',
    title: 'Automation QA',
    from: '2020-01',
    to: '2020-06',
    employment: 'Full-time',
    location: 'Sofia, Bulgaria',
    stack: ['nodejs', 'api-gateway'],
  },
  {
    employer: 'Trading 212',
    title: 'Quality Assurance Engineer',
    from: '2018-08',
    to: '2020-01',
    location: 'Sofia, Bulgaria',
    stack: ['nodejs', 'sql'],
  },
  {
    employer: 'Buchanan Technologies',
    title: 'Service Desk Analyst',
    from: '2017-11',
    to: '2018-08',
    location: 'Sofia, Bulgaria',
  },
  {
    employer: 'Streetwise Services',
    title: 'Traffic Surveyor',
    from: '2016-07',
    to: '2017-08',
    location: 'Scotland',
  },
  {
    employer: 'Tek Experts',
    title: 'Software Support Engineer',
    from: '2014-12',
    to: '2015-06',
    summary: 'University gap year.',
  },
];
