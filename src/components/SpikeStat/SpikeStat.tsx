import { forwardRef, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export type SpikeStatSize = 'md' | 'sm' | 'hero'
export type SpikeStatTone = 'brand' | 'gradient'
export type SpikeStatLayout = 'stacked' | 'inline'
export type SpikeStatAlign = 'left' | 'center'

export interface SpikeStatProps extends BoxProps, ElementProps<'div'> {
  /** The number itself. */
  value: ReactNode
  /** The caption under it. */
  label: ReactNode
  /** Default (40px value), Small (32px) or Hero (56px, for a figure that leads a section). */
  size?: SpikeStatSize
  /** Value colour: the brand blue, or a blue-to-purple gradient across the digits. */
  tone?: SpikeStatTone
  /** Icon before the number. */
  leftSection?: ReactNode
  /** Icon after the number. */
  rightSection?: ReactNode
  /** Left as drawn, or centred for a stat sitting alone in a card. */
  align?: SpikeStatAlign
  /** Caption under the figure, or beside it on one line. */
  layout?: SpikeStatLayout
}

/**
 * SpikeStat — TEST component for the Liferay DXP sync spike. Do not use or merge.
 *
 * A copy of `Stat` with two additions, made so a pull request can show a brand-new component reaching
 * Liferay DXP: a `hero` size (56px value) and a `gradient` tone. Everything else behaves as `Stat`.
 * Delete the whole folder, its section in `components.module.css` and its export when the test is over.
 */
export const SpikeStat = forwardRef<HTMLDivElement, SpikeStatProps>(function SpikeStat(
  {
    value,
    label,
    size = 'md',
    tone = 'brand',
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
      className={[classes.spikeStat, className].filter(Boolean).join(' ')}
      data-size={size === 'md' ? undefined : size}
      data-tone={tone === 'gradient' ? 'gradient' : undefined}
      data-align={align === 'center' ? 'center' : undefined}
      data-layout={layout === 'inline' ? 'inline' : undefined}
      {...props}
    >
      <div className={classes.spikeStatValue}>
        {leftSection ? <span data-section="left">{leftSection}</span> : null}
        <span>{value}</span>
        {rightSection ? <span data-section="right">{rightSection}</span> : null}
      </div>
      <div className={classes.spikeStatLabel}>{label}</div>
    </Box>
  )
})
