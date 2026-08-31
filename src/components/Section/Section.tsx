import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
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
 * | `padding-inline` 80 desktop / 20 mobile | fluid, see below |
 * | `padding-block` | **80 at every width**, see below |
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
 * ## The inline padding is fluid; the block padding is 80
 *
 * Figma draws two cells — 80px at 1440 and 20px at 390 — and the obvious reading is a breakpoint. The
 * **gutter** uses `clamp(20px, 5.56cqi, 80px)` instead, which **passes through both of Figma's numbers
 * exactly** (5.56% of 1440 is 80, and the floor catches 390) and every width between them without a
 * jump. A page gutter is the one measurement where a hard step is most visible, because everything moves
 * at once.
 *
 * The **block** padding does not follow it down. It is 80 at every width, which is a deliberate
 * divergence from the Mobile cell. The two axes look like one measurement in the file and are not one
 * problem: the gutter holds text off the edge of a screen and has to give way when the screen is narrow,
 * while the block padding separates one section from the next, and that separation is worth the same
 * amount however wide the page is. At 20 a phone ran its sections together and nothing read as a section.
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
  return (
    <Box
      component="section"
      ref={ref}
      className={[classes.sectionRoot, className].filter(Boolean).join(' ')}
      data-spacing={spacing}
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
