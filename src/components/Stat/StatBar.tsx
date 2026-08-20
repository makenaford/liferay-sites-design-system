import { Children, Fragment, forwardRef, isValidElement, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface StatBarProps extends BoxProps, ElementProps<'div'> {
  /** The stats. Anything is accepted, but this is drawn for `Stat` children. */
  children: ReactNode
  /** Figma's `Align` axis — Left as drawn, or centred. */
  align?: 'left' | 'center'
}

/**
 * StatBar — Figma `Stats Bar` component set (node `16708:102931`).
 *
 * A row of `Stat`s with a 1px `Neutral/03` rule between them — always, since a bar of numbers with no
 * separation reads as one number. Below the token collection's tablet breakpoint (576px) the row stacks
 * and the rules turn horizontal, which is the shape Figma's own `Size=Small, Align=Vertical` variant
 * draws.
 *
 * Figma instantiates its gradient `divider` (`16290:53873`) here, running `Neutral/06` into
 * `Brand/Primary/Lighten/3`. That is deliberately not used: a rule between two numbers should not draw
 * the eye, and the gradient made the last stat look picked out.
 *
 * Figma's `Size` axis (Large / Small / XL) changes both the stat size and how many stats are in the
 * bar. Here the bar only lays out whatever it is given, and each `Stat` carries its own `size` — so
 * one bar covers all three cells rather than enumerating them.
 *
 * The rules are decorative: `<hr aria-hidden>`, so the bar reads as a list of numbers rather than
 * announcing a separator between each.
 */
export const StatBar = forwardRef<HTMLDivElement, StatBarProps>(function StatBar(
  { children, align = 'left', className, ...props },
  ref,
) {
  const stats = Children.toArray(children).filter((child) => isValidElement(child) || child)

  return (
    <Box
      ref={ref}
      className={[classes.statBar, className].filter(Boolean).join(' ')}
      data-align={align === 'center' ? 'center' : undefined}
      {...props}
    >
      {stats.map((stat, index) => (
        <Fragment key={index}>
          {index > 0 ? <hr className={classes.statBarDivider} aria-hidden="true" /> : null}
          {stat}
        </Fragment>
      ))}
    </Box>
  )
})
