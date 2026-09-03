import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import './theme/themes.css';
import './theme/global.css';

import { ThemeProvider } from './theme/useTheme';
import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('No #root to mount into');

/**
 * `BrowserRouter`, not `HashRouter`. Real paths mean linkable routes, real
 * search indexing and real link previews; `public/_redirects` gives Cloudflare
 * Pages the SPA fallback that needs.
 *
 * No `ColorSchemeScript`. It exists to stamp the scheme onto <html> before a
 * server-rendered page paints; rendered by a client-only app it runs no earlier
 * than the provider beside it, and all it contributed was an inline <script> -
 * which the CSP refuses. `public/theme-init.js` does that job properly, from a
 * same-origin file the policy allows, before first paint.
 */
createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
