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
   * **A still works here too.** Pass a `.png`/`.jpg`/`.webp` — or a `File` that is one — and the bubble
   * renders as an `img` under the same geometry and masks, since those are shape and not motion. Which
   * one you passed is inferred, so a still and an animation are interchangeable in this slot. A still is
   * also the one bubble `prefers-reduced-motion` does not suppress: there is nothing moving to suppress.
   *
   * Deliberately not bundled: it is 2MB, and a component library should not put that inside anyone's
   * JavaScript. Import it with your bundler or serve it from your public directory, and pass the URL.
   */
  video?: HeroMediaSource
  /**
   * The same animation exported for the light canvas — `bubble_center_light.webm` with
   * `background="full"` and `bubble_corner_light.webm` with `background="corner"`.
   *
   * Two files rather than one, because the artwork is the ground it is drawn on: `video` is a bright
   * sphere on black, `videoLight` a coloured one on white, and each is painted plainly, so neither
   * survives being put on the other's page. The hero picks by the computed colour scheme and remounts
   * on a flip. Pass only `video` and the light canvas falls back to the gradient, which is built from
   * the same tokens.
   */
  videoLight?: HeroMediaSource
  /**
   * What stands in for the animation until it can play — and if it never can.
   *
   * An image *or* a video. HTML's own `poster` attribute takes an image only, so a moving poster is
   * rendered as a second video behind the first and swapped out on `canplay`; a still goes on the
   * attribute as before. Which one you passed is inferred from the extension.
   */
  /**
   * Draw the bubble instead of playing a file — the prototype the bubble lab exists to judge.
   *
   * Five translucent gradient waves, stacked and drifting at different phases, after the construction
   * loading.io's `wave` background uses: the depth is the *overlap* of translucent layers rather than
   * any one layer's fill, which is what a stack of radial gradients cannot do — those average toward
   * grey where they meet, these keep building colour.
   *
   * SVG rather than pseudo-elements: there are five layers and an element has two pseudos, and the
   * stops read the same tokens the rest of the hero does, which a `background-image` data URI cannot.
   * `preserveAspectRatio="none"`, so the waves stretch to whatever hero they are in — which is the whole
   * argument for drawing the bubble rather than exporting it.
   *
   * Not documented for callers yet, and off unless asked for. It is a prototype until a designer says
   * otherwise.
   */
  drawn?: boolean
  videoPoster?: HeroMediaSource
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
  /**
   * The entrance: each part of the hero fades up as the page arrives, a beat after the one before it.
   *
   * Off by default. A hero is the first thing on a page and the animation plays on load, so it is the
   * one piece of motion in the library with no second chance to be judged — a docs page or an app shell
   * that happens to use this component should not get it uninvited. `Templates/Home` and `PageRenderer`
   * turn it on.
   *
   * The order is the reading order — banner, label, heading, description, form, actions, proof — because
   * the delays come from the DOM rather than from a list of slots, so a hero without a label starts its
   * cascade at the heading instead of holding an empty beat for the part that is not there.
   *
   * Nothing under `prefers-reduced-motion`: the parts are simply there.
   *
   * @default false
   */
  entrance?: boolean
  /** Figma's `Image=Yes`: the media column beside the content. An image, a video card, anything. */
  media?: ReactNode
  children?: ReactNode
}

/*
 * One wave, twice as wide as it is shown.
 *
 * Two full periods across the 200-unit box, so translating by exactly 100 lands the second period where
 * the first was and the loop has no seam. `a` is the amplitude and `y` the rest height; every layer is
 * the same curve at a different height, amplitude and phase, which is what keeps five of them reading
 * as one moving field rather than as five separate ribbons.
 */
/*
 * A wave edge, and the body it closes into.
 *
 * Two full periods across the 200-unit box, so translating by exactly 100 lands the second period where
 * the first was and the loop has no seam. `to` is where the shape closes — below its own curve for a
 * wave that hangs downward, above it for one that hangs up — which is what lets two of them face each
 * other across an empty middle.
 */
const wave = (y: number, a: number, to: number) =>
  `M0 ${y} C 25 ${y - a}, 75 ${y + a}, 100 ${y} S 175 ${y + a}, 200 ${y} L200 ${to} L0 ${to} Z`

