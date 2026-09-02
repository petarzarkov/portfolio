/**
 * Social card images, one per route, rendered with Satori and resvg.
 *
 * Pasting a link into Slack or LinkedIn currently produces a bare title. These
 * are what make it produce a card.
 *
 * Written into `public/og/` and committed, like everything else the pipeline
 * produces: the build stays offline and deterministic.
 */
import { mkdir } from 'node:fs/promises';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { Project } from '../../src/contracts/portfolio';

const WIDTH = 1200;
const HEIGHT = 630;
const OUT = new URL('../../public/og/', import.meta.url).pathname;

/**
 * Satori needs real font data - it has no system font access. Rather than
 * vendoring a megabyte of TTF into the repo, this looks for one of the fonts
 * every mainstream Linux image ships. `ubuntu-latest` has DejaVu.
 */
const FONT_CANDIDATES = [
  [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  ],
  [
    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
  ],
  [
    '/System/Library/Fonts/Helvetica.ttc',
    '/System/Library/Fonts/Helvetica.ttc',
  ],
] as const;

interface Fonts {
  regular: ArrayBuffer;
  bold: ArrayBuffer;
}

const loadFonts = async (): Promise<Fonts | null> => {
  for (const [regular, bold] of FONT_CANDIDATES) {
    const a = Bun.file(regular);
    const b = Bun.file(bold);
    if ((await a.exists()) && (await b.exists())) {
      return { regular: await a.arrayBuffer(), bold: await b.arrayBuffer() };
    }
  }
  return null;
};

const BG = '#17161a';
const AMBER = '#ffb01b';
const MUTED = '#9a958c';

/** Satori takes React-shaped objects; there is no JSX here on purpose. */
const card = (title: string, subtitle: string, meta: string): unknown => ({
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: BG,
      padding: '72px',
      // The one flourish: a hairline in the accent along the top edge.
      borderTop: `10px solid ${AMBER}`,
      fontFamily: 'sans',
    },
    children: [
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column' },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 28,
                  color: MUTED,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 24,
                },
                children: meta,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: title.length > 24 ? 68 : 88,
                  fontWeight: 700,
                  color: '#f4f2ef',
                  lineHeight: 1.08,
                  marginBottom: 22,
                },
                children: title,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 34,
                  color: MUTED,
                  lineHeight: 1.35,
                  // Satori has no line clamping; a long description would
                  // otherwise run off the bottom of the card.
                  maxHeight: 150,
                  overflow: 'hidden',
                },
                children: subtitle.slice(0, 150),
              },
            },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontSize: 30,
            color: AMBER,
            fontWeight: 700,
          },
          children: 'petarzarkov.com',
        },
      },
    ],
  },
});

const render = async (
  fonts: Fonts,
  name: string,
  title: string,
  subtitle: string,
  meta: string,
): Promise<void> => {
  const svg = await satori(card(title, subtitle, meta) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'sans', data: fonts.regular, weight: 400, style: 'normal' },
      { name: 'sans', data: fonts.bold, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
    .render()
    .asPng();

  await Bun.write(`${OUT}${name}.png`, png);
};

/**
 * Returns how many cards were written. Zero means no usable font was found,
 * which is a warning rather than a failure - the site falls back to its
 * committed default card.
 */
export const generateOg = async (
  projects: readonly Project[],
): Promise<number> => {
  const fonts = await loadFonts();
  if (!fonts) return 0;

  await mkdir(OUT, { recursive: true });

  await render(
    fonts,
    'default',
    'Petar Zarkov',
    'Frameworks, games, smart contracts, trading systems and the pipelines that ship them.',
    'Software Engineering Manager',
  );

  for (const project of projects) {
    const stars = project.stars > 0 ? ` · ★ ${project.stars}` : '';
    await render(
      fonts,
      project.slug,
      project.title,
      project.headline ?? project.description ?? '',
      `${project.tier}${stars}`,
    );
  }

  return projects.length + 1;
};
