# 02 — CI/CD and Cloudflare

Collapse three workflows into one, deploy to Cloudflare Pages with PR previews,
and cut the domain over from GitHub Pages.

## What exists now

| Workflow                                                        | Fate                                           |
| --------------------------------------------------------------- | ---------------------------------------------- |
| [build.yml](../.github/workflows/build.yml)                     | delete — folds into `ci.yml`                   |
| [push.yml](../.github/workflows/push.yml)                       | delete — replaced by the Cloudflare deploy job |
| [codeql-analysis.yml](../.github/workflows/codeql-analysis.yml) | delete, as requested                           |

`push.yml` triggers on `pull_request_target` with `types: [closed]` and pushes
`dist` to the `gh-pages` branch via `crazy-max/ghaction-github-pages@v2.6.0`,
writing `petarzarkov.com` into a CNAME file. All of that goes away.

Worth noting on the way out: `pull_request_target` runs with repository write
credentials in the context of the _base_ branch. It is the trigger with the
standard privilege-escalation footgun, and `build.yml` running on bare `push`
meant every branch built twice. The replacement uses `push` + `pull_request`.

## The one workflow

`ci.yml`, with a composite setup action so the Bun version is pinned in exactly
one place.

### `.github/actions/setup/action.yml`

Copy dunx's verbatim — pinned `oven-sh/setup-bun@v2` at `1.4.0`, a
`~/.bun/install/cache` cache keyed on `hashFiles('**/bun.lock')`, and
`bun install --frozen-lockfile`.

### Jobs

```
static   ── lint:check, format:check, typecheck
unit     ── bun test src scripts (generators + components)
build    ── bun run build, uploads dist
browser  ── Bun.WebView suite against the built dist   (doc 06)
deploy   ── Cloudflare Pages: preview on PR, production on main
```

`static`, `unit` and `browser` run in parallel. `browser` needs the build, and
building takes less wall clock than uploading and re-downloading a `dist`
artifact, so it builds for itself — the same trade dunx documents in its own
`ci.yml`.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:

# A PR run is superseded by its own next push. `main` is never cancelled: a run
# there can reach the deploy step.
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

permissions:
  contents: read

jobs:
  static:
    name: Lint, format, types
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run ci static

  unit:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run ci unit

  browser:
    name: Site in a browser
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      # No browser download step: Bun.WebView drives the Chrome the runner image
      # already ships. See docs/06-testing.md.
      - run: bun run ci build
      - run: bun run ci browser
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: failed-shots
          path: browser/.shots/
          retention-days: 7

  deploy:
    name: Deploy
    needs: [static, unit, browser]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
      pull-requests: write # for the preview-URL comment
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }}
      url: ${{ steps.deploy.outputs.deployment-url }}
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run ci build
        env:
          VITE_SERVICE_ID: ${{ secrets.VITE_SERVICE_ID }}
          VITE_USER_ID: ${{ secrets.VITE_USER_ID }}
          VITE_TEMPLATE_ID: ${{ secrets.VITE_TEMPLATE_ID }}
      - id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=portfolio --branch=${{ github.head_ref || github.ref_name }}
```

`--branch` is what makes Cloudflare treat a PR build as a preview and a `main`
build as production. Pages assigns production to the project's configured
production branch and a `<hash>.portfolio.pages.dev` preview URL to everything
else, so one command covers both.

### `scripts/ci.ts`

Every gate is a named phase, so `bun run ci static` locally is byte-for-byte what
the `static` job runs. dunx goes further and has `scripts/ci.test.ts` fail if a
phase stops being wired into the workflow or if a job reaches a gate directly —
worth copying, it is ~30 lines and it catches the class of drift where CI quietly
stops checking something.

| Phase     | Runs                                           |
| --------- | ---------------------------------------------- |
| `static`  | `lint:check`, `format:check`, `typecheck`      |
| `unit`    | `bun test src scripts`                         |
| `build`   | `gen` (offline-safe, doc 03) then `vite build` |
| `browser` | `test:browser`                                 |

## Cloudflare Pages

### Project setup — done

The Pages project `portfolio` exists (Direct Upload, production branch `main`).
Its assigned subdomain is **`portfolio-6cm.pages.dev`** — Cloudflare suffixed it
because `portfolio.pages.dev` was taken. The project _name_ is still
`portfolio`, which is what `--project-name` and `wrangler.jsonc` use; only the
preview hostname carries the suffix.

Verified against a real deploy of the built site:

| Check                                                  | Result                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `/`, `/skills`, `/projects`, `/projects/dunx`, `/nope` | all `200`                                                                 |
| Deep link on a cold load                               | serves the app, not a 404 — `_redirects` works                            |
| `_headers` applied                                     | `x-content-type-options`, `referrer-policy`, `permissions-policy` present |

**Local deploys need Node 22+.** Wrangler 4 refuses to start on anything older,
and it is not run through Bun. In CI `cloudflare/wrangler-action` brings its own
Node, so this only affects running `bunx wrangler` by hand.

### API token scopes

Create at dash.cloudflare.com → My Profile → API Tokens → Create Custom Token:

- **Account** → `Cloudflare Pages` → **Edit**
- Account Resources → Include → your account only

That is the whole scope. It cannot touch DNS, which is deliberate: the domain is
attached once by hand (below) and CI never needs to change a record.

### Secrets to add

| Secret                                                  | Where from                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`                                  | the token above                                                          |
| `CLOUDFLARE_ACCOUNT_ID`                                 | dashboard sidebar / `wrangler whoami`                                    |
| `GH_DATA_TOKEN`                                         | fine-grained PAT for the data pipeline — see [03](./03-data-pipeline.md) |
| `VITE_SERVICE_ID` / `VITE_USER_ID` / `VITE_TEMPLATE_ID` | already exist, EmailJS                                                   |

