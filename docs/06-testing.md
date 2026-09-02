# 06 — Testing

Today: zero tests. A React SPA with no test wired into CI is how three embeds went
dead in production without anyone noticing.

Three layers, each answering a question the layer below cannot.

| Layer     | Runner                     | Answers                                                    |
| --------- | -------------------------- | ---------------------------------------------------------- |
| Unit      | `bun test`                 | Do the generators produce correct data from a known input? |
| Component | `bun test` + happy-dom     | Does a component render the right thing for given props?   |
| Browser   | `bun test` + `Bun.WebView` | Does the **built bundle** work in a real browser?          |

## Unit — the generators

The highest-value tests in the repo, because `scripts/gen/` is where correctness
is checkable and where a silent failure ships a blank page.

- **Fixtures, not the network.** Capture one real GraphQL response per generator
  into `scripts/gen/__fixtures__/`. Tests run offline and deterministically.
- **Schema validation rejects malformed input.** The generator's contract is that it
  throws rather than writing a half-empty `projects.json` (doc 03) — assert the
  throw, not just the happy path.
- **Tier assignment** from topics, including a repo with several `portfolio-*`
  topics and one with none.
- **Override merge precedence** — generated loses to override, `manual: true`
  skips lookup entirely.
- **Long-tail bucketing** — the profile repo's rule: top 8, remainder into `Other`
  when it exceeds 0.5%. Assert the boundary, both sides.
- **`embeds.ts`** against a local `Bun.serve` returning 200, 404, and a hang, and
  assert the timeout produces `offline` rather than failing the run.
- **Offline safety** — with no token and no network, `gen` exits 0 and writes
  nothing. This is what protects every `bun run build`.

## Component — happy-dom

`@happy-dom/global-registrator` via the `preload` in `bunfig.toml` (doc 01), with
`@testing-library/react`.

Worth testing: the tier grouping and filter logic, the offline-embed branch (an
offline URL must render a still and never an `<iframe>`), the treemap's data
transform, and the walkthrough's step navigation. Not worth testing: that Mantine
renders a `Button`.

## Browser — `Bun.WebView`

The layer that would have caught the current production bugs. Component tests
render components; this loads the real bundle in a real browser and asserts what
happy-dom cannot answer — that the bundle parses, that a deep link works on a cold
load, that layout does not scroll sideways, and that nothing logs an error.

Port `internal/docs/scripts/preview.ts` from dunx (159 lines) and its
`site.browser.test.ts` shape. Its `Preview` interface is already the right one:

```ts
export interface Preview {
  open(route: string): Promise<void>; // navigate and wait for a heading
  scheme(scheme: Scheme): Promise<void>;
  heading(): Promise<string>;
  overflows(): Promise<boolean>;
  screenshot(): Promise<Blob>;
  logged(): readonly ConsoleLine[];
  close(): Promise<void>;
}
```

### Four things dunx learned the hard way

These are documented in `dunx/docs/bun-apis.md` and cost real debugging time.
Inherit them rather than rediscover them.

**1. The suite must live outside `src/` with its own `bunfig.toml`.** The
workspace's happy-dom preload calls `GlobalRegistrator.register()`, which replaces
the global `Response`. `Bun.serve` rejects a `Response` that is not its own with
_"Expected a Response object"_, so the preview server answers nothing and every
route reads as an empty page. `bun test -c` does not help — the preload still runs,
and `unregister()` does not give the native `Response` back. Bun picks the config
next to the working directory, hence `"test:browser": "cd browser && bun test"`.

So: `browser/site.browser.test.ts` and an empty `browser/bunfig.toml`, with a
comment explaining why it is empty. Not `src/`.

**2. `screenshot()` resolves to a `Blob`, not a `Uint8Array`.** Read `.size`, or
hand it straight to `Bun.write`.

**3. `navigate()` never resolves when only the hash changes.** In a hash-routed
site, a loop over `#/`, `#/skills` hangs forever rather than rejecting. dunx works
around it by setting the hash from inside the page:

