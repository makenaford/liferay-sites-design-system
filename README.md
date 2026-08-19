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
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Check tokens, typecheck, build the library bundle |
| `pnpm build-storybook` | Static Storybook into `storybook-static/` |
| `pnpm figma:publish` | Publish the Code Connect mappings to Figma |

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

The one component built so far, from the Figma `Button` component set (node `16123:189647`).

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

These are places where the Figma library is ambiguous or inconsistent. Each is implemented the way
the component itself is drawn, and listed here so the decision is visible rather than buried.

1. **The `neutral` variant fails contrast in light mode.** It binds to `Neutral/03`–`Neutral/05`,
   which Figma inverts between modes, with the label on `Action/Neutral/Inverted` (white). On the
   dark page background the component is drawn against, that is 6.6:1 and 8.8:1 — fine. In light mode
   the same steps are pale greys and the white label lands at **1.72:1 and 1.46:1**, well under the
   4.5:1 WCAG AA minimum. Implemented faithfully; the light-mode neutral fill needs specifying in
   Figma, or the variant should be documented as dark-surface only.
2. **Two disagreeing sources for the button label size.** The `Action/Button/Large` and
   `Action/Button/Medium` text styles — and the component — use 21px and 18px. The
   `Size/Action/Button/Large` and `/Medium` number variables in the typography collection say 18px and
   16px. Only the Small button is actually bound to its variable. The component is treated as
   authoritative here (21/18/14); the first two variables look stale.
3. **Large's horizontal padding is off-scale.** 18px is not a step on the `padding` scale, which jumps
   16 → 20. Figma sets it directly on the component, so it is reproduced literally.
4. **Two colour collections were not exported.** `Base Colors` and `Components` (the
   `Button Outline/*`, `Glass Card/shadow` and `Action/Primary/*` tokens) are not in
   `tokens/figma/`. Where a value is a reference to a token that *was* exported, `cssVariables.ts`
   expresses it as that reference; the remaining few are literals transcribed from the component and
   marked as such. Export those collections and the literals can go.
5. **Outline's Hover and Pressed states are identical.** Both use
   `Components/Button Outline/line-stp-02` and are otherwise drawn the same, so pressing an outline
   button gives no feedback beyond the cursor. Solid buttons get a distinct pressed treatment (a
   darker gradient plus an inner shadow).
6. **The outline glass sheen is an approximation.** Figma expresses it as a radial gradient with a
   transform matrix; CSS has no direct equivalent, so it is reproduced as an ellipse at the same
   position and scale. It reads the same but is not mathematically identical.

## Layout

```
tokens/figma/            Figma variable exports — the snapshot of record
scripts/build-tokens.mjs The generator
src/theme/               Mantine theme, CSS variables, component styling
src/components/          One directory per component
src/figma/               Code Connect mappings
src/icons/               Icons exported from Figma, re-framed to 24x24 currentColor
src/docs/                Storybook Overview pages
.storybook/              Storybook config and the shared story frame
```
