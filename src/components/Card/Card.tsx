import { forwardRef, type ReactNode } from 'react'
import { Box, createPolymorphicComponent } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/** Figma `Surface` `Style` (node `16953:109831`). `glass` and `no-bg` are the two the card set uses. */
export type CardSurface = 'glass' | 'no-bg' | 'grey' | 'gradient-blue' | 'gradient-purple'

/** Figma `card-main` `Align`. */
export type CardAlign = 'vertical' | 'horizontal'

/**
 * Figma's `Padding` axis, plus the third case the file draws as a separate example.
 *
 * - `all` — `Padding=True`: 20px around everything, the image included.
 * - `content` — `Padding=On content`: the image runs to the card's edge and the 20px moves onto the content
 *   below it. This started as a hand-built frame in the file (`no image padding`) and is now a named cell,
 *   which is the design catching up with the shape rather than the other way round.
 * - `full` — `Padding=Full`: `all`, plus a second 20px inset on the content, so the text sits 40px from the
 *   card's edge while the image sits 20. Used by the four cards in the home template's `Audience Specific
 *   Goals` row.
 * - `none` — `Padding=False`: nothing has padding. What the Resource card uses.
 */
export type CardPadding = 'all' | 'content' | 'full' | 'none'

/** Figma `header-alignment` `Align`. */
export type CardHeaderAlign = 'vertical' | 'center'

/**
 * Figma `Content Text` `Size`. `small` is the card set's own size; `full` is the `Full Card` cell the
 * wide horizontal card uses.
 */
export type CardTitleSize = 'small' | 'full'

/** Figma `card-image` `Aspect Ratio`. */
export type CardImageRatio = '3:2' | '16:9'

export interface CardProps
  extends /*
   * `top` and `bottom` are Mantine style props on `Box`. They are slot names here — Figma's
   * `Top Content` and `Bottom Content` — so the style props give way; a card does not need to be
   * positioned through its own props.
   */
  Omit<BoxProps, 'top' | 'bottom'>,
    Omit<ElementProps<'div'>, 'title'> {
  /**
   * Figma `Surface` `Style`.
   *
   * **Defaults from `interactive`**: `glass` for a card that is a link or a button, `grey` for one that is
   * not. Glass is the clickable surface in this system — it carries the hairline that warms on hover and
   * the ring that appears on focus — so a static card should not wear it, and does not have to ask.
   *
   * `grey` is the only static surface. Figma's `Blue` cell was removed: at 5% blue over near-black it was
   * indistinguishable from grey on the dark canvas, so it was a second option that looked like the first.
   *
   * @default 'glass' when `interactive`, otherwise 'grey'
   */
  surface?: CardSurface
  /** Figma `card-main` `Align`. @default 'vertical' */
  align?: CardAlign
  /** Where the 20px goes. @default 'all' */
  padding?: CardPadding

  /**
   * `Show Image` — the `card-image` slot. Pass an `Image`, an `img`, a logo panel, anything. Present is
   * shown and absent is hidden, which is what Figma's `Show Image` boolean does.
   */
  image?: ReactNode
  /** Figma's `Aspect Ratio` axis on `card-image`. @default '3:2' */
  imageRatio?: CardImageRatio

  /** `Show Top Content` — above the header. A `Stat` in the quote card. */
  top?: ReactNode

  /**
   * `Card hero` — the thing above the title: a `Label`, a glass icon, a `Stat`, a date. Figma's `Show`
   * axis lists Label, Icon, Blog, Tag, Events and Stat; all six are just different content here.
   */
  hero?: ReactNode
  /** Figma `header-alignment` `Align`. `center` centres the hero and the title. @default 'vertical' */
  headerAlign?: CardHeaderAlign
  /** `Show title` + the `Title Card` text. Named for the slot, not the HTML attribute. */
  title?: ReactNode
  /** Figma `Content Text` `Size`. @default 'small' */
  titleSize?: CardTitleSize
  /** `Show description`. */
  description?: ReactNode

  /** `Show Main Content 1` — under the header. A `StatBar` in the wide card. */
  main?: ReactNode
  /** `Show Main Content 2` — a second block under the first. */
  secondary?: ReactNode
  /** `Show Bottom Content` — the last block, pushed to the bottom. Links, buttons, an attribution. */
  bottom?: ReactNode

  /**
   * Turns on the hover and focus treatment. Only for a card that really is a link or a button — pass
   * `component="a" href="…"` or an `onClick` with it.
   *
   * Where the hover lands depends on `padding`: see the component docs.
   */
  interactive?: boolean

  /** Anything else, rendered where `main` sits. */
  children?: ReactNode
}

