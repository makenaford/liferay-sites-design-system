/**
 * The Storybook stories, as things a designer can pick.
 *
 * A story is already the answer to "what does a good `Card` look like" — someone wrote `Resource`,
 * `CustomerQuote` and `Icon-Center` against the Figma file and they are checked on every commit. This
 * turns each one into a preset: choose it in the inspector and the component arrives filled in, with
 * the same props and the same content the story renders.
 *
 * ## Why it reads element trees rather than source
 *
 * The obvious approach is to parse the story files, and it is the wrong one. A story is full of
 * `FAQ.map(…)`, `index === 2 ? … : …`, `{...args}` and helper components, so a static reader has to
 * become a small JavaScript interpreter and will still be defeated by the next story someone writes.
 *
 * Calling `render(args)` instead hands back a **React element tree** — plain data, with every `map`
 * already expanded, every ternary already decided and every spread already merged. What is left is a
 * translation between two trees, which is a job with an end to it.
 *
 * ## What does not become a preset
 *
 * Plenty, deliberately. Half the stories are demonstration matrices — `Sizes` draws both sizes side by
 * side, `Matrix` draws twelve buttons — and those are not things anyone wants dropped onto a page. The
 * test is structural rather than a list of names to skip: **a preset is a story that renders exactly
 * one of the component it documents.** A story whose root is a `Stack` of three accordions fails it,
 * a story whose root is a `Card` inside a sizing `Box` passes.
 *
 * A story is also skipped when it contains something with no equivalent here — a bare `<div>` with
 * layout, a component the palette does not carry. Skipping is silent to the designer and visible to a
 * developer through `unsupportedPresets`, because the fix is either a translation rule here or a
 * component in the registry, and both are worth knowing about.
 */
import { Fragment, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import { Box, Group, SimpleGrid, Stack as MantineStack, Text, Title } from '@mantine/core'
import * as library from '../index'
import * as allIcons from '../icons'
import type { PropValue } from './document'
import { entryFor, seed, type Seed } from './registry'

/* ------------------------------------------------------------------ naming the components */

/**
 * Every React component the palette knows, keyed by the component itself.
 *
 * Keyed by reference rather than by name, because that is what an element carries: `element.type` is
 * the `Card` function, and its `.name` after minification is `t`.
 */
const NAMES = new Map<unknown, string>()

for (const [name, exported] of Object.entries(library)) {
  if (entryFor(name)) NAMES.set(exported, name)
}

/** The icon sets, which are components too — `IconArrowRight` becomes an `Icon` node named for it. */
const ICON_NAMES = new Map<unknown, string>()
for (const [name, exported] of Object.entries(allIcons)) {
  if (name.startsWith('Icon') && typeof exported === 'function') ICON_NAMES.set(exported, name)
}

/**
 * Mantine's primitives, mapped onto the builder's own.
 *
 * Stories reach for these constantly for arrangement — a `Group` of buttons, a `SimpleGrid` of cards —
 * and the builder has the same three under different names.
 */
const PRIMITIVES = new Map<unknown, string>([
  [Group, 'Row'],
  [MantineStack, 'Stack'],
  [SimpleGrid, 'Grid'],
  [Text, 'Paragraph'],
  [Title, 'Heading'],
])

/** Wrappers a story uses for sizing and nothing else, which are unwrapped rather than translated. */
const TRANSPARENT = new Set<unknown>([Box])

/* ------------------------------------------------------------------ walking the tree */

/** Thrown for anything with no equivalent. Aborts the story, never the whole extraction. */
class Untranslatable extends Error {}

const elements = (children: ReactNode): ReactElement[] => {
  const out: ReactElement[] = []
  const walk = (node: ReactNode) => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (isValidElement(node)) out.push(node)
  }
  walk(children)
  return out
}

/** The plain text of a subtree — a heading's words, a button's label. */
function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children)
  return ''
}

const hasElements = (node: ReactNode) => elements(node).length > 0

