import { forwardRef } from 'react'
import { SegmentedControl as MantineSegmentedControl } from '@mantine/core'
import type { SegmentedControlProps as MantineSegmentedControlProps } from '@mantine/core'

export interface SegmentedControlProps extends Omit<MantineSegmentedControlProps, 'variant'> {}

/**
 * SegmentedControl — Figma `Tabs Menu Carded` component set (node `17900:62310`).
 *
 * A themed Mantine `SegmentedControl`: the carded glass container from the design, with the selected
 * segment as a single pill that slides between options rather than being redrawn in place. All
 * appearance lives in the theme (`src/theme/components.ts` + `components.module.css`); this component
 * deliberately adds no props of its own.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Sizes` = Desktop / Mobile | **responsive** — a media query at 1200px, not a prop |
 * | `Tab Text` `State` = Default | the resting segment |
 * | `State` = Hover | the real `:hover` state |
 * | `State` = Selected | `value` / `defaultValue` |
 * | Each tab's label and icon | one entry in `data` |
 *
 * Icons go in a `data` item's `label` as JSX; the theme sizes them per breakpoint (20px on desktop,
 * 16px below) and keeps Figma's 8px gap.
 *
 * Three states the design does not draw are inferred, and marked as such in `components.module.css`
 * and README.md: a pressed state (a brief scale-down), focus (this system's `Styles/focus-ring`), and
 * disabled (the resting appearance at half opacity, as Button's Figma disabled state is drawn).
 *
 * ## Which component to reach for
 *
 * This renders a group of radio inputs, which is what a segmented control is: picking one of a few
 * mutually exclusive options, where the choice itself is the outcome. Figma files often use the same
 * carded strip for **tabs** that swap panels — if that is what you are building, it needs
 * `role="tablist"` semantics and Mantine's `Tabs`, not this. A segmented control announced as tabs
 * tells a screen reader user to expect panels that are not there.
 *
 * ```tsx
 * import { IconCheck, SegmentedControl } from 'scratch'
 *
 * <SegmentedControl
 *   defaultValue="monthly"
 *   data={[
 *     { value: 'monthly', label: 'Monthly' },
 *     { value: 'annual', label: <>Annual <IconCheck /></> },
 *   ]}
 * />
 * ```
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(props, ref) {
    return <MantineSegmentedControl ref={ref} {...props} />
  },
)
