# 03 — Data pipeline

The site stops being a hand-written list of projects and becomes a renderer over a
generated snapshot.

## The problem, stated precisely

There are **155 repos** on the account. Adding one project today means editing
[work.tsx](../src/screens/projects/work.tsx) or
[hobbies.tsx](../src/screens/projects/hobbies.tsx) — 300-line modules of inline
JSX where each project hand-builds an array of icon components with hand-written
React keys:

```tsx
<Libs.NodeJS.icon key={'NodeDerp'} />,
<Libs.Typescript.icon key={'TSderp'} />,
```

Every fact on the site is duplicated from somewhere it already lives. That is why
it has not been updated, why it still leads with `@toplo` (deprecated) and
DraftKings-era work, and why three of six hobby embeds render as a broken-image
glyph in production today.

## The design

**Opt in at the source.** A repo appears on the site because it carries a GitHub
topic, not because this repo was edited. Tagging `firecracker` with `portfolio` on
github.com puts it on the site at the next nightly refresh.

**Generate at build, commit the snapshot, never fetch at runtime.** The browser
never talks to the GitHub API — that would mean 60 requests/hour per visitor IP
unauthenticated, a token in the client if authenticated, and a blank page whenever
GitHub is slow. `bun run gen` writes JSON into `src/generated/`, that JSON is
committed, and the build imports it like any other module.

Committing the snapshot buys four things: the build is deterministic and works
offline, a data change is a reviewable diff, a normal `bun run build` needs no
secret, and a GitHub outage cannot break a deploy.

## Project tiers

A flat "Work / Hobby" split is what produced a page where `@toplo` and a
Heroku-hosted trivia API get the same visual weight as `dunx`. Four tiers, driven
by topic:

| Topic                | Tier         | Treatment                                       |
| -------------------- | ------------ | ----------------------------------------------- |
| `portfolio-flagship` | **Flagship** | Owns the landing page. One project.             |
| `portfolio`          | **Active**   | Full card, live stats, live embed               |
| `portfolio-lab`      | **Lab**      | Compact card, experiments and one-offs          |
| `portfolio-archive`  | **Archive**  | One line in a list. Shipped, no longer running. |
| _(absent)_           | excluded     | no "hidden" topic needed                        |

Non-`portfolio-*` topics become the tech chips on the card, so the stack shown is
the stack GitHub already knows.

### Proposed initial tagging

**Flagship — `dunx`.** 21 stars, the most complete thing on the account, and the
one with a real thesis: NestJS-shaped dependency injection with no
`reflect-metadata`, no `experimentalDecorators` and no JavaScript router. The
landing page leads with it rather than with a name and a job title.

**Active** — `firecracker`, `beacon`, `arkv`, `nestjs-template`,
`gemini-code-review-action`, `petarzarkov` (the self-generating profile — it makes
the point that the portfolio generates itself too).

**Lab** — `rust-beats`, `wave-sim`, `the-anchor`, `sas-mock-program`,
`module-cost`, `iana-timezones`.

**Archive** — `trivia-art`, `rn-impossible-quiz`, `wisdoms`, `toplo`. All four are
down or deprecated. They belong in a single "previously shipped" list with a date
and a repo link, not as cards with dead iframes.

**Work history** is separate from repos entirely — see the overrides section.
`firecracker` replaces the DraftKings-era Rocket Crash / Over Under / Casino
Products cards as the current work story.

The ~90 `sbtech.*`, `casino-*` and `pulpo-*` repos stay untagged and never appear.

### One prerequisite worth naming

Repo descriptions become site copy. Right now `firecracker` reads _"firecrack"_
and `beacon` reads _"agent driven"_. Auto-gathering makes a thin description a
visible problem instead of a private one — which is the point, but it means
**writing one good sentence per tagged repo is part of this work**, done on
github.com, once, where it also improves the repo itself.

## Overrides — the thin manual layer

`src/data/overrides.ts`, the only hand-maintained file, covering what GitHub
cannot know:

