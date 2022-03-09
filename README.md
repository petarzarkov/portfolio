# Petar Zarkov's Portfolio

<p align="left">
  <a href="https://vitejs.dev/" target="blank"><img title="ViteJS" alt="ViteJS" width="26" src="https://vitejs.dev/logo.svg" /></a>
  <a href="https://reactjs.org/" target="blank"><img title="React" alt="React" width="26" src="https://reactnative.dev/img/pwa/manifest-icon-512.png" /></a>
  <a href="https://www.javascript.com/" target="blank"><img title="JavaScript" alt="JavaScript" width="26" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" /></a>
  <a href="https://www.typescriptlang.org/" target="blank"><img title="Typescript" alt="TypeScript" width="26px" src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" /></a>
</p>

### Requirements
- NodeJS >= 14.x.x
### Setup
```bash
npm install
npm start
```
### Github actions
  - build on push to any branch
  - push to gh-pages branch on merge to dev

### Alias resolving
- allows for alias imports
```typescript
import { Header, IconLink } from "@components";
```
- needs to be edited in tsconfig.json paths
```json
{
  "compilerOptions": {
    ...
    "paths": {
      "@components": ["./src/components"],
      "@styles": ["./src/styles"]
    }
}
```
- needs to be edited in vite.config.ts resolve.alias
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio/",
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles")
    }
  },
  plugins: [react()]
});
```

## [Preview](https://petarzarkov.github.io/portfolio/)