import type { MantineColorShade, MantineColorsTuple } from '@mantine/core';
import { AMBER } from './theme';

/**
 * The themes the picker offers, as data.
 *
 * A theme is three things: a brand ramp Mantine derives its own colours from, a
 * block of semantic tokens in `themes.css` for the surfaces around them, and
 * the scheme its components sit on. Adding one means an entry here and a block
 * there; `themes.test.ts` fails if the two disagree.
 *
 * Deliberately a short, designed list rather than a hue generator. The site
 * this one replaced shipped a theme per Chakra colour - about twenty - behind a
 * navbar switcher, and nothing can be designed against twenty palettes; it was
 * the clearest reason that version read as a demo rather than a portfolio.
 * Every ramp below was drawn and every text colour on it measured against WCAG
 * AA, which is what a generator cannot do for you.
 */
export interface ThemeDef {
  /** Written to `data-theme` on <html>, and matched by a block in themes.css. */
  readonly id: string;
  readonly label: string;
  /**
   * Which of Mantine's two schemes this theme's components sit on. Mantine has
   * no notion of a third, so every theme declares which side it is closer to -
   * that is what its inputs, menus and shadows are built from.
   */
  readonly base: 'light' | 'dark';
  /** Mantine derives filled, light, outline and focus colours from this. */
  readonly brand: MantineColorsTuple;
  /**
   * Which shade fills a primary button, when the default of 7/5 does not work.
   *
   * `autoContrast` is meant to make this unnecessary by picking black or white
   * text per shade, and for amber and violet it does. On the aqua ramp it does
   * not: Mantine sets `--mantine-primary-color-contrast` to black, correctly,
   * and then renders the button's label white anyway - 2.4:1, measured. Rather
   * than depend on that agreeing, Ocean fills from a shade dark enough that
   * white is right either way.
   */
  readonly primaryShade?: {
    readonly light: MantineColorShade;
    readonly dark: MantineColorShade;
  };
  /** Ground and accent, for the picker's swatch. Literal, since it is a preview. */
  readonly swatch: readonly [string, string];
}

/** Soft violet, light enough at the top to stay legible on a near-black ground. */
const VIOLET: MantineColorsTuple = [
  '#f2eeff',
  '#e0d8fb',
  '#c8b8f5',
  '#a68fe9',
  '#8e73e0',
  '#7d5eda',
  '#7452d8',
  '#6343bf',
  '#583aab',
  '#4b3096',
];

/**
 * Aqua, on deep water. The complement of the amber the site is built around,
 * which is why it sits beside it rather than fighting it.
 */
const OCEAN: MantineColorsTuple = [
  '#e6fbf7',
  '#c9f2ec',
  '#96e4d9',
  '#5fd4c4',
  '#38c6b3',
  '#22bda8',
  '#0fb6a0',
  '#009f8b',
  '#008d7b',
  '#00786a',
];

export const THEMES: readonly ThemeDef[] = Object.freeze([
  {
    id: 'dark',
    label: 'Dark',
    base: 'dark',
    brand: AMBER,
    swatch: ['#1f1f1f', '#ffba38'],
  },
  {
    id: 'light',
    label: 'Light',
    base: 'light',
    brand: AMBER,
    swatch: ['#f6f5f2', '#ca8400'],
  },
  {
    id: 'violet',
    label: 'Violet',
    base: 'dark',
    brand: VIOLET,
    swatch: ['#14121c', '#a68fe9'],
  },
  {
    id: 'ocean',
    label: 'Ocean',
    base: 'dark',
    brand: OCEAN,
    primaryShade: { light: 9, dark: 9 },
    swatch: ['#0f191d', '#5fd4c4'],
  },
]);

export const DEFAULT_THEME = 'dark';

/** Where the choice is remembered. Shared with `public/theme-init.js`. */
export const THEME_KEY = 'theme';

export const byId = (id: string | null): ThemeDef =>
  THEMES.find((theme) => theme.id === id) ??
  THEMES.find((theme) => theme.id === DEFAULT_THEME) ??
  // `THEMES` is frozen and non-empty, so this is unreachable; typed rather than
  // asserted so a future edit that empties the list fails here loudly.
  (() => {
    throw new Error('no themes defined');
  })();
