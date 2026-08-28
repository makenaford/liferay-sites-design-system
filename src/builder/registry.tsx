/**
 * What the builder offers, and how a stored node becomes React.
 *
 * Three sources meet here:
 *
 * 1. **`catalog.generated.ts`** — every component in the library, with its props and their legal
 *    values read off the TypeScript types. This is the bulk of it, and none of it is written by hand.
 * 2. **`OVERRIDES`** — a short, deliberate list of props the generator *has* to drop, explained below.
 * 3. **`primitives.tsx`** — headings, paragraphs and arrangement, which the design system does not
 *    ship because they are not design decisions.
 *
 * Everything else — the palette, the inspector, the layer tree — reads this file and nothing else.
 */
import type { ReactNode } from 'react'
import {
  Accordion,
  Button,
  Footer,
  Header,
  Select,
  TextInput,
  Textarea,
  Card,
  Carousel,
  Chip,
  ContentMedia,
  Divider,
  Form,
  Hero,
  Image,
  Label,
  Link,
  List,
  Logo,
  Marquee,
  Section,
  SectionTitle,
  Stat,
  StatBar,
  Tabs,
} from '../index'
import * as allIcons from '../icons'
import { CATALOG, type ComponentSpec, type PropSpec } from './catalog.generated'
import { Grid, Heading, Paragraph, Plain, Row, Spacer, Stack } from './primitives'
import { createNode, type PageNode, type PropValue } from './document'

/* ------------------------------------------------------------------ the icon sets */

/**
 * The icon options, read off the generated modules rather than listed.
 *
 * `pnpm icons` adds a component; this picks it up on the next build with nothing to keep in step.
 * The two sets are not interchangeable — the UI glyphs are 1em strokes that inherit `currentColor`,
 * the glass icons are 64px illustrations carrying their own gradients — so they are separate
 * controls, exactly as they are separate manifests.
 */
const iconNames = Object.keys(allIcons)
  .filter((name) => name.startsWith('Icon') && !name.startsWith('IconGlass') && name !== 'IconProps')
  .sort()

const glassNames = Object.keys(allIcons).filter((name) => name.startsWith('IconGlass')).sort()

const icons = allIcons as unknown as Record<string, (props: Record<string, unknown>) => ReactNode>

/** `IconArrowRight` reads as `Arrow right` in the picker. */
const humanise = (name: string) =>
  name
    .replace(/^IconGlass|^Icon/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (c) => c.toUpperCase())

/* ------------------------------------------------------------------ the overrides */

/**
 * Props the generator drops on purpose, and which a page cannot do without.
 *
 * The generator keeps only props **declared in this repository**, which is what makes the palette
 * usable at all — without it every component would offer `onCopyCapture` and `aria-colindex`. The
 * cost is that a genuinely essential prop inherited from Mantine goes with them: `Button` gets its
 * label from `children`, `Image` needs a `src`, and a `Link` with no `href` is not a link.
 *
 * This is the list of those, and it is meant to stay short. A prop belongs here only if the component
 * is unusable without it — not because it might be handy. Anything that is a *design* decision should
 * be a real prop on the component, where the compiler can see it and the generator will find it on
 * its own.
 */
/** Shared by the three fields, which differ in what they collect and not in how they are labelled. */
const FIELD_PROPS: PropSpec[] = [
  { name: 'label', kind: 'text', doc: 'What the field is asking for. A field without one is unusable.' },
  { name: 'placeholder', kind: 'text' },
  { name: 'description', kind: 'text', doc: 'A line under the label.' },
  { name: 'required', kind: 'boolean' },
  { name: 'disabled', kind: 'boolean' },
]

const OVERRIDES: Record<string, PropSpec[]> = {
  Button: [
    { name: 'children', kind: 'text', doc: 'The label.' },
    { name: 'disabled', kind: 'boolean', doc: 'Figma draws this as the default fill at 50% opacity.' },
    { name: 'fullWidth', kind: 'boolean', doc: 'Fills the width of whatever it sits in.' },
  ],
  Link: [
    { name: 'children', kind: 'text', doc: 'The label.' },
    { name: 'href', kind: 'text', default: '#', doc: 'Where it goes.' },
  ],
  Label: [{ name: 'children', kind: 'text', doc: 'The label.' }],
  Chip: [{ name: 'children', kind: 'text', doc: 'The label.' }],
  Image: [
    { name: 'src', kind: 'text', doc: 'The file. A URL, or a path under the deployment.' },
    { name: 'radius', kind: 'number', doc: 'Corner radius in pixels.' },
  ],
  Card: [
    {
      name: 'href',
      kind: 'text',
      doc: 'Makes the whole card a link. Turn on `interactive` with it, or the card will not look clickable.',
    },
  ],
  Logo: [],

  /*
   * The field props. Every one of these is Mantine's, so the generator drops them — and a text field
   * with no label and no placeholder is not a field, it is a box. These are the minimum that makes one
   * usable, and no more: everything about how a field *looks* is the theme's.
   */
  TextInput: FIELD_PROPS,
  Textarea: [...FIELD_PROPS, { name: 'minRows', kind: 'number', default: '3' }],
  Select: [
    ...FIELD_PROPS,
    {
      name: 'options',
      kind: 'text',
      doc: 'The choices, one per line. The first is what the field shows when nothing is picked.',
    },
  ],
}

