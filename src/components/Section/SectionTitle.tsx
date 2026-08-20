import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export type SectionTitleAlign = 'left' | 'center'

/** `h2` down to `h6`. A section heading is almost always `h2`, which is the default. */
export type SectionTitleOrder = 2 | 3 | 4 | 5 | 6

export interface SectionTitleProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /** Figma's `Title`. Rendered as a real heading — see `order`. */
  title?: ReactNode
  /** Figma's `Description`. */
  description?: ReactNode
  /**
   * Figma's `Slot`: a button or a link beside the heading on a wide screen, and under it on a narrow one.
   * The `Centered- Description` cell has no slot, but centring one is harmless and occasionally wanted.
   */
  actions?: ReactNode
  /** Figma's `Type`: `Left- Description` or `Centered- Description`. @default 'left' */
  align?: SectionTitleAlign
  /**
   * The heading level. Unlike `Hero`, this has a default: a section heading under a page's `h1` is `h2`
   * almost every time, and making every call site say so produces call sites that say nothing and render a
   * `div`. Change it when the section is nested under another heading.
   *
   * @default 2
   */
  order?: SectionTitleOrder
}

/**
 * SectionTitle — Figma `Section Title` (node `17892:146487`).
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Type` — Left- Description / Centered- Description | `align` |
 * | `Device` — Desktop / Mobile | **fluid**, no prop |
 * | `Title` | `title` |
 * | `Description` | `description` |
 * | `Slot` (an `Action section`) | `actions` |
 *
 * Type is Figma's, at both ends of its own range: the title runs 37px at 1440 down to 32px at 390, and the
 * description 21px down to 18px. Both are `clamp`ed between those pairs rather than switched at a
 * breakpoint, for the same reason the section's gutter is.
 *
 * ## The action wraps rather than switching
 *
 * Figma has two cells: a row with the action on the right, and a column with the action underneath. This
 * is one flex row that **wraps** — the text column claims `min(100%, 34rem)`, so the action sits beside it
 * while there is room and drops full-width beneath it when there is not. It lands on both of Figma's cells
 * without a media query, and on the widths between them it does the sensible thing rather than the nearest
 * of two things.
 */
export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(function SectionTitle(
  { title, description, actions, align = 'left', order = 2, className, ...props },
  ref,
) {
  const Heading = `h${order}` as 'h2'

  return (
    <Box
      ref={ref}
      className={[classes.sectionTitleRoot, className].filter(Boolean).join(' ')}
      data-align={align}
      {...props}
    >
      {title || description ? (
        <div className={classes.sectionTitleText}>
          {title ? <Heading className={classes.sectionTitleHeading}>{title}</Heading> : null}
          {description ? <p className={classes.sectionTitleDescription}>{description}</p> : null}
        </div>
      ) : null}

      {actions ? <div className={classes.sectionTitleActions}>{actions}</div> : null}
    </Box>
  )
})
