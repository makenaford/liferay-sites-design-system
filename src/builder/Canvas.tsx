/**
 * The page itself, and the only surface a designer really has to understand.
 *
 * Everything here is about making the rendered page **addressable**: a click has to resolve to the
 * node that drew what was clicked, a hover has to outline it, and a double-click on text has to put a
 * caret in it. None of that can work by wrapping components in boxes — the library's layouts would
 * fall apart — so the marking is done with zero-box `display: contents` spans in `Renderer.tsx` and the
 * drawing is done here, in an overlay that sits above the page and measures through to it.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Text } from '@mantine/core'
import type { PageDocument } from './document'
import { NODE_ATTR, Renderer } from './Renderer'
import { PageTheme } from './PageTheme'
import { entryFor } from './registry'

export interface CanvasProps {
  doc: PageDocument
  width: number
  selectedId: string | null
  /**
   * Changes when the selection was made somewhere the canvas cannot see — the code panel. The canvas
   * scrolls to the selected node only then: a click on the canvas selects something already under the
   * pointer, and scrolling it would move the page out from under the person who clicked it.
   */
  revealToken?: number
  onSelect: (id: string | null) => void
  onText: (id: string, value: string) => void
  /** A component name being dragged out of the palette, if any. */
  dragging: string | null
  onDrop: (component: string, overId: string | null) => void
}

/** A rectangle in the overlay's own coordinates. */
interface Rect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Measures a marked node.
 *
 * The marker span has `display: contents`, so it has no box of its own and `getBoundingClientRect`
 * on it returns nothing useful. A `Range` over its contents does the right thing instead: it spans
 * whatever the node actually drew, element or bare text, which is exactly the region to outline.
 */
function measure(root: HTMLElement, id: string): Rect | null {
  const marker = root.querySelector(`[${NODE_ATTR}="${CSS.escape(id)}"]`)
  if (!marker) return null

  const range = document.createRange()
  range.selectNodeContents(marker)
  const box = range.getBoundingClientRect()
  range.detach()
  if (!box.width && !box.height) return null

  const frame = root.getBoundingClientRect()
  return {
    top: box.top - frame.top,
    left: box.left - frame.left,
    width: box.width,
    height: box.height,
  }
}

/**
 * The node a pointer event landed in.
 *
 * `closest` gets most of the way there, and then there is a case it cannot see. A node that draws only
 * text — the `Plain` inside a `SectionTitle`'s own `<h2>` — is wrapped in a marker with
 * `display: contents`, so it generates no box and **a click on that text reports the `<h2>` as its
 * target**. The marker is a *child* of the target, not an ancestor, and `closest` walks straight past
 * it: clicking a section title selected the section title component and offered nothing to edit.
 *
 * So after finding the nearest marked ancestor, descend again through any marker that accounts for
 * *all* of the element's text. That condition is what keeps it honest — a card holds several marked
 * children and none of them is the whole of it, so a click on a card still selects the card.
 */
function nodeAt(target: EventTarget | null): string | null {
  const element = target as HTMLElement | null
  if (!element) return null

  /*
   * Look **down** by exactly one step first. A marker with `display: contents` generates no box, so a
   * click on the text inside it reports the nearest element that does — the component's own `<h2>` —
   * and the marker sits directly below that rather than above it.
   *
   * One step, and only into a marker that is the element's sole child and holds all of its text. An
   * earlier version walked the whole chain of single children, which meant clicking the padding of a
   * section wrapped in nesting `div`s selected the heading three levels down. The narrow rule catches
   * the case it exists for — a text node inside the element its own component drew — and nothing else.
   */
  const only = element.children.length === 1 ? element.children[0] : null
  if (only?.hasAttribute(NODE_ATTR) && only.textContent === element.textContent) {
    return only.getAttribute(NODE_ATTR)
  }

  // Otherwise the ordinary case: the innermost marker the click sits inside.
  return element.closest(`[${NODE_ATTR}]`)?.getAttribute(NODE_ATTR) ?? null
}

/**
 * Puts a caret in a node's text, on the canvas, where the text is.
 *
 * This is done imperatively — reach into the DOM, set `contentEditable`, listen for the commit —
 * rather than by rendering a `contentEditable` wrapper, and the reason is the marker span: it has
 * `display: contents` so that it does not disturb the library's layouts, which means it generates no
 * box, and an element with no box **cannot be edited**. The first version of this rendered a wrapper
 * and silently did nothing.
 *
 * So the attribute goes on the element the component really drew — the `h1`, the `p`, the `button`'s
 * own element — found one level inside the marker. React is not told, and does not need to be: no
 * state changes while typing, so nothing re-renders and nothing overwrites the text under the caret.
 * The single state change happens on commit, when the new string goes into the document and React
 * redraws the node from it.
 *
 * Returns `false` when the node drew no element to put a caret in — a bare string inside a marquee
 * cell, say. The inspector still has a field for it, so the text is never unreachable.
 */
