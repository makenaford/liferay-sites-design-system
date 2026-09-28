import { forwardRef } from 'react'
import { Progress as MantineProgress } from '@mantine/core'
import type { ElementProps } from '@mantine/core'
import { IconCheckCircleFilled } from '../../icons'
import classes from '../../theme/components.module.css'

/** Figma's `State` axis. */
export type ProgressState = 'loading' | 'warning' | 'completed'

export interface ProgressProps extends ElementProps<'div'> {
  /** How far along, 0–100. Figma's `Value` axis draws 0/10/30/50/70/90/100; any value works here. */
  value: number
  /**
   * Figma's `State`. Omitted, it follows the value: `completed` at 100, `loading` below it. Pass
   * `warning` for progress that has stalled or is running out of time — the page decides that, not
   * the number.
   */
  state?: ProgressState
  /** What is progressing, for a screen reader — the bar alone says how far, not of what. */
  label: string
}

/**
 * Progress — Figma `Progress Bar` component set, from the `Course Card` in `LEARN - New Pages`
 * (node `7575:24403`).
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Value` — 0% … 100% | `value` |
 * | `State` — Loading / Warning / Completed | `state` |
 *
 * ```tsx
 * <Progress value={50} label="Liferay DXP Fundamentals" />
 * <Progress value={30} state="warning" label="Headless APIs 101" />
 * <Progress value={100} label="Pages with Fragments" />
 * ```
 *
 * An 8px track on `Surfaces/card-bg-blue` with the figure beside it, and at 100% a check in place of
 * the figure — the file's `Completed` cell, which drops the number because "100%" says less than done.
 *
 * **The loading fill is blue into aqua**, which is what the Learn card draws. The library's own
 * master runs `Brand/Primary` into `Accent/Product Accent` (violet) from the halfway stop; the Learn
 * file overrides it on every card, and this follows the page it was built for.
 *
 * A real `progressbar`: Mantine's section carries `role`, `aria-valuenow` and the bounds, and
 * `label` names it.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, state, label, className, ...props },
  ref,
) {
  const clamped = Math.min(100, Math.max(0, value))
  const resolved = state ?? (clamped >= 100 ? 'completed' : 'loading')

  return (
    <div
      ref={ref}
      className={[classes.progress, className].filter(Boolean).join(' ')}
      data-state={resolved}
      {...props}
    >
      <MantineProgress.Root className={classes.progressTrack} size={8} radius={4}>
        <MantineProgress.Section
          className={classes.progressFill}
          value={clamped}
          aria-label={label}
        />
      </MantineProgress.Root>
      <span className={classes.progressValue} aria-hidden>
        {resolved === 'completed' ? <IconCheckCircleFilled width={20} height={20} /> : `${Math.round(clamped)}%`}
      </span>
    </div>
  )
})
