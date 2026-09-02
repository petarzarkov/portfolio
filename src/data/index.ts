/**
 * The generated snapshot, typed.
 *
 * `src/generated/*.json` is written by `bun run gen` and committed, so these
 * are plain module imports - no fetch, no loading state, no runtime dependency
 * on GitHub. The casts are the one place the JSON meets its contract; the
 * generator validates before writing, so a file that reached here is well
 * formed (docs/03-data-pipeline.md).
 */
import type { Activity, Languages, Meta, Project } from '@contracts';

import projectsJson from '../generated/projects.json';
import languagesJson from '../generated/languages.json';
import activityJson from '../generated/activity.json';
import metaJson from '../generated/meta.json';

export const projects = projectsJson as unknown as Project[];
export const languages = languagesJson as unknown as Languages;
export const activity = activityJson as unknown as Activity;
export const meta = metaJson as unknown as Meta;

export const byTier = (tier: Project['tier']): Project[] =>
  projects.filter((project) => project.tier === tier);

export const bySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

/**
 * The one project that owns the landing page. Falls back to the first project
 * so the page renders during the window where nothing is tagged `flagship` yet.
 */
export const flagship = (): Project | undefined =>
  byTier('flagship')[0] ?? projects[0];

/**
 * True only when a generator confirmed the URL answered. Anything else - never
 * probed, 404, no DNS - renders a still rather than an iframe.
 */
export const isEmbeddable = (project: Project): boolean =>
  project.embed?.status === 'live';

export * from './overrides';
