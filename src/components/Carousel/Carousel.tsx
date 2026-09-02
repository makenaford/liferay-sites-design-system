import { Children, useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { useReducedMotion } from '@mantine/hooks'
import classes from '../../theme/components.module.css'
import { Button } from '../Button'
import { IconArrowLeft, IconArrowRight } from '../../icons'

/** Figma's `Carousel` `Type` axis, split in two: the arrows and the indicators are independent here. */
export type CarouselIndicators = 'dots' | 'lines' | 'none'

export interface CarouselProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /**
   * Names the carousel for a screen reader — "Customer stories", "Featured products". Required, and
   * not optional-with-a-default for the same reason `Image`'s `alt` is not: a region announced as
   * "carousel" with no name tells someone nothing about what they have landed in.
   */
  label: string
  /**
   * The width of one slide. Figma's cards are **310px**; a number is pixels, a string is any CSS
   * length, so `'80%'` gives the one-card-at-a-time layout where the next card peeks in.
   *
   * @default 310
   */
  slideSize?: number | string
  /**
   * The gap between slides.
   *
   * 20px, which is **a deviation**: Figma's `List` draws 13, a number that is on no step of the spacing
   * scale and reads as tight once the cards carry a photograph rather than a swatch — two thumbnails a
   * thumb's width apart start to look like one strip. 20 is the scale's own step either side of it, and
   * it is what the customer stories row is drawn with. Recorded in README.md.
   *
   * @default 20
   */
  gap?: number | string
  /**
   * Figma's `Type=arrows`: the pair of 44×40 outline buttons under the track. They step one slide at a
   * time and disable at each end.
   *
   * @default true
   */
  arrows?: boolean
  /**
   * Figma's two indicator styles. `dots` is the 12px dot row inside the `Type=arrows` cell; `lines` is
   * the `Type=lines` cell, where the active bar is 64px against the inactive 24px.
   *
   * @default 'dots'
   */
  indicators?: CarouselIndicators
  /**
   * Figma's `Overlay`: the track fades out at the edges, so a half-scrolled card reads as continuing
   * rather than as cut off.
   *
   * @default true
   */
  fade?: boolean
  /** How far in the fade reaches. Figma's overlay is 15% of the frame at each edge. */
  fadeWidth?: number | string
  /**
   * Space before the first slide and after the last, inside the scroll area. Figma's `List` uses the
   * page's 80px gutter; the default here is 0, because a gutter belongs to the page rather than to the
   * component that sits in it.
   */
  gutter?: number | string
  /** Above the track — a section heading, a description, a link. Figma puts a `Section Title` here. */
  header?: ReactNode
  /** The slides. Each child is wrapped in its own slide, so cards go in directly. */
  children?: ReactNode
}

/**
 * Carousel — the `card carousel` section (node `24465:66866`) and the Figma `Carousel` control set
 * (node `20440:16714`).
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `List` — 310px cards, 13px gap, clipped | `slideSize`, `gap` |
 * | `Overlay` — the edge fade | `fade`, `fadeWidth` |
 * | `Carousel` `Type=arrows` — two 44×40 outline buttons | `arrows` |
 * | `Carousel` `Type=arrows` — the 12px dot row between them | `indicators="dots"` |
 * | `Carousel` `Type=lines` — 24px bars, 64px when active | `indicators="lines"` |
 * | `Section Title` above the list | `header` |
 * | `List` `padding-inline` 80 | `gutter` |
 *
 * ```tsx
 * <Carousel label="Customer stories" indicators="dots">
 *   <Card>…</Card>
 *   <Card>…</Card>
 * </Carousel>
 * ```
 *
 * ## It scrolls; it does not animate
 *
 * The track is a **scroll container with CSS scroll snapping**, not a transformed strip. That is the
 * decision worth knowing about, because the alternative was `@mantine/carousel`, which would add
 * `embla-carousel-react` to a library that currently depends on `@mantine/core` and `@mantine/hooks`
 * and nothing else.
 *
 * Scroll snapping gets touch and trackpad momentum, overscroll, keyboard scrolling, `scroll-behavior`
 * honouring `prefers-reduced-motion` and the browser's own scroll-into-view for focused content — all
 * of it native, none of it re-implemented. What it does not get is drag-to-scroll with a mouse,
 * autoplay, or an infinite loop. If any of those three is wanted, this is the component to swap for
 * `@mantine/carousel`; nothing else in the library would change.
 *
 * ## The indicators count reachable positions, not slides
 *
 * Figma draws one dot per slide (`Slides=3`). That is right when one slide fills the track, and wrong
 * when four are visible: the last three slides can never be scrolled to the left edge, so three of
 * seven dots could never light up.
 *
 * So the dots count **snap positions that can actually be reached** — which is the slide count exactly
 * when one slide is visible at a time, and fewer when several are. Measured from the live layout rather
 * than computed from props, so it stays right through a resize.
 *
 * ## Accessibility
 *
 * The track is `role="group" aria-roledescription="carousel"` with the `label`, each slide is a group
 * announced as "slide", numbered, and the track is **focusable**: a scroll region that can only be
 * reached by tabbing to something inside it is unreachable for a keyboard user when the slides hold no
 * links, which is exactly the case for quote cards. That focusable container costs one tab stop and is
 * the accepted trade.
 *
 * The arrows and indicators are real buttons that disable at the ends rather than wrapping — a loop with
 * no announcement is disorienting, and Figma's `State=Disabled` cell says the arrows are meant to
 * disable.
 */