const CardBase = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    surface,
    align = 'vertical',
    padding = 'all',
    image,
    imageRatio = '3:2',
    top,
    hero,
    headerAlign = 'vertical',
    title,
    titleSize = 'small',
    description,
    main,
    secondary,
    bottom,
    interactive,
    children,
    className,
    ...props
  },
  ref,
) {
  const hasHeader = Boolean(hero || title || description)

  /*
   * Glass is the clickable surface: it is the one carrying the hairline that warms on hover and the ring
   * that appears on focus. A card that cannot be clicked has nothing to do with either, so it defaults to
   * `grey`, the only static surface. Figma draws glass on four of its five card types while marking only
   * two of them clickable, which is the file disagreeing with itself; see README.md.
   */
  const resolvedSurface = surface ?? (interactive ? 'glass' : 'grey')

  return (
    <Box
      ref={ref}
      className={[classes.cardRoot, className].filter(Boolean).join(' ')}
      data-surface={resolvedSurface}
      data-align={align}
      data-padding={padding}
      data-image={image ? true : undefined}
      data-interactive={interactive || undefined}
      {...props}
    >
      {image ? (
        <div className={classes.cardImage} data-ratio={imageRatio}>
          {image}
        </div>
      ) : null}

      {/*
       * `Padding=content` pads the content and not the image, which Figma draws by moving the 20px onto
       * its `Card Content` frame. Same here: one wrapper around everything below the image.
       */}
      <div className={classes.cardBody}>
        {top ? <div className={classes.cardTop}>{top}</div> : null}

        {hasHeader ? (
          <div className={classes.cardHeader} data-header-align={headerAlign}>
            {hero ? <div className={classes.cardHero}>{hero}</div> : null}
            {title || description ? (
              <div className={classes.cardText} data-size={titleSize}>
                {title ? <div className={classes.cardTitle}>{title}</div> : null}
                {description ? <div className={classes.cardDescription}>{description}</div> : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {main ? <div className={classes.cardMain}>{main}</div> : null}
        {children}
        {secondary ? <div className={classes.cardMain}>{secondary}</div> : null}
        {bottom ? <div className={classes.cardBottom}>{bottom}</div> : null}
      </div>
    </Box>
  )
})

/**
 * Card — Figma `card-main` (node `16728:26513`), with `Surface` (`16953:109831`), `card-image`,
 * `header-alignment` (`19097:9035`), `Card hero` (`17720:27408`) and `Content Text` (`20354:3820`).
 *
 * `card-main` is one component with slots and a boolean per slot, and every card in the `Common Cards`
 * set is that component with different slots filled. This mirrors it exactly: **a slot is a prop, and
 * passing it is the toggle.** There is no `type` prop, because Figma does not have one either — the five
 * cards in `Card Examples` are five arrangements of the same thing, and each one is five or six lines.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Surface` `Style` — no-bg / Glass / Grey / Gradient Blue / Gradient Purple | `surface` |
 * | `card-main` `Align` — Vertical / Horizontal | `align` |
 * | `card-main` `Padding` — True / False, and the `no image padding` frame | `padding` |
 * | `Show Image` + `card-image`, `Aspect Ratio` | `image`, `imageRatio` |
 * | `Show Top Content` + `Top Content` | `top` |
 * | `Card hero` `Show` — Label / Icon / Blog / Tag / Events / Stat | `hero` |
 * | `header-alignment` `Align` — Vertical / Center | `headerAlign` |
 * | `Show title` + `Title Card`, `Content Text` `Size` | `title`, `titleSize` |
 * | `Show description` | `description` |
 * | `Show Main Content 1` / `2` | `main`, `secondary` |
 * | `Show Bottom Content` | `bottom` |
 * | `Surface` `State` — Default / Hover / Focus | real CSS states, with `interactive` |
 *
 * ```tsx
 * // Resource — Figma `Type=Resource`
 * <Card
 *   component="a"
 *   href="/guide"
 *   interactive
 *   surface="no-bg"
 *   padding="none"
 *   image={<Image src={cover} alt="" ratio="3:2" radius={0} />}
 *   hero={<Label size="sm" variant="outline">Guide</Label>}
 *   title="Card Title"
 * />
 * ```
 *
 * ## Glass is the clickable surface
 *
 * A card that is not a link or a button uses **`grey`, never `glass`** — and it gets there on its own,
 * because `surface` defaults from `interactive`. Glass exists to carry the interaction: the hairline
 * that warms, the ring that appears, the lift. On a static card none of those ever fire, so the surface is
 * promising something the card does not do.
 *
 * Figma disagrees with itself here — four of the five cards in `Card Examples` are `Style=Glass` and only
 * two are drawn clickable — so this follows the rule rather than the file. Recorded in README.md.
 *
 * `grey` gets a **flat `Neutral/05` hairline** of its own, because the fill alone is 1.05:1 against the page
 * and does not read as a surface without one. The two edges stay distinguishable: glass's is the tinted
 * `Glass Line` gradient that warms on hover, grey's is a flat neutral that does nothing.
 *
 * ## Where the hover goes
 *
 * Figma's `Surface` has a `State=Hover` cell, and it is **identical to `State=Default`** — same 1px
 * gradient hairline, same fill. Only `State=Focus` differs, at 2px. So the hover treatment is inferred,
 * and it follows one rule taken from the layout rather than from a style:
 *
 * - **The image runs to the card's edge** (`padding="none"` or `"content"`) — the hover is **on the
 *   image alone**: it scales up inside its own box and lifts its brightness. Nothing else reacts — no
 *   lift, no ring, no glow — even though the whole card is still the click target, since the root is the
 *   anchor. A ring around a `no-bg` card would outline a box that has no edge at rest.
 * - **Everything is padded** (`padding="all"`) — the hover is on the **card**: it rises 2px, the
 *   hairline warms, and a soft glow appears under it. If there is an image inside the padding it scales
 *   too, but the card is what leads.
 *
 * Focus is the exception to that split, and Figma's own `State=Focus`: the same gradient ring at 2px, on
 * the **whole card** whatever the padding — a focus ring has to be where the focus is. It is a real
 * `:focus-visible`, so it appears for the keyboard and not for the mouse. Press settles the movement back
 * towards rest.
 *
 * Everything is off under `prefers-reduced-motion`, and the ring survives `forced-colors`.
 *
 * ## One anchor per card
 *
 * `interactive` with `component="a"` makes the whole card a link, so it must not contain another one —
 * nested anchors are invalid and React will say so. A card with links inside it wants
 * `interactive={false}` and the links doing the work.
 */
export const Card = createPolymorphicComponent<'div', CardProps>(CardBase)
