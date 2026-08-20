import { forwardRef } from 'react'
import { Card as MantineCard, createPolymorphicComponent } from '@mantine/core'
import type { CardProps as MantineCardProps, ElementProps } from '@mantine/core'
import { spacing } from '../../theme/tokens.generated'

export type CardSurface = 'glass' | 'grey' | 'blue' | 'gradient-blue' | 'gradient-purple' | 'none'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

/** The spreadsheet's padding scale: Small 16, Medium 20, Large 40, and 0 for an image card. */
const PADDING: Record<CardPadding, string | number> = {
  none: 0,
  sm: `${spacing['16']}`,
  md: `${spacing['20']}`,
  lg: `${spacing['40']}`,
}

export interface CardProps
  extends Omit<MantineCardProps, 'variant' | 'padding'>,
    ElementProps<'div', keyof MantineCardProps> {
  /**
   * Figma's Surface `Style` axis. `glass` is the default and the only surface the spreadsheet marks
   * as clickable; `grey` is its non-clickable counterpart.
   */
  variant?: CardSurface
  /** The padding scale — Small 16, Medium 20 (default), Large 40, or `none` for a full-bleed image. */
  padding?: CardPadding
  /**
   * Turns on the interaction affordances: the gradient ring on hover and focus, the lift, and the
   * pointer cursor. Set it when the whole card is a link or a button — pass `component="a"` with an
   * `href`, or `component="button"` — and leave it off for a card that is only content.
   *
   * A card that looks clickable has to *be* clickable: this does not make it focusable or activatable
   * on its own, and a `<div>` with an `onClick` is not reachable by keyboard.
   */
  interactive?: boolean
}

/**
 * Card — Figma `card-main` (`24385:65090`) dressed in the `Surface` set (`24385:58962`), with the
 * axes the accompanying spreadsheet enumerates.
 *
 * | Source | Prop |
 * | --- | --- |
 * | Surface `Style` — Glass / Grey / Blue / Gradient Blue / Gradient Purple / no-bg | `variant` |
 * | Padding — Small 16 / Medium 20 / Large 40 / Image 0 | `padding` |
 * | Orientation — Vertical / Horizontal | `orientation` |
 * | Surface `State` — Default / Hover / Focus | real CSS states, when `interactive` |
 *
 * Content is composed rather than configured: the spreadsheet's slots (Top — label, icon, stat,
 * subheading; Content — title, description, list; Bottom — author, link, button, stats) are children,
 * which is what lets one component cover its five card types. `Card.Section` is the full-bleed slot
 * for the "no padding image" card — it reverses the card's padding, so an image reaches the corner.
 *
 * ```tsx
 * <Card variant="glass" padding="md" interactive component="a" href="/story">
 *   <Card.Section>
 *     <img src={cover} alt="" />
 *   </Card.Section>
 *   <Title order={3}>Customer story</Title>
 *   <Text>How a bank rebuilt onboarding.</Text>
 * </Card>
 * ```
 */
const CardBase = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'glass', padding = 'md', interactive, ...props },
  ref,
) {
  return (
    <MantineCard
      ref={ref}
      variant={variant}
      padding={PADDING[padding] ?? PADDING.md}
      data-interactive={interactive || undefined}
      {...props}
    />
  )
})

/**
 * Polymorphic, because an interactive card has to be able to *be* the link or the button rather than
 * wrap one: `component="a"` with an `href`, or `component="button"`. `Card.Section` is re-exported
 * unchanged — the section is Mantine's, and the theme styles it.
 */
export const Card = createPolymorphicComponent<'div', CardProps, { Section: typeof MantineCard.Section }>(
  Object.assign(CardBase, { Section: MantineCard.Section }),
)
