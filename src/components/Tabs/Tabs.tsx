import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { Tabs as MantineTabs } from '@mantine/core'
import type { TabsProps as MantineTabsProps } from '@mantine/core'

export interface TabsProps extends MantineTabsProps {}

/**
 * Keeps the sliding indicator under — or over — the active tab.
 *
 * The active tab is read from the DOM rather than from a prop, because `Tabs` is uncontrolled as often as
 * not — the value lives inside Mantine and this wrapper never re-renders when it changes. Mantine marks the
 * active tab `data-active`, so a `MutationObserver` on that attribute is the one signal that works for both
 * controlled and uncontrolled use.
 */
function useTabIndicator(enabled: boolean) {
  const rootRef = useRef<HTMLDivElement>(null)

  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const list = root.querySelector<HTMLElement>('[role="tablist"]')
    if (!list) return
    const active = list.querySelector<HTMLElement>('[role="tab"][data-active]')

    if (!active) {
      list.style.setProperty('--sds-pill-opacity', '0')
      return
    }

    /* Offsets against the list's padding box, so the pill sits where the tab sits. */
    const listBox = list.getBoundingClientRect()
    const box = active.getBoundingClientRect()
    list.style.setProperty('--sds-pill-x', `${box.left - listBox.left}px`)
    list.style.setProperty('--sds-pill-w', `${box.width}px`)
    list.style.setProperty('--sds-pill-opacity', '1')
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    if (!root) return undefined

    measure()

    /* `data-active` moving from one tab to another is the selection changing. */
    const mutations = new MutationObserver(measure)
    mutations.observe(root, { attributes: true, attributeFilter: ['data-active'], subtree: true })

    /* Labels reflowing, the container resizing, a font arriving late. */
    const resizes = new ResizeObserver(measure)
    resizes.observe(root)
    const list = root.querySelector('[role="tablist"]')
    if (list) for (const tab of list.children) resizes.observe(tab)

    return () => {
      mutations.disconnect()
      resizes.disconnect()
    }
  }, [enabled, measure])

  return rootRef
}

const TabsBase = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = 'default', inverted, ...props },
  ref,
) {
  const isPills = variant === 'pills'
  /*
   * Both variants measure. The pill slides because it always did; the underline slides now for the same
   * reason — it is one line that moves to the tab you chose, rather than a line per tab fading out where
   * it was while another fades in somewhere else. Two crossfades read as a flicker between two places;
   * one line travelling reads as the selection moving, which is what it is.
   */
  const rootRef = useTabIndicator(true)

  return (
    <MantineTabs
      ref={(node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      variant={variant}
      /*
       * `inverted` is the underline bar's default — the rule sits above the labels there. A pill menu has no
       * rule to inverst, and leaving it on would put the (unused) border on the wrong edge.
       */
      inverted={isPills ? false : (inverted ?? true)}
      data-pills={isPills || undefined}
      {...props}
    />
  )
})

/**
 * Tabs — two things Figma draws as separate components, both of which are tabs.
 *
 * - **`variant="default"`** is `Tabs Menu Bottom` (node `22570:34600`): labels with a rule and an active
 *   indicator on their **top** edge, because that bar is drawn to close a section rather than open one.
 *   Mantine's `inverted` is that flip and it is on by default here.
 * - **`variant="pills"`** is `Tabs Pill Menu` (node `17900:62310`), built from `Tabs Pill` (`20517:21553`):
 *   a glass container with a full-radius pill sliding under the selection. This replaces the
 *   `SegmentedControl` that used to be a separate component — the Figma set is named `Tabs Pill Menu`, its
 *   cells are tabs, and it swaps panels, so it belongs here.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Tabs Menu Bottom` | `variant="default"` |
 * | `Tabs Pill Menu` | `variant="pills"` |
 * | `Sizes` / `Size` — Desktop / Mobile | **responsive**, a media query at 1200px |
 * | `Tabs Pill` `State` — Default / Hover / Selected | the real CSS states and `value` |
 * | `Show Icon Left` + `Icon` | `<Tabs.Tab leftSection={…}>` |
 *
 * ```tsx
 * <Tabs variant="pills" defaultValue="websites">
 *   <Tabs.List grow>
 *     <Tabs.Tab value="websites" leftSection={<IconGlassComposable />}>Websites</Tabs.Tab>
 *     <Tabs.Tab value="commerce">Commerce</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="websites">…</Tabs.Panel>
 * </Tabs>
 * ```
 *
 * ## The pill slides
 *
 * Figma draws `Default`, `Hover` and `Selected` as three still frames and says nothing about how one becomes
 * another. The selected pill here **slides** between tabs instead of appearing on the new one: one element
 * moving is a thing being moved, where two elements crossfading is two different things. It runs on
 * `transform` and `width`, and the label above it never moves.
 *
 * The position is measured from the live layout — the active tab's own offset and width — so it is right
 * with labels of any length, with `grow` on or off, after a resize, and after a late-loading font.
 *
 * `Hover` is Figma's own, and unusual: no fill and no stroke, just a `Brand/Primary/Lighten/4` glow at
 * offset (-1, 1), blur 4, spread 4. Reproduced as drawn rather than replaced with a fill, so hover reads as
 * "not yet selected" while the sliding pill stays the only filled thing in the bar.
 *
 * The selected label is `Action/Neutral/Inverted`, and here that white is **right** — unlike the Link, the
 * neutral Button and the underline tabs, where the same mode-independent token landed on a mode-aware
 * surface. The pill has a fill behind it in both modes: opaque `Brand/Primary` blue in light, translucent
 * white over near-black on dark.
 *
 * Under `prefers-reduced-motion` the pill jumps rather than slides, and the glow stops animating.
 *
 * ## Tabs, not a radio group
 *
 * Both variants render `role="tablist"` with `role="tab"` children and `role="tabpanel"` sections, and move
 * the selection with the arrow keys — the semantics for **swapping panels**. That is what the pill menu is
 * for too, which is the substantive reason it is a variant here rather than a `SegmentedControl`: a
 * segmented control is a radio group, for picking a value where the choice itself is the outcome. If that is
 * what a screen needs, a `Radio.Group` or a `Select` is the honest control.
 */
export const Tabs = Object.assign(TabsBase, {
  List: MantineTabs.List,
  Tab: MantineTabs.Tab,
  Panel: MantineTabs.Panel,
})
