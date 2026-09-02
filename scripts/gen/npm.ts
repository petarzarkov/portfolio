import type { NpmInfo } from '../../src/contracts/portfolio';

/**
 * Version and weekly downloads for a published package, from the public
 * registry. No auth, no dependency - two plain fetches.
 */

const TIMEOUT_MS = 8_000;

const json = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'petarzarkov-portfolio-generator' },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

/**
 * Null when the package is unpublished or the registry is unreachable - both
 * mean "show no npm badge", and neither should fail a build.
 */
export const fetchNpm = async (name: string): Promise<NpmInfo | null> => {
  const [latest, downloads] = await Promise.all([
    json<{ version?: string }>(
      `https://registry.npmjs.org/${encodeURIComponent(name)}/latest`,
    ),
    json<{ downloads?: number }>(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`,
    ),
  ]);

  if (!latest?.version) return null;

  return {
    name,
    version: latest.version,
    weeklyDownloads: downloads?.downloads ?? 0,
  };
};