```ts
await view.evaluate(`location.hash = ${JSON.stringify(hash)}`);
```

We are moving to `BrowserRouter` (doc 05), so distinct paths make this a non-issue
— but the suite navigates to real URLs, and anything that introduces a hash
anchor brings the trap back. Keep the note.

**4. No browser download step in CI.** On Linux `Bun.WebView` drives an installed
Chrome/Chromium/Edge/Brave over CDP; `ubuntu-latest` ships Chrome. If that stops
being true the constructor throws naming what it looked for, rather than failing
silently.

`Bun.WebView` — capital V, no `Bun.Webview` — is marked experimental in Bun's own
docs. dunx measured a navigate + read-heading + 1440×900 screenshot at **526 ms**,
and six routes in **719 ms**, so the whole matrix is seconds, not minutes.

### The matrix

Every route × 3 viewports (360 / 768 / 1440) × 2 colour schemes. Per case:

```ts
expect(await preview.heading()).toMatch(expected); // right route, not a fallback
expect(await preview.overflows()).toBe(false); // no horizontal scroll
expect(preview.logged().filter((l) => l.type === 'error')).toEqual([]);
```

A `HEADINGS` map keyed by route means a route silently falling back to the landing
page or a not-found fails here, rather than looking plausible in a screenshot.

Each case writes its PNG into `browser/.shots/` **before** the assertions, so a
failure leaves the frame behind. `bun run shots` is a build plus this suite, so
the contact sheet and the assertions cannot drift. CI uploads them only on failure
(doc 02).

### Portfolio-specific assertions

Beyond dunx's set, the checks that map onto what actually broke here:

- **No offline embed is ever rendered as an `<iframe>`.** Given an `embeds.json`
  fixture marking a URL offline, the detail route must contain a still and no
  frame. This is the regression test for the three dead embeds.
- **Colour scheme actually applies.** dunx asserts the page paints differently
  under each scheme — a site painting identically means the dark palette never
  loaded and half the screenshots are of a light site.
- **Reduced motion is honoured.** With `prefers-reduced-motion: reduce`, assert no
  element carries a running animation.
- **Per-route metadata.** After prerendering (phase 4), assert `<title>`,
  description and `og:image` differ per route — the failure mode is every page
  inheriting the landing page's card.
- **Bundle budget.** Sum the emitted JS in `dist/assets`, fail over 150 KB
  gzipped. One assertion, and it is what keeps the budget in doc 05 real.

## Coverage

`bun test --coverage` in the `unit` job. Two measurement artifacts from dunx's
investigation, so the floor is set against reality:

**Type-only lines count against you, through the sourcemap.** Imports, interface
members and abstract signatures emit nothing and are unhittable by construction.
dunx measured a reduced case at 39.3% lines that reads 88.2% with
`coverageIgnoreSourcemaps = true` — repo-wide about 1.8 points. That flag is _not_
set there, because it makes the reported uncovered line ranges point at transpiled
positions nobody can open. Same call here.

**A class with no explicit constructor is an unhit function**, even when `new C()`
runs. An explicit empty constructor is marked hit. Do not try to correct for it.

Set the floor **after** the first real run, on `scripts/gen/` where it matters.
Picking a number now and discovering it measures something else is the failure
mode both of these notes describe.

## CI wiring

Phases in `scripts/ci.ts` (doc 02): `unit` runs unit + component, `browser` builds
then runs the WebView suite. `bun run ci unit` locally is what the job runs.

## Order

Tests arrive with the code they cover, not in a phase of their own:

| Phase             | Tests                                                       |
| ----------------- | ----------------------------------------------------------- |
| 1 — data pipeline | generator unit tests, fixtures, offline-safety              |
| 2 — Mantine       | browser suite skeleton + `preview.ts`, one route            |
| 3 — redesign      | full matrix, component tests, reduced-motion, offline-embed |
| 4 — prerender     | metadata assertions, bundle budget, coverage floor          |
