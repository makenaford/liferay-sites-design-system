/**
 * The Storybook `Built Pages`, as pages the builder can open and edit.
 *
 * Each one is the **same data the story renders** — `BLOG_HUB_PAGE`, `OEM_PARTNER_PAGE`, a
 * `PAGE_PRESETS` entry — plus the chrome the story draws around it. Nothing is copied: change
 * `oem-partner-page.ts` and the next page started from `OEM Partner` has the change.
 *
 * A page started from one is a **copy** from then on. That is the point — a designer is drafting the
 * next version — and it means editing a page in the builder never changes the story it came from.
 *
 * `Home` and `Japan Home` are not here. They are drawn by `HomePage.tsx`, a bespoke component rather
 * than a `PageSpec`, so there is nothing for the builder to hold as data until they are moved onto
 * section types.
 */
import { BLOG_HUB_PAGE } from '../templates/blog-hub-page'
import { OEM_PARTNER_PAGE } from '../templates/oem-partner-page'
import { PARTNER_HOME_PAGE } from '../templates/partner-home-page'
import { SOLUTION_PARTNER_PAGE } from '../templates/solution-partner-page'
import { SOLUTIONS_HUB_PAGE } from '../templates/solutions-hub-page'
import { TECHNOLOGY_PARTNER_PAGE } from '../templates/technology-partner-page'
import { PAGE_PRESETS, presetFor } from '../templates/page-presets'
import { SECTION_TYPES } from '../templates/section-catalog'
import type { PageSpec, SectionSpec } from '../templates/page-schema'
import { createNode, type JsonObject, type PageDocument, type PageNode } from './document'

export interface BuiltPage {
  id: string
  label: string
  /** The Storybook folder it lives in, so the picker reads like the sidebar. */
  group: 'Assets to Web' | 'Partner Pages' | 'Product Pages' | 'Page templates'
  hint?: string
  page: () => PageSpec
  /** The `Ready for the future?` band — off on the pages that close on their own ask. */
  footerCta: boolean
  /** The Blogs sub-navigation under the header. */
  blogNav?: 'hub' | 'post'
  colorScheme?: 'dark' | 'light'
}

/*
 * Every value goes through `structuredClone`. The exported page constants are shared module state,
 * and a document is edited in place by nobody — but handing the builder the very same objects the
 * stories render would make that a promise rather than a fact.
 */
const fixed = (page: PageSpec) => () => structuredClone(page)
const preset = (id: string) => () => presetFor(id)!.create()

export const BUILT_PAGES: BuiltPage[] = [
  { id: 'blog-hub', label: 'Blog Hub', group: 'Assets to Web', page: fixed(BLOG_HUB_PAGE), footerCta: false, blogNav: 'hub' },
  { id: 'blog', label: 'Blog', group: 'Assets to Web', page: preset('blog'), footerCta: false, blogNav: 'post' },
  { id: 'customer-story', label: 'Customer Story', group: 'Assets to Web', page: preset('customer-story'), footerCta: true },
  { id: 'partner-home', label: 'Partner Home', group: 'Partner Pages', page: fixed(PARTNER_HOME_PAGE), footerCta: false },
  { id: 'oem-partner', label: 'OEM Partner', group: 'Partner Pages', page: fixed(OEM_PARTNER_PAGE), footerCta: false },
  { id: 'solution-partner', label: 'Solution Partner', group: 'Partner Pages', page: fixed(SOLUTION_PARTNER_PAGE), footerCta: false },
  {
    id: 'technology-partner',
    label: 'Technology Partner',
    group: 'Partner Pages',
    page: fixed(TECHNOLOGY_PARTNER_PAGE),
    footerCta: false,
  },
  { id: 'solutions-hub', label: 'Solutions Hub', group: 'Product Pages', page: fixed(SOLUTIONS_HUB_PAGE), footerCta: false },
  /* The page templates, less the two already listed above under their built page's name. */
  ...PAGE_PRESETS.filter((one) => one.id !== 'blog' && one.id !== 'customer-story').map(
    (one): BuiltPage => ({
      id: `template-${one.id}`,
      label: one.label,
      group: 'Page templates',
      hint: one.hint,
      page: one.create,
      footerCta: true,
    }),
  ),
]

export const builtPageFor = (id: string | null | undefined) => BUILT_PAGES.find((one) => one.id === id)

/** A built page as builder nodes: header, hero, one node per section, footer. */
export function builtPageContent(built: BuiltPage): Pick<PageDocument, 'root' | 'nodes' | 'colorScheme'> {
  const spec = built.page()
  const ordered: PageNode[] = [
    createNode('SiteHeader'),
    ...(built.blogNav ? [createNode('BlogNav', built.blogNav === 'post' ? { progress: true } : {})] : []),
    { ...createNode('PageHero'), data: spec.hero as unknown as JsonObject },
    ...spec.sections.map((section) => ({ ...createNode('PageSection'), data: section as unknown as JsonObject })),
    createNode('SiteFooter', { cta: built.footerCta }),
  ]

  return {
    root: ordered.map((node) => node.id),
    nodes: Object.fromEntries(ordered.map((node) => [node.id, node])),
    colorScheme: built.colorScheme ?? 'dark',
  }
}

/**
 * A section of the given type with real content in it — what the editor switches to when a designer
 * changes a section's type.
 *
 * The section catalogue's blank when there is one. Ten types have no blank, because they arrived with
 * a page rather than through the palette; for those, the first one on any built page is a better start
 * than an empty form — it is a worked example of that type, written against the Figma file.
 */
export function exampleSection(type: string): SectionSpec | undefined {
  const blank = SECTION_TYPES.find((one) => one.type === type)
  if (blank) return blank.blank()
  for (const built of BUILT_PAGES) {
    const found = built.page().sections.find((section) => section.type === type)
    if (found) return found
  }
  return undefined
}
