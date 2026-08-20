import type { Ref } from 'react'
import { Accordion as MantineAccordion } from '@mantine/core'
import type { AccordionProps as MantineAccordionProps } from '@mantine/core'
import { IconArrowDown } from '../../icons'

/**
 * Figma's `Size` axis, renamed to this library's scale.
 *
 * `lg` is Figma's `Size=Default` — a 56px row, `Paragraph/Large/Semi Bold`, a 32px chevron box. `sm` is
 * its `Size=Condensed` — 40px, `Paragraph/Default/Semi Bold`, 24px. The names are `lg`/`sm` rather than
 * `default`/`condensed` so that a size means the same thing here as it does on `Button` and `Label`.
 */
export type AccordionSize = 'sm' | 'lg'

export interface AccordionProps<Multiple extends boolean = false>
  extends MantineAccordionProps<Multiple> {
  /** React 19 ref, forwarded to the root element. */
  ref?: Ref<HTMLDivElement>

  /**
   * Figma's `Size`: `lg` is `Default` (56px row, 21px label), `sm` is `Condensed` (40px, 18px).
   *
   * @default 'lg'
   */
  size?: AccordionSize
}

function AccordionBase<Multiple extends boolean = false>({
  size = 'lg',
  chevron = <IconArrowDown />,
  mod,
  ...props
}: AccordionProps<Multiple>) {
  return (
    <MantineAccordion
      chevron={chevron}
      /*
       * `size` is not a Mantine Accordion prop, so it is not forwarded — it becomes `data-size` on the
       * root and the stylesheet reads it from there. Passing it through would land a stray `size`
       * attribute on the root div.
       */
      mod={[{ size }, mod]}
      {...props}
    />
  )
}

/**
 * Accordion — Figma `Accordion` component set (node `17019:127517`).
 *
 * A themed Mantine `Accordion` in the two sizes the set draws, with the divider that separates every
 * row and the arrow that flips when a row opens.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Size` — Default / Condensed | `size="lg"` / `size="sm"` |
 * | `Expand` — Closed / Expanded | `value` / `defaultValue`, or the user clicking |
 * | `Header` text | `<Accordion.Control>` children |
 * | `divider` `Property 1=normal` | the closed row's rule, `Neutral/02` |
 * | `divider` `Property 1=gradient` | the open row's rule, `Neutral/06` → `Brand/Primary/Lighten/3` |
 * | The panel's placeholder frame | `<Accordion.Panel>` children |
 *
 * ```tsx
 * <Accordion size="lg" defaultValue="hosting">
 *   <Accordion.Item value="hosting">
 *     <Accordion.Control>Where is my data hosted?</Accordion.Control>
 *     <Accordion.Panel>In the region you choose, on infrastructure we operate.</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 *
 * ## Interaction
 *
 * Figma draws two cells — closed and open — so everything between them is inferred, from the same
 * motion tokens the rest of the library uses.
 *
 * **The rule previews the expand.** Figma changes the divider from flat `Neutral/02` to the
 * `Neutral/06` → `Brand/Primary/Lighten/3` gradient when a row opens. Hover brings that gradient up
 * part of the way, so the row says what clicking it will do before it is clicked. It is one layer whose
 * opacity moves 0 → 0.5 → 1, which runs on the compositor rather than repainting a border.
 *
 * **The arrow is the affordance, so it gets the target.** A soft disc grows in behind it on hover — the
 * full 32px (or 24px) box, not a smaller hit area — and the arrow itself nudges 1px in the direction it
 * is about to travel while the row is held. Rotation is Mantine's, retimed to `--sds-motion-medium` on
 * this library's easing so it settles rather than stops.
 *
 * **The panel content follows the height.** The row's height and the panel's fade are Mantine's
 * `Collapse`; the content additionally rises 4px into place, 40ms behind the height, so the panel reads
 * as opening rather than as appearing at full size. That rise is a keyframe animation rather than a
 * transition, because Mantine hides a closed panel with `display: none` and a transition out of
 * `display: none` has no starting value to run from — measured, not assumed.
 *
 * All of it is off under `prefers-reduced-motion` — including the height, which Mantine drops to 0ms —
 * and the disc and gradient are dropped under `forced-colors`, where the rule becomes `CanvasText`.
 *
 * ## Semantics
 *
 * The control is a `<button aria-expanded aria-controls>` and the panel a `role="region"` labelled by
 * it, with the arrow keys moving between rows. Pass `order` to wrap each control in a real heading —
 * `order={3}` for `<h3>` — which is what a screen reader needs to navigate a page of these by heading.
 * There is no default, because only the page knows its own heading levels.
 *
 * `multiple` lets more than one row stand open. Figma shows one at a time, which is the default.
 */
export const Accordion = Object.assign(AccordionBase, {
  Item: MantineAccordion.Item,
  Control: MantineAccordion.Control,
  Panel: MantineAccordion.Panel,
  Chevron: MantineAccordion.Chevron,
})
