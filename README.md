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

### Two styles are invisible in light mode

Both are white-on-white, and both stem from the same thing: a token whose value is mode-independent,
used on a component that is only ever drawn on the dark canvas.

- **Button `neutral`** binds to `Neutral/03`–`Neutral/05`, which Figma inverts between modes, with a
  white label. On dark that is 6.6:1 and 8.8:1 — fine. In light mode the steps are pale greys and the
  white label lands at **1.72:1 and 1.46:1** against a 4.5:1 WCAG AA minimum. **Still open** —
  reproduced as drawn, because unlike the link there is no existing token that obviously replaces it.
- **Link `secondary`** had the same problem, worse: `Action/Neutral/Default` is `#ffffff` in *both*
  modes, giving **1.03:1**. **Fixed** — see the Link state table above. The same approach would work
  for the button (swap the mode-independent token for the mode-aware one), which is the argument for
  fixing it there too.

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
together, because the former aliases the latter. Until then the handful of `Components/Button Outline/*`
and `Glass Card/shadow` values used by the outline button are transcribed in
`src/theme/cssVariables.ts`, expressed as references to exported tokens wherever the alias target
exists. Re-exporting the whole collection from Figma would close this and let those literals go.

The collection also has a **third mode, `Learn-Dark`**, alongside `Light` and `LRDC-Dark`. Only the
first two are wired up; Mantine has two colour schemes, so a third would need a different mechanism.

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
src/components/          One directory per component (Button, Link)
src/figma/               Code Connect mappings
src/icons/               manifest.json declares the set; generated.tsx is built from @mingcute/svg
src/docs/                Storybook Overview pages
.storybook/              Storybook config and the shared story frame
```
