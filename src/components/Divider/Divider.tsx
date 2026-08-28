import { forwardRef } from 'react'
import { Divider as MantineDivider } from '@mantine/core'
import type { DividerProps as MantineDividerProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/**
 * Figma's `Property 1` axis. `normal` is a flat neutral hairline; `gradient` runs `Neutral/06` into
 * `Brand/Primary/Lighten/3`, which is the accent the Accordion uses on an open row.
 */
export type DividerTone = 'normal' | 'gradient'

export interface DividerProps
  extends Omit<MantineDividerProps, 'variant' | 'color' | 'size'> {
  /** Figma's `Property 1`. @default 'normal' */
  tone?: DividerTone
  /** Figma's `Property 2`. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Divider — Figma `divider` component set (node `16290:53873`).
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Property 1` — normal / gradient | `tone` |
 * | `Property 2` — horizontal / vertical | `orientation` |
 * | `label` | `label`, `labelPosition` — Mantine's, not in the file |
 *
 * ```tsx
 * <Divider />
 * <Divider tone="gradient" />
 * <Divider orientation="vertical" />
 * ```
 *
 * ## One value for both axes
 *
 * All four cells are 1px. Figma's colours are not symmetric — the normal tone is `Neutral/02` horizontally
 * and `Neutral/03` vertically — and **this uses `Neutral/03` for both**. Nothing about turning a line 90°
 * should change its weight, `Neutral/03` is the stronger of the pair, and it is what every other flat rule
 * in this library already uses. Recorded in README.md as a deviation.
 *
 * | | Figma | Here |
 * | --- | --- | --- |
 * | normal, horizontal | `Neutral/02` | `Neutral/03` |
 * | normal, vertical | `Neutral/03` | `Neutral/03` |
 * | gradient, both | `Neutral/06` → `Brand/Primary/Lighten/3` | as drawn |
 *
 * Worth knowing what this does **not** fix: `Neutral/03` is 1.42:1 against the light page and 2.23:1 on
 * dark. It is the stronger of Figma's two values, not a strong line. A divider whose job is to be *seen*
 * rather than merely be present wants `Neutral/05`, which is the step the Card's static surface hairline
 * settled on after measuring.
 *
 * `size` and `color` are not exposed: every cell in the file is 1px, and the colour is the `tone` axis.
 * Mantine's `dashed` and `dotted` line styles are not exposed either, for the same reason — the file
 * draws neither.
 *
 * ## What this does not replace
 *
 * `StatBar` and `Accordion` draw their own rules rather than composing this one, and deliberately:
 *
 * - `StatBar`'s divider is flat `Neutral/03` between stats — the same value this now uses, so the two
 *   agree, but it is drawn by `StatBar` itself so its stats can space around it.
 * - `Accordion`'s rule **crossfades** between the flat and the gradient tone as a row opens, which needs
 *   two stacked layers on one element. A single `Divider` cannot animate between its own tones.
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { tone = 'normal', orientation = 'horizontal', className, ...props },
  ref,
) {
  return (
    <MantineDivider
      ref={ref}
      orientation={orientation}
      className={[classes.divider, className].filter(Boolean).join(' ')}
      data-tone={tone}
      {...props}
    />
  )
})