/* ------------------------------------------------------------------ entries */

export type Group = 'Structure' | 'Text' | 'Content' | 'Media' | 'Controls'

/** What the renderer hands a custom `render`. */
export interface RenderContext {
  /** Rendered contents of a slot, or `undefined` when it is empty. */
  slot: (name: string) => ReactNode | undefined
  /** The raw child nodes of a slot, for the compound components that need to read them. */
  children: (name: string) => PageNode[]
  /** Renders one node by id — for a compound component placing a child somewhere unusual. */
  renderNode: (id: string) => ReactNode
  node: PageNode
  props: Record<string, PropValue>
}

export interface Entry {
  name: string
  /** What the palette calls it. */
  label: string
  group: Group
  spec: ComponentSpec
  /** One line on when to reach for it, shown in the palette. */
  hint?: string
  /**
   * A band that spans the page, and therefore always joins the page rather than whatever happens to
   * be selected.
   *
   * Without this the placement rule does the locally sensible thing and the globally wrong one: `Hero`
   * has a `children` slot, so adding a `Section` with the hero selected puts the section *inside the
   * hero*. That is legal, renders, and is never what anyone meant. A section is a horizontal band of a
   * page; the only place it goes is the page.
   */
  topLevel?: boolean

  /**
   * A subcomponent: offered only inside these parents, and never on its own in the palette. An
   * `AccordionItem` outside an `Accordion` is not a thing a page can contain.
   */
  parentOnly?: string[]
  /** Slots that accept only certain components — the other half of the same rule. */
  accepts?: Record<string, string[]>
  /** The prop a designer edits by typing on the canvas, when there is one. */
  textProp?: string
  /** A freshly dropped node, with real placeholder content rather than an empty shell. */
  blank: () => Seed
  render: (ctx: RenderContext) => ReactNode
}

/** A node and the nodes it arrives already holding. */
export interface Seed {
  node: PageNode
  extra: PageNode[]
}

/* ------------------------------------------------------------------ building seeds */

/**
 * Builds a node and its subtree at once.
 *
 * A `Card` that arrives empty renders as a grey rectangle, which reads as broken; one that arrives
 * with a heading and a paragraph in it reads as obviously the designer's to replace. So a blank is a
 * small tree, and this flattens it into the node-plus-extras shape the document stores.
 */
export function seed(
  component: string,
  props: Record<string, PropValue> = {},
  slots: Record<string, Seed[]> = {},
): Seed {
  const extra: PageNode[] = []
  const ids: Record<string, string[]> = {}

  for (const [slot, children] of Object.entries(slots)) {
    ids[slot] = children.map((child) => child.node.id)
    for (const child of children) extra.push(child.node, ...child.extra)
  }

  return { node: createNode(component, props, ids), extra }
}

const heading = (content: string, extra: Record<string, PropValue> = {}) =>
  seed('Heading', { content, ...extra })
const paragraph = (content: string, extra: Record<string, PropValue> = {}) =>
  seed('Paragraph', { content, ...extra })

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'

/**
 * What may go in a slot the component **already wraps in a heading or a paragraph**.
 *
 * `SectionTitle` draws `<h2>{title}</h2>` and `<p>{description}</p>` itself, so putting a `Heading` in
 * that slot produces `<h2><h2>…</h2></h2>` — and a `Paragraph` produces a `<p>` inside a `<p>`. Both
 * render acceptably in the builder, because React builds the DOM directly and never asks the HTML
 * parser's opinion. Serialise the same page to a file and the parser applies its own rule — a `<p>` is
 * closed by the next `<p>`, a heading by the next heading — and the tree comes out a different shape
 * from the one on screen.
 *
 * That is worth stating plainly: the static artefact is what **found** this. A page can look right in
 * the builder for as long as nobody writes it down.
 *
 * So these slots take inline content only. The heading level and the type size are the component's to
 * choose there, which is what those props were for.
 */
const INLINE = ['Plain', 'Label', 'Link', 'Icon', 'GlassIcon', 'Chip']

/** The site chrome's default contents, so a new page arrives looking like a site rather than a void. */
const NAV = ['Platform', 'Solutions', 'Resources', 'Pricing']
const FOOTER_COLUMNS: [string, string[]][] = [
  ['Platform', ['Overview', 'Integrations', 'Security']],
  ['Solutions', ['Websites', 'Portals', 'Commerce']],
  ['Company', ['About', 'Careers', 'Contact']],
]

