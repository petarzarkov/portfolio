<div align="center">

# petarzarkov.com

**A portfolio that maintains itself.**

Tag a repository `portfolio` on GitHub and it appears on the site — description,
topics, language mix, stars and last push already filled in. No commit here.

[petarzarkov.com](https://petarzarkov.com) ·
[CI](https://github.com/petarzarkov/portfolio/actions/workflows/ci.yml)

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
  3 viewports × 2 colour schemes: correct heading, no horizontal overflow, zero
  console errors, plus the assertions that map onto what actually broke here —
  no offline embed rendered as an iframe, the WebGL backdrop actually animating
  rather than redrawing one frame, the cup never overlapping the copy it sits
  beside, one `<h1>` per route, every iframe titled, and the entry chunk inside
  its budget.

No browser download in CI: `Bun.WebView` drives the Chrome the runner already
ships.

## Previews

Every pull request deploys to Cloudflare Pages and the run comments the URL on
the pull request itself, rewritten in place rather than appended so a long
branch does not accumulate a stack of near-identical links.

Two URLs, because they answer different questions. The **deployment URL** is
immutable, pins exactly one build, and is always there — it is the one worth
citing next to a commit. The **branch alias** follows the branch and survives
the next push, which makes it the one worth clicking twice, but Cloudflare only
returns one from wrangler 3.78 on and not for every deployment, so the comment
falls back to the deployment URL when it is absent.

## Refreshing the data

`.github/workflows/refresh-data.yml` runs nightly, regenerates the snapshot and
commits only when it moved. That push deploys. Run it by hand with
`bun run gen` and a `GH_DATA_TOKEN` in the environment.

`gen` is **offline-safe**: with no token, no network or a GitHub 5xx it warns
and exits 0, leaving the committed snapshot alone. It hard-fails on exactly one
thing — a schema violation — rather than writing a snapshot that renders as a
blank page.

## Themes

Four: **Dark** and **Light** on amber, **Violet**, and **Ocean** on aqua. One
button in the header opens the picker, at every width.

The cup on the About page is themed too — its three lights, the ambient fill,
the ceramic, the coffee and the steam are all `--scene-*` tokens the WebGL scene
reads out of CSS. Steam is why: it was hardcoded white, which is invisible on a
cream page, so on light grounds it is a warm grey and reads as shadow instead.
A theme change recolours the materials in place rather than rebuilding, because
a WebGL context is a limited per-browser resource and the picker is one click.

Themes are data. `src/theme/themes.ts` lists them — each with a brand ramp
Mantine derives its own colours from — `themes.css` answers the same set of
semantic questions once per theme (`--surface`, `--ink`, `--accent-text`), and
`public/theme-init.js` stamps the saved choice onto `<html>` before first paint.
Adding one is a block and a list entry; no component changes.

This replaced 29 `light-dark()` pairs across eleven files. That function takes
exactly two values, so every one of them would have needed rewriting the moment
a third theme existed.

Two things are load bearing and both failed silently before they were fixed:
the token blocks are `:root:root[...]` because `MantineProvider` injects its own
`:root[...]` block at runtime and would otherwise win on order; and
`theme-init.js` is a separate file, not an inline script, because the CSP allows
no inline ones. `themes.test.ts` checks the list, the stylesheet and that script
still agree — they cannot import each other, since the last must run before the
bundle exists.

Every text colour in every theme was measured rather than assumed, and three
palettes needed a correction the defaults did not give: light's accent had to
become bronze, and Ocean fills its buttons from shade 9 because `autoContrast`
sets the contrast variable to black on that ramp and then renders the label
white regardless — 2.4:1, until it was measured. Worst figure across all four
themes and every route is now 4.7:1.

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

`prefers-reduced-motion` stops everything that moves content: every entrance,
the rotating word, the counting stats, the treemap and heatmap sweeps — either a
CSS animation `global.css` neutralises or a `motion` component that checks it.

Two decorative loops are exempt, marked `data-ambient` and carved out of that
rule by name: the spark that laps the hero heading, and the cup on the About
page. Both are slow, sit behind the text rather than in it, and displace
nothing. That is a deliberate choice rather than an oversight, and the browser
suite asserts both halves — that the scene still moves, and that no entrance is
left mid-fade. `jsx-a11y` runs in the lint gate.

Every text colour clears WCAG AA on the surface it lands on, in **every**
theme, and three of Mantine's own defaults had to be overridden to get there:
`dimmed` (4.29:1 dark, 3.05:1 light), `anchor` (2.25:1 light — every inline
link), and the `light` variant's text (3.71:1 light — every badge and tier
pill). The light accent is bronze rather than amber for the same reason: the
brand ramp does not go dark enough to carry text on cream. Worst measured
figure on any route is now 5.2:1.

The treemap is keyboard operable and has a table equivalent behind a toggle,
which is also the **default below 48em**: area is the message a treemap carries,
and no setting shows all nine cells and letters them on a 390px screen. Headings
run h1 → h2 → h3 with no level skipped.

## License

MIT — see [LICENSE](./LICENSE).
