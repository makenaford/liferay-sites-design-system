import { Children } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import classes from '../../theme/components.module.css'
import { Link } from '../Link'
import { IconArrowRight, IconExternalLink } from '../../icons'

export interface MegaMenuProps {
  children: ReactNode
}

/**
 * The mega menu panel's content. Composed rather than configured, the same way `Card` is: the
 * prototype has three different layouts — columns with headings, columns headed by tiles under a
 * prompt, and columns beside a featured rail — and they are compositions of the same handful of parts.
 *
 * ```tsx
 * <MegaMenu>
 *   <MegaMenu.Body>
 *     <MegaMenu.Heading>What are you looking to achieve?</MegaMenu.Heading>
 *     <MegaMenu.Columns>
 *       <MegaMenu.Column heading="Digital Experience">
 *         <MegaMenu.Item href="/platform" icon={<IconGlassComposable />} title="Platform Overview"
 *           description="Explore the complete platform." />
 *       </MegaMenu.Column>
 *     </MegaMenu.Columns>
 *     <MegaMenu.Featured heading="Featured">…</MegaMenu.Featured>
 *   </MegaMenu.Body>
 *   <MegaMenu.Cta label="Ready to evaluate?" action={{ label: 'See options', href: '#' }}>
 *     <Button variant="outline">See options</Button>
 *   </MegaMenu.Cta>
 * </MegaMenu>
 * ```
 */
function MegaMenuRoot({ children }: MegaMenuProps) {
  return <>{children}</>
}

/** The row that holds the columns and, optionally, the featured rail beside them. */
function Body({ children }: { children: ReactNode }) {
  return <div className={classes.megaBody}>{children}</div>
}

/**
 * The column grid.
 *
 * `data-count` is the number of columns, because a desktop panel draws all of them on one row and
 * `auto-fit` cannot promise that: Solutions' four came to 855.3px of track in an 856px box and wrapped
 * the last one under the first, on a rounding difference no layout should turn on. Below the desktop
 * breakpoint the count is ignored and `auto-fit` takes over, which is what a narrowing panel wants.
 */
function Columns({ children }: { children: ReactNode }) {
  return (
    <div className={classes.megaColumns} data-count={Children.count(children)}>
      {children}
    </div>
  )
}

export interface MegaColumnProps {
  /** The uppercase section heading above the links. */
  heading?: ReactNode
  /**
   * A clickable tile in place of the heading — the Solutions layout, where each column is headed by a
   * destination of its own rather than a label.
   */
  tile?: ReactNode
  children: ReactNode
}

function Column({ heading, tile, children }: MegaColumnProps) {
  return (
    <div className={classes.megaColumn}>
      {/*
       * The tile *is* the heading where a column has one, rather than sitting above a label that
       * repeats it: the Solutions menu heads each column with the group's own destination, and drawing
       * both put the same four phrases on screen twice.
       */}
      {tile ?? (heading ? <p className={classes.megaColumnHeading}>{heading}</p> : null)}
      <div className={classes.megaColumnItems}>{children}</div>
    </div>
  )
}

export interface MegaTileProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode
  children: ReactNode
}

/**
 * A prompt across the top of a panel, above everything else in it — "What are you looking to
 * achieve?" over the Solutions columns.
 *
 * A full-width flex item, because `.megaBody` wraps: anything narrower would sit *beside* the columns
 * rather than above them.
 */
function Heading({ children }: { children: ReactNode }) {
  return <p className={classes.megaHeading}>{children}</p>
}

/**
 * A column's head, where the group is a destination of its own: a bordered, glass-filled tile that is
 * itself a link. Pass it to `MegaMenu.Column` as `tile`, in place of a `heading`.
 */
function Tile({ icon, children, className, ...props }: MegaTileProps) {
  return (
    /* Merged, not replaced: a caller's class marks *which* tile this is, it does not restyle it. */
    <a className={[classes.megaTile, className].filter(Boolean).join(' ')} {...props}>
      {icon ? <span className={classes.megaTileIcon}>{icon}</span> : null}
      <span>{children}</span>
    </a>
  )
}

