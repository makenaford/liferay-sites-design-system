import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/** Which side the media sits on — Figma's `Content Left Image` and `Content- Right Image` types. */
export type ContentMediaSide = 'left' | 'right'
export type ContentMediaRatio = '3:2' | '16:9'

export interface ContentMediaProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /** The image, video, or anything else that belongs in the media column. */
  media?: ReactNode
  /** @default 'left' */
  mediaSide?: ContentMediaSide
  /** The media box's ratio, from `card-image`'s own axis. @default '3:2' */
  mediaRatio?: ContentMediaRatio
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
