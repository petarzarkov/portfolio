# 01 — Tooling

Replace pnpm, husky, lint-staged, ESLint and Prettier with the `dunx` toolchain:
Bun, stagelint, oxlint, oxfmt and TypeScript 7. Source of truth for every config
below is `/home/petarzarkov/repos/dunx`, adapted — not copied verbatim, since dunx
is a Bun-runtime monorepo and this is a browser SPA.

## Target versions

Pinned exactly, the way dunx pins them. Floating ranges are what let this repo rot
into an unsupported React/Chakra pairing in the first place.

| Package                | Version    | Note                                              |
| ---------------------- | ---------- | ------------------------------------------------- |
| `bun`                  | `1.4.0`    | pinned in the CI setup action, one place only     |
| `oxlint`               | `1.81.0`   |                                                   |
| `oxlint-tsgolint`      | `7.0.2001` | required for `typeAware`                          |
| `oxfmt`                | `0.66.0`   |                                                   |
| `@stagelint/stagelint` | `0.1.4`    |                                                   |
| `typescript`           | `7.0.2`    | native `tsgo`; what makes type-aware linting fast |
| `@types/bun`           | `1.4.0`    |                                                   |
| `vite`                 | `8.x`      | current is 8.2.2; upgrade from 6.2.1              |
| `@vitejs/plugin-react` | `6.1.1`    |                                                   |

## Step 1 — unblock Bun

`"preinstall": "npx only-allow pnpm"` fails `bun install` before anything else can
happen. Remove it first.

Also remove from [package.json](../package.json):

- `"packageManager": "pnpm@10.4.0+sha512..."`
- the `"pnpm": { "onlyBuiltDependencies": [...] }` block
- `"prepare": "husky"` → replaced in step 4

Then:

```sh
rm pnpm-lock.yaml
bun install          # writes bun.lock
```

Add `bun.lock` to git, and add `pnpm-lock.yaml` to `.gitignore` as a tripwire so a
stray `pnpm install` cannot re-introduce it silently.

## Step 2 — `bunfig.toml`

dunx's `bunfig.toml` is entirely `[test]` configuration for a monorepo with
coverage floors. Ours is smaller, but the coverage-ignore idea carries over:
generated data and fixtures should not count against a coverage figure.

```toml
# Bun configuration — https://bun.sh/docs/runtime/bunfig

[install]
# The lockfile is committed; CI must never silently resolve a different tree.
frozenLockfile = false   # true is set per-invocation in CI, not globally

[test]
coverageDir = "coverage"
coverageReporter = ["text", "lcov"]
coverageSkipTestFiles = true
coveragePathIgnorePatterns = [
  # Generated from the GitHub/npm APIs by scripts/gen — see docs/03.
  # Counting a JSON snapshot's transpiled module as untested code is noise.
  "**/src/generated/**",
  "**/*.fixture.ts",
  "**/dist/**",
]
preload = ["./happydom.ts"]
```

The `preload` line registers happy-dom for component tests (doc 06). **The browser
suite must not load it** — see [06-testing.md](./06-testing.md) for why, and for
the separate `bunfig.toml` that suite needs.

## Step 3 — TypeScript 7 and `tsconfig.json`

The current [tsconfig.json](../tsconfig.json) targets ES6 with
`moduleResolution: "Node"`, which is wrong for a Vite build and blocks
`exports`-map packages like Mantine. Modernise:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler", // was "Node" — required for Mantine's exports map
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true, // forces `import type`, which oxlint checks
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true, // src/generated/*.json is imported directly
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": "./cache/tsconfig.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@components": ["./src/components"],
      "@components/*": ["./src/components/*"],
      "@contracts": ["./src/contracts"],
      "@hooks": ["./src/hooks"],
      "@screens": ["./src/screens"],
      "@config": ["./src/config"],
      "@theme": ["./src/theme"],
      "@data": ["./src/data"], // new — overrides layer, doc 03
      "@generated": ["./src/generated"], // new — generated snapshots, doc 03
    },
  },
  "include": ["./src", "./scripts", "./browser"],
  "references": [{ "path": "./tsconfig.node.json" }],
}
```

Every `paths` entry must be mirrored in `vite.config.mts` `resolve.alias` — they
are two separate resolvers and they drift. `@store` is dropped along with the
Chakra theme store (doc 04).

## Step 4 — stagelint replaces husky + lint-staged

**Delete:** `.husky/`, `lint-staged.config.mjs`.

**Add** `scripts/install-hooks.ts` — port dunx's verbatim; it is 60 lines and its
reasoning applies unchanged. The load-bearing detail, in dunx's own comment:

> `core.hooksPath` is what broke hooks in a linked worktree — the path is relative
> and `.husky/_` is gitignored, so git found no hooks there and skipped them
> silently. Writing into the repository's real hooks directory does not have that
> problem: git resolves it from the **common** dir, which every linked worktree
> shares.

It installs two hooks and unsets the `core.hooksPath` husky left behind:

- **pre-commit** → `stagelint`, which three-way merges a formatter's rewrite into a
  partially staged file instead of refusing the commit the way lint-staged did.
- **pre-push** → `oxfmt --list-different .`, because pre-commit only sees staged
  files and an unformatted one can still reach CI.

Wire it up: `"prepare": "bun scripts/install-hooks.ts"`.

**Add** `.stagelint.yml`, adapted for `.tsx`:

```yaml
# Replaces husky + lint-staged: one Rust binary, no runtime.
#
# The commands are the bare binaries, never `bun run lint` / `bun run format`.
# Those end in `.`, and the staged paths are appended, so `oxlint --fix . <files>`
# would lint the whole repo on every commit and fail on unrelated pre-existing
# errors.
'*.{ts,tsx,mts,cts}':
  - oxlint --fix --no-error-on-unmatched-pattern
  - oxfmt --no-error-on-unmatched-pattern

