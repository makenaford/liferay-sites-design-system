import type { AnchorHTMLAttributes, ReactNode } from 'react'
import classes from '../../theme/components.module.css'
import { IconArrowRight, IconExternalLink } from '../../icons'

export interface MegaMenuProps {
  children: ReactNode
}

/**
 * The mega menu panel's content. Composed rather than configured, the same way `Card` is: the
 * prototype has three different layouts — columns with headings, columns under tiles, and columns
 * beside a featured rail — and they are compositions of the same handful of parts.
 *
 * ```tsx
 * <MegaMenu>
 *   <MegaMenu.Body>
 *     <MegaMenu.Columns>
 *       <MegaMenu.Column heading="Digital Experience">
 *         <MegaMenu.Item href="/platform" icon={<IconGlassComposable />} title="Platform Overview"
 *           description="Explore the complete platform." />
 *       </MegaMenu.Column>
 *     </MegaMenu.Columns>
 *     <MegaMenu.Featured heading="Featured">…</MegaMenu.Featured>
 *   </MegaMenu.Body>
 *   <MegaMenu.Cta label="Ready to evaluate?">…</MegaMenu.Cta>
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

/** The auto-fitting column grid: as many 190px columns as the panel has room for. */
function Columns({ children }: { children: ReactNode }) {
  return <div className={classes.megaColumns}>{children}</div>
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
      {tile}
      {heading ? <p className={classes.megaColumnHeading}>{heading}</p> : null}
      <div className={classes.megaColumnItems}>{children}</div>
    </div>
  )
}

export interface MegaTileProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactNode
  children: ReactNode
}

/** The Solutions layout's column head: a bordered, glass-filled tile that is itself a link. */
/**
 * The row of tiles across the top of a menu, above its columns.
 *
 * A block of its own rather than a `Columns` full of tiles: `.megaBody` wraps its flex children, so a
 * second `Columns` sat *beside* the first instead of above it, and the four tiles the Solutions menu
 * draws across the full width came out stacked in a narrow left-hand column.
 */
function Tiles({ children }: { children: ReactNode }) {
  return <div className={classes.megaTiles}>{children}</div>
}

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
  children: ReactNode
}

/** The strip across the bottom of the Platform menu: a prompt and an action. */
function Cta({ label, children }: MegaCtaProps) {
  return (
    <div className={classes.megaCta}>
      {label ? <span className={classes.megaCtaLabel}>{label}</span> : null}
      {children}
    </div>
  )
}

export const MegaMenu = Object.assign(MegaMenuRoot, {
  Body,
  Columns,
  Column,
  Tile,
  Tiles,
  Item,
  Featured,
  FeaturedCard,
  More,
  Cta,
})
