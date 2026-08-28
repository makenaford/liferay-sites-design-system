/**
 * The page as React, for a developer to paste.
 *
 * A mock is only worth making if it can be built, and a screenshot cannot be built from — every
 * measurement has to be re-derived, and half of them come out wrong. What a developer wants is the
 * component names and the props, which is what the document already is: it stores catalogue names and
 * prop values, so this is a transcription rather than a translation.
 *
 * ## The part that is not a transcription
 *
 * Three of the builder's components are flattened versions of a compound API. A designer thinks of an
 * accordion row as "a question and an answer"; the library wants `Accordion.Item > Accordion.Control +
 * Accordion.Panel`. Emitting `<AccordionItem question="…">` would be honest about the document and
 * useless as code, because no such export exists. So those three are written out as the real nested
 * form, and `Tabs` — whose children are drawn twice, once as a pill and once as a panel — is
 * reassembled from its child nodes here exactly as it is in the renderer.
 *
 * Everything the output imports is either a genuine export of the package or is named in the header
 * comment with where it lives. Nothing is invented.
 *
 * ## Why it emits lines rather than strings
 *
 * The code panel highlights the lines belonging to whatever is selected on the canvas, and selects a
 * node when a line is clicked. That needs a node-id-to-line-range map, and a map is only obtainable if
 * the generator knows where each node landed — which a function returning a nested string does not.
 * So output is appended to a shared buffer in reading order, and each node records the range it
 * occupies on the way out.
 */
import type { PageDocument, PageNode, PropValue } from './document'
import { CATALOG } from './catalog.generated'
import { entryFor } from './registry'

/** The components that really are exports of the library. Icons are exported from it too. */
const LIBRARY = new Set(CATALOG.map((entry) => entry.name))

/**
 * The builder's own components, which are not in the library because they are not design decisions.
 * They are eight small files, and the header comment says where.
 */
const PRIMITIVES = new Set(['Heading', 'Paragraph', 'Stack', 'Row', 'Grid', 'Spacer', 'Plain'])

const quote = (value: string) => (value.includes("'") ? `"${value}"` : `'${value}'`)

/** `variant="filled"`, `columns={3}`, `interactive`. */
function attribute(name: string, value: PropValue): string {
  if (typeof value === 'boolean') return value ? name : `${name}={false}`
  if (typeof value === 'number') return `${name}={${value}}`
  return `${name}=${quote(value)}`
}

/* ------------------------------------------------------------------ the walk */

interface Context {
  doc: PageDocument
  seen: Set<string>
  /** Every name the output references, so the import lines can be written from what was used. */
  used: Set<string>
  out: Out
}

/** The buffer everything is written to, and the line ranges recorded against it. */
class Out {
  lines: string[] = []
  ranges: Record<string, [number, number]> = {}

  push(indent: number, text: string) {
    this.lines.push(`${'  '.repeat(indent)}${text}`)
  }

  /** The line a node's first line will be. Recorded before anything is written for it. */
  get next() {
    return this.lines.length + 1
  }

  record(id: string, start: number) {
    if (this.lines.length >= start) this.ranges[id] = [start, this.lines.length]
  }
}

const children = (ctx: Context, node: PageNode, slot: string): PageNode[] =>
  (node.slots[slot] ?? []).map((id) => ctx.doc.nodes[id]).filter(Boolean)

/**
 * The components whose builder shape is not their library shape.
 *
 * Consulted before the generic path, which is what keeps the generic path simple enough to be
 * obviously correct for the other seventeen.
 */
