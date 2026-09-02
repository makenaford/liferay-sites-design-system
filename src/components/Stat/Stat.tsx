import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export type StatSize = 'md' | 'sm'
export type StatLayout = 'stacked' | 'inline'
export type StatAlign = 'left' | 'center'

export interface StatProps extends BoxProps, ElementProps<'div'> {
  /** The number itself — Figma's `Value` text property. */
  value: ReactNode
  /** The caption under it — Figma's `Label` text property. */
  label: ReactNode
  /** Figma's `Property 1`: Default (40px value) or Small (32px). */
  size?: StatSize
  /** Icon before the number — Figma's `Show Stat Icon Left`. */
  leftSection?: ReactNode
  /** Icon after the number — Figma's `Show Stat Icon Right`. */
  rightSection?: ReactNode
  /** Left as drawn, or centred for a stat sitting alone in a card. */
  align?: StatAlign

  /**
   * How the figure and its caption sit together.
   *
   * `stacked` is Figma's `Stats Item` — the caption under the number, which is what a column of stats
   * beside an image wants.
   *
   * `inline` puts the caption beside the figure on one line, which is what `Number Footer`
   * (node `7655:19963`) draws: a row of two, each `1,200+ ENTERPRISE CUSTOMERS`, split by a divider. In
   * a band that is one line tall, a stacked stat has to shrink its number to fit; laid along the line it
   * keeps its size and the row keeps its height.
   *
   * @default 'stacked'
   */
  layout?: StatLayout
}

/**
 * Stat — Figma `Stats Item` component set (node `15121:237366`).
 *
 * A number over a caption, with an optional icon on either side of the number. Appearance lives in
 * `src/theme/components.module.css`; this supplies the structure and the `data-section` hooks the
 * stylesheet targets.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Property 1` — Default / Small | `size="md" \| "sm"` (default `md`) |
 * | `Value` | `value` |
 * | `Label` | `label` |
 * | `Show Stat Icon Left` / `Right` | `leftSection` / `rightSection` |
 *
 * **Not interactive.** A stat is content, not a control: no hover, no focus, no cursor, and no
 * clickable wrapper. If a stat needs to lead somewhere, put a `Link` next to it rather than making
 * the number itself a target.
 *
 * Rendered as plain text in reading order, so it is announced as "845 Months to Launch". The icons
 * are decorative and hidden from assistive technology; if the arrow is carrying meaning — that a
 * number went up rather than down — say so in the label.
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  {
    value,
    label,
    size = 'md',
    leftSection,
    rightSection,
    align = 'left',
    layout = 'stacked',
    className,
    ...props
  },
  ref,
) {
  return (
    <Box
      ref={ref}
      className={[classes.stat, className].filter(Boolean).join(' ')}
      data-size={size === 'sm' ? 'sm' : undefined}
      data-align={align === 'center' ? 'center' : undefined}
      data-layout={layout === 'inline' ? 'inline' : undefined}
      style={{'gap': 'var(--mantine-spacing-4)'}}
      {...props}
    >
      <div className={classes.statValue}>
        {leftSection ? <span data-section="left">{leftSection}</span> : null}
        <span>{value}</span>
        {rightSection ? <span data-section="right">{rightSection}</span> : null}
      </div>
      <div className={classes.statLabel}>{label}</div>
    </Box>
  )
})
