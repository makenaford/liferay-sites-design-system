import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { useReducedMotion, useUncontrolled } from '@mantine/hooks'
import classes from '../../theme/components.module.css'
import { IconPause, IconPlay } from '../../icons'

/**
 * Figma's `Size` axis on `Logos scrolling section`, as the height of one logo cell: `sm` is its 24px
 * `Mobile` cell, `md` the 49px `Desktop` cell, `lg` the 64px `Size3` cell.
 */
export type MarqueeSize = 'sm' | 'md' | 'lg'
export type MarqueeDirection = 'left' | 'right'

export interface MarqueeProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /**
   * Names the strip for a screen reader — "Customers", "Integrations". Required, and required for the
   * same reason `Image`'s `alt` is: a region with no name tells someone nothing about what it holds.
   */
  label: string
  /** Figma's `Size`, as the logo cell's height. @default 'lg' */
  size?: MarqueeSize
  /** Between logos. Figma's grid uses 60. */
  gap?: number | string
  /**
   * The width of one logo cell. Figma's is 109 and constant across its `Size` axis — the logos are fitted
   * by width and take their height from their own proportions, which is what keeps a row of mismatched
   * wordmarks looking level.
   */
  logoWidth?: number | string
  /**
   * How fast it moves, in **pixels per second** — not a duration. A duration would make the strip speed
   * up as logos are added; pixels per second is the same speed whatever is in it, which is why the
   * animation's duration is measured rather than set.
   *
   * @default 60
   */
  speed?: number
  /** Which way it travels. @default 'left' */
  direction?: MarqueeDirection
  /** Figma's `Overlay`: the strip fades out at both edges. @default true */
  fade?: boolean
  /** How far the fade reaches. Figma's overlay is opaque from 20% to 80%. */
  fadeWidth?: number | string
  /**
   * Figma's one-colour logo treatment: every logo inked in `Surfaces/Text/Primary`, which inverts with
   * the colour scheme — so it covers both the `Theme=Dark` and `Theme=Light` cells at once.
   *
   * It works on SVG that inherits `currentColor`, or on any image, which it renders as a flat silhouette.
   */
  monochrome?: boolean
  /**
   * The pause button. **On by default, and it is not decoration**: WCAG 2.2.2 requires a way to stop
   * motion that starts on its own and runs for more than five seconds, which an endless strip does by
   * definition. Turn it off only if the page provides its own control.
   *
   * @default true
   */
  withControl?: boolean
  /** Stops while the pointer is over the strip, so a logo can be read or clicked. @default true */
  pauseOnHover?: boolean
  /** Controlled play state. */
  playing?: boolean
  /** Uncontrolled initial play state. @default true */
  defaultPlaying?: boolean
  /** Called when the strip is paused or resumed. */
  onPlayingChange?: (playing: boolean) => void
  /** The logos. Each child becomes one cell. */
  children?: ReactNode
}

/**
 * Marquee — the `marque` section (node `24465:67388`) and the Figma `Logos scrolling section` set
 * (`22522:24157`).
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Size` — Mobile / Desktop / Size3 | `size="sm" \| "md" \| "lg"` (24 / 49 / 64px cells) |
 * | The logo grid's gap of 60 | `gap` |
 * | The 109px logo cell | `logoWidth` |
 * | `Overlay` — transparent, opaque 20%–80%, transparent | `fade`, `fadeWidth` |
 * | `Theme` — Dark / Light, via the logos' `Color=One color` | `monochrome` |
 * | The two duplicate strips | the loop, built from one set of children |
 *
 * ```tsx
 * <Marquee label="Customers" monochrome>
 *   <img src={airbus} alt="Airbus" />
 *   <img src={carrefour} alt="Carrefour" />
 * </Marquee>
 * ```
 *
 * ## How the loop is built
 *
 * Figma draws the strip **twice**, side by side — `Frame 1332` and `Frame 1333`, identical — which is
 * exactly how a seamless marquee works, so that is what this does: one set of children, rendered twice,
 * translated by the width of one copy plus one gap and then snapped back. The second copy is
 * `aria-hidden`, or every logo would be announced twice.
 *
 * The distance is **measured**, not assumed, and the duration comes out of it: `distance / speed`. That
 * is what keeps a five-logo strip and a twenty-logo strip moving at the same speed, and it is re-measured
 * on resize and when the children change.
 *
 * Figma puts 32px between its two strips and 60px between logos inside them. The 32 is an artefact of
 * laying two copies out in a file — a loop needs the *same* gap in both places or it hitches once per
 * cycle — so the logo gap is used for both. Recorded in README.md.
 *
 * ## Motion, and stopping it
 *
 * **There is a pause button, and it is a conformance requirement rather than a nicety.** WCAG 2.2.2 asks
 * for a mechanism to pause, stop or hide any motion that starts automatically and lasts more than five
 * seconds while other content is on screen. An endless logo strip is the textbook case. Figma draws no
 * such control, so this one is inferred — small, at the trailing edge, and removable with
 * `withControl={false}` if the page has its own.
 *
 * Hover-to-pause is on as well, but it is *not* the mechanism: it does nothing for anyone on a keyboard
 * or a touch screen. Focus inside the strip pauses it too, so tabbing to a logo does not chase it across
 * the screen.
 *
 * Under `prefers-reduced-motion` the strip **starts paused** rather than being unable to move: it renders
 * as a static row and the button offers to start it, which is the point of having a control. Pausing uses
 * `animation-play-state`, so the strip stops where it is rather than snapping back to the beginning.
 */
