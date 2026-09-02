# 07 — Execution

## Milestones

Each phase ends in a deployable state. Nothing here requires a long-lived branch.

### Phase 0 — Tooling and CI ([01](./01-tooling.md), [02](./02-ci-cd.md))

No UI change. Unblocks every later phase.

- [ ] Remove `preinstall: only-allow pnpm`, `packageManager`, the `pnpm` block
- [ ] `bun install`, commit `bun.lock`, delete `pnpm-lock.yaml`
- [ ] `bunfig.toml`; TypeScript 7 + `moduleResolution: "bundler"`; Vite 8
- [ ] oxlint + oxfmt in, ESLint + Prettier out
- [ ] **One isolated commit for `oxfmt --write .`** — `printWidth: 80` reformats most of `src/`
- [ ] stagelint + `scripts/install-hooks.ts` in, husky + lint-staged out
- [ ] `mcp.json`, `.vscode/settings.json`
- [ ] `scripts/ci.ts`, composite setup action, one `ci.yml`
- [ ] Delete `build.yml`, `push.yml`, `codeql-analysis.yml`
- [ ] Cloudflare Pages project, secrets, `wrangler.jsonc`, `_redirects`, `_headers`
- [ ] Deploy to `portfolio.pages.dev` and click every route before touching DNS
- [ ] DNS cutover; GitHub Pages source → None

**Done when** a PR gets a preview URL, `main` deploys to `petarzarkov.com`, and
`bun run ci static` locally matches CI.

### Phase 1 — Data pipeline ([03](./03-data-pipeline.md))

Still no UI change. The site keeps rendering the old hand-written components while
the snapshot is built alongside.

- [ ] `GH_DATA_TOKEN` (all repos, contents+metadata read; profile read)
- [ ] Enable _Include private contributions on my profile_
- [ ] Tag repos per the tier table — and **write one real description per tagged repo**
- [ ] `scripts/gen/` + schema + fixtures + unit tests
- [ ] `overrides.ts` with the work history
- [ ] `refresh-data.yml` nightly
- [ ] Verify `bun run gen` with no network exits 0 and changes nothing

**Done when** `src/generated/projects.json` is committed and correct, and the
nightly job has produced at least one refresh commit on its own.

### Phase 2 — Mantine ([04](./04-mantine-migration.md))

**Deliberately invisible.** Same layout, new primitives, one palette.

- [ ] Mantine + PostCSS, provider nested inside Chakra's
- [ ] `theme.ts`, brand ramp, self-hosted fonts; delete the ~20-hue switcher and store
- [ ] Port leaf components, then layout, then screens
- [ ] `Projects` / `Skills` rewritten against `src/generated/`; delete `work.tsx`, `hobbies.tsx`
- [ ] Delete `/contact`, Formik, EmailJS, `config/email.ts`, the three `VITE_*` secrets
- [ ] Icon sprite generator; delete `Icons/icons.tsx` and the `manualChunks` block
- [ ] Uninstall Chakra, `react-icons`, `react-json-view`
- [ ] Browser suite skeleton + `preview.ts`, one route

**Done when** nothing imports Chakra and `bun run typecheck` passes.

### Phase 3 — Redesign ([05](./05-experience.md))

- [ ] `BrowserRouter`, the new route set
- [ ] Landing: thesis, dunx screen, activity strip
- [ ] `/work` timeline; `/projects` with tiers and filters; `/projects/:slug`
- [ ] Offline-embed handling wired to `embeds.json`
- [ ] Skills treemap, cross-filtering, opt-in walkthrough
- [ ] Motion tokens, View Transitions, shared elements, reduced-motion contract
- [ ] ⌘K spotlight
- [ ] Full browser matrix, component tests

**Done when** the browser suite is green across 3 viewports × 2 schemes, and no
offline embed can render as an iframe.

### Phase 4 — Prerender, OG, perf

