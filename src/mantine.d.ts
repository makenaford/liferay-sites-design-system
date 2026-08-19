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
}
