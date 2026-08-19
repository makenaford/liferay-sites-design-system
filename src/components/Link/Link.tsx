import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Anchor } from '@mantine/core'
import type { AnchorProps, ElementProps } from '@mantine/core'

export type LinkSize = 'sm' | 'md' | 'lg'
export type LinkVariant = 'default' | 'secondary'

export interface LinkProps
  extends Omit<AnchorProps, 'variant' | 'size'>,
    ElementProps<'a', keyof AnchorProps> {
  /**
   * Figma Style — named Primary / Secondary there. `default` is the blue link; `secondary` is the
   * neutral one for dark surfaces.
   */
  variant?: LinkVariant
  /** Figma Size. Large 21px, Medium 18px, Small 14px, each with its own icon box. */
  size?: LinkSize
  /** Icon placed before the label — Figma's `Icon Left`. */
  leftSection?: ReactNode
  /** Icon placed after the label — Figma's `Icon Right`, the usual CTA arrow. */
  rightSection?: ReactNode
  /**
   * Renders the link as unavailable. The `href` is dropped, so the element stops being a link
   * entirely: not focusable, not activatable, and announced as disabled.
   *
   * Prefer not needing this. A link that goes nowhere is usually better expressed as plain text; if
   * the action is temporarily unavailable rather than absent, `Button` with `disabled` is a better
   * fit.
   */
  disabled?: boolean
}

/**
 * Link — Figma `Link` component set (node `2144:143689`).
 *
 * A themed Mantine `Anchor`, laid out as Figma draws it: an inline row of optional icon, label and
 * optional icon with a 4px gap. All appearance lives in the theme (`src/theme/components.ts` +
 * `components.module.css`); this component supplies the structure, the `data-section` hooks the
 * stylesheet targets, and the disabled semantics.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | Style = Primary / Secondary | `variant="default" \| "secondary"` |
 * | Size = Small / Medium / Large | `size="sm" \| "md" \| "lg"` (default `lg`) |
 * | Icon Left / Icon Right | `leftSection` / `rightSection` |
 * | State = Default/Hover/Active/Visited | the real CSS interaction states |
 * | State = Disabled | `disabled` |
 *
 * ## States
 *
 * The `default` style uses Figma's colour ramp unchanged. The `secondary` style is restructured —
 * Figma draws it only on the dark canvas, which leaves it invisible in light mode and with a hover
 * change of about 4%. See the state table in README.md for what moved and why.
 *
 * `underline` defaults to `hover`, not Figma's `never`: a state signalled by colour alone is not
 * perceivable to everyone (WCAG 1.4.1), and the underline is the cue that does not depend on hue.
 * Pass `underline="always"` for links inside a paragraph, where the link has to be distinguishable
 * from the text around it at rest, not only on hover.
 *
 * Renders an `<a>`. For a router link, pass `component={NavLink}` and its props; for an action that
 * is not navigation, use `Button` instead.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    variant = 'default',
    size = 'lg',
    leftSection,
    rightSection,
    disabled,
    href,
    onClick,
    children,
    ...props
  },
  ref,
) {
  return (
    <Anchor
      ref={ref}
      variant={variant}
      size={size}
      /**
       * Dropping the href is what actually disables an anchor — it removes the element from the tab
       * order and stops Enter from activating it. `aria-disabled` alone would announce "disabled"
       * while still navigating, which is worse than no state at all.
       */
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      onClick={
        disabled
          ? (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()
          : onClick
      }
      {...props}
    >
      {leftSection ? <span data-section="left">{leftSection}</span> : null}
      {children}
      {rightSection ? <span data-section="right">{rightSection}</span> : null}
    </Anchor>
  )
})