export function Marquee({
  label,
  size = 'lg',
  gap = 60,
  logoWidth = 200,
  speed = 60,
  direction = 'left',
  fade = true,
  fadeWidth = '20%',
  monochrome,
  withControl = true,
  pauseOnHover = true,
  playing,
  defaultPlaying = true,
  onPlayingChange,
  children,
  className,
  style,
  ...props
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [distance, setDistance] = useState(0)

  const [isPlaying, setPlaying] = useUncontrolled({
    value: playing,
    defaultValue: defaultPlaying,
    finalValue: true,
    onChange: onPlayingChange,
  })

  /**
   * One copy's width plus one gap: the exact offset at which the second copy sits where the first one
   * started, so translating by it and repeating is seamless.
   */
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const gapPx = parseFloat(getComputedStyle(track).columnGap) || 0
    setDistance(track.getBoundingClientRect().width + gapPx)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    for (const cell of track.children) observer.observe(cell)
    return () => observer.disconnect()
  }, [measure, children])

  const cells = Children.toArray(children)
  const copy = (hidden: boolean, ref?: typeof trackRef) => (
    <div className={classes.marqueeTrack} ref={ref} aria-hidden={hidden || undefined}>
      {cells.map((cell, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.marqueeCell}>
          {cell}
        </div>
      ))}
    </div>
  )

  /**
   * Two separate things, and conflating them is a bug: whether the animation is *attached* and whether it
   * is *running*.
   *
   * Attached as soon as the distance has been measured. Running unless it is paused — and pausing is
   * `animation-play-state`, not removing the animation, so the strip stops where it is instead of snapping
   * back to the start. That was the first version's behaviour and it looked broken.
   *
   * `prefers-reduced-motion` starts it paused rather than making it unplayable: the whole point of the
   * control is that someone can choose. `touched` is what lets an explicit press win over the preference,
   * and it also covers the media query resolving after the first render.
   */
  const [touched, setTouched] = useState(false)
  const animated = distance > 0
  const paused = !isPlaying || (reducedMotion && !touched)

  return (
    <Box
      className={[classes.marqueeRoot, className].filter(Boolean).join(' ')}
      data-size={size}
      data-monochrome={monochrome || undefined}
      style={{
        '--sds-marquee-gap': typeof gap === 'number' ? `${gap}px` : gap,
        '--sds-marquee-cell': typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth,
        '--sds-marquee-fade': typeof fadeWidth === 'number' ? `${fadeWidth}px` : fadeWidth,
        '--sds-marquee-distance': `${distance}px`,
        /* Measured distance over the requested speed — the reason `speed` is px/s and not seconds. */
        '--sds-marquee-duration': `${distance > 0 ? distance / Math.max(speed, 1) : 0}s`,
        ...style,
      }}
      {...props}
    >
      <div
        className={classes.marqueeViewport}
        role="group"
        aria-label={label}
        data-fade={fade || undefined}
        data-pause-on-hover={pauseOnHover || undefined}
      >
        <div
          className={classes.marqueeTracks}
          data-moving={animated || undefined}
          data-paused={paused || undefined}
          data-direction={direction}
        >
          {copy(false, trackRef)}
          {copy(true)}
        </div>
      </div>

      {withControl ? (
        <UnstyledButton
          component="button"
          type="button"
          className={classes.marqueeControl}
          onClick={() => {
            setTouched(true)
            setPlaying(paused)
          }}
          /* The *effective* state, not the prop: under reduced motion it starts paused, and the button
           * has to say so rather than offering to pause something that is already still. */
          aria-pressed={paused}
          aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        >
          {paused ? <IconPlay /> : <IconPause />}
        </UnstyledButton>
      ) : null}
    </Box>
  )
}
