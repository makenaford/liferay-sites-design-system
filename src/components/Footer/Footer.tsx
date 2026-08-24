import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { Link } from '../Link'
import type { LinkProps } from '../Link'

/* ------------------------------------------------------------------ column */

export interface FooterColumnProps extends Omit<BoxProps, 'title'> {
  /** Figma's `Section Title` — 18px bold. Rendered as a real heading; see `order`. */
  title?: ReactNode
  /** The heading level for that title. @default 3 */
  order?: 2 | 3 | 4 | 5 | 6
  /** `Footer.Link`s. Rendered as a list, because a column of links is one. */
  children?: ReactNode
}

const FooterColumn = forwardRef<HTMLDivElement, FooterColumnProps>(function FooterColumn(
  { title, order = 3, className, children, ...props },
  ref,
) {
  const Heading = `h${order}` as 'h3'

  return (
    <Box ref={ref} className={[classes.footerColumn, className].filter(Boolean).join(' ')} {...props}>
      {title ? <Heading className={classes.footerColumnTitle}>{title}</Heading> : null}
      {children ? <ul className={classes.footerLinks}>{children}</ul> : null}
    </Box>
  )
})

export interface FooterLinkProps extends Omit<LinkProps, 'variant' | 'size'> {}

/**
 * One row in a column. Figma draws every one as `Link Style=Secondary, Size=Medium`, so neither is a prop
 * here — a footer link that is not the footer link style is a mistake rather than an option.
 */
const FooterLink = forwardRef<HTMLAnchorElement, FooterLinkProps>(function FooterLink(
  { className, ...props },
  ref,
) {
  return (
    <li className={classes.footerLinkItem}>
      <Link ref={ref} variant="secondary" size="md" className={className} {...props} />
    </li>
  )
})

/* ------------------------------------------------------------------ brand */

export interface FooterBrandProps extends BoxProps {
  /** The logo lockup. Figma's is 134×48. */
  logo?: ReactNode
  /** The postal address, as its own block. */
  address?: ReactNode
  /**
   * Figma's `Social Row` — six 24px icons, 16px apart.
   *
   * Pass the icons. Brand marks are trademarked assets belonging to the application rather than to a design
   * system, so none are bundled; `Footer.Social` only lays them out and gives each one a label.
   */
  social?: ReactNode
  children?: ReactNode
}

const FooterBrand = forwardRef<HTMLDivElement, FooterBrandProps>(function FooterBrand(
  { logo, address, social, className, children, ...props },
  ref,
) {
  return (
    <Box ref={ref} className={[classes.footerBrand, className].filter(Boolean).join(' ')} {...props}>
      {logo ? <div className={classes.footerLogo}>{logo}</div> : null}
      {address ? <address className={classes.footerAddress}>{address}</address> : null}
      {children}
      {social ? <div className={classes.footerSocial}>{social}</div> : null}
    </Box>
  )
})

/* ------------------------------------------------------------------ footer */

export interface FooterProps extends BoxProps, ElementProps<'footer'> {
  /**
   * Figma's `Page Action Section` — the grey band above the footer proper, holding a centred heading and a
   * signup field. A `Section` with a `Form` in it is what goes here.
   */
  cta?: ReactNode
  /**
   * Figma's `Number Footer` — the blue strip of figures between the CTA and the dark band. A `StatBar`.
   */
  stats?: ReactNode
  /** `Footer.Brand`, which Figma puts first in the second row of columns. */
  brand?: ReactNode
  /** `Footer.Column`s. They lay out in a grid that reflows on its own. */
  children?: ReactNode
  /** Figma's `Subfooter Content` — the copyright and legal links along the bottom. */
  legal?: ReactNode
  /**
   * The dark band's artwork — Figma layers a bubble image behind the content. Not bundled, for the reason
   * the Hero's is not: it is a multi-megabyte asset that belongs to the page, not inside a component's
   * JavaScript. Pass an `img` or a `video`; without one the band is its own dark ground and the vignette.
   *
   * Decorative, so it is `aria-hidden` and outside the tab order.
   */
  backdrop?: ReactNode
}

