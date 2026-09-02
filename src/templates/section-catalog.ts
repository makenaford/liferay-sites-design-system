import platformDiagram from '../../assets/home/platform-diagram.png'
import type { SectionSpec } from './page-schema'

/**
 * The palette a builder offers, and what a freshly added section starts as.
 *
 * Kept separate from `page-schema.ts` because that file is types and this is data — a builder needs a
 * list it can render, and a developer reading the schema does not need placeholder copy in the way.
 *
 * A blank starts with **real-shaped placeholder content**, not empty strings. An empty section renders
 * as a void and reads as broken, which makes a designer think they have done something wrong; a
 * section that arrives saying `Section title` is obviously theirs to replace.
 */

export interface SectionType {
  type: SectionSpec['type']
  /** What the palette calls it. Figma's own cell name wherever there is one. */
  label: string
  /** One line on when to reach for it. */
  hint: string
  blank: () => SectionSpec
}

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export const SECTION_TYPES: SectionType[] = [
  {
    type: 'cardGrid',
    label: 'Card grid',
    hint: 'Four image cards, optionally behind a pill bar.',
    blank: () => ({
      type: 'cardGrid',
      title: 'Section title',
      cards: Array.from({ length: 4 }, (_, i) => ({
        title: `Card ${i + 1}`,
        description: LOREM,
        href: '#',
      })),
    }),
  },
  {
    type: 'resourceGrid',
    label: 'Resource grid',
    hint: 'Three columns, each card led by an icon or a tag.',
    blank: () => ({
      type: 'resourceGrid',
      title: 'Section title',
      description: 'A line about what these are.',
      cards: Array.from({ length: 3 }, () => ({
        title: 'Card Title',
        description: LOREM,
        icon: 'mail' as const,
        href: '#',
      })),
    }),
  },
  {
    type: 'customerStories',
    label: 'Customer stories',
    hint: 'A bleeding carousel of quotes, each with a figure.',
    blank: () => ({
      type: 'customerStories',
      title: 'What our customers say',
      stories: [
        {
          customer: 'Customer',
          value: '100',
          suffix: '%',
          label: 'The measure',
          quote: 'What they said about it.',
          name: 'Their name',
          role: 'Their role',
        },
      ],
    }),
  },
  {
    type: 'tabbedContent',
    label: 'Tabbed content',
    hint: 'A pill bar over a content-and-media panel it swaps.',
    blank: () => ({
      type: 'tabbedContent',
      title: 'Section title',
      description: 'A line under the heading.',
      tabs: [
        {
          value: 'one',
          label: 'First',
          content: { title: 'Panel heading', description: LOREM },
        },
        {
          value: 'two',
          label: 'Second',
          content: { title: 'Second heading', description: LOREM },
        },
      ],
    }),
  },
  {
    type: 'fullCard',
    label: 'Full card',
    hint: 'One horizontal card with links and stats, over a rule of tabs.',
    blank: () => ({
      type: 'fullCard',
      title: 'Section title',
      tabs: ['First', 'Second'],
      card: {
        title: '{tab}',
        description: LOREM,
        links: [{ label: '{tab} solutions', href: '#' }],
        stats: [{ value: '45', suffix: '%', label: 'The measure' }],
      },
    }),
  },
  {
    type: 'mediaBand',
    label: 'Media band',
    hint: 'A centred title over one wide graphic.',
    blank: () => ({
      type: 'mediaBand',
      title: 'Section title',
      /*
       * A real graphic, not an empty `src`. The blank shipped one, which rendered `<img src="">` — and
       * an empty `src` does not mean "no image" to a browser, it means *this page's own URL*, so every
       * blank media band asked for the document again. A placeholder that has to be replaced is a
       * visible job; a broken request is an invisible one.
       */
      image: { src: platformDiagram, alt: 'Replace with this section’s own graphic' },
    }),
  },
  {
    type: 'capabilityMap',
    label: 'Capability map',
    hint: 'A hub with up to four groups of four products around it.',
    blank: () => ({
      type: 'capabilityMap',
      title: 'Section title',
      hub: { icon: 'dxp', label: 'DXP' },
      clusters: [
        {
          label: 'First group',
          items: [
            { label: 'Sites', icon: 'sites', href: '#' },
            { label: 'CMS', icon: 'cms', href: '#' },
            { label: 'CMP', icon: 'cmp', href: '#' },
            { label: 'Search', icon: 'search', href: '#' },
          ],
        },
        {
          label: 'Second group',
          items: [
            { label: 'Commerce', icon: 'commerce', href: '#' },
            { label: 'PIM', icon: 'pim', href: '#' },
            { label: 'DSR', icon: 'dsr', href: '#' },
            { label: 'Personalization', icon: 'personalization', href: '#' },
          ],
        },
      ],
    }),
  },
  {
    type: 'logoMarquee',
    label: 'Logo marquee',
    hint: 'A scrolling logo row, flush against the band above.',
    blank: () => ({
      type: 'logoMarquee',
      label: 'Customers',
      logos: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'],
    }),
  },
  {
    type: 'faq',
    label: 'FAQ',
    hint: 'A centred title over an accordion, in a narrower column.',
    blank: () => ({
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: Array.from({ length: 4 }, (_, i) => ({
        question: `This is my question for the FAQ ${i + 1}`,
        answer: LOREM,
      })),
    }),
  },
  {
    type: 'quickLinks',
    label: 'Quick links',
    hint: 'A title over a grid of small icon-and-label cards — the page’s exits.',
    blank: () => ({
      type: 'quickLinks',
      title: 'Section title',
      links: Array.from({ length: 6 }, (_, i) => ({
        label: `Link ${i + 1}`,
        href: '#',
        icon: 'sites' as const,
      })),
    }),
  },
  {
    type: 'highlightText',
    label: 'Highlight text',
    hint: 'One wide gradient card, led by a glass icon — a paragraph to be read, not skimmed.',
    blank: () => ({
      type: 'highlightText',
      title: 'Card Title',
      body: LOREM,
      icon: 'sites' as const,
    }),
  },
  {
    type: 'statsBar',
    label: 'Stats bar',
    hint: 'A row of figures as a band of its own.',
    blank: () => ({
      type: 'statsBar',
      stats: [
        { value: '45', suffix: '%', label: 'The measure' },
        { value: '2x', label: 'The second measure' },
        { value: '600', suffix: '+', label: 'The third measure' },
      ],
    }),
  },
  {
    type: 'integrations',
    label: 'Integrations',
    hint: 'A title with an action, over a row of 64px glass tiles. `backdrop` lights the ground behind it.',
    blank: () => ({
      type: 'integrations',
      title: 'Section title',
      description: 'A line about what connects.',
      action: { label: 'Explore integrations', href: '#' },
      logos: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
    }),
  },
]

export const sectionTypeFor = (type: SectionSpec['type']) =>
  SECTION_TYPES.find((entry) => entry.type === type)

/** What the builder shows in a section row. The first line of content, whatever the type calls it. */
export function sectionSummary(section: SectionSpec): string {
  if ('title' in section && section.title) return section.title
  if (section.type === 'logoMarquee') return section.label
  return sectionTypeFor(section.type)?.label ?? section.type
}
