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
import { IconDown } from '../../icons'

export interface SecondaryNavLink {
  /** The link's own text. */
  label: ReactNode
  href: string
  /** A line under the label. */
  description?: ReactNode
  /** A `UI Icon` glyph beside the label. */
  icon?: ReactNode
  /**
   * A 3:2 image in place of the icon — the file's customer-story rows. Any link in a dropdown with one
   * makes the whole dropdown the thumbnail layout.
   */
  thumbnail?: string
  /** The thumbnail's alt. Empty by default: the title beside it already names the story. */
  thumbnailAlt?: string
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
  /**
   * Which dropdown is open on mount. On a phone, the menu opens on mount with this section expanded.
   */
  defaultOpen?: string | null
  /** Open the phone menu on mount, every section collapsed — the file's `Mobile- Opened`. */
  defaultMenuOpen?: boolean
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
   * Take the header's place on scroll — the file's `On Scroll` frame. Once the bar's own resting place
   * has scrolled past, the fixed header slides away and this bar moves up to the top of the viewport;
   * back above that line, the header returns.
   *
   * Only meaningful while `sticky`, and under this library's fixed `Header`.
   *
   * @default true
   */
  replaceHeader?: boolean
  /**
   * How far from the top of the viewport it sticks, in px.
   *
   * Leave it out under this library's `Header`: a fixed header publishes its height as
   * `--sds-header-offset`, and the bar sticks at its foot — 65, or 57 once a condensing header has
   * condensed. Without a header it sticks at the top.
   */
  offset?: number
}

const isFragment = (href?: string): href is `#${string}` =>
  !!href && href.startsWith('#') && href.length > 1

const hasPanel = (item: SecondaryNavItem) => !!item.menu || !!item.links?.length

/** The attribute on the root that tells a fixed `Header` to step aside. */
const HEADER_HIDDEN = 'data-sds-header-hidden'

/** Where the bar sticks, read back from the stylesheet — which is where the header's height arrives. */
const stickAt = (nav: HTMLElement) => parseFloat(getComputedStyle(nav).top) || 0

