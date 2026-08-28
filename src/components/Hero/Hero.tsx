import { useEffect, useState, type ReactNode } from 'react'
import { Box, useComputedColorScheme } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { useReducedMotion } from '@mantine/hooks'
import classes from '../../theme/components.module.css'

/**
 * What the hero will take for an animation or its poster.
 *
 * A URL, or a file — so a builder can hand over what someone just picked from disk without first
 * uploading it somewhere and passing back a string. `readonly (…)[]` is there because a file input
 * hands you a list, and taking the first of it here saves every call site the same unwrapping.
 */
export type HeroMediaSource = string | File | Blob | readonly (string | File | Blob)[]

/** A list from a file input collapses to its first entry; everything else is already one thing. */
const first = (source?: HeroMediaSource) =>
  (Array.isArray(source) ? source[0] : source) as string | File | Blob | undefined

/**
 * Whether a source points at something that moves.
 *
 * A file says so itself, in its MIME type. A URL is judged by its extension — the same rule
 * `page-schema.ts` uses for its media refs, inferred rather than declared, so swapping a still for a
 * motion version stays a one-field change. An object URL has no extension, which is why the file's own
 * type has to be asked first.
 */
function isMotion(source?: HeroMediaSource) {
  const value = first(source)
  if (!value) return false
  if (typeof value !== 'string') return value.type.startsWith('video/')
  return /\.(webm|mp4)(\?|#|$)/i.test(value)
}

/**
 * A source as something `src` will take.
 *
 * A string passes through. A file becomes an object URL, revoked when it changes or the hero unmounts —
 * without that every re-pick leaks the last one, and a video file is not a small thing to leak.
 */
function useMediaUrl(source?: HeroMediaSource) {
  const value = first(source)
  const [url, setUrl] = useState(typeof value === 'string' ? value : undefined)

  useEffect(() => {
    if (!value) {
      setUrl(undefined)
      return undefined
    }

    if (typeof value === 'string') {
      setUrl(value)
      return undefined
    }

    const objectUrl = URL.createObjectURL(value)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [value])

  return url
}

export type HeroBackground = 'none' | 'full' | 'corner'
export type HeroAlign = 'left' | 'center'

export interface HeroProps extends BoxProps, Omit<ElementProps<'section'>, 'title'> {
  /**
   * Figma's `Type` axis, and the spreadsheet's Background column: `full` is Bubble Full, `corner` is
   * Corner Bubble, `none` is the plain surface.
   *
   * Each renders a radial gradient built from the brand tokens. Pass `video` to play the matching webm
   * over it — the gradient is then the poster and the reduced-motion fallback, so the hero is never
   * empty and never depends on the file arriving.
   */
  background?: HeroBackground
  /**
   * The bubble animation. `assets/bubbles/bubble_center.webm` goes with `background="full"` and
   * `bubble_corner.webm` with `background="corner"`.
   *
   * Deliberately not bundled: it is 2MB, and a component library should not put that inside anyone's
   * JavaScript. Import it with your bundler or serve it from your public directory, and pass the URL.
   */
  video?: HeroMediaSource
  /**
   * What stands in for the animation until it can play — and if it never can.
   *
   * An image *or* a video. HTML's own `poster` attribute takes an image only, so a moving poster is
   * rendered as a second video behind the first and swapped out on `canplay`; a still goes on the
   * attribute as before. Which one you passed is inferred from the extension.
   */
  videoPoster?: HeroMediaSource
  /**
   * The light scheme's animation.
   *
   * A second file rather than one that works in both: the dark bubble is a bright sphere on near-black
   * and is composited with `screen`, which drops the ground and keeps the light. Over a light page that
   * paints a dark blob with a visible frame edge, so light mode had no video at all until there was an
   * asset drawn for it. Without this, light mode still falls back to the gradient.
   */
  videoLight?: HeroMediaSource
  /** The same for `videoLight`, and it may move too. */
  videoLightPoster?: HeroMediaSource
  /**
   * `center` centres the column and its text.
   *
   * **The file no longer draws this.** `Alignnemt` was Left / Center; every cell in the set is now
   * `Left`, so `center` is a capability the design does not currently exercise — kept because it works,
   * is a common hero shape, and removing it would break callers to satisfy an axis that may well come
   * back. Code Connect does not offer it. Recorded in README.md.
   */
  align?: HeroAlign
  /**
   * A full-width band above the content and the media, centred in the hero's own gutters. The Home
   * page (node `24563:52720`) draws a solution finder there — a 1000px bar sitting over the bubble,
   * above the heading and spanning both columns — which none of the content slots can hold, because
   * every one of them lives inside the left column.
   *
   * It is the hero's first child in the reading order, so put something that introduces the page in
   * it, not an afterthought.
   */
  banner?: ReactNode
  /** Above the heading — a `Label`, an eyebrow, a breadcrumb. */
  label?: ReactNode
  /**
   * The heading. Pass a real `h1` — the hero does not choose a heading level for you, because only the
   * page knows whether this is its first heading. Named `title` for the slot it fills, not the `title`
   * attribute.
   */
  title?: ReactNode
  /** A line or two under the heading. */
  description?: ReactNode
  /** Buttons and links, in the order they should be read. */
  actions?: ReactNode
  /**
   * The `Form` type: an email field with a contained button, in place of the buttons. Both can be
   * present, but one of them is usually the point.
   */
  form?: ReactNode
  /** The Gartner logo and its tags, or any other proof that sits under the actions. */
  proof?: ReactNode
  /** Figma's `Image=Yes`: the media column beside the content. An image, a video card, anything. */
  media?: ReactNode
  children?: ReactNode
}

/**
 * Hero — Figma `Hero` component set (node `19110:9503`), with the slots the accompanying spreadsheet
 * lists.
 *
 * | Source | Prop |
 * | --- | --- |
 * | `Type` — Default / Minimal / Corner Bubble / Full Bubble / Form | `background`, and the slots each cell fills |
 * | `Alignnemt` — Left only, since `Center` was dropped | `align`, which still supports `center` |
 * | `Image` — Yes / No | `media` |
 * | `Size` — Desktop / Mobile | **responsive**, a media query at 1200px |
 * | `Theme` — Dark / Light | the colour scheme, not a prop |
 * | Label, Header, Description, Button(s), Link | `label`, `title`, `description`, `actions` |
 * | A band above both columns (Home's solution finder) | `banner` |
 * | Input with button | `form` |
 * | Gartner logo and tags | `proof` |
 *
 * ```tsx
 * import bubble from '../assets/bubbles/bubble_corner.webm'
 *
 * <Hero
 *   background="corner"
 *   video={bubble}
 *   label={<Label size="sm" variant="gradient">Platform</Label>}
 *   title={<h1>One platform, every channel</h1>}
 *   description="Build once, deliver everywhere."
 *   actions={<Button>Book a demo</Button>}
 *   media={<img src={shot} alt="" />}
 * />
 * ```
 *
 * Figma's `Form` and `Minimal` cells are compositions rather than variants — a hero with a form instead
 * of buttons, and a hero with a corner bubble and nothing but a heading and a line of text — so they are
 * stories, the same way the Card's five types are. (`Minimal` is the cell that used to be called `Guide`;
 * its placeholder still says so.)
 *
 * ## The bubble
 *
 * The background is a gradient in CSS and a webm on top of it. That ordering matters: the gradient
 * needs no network, survives a blocked or slow video, and is what shows when someone has asked for less
 * motion — in which case the video is **not rendered at all**, so it is never even fetched. An
 * autoplaying 2MB loop is exactly what `prefers-reduced-motion` is for.
 *
 * The video is decorative: `aria-hidden`, muted, `playsinline`, and outside the tab order. Nothing in it
 * carries meaning, so there is nothing to caption.
 *
 * **Each canvas has its own file.** `video` is the dark one — Figma names the component `Dark Bubble
 * Animation` — a bright sphere on near-black, composited with `screen`. `videoLight` is its inverse, a
 * coloured bubble on white, composited with `multiply`. Neither substitutes for the other: the dark
 * asset over a light page reads as a dark blob rather than a light source, which is why light mode had
 * only the gradient until there was an export drawn for it. A scheme with no file still gets the
 * gradient, which is built from the same tokens.
 */
export function Hero({
  background = 'none',
  video,
  videoPoster,
  videoLight,
  videoLightPoster,
  align = 'left',
  banner,
  label,
  title,
  description,
  actions,
  form,
  proof,
  media,
  children,
  className,
  ...props
}: HeroProps) {
  const reducedMotion = useReducedMotion()
  const scheme = useComputedColorScheme('dark')
  /**
   * Each scheme has its own file, and neither is a fallback for the other.
   *
   * Figma calls the dark one `Dark Bubble Animation` and it is exactly that — a bright sphere on a
   * near-black ground, composited with `screen`. Over a light page that paints a dark blob with a
   * visible frame edge, which is why light mode had no video for so long. It has its own asset now, and
   * a scheme with no file still falls back to the gradient, which is built from the same tokens.
   */
  const sourceRef = scheme === 'dark' ? video : videoLight
  const posterRef = scheme === 'dark' ? videoPoster : videoLightPoster
  const source = useMediaUrl(sourceRef)
  const poster = useMediaUrl(posterRef)
  const showVideo = Boolean(source) && background !== 'none' && !reducedMotion

  /*
   * A moving poster cannot go on the `poster` attribute — HTML takes an image there and nothing else.
   * So it becomes a second video *behind* the first, and the first is transparent until it can play.
   *
   * `ready` is what swaps them and `failed` is what stops the swap ever happening: the animation is the
   * enhancement, the poster is the page, and a file that 404s should leave the poster up rather than a
   * hole. Both reset when the source changes, which is what a scheme flip does.
   */
  const motionPoster = isMotion(posterRef)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setReady(false)
    setFailed(false)
  }, [source])

  const showPoster = motionPoster && (!ready || failed)

  return (
    <Box
      component="section"
      className={[classes.hero, className].filter(Boolean).join(' ')}
      data-background={background === 'none' ? undefined : background}
      data-align={align === 'center' ? 'center' : undefined}
      data-with-media={media ? true : undefined}
      data-with-banner={banner ? true : undefined}
      {...props}
    >
      {background === 'none' ? null : (
        <div className={classes.heroBubble} aria-hidden>
          {showVideo && motionPoster ? (
            <video
              className={classes.heroVideo}
              data-scheme={scheme}
              src={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              /*
               * Faded rather than `hidden`: a `display: none` video is not reliably allowed to autoplay,
               * and this one has to be running before it is seen or the swap shows a frozen frame.
               */
              data-idle={!showPoster || undefined}
              key={`poster-${poster}`}
            />
          ) : null}

          {showVideo && !failed ? (
            <video
              className={classes.heroVideo}
              /* The two are composited differently; the stylesheet keys off this. */
              data-scheme={scheme}
              src={source}
              poster={motionPoster ? undefined : poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              data-idle={showPoster || undefined}
              onCanPlay={() => setReady(true)}
              onError={() => setFailed(true)}
              /* Remount on a scheme change: a `src` swap alone leaves the old frames on screen. */
              key={source}
            />
          ) : null}
        </div>
      )}

      {banner ? <div className={classes.heroBanner}>{banner}</div> : null}

      <div className={classes.heroInner}>
        <div className={classes.heroContent}>
          {label ? <div className={classes.heroLabel}>{label}</div> : null}
          {title ? <div className={classes.heroTitle}>{title}</div> : null}
          {description ? <div className={classes.heroDescription}>{description}</div> : null}
          {form ? <div className={classes.heroForm}>{form}</div> : null}
          {actions ? <div className={classes.heroActions}>{actions}</div> : null}
          {proof ? <div className={classes.heroProof}>{proof}</div> : null}
          {children}
        </div>

        {media ? <div className={classes.heroMedia}>{media}</div> : null}
      </div>
    </Box>
  )
}
