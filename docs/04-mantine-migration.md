# 04 — Chakra → Mantine

Phase 2. **Nothing changes visually in this phase.** The redesign is doc 05.
Migrating a component library and redesigning at the same time makes every bug
ambiguous — a Mantine mistake and a design decision look identical in the browser.

## Why this is not optional

`@chakra-ui/react ^2.2.4` is installed against `react ^19`. Chakra v2 peers React
18; the current Chakra line is v3.37.0, which is a full rewrite with a different
API. So the choice is not "Chakra or Mantine", it is "rewrite onto Chakra v3 or
rewrite onto Mantine 9" — and Mantine is the requested target.

Two other packages come out in the same pass:

| Package                  | Problem                                                                   | Replacement                               |
| ------------------------ | ------------------------------------------------------------------------- | ----------------------------------------- |
| `react-json-view@1.21.3` | last published **2022-06-26**, peers `react: ^17 \|\| ^16.3 \|\| ^15.5.4` | deleted with the Trivia widget            |
| `formik@2.4.6`           | works, but a second form paradigm for one form                            | `@mantine/form`, then deleted (see below) |

## Packages

```
@mantine/core@9.6.0      @mantine/hooks@9.6.0
@mantine/charts@9.6.0    # language + activity visualisations (doc 05)
@mantine/spotlight@9.6.0 # ⌘K jump-to-project
@mantine/nprogress@9.6.0 # route transition indicator
@tabler/icons-react@3.46.0
postcss-preset-mantine@1.18.0  postcss-simple-vars
```

Not installed: `@mantine/form` and `@mantine/modals`. The contact form is being
scrapped (doc 05) and it was the only form on the site. `formik` and
`@emailjs/browser` come out with it, along with `src/config/email.ts` and the
three `VITE_*` build secrets.

`@mantine/notifications` only if something actually needs to notify. A dependency
added "for later" is a dependency nobody removes.

### PostCSS

`postcss.config.cjs`, per Mantine's documented setup:

