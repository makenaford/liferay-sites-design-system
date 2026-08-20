import { forwardRef, type ImgHTMLAttributes, type ReactNode } from 'react'
import { Card as MantineCard, createPolymorphicComponent } from '@mantine/core'
import type { CardProps as MantineCardProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
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
   *
   * When the card **is** the link, it must not contain links: `<a>` inside `<a>` is invalid, and the
   * browser unnests it into markup neither element controls. Either the card is the one destination and
   * its call to action is plain text, or the card is a container and the links inside it are real.
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
 * <Card variant="glass" padding="md">
 *   <Card.Image src={cover} alt="" />
 *   <Card.Top>
 *     <Label size="sm" variant="outline">Customer story</Label>
 *   </Card.Top>
 *   <h3>How a bank rebuilt onboarding</h3>
 *   <p>Six weeks from kickoff to launch.</p>
 *   <Card.Cta>
 *     <Link href="/story" rightSection={<IconArrowRight />}>Read it</Link>
 *   </Card.Cta>
 * </Card>
 * ```
 *
 * Every slot is optional: `Card.Image` for the picture, `Card.Top` for a label, stat or illustrative
 * icon, `Card.Cta` for the actions. Whatever sits between them is the card's own content.
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

export interface CardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  /** The aspect ratio the image is held at. Figma's `card-image` is drawn at 3:2. */
  ratio?: string | false
  /** Media other than an `<img>` — a `<picture>`, a video, a placeholder. Replaces `src`. */
  children?: ReactNode
}

/**
 * The card's image. Bleeds to the card's edges whatever its padding, clips to the corner, and grows on
 * hover when the card is `interactive`.
 *
 * It reverses the padding itself rather than going through Mantine's `Card.Section`: Mantine detects a
 * section by comparing the child's component type, which a wrapper defeats, so the bleed is done in CSS
 * against `--card-padding` and works at any nesting.
 */
function Image({ ratio = '3 / 2', children, style, alt = '', ...props }: CardImageProps) {
  return (
    <div
      className={classes.cardImage}
      data-card-image
      style={ratio ? { aspectRatio: ratio, ...style } : style}
    >
      {children ?? <img alt={alt} {...props} />}
    </div>
  )
}

export interface CardSlotProps extends ElementProps<'div'> {
  children: ReactNode
}

/**
 * The card's top slot — the spreadsheet's Top row: a `Label`, a `Stat`, an illustrative icon, a
 * subheading, or a combination. A wrapping row, so a label and a date sit side by side.
 */
function Top({ children, className, ...props }: CardSlotProps) {
  return (
    <div className={[classes.cardTop, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

/**
 * The card's bottom slot — a `Link`, a `Button`, or several. It pins itself to the bottom of the card,
 * so a row of cards of different text lengths still lines its actions up.
 *
 * If the card itself is a link (`interactive` with `component="a"`), this must not contain one: `<a>`
 * inside `<a>` is invalid. Put the call to action here as text, or make the card a plain container.
 */
function Cta({ children, className, ...props }: CardSlotProps) {
  return (
    <div className={[classes.cardCta, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

/**
 * Polymorphic, because an interactive card has to be able to *be* the link or the button rather than
 * wrap one: `component="a"` with an `href`, or `component="button"`.
 *
 * The slots are what make a card composable: `Card.Image`, `Card.Top` and `Card.Cta` around whatever
 * heading and copy belong in the middle. All three are optional and order is yours — the card is a
 * flex column, so a top slot under the image, or an image with nothing else, both work.
 *
 * `Card.Section` is Mantine's own full-bleed slot, re-exported for anything the image slot does not
 * cover.
 */
export const Card = createPolymorphicComponent<
  'div',
  CardProps,
  {
    Image: typeof Image
    Top: typeof Top
    Cta: typeof Cta
    Section: typeof MantineCard.Section
  }
>(Object.assign(CardBase, { Image, Top, Cta, Section: MantineCard.Section }))
