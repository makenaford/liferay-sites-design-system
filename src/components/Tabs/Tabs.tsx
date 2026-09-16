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

    /*
     * Offsets against the list's **scrolled content**, so the pill sits where the tab sits.
     *
     * `box.left - listBox.left` is a viewport delta, and the indicator it feeds is an `::after`
     * positioned inside the list's padding box — which scrolls. The two frames of reference differ by
     * exactly `scrollLeft`, and at rest that is 0, which is why this read correctly for so long. On a
     * phone the bar is always scrolled: tapping a tab there put the highlight `scrollLeft` px away from
     * the tab it belongs to — 488px, measured on the Home page's six-capability bar.
     *
     * `+ list.scrollLeft` converts the delta into content space. `offsetLeft` would say the same thing,
     * but only while the tab's `offsetParent` is the list, which is Mantine's business rather than ours.
     */
    const listBox = list.getBoundingClientRect()
    const box = active.getBoundingClientRect()
    list.style.setProperty('--sds-pill-x', `${box.left - listBox.left + list.scrollLeft}px`)
    list.style.setProperty('--sds-pill-w', `${box.width}px`)
    list.style.setProperty('--sds-pill-opacity', '1')

    /*
     * Which edges have more behind them, for the fade in the stylesheet.
     *
     * A clipped label on a 1000px-radius container reads as a rendering fault rather than as an
     * invitation to scroll. The fade is per edge and only on an edge with something behind it, the same
     * contract `Carousel` uses — a bar faded at both ends before it has been touched is the thing that
     * makes the first tab look disabled.
     */
    const max = list.scrollWidth - list.clientWidth
    list.toggleAttribute('data-overflow-start', list.scrollLeft > 2)
    list.toggleAttribute('data-overflow-end', list.scrollLeft < max - 2)
  }, [])

  /*
   * The selected tab, brought into view.
   *
   * The Home page opens its capability bar on the fourth of six options, 555px along a 335px track — so
   * the panel below rendered Enterprise Websites content while every pill a phone could see read
   * unselected. A control has to show its own state; one that cannot be seen is not showing anything.
   *
   * `scrollLeft` directly rather than `scrollIntoView`, which walks up the ancestors and would scroll
   * the *page* to the tab bar on load. This cannot move anything but the bar.
   */
  const reveal = useCallback((behavior: ScrollBehavior) => {
    const list = rootRef.current?.querySelector<HTMLElement>('[role="tablist"]')
    if (!list) return
    const active = list.querySelector<HTMLElement>('[role="tab"][data-active]')
    if (!active) return
    const max = list.scrollWidth - list.clientWidth
    if (max <= 0) return

    const listBox = list.getBoundingClientRect()
    const box = active.getBoundingClientRect()
    /* Centred where there is room to centre it, and hard against whichever end it belongs to. */
    const target = box.left - listBox.left + list.scrollLeft - (list.clientWidth - box.width) / 2
    list.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior })
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    if (!root) return undefined

    measure()
    /* No animation for the opening position: it is where the bar starts, not a move it makes. */
    reveal('auto')

    /* `data-active` moving from one tab to another is the selection changing. */
    const mutations = new MutationObserver(() => {
      measure()
      /*
       * A tap on a half-visible tab is a tap on a tab, so the bar brings it the rest of the way in.
       * Smooth here where the opening position was instant — this one *is* a move the bar makes, and it
       * is also the cue that the row goes further than what is on screen.
       */
      reveal('smooth')
    })
    mutations.observe(root, { attributes: true, attributeFilter: ['data-active'], subtree: true })

    /* Labels reflowing, the container resizing, a font arriving late. */
    const resizes = new ResizeObserver(measure)
    resizes.observe(root)
    const list = root.querySelector<HTMLElement>('[role="tablist"]')
    if (list) for (const tab of list.children) resizes.observe(tab)

    /* The fade follows the thumb, so the flags have to be recomputed as the bar moves. */
    list?.addEventListener('scroll', measure, { passive: true })

    /*
     * And once more when the webfont lands.
     *
     * A bar measured in the fallback face can be wider than the same bar in Source Sans 3 — so a row
     * that ends up fitting was briefly overflowing, set `data-overflow-end` on that first pass, and kept
     * it: a list that does not scroll never fires a scroll event to correct itself. The visible cost was
     * a permanent fade over the last tab of the two-tab bar, which reads as a disabled tab.
     *
     * The `ResizeObserver` above catches a *tab* changing width, which is why this is not already
     * handled — the tabs here did not change width, the text inside them did, and the row's total came
     * out under the container either way.
     */
    document.fonts?.ready.then(measure).catch(() => {})

    return () => {
      mutations.disconnect()
      resizes.disconnect()
      list?.removeEventListener('scroll', measure)
    }
  }, [enabled, measure, reveal])

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
