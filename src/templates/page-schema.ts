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

import type { ImageRatio } from '../components/Image/Image'

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
  /**
   * A picture or a video. `.webm` and `.mp4` render as video, inferred from the extension rather than
   * declared, so swapping a still for a motion version is a one-field change in a builder.
   */
  src: string
  /** Empty for decorative media. Required so it cannot be forgotten. */
  alt: string
  /**
   * A still for a video `src`, and its safety net.
   *
   * It is the `poster` while the file buffers, *and* what renders if the file is not there at all —
   * which is the normal state of a fresh clone, since `media/` is git-ignored. The animation is the
   * enhancement; the still is the page. Without this a deployed Storybook would show an empty hero.
   */
  poster?: string
  /**
   * From Figma's `Aspect Ratio` set, which is the component the file wraps every hero and card image
   * in. A *named* choice the design sanctions — the same category as `mediaSide`, not the same as a
   * gap — so it belongs in the data: the Home hero's image is drawn 4:3 and the Industry hero's 3:2,
   * and no property of "a hero" decides which.
   *
   * Omitted means `4:3`, which is what every image in the file used before the Industry page.
   */
  ratio?: ImageRatio
}

/** Whether a media ref points at something that moves. */
export const isVideo = (src: string) => /\.(webm|mp4)(\?|#|$)/i.test(src)

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
  /**
   * The button row — Figma's `Bottom` slot on the hero's content block. The Industry hero (node
   * `24223:209534`) draws two: `Book a Demo` solid and `Contact Sales` outline.
   *
   * `outline` is the file's `Style=Outline` cell. Size is not a choice: the file draws Medium in every
   * hero, so the renderer sets it.
   *
   * Separate from `action` because they are different slots, not two spellings of one. A hero can draw
   * both — a form with a link under it *and* a button row — though no cell in the file currently does.
   */
  buttons?: { label: string; href: string; variant?: 'solid' | 'outline' }[]
  /** The secondary call to action under the form. */
  action?: LinkRef
  /** The Gartner rating and the compliance marks. */
  proof?: { rating?: { score: string; outOf: number; source: string }; marks?: string[] }
  media?: ImageRef
}

/* ------------------------------------------------------------------ the sections */

/** A named illustrative icon from `assets/glass-icons/`. Resolved in `PageRenderer`. */
export type GlassIconName =
  | 'financial-services'
  | 'enterprise-websites'
  | 'customer-portals'
  | 'supplier-portals'
  | 'partner-portals'
  | 'intranets'
  | 'commerce'
  | 'mail'
  | 'search'
  | 'sites'
  /* The product map's sixteen, plus the hub. Every one is that product's own icon in the set. */
  | 'dxp'
  | 'pim'
  | 'personalization'
  | 'dsr'
  | 'cms'
  | 'cmp'
  | 'content-performance'
  | 'ldp'
  | 'ai-hub'
  | 'analytics'
  | 'cloud-native'
  | 'security'
  | 'low-code'
  | 'integration'

export interface CardSpec {
  title: string
  description?: string
  /** The three decorations a card can lead with. A card uses at most one. */
  image?: ImageRef
  icon?: GlassIconName
  tag?: string
  href?: string
}