'*.{js,jsx,mjs,cjs,json,jsonc,md,css}': oxfmt --no-error-on-unmatched-pattern
```

Note `css` is added over dunx's list — Mantine ships CSS modules and we will write
some (doc 04).

## Step 5 — oxlint + oxfmt replace ESLint + Prettier

**Delete:** `eslint.config.mjs`, `prettier.config.mjs`, `.prettierignore`, and
these nine devDependencies: `eslint`, `@eslint/js`, `eslint-config-prettier`,
`eslint-plugin-react`, `@typescript-eslint/eslint-plugin`,
`@typescript-eslint/parser`, `typescript-eslint`, `prettier`, plus `husky` and
`lint-staged` from step 4.

**Add** `.oxlintrc.json` — dunx's file with three changes: drop the `dunx/*`
custom rules and the `jsPlugins` entry that implements them (they are project
specific), keep the `react` and `react-hooks` rules (this repo actually needs
them), and add `jsx-a11y` since accessibility is an explicit goal of the redesign.

```jsonc
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "import", "react", "jsx-a11y"],
  "categories": { "correctness": "warn" },
  "options": { "typeAware": true, "typeCheck": true },
  "ignorePatterns": [
    "**/*.js",
    "**/*.d.ts",
    "node_modules",
    "dist",
    "coverage",
    "**/*.md",
    "**/*.json",
    "src/generated", // machine-written; not ours to lint
  ],
  "rules": {
    // ... the full correctness + typescript block from dunx, unchanged ...
    "max-lines": ["error", { "max": 500 }],
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "react/jsx-key": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/iframe-has-title": "error",
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "typescript/await-thenable": "off",
        "max-lines": ["error", { "max": 800 }],
      },
    },
  ],
}
```

`react/jsx-key` and `jsx-a11y/iframe-has-title` will both fire on the existing
code — the hand-keyed icon arrays in
[work.tsx](../src/screens/projects/work.tsx) and the untitled iframes in
[hobbies.tsx](../src/screens/projects/hobbies.tsx). Both files are deleted in
phase 1 anyway (doc 03); until then, fix rather than suppress.

**Add** `.oxfmtrc.json`, dunx's settings with our ignore list:

```json
{
  "printWidth": 80,
  "singleQuote": true,
  "sortPackageJson": true,
  "ignorePatterns": [
    "dist",
    "node_modules",
    "coverage",
    ".vscode",
    ".idea",
    ".env*",
    "src/generated",
    "public"
  ]
}
```

`printWidth: 80` is a real change: the current Prettier config runs wider, so the
first `oxfmt --write .` will reformat most of `src/`. Do it as **one commit that
touches nothing else**, so it never has to be read in a review diff.

## Step 6 — `mcp.json`

```json
{
  "mcpServers": {
    "bun": {
      "type": "http",
      "url": "https://bun.com/docs/mcp"
    }
  }
}
```

Copied from dunx and verified as its only entry. A Mantine docs server would be
genuinely useful for phase 2 — Mantine publishes an `llms.txt`, but whether it
exposes an MCP endpoint needs checking before an entry goes in this file. Do not
add a URL that has not been hit.

## Step 7 — editor config

`.gitignore` currently has `.vscode/*` with only `extensions.json` re-included, so
the settings that make oxfmt format-on-save are not shared. Change to commit
`settings.json` too, with dunx's content:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "js/ts.tsdk.path": "node_modules/typescript/lib"
}
```

Add `.vscode/extensions.json` recommending `oxc.oxc-vscode` so a fresh clone gets
prompted.

## Resulting scripts

```jsonc
{
  "scripts": {
    "prepare": "bun scripts/install-hooks.ts",
    "start": "vite",
    "build": "bun run typecheck && bun run gen && vite build",
    "preview": "vite preview",

    "typecheck": "tsgo --noEmit",
    "lint": "oxlint --fix .",
    "lint:check": "oxlint --max-warnings 0 .",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",

    "test": "bun test src scripts",
    "test:cov": "bun test src scripts --coverage",
    "test:browser": "cd browser && bun test --timeout 60000",
    "shots": "bun run build && bun run test:browser",

    "gen": "bun scripts/gen/index.ts", // doc 03
    "ci": "bun scripts/ci.ts", // doc 02
  },
}
```

`bun run ci` locally runs exactly what CI runs — the property dunx gets from
routing every gate through one script. See [02-ci-cd.md](./02-ci-cd.md).

## File-by-file summary

| Action | Path                                                                                            |
| ------ | ----------------------------------------------------------------------------------------------- |
| delete | `.husky/`, `lint-staged.config.mjs`                                                             |
| delete | `eslint.config.mjs`, `prettier.config.mjs`, `.prettierignore`                                   |
| delete | `pnpm-lock.yaml`                                                                                |
| add    | `bun.lock`, `bunfig.toml`                                                                       |
| add    | `.stagelint.yml`, `.oxlintrc.json`, `.oxfmtrc.json`, `mcp.json`                                 |
| add    | `scripts/install-hooks.ts`, `scripts/ci.ts`                                                     |
| add    | `.vscode/settings.json`, `.vscode/extensions.json`                                              |
| edit   | `package.json` — scripts, deps, drop pnpm fields, fix `@types/react-dom` trailing space         |
| edit   | `tsconfig.json` — bundler resolution, new paths                                                 |
| edit   | `.gitignore` — un-ignore `.vscode/settings.json`, ignore `pnpm-lock.yaml`, `coverage`, `.shots` |
