/**
 * Writes `src/generated/` from GitHub and npm.
 *
 * Run by `bun run gen`, nightly by `.github/workflows/refresh-data.yml`, and
 * never by the browser: the output is committed, so a normal `bun run build`
 * needs no token and a GitHub outage cannot break a deploy.
 *
 * **Offline-safe by design.** With no token, no network or a GitHub 5xx this
 * logs a warning and exits 0, leaving the committed snapshot untouched. The one
 * thing it hard-fails on is a schema violation - see `validate`.
 */
import { mkdir } from 'node:fs/promises';
import { overrides } from '../../src/data/overrides';
import type { Meta, Project } from '../../src/contracts/portfolio';
import { fetchContributions, fetchRepos, OfflineError, token } from './github';
import { probeAll } from './embeds';
import { fetchNpm } from './npm';
import { generateOg } from './og';
import {
  aggregateLanguages,
  manualProject,
  sortProjects,
  tierOf,
  toActivity,
  topicsOf,
  toProject,
} from './transform';

const OUT = new URL('../../src/generated/', import.meta.url).pathname;

const write = async (name: string, value: unknown): Promise<void> => {
  // Whole object, then one write. Never stream into a file the app imports.
  await Bun.write(`${OUT}${name}`, `${JSON.stringify(value, null, 2)}\n`);
};

/**
 * Fails the run rather than writing a snapshot that renders as a blank page.
 * A GitHub field changing shape should be loud here, not silent in the UI.
 */
const validate = (projects: readonly Project[]): void => {
  if (projects.length === 0) {
    throw new Error(
      'No projects resolved. Tag at least one repo `portfolio` on github.com, ' +
        'or check that the token can see private repos.',
    );
  }
  for (const project of projects) {
    if (!project.slug) throw new Error('A project has no slug');
    if (project.source === 'github' && project.repo === null) {
      throw new Error(`${project.slug}: github project with no repo URL`);
    }
  }
};

const run = async (): Promise<void> => {
  const [repos, contributions] = await Promise.all([
    fetchRepos(),
    fetchContributions(),
  ]);

  const tagged: Project[] = [];
  for (const repo of repos) {
    const tier = tierOf(topicsOf(repo));
    if (tier === null) continue;
    tagged.push(toProject(repo, overrides[repo.name], tier));
  }

  // An override with `manual` has no repo to have been tagged, so it is added
  // here rather than found above.
  for (const [slug, override] of Object.entries(overrides)) {
    if (override.manual !== true) continue;
    if (tagged.some((project) => project.slug === slug)) continue;
    tagged.push(manualProject(slug, override));
  }

  const embedUrls = tagged
    .map((project) => project.homepage)
    .filter((url): url is string => url !== null);
  const embeds = await probeAll(embedUrls);

  const npmNames = Object.entries(overrides)
    .map(([slug, override]) => [slug, override.npm] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] != null);
  const npm = new Map(
    await Promise.all(
      npmNames.map(
        async ([slug, name]) => [slug, await fetchNpm(name)] as const,
      ),
    ),
  );

  const projects = sortProjects(
    tagged.map((project) => ({
      ...project,
      embed:
        project.homepage === null
          ? null
          : (embeds.get(project.homepage) ?? null),
      npm: npm.get(project.slug) ?? null,
    })),
  );

  validate(projects);

  const live = [...embeds.values()].filter((e) => e.status === 'live').length;
  // Every probe failing means the network is the problem, not the services.
  if (embeds.size > 0 && live === 0) {
    throw new OfflineError(`all ${embeds.size} embed probes failed`);
  }

  const meta: Meta = {
    generatedAt: new Date().toISOString(),
    projects: projects.length,
    repos: repos.length,
    embeds: { checked: embeds.size, live },
  };

  await mkdir(OUT, { recursive: true });
  await Promise.all([
    write('projects.json', projects),
    write('languages.json', aggregateLanguages(repos)),
    write('activity.json', toActivity(contributions)),
    write('meta.json', meta),
  ]);

  // After the snapshot: the cards are rendered from the projects just written,
  // and a font-less machine skips them rather than failing the run.
  const cards = await generateOg(projects);
  if (cards === 0) {
    console.warn('gen: no usable system font, skipping the social cards');
  }

  const offline = embeds.size - live;
  console.log(
    `gen: ${projects.length} projects from ${repos.length} repos, ` +
      `${live}/${embeds.size} embeds live${offline > 0 ? ` (${offline} offline)` : ''}, ` +
      `${cards} social cards`,
  );
};

if (import.meta.main) {
  if (token() === null) {
    console.warn(
      'gen: no GH_DATA_TOKEN or GITHUB_TOKEN; keeping the committed snapshot',
    );
    process.exit(0);
  }

  try {
    await run();
  } catch (error) {
    // Unreachable GitHub is not a build failure: the committed snapshot is
    // still good, and this is what lets `bun run build` work offline.
    if (error instanceof OfflineError) {
      console.warn(`gen: ${error.message}; keeping the committed snapshot`);
      process.exit(0);
    }
    throw error;
  }
}
