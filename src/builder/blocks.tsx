/**
 * The built-page blocks: the hero, the sections, and the site chrome the Storybook `Built Pages` are
 * made of, offered to the builder as nodes.
 *
 * ## Two kinds of node, one page
 *
 * Everything else in the registry is a **component tree** — a `Card` with a `Heading` in its title
 * slot. A built-page section is not that. `cardGrid` is a title and a list of cards, and how those
 * cards are laid out is a property of the section *type* (see the note at the top of
 * `src/templates/page-schema.ts`). So these nodes hold their content as `data` — a `HeroSpec` or a
 * `SectionSpec` — and are drawn by the same `PageRenderer` functions the stories use. A section on the
 * canvas is therefore exactly the section in Storybook, and a page made of them can sit beside one
 * made of components.
 *
 * Their editor is generated too: `sections.generated.ts` is read off `page-schema.ts`, so adding a
 * section type there makes it editable here with nothing to keep in step.
 */
import { SecondaryNav } from '../components/SecondaryNav'
import { IconGlassBlogs } from '../icons'
import { HeroBlock, SectionBlock } from '../templates/PageRenderer'
import { SiteFooter, SiteHeader } from '../templates/shared'
import { BLOG_NAV } from '../templates/blog-nav'
import { SECTION_TYPES } from '../templates/section-catalog'
import type { HeroSpec, SectionSpec } from '../templates/page-schema'
import type { ComponentSpec } from './catalog.generated'
import { createNode, type JsonObject } from './document'
import type { Entry } from './registry'

/** Which generated shape a data node is edited against. */
export type DataRoot = 'HeroSpec' | 'SectionSpec'

const spec = (name: string, props: ComponentSpec['props'] = [], doc?: string): ComponentSpec => ({
  name,
  doc,
  props,
})

/** A blank of a section type, from the same catalogue the Storybook templates use. */
export function blankSection(type: SectionSpec['type']): SectionSpec {
  const entry = SECTION_TYPES.find((one) => one.type === type)
  if (!entry) throw new Error(`No blank for section type '${type}'`)
  return entry.blank()
}

const BLANK_HERO: HeroSpec = {
  background: 'corner',
  label: 'Label',
  title: { text: 'A headline about this page', highlight: 'this page' },
  description: { text: 'One or two lines that say what a visitor gets here.' },
  buttons: [
    { label: 'Primary action', href: '#' },
    { label: 'Secondary action', href: '#', variant: 'outline' },
  ],
}

export const BLOCK_ENTRIES: Entry[] = [
  {
    name: 'SiteHeader',
    topLevel: true,
    label: 'Site header',
    group: 'Built pages',
    hint: 'The liferay.com header, with the real global navigation.',
    spec: spec('SiteHeader'),
    blank: () => ({ node: createNode('SiteHeader'), extra: [] }),
    /*
     * The header is `position: fixed`, which on the canvas means fixed to the *editor's* window — it
     * escaped the frame and sat over the toolbar. A transformed ancestor becomes the containing block
     * for fixed descendants, so this zero-height box pins it to the top of the page being edited, where
     * it overlaps the hero exactly as it does on a real page. A published page needs none of this.
     */
    render: ({ editing }) =>
      editing ? (
        <div style={{ position: 'relative', height: 0, zIndex: 20, transform: 'translateZ(0)' }}>
          <SiteHeader />
        </div>
      ) : (
        <SiteHeader />
      ),
  },
  {
    name: 'BlogNav',
    topLevel: true,
    label: 'Blog nav',
    group: 'Built pages',
    hint: 'The Blogs sub-navigation under the site header.',
    spec: spec('BlogNav', [
      { name: 'progress', kind: 'boolean', doc: 'A reading-progress bar along the bottom — for a post, not the hub.' },
    ]),
    blank: () => ({ node: createNode('BlogNav'), extra: [] }),
    render: ({ props }) => (
      <SecondaryNav
        title="Blogs"
        icon={<IconGlassBlogs size={32} />}
        titleHref="#"
        items={BLOG_NAV}
        progress={Boolean(props.progress)}
        mt={65}
      />
    ),
  },
  {
    name: 'PageHero',
    topLevel: true,
    label: 'Page hero',
    group: 'Built pages',
    hint: 'A built-page hero: headline, actions, media, proof.',
    spec: spec('PageHero'),
    dataRoot: 'HeroSpec',
    blank: () => ({ node: { ...createNode('PageHero'), data: BLANK_HERO as unknown as JsonObject }, extra: [] }),
    render: ({ node }) => (node.data ? <HeroBlock hero={node.data as unknown as HeroSpec} /> : null),
  },
  {
    name: 'PageSection',
    topLevel: true,
    label: 'Page section',
    group: 'Built pages',
    hint: 'Any of the built-page section types — card grid, FAQ, quotes, tier table…',
    spec: spec('PageSection'),
    dataRoot: 'SectionSpec',
    blank: () => ({
      node: { ...createNode('PageSection'), data: blankSection('cardGrid') as unknown as JsonObject },
      extra: [],
    }),
    render: ({ node }) =>
      node.data ? <SectionBlock section={node.data as unknown as SectionSpec} /> : null,
  },
  {
    name: 'SiteFooter',
    topLevel: true,
    label: 'Site footer',
    group: 'Built pages',
    hint: 'The liferay.com footer, on its drifting mesh.',
    spec: spec('SiteFooter', [
      {
        name: 'cta',
        kind: 'boolean',
        default: 'true',
        doc: 'The “Ready for the future?” band over the links. Off for a page that makes its own ask.',
      },
    ]),
    blank: () => ({ node: createNode('SiteFooter', { cta: true }), extra: [] }),
    render: ({ props }) => <SiteFooter cta={props.cta !== false} />,
  },
]