export interface MegaItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  icon?: ReactNode
  /** The link's own text. Named `title` for the row it draws, not the `title` attribute. */
  title: ReactNode
  description?: ReactNode
  /** Marks a link that leaves the site, and appends the icon that says so. */
  external?: boolean
}

/**
 * One link in a column: icon, title, and a line of description. A real `<a>` — the prototype uses
 * `div role="link"`, which is not focusable, not activatable by Enter, and not openable in a new tab.
 */
function Item({ icon, title, description, external, ...props }: MegaItemProps) {
  return (
    <a
      className={classes.megaItem}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
      {...props}
    >
      {icon ? <span className={classes.megaItemIcon}>{icon}</span> : null}
      <span className={classes.megaItemBody}>
        <span className={classes.megaItemTitle}>
          {title}
          {external ? <IconExternalLink aria-hidden /> : null}
          {external ? <span className={classes.visuallyHidden}> (opens in a new tab)</span> : null}
        </span>
        {description ? <span className={classes.megaItemDescription}>{description}</span> : null}
      </span>
    </a>
  )
}

export interface MegaFeaturedProps {
  heading?: ReactNode
  /** The wider rail the Resources and Partners menus use for landscape cards. */
  wide?: boolean
  children: ReactNode
}

/** The rail beside the columns, on its own gradient panel. */
function Featured({ heading, wide, children }: MegaFeaturedProps) {
  return (
    <div className={classes.megaFeatured} data-wide={wide || undefined}>
      {heading ? <p className={classes.megaColumnHeading}>{heading}</p> : null}
      <div className={classes.megaFeaturedList}>{children}</div>
    </div>
  )
}

export interface MegaFeaturedCardProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  /** The thumbnail. A real `<img>`, or anything standing in for one. */
  thumbnail?: ReactNode
  /** The card's own heading, not the `title` attribute. */
  title: ReactNode
  description?: ReactNode
  /** Thumbnail above the text rather than beside it. */
  stacked?: boolean
}

function FeaturedCard({ thumbnail, title, description, stacked, ...props }: MegaFeaturedCardProps) {
  return (
    <a className={classes.megaFeaturedCard} data-stacked={stacked || undefined} {...props}>
      {thumbnail ? <span className={classes.megaFeaturedThumb}>{thumbnail}</span> : null}
      <span className={classes.megaFeaturedBody}>
        <span className={classes.megaFeaturedTitle}>{title}</span>
        {description ? (
          <span className={classes.megaItemDescription}>{description}</span>
        ) : null}
      </span>
    </a>
  )
}

/** The "See all …" link that closes a featured rail. */
function More({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes.megaMore} {...props}>
      {children}
      <IconArrowRight aria-hidden />
    </a>
  )
}

export interface MegaCtaProps {
  /** The prompt on the left of the strip. */
  label?: ReactNode
  /**
   * The same call to action as a link, for the drawer.
   *
   * The one place the panel content *does* need a variant. A strip is a strip on a wide panel — a
   * prompt on the left, a button on the right — and on a phone there is no right: the two stack, and a
   * bordered button under a prompt reads as the end of the drawer rather than as one more way on. The
   * file draws a link there, so that is what the drawer gets.
   *
   * Both are in the markup and the breakpoint chooses, which is the honest cost of this. `display:
   * none` is what does the choosing, so whichever one is not on screen is out of the accessibility tree
   * as well — there is never a second copy for a screen reader to find.
   */
  action?: { label: ReactNode; href: string }
  children: ReactNode
}

/** The strip across the bottom of the Platform menu: a prompt and an action. */
function Cta({ label, action, children }: MegaCtaProps) {
  return (
    <div className={classes.megaCta}>
      {label ? <span className={classes.megaCtaLabel}>{label}</span> : null}
      {/* `display: contents` on a wide panel, so the strip's own layout is unchanged by the wrapper. */}
      <span className={classes.megaCtaAction}>{children}</span>
      {action ? (
        <Link
          className={classes.megaCtaLink}
          href={action.href}
          size="md"
          rightSection={<IconArrowRight />}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}

export const MegaMenu = Object.assign(MegaMenuRoot, {
  Body,
  Columns,
  Column,
  Heading,
  Tile,
  Item,
  Featured,
  FeaturedCard,
  More,
  Cta,
})
