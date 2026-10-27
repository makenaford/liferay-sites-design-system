/**
 * Comment pins over a rendered page, and the click that places a new one.
 *
 * Used twice — over the builder's canvas and over the shared page — so it assumes only that it is
 * placed inside a `position: relative` box that also contains a page rendered with node markers
 * (`Renderer marked`). It measures through those markers the way the canvas outlines do, so a pin sits
 * on its node wherever that node has moved to.
 *
 * A pin is a node plus a point inside it, as fractions (see `comments.ts`). Resize the preview from
 * desktop to mobile and the card reflows; the pin moves with it and stays on the same spot of the card.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Tooltip } from '@mantine/core'
import { NODE_ATTR } from './Renderer'
import type { PageDocument } from './document'
import { handle, type PagePoint, type Thread } from './comments'

export interface Draft {
  node: string | null
  point: PagePoint | null
}

export interface CommentLayerProps {
  doc: PageDocument
  /** Threads to pin, in the order their numbers should run. */
  threads: Thread[]
  activeThread: string | null
  /** Comment mode: a click anywhere on the page places a new comment instead of doing what it would. */
  commenting: boolean
  draft: Draft | null
  onPlace: (draft: Draft) => void
  onOpen: (thread: string) => void
}

interface Box_ {
  top: number
  left: number
  width: number
  height: number
}

/**
 * A marked node's box, relative to `origin`.
 *
 * The union of the boxes of the elements the node drew at its top level — not a `Range` over all of its
 * contents, which is what the canvas outlines use. A `Range` includes descendants that overflow their
 * container, and a marquee's track is several screens wide and always moving, so a pin measured that
 * way drifted off the left of the page. The component's own outer box is clipped the way the reader
 * sees it. A node that drew only text has no element, and falls back to the `Range`.
 */
