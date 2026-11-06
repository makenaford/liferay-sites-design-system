/**
 * The box a component scrolls with: its nearest scrolling ancestor, or the window.
 *
 * A published page scrolls the window, but the builder's canvas scrolls a `ScrollArea` inside the
 * editor, and a bar listening to the window there never hears the page move — it never sticks, never
 * replaces the header, and its scroll spy never advances. Everything that reads a scroll position goes
 * through this, so the two measure the same way.
 */
export interface Scroller {
  /** How far it has scrolled. */
  top: () => number
  /** Where its visible area starts, in viewport coordinates — 0 for the window. */
  viewTop: () => number
  viewHeight: () => number
  scrollHeight: () => number
  scrollTo: (top: number, behavior: ScrollBehavior) => void
}

const WINDOW: Scroller = {
  top: () => window.scrollY,
  viewTop: () => 0,
  viewHeight: () => window.innerHeight,
  scrollHeight: () => document.documentElement.scrollHeight,
  scrollTo: (top, behavior) => window.scrollTo({ top, behavior }),
}

/**
 * Asked fresh on every read rather than once on mount: the canvas only overflows once the page inside it
 * has laid out, which can be after the bar's effects first run.
 *
 * Only an ancestor that actually scrolls counts. `overflow-x: hidden` alone computes `overflow-y` to
 * `auto`, so a page wrapper clipping a bleed would otherwise be mistaken for the scroller — the content
 * having somewhere to go is what tells them apart.
 */
export function scrollerOf(el: Element | null): Scroller {
  let node = el?.parentElement ?? null
  while (node && node !== document.body && node !== document.documentElement) {
    if (/auto|scroll|overlay/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight) {
      const box = node
      return {
        top: () => box.scrollTop,
        viewTop: () => box.getBoundingClientRect().top,
        viewHeight: () => box.clientHeight,
        scrollHeight: () => box.scrollHeight,
        scrollTo: (top, behavior) => box.scrollTo({ top, behavior }),
      }
    }
    node = node.parentElement
  }
  return WINDOW
}

/**
 * Calls `handler` when anything scrolls — the window or any box inside it — and on a resize. A capture
 * listener on the document hears an element's `scroll`, which does not bubble, so a component need not
 * know in advance which box it scrolls with. Returns the unsubscribe.
 */
export function onAnyScroll(handler: () => void, type: 'scroll' | 'scrollend' = 'scroll'): () => void {
  const options = { capture: true, passive: true }
  document.addEventListener(type, handler, options)
  if (type === 'scroll') window.addEventListener('resize', handler)
  return () => {
    document.removeEventListener(type, handler, options)
    if (type === 'scroll') window.removeEventListener('resize', handler)
  }
}
