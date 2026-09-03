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

describe('themes', () => {
  /** Opens the picker and chooses one. Two clicks, since it is a popover now. */
  const pick = async (id: string): Promise<void> => {
    await preview.click('button[aria-label="Theme"]');
    await preview.click(`button[data-theme-option="${id}"]`);
  };

  /**
   * The ground each theme paints, as the brightest channel of the body
   * background. Absolute values would pin the test to a palette; the question
   * is only whether the two are on opposite sides of mid.
   */
  const brightest = (colour: string): number =>
    Math.max(...(colour.match(/\d+/g)?.slice(0, 3).map(Number) ?? [0]));

  test('a first visit follows the system preference', async () => {
    await preview.view(1440, 900);

    await preview.scheme('dark');
    await preview.open('/');
    expect({
      theme: await preview.attr('html', 'data-theme'),
      dark: brightest(await preview.background()) < 90,
    }).toEqual({ theme: 'dark', dark: true });

    await preview.scheme('light');
    await preview.open('/');
    expect({
      theme: await preview.attr('html', 'data-theme'),
      light: brightest(await preview.background()) > 200,
    }).toEqual({ theme: 'light', light: true });
  }, 30_000);

  test('every theme drives Mantine to the scheme it is built for', async () => {
    const { THEMES } = await import('../src/theme/themes');

    await preview.scheme('dark');
    await preview.open('/');

    for (const entry of THEMES) {
      await pick(entry.id);
      expect({
        id: entry.id,
        theme: await preview.attr('html', 'data-theme'),
        scheme: await preview.attr('html', 'data-mantine-color-scheme'),
      }).toEqual({ id: entry.id, theme: entry.id, scheme: entry.base });
    }
  }, 30_000);

  /**
   * The reason `theme-init.js` is a separate blocking file rather than an
   * inline block: the CSP allows no inline script, so a choice that did not
   * survive a reload would mean it never ran at all.
   */
  test('the choice survives a reload, with no flash of the other theme', async () => {
    await preview.scheme('dark');
    await preview.open('/');
    await pick('light');

    await preview.open('/projects');
    expect({
      theme: await preview.attr('html', 'data-theme'),
      light: brightest(await preview.background()) > 200,
    }).toEqual({ theme: 'light', light: true });

    // Back to the default, so the shared preview does not leak a stored
    // preference into every test that runs after this one.
    await pick('dark');
    expect(await preview.attr('html', 'data-theme')).toBe('dark');
  }, 30_000);
});

describe('embeds', () => {
  test('no offline embed is ever rendered as an iframe', async () => {
    // The regression test for this site's actual production bug: three iframes
    // pointing at hosts that no longer resolve, rendering a broken-image glyph
    // for months. An iframe may only exist where a generator confirmed a 2xx.
    const { projects } = await import('../src/data/index');

    await preview.view(1440, 900);
    await preview.scheme('dark');

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

describe('metadata', () => {
  /**
   * Regression test for a live bug: `/* /index.html 200` matched an
   * extensionless path before Cloudflare looked for a directory index, so
   * `/projects/dunx` served the landing page's title and card while
   * `/projects/dunx/` served the right one. Every real link uses the first form.
   */
  test('a project route serves its own title and card, with no trailing slash', async () => {
    const html = await fetch(`${preview.origin}/projects/dunx`).then((r) =>
      r.text(),
    );

    expect(html).toContain('<title>dunx — Petar Zarkov</title>');
    expect(html).toContain('/og/dunx.png');
  });

  test('each route has a distinct title', async () => {
    const titles = await Promise.all(
      ['/', '/projects', '/skills', '/about'].map(async (path) => {
        const html = await fetch(`${preview.origin}${path}`).then((r) =>
          r.text(),
        );
        return /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
      }),
    );

    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('the about backdrop', () => {
  /**
   * Regression test for a bug a screenshot cannot show.
   *
   * `THREE.Clock.elapsedTime` is a property that only advances when one of the
   * getters is called. Reading it directly meant every frame computed the same
   * positions, so the renderer redrew an identical image sixty times a second:
   * a scene that looks correct in any still and is completely frozen in life.
   *
   * Two frames a beat apart have to differ.
   */
  test('the scene is actually animating', async () => {
    // Wide: the rig only renders at 62em and up. See the narrow case below.
    await preview.view(1440, 900);
    await preview.scheme('dark');
    await preview.open('/about');

    // Past the dynamic import of three and the first render.
    await Bun.sleep(2500);
    const first = await preview.screenshot();
    await Bun.sleep(1200);
    const second = await preview.screenshot();

    const a = new Uint8Array(await first.arrayBuffer());
    const b = new Uint8Array(await second.arrayBuffer());

    expect(a.byteLength).toBeGreaterThan(0);
    expect(Bun.SHA1.hash(a, 'hex')).not.toBe(Bun.SHA1.hash(b, 'hex'));
  }, 30_000);

  test('it renders a canvas rather than the no-WebGL fallback', async () => {
    await preview.view(1440, 900);
    await preview.open('/about');
    await Bun.sleep(2500);
    expect(await preview.count('canvas')).toBe(1);
  }, 20_000);

  /**
   * Narrow gets the scene too, in a band of its own rather than behind the
   * text.
   *
   * The regression this guards is the reason the band exists: full-bleed, the
   * ceramic sat directly under body copy at 16px, and dimming it far enough to
   * fix that made it invisible. A canvas that is back to overlapping the
   * heading means the layout has collapsed to the version that was unreadable.
   */
  test('a narrow viewport renders the scene, clear of the copy', async () => {
    await preview.view(390, 844);
    await preview.open('/about');
    await Bun.sleep(2500);

    expect(await preview.count('canvas')).toBe(1);
    expect(await preview.overlaps('canvas', 'h1')).toBe(false);
  }, 20_000);
});

describe('budget', () => {
  /**
   * The entry chunk is what every visitor downloads before anything renders.
   * Route chunks and the palette are deliberately excluded - they are split so
   * that they do not count against first paint, and folding them back in here
   * would make the split pointless.
   *
   * 150 KB is the figure docs/05-experience.md commits to. It has already been
   * exceeded once, by @mantine/spotlight landing in the entry chunk, which is
   * why this test exists rather than the number living only in a document.
   */
  test('the entry chunk stays under 150 KB gzipped', async () => {
    const assets = new URL('../dist/assets/', import.meta.url).pathname;
    const entry = [...new Bun.Glob('index-*.js').scanSync(assets)];
    expect(entry).toHaveLength(1);

    const name = entry[0];
    if (name === undefined) throw new Error('no entry chunk');

    const bytes = await Bun.file(`${assets}${name}`).bytes();
    const gzipped = Bun.gzipSync(bytes).byteLength;

    expect({
      kb: Math.round((gzipped / 1024) * 10) / 10,
      over: gzipped > 150 * 1024,
    }).toEqual({ kb: Math.round((gzipped / 1024) * 10) / 10, over: false });
  });
});
