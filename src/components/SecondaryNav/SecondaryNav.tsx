import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { MegaMenu } from '../Header'
import { IconDown } from '../../icons'

export interface SecondaryNavLink {
  /** The link's own text. */
  label: ReactNode
  href: string
  /** A line under the label. */
  description?: ReactNode
  /** A `UI Icon` glyph beside the label. */
  icon?: ReactNode
  /** Marks a link that leaves the site. */
  external?: boolean
}

export interface SecondaryNavItem {
  /** Identifies the item, and ties a trigger to its panel through `aria-controls`. */
  value: string
  /** The label in the bar. */
  label: ReactNode
  /** The links the dropdown opens onto. */
  links?: SecondaryNavLink[]
  /** A panel of your own instead of `links` — a `MegaMenu` composition, say. */
  menu?: ReactNode
  /**
   * For an item that navigates rather than opening a panel. A `#fragment` is a section of this page,
   * and is what the scroll spy tracks.
   */
  href?: string
}

export interface SecondaryNavProps
  extends BoxProps,
    Omit<ElementProps<'nav'>, 'title' | 'onChange' | 'defaultValue'> {
  /** The product name, at the start of the bar — `Commerce` in the file. */
  title?: ReactNode
  /** The product's `UI Icon`, before the name. */
  icon?: ReactNode
  /** Makes the name a link — to the product's overview, usually. */
  titleHref?: string
  /** The items in the bar, each optionally opening a dropdown. */
  items?: SecondaryNavItem[]
  /** Which dropdown is open on mount. */
  defaultOpen?: string | null
  /** Notified whenever a dropdown opens or closes, with the open item's `value` or `null`. */
  onOpenChange?: (value: string | null) => void
  /** The current item, controlled — for a bar of plain links. `null` for none. */
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
  /** The end of the bar: a single call to action. Not in the file; there if a page needs one. */
  action?: ReactNode
  /**
   * Stick below the header once the page scrolls to it.
   *
   * @default true
   */
  sticky?: boolean
  /**
   * How far from the top of the viewport it sticks, in px.
   *
   * Leave it out under this library's `Header`: a fixed header publishes its height as
   * `--sds-header-offset`, and the bar sticks at its foot — 64, or 56 once a condensing header has
   * condensed. Without a header it sticks at the top.
   */
  offset?: number
}

const isFragment = (href?: string): href is `#${string}` =>
  !!href && href.startsWith('#') && href.length > 1

const hasPanel = (item: SecondaryNavItem) => !!item.menu || !!item.links?.length

/** Where the bar sticks, read back from the stylesheet — which is where the header's height arrives. */
const stickAt = (nav: HTMLElement) => parseFloat(getComputedStyle(nav).top) || 0

/**
 * SecondaryNav — a product's own bar, under the `Header`: its name, and a dropdown per section.
 *
 * Built from the file's `Secondary Nav` (node `24826:50238`): the product's icon and name in 24px
 * Regular, then the same `Mega Menu Nav Item` the header uses, each with its caret. The file draws the
 * closed bar and the `Opened Background` it takes while a dropdown is open, but not the dropdown
 * itself — so the panel is this library's own glass surface holding `MegaMenu.Item` rows, the links
 * the header's panels are already made of.
 *
 * ```tsx
 * <SecondaryNav
 *   icon={<IconShoppingCart2 />}
 *   title="Commerce"
 *   items={[
 *     { value: 'features', label: 'Features', links: [{ label: 'Catalog', href: '/commerce/catalog' }] },
 *   ]}
 * />
 * ```
 *
 * ## How it behaves, and why
 *
 * **The header's disclosure, again.** Click to open, not hover; each trigger is a
 * `<button aria-expanded aria-controls>` over a region of ordinary links, so Tab moves through them the
 * way it does everywhere else. Escape closes and returns focus to the trigger, a click outside closes,
 * and following a link closes. One dropdown at a time.
 *
 * **The panel hangs from its trigger**, and sits outside the scrolling list of items so a phone's
 * sideways-scrolling bar cannot clip it. It is kept inside the gutter at either end, and on a phone it
 * spans the gutter-to-gutter width.
 *
 * **Plain links are still allowed.** An item with an `href` and no panel is a link, marked
 * `aria-current` when it is the current item, and a `#fragment` one is followed by the scroll spy.
 */
