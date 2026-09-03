/**
 * The themes the picker offers, as data.
 *
 * Metadata lives here and colour lives in `themes.css`, next to the rest of the
 * styling: a theme is a block of tokens, and the only things TypeScript needs
 * to know about it are what to call it, which Mantine colour scheme its
 * components sit on, and what to paint on its swatch.
 *
 * Deliberately a short, designed list rather than a hue generator. The site
 * this one replaced shipped a theme per Chakra colour - about twenty - behind a
 * navbar switcher, and nothing can be designed against twenty palettes; it was
 * the clearest reason that version read as a demo rather than a portfolio. Each
 * entry here is a palette someone chose and checked for contrast.
 */
export interface ThemeDef {
  /** Written to `data-theme` on <html>, and matched by a block in themes.css. */
  readonly id: string;
  readonly label: string;
  /**
   * Which of Mantine's two schemes this theme's components sit on. Mantine has
   * no notion of a third, so every theme has to declare which side it is
   * closer to - that is what its inputs, menus and shadows are built from.
   */
  readonly base: 'light' | 'dark';
  /** Ground and accent, for the picker's swatch. Literal, since it is a preview. */
  readonly swatch: readonly [string, string];
}

export const THEMES: readonly ThemeDef[] = Object.freeze([
  { id: 'dark', label: 'Dark', base: 'dark', swatch: ['#1f1f1f', '#ffba38'] },
  {
    id: 'light',
    label: 'Light',
    base: 'light',
    swatch: ['#f6f5f2', '#ca8400'],
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