/* ------------------------------------------------------------------ the compound components */

/*
 * The three the builder deliberately flattens. A story writes Mantine's real shape —
 * `Accordion.Item > Accordion.Control + Accordion.Panel` — and the builder's `AccordionItem` has a
 * `question` and an `answer`, so the translation has to go back through the same flattening that
 * `registry.tsx` performs in the other direction.
 */
const COMPOUND = new Map<unknown, (element: ReactElement) => Seed>([
  [
    library.Accordion.Item,
    (element) => {
      const parts = elements((element.props as { children?: ReactNode }).children)
      const control = parts.find((part) => part.type === library.Accordion.Control)
      const panel = parts.find((part) => part.type === library.Accordion.Panel)

      return seed(
        'AccordionItem',
        { question: textOf((control?.props as { children?: ReactNode })?.children) },
        { answer: expand((panel?.props as { children?: ReactNode })?.children) },
      )
    },
  ],
  /*
   * Mantine draws a tab twice — once as a pill in `Tabs.List`, once as a `Tabs.Panel` below — joined
   * by `value`. The builder has one `Tab` node carrying both, so the two halves are matched back up
   * here. This is the same flattening `registry.tsx` performs in the other direction, and it has to
   * agree with it.
   *
   * It also has to exist for a second reason: `Tabs.List` and `Tabs.Panel` read Mantine's context, so
   * the fallback of calling an unrecognised component throws on them. Without this the whole
   * `Tabbed Content` block was lost.
   */
  [
    library.Tabs,
    (element) => {
      const props = element.props as { children?: ReactNode }
      const parts = elements(props.children)

      const list = parts.find((part) => part.type === library.Tabs.List)
      const panels = parts.filter((part) => part.type === library.Tabs.Panel)

      const children = elements((list?.props as { children?: ReactNode })?.children).map((tab) => {
        const value = (tab.props as { value?: string }).value
        const panel = panels.find((candidate) => (candidate.props as { value?: string }).value === value)

        return seed(
          'Tab',
          { label: textOf((tab.props as { children?: ReactNode }).children) },
          { children: expand((panel?.props as { children?: ReactNode })?.children) },
        )
      })

      // The scalar props only — `children` is handled above, and reading it twice would run the
      // context-dependent parts through the generic path that cannot cope with them.
      const { props: kept } = readProps('Tabs', {
        ...element,
        props: { ...(element.props as object), children: undefined },
      } as ReactElement)

      return seed('Tabs', kept, { children })
    },
  ],
  /*
   * The header's nav arrives as `items={[{ value, label, menu }]}` — data, not elements — so it is read
   * into `NavItem` nodes rather than translated as children. The `menu` on each one is a whole mega
   * menu panel, which the palette does not carry; dropping it leaves the item as the plain link it
   * would have been anyway.
   */
  [
    library.Header,
    (element) => {
      const props = element.props as {
        items?: { value?: string; label?: ReactNode; href?: string }[]
        logo?: ReactNode
        actions?: ReactNode
      }

      const { props: kept } = readProps('Header', {
        ...element,
        props: { ...(element.props as object), items: undefined, logo: undefined, actions: undefined },
      } as ReactElement)

      return seed('Header', kept, {
        logo: expand(props.logo),
        actions: expand(props.actions),
        items: (props.items ?? []).map((item) =>
          seed('NavItem', { label: textOf(item.label) || 'Section', href: item.href ?? '#' }),
        ),
      })
    },
  ],
  [
    library.Footer.Column,
    (element) => {
      const props = element.props as { title?: ReactNode; children?: ReactNode }
      return seed('FooterColumn', { title: textOf(props.title) }, { children: expand(props.children) })
    },
  ],
  [
    library.Footer.Link,
    (element) => {
      const props = element.props as { href?: string; children?: ReactNode }
      return seed('FooterLink', { children: textOf(props.children), href: props.href ?? '#' })
    },
  ],
  [
    library.Footer.Brand,
    (element) => {
      const props = element.props as { logo?: ReactNode; address?: ReactNode; social?: ReactNode }
      return seed(
        'FooterBrand',
        {},
        { logo: expand(props.logo), address: expand(props.address), social: expand(props.social) },
      )
    },
  ],
  [
    library.Form.Row,
    (element) =>
      seed('FormRow', {}, { children: expand((element.props as { children?: ReactNode }).children) }),
  ],
  [
    library.List.Item,
    (element) => {
      const props = element.props as { title?: ReactNode; children?: ReactNode }
      return seed(
        'ListItem',
        { title: textOf(props.title) },
        { children: expand(props.children) },
      )
    },
  ],
])

