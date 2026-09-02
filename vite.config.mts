import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    resolve: {
      alias: {
        '@components': path.resolve(import.meta.dirname, './src/components'),
        '@contracts': path.resolve(import.meta.dirname, './src/contracts'),
        '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
        '@screens': path.resolve(import.meta.dirname, './src/screens'),
        '@config': path.resolve(import.meta.dirname, './src/config'),
        '@theme': path.resolve(import.meta.dirname, './src/theme'),
        '@store': path.resolve(import.meta.dirname, './src/store'),
      },
    },
    plugins: [react()],
  };
});
