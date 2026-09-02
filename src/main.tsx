import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
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
 */
createRoot(container).render(
  <StrictMode>
    <ColorSchemeScript forceColorScheme="dark" />
    <MantineProvider theme={theme} forceColorScheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>,
);
