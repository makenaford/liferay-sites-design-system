import { forwardRef, type ReactNode } from 'react'
import { Badge } from '@mantine/core'
import type { BadgeProps, ElementProps } from '@mantine/core'

export type LabelSize = 'sm' | 'md' | 'lg'
export type LabelVariant = 'filled' | 'light' | 'outline'

export interface LabelProps
  extends Omit<BadgeProps, 'variant' | 'size'>,
    ElementProps<'div', keyof BadgeProps> {
  /**
   * Figma Style — named Gradient / Tonal / Outline there. `filled` is the two-stop gradient,
   * `light` the flat tonal fill, `outline` the gradient stroke on no fill.
   */
  variant?: LabelVariant
  /** Figma Size. Large 40px, Medium 32px, Small 22px tall, each with its own corner radius. */
  size?: LabelSize
  /** Icon placed before the label — Figma's `Show Icon`. */
  leftSection?: ReactNode
  /** Icon placed after the label. Not an axis in Figma; the icon slot there is leading only. */
  rightSection?: ReactNode
}

/**
 * Label — Figma `Label CTA` component set (node `15121:237267`).
 *
 * A themed Mantine `Badge` that deliberately adds no props of its own. All appearance lives in the
 * theme (`src/theme/components.ts` + `components.module.css`), which maps the Figma axes onto
 * Mantine's:
 *
 * | Figma | Prop |
 * | --- | --- |
 * | Style = Gradient | `variant="filled"` |
 * | Style = Tonal | `variant="light"` (default) |
 * | Style = Outline | `variant="outline"` |
 * | Size = Large / Medium / Small | `size="lg" \| "md" \| "sm"` (default `lg`) |
 * | Show Icon + its instance swap | `leftSection` |
 * | Text | `children` |
 *
 * Figma binds the corner radius to Size — `Border Radius/round` at Large, `/medium` at Medium,
 * `/small` at Small — so the size decides it and `radius` is only for deviating from the design.
 * `radius="round"` is Figma's 1000px pill and `radius="sm"` its 4px corner, on any size.
 *
 * A label is not a control: the design has no hover, focus or pressed states, and this renders a
 * `<div>` with no interaction behaviour. For something clickable use `Button`; for navigation, `Link`.
 * If a label conveys information that is not also in the surrounding copy, give it text a screen
 * reader can reach rather than relying on the colour of the variant.
 */
export const Label = forwardRef<HTMLDivElement, LabelProps>(function Label(props, ref) {
  return <Badge ref={ref} {...props} />
})