/* ------------------------------------------------------------------ the specs the generator cannot write */

/** A spec for a component that is the builder's own, so has no entry in the generated catalogue. */
const spec = (name: string, props: PropSpec[], doc?: string): ComponentSpec => ({ name, doc, props })

const ALIGN: PropSpec = { name: 'align', kind: 'enum', options: ['left', 'center', 'right'], default: 'left' }
const TONE: PropSpec = {
  name: 'tone',
  kind: 'enum',
  options: ['primary', 'secondary', 'tertiary'],
  doc: 'From the surface text tokens, so it inverts with the colour scheme.',
}

/* ------------------------------------------------------------------ the entries */

/** Pulls a generated spec and folds in this file's overrides. */
function generated(name: string): ComponentSpec {
  const base = CATALOG.find((entry) => entry.name === name)
  const extra = OVERRIDES[name] ?? []
  if (!base) return { name, props: extra }

  const known = new Set(base.props.map((prop) => prop.name))
  return { ...base, props: [...base.props, ...extra.filter((prop) => !known.has(prop.name))] }
}

/**
 * Erases a component's prop types for the renderer.
 *
 * The document holds JSON, and the compiler cannot know that the string in `props.variant` is one of
 * the four a `Button` accepts — that guarantee is made where the value is *set*, by the inspector,
 * from the options the generator read off the very same type. So the cast is at the boundary, once,
 * with the check on the other side of it, rather than a cast at every call.
 */
const loose = (Component: unknown) => Component as (props: Record<string, unknown>) => ReactNode

/** The default render: props straight through, slots rendered into the props of the same name. */
const passthrough =
  (Component: (props: Record<string, unknown>) => ReactNode) =>
  ({ props, slot, node }: RenderContext) => {
    const filled: Record<string, unknown> = { ...props }
    for (const name of Object.keys(node.slots)) {
      const rendered = slot(name)
      // An absent slot has to stay absent: half of these components key their layout off whether a
      // slot is there at all — Figma's `Show Image` boolean is exactly "did you pass one".
      if (rendered !== undefined) filled[name] = rendered
    }
    return <Component {...filled} />
  }

