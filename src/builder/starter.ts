/**
 * What a new page arrives as.
 *
 * A blank canvas is the wrong first thing to show a designer. It is not that assembling a page from
 * nothing is hard — it is that an empty page answers none of the questions worth asking about a mock,
 * so the first ten minutes go on rebuilding the same skeleton every site has. Starting from a header,
 * a hero, two sections and a footer means the first edit is about *this* page.
 *
 * Everything here is ordinary: the same nodes the palette produces, with no special status. Delete the
 * header and it is gone; the page does not put it back.
 *
 * ## Why the browser writes this and not the Worker
 *
 * It was the Worker's job first, and creating a page with its contents is the tidier arrangement — it
 * happens exactly once, however many tabs open the page next. But building from presets means reading
 * the Storybook stories, and importing those into the Worker took its bundle from 2.1MB to 7.4MB —
 * **4.07MB gzipped, past the 3MB a Worker is allowed on the free plan**. Several megabytes of story
 * content shipped to the edge to draw one starting page is the wrong trade.
 *
 * So the builder does it, on a signal that turns out to be exact: `rev === 0` means the document has
 * never been written. A page someone emptied has a revision history and is left alone. Two tabs
 * opening the same brand-new page would both try, and the second gets the ordinary stale-revision
 * answer and takes the first one's version — which is the same thing that happens for any other
 * simultaneous edit.
 */
import type { PageDocument, PageNode } from './document'
import { entryFor } from './registry'
import { presetsFor } from './presets'

/**
 * The skeleton, in the order it appears down the page, each named by the story it is built from.
 *
 * Built from **presets rather than blanks**, and that is the point rather than a shortcut. A blank
 * section is a grid of three placeholder cards; the `Card grid` and `Carousel section` stories are
 * different *kinds* of band, written against the Figma file. Starting from named ones means a new page
 * shows two different shapes instead of the same shape twice — and the inspector's preset field says
 * which each one is, so it can be swapped for one of the other thirteen in a click.
 *
 * A name that no longer matches a story falls back to the component's blank, so renaming a story
 * costs a plainer starter rather than a missing section.
 */
const SKELETON: [component: string, preset?: string][] = [
  ['Header'],
  ['Hero', 'Default'],
  ['Section', 'Card grid'],
  ['Section', 'Carousel section'],
  ['Footer'],
]

/** Whether a document has never been written to, which is the only time the starter applies. */
export const isNew = (doc: PageDocument): boolean => doc.rev === 0 && doc.root.length === 0

/** The skeleton's nodes, ready to be dropped into an untouched document. */
export function starterContent(): Pick<PageDocument, 'root' | 'nodes'> {
  const nodes: Record<string, PageNode> = {}
  const root: string[] = []

  for (const [component, wanted] of SKELETON) {
    const entry = entryFor(component)
    if (!entry) continue

    const preset = wanted ? presetsFor(component).find((one) => one.label === wanted) : undefined
    const { node, extra } = preset ? preset.build() : entry.blank()

    nodes[node.id] = { ...node, preset: preset ? wanted : undefined }
    for (const child of extra) nodes[child.id] = child
    root.push(node.id)
  }

  return { root, nodes }
}
