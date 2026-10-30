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
  | 'direction-arrow'
  | 'dashboard'
  | 'pig-money'
  | 'tag'
  | 'barbell'
  /* The Solutions hub's value props: a code file, the AI sparkle and a checklist. */
  | 'file-code'
  | 'sparkles'
  | 'list-check'
  /* Partner Home's `Why Partner` rows. */
  | 'world'
  | 'office-building'
  | 'settings'
  | 'safety-certificate'
  | 'rocket'
  /* Solution Partner's `Why Partner` rows. */
  | 'heart-hand'
  | 'briefcase'
  | 'headphone'
  | 'trophy'
  /* Technology Partner's `Why Partner` rows and partnership-model tabs. */
  | 'refund-dollar'
  | 'scale'
  | 'plugin'
  | 'share-forward'
  | 'git-compare'

export interface ImageRef {
  /**
   * A picture or a video. `.webm` and `.mp4` render as video, inferred from the extension rather than
   * declared, so swapping a still for a motion version is a one-field change in a builder.
   */
  src: string
  /**
   * The same media drawn for the light canvas, when one file cannot serve both.
   *
   * Optional, and most media needs it: a screenshot or a photograph is the same picture whichever way
   * the page is themed. What needs it is footage with an alpha channel, where the *page* shows through
   * — the LRDC hero animation's chrome is about 70% opaque, so on a light canvas the white ground
   * bleeds up through it and a dark product mockup arrives as flat grey with unreadable navigation.
   *
   * Missing is not a failure: `src` serves both canvases, which is the right answer whenever the media
   * is opaque. Same contract as `Hero`'s `video` / `videoLight` pair, and named to match it.
   */
  srcLight?: string
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
  /**
   * `center` for a hero with nothing in its media column — the Learn home page's, which is a heading,
   * a line and a search field over the full bubble.
   *
   * @default 'left'
   */
  align?: 'left' | 'center'
  banner?: HeroBanner
  /**
   * The trail above the heading — where this page sits, from the top. The last entry is the page
   * itself: it is drawn as text, not a link, and marked as the current page.
   */
  breadcrumbs?: LinkRef[]
  /** The pill directly over the heading — the blog hub's `Liferay Blogs`. Drawn at the Large size. */
  label?: string
  title: Headline
  /**
   * A cap on the heading's width, in px. For a hero with no media column, whose heading would otherwise
   * run the full width and under the corner bubble — the blog hub holds its at 800.
   */
  titleMaxWidth?: number
  /**
   * The lead paragraph. `emphasis` is the bold tail the file draws on the last clause. Optional: a
   * solution hero answers with its value props instead.
   */
  description?: { text: string; emphasis?: string }
  /** The email capture: a field with a contained button. */
  form?: { placeholder: string; submit: string }
  /**
   * The full form card — Figma's `Form` instance in the hero's right column, where `media` would go.
   *
   * Distinct from `form`, which is the *inline* email field a marketing hero puts under its copy. This
   * is the whole card: a heading, rows of labelled fields, a consent box, the reCAPTCHA line and a
   * submit. A page has one or the other; a hero with both would be asking twice.
   *
   * `rows` is an array of arrays because the file's layout is rows of one or two fields — first and
   * last name together, the message on its own — and that is a property of the row rather than of any
   * field in it. Saying it as nesting means a page cannot describe a row that does not exist.
   */
  formCard?: {
    title: string
    description?: string
    rows: {
      label: string
      type?: 'text' | 'email' | 'tel' | 'select' | 'textarea'
      required?: boolean
      /** For `select`. */
      options?: string[]
    }[][]
    /** The checkbox above the terms — the partner-sharing agreement the file draws. */
    consent?: string
    /** The reCAPTCHA and privacy line, above the button because it is agreed to *by* submitting. */
    terms?: string
    submit: string
    /** The line under the button — the file's "already have a trial?" link. */
    footnote?: string
  }
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
  /**
   * A site search in place of the email field — the Learn home page's. Wider than `form`, because a
   * query is longer than an address, and with no button: Enter submits.
   *
   * `popular` is the row of topics under it, each a shortcut to a search someone has already made.
   * A page has `form` or `search`, not both — they share the slot.
   */
  search?: { placeholder: string; popular?: LinkRef[] }
  /** The secondary call to action under the form. */
  action?: LinkRef
  /** The Gartner rating and the compliance marks. */
  proof?: {
    rating?: { score: string; outOf: number; source: string }
    marks?: string[]
    /** Analyst badges beside the rating — Gartner Customers' Choice, G2 Leader. */
    badges?: ImageRef[]
  }
  /**
   * How the hero's pieces are arranged.
   *
   * - `default` — copy beside the media, the proof under the copy.
   * - `media-proof` — the solution page's second option, as node `24920:87684` first drew it (it now draws `default`): two aligned rows. The
   *   heading and value props beside the media; then the email field and links beside the proof, which
   *   sits under the media. The field and the rating start on the same line whatever the copy's length.
   *
   * - `stacked` — the Solutions hub's hero (node `24920:87684`): everything in one column beside the
   *   media — heading, value props, email field, links, then the rating beside the badges with the marks
   *   under it. The media starts level with the heading, and the field and the proof row take the
   *   column's width (596 at most), so the badges sit at the column's end.
   *
   * @default 'default'
   */
  layout?: 'default' | 'media-proof' | 'stacked'
  /**
   * The value props under the description — a solution page's three bullets, each a UI icon and the
   * answer to a buyer's question.
   */
  points?: { icon?: IconName; text: string }[]
  /**
   * Arrow links under the form or buttons — a solution page's `Request a demo` and `Calculate your
   * savings`. `action` is the single link a landing hero draws; this is the row.
   */
  links?: LinkRef[]
  /**
   * Who wrote it and when — the blog hero's `Author` row under the lead paragraph: a small portrait,
   * the name, the date and the read time, dot-separated. Without `avatar` the portrait is initials.
   */
  byline?: { name: string; avatar?: ImageRef; date?: string; readTime?: string }
  /** The post's topics, as glass tags in a row under the byline. */
  tags?: string[]
  /**
   * The customer's logo over the heading — the customer story's `Logo Container` (48px tall). Drawn
   * white for the dark canvas; on light it is darkened, so one file serves both.
   */
  logo?: ImageRef
  /** `2 Minute Read` — a medium glass tag under the description, for a page with no byline to carry it. */
  readTime?: string
  media?: ImageRef
}

