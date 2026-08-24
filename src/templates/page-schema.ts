/**
 * A page as data.
 *
 * The bet this file makes: **a page's bespoke detail belongs to the section *type*, not to the page.**
 *
 * The Home template hardcodes a lot of per-section measurement — the carousel band bleeds off both
 * edges, the goals grid has a 32px gap, the diagram column is capped at 1000, the pill bars carry
 * explicit 520 and 776 widths. It is tempting to read that as "every section needs an escape hatch",
 * which would mean moving JSX into JSON and calling it low-code.
 *
 * It is the opposite. Every one of those numbers is a property of *that kind of section* — a customer
 * carousel always bleeds, a goals grid always has four columns at a 32px gap — so it lives in the
 * renderer, once, and never appears in the data. What a designer supplies is the content and the
 * handful of genuine choices (which media side, how many cards). If a page needs a measurement the
 * type does not have, that is a signal to add a section type and a matching Figma component, not to
 * open a hole in the schema.
 *
 * Everything here is **serialisable** — strings, numbers, plain objects, no React nodes. That is what
 * lets a page round-trip through a builder, a file, or a clipboard. Icons are named, and resolved
 * through a registry at render time.
 */

/* ------------------------------------------------------------------ shared shapes */

/** A named icon from the `UI Icon` set. Resolved in `PageRenderer`. */
export type IconName =
  | 'arrow-right'
  | 'arrow-down'
  | 'brackets-angle'
  | 'presentation'
  | 'user'
  | 'monitor'
  | 'department'
  | 'building'
  | 'group'
  | 'cart'
  | 'search'
  | 'close'

export interface ImageRef {
  src: string
  /** Empty for decorative media. Required so it cannot be forgotten. */
  alt: string
}

export interface LinkRef {
  label: string
  href: string
}

/**
 * A heading with an optional highlighted tail — Home's `Launch Digital Experiences That
 * **Convert, Scale and Grow**`, where the second half carries the brand-to-accent gradient. Two
 * strings rather than markup, so it stays data.
 */
export interface Headline {
  text: string
  highlight?: string
}

export interface SelectField {
  label: string
  /** The first option is the default. */
  options: string[]
  /** The drawn width at desktop; the field is full width once the row wraps. */
  width?: number
}

/* ------------------------------------------------------------------ the hero */

/**
 * The band across the top of the hero. A closed union rather than a free slot: today the file draws
 * exactly one kind, the Home page's solution finder.
 */
export type HeroBanner = {
  kind: 'solutionFinder'
  label: string
  fields: SelectField[]
  action: string
}

export interface HeroSpec {
  background?: 'none' | 'full' | 'corner'
  banner?: HeroBanner
  title: Headline
  /** The lead paragraph. `emphasis` is the bold tail the file draws on the last clause. */
  description: { text: string; emphasis?: string }
  /** The email capture: a field with a contained button. */
  form?: { placeholder: string; submit: string }
  /** The secondary call to action under the form. */
  action?: LinkRef
  /** The Gartner rating and the compliance marks. */
  proof?: { rating?: { score: string; outOf: number; source: string }; marks?: string[] }
  media?: ImageRef
}

/* ------------------------------------------------------------------ the sections */

export interface CardSpec {
  title: string
  description?: string
  image?: ImageRef
  href?: string
}

export interface StorySpec {
  customer: string
  /** The figure and its unit — `140` + `%`, or `+` + `100M`. */
  value: string
  prefix?: string
  suffix?: string
  label: string
  quote: string
  name: string
  role: string
}

/** A pill bar that swaps the section's body. */
export interface TabGroup<T> {
  value: string
  label: string
  icon?: IconName
  content: T
}

export type SectionSpec =
  /**
   * Figma `Type=Card Grid`. Four columns, a 32px section gap, `Padding=Full` cards, each one a link.
   * All four of those are the type's, not the page's.
   */
  | {
      type: 'cardGrid'
      title: string
      description?: string
      /** Without tabs, `cards` renders directly; with them, the bar swaps the grid. */
      cards?: CardSpec[]
      tabs?: TabGroup<CardSpec[]>[]
    }
  /**
   * Figma `Type=Carousel`. Always centre-titled and always bleeding off both edges, with arrows
   * rather than dots — the drawn cell has no dots.
   */
  | {
      type: 'customerStories'
      title: string
      stories: StorySpec[]
    }

export interface PageSpec {
  hero: HeroSpec
  sections: SectionSpec[]
}
