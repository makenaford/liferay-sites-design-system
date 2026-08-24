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
| `pnpm build` | Check tokens, typecheck, build the library bundle |
| `pnpm build-storybook` | Static Storybook into `storybook-static/` |
| `pnpm figma:publish` | Publish the Code Connect mappings to Figma |

Pushing to `main` builds Storybook and publishes it to GitHub Pages at
**https://makenaford.github.io/liferay-sites-design-system/** (`.github/workflows/deploy-storybook.yml`). That workflow
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

## Label

From the Figma `Label CTA` component set (node `15121:237267`). A themed Mantine `Badge` — a static
row of optional icon and text with a 4px gap.

```tsx
import { IconCheck, Label } from 'liferay-sites-design-system'

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
| `sm` | 22px | 8px | 4px | `Paragraph/Small` (13/20) | 16px | 1px | 4px |

Large and Medium share one text style (`Paragraph/Base/Heavy`); only Small steps down, and it steps down
to the **`Paragraph/Small` token** (13/20) rather than the 14px its Figma text style is set at — that
style is named `Paragraph/X-Small/Semi Bold` and matches neither the X-Small variable (11px) nor Small
(13px), so the token is the one unambiguous value in the set. The border weight only shows on `outline`,
and Figma varies it per size.

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

### Where the hover goes

Figma's `Surface` has a `State=Hover` cell and it is **byte-for-byte its `State=Default`** — same fill,
same 1px hairline. `State=Focus` is the only state the file actually distinguishes, and it differs by one
thing: the ring goes from 1px to 2px. So the hover is inferred, and it follows one rule taken from the
layout rather than from a style:

- **The image runs to the card's edge** (`padding="none"` or `"content"`) — the hover is **on the image
  alone**: it scales to 1.06 inside its own box and lifts its brightness. Nothing else reacts: no lift, no
  ring, no glow. The whole card is still the click target — the root is the anchor, so a click on the
  label or the title reaches it — but a ring drawn around a `no-bg` card outlines a box that has no edge at
  rest, which reads as a border appearing from nowhere rather than as the image lighting up.
- **Everything is padded** (`padding="all"`) — the hover is on the **card**: it rises 2px, the ring warms
  to the brand gradient, and a glow appears beneath it. An image inside the padding scales too, at 1.03,
  because the card is what leads.

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
| Hover | no fill, no stroke — a `#adc9ff` glow at blur 4, spread 4 |
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
| `Type` — Default / Full Bubble / Corner Bubble | `background="none" \| "full" \| "corner"` |
| `Alignnemt` — Left / Center | `align` |
| `Image` — Yes / No | the `media` slot |
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

The heading element is the caller's: `title` takes whatever node you pass and only styles it. A hero
cannot know whether it holds the page's `h1`.

### The bubble is a gradient with a video on top

That order is the point. The gradient is built from `Brand/Primary/Primary` and `Accent/Product Accent`
— the colours the animation is made of — so it needs no network, survives a blocked or slow file, and is
what shows when the video is not playing. The webm then layers over it with `mix-blend-mode: screen`,
which drops its near-black ground and keeps the light.

Two masks shape it, and neither is decoration: a radial one softens the frame's corners, and a linear one
dissolves the bottom, where the asset's own gradient ends in a faceted edge that `screen` would otherwise
reveal as a shape. Without them the light source reads as a rectangle.

**The video is not bundled.** The two files live in `assets/bubbles/` — 2.0MB and 1.7MB — and a component
library has no business putting that inside anyone's JavaScript, so `video` takes a URL. The stories
import it through the bundler; an app can equally serve it from a public directory.

**It does not play in three cases**, each for its own reason:

- `prefers-reduced-motion` — the video is not rendered at all, so it is never even fetched. An
  autoplaying 2MB loop is precisely what that preference is about.
- `background="none"` — there is no bubble to animate.
- **Light mode** — see below.

### The bubbles are dark-canvas assets

Figma names the component `Dark Bubble Animation`, and that is what the files are: a bright sphere on a
near-black ground. Over the light page background `screen` cannot lift them, so they paint a dark blob
with a visible frame edge instead of a light source — verified in the browser before this was gated. So
the video plays on the dark canvas only, and light mode gets the gradient, which is built from the same
tokens and reads correctly there.

A light-theme export of the two animations would close this. Until then the light hero is a gradient, not
an animation.

## Header and MegaMenu

From the desktop navigation prototype (`liferay-nav-desktop_12.html`) rather than a Figma component
set: a fixed glass band over the page, an inset panel that drops out of it, and a staggered reveal of
the columns inside.

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
          <MegaMenu.Cta label="Ready to Evaluate?">…</MegaMenu.Cta>
        </MegaMenu>
      ),
    },
  ]}
/>
```

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

## Carousel

The `card carousel` section (node `24465:66866`) and the Figma `Carousel` control set (node
`20440:16714`) under it.

| Figma | Prop |
| --- | --- |
| `List` — 310px cards, 13px gap, clipped | `slideSize`, `gap` |
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

### It scrolls; it does not animate

The track is a **scroll container with CSS scroll snapping**, not a transformed strip. The alternative
was `@mantine/carousel`, which brings `embla-carousel-react` into a library whose only dependencies are
`@mantine/core` and `@mantine/hooks`.

Snapping gets touch and trackpad momentum, overscroll, keyboard scrolling, `scroll-behavior` that
respects `prefers-reduced-motion`, and the browser's own scroll-into-view when something inside a slide
takes focus — all native, none of it re-implemented. What it does not get is **mouse drag, autoplay or an
infinite loop**. If any of those three is wanted, this is the component to swap for `@mantine/carousel`;
nothing else in the library would change. The arrows and indicators are the only JavaScript here, and
they call `scrollTo`.

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
  and the 40-radius blur; Mobile carries neither, though both change the label colour. The glow is
  applied at every width here, inside a `hover: hover` query so a touch device never latches it.

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

### The light hero has no animation

The two bubble files are dark-canvas assets and are gated to dark mode, so a light hero shows the
gradient alone. Not a bug, but a gap in the asset set rather than in the code: a light-theme export of
`Dark Bubble Animation` (which would presumably stop being called that) is all it needs.

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
