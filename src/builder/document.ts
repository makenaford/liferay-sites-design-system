/**
 * A page, as the Durable Object stores it.
 *
 * ## Why a flat map and not a tree
 *
 * The obvious shape for a page is nested — a `Section` holding a `Card` holding a `Button`. This
 * stores that same tree as a **flat map of nodes plus lists of child ids**, because every operation
 * the builder performs is addressed by node: select this one, retitle that one, drag the third one
 * into a different slot. With a literal tree each of those needs a path, and a path is invalidated by
 * the edit standing next to it — reorder two sections and every selection below them points at the
 * wrong thing. An id does not move.
 *
 * It also makes the wire format small and the merge rules obvious: a change is a node id and a
 * value, and two people editing different nodes never conflict.
 *
 * ## Slots, not children
 *
 * A node's children live under the **name of the prop that holds them**. `Card` has ten React-node
 * props — `image`, `hero`, `title`, `description`, `top`, `main`, `bottom` — and they are drawn in
 * different places with different rules, so "the children of this card" is not a meaningful list.
 * `slots.bottom = ['n_7f']` says a button sits in the card's bottom slot, which is exactly what the
 * generated catalogue calls that prop and exactly what the renderer passes down.
 *
 * Everything here is JSON. No React nodes, no functions, no class instances — the document is written
 * to SQLite in the Durable Object, sent over a WebSocket, and read back by a Worker that has no DOM.
 */

/** What a control can put in `props`. The catalogue's `enum`, `text`, `number` and `boolean` kinds. */
export type PropValue = string | number | boolean

export interface PageNode {
  id: string
  /** A name from the generated catalogue, or one of the builder's own primitives. */
  component: string
  props: Record<string, PropValue>
  /** Slot name -> the ids of the nodes in it, in order. */
  slots: Record<string, string[]>
  /**
   * The Storybook story this node was last filled from.
   *
   * Builder bookkeeping, not a component prop: it is never passed to anything and never appears in
   * the handoff or the HTML. It exists so the inspector's preset control can show what was chosen —
   * a control that resets to blank the instant you use it reads as broken, whatever the reasoning.
   *
   * It records where the node *came from*, not what it still is: editing the copy afterwards leaves
   * this alone, because "started from Resource" stays true and is the useful thing to know.
   */
  preset?: string
}

export interface PageDocument {
  /** The Durable Object's name. Also the URL the designer shares. */
  id: string
  title: string
  /** The library is drawn in dark, and that is the default; a page may be either. */
  colorScheme: 'dark' | 'light'
  /** Top-level nodes, in order. The page itself is the one slot with no owning node. */
  root: string[]
  nodes: Record<string, PageNode>
  /**
   * Bumped on every accepted write. A save that carries a stale revision is rejected rather than
   * silently overwriting a change made in another tab — see `worker/PageDocument.ts`.
   */
  rev: number
  updatedAt: number
}

/** Where a node goes: a named slot on a parent, or the page itself. */
export interface Target {
  /** `null` is the page's own list of sections. */
  parentId: string | null
  slot: string
  /** Append when omitted. */
  index?: number
}

/** The slot name used for the page's top-level list, so `Target` has one shape everywhere. */
export const ROOT_SLOT = 'root'

/* ------------------------------------------------------------------ creating */

/**
 * Short, URL-safe, and generated in the browser.
 *
 * Ids do not need to be unguessable — the document they live in is already addressed by a name only
 * the people with the link know — so a counter-free random suffix is enough to keep two designers
 * editing at once from colliding.
 */
