/**
 * Where a newly added component goes.
 *
 * This is the question a builder gets wrong most visibly. A designer clicks `Button` in the palette
 * with a card selected and means "put a button in this card" — they do not mean "append a button to
 * the bottom of the page", and they should not have to say which of the card's ten slots. So the
 * choice is made here, from the same catalogue the inspector reads, and it is made the same way every
 * time.
 *
 * The rule, in order:
 *
 * 0. If the thing being added is a **page-level band** — a `Section`, a `Hero` — it joins the page,
 *    full stop, landing after whichever band the selection currently sits in.
 * 1. If it is a **subcomponent** — an `AccordionItem`, a `Tab` — it can only go in a parent that takes
 *    it, so walk up from the selection until one is found.
 * 2. Otherwise try the selection's own slots, preferring the general-purpose `children` slot, then an
 *    empty slot, then any slot at all.
 * 3. If the selection takes nothing, try its parent, then its parent's parent. Selecting a heading
 *    inside a card and adding a button means the button joins the card, not the heading.
 * 4. Failing all of that, the page itself.
 */
import { locate, type PageDocument, type Target, ROOT_SLOT } from './document'
import { allowedIn, entryFor, slotsOf } from './registry'

/** The slot on `parent` that should receive `component`, or `null` if none will. */
function slotOn(doc: PageDocument, parentId: string, component: string): string | null {
  const parent = doc.nodes[parentId]
  if (!parent) return null

  const usable = slotsOf(parent.component)
    .map((slot) => slot.name)
    .filter((slot) => allowedIn(parent.component, slot, component))

  if (!usable.length) return null

  // `children` is the slot a component means as "and whatever else"; everything else is a named role.
  if (usable.includes('children')) return 'children'

  const empty = usable.find((slot) => !(parent.slots[slot]?.length))
  return empty ?? usable[0]
}

/**
 * Resolves a target, starting from wherever the designer was looking.
 *
 * `from` is the selected node, or the node a palette item was dropped on. `null` means the page.
 */
export function placementFor(
  doc: PageDocument,
  component: string,
  from: string | null,
): Target | null {
  const entry = entryFor(component)
  if (!entry) return null

  if (entry.topLevel) return onThePage(doc, from)

  // Walk up: the node itself, then its ancestors, then the page.
  let cursor = from
  const guard = new Set<string>()

  while (cursor && !guard.has(cursor)) {
    guard.add(cursor)

    const slot = slotOn(doc, cursor, component)
    if (slot) {
      // Land it directly after whatever is selected when they are siblings in the same slot, so
      // adding three cards in a row does not build them back to front.
      const at = locate(doc, from ?? '')
      const sameSlot = at && at.parentId === cursor && at.slot === slot
      return { parentId: cursor, slot, index: sameSlot ? (at.index ?? 0) + 1 : undefined }
    }

    cursor = locate(doc, cursor)?.parentId ?? null
  }

  if (!allowedIn(null, ROOT_SLOT, component)) return null
  return onThePage(doc, from)
}

/** Onto the page, immediately after whichever band the selection sits in. */
function onThePage(doc: PageDocument, from: string | null): Target {
  const top = topLevelAncestor(doc, from)
  const index = top === null ? undefined : doc.root.indexOf(top) + 1
  return { parentId: null, slot: ROOT_SLOT, index }
}

/** The section a node ultimately sits in, or `null` if it is not on the page. */
function topLevelAncestor(doc: PageDocument, id: string | null): string | null {
  let cursor = id
  const guard = new Set<string>()

  while (cursor && !guard.has(cursor)) {
    guard.add(cursor)
    const at = locate(doc, cursor)
    if (!at) return null
    if (at.parentId === null) return cursor
    cursor = at.parentId
  }
  return null
}

/**
 * Why a component could not be placed, in a sentence a designer can act on.
 *
 * Only reachable for the subcomponents, which is the whole reason it exists: clicking `Tab` with a
 * `Hero` selected has to say *what to select instead*, not fail silently.
 */
export function refusal(component: string): string {
  const entry = entryFor(component)
  const parents = entry?.parentOnly
  if (!parents?.length) return `${entry?.label ?? component} cannot go there.`

  const names = parents.map((name) => entryFor(name)?.label ?? name)
  return `A ${entry!.label} only goes inside ${names.join(' or ')}. Select one first.`
}
