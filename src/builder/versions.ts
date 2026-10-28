/**
 * Named versions: the deliverable.
 *
 * ## Why a version is not just a revision
 *
 * Every save is already a revision, and the page keeps the last couple of hundred. But a revision is a
 * moment, not a decision: nobody signs off "rev 47", the history is trimmed, and a revision's HTML is
 * whatever today's components make of it. A **version** is the thing that replaces sending a Figma frame:
 * somebody chose this state, named it, and handed it over.
 *
 * So a version is frozen three ways when it is made, and kept as long as the page is:
 *
 * - **the document**, copied out of the history, so trimming can never take it;
 * - **the HTML**, rendered then and stored, so a later change to a component cannot change what was
 *   signed off — the reason it is stored rather than rendered on request, unlike `/p/:id.html`;
 * - **the files that HTML uses** — the design system's images and footage — copied beside it, because
 *   the built ones are named by content hash and disappear on the next deploy that changes them.
 *
 * The React handoff is stored with it too, for the developer picking it up.
 */
import type { PageDocument, PageNode } from './document'
import type { PageStatus } from './library'

export interface PageVersion {
  /** 1, 2, 3… per page. What the URL says: `/p/:id/v/3`. */
  number: number
  name: string
  note: string
  /** The revision it froze. */
  rev: number
  by: string | null
  at: number
  /** The page's status at the moment it was frozen — usually what the version was made to record. */
  status: PageStatus
}

/** The library's view of a page's newest version. */
export interface VersionSummary {
  number: number
  name: string
  at: number
}

export const VERSION_NAME_LIMIT = 80
export const VERSION_NOTE_LIMIT = 2000

/** Where a version's files live. */
export const versionPath = (page: string, number: number) => `/p/${page}/v/${number}`

/* ------------------------------------------------------------------ what changed */

export interface BlockChange {
  id: string
  kind: 'added' | 'removed' | 'changed' | 'moved'
  /** The block as it is described in the newer document (or the older one, for a removal). */
  node: PageNode
  doc: PageDocument
}

export interface DocChanges {
  title?: { from: string; to: string }
  colorScheme?: { from: string; to: string }
  blocks: BlockChange[]
}

/** A block and everything under it, as one comparable string. Key order is stable: the docs are built the same way. */
function subtree(doc: PageDocument, id: string): string {
  const node = doc.nodes[id]
  if (!node) return ''
  const children = Object.entries(node.slots)
    .map(([slot, ids]) => `${slot}:[${ids.map((child) => subtree(doc, child)).join(',')}]`)
    .join(';')
  return JSON.stringify([node.component, node.props, node.data ?? null]) + `{${children}}`
}

/**
 * The blocks that kept their place, as the longest run that is in the same order in both documents.
 *
 * Comparing indexes is the obvious test and the wrong one: dragging the last section to the top shifts
 * every other section down by one, and all of them would be reported as moved. The longest common
 * ordering is what a person means by "the rest stayed put", so only what falls outside it moved.
 */
function unmoved(now: string[], was: string[]): Set<string> {
  const position = new Map(was.map((id, index) => [id, index]))
  const sequence = now.map((id) => position.get(id) ?? -1)

  // Patience sorting: `tails[k]` is the index in `sequence` ending the best increasing run of length k+1.
  const tails: number[] = []
  const previous = new Array<number>(sequence.length).fill(-1)
  sequence.forEach((value, i) => {
    let lo = 0
    let hi = tails.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (sequence[tails[mid]] < value) lo = mid + 1
      else hi = mid
    }
    if (lo > 0) previous[i] = tails[lo - 1]
    tails[lo] = i
  })

  const kept = new Set<string>()
  for (let i = tails[tails.length - 1] ?? -1; i !== -1; i = previous[i]) kept.add(now[i])
  return kept
}

/**
 * What changed between two documents, at the level a reviewer reads a page: the top-level blocks.
 *
 * A block is the same block across versions when its node id is the same — ids survive every edit — so
 * "changed" means its contents differ, "moved" means only its place in the page did, and a block that
 * was deleted and re-added from the palette honestly shows as one removal and one addition.
 */
export function diffDocs(from: PageDocument, to: PageDocument): DocChanges {
  const changes: DocChanges = { blocks: [] }
  if (from.title !== to.title) changes.title = { from: from.title, to: to.title }
  if (from.colorScheme !== to.colorScheme) changes.colorScheme = { from: from.colorScheme, to: to.colorScheme }

  const before = new Set(from.root)
  const after = new Set(to.root)
  const stayed = unmoved(
    to.root.filter((id) => before.has(id)),
    from.root.filter((id) => after.has(id)),
  )

  for (const id of to.root) {
    const node = to.nodes[id]
    if (!node) continue
    if (!before.has(id)) {
      changes.blocks.push({ id, kind: 'added', node, doc: to })
    } else if (subtree(from, id) !== subtree(to, id)) {
      changes.blocks.push({ id, kind: 'changed', node, doc: to })
    } else if (!stayed.has(id)) {
      changes.blocks.push({ id, kind: 'moved', node, doc: to })
    }
  }
  for (const id of from.root) {
    const node = from.nodes[id]
    if (node && !after.has(id)) changes.blocks.push({ id, kind: 'removed', node, doc: from })
  }
  return changes
}

export const changeCount = (changes: DocChanges) =>
  changes.blocks.length + (changes.title ? 1 : 0) + (changes.colorScheme ? 1 : 0)
