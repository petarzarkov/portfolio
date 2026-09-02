import { createTheme, type MantineColorsTuple } from '@mantine/core';

/**
 * One designed palette, light and dark.
 *
 * What this replaces: a `themes.ts` that generated a theme per Chakra colour -
 * roughly twenty of them - behind a palette switcher in the navbar. Nothing can
 * be designed against twenty palettes, and it was the clearest reason the old
 * site read as a demo rather than a portfolio.
 *
 * Amber rather than the usual portfolio indigo: it is distinctive, and it is
 * already the personal mark (the coffee in the old title). `autoContrast` is
 * what makes a warm accent safe - Mantine picks black or white text per shade
 * instead of assuming white, which a mid-amber fails badly.
 */
const brand: MantineColorsTuple = [
  '#fff8e2',
  '#ffefcc',
  '#ffdd9b',
  '#ffca64',
  '#ffba38',
  '#ffb01b',
  '#ffab09',
  '#e39500',
  '#ca8400',
  '#af7100',
];

/** Warm-shifted neutrals, so the greys sit under the amber instead of fighting it. */
const sand: MantineColorsTuple = [
  '#f6f5f2',
  '#e8e6e1',
  '#d1cec6',
  '#b8b4a8',
  '#a29d8f',
  '#948e7e',
  '#8c8674',
  '#797462',
  '#6c6755',
  '#5d5946',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 7, dark: 5 },
  autoContrast: true,
  colors: { brand, sand },

  // A system stack rather than a webfont: no third-party origin, no CSP
  // exception, nothing on the critical path. The old site set 'Courier New' as
  // both body *and* heading font for every page.
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
  headings: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontWeight: '650',
    sizes: {
      h1: { fontSize: 'clamp(2.1rem, 5.5vw, 3.6rem)', lineHeight: '1.08' },
      h2: { fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', lineHeight: '1.18' },
      h3: { fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', lineHeight: '1.3' },
    },
  },

  defaultRadius: 'md',
  cursorType: 'pointer',

  other: {
    /**
     * Three durations and two easings, used by everything. A motion system is
     * what makes a site feel like one object rather than a pile of effects.
     */
    fast: 0.12,
    base: 0.24,
    slow: 0.4,
    ease: [0.22, 1, 0.36, 1] as const,
    spring: { type: 'spring', stiffness: 320, damping: 30 } as const,
  },
});