function measure(origin: HTMLElement, id: string): Box_ | null {
  const marker = origin.querySelector(`[${NODE_ATTR}="${CSS.escape(id)}"]`)
  if (!marker) return null

  let box: { top: number; left: number; right: number; bottom: number } | null = null
  for (const child of Array.from(marker.children)) {
    const r = child.getBoundingClientRect()
    if (!r.width && !r.height) continue
    box = box
      ? { top: Math.min(box.top, r.top), left: Math.min(box.left, r.left), right: Math.max(box.right, r.right), bottom: Math.max(box.bottom, r.bottom) }
      : { top: r.top, left: r.left, right: r.right, bottom: r.bottom }
  }
  if (!box) {
    const range = document.createRange()
    range.selectNodeContents(marker)
    const r = range.getBoundingClientRect()
    range.detach()
    box = { top: r.top, left: r.left, right: r.right, bottom: r.bottom }
  }
  if (box.right - box.left <= 0 && box.bottom - box.top <= 0) return null

  const frame = origin.getBoundingClientRect()
  // Clipped to the page, so nothing is ever pinned somewhere a reader cannot scroll to.
  const left = Math.max(box.left, frame.left)
  const right = Math.min(box.right, frame.right)
  return { top: box.top - frame.top, left: left - frame.left, width: Math.max(0, right - left), height: box.bottom - box.top }
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function CommentLayer({ doc, threads, activeThread, commenting, draft, onPlace, onOpen }: CommentLayerProps) {
  const layer = useRef<HTMLDivElement>(null)
  const [spots, setSpots] = useState<Record<string, { top: number; left: number }>>({})

  const where = useCallback((origin: HTMLElement, node: string | null, point: PagePoint | null) => {
    if (!node) return null
    const box = measure(origin, node)
    if (!box) return null
    const at = point ?? { x: 0, y: 0 }
    return { top: box.top + at.y * box.height, left: box.left + at.x * box.width }
  }, [])

  const remeasure = useCallback(() => {
    const origin = layer.current?.parentElement
    if (!origin) return
    const next: Record<string, { top: number; left: number }> = {}
    for (const { root } of threads) {
      const spot = where(origin, root.node, root.point)
      if (spot) next[root.id] = spot
    }
    if (draft) {
      const spot = where(origin, draft.node, draft.point)
      if (spot) next.__draft = spot
    }
    setSpots(next)
  }, [threads, draft, where])

  useLayoutEffect(remeasure, [remeasure, doc])

  useEffect(() => {
    const origin = layer.current?.parentElement
    if (!origin) return
    const observer = new ResizeObserver(remeasure)
    observer.observe(origin)
    addEventListener('resize', remeasure)
    // Images and fonts land after the first measure and move things; a few late passes catch them.
    const timers = [300, 1200, 3000].map((ms) => setTimeout(remeasure, ms))
    return () => {
      observer.disconnect()
      removeEventListener('resize', remeasure)
      timers.forEach(clearTimeout)
    }
  }, [remeasure])

  /** Where a click in comment mode lands: the innermost node under it, and the spot on that node. */
  const place = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const origin = layer.current?.parentElement
    if (!origin) return

    const under = document
      .elementsFromPoint(event.clientX, event.clientY)
      .find((element) => origin.contains(element) && !layer.current?.contains(element))
    const marker = under?.closest(`[${NODE_ATTR}]`)
    const node = marker?.getAttribute(NODE_ATTR) ?? null
    const box = node ? measure(origin, node) : null
    if (!node || !box) return onPlace({ node: null, point: null })

    const frame = origin.getBoundingClientRect()
    onPlace({
      node,
      point: {
        x: clamp((event.clientX - frame.left - box.left) / (box.width || 1)),
        y: clamp((event.clientY - frame.top - box.top) / (box.height || 1)),
      },
    })
  }

  return (
    <Box ref={layer} style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
      {commenting ? (
        /*
         * A sheet over the page that takes the click before the page does. Without it, placing a
         * comment on a button would also press the button — and a link would leave the page.
         */
        <Box
          onClick={place}
          onMouseDown={(event) => event.stopPropagation()}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', cursor: 'crosshair' }}
          aria-label="Click anywhere on the page to comment there"
        />
      ) : null}

      {threads.map(({ root, replies }, index) => {
        const spot = spots[root.id]
        if (!spot) return null
        const active = root.id === activeThread
        const resolved = root.resolvedAt !== null
        return (
          <Tooltip
            key={root.id}
            label={`${handle(root.author)}: ${root.body.slice(0, 80)}${replies.length ? ` · ${replies.length} repl${replies.length === 1 ? 'y' : 'ies'}` : ''}`}
            multiline
            w={260}
            withinPortal
          >
            <Box
              component="button"
              onClick={(event: React.MouseEvent) => {
                event.preventDefault()
                event.stopPropagation()
                onOpen(root.id)
              }}
              aria-label={`Comment ${index + 1}`}
              style={pinStyle(spot, active, resolved)}
            >
              {index + 1}
            </Box>
          </Tooltip>
        )
      })}

      {spots.__draft ? <Box style={pinStyle(spots.__draft, true, false)}>+</Box> : null}
    </Box>
  )
}

/** A speech-bubble pin whose point is the spot itself: the round corner sits up and to the right. */
const pinStyle = (spot: { top: number; left: number }, active: boolean, resolved: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: spot.top - 28,
  left: spot.left,
  width: 28,
  height: 28,
  borderRadius: '14px 14px 14px 2px',
  border: '2px solid #fff',
  background: resolved ? '#5c5f66' : active ? '#ff8a00' : '#4d8dff',
  color: '#fff',
  font: '700 12px/24px system-ui, sans-serif',
  textAlign: 'center',
  padding: 0,
  cursor: 'pointer',
  pointerEvents: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,.45)',
  transform: active ? 'scale(1.15)' : undefined,
  transformOrigin: 'bottom left',
  zIndex: active ? 2 : 1,
})