export const newId = (prefix = 'n'): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`

export const createNode = (
  component: string,
  props: Record<string, PropValue> = {},
  slots: Record<string, string[]> = {},
): PageNode => ({ id: newId(), component, props, slots })

export const emptyDocument = (id: string, title = 'Untitled page'): PageDocument => ({
  id,
  title,
  colorScheme: 'dark',
  root: [],
  nodes: {},
  rev: 0,
  updatedAt: Date.now(),
})

/* ------------------------------------------------------------------ reading */

export const childIds = (doc: PageDocument, parentId: string | null, slot: string): string[] =>
  parentId === null ? doc.root : (doc.nodes[parentId]?.slots[slot] ?? [])

/** Where a node currently sits, or `null` for one that is not in the document. */
export function locate(doc: PageDocument, id: string): Target | null {
  const index = doc.root.indexOf(id)
  if (index !== -1) return { parentId: null, slot: ROOT_SLOT, index }

  for (const node of Object.values(doc.nodes)) {
    for (const [slot, ids] of Object.entries(node.slots)) {
      const at = ids.indexOf(id)
      if (at !== -1) return { parentId: node.id, slot, index: at }
    }
  }
  return null
}

/** A node and everything under it — what `remove` deletes and what `duplicate` copies. */
export function descendants(doc: PageDocument, id: string): string[] {
  const node = doc.nodes[id]
  if (!node) return []
  return [id, ...Object.values(node.slots).flat().flatMap((child) => descendants(doc, child))]
}

/**
 * Whether `id` is `ancestorId` or sits somewhere beneath it.
 *
 * The guard on every move: dragging a section into its own card would detach that whole subtree from
 * the page and leave it referenced only by itself, which no amount of later editing can undo.
 */
export function contains(doc: PageDocument, ancestorId: string, id: string): boolean {
  return descendants(doc, ancestorId).includes(id)
}

/* ------------------------------------------------------------------ writing */

/*
 * Every operation returns a new document and leaves the old one untouched. That is not ceremony:
 * the canvas re-renders from the document, so an in-place mutation would show nothing until
 * something else happened to re-render, and undo would have nothing to hold on to.
 */

const withChildren = (
  doc: PageDocument,
  parentId: string | null,
  slot: string,
  ids: string[],
): PageDocument => {
  if (parentId === null) return { ...doc, root: ids }
  const parent = doc.nodes[parentId]
  if (!parent) return doc
  return {
    ...doc,
    nodes: { ...doc.nodes, [parentId]: { ...parent, slots: { ...parent.slots, [slot]: ids } } },
  }
}

/** Adds a node — and any nodes it already carries in its own slots — at a target. */
export function insert(
  doc: PageDocument,
  target: Target,
  node: PageNode,
  extra: PageNode[] = [],
): PageDocument {
  const added = { ...doc, nodes: { ...doc.nodes, [node.id]: node } }
  for (const child of extra) added.nodes[child.id] = child

  const ids = [...childIds(added, target.parentId, target.slot)]
  ids.splice(target.index ?? ids.length, 0, node.id)
  return touch(withChildren(added, target.parentId, target.slot, ids))
}

/** Detaches a node from wherever it sits, without deleting it. Used by `move`. */
function detach(doc: PageDocument, id: string): PageDocument {
  const at = locate(doc, id)
  if (!at) return doc
  const ids = childIds(doc, at.parentId, at.slot).filter((child) => child !== id)
  return withChildren(doc, at.parentId, at.slot, ids)
}

/**
 * Moves a node to a new slot or a new position in its current one.
 *
 * The index is resolved **after** detaching, which is what makes "drag this section one place down"
 * land where the drop indicator was drawn: removing the node first shifts everything below it up by
 * one, and an index captured before that would be off by one in exactly the common case.
 */
export function move(doc: PageDocument, id: string, target: Target): PageDocument {
  if (target.parentId !== null && contains(doc, id, target.parentId)) return doc

  const from = locate(doc, id)
  if (!from) return doc

  const detached = detach(doc, id)
  const ids = [...childIds(detached, target.parentId, target.slot)]

  let index = target.index ?? ids.length
  // Dropping into the same slot below the node's old position: the detach already closed the gap.
  if (from.parentId === target.parentId && from.slot === target.slot && from.index! < index) index -= 1

  ids.splice(Math.max(0, Math.min(index, ids.length)), 0, id)
  return touch(withChildren(detached, target.parentId, target.slot, ids))
}

/** Deletes a node and everything under it. */
export function remove(doc: PageDocument, id: string): PageDocument {
  const doomed = new Set(descendants(doc, id))
  const detached = detach(doc, id)
  const nodes = Object.fromEntries(
    Object.entries(detached.nodes).filter(([nodeId]) => !doomed.has(nodeId)),
  )
  return touch({ ...detached, nodes })
}

/** Sets one prop. Passing `undefined` clears it, so the component falls back to its own default. */
export function setProp(
  doc: PageDocument,
  id: string,
  name: string,
  value: PropValue | undefined,
): PageDocument {
  const node = doc.nodes[id]
  if (!node) return doc

  const props = { ...node.props }
  if (value === undefined || value === '') delete props[name]
  else props[name] = value

  return touch({ ...doc, nodes: { ...doc.nodes, [id]: { ...node, props } } })
}

/**
 * Refills a node from a preset, in place.
 *
 * The node keeps its **id and its position**, and everything inside it is replaced. That is what makes
 * choosing a preset feel like changing a setting rather than deleting and re-adding: the selection
 * does not move, the layer tree does not jump, and undo puts back exactly what was there.
 *
 * The old subtree is deleted rather than left behind. A node whose slots stop pointing at it is
 * unreachable — invisible on the canvas, absent from the tree, and still counted in the document — so
 * anything not carried over goes now.
 */
export function refill(
  doc: PageDocument,
  id: string,
  props: Record<string, PropValue>,
  slots: Record<string, string[]>,
  added: PageNode[],
  preset?: string,
): PageDocument {
  const node = doc.nodes[id]
  if (!node) return doc

  const doomed = new Set(descendants(doc, id))
  doomed.delete(id)

  const nodes = Object.fromEntries(
    Object.entries(doc.nodes).filter(([nodeId]) => !doomed.has(nodeId)),
  )
  for (const child of added) nodes[child.id] = child
  nodes[id] = { ...node, props, slots, preset }

  return touch({ ...doc, nodes })
}

/** Copies a node and its whole subtree in beside the original, with fresh ids throughout. */
export function duplicate(doc: PageDocument, id: string): { doc: PageDocument; id: string } {
  const at = locate(doc, id)
  if (!at || !doc.nodes[id]) return { doc, id }

  const remap = new Map<string, string>()
  for (const nodeId of descendants(doc, id)) remap.set(nodeId, newId())

  const copies = descendants(doc, id).map((nodeId) => {
    const node = doc.nodes[nodeId]
    return {
      ...node,
      id: remap.get(nodeId)!,
      props: { ...node.props },
      slots: Object.fromEntries(
        Object.entries(node.slots).map(([slot, ids]) => [slot, ids.map((child) => remap.get(child)!)]),
      ),
    }
  })

  const [root, ...rest] = copies
  return {
    doc: insert(doc, { ...at, index: (at.index ?? 0) + 1 }, root, rest),
    id: root.id,
  }
}

/** Stamps a write. The revision itself is the Durable Object's to assign — see `worker/`. */
const touch = (doc: PageDocument): PageDocument => ({ ...doc, updatedAt: Date.now() })

/* ------------------------------------------------------------------ keeping old pages current */

/**
 * Prop values a component no longer understands, and what they became.
 *
 * ## Why this has to exist
 *
 * A page stores prop *values*; the catalogue lives in the code. So renaming a variant updates every
 * page's **controls** the moment it deploys — the inspector reads the catalogue fresh — while leaving
 * the **values** already saved untouched. A card saved as `surface="grey"` still says `grey`, and
 * `Card` no longer has a `grey`: it renders with no fill and no rim, which is to say it stops looking
 * like a card at all. Nothing warns anybody, because a document is JSON and JSON cannot be wrong.
 *
 * A general "drop anything the catalogue does not list" pass would be worse than this table. It
 * cannot tell a renamed value from a prop the catalogue never described — `Hero`'s `video` takes a
 * string the generator cannot classify, and a page is right to hold one — so it would quietly delete
 * work. This is the narrow, reviewable alternative: the renames somebody actually made, written down.
 *
 * **Entries are never removed.** A page that has not been opened since before a rename is exactly the
 * page this is for, and there is no deadline by which it must have been opened.
 */
const RENAMED: Record<string, (props: Record<string, PropValue>) => Record<string, PropValue> | null> = {
  /*
   * `Four kinds of card, with the rim carrying the meaning` (f792179) replaced a list of appearances
   * with a list of kinds. The two gradient cells collapsed into one surface plus a `tone`, which is
   * why this is a rewrite of the whole prop bag rather than a value-for-value map.
   */
  Card: (props) => {
    const was = props.surface
    switch (was) {
      case 'grey':
        return { ...props, surface: 'static' }
      case 'no-bg':
        return { ...props, surface: 'none' }
      case 'gradient-blue':
        return { ...props, surface: 'highlighted', tone: 'blue' }
      case 'gradient-purple':
        return { ...props, surface: 'highlighted', tone: 'purple' }
      default:
        return null
    }
  },
}

/**
 * Brings a stored page up to date with the components as they are now.
 *
 * Applied where the page is **read** rather than as a one-off script over the stored pages, for two
 * reasons: a Durable Object per page has no list to iterate in the first place, and a page that is
 * never opened never needed migrating. Reading is also the moment it matters — the next save writes
 * the corrected values back, so this converges without anything having to be scheduled.
 *
 * Returns the document **unchanged and identical** when there is nothing to do, which is the normal
 * case and keeps this off the cost of an ordinary read.
 */
export function migrate(doc: PageDocument): PageDocument {
  let changed = false
  const nodes: Record<string, PageNode> = {}

  for (const [id, node] of Object.entries(doc.nodes)) {
    const rewrite = RENAMED[node.component]?.(node.props)
    if (rewrite) {
      changed = true
      nodes[id] = { ...node, props: rewrite }
    } else {
      nodes[id] = node
    }
  }

  return changed ? { ...doc, nodes } : doc
}

/* ------------------------------------------------------------------ integrity */

/**
 * Whether a parsed value is a document this renderer can draw.
 *
 * The Durable Object accepts writes from a browser, so it cannot trust the body it is handed — and a
 * document that passes structurally but references a node that is not there would render as a page
 * with a hole in it, which is much harder to diagnose than a rejected save. Dangling ids are the one
 * failure this checks for beyond shape, because they are the one the editing operations could
 * plausibly produce.
 */
export function documentProblems(value: unknown): string[] {
  const problems: string[] = []
  const doc = value as PageDocument

  if (!doc || typeof doc !== 'object') return ['not an object']
  if (typeof doc.title !== 'string') problems.push('title must be a string')
  if (!Array.isArray(doc.root)) problems.push('root must be an array')
  if (!doc.nodes || typeof doc.nodes !== 'object') problems.push('nodes must be an object')
  if (problems.length) return problems

  const known = new Set(Object.keys(doc.nodes))
  const seen = new Set<string>()

  const visit = (id: string, from: string) => {
    if (!known.has(id)) return problems.push(`${from} references unknown node ${id}`)
    if (seen.has(id)) return problems.push(`node ${id} appears in more than one slot`)
    seen.add(id)
    for (const [slot, ids] of Object.entries(doc.nodes[id].slots ?? {})) {
      if (!Array.isArray(ids)) return problems.push(`${id}.${slot} must be an array`)
      for (const child of ids) visit(child, `${id}.${slot}`)
    }
  }

  for (const id of doc.root) visit(id, 'root')
  for (const id of known) if (!seen.has(id)) problems.push(`node ${id} is orphaned`)

  return problems
}