/** A figure and its unit — `140` + `%`, `+` + `100M`. */
export interface StatSpec {
  value: string
  prefix?: string
  suffix?: string
  label: string
  /**
   * Which way to *feel* about the figure, not which way the figure moved.
   *
   * These two come apart whenever the metric is a cost. `96% less consulting time` is a fall in the
   * number and a win for the reader, and the old `trend: 'down'` drew a falling arrow on it — the
   * prop encoded the direction of the figure, and every reader decoded it as the direction of the
   * outcome. The copy already says which way it went (“less”, “faster”, “+”), so the arrow's only
   * job is telling you whether that is good.
   *
   * Figma has no axis for this: `Stat Icon` offers Arrow-Down / Arrow-Up / Percent / Plus as an
   * icon swap, and choosing between them is exactly the judgement this prop makes explicit.
   */
  sentiment?: 'positive' | 'negative'
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

/**
 * The body of a tabbed section — the right half of `Different Teams. One Platform.` and of
 * `Every Capability Your Enterprise Needs`. One shape covers both: the first fills `items` and
 * `stats`, the second fills `eyebrow` and `action`, and the renderer draws whichever are present.
 */
export interface PanelSpec {
  eyebrow?: GlassIconName
  /**
   * The pill above the heading — Figma's `Label` instance, which the detail pages use where the Home
   * page uses a glass icon. A panel draws one or the other, not both.
   */
  label?: string
  title: string
  description: string
  action?: LinkRef
  /** An accordion under the description. */
  items?: { question: string; answer: string; link?: LinkRef }[]
  /**
   * A checked list under the description — Figma's `Key Point Main List`, which is what the product and
   * solution pages put in a panel where the Home page puts an accordion.
   *
   * The two are alternatives and the difference is what the panel is for: an accordion is a set of
   * questions with answers folded away, a key-point list is a set of claims all of which are meant to be
   * read. A panel with both would be asking the reader to do two things at once.
   */
  points?: { title: string; description?: string }[]
  media?: ImageRef
  /** A stat row under the media, inside the same column. */
  stats?: StatSpec[]
}

export type SectionSpec =
  /**
   * Figma `Type=Card Grid`. Four columns of image cards at a 32px section gap.
   *
   * Deliberately *not* the same type as `resourceGrid`, though both are grids of cards. They are
   * different cells in Figma with different gaps — 32 here, 24 there — and folding them together
   * meant one of the two came out 8px wrong. A shared type would have to take the gap as data, which
   * is the thing this schema exists to avoid.
   */
  | {
      type: 'cardGrid'
      title: string
      description?: string
      /**
       * How many across at desktop.
       *
       * Four is the file's `Card Grid` — the Home page's row of four. Three is
       * `Card Grid- Non Clickable` and the detail pages' feature grids, where six cards read as two rows
       * of three rather than a row of four and a stranded pair.
       *
       * @default 4
       */
      columns?: 3 | 4
      /** Without tabs, `cards` renders directly; with them, the bar swaps the grid. */
      cards?: CardSpec[]
      tabs?: TabGroup<CardSpec[]>[]
    }
  /**
   * Figma `Type=Resources` / `Card Grid- Non Clickable`. Three columns at a 24px gap, each card led by
   * a glass icon or a tag rather than an image — the Home page's `Trending Now` and
   * `Our Latest Research & Data`.
   */
  | {
      type: 'resourceGrid'
      title: string
      titleHighlight?: string
      description?: string
      /** The button on the heading's trailing edge — `Additional Resources` draws one. */
      action?: LinkRef
      cards: CardSpec[]
    }
  /**
   * Figma `Type=Carousel`. Always centre-titled and always bleeding off both edges, with arrows
   * rather than dots — the drawn cell has no dots.
   */
  | {
      type: 'customerStories'
      title: string
  /**
   * The phrase inside `title` that carries the brand gradient — `1,200+ Enterprises` in
   * `**1,200+ Enterprises** Move the Needle With Liferay`.
   *
   * A phrase rather than a flag, and matched verbatim inside the title rather than appended to it,
   * because the file does not always put it at the end: the carousel's gradient is the *first* two words
   * of its heading. Anything that assumes a tail cannot draw that one.
   */
  titleHighlight?: string
      stories: StorySpec[]
    }
  /**
   * Figma `Type=Customer Story` (node `24263:27507`) — one story as a wide card.
   *
   * A logo on the **leading** edge, then the title, the paragraph, the figures and one link out. It is
   * `fullCard`'s neighbour in the set and not the same cell: a full card closes its row with a
   * photograph and stacks its links above its figures, and this one opens with the logo and puts the
   * figures first, because the figures are the story.
   */
  | {
      type: 'customerStory'
      title: string
      description?: string
      media?: ImageRef
      stats?: StatSpec[]
      action?: LinkRef
      /**
       * Which side the logo sits on. The file draws it leading; `Product Info` reads better with the
       * picture closing the row, because the section above it ends on a photograph of its own.
       *
       * @default 'left'
       */
      mediaSide?: 'left' | 'right'
    }
  /**
   * Figma `Type=Content Left Image` / `Type=Content- Right Image` (nodes `24263:27790`, `24263:33597`).
   *
   * A 50/50 band: a label, a heading, a paragraph, a checked list of key points and a link on one side,
   * a photograph on the other. The detail pages' workhorse — `Solution` alone uses it twice.
   *
   * Not `mediaBand`, which is a centred title over one wide graphic with no text column at all. The two
   * were conflated in the first pass at these templates, and a page built from the wrong one loses every
   * word of its argument.
   */
  | {
      type: 'contentBlock'
      label?: string
      title: string
      titleHighlight?: string
      description?: string
      points?: { title: string; description?: string }[]
      action?: LinkRef
      media?: ImageRef
      /** @default 'right' */
      mediaSide?: 'left' | 'right'
    }
  /**
   * Figma `Type=FAQ` (node `24263:34081`). A centred title over an accordion in a narrower column.
   *
   * Deliberately **not** `tabbedContent`'s accordion, which is a panel showing what the platform does.
   * Someone reading an FAQ arrived with one question, which is also why this is the section that does
   * not autoplay.
   */
  | {
      type: 'faq'
      title: string
      titleHighlight?: string
      description?: string
      items: { question: string; answer: string }[]
    }
  /**
   * Figma `Type=Quick Links` (node `24263:34142`). A left title over a grid of small horizontal cards,
   * each an icon and a label — the shortcuts row a detail page ends on.
   */
  | {
      type: 'quickLinks'
      title: string
      titleHighlight?: string
      links: { label: string; href: string; icon?: GlassIconName }[]
    }
  /**
   * Figma `Type=Highlight Text` (node `24263:68390`). One wide card on the brand gradient, led by a
   * glass icon: a paragraph the page wants read rather than skimmed.
   */
  | {
      type: 'highlightText'
      title: string
      body: string
      icon?: GlassIconName
    }
  /**
   * Figma's `Stats Bar` as a band of its own — the row of figures the `Contact Sales` page puts
   * directly under its hero, before anything else has been claimed.
   */
  | {
      type: 'statsBar'
      stats: StatSpec[]
    }
  /** `Logos scrolling section` — a 64px monochrome logo row, flush against the band above it. */
  | { type: 'logoMarquee'; label: string; logos: string[] }
  /**
   * Figma `Type=Tabbed- Content`. A centred title, a pill bar, and a content-and-media panel that the
   * bar swaps. Covers both of the Home page's tabbed sections.
   */
  | {
      type: 'tabbedContent'
      title: string
  /**
   * The phrase inside `title` that carries the brand gradient — `1,200+ Enterprises` in
   * `**1,200+ Enterprises** Move the Needle With Liferay`.
   *
   * A phrase rather than a flag, and matched verbatim inside the title rather than appended to it,
   * because the file does not always put it at the end: the carousel's gradient is the *first* two words
   * of its heading. Anything that assumes a tail cannot draw that one.
   */
  titleHighlight?: string
      description?: string
      /**
       * Figma's `Content Left Image` / `Content- Right Image` cells. A **named** choice the file
       * sanctions, so it belongs in the data — unlike a gap, which does not. @default 'right'
       */
      mediaSide?: 'left' | 'right'
      tabs: TabGroup<PanelSpec>[]
    }
  /**
   * Figma `Type=Full Card`. One horizontal card with links and a stat row, over a rule of tabs.
   *
   * `tabs` is a list of *labels*, not of cards, because that is what the file draws: one card that the
   * bar relabels, with no distinct content behind the other industries. `{tab}` in a title or a link
   * label is replaced with the active one. When the other industries get written, `tabs` becomes a
   * list of cards and this note goes away.
   */
  | {
      type: 'fullCard'
      title: string
  /**
   * The phrase inside `title` that carries the brand gradient — `1,200+ Enterprises` in
   * `**1,200+ Enterprises** Move the Needle With Liferay`.
   *
   * A phrase rather than a flag, and matched verbatim inside the title rather than appended to it,
   * because the file does not always put it at the end: the carousel's gradient is the *first* two words
   * of its heading. Anything that assumes a tail cannot draw that one.
   */
  titleHighlight?: string
      tabs?: string[]
      card: {
        icon?: GlassIconName
        title: string
        description: string
        links?: LinkRef[]
        stats?: StatSpec[]
        media?: ImageRef
      }
    }
  /** A centred band holding one wide graphic — a diagram or a screenshot, drawn at 1000 across. */
  | { type: 'mediaBand'; title: string; image: ImageRef }
  /**
   * The product constellation: a hub, and up to four sections of four products around it.
   *
   * This is *Everything You Need in One Platform*, which used to be `mediaBand` holding a PNG of the
   * same figure. As data it is sixteen products with names and destinations rather than one image with
   * one alt string, which is what lets a tile be a link and the whole figure be read.
   *
   * Four items per section: a section is a diamond of four cells on the lattice, so a fifth has nowhere
   * to go and `CapabilityMap` drops it. Fewer than four sections is fine.
   */
  | {
      type: 'capabilityMap'
      title: string
  /** The phrase inside `title` that carries the brand gradient — see `customerStories`. */
  titleHighlight?: string
      hub: { icon: GlassIconName; label: string; href?: string }
      clusters: {
        label: string
        items: { label: string; icon: GlassIconName; href?: string; description?: string }[]
      }[]
    }
  /**
   * Figma `Type=Integrations Section`. A title with an action beside it, over a wrapping row of 64px
   * glass tiles — not a marquee, which is the separate `Logos scrolling section`.
   */
  | {
      type: 'integrations'
      title: string
      /**
       * A pool of brand light behind the band — `MeshBackdrop`.
       *
       * Off unless asked for. It was on this section by default and is not any more: the section's own
       * job is a strip of logos and a heading, and a lit ground behind them is a page-level decision
       * rather than something the section type should decide for every page that uses it.
       *
       * `hero` is the hero's palette at near-parity sizes, which reads as a *field* — the page is not
       * flat here. `wash` is `CapabilityMap`'s: a wide core, an offset halo and a small brighter lift,
       * which reads as light arriving from a point. Both are held well back; see `MeshBackdrop`.
       */
      backdrop?: 'hero' | 'wash'
  /** The phrase inside `title` that carries the brand gradient — see `customerStories`. */
  titleHighlight?: string
      description?: string
      action?: LinkRef
      logos: string[]
    }

export interface PageSpec {
  hero: HeroSpec
  sections: SectionSpec[]
}
