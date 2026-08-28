/**
 * Draws a stored document.
 *
 * The same component renders the builder's canvas and the published page — one code path, so what a
 * designer signs off is literally what a visitor loads. The difference between the two is a single
 * prop: `selection`. Pass it and every node gets a marker the canvas can hit-test and outline; leave
 * it off and the output is the components and nothing else, with no builder machinery in the DOM.
 */
import { Fragment, type ReactNode } from 'react'
import { Box, Text } from '@mantine/core'
import type { PageDocument, PageNode } from './document'
import { entryFor, type RenderContext } from './registry'

/** The attribute the canvas hit-tests against. Absent from a published page. */
export const NODE_ATTR = 'data-sds-node'

export interface RendererProps {
  doc: PageDocument
  /**
   * Marks every node so the canvas can find it. On in the builder, off everywhere else — which is
   * what keeps a published page free of builder machinery while still being the same render.
   */
  marked?: boolean
}

/**
 * A node that names a component nobody knows.
 *
 * Reachable in one real situation: a document written by a newer build of the builder, opened by an
 * older one — the Durable Object keeps the page, and the code that draws it moves on. Drawing a
 * labelled gap keeps the rest of the page intact and says exactly what is missing, which beats both
 * a blank space and a thrown error that takes the whole canvas down.
 */
const Unknown = ({ component }: { component: string }) => (
  <Box
    p="16"
    style={{ border: '1px dashed var(--mantine-color-dark-3)', borderRadius: 8 }}
  >
    <Text fz="sm" c="dimmed">
      No component called <code>{component}</code> in this build.
    </Text>
  </Box>
)

/**
 * Wraps a node so the canvas can find it, without changing how it lays out.
 *
 * `display: contents` is doing the real work: the span is in the DOM, so `closest()` finds it on a
 * click and the layer tree can scroll to it, but it generates **no box at all**, so a card inside a
 * grid is still a direct grid item and a flex row still measures its real children. A plain wrapper
 * div here would silently break every layout in the library.
 */
const Marker = ({ id, children }: { id: string; children: ReactNode }) => (
  <span {...{ [NODE_ATTR]: id }} style={{ display: 'contents' }}>
    {children}
  </span>
)

/* ------------------------------------------------------------------ the walk */

function renderNode(
  doc: PageDocument,
  id: string,
  marked: boolean,
  seen: Set<string>,
): ReactNode {
  const node: PageNode | undefined = doc.nodes[id]
  if (!node) return null

  /*
   * A cycle cannot be produced by the editing operations — `move` refuses to put a node inside its own
   * subtree — but the document also arrives over the network, and a render that recurses forever takes
   * the tab with it. One `Set` down the current path is a cheap guarantee that it terminates.
   */
  if (seen.has(id)) return null
  const path = new Set(seen).add(id)

  const entry = entryFor(node.component)
  if (!entry) return <Unknown key={id} component={node.component} />

  const context: RenderContext = {
    node,
    props: node.props,
    children: (slot) => (node.slots[slot] ?? []).map((child) => doc.nodes[child]).filter(Boolean),
    renderNode: (child) => renderNode(doc, child, marked, path),
    slot: (slot) => {
      const ids = node.slots[slot] ?? []
      if (!ids.length) return undefined
      return ids.map((child) => <Fragment key={child}>{renderNode(doc, child, marked, path)}</Fragment>)
    },
  }

  const drawn = entry.render(context)

  if (!marked) return <Fragment key={id}>{drawn}</Fragment>
  return <Marker key={id} id={id}>{drawn}</Marker>
}

export function Renderer({ doc, marked }: RendererProps) {
  return (
    <>
      {doc.root.map((id) => (
        <Fragment key={id}>{renderNode(doc, id, marked ?? false, new Set())}</Fragment>
      ))}
    </>
  )
}