const entries: Entry[] = [
  /* ---------------------------------------------------------------- structure */
  {
    name: 'Section',
    topLevel: true,
    label: 'Section',
    group: 'Structure',
    hint: 'The band every block on a page sits in. Start here.',
    spec: generated('Section'),
    textProp: undefined,
    blank: () =>
      seed(
        'Section',
        {},
        {
          title: [sectionTitleSeed()],
          children: [seed('Grid', { columns: 3 }, { children: [cardSeed(), cardSeed(), cardSeed()] })],
        },
      ),
    render: passthrough(loose(Section)),
  },
  {
    name: 'SectionTitle',
    label: 'Section heading',
    group: 'Structure',
    hint: 'A heading, a description, and an action beside them.',
    spec: generated('SectionTitle'),
    accepts: { title: INLINE, description: INLINE },
    blank: () => sectionTitleSeed(),
    render: passthrough(loose(SectionTitle)),
  },
  {
    name: 'Hero',
    topLevel: true,
    label: 'Hero',
    group: 'Structure',
    hint: 'The top of the page: a headline, a line under it, and something to click.',
    spec: generated('Hero'),
    blank: () =>
      seed(
        'Hero',
        { background: 'full' },
        {
          title: [heading('A headline that says what this is', { level: 'h1', display: 'display-lg' })],
          description: [paragraph(LOREM, { size: 'lg', maxWidth: 560 })],
          actions: [
            seed('Row', { gap: 16 }, { children: [seed('Button', { children: 'Get started' })] }),
          ],
        },
      ),
    render: passthrough(loose(Hero)),
  },
  {
    name: 'Header',
    topLevel: true,
    label: 'Header',
    group: 'Structure',
    hint: 'The navigation bar across the top of the site.',
    spec: generated('Header'),
    accepts: { items: ['NavItem'] },
    blank: () => headerSeed(),
    /*
     * `items` is a list of objects, not a list of elements — a nav item is a label, a link and the id
     * that ties the trigger to its panel. So the child nodes are read rather than rendered, the way
     * `Tabs` reads its tabs, and each one's node id doubles as the value the component needs.
     */
    render: ({ props, children, slot }) => (
      <Header
        {...props}
        logo={slot('logo')}
        actions={slot('actions')}
        items={children('items').map((item) => ({
          value: item.id,
          label: (item.props.label as string) ?? 'Section',
          href: (item.props.href as string) || undefined,
        }))}
      />
    ),
  },
  {
    name: 'NavItem',
    label: 'Nav item',
    group: 'Structure',
    parentOnly: ['Header'],
    spec: spec('NavItem', [
      { name: 'label', kind: 'text' },
      { name: 'href', kind: 'text', default: '#' },
    ]),
    textProp: 'label',
    blank: () => seed('NavItem', { label: 'Section', href: '#' }),
    /*
     * Drawn by the header, not by itself — so it has no canvas presence of its own and is reached
     * through the layer tree. The alternative is a component that renders a nav item outside a nav bar,
     * which is not a thing.
     */
    render: () => null,
  },
  {
    name: 'Footer',
    topLevel: true,
    label: 'Footer',
    group: 'Structure',
    hint: 'The dark band at the bottom: columns of links, the brand, the legal line.',
    spec: generated('Footer'),
    accepts: { children: ['FooterColumn'], brand: ['FooterBrand'] },
    blank: () => footerSeed(),
    render: passthrough(loose(Footer)),
  },
  {
    name: 'FooterColumn',
    label: 'Footer column',
    group: 'Structure',
    parentOnly: ['Footer'],
    spec: spec('FooterColumn', [
      { name: 'title', kind: 'text' },
      { name: 'children', kind: 'slot' },
    ]),
    textProp: 'title',
    accepts: { children: ['FooterLink'] },
    blank: () => footerColumnSeed('Column', ['One', 'Two', 'Three']),
    render: ({ props, slot }) => <Footer.Column title={props.title as string}>{slot('children')}</Footer.Column>,
  },
  {
    name: 'FooterLink',
    label: 'Footer link',
    group: 'Structure',
    parentOnly: ['FooterColumn'],
    spec: spec('FooterLink', [
      { name: 'children', kind: 'text' },
      { name: 'href', kind: 'text', default: '#' },
    ]),
    textProp: 'children',
    blank: () => seed('FooterLink', { children: 'A link', href: '#' }),
    render: ({ props }) => <Footer.Link href={(props.href as string) ?? '#'}>{props.children as string}</Footer.Link>,
  },
  {
    name: 'FooterBrand',
    label: 'Footer brand',
    group: 'Structure',
    parentOnly: ['Footer'],
    spec: spec('FooterBrand', [
      { name: 'logo', kind: 'slot' },
      { name: 'address', kind: 'slot' },
      { name: 'social', kind: 'slot', doc: 'The social icons. Brand marks belong to the application, so pass your own.' },
    ]),
    blank: () =>
      seed('FooterBrand', {}, { logo: [seed('Logo', { height: 40 })], address: [seed('Plain', { content: '1400 Montefino Avenue, Diamond Bar, CA' })] }),
    render: ({ slot }) => <Footer.Brand logo={slot('logo')} address={slot('address')} social={slot('social')} />,
  },
  {
    name: 'ContentMedia',
    topLevel: true,
    label: 'Content and media',
    group: 'Structure',
    hint: 'Text in one column, an image in the other.',
    spec: generated('ContentMedia'),
    accepts: { title: INLINE, description: INLINE },
    blank: () =>
      seed(
        'ContentMedia',
        {},
        {
          title: [seed('Plain', { content: 'A heading for this half' })],
          description: [seed('Plain', { content: LOREM })],
          media: [seed('Image', { alt: '', ratio: '3:2' })],
        },
      ),
    render: passthrough(loose(ContentMedia)),
  },
  {
    name: 'Stack',
    label: 'Stack',
    group: 'Structure',
    hint: 'Things above one another.',
    spec: spec('Stack', [
      { name: 'gap', kind: 'number', default: '16', doc: 'A step from the spacing scale.' },
      { name: 'align', kind: 'enum', options: ['stretch', 'start', 'center', 'end'], default: 'stretch' },
      { name: 'children', kind: 'slot' },
    ]),
    blank: () => seed('Stack', {}, { children: [heading('Heading'), paragraph(LOREM)] }),
    render: passthrough(loose(Stack)),
  },
  {
    name: 'Row',
    label: 'Row',
    group: 'Structure',
    hint: 'Things beside one another, wrapping when they run out of room.',
    spec: spec('Row', [
      { name: 'gap', kind: 'number', default: '16' },
      { name: 'align', kind: 'enum', options: ['stretch', 'start', 'center', 'end'], default: 'center' },
      { name: 'justify', kind: 'enum', options: ['start', 'center', 'end', 'space-between'], default: 'start' },
      { name: 'wrap', kind: 'boolean', default: 'true' },
      { name: 'children', kind: 'slot' },
    ]),
    blank: () =>
      seed('Row', {}, { children: [seed('Button', { children: 'Primary' }), seed('Link', { children: 'Secondary', href: '#' })] }),
    render: passthrough(loose(Row)),
  },
  {
    name: 'Grid',
    label: 'Grid',
    group: 'Structure',
    hint: 'Equal columns that halve on a tablet and stack on a phone.',
    spec: spec('Grid', [
      { name: 'columns', kind: 'number', default: '3', doc: 'Columns at desktop.' },
      { name: 'gap', kind: 'number', default: '24' },
      { name: 'children', kind: 'slot' },
    ]),
    blank: () => seed('Grid', {}, { children: [cardSeed(), cardSeed(), cardSeed()] }),
    render: passthrough(loose(Grid)),
  },
  {
    name: 'Spacer',
    label: 'Spacer',
    group: 'Structure',
    hint: 'Empty vertical space. Prefer a section’s own spacing.',
    spec: spec('Spacer', [{ name: 'height', kind: 'number', default: '40' }]),
    blank: () => seed('Spacer', {}),
    render: passthrough(loose(Spacer)),
  },
  {
    name: 'Divider',
    label: 'Divider',
    group: 'Structure',
    spec: generated('Divider'),
    blank: () => seed('Divider', {}),
    render: passthrough(loose(Divider)),
  },

  /* ---------------------------------------------------------------- text */
  {
    name: 'Heading',
    label: 'Heading',
    group: 'Text',
    hint: 'A real heading, at one of the six levels.',
    textProp: 'content',
    spec: spec('Heading', [
      { name: 'content', kind: 'text' },
      { name: 'level', kind: 'enum', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], default: 'h2', doc: 'The heading level, and the F1–F6 size that goes with it.' },
      { name: 'display', kind: 'enum', options: ['none', 'display-sm', 'display-lg'], default: 'none', doc: 'The two display steps above F1, for a hero headline.' },
      ALIGN,
      TONE,
      { name: 'gradient', kind: 'boolean', doc: 'The brand-to-accent gradient the hero headline wears.' },
    ]),
    blank: () => heading('Heading'),
    render: passthrough(loose(Heading)),
  },
  {
    name: 'Paragraph',
    label: 'Paragraph',
    group: 'Text',
    textProp: 'content',
    spec: spec('Paragraph', [
      { name: 'content', kind: 'text' },
      { name: 'size', kind: 'enum', options: ['xs', 'sm', 'md', 'lg'], default: 'md' },
      { name: 'weight', kind: 'enum', options: ['regular', 'medium', 'bold'], default: 'regular' },
      ALIGN,
      { ...TONE, default: 'secondary' },
      { name: 'maxWidth', kind: 'number', doc: 'A ceiling on the line length, in pixels.' },
    ]),
    blank: () => paragraph(LOREM),
    render: passthrough(loose(Paragraph)),
  },
  {
    name: 'Plain',
    label: 'Plain text',
    group: 'Text',
    hint: 'A bare run of text, for somewhere a paragraph would be too much.',
    textProp: 'content',
    spec: spec('Plain', [{ name: 'content', kind: 'text' }]),
    blank: () => seed('Plain', { content: 'Text' }),
    render: passthrough(loose(Plain)),
  },
  {
    name: 'Label',
    label: 'Label',
    group: 'Text',
    hint: 'The small pill above a heading — Figma’s Label CTA.',
    textProp: 'children',
    spec: generated('Label'),
    blank: () => seed('Label', { children: 'Label', variant: 'gradient', size: 'sm' }),
    render: passthrough(loose(Label)),
  },

  /* ---------------------------------------------------------------- content */
  {
    name: 'Card',
    label: 'Card',
    group: 'Content',
    hint: 'One component with ten slots. Every card in the library is this with different slots filled.',
    spec: generated('Card'),
    blank: () => cardSeed(),
    render: passthrough(loose(Card)),
  },
  {
    name: 'Stat',
    label: 'Stat',
    group: 'Content',
    hint: 'A figure and its caption.',
    spec: generated('Stat'),
    blank: () =>
      seed('Stat', {}, { value: [seed('Plain', { content: '845' })], label: [seed('Plain', { content: 'Months to launch' })] }),
    render: passthrough(loose(Stat)),
  },
  {
    name: 'StatBar',
    label: 'Stat bar',
    group: 'Content',
    hint: 'A row of stats with rules between them.',
    spec: generated('StatBar'),
    blank: () => {
      const stat = (value: string, label: string) =>
        seed('Stat', {}, { value: [seed('Plain', { content: value })], label: [seed('Plain', { content: label })] })
      return seed('StatBar', {}, { children: [stat('845', 'Months to launch'), stat('98%', 'Uptime'), stat('3x', 'Faster releases')] })
    },
    render: passthrough(loose(StatBar)),
  },
  {
    name: 'List',
    label: 'List',
    group: 'Content',
    hint: 'Ticks, bullets or numbers.',
    spec: generated('List'),
    accepts: { children: ['ListItem'] },
    blank: () =>
      seed('List', {}, { children: [listItemSeed('The first point'), listItemSeed('The second point'), listItemSeed('The third point')] }),
    render: passthrough(loose(List)),
  },
  {
    name: 'ListItem',
    label: 'List item',
    group: 'Content',
    parentOnly: ['List'],
    spec: spec('ListItem', [
      { name: 'title', kind: 'text', doc: 'The semibold lead-in, from Figma’s `Show Header`.' },
      { name: 'children', kind: 'slot' },
    ]),
    textProp: 'title',
    blank: () => listItemSeed('A point'),
    render: ({ props, slot }) => <List.Item title={props.title as string}>{slot('children')}</List.Item>,
  },
  {
    name: 'Accordion',
    label: 'Accordion',
    group: 'Content',
    hint: 'Questions that open. Figma’s FAQ section.',
    spec: { ...generated('Accordion'), props: [...generated('Accordion').props, { name: 'children', kind: 'slot' }] },
    accepts: { children: ['AccordionItem'] },
    blank: () =>
      seed('Accordion', {}, { children: [accordionItemSeed('A question'), accordionItemSeed('Another question')] }),
    render: ({ props, slot }) => <Accordion {...props}>{slot('children')}</Accordion>,
  },
  {
    name: 'AccordionItem',
    label: 'Accordion item',
    group: 'Content',
    parentOnly: ['Accordion'],
    spec: spec('AccordionItem', [
      { name: 'question', kind: 'text' },
      { name: 'answer', kind: 'slot' },
    ]),
    textProp: 'question',
    blank: () => accordionItemSeed('A question'),
    /*
     * Mantine wants `Item > Control + Panel`, which is three nested components for what a designer
     * thinks of as one row with a question and an answer. Flattening it here means the layer tree
     * shows the row, not the plumbing.
     */
    render: ({ node, props, slot }) => (
      <Accordion.Item value={node.id}>
        <Accordion.Control>{(props.question as string) ?? 'Question'}</Accordion.Control>
        <Accordion.Panel>{slot('answer')}</Accordion.Panel>
      </Accordion.Item>
    ),
  },
  {
    name: 'Tabs',
    label: 'Tabs',
    group: 'Content',
    hint: 'A pill bar that swaps what is under it.',
    spec: { ...generated('Tabs'), props: [...generated('Tabs').props, { name: 'children', kind: 'slot' }] },
    accepts: { children: ['Tab'] },
    blank: () => seed('Tabs', { variant: 'pills' }, { children: [tabSeed('First'), tabSeed('Second')] }),
    /*
     * Tabs are the one component whose children are drawn in two places at once — every child
     * contributes a pill to the bar *and* a panel below it. So this reads the child nodes rather than
     * their rendered output, and places each one twice.
     */
    render: ({ props, children, renderNode }) => {
      const tabs = children('children')
      return (
        <Tabs {...props} defaultValue={tabs[0]?.id}>
          <Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.id} value={tab.id}>
                {(tab.props.label as string) ?? 'Tab'}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.id} value={tab.id} pt="24">
              {renderNode(tab.id)}
            </Tabs.Panel>
          ))}
        </Tabs>
      )
    },
  },
  {
    name: 'Tab',
    label: 'Tab',
    group: 'Content',
    parentOnly: ['Tabs'],
    spec: spec('Tab', [
      { name: 'label', kind: 'text', doc: 'What the pill says.' },
      { name: 'children', kind: 'slot', doc: 'What this tab shows.' },
    ]),
    textProp: 'label',
    blank: () => tabSeed('Tab'),
    /* The pill is drawn by the parent; a tab renders only its own panel contents. */
    render: ({ slot }) => <>{slot('children')}</>,
  },
  {
    name: 'Carousel',
    label: 'Carousel',
    group: 'Content',
    hint: 'A track of cards that scrolls sideways.',
    spec: generated('Carousel'),
    blank: () =>
      seed('Carousel', { label: 'Customer stories' }, { children: [cardSeed(), cardSeed(), cardSeed(), cardSeed()] }),
    render: passthrough(loose(Carousel)),
  },
  {
    name: 'Marquee',
    label: 'Logo marquee',
    group: 'Content',
    hint: 'A logo strip that scrolls on its own.',
    spec: generated('Marquee'),
    blank: () =>
      seed(
        'Marquee',
        { label: 'Customers' },
        { children: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'].map((name) => seed('Plain', { content: name })) },
      ),
    render: passthrough(loose(Marquee)),
  },
  {
    name: 'Form',
    label: 'Form',
    group: 'Content',
    hint: 'The sign-up card.',
    spec: generated('Form'),
    accepts: { title: INLINE, description: INLINE, children: ['FormRow'] },
    blank: () =>
      seed(
        'Form',
        {},
        {
          title: [seed('Plain', { content: 'Talk to us' })],
          description: [seed('Plain', { content: 'We answer within a day.' })],
          children: [
            seed('FormRow', {}, { children: [seed('TextInput', { label: 'Your name' })] }),
            seed('FormRow', {}, { children: [seed('TextInput', { label: 'Work email' })] }),
          ],
          submit: [seed('Button', { children: 'Send', fullWidth: true })],
        },
      ),
    render: passthrough(loose(Form)),
  },

  /* ---------------------------------------------------------------- media */
  {
    name: 'Image',
    label: 'Image',
    group: 'Media',
    hint: 'A picture at one of the library’s ratios.',
    spec: generated('Image'),
    blank: () => seed('Image', { alt: '', ratio: '3:2' }),
    /*
     * A card with an empty image slot renders as nothing, and a designer who has just dropped an image
     * in needs to see *where it went* before they have a file for it. So an image with no `src` draws
     * its own placeholder at the ratio it will really be.
     */
    render: ({ props }) => {
      const Picture = loose(Image)
      return <Picture {...props} src={props.src || PLACEHOLDER} alt={props.alt ?? ''} />
    },
  },
  {
    name: 'Icon',
    label: 'Icon',
    group: 'Media',
    hint: 'A UI glyph, inked in whatever it sits in.',
    spec: spec('Icon', [
      { name: 'name', kind: 'enum', options: iconNames, default: 'IconArrowRight' },
      { name: 'size', kind: 'number', doc: 'In pixels. Left alone, it scales with the text beside it.' },
    ]),
    blank: () => seed('Icon', { name: 'IconArrowRight' }),
    render: ({ props }) => {
      const Glyph = icons[(props.name as string) ?? 'IconArrowRight']
      if (!Glyph) return null
      const size = props.size as number | undefined
      return <Glyph {...(size ? { width: size, height: size } : {})} />
    },
  },
  {
    name: 'GlassIcon',
    label: 'Glass icon',
    group: 'Media',
    hint: 'One of the 64px illustrations, with its own gradient.',
    spec: spec('GlassIcon', [
      { name: 'name', kind: 'enum', options: glassNames, default: 'IconGlassComposable' },
      { name: 'size', kind: 'number', default: '40' },
    ]),
    blank: () => seed('GlassIcon', { name: 'IconGlassComposable', size: 40 }),
    render: ({ props }) => {
      const Glyph = icons[(props.name as string) ?? 'IconGlassComposable']
      if (!Glyph) return null
      const size = (props.size as number) ?? 40
      return <Glyph width={size} height={size} />
    },
  },
  {
    name: 'Logo',
    label: 'Logo',
    group: 'Media',
    spec: generated('Logo'),
    blank: () => seed('Logo', {}),
    render: passthrough(loose(Logo)),
  },

  /* ---------------------------------------------------------------- controls */
  {
    name: 'FormRow',
    label: 'Form row',
    group: 'Controls',
    parentOnly: ['Form'],
    hint: 'One or two fields side by side, stacking on a narrow card.',
    spec: spec('FormRow', [{ name: 'children', kind: 'slot' }]),
    blank: () => seed('FormRow', {}, { children: [seed('TextInput', { label: 'Your name' })] }),
    render: ({ slot }) => <Form.Row>{slot('children')}</Form.Row>,
  },
  {
    name: 'TextInput',
    label: 'Text field',
    group: 'Controls',
    spec: generated('TextInput'),
    blank: () => seed('TextInput', { label: 'Label', placeholder: '' }),
    render: passthrough(loose(TextInput)),
  },
  {
    name: 'Textarea',
    label: 'Text area',
    group: 'Controls',
    spec: generated('Textarea'),
    blank: () => seed('Textarea', { label: 'Label', minRows: 3 }),
    render: passthrough(loose(Textarea)),
  },
  {
    name: 'Select',
    label: 'Dropdown',
    group: 'Controls',
    spec: generated('Select'),
    blank: () => seed('Select', { label: 'Label', options: 'First\nSecond\nThird' }),
    /*
     * The one prop that is not passed straight through. A `Select`'s choices are an array and the
     * document holds only scalars, so they are edited as one per line — which is also the shape a
     * designer wants to type them in.
     */
    render: ({ props, slot }) => {
      const { options, ...rest } = props
      const Field = loose(Select)
      return (
        <Field
          {...rest}
          info={slot('info')}
          data={String(options ?? '')
            .split('\n')
            .map((option) => option.trim())
            .filter(Boolean)}
        />
      )
    },
  },
  {
    name: 'Button',
    label: 'Button',
    group: 'Controls',
    textProp: 'children',
    spec: generated('Button'),
    blank: () => seed('Button', { children: 'Get started' }),
    render: passthrough(loose(Button)),
  },
  {
    name: 'Link',
    label: 'Link',
    group: 'Controls',
    textProp: 'children',
    spec: generated('Link'),
    blank: () => seed('Link', { children: 'Read more', href: '#' }),
    render: passthrough(loose(Link)),
  },
  {
    name: 'Chip',
    label: 'Chip',
    group: 'Controls',
    textProp: 'children',
    spec: generated('Chip'),
    blank: () => seed('Chip', { children: 'Filter' }),
    render: passthrough(loose(Chip)),
  },
]

