/**
 * Writes a per-route copy of `index.html` into `dist/`, with that route's own
 * title, description and social card.
 *
 * The site is a client-rendered SPA, so every route otherwise serves the same
 * `index.html` and every link preview shows the same card. Crawlers and link
 * unfurlers do not run the bundle, so they never see the route they asked for.
 *
 * This is not prerendering - the markup is identical and React still renders
 * everything. It replaces four meta tags, which is the part a crawler reads.
 * A visitor is unaffected: the shell boots the same bundle, and the SPA
 * fallback in `public/_redirects` still catches anything not written here.
 */
import { mkdir } from 'node:fs/promises';
import { projects } from '../src/data/index';
import { site } from '../src/config/site';

const DIST = new URL('../dist/', import.meta.url).pathname;

interface Shell {
  path: string;
  title: string;
  description: string;
  image: string;
}

const escape = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const shells = (): Shell[] => [
  {
    path: 'projects',
    title: `Projects — ${site.name}`,
    description:
      'Everything I have shipped, generated from GitHub: active work, lab experiments and what has been retired.',
    image: 'default',
  },
  {
    path: 'skills',
    title: `Skills — ${site.name}`,
    description:
      'Measured, not declared: languages by volume of code written across every repository I own, and a year of activity.',
    image: 'default',
  },
  {
    path: 'about',
    title: `About — ${site.name}`,
    description: site.builds,
    image: 'default',
  },
  ...projects.map((project) => ({
    path: `projects/${project.slug}`,
    title: `${project.title} — ${site.name}`,
    description:
      project.headline ?? project.description ?? `${project.tier} project`,
    image: project.slug,
  })),
];

/**
 * Matches a meta tag's `content` however it is wrapped.
 *
 * oxfmt splits long tags across lines in the source and Vite copies that
 * through, so `<meta name="description" content="…" />` is three lines in
 * `dist/index.html`. A single-line pattern silently matched nothing and the
 * shells shipped with the wrong description.
 */
const setMeta = (
  html: string,
  attr: string,
  name: string,
  value: string,
): string => {
  const pattern = new RegExp(
    `(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`,
    's',
  );
  if (!pattern.test(html)) {
    throw new Error(`shells: no <meta ${attr}="${name}"> to replace`);
  }
  return html.replace(pattern, `$1${escape(value)}$2`);
};

const apply = (html: string, shell: Shell): string => {
  const url = `${site.url}/${shell.path}`;
  const image = `${site.url}/og/${shell.image}.png`;

  let out = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escape(shell.title)}</title>`,
  );
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  out = setMeta(out, 'name', 'description', shell.description);
  out = setMeta(out, 'property', 'og:title', shell.title);
  out = setMeta(out, 'property', 'og:description', shell.description);
  out = setMeta(out, 'property', 'og:url', url);
  out = setMeta(out, 'property', 'og:image', image);
  return out;
};

const index = Bun.file(`${DIST}index.html`);
if (!(await index.exists())) {
  throw new Error(`No built site at ${DIST}. Run \`vite build\` first.`);
}

const html = await index.text();
const all = shells();

/**
 * Flat `<route>.html` files rather than `<route>/index.html` directories.
 *
 * A directory makes Cloudflare Pages 308 the clean URL to its trailing-slash
 * form, which works but leaves every canonical pointing at a URL that
 * redirects. A file has no such behaviour, so the rule below serves it with a
 * 200 at exactly the URL the canonical claims.
 */
for (const shell of all) {
  const file = `${DIST}${shell.path}.html`;
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await Bun.write(file, apply(html, shell));
}

/*
 * No generated `_redirects` rules, deliberately.
 *
 * Cloudflare Pages resolves `/projects/dunx` to `projects/dunx.html` on its own,
 * and normalises the `.html` form back to the clean URL. An explicit
 * `/projects/dunx -> /projects/dunx.html 200` rule fed straight back into that
 * normalisation and produced a 308 to itself: an infinite redirect on every
 * project page, live.
 *
 * The static catch-all in `public/_redirects` is all that is needed. Assets
 * resolve before it, so it only ever catches a route with no shell.
 */

/**
 * The sitemap, from the same route list the shells were written from.
 *
 * Hand-maintaining it would guarantee it goes stale the first time a repo is
 * tagged `portfolio`, which is the one thing this pipeline exists to prevent.
 */
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...['', ...all.map((shell) => shell.path)].map(
    (path) => `  <url><loc>${site.url}/${path}</loc></url>`,
  ),
  '</urlset>',
].join('\n');

await Bun.write(`${DIST}sitemap.xml`, `${sitemap}\n`);

/**
 * Fills the CSP's `frame-src` with the origins of exactly those embeds a
 * generator saw answer.
 *
 * Written here rather than kept as a literal in `public/_headers` for the same
 * reason the sitemap is: a project going live must not need a hand edit, and a
 * project going dark must stop being framable. `'none'` is the correct value
 * when nothing is live, and is what a fresh snapshot with no embeds produces.
 */
const origins = [
  ...new Set(
    projects
      .filter((project) => project.embed?.status === 'live')
      .map((project) => new URL(project.embed?.url ?? '').origin),
  ),
].sort();

const headers = Bun.file(`${DIST}_headers`);
if (!(await headers.exists())) {
  throw new Error(`shells: no _headers in ${DIST} to write a frame-src into`);
}

const policy = await headers.text();
if (!policy.includes('%FRAME_SRC%')) {
  throw new Error('shells: no %FRAME_SRC% placeholder in _headers');
}

await Bun.write(
  `${DIST}_headers`,
  policy.replaceAll(
    '%FRAME_SRC%',
    origins.length === 0 ? "'none'" : origins.join(' '),
  ),
);

console.log(
  `shells: ${all.length} routes written, sitemap with ${all.length + 1} urls, ` +
    `frame-src ${origins.length === 0 ? "'none'" : origins.join(' ')}`,
);
