import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { IconClose, IconDown, IconMenu } from '../../icons'

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
  logo,
  items = [],
  actions,
  defaultOpen = null,
  onOpenChange,
  position = 'fixed',
  className,
  ...props
}: HeaderProps) {
  const [open, setOpen] = useState<string | null>(defaultOpen)
  const [drawer, setDrawer] = useState(false)
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

  const openItem = items.find((item) => item.value === open && item.menu)

  return (
    <Box
      component="header"
      ref={shellRef}
      className={[classes.headerShell, className].filter(Boolean).join(' ')}
      data-position={position}
      {...props}
    >
      <div className={classes.headerBand}>
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
                  if (value) change(null)
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
       * The narrow-viewport panel. It reuses the same `open` state as the desktop menus rather than
       * introducing a second mechanism: the burger reveals the section list, and a section expands its
       * own menu inline. One state machine, one set of aria wiring, and no portal to reason about.
       */}
      <div className={classes.headerMobile} data-open={drawer || undefined} hidden={!drawer}>
        {items.map((item) => {
          if (!item.menu) {
            return (
              <a key={item.value} className={classes.headerMobileItem} href={item.href}>
                {item.label}
              </a>
            )
          }

          const isOpen = open === item.value

          return (
            <div key={item.value} className={classes.headerMobileSection}>
              <UnstyledButton
                component="button"
                type="button"
                className={classes.headerMobileItem}
                data-open={isOpen || undefined}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-mobile-${item.value}`}
                onClick={() => change(isOpen ? null : item.value)}
              >
                {item.label}
                <span className={classes.headerCaret} aria-hidden>
                  <IconDown />
                </span>
              </UnstyledButton>
              <div id={`${baseId}-mobile-${item.value}`} hidden={!isOpen}>
                {item.menu}
              </div>
            </div>
          )
        })}
        <div className={classes.headerMobileActions}>{actions}</div>
      </div>

      {/* Only mounted while a panel is open: a click-catcher would otherwise eat every page click. */}
      {openItem ? <span className={classes.headerScrim} aria-hidden /> : null}
    </Box>
  )
}
