import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import { useMergedRef } from '@mantine/hooks'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export type SectionSpacing = 'default' | 'tight' | 'none'

export interface SectionProps extends BoxProps, Omit<ElementProps<'section'>, 'title'> {
  /** @default 'default' */
  spacing?: SectionSpacing
  /**
   * Lets the body run to the viewport's edges while the heading and the footer keep the gutter — which is
   * how Figma's `Integrations Section` and `Carousel` sections are built, so a marquee or a card track can
   * bleed off the side of the page.
   */
  bleed?: boolean
  /**
   * Drift the section up into place as it scrolls into view.
   *
   * Off by default: it belongs to a long marketing page reading as a sequence, and a section in an app
   * shell or a docs page has no such sequence to join. `Templates/Home` turns it on throughout.
   *
   * An `IntersectionObserver` trips once as the section reaches the fold and a 0.8s transition draws the
   * rise, as in the demo this comes from. Nothing happens under `prefers-reduced-motion`.
   */
  reveal?: boolean
  /** The heading block. A `SectionTitle`, normally. */
  title?: ReactNode
  /** Below the body — Figma's `Call to Action` and carousel controls both sit here. */
  footer?: ReactNode
  /** Between the heading, the body and the footer. Figma uses 24, and 32 in the integrations section. */
  gap?: number | string
  /** The content column's ceiling. Figma's is 1280 inside a 1440 frame. @default 1280 */
  maxWidth?: number | string
  children?: ReactNode
}

/**
 * Section — the shell every block in Figma's `Section` set (node `17892:146518`) is built on.
 *
 * All fourteen of its `Type` cells share one skeleton: a centred content column
 * capped at 1280, a `Section Title`, a body, and sometimes a footer. `Type` is not a prop here, because
 * it is not a property of the shell — it is which component you put in the body. `Card Grid` is a Section
 * holding a grid of `Card`s; `FAQ` is a Section holding an `Accordion`; `Integrations Section` is a
 * Section holding a `Marquee`. See the `Blocks` stories for all of them.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `padding` 80 desktop / 20 mobile | fluid, see below |
 * | The 40px block padding on `Quote` and `Highlight Text` | `spacing="tight"` |
 * | `padding-inline: 0` on `Integrations Section` and `Carousel` | `bleed` |
 * | `Section Title` | `title` |
 * | `Call to Action`, carousel controls | `footer` |
 * | `gap` 24 (32 in the integrations section) | `gap` |
 * | The 1280 content column in a 1440 frame | `maxWidth` |
 *
 * ```tsx
 * <Section title={<SectionTitle title="Customer stories" />}>
 *   <SimpleGrid cols={3} spacing="24">…</SimpleGrid>
 * </Section>
 * ```
 *
 * ## No background
 *
 * Figma's `Page Background` instance is deliberately **not** implemented. A section that paints its own
 * ground fights whatever the page has already decided, and three of its four cells are a flat token a
 * caller can set in one line — `bg="var(--sds-surfaces-card-bg-grey)"` — while the fourth is a gradient
 * whose stops are not in this file. If sections do need a background later, it belongs here as one prop
 * rather than at every call site; until then the page owns it.
 *
 * ## The padding is fluid, not stepped
 *
 * Figma draws two cells — 80px at 1440 and 20px at 390 — and the obvious reading is a breakpoint. This
 * uses `clamp(20px, 5.56cqi, 80px)` instead, which **passes through both of Figma's numbers exactly**
 * (5.56% of 1440 is 80, and the floor catches 390) and every width between them without a jump. A page
 * gutter is the one measurement where a hard step is most visible, because everything moves at once.
 *
 * `spacing="tight"` is the same formula halved: `clamp(20px, 2.78cqi, 40px)`, which lands on Figma's 40 at
 * 1440 and its 20 at 390.
 *
 * The unit is `cqi` — the **section's own width** — not `vw`. "The window is narrow" and "this section is
 * narrow" are different questions, and a section inside an app with a sidebar, a preview frame or a
 * two-column docs page is the narrow case while the window is not. The section names its container, so the
 * gutter, the headings and the two-up collapse inside it all measure the same thing.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    spacing = 'default',
    reveal,
    bleed,
    title,
    footer,
    gap,
    maxWidth = 1280,
    children,
    className,
    style,
    ...props
  },
  ref,
) {
  const localRef = useRef<HTMLElement>(null)
  const mergedRef = useMergedRef(ref, localRef)
  const [state, setState] = useState<'pending' | 'in' | undefined>(undefined)

  /*
   * The reveal is time-based rather than scroll-linked, and deliberately: an animation tied to
   * `animation-timeline: view()` advances at the reader's scroll speed, so a trackpad flick crosses its
   * whole range in one frame and the page below arrives already finished. This plays for its own 0.8s
   * however fast the reader got here.
   *
   * `data-reveal-state` is set from here and nowhere else, so a document that is served but never
   * hydrated has no offset start state to be stuck in — every section renders at rest.
   */
  useEffect(() => {
    if (!reveal || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = localRef.current
    if (!el) return

    setState('pending')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setState('in')
          observer.unobserve(entry.target)
        })
      },
      /*
       * A bottom margin rather than a threshold: "12% of the section is visible" is a different scroll
       * position for every section height, and on a tall one it never fires until the section already
       * fills the screen. Pulling the root's bottom edge up 15% fires when the section's top crosses
       * that line — one trigger point regardless of how tall it is.
       */
      { threshold: 0, rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reveal])

  return (
    <Box
      component="section"
      ref={mergedRef}
      className={[classes.sectionRoot, className].filter(Boolean).join(' ')}
      data-spacing={spacing}
      data-reveal={reveal || undefined}
      data-reveal-state={state}
      data-bleed={bleed || undefined}
      style={{
        '--sds-section-max': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        ...(gap === undefined
          ? null
          : { '--sds-section-gap': typeof gap === 'number' ? `${gap}px` : gap }),
        ...style,
      }}
      {...props}
    >
      <div className={classes.sectionInner}>
        {title ? <div className={classes.sectionHeader}>{title}</div> : null}
        {children ? <div className={classes.sectionBody}>{children}</div> : null}
        {footer ? <div className={classes.sectionFooter}>{footer}</div> : null}
      </div>
    </Box>
  )
})