/**
 * SecondaryNav — a product's own bar, under the `Header`: its name, and a dropdown per section.
 *
 * Built from `LRDC- Secondary Nav` (node `1:11476`): the product's glass icon and name in 24px Regular,
 * then the header's own nav items. Two dropdowns are drawn — icon rows with a line of description
 * (`Features`) and thumbnail rows (`Customer Stories`) — both hung flush from the bar's foot under their
 * trigger. `On Scroll` is the bar alone at the top of the viewport, the site header gone.
 *
 * ```tsx
 * <SecondaryNav
 *   icon={<IconGlassCommerce size={32} />}
 *   title="Commerce"
 *   items={[
 *     {
 *       value: 'features',
 *       label: 'Features',
 *       links: [{ label: 'Commerce Overview', href: '/commerce', icon: <IconShoppingCart1 /> }],
 *     },
 *   ]}
 * />
 * ```
 *
 * ## How it behaves, and why
 *
 * **The header's items, exactly.** Each is the header's own `.headerItem` — the same 12/8 padding with
 * no gap between them, the same caret, underline, hover and focus — rather than a copy that could drift.
 *
 * **The header's disclosure, again.** Click to open, not hover; each trigger is a
 * `<button aria-expanded aria-controls>` over a region of ordinary links, so Tab moves through them the
 * way it does everywhere else. Escape closes and returns focus to the trigger, a click outside closes,
 * and following a link closes. One dropdown at a time.
 *
 * **It replaces the header on scroll.** Once the bar's resting place scrolls past, the root takes
 * `data-sds-header-hidden`, the fixed header slides up out of view, and the bar moves to the top. Back
 * above that line the header returns. `replaceHeader={false}` keeps both.
 *
 * **The panel hangs from its trigger**, kept inside the gutter at either end.
 *
 * **On a phone it is a menu** — the file's `Mobile` frames. Below 768px the bar keeps the product's
 * name and trades its items for a chevron; that opens a sheet with a row per section over a dimmed
 * page, and each section expands its links in place. Escape, the scrim, or following a link closes it.
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
  defaultMenuOpen = false,
  onOpenChange,
  value,
  defaultValue = null,
  onChange,
  spy = true,
  action,
  sticky = true,
  replaceHeader = true,
  offset,
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: SecondaryNavProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen)
  /*
   * The phone menu — whether the sheet is down, and which section is expanded inside it. Separate from
   * `open`, because a dropdown hanging from a trigger and a section expanding in a sheet are different
   * interactions, and sharing the state would open one behind the other on a resize.
   */
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen || defaultOpen !== null)
  const [expanded, setExpanded] = useState<string | null>(defaultOpen)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sheetId = `${useId()}-sheet`
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue)
  const current = value !== undefined ? value : uncontrolled
  const [stuck, setStuck] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const [panelX, setPanelX] = useState(0)
  /* Where the bar rests in the document, before any sticking — the line past which it replaces the header. */
  const restingTop = useRef<number | null>(null)

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

  /** Escape closes the phone menu and hands focus back to its toggle. */
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

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
      const at = stickAt(nav)
      const isStuck = box.top <= at + 0.5

      /*
       * The resting place is only readable while the bar is not stuck — or on the first read, when a bar
       * placed directly under the header is "stuck" at exactly where it rests.
       */
      if (!isStuck || restingTop.current === null) restingTop.current = box.top + window.scrollY

      if (sticky) setStuck(isStuck && window.scrollY > 0)
      setReplacing(sticky && replaceHeader && window.scrollY > restingTop.current)

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
  }, [items, spy, sticky, replaceHeader, change])

  /*
   * The header steps aside while this bar has its place. An attribute on the root rather than a prop,
   * because the two are siblings and the page should not have to wire them together — the same channel
   * the header uses in the other direction, publishing its height as `--sds-header-offset`.
   */
  useEffect(() => {
    if (!replacing) return undefined
    const root = document.documentElement
    root.setAttribute(HEADER_HIDDEN, '')
    return () => root.removeAttribute(HEADER_HIDDEN)
  }, [replacing])

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

  /** One link in a dropdown or an expanded section: the file's `Nav Item 01`, or `Nav Item 5` with a thumbnail. */
  const renderLink = (link: SecondaryNavLink, index: number, media: boolean) => (
    <a
      key={index}
      href={link.href}
      className={classes.secondaryNavLink}
      {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
    >
      {media ? (
        <span className={classes.secondaryNavThumb}>
          {link.thumbnail ? <img src={link.thumbnail} alt={link.thumbnailAlt ?? ''} /> : null}
        </span>
      ) : link.icon ? (
        <span className={classes.secondaryNavLinkIcon} aria-hidden>
          {link.icon}
        </span>
      ) : null}
      <span className={classes.secondaryNavLinkBody}>
        <span className={classes.secondaryNavLinkTitle}>{link.label}</span>
        {link.description && !media ? (
          <span className={classes.secondaryNavLinkDescription}>{link.description}</span>
        ) : null}
      </span>
      {link.external ? <span className={classes.visuallyHidden}> (opens in a new tab)</span> : null}
    </a>
  )

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
      data-replacing={replacing || undefined}
      data-open={open ? true : undefined}
      data-menu-open={menuOpen || undefined}
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
                  className={classes.headerItem}
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
                className={classes.headerItem}
                data-open={isOpen || undefined}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${item.value}`}
                onClick={() => toggle(isOpen ? null : item.value)}
              >
                {item.label}
                <span className={classes.headerCaret} aria-hidden>
                  <IconDown />
                </span>
              </UnstyledButton>
            )
          })}
        </div>

        {action ? <div className={classes.secondaryNavAction}>{action}</div> : null}

        {/* The phone's way in: the file's 40px chevron, pointing up while the sheet is down. */}
        <UnstyledButton
          ref={toggleRef}
          component="button"
          type="button"
          className={classes.secondaryNavToggle}
          aria-expanded={menuOpen}
          aria-controls={sheetId}
          aria-label={`${menuOpen ? 'Close' : 'Open'} ${typeof title === 'string' ? title : 'product'} menu`}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <IconDown aria-hidden />
        </UnstyledButton>
      </div>

      {/*
       * The phone menu — `Mobile- Opened`. A sheet under the bar with a row per section; a section with
       * links expands them in place, an accordion rather than a drill-down, because there is one level
       * and the file draws it opening where it is. A section that is only a link is a row with no
       * chevron, as the CMS frames draw it.
       */}
      <div id={sheetId} className={classes.secondaryNavSheet} hidden={!menuOpen}>
        {items.map((item) => {
          if (!hasPanel(item)) {
            const isCurrent = item.value === current
            return (
              <a
                key={item.value}
                href={item.href}
                className={classes.secondaryNavSheetRow}
                aria-current={
                  isCurrent ? (isFragment(item.href) ? 'location' : 'page') : undefined
                }
                onClick={(event) => {
                  setMenuOpen(false)
                  onLinkClick(event, item)
                }}
              >
                {item.label}
              </a>
            )
          }

          const isExpanded = expanded === item.value
          const regionId = `${sheetId}-${item.value}`
          const media = !!item.links?.some((link) => link.thumbnail)
          return (
            <div key={item.value}>
              <UnstyledButton
                component="button"
                type="button"
                className={classes.secondaryNavSheetRow}
                data-expanded={isExpanded || undefined}
                aria-expanded={isExpanded}
                aria-controls={regionId}
                onClick={() => setExpanded(isExpanded ? null : item.value)}
              >
                {item.label}
                <span className={classes.secondaryNavSheetChevron} aria-hidden>
                  <IconDown />
                </span>
              </UnstyledButton>
              <div
                id={regionId}
                className={classes.secondaryNavSheetItems}
                data-variant={item.menu ? undefined : media ? 'media' : 'links'}
                hidden={!isExpanded}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('a')) setMenuOpen(false)
                }}
              >
                {item.menu ?? item.links!.map((link, index) => renderLink(link, index, media))}
              </div>
            </div>
          )
        })}
      </div>

      {/*
       * The file's `Rectangle 1`: black at 80% over the page while the sheet is down. Inside the bar's
       * stacking context and behind its surface, so it dims the page but never the bar or the header.
       */}
      {menuOpen ? (
        <span className={classes.secondaryNavScrim} aria-hidden onClick={() => setMenuOpen(false)} />
      ) : null}

      {/*
       * The panels, outside the list: it scrolls sideways on a phone, and a scrolling box clips
       * everything positioned inside it. `hidden` keeps the closed ones out of the tab order.
       */}
      {items.filter(hasPanel).map((item) => {
        const media = !!item.links?.some((link) => link.thumbnail)
        return (
          <div
            key={item.value}
            id={`${baseId}-${item.value}`}
            ref={(node) => {
              panels.current.set(item.value, node)
            }}
            className={classes.secondaryNavPanel}
            data-variant={item.menu ? undefined : media ? 'media' : 'links'}
            role="region"
            aria-label={typeof item.label === 'string' ? item.label : undefined}
            hidden={open !== item.value}
            /* Following a link closes the panel; the page it leads to may be this one. */
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a')) toggle(null)
            }}
          >
            {item.menu ?? item.links!.map((link, index) => renderLink(link, index, media))}
          </div>
        )
      })}
    </Box>
  )
}