/* ------------------------------------------------------------------ shared seeds */

/**
 * A neutral grey field at the right ratio. Inline SVG rather than a hosted file, so a page renders
 * the same offline, in a fresh clone, and inside the Worker.
 */
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
     <rect width="600" height="400" fill="#2a2d33"/>
     <path d="M0 400 240 180l130 120 90-70 140 120z" fill="#3a3e46"/>
     <circle cx="150" cy="110" r="46" fill="#3a3e46"/>
   </svg>`,
)}`

function headerSeed(): Seed {
  return seed(
    'Header',
    { position: 'static' },
    {
      logo: [seed('Logo', { height: 40 })],
      items: NAV.map((label) => seed('NavItem', { label, href: '#' })),
      actions: [
        seed(
          'Row',
          { gap: 12 },
          {
            children: [
              seed('Link', { children: 'Sign in', href: '#', variant: 'secondary' }),
              seed('Button', { children: 'Book a demo', size: 'sm' }),
            ],
          },
        ),
      ],
    },
  )
}

function footerColumnSeed(title: string, links: string[]): Seed {
  return seed(
    'FooterColumn',
    { title },
    { children: links.map((label) => seed('FooterLink', { children: label, href: '#' })) },
  )
}

function footerSeed(): Seed {
  return seed(
    'Footer',
    {},
    {
      brand: [
        seed(
          'FooterBrand',
          {},
          {
            logo: [seed('Logo', { height: 40 })],
            address: [seed('Plain', { content: '1400 Montefino Avenue, Diamond Bar, CA 91765' })],
          },
        ),
      ],
      children: FOOTER_COLUMNS.map(([title, links]) => footerColumnSeed(title, links)),
      legal: [seed('Plain', { content: '© Liferay, Inc. All rights reserved.' })],
    },
  )
}