/*
 * `Type=Full Bubble` — two overlapping waves hanging from the top of the page.
 *
 * Both start at the top edge and close on their own curve, so the shape is the *upper* part of the hero
 * and the curve is its lower edge. They overlap: different crest heights, different amplitudes and a
 * half-period offset, so the two curves cross and the band doubles where they do. With two layers that
 * crossing is the only place depth can come from, which makes the phases matter more than the fills.
 *
 * Nothing fades them. The gradient does it itself — see `ARC` — which is the whole reason it is worth
 * using verbatim rather than rebuilt out of stops.
 */
const FULL_LAYERS = [
  /* `mesh` and `fade` are the corner field's business; `full` paints `ARC` and needs neither. */
  { y: 86, a: 18, to: -60, fade: 140, phase: 0, time: '37s', mesh: 'a' as const },
  { y: 106, a: 24, to: -60, fade: 140, phase: -100, time: '53s', mesh: 'b' as const },
]

/*
 * `Type=Corner Bubble` — five layers, back to front, after loading.io's own `Layer 5`. Each carries its
 * own height, amplitude and period; none of the periods divide into another, so the field never returns
 * to an arrangement anyone will sit through twice.
 */
const CORNER_LAYERS = [
  { y: 74, a: 26, to: 140, fade: 200, phase: 0, time: '31s', mesh: 'a' as const },
  { y: 62, a: 20, to: 140, fade: 200, phase: 0, time: '43s', mesh: 'b' as const },
  { y: 84, a: 30, to: 140, fade: 200, phase: 0, time: '37s', mesh: 'a' as const },
  { y: 96, a: 22, to: 140, fade: 200, phase: 0, time: '53s', mesh: 'b' as const },
  { y: 108, a: 16, to: 140, fade: 200, phase: 0, time: '47s', mesh: 'a' as const },
]

/*
 * The arc: the design's own gradient, transcribed rather than re-derived.
 *
 * ```
 * radial-gradient(339.71% 100.1% at 46.74% 0%,
 *   #000111 0%, #00010F 33.07%, #12096B 53.11%, #2712D8 61.87%,
 *   #175FE4 69.66%, #A71BF5 74.76%, #0429BD 75%, #01024C 76%, #00010F 93.75%)
 * ```
 *
 * A very wide ellipse centred on the **top edge**, dark at both ends and carrying its colour in a band
 * between 53% and 76% of the way out: navy into indigo, indigo into electric blue, and then a single
 * violet spike at 74.76% that falls back to deep blue within a quarter of a percent. That spike is the
 * whole character of it — a hard edge inside a soft field — and it is the reason this is copied stop for
 * stop instead of approximated.
 *
 * It is also why nothing here needs a fade mask. The gradient's own ends are `#000111` and `#00010F`,
 * which is the page ground to within a couple of units, so it arrives at the background on its own —
 * above the band where the content is, and below it at the foot.
 *
 * SVG has no two-radius radial, so the ellipse is a circle of `ry` with a `gradientTransform` scaling
 * `rx / ry` across. `userSpaceOnUse`, so both waves share one geometry measured on the hero rather than
 * each getting its own relative to its own bounding box.
 */
const ARC = [
  { at: '0%', color: '#000111' },
  { at: '33.07%', color: '#00010F' },
  { at: '53.11%', color: '#12096B' },
  { at: '61.87%', color: '#2712D8' },
  { at: '69.66%', color: '#175FE4' },
  { at: '74.76%', color: '#A71BF5' },
  { at: '75%', color: '#0429BD' },
  { at: '76%', color: '#01024C' },
  { at: '93.75%', color: '#00010F' },
]

/* 46.74% of 200, and 339.71% / 100.1% as a ratio across a circle of the vertical radius. */
const ARC_CX = 93.48
const ARC_R = 140.14
const ARC_STRETCH = 4.8481

