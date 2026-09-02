import type { EmbedStatus } from '../../src/contracts/portfolio';

/**
 * Probes every URL the site would put in an iframe, and records whether it
 * answered.
 *
 * This is the generator that exists because of a specific bug: the previous
 * version of this site shipped three iframes pointing at hosts that no longer
 * resolve, and rendered a broken-image glyph in production for months. The UI
 * reads `status` and renders a still for anything offline, so a dead embed
 * becomes unshippable rather than merely unnoticed.
 */

const TIMEOUT_MS = 8_000;

export const probe = async (url: string): Promise<EmbedStatus> => {
  const started = Bun.nanoseconds();
  const checkedAt = new Date().toISOString();

  const done = (status: 'live' | 'offline', code: number): EmbedStatus => ({
    url,
    status,
    code,
    ms: Math.round((Bun.nanoseconds() - started) / 1e6),
    checkedAt,
  });

  try {
    const response = await fetch(url, {
      // GET rather than HEAD: several static hosts answer HEAD with 405 while
      // serving the page perfectly well, which would read as offline.
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'petarzarkov-portfolio-generator' },
    });
    // Anything that answers below 400 is live. A 401/403 means something is
    // there but not for us, which is still not an embeddable page.
    return done(response.ok ? 'live' : 'offline', response.status);
  } catch {
    // DNS failure, connection refused, or the timeout above. Code 0 records
    // "never got an HTTP response at all", which is a different thing from 404.
    return done('offline', 0);
  }
};

/**
 * Probes concurrently and never throws. A service being down is normal and must
 * not fail a build; the caller decides what an all-offline result means.
 */
export const probeAll = async (
  urls: readonly string[],
): Promise<Map<string, EmbedStatus>> => {
  const unique = [...new Set(urls)];
  const results = await Promise.all(unique.map(probe));
  return new Map(results.map((result) => [result.url, result]));
};