function sectionTitleSeed(): Seed {
  return seed(
    'SectionTitle',
    {},
    {
      title: [seed('Plain', { content: 'Section title' })],
      description: [seed('Plain', { content: LOREM })],
    },
  )
}

function cardSeed(): Seed {
  return seed(
    'Card',
    {},
    {
      hero: [seed('GlassIcon', { name: 'IconGlassComposable', size: 40 })],
      title: [heading('Card title', { level: 'h3' })],
      description: [paragraph('One or two lines about what this is.')],
    },
  )
}

function listItemSeed(title: string): Seed {
  return seed('ListItem', { title }, { children: [seed('Plain', { content: 'A short description.' })] })
}

function accordionItemSeed(question: string): Seed {
  return seed('AccordionItem', { question }, { answer: [paragraph(LOREM)] })
}

function tabSeed(label: string): Seed {
  return seed(
    'Tab',
    { label },
    { children: [seed('Stack', {}, { children: [heading(`${label} heading`, { level: 'h3' }), paragraph(LOREM)] })] },
  )
}

/* ------------------------------------------------------------------ lookups */

export const REGISTRY: Record<string, Entry> = Object.fromEntries(
  entries.map((entry) => [entry.name, entry]),
)

export const entryFor = (component: string): Entry | undefined => REGISTRY[component]