function editInPlace(
  root: HTMLElement,
  id: string,
  onCommit: (value: string) => void,
): boolean {
  const marker = root.querySelector(`[${NODE_ATTR}="${CSS.escape(id)}"]`)
  if (!marker) return false

  /*
   * Usually the node drew an element of its own and the caret goes in that.
   *
   * A `Plain` node draws no element at all — it is a run of text, which is exactly what a
   * `SectionTitle`'s `title` slot wants, because the component supplies the `<h2>` around it. So when
   * there is no element inside the marker, the caret goes in the element *outside* it — but only when
   * that element holds nothing except this node's text. Without the check, editing a heading in a
   * component that also draws a description beside it would let the two run together.
   */
  const element = (marker.firstElementChild ??
    (marker.parentElement && marker.parentElement.textContent === marker.textContent
      ? marker.parentElement
      : null)) as HTMLElement | null
  if (!element) return false

  element.contentEditable = 'true'
  element.spellcheck = false
  element.style.outline = 'none'

  const original = element.textContent ?? ''

  /*
   * `finish` runs at most once.
   *
   * Both the guard and the order matter, and they were found the hard way: dropping the
   * `contenteditable` attribute makes the browser fire `blur` **synchronously**, from inside this
   * function, while the blur handler is still attached. Without the guard that re-enters and commits
   * the same edit twice — which looks harmless until the second commit lands on the undo stack as
   * "the state before the edit", and undo then restores the edit it was supposed to undo.
   */
  let done = false

  const finish = (value: string | null) => {
    if (done) return
    done = true

    element.removeEventListener('blur', onBlur)
    element.removeEventListener('keydown', onKeyDown)
    element.removeAttribute('contenteditable')
    element.style.outline = ''

    if (value !== null && value !== original) onCommit(value)
  }

  function onBlur() {
    finish(element!.textContent ?? '')
  }

  function onKeyDown(event: KeyboardEvent) {
    // Builder shortcuts must not fire while someone is typing a word with a `z` in it.
    event.stopPropagation()

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      finish(element!.textContent ?? '')
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      element!.textContent = original
      finish(null)
    }
  }

  element.addEventListener('blur', onBlur)
  element.addEventListener('keydown', onKeyDown)

  element.focus()
  // Select the whole thing, so the first keystroke replaces the placeholder rather than appending.
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)

  return true
}

