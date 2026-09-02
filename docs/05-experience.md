# 05 — Experience

Phase 3. The actual overhaul: what the site says, in what order, and how it moves.

## Diagnosis

From the live site and the current source:

**It reads as a demo, not as a portfolio.** Everything is `'Courier New'`. There is
a palette switcher offering ~20 Chakra hues. The subtitle is _"Showcasing some of
my projects."_ The header is `☕ Petar Zarkov`. None of this signals a lead
engineer with a shipped framework; it signals a weekend React exercise.

**The strongest work is buried and the weakest is promoted.** `dunx` — 21 stars, a
real thesis, a documentation site, published packages — is not on the site at all.
`@toplo` is deprecated and gets a full card with four npm badges. The work section
leads with DraftKings-era casino projects instead of `firecracker`.

**Everything has equal weight.** Two tabs, then a vertical stack of identically
sized cards. A visitor with 30 seconds cannot tell what matters.

**Three of six hobby cards render a broken-image glyph.** Visible in production.
`derp.ai`, `wisdoms` and `trivia-art` are all down.

**Nothing moves.** No transitions, no scroll response, no state change worth
noticing. Hash URLs (`#/skills`), so no shareable links and no link previews.

**The Skills page is a self-assessment.** A hand-maintained enum rendering "Level:
Intermediate" next to a logo. It is unverifiable, it ages badly, and it is the
least interesting way to present the one thing that is genuinely measurable.

**The contact page is a form nobody fills in.** Name / Email / Message posting to
EmailJS, on a page with the social links that are already in the footer.
**Scrapped** — see below.

## Information architecture

One scrolling narrative, with real routes so any section is linkable and
prerenderable.

```
/                 Landing        ── the thesis, then dunx
/projects         Projects       ── Active, then Lab, then Archive
/projects/:slug   Detail         ── one project, deep
/skills           Skills         ── the interactive map (below)
/about            About          ── who, where, how to reach
```

`HashRouter` → `BrowserRouter`, with `public/_redirects` handling the SPA fallback
(doc 02). Real URLs, real OG previews, real search indexing.

No `/contact` route. The ways to reach a person are email, GitHub and LinkedIn,
and all three belong in the footer and on `/about` as links — not behind a form
that adds a third-party dependency and a build secret to send a message the
`mailto:` already sends.

### Landing

Three screens, no more.

**One.** A statement of what you do, in a sentence a hiring manager or a
conference organiser can repeat. Not `☕ Petar Zarkov` / _Lead Software Engineer_ —
those are labels. Something closer to _"I build backend frameworks and the tooling
around them. Currently: dunx, a DI framework for Bun."_ The name is the `<h1>`;
the thesis is the thing people read.

Behind it, a restrained canvas backdrop: a slow request-flow field, one accent
colour, sub-1ms per frame, `prefers-reduced-motion` renders a static gradient. It
sets tone; it does not perform.

**Two — dunx, given the whole screen.** This is the requested emphasis and it is
the right call: one project shown properly is worth eight shown as thumbnails. The
thesis in two lines, the live star count and version from `projects.json`, a
minimal code sample that shows the API, links to the docs site and the repo.

**Three.** Three or four cards into `/work` and `/projects`, and the current
activity strip from `activity.json` — last push, streak, this year's commits. It
answers "is this person still active" before anyone has to check GitHub.

### Work

A vertical timeline from `overrides.ts`, most recent first, `firecracker` at the
top. Per role: employer, title, dates, two or three sentences on what was actually
built and owned, and the stack as chips.

The DraftKings-era projects (Rocket Crash, Over Under, Casino Products) stay as
history entries — five years of casino platform work is real experience — but as
timeline rows, not as cards competing with current work for attention.

### Projects

Filterable grid over `projects.json`, grouped by tier (doc 03): **Active**, then
**Lab**, then **Archive**.

