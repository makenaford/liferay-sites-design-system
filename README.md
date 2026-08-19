# scratch

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
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Check tokens, typecheck, build the library bundle |
| `pnpm build-storybook` | Static Storybook into `storybook-static/` |
| `pnpm figma:publish` | Publish the Code Connect mappings to Figma |

Pushing to `main` builds Storybook and publishes it to GitHub Pages at
**https://makenaford.github.io/scratch/** (`.github/workflows/deploy-storybook.yml`). That workflow
also fails the build if the generated token files have drifted from `tokens/figma/`, so a hand-edited
`*.generated.*` file cannot land quietly.

This repo uses **pnpm**, with supply-chain policies in `pnpm-workspace.yaml` — a one-week minimum
release age, strict engine checks, no exotic sub-dependencies, and a no-downgrade trust policy. If an
install is refused because a version is too new, pin to the newest version old enough to pass rather
than relaxing the policy.

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

## Button

From the Figma `Button` component set (node `16123:189647`).

```tsx
import { Button, IconArrowRight, IconRefresh, ScratchProvider } from 'scratch'

<ScratchProvider>
  <Button variant="filled" size="lg" leftSection={<IconRefresh />} rightSection={<IconArrowRight />}>
    Continue
  </Button>
</ScratchProvider>
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
import { IconArrowForward, Link } from 'scratch'

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

## Label

From the Figma `Label CTA` component set (node `15121:237267`). A themed Mantine `Badge` — a static
row of optional icon and text with a 4px gap.

```tsx
import { IconCheck, Label } from 'scratch'

<Label variant="light" size="lg" leftSection={<IconCheck />}>
  Available now
</Label>
```

Figma's Style axis maps onto Mantine's `variant` names one for one:

| Figma Style | `variant` | What it is |
| --- | --- | --- |
| Tonal | `light` (default) | flat `Components/Label/lab-tonal-bg` fill |
| Gradient | `filled` | two-stop `lab-grad-bg-step-01` → `-02` fill |
| Outline | `outline` | gradient stroke, no fill |

| Figma axis | Prop |
| --- | --- |
| Size — Large / Medium / Small | `size="lg" \| "md" \| "sm"` (default `lg`) |
| `Show Icon` + its instance swap | `leftSection` |
| Text | `children` |

Measurements, all taken from the component:

| | Height | Padding X | Gap | Label | Icon | Border | Radius |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `lg` | 40px | 16px | 4px | 16/24px | 20px | 2px | `round` (pill) |
| `md` | 32px | 8px | 4px | 16/24px | 20px | 1.5px | 8px |
| `sm` | 22px | 8px | 4px | 14/17.5px | 16px | 1px | 4px |

Large and Medium share one text style (`Paragraph/Base/Heavy`); only Small steps down. The border
weight only shows on `outline`, and Figma varies it per size.

**Radius comes with the size.** Figma binds it to the Size axis — `Border Radius/round` at Large,
`/medium` at Medium, `/small` at Small — so `radius` is only for deviating from the design:
`radius="round"` is the 1000px pill and `radius="sm"` the 4px corner, on any size. The **Radius**
story shows all three rows.

A label is not a control: the design draws no hover, focus or pressed state, and this renders a plain
`<div>`. For something clickable use `Button`; for navigation, `Link`. Because the variant carries no
meaning a screen reader can reach, put anything the label is actually communicating in its text.

Mantine's Badge is uppercase, bold and letter-spaced by default; Figma's label is none of those, so
the theme resets all three (text case as authored, Source Sans 3 SemiBold, no tracking).

The `outline` stroke is a gradient — `Brand/Primary/Primary` held to the halfway point, then out to
`Accent/Product Accent`. CSS cannot paint a gradient border directly (`border-image` ignores
`border-radius`, which would square off the pill), so it is a masked background on a pseudo-element.
The mask has to live on the pseudo-element rather than the label: a mask applies to everything an
element renders, so on the root it takes the text and icon with it.

Contrast, measured in the browser against each variant's own background:

| | light | dark |
| --- | --- | --- |
| `light` (tonal) | 12.3 | 11.6 |
| `filled` (both gradient stops) | 13.8 / 12.4 | 6.1 / 6.2 |
| `outline` (against the page) | 13.7 | 17.5 |

## SegmentedControl

From the Figma `Tabs Menu Carded` component set (node `17900:62310`) — the carded strip in the Tabs
section — together with the `Tab Text` (`20517:21553`) and `Tab Content` (`20640:6602`) sets it
instantiates for each segment. A themed Mantine `SegmentedControl`.

```tsx
import { IconSearch, SegmentedControl } from 'scratch'

<SegmentedControl
  defaultValue="docs"
  data={[
    { value: 'all', label: 'All results' },
    { value: 'docs', label: <><IconSearch />Documentation</> },
  ]}
