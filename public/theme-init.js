/**
 * Applies the saved theme before the page paints.
 *
 * An external file, not an inline script, and that is the whole point: the CSP
 * in `_headers` allows `script-src 'self'` with no `unsafe-inline`, so an inline
 * block here would simply be refused and every visitor would get one frame of
 * the wrong theme. Same-origin and blocking in <head> costs a few hundred bytes
 * and runs before first paint.
 *
 * Deliberately duplicates the default and the storage key from `themes.ts`
 * rather than importing them: this has to run before the bundle, so it cannot
 * be part of it. `themes.test.ts` asserts the two agree.
 */
(function () {
  var FALLBACK = 'dark';
  var KNOWN = ['dark', 'light', 'violet', 'ocean'];
  var BASE = {
    dark: 'dark',
    light: 'light',
    violet: 'dark',
    ocean: 'dark',
  };

  var chosen = null;
  try {
    chosen = localStorage.getItem('theme');
  } catch (e) {
    // Private windows and blocked site data both throw. Not knowing the
    // preference is not a reason to fail to paint.
  }

  if (KNOWN.indexOf(chosen) === -1) {
    chosen = null;
  }

  if (chosen === null) {
    chosen =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : FALLBACK;
  }

  var root = document.documentElement;
  root.setAttribute('data-theme', chosen);
  // Mantine reads this one for its own component styling.
  root.setAttribute('data-mantine-color-scheme', BASE[chosen] || FALLBACK);
})();