1. **Employment history.** Roles, employers, dates and closed-source work have no
   repo. Authored entries, rendered as a timeline (doc 05).
2. **Copy that beats the repo description**, per slug. Optional — the goal is not
   to need it.
3. **Media.** A hero image, a video, an embed URL.
4. **Order.** An explicit `pin` for the few that lead; the rest sort by last push.

```ts
export const overrides = {
  dunx: {
    pin: 1,
    headline: 'NestJS-shaped DI at Bun speed',
    thesis: 'Constructor injection with no reflect-metadata, no experimental
             decorators, and no JavaScript router.',
    embed: 'https://petarzarkov.github.io/dunx',
  },
  'trivia-art': {
    retiredAt: '2022-11',
    retiredNote: 'Heroku free dynos were withdrawn; the API is offline.',
  },
} satisfies Record<string, Override>;
```

Generated fields lose to overrides. A `manual: true` entry is emitted with no
GitHub lookup at all.

## Generators

`scripts/gen/`, plain Bun scripts, orchestrated by `index.ts`.

| Script         | Writes            | Source                                        |
| -------------- | ----------------- | --------------------------------------------- |
| `github.ts`    | —                 | shared client, pagination, retry              |
| `projects.ts`  | `projects.json`   | repos by topic + per-repo languages           |
| `languages.ts` | `languages.json`  | byte counts aggregated across all owned repos |
| `activity.ts`  | `activity.json`   | contribution graph, streak, commit series     |
| `packages.ts`  | `packages.json`   | npm registry + downloads API                  |
| `embeds.ts`    | `embeds.json`     | health check on every external URL            |
| `og.ts`        | `public/og/*.png` | Satori + resvg, one per route                 |
| `index.ts`     | `meta.json`       | orchestrates, validates, timestamps           |

### `embeds.ts` — the generator that fixes today's bug

Every URL the site would put in an iframe or fetch from is probed at generation
time, with a timeout, and the result recorded:

```jsonc
{
  "https://petarzarkov.github.io/wave-sim/": {
    "status": "live",
    "code": 200,
    "ms": 210,
  },
  "https://derp.ai.petarzarkov.com/": { "status": "offline", "code": 0 },
  "https://wisdoms.petarzarkov.com/": { "status": "offline", "code": 0 },
  "https://trivia-art.herokuapp.com/api/questions": {
    "status": "offline",
    "code": 404,
  },
}
```

The UI reads `status` and renders a captured still with an explicit "offline" note
instead of a blank frame. **A dead embed becomes impossible to ship** — which is
exactly the regression visible on the live site right now.

Generation does not fail on an offline embed; services go down and a deploy should
not. It fails only if _every_ probe fails, which means the network is the problem.

### Reuse the profile repo's stats pipeline