const FooterBase = forwardRef<HTMLElement, FooterProps>(function Footer(
  { cta, stats, brand, children, legal, backdrop, className, ...props },
  ref,
) {
  return (
    <Box
      component="footer"
      ref={ref}
      className={[classes.footerRoot, className].filter(Boolean).join(' ')}
      {...props}
    >
      {cta ? <div className={classes.footerCta}>{cta}</div> : null}
      {stats ? <div className={classes.footerStats}>{stats}</div> : null}

      {/* The dark band. Its own element, so the two bands above it keep their own backgrounds. */}
      <div className={classes.footerBase}>
        {backdrop ? (
          <div className={classes.footerBackdrop} aria-hidden>
            {backdrop}
          </div>
        ) : null}
        <div className={classes.footerInner}>
          {brand || children ? (
            <div className={classes.footerColumns}>
              {brand}
              {children}
            </div>
          ) : null}
          {legal ? <div className={classes.footerLegal}>{legal}</div> : null}
        </div>
      </div>
    </Box>
  )
})

/**
 * Footer — Figma `LRDC footer` component set (node `16288:12662`).
 *
 * Three stacked bands, which Figma draws as one component:
 *
 * | Figma | Prop | What it is |
 * | --- | --- | --- |
 * | `Page Action Section` | `cta` | A grey band with a heading and a signup field |
 * | `Number Footer` | `stats` | A blue strip of figures |
 * | `Footer LRDC Base` | `brand`, children, `legal` | The dark footer proper |
 * | Its bubble artwork | `backdrop` | Not bundled; pass the asset |
 * | `Property 1` — Desktop / Mobile | **responsive**, no prop | |
 *
 * ```tsx
 * <Footer
 *   brand={<Footer.Brand logo={<Logo />} address="1400 Montefino Avenue…" social={socialIcons} />}
 *   legal={<>© 2026 Liferay, Inc. <Link href="/privacy">Privacy</Link></>}
 * >
 *   <Footer.Column title="Getting Started">
 *     <Footer.Link href="/trial">Start a trial</Footer.Link>
 *     <Footer.Link href="/docs">Documentation</Footer.Link>
 *   </Footer.Column>
 * </Footer>
 * ```
 *
 * The top two bands are **slots rather than built in**, because they are separate sections that happen to
 * sit above a footer: the CTA is a `Section` with a `Form`, and the stats strip is a `StatBar`. Building
 * them in would mean a second, worse copy of two components that already exist — and plenty of pages want
 * the footer without either.
 *
 * ## The columns reflow without a breakpoint
 *
 * Figma has a Desktop cell with nine columns across two rows and a Mobile cell 4,828px tall with everything
 * stacked. Rather than switch between those two, the columns are a grid of `minmax(214px, 1fr)` tracks —
 * 214px being Figma's own column width — so the count follows the space: nine across on a wide page, one on
 * a phone, and the sensible number at every width in between. Figma's two cells are the two ends of that.
 *
 * ## Semantics
 *
 * A real `<footer>`, with each column's links in a `<ul>` — a list of links is a list, and a screen reader
 * announcing "list, 7 items" is how someone knows how much is in a column before reading it. The address is
 * an `<address>`. Column headings are real headings at `order`, defaulting to `h3`.
 *
 * Every link is `Link variant="secondary" size="md"`, which is what the file draws, and neither is exposed:
 * a footer link in another style is a mistake rather than a choice.
 *
 * ## About `Action/Neutral/Inverted`
 *
 * The column titles and the address bind to `Action/Neutral/Inverted`, the token that is `#ffffff` in both
 * colour modes — the one that made the `neutral` button and the `secondary` link invisible in light mode.
 * Here it is **correct**: this band is dark in both modes by design, since it carries the dark bubble
 * artwork. It is the one place in the library where that token behaves.
 */
export const Footer = Object.assign(FooterBase, {
  Column: FooterColumn,
  Link: FooterLink,
  Brand: FooterBrand,
})
