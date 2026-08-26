import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { Logo } from '../Logo'
import { IconArrowLeft, IconClose, IconDown, IconMenu, IconRight } from '../../icons'

export interface HeaderNavItem {
  /** Identifies the item, and ties the trigger to its panel through `aria-controls`. */
  value: string
  /** The label in the bar. */
  label: ReactNode
  /** The mega menu panel. Omit it and the item is a plain link. */
  menu?: ReactNode
  /** For an item that navigates rather than opening a panel. */
  href?: string
}

/** What the mobile drawer is showing. `null` is the top-level section list. */
type DrawerView = string | null

export interface HeaderProps extends BoxProps, ElementProps<'header'> {
  /** The brand, top left. */
  logo?: ReactNode
  /** The sections in the bar, each optionally carrying a mega menu. */
  items?: HeaderNavItem[]
  /** The right-hand side: language, account, a call to action. */
  actions?: ReactNode
  /**
   * Which menu is open on mount. The prototype opens Platform so the first section is visible
   * immediately; a real page almost always wants `null`.
   */
  defaultOpen?: string | null
  /** Notified whenever a menu opens or closes, with the open item's `value` or `null`. */
  onOpenChange?: (value: string | null) => void
  /** `fixed` overlays the page, which is what the glass blur is for. `static` sits in the flow. */
  position?: 'fixed' | 'static'
  /**
   * Condense on scroll: at the top of the page the band is transparent and part of the hero, and once
   * the page moves it gains the glass, the hairline and a tighter bar.
   *
   * On by default, and only meaningful when `position="fixed"` — a static header scrolls away, so there
   * is nothing to condense. It reverses what the band used to do, which was to carry a blur, a hairline
   * *and* a 30px drop shadow at rest, separating it from content that was not there yet.
   *
   * @default true
   */
  condense?: boolean
}

/**
 * Header — the primary navigation, with a mega menu per section.
 *
 * Built from the desktop prototype rather than a Figma component set: a fixed glass band over the page,
 * an inset panel that drops out of it, and a staggered reveal of the columns inside. Every colour and
 * measurement in the prototype's stylesheet is one of this library's tokens, so they are used directly
 * — `Surfaces/Text/Primary` for the labels, `Action/Link/Active Link` for the open section and its
 * underline, `Components/Glass Line/*` for the hairlines, `Brand/Primary` for the button.
 *
 * ```tsx
 * <Header
 *   logo={<Logo />}
 *   items={[{ value: 'platform', label: 'Platform', menu: <MegaMenu>…</MegaMenu> }]}
 *   actions={<Button size="sm">Contact Sales</Button>}
 * />
 * ```
 *
 * ## How it behaves, and why
 *
 * **Click to open, not hover.** The prototype is click-driven and this keeps that: a hover menu is
 * unusable on touch, punishing for anyone with a tremor, and impossible to read with a screen reader
 * that has no pointer. Clicking the open section closes it again.
 *
 * **It is a disclosure, not a menubar.** Each section is a `<button aria-expanded aria-controls>` and
 * the panel is a labelled region of ordinary links. `role="menu"` is for application menus and would
 * take over the arrow keys, which in a page of links is wrong: Tab is what people expect. Escape closes
 * the panel and returns focus to its trigger, and a click outside the header closes it too.
 *
 * **Below 1200px the bar becomes a stacked panel.** The prototype is desktop-only — it says as much —
 * so the same `items` feed a burger and a full-width panel, where each section expands its own menu in
 * place. It reuses the desktop open state rather than adding a second one, and the menu content needs no
 * mobile variant: the column grid and the featured rail collapse to one column on their own.
 */
