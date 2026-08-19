import type { ButtonVariant } from '@mantine/core'

/**
 * Variants this design system adds on top of Mantine's built-ins.
 *
 * Figma splits the button's appearance across two axes, Color (Primary | Neutral) and Style
 * (Solid | Outline | Rounded). Those are collapsed into Mantine's single `variant` prop so the
 * variations are one flat list — matching how they are enumerated for design review — which means
 * `neutral` and `rounded` have to be registered as real variants here.
 */
declare module '@mantine/core' {
  export interface ButtonProps {
    variant?: ButtonVariant | 'neutral' | 'rounded'
  }

  /**
   * The Link's Figma Style axis. Mantine types Anchor's `variant` as `'text' | 'gradient'`; the
   * design system's two styles are registered here so `Anchor.extend`'s `defaultProps` and the
   * `data-variant` selectors in `components.module.css` typecheck.
   */
  export interface AnchorProps {
    variant?: 'text' | 'gradient' | 'default' | 'secondary'
    size?: string
  }
}
