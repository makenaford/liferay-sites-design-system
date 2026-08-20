import { forwardRef } from 'react'
import { Tabs as MantineTabs } from '@mantine/core'
import type { TabsProps as MantineTabsProps } from '@mantine/core'

export interface TabsProps extends MantineTabsProps {}

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  return <MantineTabs ref={ref} {...props} />
})

/**
 * Tabs — Figma `Tabs Menu Bottom` component set (node `22570:34600`).
 *
 * A themed Mantine `Tabs` that adds no props of its own. All appearance lives in the theme
 * (`src/theme/components.ts` + `components.module.css`).
 *
 * The name is literal: **the rule and the active indicator sit on the top edge**, above the labels,
 * because this bar is drawn to close a section rather than open one — in Figma the divider, the tab bar
 * and the active tab's indicator all share the same y. Mantine's `inverted` is that flip and it is on
 * by default; pass `inverted={false}` for a conventional underline beneath the labels.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Size` — Desktop / Mobile | **responsive** — a media query at 1200px, not a prop |
 * | `Tab Element` `State` — Default | the resting tab |
 * | `State` — Hover | the real `:hover` state |
 * | `State` — Active | `value` / `defaultValue` |
 * | Each tab's label | `<Tabs.Tab value="…">` |
 *
 * ```tsx
 * <Tabs defaultValue="websites">
 *   <Tabs.List>
 *     <Tabs.Tab value="websites">Enterprise Websites</Tabs.Tab>
 *     <Tabs.Tab value="commerce">Digital Commerce</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="websites">…</Tabs.Panel>
 *   <Tabs.Panel value="commerce">…</Tabs.Panel>
 * </Tabs>
 * ```
 *
 * ## Tabs, not a segmented control
 *
 * This renders `role="tablist"` with `role="tab"` children and `role="tabpanel"` sections, and moves
 * the selection with the arrow keys — the semantics for **swapping panels**. `SegmentedControl` is the
 * other half of that pair: it looks similar in Figma but is a radio group, for picking one option where
 * the choice itself is the outcome. Pick by what the control does, not by which one the mockup shows.
 *
 * Figma draws neither a focus nor a disabled state for a tab. Focus uses this system's
 * `Styles/focus-ring` and disabled follows the half-opacity every other disabled control here uses;
 * both are marked as inferred in `components.module.css` and README.md.
 */
export const Tabs = Object.assign(TabsBase, {
  List: MantineTabs.List,
  Tab: MantineTabs.Tab,
  Panel: MantineTabs.Panel,
})
