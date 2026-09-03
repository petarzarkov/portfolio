<div align="center">

# petarzarkov.com

**A portfolio that maintains itself.**

Tag a repository `portfolio` on GitHub and it appears on the site — description,
topics, language mix, stars and last push already filled in. No commit here.

[petarzarkov.com](https://petarzarkov.com) ·
[CI](https://github.com/petarzarkov/portfolio/actions/workflows/ci.yml) ·
[Plan](./docs/README.md)

</div>

---

## Why it works this way

The previous version of this site was hand-written TSX, one block per project,
with inline icon arrays and hand-keyed `React.createElement` calls. Adding a
project meant editing a 300-line component, so nobody did — and three of its six
showcased projects ended up embedding hosts that no longer resolve, rendering a
broken-image glyph in production for months.

So the site stopped storing project data. It renders a snapshot that a generator
writes from the GitHub API:

```
GitHub topics  ──▶  scripts/gen  ──▶  src/generated/*.json  ──▶  the site
   (opt in)          (nightly)          (committed)
```

Three properties fall out of that:

- **Nothing is claimed that is not measured.** The skills page is byte counts
  across every repository, private ones included. Forks are excluded — leaving
  them in put Zig second on the map, entirely from a fork of Bun.
- **A dead link cannot ship.** Every external URL is probed at generation time,
  and the UI renders an iframe _only_ where a generator saw a 2xx. There is no
  code path that renders an unverified URL.
- **A build needs no secrets and no network.** The snapshot is committed, so
  `bun run build` works offline and a GitHub outage cannot break a deploy.

## Tiers

Projects opt in by topic, most specific first:

| Topic                | Meaning                                           |
| -------------------- | ------------------------------------------------- |
| `portfolio-flagship` | owns the landing page                             |
| `portfolio`          | active work                                       |
| `portfolio-lab`      | experiments and one-offs                          |
| `portfolio-archive`  | shipped, no longer running — one line, not a card |
| _(none)_             | not on the site                                   |

Every other topic on the repo becomes a tech chip, so the stack shown is the
stack the repository declares. Repository **descriptions become site copy** —
that is the forcing function, and it improves the repos too.

The only hand-maintained data is [`src/data/overrides.ts`](./src/data/overrides.ts):
copy that beats a repo description, media, explicit pins, and retirement notes.

## Stack

Bun · Vite · React · Mantine · TypeScript · oxlint + oxfmt · stagelint ·
Cloudflare Pages

## Getting started

Requires [Bun](https://bun.sh) 1.4+.

```bash
bun install     # also installs the git hooks
bun start       # vite dev server
```

## Commands

| Command                   | Does                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `bun run ci`              | every gate CI runs, in one command                                |
| `bun run build`           | typecheck, then build                                             |
| `bun run test`            | generator and layout unit tests                                   |
| `bun run test:browser`    | the built site in a real browser                                  |
| `bun run shots`           | build, then write a screenshot contact sheet to `browser/.shots/` |
| `bun run gen`             | regenerate `src/generated/` from GitHub                           |
| `bun run lint` / `format` | oxlint / oxfmt, with `:check` variants                            |

`.github/workflows/ci.yml` calls `bun run ci <phase>` one phase per job rather
than restating the commands, so **`bun run ci` locally runs exactly what CI
runs**. `scripts/ci.test.ts` fails if the two ever drift.

## Testing

Three layers, each answering what the one below cannot:

- **Unit** — the generators, against captured fixtures. Offline and
  deterministic.
- **Layout** — the squarified treemap, checked for its invariants: every cell
  placed, none overlapping, areas proportional, no slivers.
- **Browser** — the built bundle in real Chrome via `Bun.WebView`. Every route ×
  3 viewports: correct heading, no horizontal overflow, zero
  console errors, plus the assertions that map onto what actually broke here —
  no offline embed rendered as an iframe, the WebGL backdrop actually animating
  rather than redrawing one frame, the cup never overlapping the copy it sits
  beside, one `<h1>` per route, every iframe titled, and the entry chunk inside
  its budget.

No browser download in CI: `Bun.WebView` drives the Chrome the runner already
ships.

## Refreshing the data

`.github/workflows/refresh-data.yml` runs nightly, regenerates the snapshot and
commits only when it moved. That push deploys. Run it by hand with
`bun run gen` and a `GH_DATA_TOKEN` in the environment.

`gen` is **offline-safe**: with no token, no network or a GitHub 5xx it warns
and exits 0, leaving the committed snapshot alone. It hard-fails on exactly one
thing — a schema violation — rather than writing a snapshot that renders as a
blank page.

## Headers

`public/_headers` carries a CSP with no `unsafe-inline` in `script-src`, which is
possible because the site loads nothing from anywhere else: no webfont, no CDN,
no analytics, and no inline script since Mantine's SSR-only `ColorSchemeScript`
was dropped. `frame-src` is **generated** — `scripts/shells.ts` fills it with the
origins of exactly those embeds a generator saw answer, so a project going live
becomes framable at the next refresh and one going dark stops being. `robots.txt`
and a generated `sitemap.xml` cover the crawler side of the per-route shells.

## Secrets

| Secret                  | Used by                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | deploy — scope _Account → Cloudflare Pages → Edit_                                       |
| `CLOUDFLARE_ACCOUNT_ID` | deploy                                                                                   |
| `GH_DATA_TOKEN`         | nightly refresh — all repos _Contents: read_ + _Metadata: read_, account _Profile: read_ |

Private repositories are in scope deliberately: they are the denominator the
language totals are measured against, and the default `GITHUB_TOKEN` can see
neither them nor `viewer.contributionsCollection`.

## Accessibility

`prefers-reduced-motion` is a contract, not a fallback — every entrance is
either a CSS animation that `global.css` neutralises or a `motion` component
that checks it. `jsx-a11y` runs in the lint gate.

Every text colour clears WCAG AA on the surface it lands on. Mantine's own
`dimmed` is 4.29:1 on this background — under the 4.5:1 threshold, on the token
that carries every card description, stat label and page intro — so `global.css`
overrides it to the warm neutral the palette is already built from.

The treemap is keyboard operable and has a table equivalent behind a toggle,
which is also the **default below 48em**: area is the message a treemap carries,
and no setting shows all nine cells and letters them on a 390px screen. Headings
run h1 → h2 → h3 with no level skipped.

## Docs

[`docs/`](./docs/README.md) holds the overhaul plan the current site was built
from: [tooling](./docs/01-tooling.md), [CI/CD](./docs/02-ci-cd.md),
[data pipeline](./docs/03-data-pipeline.md),
[Mantine migration](./docs/04-mantine-migration.md),
[experience](./docs/05-experience.md), [testing](./docs/06-testing.md),
[execution](./docs/07-execution.md).

## License

MIT — see [LICENSE](./LICENSE).