/>
```

| Figma axis | Prop |
| --- | --- |
| `Sizes` — Desktop / Mobile | **responsive**, not a prop — a media query at 1200px |
| `Tab Text` `State` — Default | the resting segment |
| `State` — Hover | the real `:hover` state |
| `State` — Selected | `value` / `defaultValue` |
| Each tab's label, and `Show Icon Left` + its swap | one entry in `data` |

Measurements, taken from the component:

| | Container | Segment | Padding | Gap | Label | Icon | Widths |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | 64px | 48px | 12/36px | 0 | 18/24px | 20px | equal, fills the container |
| Mobile | 60px | 44px | 12px | 12px | 14/20px | 16px | hug, the row scrolls |

Both keep Figma's 8px container padding and `Border Radius/round` pill.

### Why the size axis is a media query

Figma models size as a `Sizes` variant, and Button and Label both turn such an axis into a `size`
prop. This one does not: a strip of tabs spanning a page cannot sensibly have its breakpoint chosen at
the call site, and the token layer is already responsive — Figma ships three typography modes and the
generator emits all three as media queries. The switch is at **1200px**, the design's own desktop
breakpoint, with the mobile treatment below it. Mobile is also where Figma's own tab bar is 762px wide
inside a 366px container, so the row scrolls (with scroll snapping) rather than squeezing.

### States

The whole `Components/Glass Tab/*` group is mode-aware, which is why — unlike Button's `neutral` or
the Link's `secondary` — **nothing here had to be restructured for light mode**. The selected fill
resolves to the opaque `Brand/Primary` blue pair in light mode and to translucent white on dark, and
the selected stroke is deliberately fully transparent in light, where an opaque fill needs no edge.

| State | Treatment | Source |
| --- | --- | --- |
| rest | `Surfaces/Text/Secondary`, SemiBold | as drawn |
| hover | `Action/Link/Hover Link`, plus a `Brand/Primary/Lighten/4` glow at (-1, 1) r4 spread 4 and a 40-radius blur | as drawn |
| selected | `Action/Neutral/Inverted` at Bold, on the `Glass Tab/bg-gradient` fill with its 1.5px stroke, blur and `tab-focus-shadow` | as drawn |
| pressed | a brief `scale(0.97)` | **inferred** |
| focus | `Styles/focus-ring` — 2px `Brand/Primary/Lighten/1`, offset 2px | **inferred** |
| disabled | the resting appearance at 50% opacity | **inferred** |

The three inferred states are marked as such in `components.module.css` too. Figma draws none of them
for a tab: pressed follows the other action components, focus reuses the one focus treatment this
system has everywhere else, and disabled copies Button, whose Figma disabled state is its resting
appearance at half opacity.

The selected segment is **one pill that travels** rather than a fill redrawn per segment — Mantine's
floating indicator, at 220ms on an emphasised curve. That motion is not in Figma, which has no
prototype here; `prefers-reduced-motion` drops it to an instant move and removes the press scale,
keeping the state change while discarding the movement (WCAG 2.3.3).

Contrast, measured in the browser with each state composited over what actually sits behind it:

| | light | dark |
| --- | --- | --- |
| rest | 10.3 | 13.2 |
| hover | 8.6 | 12.6 |
| selected (both fill stops) | 5.1 / 6.0 | 15.1 / 18.5 |
| focus ring vs the container | 3.7 | 5.0 |

### It is a radio group, not tabs

This renders radio inputs in a `role="radiogroup"`, which is what a segmented control is: one choice
among a few, where the choice itself is the outcome, navigable with the arrow keys. Figma files often
use the same carded strip for **tabs that swap panels** — that needs `role="tablist"` semantics and
Mantine's `Tabs` instead. A segmented control announced as tabs promises a screen reader user panels
that do not exist.

Long labels ellipsize rather than being cut: five segments of Figma's 18px label need the design's own
1280px frame, and below that the text has to give somewhere.

## Icons

Icons come from [MingCute](https://mingcute.com) — Apache-2.0, ~1,660 icons on a 24×24 grid with a 2px
stroke.

This is not a third-party set bolted on. **The Figma library's icons already are MingCute**: what Figma
calls `system/refresh_2` and `arrow/arrow_right` are MingCute's `refresh_2` and `arrow_right`, in the
same categories, drawn the same way. Depending on the package keeps both sides on one set instead of
re-exporting each glyph from Figma by hand.

```tsx
import { Button, IconArrowRight } from 'scratch'

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

### Two styles were invisible in light mode

Both were white-on-white, and both stem from the same thing: a token whose value is mode-independent,
used on a component that is only ever drawn on the dark canvas. Both are now fixed, by swapping the
offending token for another real Figma token — one edit each to take back to the design file.

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
outline button, `Label/lab-tonal-bg`, `lab-tonal-text` and `lab-grad-bg-step-01/-02` for the Label, and
`Glass Tab/*` plus `Glass Line/01`–`02` for the segmented control. Re-exporting the whole collection
from Figma would close this and let those literals go.

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
  and the 40-radius blur; Mobile carries neither, though both change the label colour. The glow is
  applied at every width here, inside a `hover: hover` query so a touch device never latches it.

### Tabs have no focus, pressed or disabled state

`Tab Text` draws Default, Hover and Selected only. Focus, pressed and disabled are inferred — see the
SegmentedControl state table above for what each became and why. Two hints in the file support the
focus choice: the Default variant carries a *hidden* drop shadow bound to `Brand/Primary/Lighten/4`,
and `Styles/focus-ring` is `Brand/Primary/Lighten/1`, which is what every other component here uses.

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

## Layout

```
tokens/figma/            Figma variable exports — the snapshot of record
scripts/build-tokens.mjs The generator
src/theme/               Mantine theme, CSS variables, component styling
src/components/          One directory per component (Button, Label, Link, SegmentedControl)
src/figma/               Code Connect mappings
src/icons/               manifest.json declares the set; generated.tsx is built from @mingcute/svg
src/docs/                Storybook Overview pages
.storybook/              Storybook config and the shared story frame
```
