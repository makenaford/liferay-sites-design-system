import type { ReactNode } from 'react'
import { Box, useComputedColorScheme } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { useReducedMotion } from '@mantine/hooks'
import classes from '../../theme/components.module.css'

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
  video?: string
  /** A still for the video's first frame, shown while it loads. */
  videoPoster?: string
  /** Figma's `Alignnemt` axis. `center` centres the column and its text. */
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
 * | `Type` — Default / Full Bubble / Corner Bubble | `background="none" \| "full" \| "corner"` |
 * | `Alignnemt` — Left / Center | `align` |
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
 *   label={<Label size="sm" variant="outline">Platform</Label>}
 *   title={<h1>One platform, every channel</h1>}
 *   description="Build once, deliver everywhere."
 *   actions={<Button>Book a demo</Button>}
 *   media={<img src={shot} alt="" />}
 * />
 * ```
 *
 * Figma's `Form` and `Guide` cells are compositions rather than variants — a hero with a form instead of
 * buttons, and a hero with no media — so they are stories, the same way the Card's five types are.
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
 * It also only plays on the **dark** canvas. The two files that ship are dark-canvas assets — Figma
 * names the component `Dark Bubble Animation` — and on a light page they read as a dark blob rather than
 * a light source. Light mode gets the gradient. A light-theme export would close that gap; see
 * README.md.
 */
export function Hero({
  background = 'none',
  video,
  videoPoster,
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
   * Three conditions, each for its own reason. There has to be a file. The background has to be a
   * bubble. Nobody has asked for less motion. And the canvas has to be the dark one: Figma calls the
   * component `Dark Bubble Animation`, and it is — a bright sphere on a near-black ground, which over a
   * light page paints a dark blob with a visible frame edge instead of a light source. Light mode gets
   * the gradient, which is built from the same tokens and reads correctly there.
   */
  const showVideo =
    Boolean(video) && background !== 'none' && !reducedMotion && scheme === 'dark'

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
          {showVideo ? (
            <video
              className={classes.heroVideo}
              src={video}
              poster={videoPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
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
