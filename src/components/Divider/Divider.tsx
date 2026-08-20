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
 * ## What Figma draws, and the asymmetry in it
 *
 * All four cells are 1px. The colours are not symmetric:
 *
 * | | horizontal | vertical |
 * | --- | --- | --- |
 * | normal | `Neutral/02` | `Neutral/03` |
 * | gradient | `Neutral/06` → `Brand/Primary/Lighten/3` | same |
 *
 * A horizontal rule and a vertical one being **different neutrals** looks like drift rather than intent —
 * nothing about turning a line 90° should change its weight. Both are reproduced as drawn, and it is
 * recorded in README.md.
 *
 * That matters because `Neutral/02` measures **1.24:1 against the light page**. A `normal` horizontal
 * divider is close to invisible in light mode; the vertical one, on `Neutral/03`, is 1.42:1 — barely
 * better. If a divider has to be seen rather than merely be present, `Neutral/05` is the step that reads
 * in both modes, which is what the Card's static surface hairline uses.
 *
 * `size` and `color` are not exposed: every cell in the file is 1px, and the colour is the `tone` axis.
 * Mantine's `dashed` and `dotted` line styles are not exposed either, for the same reason — the file
 * draws neither.
 *
 * ## What this does not replace
 *
 * `StatBar` and `Accordion` draw their own rules rather than composing this one, and deliberately:
 *
 * - `StatBar`'s divider is flat `Neutral/03` between stats, which is the value asked for there rather
 *   than the `normal` horizontal `Neutral/02`.
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
