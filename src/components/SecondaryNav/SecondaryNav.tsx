import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface SecondaryNavItem {
  /** Identifies the item. Also what `value` and `onChange` speak in. */
  value: string
  /** The label in the bar. */
  label: ReactNode
  /**
   * Where it goes. A `#fragment` is a section on this page, and is what the scroll spy tracks; anything
   * else is an ordinary link to another page.
   */
  href?: string
}

export interface SecondaryNavProps
  extends BoxProps,
    Omit<ElementProps<'nav'>, 'title' | 'onChange' | 'defaultValue'> {
  /** The product or section name, at the start of the bar. */
  title?: ReactNode
  /** Makes the title a link — to the top of the product's overview, usually. */
  titleHref?: string
  /** The links in the bar. */
  items?: SecondaryNavItem[]
  /** The current item, controlled. `null` for none. */
  value?: string | null
  /** The current item on mount, uncontrolled. */
  defaultValue?: string | null
  /** Notified when the current item changes — by a click, or by the scroll spy. */
  onChange?: (value: string | null) => void
  /**
   * Follow the page: as each `#fragment` section reaches the bar, its item becomes current.
   *
   * @default true
   */
  spy?: boolean
  /** The end of the bar: a single call to action. */
  action?: ReactNode
  /**
   * Stick below the header once the page scrolls to it.
   *
   * @default true
   */
  sticky?: boolean
  /**
   * How far from the top of the viewport it sticks, in px — the height of whatever is fixed above it.
   *
   * 56 is the `Header`'s condensed bar, which is the height it has whenever this one is stuck under it.
   *
   * @default 56
   */
  offset?: number
}

const isFragment = (href?: string): href is `#${string}` => !!href && href.startsWith('#') && href.length > 1

/**
 * SecondaryNav — the in-page bar for a product or a long page, sitting under the `Header`.
 *
 * Not in the Solutions Library yet, so it is built from the conventions the `Header` and the `Tabs`
 * already set rather than from a Figma component set: the same gutter as the header so the two line up,
 * the same glass once it is stuck, and the `Tabs` gradient for the current item.
 *
 * ```tsx
 * <SecondaryNav
 *   title="Liferay DXP"
 *   items={[
 *     { value: 'overview', label: 'Overview', href: '#overview' },
 *     { value: 'features', label: 'Features', href: '#features' },
 *   ]}
 *   action={<Button size="sm">Request a demo</Button>}
 * />
 * ```
 *
 * ## How it behaves, and why
 *
 * **Links, not tabs.** Every item is an `<a>` in a `<nav>`, and the current one carries
 * `aria-current` — `location` for a section of this page, `page` for another page. `role="tablist"`
 * would promise arrow-key switching between panels, and there are no panels here: it is a page of
 * sections, and Tab is what people expect.
 *
 * **The scroll spy follows the page.** An item whose `href` is a `#fragment` becomes current once its
 * section's top passes the foot of the bar. Clicking one scrolls to the section with the bar's own
 * height taken off, so the heading lands below the bar rather than under it, and the spy stands down
 * until the scroll finishes so the highlight does not tick through every section on the way.
 *
 * **On a phone the links scroll sideways** rather than wrapping or collapsing into a menu. The current
 * one is kept in view, the edges fade only where there is more behind them, and the title gives up its
 * space — the header above already says whose site it is.
 */