export function Carousel({
  label,
  slideSize = 310,
  gap = 20,
  arrows = true,
  indicators = 'dots',
  fade = true,
  fadeWidth = '15%',
  gutter = 0,
  header,
  children,
  className,
  style,
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const baseId = useId()
  const slides = Children.toArray(children)

  /**
   * Everything the controls need, measured from the DOM rather than derived from props: the number of
   * reachable snap positions, which one we are at, and whether either end has been hit.
   */
  const [state, setState] = useState({ index: 0, pages: 1, canPrev: false, canNext: false })

  const offsets = useCallback(() => {
    const el = trackRef.current
    if (!el) return { el: null as HTMLDivElement | null, starts: [] as number[], max: 0 }
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const all = [...el.querySelectorAll<HTMLElement>('[data-carousel-slide]')].map((s) => s.offsetLeft)
    /*
     * A slide is a reachable position if the track can actually scroll to it. The last one that can is
     * pinned to the maximum scroll offset, so clicking the final indicator lands exactly at the end
     * instead of a few pixels short of it.
     */
    const starts = all.filter((left) => left <= max + 1)
    if (starts.length) starts[starts.length - 1] = Math.min(starts[starts.length - 1], max)
    return { el, starts: starts.length ? starts : [0], max }
  }, [])

  const measure = useCallback(() => {
    const { el, starts, max } = offsets()
    if (!el) return
    const left = el.scrollLeft
    let index = 0
    let best = Infinity
    starts.forEach((start, i) => {
      const distance = Math.abs(start - left)
      if (distance < best) {
        best = distance
        index = i
      }
    })
    setState({ index, pages: starts.length, canPrev: left > 1, canNext: left < max - 1 })
  }, [offsets])

  /* One rAF-throttled listener for scrolling, and a ResizeObserver for everything that changes width. */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
      })
    }

    measure()
    el.addEventListener('scroll', onScroll, { passive: true })
    const observer = new ResizeObserver(onScroll)
    observer.observe(el)
    for (const slide of el.children) observer.observe(slide)

    return () => {
      el.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [measure, slides.length])

  /**
   * The travel between slides, animated here rather than handed to the browser.
   *
   * `scrollTo({ behavior: 'smooth' })` is one line and was what this did. What it is not is *specified*:
   * the duration and the curve belong to the engine, so the same click takes a different time and reads
   * with a different weight in each browser, and none of them is the easing the rest of this library
   * moves on. A card row is the largest thing on the page that moves on a click, which makes it the
   * worst place to leave that to chance.
   *
   * So: `requestAnimationFrame` over `--sds-motion-slow`, on the same decelerating curve as everything
   * else here — fast away from the press, settling into the new position rather than stopping at it.
   * Written straight to `scrollLeft`, which no browser eases, or the two would fight.
   *
   * The tween **yields to the reader**. A wheel, a touch or a drag cancels it mid-flight: the animation
   * is a convenience for someone who pressed an arrow, and it has no business holding the track against
   * someone who has taken hold of it. `instant` under `prefers-reduced-motion`.
   */
  const tween = useRef<number | null>(null)

  /**
   * Snapping has to be off while the tween runs, and this is not a detail — it is the whole reason a
   * hand-written scroll animation on a snapping track usually "does not work".
   *
   * `scroll-snap-type: x mandatory` means the track must rest on a snap point at all times, so every
   * intermediate `scrollLeft` this writes is immediately snapped to the nearest one. Measured, the first
   * cut of this jumped 80 -> 410 inside a frame and sat there for the remaining half second: a tween
   * that ran perfectly and was never once seen. (The browser's own `behavior: 'smooth'` does not have
   * this problem because it coordinates with the snap engine internally, which is exactly the part that
   * is not exposed.)
   *
   * So snapping is suspended for the flight and restored on landing — and the landing is a snap point
   * by construction, so restoring it moves nothing.
   */
  const stopTween = useCallback(() => {
    if (tween.current) cancelAnimationFrame(tween.current)
    tween.current = null
    const el = trackRef.current
    if (el) el.style.scrollSnapType = ''
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const cancel = () => stopTween()
    /* Passive: these only ever cancel, so nothing here needs to be able to preventDefault. */
    el.addEventListener('wheel', cancel, { passive: true })
    el.addEventListener('touchstart', cancel, { passive: true })
    el.addEventListener('pointerdown', cancel, { passive: true })
    return () => {
      el.removeEventListener('wheel', cancel)
      el.removeEventListener('touchstart', cancel)
      el.removeEventListener('pointerdown', cancel)
      stopTween()
    }
  }, [stopTween])

  const scrollTo = useCallback(
    (page: number) => {
      const { el, starts } = offsets()
      if (!el) return
      const target = starts[Math.max(0, Math.min(page, starts.length - 1))]

      stopTween()
      const from = el.scrollLeft
      const distance = target - from
      if (reducedMotion || Math.abs(distance) < 1) {
        el.scrollLeft = target
        return
      }

      el.style.scrollSnapType = 'none'
      const duration = 520
      let start: number | null = null
      const step = (now: number) => {
        if (start === null) start = now
        const t = Math.min(1, (now - start) / duration)
        /* The same shape as `--sds-motion-ease-out`, as arithmetic: most of the distance early, no bounce. */
        const eased = 1 - Math.pow(1 - t, 3)
        el.scrollLeft = from + distance * eased
        if (t < 1) {
          tween.current = requestAnimationFrame(step)
        } else {
          tween.current = null
          /* Landed on a snap point, so this hands the track back without moving it. */
          el.style.scrollSnapType = ''
        }
      }
      tween.current = requestAnimationFrame(step)
    },
    [offsets, reducedMotion, stopTween],
  )

  const showControls = arrows || (indicators !== 'none' && state.pages > 1)

  return (
    <Box
      className={[classes.carouselRoot, className].filter(Boolean).join(' ')}
      style={{
        '--sds-carousel-slide': typeof slideSize === 'number' ? `${slideSize}px` : slideSize,
        '--sds-carousel-gap': typeof gap === 'number' ? `${gap}px` : gap,
        '--sds-carousel-gutter': typeof gutter === 'number' ? `${gutter}px` : gutter,
        '--sds-carousel-fade': typeof fadeWidth === 'number' ? `${fadeWidth}px` : fadeWidth,
        ...style,
      }}
      {...props}
    >
      {header ? <div className={classes.carouselHeader}>{header}</div> : null}

      <div
        ref={trackRef}
        id={`${baseId}-track`}
        className={classes.carouselTrack}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        /*
         * Focusable on purpose. Without it, a track whose slides hold no links — a row of quote cards —
         * is a scroll region a keyboard user cannot scroll (WCAG 2.1.1).
         */
        tabIndex={0}
        data-fade={fade || undefined}
        data-fade-start={fade && state.canPrev ? true : undefined}
        data-fade-end={fade && state.canNext ? true : undefined}
      >
        {slides.map((slide, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={classes.carouselSlide}
            data-carousel-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {showControls ? (
        <div className={classes.carouselControls}>
          {arrows ? (
            <Button
              variant="outline"
              size="sm"
              className={classes.carouselArrow}
              aria-label="Previous slide"
              aria-controls={`${baseId}-track`}
              disabled={!state.canPrev}
              onClick={() => scrollTo(state.index - 1)}
            >
              <IconArrowLeft aria-hidden />
            </Button>
          ) : null}

          {indicators !== 'none' && state.pages > 1 ? (
            <div
              className={classes.carouselIndicators}
              data-style={indicators}
              role="group"
              aria-label={`${label} — slides`}
              aria-controls={`${baseId}-track`}
            >
              {Array.from({ length: state.pages }, (_, page) => (
                <UnstyledButton
                  key={page}
                  component="button"
                  type="button"
                  className={classes.carouselIndicator}
                  data-active={page === state.index || undefined}
                  aria-label={`Go to slide ${page + 1}`}
                  aria-current={page === state.index || undefined}
                  onClick={() => scrollTo(page)}
                >
                  <span className={classes.carouselIndicatorMark} aria-hidden />
                </UnstyledButton>
              ))}
            </div>
          ) : null}

          {arrows ? (
            <Button
              variant="outline"
              size="sm"
              className={classes.carouselArrow}
              aria-label="Next slide"
              aria-controls={`${baseId}-track`}
              disabled={!state.canNext}
              onClick={() => scrollTo(state.index + 1)}
            >
              <IconArrowRight aria-hidden />
            </Button>
          ) : null}
        </div>
      ) : null}
    </Box>
  )
}
