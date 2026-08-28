import { Children, Fragment, forwardRef, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'
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
/**
 * Reveals the bar the first time it is scrolled into view.
 *
 * Once, not on every pass: a figure that re-animates each time it scrolls by is a distraction rather
 * than an arrival. Under `prefers-reduced-motion` it starts revealed, so nothing ever depends on the
 * animation having run — and if `IntersectionObserver` is missing, the same.
 */
function useRevealOnce() {
  const node = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(
    () =>
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )

  useEffect(() => {
    if (shown) return undefined
    const element = node.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        /* A quarter of the bar is enough to count as arrived; waiting for all of it feels late. */
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [shown])

  return { node, shown }
}

export const StatBar = forwardRef<HTMLDivElement, StatBarProps>(function StatBar(
  { children, align = 'left', className, ...props },
  ref,
) {
  const stats = Children.toArray(children).filter((child) => isValidElement(child) || child)
  const { node, shown } = useRevealOnce()

  return (
    <Box
      ref={(element: HTMLDivElement | null) => {
        node.current = element
        if (typeof ref === 'function') ref(element)
        else if (ref) ref.current = element
      }}
      className={[classes.statBar, className].filter(Boolean).join(' ')}
      data-align={align === 'center' ? 'center' : undefined}
      data-revealed={shown || undefined}
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
