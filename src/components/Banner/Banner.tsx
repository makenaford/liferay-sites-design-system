import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { IconClose } from '../../icons'
import classes from '../../theme/components.module.css'

/**
 * The wash behind the band.
 *
 * All three are the same construction — a token mixed into the page background at a single-digit
 * percentage — so the banner is always a tint of the page it sits on rather than a colour of its own.
 * That is what keeps it quiet on both the light and the dark canvas without a second set of values.
 */
export type BannerTone = 'brand' | 'accent' | 'neutral'
export type BannerAlign = 'center' | 'left'
export type BannerPosition = 'static' | 'sticky'

export interface BannerProps extends BoxProps, Omit<ElementProps<'aside'>, 'title'> {
  /**
   * The wash and the pill colour.
   *
   * `brand` is a blue tint across the band. `accent` carries it from blue to `Accent/Product Accent`,
   * the same blue→purple move the gradient `Label` makes, for a campaign that wants to be told apart
   * from the ordinary release note. `neutral` is the quietest — a grey tint for something procedural,
   * like a maintenance window.
   *
   * @default 'brand'
   */
  tone?: BannerTone
  /**
   * The pill before the message — `New`, `Event`, `Beta`. Two or three words at most: it is a
   * category, not a headline.
   *
   * Real text rather than a colour, so the category survives for a screen reader and for anyone who
   * cannot separate the three tones by eye.
   */
  label?: ReactNode
  /** A glyph before the pill. One of the 20px icons; it is decorative and hidden from assistive tech. */
  icon?: ReactNode
  /** The announcement itself. One sentence — the band is 40px and does not grow gracefully. */
  children?: ReactNode
  /**
   * Where the announcement leads — a `Link`, normally. It sits inline after the message on a wide
   * band and wraps under it on a narrow one.
   */
  action?: ReactNode
  /**
   * Show the dismiss button and call this when it is pressed.
   *
   * The banner does **not** then hide itself, and does not remember the dismissal: whether an
   * announcement stays gone for this browser, this session or this account is a question about the
   * announcement, not about the band, and the caller is the only one who knows its identity. Drop the
   * banner from the tree in response, and persist that decision however the site persists anything.
   */
  onClose?: () => void
  /** The dismiss button's accessible name. @default 'Dismiss announcement' */
  closeLabel?: string
  /**
   * Centred under the band, or ranged left in the page gutter with the dismiss button pushed to the
   * far edge. Centred reads as an announcement; left reads as part of the page.
   *
   * @default 'center'
   */
  align?: BannerAlign
  /**
   * `sticky` keeps the band at the top of the viewport as the page scrolls.
   *
   * @default 'static'
   */
  position?: BannerPosition
  /** The content's ceiling, matching whatever the page uses. @default 1280 */
  maxWidth?: number | string
  /** The accessible name of the region. @default 'Announcement' */
  regionLabel?: string
}

/**
 * Banner — the announcement band across the top of the site.
 *
 * A 40px strip above the header holding one sentence, an optional category pill, one link and a
 * dismiss button. It is the first thing in the document and the first thing read, so it is deliberately
 * the quietest coloured surface in the library: a tint of the page background, a hairline underneath,
 * and no shadow.
 *
 * ```tsx
 * <Banner label="New" action={<Link href="/releases" size="sm">Read the release notes</Link>} onClose={dismiss}>
 *   Liferay DXP 2026.Q3 is generally available.
 * </Banner>
 * ```
 *
 * **Not in Figma.** Every other component here traces to a node in `Solutions Library- 2026`; this one
 * has no cell in the file yet, so its axes are proposals rather than transcriptions and it has no Code
 * Connect mapping. Recorded in README.md. If a Banner is drawn later, the axes to reconcile are the
 * three tones and the two alignments.
 *
 * ## The gradient is a tint, not a fill
 *
 * The wash is two stops of `color-mix()` against `Surfaces/Page BG base/Default` — the brand at 10%
 * on one side and 4% or the product accent on the other. Mixing rather than picking a pale token is
 * what lets one declaration serve both colour schemes: on the light canvas the result is a barely-blue
 * white, on the dark one a barely-blue near-black, and neither has to be maintained separately. It is
 * also why the band never fights the `Header` above it, whose glass is the same page background at 60%.
 *
 * ## Where it goes relative to the header
 *
 * With a **static** header, put the banner immediately before it and both scroll away together.
 *
 * With a **fixed** header the banner cannot simply precede it — the header is pinned to the viewport's
 * top edge and would cover it. Put the two in one fixed container instead:
 *
 * ```tsx
 * <div style={{ position: 'fixed', insetInline: 0, insetBlockStart: 0, zIndex: 200 }}>
 *   <Banner …>…</Banner>
 *   <Header position="static" …/>
 * </div>
 * ```
 *
 * `position="sticky"` is for the third case: a banner that outlives the header, pinning to the top of
 * the viewport while a static header scrolls past it.
 *
 * ## What it is not
 *
 * Not a live region. The band is present when the page loads, so announcing it as if it had just
 * arrived would interrupt a screen reader for something the reading order already reaches first. It is
 * a labelled `aside`, which lands in the landmark list. A message about something that *just happened*
 * — a save that failed, a page that published — is a different component and wants `role="status"`.
 */
export const Banner = forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    tone = 'brand',
    label,
    icon,
    children,
    action,
    onClose,
    closeLabel = 'Dismiss announcement',
    align = 'center',
    position = 'static',
    maxWidth = 1280,
    regionLabel = 'Announcement',
    className,
    style,
    ...props
  },
  ref,
) {
  return (
    <Box
      component="aside"
      ref={ref}
      aria-label={regionLabel}
      className={[classes.banner, className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-align={align}
      data-position={position}
      style={{
        '--sds-banner-max': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        ...style,
      }}
      {...props}
    >
      <div className={classes.bannerInner}>
        {icon ? (
          <span className={classes.bannerIcon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {label ? <span className={classes.bannerLabel}>{label}</span> : null}
        <p className={classes.bannerMessage}>{children}</p>
        {action ? <span className={classes.bannerAction}>{action}</span> : null}
      </div>
      {onClose ? (
        <button type="button" className={classes.bannerClose} onClick={onClose} aria-label={closeLabel}>
          <IconClose />
        </button>
      ) : null}
    </Box>
  )
})
