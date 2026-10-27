import { forwardRef, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface AnchorNavItem {
  label: ReactNode
  /** A `#fragment` on this page — the section the link jumps to. */
  href: `#${string}`
}

export interface AnchorNavProps extends BoxProps, Omit<ElementProps<'nav'>, 'onChange'> {
  /** The jump links, in page order. */
  items: AnchorNavItem[]
  /** What assistive technology calls the bar. @default 'On this page' */
  label?: string
  /**
   * Follow the page: the link for the section under the bar is marked current as the reader scrolls.
   * @default true
   */
  spy?: boolean
  /**
   * Stick under the product bar (or the header, without one) once the page scrolls to it.
   * @default true
   */
  sticky?: boolean
}

/**
 * AnchorNav — a row of jump links to the sections of the page it sits on, under `SecondaryNav`.
 *
 * Not a frame in the Solutions Library: there is no anchor-link component there, so this is built from
 * the bars either side of it. It takes `SecondaryNav`'s glass and hairline so the two read as one stack
 * of chrome, and its current link takes the `Tabs` indicator — a 2px line in the brand gradient — since
 * "which part of this page am I in" is the same question a tab answers.
 *
 * A `SecondaryNav` item with an `href` can already jump to a section; this is for a page whose product
 * bar is full of menus and still wants a table of contents a reader can see.
 *
 * The hero reaches up behind it as it does behind the other two bars, so it sits on the bubble rather
 * than above it. Its links scroll sideways on a phone rather than wrapping.
 */
export const AnchorNav = forwardRef<HTMLElement, AnchorNavProps>(function AnchorNav(
  { items, label = 'On this page', spy = true, sticky = true, className, ...props },
  ref,
) {
  const [current, setCurrent] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!spy || typeof window === 'undefined') return undefined
    let frame = 0

    /*
     * The current section is the last one whose top has passed the bar's foot. Measured off the bar
     * itself rather than a fixed offset, so it holds whether the header is showing, condensed, or has
     * been replaced by the product bar.
     */
    const update = () => {
      frame = 0
      const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 8
      let next: string | null = null
      for (const item of items) {
        const el = document.getElementById(item.href.slice(1))
        if (el && el.getBoundingClientRect().top <= line) next = item.href
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

  /* Marked current on the click, not only once the scroll lands, so the bar answers at once. */
  const onClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setCurrent(href)
    props.onClick?.(event as unknown as MouseEvent<HTMLElement>)
  }

  return (
    <Box
      component="nav"
      ref={(node: HTMLElement | null) => {
        navRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      aria-label={label}
      className={[classes.anchorNav, className].filter(Boolean).join(' ')}
      data-sticky={sticky || undefined}
      {...props}
    >
      <ul className={classes.anchorNavList}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={classes.anchorNavLink}
              aria-current={current === item.href ? 'location' : undefined}
              onClick={(event) => onClick(event, item.href)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Box>
  )
})