The three `VITE_*` values are baked into the client bundle at build time and are
public by construction — EmailJS keys are designed for that. They are "secrets" in
the sense of _not in git_, not in the sense of _confidential_. If the contact form
moves to a Pages Function later (see the open decision in
[07-execution.md](./07-execution.md)), they become genuinely server-side.

### `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "portfolio",
  "compatibility_date": "2026-09-01",
  "pages_build_output_dir": "dist",
}
```

Add `wrangler@4` as a devDependency so the version is pinned rather than whatever
`wrangler-action` resolves that day.

### SPA routing and headers

Moving off `HashRouter` (doc 05) means the server must serve `index.html` for
unknown paths. Two files in `public/`, copied verbatim into `dist`:

`public/_redirects`

```
/*  /index.html  200
```

`public/_headers`

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Vite fingerprints everything under `/assets/`, so the immutable year is safe there
and only there. `index.html` keeps Cloudflare's default short cache, which is what
makes a deploy visible immediately.

A Content-Security-Policy belongs here too, but write it **after** phase 3 —
the embeds, fonts and EmailJS endpoint determine the directives, and a CSP guessed
now will be wrong and get disabled at the first violation.

## DNS cutover

Current state, probed:

```
petarzarkov.com      A   172.67.208.152, 104.21.58.218   (Cloudflare proxy IPs)
www.petarzarkov.com  A   same
NS                       ignat.ns.cloudflare.com, ashley.ns.cloudflare.com
```

The nameservers are already Cloudflare's. GoDaddy is registrar-only and **is not
touched at any point** — the entire cutover happens in the Cloudflare dashboard.
The apex is proxied (orange cloud) in front of GitHub Pages today.

### Runbook

1. Land the first successful `deploy` job and confirm the site at
   `portfolio.pages.dev`. Click through every route. Do not proceed on a build you
   have not opened.
2. Cloudflare → Workers & Pages → `portfolio` → Custom domains → **Add**
   `petarzarkov.com`. Cloudflare replaces the existing apex record itself.
3. Add `www.petarzarkov.com` the same way.
4. GitHub → repo Settings → Pages → set source to **None**, and clear the custom
   domain. Leaving it set means GitHub keeps claiming the domain.
5. Verify: `dig +short petarzarkov.com`, then load the site in a private window
   and confirm the `cf-ray` header and the new build.
6. Delete the `gh-pages` branch (phase 5, after a week of stable production).

**Do not touch these records.** They are separate services on subdomains of the
same zone and are unrelated to the Pages project:

- `derp.ai.petarzarkov.com`
- `wisdoms.petarzarkov.com`

Both currently fail to connect, so they need attention — but as their own problem,
not as part of this cutover. See [03-data-pipeline.md](./03-data-pipeline.md) for
how the site stops depending on them being up.

### Rollback

Remove the custom domain from the Pages project and re-enable GitHub Pages with
the custom domain. The `gh-pages` branch still holds the last good build, which is
the reason step 6 waits a week.

## Scheduled data refresh

`refresh-data.yml` — the workflow that keeps the site current without anyone
touching it. Full design in [03-data-pipeline.md](./03-data-pipeline.md); the
shape is:

```yaml
on:
  schedule:
    - cron: '17 5 * * *' # daily, off the hour — the hour is congested
  workflow_dispatch:

permissions:
  contents: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run gen
        env:
          GH_DATA_TOKEN: ${{ secrets.GH_DATA_TOKEN }}
      - name: Commit when the snapshot moved
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/generated
          git diff --cached --quiet && { echo "no change"; exit 0; }
          git commit -m "chore(data): refresh generated snapshot"
          git push
```

The push to `main` triggers `ci.yml`, which deploys. Deliberately **not**
`[skip ci]`: a data refresh that does not reach production is a refresh that did
nothing.
