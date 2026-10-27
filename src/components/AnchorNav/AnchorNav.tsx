import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Box, UnstyledButton } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import { IconDown } from '../../icons'
import classes from '../../theme/components.module.css'

export interface AnchorNavItem {
  label: ReactNode
  /** A `#fragment` on this page — the section the link jumps to. */
  href: `#${string}`
}

/** `bar` is a row of links under the product bar; `menu` is a dropdown that sits in it. */
export type AnchorNavVariant = 'bar' | 'menu'

export interface AnchorNavProps extends BoxProps, Omit<ElementProps<'nav'>, 'onChange'> {
  /** The jump links, in page order. */
  items: AnchorNavItem[]
  /**
   * `bar` — a 48px row of every link, under `SecondaryNav`. `menu` — one button in `SecondaryNav`'s
   * `action` slot, naming the section you are in and opening onto the rest; for a page with more
   * sections than a row can hold.
   *
   * @default 'bar'
   */
  variant?: AnchorNavVariant
  /** What assistive technology calls it. @default 'On this page' */
  label?: string
  /**
   * The words before the links, saying what they do — beside the menu's button, or at the start of the
   * bar. Pass `null` for none.
   *
   * @default 'Jump to'
   */
  lead?: ReactNode
  /**
   * Follow the page: the link for the section under the bar is marked current as the reader scrolls.
   * @default true
   */
  spy?: boolean
  /**
   * Stick under the product bar (or the header, without one) once the page scrolls to it. The bar's
   * only; the menu rides in the product bar, which sticks already.
   * @default true
   */
  sticky?: boolean
}

/**
 * The section under the line. The current one is the last whose top has passed `line()` — measured
 * fresh each time, so it holds whether the header is showing, condensed, or replaced by the product bar.
 */
function useCurrentSection(items: AnchorNavItem[], spy: boolean, line: () => number) {
  const [current, setCurrent] = useState<string | null>(null)
  const lineRef = useRef(line)
  lineRef.current = line

  useEffect(() => {
    if (!spy || typeof window === 'undefined') return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const at = lineRef.current()
      let next: string | null = null
      for (const item of items) {
        const el = document.getElementById(item.href.slice(1))
        if (el && el.getBoundingClientRect().top <= at) next = item.href
      }
      /* At the very bottom the last section may be too short ever to reach the line; give it the bar. */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        next = items[items.length - 1]?.href ?? next
      }
      setCurrent(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items, spy])

  return [current, setCurrent] as const
}

/**
 * AnchorNav — jump links to the sections of the page it sits on.
 *
 * Not a frame in the Solutions Library: there is no anchor-link component there, so it is built from
 * its neighbours.
 *
 * - **`bar`** — a 48px row under `SecondaryNav`, on its glass and hairline so the two read as one stack;
 *   the current link takes the `Tabs` indicator, a 2px line in the brand gradient. The hero reaches up
 *   behind it as it does behind the other two bars. Its links scroll sideways on a phone.
 * - **`menu`** — `Jump to` and a bordered button for `SecondaryNav`'s `action` slot, naming the current
 *   section, with a caret. It opens a panel of every section, the current one marked. For a page whose sections would not fit a row — the blog hub has ten.
 *
 * A `SecondaryNav` item with an `href` can already jump to a section; this is for a page whose product
 * bar is full of menus and still wants a table of contents a reader can see.
 */
export const AnchorNav = forwardRef<HTMLElement, AnchorNavProps>(function AnchorNav(
  { items, variant = 'bar', label = 'On this page', lead, spy = true, sticky = true, className, ...props },
  ref,
) {
  const navRef = useRef<HTMLElement | null>(null)
  const menu = variant === 'menu'
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelId = useId()

  /*
   * The line a section has to cross. For the bar, 8px under its own foot. For the menu, 96px under the
   * product bar it sits in: a jump lands a section 153px down whether or not the header is showing (the
   * page's scroll padding plus the section's own margin), and once the product bar has replaced the
   * header its foot is at 64 — so a line hugging the bar marked the section *before* the one just
   * jumped to.
   */
  const [current, setCurrent] = useCurrentSection(items, spy, () => {
    if (!menu) return (navRef.current?.getBoundingClientRect().bottom ?? 0) + 8
    const host = navRef.current?.parentElement?.closest('nav') ?? navRef.current
    return (host?.getBoundingClientRect().bottom ?? 0) + 96
  })

  /* The menu closes on a click outside it and on Escape, which hands focus back to its button. */
  useEffect(() => {
    if (!menu || !open) return undefined
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [menu, open])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (menu && open && event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  /* Marked current on the click, not only once the scroll lands, so the bar answers at once. */
  const onClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setCurrent(href)
    if (menu) setOpen(false)
    props.onClick?.(event as unknown as MouseEvent<HTMLElement>)
  }

  const setRefs = (node: HTMLElement | null) => {
    navRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const links = items.map((item) => (
    <li key={item.href}>
      <a
        href={item.href}
        className={menu ? classes.anchorMenuLink : classes.anchorNavLink}
        aria-current={current === item.href ? 'location' : undefined}
        onClick={(event) => onClick(event, item.href)}
      >
        {item.label}
      </a>
    </li>
  ))

  if (menu) {
    const currentItem = items.find((item) => item.href === current) ?? items[0]
    const leadText = lead === undefined ? 'Jump to' : lead
    return (
      <Box
        component="nav"
        ref={setRefs}
        aria-label={label}
        className={[classes.anchorMenu, className].filter(Boolean).join(' ')}
        onKeyDown={onKeyDown}
        {...props}
      >
        {/* Presentational: the `nav`'s label already says what it is. */}
        {leadText ? (
          <span className={classes.anchorMenuLead} aria-hidden>
            {leadText}
          </span>
        ) : null}
        <UnstyledButton
          ref={triggerRef}
          component="button"
          type="button"
          className={classes.anchorMenuTrigger}
          aria-expanded={open}
          aria-controls={panelId}
          data-open={open || undefined}
          onClick={() => setOpen((was) => !was)}
        >
          <span className={classes.anchorMenuCurrent}>{currentItem?.label}</span>
          <IconDown className={classes.anchorMenuCaret} aria-hidden />
        </UnstyledButton>
        <ul id={panelId} className={classes.anchorMenuPanel} hidden={!open}>
          {links}
        </ul>
      </Box>
    )
  }

  const leadText = lead === undefined ? 'Jump to' : lead
  return (
    <Box
      component="nav"
      ref={setRefs}
      aria-label={label}
      className={[classes.anchorNav, className].filter(Boolean).join(' ')}
      data-sticky={sticky || undefined}
      {...props}
    >
      <ul className={classes.anchorNavList}>
        {/* Presentational: the bar's `aria-label` already says what it is. */}
        {leadText ? (
          <li className={classes.anchorNavLead} aria-hidden>
            {leadText}
          </li>
        ) : null}
        {links}
      </ul>
    </Box>
  )
})
