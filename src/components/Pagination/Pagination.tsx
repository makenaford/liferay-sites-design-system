import { forwardRef } from 'react'
import { Menu, UnstyledButton } from '@mantine/core'
import type { ElementProps } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import { IconDownSmallFilled, IconLeft, IconRight } from '../../icons'
import { Button } from '../Button'
import classes from '../../theme/components.module.css'

export interface PaginationProps extends Omit<ElementProps<'nav'>, 'onChange'> {
  /** How many entries there are in all — not pages: the page count follows from it and `pageSize`. */
  total: number
  /** The page showing, from 1. Controlled with `onPageChange`; leave both off and it keeps its own. */
  page?: number
  /** @default 1 */
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** Entries per page. Controlled with `onPageSizeChange`. */
  pageSize?: number
  /** @default the first of `pageSizes` */
  defaultPageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  /**
   * The choices under `12 entries`, the Blog Category frame's page-size menu. Leave it off and there is no
   * menu — the catalog's pager (node `24581:100572`) draws none.
   */
  pageSizes?: number[]
  /** Names the landmark for a screen reader. @default 'Pagination' */
  label?: string
}

/**
 * Pagination — Figma `Pagination` (`Size=Desktop`): `Blog Category Page` (node `25181:70081`) and the
 * customer-story catalog (node `24581:100572`) are the same component, the first with its page-size menu.
 *
 * | Figma | Here |
 * | --- | --- |
 * | `12 entries` — `Link` `Style=Secondary`, `arrow/down_small` | a menu of `pageSizes` |
 * | `Showing 1 to 15` `of 68 entries` | worked out from `page`, `pageSize` and `total` |
 * | `Button` `Color=Primary, Style=Outline, Size=Small`, icon only | previous and next, disabled at the ends |
 * | `Number Tab` — `Tabs Pill` `Default` / `Active` | a page button; the current one carries `aria-current` |
 *
 * ```tsx
 * <Pagination total={53} page={page} onPageChange={setPage} />
 * ```
 *
 * The page numbers are buttons, not `Tabs`: they look like the pill tabs because Figma builds them from
 * `Tabs Pill`, but they move through one list rather than switching between panels, so a `tablist` would
 * announce the wrong thing. Five numbers at most, centred on the current page where there is room, so the
 * row never outgrows a phone however long the list.
 *
 * Changing the page size goes back to page 1: the entry the reader was on has moved to another page, and
 * guessing which is worse than starting over.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    page,
    defaultPage = 1,
    onPageChange,
    pageSize,
    pageSizes,
    defaultPageSize = pageSizes?.[0] ?? 12,
    onPageSizeChange,
    label = 'Pagination',
    className,
    ...props
  },
  ref,
) {
  const [size, setSize] = useUncontrolled({
    value: pageSize,
    defaultValue: defaultPageSize,
    onChange: onPageSizeChange,
  })
  const pages = Math.max(1, Math.ceil(total / size))
  const [current, setCurrent] = useUncontrolled({ value: page, defaultValue: defaultPage, onChange: onPageChange })
  const active = Math.min(Math.max(1, current), pages)
  const span = Math.min(5, pages)
  const first = Math.min(Math.max(1, active - Math.floor(span / 2)), pages - span + 1)
  const numbers = Array.from({ length: span }, (_, i) => first + i)

  const from = total === 0 ? 0 : (active - 1) * size + 1
  const to = Math.min(active * size, total)

  const sizeLabel = `${size} entries`

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={[classes.pagination, className].filter(Boolean).join(' ')}
      {...props}
    >
      <div className={classes.paginationSummary}>
        {pageSizes?.length ? (
          <Menu position="bottom-start" offset={8} classNames={{ dropdown: classes.paginationMenu, item: classes.paginationMenuItem }}>
            <Menu.Target>
              <UnstyledButton className={classes.paginationSize} aria-label={`${sizeLabel} per page`}>
                {sizeLabel}
                <IconDownSmallFilled width={16} height={16} aria-hidden />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {pageSizes.map((option) => (
                <Menu.Item
                  key={option}
                  data-active={option === size || undefined}
                  onClick={() => {
                    setSize(option)
                    setCurrent(1)
                  }}
                >
                  {option} entries
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        ) : null}
        <p className={classes.paginationCount} aria-live="polite">
          <span>
            Showing {from} to {to}
          </span>{' '}
          <span className={classes.paginationCountTotal}>of {total} entries</span>
        </p>
      </div>

      <div className={classes.paginationPages}>
        <Button
          variant="outline"
          size="sm"
          className={classes.paginationStep}
          aria-label="Previous page"
          disabled={active <= 1}
          onClick={() => setCurrent(active - 1)}
        >
          <IconLeft width={20} height={20} aria-hidden />
        </Button>
        <ul className={classes.paginationList}>
          {numbers.map((n) => (
            <li key={n}>
              <UnstyledButton
                className={classes.paginationPage}
                data-active={n === active || undefined}
                aria-current={n === active ? 'page' : undefined}
                aria-label={`Page ${n}`}
                onClick={() => setCurrent(n)}
              >
                {n}
              </UnstyledButton>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          className={classes.paginationStep}
          aria-label="Next page"
          disabled={active >= pages}
          onClick={() => setCurrent(active + 1)}
        >
          <IconRight width={20} height={20} aria-hidden />
        </Button>
      </div>
    </nav>
  )
})
