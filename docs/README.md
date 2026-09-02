# Portfolio Overhaul

Planning docs for rebuilding `petarzarkov.com`. Read this page first; each linked
doc is self-contained and owns one slice of the work.

| #   | Doc                                            | Owns                                                          |
| --- | ---------------------------------------------- | ------------------------------------------------------------- |
| 01  | [Tooling](./01-tooling.md)                     | Bun, oxlint, oxfmt, stagelint, TypeScript 7, `mcp.json`       |
| 02  | [CI/CD](./02-ci-cd.md)                         | One `ci.yml`, Cloudflare Pages, DNS cutover, secrets          |
| 03  | [Data pipeline](./03-data-pipeline.md)         | Auto-gathering projects, skills and activity from GitHub/npm  |
| 04  | [Mantine migration](./04-mantine-migration.md) | Chakra v2 → Mantine 9, theming, forms, icons                  |
| 05  | [Experience](./05-experience.md)               | Information architecture, motion, the signature moments       |
| 06  | [Testing](./06-testing.md)                     | `bun test`, happy-dom components, `Bun.WebView` browser suite |
| 07  | [Execution](./07-execution.md)                 | Milestones, risks, open decisions, definition of done         |

---

## Audit: what is actually broken today

Probed on 2026-09-02, not assumed.

**Dead content shipping to production.** Three of the six hobby projects embed a
URL that no longer answers:

| Embed                                            | Result                             |
| ------------------------------------------------ | ---------------------------------- |
| `https://trivia-art.herokuapp.com/api/questions` | `404` — Heroku free dynos are gone |
| `https://wisdoms.petarzarkov.com/`               | connection failed                  |
| `https://derp.ai.petarzarkov.com/`               | connection failed                  |
| `https://petarzarkov.github.io/wave-sim/`        | `200` — the only live one          |

The `Trivia` component in [hobbies.tsx](../src/screens/projects/hobbies.tsx)
fetches a 404 and silently swallows it in an empty `catch`, so the section renders
an empty box forever. The two dead iframes render as blank frames.

**Dependencies on unsupported combinations.**

- `@chakra-ui/react ^2.2.4` against `react ^19`. Chakra v2 peers React 18; the
  current line is v3.37.0. The whole UI sits on an unsupported pairing.
- `react-json-view@1.21.3` — last published **2022-06-26**, peers
  `react: ^17.0.0 || ^16.3.0 || ^15.5.4`. It cannot work correctly on React 19.
- `@types/react-dom: "^19.0.4 "` — trailing space in the version string.

**Tooling that blocks the requested move.** `"preinstall": "npx only-allow pnpm"`
in [package.json](../package.json) hard-fails `bun install`. It is the first thing
that has to go.

**A bundler config fighting the bundler.** [vite.config.mts](../vite.config.mts)
hand-writes 13 `manualChunks` entries, one of which is a copy-paste bug: the key
`'react-icons/md'` maps to `['react-icons/cg']`. This exists to work around
`react-icons` being pulled in wholesale; the fix is to stop shipping a runtime
icon library, not to shard it by hand.

**The strongest work is absent and the weakest is promoted.** `dunx` — 21 stars,
a published framework with its own docs site — is not on the site at all. `@toplo`,
now deprecated, gets a full card with four npm badges. The work section leads with
DraftKings-era casino projects rather than `firecracker`. Everything renders in
`'Courier New'` behind a ~20-hue palette switcher, under the subtitle _"Showcasing
some of my projects."_

**Scale of the maintenance problem.** 155 repos on the GitHub account. Each
project on the site is hand-authored TSX with inline JSX icon arrays and
hand-keyed `React.createElement` calls. Adding one project means editing a 300-line
component. That is the tedium to design out.

---

## The nine decisions

1. **Bun replaces pnpm.** Vite stays the bundler; Bun is the runtime, package
   manager and test runner.
2. **stagelint replaces husky + lint-staged**, installed by a `prepare` script that
   writes into the repo's real hooks dir (works in linked worktrees, which
   `core.hooksPath` did not).
3. **oxlint + oxfmt replace ESLint + Prettier.** TypeScript 7 (`tsgo`) makes
   type-aware linting cheap enough to leave on.
4. **Projects opt in from GitHub, not from this repo.** A `portfolio` topic on a
   repo puts it on the site. Everything GitHub already knows — description, topics,
   language mix, stars, homepage, last push — is generated. A thin local overrides
   file covers only what GitHub cannot know, chiefly employment history.
5. **Four tiers, not two tabs.** `dunx` is the flagship and owns the landing page.
   Active work leads with `firecracker`. `trivia-art`, `rn-impossible-quiz`,
   `wisdoms` and the deprecated `@toplo` drop to a one-line Archive list — a
   mention, not a card.
6. **Generated data is committed, not fetched at runtime.** The site never talks to
   the GitHub API in the browser. A nightly workflow refreshes the snapshot; a
   failed refresh leaves the last good data in place.
7. **Every external embed is health-checked at generation time.** A URL that does
   not answer is marked offline and the UI renders a captured still instead of a
   blank iframe. The three dead embeds above become impossible to ship.
8. **Skills are measured, not declared.** Byte counts across every owned repo
   (private included) drive an interactive treemap with an opt-in walkthrough,
   replacing the hand-set `SkillLevel` enum. Proficiency is stated explicitly only
   where volume misleads.
9. **Mantine 9 replaces Chakra 2**, with one designed brand palette instead of the
   ~20-hue switcher — and **Cloudflare Pages replaces GitHub Pages** with PR
   previews. DNS already runs on Cloudflare nameservers, so the cutover is a Pages
   custom-domain change, not a registrar change.

Also cut: the `/contact` page and its form, and with it EmailJS, Formik and three
build secrets. Email, GitHub and LinkedIn live in the footer and on `/about`.

## Phase order

Phases 0–1 are independent of the redesign and land first, because they make every
later phase cheaper to iterate on.

```
Phase 0  Tooling + CI + Cloudflare        ── docs 01, 02   no UI change
Phase 1  Data pipeline + generators       ── doc 03        no UI change
Phase 2  Chakra → Mantine, same IA        ── doc 04        looks the same, on new primitives
Phase 3  Redesign: IA, motion, showcases  ── doc 05        the actual overhaul
Phase 4  Prerender, OG images, perf       ── docs 05, 06   SEO + speed
Phase 5  Retire gh-pages                  ── doc 02        cleanup
```

Phase 2 deliberately changes nothing visually. Migrating the component library and
redesigning at the same time means every bug is ambiguous — a Mantine mistake and a
design decision look identical in the browser.

Detailed sequencing, risks and the open decisions are in
[07-execution.md](./07-execution.md).