/**
 * One post on the blog hub — the `Common Cards` the `Blog Hub` frame draws in every shelf. Everything
 * the card shows is the post's own: its cover, its title, who wrote it, when, how long it takes, and
 * up to three topics, dot-separated at the foot.
 */
export interface BlogPostSpec {
  title: string
  href: string
  image: ImageRef
  /**
   * Without one the byline is the date and read time alone — not every post names who wrote it. `brand`
   * marks an author that is the company rather than a person — `Liferay Team` — whose portrait is the
   * logo on `Brand/Primary` inside the glass line.
   */
  author?: { name: string; avatar?: ImageRef; brand?: boolean }
  /** As the card prints it — `October 20, 2026`. A post with no date on its page leaves it out. */
  date?: string
  /** As the card prints it — `2 Min Read`. */
  readTime?: string
  tags?: string[]
}

/** The person under a post — the blog's `Author` card at the foot of the article. */
export interface AuthorSpec {
  name: string
  /** The job title, set in small caps under the name. */
  title?: string
  /** Without one, the portrait is the name's initials. */
  avatar?: ImageRef
}

/**
 * One heading's worth of an article. `nav` is the shorter name the outline lists it under — the file
 * titles the first section `Key Points` and lists it as `Key Takeaways`.
 */
export interface ArticleSectionSpec {
  title: string
  nav?: string
  /** Paragraphs, in order. */
  body?: string[]
  /** The checked `Key Point Main List`, under the paragraphs. */
  points?: { title: string; description?: string }[]
  /** `Section/2` — a smaller heading inside the section. Not listed in the outline. */
  subsections?: { title: string; body: string[] }[]
  /**
   * The section's content as a run of blocks, in order, after `body` and `points` — for a section that
   * mixes paragraphs with a numbered list, a quote or a picture, as the customer story's do.
   */
  blocks?: ArticleBlock[]
}

