import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import './theme/global.css';

import { theme } from './theme/theme';
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
 * than the provider beside it, so all it contributed was an inline <script> -
 * which is the one thing standing between this site and a CSP with no
 * `unsafe-inline` in `script-src`. `<meta name="color-scheme">` in index.html
 * is what actually prevents the flash, and it ships in the HTML.
 */
createRoot(container).render(
  <StrictMode>
    <MantineProvider theme={theme} forceColorScheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
