import { describe, expect, test } from 'bun:test';
import { DEFAULT_THEME, THEME_KEY, THEMES } from './themes';

const alpha = (a: string, b: string): number => a.localeCompare(b);

/**
 * A theme is spread across three files that cannot import one another:
 *
 *   - `themes.ts`      the list, for the picker
 *   - `themes.css`     the colours
 *   - `theme-init.js`  the pre-paint stamp, which has to run before the bundle
 *                      exists and so cannot share a module with either
 *
 * Every failure mode here is quiet. A theme in the list with no CSS block is a
 * swatch that switches to an unstyled page; a block missing one token inherits
 * whatever the last theme set; an id the init script has never heard of is
 * silently replaced by the default on the next reload. So the three are checked
 * against each other rather than trusted.
 */
const css = await Bun.file(new URL('./themes.css', import.meta.url)).text();
const init = await Bun.file(
  new URL('../../public/theme-init.js', import.meta.url),
).text();

const blocks = [...css.matchAll(/\[data-theme='([^']+)'\]\s*\{([^}]*)\}/g)];

const tokensIn = (body: string): string[] =>
  [...body.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1] ?? '').sort();

describe('themes.css', () => {
  test('defines a block for every theme, and no others', () => {
    expect(blocks.map((b) => b[1] ?? '').sort(alpha)).toEqual(
      THEMES.map((t) => t.id).sort(alpha),
    );
  });

  test('every theme answers exactly the same set of tokens', () => {
    const [first, ...rest] = blocks;
    if (!first) throw new Error('no theme blocks parsed');

    const expected = tokensIn(first[2] ?? '');
    expect(expected.length).toBeGreaterThan(8);

    for (const block of rest) {
      expect({ theme: block[1], tokens: tokensIn(block[2] ?? '') }).toEqual({
        theme: block[1],
        tokens: expected,
      });
    }
  });

  test('every theme sets a color-scheme, so browser chrome follows', () => {
    for (const block of blocks) {
      expect({
        theme: block[1],
        declared: /color-scheme:/.test(block[2] ?? ''),
      }).toEqual({ theme: block[1], declared: true });
    }
  });
});

describe('theme-init.js', () => {
  test('knows exactly the themes that exist', () => {
    const listed = /var KNOWN = \[([^\]]*)\]/.exec(init)?.[1] ?? '';
    const ids = [...listed.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(ids.map((id) => id ?? '').sort(alpha)).toEqual(
      THEMES.map((t) => t.id).sort(alpha),
    );
  });

  test('falls back to the same default', () => {
    expect(/var FALLBACK = '([^']+)'/.exec(init)?.[1]).toBe(DEFAULT_THEME);
  });

  test('reads the same storage key', () => {
    expect(init).toContain(`localStorage.getItem('${THEME_KEY}')`);
  });

  test('maps every theme to the base its components are built for', () => {
    const map = /var BASE = \{([^}]*)\}/.exec(init)?.[1] ?? '';
    const pairs = [...map.matchAll(/(\w+):\s*'([^']+)'/g)].map(
      (m) => `${m[1]}=${m[2]}`,
    );
    expect(pairs.sort()).toEqual(THEMES.map((t) => `${t.id}=${t.base}`).sort());
  });
});