/** One piece of an article section's running content. */
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  /** The numbered `Main List Item` run: `1.`, `2.`… beside each item, the text in secondary. */
  | { type: 'list'; items: string[] }
  /**
   * `Quote Resources` — a pull quote with the accent quote mark. `emphasis` are phrases inside `text`
   * set in semibold, as the file draws `scale automatically` and `a lot quicker`.
   */
  | { type: 'quote'; text: string; emphasis?: string[]; name: string; role?: string }
  | { type: 'image'; image: ImageRef }

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
  /*
   * Liferay Learn's six ways in, and the two capabilities its grid names that the product map does not:
   * DAM, and self-hosted installation, which the set draws as a database.
   */
  | 'documentation'
  | 'courses'
  | 'learning-paths'
  | 'certifications'
  | 'support'
  | 'global-services'
  | 'dam'
  | 'database'
  | 'add-user'
  | 'user-validation'
  | 'ai'
  /* The industries the Solutions hub's tabs lead with; `financial-services` is above. */
  | 'manufacturing'
  | 'public-sector'
  | 'energy-and-utilities'
  | 'healthcare'
  /*
   * The Solutions Library's `Common Cards` (Portal and Industry types) lead with the Marketing Assets
   * library's icons — `Solutions / Partner Portals 2`, `Industries / Government` — which the curated
   * set does not draw. Named for the library file they come from.
   */
  | 'partner-portals-2'
  | 'supplier-portals-3'
  | 'financial-services-2'
  | 'manufacturing-2'
  | 'government'
  | 'energy-and-supply'
  | 'healthcare-2'
  | 'industries-integration'
  /* Partner Home's program and ecosystem cards — the library's own drawings of these three. */
  | 'module-integration'
  | 'general-personalization'
  | 'partners'
  /* OEM Partner's — the library's `General / ai`, and the frame's own person-and-cubes mark. */
  | 'general-ai'
  | 'user-cubes'
  /** The person with an ID badge — the Partner Directory card. */
  | 'user-badge'
  /** The person with a screen — the Technology Partner card. */
  | 'user-screen'

export interface CardSpec {
  title: string
  description?: string
  /**
   * The decorations a card can lead with. `icon` and `tag` are alternatives; `image` can sit over an
   * `icon`, as the Solutions Library's `Common Cards` `Type=Industry` draws: the picture inset in the
   * card, then the glass icon over the title.
   */
  image?: ImageRef
  icon?: GlassIconName
  tag?: string
  href?: string
  /**
   * How far the reader is through it, 0–100 — the Learn `Course Card`'s `Progress` cell, a bar at the
   * card's foot. At 100 it reads as complete.
   */
  progress?: number
  /**
   * A button at the card's foot — `View the Partner Directory`. A card with an action is not itself a
   * link, so set this or `href`, not both.
   */
  action?: LinkRef
  /** A figure at the card's foot, under a rule — the catalog's `845 Months to Launch`. */
  stat?: StatSpec
  /**
   * A checked list under the description — `Common Cards` `Type=Portal`: what the solution does, a
   * claim per line. Strings rather than `KeyPoints`' titled points, because the card draws one line each.
   */
  points?: string[]
  /** Arrow links under the description, stacked — `Type=Industry`'s two ways on. */
  links?: LinkRef[]
  /**
   * Who said it, under a quote set as the `description` — `Steven LaGow, Partner Director`: the name in
   * semibold, then the role. Partner Pages' ecosystem cards (node `217:27595`) give a quote card no title.
   */
  attribution?: { name: string; role?: string }
  /** One arrow link at the card's foot, pushed to the bottom so a row of cards lines them up. */
  cta?: LinkRef
  /**
   * A row of figures at the card's foot, ruled apart — `Type=Industry`'s three. `stat` is the single
   * figure under a rule; this is the row.
   */
  stats?: StatSpec[]
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
  /**
   * The figure and its unit — `140` + `%`, or `+` + `100M`. Optional: a partner testimonial has a
   * quote and no figure, and the card then leads straight into the quote.
   */
  value?: string
  prefix?: string
  suffix?: string
  label?: string
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
  /**
   * The accordion rows.
   *
   * `media` on a row **replaces the panel's** while that row is open, which is how the Home page's
   * teams panel shows a different clip per claim. Rows without one fall back to `PanelSpec.media`, so
   * a panel can give footage to some rows and not others without going half-empty.
   */
  /** `icon` is a UI icon before the question — the OEM page's `Why Partner` rows draw one each. */
  items?: {
    question: string
    answer: string
    /** Bullets under the answer — a partner track's `Target audience`, `Company size`… */
    list?: string[]
    icon?: IconName
    link?: LinkRef
    media?: ImageRef
  }[]
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
  /**
   * A labelled line under the description — `What we look for in a partner:` and its answer, the label in
   * accent small caps. Technology Partner's partnership models (node `272:35811`).
   */
  note?: { label: string; text: string }
  /** A customer's proof under the points — `140% increase in customer self-service · Sky`, and its story. */
  proof?: { customer: string; value: string; label: string; href?: string; linkLabel?: string }
}

