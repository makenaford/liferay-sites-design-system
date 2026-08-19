import { forwardRef, type ReactNode } from 'react'
import { Anchor } from '@mantine/core'
import type { AnchorProps, ElementProps } from '@mantine/core'

export type LinkSize = 'sm' | 'md' | 'lg'
export type LinkVariant = 'default' | 'secondary'

export interface LinkProps
  extends Omit<AnchorProps, 'variant' | 'size'>,
    ElementProps<'a', keyof AnchorProps> {
  /**
   * Figma Style — named Primary / Secondary there. `default` is the blue link; `secondary` is the
   * white one, which only reads on a dark surface.
   */
  variant?: LinkVariant
  /** Figma Size. Large 21px, Medium 18px, Small 14px, each with its own icon box. */
  size?: LinkSize
  /** Icon placed before the label — Figma's `Icon = Left`. */
  leftSection?: ReactNode
  /** Icon placed after the label — Figma's `Icon = Right`, the usual CTA arrow. */
  rightSection?: ReactNode
}

/**
 * Link — Figma `Link` component set.
 *
 * A themed Mantine `Anchor`, laid out as Figma draws it: an inline row of optional icon, label and
 * optional icon with a 4px gap. All appearance lives in the theme (`src/theme/components.ts` +
 * `components.module.css`); this component only supplies the structure and the semantic
 * `data-section` hooks the stylesheet targets.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | Style = Primary / Secondary | `variant="default" \| "secondary"` |
 * | Size = Small / Medium / Large | `size="sm" \| "md" \| "lg"` (default `lg`) |
 * | Icon Left / Icon Right | `leftSection` / `rightSection` |
 * | State = Default/Hover/Active/Visited | the real CSS interaction states |
 * | State = Disabled | `aria-disabled` |
 *
 * Figma's `Underline` boolean defaults to false and no variant sets a text decoration, so `underline`
 * defaults to `never` here; Mantine's `underline` prop covers the true case. `underline="hover"` is
 * worth passing for links inside body copy, where a colour shift alone is a weak affordance —
 * especially for `secondary`, whose hover moves only from `#ffffff` to `#f0f1f5` on a dark surface.
 *
 * Renders an `<a>`. For a router link, pass `component={NavLink}` and its props; for an action that
 * is not navigation, use `Button` instead.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'default', size = 'lg', leftSection, rightSection, children, ...props },
  ref,
) {
  return (
    <Anchor ref={ref} variant={variant} size={size} underline="never" {...props}>
      {leftSection ? <span data-section="left">{leftSection}</span> : null}
      {children}
      {rightSection ? <span data-section="right">{rightSection}</span> : null}
    </Anchor>
  )
})
