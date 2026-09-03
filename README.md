# Liferay Sites Design System

A React component library whose single source of truth is the Figma library
**Solutions Library- 2026** (file key `KihJKyGA20stc2SSjAlxYU`). Components are
[Mantine](https://mantine.dev) components dressed in that library's tokens, documented in Storybook,
and mapped back to Figma with Code Connect.

## Quick start

```bash
pnpm install
pnpm storybook
```

Storybook at http://localhost:6006 is the main way to work with this library. `pnpm dev` runs a
minimal Vite page instead, if you want to exercise the components the way a consuming app would.

| Script | What it does |
| --- | --- |
| `pnpm storybook` | Component docs and examples on port 6006 |
| `pnpm dev` | Minimal Vite preview page |
| `pnpm tokens` | Regenerate the theme from `tokens/figma/` |
| `pnpm tokens:check` | Fail if the generated files are out of date (used by `pnpm build`) |
| `pnpm icons` | Regenerate the icon set from `src/icons/manifest.json` |
| `pnpm icons:check` | Fail if the generated icons are out of date (used by `pnpm build`) |
| `pnpm glass-icons` | Regenerate the illustrative set from `assets/glass-icons/` |
| `pnpm glass-icons:check` | Fail if the generated glass icons are out of date (used by `pnpm build`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Check the generated files, typecheck, build the library bundle and the page builder |
| `pnpm build-storybook` | Static Storybook into `storybook-static/` |
| `pnpm figma:publish` | Publish the Code Connect mappings to Figma |
| `pnpm builder:dev` | The page builder's UI on port 5173 (needs `pnpm builder:worker` beside it) |
| `pnpm builder:worker` | The Worker and the Durable Objects, locally, on port 8787 |
| `pnpm builder:catalog` | Regenerate the builder's component catalogue from the components' types |
| `pnpm builder:catalog:check` | Fail if the catalogue is out of date (used by `pnpm build`) |
| `pnpm builder:build` | Build the builder app and the server-side renderer into `dist/` |
| `pnpm builder:ssr` | Just the server-side renderer, for `/p/:id.html` |
| `pnpm builder:deploy` | Build the app and deploy the Worker to Cloudflare |

Pushing to `main` builds Storybook and publishes it to GitHub Pages at
**https://makenaford.github.io/liferay-sites-design-system/** (`.github/workflows/deploy-storybook.yml`). That workflow
also fails the build if the generated token files have drifted from `tokens/figma/`, so a hand-edited
`*.generated.*` file cannot land quietly.

This repo uses **pnpm**, with supply-chain policies in `pnpm-workspace.yaml` — a one-week minimum
release age, strict engine checks, no exotic sub-dependencies, and a no-downgrade trust policy. If an
install is refused because a version is too new, pin to the newest version old enough to pass rather
than relaxing the policy.

## The page builder

A designer needs to try a page before anyone builds it — real components, real interactions, their own
copy — without opening an editor and without a developer. That is what `worker/` and `src/builder/` are:
a Cloudflare Worker serving a builder that composes **this library's components**, with each page kept
in its own Durable Object.

```bash
pnpm builder:worker      # the Worker and the Durable Objects, on :8787
pnpm builder:dev         # the UI with hot reloading, on :5173, proxying /api to the Worker
```

For a single process against the built app — closest to production — run `pnpm builder:build` and then
`pnpm builder:worker`, and use :8787 alone.

| Route | What it is |
| --- | --- |
| `/` | Start a new page, or reopen one this browser has seen |
| `/edit/:id` | The builder |
| `/p/:id` | The page on its own — the link a designer shares |
| `/p/:id.html` | The same page as one self-contained file |
| `/edit/new` | Signs you in (via Cloudflare Access) and makes a page |

### What a designer can change, and what they cannot

Everything in the inspector was read off a component's **TypeScript type**. `Card`'s five surfaces are
five cells in Figma, and they reach the panel because `surface?: 'glass' | 'no-bg' | …` says so. There
is no colour picker and no font size, because the components do not take those: a page that could set
its own spacing would drift off the design, and then the mock stops predicting what gets built.

The measurements that *are* offered — a `Grid`'s column count, a `Section`'s max width — are the ones
the components already take as props, which is the library saying they belong to the caller.

### How the catalogue stays honest

`src/builder/catalog.generated.ts` is produced by `scripts/build-builder-catalog.mjs`, which reads the
components' own types through the TypeScript compiler and keeps only the props **declared in this
repository** — dropping the several hundred each component inherits from Mantine. Add a variant to a
component and it appears in the builder; `pnpm build` fails if the file has drifted.

Two things the types cannot answer are handled explicitly rather than guessed:

- **Props the theme owns.** `Button` adds nothing to Mantine's `Button` — all four Figma appearances
  are painted by the theme — so `filled | outline | neutral | rounded` is not in `ButtonProps`. It *is*
  in the story's `argTypes`, for the same reason, so the generator reads the stories as a second source
  and marks those props `source: 'story'`.
- **Props no generic control can draw.** An array of objects, a render function. These are listed under
  `unsupported` and shown in the inspector as "set in code only", so a designer knows the component can
  do something the panel is not offering.

### Presets, from the stories

Every component in the inspector has a **Preset** field listing its Storybook stories. Choose `Rich
panel` on an accordion and you get that accordion — two rows, the real questions, the buttons in the
panel. Choose `Customer quote` on a card and you get the stat, the quote and the attribution, in the
right slots.

Nothing is written twice. A story is already the answer to "what does a good `Card` look like",
checked on every commit against the Figma file, so the presets are **the stories themselves**, read at
runtime.

They are read as **rendered element trees**, not as source. Parsing the story files is the obvious
approach and the wrong one: a story is full of `FAQ.map(…)`, `index === 2 ? … : …` and `{...args}`, so
a static reader has to become a small JavaScript interpreter and will still lose to the next story
someone writes. Calling `render(args)` gives back plain React elements with every `map` expanded and
every ternary decided; what remains is a translation between two trees, which is a job with an end to
it. It even calls the little helper components a story defines for itself — `Cover`, `GartnerProof` —
since those are just functions of their props.

**A preset is a story that renders exactly one of the component it documents.** That test, rather than
a list of names, is what keeps the demonstration matrices out: `Sizes` draws both sizes side by side
and `Matrix` draws twelve buttons, and neither is a thing anyone wants dropped onto a page. A story
wrapped in a sizing `Box` still counts — the wrapper is unwrapped on the way down.

A story may render scaffolding beside the component — the header stories draw a page below a *fixed*
header so it has something to sit over — and that is still unambiguous when the story names its
component: one match among the roots wins, two is a demonstration and is skipped.

It reads `src/blocks/Blocks.stories.tsx` as well as the component stories, and those are the ones that
matter most for a page: **`Section` gets all fifteen of Figma's block types** — `Card grid`, `Faq`,
`Integrations`, `Tabbed content`, `Quote` — each several components deep with its copy already written.
That file sets no `component` on its meta, because a block is a `Section` holding something else, so
the target is inferred from whatever the story turns out to render.

Three translations are worth knowing about, because each one recovered a set of stories that were
otherwise lost. An inline `<svg>` — the logos a marquee draws by hand — becomes an `Image` whose source
is that SVG serialised into a data URI, so it renders identically as one node instead of forty. A bare
`<div>` is arrangement rather than design, and is unwrapped like a `Box`. And Mantine's tabs draw each
tab twice, once as a pill and once as a panel, joined by `value`; those halves are matched back up into
the builder's single `Tab` node, which is the same flattening `registry.tsx` performs in the other
direction.

That currently yields **119 presets across 20 components**, with 3 skipped. The reasons are in
`unsupportedPresets` rather than hidden — a story that uses a hook, or one containing something the
palette has no equivalent for — so the list is a to-do rather than a wart.

Applying a preset keeps the node's id and position and replaces everything inside it, so the selection
does not move and undo puts back exactly what was there. The node remembers which story filled it, so
the control shows the choice rather than resetting to blank, and **↺** beside it re-applies the same
preset — the gesture for "put it back" after editing the copy, which a select cannot express because
`onChange` does not fire for a value that has not changed.

### What a new page starts as

Header, hero, a card grid, a carousel section, footer — the skeleton every site has, so the first edit
is about *this* page rather than about rebuilding the same frame again.

The two sections are **built from named presets** rather than from blanks, and that is the point rather
than a shortcut. A blank section is a grid of three placeholder cards; `Card grid` and
`Carousel section` are different kinds of band, written against the Figma file. Starting from named
ones means a new page shows two different shapes instead of the same shape twice — and the inspector's
preset field says which each one is, so it can be swapped for one of the other thirteen in a click. A
name that no longer matches a story falls back to that component's blank, so renaming a story costs a
plainer starter rather than a missing section.

Nothing in it is special: they are the nodes the palette produces, and deleting the header deletes it
for good. The first undo takes the page back to nothing, which is the right answer for someone who
wanted a blank page after all.

**The browser writes it, not the Worker.** Creating a page with its contents server-side is the tidier
arrangement and was the first implementation — but building from presets means reading the Storybook
stories, and importing those into the Worker took its bundle from 2.1MB to 7.4MB: **4.07MB gzipped,
past the 3MB a Worker is allowed on the free plan.** Several megabytes of story content shipped to the
edge to draw one starting page is the wrong trade.

The signal the browser uses turns out to be exact anyway: `rev === 0` means the document has never been
written. A page someone emptied has a revision history and is left alone. Two tabs opening the same
brand-new page would both try, and the second gets the ordinary stale-revision answer and takes the
first one's version — the same thing that happens for any other simultaneous edit.

`Header` and `Footer` are in the palette for this. They were left out originally as site chrome rather
than page content, which was the wrong call: a mock of a page is a mock of a page in a site. The
header's nav is a list of objects rather than elements, so its items are held as `NavItem` nodes and
read — not rendered — into `items`, the same way `Tabs` reads its tabs. `MegaMenu` is still out: it is
a navigation panel several columns deep, and a component that takes twenty nodes to fill in is worse
than no component until somebody asks for it.

### Why a Durable Object per page

A page being edited is a session, not a row. Every write to one page has to be ordered against every
other write to that page and against nothing else, which is what a Durable Object is — single-threaded
per instance, so the read-check-write of a revision needs no transaction. The same object holds the
open WebSockets, so a second tab is told about a change by a method call rather than a message bus. And
each object keeps its own SQLite table of past revisions, so a page has history from the first edit.

A save carries the revision it was based on. If the stored page has moved on, the write is refused with
a `409` and the current document comes back, rather than being merged — see `src/builder/usePage.ts` for
what the builder does next, and why it prefers the edits already on the designer's screen.

### The artefact

Until you ask for it, a page has no HTML: `/p/:id` is an empty shell plus the JavaScript that builds
the page in the browser. The document in the Durable Object is the truth and the DOM is derived from it.

`/p/:id.html` is the other thing — one file, styles inlined, no JavaScript. It is a **document, not an
application**: the markup and the styling are exact, but a carousel does not scroll and a tab bar does
not swap, because that behaviour is React and there is no React in the file. Use it to send a page to
someone, to archive a revision, or to diff two of them.

It is rendered in the Worker, from the document, on request — not captured in the browser and stored.
A stored snapshot is a second copy of the truth, and it starts drifting the moment anything else writes
the page.

The renderer is built by Vite rather than by wrangler, which is not a preference: **CSS Modules class
names are chosen by the bundler**. Vite emits `_root_1uwax_29` and esbuild emits `components_root`, so a
wrangler-bundled renderer produces markup whose classes are missing from the Vite-built stylesheet — a
perfectly correct page with no styling at all. `vite.ssr.config.ts` builds it; `alias` in
`wrangler.jsonc` points the Worker at the result.

### The code panel

**Code** in the toolbar opens the page's source beside it, in two views:

- **React** — the source a developer pastes and maintains. Real import paths, real prop names. The
  three components the builder flattens for a designer's sake — an accordion row, a tab, a list item —
  are written back out as the compound API they really are, so what comes out compiles.
- **HTML** — the output, from the same renderer the Worker uses, so it is exactly what a browser gets.

Both are linked to the canvas in both directions: select a component and its lines scroll into view and
light up; click a line and that component is selected and scrolled to. Neither is editable, and that is
the design — the document is the truth and both views are derived from it. Typing into the HTML would
produce markup no component can express, and the React a developer is handed would stop describing the
page. Editing happens in the inspector, where every value on offer is one the design system has.

### What the artefact caught

Worth recording, because it is the argument for having it. `SectionTitle` renders `<h2>{title}</h2>`
itself, and the builder's blank was putting a `Heading` — another `<h2>` — inside that slot. Nested
headings, and a `<p>` inside a `<p>` for the description right below it.

Both rendered fine for weeks of clicking around, because React builds the DOM directly and never
consults the HTML parser. Serialise the same page to a file and the parser applies its own rules — a
`<p>` is closed by the next `<p>`, a heading by the next heading — and the tree comes out a different
shape from the one on screen. **A page can look right in the builder for exactly as long as nobody
writes it down.** Those slots now accept inline content only.

### Who can do what

Two ways in, and they are not equivalent.

**Cloudflare Access** authenticates editors — the email one-time-code screen, or whatever identity
provider the team uses. It is required to create a page, change one, read its history, or mint a share
link.

**A share code** admits a reader to one page. It buys nothing on any other page and no ability to
write to this one. The code travels in the URL exactly once, on the first open; the Worker moves it
into an `HttpOnly` cookie and the app strips it from the address bar before the page has finished
loading.

| Route | Who |
| --- | --- |
| `GET /edit/new` | Access. Mints a page and redirects into it |
| `GET /api/me` | anyone — reports whether you are signed in |
| `GET /api/pages/:id` | Access, or the page's code |
| `PUT`/`DELETE /api/pages/:id` | Access |
| `GET /api/pages/:id/socket` | Access, or the code. Only Access may write over it |
| `GET /api/pages/:id/history`, `POST …/restore`, `POST …/share` | Access |
| `GET /p/:id.html` | Access, or the code |
| everything else | the builder's files — the shell is not secret, the page data behind it is |

The Worker verifies the Access assertion itself rather than trusting that Access was in front. It has
to: an Access application protects a **path**, and `POST /api/pages/:id` must require a login while
`GET /api/pages/:id` must not — Access sees one path, and cannot tell them apart. A Worker also has
other front doors, `*.workers.dev` among them. So Access makes the login *happen* and
`worker/access.ts` makes it *count*.

**Be clear about what the cookie buys.** Taking the code out of the URL means the address bar of an
open page is not a working invitation, so a reader who copies it and passes it on passes on nothing.
It does not stop that reader forwarding the original link, and it never could without reader accounts.
It is a speed bump, and **Share → Reset the link** is what actually revokes: it replaces the code, and
every link already sent stops working.

### Setting up Access

Two variables in `wrangler.jsonc`, both from the Access application:

```jsonc
"vars": {
  "ACCESS_TEAM_DOMAIN": "yourteam.cloudflareaccess.com",
  "ACCESS_AUD": "<the application's Audience tag>"
}
```

Neither is a secret. **With either missing, every gated route refuses** — an unconfigured deployment is
inert rather than open.

Create the application in Zero Trust → Access → Applications, as a self-hosted app on this Worker's
hostname, and give it the path `/edit/*`. That path is what makes the login screen appear: `/edit/new`
is the only "sign in" link the app offers, and it both authenticates and creates a page. Add a policy
for whoever should be able to build pages — an email domain, a list of addresses, whatever suits.

Locally, `.dev.vars` sets `ACCESS_DEV_OPEN=true` so `pnpm builder:worker` works without a tunnel and a
real login. It is honoured **only for requests to localhost**, so it cannot open a deployed Worker even
if the variable somehow reached production, and `wrangler deploy` never uploads the file. Two
independent locks on the same door. To exercise the gates locally, run
`pnpm builder:worker --var ACCESS_DEV_OPEN:false`.

### Deploying

`wrangler.jsonc` carries the bindings, the `#ssr` alias and a pinned compatibility date. `pnpm
builder:deploy` builds the app into `dist/builder/` and the renderer into `dist/ssr/`, then deploys. Configure the Access
application first, or the deployment will refuse every edit.

## How tokens flow

```
Figma variable collections
  └─ export ──▶ tokens/figma/*.tokens.json        (committed, the snapshot of record)
       └─ pnpm tokens ──▶ src/theme/tokens.generated.ts        (typed values)
                          src/theme/typography.generated.css   (responsive CSS variables)
            └─ src/theme/theme.ts + components.ts ──▶ Mantine theme
```

A colour mode can be assembled from more than one file — see `COLOR_MODES` in
`scripts/build-tokens.mjs`. `color.light.tokens.json` is the Figma UI export; `color.action.light.tokens.json`
holds the `Action/*` group, which that export omits and which was read out of the Figma Plugin API
instead. Later files win on key collisions, and aliases resolve across the merged set.

**To change a value:** change it in Figma, export the collection, replace the file in
`tokens/figma/`, run `pnpm tokens`. Never edit a `*.generated.*` file, and never hardcode a colour
inside a component — if you need to, something is missing from the token layer.

The generator resolves Figma's token aliases (in Light mode most `Status/*` colours are references to
the `Brand` ramp), rebuilds translucent colours as `rgba()`, and fails loudly on a dangling or
circular reference rather than emitting `undefined`.

Every colour token is published as a CSS variable named after its Figma path —
`Brand/Primary/Lighten/1` becomes `--sds-brand-primary-lighten-1` — in both colour modes, so a
component never needs to know which mode is active.

Typography is responsive: Figma ships three modes (Mobile 0+, Tablet 576+, Desktop 1200+) and all
three are emitted as media-queried variables, so the type scale follows the viewport on its own.

## Banner

**Not from Figma.** There is no Banner cell in `Solutions Library- 2026`, so this is the one component
whose axes are a proposal rather than a transcription — and the one with no Code Connect mapping. If a
Banner is drawn later, what needs reconciling is the three tones, the two alignments, and whether the
category pill is a `Label` instance or its own thing. Listed under *Known gaps in the design source*.

The announcement band across the top of the site: a 40px strip holding one sentence, an optional
category pill, one link and a dismiss button.

| Prop | What it is |
| --- | --- |
| `tone` — `brand` / `accent` / `neutral` | the wash and the pill colour |
| `label` | the category pill — `New`, `Event`, `Beta` |
| `icon` | a glyph before the pill, decorative |
| `action` | where the announcement leads, normally a `Link` |
| `onClose` | shows the dismiss button and reports the press |
| `align` — `center` / `left` | centred under the band, or ranged left in the gutter |
| `position` — `static` / `sticky` | pinned to the top of the viewport, or in the flow |

### The wash is a tint of the page, not a fill

Both stops are `color-mix()` against `Surfaces/Page BG base/Default` — the brand at 10% on one side, 4%
or `Accent/Product Accent` on the other. Mixing rather than picking a pale token is what lets **one**
declaration serve both colour schemes: the result is a barely-blue white on the light canvas and a
barely-blue near-black on the dark one, and neither is maintained separately. `Brand/Primary/Lighten 5`
would have needed a per-scheme swap and would still have been louder than the `Header` sitting under
it, whose glass is that same page background at 60%.

The `neutral` pill is the one place where a second variable earns its keep. Its fill is
`Surfaces/Text/Secondary`, which flips with the scheme, so white text works in one mode and vanishes in
the other; `--sds-banner-pill-text` puts the page background on it instead, which flips with it.

### Dismissal is the caller's to keep

`onClose` fires and nothing else happens: the banner does not hide itself and does not remember. Only
the page knows which announcement this is and how long *dismissed* should last — this session, this
browser, this account — so it drops the banner from the tree and persists that decision itself. A band
that remembered on its own would need an id it has no way to be given.

### Not a live region

The band is present when the page loads, so announcing it as if it had just arrived would interrupt a
screen reader for something the reading order already reaches first. It is a labelled `aside`, which
lands in the landmark list. A message about something that *just happened* — a save that failed, a page
that published — is a different component and wants `role="status"`.

### Where it goes relative to the header

With a static header the banner precedes it and the two scroll away together. With a **fixed** header
the banner cannot simply precede it — the header is pinned to the viewport's top edge and would cover
the band — so put both in one fixed container and leave the header `position="static"` inside it.
`position="sticky"` is for the third case: a band that outlives a static header by pinning itself.

## Button

From the Figma `Button` component set (node `16123:189647`).

```tsx
import { Button, IconArrowRight, IconRefresh, LiferaySitesProvider } from 'liferay-sites-design-system'

<LiferaySitesProvider>
  <Button variant="filled" size="lg" leftSection={<IconRefresh />} rightSection={<IconArrowRight />}>
    Continue
  </Button>
</LiferaySitesProvider>
```

Figma spreads the appearance over two axes, Color and Style. Those are collapsed into Mantine's single
`variant` prop so the variations read as one flat list:

| Figma Color + Style | `variant` |
| --- | --- |
| Primary + Solid | `filled` (default) |
| Primary + Outline | `outline` |
| Neutral + Solid | `neutral` |
| Primary + Rounded | `rounded` |

| Figma axis | Prop |
| --- | --- |
| Size — Large / Medium / Small | `size="lg" \| "md" \| "sm"` (default `lg`) |
| Icon — Left / Right / None | `leftSection` / `rightSection` |
| State — Default / Hover / Focus / Pressed | real CSS interaction states |
| State — Disabled | `disabled` |

Measurements, all taken from the component rather than invented:

| | Height | Padding X | Gap | Label | Radius |
| --- | --- | --- | --- | --- | --- |
| `lg` | 56px | 18px | 8px | 21/28px | 8px |
| `md` | 48px | 16px | 8px | 18/24px | 8px |
| `sm` | 40px | 12px | 4px | 14/20px | 4px |

`rounded` overrides the radius to Figma's `Border Radius/round` pill.

### States

Every variant's label binds to a colour token in Figma and stays constant across states; the fill is a
two-stop diagonal gradient that Figma re-angles and re-stops per state. `filled`, `outline` and
`rounded` are used exactly as drawn. `neutral` is **restructured**, for the same reason the Link's
`secondary` style was: Figma draws it only on the dark canvas and it does not survive contact with a
light one.

As drawn, `Color=Neutral` binds its fill to the `Neutral/03`–`05` steps under a white
`Action/Neutral/Inverted` label. Figma inverts that ramp between modes, so in light mode the steps
become pale greys and the white label lands at **1.72:1 and 1.46:1** against WCAG AA's 4.5:1 minimum.
The fill now binds to `Action/Neutral/*` instead — the neutral counterpart of the `Action/Primary/*`
group `filled` already uses, and the group the white label itself comes from:

| State | Figma | Now | |
| --- | --- | --- | --- |
| rest | `Neutral/04` → `Neutral/03` | `Action/Neutral/Active` → `Action/Neutral/Hover` | changed |
| hover | `Neutral/03` → `Neutral/04` | the same pair reversed | changed, structure as drawn |
| focus / pressed | `Neutral/05` → `Neutral/03` | flat `Action/Neutral/Hover` | changed |
| disabled | the rest fill at 50% opacity | as drawn | unchanged |
| label, all states | `Action/Neutral/Inverted` | as drawn | unchanged |

Both replacements are real Figma tokens, so this is one edit to take back to the design file: rebind
the Neutral fill from the `Neutral/*` ramp to `Action/Neutral/*`. What it fixes:

1. **The ramp is mode-dependent and the label is not.** `Action/Neutral/Hover` (`#34465b`) and
   `Action/Neutral/Active` (`#3d536b`) hold the same value in both Figma modes, so the white label
   clears **9.66:1 and 7.93:1 in both**, rather than 6.6:1 / 8.8:1 on dark and 1.72:1 / 1.46:1 on
   light.
2. **The state ordering also inverted.** Figma's pressed step, `Neutral/05`, is *lighter* than
   `03`/`04` in dark mode and *darker* than both in light — pressing a button lightened it in one mode
   and darkened it in the other. Pressed is now the darker of the two slates in both.
3. **`Action/Neutral/Default` cannot be the resting stop.** It is `#ffffff` in both modes — the same
   mode-independent white that made the Link's rest state invisible — so the resting pair is `Active`
   (the lighter slate) into `Hover`, and the group's Hover/Active naming reads one step off the state
   it is used for. Worth a rename, or a `Neutral` solid-button entry in `Components/*`, if this goes
   back to Figma.

Measured in the browser against both page backgrounds, with the white label:

| | light | dark |
| --- | --- | --- |
| rest (both stops) | 7.93 / 9.66 | 7.93 / 9.66 |
| hover (both stops) | 9.66 / 7.93 | 9.66 / 7.93 |
| focus / pressed | 9.66 | 9.66 |
| disabled | 2.40 / 2.58 | 3.67 / 4.00 |

Disabled is below 4.5:1 by design — WCAG 1.4.3 exempts inactive controls, and it is Figma's own
treatment (the rest fill at 50% opacity) rather than a deviation. The one number that gets slightly
worse is the fill's contrast against the dark page background, 2.99/2.23 as drawn versus 2.48/2.04
now; both are under the 3:1 of WCAG 1.4.11, which applies to a control's boundary only where the
boundary is what identifies the control, and a filled button with a visible label is not that case.

## Link

From the Figma `Link` component set. A themed Mantine `Anchor` — an inline row of label and optional
icons with a 4px gap.

```tsx
import { IconArrowForward, Link } from 'liferay-sites-design-system'

<Link href="/pricing" variant="default" size="lg" rightSection={<IconArrowForward />}>
  CTA Link
</Link>
```

| Figma axis | Prop |
| --- | --- |
| Style — Primary / Secondary | `variant="default" \| "secondary"` |
| Size — Small / Medium / Large | `size="sm" \| "md" \| "lg"` (default `lg`) |
| Icon Left / Icon Right | `leftSection` / `rightSection` |
| State — Default / Hover / Active / Visited | the real CSS interaction states |
| State — Disabled | `aria-disabled` |

Figma names the styles **Primary** and **Secondary**; the prop values follow the variation sheet's
**Default** and **Secondary**, and the Code Connect mapping bridges the two.

| | Label | Icon box |
| --- | --- | --- |
| `lg` | 21/28px | 20px |
| `md` | 18/24px | 16px |
| `sm` | 14/20px | 12px |

Unlike Button, the icon box scales with the label.

### States

All 30 Figma variants bind their label to a colour token, so the design intent is fully specified. The
`default` style is used exactly as drawn. The `secondary` style is **restructured** — Figma only ever
draws it on the dark canvas, and three of its five states do not survive contact with a light
background or a screen reader.

| State | `default` (Figma Primary) | `secondary` | |
| --- | --- | --- | --- |
| rest | `Action/Link/Default Link` | `Surfaces/Text/Primary` | changed from `Action/Neutral/Default` |
| visited | `Action/Link/Visited Link` | `Action/Link/Visited Link` | as drawn |
| hover / focus | `Action/Link/Hover Link` | `Action/Link/Hover Link` | changed from `Surfaces/Text/Primary` |
| active | `Action/Link/Active Link` | `Action/Link/Active Link` | changed from `Surfaces/Text/Primary` |
| disabled | `Action/Link/Disabled Link` | `Action/Neutral/Disabled` | changed from `Surfaces/Text/Primary` |

Every replacement is itself a Figma token — nothing is invented — so each change is one edit to take
back to the design file. What each one fixes:

1. **Rest.** `Action/Neutral/Default` is `#ffffff` in *both* colour modes, which is **1.03:1** against
   the light page background — the link does not appear at all. `Surfaces/Text/Primary` is the
   mode-aware equivalent: `#f0f1f5` on dark, indistinguishable from the white Figma shows, and
   `#262c37` on light. That moves it from 1.03:1 to **13.66:1**.
2. **Hover.** Figma moves `#ffffff` to `#f0f1f5` — a change of roughly 4%, which nobody can perceive.
   It now moves to the link accent, the same `Action/Link/Hover Link` the default style uses: an
   obvious shift in both hue and lightness, and one that reads as "this is a link".
3. **Disabled.** Figma uses `Surfaces/Text/Primary` — the same colour as that style's own hover, at
   full contrast, so a disabled link was indistinguishable from an interactive one.
   `Action/Neutral/Disabled` is Figma's own token for the purpose.

Measured against both page backgrounds, every interactive state now clears WCAG AA's 4.5:1:

| | light | dark |
| --- | --- | --- |
| `default` rest / visited / hover / active | 6.9 / 6.3 / 8.7 / 13.8 | 8.0 / 11.5 / 12.9 / 9.6 |
| `secondary` rest / visited / hover / active | 13.7 / 6.3 / 8.7 / 13.8 | 17.5 / 11.5 / 12.9 / 9.6 |
| focus ring | 3.7 | 5.2 |

Disabled sits at 2.3 and 2.7 in light mode, which is intentional and permitted — WCAG 1.4.3 exempts
inactive controls, and being visibly muted is the point.

### The trailing icon moves on hover

A link with a trailing arrow nudges it 3px on hover — the direction the link goes. Only the trailing one:
a leading icon sliding away from its label reads as drift rather than intent. It is a `transform`, so it
costs nothing in layout, and `prefers-reduced-motion` removes it while keeping the colour change and the
underline.

### Underline, and why the default changed

Figma's `Underline` boolean defaults to false. In code `underline` defaults to **`hover`** instead,
because a state change carried by colour alone is not perceivable to everyone (WCAG 1.4.1) and the
resting appearance still matches the design. Keyboard focus gets the underline too, which Mantine's
own `underline="hover"` does not cover.

Pass **`underline="always"`** for a link inside a paragraph: there the link has to be distinguishable
from the text around it at rest, not just on hover. The `InProse` story shows this.

### Disabled links

`disabled` drops the `href`, so the element stops being a link: not in the tab order, not activatable,
and announced as disabled. `aria-disabled` on an anchor that still has an `href` is worse than no state
at all — it announces "disabled" and then navigates anyway on Enter.

Prefer not needing it. A link that goes nowhere is usually better as plain text, and an action that is
temporarily unavailable is a `Button`.

Renders an `<a>`. For a router link pass `component={NavLink}`; for an action that is not navigation,
use `Button`.

## Chip

Figma `Chip` component set (node `16858:51126`), on Mantine's `Chip`.

A **removable filter chip** — it toggles, it takes focus, and every drawn cell carries a close glyph on
the right. For a read-only tag (the pill over a card, the `CMS Trends` marker) use `Label`, which is
Figma's separate set.

```tsx
<Chip defaultChecked leftSection={<IconSearch />} rightSection={<IconClose />}>
  Financial Services
</Chip>
```

| Figma | Prop |
| --- | --- |
| `Label` | `children` |
| `Left Icon` + `↳ Left Icon` | `leftSection` |
| `Right Icon` + `↳ Right Icon` | `rightSection` |
| `State=Default` | the resting pill |
| `State=Selected` | `checked` / `defaultChecked` |
| `State=Focused` | `:focus-visible`, a real state |
| `State=Disabled` | `disabled` |
| `State=Dragged` | `dragging` |

One drawn size (90×30), so there is no size axis: 8px of horizontal padding, 6px vertical, an 8px gap,
`Border Radius/medium`, and `Paragraph/X-Small/Semi Bold`.

**Three of the five states are not props.** Focus and disabled are real CSS states, so they are
`:focus-visible` and `:disabled` — the same treatment `Button`, `Link` and `Card` get. That leaves
`Selected`, which is the checkbox, and `Dragged`, which is a styling hook: dragging is the page's job,
because a chip cannot know it is being reordered.

### The label is 14px, not 11

`Paragraph/X-Small/Semi Bold` — the text style the chip is drawn with — is **14px**. The variable
`Size/Paragraph/X-Small` is **11px**, in all three typography modes. The same split `Button` and `Link`
have between their `Action/*` text styles and their `Size/*` variables, and resolved the same way: the
text style wins, because it is what the component is drawn with. The height settles it — 14 at 1.25 is
17.5, plus 6 and 6 of padding, which is the drawn 30. At 11 the pill would come out 28.

### Selected loses the hairline

`State=Default` has a gradient stroke — `Components/Button Outline/line-stp-01` into `-02`, white into
`Accent/Primary Blue Accent` — drawn with the same masked pseudo-element the card and the tab bar use, so
all three hairlines are built alike. `State=Selected` binds **no** outline token at all: the stroke is
what goes when `Surfaces/Card BG/Blue` arrives. Verified against the variant's own variables rather than
inferred from the set's.

**The selected fill is very weak.** `Surfaces/Card BG/Blue` is `#6399ff0d` — 5% alpha — so on the dark
canvas a picked chip is only just distinguishable from a resting one. It is reproduced as drawn; a filter
row where selection is the whole point wants more separation than that.

### No check mark, and no built-in remove

Mantine puts a tick inside a checked chip and reflows the label around it. Figma does not, so the tick is
hidden and the padding is held constant — otherwise picking a chip would resize it and shove every chip
after it along the row.

`rightSection` renders inside the chip's own `<label>`, which wraps a checkbox — so a `<button>` cannot go
in it, and clicking the glyph toggles the chip like clicking anywhere else. **A row that needs real
removal must put the close control beside the chip** and give it its own accessible name. Figma draws the
close glyph as part of the chip, which cannot work as a second control; that is a gap in the design.

## Label

Figma `Label CTA` (node `15121:237267`). Its `Style` axis maps onto `variant` and `Size` onto `size`.

| Figma | Prop |
| --- | --- |
| `Style=Filled` | `variant="filled"` — a flat `Components/Label/lab-tonal-bg` under white text |
| `Style=Glass` | `variant="glass"` — `Surfaces/Card BG/Translucent` with the `glass effect card` blur and shadow |
| `Style=Gradient` | `variant="gradient"` — no fill, a `Brand/Primary` → `Accent/Product Accent` stroke |
| `Size=Large / Medium / Small` | `size="lg" \| "md" \| "sm"` — 40 / 32 / 22 tall |
| `Show Icon` + `Instance` | `leftSection` / `rightSection` |

Defaults are `Style=Filled, Size=Large`, the first cell the set draws.

Size carries the radius with it, because Figma binds it that way: `round` at Large (a pill), `medium`
at Medium, `small` at Small. A snippet never needs to pass `radius`.

### The set was restyled

`Style` used to be **Gradient / Tonal / Outline**. It is now **Filled / Glass / Gradient**, and two of
the three survived under new names:

| Was | Is | Note |
| --- | --- | --- |
| `Tonal` → `variant="light"` | `Filled` → `variant="filled"` | same flat fill, new name |
| `Outline` → `variant="outline"` | `Gradient` → `variant="gradient"` | same gradient stroke, new name |
| `Gradient` → `variant="filled"` | — | the gradient *background* has no cell any more |
| — | `Glass` | new |

The 24 call sites that said `variant="outline"` now say `variant="gradient"`.

**One judgement call worth knowing.** The Home hero's compliance marks (`SOC 2 Type 2`, `ISO/IEC
27001`…) are drawn as plain subtle chips, and the restyled set has no plain-outline cell — a mechanical
rename would have given them a blue ring they do not have in the file. They use `glass` instead. The
report tags on `Our Latest Research & Data` *are* ringed in the file, and keep `gradient`.

CSS cannot paint a gradient *border* directly — `border-image` ignores `border-radius`, which would
square off the pill — so the ring is a background with its interior masked out on a pseudo-element.
The mask sits on the pseudo-element rather than the root because a mask applies to everything an
element renders, text and icon included.

## Card

Figma `card-main` (node `16728:26513`) with `Surface` (`16953:109831`), `card-image`,
`header-alignment` (`19097:9035`), `Card hero` (`17720:27408`) and `Content Text` (`20354:3820`).

`card-main` is **one** component with four slots and a boolean per slot, and every card in the
`Common Cards` set is that component with different slots filled. This mirrors it: **a slot is a prop,
and passing it is the toggle.** There is no `type` prop, because Figma has not got one either — the five
cards in `Card Examples` are five arrangements of the same thing, and each is five or six lines.

| Figma | Prop |
| --- | --- |
| `Surface` `Style` — no-bg / Glass / Blue / Grey / Gradient Blue / Gradient Purple | `surface` |
| `card-main` `Align` — Vertical / Horizontal | `align` |
| `card-main` `Padding` — True / False, plus the `no image padding` frame | `padding` |
| `Show Image` + `card-image`, `Aspect Ratio` 3:2 / 16:9 | `image`, `imageRatio` |
| `Show Top Content` + `Top Content` | `top` |
| `Card hero` `Show` — Label / Icon / Blog / Tag / Events / Stat | `hero` |
| `header-alignment` `Align` — Vertical / Center | `headerAlign` |
| `Show title` + `Title Card`, `Content Text` `Size` | `title`, `titleSize` |
| `Show description` | `description` |
| `Show Main Content 1` / `2` | `main`, `secondary` |
| `Show Bottom Content` | `bottom` |
| `Surface` `State` — Default / Hover / Focus | real CSS states, with `interactive` |

```tsx
// Figma `Type=Resource`
<Card
  component="a"
  href="/guide"
  interactive
  surface="no-bg"
  padding="none"
  image={<Image src={cover} alt="" ratio="3:2" radius={0} />}
  hero={<Label size="sm" variant="outline">Guide</Label>}
  title="Card Title"
/>
```

### The five cards in `Card Examples`

Each is the same component. This is the whole difference between them:

| Figma `Type` | Props |
| --- | --- |
| `Resource` | `surface="no-bg" padding="none"` + `image`, `hero`, `title` |
| `CS- Quote` | `image`, `top` (a `Stat`), `description`, `bottom` (the quotee) |
| `CS- Details` | `image`, `title`, `description` |
| `Icon-Left` | `hero` (a 40px glass icon), `title`, `description` |
| `Icon-Center` | `headerAlign="center"` + `hero`, `title` |

The set has three more cells — `CS-Stat`, `Quick Link` and `Stat Highlight` — which `Card Examples` does
not use. They are not shipped as anything special, because there is nothing to ship: each is another
arrangement of these slots.

### Measured

| | Figma | Verified |
| --- | --- | --- |
| Padding, `Padding=True` | 20px | 20px |
| Stack gap, with an image | 16px | 16px |
| Stack gap, without one | 20px | 20px |
| `Card Content` gap | 16px | 16px |
| `card-header` gap, Vertical / Center | 8 / 20 | 8 / 20 |
| Title, `Content Text Size=Small` | 21px semibold | 21/26 w600 |
| Title, `Size=Full Card` | 32px bold | 32/40 w700 |
| Title–description gap, Small / Full Card | 4 / 12 | 4 / 12 |
| Description | 18px regular | 18/24 w400 |
| `Bottom Content` padding-top | 8px | 8px |
| Radius | 8px | 8px |
| Horizontal: padding, gap, radius, columns | 24/40, 24, 16, 588+588 in 1280 | all four |

The **description is `Surfaces/Text/Primary`** — the same colour as the title, not the Secondary a
description usually gets in this library. That is what all five cards draw, and the previous
implementation had it wrong.

The gap difference is worth naming: both icon cards and all three image cards are `Padding=True,
Align=Vertical`, and the icon ones sit at 20 while the image ones sit at 16. The gap travels with the
content rather than with a variant, so it keys off whether there is an image.

### Glass is the clickable surface

A card that is not a link or a button uses **`grey`, never `glass`**, and it gets there without being told:
`surface` defaults from `interactive` — `glass` when clickable, `grey` when not. `grey` is the only static
surface; Figma's `Blue` cell is not shipped, for the reason in the gaps list below.

The reason is that glass is the surface carrying the interaction. The hairline that warms on hover, the ring
that appears on focus, the lift — all of it hangs off glass. On a static card none of it ever fires, so the
surface is promising something the card does not do.

**Figma disagrees with itself here, and this follows the rule rather than the file.** Four of the five cards
in `Card Examples` are `Surface Style=Glass` — `CS- Quote`, `CS- Details`, `Icon-Left` and `Icon-Center` —
while only two of them are drawn as clickable. Either those cards are meant to be links, or their surface
should be `Grey`; the set cannot be right as it stands. Worth settling in the file, since it is the kind of
inconsistency that gets copied.

`no-bg` is unaffected: the Resource card is `no-bg` *and* clickable, and its interaction lives on the image.

### `padding` has three values, not two

Figma's axis is a boolean, but the file draws a third shape as its own frame — `no image padding`, where
`card-main` is still `Padding=True` and the 20px has been **moved down onto `Card Content`** so the image
can run to the card's edge. That is a different shape, not a different number, which is why this is not a
padding scale:

- `all` — `Padding=True`. 20px around everything, the image included, which gets a 4px corner of its own.
- `content` — the image bleeds to the card's edge and the text stays inset. The image is a sibling of the
  padded body rather than a child of it, which is exactly how the Figma frame is built — no negative
  margins involved.
- `none` — `Padding=False`. The Resource card.

The image's corners follow from that. Under `content` the image's bottom corners are square, because it
meets a card body it shares a surface with and rounding them would open two slivers of card between the
picture and the text it belongs to. Under `none` **all four are round**: there is no body under the
image, only the page and then a tag and a title sitting on it, so the picture is a free-standing
photograph rather than the top half of a panel — and a photograph with two square corners and two round
ones looks cropped by something that is not there.

### Where the hover goes

Figma's `Surface` has a `State=Hover` cell and it is **byte-for-byte its `State=Default`** — same fill,
same 1px hairline. `State=Focus` is the only state the file actually distinguishes, and it differs by one
thing: the ring goes from 1px to 2px. So the hover is inferred, and it follows one rule taken from the
layout rather than from a style:

- **The image runs to the card's edge** (`padding="none"`) — the hover is **on the image**: it scales to
  1.06 inside its own box, lifts its brightness, and the gradient ring is drawn **round the picture**
  rather than round the card. The card itself still does not move, and it is still the whole click target
  — the root is the anchor, so a click on the label or the title reaches it.

  The ring used to be absent here entirely, on the argument that a ring around a `no-bg` card outlines a
  box with no edge at rest and reads as a border appearing from nowhere. That argument is right about the
  *card* and wrong about the *picture*: the image is already a rectangle with corners, so lighting its
  edge is the same gesture the padded cards make, aimed at the only thing on the card that can carry it.
  It is also why this padding rounds all four of the image's corners — see below.
- **Everything is padded** (`padding="all"`) — the hover is on the **card**: it rises 2px, the ring warms
  to the brand gradient, and a glow appears beneath it. An image inside the padding scales too, at 1.03,
  because the card is what leads. The glow is deliberately tight and faint — 24px at a third — because a
  cast shadow belongs to the gap the lift opened, and the card only moved 2px. It was 32px at 55%, which
  read as the card being backlit rather than lifted and bled into its neighbours on a grid.

Press settles the movement back towards rest rather than pushing further.

**Focus is the exception to that split.** Figma's own ring at 2px, on the **whole card** whatever the
padding, because a focus ring has to be where the focus is — a keyboard user tabbing onto a full-bleed card
needs to see the card, not a slightly larger picture. `:focus-visible`, so it belongs to the keyboard and
not the mouse.

### The resting hairline is not the ring

Worth recording because it is easy to get backwards. The `Surface` **set's** rectangle carries a
`Brand/Primary/Lighten/1 → Accent/Product Accent` stroke on every variant, Default included — but **every
real instance overrides it** with `Components/Glass Line/01` at 20% into `02` at 10%. So:

- resting hairline: the glass line, 1px, at 225°
- hover and focus ring: the brand gradient

Reading the set instead of the instances paints every card blue at rest.


## CapabilityMap

The product constellation on the homepage redesign — `Homepage Redesign`, the `FINAL` frame
(`7703:16084`): sixteen products in four sections of four, around DXP.

### A honeycomb, so overlap is impossible

Flat-top hexagons on a hexagonal lattice, every tile placed by *lattice cell* rather than by position.
Three constants turn a cell into a position: a column step is `0.75 × tile` across, a row step is
`0.866 × tile` down, and odd columns hang half a row lower.

That is the whole non-overlap guarantee, and it is structural rather than careful: two different cells
are at least one hexagon apart because the arithmetic says so. A tile then fills **95%** of its cell,
which turns the leftover into an even gap on all six sides. It was 88%, which drew a comfortable lattice
and a small card; the card is the thing being read, and the gap is only there to stop two hexagons
reading as one, so the ratio is set by how little gap does that job.

**The hub is 2.5 cells across**, up from 1.8. Pushing the sections out to ±4 columns opened a gap the
old hub was not big enough to hold: the figure read as four groups with something small in the middle
rather than as a platform they sit on. Its icon and label keep the same share of it that they had at
1.8, so only the hexagon grew.

A section is **four tiles ringing a hollow, with the section's name in the hollow** — the shape
`Homepage Redesign` node `7435:7003` draws. The ring is five neighbours of one cell with two left open,
and the two left open are the pair facing the hub, so each section reads as a C turned toward the middle
and the connector has somewhere to arrive.

Naming a group by sitting inside it is the thing the earlier arrangements could not do. The name used to
be set above or below the whole figure, which left the pairing to be inferred from position, and it cost
two rows of canvas that came straight off the size of the hexagons. Nesting it also let the four sections
come back to ±2 columns without the field reading as one undifferentiated mass, which is what pushed them
out to ±4 in the first place.

The lower two sections are **not** the upper two mirrored, which is what they look like they should be.
A mirrored ring puts its hub-side tile one row from the upper ring's, and one row *is* touching on this
lattice — the two sections fuse into one eight-tile mass. So the lower hollows drop a row, to `r=2`, which
buys the separation and costs the figure its top-to-bottom symmetry; `--sds-map-oy` lifts the drawing
inside its box to put it back in the middle, since the hub is no longer the centre of what is drawn.

The canvas is **5.6 × 4.9 tiles**, down from 8.6 × 5.1. Both dimensions shrank — the sections came back
in, and the names stopped needing rows of their own — and since a card is the page divided by these
numbers, the same window now draws a considerably bigger hexagon. **Height is what binds** at every width
down to about 1000, which is a comfortable place to be: it is the dimension `maxHeight` controls.

The hub is **1.9 cells** across, the largest that clears the nearest tile at 2.14 cells with the gap the
lattice gives everything else, and what the file draws.

### `names="outside"` — the other drawing in the file

`Homepage Redesign` node `8144:21713` draws the same sixteen products with the section names set **out
past the tiles**, each joined to its group by a short leader. `names="outside"` is that arrangement, and
it is a different figure rather than the nested one with margins:

- **The sections are tight diamonds, not rings.** A section that carries its own name needs a hollow to
  put it in; a section whose name is out on the lattice does not, and a hollow it does not need is a
  hole in the drawing. So the four tiles touch — a centre column of two with a flank each side, the
  diamond the figure was originally built on.
- **The leader lands on a corner of the section's own outline**, the loop the figure already computes,
  so the name and the four tiles close into one object rather than reading as a caption near an
  arrangement. It is two segments, and the second takes the lattice's angle: a horizontal run out from
  the name, then a 60-degree leg, which is the slope every hexagon edge here already has. A straight
  line to the corner would be the only stroke in the drawing that ignores the grid, and it looks like
  it. Where the nearest corner is level with the name — which it usually is — the second segment has
  nothing to do and the leader is simply horizontal.
- It is drawn in **the loop's own gradient**, not the lattice's grey, which at 22% was too faint to read
  as connected to anything; and it **does not animate**. It is a bracket, not traffic: a travelling
  highlight would make it read as another connector carrying something to the hub.

The canvas is **8.2 × 4.5** — the diamonds are shorter than the rings, 4.33 tiles of tiles rather than
4.76, and the names then claim about four tiles of width on each side — glow included, since the box has to
hold that too or the figure pushes the page sideways, which is a bug the layout suite caught at 1440. That is close to 2:1, wider than
any window, so **height is what binds** and this arrangement answers the window's height at every
ordinary width. It wants a different ceiling for that reason: 860 is a card size worked back through the
*nested* canvas, and a floor that tall here would put the figure wider than any window and stop the
height from ever binding. The story passes `max(420px, 100svh - 120px)`.

The name sits 3.45 tiles out in a box 1.0 wide, which leaves the leader a fifth of a tile — short, and
still unmistakably a line. The box being narrow is only half of it: the name is also **aligned toward the
figure**, ranged right on the left side and left on the right, so the words end where the leader begins.
Centred in its box, a short name stopped a third of a tile short of its own line and read as much further
out than it was, which is the distance that actually wanted closing. Measured on the page, all four names
now end a uniform 29px from their tile.

The leader lands on the **end tile** — the one furthest out on the name's side — picked by which cell it
is rather than by which corner happens to be nearest, so the line arrives at the same place in every
section: the outer tip of the tile at the end of the row.

**The home page draws this arrangement.** Because the canvas is close to 2:1 the height binds at every
ordinary width, so the figure answers the window instead of sitting at a fixed size — which is why the
page's ceiling is `max(520px, 100svh - 320px)` and not the 860 the nested arrangement wanted. 860 is a
card size worked back through that taller canvas; here it would put the figure wider than any window and
stop the height binding at all.

| Window | Figure | Card | Labels wrapping |
| --- | --- | --- | --- |
| 1440 × 900 | 1147 × 580 | 122px | `Personalization` |
| 1440 × 1080 | — | ~152px | none |

The card is smaller than the nested arrangement's 167 — four tiles of names is what it costs — and what
it buys is a full line of text per section and four cleanly labelled objects.

`nested` stays the component's default. Nothing but the lattice is shared between the two: a section's
outline, its connector and its leader are all computed from its cells, so a second arrangement is a
table of cells and the lines follow.

### 14px is the floor, and it sizes the hexagons

`Paragraph/Small Caps` is the label's **minimum**, not its ceiling: a product name is the one thing here
a reader must be able to read, so it never scales below the token however narrow the column.

That requirement sizes everything else: 14px of text and an icon have to fit inside a hexagon's middle
band, so the tile size is the constraint and the canvas is measured in tiles. All sixteen names sit on
one line at about 160px per tile, and the two longest — `Cloud Native` at a space, `Personalization` at
its soft hyphen — start wrapping below about 120px. A page with room for less than about 100px per tile
should show a list instead.

Measured on the home page, after the sections came in and the names went inside them:

| Window | Figure | Card | Labels wrapping |
| --- | --- | --- | --- |
| 1440 × 900 | 983 × 860 | **167px** | none |

For comparison, the same window drew a 150px card when the canvas was 8.6 tiles wide with the names set
outside it, and 106px before the card fill and the height floor were raised.

### The network

Three things share one SVG layer, all walking the lattice's own edges rather than cutting across it:

- **Traces** — two dozen short walks that draw themselves on and off, about eight at a time.
- **Loops** — one around each section's computed outline, and one around the hub's.
- **Connectors** — one route from the hub out to each section, so the figure says the products are wired
  to the platform rather than merely arranged around it. Routed by breadth-first search over the vertex
  graph. A straight radial line would have been clearer and wrong: it would be the only thing in the
  figure that ignores the grid.

A section's loop is *computed*, not drawn: list the four cells' 24 edges, drop the five any two of them
share, and the 14 that remain are the boundary; threading those by shared vertex gives the perimeter in
order. So the path is always exactly that section's outline.

Every line is stroked with one gradient in `objectBoundingBox` units, which resolves against each
line's own box — so all of them run base `Brand/Primary` to base `Accent/Product Accent` along their own
length from a single `<defs>` entry. Peaks are 0.55 for connectors, 0.4 for traces, 0.3 for loops: the
order is the point, since only the connectors carry a message.

Walk starts are **seeded** at both ends rather than left to chance. Drawn uniformly from some five
hundred vertices, a start almost never lands near the middle or out at the rim — measured, the closest
any line came to the centre was 2.78 cells. Four now begin at the core and six at the outermost
vertices, so the middle and the edges both carry lines.

### Two rendering rules, learned the hard way

**`pathLength` and `vector-effect: non-scaling-stroke` cannot both apply to one stroke.** The second
measures a normalised dash in device pixels, so a dash of 28-of-100 becomes 0.84 device pixels and a
travelling line renders as a row of dots. Widths are therefore authored in tiles with no vector-effect.

**Nothing may render below about 1.25 device pixels**, which is where a diagonal stops antialiasing and
starts flickering. `--sds-map-tw` is a floor the component computes from its own rendered width and only
ever raises: at a 1100px column it is 1, and at 378px it lifts to 1.475 to hold the thinnest stroke at
1.25px instead of 0.85.

Two related mistakes worth not repeating: `drop-shadow` on a couple of dozen paths whose geometry is
animating means re-rasterising every filtered region every frame, and it stuttered visibly — the glow is
now a second, wider, fainter copy of each path. And `preserveAspectRatio="none"` scales the axes
independently, so any rounding between them makes a stroke heavier along one axis than the other; on a
lattice built from diagonals that reads as lines of uneven weight.

### The tile's edge is the library's, at half strength

Every tile carries `Components/Glass Line` at 225° — the hairline `Card` draws on every glass surface —
but at about **half the token value**, `--sds-map-tile-line-*` rather than `--sds-glass-line-*`.

The token is right for one card on a page. Sixteen ringing a single hub is a different problem: at full
strength the edges were the brightest thing in the figure and the centre, which is the subject, read as
the dimmest. **The hub keeps the full value**, so the hierarchy runs core, then tiles, then network.
This is a deliberate deviation from the token and is the kind of thing a reviewer comparing against
Figma would otherwise read as a mistake.

It is painted on the body and revealed as a 1.5px rim by insetting everything above it. A `clip-path`
cannot take a border, and the masked pseudo-element ring the rounded cards use does not survive a
hexagon: clipping a rectangular ring to one erases the line along all four diagonals.

### Tiles are socketed, evenly

Inside that edge each tile is shaded as a socket, with the shadow **even on all six sides**: clear in
the middle, deepening to 66% black on the outline.

One gradient does it, and the shape keyword is why it comes out even. `closest-side` on a radial gives
an **ellipse** whose radii are the box's own half-width and half-height — and this box is a hexagon's
bounding box, `w × 0.866w`. So it saturates at `0.5w` horizontally, exactly where the left and right
vertices are, and at `0.433w` vertically, exactly where the flat top and bottom edges are: on the
outline in every direction, rather than short of it on four sides and past it on two, which is what a
circle would do.

Still gradients rather than `box-shadow: inset`, which follows the rectangular border box — clipped to a
hexagon it bands along the straight top and bottom and leaves all four diagonals bare.

### The hub

The one block that is not glass: opaque, with `backdrop-filter: none`, and lit from within by a radial
of `Brand/Primary`. Being solid is what lets the traces cross the middle — a line passing behind a
platform disappears behind it — and it puts the brightest edge in the figure around the thing the figure
is about.

It sits on the lattice cell at the origin that no section may use, 1.8 cells wide, which clears its
nearest neighbour by a fifth of a tile.

### The hub breathes, and nothing else does

The breath went from all seventeen tiles, to the hub alone, to nothing, and it is back on **the hub
alone**. One thing moving in the middle of sixteen still ones reads as a centre; seventeen moving at once
read as a screensaver, which is what the first pass was.

3.5% over four and a half seconds, with the wash breathing between 0.78 and 0.96 on a **7.3s** period so
the two never quite line up — the light reaching its brightest a little after the hub reaches its widest
is what stops the pair reading as one object being scaled.

**`ease-in-out` with `alternate`, not the library's `motion-ease-out`.** That was the fault that killed
the first version and it is worth not repeating: `cubic-bezier(0.05, 0.7, 0.1, 1)` is a decelerate curve
built for one-way transitions, and looped it snaps to the peak then sits at rest for a third of every
cycle. A symmetric curve played forwards and back has no rest in it. The other finding from those passes
still holds: the tiles were **already** perfectly synchronised when they looked staggered — all seventeen
shared one timeline with identical scale and `currentTime` at every sample — and a swell's amplitude
comes from the fill, since 95% is what leaves room to grow into.

Off under `prefers-reduced-motion`, both of them.

### Interaction

`Card`'s hover on a hexagon: the tile grows to 1.14, its edge fills with `card-Focus Ring` lit from
where the pointer entered, a sheen follows the cursor across the glass, and the label comes up to full
white. Focus mirrors it exactly.

A tile grows rather than lifting. `Card` rises 2px into the gap around it; a tile on a lattice has
nowhere to lift to, so scale is the affordance — at rest nothing overlaps, and a hovered tile
deliberately does, which is how it comes forward.

On top of that, **the section stays lit**: everything outside the hovered tile's section drops to
`saturate(0.5) brightness(0.58)` and the three tiles beside it only to `0.92`/`0.9`, and the section's
name comes up with them. The hub belongs to no section and dims with the outsiders. The hover teaches
the taxonomy instead of a legend, and the keyboard gets it too.

**Arrow keys walk the lattice.** Tab order on a spatial figure follows the DOM rather than the drawing;
the arrow keys move to the nearest tile in that direction through a **70° cone** — wide, because a
hexagon lattice's only off-vertical neighbours sit at 60° and a tighter cone skips them. Pressing Right
then Down then Left then Up from a section's top tile walks its diamond and returns.

`prefers-reduced-motion` drops the traces and loops entirely — a drawn-on line has nothing to say when
it cannot draw — but keeps the connectors still and visible, because the topology is information.

## Stat

From the Figma `Stats Item` set (node `15121:237366`), with `StatBar` from `Stats Bar`
(`16708:102931`) and its gradient `divider` (`16290:53873`).

```tsx
import { IconArrowUp, Stat, StatBar } from 'liferay-sites-design-system'

<StatBar>
  <Stat value="845" label="Months to launch" leftSection={<IconArrowUp />} />
  <Stat value="98%" label="Uptime" />
</StatBar>
```

| Figma | Prop |
| --- | --- |
| `Property 1` — Default / Small | `size="md" \| "sm"` (default `md`) |
| `Value` / `Label` | `value` / `label` |
| `Show Stat Icon Left` / `Right` | `leftSection` / `rightSection` |
| `Stats Bar` `Align` — Left / Center | `StatBar align` |

| | Value | Label | Icon |
| --- | --- | --- | --- |
| `md` | 40px/100%, SemiBold, `Accent/Primary Blue Accent` | 12px/120% uppercase, 6% tracking | 20px |
| `sm` | 32px/100% | 11/16px, sentence case, no tracking | 20px |

Both labels are `Surfaces/Text/Secondary`. There is no gap between the icons and the number — Figma
sets the value row's spacing to zero, so the arrows sit tight against the digits. The label row keeps
its 4px.

**A stat is not interactive.** No hover, no focus, no pressed state, no clickable wrapper, no pointer
cursor: it is a number with a caption. If a stat needs to lead somewhere, put a `Link` next to it.

It renders as plain text in reading order, so it is announced as "845 Months to Launch". The icons are
decorative and hidden from assistive technology, which means an arrow that carries meaning — up rather
than down — has to be said in the label too. The **Direction In Words** story shows this.

`StatBar` puts a 1px **`Neutral/03`** rule between every pair of stats at Figma's 16px gap, and stacks
below 576px with the rules turning horizontal — the shape Figma's `Size=Small, Align=Vertical` cell
draws. The rules are `<hr aria-hidden>`, so the bar reads as a list of numbers rather than announcing a
separator between each one.

Figma instantiates its *gradient* `divider` here, running `Neutral/06` into `Brand/Primary/Lighten/3`.
That is deliberately not used: a rule between two numbers should not draw the eye, and the gradient made
the last stat look picked out. The rules are also not optional — a bar of numbers with nothing between
them reads as one number.

## Tabs

Two Figma sets, both of which are tabs, as two variants of one component:

- **`variant="default"`** — `Tabs Menu Bottom` (node `22570:34600`) as instantiated at `24385:69232`, built
  from `Tab Element` (`20517:20939`), `Tab Base` (`20517:19948`) and `Background States` (`20639:4643`).
- **`variant="pills"`** — `Tabs Pill Menu` (node `17900:62310`), built from `Tabs Pill` (`20517:21553`): a
  glass container with a full-radius pill under the selection.

The pill menu **used to be a separate `SegmentedControl` component and is not any more.** The Figma set is
named `Tabs Pill Menu`, its cells are `Tabs Pill`, and it swaps panels — every part of it says tabs. A
segmented control is a radio group, where the choice itself is the outcome; when a screen needs that, a
`Radio.Group` or a `Select` is the honest control rather than a tab bar wearing its clothes.

```tsx
import { Tabs } from 'liferay-sites-design-system'

<Tabs defaultValue="websites">
  <Tabs.List>
    <Tabs.Tab value="websites">Enterprise Websites</Tabs.Tab>
    <Tabs.Tab value="commerce">Digital Commerce</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="websites">…</Tabs.Panel>
  <Tabs.Panel value="commerce">…</Tabs.Panel>
</Tabs>
```

**The name is literal: the rule and the active indicator sit on the top edge**, above the labels,
because this bar closes a section rather than opening one. Every absolute position in the file agrees —
the divider, the tab bar and the active tab's `Line Up` vector all share the same y. Mantine's
`inverted` prop is that flip and it is the default here; `inverted={false}` puts the rule and indicator
underneath, which the **Underline** story shows.

| Figma | Prop |
| --- | --- |
| `Size` — Desktop / Mobile | **responsive** — a media query at 1200px, not a prop |
| `Tab Element` `State` — Default / Hover | the resting tab and the real `:hover` |
| `State` — Active | `value` / `defaultValue` |
| Each tab's label | `<Tabs.Tab value="…">` |

| | Tab height | Padding | Label |
| --- | --- | --- | --- |
| Desktop (≥1200px) | 52px | 14/18px | 18/24px, cells divide the width equally |
| Mobile (<1200px) | 48px | 14/18px | 14/20px, cells hug and the row scrolls |

Figma's mobile bar is 758px wide inside a 366px frame, so scrolling is the drawn behaviour. The
breakpoint and the scroll-snapping match the segmented control, so the two bars behave alike.

### States

| State | Treatment | Source |
| --- | --- | --- |
| the rule | 1px `Neutral/03`, full width, behind every tab | as drawn |
| active | a 3px gradient over it — `Action/Primary/Active` into `Accent/Product Accent`, round caps | as drawn |
| hover | the same line at a third of its width and weight, in `Action/Link/Hover Link` | as drawn |
| label default | 18/24 SemiBold `Surfaces/Text/Secondary` | as drawn |
| label active | Bold, `Surfaces/Text/Primary` | **restructured** |
| focus | `Styles/focus-ring`, inset so a scrolling row cannot clip it | **inferred** |
| disabled | half opacity, and the arrow keys skip it | **inferred** |

**The active label is the third white-on-white in this library.** Figma binds it to
`Action/Neutral/Inverted`, which is `#ffffff` in *both* colour modes — the same token that made the
Link's `secondary` rest state invisible and the `neutral` button unreadable. It now uses
`Surfaces/Text/Primary`: `#f0f1f5` on dark, indistinguishable from the white Figma shows, and `#262c37`
on light, where white would not appear at all. That is **13.66:1** instead of 1.03:1.

Mantine draws both the rule and the indicator with borders at one shared width. Figma needs 1px for one
and 3px for the other, and the indicator is a *gradient*, which no `border-color` can be — so the tab
border is switched off and the indicator is a pseudo-element. That also keeps it out of layout, which
matches the file: `Line Up` is an overlay, and every tab is 52px whatever its state.

The indicator is always 3px tall and animates **`transform` and `opacity`**, never `height`: it wipes out
from the centre on selection and scales down to a third for hover. A height transition relayouts on every
frame and lands unevenly; a scale runs on the compositor.

Measured in the browser, against both page backgrounds:

| | light | dark |
| --- | --- | --- |
| label default | 10.5 | 12.6 |
| label hover | 8.7 | 12.6 |
| label active | 13.7 | 15.1 |
| indicator (both stops) | 8.7 / 6.2 | 5.6 / 6.4 |

### `variant="pills"`

Figma's `Tabs Pill Menu`, measured from the set:

| | Mobile | Desktop |
| --- | --- | --- |
| Container height | 60px | 64px |
| Container padding | 8px | 8px |
| Container radius | 1000 (full) | 1000 |
| Pill height | 44px | 48px |
| Pill padding | 12px all round | 12px / 36px |
| Gap between pills | 12px | 0 |
| Icon | 16px | 20px |

48 + 8 + 8 is the drawn 64, so the container's hairline is a pseudo-element rather than a border — a border
would add to the height. The container's fill differs between cells: a flat `Glass Tab/tab fill 1` at 3% on
desktop, a radial of the `Glass Card` steps on mobile. Below 1200px the bar scrolls, which is what Figma's
762px-wide `Tab bar` inside a 366px frame is describing.

`Tabs Pill` `State`:

| State | Figma |
| --- | --- |
| Default | nothing drawn at all |
| Hover | no fill, no stroke — a `#adc9ff` glow at blur 4, spread 4. **Not implemented — see below** |
| Selected | radial `Glass Tab/bg-gradient-01` 10% → `02` 5%, a 1.5px gradient stroke, a 40 background blur and a `#1f2531` drop shadow |

### The pill slides, and its position is measured

Figma draws three still frames and says nothing about how one becomes another. **The selected pill slides**
between tabs rather than appearing on the new one: one element moving reads as a thing being moved, where two
crossfading reads as two different things. It animates `transform` and `width`, and the label above it never
moves.

The position comes from the **active tab's own measured offset and width**, not from an assumption that the
tabs are equal. That is the case a CSS-only pill gets wrong, and it is why there is JavaScript here at all:
it holds with labels of any length, with `grow` on or off, after a resize, and after a late-loading font.

The active tab is read from the **DOM** rather than a prop — `Tabs` is uncontrolled as often as not, so the
value lives inside Mantine and the wrapper never re-renders when it changes. Mantine marks the active tab
`data-active`, so a `MutationObserver` on that attribute is the one signal that works either way.

`inverted` is deliberately **not** defaulted in the theme any more; the component owns it, because the answer
depends on the variant. The underline bar wants it — Figma draws that rule on the top edge — and the pill
menu has no rule to invert. One source of truth beats a default one variant has to undo.

### Tabs, not a radio group

Both variants render `role="tablist"` with `role="tab"` children and `role="tabpanel"` sections, and move the
selection with the arrow keys — the semantics for **swapping panels**. Pick by what the control does, not by
which mockup it came from.

## Hero

From the Figma `Hero` set (node `19110:9503`) and the accompanying spreadsheet, which lists the content
slots: image, label, header, description, button(s), link, input-with-button, Gartner logo and tags, and
video.

```tsx
import bubble from './assets/bubbles/bubble_corner.webm'

<Hero
  background="corner"
  video={bubble}
  label={<Label size="sm" variant="outline">Platform</Label>}
  title={<h1>One platform, every channel</h1>}
  description="Build once and deliver everywhere."
  actions={<Button rightSection={<IconArrowRight />}>Book a demo</Button>}
  media={<img src={shot} alt="" />}
/>
```

| Source | Prop |
| --- | --- |
| `Type` — Default / Minimal / Corner Bubble / Full Bubble / Form | `background`, and the slots each cell fills |
| `Alignnemt` — Left only | `align`, which still supports `center` — see below |
| `Image` — Yes / No | the `media` slot |
| A band above both columns | the `banner` slot |
| `Size` — Desktop / Mobile | **responsive**, a media query at 1200px |
| `Theme` — Dark / Light | the colour scheme, not a prop |
| Label / Header / Description / Button(s) / Link | `label`, `title`, `description`, `actions` |
| Input with button | `form` |
| Gartner logo and tags | `proof` |

Measurements from the component: 80px padding, a 40px gap between rows, 80px between the content and
the media, and 24px inside the content stack. The content and media columns are 600px each in the drawn
1440 frame, i.e. equal halves of the 1280 inner width; below 1200px they stop being columns.

`Type=Form` and `Type=Guide` are **compositions, not chrome** — a hero with a form instead of buttons,
and a hero with no media — so they are stories rather than props, the same way the Card's five types are.

`banner` is the one slot with no cell on the set. Every other slot lives inside the left column; the Home
page (node `24563:52720`) puts a 1000px solution finder across the top of the hero, above the heading and
spanning both columns, and there was nowhere to hang it. It renders as a full-width band inside the hero's
own gutters — 40px above it, 64px below — and it is the hero's first child in the reading order, so what
goes in it should introduce the page rather than trail it.

The heading element is the caller's: `title` takes whatever node you pass and only styles it. A hero
cannot know whether it holds the page's `h1`.

### The bubble is a gradient with a video on top

That order is the point. The gradient is built from `Brand/Primary/Primary` and `Accent/Product Accent`
— the colours the animation is made of — so it needs no network, survives a blocked or slow file, and is
what shows when the video is not playing. The webm then blends over it.

**The ground comes off with a blend, not with a fade.** `screen` on the dark canvas and `multiply` on
the light one, on the bubble *layer* rather than on the video: `.heroBubble` is `z-index: -1`, which
makes it a stacking context, so a blend on the video inside it composites against that empty layer and
does nothing at all. On the layer the backdrop is the hero's own `background-color` — a negative
z-index child paints after its parent's background and before its content — which is the surface the
ground has to disappear into. `.hero` is `isolation: isolate`, so the blend stops there.

Both grounds are **pure**: sampled at any corner, the dark export is exactly `#000` and the light one
exactly `#fff`, which is what `screen` and `multiply` remove completely.

This is the second time the blends have been here. They were taken out once, on the reasoning that
`screen` over a rectangle of near-black leaves a rectangle no gradient-shaped mask can answer — and
that was true, but the rectangle was the problem, not the blend. Now that the geometry is measured to
the artwork and anchors its cuts past the hero's edges, there is no rectangle for the blend to expose.

**Which is why the fades are almost gone.** There used to be two, intersected, starting a third of the
way into the artwork: one down the box and one across it, every edge of the frame having to reach
nothing. That is what dimmed the bubble — the drawing never played at full strength anywhere. There are
no side fades now and nothing vertical inside the hero. What is left is one fade for the **overhang**:
below the hero's foot there is no surface to blend into, so the ground reappears — a white band across
the next section on the light canvas — and the fade starts at the foot and is at nothing by the
artwork's own bottom edge. Its stops are that arithmetic and nothing else: the hero's height as a
fraction of the video box, then the artwork's bottom as another.

Each file still carries its own ground, so neither can go on the other's page — the blend that drops
black is not the one that drops white. Hence two props rather than one.

**The video is not bundled.** The four files live in `assets/bubbles/` — 0.7MB to 2.0MB — and a
component library has no business putting that inside anyone's JavaScript, so `video` takes a URL. The
stories import them through the bundler; an app can equally serve them from a public directory.

**It does not play in three cases**, each for its own reason:

- `prefers-reduced-motion` — the video is not rendered at all, so it is never even fetched. An
  autoplaying 2MB loop is precisely what that preference is about.
- `background="none"` — there is no bubble to animate.
- **No file for the canvas in play** — the gradient stands in, built from the same tokens.

### Each canvas has its own export

Figma names the dark one `Dark Bubble Animation`, and that is what it is: a bright sphere on near-black.
`videoLight` is its inverse, a coloured sphere on white. The hero picks by the computed colour scheme and
remounts on a flip — a `src` swap alone leaves the old frames on screen. Pass only `video` and the light
canvas falls back to the gradient.

| `background` | dark | light |
| --- | --- | --- |
| `full` | `bubble_center.webm` | `bubble_center_light.webm` |
| `corner` | `bubble_corner.webm` | `bubble_corner_light.webm` |

### Sized to the artwork, not to the frame

All four files are 1200x866, and in none of them does the artwork fill that. The frames are what the
export cut, and the cuts are what used to show:

| | artwork inside the 1200x866 frame | the cut |
| --- | --- | --- |
| centre | full width, **y 142 to 680** | hard at the top, a fade at the bottom |
| corner | **1035x630** at the top left | hard at the right and the bottom |

So the CSS measures the artwork and lets the frame fall where it must.

**`full`** is pinned by the artwork's top, not the frame's. 142 of the 866 rows are empty ground above
the drawing, so pinning the frame to `top: 0` started the bubble a sixth of the way down the hero — the
file was flush and the drawing inside it was not. The frame is hung above the hero by exactly that ground
(`top: -26.35%`) and sized so what is below it fills the hero (`height: 160.7%`). The artwork's top cut
lands on the hero's own top edge, which is where the design runs it up behind the header.

It is stretched to get there (`object-fit: fill`), which is fine here and nowhere else: an abstract
gradient has no figure, no text and no circle anyone can check against.

**`corner`** is pinned by the artwork's **right** cut, which is where the design bleeds it off the page.
It is laid out at the width Figma draws it — 1105 of the 1440 frame, i.e. 76.7%, so `width: 88.9%` of the
frame puts that much artwork on screen — with its own aspect kept rather than stretched, and shifted 3%
further right so the cut itself lands past the hero's edge instead of on it. The vertical fade then ends
at the bottom cut, 71.9% down the frame, so the one cut still on screen arrives at zero alpha rather than
as a line.

Before that it was the whole frame stretched to `100% x 180%`, which put both cuts *inside* the hero: a
straight bright edge down the middle of the page and a second one below the copy.

The hero does not clip (`overflow: visible`), so nothing that overhangs is cut; the mask dissolves it
instead. The bubble is `z-index: -1` and `pointer-events: none`, so what it overhangs it neither covers
nor catches.

It briefly started a bar's height *above* the hero, to run up behind the header. That bought nothing:
the header band is a 60%-alpha wash, so what sat behind it came out dimmed and the wash's own foot read
as the very line the offset was meant to remove. Top edge to top edge, fully opaque there, no top fade.

**A file, not only a URL.** `video` and `videoPoster` each take a `File` as readily as a string, so a
builder can hand over what someone just picked from disk without hosting it first to get a URL back.
The hero makes the object URL and revokes it when the file changes or the hero unmounts — without that
every re-pick leaks the last one, and a video is not a small thing to leak. A file input hands you a
list rather than a file, so a list is accepted too and the first entry taken. Whether a source moves is
read from a file's MIME type rather than its extension, because an object URL has no extension to read.

**The poster may move.** `videoPoster` takes a video as readily as an image, which matters where the
animation is the heavy file and the poster is a light loop of the same artwork: the hero moves from the
first frame rather than sitting still until the download lands. HTML's own `poster` attribute takes an
image and nothing else, so a motion poster is rendered as a second video behind the animation and
swapped on `canplay`. Both keep playing while they wait — a paused stand-in shows as a frozen frame the
moment it is revealed — and a `display: none` video is not reliably allowed to autoplay, so the one not
being shown is faded rather than hidden. If the animation 404s the poster simply stays: the animation is
the enhancement, the poster is the page.

## Header and MegaMenu

From the desktop navigation prototype (`liferay-nav-desktop_12.html`) rather than a Figma component
set: a fixed band over the page, an inset panel that drops out of it, and a staggered reveal of the
columns inside.

### The set has drifted, and two things came out of it

Found by `pnpm figma:drift` (see below), then confirmed against the set:

**`Type=Guide` was renamed to `Minimal`, not deleted.** Its placeholder still reads *"This Is An Example
Of A Guide Title"*. It also draws a corner bubble, which the old `Guide: 'none'` mapping did not
reflect — so the mapping was both naming a dead cell *and* describing it wrongly. Now `Minimal:
'corner'`.

**`Alignnemt` has lost `Center`.** Every cell in the set is `Left`. `align="center"` is therefore a
capability the design does not currently exercise. It is kept — it works, a centred hero is a common
shape, and removing it would break callers to satisfy an axis that may well come back — but Code
Connect no longer offers it, because a snippet should only produce something a designer can select.

### It condenses on scroll

**At the top of the page the band is nothing** — no fill, no blur, no hairline, no shadow — so it sits
on the hero and reads as part of it, which is what the file draws: the nav lives *inside* the
`Left Hero` frame, over the bubble. Past 24px of scroll the glass arrives and the bar tightens from 64
to 56.

This corrected a real problem rather than adding polish. The band used to carry the blur, the hairline
**and** a 30px drop shadow at all times, so a header at the top of an unscrolled page cast a shadow
separating itself from content that had not arrived yet.

| | |
| --- | --- |
| `condense` | On by default. Only meaningful with `position="fixed"` — a static header scrolls away, so there is nothing to condense. |
| An open menu | Takes the glass whatever the scroll position. Without that the bar is transparent while a panel hangs off it, and the two read as unrelated things rather than one surface. |
| `prefers-reduced-motion` | The state still changes and simply arrives immediately. The separation is the point; the fade is not. |

It reads `window.scrollY` behind a `requestAnimationFrame` guard rather than watching a sentinel with
an `IntersectionObserver`, because the sentinel would have to live outside the header in page markup
this component does not own. One boolean flip near the top of the page is cheap, and the guard means a
fast scroll cannot queue more than one read per frame.

```tsx
import { Button, Header, MegaMenu } from 'liferay-sites-design-system'

<Header
  logo={<Logo />}
  actions={<Button size="sm">Contact Sales</Button>}
  items={[
    {
      value: 'platform',
      label: 'Platform',
      menu: (
        <MegaMenu>
          <MegaMenu.Body>
            <MegaMenu.Columns>
              <MegaMenu.Column heading="Digital Experience">
                <MegaMenu.Item href="/platform" icon={<IconGlassComposable size={20} />}
                  title="Platform Overview" description="Explore the complete platform." />
              </MegaMenu.Column>
            </MegaMenu.Columns>
            <MegaMenu.Featured heading="Featured">…</MegaMenu.Featured>
          </MegaMenu.Body>
          <MegaMenu.Cta
            label="Ready to Evaluate?"
            action={{ label: 'See subscription options', href: '/subscriptions' }}
          >
            <Button variant="outline" size="sm">See subscription options</Button>
          </MegaMenu.Cta>
        </MegaMenu>
      ),
    },
  ]}
/>
```

**The CTA strip is the one place the panel needs a mobile variant.** `MegaMenu.Cta` takes both a
`children` action and an `action` prop, and the breakpoint chooses: the wide panel ends in the button,
the drawer renders the link. On a phone the two stack, and stacked, a bordered button reads as the end
of the drawer rather than as one more way on — so the file draws a link there. The prompt goes small
caps with it, matching `.megaHeading` and every column heading in the menu, which were already 14/600
at 0.06em uppercase while this one sat at paragraph size.

Both are in the markup and `display: none` does the choosing, so whichever is off screen is out of the
accessibility tree too — there is never a second copy for a screen reader to find. The desktop strip is
unchanged.

Every colour and measurement in the prototype's stylesheet is one of this library's tokens, so they are
bound rather than copied: `Surfaces/Text/Primary` for the labels, `Action/Link/Active Link` for the open
section and its underline, `Components/Glass Line/*` for the hairlines, `Neutral/03` for the rail
divider, `Brand/Primary` for the button. The band is 64px with the inner content capped at 1280px, the
panel has 20px bottom corners and a 1px hairline with no top edge, and the columns auto-fit at 190px.

`MegaMenu` is composed, not configured — `Body`, `Columns`, `Column`, `Tile`, `Item`, `Featured`,
`FeaturedCard`, `More` and `Cta`. The prototype has three layouts (columns with headings, columns under
tiles, columns beside a featured rail) and they are compositions of that same handful of parts, so one
component covers all of them and a fourth layout needs no code.

### How it behaves, and why

- **Click to open, not hover.** The prototype is click-driven and this keeps it: a hover menu is
  unusable on touch, punishing for anyone with a tremor, and meaningless to a screen reader with no
  pointer. Clicking the open section closes it.
- **It is a disclosure, not a menubar.** Each section is a `<button aria-expanded aria-controls>` over a
  labelled region of ordinary links. `role="menu"` is for application menus and would seize the arrow
  keys; in a panel of links Tab is what people expect. Escape closes and returns focus to the trigger,
  and a pointer-down outside the header closes it.
- **The rows are real links.** The prototype uses `div role="link"` with `tabindex`, which cannot be
  opened in a new tab, activated with Enter, or copied as a URL. `MegaMenu.Item` is an `<a>`.
- **Closed panels stay mounted but `hidden`**, so their height can animate and nothing lands in the tab
  order while closed.
- **Below 1200px the bar becomes a stacked panel.** The prototype is desktop-only and says so; the same
  `items` feed a burger and a full-width panel where each section expands in place. It runs on the same
  open state as the desktop menus, so there is one state machine rather than two, and the menu content
  needs no mobile variant — the column grid and the featured rail collapse on their own.

Motion follows the prototype: the panel animates `max-height` over 280ms, then the columns arrive at
20ms intervals behind it. `prefers-reduced-motion` keeps the open and close but drops the slide and the
stagger.

### Two things the prototype could not be copied on

- **Its hover fills are white literals** — `rgba(255,255,255,.06)` and friends. White at 6% over the
  light page background is invisible, the same failure the `neutral` button and the Link's `secondary`
  style had. They are mixed from `Surfaces/Text/Primary` instead, which is dark on light and light on
  dark, so one declaration covers both modes.
- **Its glass is a literal too** — `rgba(7,11,19,.6)`, the page background at 60%. No token expresses a
  token-with-alpha, so the band and the panel are composed with `color-mix()` from
  `Surfaces/Page BG base/Default`. If the design file ever publishes the glass surfaces as their own
  variables, these become plain token references.

## Logo

The Liferay lockup, built from the supplied `Liferay Logo.svg` (152×48). The `Home` template uses it twice
— the header at the top of the hero, and the footer's brand block.

```tsx
<Logo />                          // mark + wordmark, 48px tall
<Logo height={32} />              // in a header bar
<Logo variant="mark" height={24} />
<Logo title="" />                 // decorative, beside a visible name
```

| Prop | |
| --- | --- |
| `variant` — `full` / `mark` | the lockup, or the glyph alone |
| `height` | the rendered height; width follows the artwork's ratio |
| `title` | the accessible name, `Liferay` by default; `''` when decorative |

It is pinned by **height**, not width — that is what makes it sit level with the text beside it.

### The wordmark follows `currentColor`, the mark does not

The source file hardcodes the wordmark to `#F0F1F5`, a near-white that only works on a dark ground and
would have been **invisible on a light page** — the same trap several tokens in this library already fall
into, because the components are only ever drawn on the dark canvas. Here it is `currentColor`, so it takes
`Surfaces/Text/Primary` on a page and the pinned inverted white on the footer's band.

The **mark keeps its `#0B5FFF`**. That is `Brand/Primary/Primary`, and a brand mark is the one thing on a
page that should *not* change with the colour scheme — it is the same blue on every surface, which is what
makes it recognisable. It is a literal rather than a token for exactly that reason: it must not be re-themed.

### Two gaps

**There is no Figma component behind it, so it has no Code Connect mapping** — the only component here
without one. The Solutions Library file has no logo set; a library search turns up `Liferay` in *Customer
Logos* and `Logo / Desktop / Default` in *liferay-marketing*, both in other files. Mapping across file keys
is a decision rather than a detail, so it is not guessed at here.

**There is no inverse lockup.** On a brand-blue ground the mark is the same blue and disappears into it,
leaving only the wordmark — see the `On surfaces` story, which shows it rather than hiding it. A logo that
has to sit on the brand colour needs a single-colour version, and the supplied artwork does not include one.

## Fields — TextInput, Textarea, Select, LanguagePicker

From the Figma `Input` set (node `16166:23969`), laid out in the `input` section `24397:77217`, with the
menu from `Dropdown` (`16884:46299`), the compact slot from `Country Selector` (`17205:21114`) and the
pill from `Info Button` (`16032:242555`).

One Figma set covers all of it — 36 variants over four axes — and it lands as **three components and
two states** rather than one component with a `type` prop:

| Figma axis | Where it goes |
| --- | --- |
| `Type` — Text / Text Area / Dropdown | `TextInput` / `Textarea` / `Select` |
| `Condensed` — True / False | `floating` — the label inside the box, or above it |
| `State` — Default / Active / Disabled | `:focus-within`, and `disabled` |
| `Filled` — False / True | whether the field has a value |

A text field, a multi-line field and a select are three different elements with three different
semantics and three different keyboard behaviours, so they are three components. `State` and `Filled`
are not props at all — they are what the field is doing.

The booleans become props and slots: `Label` → `label`, `Required` → `required`, `Help Text` →
`description`, `Info Button` → `info`, `Icon Left` / `Icon Right` → `leftSection` / `rightSection`,
`Country Selector` → a `LanguagePicker` in the left section.

Measurements, from the component: a 48px box with an 8px corner (`Border Radius/medium`), 12/16
padding, no fill, and a **1px gradient border** — `Neutral/04` into `Neutral/05` at rest, and
`Action/Primary/Active` into `Accent/Product Accent` on focus, the same accent gradient the card ring
and the tab indicator use. The label above is 16/24 SemiBold `Surfaces/Text/Primary`, the required
asterisk 13/16 `Status/Error/Error`, the help text 13/16 `Surfaces/Text/Secondary`, and the value
`Neutral/10`.

An `<input>` cannot carry a pseudo-element and no `border-color` can be a gradient, so the border is
painted on the wrapper — the one element that is exactly the size of the box and can have children.

### The floating label

The label starts inside the box at 18px Regular and floats **clear of it** — above the field, at 14px
SemiBold — once the field has focus or a value. That is Mantine's own floating-label pattern rather than
Figma's `Condensed=True` cell, which keeps the label inside the box and only shrinks it, leaving the value
and its label sharing 48px. Floating out gives the value the whole field. The room above is reserved by
the root's padding, so nothing above the field is overlapped and nothing is clipped.

It is a label, not a placeholder: it stays visible after typing, which is the whole point — a
placeholder-as-label disappears exactly when the user needs to check what they are filling in. Do not
pair `floating` with a `placeholder` that says the same thing.

Mantine renders the label as a *sibling* of the input's wrapper, so the float is driven from the root
with `:focus-within` and `:has()` — a sibling selector cannot reach backwards from the input to its
label.

**`Select` takes `floating` too.** Every field in the `Form` set is `Condensed=True`, dropdowns included, so
a form built from the file needs both or it looks misaligned — floating labels on the text fields and
stacked labels on the selects. Verified in both states: empty, the label sits inside at 18px Regular,
identical to a text field's; with an option chosen it is at 14px SemiBold on the border, `translateY(-32px)`.

It needs no extra wiring because the mechanism is `:placeholder-shown`, which a select stops matching the
moment an option is picked — so it also drops back on its own when a `clearable` select is cleared, and it
floats while someone types in a `searchable` one.

### The info tooltip

Figma's `Info Button` is a `Status/Info` pill beside the label. Here it is a tooltip **trigger**: a real
`<button>`, so it is in the tab order, and Mantine's `Tooltip` opens it on focus as well as hover and
wires up `aria-describedby`. A tooltip hung on something unfocusable does not exist for a keyboard.

Anything the user always needs belongs in `description` instead. A tooltip hides its content behind an
interaction, which is the wrong place for a format requirement or a legal note.

### Two things Figma leaves out

- **The disabled state is drawn identically to Default** — same border, same text colours — so a
  disabled field would be indistinguishable from one you can type in. It follows the rest of the
  library: the resting appearance at half opacity, plus `cursor: not-allowed`.
- **There is no error state.** `Status/Error/Error` appears only on the required asterisk. The error
  message reuses that colour at the description's size, and the field's own border takes it too, so the
  problem is visible on the field and not only in the text beneath it.

### The placeholder is dimmer than Figma draws it

Figma binds the placeholder to `Surfaces/Text/Primary` — the same colour as a real value, which makes
an empty field look filled. It uses `Surfaces/Text/Tertiary` here: still AA (4.8:1 on light, higher on
dark) but visibly provisional. One token swap to take back to the design file.

### What the dropdown covers

The `Dropdown` set has five cells. Three are covered, because they are the three a select does:

| Figma `Variant` | How |
| --- | --- |
| Simple | `data` as a flat list |
| Groups | `data` as `{ group, items }` |
| Search | `searchable` |

`Drilldown` and `Slot` are deliberately out of scope: nested menus and arbitrary content are not select
behaviours and need `Menu` or a `Popover` underneath. Approximating them with a `Select` would give the
wrong keyboard model, which is the part of a combobox that matters.

### The language picker has no flags

Figma's `Country Selector` draws a flag beside the code, from a `Flags` component set that belongs to
neither icon pipeline — not the MingCute glyphs, not the illustrative set. Rather than invent flag
artwork, each option takes an optional `flag` node and the code stands alone without one. Export that
set, or pass emoji, and the slot is complete.

`LanguagePicker` is a real combobox rather than a styled button, so it keeps the keyboard behaviour, and
because it sits inside another field it carries its own `aria-label` — defaulting to "Language" — which
the host field's label does not provide.

### Input with a contained button

Not in Figma. Composed from the parts that are: the drawn field, and this library's `Button` at
`size="sm"` — 40px, which leaves 4px of air inside the 48px box — inset against the right border, with
the field giving up its right padding. Marked as inferred in `components.module.css`.

A single-field form still needs a `<form>` and a real submit button, so `containedButton` takes a
button rather than drawing one: Enter in the field and a click on the button do the same thing.

## Image

The ratios from the Figma `Aspect Ratio` set (node `12305:1754909`) on Mantine's `Image`.

```tsx
<Image src={shot} alt="The dashboard, showing six live campaigns" ratio="3:2" radius="md" />
<Image src={portrait} alt="" ratio="3:2" orientation="vertical" fit="contain" />
<Image src={cover} alt="" fill />
```

| Figma | Prop |
| --- | --- |
| `Ratio` — 1:1, 3:2, 4:3, 16:10, 16:9, 2:1, 5:2, 3:1, 40:33 | `ratio` |
| `Ratio=Adjustable` | `ratio="auto"` — no ratio, the image keeps its own |
| `Orientation` — Horizontal / Vertical | `orientation`, which inverts the ratio |

Measured in the browser, every ratio lands on its name: 1:1 at 1.000, 3:2 at 1.500, 4:3 at 1.333,
16:10 at 1.600, 16:9 at 1.778, 2:1 at 2.000, 5:2 at 2.500, 3:1 at 3.000, 40:33 at 1.212.

`fit` is the five `object-fit` values. **`cover`** is the default and crops the overflow, which is right
for photography and wrong for anything whose edges matter; `contain` fits the whole image and leaves
space; `fill` stretches it and distorts it, which is almost never wanted but is occasionally what a
design asks for; `none` and `scale-down` behave as the CSS values do.

**`fill`** is a different thing from `fit="fill"`, and the names are unavoidably close: it makes the
image cover its nearest positioned ancestor — `position: absolute` on all four edges — for an image
behind content. `ratio` is ignored in that mode, because the parent already decides the box. The parent
needs `position: relative` and a size of its own; without a positioned parent the image will fill the
page.

The ratio is `aspect-ratio` on the image element itself rather than on a wrapper. One element means the
image takes part in its parent's layout directly, which is what lets `Card.Image` bleed to a card's edge
and a grid cell size itself from the ratio.

### `alt` is required

It has a type but no default. `alt=""` is a valid and often correct answer — a photograph beside text
that already says what it shows — but it has to be said out loud. An image component that lets you forget
the alt text produces a codebase without any, and that is a decision worth making once, in the type,
rather than in every review.

## Accordion

Figma `Accordion` component set (node `17019:127517`) — four cells across `Expand` × `Size` — on
Mantine's `Accordion`. Two sizes, the divider that separates every row, and the arrow that flips when a
row opens.

| Figma | Prop |
| --- | --- |
| `Size=Default` | `size="lg"` |
| `Size=Condensed` | `size="sm"` |
| `Expand` — Closed / Expanded | `value` / `defaultValue`, or the user clicking |
| `Header` text | `<Accordion.Control>` children |
| The header's `UI Icon` | a chevron rather than Figma's arrow — see below |
| `divider` `Property 1=normal` | the closed row's rule — 1px `Neutral/03`, see the gaps list |
| `divider` `Property 1=gradient` | the open row's rule — `Neutral/06` → `Brand/Primary/Lighten/3` |
| The panel's placeholder frame | `<Accordion.Panel>` children |

```tsx
<Accordion size="lg" defaultValue="hosting">
  <Accordion.Item value="hosting">
    <Accordion.Control>Where is my data hosted?</Accordion.Control>
    <Accordion.Panel>In the region you choose, on infrastructure we operate.</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### The two sizes, measured

Both were read back out of the browser rather than transcribed:

| | `size="lg"` (Default) | `size="sm"` (Condensed) |
| --- | --- | --- |
| Row height | **56px** | **40px** |
| `padding-block` | 12px | 8px |
| Label | 21px / 26px, semibold | 18px / 23px, semibold |
| Arrow box | 32px | 24px |
| Gap | 16px | 16px |
| Panel `padding-block` | 16px | 12px — inferred, see below |

The row height comes from the **arrow, not the text**: 32 + 24 = 56 and 24 + 16 = 40. Sizing the box
from the label alone gives 50px and 39px, neither of which is what Figma draws.

Figma gives the header no horizontal padding, so the rule and the text share an edge; that is kept.

### A chevron, not an arrow

Figma's header draws `UI Icon Name=arrow/arrow_down` — a full arrow with a shaft. This uses `arrow/down`,
the chevron.

An arrow means **go**: it is what the `Link` and the `Button` in this same library use, on things that
navigate. A chevron means **there is more of this here**, which is what a disclosure does. Sharing one glyph
between the two makes an accordion look like it will take you somewhere. The `UI Icon` set has both, so this
is a swap the file can adopt rather than an invention.

### The rule is the state

Figma's only difference between a closed row and an open one — besides the panel — is the divider under
the header: flat `Neutral/02` when closed, a `Neutral/06` → `Brand/Primary/Lighten/3` gradient when open.

It is drawn as **two stacked pseudo-elements on one line** rather than a border: the flat rule always
present, the gradient over it at `opacity: 0`. A gradient cannot be a `border-color`, and crossfading one
layer's opacity runs on the compositor where animating a border repaints. The same reason the Tabs
indicator and the Label's outline ring are built this way.

Hover brings that gradient **half way up** — a row previewing what clicking it will do. Inferred; Figma
draws no hover.

The rule has to live on either the control or the heading wrapper `order` adds, since that wrapper
becomes the control's parent, so both selectors carry it. Verified with `order={3}`: the line moves to
the `<h3>` and the row is still 56px.

### States

Figma draws two cells, so everything between them is inferred from the same motion tokens the rest of
the library uses. Contrast measured in the browser against the page surface in both modes:

| State | Treatment | Dark | Light |
| --- | --- | --- | --- |
| Rest | label `Surfaces/Text/Primary` | 17.45:1 | 13.66:1 |
| Hover | label + arrow `Action/Link/Hover Link`; a soft disc grows in behind the arrow; the gradient rule rises to 50% | 12.92:1 | 8.74:1 |
| Press | the arrow moves 1px in the direction it is about to travel — down while closed, back up while open | — | — |
| Focus | `Styles/focus-ring`, 2px `Brand/Primary/Lighten/1`, inset | 5.15:1 | 3.73:1 |
| Disabled | half opacity, `not-allowed`, skipped by the arrow keys | — | — |
| Open | gradient rule at full strength, arrow rotated 180° | — | — |
| Panel text | `Surfaces/Text/Secondary` at 18/24 | 13.51:1 | 10.49:1 |

The disc is the full arrow box — 32px or 24px — not a smaller shape inside it, so the affordance and the
target are the same thing.

### The panel's rise is an animation, not a transition

The content lifts 4px into place 40ms behind the height. That is a **keyframe animation**, deliberately:
Mantine keeps a closed panel mounted and hides it with React's `Activity`, which is `display: none`, and
a transition out of `display: none` has no starting value to run from. Written first as a transition and
measured — five samples across 240ms all read `transform: none`, i.e. it animated nothing — then changed.
An animation runs on reveal, and the rebuilt version was caught mid-flight at `translateY(-4px)`.

The fade is Mantine's: `Collapse` writes an inline `opacity` transition alongside the height, so it is
not duplicated.

`transitionDuration` is 240ms rather than Mantine's 200. The row height is the largest thing that moves
in this library and 200ms reads as a snap. It is a number rather than a token because Mantine hands the
value to `Collapse` in JavaScript. `respectReducedMotion` is on, so it drops to 0ms for anyone who has
asked for less motion, and the rise and the press are dropped in CSS alongside it.

### It is a disclosure, and `order` is worth passing

The control is a `<button aria-expanded aria-controls>` and the panel a `role="region"` labelled by it,
with the arrow keys moving between rows and disabled rows skipped — verified.

`order` wraps each control in a real heading, which is how a screen reader navigates a page of these by
heading instead of tabbing every row. There is **no default**: only the page knows whether these sit
under an `h2`. The heading contributes semantics only — `font: inherit` keeps the label's own type, which
is what Figma draws.

`multiple` lets rows stand open together. Figma shows one at a time and that is the default: it keeps the
page from growing under someone who is still reading it.

### One thing that could not be verified here

Hover, press and focus were **not exercised in the browser**. The in-app pane's synthetic hover sets the
`:hover` flag — `element.matches(':hover')` returns true — but does not recalculate style from it: a
freshly injected `.control:hover .label { color: … }` rule had no effect on the computed colour either,
so the failure is the environment, not the CSS. What was verified instead: every hover, press and focus
selector matches its intended element with the pseudo-class stripped, and every colour they set was
measured for contrast in both modes (the table above). Worth a real pointer before release.

## GradientText

A phrase inside a heading, filled with `Brand/Primary/Lighten 1` -> `Accent/Product Accent` and clipped
to the text. `Homepage Redesign` uses it in six places: the hero's `Convert, Scale and Grow`, and one
phrase in each of five section headings.

| Heading | The phrase in the gradient |
| --- | --- |
| `1,200+ Enterprises Move the Needle With Liferay` | `1,200+ Enterprises` |
| `Different Teams. One Platform.` | `One Platform.` |
| `Designed for Your Industry. Built for Growth.` | `Built for Growth.` |
| `Everything You Need in One Platform` | `One Platform` |
| `Extend Your platform. Integrate without limits.` | `Integrate without limits.` |

**The phrase is not always the tail** — the carousel's is the first two words of its heading — so this
wraps a phrase wherever it falls rather than appending one after the title. `highlightPhrase(title,
phrase, animate)` does the same for a heading that arrives as data: it matches the phrase verbatim and
once, and returns the title unchanged if it is not found, because a heading gets edited and a page that
loses its gradient over a fixed typo is a far better failure than one that does not render.

### The sweep is opt-in, and the hero does not take it

`animate` runs the gradient along the phrase, continuously. The five section headings use it; the hero
does not. A heading that shimmers to itself while the reader is on the first sentence of the page is the
animation with the weakest claim on their attention and the strongest pull on it — and the file draws
the hero's fill as static. Further down, where a heading has to catch an eye travelling past it, the
same movement is doing a job.

**The colour does not move; a highlight moves over it.** The first version slid a three-stop
`brand -> accent -> brand` gradient across the phrase, which meant the words themselves changed colour
every three seconds — `One` and `Platform.` trading blue for violet and back, on a loop, in the reader's
peripheral vision. That is what read as mechanical: not the speed, but the fact that the phrase kept
becoming a different phrase.

So the fill underneath is the same static two stops it has at rest, and a second background layer rides
over it — a soft band of light, transparent at both ends, and the only thing whose position animates.
Both layers are clipped to the text. What travels is a highlight, which is what catching the light
actually looks like: the object keeps its colour and the light moves across it.

**It rests.** The pass takes the first 55% of a 9s cycle and the rest is a hold, so a highlight crosses
in about five seconds and then nothing happens for four. A highlight that runs continuously is a
metronome; one that comes round occasionally is weather. `ease-in-out`, because light crossing a surface
arrives and leaves rather than starting at full speed, and the band is set at 100deg rather than 90 so it
crosses the letterforms on a slight diagonal instead of brightening one flat column.

The sheen is **white on the dark canvas and blue on the light one**. Lightening blue-to-violet text on a
near-white page pushes it toward its own background exactly where it is meant to catch the eye; the light
mode sheen saturates instead. Measured through a pass, the light-mode phrase holds 5.17:1 -> 5.03:1
against the page.

Under `prefers-reduced-motion` the highlight is parked off the end and the fill stays: the colour is what
the heading says.

## Carousel

The `card carousel` section (node `24465:66866`) and the Figma `Carousel` control set (node
`20440:16714`) under it.

| Figma | Prop |
| --- | --- |
| `List` — 310px cards, clipped | `slideSize` |
| `List` — 13px gap | `gap`, **defaulting to 20** — see below |
| `Overlay` — the edge fade | `fade`, `fadeWidth` |
| `Carousel` `Type=arrows` — two 44×40 outline buttons | `arrows` |
| `Carousel` `Type=arrows` — the 12px dot row between them | `indicators="dots"` |
| `Carousel` `Type=lines` — 24px bars, 64px when active | `indicators="lines"` |
| `Section Title` above the list | `header` |
| `List` `padding-inline` 80 | `gutter`, default 0 |

```tsx
<Carousel label="Customer stories" indicators="dots">
  <Card>…</Card>
  <Card>…</Card>
</Carousel>
```

Each child becomes a slide — cards go in directly, with no wrapper component to remember. That is what
lets the slide carry its own `role="group"`, `aria-roledescription="slide"` and "3 of 7" label without
anybody having to pass them.

### The gap is 20, not Figma's 13

A deviation. 13 is on no step of the spacing scale, and it reads as tight once the slides carry a
photograph rather than a swatch — two thumbnails a thumb's width apart start to read as one strip
rather than as separate cards. 20 is the step above it on the scale, and it is what the customer
stories row is drawn with. `gap={13}` gets the file's number back.

### It scrolls; it does not animate — but the arrows do

The track is a **scroll container with CSS scroll snapping**, not a transformed strip. The alternative
was `@mantine/carousel`, which brings `embla-carousel-react` into a library whose only dependencies are
`@mantine/core` and `@mantine/hooks`.

Snapping gets touch and trackpad momentum, overscroll, keyboard scrolling, `scroll-behavior` that
respects `prefers-reduced-motion`, and the browser's own scroll-into-view when something inside a slide
takes focus — all native, none of it re-implemented. What it does not get is **mouse drag, autoplay or an
infinite loop**. If any of those three is wanted, this is the component to swap for `@mantine/carousel`;
nothing else in the library would change.

The arrows and indicators are the only JavaScript here, and the **travel they cause is animated by the
component**, not by the browser. `scrollTo({ behavior: 'smooth' })` was one line and left the duration
and the curve to the engine: the same press takes a different time and carries a different weight in
each browser, and none of them uses the easing the rest of this library moves on. A card row is the
largest thing on a page that moves when something is clicked, which makes it the worst place to leave
that unspecified. It is a `requestAnimationFrame` tween over `--sds-motion-slow` on the same
decelerating curve as everything else, writing `scrollLeft` directly — which is also why the track's
`scroll-behavior` is `auto`: with `smooth` the browser would ease toward each frame of the tween and the
two would fight. A wheel, a touch or a pointer press cancels it mid-flight, and
`prefers-reduced-motion` jumps.

Two consequences worth knowing:

- The scrollbar is hidden, as Figma's clipped list has none. The arrows and indicators are the
  affordance, which is why the controls disappear only when there is genuinely nothing to scroll.
- A scroll container clips **both** axes — `overflow-y: visible` stops being possible once `overflow-x`
  is `auto` — so a card's hover lift would be sheared off at the top. The track pays for it with 12px of
  vertical padding and a matching negative margin.

### The indicators count reachable positions, not slides

Figma draws one dot per slide (`Slides=3`). That is right when one slide fills the track and wrong when
four are visible: the last three slides can never be scrolled to the left edge, so three of seven dots
could never light up.

So the indicators count **snap positions that can actually be reached**, measured from the live layout so
a resize changes it. Verified: seven 310px cards in a 1120px track give **four** dots, and the same seven
at `slideSize="82%"` give **six** — the last slide is unreachable as a start position because the track is
wider than one slide. The final position is pinned to the maximum scroll offset, so the last indicator
lands exactly at the end rather than a few pixels short; at `scrollLeft` 1128 of a 1128 maximum, the
fourth dot is active and the next arrow is disabled.

### States

| | Treatment |
| --- | --- |
| Indicator, inactive | `Neutral/06` — **restructured**, see below |
| Indicator, active | `Brand/Primary/Lighten/1` 50% → `Accent/Product Accent` 100% on the 135° diagonal, crossfaded in over the inactive colour since a solid cannot transition to a gradient |
| Indicator, hover | not drawn: the dot scales to 1.15 and the bar grows from 24px towards its active 64px, both moving to `Neutral/07` |
| Indicator, focus | `Styles/focus-ring`, offset outwards |
| Arrow, each end | `disabled` — Figma's `State=Disabled` cell, rather than wrapping around |
| Track, focus | `Styles/focus-ring`, inset |

The arrow is 44×40 with a 20px icon. Figma's cell is 44 wide with 12px of padding, which puts its 1px
stroke inside the 44; a CSS border sits outside the padding box, so 12 + 20 + 12 + 2 measures 46. 11px of
padding lands the outer box on Figma's 44 exactly.

### Accessibility

The track is `role="group" aria-roledescription="carousel"` with the required `label`; each slide is a
group announced as "slide" and numbered. The track is **focusable**, which costs one tab stop and buys
the only way a keyboard user can scroll a row of quote cards — slides with no links inside them are
otherwise an unreachable scroll region (WCAG 2.1.1).

`label` is required and has no default, for the reason `Image`'s `alt` is: a region announced as
"carousel" with no name says nothing about what someone has landed in.

## List

Figma `List` (node `19130:63824`), `Main List Item` (`19660:37508`), `Sub List Item` (`19660:53930`) and
the `Sub Item List` marker set (`19129:50376`), on Mantine's `List`.

| Figma | Prop |
| --- | --- |
| `List` `Type` — Icon / Number / Bullet | `marker="check" \| "number" \| "bullet"` |
| `Sub Item List` `Icon Type` (instance swap) | `icon`, on the list or on one item |
| `Main List Item` `Size` — Default / Medium | `size="md"` / `size="lg"` |
| `Sub Item List` `Size=Small` | `size="sm"` |
| `Main List Item` `Padding` — No / Yes | `padded` |
| `Show Header` + `Header list` | `<List.Item title="…">` |
| `Show description` + `Description` | the item's children |
| `Show Sublist` + `Sub List` | a `List` inside a `List.Item` |
| `List` gap 20, `Sub List` gap 8 | `spacing`, defaulted per level |

```tsx
<List marker="check">
  <List.Item title="Key point">Short description here</List.Item>
</List>
```

Figma's `Type=Icon` cell renders `system/check`, so `marker="check"` is that cell rather than a fourth
one; `icon` is its instance swap.

### Measured

| | `sm` | `md` (Figma `Size=Default`) | `lg` (`Size=Medium`) |
| --- | --- | --- | --- |
| Marker | 16px | 24px | 32px |
| Text starts at | 24px | 32px | 40px |
| Title | 18px / 24px, bold | same | same |

`size` moves **the marker only**. Every cell in Figma keeps its text at 18px, and the marker column plus
the 8px gap is what the content indent comes from. Item spacing 20px, title-to-description 4px, both from
the file.

The description is `Surfaces/Text/Primary` — the same colour as the title, not the Secondary a
description usually gets here. That is what the file draws, and it is left alone.

### The marker sits on the first line, whatever is around it

The marker column is **one line tall** with the glyph centred in it, overflowing above and below when the
marker is bigger than the line. Measured at all three sizes: the marker's centre and the title's centre
land on the same pixel.

Figma gets there from the other side — its `Size=Medium` cell grows the `Header list` row from 23 to 32,
so a taller marker still reads level with the title. That only holds while the title is one line, and real
titles wrap, so the marker is what gives here instead of the text's row.

### A sublist knows it is one

Figma's `Sub List` differs from the list around it in five values at once: bullets rather than checks, 8px
between items rather than 20, 2px from the marker rather than 8, a semibold title rather than bold, and no
gap between title and description. Every one of those is a value rather than a component, so a `List`
inside a `List.Item` **picks all five up on its own** — there is no `nested` prop, and passing `marker` or
`spacing` still overrides.

Two structural notes:

- The nested list is lifted out of the description and rendered as **a child of the `<li>`**, which is
  where a nested list belongs. `List.Item` therefore renders its own `<li>` rather than Mantine's, whose
  item puts every child inside a `<span>` — a `<ul>` in a `<span>` renders but is not a list in a document.
- It is then indented by the marker column plus the row gap, so it lines up with the content above it —
  verified at 32px against a content edge of 32px. That indent is a **literal per size**, not a `calc` of
  the marker and gap variables: a `calc` is inherited as an unresolved expression and would be re-resolved
  against the sublist's own gap of 2px, coming out 6px short.

### Semantics

A real `<ul>`, or `<ol>` when `marker="number"`, so a screen reader announces the count and the numbering
comes from the document. The visible number is a **CSS counter** (`counter(list-item)`) for the same
reason: it cannot disagree with the item's position, and inserting a row in the middle needs no edits.

`role="list"` is set explicitly, because Safari drops list semantics from a list styled `list-style: none`
— which is what any custom marker requires.

Every marker is `aria-hidden`, the check included. The list role already says "list" and the `<ol>` says
what number a row is; a dot announced before each line is noise. That does mean a tick carries no announced
meaning, so if it stands for something the copy does not say — "included in this plan" — the copy is the
place to say it, or pass an `icon` with a label of its own.

### No interaction states

Figma's `Main List Item` `Padding=Yes` cell sits on a `Surface` instance, and that component has
`State=Hover` cells. Nothing is wired to them: a list of key points is not a control, and the set draws no
hover for the row itself. If a row ever becomes a link, `Card` is the component that already has the ring,
the lift and the focus treatment for that.

## Marquee

The `marque` section (node `24465:67388`) and the Figma `Logos scrolling section` set (`22522:24157`): a
strip of logos that scrolls forever, faded at both edges.

| Figma | Prop |
| --- | --- |
| `Size` — Mobile / Desktop / Size3 | `size="sm" \| "md" \| "lg"` — 24 / 49 / 64px rows |
| The 109px logo cell | `logoWidth` |
| The grid's gap of 60 | `gap` |
| `Overlay` — transparent, opaque 20%–80%, transparent | `fade`, `fadeWidth` |
| `Theme` — Dark / Light | `monochrome`, and the colour scheme does the rest |
| The two duplicate strips | the loop, built from one set of children |

```tsx
<Marquee label="Customers" monochrome>
  <img src={airbus} alt="Airbus" />
  <img src={carrefour} alt="Carrefour" />
</Marquee>
```

### The loop is Figma's own construction

Figma draws the strip **twice**, side by side — `Frame 1332` and `Frame 1333`, identical — which is exactly
how a seamless marquee works. So that is what this does: one set of children rendered twice, translated by
the width of one copy plus one gap, then repeated. The second copy is `aria-hidden`, or every logo would be
announced twice.

`speed` is **pixels per second, not a duration**. The distance is measured from the live layout and the
duration falls out of it — `distance / speed` — which is what keeps a five-logo strip and a twenty-logo
strip moving at the same speed. Verified: a seven-logo row measured 1123px, so the distance came out 1183
(1123 + one 60px gap) and the duration 19.7s at 60px/s. Re-measured on resize and when the children change.

Figma puts 32px between its two copies and 60px between logos inside them. A loop needs the *same* gap in
both places or it hitches once per cycle, so the logo gap is used throughout — see the gaps list.

### Logos are fitted by width

Figma's cell is 109 × 49 with the artwork fitted **by width** and centred. That is measured, not assumed:
across the six logos the set draws, the art is 103×19, 103×33, 98×11, 103×20, 103×35 and 98×19. The widths
cluster at 98–103 and the heights fall out of each logo's own proportions.

That is how a logo row is actually balanced — a tall roundel and a long wordmark cannot share a height and
still look level — so the cell height is a **row height and a ceiling**, not a target. Verified at all
three sizes: 109px cells with logos at 109×27, 109×21, 109×23, and the 24px row clipping the tallest to 24.

`width: 100%` on the logo also gives an inline `<svg>` a size it would not otherwise have: an SVG with a
`viewBox` and no `width` has a ratio but no intrinsic dimensions, and collapses to zero as a flex item. The
first version used `max-height` and every logo measured 0×0.

### `Size=Mobile` is a container query, not a viewport one

Figma's Mobile cell becomes a breakpoint, as every other `Size=Mobile` in this library does — but on the
**container**, not the window. "The window is narrow" and "this strip is narrow" are different questions,
and a marquee in a 480px card on a wide desktop is the narrow case just as much as a phone is. Verified: the
same component at a 440px container width drops to the 24px row on a desktop viewport.

### Stopping it is a conformance requirement

**There is a pause button, on by default.** WCAG 2.2.2 asks for a mechanism to pause, stop or hide any
motion that starts automatically and runs for more than five seconds alongside other content. An endless
logo strip is the textbook case of that. Figma draws no such control, so this one is inferred — 32px, at the
trailing edge, `aria-pressed` on the effective state — and `withControl={false}` is only correct if the page
supplies its own.

Hover-to-pause is on as well, but it is **not** the mechanism: it does nothing for anyone on a keyboard or a
touch screen. Focus inside the strip pauses it too, so tabbing to a logo does not chase it across the page.

Two things that took a second pass:

- **Pausing is `animation-play-state`, not removing the animation.** The first version dropped the
  animation, which snapped the strip back to its start — that reads as a fault, not a pause. The animation
  is now attached as soon as the distance is measured and paused in place.
- **`prefers-reduced-motion` starts it paused rather than making it unplayable.** A CSS rule forcing
  `animation: none` under that preference would turn the control into a dead button for exactly the person
  most likely to reach for it. The preference suppresses autoplay; an explicit press wins.

### `Theme` is not a prop

Figma's `Dark`/`Light` cells exist because a one-colour logo needs a different ink on each canvas.
`monochrome` inks logos in `Surfaces/Text/Primary`, which inverts with the colour scheme and so covers both
cells at once — measured at 13.66:1 in light mode and 17.45:1 on dark.

It works exactly on SVG that inherits `currentColor`. A raster logo cannot take a colour from CSS, so it is
flattened instead — `brightness(0)`, inverted on the dark canvas, held at 85% — which is black and white
rather than literally the token. Noted in the component docs so nobody expects the two paths to match to
the pixel.

## Section, SectionTitle and ContentMedia — the page blocks

Figma `Section` (node `17892:146518`) and `Section Title` (`17892:146487`).

`Section`'s set has fourteen `Type` cells, and **`Type` is not a prop**. All fourteen share one skeleton —
a centred 1280 column, a `Section Title`, a body, sometimes a footer — and differ only in what goes in the
body. `Card Grid` is a Section holding a grid of `Card`s; `FAQ` is a Section
holding an `Accordion`; `Integrations Section` is a Section holding a `Marquee`. Fourteen wrappers that
forward slots would add API surface and no capability, so the fourteen live as **stories** under
`Blocks/Sections`, each one copy-pasteable.

| Figma | Prop |
| --- | --- |
| `padding` 80 at 1440, 20 at 390 | fluid, no prop |
| `card-image` `Ratio` on the media column | `mediaRatio="3:2" \| "16:9" \| "auto"` |
| The 40px block padding on `Quote` and `Highlight Text` | `spacing="tight"` |
| `padding-inline: 0` on `Integrations Section` and `Carousel` | `bleed` |
| `Section Title` | `title` |
| `Call to Action`, carousel controls | `footer` |
| `gap` 24, and 32 in the integrations section | `gap` |
| The 1280 column in a 1440 frame | `maxWidth` |
| `Size` — Default / Desktop / Mobile | **fluid**, not a prop |

```tsx
<Section title={<SectionTitle title="Customer stories" />}>
  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">…</SimpleGrid>
</Section>
```

Figma's `Page Background` instance is deliberately **not** implemented. A section that paints its own ground
fights whatever the page has already decided; three of its four cells are a flat token a caller can set in
one line, and the fourth is a gradient whose stops are not in this file. If sections do need a background
later it belongs here as one prop rather than at every call site — until then the page owns it.

### Fluid, and it passes through both of Figma's cells exactly

Figma draws each section twice — 1440 and 390 — and the obvious reading is a breakpoint. Every fluid value
here is instead a straight line through both drawn numbers:

```
value = min + (100cqi - 390px) * (max - min) / 1050     clamped to [min, max]
```

1050 is 1440 − 390. A plain percentage cannot pass through two arbitrary points: `5.56cqi` lands 80 at 1440
but **21.7** at 390, close to Figma's 20 without being it. The interpolation lands on both.

Measured, by driving the section's width directly:

| Section width | 1440 | 1200 | 900 | 768 | 390 | 320 |
| --- | --- | --- | --- | --- | --- | --- |
| Gutter | **80** | 66.3 | 49.1 | 41.6 | **20** | 20 |
| Content column | **1280** | 1067 | 802 | 685 | **350** | 280 |
| Title | **37** | 35.9 | 34.4 | 33.8 | **32** | 32 |
| Description | **21** | 20.3 | 19.5 | 19.1 | **18** | 18 |

The bold columns are Figma's two cells. Everything between them interpolates rather than snapping.

### It measures itself, not the window

The unit is `cqi` — the section's own inline size — and the section names its container, so the gutter, the
headings and the two-up collapse inside it all measure the same thing. Same argument as the marquee's
container query: "the window is narrow" and "this section is narrow" are different questions, and a section
inside an app with a sidebar, a preview frame or a two-column docs page is the narrow case while the window
is not.

The padding lives on the inner element rather than the section, because a container cannot use its own
query units for its own padding without the size depending on itself. The inner element's `max-width`
carries the gutter as well as the 1280 — `calc(1280px + 2 * gutter)` — which is what Figma's 1280-in-1440
actually means, and what lets the background stay full-bleed.

### `bleed`

`Integrations Section` and `Carousel` set `padding-inline: 0` on the section and put `0 80` on the title
instead, so a marquee or a card track runs off both edges while the heading stays on the grid. `bleed` does
exactly that: the body goes full width, and the header and footer keep the gutter and the 1280 cap.

### SectionTitle

| Figma | Prop |
| --- | --- |
| `Type` — Left- Description / Centered- Description | `align` |
| `Device` — Desktop / Mobile | fluid |
| `Title` / `Description` / `Slot` | `title`, `description`, `actions` |

Figma has two cells: a row with the action on the right, and a column with the action underneath. This is
**one flex row that wraps** — the text column claims `min(100%, 34rem)`, so the action sits beside it while
there is room and drops full-width beneath it when there is not. It lands on both cells with no breakpoint.
`align-items: flex-end` is Figma's `MAX` counter-axis alignment: the action sits on the heading block's
bottom edge, not its middle.

**The text column is capped at 900px in both alignments.** A section heading is one line of display type
and its description one or two of prose, and neither wants the full 1280 content column: at that width a
heading runs long enough to lose its shape and a paragraph loses the reader between line ends. 900 is
where every heading on the Home page sits on one line and its description on one or two.

It **raises** the centred cap, which was 46rem — narrow enough that the integrations description ended
with `day.` stranded on a line of its own — and lowers the left-aligned one, which had no cap and could
run the whole column whenever a section had no action beside it.

`order` defaults to **2**, unlike `Hero`'s title which has no default. A section heading under a page's
`h1` is `h2` almost every time, and making every call site say so produces call sites that say nothing and
render a `div`.

### ContentMedia

Figma's `Content Left Image` and `Content- Right Image` types: two equal columns 40px apart, a 3:2 media
box and a text column of heading, description and actions. Verified at 1440 — **620 × 413 each, 40px gap**,
exactly Figma's `Content` frame.

Below 900px of *section* width it stacks, and **each side keeps its own reading order**: a left-image block
leads with its image, a right-image block leads with its words. Collapsing both the same way would throw
away the only thing that distinguishes the two Figma types.

One thing that had to be fixed after measuring: `flex: 1 1 0` sizes the two columns evenly while the axis
is horizontal, but once it turns vertical that same `flex-basis: 0` becomes a **height** of zero, and in a
container with no definite height `aspect-ratio` cannot recover it — the figure measured 801×0. Both
children go back to `flex: 0 0 auto` when stacked, and the ratio now holds at exactly 1.5 at every width.

## Divider

Figma `divider` component set (node `16290:53873`) on Mantine's `Divider`.

| Figma | Prop |
| --- | --- |
| `Property 1` — normal / gradient | `tone` |
| `Property 2` — horizontal / vertical | `orientation` |

```tsx
<Divider />
<Divider tone="gradient" />
<Divider orientation="vertical" />
```

All four cells are 1px, verified: 720×1 with a single top border on the horizontal ones, 1×60 with a single
inline-start border on the vertical ones.

**The normal tone is `Neutral/03` on both axes.** Figma draws it as `Neutral/02` horizontally and
`Neutral/03` vertically; matching them on the stronger value is the one deviation this component makes — see
the gaps list.

`size`, `color` and Mantine's `dashed` / `dotted` line styles are deliberately not exposed. Every cell in
the file is 1px solid and the colour is the `tone` axis, so a width scale and three line styles would all be
inventions.

### What this does not replace

`StatBar` and `Accordion` draw their own rules rather than composing this one, on purpose:

- `StatBar`'s divider is flat `Neutral/03` between stats — the value asked for there, not the `normal`
  horizontal `Neutral/02`.
- `Accordion`'s rule **crossfades** between the flat and the gradient tone as a row opens, which needs two
  stacked layers on one element. A single `Divider` cannot animate between its own tones.

## Form

Figma `Form` component set (node `21405:74359`) — a glass card holding a heading, rows of fields, the terms
line and a submit button. The `Type=Form` hero template (`24263:171716`) is this card beside a content
block; that composition is the `FormSection` story in `Blocks`.

| Figma | Prop |
| --- | --- |
| `Content Text` title + description | `title`, `description` |
| `Slot 1`–`Slot 5`, `Slot 8` | `Form.Row`, one per row |
| `Description/Terms` | `terms` |
| `Action section` `Type=Button` | `submit` |
| The second `Description Card` | `footnote` |
| `Size` — Desktop / Mobile | a container query on the card's own width |
| `Format` — Short | the only cell; nothing to switch on |

It renders a real `<form>`, so `onSubmit` fires, Enter submits, and `required` fields report themselves with
no JavaScript.

### Measured

| | Figma Desktop | Verified | Figma Mobile | Verified |
| --- | --- | --- | --- | --- |
| Padding | 40 | 40 | 16 | 16 |
| Card gap | 40 | 40 | 24 | 24 |
| Fields gap | 24 | 24 | 16 | 16 |
| Row gap | 16 | 16 | 16 | 16 |
| Title | 28 semibold | 28 w600 | 23 | 23 |
| Two-up pair at 600 wide | 252 + 252 | **252 + 252** | single column | single column |

### The numbered slots are not the API

Figma's slots are `Slot 1`, `2`, `3`, `4`, `5` and `8` — not in visual order, with no 6 or 7, and whether a
given one holds one field or two is set per instance. That is how Figma's slot system works, not a
description of a form. `Form.Row` is one repeatable thing instead, and the order you write is the order it
renders.

### Terms above the button

`terms` renders **above** `submit`, which is where the file puts it and the only defensible order: text you
agree to by pressing a button has to be readable before the button, not underneath it.

### A container cannot style itself

The mobile cell is a container query on the card's own width, because this card lives in a hero column — it
is narrow while the window is not, which is exactly the case a viewport query gets wrong.

Getting there took a fix worth recording. With `container-type` on the `<form>` itself, the padding and gap
rules inside the query **silently never applied** — a container cannot be styled by its own query — so the
rows collapsed while the padding stayed at 40. The container is now a wrapper with no padding, so its inline
size is the card's outer width, and all four mobile values land. Verified switching at exactly 520px.

## Footer

Figma `LRDC footer` component set (node `16288:12662`) — three stacked bands the file draws as one
component.

| Figma | Prop | What it is |
| --- | --- | --- |
| `Page Action Section` | `cta` | A grey band with a heading and a signup field |
| `Number Footer` | `stats` | A blue strip of figures |
| `Footer LRDC Base` | `brand`, children, `legal` | The dark footer proper |
| Its bubble artwork | `backdrop` | Not bundled; pass the asset |
| `Property 1` — Desktop / Mobile | **responsive**, no prop | |

```tsx
<Footer brand={<Footer.Brand logo={<Logo />} address="…" social={icons} />} legal={…}>
  <Footer.Column title="Getting Started">
    <Footer.Link href="/trial">Start a trial</Footer.Link>
  </Footer.Column>
</Footer>
```

**The top two bands are slots, not built in.** They are separate sections that happen to sit above a footer:
the CTA is a `Section` with a `Form`, the strip is a `StatBar`. Building them in would mean a second, worse
copy of two components that already exist — and plenty of pages want the footer without either.

### The columns reflow without a breakpoint

Figma has a nine-column Desktop cell and a Mobile cell **4,828px tall** with everything stacked. Rather than
switch between those two, the columns are a grid of `minmax(214px, 1fr)` tracks — 214px being Figma's own
column width — so the count follows the space, and Figma's cells are the two ends of that range. Measured:

| Footer width | Columns | Track | Gutter | Content |
| --- | --- | --- | --- | --- |
| 1440 | **5** | **214px** | **80** | **1200** |
| 1280 | 4 | 261px | 71 | 1138 |
| 1024 | 3 | 283px | 56 | 912 |
| 768 | 2 | 326px | 42 | 685 |
| 414 | 1 | 371px | 21 | 371 |

1440 lands on Figma's Desktop numbers exactly.

### The dark band is dark in both colour modes

It carries the dark bubble artwork and white text, so its ground, its vignette and its text are all
**mode-independent** — pinned to their dark-canvas values rather than read from mode-aware tokens.

This is also the one place `Action/Neutral/Inverted` is the *right* token. That token is `#ffffff` in both
modes, which is what made the `neutral` button and the `secondary` link invisible in light mode; on a band
that is always dark it is exactly correct, and the column titles and address use it at 19.69:1.

### Mode-aware links inverted the wrong way on it

A bug worth recording, because it is the mirror image of one already in this list. `Link variant="secondary"`
was **made** mode-aware to fix it being white-on-white in light mode. On this band that is wrong: the band is
dark in both modes, so in light mode a mode-aware link resolves to dark ink on a dark ground —
**1.4:1**, measured, for every link in the footer.

Fixed by pinning the band's links to their dark-canvas values alongside its ground:
`Surfaces/Text/Primary`'s dark value for the resting colour and `Action/Link/Hover Link`'s for hover. Now
**17.45:1 in both modes**, verified in each.

The general lesson for the design file: a surface that ignores the colour mode cannot use tokens that follow
it. Any always-dark band needs its own pinned set, not the page's.

### Semantics

A real `<footer>`, each column's links in a `<ul>` — a screen reader announcing "list, 7 items" is how
someone knows how much a column holds before reading it. The address is an `<address>` with the browser's
default italic removed, since Figma's is upright. Column headings are real headings, `h3` by default.

Every link is `Link variant="secondary" size="md"`, which is what the file draws, and neither is exposed: a
footer link in another style is a mistake rather than a choice.

The social row's icons are **not bundled** — brand marks are trademarked assets belonging to the application
rather than to a design system. `Footer.Brand`'s `social` slot lays them out and gives each a 44px target
around Figma's 24px glyph, which is inferred; the file draws no target.

## What the Home template needed

The `Home` page (node `24563:52720`) — a 1440×8559 frame — is built in `src/templates/Home.stories.tsx`
from the library, as an interactive prototype rather than a picture: the header opens its mega menus, three
separate pill sets swap the panel below them, the industry tabs retitle the card, the carousel snaps, the
marquee runs, the accordion expands and both forms validate. All of it verified by driving it at 1440 and at
375, not by looking at it.

It carries the file's **own** content — the headline and its gradient half, the Gartner rating, the four
goal-card titles, the four customer quotes with their figures and attributions, the accordion's first panel,
the industry stats, the six capability cells, the two report tags, the whole footer taxonomy and the Gartner
disclaimer. Where the file has not been written yet, that is said below rather than papered over with
invented copy.

### The integrations row scrolls, and its logos are invented

**A deliberate divergence from the file.** Figma's `Type=Integrations Section` is a static wrapping row
of 64px glass tiles. A fixed row can only ever show as many integrations as fit across, and the claim
the section makes is that there are more than that — so the row scrolls. It is `Marquee`, the library's
existing strip, which brings a measured speed (pixels per second, so the pace does not change as logos
are added), the edge fade, and the pause button WCAG 2.2.2 requires of motion that starts on its own.
The tile grows from 64 square to 188 x 64 to hold a mark *and* its name.

The eight vendors are **made up** — Northwind, Cadence, Parcelly, Lumengrid, Orbita, Kestrel, Mosaicly,
Halcyon — and live in `src/templates/vendor-logos.tsx`. Real vendor marks are other companies'
trademarks, the same rule the customer marquee follows, and inventing them is better than initials in a
box: the section is about lockups sitting in a row, and it can only be judged with lockups in it. Each
mark is geometry in `currentColor`, so `monochrome` inks them the way it would ink a real logo, and
swapping one for a real vendor is replacing a `mark` and a `name`.

The title is centred and the call to action sits in the section's **footer** — Figma's `Call to Action`
cell — rather than beside the heading, so it reads as the thing to do after looking at the logos.

Behind it is a **`MeshBackdrop`**: three radials stacked in the middle of the band and screened together, drifting on three different periods slow enough that the movement is
noticed only in the having-happened.

**The falloff is the fade — there is no mask.** The first version cut the pool off with one, and that is
what gave it an edge to notice: a mask *ends* a thing, and anything that ends inside a flat band reads as
a shape. A radial already at zero before it reaches its own element's edge has no end to see, so the mask
came out and the stops do the work — full colour at the centre, gone by 90%.

That is also why the blobs are far bigger than the band: a gradient wide enough to fade properly needs
room to fade *in*, and once it has that room the light carries above and below the section on its own.
Which is the point — the glow belongs to the page, not to one band, and a highlight that stops exactly
where a section stops announces the section. It reaches about 500px past each edge.

**Bleeding without widening the page:** `overflow-x: clip` with `overflow-y: visible`, the one
combination CSS allows. An element wider than the page grows `document.scrollWidth` and drags the whole
page sideways — which the layout suite fails on, and rightly. `.meshHost` deliberately does *not* set
`isolation: isolate` for the same reason: that would seal the pool into the one section.

**It runs the hero's palette, not the footer's** — `Brand/Primary/Primary` for the blue,
`--sds-bubble-violet` for the purple and `--sds-bubble-sky` for the lift where they cross, the same
colours the drawn bubble is made of, so the light on the page reads as coming from the same source as
the light in the hero. Those four hexes used to be declared on the hero's own rule; they moved to
`cssVariables.ts` when the mesh took them, because two copies of five hexes is two places to change it.
They are still flagged for `Accent/*` in the file if the drawn bubble ships.

The footer's mesh values it used at first are a *dark band's* colours, pre-mixed to sit over near-black,
and on the page they read as ink rather than as light. The hues are now given at full strength and held
back by the container's `opacity` instead — one number to turn, and the one you would reach for.

It is held well back: **0.19 on the dark canvas, 0.11 on the light one**, half of what the footer's
pre-diluted values needed. Light is lighter again because screened over a near-white page the same
numbers read as a coloured cloud sitting on the content rather than as light behind it. Under
`prefers-reduced-motion` the pool stays and the drift stops: it is a ground, not a message.

### What is committed, and what is not

The product screenshots and the platform diagram are the design's own assets and are committed under
`assets/home/`, exported at the drawn size or 2×. **Customer and vendor logos are not** — Airbus, Sky,
Broadcom, Unilever, Stadt Wien, Carrefour and Petrobras are other companies' trademarks rather than
design-system assets, so the marquee and the carousel tiles use stand-ins at the drawn size. The Gartner
"Leader / Summer 2026" shield is omitted for the same reason; the rating, the stars and the attribution
line are real.

**The integration row is the exception, and it changed.** It ran eight invented vendors — geometry in
`currentColor`, no real trademark anywhere near the repository — and now carries twelve real marks in
`assets/integrations/`: Microsoft Office, Google Cloud, Azure, Amazon S3, HubSpot, Stripe, PayPal,
DocuSign, Elastic, Google Drive, FedEx and UPS. They were supplied for this section deliberately.
Naming a vendor you integrate with is ordinary nominative use, which is not the same question as
redistributing a mark from a public repository — and it is that second question this section has always
been about. **If it needs undoing**, delete `assets/integrations/`, restore the invented set in
`src/templates/vendor-logos.tsx` from git history, and the row renders again through `VendorTile`.

`assets/integrations/google-cloud.svg` is 199KB against 1–7KB for every other one, because it is a PNG
embedded in an SVG wrapper rather than a drawing. It is 78% of that folder on its own and it will not
stay sharp on a high-density screen. A real vector would fix both.

**`Trending Now`'s six thumbnails are committed, and they are the exception worth flagging.** They come
straight out of the `card-image` fills in node `7655:15414` — centre-cropped to the card's 3:2, saved at
820×547 as JPEG q82, 281KB for the six — and they live in `assets/home/trending/`. Four are stock
photography and two are illustration; none of them is a design-system asset, and this is a public
repository. They were deliberately left out until now for that reason, with a generated gradient tile in
their place, and the argument for changing course is that this is the one section a placeholder actually
broke: the cards are mostly picture, so six flat panels said nothing about whether the section works.
**If the photography is not licensed for redistribution, this is where to undo it** — delete the folder
and put `resourceTile` back.

### The platform diagram is drawn, not exported

*Everything You Need in One Platform* was `assets/home/platform-diagram.png` — the sixteen products and
their hub as one 1000×806 image with one alt string. It is now `CapabilityMap`, so each product is a
tile with its own label, its own initialism spelled out for a screen reader, its own destination and a
keyboard path through the figure. **The section bleeds**, where the media band was capped at 1000. That mattered while the
lattice was 8.6 tiles wide and width was what bound the card; with the sections back at ±2 the figure is
983 across on a 1440 window and the bleed is doing nothing at that size. It is kept for the window that
is tall enough to want more, and it costs nothing: the title keeps the gutter either way.

The sixteen products live in `src/templates/product-map.tsx`, because two places draw them — the Home
template and `CapabilityMap`'s own stories — and sixteen products in two files is sixteen chances for
them to disagree about what Liferay sells. The schema gained a `capabilityMap` section beside
`mediaBand` so the page builder can place one too.

### It is fitted to the window, not to the column

A figure sized by its column alone is a little over 1000px tall at 1100 across, which is more than most
windows have: the reader meets it a third at a time and never sees the shape the drawing is about. So
`CapabilityMap` gained a **`maxHeight`**, and the page passes `max(860px, 100svh - 320px)` — the window
less the section's own furniture, being 120px of block padding at each end, the 40px gap under the title,
and the title.

It is a `max-width` underneath, `height × 5.6/4.9`. A box with an `aspect-ratio` takes its height from
its width and never the reverse, so clamping the height directly would squash the lattice; converting the
height budget into a width brings the whole figure down in proportion.

**`hyphens: auto` is not enough, so the break is in the data.** `Personalization` is the one product
name too long for a hexagon once the figure is fitted to a window, and the stylesheet's `hyphens: auto`
is supposed to break it with a hyphen. It does not always: Chromium ships hyphenation dictionaries
through the component updater, and a build that has not received them — an embedded browser, a fresh
container — finds no hyphenation opportunity and falls through to `overflow-wrap: break-word`, which
breaks the word with no hyphen at all. The label therefore carries a soft hyphen (`\u00AD`) at the point
the dictionary would have chosen, which draws a hyphen when the word wraps and nothing when it does not,
and a `description` holding the unbroken name, which is what the tile announces.

**The 860px floor is a card size written as a height.** 860 is a **167px hexagon** worked back through
the canvas — 860 ÷ 4.9 cells tall × 0.95 fill — so the number to change is the card, not the height. A
card that size fits every one of the sixteen product names on one line.

It is a floor and not a target: a tall window still gets a bigger figure, a short one keeps the card.
Worth being plain about the consequence — **a 167px card does not fit a 900px-tall window.** 860 of
figure plus 320 of furniture wants 1180, so on a laptop this section is scrolled rather than taken in at
a glance, and above about 1180 tall the two agree. The card won that argument deliberately.

Measured, on the home page:

| Window | Figure | Hexagon | Labels wrapping |
| --- | --- | --- | --- |
| 1728 × 1080 | 1450 × 860 | 160px | none |
| 1440 × 900 | 1361 × 807 | 150px | none |
| 1280 × 800 | 1201 × 712 | 133px | `Personalization` |

Below about 1450 wide the **width** binds before the height does — the figure can never be wider than the
page — so the card comes in under 160 and the two longest names start wrapping again.

`platform-diagram.png` is still committed and is now unused by any story. It is worth keeping until the
drawn figure has been checked against the file, and worth deleting after.

### Fixed here — the components the page changed

**`Hero` gained a `banner` slot.** The page opens with a 1000×60 glass bar — a label, two selects and a
`Continue` button — centred *above* both columns. Every other hero slot lives inside the left column, so
there was nowhere to put it. `banner` is a full-width band in the hero's own gutters, 40px below the nav and
64px above the heading, and it is the hero's first child in the reading order.

**`ContentMedia` gained `mediaRatio="auto"`.** `Different Teams. One Platform.` puts a screenshot *and* a
row of three stats in its right column. The figure was a fixed `aspect-ratio` with `overflow: hidden`, so
the stat row was clipped away entirely — present in the DOM, invisible on the page. `auto` takes the ratio
off and lets the column be as tall as what is in it.

**A `Button` label longer than its container now wraps instead of overflowing.** Mantine's button is a fixed
height with a `nowrap` label, so the integrations CTA, then reading `Explore our integration capabilities`, ran straight out through
the gutter
at 375px. The root is now `height: auto; min-height: var(--button-height)` and the label wraps — the drawn
height is the floor, so every button that fits on one line is unchanged.

**A pill bar with more cells than fit now scrolls.** `Every Capability Your Enterprise Needs` is six cells;
at the desktop cell they want ~1460px inside a 1280 column, and the bar was running off the page. The list
scrolls at both sizes now, as the Mobile cell already did. See the note on `Segmented Control Bar` below for
why six cells do not fit in the first place.

### Needs a decision

**`Tabs variant="pills"` cannot size itself to its content.** Its root declares
`container: sds-tabs / inline-size` so the bar can switch to the Mobile cell on *its own* width rather than
the window's — which is the right call, and it also means the root contributes nothing to a content-based
measurement. Put the bar in any flex row that sizes to content (a `SectionTitle` action, a centred `Stack`)
and it collapses to **zero width**. The page hits this twice, and both call sites pass the drawn width
explicitly:

| Where | Width |
| --- | --- |
| `What Teams Can Achieve with Liferay`, in `SectionTitle`'s `actions` | 520 |
| `Different Teams. One Platform.`, in a centred `Stack` | 776 |

That works, but a component that silently disappears in a flex row is a trap. Either the container moves to
an element the caller does not own, or `Tabs` needs a `compact` prop so the cell is asked for rather than
inferred from a width.

**Figma's `Segmented Control Bar` is not `Tabs Pill Menu`.** `SegmentedControl` was removed from this library
because Figma's set is named `Tabs Pill Menu`, which became `variant="pills"`. But section 8 uses a
*different* set — `Segmented Control Bar` (`24247:69863`) — and it packs six cells into 1280 with tighter
padding than the pill menu has. The mapping is lossy: `variant="pills"` needs ~1460px for the same six
labels. Worth deciding whether the two sets are really one component.

**`Stat` has no unit slot.** Every figure on this page carries one — `140%`, `+100M`, `45%`, `1,200+`,
`17+` — drawn smaller than the figure and set tight against it. There is no prop for it, so the template
passes a `Text` into `value`. Five instances of the same shape is an axis, not a one-off.

**`Stat size="sm"` drops the small caps that the page still wants.** The small cell sets
`text-transform: none`, which is right for the footer's `Enterprise Customers` and wrong for the industry
card, where the file draws a 32px figure over `FASTER LOADING TIME`. The template uses `size="md"` there and
takes the 40px figure, because the label's case matters more than eight pixels.

**`Form` is Figma's glass *form card*, not a field row.** It is a 40px-padded glass surface, which is correct
for the set it was built from and wrong for the footer's action band, where the file draws the field and the
button straight onto the page. The band uses a bare `<form>` with a `Group`. If a plain field row is a
recurring shape, `Form` needs a surface-less cell.

**`LRDC Primary Nav` (`22775:43617`) is still not what `Header` was built from.** `Header` and `MegaMenu`
came from `liferay-nav-desktop_12.html`. This set has a `Breakpoint` axis of four values —
`1200+ Dynamic Width`, `Desktop 1200+`, `Tablet 600+`, `Mobile 0+` — against the single 1200px breakpoint the
implementation uses. The page's header looks right at both widths, but the two have never been reconciled.

**`Tabs Menu Logo` `Type=Logo`** — section 6 uses the text cell, which is implemented. The logo cell puts
customer logos in the tabs instead of labels, and `Tabs.Tab` has no logo mode.

### Fixed in the Code Connect mappings

**`CS- Quote` promised a component that has never existed.** The `Common Cards` mapping wrote its
attribution as `<Quotee name="…" title="…" />` — so a designer copying that snippet out of Dev Mode got code
that does not compile. It is now the two lines of type the file actually draws: the name at
`Paragraph/Small/Semi Bold` over the role in small caps. The template has the same shape as a local helper.
If it turns up a third time it should be a component.

### Where the file is not written yet

Reproduced as drawn rather than filled in with invented copy:

| Section | State in the file |
| --- | --- |
| `Trending Now` | Six cards, every one of them `Card Title` and a line of lorem |
| `Audience Specific Goals`, second tab | Drawn hidden and empty — the four IT/Developer titles here are **authored**, and marked as such in the source |
| `Different Teams. One Platform.` | Only the first accordion panel has body copy; the other four bodies and the other two pills are **authored** |
| `CAROUSEL` | Six cards, of which the first and last are 74px slivers with no readable content. The four full stories are implemented |

A tab that changes nothing is worse than a tab with a stated guess, which is why the authored copy exists
rather than duplicate panels. Every one of those strings is a comment away from the real thing.

### Two off-axis card paddings

Both are `card-main` instances at padding values **not on the `Padding` axis**, so the template sizes them by
hand and the component cannot help:

- the hero's **1000×60 solution finder** at padding 8/16 — a label, two selects and a rounded button
- the integrations **64×64 tile** at padding 12

Two off-axis instances is a pattern rather than an accident. Either the axis needs those values, or these are
two components of their own — a solution finder and an icon tile. The file does not say which, and guessing
would put an invented cell in a published mapping.

### Still true from the first pass

`Hero`'s 1280 content column, 80px padding and 80px row gap; `Card`'s `Padding=Full` gap of 20; the logo
strip at `Size=Size3` (64px) in a `spacing="none"` band; per-section gaps of 32/24/24/24/40/32/24/24; and the
integrations band as a `List` of 64px glass tiles rather than a marquee. All re-verified against the file at
1440.

### No component yet

| Figma set | What it is | Status in the prototype |
| --- | --- | --- |
| `Call to Action` (`16276:63170`) | A button/link group, Align × Size × Primary/Secondary | Hidden in the file; composed inline where needed |
| `Logo Container` (`19660:24292`) | A logo box in four sizes | Hidden; the marquee lays logos out itself |
| `Page Action Section` (`22502:27194`) | The footer's CTA band, now its own set | Composed as `Footer`'s `cta` slot |

`Chip` **has since been built** — see above. Worth knowing how little that was driven by demand: it is
hidden in every instance on the Home page *and* in all three Detail Page templates, so nothing visible in
the file uses it yet. It was built because it is a real interactive control with five states that no other
component covers, not because a page needed it.

## What the Detail Page templates need

`Detail Pages` (node `24223:174319`) holds three templates — **Product Info**, **Industry**, **Solution**
— two variants each, 4,900–5,900px tall, four to seven sections apiece. Not built yet; this is the
coverage read, taken from the node tree rather than by eye.

The library covers almost all of it: `Hero`, `Section`, `SectionTitle`, `Card` (as `card-main` /
`Common Cards` / `card-image` / `header-alignment` / `Content Text`), `Carousel`, `StatBar` (`Stats Bar`),
`ContentMedia` (`Content Block`), `Tabs` in both variants, `List`, `Link`, `Button`, `Image`
(`Aspect Ratio`), `Marquee` (`Logos scrolling section`), `Header` (`LRDC Primary Nav`) and `Footer`.

**Two components are genuinely missing**, counting only instances that are actually visible:

| Missing | Product Info | Industry | Solution |
| --- | --- | --- | --- |
| `2 Button` | 1 | 1 | 1 |
| `Label CTA` | 1 | 1 | — |

`Chip` and `Call to Action` are drawn in these templates but **every instance is hidden**, exactly as on
the Home page — so neither blocks the work. That is worth stating plainly because a first pass over the
tree that ignores visibility counts `Chip` three times in each template and reaches the opposite
conclusion.

### Query an instance, not a variant

`get_design_context` on a component **variant** returns something that looks like a broken mapping and
is not one. On a `Chip` variant it comes back as

```
import Chip from "src/components/Chip.tsx"
<Chip />
```

— a file that does not exist here, wrapped around auto-generated Tailwind. Two separate things cause
that, and neither is a stale mapping:

1. **`figma.selectedInstance` has no property values on a variant.** A variant is the component
   definition, not a use of it, so every `getString` / `getEnum` / `getSlot` in a template returns
   undefined and the snippet renders empty. Figma fills the gap with its own generated code.
2. **`src/components/<Name>.tsx` is a placeholder Figma synthesises for a component it has no mapping
   for** — a guess at where the code would live, not a published connection. Proof: before `Chip` was
   mapped here that node reported `source: src/components/Chip.tsx`; after publishing, the same node
   reports `source: src/index.ts` and the real template.

So `figma connect unpublish` answering `No Code Connect CLI mapping found for this component` was
correct — there was nothing to unpublish. **Always point design-to-code at an instance**: a card on a
page, not a cell in the component set. Verified on a live `card-main` instance, where the mapping returns
the real customer quote and renders the nested `Stat` through that component's own snippet.

`Surface` is the same story from the other end. It has no mapping here and should not have one: it is a
design-side resource that carries the card's states and background fills, which this library expresses as
`Card`'s `surface` prop. A component that exists only to hold fills in Figma has no code counterpart to
connect.

### Two repos publish to the same Figma file

`solutions-design-system` — the older sibling — still declares Code Connect for `Badge`, `Button`, `Chip`
and `TextInput` against **this same file key**. Its `Chip.figma.ts` maps the same node as
`src/figma/Chip.figma.ts` here, so the two repos compete for that component and whichever published last
wins.

Worth settling deliberately rather than by accident. And if those mappings should go, they have to be
unpublished **from that repo** — `figma connect unpublish` only knows what the local files declare, so
deleting the repo would remove the only way to remove them.

## Where assets live

**Committed, under 4MB a file.** The deployed Storybook is the reference the designers work from, so it
has to render on every branch and every preview with no configuration — which means the assets have to
be in the repo. Hosting them elsewhere would add something that can be misconfigured or expire, and
when it breaks every page looks broken.

What makes that affordable is compression, not restraint. A raw 1200×800 alpha webm out of a design
tool is 15MB; the same clip at CRF 33 is **2.1MB at 0.995 SSIM** — the size of the bubble animations
that have been committed here all along.

`pnpm assets:check` runs in the build and fails at **4MB per file**, with the ffmpeg recipe in the
error. The failure mode it exists for is not "too many files", it is one raw export committed because
compressing was a step too many — and git keeps that forever, even after it is deleted.

Anything that genuinely cannot come down goes in the git-ignored `media/` folder, served at `/media`
and referenced by URL through `mediaUrl()`, with `poster` as the fallback when the file is not there.
See `media/README.md` for that path and for the alpha-channel trap.

## Layout tests

`pnpm test` runs Playwright over **every story in the library**, at 375, 768 and 1440, in both colour
schemes, plus a pass that fails on anything thrown while rendering. The story list comes from
Storybook's own `index.json`, so a new component is covered the moment it has a story — there is no
register to keep in sync, which is how a suite like this usually rots.

It is deliberately **not** visual regression. There are no reference images to approve and nothing to
re-baseline when a colour moves. It asks one structural question — *does this story drag the page
sideways?* — because every real defect found while building the Home page was that question:

| Bug | How it showed up |
| --- | --- |
| Pill tabs in a flex row | collapsed to 0px |
| `ContentMedia` at a fixed 3:2 | silently clipped the stat row |
| A long button label | ran out through the gutter at 375 |
| Industry tabs in `sectionFooter` | 823px wide inside 311 |

All four were found by hand, and none needed a screenshot to detect.

Scrollers are exempt by construction: a carousel track, a scrolling tab bar and a marquee are all
*meant* to be wider than their box, so the check ignores anything clipped by an ancestor and only
counts overflow that reaches the document.

Stories tagged `desktop-only` are exempt below 1200. Only the two authoring tools carry it — a builder
is a rail beside a live preview, which has no phone form. The tag sits on the story that claims it
rather than in a skip list inside the test.

### What it found on its first run

Three bugs, none of them in a component:

- **`Logo` set `width="auto"` as an SVG attribute**, which is not a valid SVG length. Every render
  logged an error. It is a CSS `auto`, and it is now in `style`.
- **`StoryFrame`'s `maxWidth: '100%'` had never worked.** `layout: 'centered'` makes `<body>` a flex
  container and `#storybook-root` a flex item, whose default `min-width: auto` refuses to shrink below
  its content — so a fixed-width story stretched the root and `100%` clamped against a box the story
  had already widened. `#storybook-root { min-width: 0 }` in `preview-head.html` fixes it, and about
  forty stories stopped overflowing a phone.
- **Fixed-width demos did not shrink.** `w={360}` with no upper bound overflows at 375; the component
  stories now pair it with `maw="100%"`, which is what the frame's own doc comment always claimed.

There was also a **false pass**: `load` fires before Storybook has rendered a story it is compiling on
demand, so some runs measured an empty document and reported it as fine. The suite now waits for the
root to have children before it measures.

### CI runs it against the build, not a dev server

Locally `pnpm test` starts `storybook dev`, which is right for iterating. CI serves the **built**
Storybook with `vite preview` instead, because on-demand compilation is what made the first CI attempt
time out: a two-core runner spent the whole budget compiling stories. Since the workflow builds
Storybook for Pages anyway, the tests reuse that output — no second build, and nothing to compile.

The difference is not marginal. Same suite, same machine: **1m 25s per test against the dev server,
11s against the build.**

## Icons

Icons come from [MingCute](https://mingcute.com) — Apache-2.0, ~1,660 icons on a 24×24 grid with a 2px
stroke.

This is not a third-party set bolted on. **The Figma library's icons already are MingCute**: what Figma
calls `system/refresh_2` and `arrow/arrow_right` are MingCute's `refresh_2` and `arrow_right`, in the
same categories, drawn the same way. Depending on the package keeps both sides on one set instead of
re-exporting each glyph from Figma by hand.

```tsx
import { Button, IconArrowRight } from 'liferay-sites-design-system'

<Button rightSection={<IconArrowRight />}>Continue</Button>
```

Icons accept any SVG prop, default to `1em` square so they scale with surrounding text, and draw in
`currentColor`. Button and Link fix the icon box themselves, at the size Figma specifies per component
size. They are `aria-hidden` — correct beside a label; an icon used alone as the whole control needs an
`aria-label` on the control.

### Adding one

1. Find its MingCute name. Ask by keyword via the **MingCute MCP server** (`search_icons`), or browse
   [mingcute.com](https://mingcute.com).
2. Add the name to `src/icons/manifest.json`.
3. Run `pnpm icons`.

Only declared icons are generated, so the bundle carries what the library uses rather than all 1,660. A
misspelled name fails the build with suggested corrections.

### The illustrative set

A second set, kept deliberately separate: the **glass icons** — 165 of them in `assets/glass-icons/`,
which is the snapshot of record the way `tokens/figma/` is. These are what a card puts in its top slot.

They are not UI glyphs and are not interchangeable with the MingCute set: they are 64px illustrations
carrying their own gradients, filters and masks, so they cannot inherit `currentColor`. Hence a second
pipeline — `scripts/build-glass-icons.mjs`, `src/icons/glass-manifest.json`, `pnpm glass-icons` —
rather than a second style in the first one.

```tsx
import { Card, IconGlassMail } from 'liferay-sites-design-system'

<Card variant="glass">
  <IconGlassMail />
</Card>
```

They default to a **48px box**, the container Figma's `card-main` draws them in, and take `size` for
anything else. Add one by putting its path (`Data/DAM` — the folder is the category) in
`glass-manifest.json` and running `pnpm glass-icons`; set `"icons": "*"` to generate all 165.

Three things the generator does to each file, all for a reason:

1. **Strips Figma's `<foreignObject>` blocks.** Figma exports a background blur as an HTML `<div>` with
   `backdrop-filter` inside a `foreignObject`. It needs a `style` string JSX will not take, most SVG
   renderers ignore it, and at icon size it contributes nothing — the artwork is the sibling
   `<g filter="…">`, which is kept, along with the drop shadows and inner shadows that do the work.
2. **Namespaces every id per instance**, using `useId()`. The exported ids happen to be unique across
   these 165 files, but that is not enough: the same icon rendered twice on a page emits its ids twice,
   which is invalid and leaves `url(#…)` resolving to whichever copy came first.
3. **Drops the root `width`/`height`** so the `size` prop and the container decide, keeping the viewBox.

A path that does not exist fails the build with suggestions. Five names appear in two categories each —
`Dashboard`, `Analytics`, `Integration`, `Pricing`, `Global Services` — and declaring both halves of a
pair fails until one is given an `as` name.

The MCP server is a search tool, not a build dependency — `scripts/build-icons.mjs` reads
`@mingcute/svg` from `node_modules`, so the build is offline, reproducible, and lockfile-pinned. To
connect the server:

```bash
claude mcp add mingcute --scope user -- npx -y @mingcute/mcp-server@0.1.1
```

Pinned deliberately: an unpinned `npx -y` adopts any future release at launch, which is the exposure the
`minimumReleaseAge` policy exists to prevent.

### Adding a component

1. Read the spec out of Figma (`get_design_context` on the node) — don't eyeball it.
2. Put the appearance in `src/theme/components.ts` + `components.module.css`, reached through a
   `variant` prop. Never at the call site.
3. Keep the component itself a thin wrapper that adds no styling.
4. Register any new variant name in `src/mantine.d.ts` so it typechecks.
5. Add a `*.stories.tsx` and a `src/figma/*.figma.ts` mapping.

Two conventions worth knowing before you touch the CSS:

- **Never use the `style` prop.** Use Mantine's top-level props (`p`, `bg`, `c`, `bdrs`, `gap`, …) so
  values resolve through the theme. This applies to stories and docs, not just library code.
- **Stories don't wrap themselves in layout markup.** The shared frame lives in
  `.storybook/StoryFrame.tsx`; a story asks for what it needs with
  `parameters: { frame: { width: 400 } }`.

## Checking the mappings still describe the file

`pnpm figma:drift` compares what every `src/figma/*.figma.ts` asserts against what the Figma file
actually has, using the same token `figma connect publish` uses.

It exists because two sets have been restyled underneath the mappings without anything noticing:

- **`card-main`'s `Padding`** went from two cells to four. `On content` and `Full` produced no snippet
  at all, so a designer selecting either got nothing in Dev Mode.
- **`Label CTA`'s `Style`** went from Gradient / Tonal / Outline to Filled / Glass / Gradient. The
  mapping kept emitting `variant="light"` and `variant="outline"` for cells that no longer existed.

Both were found by hand, months apart, while doing something else.

The check reads the node id and the asserted axes out of the mapping files themselves, so there is no
second list to keep in sync — which is how a check like this normally rots. It reports four things:

| | Means |
| --- | --- |
| **Node is gone** | The set was deleted or moved to another file |
| **Axis renamed or removed** | `getEnum('X')` names a property the set no longer has |
| **Mapping names cells the file no longer has** | The snippet is for a variant nobody can select |
| **File has cells the mapping does not name** | Selecting that cell in Dev Mode yields no snippet |

A fifth, **property not declared on the set**, is the weakest signal and will always fire for a mapping
that reaches into a nested instance — `Card` reads `Title` off a `Content Text` two levels down.

**It is not part of `pnpm build`.** It needs a token and a network round trip, and a design file moves
for reasons that have nothing to do with whether the code compiles. Blocking a deploy because a
designer renamed a cell would train everyone to ignore it. It runs weekly instead, and a red run is
the notification.

Confirm anything it reports against `get_context_for_code_connect` before editing — that is the
authority; this is a smoke alarm.

### What it found on its first run

The `Hero` set has drifted and the code has not followed:

- `Type=Guide` **no longer exists**, and the mapping still emits a snippet for it.
- `Alignnemt` has lost `Center` — every cell is now `Left`. `Hero`'s `align="center"` prop therefore
  implements a cell the file does not have.
- `Type=Minimal` is **new** and unmapped.
- `Image=No` exists and is unmapped.

Also unmapped: `Form`'s `Size=Mobile`, `Input`'s `Condensed=False`, `ListItem`'s `Padding=No`. None of
these are broken, but each is a Dev Mode selection that produces nothing.

## Connecting to Figma

`src/figma/Button.figma.ts` maps the Figma component set to this library's code, so selecting a
Button in Figma's Dev Mode shows the real `<Button …>` snippet instead of generated CSS.

```bash
npx figma connect publish   # or: pnpm figma:publish
```

You need a Figma access token (`FIGMA_ACCESS_TOKEN`) with Code Connect write scope, and Code Connect
requires a Figma **Organization or Enterprise** plan. On a lower tier the mappings still live in the
repo and stay valid — they just won't appear in Figma until the plan supports it.

## Known gaps in the design source

These are places where the Figma library is ambiguous, inconsistent, or incomplete. Each is
implemented the way the component itself is drawn, and listed here so the decision is visible rather
than buried.

### `Banner` has no cell at all

The announcement band across the top of the site is not in the file. It was built from the tokens —
the wash is `Brand/Primary` and `Accent/Product Accent` mixed into the page background, the pill is
`Label`'s shape at `Border Radius/round`, the type is `Paragraph/Small` and `Paragraph/X-Small` — so
nothing in it is invented, but its axes are this library's proposal and not Figma's.

It is consequently the only component with **no Code Connect mapping**, since there is no node to map
to. Drawing the set in Figma would settle three questions: whether there are three tones or two,
whether the pill is a `Label` instance, and whether the left-aligned variant exists at all.

### `Content Text`'s description has no text property

`Content Text` — the heading block inside both `card-main` and `Section Title` — exposes its title as a
TEXT property (`Title Card#308:0`) but exposes **nothing** for the description. Only its visibility is a
property (`Show description#21373:0`); the characters are unreachable.

That matters for Code Connect: a bound property is how a snippet gets the real copy. Card and Section Title
work around it by reading the layer directly with `findText('Description')`, which works but depends on the
layer keeping its name. **Adding a TEXT property to the description layer** would make both mappings
simpler and sturdier, and it is a one-field change in Figma.

### `Quotee` is a Figma frame with no code counterpart

The `CS- Quote` card's attribution is a frame named `Quotee`, holding `Name` and `Position` text layers.
The Code Connect snippet used to write it as `<Quotee name="…" title="…" />` — a component this library has
never exported, so the snippet did not compile. The name was not invented: it is the layer's.

It is now bound as a slot, so the mapping renders whatever is actually in it. But the shape recurs — four
times on the Home page alone, plus the template's own local helper — and a frame that has a name in Figma
and no component in code is a gap in one direction or the other. Either `Quotee` becomes a real export, or
the Figma frame should stop looking like a component.

### A static card had no edge, and now has one

`Surfaces/Card BG/Grey` is **1.05:1 against the light page** and 1.06:1 against the dark one. With glass off
limits for a card that cannot be clicked, the fill was the whole surface — and a fill that close to the page
does not read as a card at all.

**Fixed**, by giving `grey` a flat hairline of its own. `Neutral/05` is the lowest step on the scale that is
unambiguously visible against both the fill and the page in both modes:

| | vs the card | vs the page |
| --- | --- | --- |
| Light | **2.75:1** | **2.90:1** |
| Dark | **3.46:1** | **3.67:1** |

`Neutral/04` was the alternative and is fine on dark at 2.82/2.99, but only 1.59/1.67 in light — the mode the
problem was in. `Neutral/06` clears 3:1 everywhere at 4.6+, but on a barely-tinted fill a line that dark
reads as a table rule rather than a card edge.

This is **not a Figma value**: the file draws no edge on `Style=Grey` at all, because in the file every card
is glass and glass brings its own. Worth adding to `Surface` so the two static and interactive edges are both
specified, rather than one being inferred here.

The two edges stay distinguishable, which matters now that the surface says whether a card is clickable:
glass's hairline is the tinted `Glass Line` gradient that warms on hover, grey's is a flat neutral that does
nothing.

### `Surfaces/Card BG/Blue` is not a second static surface

Figma's `Surface` set has a `Blue` cell, and it is **not shipped**. On the dark canvas the token is
`rgba(99, 153, 255, 0.05)` — five percent of blue over near-black — which renders indistinguishable from
`Card BG/Grey`, and in light mode it is `rgba(232, 238, 251, 0.25)`, or 1.03:1 against the page against
grey's 1.05:1. It was a second option that looked like the first, so `grey` is the only static surface.

Worth having as a distinct surface if the token moves far enough from grey to be seen; until then it is one
choice presented as two.

### The Accordion's header uses a navigation arrow

`Accordion`'s header draws `UI Icon Name=arrow/arrow_down`, the arrow with a shaft — the same glyph the
`Link` and `Button` use for actions that navigate. A disclosure does not navigate; it reveals. The `UI Icon`
set already contains `arrow/down`, the chevron, which is the conventional glyph for this and is what the
implementation uses.

A one-instance swap in the file, and worth making so the two meanings stay separate.

### The divider's two axes use different neutrals

`divider`'s four cells are 1px each, and the normal tone is not the same colour on both axes:

| | horizontal | vertical |
| --- | --- | --- |
| normal | `Neutral/02` | `Neutral/03` |
| gradient | `Neutral/06` → `Brand/Primary/Lighten/3` | same |

Nothing about turning a line 90° should change its weight, so this reads as drift rather than intent.

**Fixed by using `Neutral/03` for both** — the stronger of the pair, and the value every other flat rule in
this library already uses (`StatBar`'s stat divider, the underline tab bar's rule). Two places changed: the
`Divider` component's horizontal cell, and the `Accordion`'s closed-row rule, which is the same Figma cell
and would otherwise have recreated the inconsistency inside the library.

One value for both axes is the fix to take back to the file.

**What this does not fix.** `Neutral/03` is **1.42:1 against the light page** and 2.23:1 on dark. It is the
stronger of Figma's two values, not a strong line, so a normal divider is still faint in light mode — the
same flat end of the neutral scale that the Card's static surface ran into, where `Neutral/05` was what
finally read in both modes. If dividers are meant to be *seen* rather than merely be present, that is the
step, and it would want deciding for the `divider` component in Figma rather than per use here.

### The Accordion set is in an error state, from a duplicated variant name

Two of the set's four cells are both named `Expand=Closed, Size=Condensed` — `24397:77178` and
`24397:77204`. Figma therefore refuses to resolve the set's properties at all:
`componentPropertyDefinitions` and `variantProperties` both throw `Component set has existing errors`.

The consequence reaches the code: **Code Connect cannot read `Size` off an instance**, so
`src/figma/Accordion.figma.ts` maps neither axis and the snippet carries a comment instead. One rename
fixes both, and the mapping is then a two-line change.

`24397:77204` is plainly the **expanded** condensed cell — it is the only cell in the set drawing
`arrow/up` — so the fix is to rename it `Expand=Expanded, Size=Condensed`. Two further things follow from
the same cell being unfinished:

- Its rule is a **raw `LINE`**, not a `divider` instance, and it is the flat `normal` line rather than the
  `gradient` one that the expanded Default cell uses. The implementation gives both expanded sizes the
  gradient, on the assumption that the Default cell is the finished one.
- It has **no panel frame**, so there is no condensed panel spec at all. Its `padding-block` of 12px is
  inferred, one step down the scale from the Default cell's 16px. Figma's number would replace it.

### The expanded Accordion cell still shows a down arrow

`Expand=Expanded, Size=Default` (`20534:6600`) has its panel open, its gradient divider in place — and
`arrow/down` on the header, unchanged from the closed cell. The only cell in the set showing `arrow/up` is
the mis-named one above. The implementation rotates the arrow 180° on open, which is what that `arrow/up`
cell draws and what the control needs to signal; the Default expanded cell looks like it was simply
missed.

### An accordion divider is a 1.24:1 hairline in light mode

Figma's `divider` `Property 1=normal` is `Neutral/02`, which measures **1.7:1 on dark and 1.24:1 in
light** against the page surface. `Neutral/03` — the step the StatBar was moved to — is barely better in
light at 1.42:1, so this is a property of the neutral scale rather than of this one choice.

It is left as drawn. The divider is decoration here, not information: whether a row is open is carried by
the arrow direction and by the panel itself, so nothing in WCAG 1.4.11 depends on the line being visible.
Worth knowing that on a light page these rows read as separated mostly by their own spacing.

### The carousel's inactive indicator is a 1.24:1 dot in light mode

Both indicator styles bind their inactive state to `Neutral/02`, which measures **1.70:1 on dark and
1.24:1 in light** against the page surface. How many slides there are, and which one you are on, is
information — so this is WCAG 1.4.11's 3:1 for a graphic that conveys it, not decoration.

**Fixed**, the same way the Button's `neutral` variant was: by moving along the same scale to the lowest
step that clears 3:1 in *both* modes. That is `Neutral/06` — **4.96:1 dark, 4.85:1 light**. `Neutral/05`
misses in light at 2.90:1, which is why the swap goes one step further than it looks like it needs to.

The active state needs no change: `Brand/Primary/Lighten/1` is 5.15:1 and 3.73:1.

This is the second component to run into the flat end of the neutral scale — the Accordion's divider has
the same 1.24:1 in light mode, and was **left** as drawn because a divider there is decoration. The two
together suggest the scale is missing a step between `Neutral/04` (1.67:1 light) and `Neutral/06`
(4.85:1) that would serve as a visible-but-quiet grey in both modes.

### The carousel's edge fade is always on, in both directions

Figma's `Overlay` is an opaque `Surfaces/Page BG base/Default` gradient at both ends of the list at all
times, so **the first card is faded before anything has been scrolled** and the last one stays faded at
the end of the scroll.

Two deviations, both deliberate:

- The fade is **per edge, and only present when that edge has more content**. An edge with nothing beyond
  it has nothing to hint at, and fading the first card at rest reads as a rendering fault.
- It is a **mask, not an opaque rectangle on top**. Figma can hardcode the page colour; a component
  cannot, and this one has to work on a card surface, inside a section with its own background and over
  the hero's gradient. A mask fades the cards to transparent instead, and does not sit above them eating
  their clicks.

Figma's 15% width is kept, as `fadeWidth`.

### The marquee's two strips are 32px apart, and its logos 60px

`Logos scrolling section` draws the strip twice — that is the right construction for a seamless loop — but
puts **32px between the two copies and 60px between the logos inside them**. A loop needs the same gap in
both places: with two different values the strip hitches by the difference once per cycle, which at 60px/s
is a visible stutter every twenty seconds.

The logo gap is used for both, on the assumption that 32 is an artefact of laying two copies out in a file
rather than an intended value. Making the two copies a single component with one gap would settle it.

### The Section Title set is in an error state, from a duplicated variant name

Two of `Section Title`'s four variants are both named `Type=Centered- Description, Device=Desktop` — the
second is plainly the **Mobile** cell, at 32px against the first's 37px. Figma therefore refuses to resolve
the set's properties, so `componentPropertyDefinitions` throws and **Code Connect cannot read `Type` or
`Device`** off an instance; `src/figma/SectionTitle.figma.ts` maps neither. One rename fixes it.

This is the second set in the file with the same defect — the Accordion has it too — and in both cases the
duplicate is a Mobile cell mislabelled `Device=Desktop`.

### Three styles were invisible in light mode

Both were white-on-white, and both stem from the same thing: a token whose value is mode-independent,
used on a component that is only ever drawn on the dark canvas. Both are now fixed, by swapping the
offending token for another real Figma token — one edit each to take back to the design file.

- **Tabs' active label** binds to the same `Action/Neutral/Inverted` white. **Fixed** the same way, with
  `Surfaces/Text/Primary` — see the Tabs state table above. Three components have now hit this one
  token; it is worth a `Surfaces/Text/Inverted` that is actually mode-aware, or a rule that
  `Action/Neutral/Inverted` is only ever used on a filled surface that is itself dark in both modes.
- **Button `neutral`** bound to `Neutral/03`–`Neutral/05`, which Figma inverts between modes, with a
  white label. On dark that is 6.6:1 and 8.8:1 — fine. In light mode the steps are pale greys and the
  white label landed at **1.72:1 and 1.46:1** against a 4.5:1 WCAG AA minimum. **Fixed** — the fill
  binds to the mode-independent `Action/Neutral/*` slates instead, which clear 7.93:1 and 9.66:1 in
  both modes. See the Button state table above; the same table records that Figma's Hover/Active
  naming ends up one step off the state each value is used for, because `Action/Neutral/Default` is
  white and cannot be the resting fill.
- **Link `secondary`** had the same problem, worse: `Action/Neutral/Default` is `#ffffff` in *both*
  modes, giving **1.03:1**. **Fixed** — see the Link state table above.

### Two disagreeing sources for the label size

For both components, the text styles and the component agree on 21/18/14, while the corresponding
number variables in the typography collection disagree:

| | Text style + component | `Size/Action/…` variable |
| --- | --- | --- |
| Button Large / Link Large | 21px | 18px / 20px |
| Button Medium / Link Medium | 18px | 16px / 16px |
| Small | 14px | 14px ✓ |

Only the small size is actually bound to its variable in either component. The components are treated
as authoritative here; the first two variables in each set look stale. The link's 14px style is also
named `Action/Link/X-small` rather than `Small`, which does not match the Size axis.

The Label has a version of the same split. Its Small text style is named
`Paragraph/X-Small/Semi Bold` but is set at **14px/125%**, while the `Size/Paragraph/X-Small` variable
that name points at reads **11px** in all three typography modes. Nothing is bound, so the style wins
here too — the 14px in `LABEL_SIZES` is the drawn value. Either the style is on the wrong step of the
scale or the variable is stale.

### The Label has no size above Large

`Label CTA` draws three sizes — Large 40px, Medium 32px, Small 22px — and the usage sheet on the
*Migration (clean)* page uses the same three. An `xl` was asked for during implementation and is
deliberately **not** shipped, because inventing one means inventing a height, a padding step, a text
style and a border weight that no cell in the file specifies. Adding a fourth cell to the component
set is the fix; `LABEL_SIZES` in `src/theme/components.ts` is then a four-line change.

### The gradient label's text colour is not a token

Every `Style=Gradient` variant of `Label CTA` carries a raw `#1f2531` on its text layer, bound to no
variable, while the Tonal and Outline styles both use one (`Components/Label/lab-tonal-text` and
`Surfaces/Text/Primary`). That value is `Neutral/01`'s *dark* value, held constant across both modes —
which is what it has to be, since the gradient fill is pale in light mode and mid-tone on dark, so a
mode-aware neutral would invert to white text on the pale gradient and fail. It is reproduced as a
literal in `src/theme/cssVariables.ts`. A `Components/Label/lab-grad-text` variable holding the same
mode-independent value would close this.

### The Link's icons are inconsistent across variants

**Two different glyphs — resolved.** Large is drawn with the stroked `arrow/arrow_right`, while Medium
and Small use `Navigation / arrow forward`. The first is MingCute; the second is a Material Symbols
name, so it is the foreign one. Now that the library is on MingCute, both use `IconArrowRight`. Worth
replacing the Material glyph in Figma too.

**Two different sizes at Large.** The icon box is 20px in `Style=Primary, Size=Large, State=Default`
and 18px in the other nine Large variants, including `Style=Secondary, State=Default`. Medium (16px)
and Small (12px) are consistent. An icon that resizes on hover would be a visible jump, so this is
read as a file inconsistency rather than intent: the implementation uses one size per link size —
**20px** for large, matching the Primary/Default cell — and never changes it between states. If 18px
is the intended value, that is a one-line change in `LINK_SIZES`.

### Missing colour groups in the token export

Figma's `Color Styles` collection holds **144** colour variables across eight groups; the export in
`tokens/figma/` has **66**. The `Action/*` group (24 variables) was read out of the Plugin API and
committed as `color.action.*.tokens.json`, which is what the Link's state colours come from.

Still missing: `Components/*` (49 variables) and `Surfaces/Page Background/*`. They have to be added
together, because the former aliases the latter. Until then the handful of `Components/*` values the
components actually use are transcribed in `src/theme/cssVariables.ts`, expressed as references to
exported tokens wherever the alias target exists: `Button Outline/*` and `Glass Card/shadow` for the
outline button, `Label/lab-tonal-bg`, `lab-tonal-text` and `lab-grad-bg-step-01/-02` for the Label,
`Glass Tab/*` plus `Glass Line/01`–`02` for the segmented control, and `Glass Card/Glass Step 01`–`02`
with `Gradient Card/blue` and `/purple` for the Card. Re-exporting the whole collection from Figma would
close this and let those literals go.

The collection also has a **third mode, `Learn-Dark`**, alongside `Light` and `LRDC-Dark`. Only the
first two are wired up; Mantine has two colour schemes, so a third would need a different mechanism.

### The segmented control's two size variants disagree with each other

`Tabs Menu Carded` draws Desktop and Mobile differently in ways that read as drift rather than intent,
so the implementation takes the Desktop treatment at both breakpoints and only the geometry changes:

- **The container fill differs.** Desktop is a flat `Components/Glass Tab/tab fill 1` with a
  `Glass Card/shadow` inner shadow; Mobile is a three-stop radial of `Glass Card/Glass Step 02` →
  `01` → `02` with no inner shadow. Same component, same surface, two treatments.
- **The selected segment's stroke binds to different variables.** Desktop uses
  `Glass Tab/stroke-gradient-01` → `-02`; Mobile uses `Brand/Primary/Lighten/1` →
  `Accent/Product Accent` directly. Those are nearly the same colours on dark — `stroke-gradient-02`
  resolves to `Accent/Purple` (`#ad80f5`) rather than `Accent/Product Accent` (`#ba8fff`) — but in
  light mode the `Glass Tab` pair is deliberately transparent while the raw pair is not, so the two
  sizes would disagree about whether a selected segment has an edge at all.
- **Mobile's Hover variant has no effects.** Desktop hover carries the `Brand/Primary/Lighten/4` glow
  and the 40-radius blur; Mobile carries neither, though both change the label colour. The blur is
  applied at every width here, inside a `hover: hover` query so a touch device never latches it.
- **The hover glow is not implemented, deliberately.** It was, faithfully, and the faithful version is
  the problem: blur 4 at **spread 4** in a pale blue is not a glow on screen, it is a hard ring a pixel
  or two off the pill's edge. Four of them across a bar read as four outlined pills competing with the
  one filled pill that is actually selected. Hover keeps the label colour, which is the cue the rest of
  this library uses for the same job. A divergence to take back to the file rather than to fix in code:
  the state wants a soft fill or a lower spread, not a reproduction.

### Tabs have no focus, pressed or disabled state

`Tab Text` draws Default, Hover and Selected only, and `Tabs Pill` the same three. Focus, pressed and
disabled are inferred in both variants: `Styles/focus-ring` for focus, a 1.5% scale-down for the press, and
half opacity for disabled — the treatments every other control here uses. Two hints in the file support the
focus choice: the Default variant carries a *hidden* drop shadow bound to `Brand/Primary/Lighten/4`, and
`Styles/focus-ring` is `Brand/Primary/Lighten/1`.

### The card's Surface set carries its states, but nothing else does

`Surface` (`24385:58962`) is the only component in this library that draws Default, Hover **and**
Focus for every one of its styles, which is why the Card needed less inference than the tabs did. Two
gaps remain:

- **No pressed state, and no disabled.** Both are inferred; see the Card state table above.
- **The Blue surface loses its edge and shadow on hover.** `State=Default, Style=Blue` has a
  half-opacity hairline and a 2px glow; `State=Hover, Style=Blue` has neither, while every other style
  keeps its resting treatment and only adds the ring. Read as drift rather than intent, so the
  implementation keeps the hairline and the glow across states and only the ring changes.
- **The focus ring is drawn outside the corner.** At a 9px radius against the card's 8px, i.e. offset
  by one pixel. Reproduced at the card's own edge instead, because the card has to clip its corner for
  a full-bleed image and an outside ring is clipped with it.

### The card's content slots are a spreadsheet, not a component

The five card types — Resource, no-padding image, full width, customer story quote, icon card — and the
Top / Content / Bottom slot lists live in the spreadsheet rather than in Figma as variants. Each type is
a *composition* of the same box, so `Card` takes children and each type is a story instead of a prop.
If any of them is meant to be a fixed component with a fixed content structure, that is a design-file
decision that has not been made yet.

### Two Stat values are off the type scale

The `Stats Item` value is 40px at Default and 32px at Small. Neither is bound to a variable: 40px is
not a step on the scale at all (`Display/Display sm` is 36 and `Display lg` is 41), and 32px matches
`Size/Heading/F1` without being bound to it. Both are reproduced literally.

The Small label is drawn with the text style named `Paragraph/XX-Small/Semi Bold` at 11/16, which is
exactly what the `Size/Paragraph/X-Small` variables say — so the style's *name* is one step off the
variable it matches. The same naming drift as the Link's `Action/Link/X-small`.

### The stat bar stacks on the viewport, not on its container

`StatBar` switches to the stacked layout below 576px using a media query, which means a bar inside a
narrow card stays a row until the whole viewport is narrow. Figma models this as a separate
`Align=Vertical` cell rather than a breakpoint, so there is no drawn answer for the in-between case. A
container query on a wrapper would fix it properly if that case turns up.

### The card's content gap is 8px, not Figma's 20px

`card-main` draws 20px between a vertical card's blocks. The implementation uses `gap/8` instead, which
is a deliberate deviation rather than a mistake: a card's label, heading, description and link are one
unit of content, and at 20px they read as four separate sections — particularly once the heading's own
line height is added on top of the gap. The 24px between the halves of a horizontal card is untouched,
since that gap is a layout separation between a text column and an image.

This is the one measurement in the library that does not match its Figma source, so it is the one to
either take back to the design file or push back on.

### The illustrative icons are a Figma export, not a token pipeline

`assets/glass-icons/` is 165 SVGs exported from Figma, so unlike the colours and type it has no
variable collection behind it and no light/dark modes — each icon carries fixed gradients. That is
right for an illustration and wrong for anything that has to sit on either page background, so treat
them as artwork: they read on both canvases because they are mostly mid-tone blues, not because a token
is switching underneath.

Two smaller things in that export:

- **One icon is off-grid.** 164 are `viewBox="0 0 64 64"`; `Product/DXP` is `0 0 66 65`, so it renders
  a fraction larger at the same `size`. Worth re-exporting on the 64px grid.
- **Five names appear in two categories.** `Dashboard`, `Analytics`, `Integration`, `Pricing` and
  `Global Services` each exist twice, and the `2`/`3`/`4` suffixes elsewhere (`Notifications 2`,
  `Premium Security 5`, `Out of the box3`) look like iterations that were never pruned. Nothing breaks —
  the manifest takes an `as` name — but the set would be easier to search with one name per icon.

### The glass card's rim is deliberately under 3:1

`glass` is the clickable card, and WCAG 1.4.11 asks 3:1 of the visual boundary that *identifies* an
interactive component. Its rim measures 1.42–1.63:1 against its own fill. That is a decision, not an
oversight, and it is written down here so nobody has to rediscover the reasoning.

The rim was briefly taken to 3.5–4:1 to satisfy the rule outright. It measured correctly and looked
wrong — glass stopped reading as a material and became a grey card with a bright edge, which is the
one thing the surface exists to avoid.

What makes it defensible is that the rim is not the only signal. Glass sits about twice as far
forward of the page as `static` does, carries a lit top edge and a cast shadow that `static` has
none of, and moves on hover. `static` is not rimless either — it has one at roughly a third the
strength — so the two are told apart by *degree* across four properties rather than by one boundary
doing all the work.

What is still missing is a **non-tonal** cue. Every signal above is contrast, and contrast is what a
dimmed laptop, a projector or low vision takes away first. A clickable card should carry something
structural — a link-styled title, or an arrow in a corner — and until it does, this gap is real
rather than theoretical.

### A card that is a link cannot contain links

`<a>` inside `<a>` is invalid, and browsers unnest it into markup neither element controls. So an
`interactive` Card rendered as `component="a"` must be the single destination, with its call to action as
plain text carrying the link colour; a card that holds more than one link has to be a plain container
with real `Link`s inside. Both shapes are in the **Resource card** story. This was a live bug in the
first version of those stories, caught in the browser console rather than by typecheck.

### The info pill's Figma colours fail in dark mode

`Info Button` binds its text to `Status/Info/Info` on a `Status/Info/Lighten 2` chip. `Lighten 2` is pale
in *both* colour modes while `Info` lightens on dark, so that pairing gives #579dff on #e9f2ff — **2.4:1**.
The implementation uses `Status/Info/Darken 2`, which stays dark in both: 13:1 on light, 4.6:1 on dark.

Same shape of problem as `Action/Neutral/Inverted`, from the opposite direction: a surface that does not
change between modes, paired with text that does.

### The hero's alignment axis is misspelled

The `Hero` set's axis is `Alignnemt`, not `Alignment`. Harmless until someone writes a script against the
variant names — the Code Connect mapping has to spell it Figma's way, which is worth fixing at the source
rather than in every consumer.

### The light hero has no animation — fixed

Was: the two bubble files were dark-canvas assets gated to dark mode, so a light hero showed the gradient
alone. There is a light export of each now — `bubble_center_light.webm` and `bubble_corner_light.webm` —
taken by `Hero`'s `videoLight` and composited with `multiply`, as the dark one is with `screen`. See
the Hero section.

### Smaller things

- **Link `secondary`'s hover and disabled states** were imperceptible and full-contrast respectively.
  **Fixed** — see the Link state table. Both changes are token swaps to take back to Figma.
- **No component specifies a focus indicator except via `Styles/focus-ring`.** That style is 2px
  `Brand/Primary/Lighten/1`, which happens to clear 3:1 on both page backgrounds (3.7:1 and 5.2:1), so
  it is used for both Button and Link. Worth confirming it is meant to be the global focus treatment.
- **Small links are below the 24px target size.** A `size="sm"` link is 20px tall. WCAG 2.5.8 exempts
  links inline in a sentence, but a standalone small CTA link does not qualify. Use `md` or larger for
  standalone links, or add padding at the call site.
- **Button outline's Hover and Pressed states are identical** — both use `Action/Primary/Active` and
  are otherwise drawn the same, so pressing gives no feedback. Solid buttons do get a distinct
  pressed treatment.
- **Large button padding is off-scale.** 18px is not a step on the `padding` scale, which jumps
  16 → 20. Figma sets it directly on the component, so it is reproduced literally.
- **MingCute's stroke is 2px, the Figma export's was 1.5px.** Rendered in a 20px icon box the glyph ink
  is 15px either way — the proportions match exactly — but the stroke lands at 1.67px rather than
  1.25px, so icons read very slightly heavier than the current Figma frames. 2px is MingCute's canonical
  weight, which is the one to keep now the set is the source of truth.
- **The outline glass sheen is an approximation.** Figma expresses it as a radial gradient with a
  transform matrix; CSS has no direct equivalent, so it is reproduced as an ellipse at the same
  position and scale. It reads the same but is not mathematically identical.

### The product constellation is a frame, not a component

`Homepage Redesign`'s `FINAL` frame (`7703:16084`) — the sixteen products around DXP that `CapabilityMap`
implements — is sixteen groups of shapes drawn on a page. No component, no `Type` axis, no slots.

Code Connect **cannot map it**: `figma connect publish` rejects the node with `corresponding node is not a
component or component set`, and because an invalid file aborts the run, a mapping for it would block the
publish for every valid mapping in `src/figma`. One was written and removed for exactly that reason.

So the figure is the one thing in this library that is invisible in Dev Mode. **Making it a component with
a slot per tile** fixes that, and the mapping is then a twenty-line file — the data shape is already
`{ label, icon, href }` per tile, four tiles per cluster, four clusters.

### There is no SEO Studio icon

Fifteen of the sixteen products in the constellation have their own illustration in
`assets/glass-icons` — `Commerce/PIM`, `General/Personalization`, `General/Liferay Data Platform`,
`General/ai`, `Product/DXP` for the hub. SEO Studio has none.

The design draws a magnifier with sparkles. Nothing in the set is that, so the tile borrows
`Product Modules/Content Performance/CDN`, since content performance is what the product is for. Worth
drawing the missing one — it is the only substitution in the figure.

`Content/Search` is a figure behind a magnifier and is the design's **Search** icon exactly, so it stays
with Search rather than being reassigned here.

## Layout

```
tokens/figma/            Figma variable exports — the snapshot of record
scripts/build-tokens.mjs The generator
src/theme/               Mantine theme, CSS variables, component styling
src/components/          One directory per component (Accordion, Button, Card, Carousel, Header, Hero,
                         Image, Input, Label, Link, List, Marquee, Section, Stat, Tabs)
src/blocks/              Page-level section blocks, as stories composed from those components
src/figma/               Code Connect mappings
src/icons/               manifest.json declares the UI set, glass-manifest.json the illustrative one
assets/glass-icons/      The illustrative SVGs — the snapshot of record, like tokens/figma/
assets/bubbles/          The hero bubble animations (webm), not bundled into the library
src/docs/                Storybook Overview pages
.storybook/              Storybook config and the shared story frame
```
