import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MantineProvider } from '@mantine/core';
import { buildTheme } from './theme';
import { byId, THEME_KEY, type ThemeDef } from './themes';

interface ThemeState {
  readonly current: ThemeDef;
  readonly setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const remember = (id: string): void => {
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {
    // Private windows and blocked site data both throw. The theme still
    // applies for this visit; it simply is not remembered for the next.
  }
};

/**
 * Owns the current theme, and hands Mantine the scheme that theme sits on.
 *
 * The initial value is read back off `<html>` rather than worked out again:
 * `public/theme-init.js` has already stamped the attribute before first paint,
 * and deciding independently here is how React's idea of the theme and the one
 * actually painted drift apart.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState(
    () => document.documentElement.dataset['theme'] ?? null,
  );
  const current = byId(id);

  const setTheme = useCallback((next: string) => {
    const chosen = byId(next);
    setId(chosen.id);
    // Mantine writes `data-mantine-color-scheme` itself from `forceColorScheme`
    // below; this is the one it does not know about.
    document.documentElement.setAttribute('data-theme', chosen.id);
    remember(chosen.id);
  }, []);

  const value = useMemo(() => ({ current, setTheme }), [current, setTheme]);

  // Rebuilt only when the palette changes: Mantine regenerates its whole
  // variable block from this, which is not work to repeat on every render.
  const mantine = useMemo(
    () => buildTheme(current.brand, current.primaryShade),
    [current.brand, current.primaryShade],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider theme={mantine} forceColorScheme={current.base}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeState => {
  const state = useContext(ThemeContext);
  if (!state) throw new Error('useTheme called outside ThemeProvider');
  return state;
};
