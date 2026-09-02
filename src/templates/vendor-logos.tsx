import type { ReactNode } from 'react'

/**
 * The integration logos, and why they are invented.
 *
 * The page draws a row of vendor marks — the platforms a customer already runs. Those are other
 * companies' trademarks, so this library does not ship them, for the same reason the marquee's customer
 * logos are stand-ins: a design system that commits someone else's mark is distributing it. See
 * README.md, *What is committed, and what is not*.
 *
 * These eight are made up. The names are not products, the marks are geometry, and each is drawn in
 * `currentColor` so `Marquee`'s `monochrome` treatment inks them like any real logo would be. Swapping
 * one for a real vendor is replacing a `mark` and a `name`, which is the point of the shape.
 *
 * A mark is a 24-unit square. It is drawn at the tile's icon size and never carries meaning of its own —
 * the name beside it is the label, and the lockup as a whole is given an accessible name by the tile.
 */
export interface VendorLogo {
  name: string
  mark: ReactNode
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const VENDOR_LOGOS: VendorLogo[] = [
  {
    name: 'Northwind',
    mark: (
      <>
        <circle cx="12" cy="12" r="9" {...stroke} />
        <path d="M8 16l3-7 5-1-3 7z" {...stroke} />
      </>
    ),
  },
  {
    name: 'Cadence',
    mark: (
      <>
        <path d="M5 15V9M9.7 18V6M14.3 16v-8M19 13v-2" {...stroke} />
      </>
    ),
  },
  {
    name: 'Parcelly',
    mark: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" {...stroke} />
        <path d="M4 7.5l8 4.5 8-4.5M12 12v9" {...stroke} />
      </>
    ),
  },
  {
    name: 'Lumengrid',
    mark: (
      <>
        <circle cx="6" cy="6" r="1.6" fill="currentColor" />
        <circle cx="12" cy="6" r="1.6" {...stroke} />
        <circle cx="18" cy="6" r="1.6" {...stroke} />
        <circle cx="6" cy="12" r="1.6" {...stroke} />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        <circle cx="18" cy="12" r="1.6" {...stroke} />
        <circle cx="6" cy="18" r="1.6" {...stroke} />
        <circle cx="12" cy="18" r="1.6" {...stroke} />
        <circle cx="18" cy="18" r="1.6" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'Orbita',
    mark: (
      <>
        <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-28 12 12)" {...stroke} />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'Kestrel',
    mark: (
      <>
        <path d="M4 17l8-11 8 11" {...stroke} />
        <path d="M8.5 17L12 12l3.5 5" {...stroke} />
      </>
    ),
  },
  {
    name: 'Mosaicly',
    mark: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.6" {...stroke} />
        <rect x="13" y="4" width="7" height="7" rx="1.6" fill="currentColor" stroke="none" />
        <rect x="4" y="13" width="7" height="7" rx="1.6" fill="currentColor" stroke="none" />
        <rect x="13" y="13" width="7" height="7" rx="1.6" {...stroke} />
      </>
    ),
  },
  {
    name: 'Halcyon',
    mark: (
      <>
        <path d="M3 14c2.5-4 4.5-4 7 0s4.5 4 7 0" {...stroke} />
        <path d="M3 9c2.5-4 4.5-4 7 0s4.5 4 7 0" {...stroke} opacity={0.5} />
      </>
    ),
  },
]

/** The names alone, for the schema's `integrations` section, which carries logos as strings. */
export const VENDOR_NAMES = VENDOR_LOGOS.map((v) => v.name)
