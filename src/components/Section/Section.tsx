import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/**
 * Figma `Page Background` `Style` (node `22455:38997`), resolved through its aliases:
 *
 * - `page` — `Surfaces/Page Background/Page Background` → `Surfaces/Page BG base/Default`
 * - `grey` — Figma's `Dark Blue` cell, which aliases `Surfaces/Card BG/Grey`
 * - `blue` — Figma's `Light Blue` cell, which aliases `Surfaces/Card BG/Blue`
 * - `none` — nothing painted, so the page shows through
 *
 * Figma's fourth cell, `Gradient Blue`, is a four-stop radial built on remote `Gradient Step` variables
 * that are not in this file's collections; it is not shipped rather than guessed. See README.md.
 */
export type SectionBackground = 'none' | 'page' | 'grey' | 'blue'

/**
 * How much air the section has above and below. `default` is the 80px every standard section uses;
 * `tight` is the 40px the `Quote` and `Highlight Text` sections use.
 */
export type SectionSpacing = 'default' | 'tight'

export interface SectionProps extends BoxProps, Omit<ElementProps<'section'>, 'title'> {
  /** @default 'none' */
  background?: SectionBackground
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
 * All fourteen of its `Type` cells share one skeleton: a full-bleed background, a centred content column
 * capped at 1280, a `Section Title`, a body, and sometimes a footer. `Type` is not a prop here, because
 * it is not a property of the shell — it is which component you put in the body. `Card Grid` is a Section
 * holding a grid of `Card`s; `FAQ` is a Section holding an `Accordion`; `Integrations Section` is a
 * Section holding a `Marquee`. See the `Blocks` stories for all of them.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Page Background` `Style` | `background` |
 * | `padding` 80 desktop / 20 mobile | fluid, see below |
 * | The 40px block padding on `Quote` and `Highlight Text` | `spacing="tight"` |
 * | `padding-inline: 0` on `Integrations Section` and `Carousel` | `bleed` |
 * | `Section Title` | `title` |
 * | `Call to Action`, carousel controls | `footer` |
 * | `gap` 24 (32 in the integrations section) | `gap` |
 * | The 1280 content column in a 1440 frame | `maxWidth` |
 *
 * ```tsx
 * <Section background="page" title={<SectionTitle title="Customer stories" />}>
 *   <SimpleGrid cols={3} spacing="24">…</SimpleGrid>
 * </Section>
 * ```
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
    background = 'none',
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
      data-background={background}
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