/* ------------------------------------------------------------------ props */

/** Mantine writes spacing as `gap="16"`; the builder's own primitives take a number. */
const asNumber = (value: unknown): number | undefined => {
  const parsed = typeof value === 'string' ? Number(value) : value
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Reads a story element's props into a node's props and slots, guided by the catalogue.
 *
 * The catalogue is what makes this safe rather than a free-for-all: a prop is carried across only if
 * the component declares it, with a kind the document can hold. Everything else a story sets — `w`,
 * `style`, `key`, a `component="a"` polymorphic escape — is dropped, which is the same rule the
 * inspector enforces when a designer edits by hand.
 */
function readProps(name: string, element: ReactElement): { props: Record<string, PropValue>; slots: Record<string, Seed[]> } {
  const entry = entryFor(name)
  const source = element.props as Record<string, unknown>
  const props: Record<string, PropValue> = {}
  const slots: Record<string, Seed[]> = {}

  for (const spec of entry?.spec.props ?? []) {
    const value = source[spec.name]
    if (value === undefined || value === null) continue

    if (spec.kind === 'slot') {
      /*
       * A slot holding only words becomes one text node rather than an empty slot: `title="Card
       * Title"` in a story has to arrive as something a designer can click on the canvas and retype.
       */
      if (hasElements(value as ReactNode)) {
        const children = expand(value as ReactNode)
        if (children.length) slots[spec.name] = children
      } else {
        const text = textOf(value as ReactNode)
        if (text.trim()) slots[spec.name] = [seed('Plain', { content: text })]
      }
      continue
    }

    if (spec.name === entry?.textProp) {
      const text = textOf(value as ReactNode)
      if (text.trim()) props[spec.name] = text
      continue
    }

    if (spec.kind === 'number') {
      const parsed = asNumber(value)
      if (parsed !== undefined) props[spec.name] = parsed
      continue
    }
    if (spec.kind === 'boolean' && typeof value === 'boolean') props[spec.name] = value
    if (spec.kind === 'text' && typeof value === 'string') props[spec.name] = value
    if (spec.kind === 'enum' && typeof value === 'string' && spec.options?.includes(value)) {
      props[spec.name] = value
    }
  }

  return { props, slots }
}

/* ------------------------------------------------------------------ one element */

/**
 * One story element, as nodes.
 *
 * Returns a **list**, because the mapping is not one to one. A fragment holds several things and is
 * not itself anything; a helper component defined in the story file stands for whatever it renders,
 * which may also be several things. Making the return type plural is what lets both of those be
 * ordinary cases rather than failures — the first version returned a single node and skipped every
 * story containing a `<>`.
 */
function convert(element: ReactElement, depth = 0): Seed[] {
  const type = element.type
  const props = element.props as Record<string, unknown>

  if (type === Fragment) return expand(props.children as ReactNode, depth)

  const compound = COMPOUND.get(type)
  if (compound) return [compound(element)]

  const icon = ICON_NAMES.get(type)
  if (icon) {
    const size = asNumber(props.width)
    return [
      seed(icon.startsWith('IconGlass') ? 'GlassIcon' : 'Icon', {
        name: icon,
        ...(size ? { size } : {}),
      }),
    ]
  }

  if (TRANSPARENT.has(type)) {
    /*
     * The test is for **element** children, not for anything the children convert to. Testing the
     * converted result instead is wrong in a way that hides itself: a box holding only the words
     * "Product shot" converts to one text node, which is not nothing, so the wrapper unwrapped to text
     * and the placeholder handling below was never reached.
     */
    if (elements(props.children as ReactNode).length) return expand(props.children as ReactNode, depth)

    const text = textOf(props.children as ReactNode)
    if (!text.trim()) throw new Untranslatable('an empty layout wrapper')

    /*
     * A `Box` with a fixed height holding a word or two is a story author drawing a picture they did
     * not have — the hero's `Product shot`, a card's customer logo. It becomes an `Image` with no
     * source, which draws the builder's own placeholder at the right shape and can be given a real
     * file in one field. Read as text instead, it arrives as the words "Product shot" sitting in a
     * media column, which looks like a mistake rather than a placeholder.
     */
    const sized = props.h ?? props.height ?? props.mih
    if (sized !== undefined) return [seed('Image', { alt: text, ratio: 'auto', fit: 'cover' })]

    // Otherwise it is a text container — the logo panel a card story uses.
    return [seed('Plain', { content: text })]
  }

  /*
   * An inline `<svg>` — the logos a marquee story draws by hand — is turned into an `Image` whose
   * source is the SVG itself, serialised into a data URI. It renders identically, it is one node
   * instead of forty, and it is a thing the palette already has. The alternative was to skip every
   * story containing one, which cost the integrations and customer-story blocks.
   */
  if (type === 'svg') {
    const markup = renderToStaticMarkup(element)
    return [
      seed('Image', {
        src: `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`,
        alt: typeof props['aria-label'] === 'string' ? (props['aria-label'] as string) : '',
        fit: 'contain',
        ratio: 'auto',
      }),
    ]
  }

  /*
   * A bare `div` or `span` in a story is arrangement, not design — the same role `Box` plays. Treated
   * the same way: unwrapped to its children, or read as text when that is all it holds.
   */
  if (type === 'div' || type === 'span') {
    if (elements(props.children as ReactNode).length) return expand(props.children as ReactNode, depth)
    const text = textOf(props.children as ReactNode)
    return text.trim() ? [seed('Plain', { content: text })] : []
  }

  /*
   * A raw `<a>` — the social icons a footer story writes by hand — is the library's `Link`. Text
   * inside it becomes the label; an icon inside it becomes the leading section, which is where a
   * `Link` puts a glyph and how it ends up drawn the same way.
   */
  if (type === 'a') {
    const inner = expand(props.children as ReactNode, depth)
    const text = textOf(props.children as ReactNode)
    const label = elements(props.children as ReactNode).length ? '' : text

    return [
      seed(
        'Link',
        {
          href: typeof props.href === 'string' ? props.href : '#',
          ...(label ? { children: label } : {}),
        },
        label ? {} : { leftSection: inner },
      ),
    ]
  }

  // A plain paragraph in a story panel is the builder's `Paragraph`.
  if (type === 'p') return [seed('Paragraph', { content: textOf(props.children as ReactNode) })]
  if (typeof type === 'string' && /^h[1-6]$/.test(type)) {
    return [seed('Heading', { content: textOf(props.children as ReactNode), level: type })]
  }

  const name = NAMES.get(type) ?? PRIMITIVES.get(type)

  /*
   * A component the palette does not have, defined in the story file itself — `Cover`, `Shot`,
   * `GartnerProof`, the little helpers a story writes so its examples read cleanly. They are plain
   * functions of their props, so calling one gives back the elements it would have rendered, and those
   * *are* translatable.
   *
   * This is the one place the conversion executes story code rather than reading it. A helper that
   * uses a hook throws — React refuses to run one outside a render — and the story is skipped, which is
   * the correct outcome: a component with state is not a preset.
   */
  if (!name) {
    if (typeof type === 'function' && depth < 8) {
      return expand((type as (props: unknown) => ReactNode)(props), depth + 1)
    }
    throw new Untranslatable(`no equivalent for ${describe(type)}`)
  }

  const { props: kept, slots } = readProps(name, element)

  /*
   * A `Select`'s choices are a `data` array in the story and one-per-line text in the builder, for the
   * reason given in `registry.tsx`. The translation is here rather than there because it is a fact
   * about reading Mantine's shape, not about drawing the builder's.
   */
  if (name === 'Select' && Array.isArray(props.data)) {
    kept.options = (props.data as unknown[])
      .map((option) =>
        typeof option === 'string' ? option : String((option as { label?: unknown })?.label ?? ''),
      )
      .filter(Boolean)
      .join('\n')
  }

  /*
   * `children` is a slot for most components and the label for a few. `readProps` has already taken
   * the label case; this is the rest, and it is done here rather than there because a component whose
   * catalogue entry has no `children` prop — `Row`, `Grid` — still has children in the story.
   */
  if (!slots.children && !kept.children) {
    const children = expand(props.children as ReactNode)
    if (children.length) slots.children = children
  }

  // Mantine's `SimpleGrid` names its column count `cols`; the builder's `Grid` calls it `columns`.
  if (name === 'Grid' && kept.columns === undefined) {
    const columns = asNumber(props.cols)
    if (columns !== undefined) kept.columns = columns
  }

  if (name === 'Heading' && kept.level === undefined) {
    const order = asNumber(props.order)
    if (order) kept.level = `h${order}`
  }

  if ((name === 'Paragraph' || name === 'Heading') && !slots.children && kept.content === undefined) {
    const text = textOf(props.children as ReactNode)
    if (text.trim()) kept.content = text
  }

  return [seed(name, kept, slots)]
}

const describe = (type: unknown) =>
  typeof type === 'string' ? `<${type}>` : ((type as { name?: string })?.name ?? 'a component')

function expand(children: ReactNode, depth = 0): Seed[] {
  const out: Seed[] = []

  for (const child of arrayOf(children)) {
    if (typeof child === 'string' || typeof child === 'number') {
      const text = String(child)
      if (text.trim()) out.push(seed('Plain', { content: text }))
      continue
    }
    if (isValidElement(child)) out.push(...convert(child, depth))
  }

  return out
}

function arrayOf(children: ReactNode): ReactNode[] {
  if (children === null || children === undefined || typeof children === 'boolean') return []
  if (Array.isArray(children)) return children.flatMap(arrayOf)
  return [children]
}

/* ------------------------------------------------------------------ finding a story's root */

/**
 * The single instance a story renders, if it renders exactly one.
 *
 * Descends through wrappers that hold one child — the `Box w={320}` a card story uses to give itself a
 * realistic width — and stops at the first thing that is a component the palette carries. Anything
 * that branches on the way down is a demonstration rather than a preset.
 *
 * `target` is the component the story file says it documents, and it is **optional**: the section
 * blocks in `Blocks.stories.tsx` set no `component` on their meta, because a block is a `Section`
 * holding something else and the file is about the arrangement rather than about one component. With
 * no target the root is whatever the story turns out to render, which is the same answer arrived at
 * from the other end.
 */
function rootOf(node: ReactNode, target?: unknown): ReactElement | null {
  const found = elements(node)

  /*
   * One of the things at this level is the component, and only one. The header stories render
   * `<><Header/><PageBelow/></>` — a page's worth of scaffolding beside the header, so that a *fixed*
   * header has something to sit over — and the header is still unambiguously what the story is about.
   *
   * Two matches is a demonstration and gives up, which is what keeps `Variants` and `Matrix` out.
   */
  const matching = found.filter((element) =>
    target ? element.type === target : NAMES.has(element.type),
  )
  if (matching.length) return matching.length === 1 ? matching[0] : null

  // Otherwise descend, but only through a single wrapper — a story's sizing `Box`, or a fragment.
  if (found.length !== 1) return null

  const [element] = found
  const wrapper =
    TRANSPARENT.has(element.type) || PRIMITIVES.has(element.type) || element.type === Fragment
  if (!wrapper) return null

  return rootOf((element.props as { children?: ReactNode }).children, target)
}

/* ------------------------------------------------------------------ the extraction */

export interface Preset {
  /** The story's export name, spaced out — `WithIcon` becomes `With icon`. */
  label: string
  /** The story's doc comment, when it has one. */
  hint?: string
  build: () => Seed
}

interface StoryModule {
  default?: { component?: unknown; args?: Record<string, unknown>; title?: string }
  [name: string]: unknown
}

/*
 * Relative, not rooted. The builder's Vite root is `src/builder`, so a pattern beginning with `/`
 * would look under `src/builder/src/…` and match nothing — silently, which is how this first shipped
 * with an empty preset list and no error anywhere.
 */
const modules = {
  ...import.meta.glob<StoryModule>('../components/**/*.stories.tsx', { eager: true }),
  /*
   * The section blocks — Figma's fourteen `Section` cells, each a `Section` holding one of the
   * library's components. They are the presets that matter most for a page: `Card Grid`, `FAQ`,
   * `Integrations`, `Tabbed Content` are what somebody actually wants to drop in, and every one of
   * them is several components deep with content already written.
   */
  ...import.meta.glob<StoryModule>('../blocks/*.stories.tsx', { eager: true }),
}

/** `WithIcon` -> `With icon`. `OneAtATime` -> `One at a time`. */
const spaced = (name: string) =>
  name
    // A run of capitals followed by a lowercase word starts a new word: `ATime` is `A Time`.
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^./, (character) => character.toUpperCase())