export function Canvas({
  doc,
  width,
  selectedId,
  revealToken,
  onSelect,
  onText,
  dragging,
  onDrop,
}: CanvasProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [rects, setRects] = useState<{ selected: Rect | null; hovered: Rect | null }>({
    selected: null,
    hovered: null,
  })

  const remeasure = useCallback(() => {
    const root = frame.current
    if (!root) return setRects({ selected: null, hovered: null })
    setRects({
      selected: selectedId ? measure(root, selectedId) : null,
      hovered: hoveredId && hoveredId !== selectedId ? measure(root, hoveredId) : null,
    })
  }, [selectedId, hoveredId])

  /*
   * Measured after the DOM is updated but before the browser paints, so an outline never lags a frame
   * behind the thing it is outlining — which is very visible when a variant change resizes a button.
   */
  useLayoutEffect(remeasure, [remeasure, doc, width])

  /*
   * The page keeps moving after that: images decode, fonts swap, the marquee runs, a section reflows
   * when the preview width changes. A `ResizeObserver` on the page catches all of it without a poll.
   */
  useEffect(() => {
    const root = frame.current
    if (!root) return

    const observer = new ResizeObserver(remeasure)
    observer.observe(root)
    for (const child of Array.from(root.querySelectorAll('*')).slice(0, 400)) observer.observe(child)

    addEventListener('scroll', remeasure, true)
    addEventListener('resize', remeasure)
    return () => {
      observer.disconnect()
      removeEventListener('scroll', remeasure, true)
      removeEventListener('resize', remeasure)
    }
  }, [remeasure, doc])

  useEffect(() => {
    if (!revealToken || !selectedId || !frame.current) return
    const marker = frame.current.querySelector(`[${NODE_ATTR}="${CSS.escape(selectedId)}"]`)
    // `display: contents` again — the marker has no box, so scroll the first thing it drew.
    marker?.firstElementChild?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [revealToken, selectedId])

  const hoveredLabel = hoveredId ? entryFor(doc.nodes[hoveredId]?.component)?.label : null
  const selectedLabel = selectedId ? entryFor(doc.nodes[selectedId]?.component)?.label : null
  const editable = selectedId ? entryFor(doc.nodes[selectedId]?.component)?.textProp : undefined

  return (
    <Box
      style={{ position: 'relative', width, margin: '0 auto' }}
      onMouseOver={(event) => setHoveredId(nodeAt(event.target))}
      onMouseLeave={() => setHoveredId(null)}
      onClick={(event) => {
        /*
         * Links and buttons inside the page are real, and on the canvas they must not be: clicking
         * "Get started" is how a designer selects that button, not how they navigate away from the
         * builder. The interactions that are worth keeping — a carousel snapping, an accordion
         * opening — are the ones that do not leave the page, and they still work.
         */
        const control = (event.target as HTMLElement).closest('a,button')
        if (control && frame.current?.contains(control)) event.preventDefault()

        // A click inside text that is being edited is the caret being placed, not a re-selection.
        if ((event.target as HTMLElement).closest('[contenteditable="true"]')) return

        onSelect(nodeAt(event.target))
      }}
      onDoubleClick={(event) => {
        const id = nodeAt(event.target)
        const root = frame.current
        if (!id || !root) return
        if (!entryFor(doc.nodes[id]?.component)?.textProp) return

        onSelect(id)
        editInPlace(root, id, (value) => onText(id, value))
      }}
      onDragOver={(event) => {
        if (!dragging) return
        event.preventDefault()
        setHoveredId(nodeAt(event.target))
      }}
      onDrop={(event) => {
        if (!dragging) return
        event.preventDefault()
        onDrop(dragging, nodeAt(event.target))
        setHoveredId(null)
      }}
    >
      <div ref={frame}>
        {/*
          * The chosen width is honoured exactly, and `PageTheme` makes the page a containment
          * context, so the sections measure themselves against it. That is the whole point of a width
          * switcher: `Section`'s gutter is a percentage of its *container*, so a hero previewing at
          * 390 has to genuinely be 390 wide, not a desktop hero scaled down.
          */}
        <PageTheme
          colorScheme={doc.colorScheme}
          style={{
            /*
             * An empty page still has to be a target. Without a height there is nothing to drag the
             * first section onto — the drop lands on the scroll area behind the canvas, and the
             * builder appears to ignore it.
             */
            minBlockSize: doc.root.length ? undefined : 360,
          }}
        >
          {doc.root.length ? <Renderer doc={doc} marked /> : <Empty />}
        </PageTheme>
      </div>

      {/* -------------------------------------------------- the overlay */}
      <Box
        /*
         * One layer over the whole page rather than a border on each component. A border would change
         * the layout of the thing it is meant to be describing — a 2px outline on a card inside a grid
         * moves every other card — and an outline drawn outside the flow cannot.
         */
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
      >
        {rects.hovered ? <Outline rect={rects.hovered} label={hoveredLabel} tone="hover" /> : null}
        {rects.selected ? (
          <Outline
            rect={rects.selected}
            label={editable ? `${selectedLabel} — double-click to edit` : selectedLabel}
            tone="selected"
          />
        ) : null}
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ pieces */

const TONES = {
  hover: { color: 'rgba(120, 160, 255, 0.9)', weight: 1 },
  selected: { color: '#4d8dff', weight: 2 },
} as const

function Outline({
  rect,
  label,
  tone,
}: {
  rect: Rect
  label: string | null | undefined
  tone: keyof typeof TONES
}) {
  const { color, weight } = TONES[tone]
  // A label above a node at the very top of the page would be cut off, so it flips inside.
  const below = rect.top < 20

  return (
    <Box style={{ position: 'absolute', ...rect, pointerEvents: 'none' }}>
      <Box style={{ position: 'absolute', inset: -weight, border: `${weight}px solid ${color}`, borderRadius: 3 }} />
      {label ? (
        <Text
          fz={10}
          fw={600}
          style={{
            position: 'absolute',
            left: -weight,
            [below ? 'top' : 'bottom']: '100%',
            background: color,
            color: '#06070a',
            padding: '1px 6px',
            borderRadius: 3,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Text>
      ) : null}
    </Box>
  )
}

const Empty = () => (
  <Box p="80" ta="center" style={{ display: 'grid', placeContent: 'center', minBlockSize: 360 }}>
    <Text fz="lg" fw={600} c="var(--sds-surfaces-text-primary)">
      An empty page
    </Text>
    <Text fz="sm" c="var(--sds-surfaces-text-secondary)" mt="8">
      Drag a Section in from the left, or click one to add it.
    </Text>
  </Box>
)