const COMPOUND: Record<string, (ctx: Context, node: PageNode, indent: number) => void> = {
  /* A bare string in the source, not an element — there is no `Plain` to import. */
  Plain: (ctx, node, indent) => ctx.out.push(indent, String(node.props.content ?? '')),

  Icon: (ctx, node, indent) => {
    const name = String(node.props.name ?? 'IconArrowRight')
    ctx.used.add(name)
    const size = node.props.size
    ctx.out.push(indent, `<${name}${size ? ` width={${size}} height={${size}}` : ''} />`)
  },

  GlassIcon: (ctx, node, indent) => {
    const name = String(node.props.name ?? 'IconGlassComposable')
    ctx.used.add(name)
    const size = Number(node.props.size ?? 40)
    ctx.out.push(indent, `<${name} width={${size}} height={${size}} />`)
  },

  /*
   * The header's nav is a list of objects, not of elements, so it is written as the array literal the
   * component actually takes. The node ids become the `value`s, exactly as they do on the canvas —
   * they are what ties a trigger to its panel, and any stable string will do.
   */
  Header: (ctx, node, indent) => {
    ctx.used.add('Header')
    const items = (node.slots.items ?? []).map((id) => ctx.doc.nodes[id]).filter(Boolean)

    const attributes = Object.entries(node.props).map(([name, value]) => attribute(name, value))
    ctx.out.push(indent, '<Header')
    for (const a of attributes) ctx.out.push(indent + 1, a)

    for (const [slot, ids] of Object.entries(node.slots)) {
      if (slot === 'items' || !ids.length) continue
      ctx.out.push(indent + 1, `${slot}={`)
      for (const child of ids) emit(ctx, child, indent + 2)
      ctx.out.push(indent + 1, '}')
    }

    if (items.length) {
      ctx.out.push(indent + 1, 'items={[')
      for (const item of items) {
        const href = item.props.href ? `, href: ${quote(String(item.props.href))}` : ''
        ctx.out.push(
          indent + 2,
          `{ value: ${quote(item.id)}, label: ${quote(String(item.props.label ?? 'Section'))}${href} },`,
        )
      }
      ctx.out.push(indent + 1, ']}')
    }

    ctx.out.push(indent, '/>')
  },

  FooterColumn: (ctx, node, indent) => {
    ctx.used.add('Footer')
    const title = node.props.title ? ` title=${quote(String(node.props.title))}` : ''
    const inner = node.slots.children ?? []
    if (!inner.length) return ctx.out.push(indent, `<Footer.Column${title} />`)

    ctx.out.push(indent, `<Footer.Column${title}>`)
    for (const child of inner) emit(ctx, child, indent + 1)
    ctx.out.push(indent, '</Footer.Column>')
  },

  FooterLink: (ctx, node, indent) => {
    ctx.used.add('Footer')
    const href = quote(String(node.props.href ?? '#'))
    ctx.out.push(indent, `<Footer.Link href=${href}>${String(node.props.children ?? '')}</Footer.Link>`)
  },

  FooterBrand: (ctx, node, indent) => {
    ctx.used.add('Footer')
    const slots = Object.entries(node.slots).filter(([, ids]) => ids.length)
    if (!slots.length) return ctx.out.push(indent, '<Footer.Brand />')

    ctx.out.push(indent, '<Footer.Brand')
    for (const [slot, ids] of slots) {
      ctx.out.push(indent + 1, `${slot}={`)
      for (const child of ids) emit(ctx, child, indent + 2)
      ctx.out.push(indent + 1, '}')
    }
    ctx.out.push(indent, '/>')
  },

  /* Drawn by the header from its `items`, so it contributes nothing of its own here. */
  NavItem: () => {},

  FormRow: (ctx, node, indent) => {
    ctx.used.add('Form')
    const inner = node.slots.children ?? []
    if (!inner.length) return ctx.out.push(indent, '<Form.Row />')

    ctx.out.push(indent, '<Form.Row>')
    for (const child of inner) emit(ctx, child, indent + 1)
    ctx.out.push(indent, '</Form.Row>')
  },

  ListItem: (ctx, node, indent) => {
    ctx.used.add('List')
    const title = node.props.title ? ` title=${quote(String(node.props.title))}` : ''
    const inner = node.slots.children ?? []

    if (!inner.length) return ctx.out.push(indent, `<List.Item${title} />`)

    ctx.out.push(indent, `<List.Item${title}>`)
    for (const child of inner) emit(ctx, child, indent + 1)
    ctx.out.push(indent, '</List.Item>')
  },

  AccordionItem: (ctx, node, indent) => {
    ctx.used.add('Accordion')
    ctx.out.push(indent, `<Accordion.Item value=${quote(node.id)}>`)
    ctx.out.push(indent + 1, `<Accordion.Control>${String(node.props.question ?? 'Question')}</Accordion.Control>`)
    ctx.out.push(indent + 1, '<Accordion.Panel>')
    for (const child of node.slots.answer ?? []) emit(ctx, child, indent + 2)
    ctx.out.push(indent + 1, '</Accordion.Panel>')
    ctx.out.push(indent, '</Accordion.Item>')
  },

  /*
   * Reassembled rather than transcribed: a tab contributes a pill to the bar *and* a panel below it,
   * so each child is written out twice, joined by `value`. This mirrors `registry.tsx` exactly — the
   * two have to agree, because one is what the designer approved and the other is what gets built.
   */
  Tabs: (ctx, node, indent) => {
    ctx.used.add('Tabs')
    const tabs = children(ctx, node, 'children')
    const attributes = Object.entries(node.props).map(([name, value]) => attribute(name, value))
    if (tabs[0]) attributes.push(`defaultValue=${quote(tabs[0].id)}`)

    openTag(ctx, 'Tabs', attributes, indent, false)
    ctx.out.push(indent + 1, '<Tabs.List>')
    for (const tab of tabs) {
      ctx.out.push(indent + 2, `<Tabs.Tab value=${quote(tab.id)}>${String(tab.props.label ?? 'Tab')}</Tabs.Tab>`)
    }
    ctx.out.push(indent + 1, '</Tabs.List>')

    for (const tab of tabs) {
      ctx.out.push(indent + 1, `<Tabs.Panel value=${quote(tab.id)} pt="24">`)
      emit(ctx, tab.id, indent + 2)
      ctx.out.push(indent + 1, '</Tabs.Panel>')
    }
    ctx.out.push(indent, '</Tabs>')
  },
}