export function SecondaryNav({
  title,
  titleHref,
  items = [],
  value,
  defaultValue = null,
  onChange,
  spy = true,
  action,
  sticky = true,
  offset = 56,
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: SecondaryNavProps) {
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue)
  const current = value !== undefined ? value : uncontrolled
  const [stuck, setStuck] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  /* True while a click's smooth scroll is in flight, so the spy does not fight it. */
  const settling = useRef(false)
  /* The latest `current`, readable from the scroll handler without resubscribing on every change. */
  const currentRef = useRef(current)
  currentRef.current = current

  const change = useCallback(
    (next: string | null) => {
      if (next === currentRef.current) return
      currentRef.current = next
      setUncontrolled(next)
      onChange?.(next)
    },
    [onChange],
  )

  /*
   * One passive scroll listener, batched to a frame, does both jobs: whether the bar is stuck, and which
   * section it is over. An IntersectionObserver per section would answer the second, but "which one has
   * most recently passed a line" is a question about order, and observers report crossings one at a
   * time — a fast scroll can skip one entirely.
   */
  useEffect(() => {
    let frame = 0
    /* The first read on mount may add a current item, but never clears one — that is `defaultValue`'s. */
    let initial = true

    const read = () => {
      frame = 0
      const nav = navRef.current
      if (!nav) return
      const box = nav.getBoundingClientRect()

      if (sticky) setStuck(box.top <= offset + 0.5 && window.scrollY > 0)

      const first = initial
      initial = false
      if (!spy || settling.current) return

      const line = box.bottom + 1
      let next: string | null = null
      for (const item of items) {
        if (!isFragment(item.href)) continue
        const target = document.getElementById(decodeURIComponent(item.href.slice(1)))
        if (target && target.getBoundingClientRect().top <= line) next = item.value
      }

      /* At the very bottom the last section may be too short ever to reach the line; give it the bar. */
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atEnd) {
        const last = [...items].reverse().find((item) => isFragment(item.href))
        if (last && document.getElementById(decodeURIComponent(last.href!.slice(1)))) next = last.value
      }

      /* Above the first section nothing is current — unless the page is using links, not fragments. */
      if (next !== null || (!first && items.some((item) => isFragment(item.href)))) change(next)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items, spy, sticky, offset, change])

  /*
   * The current item, kept in view along the bar, and the edge fades.
   *
   * `scrollLeft` directly rather than `scrollIntoView`, which walks the ancestors and would scroll the
   * page as well — the same reasoning, and the same arithmetic, as `Tabs`.
   */
  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const edges = () => {
      const max = list.scrollWidth - list.clientWidth
      list.toggleAttribute('data-overflow-start', list.scrollLeft > 2)
      list.toggleAttribute('data-overflow-end', list.scrollLeft < max - 2)
    }

    const active = list.querySelector<HTMLElement>('[aria-current]')
    const max = list.scrollWidth - list.clientWidth
    if (active && max > 0) {
      const listBox = list.getBoundingClientRect()
      const box = active.getBoundingClientRect()
      const left = box.left - listBox.left + list.scrollLeft
      const target = Math.min(max, Math.max(0, left - (list.clientWidth - box.width) / 2))
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      list.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' })
    }

    edges()
    list.addEventListener('scroll', edges, { passive: true })
    const observer = new ResizeObserver(edges)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', edges)
      observer.disconnect()
    }
  }, [current, items])

  const onItemClick = (event: MouseEvent<HTMLAnchorElement>, item: SecondaryNavItem) => {
    if (!isFragment(item.href)) {
      change(item.value)
      return
    }
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return
    }

    const target = document.getElementById(decodeURIComponent(item.href.slice(1)))
    if (!target) return
    event.preventDefault()
    change(item.value)

    /*
     * The bar's own height comes off the destination, and so does the offset it sticks at, so the
     * heading lands just below the bar. A plain fragment jump would put it underneath.
     */
    const barHeight = navRef.current?.offsetHeight ?? 0
    const top = target.getBoundingClientRect().top + window.scrollY - offset - barHeight
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    settling.current = true
    const release = () => {
      settling.current = false
      window.removeEventListener('scrollend', release)
    }
    window.addEventListener('scrollend', release)
    /* No `scrollend` in older Safari, and none at all if the page is already there. */
    window.setTimeout(release, 1000)

    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    history.replaceState(null, '', item.href)
    /* Move focus with the reader, so the next Tab continues from the section rather than the bar. */
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  return (
    <Box
      component="nav"
      ref={navRef}
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Section')}
      className={[classes.secondaryNav, className].filter(Boolean).join(' ')}
      data-sticky={sticky || undefined}
      data-stuck={stuck || undefined}
      style={[{ '--sds-secondary-nav-offset': `${offset}px` } as CSSProperties, style]}
      {...props}
    >
      <div className={classes.secondaryNavInner}>
        {title ? (
          titleHref ? (
            <a className={classes.secondaryNavTitle} href={titleHref}>
              {title}
            </a>
          ) : (
            <span className={classes.secondaryNavTitle}>{title}</span>
          )
        ) : null}

        <div ref={listRef} className={classes.secondaryNavList}>
          {items.map((item) => {
            const isCurrent = item.value === current
            return (
              <a
                key={item.value}
                href={item.href}
                className={classes.secondaryNavItem}
                aria-current={isCurrent ? (isFragment(item.href) ? 'location' : 'page') : undefined}
                data-active={isCurrent || undefined}
                onClick={(event) => onItemClick(event, item)}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        {action ? <div className={classes.secondaryNavAction}>{action}</div> : null}
      </div>
    </Box>
  )
}
