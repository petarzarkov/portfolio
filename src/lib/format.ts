/**
 * Dates, rendered the same way for every visitor.
 *
 * `toLocaleDateString()` with no locale follows whoever is reading, so the same
 * build showed "9/2/2026" to one visitor and "2/9/2026" to another - and the
 * first of those is unreadable, because there is no way to tell 2 September
 * from 9 February. An audience spread across US and European conventions is
 * exactly the case the numeric form cannot serve.
 *
 * A named month has no such ambiguity in any locale, so these are fixed to one
 * format rather than delegated to the browser.
 */
const DAY = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const MINUTE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** An ISO timestamp as `2 Sep 2026`, or null if it is not a date. */
export const formatDay = (iso: string | null): string | null => {
  if (iso === null) return null;
  const at = new Date(iso);
  return Number.isNaN(at.getTime()) ? null : DAY.format(at);
};

/** An ISO timestamp as `2 Sep 2026, 16:14`. Used where the hour is the point. */
export const formatMinute = (iso: string | null): string | null => {
  if (iso === null) return null;
  const at = new Date(iso);
  return Number.isNaN(at.getTime()) ? null : MINUTE.format(at);
};

/**
 * How long ago, in the coarsest unit that is still true. Lives here rather than
 * in ProjectCard because "last push" is a date question, not a card question.
 */
export const formatSince = (iso: string | null): string | null => {
  if (iso === null) return null;
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return null;

  const days = Math.floor((Date.now() - at) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};