export function Header({
  logo = <Logo height={54} title="" />,
  items = [],
  actions,
  defaultOpen = null,
  onOpenChange,
  position = 'fixed',
  condense = true,
  className,
  ...props
}: HeaderProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen)
  const [drawer, setDrawer] = useState(false)
  /*
   * Which section the drawer has drilled into, separate from `open`.
   *
   * The drawer used to share `open` with the desktop menus, which meant opening a section on a phone
   * also opened it behind the drawer, and closing the drawer left it open. They are different
   * interactions — one expands in place, the other pushes a panel — so they get their own state.
   */
  const [view, setView] = useState<DrawerView>(null)
  const shellRef = useRef<HTMLElement>(null)
  const triggers = useRef(new Map<string, HTMLButtonElement | null>())
  const baseId = useId()

  const change = useCallback(
    (value: string | null) => {
      setOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange],
  )

  /** Escape closes the panel and hands focus back to the section that opened it. */
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const trigger = triggers.current.get(open)
      change(null)
      trigger?.focus()
    }


    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, change])

  /** A click anywhere outside the header closes it — including on the page it overlays. */
  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) change(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, change])

  /*
   * Whether the page has moved.
   *
   * A passive scroll listener batched into one `requestAnimationFrame`, rather than an
   * IntersectionObserver on a sentinel: the sentinel would have to live outside the header, in page
   * markup this component does not own. One boolean flip near the top of the page is cheap, and the
   * rAF guard means a fast scroll cannot queue more than one read per frame.
   */
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (position !== 'fixed' || !condense) {
      setScrolled(false)
      return undefined
    }

    let frame = 0
    const read = () => {
      frame = 0
      /* 24px, so a trackpad's inertia at the very top does not flicker the band on and off. */
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [position, condense])

  const openItem = items.find((item) => item.value === open && item.menu)

  return (
    <Box
      component="header"
      ref={shellRef}
      className={[classes.headerShell, className].filter(Boolean).join(' ')}
      data-position={position}
      data-condense={position === 'fixed' && condense ? true : undefined}
      data-scrolled={scrolled || undefined}
      /* An open panel needs the bar to be a surface, or the two read as unrelated. */
      data-menu-open={openItem || drawer ? true : undefined}
      {...props}
    >
      {/*
       * `inert` while the drawer is open: the drawer covers the band completely on a phone, so the
       * logo and the burger underneath it are invisible but would still take focus.
       */}
      <div className={classes.headerBand} inert={drawer ? true : undefined}>
        <div className={classes.headerInner}>
          <div className={classes.headerBar}>
            <div className={classes.headerLeft}>
              {logo ? <div className={classes.headerLogo}>{logo}</div> : null}

              <nav className={classes.headerNav} aria-label="Main">
                {items.map((item) => {
                  if (!item.menu) {
                    return (
                      <a key={item.value} className={classes.headerItem} href={item.href}>
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
                      onClick={() => change(isOpen ? null : item.value)}
                    >
                      {item.label}
                      <span className={classes.headerCaret} aria-hidden>
                        <IconDown />
                      </span>
                    </UnstyledButton>
                  )
                })}
              </nav>
            </div>

            <div className={classes.headerActions}>{actions}</div>

            {/*
             * A UI icon rather than Mantine's `Burger`, which draws its own three bars in CSS. Everything
             * else in this header is a MingCute glyph from the `UI Icon` set — `system/menu` and
             * `system/close` are the same set, so the bar no longer mixes two icon sources at different
             * stroke weights.
             *
             * The label changes with the state; `aria-expanded` says which state it is in.
             */}
            <UnstyledButton
              component="button"
              type="button"
              className={classes.headerBurger}
              aria-expanded={drawer}
              aria-label={drawer ? 'Close navigation' : 'Open navigation'}
              onClick={() => {
                setDrawer((value) => {
                  /* Always reopen at the section list rather than wherever it was left. */
                  if (!value) setView(null)
                  change(null)
                  return !value
                })
              }}
            >
              {drawer ? <IconClose aria-hidden /> : <IconMenu aria-hidden />}
            </UnstyledButton>
          </div>
        </div>
      </div>

      {/*
       * Every panel stays mounted so its height can animate and its content is in the DOM for a
       * screen reader to reach; `hidden` keeps the closed ones out of the tab order.
       */}
      <div className={classes.headerMegaWrap}>
        {items
          .filter((item) => item.menu)
          .map((item) => (
            <div
              key={item.value}
              id={`${baseId}-${item.value}`}
              className={classes.headerMega}
              data-open={open === item.value || undefined}
              hidden={open !== item.value}
              aria-label={typeof item.label === 'string' ? item.label : undefined}
            >
              {item.menu}
            </div>
          ))}
      </div>

      {/*
       * The narrow-viewport drawer.
       *
       * A drill-down rather than an accordion, which is what the mobile design asks for: the section
       * list slides out to the left and the section's own panel comes in from the right, with the
       * drawer's header carrying the way back. On a phone an accordion buries the thing you tapped
       * under everything you did not, and the deeper a menu goes the worse that gets.
       *
       * Both levels stay mounted so the slide has something to animate and a screen reader can reach
       * the panel; `inert` keeps the off-screen one out of the tab order, which `hidden` cannot do here
       * because a hidden element cannot animate.
       */}
      <div className={classes.headerDrawer} data-open={drawer || undefined} hidden={!drawer}>
        {/*
         * This bar *replaces* the header band rather than sitting under it: the drawer covers the
         * viewport, so on a phone the logo and burger give way to where you are and the two ways out.
         *
         * Which is why the close lives here now. It was cut earlier as a duplicate of the burger, and
         * that was right while the band stayed visible — with the band covered, the burger is behind
         * the drawer and this is the only close there is.
         */}
        <div className={classes.headerDrawerBar}>
          {view ? (
            <UnstyledButton
              component="button"
              type="button"
              className={classes.headerDrawerBack}
              onClick={() => setView(null)}
            >
              <IconArrowLeft aria-hidden />
              <span className={classes.headerDrawerBackLabel}>Back</span>
            </UnstyledButton>
          ) : (
            <span aria-hidden />
          )}

          <span className={classes.headerDrawerTitle}>
            {view ? items.find((item) => item.value === view)?.label : null}
          </span>

          <UnstyledButton
            component="button"
            type="button"
            className={classes.headerDrawerClose}
            aria-label="Close navigation"
            onClick={() => {
              setDrawer(false)
              setView(null)
            }}
          >
            <IconClose aria-hidden />
          </UnstyledButton>
        </div>

        <div className={classes.headerDrawerPanels}>
          <div
            className={classes.headerDrawerPanel}
            data-state={view ? 'behind' : 'active'}
            inert={view ? true : undefined}
          >
            <div className={classes.headerDrawerList}>
              {items.map((item) =>
                item.menu ? (
                  <UnstyledButton
                    key={item.value}
                    component="button"
                    type="button"
                    className={classes.headerDrawerRow}
                    onClick={() => setView(item.value)}
                  >
                    <span>{item.label}</span>
                    <span className={classes.headerDrawerChevron} aria-hidden>
                      <IconRight />
                    </span>
                  </UnstyledButton>
                ) : (
                  <a key={item.value} className={classes.headerDrawerRow} href={item.href}>
                    <span>{item.label}</span>
                  </a>
                ),
              )}
            </div>

            {/*
             * The actions live at the bottom of the list rather than in the bar, stacked and
             * full-width. They are whatever the caller passed — a language picker, a log-in link, a
             * button — so the drawer lays them out instead of rebuilding them.
             */}
            <div className={classes.headerDrawerActions}>{actions}</div>
          </div>

          {items
            .filter((item) => item.menu)
            .map((item) => (
              <div
                key={item.value}
                className={classes.headerDrawerPanel}
                data-state={view === item.value ? 'active' : 'ahead'}
                inert={view === item.value ? undefined : true}
              >
                {item.menu}
              </div>
            ))}
        </div>
      </div>

      {/* Only mounted while a panel is open: a click-catcher would otherwise eat every page click. */}
      {openItem ? <span className={classes.headerScrim} aria-hidden /> : null}
    </Box>
  )
}