const MESH = {
  a: [
    { at: '0%', color: 'var(--sds-bubble-magenta)' },
    { at: '38%', color: 'var(--sds-bubble-violet)' },
    { at: '74%', color: 'var(--sds-brand-primary-primary)' },
    { at: '100%', color: 'var(--sds-bubble-sky)' },
  ],
  b: [
    { at: '0%', color: 'var(--sds-bubble-deep)' },
    { at: '32%', color: 'var(--sds-bubble-violet)' },
    { at: '70%', color: 'var(--sds-brand-primary-primary)' },
    { at: '100%', color: 'var(--sds-bubble-sky)' },
  ],
}

/** The drawn bubble: gradient waves over the hero's own surface. */
function HeroWaves({ background }: { background: HeroBackground }) {
  const isFull = background === 'full'
  const layers = isFull ? FULL_LAYERS : CORNER_LAYERS

  return (
    <svg
      className={classes.heroWaves}
      viewBox="0 0 200 140"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        {isFull ? (
          <radialGradient
            id="sds-wave-arc"
            gradientUnits="userSpaceOnUse"
            cx={ARC_CX}
            cy="0"
            r={ARC_R}
            gradientTransform={`translate(${ARC_CX} 0) scale(${ARC_STRETCH} 1) translate(${-ARC_CX} 0)`}
          >
            {ARC.map((stop) => (
              <stop key={stop.at} offset={stop.at} stopColor={stop.color} />
            ))}
          </radialGradient>
        ) : (
          <>
            {layers.map((_, i) => (
              <linearGradient key={`m${i}`} id={`sds-wave-mesh-${i}`} x1="0" y1="0" x2="1" y2="0.3">
                {MESH[layers[i].mesh].map((stop) => (
                  <stop key={stop.at} offset={stop.at} stopColor={stop.color} />
                ))}
              </linearGradient>
            ))}
            {layers.map((layer, i) => (
              <linearGradient
                key={`f${i}`}
                id={`sds-wave-fade-${i}`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="140"
                x2="0"
                y2={layer.fade}
              >
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="46%" stopColor="#fff" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            ))}
            {layers.map((_, i) => (
              <mask
                key={`k${i}`}
                id={`sds-wave-mask-${i}`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="-60"
                width="200"
                height="260"
              >
                <rect x="0" y="-60" width="200" height="260" fill={`url(#sds-wave-fade-${i})`} />
              </mask>
            ))}
          </>
        )}
      </defs>
      {layers.map((layer, i) => (
        <path
          key={i}
          className={classes.heroWave}
          d={wave(layer.y, layer.a, layer.to)}
          fill={isFull ? 'url(#sds-wave-arc)' : `url(#sds-wave-mesh-${i})`}
          mask={isFull ? undefined : `url(#sds-wave-mask-${i})`}
          style={{ animationDuration: layer.time, animationDelay: `${layer.phase / 10}s` }}
        />
      ))}
    </svg>
  )
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
 * Animation` — a bright sphere on near-black; `videoLight` is its inverse, a coloured bubble on white.
 * Each has its ground blended away against the hero's surface, `screen` for one and `multiply` for the
 * other, which is exactly why neither substitutes for the other. The hero picks by the computed colour
 * scheme and remounts on a flip. A scheme with no file gets the gradient, which is built from the same
 * tokens.
 */
/**
 * The heading's highlighted tail — Home's `Launch Digital Experiences That **Convert, Scale and Grow**`.
 *
 * `Brand/Primary/Lighten 1` to `Accent/Product Accent`, clipped to the text, running left to right
 * across it: the gradient `Homepage Redesign` draws on the hero's own heading (node `7655:14922`), which
 * is the only gradient text on that page.
 *
 * **It does not animate.** It did for a day — a sweep travelling along a three-stop gradient — and the
 * file does not draw one: the hero's gradient is a static fill, and a heading that shimmers on its own
 * while the reader is trying to read the first sentence on the page is the animation with the least
 * claim on their attention and the most of it. `animate` is there for the places a sweep *is* wanted;
 * nothing passes it yet, and the note below the component says why.
 *
 * A component rather than a class, because the facts that make it work — the stop order, and the
 * background size the sweep needs — are not things a caller should have to know to use the page's own
 * highlight. It also replaces a Mantine `Text variant="gradient"`, whose gradient is written inline and
 * has two stops, so the stylesheet can neither animate it nor give it the third stop a seamless sweep
 * needs.
 */
export function HeroHighlight({
  children,
  animate,
}: {
  children?: ReactNode
  /**
   * Sweep the gradient along the text, continuously.
   *
   * The sweep needs the gradient to be **three stops rather than two** — `brand → accent → brand`, at
   * two and a half times the text's width. A two-stop gradient slid under a text mask has to jump back
   * when it reaches the end, and at 44px that jump is visible; repeating the first colour at the far end
   * lets the position run from one end to the other and land on an identical picture, so the loop has no
   * seam. `linear`, because an eased sweep reads as something sliding back and forth rather than as
   * light crossing a surface. Off under `prefers-reduced-motion`, where the gradient stays — the colour
   * is what the heading says, and taking it away would change the sentence.
   */
  animate?: boolean
}) {
  return (
    <span className={classes.heroHighlight} data-animate={animate || undefined}>
      {children}
    </span>
  )
}

export function Hero({
  background = 'none',
  video,
  videoLight,
  drawn,
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
  entrance,
  children,
  className,
  ...props
}: HeroProps) {
  const reducedMotion = useReducedMotion()
  const scheme = useComputedColorScheme('dark')
  /*
   * One file per canvas, and the stylesheet blends each one's ground away — `screen` for the black
   * ground of the dark export, `multiply` for the white ground of the light one. Both grounds are pure,
   * which is what makes those blends exact.
   *
   * So the pick below is not interchangeable: the blend that drops black is not the blend that drops
   * white, and each file has to meet the canvas it was drawn for. `videoLight` missing is not a failure
   * — the light canvas falls back to the gradient, which is built from the same tokens.
   */
  const dark = scheme === 'dark'
  const canvas = dark ? video : videoLight
  const source = useMediaUrl(canvas)
  const poster = useMediaUrl(videoPoster)
  /*
   * A still is a bubble too.
   *
   * The geometry and the masks are shape, not motion — they measure where the artwork sits inside its
   * frame, and a PNG exported from the same Figma frame sits in exactly the same place. So the slot
   * takes either, an `img` stands in for the `video`, and `isMotion` decides which.
   *
   * Which is also why `prefers-reduced-motion` only gates the animation. A still bubble is what that
   * preference asks for; suppressing it in favour of the gradient would be answering the preference by
   * throwing away the thing that already honours it.
   */
  const still = Boolean(canvas) && !isMotion(canvas)
  const showBubble = (drawn || Boolean(source)) && background !== 'none' && (still || !reducedMotion || drawn)
  const showVideo = showBubble && !still && !drawn

  /*
   * A moving poster cannot go on the `poster` attribute — HTML takes an image there and nothing else.
   * So it becomes a second video *behind* the first, and the first is transparent until it can play.
   *
   * `ready` is what swaps them and `failed` is what stops the swap ever happening: the animation is the
   * enhancement, the poster is the page, and a file that 404s should leave the poster up rather than a
   * hole. Both reset when the source changes, which is what a scheme flip does.
   */
  const motionPoster = isMotion(videoPoster)
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
      /* Tells the stylesheet to drop the gradient: the artwork is standing in its place. */
      data-video={showBubble || undefined}
      data-bubble-css={drawn || undefined}
      data-align={align === 'center' ? 'center' : undefined}
      data-entrance={entrance || undefined}
      data-with-media={media ? true : undefined}
      data-with-banner={banner ? true : undefined}
      {...props}
    >
      {background === 'none' ? null : (
        /*
         * `data-bubble` is a hook, not a style: the layer is otherwise identifiable only by a hashed
         * CSS-module class, and the bubble lab has to find the element it is measuring without also
         * finding the video in the hero's media column.
         */
        <div className={classes.heroBubble} data-bubble aria-hidden>
          {drawn ? <HeroWaves background={background} /> : null}
          {still && showBubble ? (
            <img
              className={classes.heroVideo}
              src={source}
              alt=""
              /* Decorative, like the animation it stands in for: nothing here carries meaning. */
              aria-hidden
              draggable={false}
              key={source}
            />
          ) : null}

          {showVideo && motionPoster ? (
            <video
              className={classes.heroVideo}
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
              /* Remount on a source change: a `src` swap alone leaves the old frames on screen. */
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