```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

Without `postcss-preset-mantine` the `light-dark()` and `rem()` functions Mantine's
own CSS uses do not compile, and the failure is silent — styles just look wrong.

## Component mapping

Everything the current code actually imports:

| Chakra                                        | Mantine                                            | Note                                             |
| --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `Box`                                         | `Box`                                              |                                                  |
| `Container`                                   | `Container`                                        |                                                  |
| `Flex`                                        | `Flex` / `Group`                                   | `Group` is the horizontal default                |
| `HStack`                                      | `Group`                                            |                                                  |
| `VStack` / `Stack`                            | `Stack`                                            |                                                  |
| `SimpleGrid`                                  | `SimpleGrid`                                       | `spacing` → `spacing`/`verticalSpacing`          |
| `Center`                                      | `Center`                                           |                                                  |
| `AspectRatio`                                 | `AspectRatio`                                      |                                                  |
| `Text`                                        | `Text`                                             |                                                  |
| `Code`                                        | `Code`                                             |                                                  |
| `Badge`                                       | `Badge`                                            |                                                  |
| `Image`                                       | `Image`                                            |                                                  |
| `Button`                                      | `Button`                                           | `isLoading` → `loading`                          |
| `IconButton`                                  | `ActionIcon`                                       |                                                  |
| `Input` + `InputGroup` + `InputLeftElement`   | `TextInput` with `leftSection`                     | one component                                    |
| `Textarea`                                    | `Textarea`                                         |                                                  |
| `FormControl` / `FormLabel`                   | `label` prop on the input                          |                                                  |
| `Tooltip`                                     | `Tooltip`                                          |                                                  |
| `Spinner`                                     | `Loader`                                           |                                                  |
| `Tabs` / `TabList` / `TabPanels` / `TabPanel` | `Tabs` / `Tabs.List` / `Tabs.Tab` / `Tabs.Panel`   |                                                  |
| `UnorderedList` / `ListItem`                  | `List` / `List.Item`                               |                                                  |
| `StackDivider`                                | `Divider`                                          | Mantine has no divider _prop_; render explicitly |
| `Modal` (`BaseModal`)                         | `Modal`                                            |                                                  |
| `useClipboard`                                | `useClipboard`                                     | `@mantine/hooks`, same name                      |
| `useColorModeValue`                           | `light-dark()` in CSS, or `useComputedColorScheme` | **see below**                                    |
| `extendTheme`                                 | `createTheme`                                      |                                                  |

### `useColorModeValue` is the big one

It appears in nine components and it is a **hook**, so every call site is a
re-render on theme change and several of them are called inside `.map()` callbacks
— [work.tsx](../src/screens/projects/work.tsx) and
[hobbies.tsx](../src/screens/projects/hobbies.tsx) both call it inside a function
that returns an array, which is a rules-of-hooks violation that ESLint was not
configured to catch. `react-hooks/rules-of-hooks` in the new oxlint config
(doc 01) will flag it.

Do not port it to `useComputedColorScheme`. Mantine's answer is CSS:

```css
.card {
  background: light-dark(
    var(--mantine-color-gray-0),
    var(--mantine-color-dark-6)
  );
}
```

No hook, no re-render, works in a `.map()`. Reserve `useComputedColorScheme` for
the rare case where JavaScript genuinely needs to branch on the scheme — a canvas
colour, for instance (doc 05).

## Theming

The current [themes.ts](../src/theme/themes.ts) generates **one theme per Chakra
colour** — roughly 20 of them — and stores the selection in
[store.ts](../src/store/store.ts), surfaced as the palette icon in the navbar.

That goes. It is a toy, it makes every colour decision impossible (nothing can be
designed against 20 palettes), and it is the single clearest reason the site does
not read as professional. One designed palette, light and dark.

**Delete:** `src/theme/themes.ts`, `src/theme/ThemeContext.tsx`,
`src/theme/ThemeProvider.tsx`, `src/hooks/useThemeProvider.ts`, `src/store/`, and
the `@store` path alias.

**Add:** `src/theme/theme.ts`

```ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand: [/* 10 shades, one designed ramp */] },
  fontFamily: 'InterVariable, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrainsMonoVariable, ui-monospace, monospace',
  headings: { fontFamily: 'InterVariable, system-ui, sans-serif' },
  defaultRadius: 'md',
});
```

Mounted as:

```tsx
<MantineProvider theme={theme} defaultColorScheme="auto">
```

`"auto"` follows `prefers-color-scheme` with nothing stored, which the browser
suite asserts on (doc 06).

### Typography

`'Courier New', monospace` is the current body **and** heading font for the whole
site. It is why the screenshots read as a terminal mockup rather than a portfolio.

Two self-hosted variable fonts, `woff2`, subset to latin + latin-ext, preloaded:
a neutral sans for everything, and a mono reserved for code, version strings and
the terminal element in doc 05. Self-hosted rather than Google Fonts — one less
origin, no CSP exception, and no third-party request on the critical path.

## Icons

Three sources today: `@chakra-ui/icons`, `react-icons` (five sub-packages), and
the 282-line [icons.tsx](../src/components/Icons/icons.tsx) wrapping them.

**UI icons** → `@tabler/icons-react`, tree-shakeable, Mantine's own set.

**Technology logos** → stop shipping an icon library. `simple-icons` is a
build-time dependency; a generator emits an SVG sprite containing only the slugs
actually referenced by `projects.json`, and the site inlines it. ~40 logos as one
cached sprite instead of a runtime package.

That deletes the entire `manualChunks` block in
[vite.config.mts](../vite.config.mts) — 13 hand-written entries that exist to
shard `react-icons`, one of which is a copy-paste bug (`'react-icons/md'` maps to
`['react-icons/cg']`). With no runtime icon library, Rollup's default chunking is
correct and the config shrinks to aliases plus the React plugin.

It also closes the loop with doc 03: `projects.json` carries GitHub topics, topics
map to simple-icons slugs, and a newly tagged repo gets its stack chips with no
code change.

## Order of operations

The app must build and run at every step. Chakra and Mantine can coexist — both
are CSS-scoped — so the migration is incremental, not a single commit.

1. Install Mantine + PostCSS. Mount `MantineProvider` **inside** the existing
   `ChakraProvider`. Verify the app still renders.
2. Port the theme: `theme.ts`, fonts, the brand ramp. Delete the multi-theme store
   and the palette switcher. Site now has one palette, still Chakra components.
3. Leaf components first — `Title`, `ExternalLink`, `IconLink`, `Feature`,
   `BaseModal`, `CustomTab`, `BackTop`.
4. Layout, `NavBar`, `Footer`.
5. Screens. `Projects` and `Skills` are rewritten against
   `src/generated/*.json` rather than ported — doc 03 landed the data in phase 1,
   and the hand-authored `work.tsx` / `hobbies.tsx` are deleted here, not
   converted.
6. `Contact` is deleted outright (doc 05), taking `formik`, `@emailjs/browser`,
   `src/config/email.ts` and the three `VITE_*` secrets with it.
7. Icons: sprite generator, delete `Icons/icons.tsx`, delete `manualChunks`.
8. Remove `ChakraProvider` and uninstall `@chakra-ui/react`, `@chakra-ui/icons`,
   `react-icons`, `react-json-view`, `formik`, `@emailjs/browser`.

Step 8 is the checkpoint. If anything still imports Chakra, `bun run typecheck`
fails loudly rather than shipping both libraries.

## Bundle expectations

Today's build ships Chakra v2 + Emotion + five `react-icons` sub-packages +
`react-json-view` + Formik. After step 8: Mantine core + hooks, Tabler icons
(tree-shaken to what is used), an inline SVG sprite, and `motion` (doc 05).

Set the budget in phase 4 and enforce it in CI rather than asserting a number
here — see [06-testing.md](./06-testing.md).