const presets = new Map<string, Preset[]>()

/** Stories that could not be translated, and why. Surfaced in the inspector for a developer to read. */
export const unsupportedPresets: { story: string; reason: string }[] = []

for (const [path, module] of Object.entries(modules)) {
  const meta = module.default
  const target = meta?.component

  // A file that names a component it does not carry — nothing here can belong to the palette.
  if (target && !NAMES.has(target)) continue

  for (const [exported, story] of Object.entries(module)) {
    if (exported === 'default' || !story || typeof story !== 'object') continue

    const { args = {}, render } = story as {
      args?: Record<string, unknown>
      render?: (args: Record<string, unknown>) => ReactNode
    }
    const merged = { ...meta?.args, ...args }

    try {
      /*
       * A story with no `render` is Storybook's default: the component itself, with the args. Written
       * out here rather than called, because `createElement` would need the component and this needs
       * only its props — and the props are the whole of what such a story says.
       */
      const element = render
        ? rootOf(render(merged), target)
        : target
          ? ({ type: target, props: merged } as ReactElement)
          : null

      if (!element) continue

      // With no `component` on the meta, the root is what says which component this is a preset for.
      const name = NAMES.get(element.type)
      if (!name) continue

      /*
       * Built once here and thrown away, purely to prove it can be: a builder that throws when a
       * preset is chosen is worse than one that quietly offers fewer. The stored `build` runs the
       * conversion again on each use, because a `Seed` carries freshly minted node ids and two cards
       * from the same preset must not share them.
       */
      const proof = convert(element)
      if (proof.length !== 1) throw new Untranslatable(`rendered ${proof.length} roots`)

      presets.set(name, [
        ...(presets.get(name) ?? []),
        { label: spaced(exported), build: () => convert(element)[0] },
      ])
    } catch (error) {
      unsupportedPresets.push({
        story: `${path.split('/').pop()}: ${exported}`,
        reason: error instanceof Untranslatable ? error.message : String(error),
      })
    }
  }
}

export const presetsFor = (component: string): Preset[] => presets.get(component) ?? []
