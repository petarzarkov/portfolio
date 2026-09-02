import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const src = (...parts: string[]) =>
  path.resolve(import.meta.dirname, 'src', ...parts);

// Aliases must mirror `tsconfig.json`'s `paths`: two resolvers, and they drift.
export default defineConfig({
  resolve: {
    alias: {
      '@components': src('components'),
      '@contracts': src('contracts'),
      '@config': src('config'),
      '@data': src('data'),
      '@screens': src('screens'),
      '@theme': src('theme'),
    },
  },
  plugins: [react()],
});
