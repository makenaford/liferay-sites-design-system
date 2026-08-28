import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Chip as MantineChip } from '@mantine/core'
import type { ChipProps as MantineChipProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface ChipProps
  extends Omit<MantineChipProps, 'icon' | 'variant' | 'size'>,
    ElementProps<'input', keyof MantineChipProps | 'size'> {
  /** Figma's `Left Icon` boolean and its `↳ Left Icon` swap — a `UI Icon` before the label. */
  leftSection?: ReactNode
  /**
   * Figma's `Right Icon` boolean and its `↳ Right Icon` swap. Every drawn cell puts a close glyph
   * here, which is what makes this a removable filter chip rather than a badge.
   */
  rightSection?: ReactNode
  /**
   * Figma's `State=Dragged`: the chip lifted under the pointer, with a fill and a shadow. Dragging
   * itself is the page's job — a chip cannot know it is being reordered — so this is the styling hook
   * a drag implementation sets, not behaviour this component provides.
   */
  dragging?: boolean
}

/**
 * Chip — Figma `Chip` component set (node `16858:51126`), on Mantine's `Chip`.
 *
 * A **removable filter chip**, not a badge: it toggles, it takes focus, and every cell in the file
 * carries a close glyph on the right. For a read-only tag — the pill over a card, the `CMS Trends`
 * marker — use `Label`, which is Figma's separate `Label` set.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Label` | `children` |
 * | `Left Icon` + `↳ Left Icon` | `leftSection` |
 * | `Right Icon` + `↳ Right Icon` | `rightSection` |
 * | `State=Default` | the resting state |
 * | `State=Selected` | `checked` / `defaultChecked` |
 * | `State=Focused` | `:focus-visible`, a real state |
 * | `State=Disabled` | `disabled` |
 * | `State=Dragged` | `dragging` |
 *
 * ```tsx
 * <Chip
 *   defaultChecked
 *   leftSection={<IconSearch />}
 *   rightSection={<IconClose />}
 * >
 *   Financial Services
 * </Chip>
 * ```
 *
 * ## Three of the five states are not props
 *
 * Focus and disabled are real CSS states, so they are `:focus-visible` and `:disabled` rather than an
 * enum — the same treatment `Button`, `Link` and `Card` get here. That leaves `Selected` (a controlled
 * or uncontrolled toggle) and `Dragged` (a hook for whatever is doing the dragging).
 *
 * ## No check mark
 *
 * Mantine shows a tick inside a checked chip and reflows the label around it. Figma does not: `Selected`
 * is the same pill with `Surfaces/Card BG/Blue` behind it. The tick is hidden, and the padding stays put
 * so a chip does not resize when it is picked — which would move every chip after it in the row.
 *
 * ## Removing is the caller's
 *
 * `rightSection` is rendered inside the chip's own label, which is a `<label>` wrapping a checkbox — so
 * a `<button>` cannot go in it, and a click on the glyph toggles the chip like a click anywhere else.
 * A row that needs real removal should put the close control beside the chip and give it its own
 * accessible name; that is noted in the README rather than faked here.
 */
export const Chip = forwardRef<HTMLInputElement, ChipProps>(function Chip(
  { leftSection, rightSection, dragging, children, className, ...props },
  ref,
) {
  return (
    <MantineChip
      ref={ref}
      className={[classes.chipRoot, className].filter(Boolean).join(' ')}
      data-dragging={dragging || undefined}
      {...props}
    >
      {leftSection ? (
        <span className={classes.chipSection} data-section="left" aria-hidden>
          {leftSection}
        </span>
      ) : null}
      <span className={classes.chipLabelText}>{children}</span>
      {rightSection ? (
        <span className={classes.chipSection} data-section="right" aria-hidden>
          {rightSection}
        </span>
      ) : null}
    </MantineChip>
  )
})
