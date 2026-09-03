import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/** Which side the media sits on — Figma's `Content Left Image` and `Content- Right Image` types. */
export type ContentMediaSide = 'left' | 'right'
export type ContentMediaRatio = '3:2' | '16:9' | 'auto'

export interface ContentMediaProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /** The image, video, or anything else that belongs in the media column. */
  media?: ReactNode
  /** @default 'left' */
  mediaSide?: ContentMediaSide
  /**
   * The media box's ratio, from `card-image`'s own axis. `auto` takes the ratio off and lets the
   * column be as tall as what is in it — which is what the Home page's `Different Teams. One
   * Platform.` needs, because its right column is an image *and* a row of stats under it, and a
   * fixed 3:2 box clips the second half.
   *
   * @default '3:2'
   */
  mediaRatio?: ContentMediaRatio
  /**
   * The media holds the top of the row while the text column scrolls past it.
   *
   * Worth it where the two columns are very different heights — a panel whose accordion opens and
   * closes grows by a paragraph at a time, and the picture otherwise drifts out of view halfway through
   * reading about it. Off by default: on two columns of similar height it is motion with nothing to
   * gain, and the row stops centring them.
   *
   * Ignored below the stacking breakpoint, where the figure sits above the text and has nothing to
   * stick beside.
   */
  stickyMedia?: boolean
  /** Above the heading — a `Label`, an eyebrow. */
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** Figma's `Action section`: a link, a button, or both. */
  actions?: ReactNode
  /** The heading level. @default 3 — it sits under a `SectionTitle`'s `h2` more often than not. */
  order?: 2 | 3 | 4 | 5 | 6
  /** Anything else in the text column, under the description. */
  children?: ReactNode
}

/**
 * ContentMedia — Figma's `Content Left Image` and `Content- Right Image` sections (`17892:146518`).
 *
 * Two equal columns 40px apart: a 3:2 media box and a text column of heading, description and actions.
 * `Section Content` is 1280 wide holding two 620s, both growing, which is a plain two-up.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Type=Content Left Image` / `Content- Right Image` | `mediaSide` |
 * | `card-image` `Ratio` | `mediaRatio` |
 * | `Content Block` — `card-header` gap 8, `Action section` at gap 24 | `title`, `description`, `actions` |
 * | `Content` gap 40 | fixed |
 *
 * ```tsx
 * <ContentMedia
 *   mediaSide="right"
 *   media={<Image src={shot} alt="" ratio="3:2" radius="md" />}
 *   title="One platform, every channel"
 *   description="Build once and deliver everywhere."
 *   actions={<Link href="#">Read the docs</Link>}
 * />
 * ```
 *
 * Below 900px of **section** width it stacks, and **each side keeps its own reading order**: a left-image block leads with its
 * image, a right-image block leads with its words. Collapsing both the same way would throw away the only
 * thing that distinguishes the two Figma types.
 */
export const ContentMedia = forwardRef<HTMLDivElement, ContentMediaProps>(function ContentMedia(
  {
    media,
    mediaSide = 'left',
    mediaRatio = '3:2',
    stickyMedia,
    eyebrow,
    title,
    description,
    actions,
    order = 3,
    children,
    className,
    ...props
  },
  ref,
) {
  const Heading = `h${order}` as 'h3'

  return (
    <Box
      ref={ref}
      className={[classes.contentMediaRoot, className].filter(Boolean).join(' ')}
      data-media-side={mediaSide}
      data-sticky={stickyMedia || undefined}
      {...props}
    >
      {media ? (
        <div className={classes.contentMediaFigure} data-ratio={mediaRatio}>
          {media}
        </div>
      ) : null}

      <div className={classes.contentMediaText}>
        {eyebrow ? <div className={classes.contentMediaEyebrow}>{eyebrow}</div> : null}
        {title || description ? (
          <div className={classes.contentMediaHeader}>
            {title ? <Heading className={classes.contentMediaHeading}>{title}</Heading> : null}
            {description ? (
              <p className={classes.contentMediaDescription}>{description}</p>
            ) : null}
          </div>
        ) : null}
        {children}
        {actions ? <div className={classes.contentMediaActions}>{actions}</div> : null}
      </div>
    </Box>
  )
})