export function SecondaryNav({
  title,
  icon,
  titleHref,
  items = [],
  defaultOpen = null,
  onOpenChange,
  value,
  defaultValue = null,
  onChange,
  spy = true,
  action,
  sticky = true,
  offset,
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: SecondaryNavProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen)
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue)
  const current = value !== undefined ? value : uncontrolled
  const [stuck, setStuck] = useState(false)
  const [panelX, setPanelX] = useState(0)

  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const triggers = useRef(new Map<string, HTMLButtonElement | null>())
  const panels = useRef(new Map<string, HTMLDivElement | null>())
  const baseId = useId()
  /* True while a click's smooth scroll is in flight, so the spy does not fight it. */
  const settling = useRef(false)
  /* The latest `current`, readable from the scroll handler without resubscribing on every change. */
  const currentRef = useRef(current)
  currentRef.current = current

  const toggle = useCallback(
    (next: string | null) => {
      setOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange],
  )

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
   * Where the open panel hangs: under its trigger, pulled back inside the gutter if it would run past
   * the end of the bar. Measured before paint so it never flashes at the wrong place.
   */
  useLayoutEffect(() => {
    if (!open) return
    const nav = navRef.current
    const trigger = triggers.current.get(open)
    const panel = panels.current.get(open)
    if (!nav || !trigger || !panel) return

    const navBox = nav.getBoundingClientRect()
    /* The inner row's padding, resolved — the custom property itself reads back as its `clamp()`. */
    const inner = nav.firstElementChild as HTMLElement | null
    const gutter = inner ? parseFloat(getComputedStyle(inner).paddingLeft) : 20
    const left = trigger.getBoundingClientRect().left - navBox.left
    const max = navBox.width - panel.offsetWidth - gutter
    setPanelX(Math.max(gutter, Math.min(left, max)))
  }, [open])

  /** Escape closes the panel and hands focus back to the trigger; so does a click outside. */
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const trigger = triggers.current.get(open)
      toggle(null)
      trigger?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) toggle(null)
    }
    /* The panel is placed against its trigger; once the list scrolls under it, that is stale. */
    const list = listRef.current
    const onMove = () => toggle(null)

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    list?.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      list?.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
    }
  }, [open, toggle])

  /*
   * One passive scroll listener, batched to a frame, does both jobs: whether the bar is stuck, and which
   * section it is over. "Which one most recently passed a line" is a question about order, which
   * IntersectionObservers — reporting crossings one at a time — answer badly on a fast scroll.
   */
  useEffect(() => {
    let frame = 0
    /* The first read on mount may add a current item, but never clears one — that is `defaultValue`'s. */
    let initial = true
    const tracked = items.filter((item) => !hasPanel(item) && isFragment(item.href))

    const read = () => {
      frame = 0
      const nav = navRef.current
      if (!nav) return
      const box = nav.getBoundingClientRect()

      if (sticky) setStuck(box.top <= stickAt(nav) + 0.5 && window.scrollY > 0)

      const first = initial
      initial = false
      if (!spy || settling.current || !tracked.length) return

      const line = box.bottom + 1
      let next: string | null = null
      for (const item of tracked) {
        const target = document.getElementById(decodeURIComponent(item.href!.slice(1)))
        if (target && target.getBoundingClientRect().top <= line) next = item.value
      }

      /* At the very bottom the last section may be too short ever to reach the line; give it the bar. */
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atEnd) next = tracked[tracked.length - 1].value

      if (next !== null || !first) change(next)
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
  }, [items, spy, sticky, change])

  /*
   * The edge fades on a bar that scrolls sideways — only on an edge with something behind it, the
   * contract `Tabs` and `Carousel` keep.
   */
  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    const edges = () => {
      const max = list.scrollWidth - list.clientWidth
      list.toggleAttribute('data-overflow-start', list.scrollLeft > 2)
      list.toggleAttribute('data-overflow-end', list.scrollLeft < max - 2)
    }

    edges()
    list.addEventListener('scroll', edges, { passive: true })
    const observer = new ResizeObserver(edges)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', edges)
      observer.disconnect()
    }
  }, [items])

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, item: SecondaryNavItem) => {
    if (!isFragment(item.href)) {
      change(item.value)
      return
    }
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.button !== 0
    ) {
      return
    }

    const target = document.getElementById(decodeURIComponent(item.href.slice(1)))
    if (!target) return
    event.preventDefault()
    change(item.value)

    /* The bar and the offset it sticks at both come off, so the heading lands just below the bar. */
    const nav = navRef.current
    const barHeight = nav?.offsetHeight ?? 0
    const top =
      target.getBoundingClientRect().top + window.scrollY - (nav ? stickAt(nav) : 0) - barHeight
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
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  const brand = (
    <>
      {icon ? (
        <span className={classes.secondaryNavIcon} aria-hidden>
          {icon}
        </span>
      ) : null}
      {title}
    </>
  )

  return (
    <Box
      component="nav"
      ref={navRef}
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Product')}
      className={[classes.secondaryNav, className].filter(Boolean).join(' ')}
      data-sticky={sticky || undefined}
      data-stuck={stuck || undefined}
      data-open={open ? true : undefined}
      style={[
        {
          ...(offset !== undefined ? { '--sds-secondary-nav-offset': `${offset}px` } : null),
          '--sds-secondary-panel-x': `${panelX}px`,
        } as CSSProperties,
        style,
      ]}
      {...props}
    >
      <div className={classes.secondaryNavInner}>
        {title ? (
          titleHref ? (
            <a className={classes.secondaryNavTitle} href={titleHref}>
              {brand}
            </a>
          ) : (
            <span className={classes.secondaryNavTitle}>{brand}</span>
          )
        ) : null}

        <div ref={listRef} className={classes.secondaryNavList}>
          {items.map((item) => {
            if (!hasPanel(item)) {
              const isCurrent = item.value === current
              return (
                <a
                  key={item.value}
                  href={item.href}
                  className={classes.secondaryNavItem}
                  data-active={isCurrent || undefined}
                  aria-current={
                    isCurrent ? (isFragment(item.href) ? 'location' : 'page') : undefined
                  }
                  onClick={(event) => onLinkClick(event, item)}
                >
                  {item.label}
                </a>
              )
            }

            const isOpen = open === item.value
            return (
              <UnstyledButton
                key={item.value}
                component="button"
                type="button"
                ref={(node: HTMLButtonElement | null) => {
                  triggers.current.set(item.value, node)
                }}
                className={classes.secondaryNavItem}
                data-open={isOpen || undefined}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${item.value}`}
                onClick={() => toggle(isOpen ? null : item.value)}
              >
                {item.label}
                <span className={classes.secondaryNavCaret} aria-hidden>
                  <IconDown />
                </span>
              </UnstyledButton>
            )
          })}
        </div>

        {action ? <div className={classes.secondaryNavAction}>{action}</div> : null}
      </div>

      {/*
       * The panels, outside the list: it scrolls sideways on a phone, and a scrolling box clips
       * everything positioned inside it. `hidden` keeps the closed ones out of the tab order.
       */}
      {items.filter(hasPanel).map((item) => (
        <div
          key={item.value}
          id={`${baseId}-${item.value}`}
          ref={(node) => {
            panels.current.set(item.value, node)
          }}
          className={classes.secondaryNavPanel}
          role="region"
          aria-label={typeof item.label === 'string' ? item.label : undefined}
          hidden={open !== item.value}
          /* Following a link closes the panel; the page it leads to may be this one. */
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) toggle(null)
          }}
        >
          {item.menu ?? (
            <div className={classes.secondaryNavLinks}>
              {item.links!.map((link, index) => (
                <MegaMenu.Item
                  key={index}
                  href={link.href}
                  icon={link.icon}
                  title={link.label}
                  description={link.description}
                  external={link.external}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </Box>
  )
}