/** The palette, grouped, with the subcomponents left out — they are offered by their parent's slot. */
export const PALETTE: { group: Group; entries: Entry[] }[] = (
  ['Structure', 'Text', 'Content', 'Media', 'Controls'] as Group[]
).map((group) => ({
  group,
  entries: entries.filter((entry) => entry.group === group && !entry.parentOnly),
}))

/** The slots a component has, in the order the catalogue lists them. */
export const slotsOf = (component: string): PropSpec[] =>
  entryFor(component)?.spec.props.filter((prop) => prop.kind === 'slot') ?? []

/** The props that get a control, which is everything that is not a slot. */
export const controlsOf = (component: string): PropSpec[] =>
  entryFor(component)?.spec.props.filter((prop) => prop.kind !== 'slot') ?? []

/** What may be dropped into a given slot. `null` means anything that is not a subcomponent. */
export function accepted(component: string, slot: string): string[] | null {
  const entry = entryFor(component)
  const only = entry?.accepts?.[slot]
  if (only) return only
  return null
}

/** Whether `child` is allowed in `parent`'s `slot`. */
export function allowedIn(parent: string | null, slot: string, child: string): boolean {
  const entry = child ? entryFor(child) : undefined
  if (!entry) return false

  if (parent === null) return !entry.parentOnly
  const only = accepted(parent, slot)
  if (only) return only.includes(child)
  return !entry.parentOnly
}

export { humanise }