/** `<Tag>` on one line when it is short, or one attribute per line when it is not. */
function openTag(ctx: Context, tag: string, attributes: string[], indent: number, selfClose: boolean) {
  if (attributes.length <= 1) {
    const one = attributes.length ? ` ${attributes[0]}` : ''
    return ctx.out.push(indent, selfClose ? `<${tag}${one} />` : `<${tag}${one}>`)
  }

  ctx.out.push(indent, `<${tag}`)
  for (const attribute of attributes) ctx.out.push(indent + 1, attribute)
  ctx.out.push(indent, selfClose ? '/>' : '>')
}

/** Everything that is not a compound: props straight out, slots as JSX-valued attributes. */
function generic(ctx: Context, node: PageNode, indent: number) {
  const entry = entryFor(node.component)
  const tag = node.component
  ctx.used.add(tag)

  const attributes = Object.entries(node.props)
    .filter(([name]) => entry?.textProp !== name)
    .map(([name, value]) => attribute(name, value))

  const text = entry?.textProp ? node.props[entry.textProp] : undefined
  const slots = Object.entries(node.slots).filter(([name, ids]) => name !== 'children' && ids.length)
  const inner = node.slots.children ?? []
  const hasBody = inner.length > 0 || (text !== undefined && String(text) !== '')

  if (!slots.length) {
    openTag(ctx, tag, attributes, indent, !hasBody)
  } else {
    /*
     * Slots are props whose value is JSX — `title={<Heading …/>}`, which is how the library is
     * actually used. Written across lines rather than inline so that a nested component still gets
     * lines of its own, and therefore a range the panel can highlight.
     */
    ctx.out.push(indent, `<${tag}`)
    for (const attribute of attributes) ctx.out.push(indent + 1, attribute)

    for (const [name, ids] of slots) {
      ctx.out.push(indent + 1, `${name}={`)
      const fragment = ids.length > 1
      if (fragment) ctx.out.push(indent + 2, '<>')
      for (const child of ids) emit(ctx, child, indent + (fragment ? 3 : 2))
      if (fragment) ctx.out.push(indent + 2, '</>')
      ctx.out.push(indent + 1, '}')
    }

    ctx.out.push(indent, hasBody ? '>' : '/>')
  }

  if (!hasBody) return

  if (text !== undefined && String(text) !== '') ctx.out.push(indent + 1, String(text))
  for (const child of inner) emit(ctx, child, indent + 1)
  ctx.out.push(indent, `</${tag}>`)
}

function emit(ctx: Context, id: string, indent: number) {
  const node = ctx.doc.nodes[id]
  if (!node || ctx.seen.has(id)) return

  const scoped: Context = { ...ctx, seen: new Set(ctx.seen).add(id) }
  const start = ctx.out.next

  const compound = COMPOUND[node.component]
  if (compound) compound(scoped, node, indent)
  else generic(scoped, node, indent)

  ctx.out.record(id, start)
}

/* ------------------------------------------------------------------ the file */

export interface Handoff {
  text: string
  /** Node id -> its first and last line, 1-based. What links the panel to the canvas. */
  lines: Record<string, [number, number]>
}

/** The whole page, with its imports, ready to paste. */
export function handoff(doc: PageDocument): Handoff {
  const ctx: Context = { doc, seen: new Set(), used: new Set(), out: new Out() }

  /*
   * The body is generated first, because the import lines can only be written once it is known what
   * the body actually referenced — and then the recorded ranges are shifted down by the height of the
   * header that ends up above them.
   */
  for (const id of doc.root) emit(ctx, id, 3)

  const fromLibrary = [...ctx.used].filter((name) => LIBRARY.has(name) || name.startsWith('Icon')).sort()
  const fromBuilder = [...ctx.used].filter((name) => PRIMITIVES.has(name)).sort()

  const header = [
    fromLibrary.length ? `import { ${fromLibrary.join(', ')} } from 'liferay-sites-design-system'` : '',
    fromBuilder.length
      ? `import { ${fromBuilder.join(', ')} } from 'liferay-sites-design-system/builder/primitives'`
      : '',
    '',
    '/**',
    ` * ${doc.title}`,
    ' *',
    ` * Built at /edit/${doc.id}, revision ${doc.rev}.`,
    fromBuilder.length
      ? ` * ${fromBuilder.join(', ')} are the builder's thin wrappers over Mantine — src/builder/primitives.tsx.`
      : '',
    ' */',
    'export default function Page() {',
    '  return (',
    '    <>',
  ].filter((line) => line !== '')

  const offset = header.length
  const lines: Record<string, [number, number]> = {}
  for (const [id, [start, end]] of Object.entries(ctx.out.ranges)) {
    lines[id] = [start + offset, end + offset]
  }

  return {
    text: [...header, ...ctx.out.lines, '    </>', '  )', '}', ''].join('\n'),
    lines,
  }
}
