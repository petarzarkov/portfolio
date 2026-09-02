import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import {
  ROUTES,
  SCHEMES,
  startPreview,
  VIEWPORTS,
  type Preview,
} from './preview';

/**
 * The built site in a real browser, which is a different question from a
 * component test. This asserts what happy-dom cannot answer: that the bundle
 * parses, that a route reached by direct link works on a cold load, that real
 * layout does not scroll sideways, and that nothing logs an error on the way.
 *
 * Each case writes its PNG into `.shots/` *before* asserting, so a failure
 * leaves the frame behind to look at. `bun run shots` is a build plus this
 * suite, so the pictures and the assertions cannot drift apart.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const shots = new URL('./.shots/', import.meta.url).pathname;

let preview: Preview;

beforeAll(async () => {
  if (!(await Bun.file(`${dist}index.html`).exists())) {
    throw new Error(`No built site at ${dist}. Run \`bun run build\` first.`);
  }
  preview = await startPreview(dist);
});

afterAll(async () => {
  await preview?.close();
});

/**
 * The heading each route must land on. A route falling back to the landing page
 * or to the not-found fails here rather than looking plausible in a screenshot.
 */
const HEADINGS: Record<string, RegExp> = {
  landing: /Petar Zarkov/i,
  projects: /^Projects$/i,
  'project-detail': /^dunx$/i,
  skills: /^Skills$/i,
  about: /^About$/i,
  'not-found': /Not found/i,
};

for (const scheme of SCHEMES) {
  for (const [viewport, width, height] of VIEWPORTS) {
    describe(`${viewport} ${scheme}`, () => {
      for (const [name, path] of ROUTES) {
        test(`${name} loads cold, fits the width and logs no error`, async () => {
          await preview.scheme(scheme);
          await preview.view(width, height, 2);
          await preview.open(path);

          await Bun.write(
            `${shots}${name}-${viewport}-${scheme}.png`,
            await preview.screenshot(),
          );

          const expected = HEADINGS[name];
          if (!expected) throw new Error(`no expected heading for ${name}`);

          expect(await preview.heading()).toMatch(expected);
          expect(await preview.overflows()).toBe(false);
          expect(
            preview.logged().filter((line) => line.type === 'error'),
          ).toEqual([]);
        });
      }
    });
  }
}

describe('colour scheme', () => {
  test('the two schemes actually paint differently', async () => {
    // `defaultColorScheme="auto"`, so the page follows prefers-color-scheme
    // with nothing stored. A site painting identically under both would mean
    // the dark palette never applied - and that half the screenshots above are
    // of a light site.
    await preview.view(1440, 900);

    await preview.scheme('light');
    await preview.open('/');
    const light = await preview.background();

    await preview.scheme('dark');
    await preview.open('/');
    const dark = await preview.background();

    expect(light).not.toBe(dark);
  });
});

describe('embeds', () => {
  test('no offline embed is ever rendered as an iframe', async () => {
    // The regression test for this site's actual production bug: three iframes
    // pointing at hosts that no longer resolve, rendering a broken-image glyph
    // for months. An iframe may only exist where a generator confirmed a 2xx.
    const { projects } = await import('../src/data/index');

    await preview.view(1440, 900);
    await preview.scheme('light');

    for (const project of projects) {
      if (project.embed?.status === 'live') continue;

      await preview.open(`/projects/${project.slug}`);
      expect({
        slug: project.slug,
        iframes: await preview.count('iframe'),
      }).toEqual({ slug: project.slug, iframes: 0 });
    }
  }, 60_000);

  test('a live embed does render one', async () => {
    const { projects } = await import('../src/data/index');
    const live = projects.find((p) => p.embed?.status === 'live');
    if (!live) throw new Error('fixture expects at least one live embed');

    await preview.open(`/projects/${live.slug}`);
    expect(await preview.count('iframe')).toBe(1);
  });
});

describe('accessibility', () => {
  test('every route has exactly one h1', async () => {
    await preview.view(1440, 900);
    for (const [, path] of ROUTES) {
      await preview.open(path);
      expect({ path, h1s: await preview.count('h1') }).toEqual({
        path,
        h1s: 1,
      });
    }
  }, 30_000);

  test('every iframe carries a title', async () => {
    await preview.open('/');
    expect(await preview.count('iframe:not([title])')).toBe(0);
  });

  test('the skills treemap is keyboard reachable', async () => {
    await preview.open('/skills');
    expect(
      await preview.count('[role="button"][tabindex="0"]'),
    ).toBeGreaterThan(0);
  });
});