[`/home/petarzarkov/repos/petarzarkov`](https://github.com/petarzarkov/petarzarkov)
already solves the measurement half of this and its README says so outright:
_"This page is auto generated by the repo itself."_ It has
`core/GitHubClient.ts`, `core/StatsAggregator.ts`, and services for languages,
contributions, repositories and commits, driven by `update-stats.yml`.

Two details from that code are load-bearing and carry over unchanged:

**It counts private repos.** `fetchRepositories()` uses
`octokit.repos.listForAuthenticatedUser` with `affiliation: 'owner'`, so the
language denominator includes private work. Public-only would badly under-report —
the account shows 597 public commit contributions against **1,044 restricted
(private)** ones.

**It already buckets the long tail.** `LanguagesGenerator` sorts by size, takes the
top 8, and aggregates the remainder into a single `Other` slice when it exceeds
0.5%. Without that, Dockerfile and Shell get the same row as TypeScript. The
portfolio's skills visualisation uses the same rule.

**Decide once, early:** either the portfolio gets its own copy of the client, or
`StatsAggregator` and its services move into an `@arkv/*` package that both repos
consume. Two GitHub clients drifting apart is the predictable outcome of not
choosing.

Recommendation: **copy into the portfolio for phase 1, extract in phase 5 if it
has earned it.** The profile repo is still on pnpm, husky, lint-staged and ESLint,
so extraction also means giving it the doc 01 treatment — real work, and not on
the critical path for the redesign.

### Skills, measured rather than declared

`languages.json` aggregates bytes per language across every owned repo. That
replaces the hand-set `SkillLevel` enum in
[SkillLevel.ts](../src/contracts/SkillLevel.ts) as the _source of the list_ and
the _source of the magnitude_.

Bytes are not proficiency, so the two stay separate:

- **Generated, not editable:** which languages, how much, and the trend over time.
- **Overridden, per language:** a proficiency label, only where you disagree with
  the volume. Go is the live example — a small byte count and a self-assessed
  beginner, and the site should say beginner rather than infer from line count.

`activity.json` additionally carries the contribution graph, the current streak and
a 365-day commit series, all of which the profile repo's `ContributionService` and
`CommitService` already produce. Doc 05 covers how these are rendered as an
interactive map rather than a wall of static badges.

### Rate limits and auth

`GH_DATA_TOKEN`, a fine-grained PAT:

- Repository access: **all repositories**, contents + metadata **read-only**
  (private repos are needed for the language denominator above)
- Account permissions: **Profile → read**

A PAT rather than the workflow's `GITHUB_TOKEN` because
`user.contributionsCollection` is not readable with the default job token and
private repos are out of its scope entirely. The GraphQL budget is 5,000
points/hour; a full run costs well under 50.

One setting to check: GitHub only exposes the private contribution count if
_Settings → Profile → Include private contributions on my profile_ is enabled.
Without it the heatmap shows roughly a third of the real activity.

### Failure behaviour

`bun run gen` is **offline-safe by design**. With no token, no network, or a GitHub
5xx it logs a warning and exits 0, leaving the committed snapshot untouched. That
is what lets `bun run build` work on a plane and lets the `deploy` job build
without `GH_DATA_TOKEN`.

It hard-fails on exactly one thing: **schema violation.** If GitHub changes a field
shape, the generator throws rather than writing a half-empty `projects.json` that
renders as a blank page. Validation lives in `scripts/gen/schema.ts` and runs
before anything is written.

Writes are atomic — build the whole object, validate, then write. Never stream into
the file the site imports.

## Generated shape

`src/generated/projects.json`:

```jsonc
[
  {
    "slug": "dunx",
    "title": "dunx",
    "headline": "NestJS-shaped DI at Bun speed",
    "description": "fastest web DI framework...",
    "tier": "flagship",
    "pin": 1,
    "repo": "https://github.com/petarzarkov/dunx",
    "homepage": "https://petarzarkov.github.io/dunx",
    "stars": 21,
    "topics": [
      "backend-framework",
      "bun",
      "dependency-injection",
      "typescript",
    ],
    "languages": [{ "name": "TypeScript", "bytes": 1840221, "share": 0.94 }],
    "license": "MIT",
    "pushedAt": "2026-08-31T18:38:08Z",
    "release": { "tag": "v2.2.0", "publishedAt": "..." },
    "npm": { "name": "dunx", "version": "2.2.0", "weeklyDownloads": 0 },
    "embed": { "url": "...", "status": "live" },
    "source": "github",
  },
]
```

Types are generated alongside as `src/generated/types.ts` and re-exported from
`@generated`, so the UI type-checks against the real snapshot rather than a
hand-written interface that drifts.

## Refresh cadence

Nightly at 05:17 UTC via `refresh-data.yml` (doc 02), plus `workflow_dispatch` for
"I just tagged a repo, show me". The commit lands on `main` and triggers a deploy.

A live layer — a Cloudflare Pages Function at `/api/stats` reading through the
Cache API for real-time star counts — is **out of scope**. A day-old star count is
not worth a runtime dependency.