/**
 * Every section takes an optional `anchor` — an id to link to, which is what a page's sticky sub-nav
 * points at. It is the page's choice, not the section type's, so it lives on all of them.
 */
export type SectionSpec = SectionBody & { anchor?: string }

type SectionBody =
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
      /** The phrase inside `title` that carries the brand gradient — see `customerStories`. */
      titleHighlight?: string
      /** `center` for a grid that introduces a set rather than continuing the page's argument. @default 'left' */
      align?: 'left' | 'center'
      description?: string
      /**
       * How many across at desktop.
       *
       * Four is the file's `Card Grid` — the Home page's row of four. Three is
       * `Card Grid- Non Clickable` and the detail pages' feature grids, where six cards read as two rows
       * of three rather than a row of four and a stranded pair.
       *
       * Two is a pair of large destination cards — Partner Home's `Explore the Liferay Ecosystem`.
       *
       * @default 4
       */
      columns?: 2 | 3 | 4
      /**
       * `glass` gives every card the glass surface even when it is not a link — Partner Pages' feature
       * cards, which are panels drawn in glass. Without it a card is glass only when it goes somewhere.
       */
      surface?: 'glass'
      /**
       * `horizontal` sets each card's icon beside its title, at 48 and 24 — the ecosystem cards (node
       * `25120:53447`), which are a title and nothing else. @default 'vertical'
       */
      cardHeader?: 'vertical' | 'horizontal'
      /** Without tabs, `cards` renders directly; with them, the bar swaps the grid. */
      cards?: CardSpec[]
      tabs?: TabGroup<CardSpec[]>[]
      /**
       * Further rows under the first, each under its own smaller heading, 64 below the row above —
       * `Discover the Liferay Ecosystem`, then `Other Ways to Partner with Liferay`, as one section.
       */
      groups?: { title: string; cards: CardSpec[] }[]
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
      /**
       * Which card the grid is made of. `resource` is Figma's `Common Cards` `Type=Resource` — the
       * `Resource Card Default` the blog's Related Content draws: no surface, a 3:2 picture with 8px
       * corners and a faint blue hairline, the tag, then the title. Without it, cards are the glass
       * kind the Home page's grids use. @default 'glass'
       */
      card?: 'glass' | 'resource'
      cards: CardSpec[]
    }
  /**
   * `Customer Stories` -> `All Stories` (node `24581:69993`) — the whole catalog, filtered.
   *
   * `resourceGrid`'s neighbour and not the same type: that one renders every card it is given, and this
   * one owns a filter bar, a result count and the subset those produce. Folding them together would put
   * a filter bar on every grid in the library, which is the thing this schema exists to avoid.
   *
   * **The filters are faceted, and the schema says which way.** A card matches a filter when it carries
   * *any* of that filter's selected values, and it is shown when it matches *every* filter that has a
   * selection — OR within, AND across, which is what a reader means by picking Website and Customer
   * Portal under Solutions and then narrowing by Industry. A filter with nothing selected narrows
   * nothing.
   */
  | {
      type: 'storyCatalog'
      title: string
      /**
       * Cards per page. With it, the grid pages — `Showing 1 to 9 of 68 entries` and the numbered
       * `Pagination` under the grid; without, every match shows at once.
       */
      pageSize?: number
      /** One multiselect each. The label is the pill's label *and* the key into a card's `facets`. */
      filters: { label: string; options: string[] }[]
      /**
       * The cards, each carrying the values it holds per filter.
       *
       * Keyed by the filter's label rather than by an id: there is one name for a filter and this is it,
       * so a card cannot reference a filter that does not exist without it being obvious in the data.
       */
      cards: (CardSpec & { facets?: Record<string, string[]> })[]
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
      description?: string
      /** `left` puts the heading on the content edge, as the catalog draws it. @default 'center' */
      align?: 'left' | 'center'
      /** `glass` is the catalog's card; the Home carousel's is the flat `static` one. @default 'static' */
      surface?: 'glass' | 'static'
      /** The outline button on the heading's trailing edge — `Browse All Customer Stories`. */
      action?: LinkRef
      /**
       * `carousel` bleeds off both edges behind arrows. `grid` is Partner Home's (node `212:26649`): the
       * cards side by side across the content width, at most three, no arrows — for a set small enough to
       * read at once. @default 'carousel'
       */
      layout?: 'carousel' | 'grid'
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
      /**
       * The label's size. `lg` is the 40px pill the Solutions hub's overview draws (node `24920:83477`);
       * `sm` the catalog's small tag. @default 'sm'
       */
      labelSize?: 'sm' | 'lg'
      title: string
      titleHighlight?: string
      description?: string
      points?: { title: string; description?: string }[]
      action?: LinkRef
      /** A line over the `action` link — `Looking for individual features instead?`. */
      actionLead?: string
      /**
       * A button row instead of the link — `Find a Partner` and `Become a Partner` on the catalog's
       * partner band. The same shape as the hero's, Medium as drawn.
       */
      buttons?: HeroSpec['buttons']
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
      /** `Key takeaways` — the claims the questions add up to, checked, over the accordion. */
      takeaways?: string[]
      /**
       * `stacked` is the centred 780 column, the takeaways over the questions. `side` is the Solutions
       * Library's (node `25092:75670`): the heading on the content edge, the questions 900 wide and the
       * takeaways in a 320 column beside them, top-aligned. @default 'stacked'
       */
      layout?: 'stacked' | 'side'
      items: { question: string; answer: string }[]
      /** The sources for the page's figures, small, under the accordion. */
      footnotes?: string[]
    }
  /**
   * Partner quotes as cards, two or three across — the partner pages' `What Partners Are Saying`: the
   * accent quote mark, the quote, the person and their role, and the way to their story. No picture and
   * no figure; for stories with results, `customerStories` is the carousel.
   */
  | {
      type: 'quotes'
      title: string
      titleHighlight?: string
      description?: string
      /**
       * `logo` is the partner's mark, opposite the quote mark at the card's head — Partner Pages' OEM quote
       * cards (node `212:27313`). Drawn at most 48 tall, right-aligned.
       */
      quotes: { quote: string; name: string; role?: string; link?: LinkRef; logo?: ImageRef }[]
    }
  /**
   * `Partner Levels Designed for Growth` — the tiers as cards, then the program overview: a table per
   * view (benefits, requirements) behind a pill bar, the tiers across the top and the rows grouped under
   * category headings. A cell is included (`true`), not (`false`), a level of something (`{ level }`,
   * drawn as that many marks — the sheet's coins), or text.
   */
  | {
      type: 'tierTable'
      title: string
      titleHighlight?: string
      description?: string
      /**
       * Each tier's card. `points` is the score the tier starts at (`5-6`, `10+`), `certified` the
       * certified headcount it needs, and `fee` its annual fee — Partner Pages' tier cards (node
       * `255:17286`), which carry the requirements so the table below can be all benefits.
       */
      tiers: { name: string; description: string; points?: string; certified?: string; fee?: string }[]
      /** The fine print under the tier cards — how the points are earned. */
      tiersNote?: string
      /**
       * Folds the table away behind a toggle with this label — `Compare every benefit and requirement`.
       * Open to start. Without it the table is always shown.
       */
      compareLabel?: string
      overviewTitle?: string
      tables: {
        label: string
        /** The pill's shorter name — `Benefits` under a `Program Overview` heading. @default label */
        tab?: string
        groups: { label: string; rows: { label: string; values: (boolean | string | { level: number })[] }[] }[]
        note?: string
      }[]
    }
  /**
   * `A Partnership Model for Every Opportunity` — the case and a button on the left, the models down the
   * right: each a glass icon, a name, what it is, and a boxed `What we look for in a partner` note,
   * ruled off from the next.
   */
  | {
      type: 'partnershipModels'
      title: string
      titleHighlight?: string
      description?: string
      /** A second paragraph under the description — the nudge for someone unsure where they fit. */
      note?: string
      action?: LinkRef
      models: { icon?: GlassIconName; title: string; description: string; lookFor?: string }[]
      /** The note box's label. @default 'What we look for in a partner:' */
      lookForLabel?: string
    }
  /**
   * `Path to Partnership` — what happens after applying, as a numbered timeline, beside the form card
   * that starts it. `backdrop: 'mesh'` lays the footer's drifting colour field behind the band.
   */
  | {
      type: 'stepsForm'
      title: string
      subtitle?: string
      steps: { title: string; body: string }[]
      form: NonNullable<HeroSpec['formCard']>
      /**
       * `mesh` lays the footer's drifting colour field behind the band. `glow` is Partner Pages' OEM
       * `Path to Partnership` (node `245:11603`): a corner of colour from the top right, fading into the
       * page. On the dark canvas it drifts in the hero bubble's colours, as the Solutions hub's closing
       * panel does; on the light canvas it is the drawn still gradient, purple into blue.
       */
      backdrop?: 'mesh' | 'glow'
    }
  /**
   * `Built on Liferay` — a gallery that scrolls sideways, led by large screenshots of real customer
   * builds in a browser frame: the address, the solution tag, the customer and its industry, what they
   * built, and the features in it. What was built, not what it achieved; outcomes are the story's.
   */
  | {
      type: 'buildGallery'
      title: string
      titleHighlight?: string
      description?: string
      builds: {
        url: string
        image: ImageRef
        tag: string
        customer: string
        industry?: string
        headline: string
        features?: string[]
        link?: LinkRef
      }[]
      action?: LinkRef
    }
  /**
   * `Why Liferay` — differentiator cards over a feature comparison against the alternatives a buyer
   * shortlists, each cell yes, partial or no, with links to the `Liferay vs X` pages and the basis for
   * the comparison under it. The first column is Liferay.
   */
  | {
      type: 'comparison'
      title: string
      titleHighlight?: string
      description?: string
      cards: { icon?: GlassIconName; title: string; description: string }[]
      table: {
        caption: string
        columns: string[]
        rows: { feature: string; values: ('yes' | 'partial' | 'no')[] }[]
        links?: LinkRef[]
        note?: string
      }
    }
  /**
   * A TCO calculator: accounts and the number of point tools replaced, a three- or five-year horizon,
   * and the estimate it adds up to — the stitched stack against Liferay — with an email field for the
   * PDF and a link to a competitor comparison.
   *
   * The model is data, not code, so each solution can carry its own: a one-time cost, a cost per year,
   * a cost per tool (one-time and per year) and a cost per account per year, for each side.
   */
  | {
      type: 'costCalculator'
      title: string
      titleHighlight?: string
      description?: string
      accounts: { label: string; min: number; max: number; step: number; value: number }
      tools: { label: string; hint?: string; min: number; max: number; value: number }
      horizons: number[]
      model: {
        stack: { label: string; oneTime: number; perYear: number; perTool: number; perToolPerYear: number; perAccountPerYear: number }
        liferay: { label: string; oneTime: number; perYear: number; perAccountPerYear: number }
      }
      report: { prompt: string; placeholder: string; submit: string; success: string }
      compare?: LinkRef
      note?: string
    }
  /**
   * The closing call to action, on the page rather than in the footer: a heading, a line, an email
   * field with its button, then the arrow links — and a quieter line for someone not ready yet.
   */
  | {
      type: 'closingCta'
      title: string
      titleHighlight?: string
      description?: string
      placeholder: string
      submit: string
      links?: LinkRef[]
      /** Outline buttons under the field, instead of or beside the links — `Book a Custom Demo`. */
      buttons?: LinkRef[]
      aside?: LinkRef
      /** Plain text before the `aside` link, on the same line — `Not ready yet?`. */
      asideLead?: string
      /**
       * `card` puts the band in a rounded panel inset by the page gutter — the Solutions Library's
       * `Ready for the future?` (node `25092:74309`) — rather than straight on the page. @default 'none'
       */
      surface?: 'none' | 'card'
      /** `mesh` fills the panel with the footer's drifting colour field. Meant for `surface: 'card'`. */
      backdrop?: 'mesh'
      /**
       * `split` sets the heading and line on the left and the field on the right, the buttons and the
       * `aside` link in one row under it — read left to right like a hero, at about two thirds the height
       * of the centred band. One column on a narrow screen. @default 'center'
       */
      layout?: 'center' | 'split'
      /**
       * The fine print under the field — a newsletter's consent line, as `Page Action Section` draws it
       * (node `25037:46647`): `Paragraph/XX-Small` 11/16, 8px under the field. `link` follows `text`.
       */
      consent?: { text: string; link?: LinkRef }
    }
  /**
   * Figma `Type=Quick Links` (node `24263:34142`). A left title over a grid of small horizontal cards,
   * each an icon and a label — the shortcuts row a detail page ends on.
   */
  | {
      type: 'quickLinks'
      title: string
      titleHighlight?: string
      /** The button on the heading's trailing edge — Learn's `Explore All` over its capability grid. */
      action?: LinkRef
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
      /**
       * `glass` is Partner Pages' `Still Evaluating?` bar (node `205:12359`): a glass card, the icon at 64
       * leading, the heading and line beside it, and an outline button on the trailing edge. Without it the
       * card stacks on the brand gradient. @default 'gradient'
       */
      surface?: 'gradient' | 'glass'
      /**
       * One way on from the paragraph. `button` when it is the thing the card asks for — Learn's
       * sign-in prompt — and `link` when it is somewhere to read more, which is the default.
       */
      action?: LinkRef & { style?: 'button' | 'link' }
    }
  /**
   * Figma's `Stats Bar` as a band of its own — the row of figures the `Contact Sales` page puts
   * directly under its hero, before anything else has been claimed.
   */
  | {
      type: 'statsBar'
      /** A centred heading over the figures — Partner Home's `Join a Growing Global Ecosystem`. */
      title?: string
      description?: string
      /**
       * `lg` is Partner Home's (node `148:32227`): 64px figures, each over a sentence of plain 18px text
       * rather than a small-caps label — for figures that need a line to say what they count.
       * @default 'md'
       */
      size?: 'md' | 'lg'
      stats: StatSpec[]
    }
  /**
   * `Blog Hub` (node `25025:51238`) — `Featured Blogs` and `Most Recent Blogs`. Three columns at a 24px
   * gap of `BlogPostSpec` cards: the picture bled to the card's edge, then the title, the byline and the
   * topics. Its own type rather than a `resourceGrid` card, because a post's foot is a byline — who,
   * when, how long — which no `CardSpec` field says.
   */
  | {
      type: 'blogGrid'
      title: string
      description?: string
      action?: LinkRef
      /**
       * `glass` is the frame's card — a glass surface with the text inset 20px. `plain` drops the surface
       * and its padding, so the picture and text sit on the page itself, the way `resourceGrid`'s
       * `resource` card does. `overlay` sets the text over the picture on a dark scrim — a taller, 4:5
       * image-led card; vertical only. `blog` is `Common Cards` `Type=Blog- no padding` (node
       * `25025:53104`): `plain`, with the topics always in small caps over the title, a 16px rhythm
       * between every part, and the date in primary text. `blogGlass` is `Common Cards` `Type=Blog`
       * (node `24980:63861`): the glass card, small-caps topics over the title 16 above it, and a
       * stacked byline with a 32px portrait 4px from the name. @default 'glass'
       */
      card?: 'glass' | 'plain' | 'overlay' | 'blog' | 'blogGlass'
      /**
       * `horizontal` lays the grid out as two columns of the shelf's compact horizontal cards — a list
       * that fits more posts in less height. @default 'vertical'
       */
      align?: 'vertical' | 'horizontal'
      /**
       * Where a post's topics sit. `bottom` is the frame's — under the byline. `top` puts them over the
       * title, where they read as the post's kind before its headline. @default 'bottom'
       */
      tagPosition?: 'top' | 'bottom'
      /**
       * How the topics are drawn. `text` is the first frame's — 14px secondary text, dot-separated.
       * `pill` is the updated frame's (node `25025:51278`) — `Label CTA` `Style=Filled, Size=XS`, one per
       * topic. `caps` is `Small Caps/Small Caps Smaller/Semi Bold` — 12px uppercase, 6% tracking,
       * dot-separated — as the `Blog- no padding` cell sets its topics. @default 'text'
       */
      tagStyle?: 'text' | 'pill' | 'caps'
      /**
       * How the byline is laid out. `stacked` is the hub frame's — a 36px portrait beside the name over
       * the date, then the read time behind a clock. `inline` is the `Common Cards` `Type=Blog` cell
       * (node `24980:63861`) — one row: a 28px portrait, then name, date and read time, dot-separated.
       * @default 'stacked'
       */
      byline?: 'stacked' | 'inline'
      posts: BlogPostSpec[]
    }
  /**
   * `Blog Hub` -> `Digital Experience` (node `25025:51280`) — one topic's shelf. A lead post on the left
   * as a tall card, and the next ones stacked on the right as horizontal cards with a 200x133 picture
   * leading. Two equal columns at a 24px gap; under 992 the stack drops under the lead.
   */
  | {
      type: 'blogFeature'
      title: string
      description?: string
      action?: LinkRef
      /** See `blogGrid`. `overlay` applies to the lead only. @default 'glass' */
      card?: 'glass' | 'plain' | 'overlay' | 'blog' | 'blogGlass'
      /** See `blogGrid`. @default 'bottom' */
      tagPosition?: 'top' | 'bottom'
      /** See `blogGrid`. @default 'text' */
      tagStyle?: 'text' | 'pill' | 'caps'
      /** See `blogGrid`. @default 'stacked' */
      byline?: 'stacked' | 'inline'
      lead: BlogPostSpec
      posts: BlogPostSpec[]
    }
  /** `Logos scrolling section` — a 64px monochrome logo row, flush against the band above it. */
  | { type: 'logoMarquee'; label: string; logos: string[] }
  /**
   * The blog post's body — `Solutions Library` -> `Blog` (node `24223:173039`). A sticky outline on
   * the left that follows the reader, an 800px column of headed sections on the right, then a call to
   * action card and the author.
   *
   * The outline is not data: it is the section titles (or their `nav`), so it cannot drift from the
   * headings it points at.
   */
  | {
      type: 'article'
      /** The outline's eyebrow. @default 'Outline' */
      outlineLabel?: string
      sections: ArticleSectionSpec[]
      /** The `Call to Action` card under the last section — a label, a headline, a line and an arrow. */
      cta?: { label?: string; title: string; description?: string; href: string }
      author?: AuthorSpec
      /**
       * The card down the right of the article — the blog's `Featured Asset` (node `24918:81870`): a
       * glass card with a 3:2 picture, a gradient tag and the title, sticky as the reader scrolls.
       */
      featured?: { tag?: string; title: string; image?: ImageRef; href: string }
      /**
       * The customer story's `Key Metrics` panel down the right instead of a featured card: a small glass
       * panel with a title over the figures, stacked with rules between. Set one or the other.
       */
      metrics?: { title: string; stats: StatSpec[] }
    }
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
      /**
       * `columns` lays the tabs side by side instead of behind a pill bar: each tab's label as a heading
       * over its accordion, no media — Solution Partner's two partner tracks (node `205:11785`), which a
       * reader compares rather than chooses between. @default 'tabs'
       */
      layout?: 'tabs' | 'columns'
      /** With a single tab there is nothing to switch, so the pill bar is left out. */
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
      /** The line under the heading, centred with it. */
      description?: string
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
  /**
   * Whether the page's figures count up as they arrive. `false` prints every figure as written — for a
   * page whose figures sit in cards read side by side, where a row of numbers ticking up competes with
   * the reading. @default true
   */
  countUp?: boolean
}
