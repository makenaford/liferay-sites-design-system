import { forwardRef, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface TableOfContentsItem {
  label: ReactNode
  /** Where the row goes. A `#id` anchor is also what `spy` watches. */
  href: string
}

export interface TableOfContentsProps extends BoxProps, Omit<ElementProps<'nav'>, 'onChange'> {
  /** The eyebrow over the rows — Figma's `outline` text. Also the nav's accessible name. @default 'Outline' */
  label?: string
  items: TableOfContentsItem[]
  /** The active row's index, to drive it from outside. Leave unset and `spy` decides. */
  active?: number
  /** Called whenever the active row changes, by click or by scroll. */
  onActiveChange?: (index: number) => void
  /**
   * Follow the page: the active row is the last one whose `#id` target has scrolled past a line a third
   * of the way down the viewport. Off, the rows only change on click. @default true
   */
  spy?: boolean
}

/**
 * TableOfContents — Figma `Table of Contents` (node `17927:12691`), built from the `Toc Item` set.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `outline` text | `label` |
 * | `Toc Item` rows | `items` |
 * | `Toc Item` `Property 1` — Active / Default | `active` (or `spy`) |
 *
 * ```tsx
 * <TableOfContents
 *   items={[
 *     { label: 'Key Takeaways', href: '#takeaways' },
 *     { label: 'Background', href: '#background' },
 *   ]}
 * />
 * ```
 *
 * Each row is a 3px rail and the text 12px beside it. A default row's rail is a 1px `Neutral/03` line
 * centred in the 3px, so the rows stack into one continuous rule; the active row's is the full 3px in
 * `Brand/Primary/Primary`, with the text in `Surfaces/Text/Primary`. Text is 16/20 with 16px above and
 * below.
 *
 * **One deviation:** Figma draws the active row 56px tall and the default rows 52. Here every row is 52,
 * because the active row moves as the reader scrolls and a 4px change would nudge every row under it.
 *
 * It does not position itself. Sticking it beside an article is the page's job — the blog's `article`
 * section does it, and hides it below 62em where there is no column for it.
 */
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents(
  { label = 'Outline', items, active, onActiveChange, spy = true, className, ...props },
  ref,
) {
  const [spied, setSpied] = useState(0)
  const current = active ?? spied
  const targets = items.map((item) => (item.href.startsWith('#') ? item.href.slice(1) : '')).join(' ')

  useEffect(() => {
    if (!spy || active !== undefined) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let next = 0
      targets.split(' ').forEach((id, i) => {
        const el = id ? document.getElementById(id) : null
        if (el && el.getBoundingClientRect().top <= line) next = i
      })
      setSpied((prev) => {
        if (prev !== next) onActiveChange?.(next)
        return next
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [spy, active, targets, onActiveChange])

  return (
    <Box
      component="nav"
      ref={ref}
      aria-label={label}
      className={[classes.toc, className].filter(Boolean).join(' ')}
      {...props}
    >
      <span className={classes.tocLabel}>{label}</span>
      <ul className={classes.tocList}>
        {items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>
            <a
              href={item.href}
              className={classes.tocItem}
              data-active={i === current || undefined}
              aria-current={i === current ? 'location' : undefined}
              onClick={() => {
                if (active === undefined) setSpied(i)
                onActiveChange?.(i)
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Box>
  )
})