- [ ] `vite-react-ssg`, per-route metadata
- [ ] `scripts/gen/og.ts` — Satori + resvg
- [ ] Budget enforced in CI; coverage floor set from a real run
- [ ] Lighthouse ≥ 95; CSP written now that the origins are known

### Phase 5 — Cleanup

- [ ] Delete `gh-pages` (after a week of stable production)
- [ ] Decide on extracting the GitHub client into `@arkv/*`
- [ ] If extracting: give the profile repo the doc 01 treatment

## Risks

| Risk                                             | Likelihood | Mitigation                                                                                                    |
| ------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| TypeScript 7 (`tsgo`) trips on a Vite/React type | medium     | dunx runs it in anger already; fall back to TS 5.9 for `typecheck` only, keep oxlint type-aware               |
| oxlint `typeAware` slow or noisy on `.tsx`       | medium     | it is unproven on this repo's JSX; measure in phase 0, drop to non-type-aware if it costs more than it finds  |
| `Bun.WebView` is experimental and may change     | medium     | it is one 159-line helper behind an interface; Playwright is a drop-in replacement for `preview.ts` if needed |
| Vite 6 → 8 breaks the build                      | low        | do it in phase 0 where nothing else is moving                                                                 |
| DNS cutover takes the site down                  | low        | nameservers already Cloudflare; `gh-pages` retained a week; rollback is one dashboard change                  |
| Mantine 9 gap vs Chakra                          | low        | mapping table in doc 04 covers every component in use                                                         |
| The redesign stalls on missing content           | **high**   | see below                                                                                                     |

**The content risk is the real one.** Every other item here is mechanical. The
landing thesis, the repo descriptions, the work history and the photograph are
inputs only you can supply, and phase 3 cannot finish without them. Write the repo
descriptions during phase 1 — they are the largest chunk and they improve the repos
regardless of what happens to the site.

## Open decisions

Recommendations given; none block starting phase 0.

**1. Contact.** Scrapping the form as instructed. Recommendation: `mailto:` plus
GitHub and LinkedIn in the footer and on `/about`. Removes EmailJS, Formik and
three build secrets. Reversible later as a Cloudflare Pages Function if the spam
of a plain `mailto:` becomes a problem.

**2. `www`.** Recommendation: `www.petarzarkov.com` 301s to the apex, one canonical
host. Both are attached to the Pages project either way.

**3. Twitter/X link.** `portfolio.ts` links `twitter.com/flaeryw`. Keep, update to
`x.com`, or drop? Recommendation: drop unless it is active — a dead social link on
a portfolio is a small credibility cost.

**4. `derp.ai` and `wisdoms`.** Both subdomains fail to connect. The site stops
depending on them in phase 1 regardless. Separately: revive them, or let them go to
Archive permanently? Recommendation: Archive. Two more dead links are worse than
two fewer projects.

**5. GitHub client ownership.** Copy into the portfolio now, extract to `@arkv/*`
in phase 5 only if a third consumer appears.

**6. `petarzarkov` profile repo tooling.** Still pnpm + husky + ESLint. Out of
scope here; in scope if the client gets extracted.

## Definition of done

- `petarzarkov.com` serves from Cloudflare Pages; every PR gets a preview.
- One `ci.yml`; no CodeQL; `bun run ci <phase>` locally matches CI exactly.
- Tagging a repo `portfolio` on github.com puts it on the site within 24 hours,
  with no commit to this repository.
- No hand-written project data outside `overrides.ts`.
- No external URL renders as an embed unless a generator confirmed it answered.
- Skills are measured from real byte counts, with proficiency stated honestly where
  volume misleads.
- Browser suite green across 3 viewports × 2 colour schemes; zero console errors.
- Lighthouse ≥ 95; initial JS ≤ 150 KB gzipped.
- `prefers-reduced-motion` fully honoured.
- Nothing on the site reads as unmaintained.