- **Active / Lab** — card with headline, stack chips, live stars, last push.
- **Archive** — a compact list. One line each: name, what it was, when it was
  retired, repo link. `trivia-art`, `rn-impossible-quiz`, `wisdoms` and `toplo`
  get a mention and no more, which is exactly what they have earned. The
  `retiredNote` from the overrides carries the reason ("Heroku free dynos were
  withdrawn"), which reads as context rather than as rot.

Filters are derived from the topic set in the data, so a newly tagged repo brings
its own filter.

### Project detail

`/projects/:slug`, reached by a shared-element transition from the card.

Everything from `projects.json`, plus the **live embed only when
`embeds.json` says the URL answered**. Offline embeds render a captured still with
a dated "offline since" note. The dead-iframe class of bug becomes unshippable.

## Skills — the interactive map

The requested redesign, and the section with the most upside: it is the only part
of the site that can be _measured_ rather than claimed.

**Data** (doc 03, reusing the profile repo's services): bytes per language across
every owned repo including private ones, the top 8 with the long tail bucketed
into `Other` at the 0.5% threshold, plus per-repo language breakdowns, the 365-day
commit series and the contribution graph.

**Form.** A treemap, not a bar chart. Area encodes volume, so TypeScript's
dominance is immediately legible and Rust, Python, C# and Go read as the smaller
real cells they are. Colour is the language's canonical colour, already carried in
the generated data. `@mantine/charts` covers the supporting charts; the treemap is
worth hand-rolling in SVG for the interaction below.

**Interaction — this is the part that matters.**

- Hover or focus a language cell: it lifts, and the project cards below filter to
  the repos that contain it, animated with a shared layout transition. The
  connection between "I write Go" and "here is the Go" becomes something you _do_,
  not something you read.
- Click a cell: it expands to per-repo contribution within that language, and the
  commit series filters to it.
- The proficiency override (doc 03) renders as an explicit, honest label —
  _"Go · 4% of bytes · beginner"_. Saying beginner where you mean beginner is more
  credible than a five-star rating, and it is the difference between a portfolio
  and a CV.

**The walkthrough.** A short guided tour, opt-in via a "Show me how to read this"
control — never auto-playing. Four or five steps, each spotlighting one region and
explaining what it encodes: _this is volume, not skill · this includes private
repos · this is the long tail, bucketed · this is what I would actually take a job
writing._ Driven from a step array, keyboard navigable, skippable at any point,
and it sets a flag in `localStorage` so it does not re-offer itself.

Done well this is the thing people remember and link to. Done as an auto-playing
overlay it is the thing people close. It must be opt-in.

## Motion

`motion@13.1.1` (the framer-motion successor). A system, not a pile of effects.

**Tokens.** Three durations (120 / 240 / 400ms) and two easings — a standard ease
for entrances and a spring for anything the pointer drives. Everything uses one of
them, so the site feels like one object.

**What animates**

| Moment          | Treatment                                                                        |
| --------------- | -------------------------------------------------------------------------------- |
| Route change    | View Transitions API, cross-fade + 8px rise; `motion` fallback where unsupported |
| Card → detail   | Shared element on the title and the thumbnail                                    |
| Scroll entrance | 12px rise + fade, staggered 40ms, **once** — never on scroll-back                |
| Treemap filter  | `layout` transitions on the project grid                                         |
| Hero canvas     | continuous, capped at 30fps, paused when the tab is hidden                       |
| Number changes  | count-up on stars and commits, first view only                                   |

**What must not animate.** Body text on entrance. Anything on scroll-back.
Anything that moves the page's layout after paint — it costs CLS and it feels
broken. Nothing may block interaction on the way in.

**Reduced motion is a contract, not a fallback.** `prefers-reduced-motion: reduce`
disables all transforms, holds the canvas on a single static frame, and turns the
walkthrough into plain text. The browser suite asserts it (doc 06). This is an
accessibility requirement and it also covers the reviewer whose laptop is on
battery.

## Command palette

`@mantine/spotlight`, ⌘K / Ctrl-K: every project, every section, every external
link. Cheap to build over `projects.json`, and for the audience this site is aimed
at, a working ⌘K is a stronger signal than any animation.

## Performance budget

Set in phase 4, enforced in CI (doc 06).

| Metric                 | Budget                           |
| ---------------------- | -------------------------------- |
| Initial JS             | ≤ 150 KB gzipped                 |
| LCP                    | ≤ 1.5s on a throttled connection |
| CLS                    | ≤ 0.05                           |
| Lighthouse performance | ≥ 95                             |

Route-level `React.lazy`, `motion` split out of the initial chunk, fonts preloaded
and `font-display: swap`, images as AVIF/WebP with explicit dimensions, the canvas
mounted after first paint.

## Prerendering and social previews

Phase 4. `vite-react-ssg@0.9.2` renders each route to static HTML at build time.
The site stays a client-side SPA after hydration; the difference is that a crawler,
a link unfurler and a slow phone all get real content in the first response.

Per-route `<title>`, description and canonical, plus OG images generated by
`scripts/gen/og.ts` with Satori + resvg — one per route and one per project,
carrying the project name, stack and star count. Pasting `petarzarkov.com/projects/dunx`
into Slack or LinkedIn currently produces nothing; it should produce a card.

## Accessibility

Non-negotiable, and `jsx-a11y` in the oxlint config (doc 01) catches the mechanical
half.

- Every interactive element reachable and operable by keyboard, visible focus ring.
- The treemap and walkthrough fully keyboard driven; the treemap has a table
  equivalent behind a toggle for screen readers.
- Semantic landmarks, one `<h1>` per route, heading levels in order.
- 4.5:1 contrast minimum — verify the brand ramp before adopting it.
- Every iframe titled, every image with real alt text.
- `prefers-reduced-motion` honoured everywhere.

## Cut list

| Cut                                      | Why                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `/contact` and the whole form            | mailto + GitHub + LinkedIn do the job; removes EmailJS, Formik and three build secrets |
| The ~20-hue palette switcher             | nothing can be designed against 20 palettes                                            |
| Work / Hobby tabs                        | replaced by tiers and filters                                                          |
| The Trivia widget                        | fetches a 404 and swallows it                                                          |
| `'Courier New'` as the site font         | the single biggest reason it does not read as professional                             |
| `@toplo`'s card                          | deprecated; drops to Archive                                                           |
| Rocket Crash / Over Under / Casino cards | become timeline rows under `/work`                                                     |
| Hand-authored `work.tsx` / `hobbies.tsx` | replaced by `projects.json`                                                            |
| `react-json-view`                        | React 17 peers, unmaintained since 2022                                                |

## Content still owed by you

The pipeline generates structure. It cannot generate judgement, and these are the
inputs that decide whether the result reads as professional:

1. **The landing thesis** — one or two sentences.
2. **One good description per tagged repo**, written on github.com (doc 03).
   `firecracker` currently reads _"firecrack"_.
3. **Work history** — employers, titles, dates, and what you owned.
4. **A photograph.** The current `avatar.jpg` is a 40px navbar circle. `/about`
   should carry a real one.
5. **Proficiency overrides** where byte count misrepresents you.
