import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Box } from '@mantine/core'
import type { BoxProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/**
 * One tile: a product, with the glass icon that stands for it.
 *
 * `href` and `onClick` are both optional and both make the tile a target — a tile with neither is
 * still drawn, and still readable, it just does not react. That matters for a map that is filled in
 * over time: a capability with no page yet should not grow a hover state promising one.
 */
export interface CapabilityItem {
  /** The product name, printed under the icon. */
  label: string
  /** The glass icon — `IconGlassPIM`, `IconGlassSites`, and so on, at whatever size the tile sets. */
  icon: ReactNode
  /** Where the tile goes. Renders the tile as an `a`. */
  href?: string
  onClick?: () => void
  /** Read out instead of `label` where the name is an initialism a screen reader would spell. */
  description?: string
}

/**
 * One of the four sections. Each holds **exactly four** items, which is not a limitation so much as
 * the shape: a section is a diamond of four cells around an empty one on the hexagonal lattice, and
 * that diamond is the unit the map is built from. A fifth item has nowhere to go, so extra items are
 * dropped rather than silently breaking the lattice — see the component docs.
 */
export interface CapabilityCluster {
  /** The section name, set above or below its four tiles. */
  label: string
  items: CapabilityItem[]
}

/** A cell on the hexagonal lattice: a column, and a row in units of `0.866 × tile`. */
interface Cell {
  q: number
  r: number
}

/** Odd columns hang half a row lower. This one line is the honeycomb. */
const rowOf = (q: number, r: number) => (Math.abs(q) % 2 === 1 ? r + 0.5 : r)

/**
 * Where each section's four tiles sit, clockwise from the top left, read top → left → right → bottom.
 *
 * A section is a **diamond around an empty cell** — the shape the Figma frame draws. Of the twelve
 * mirror-symmetric arrangements this lattice allows without two sections touching, it is the tightest:
 * the nearest tile is 1.5 cells from the hub where a 2×2 block managed 1.732, and the figure comes out
 * 5.8 cells wide rather than 6.3. It is also symmetric in both axes by construction, so nothing needs
 * shifting to centre it.
 */
const CLUSTER_CELLS: readonly (readonly Cell[])[] = [
  [
    { q: -2, r: -2 },
    { q: -3, r: -2 },
    { q: -1, r: -2 },
    { q: -2, r: -1 },
  ],
  [
    { q: 2, r: -2 },
    { q: 1, r: -2 },
    { q: 3, r: -2 },
    { q: 2, r: -1 },
  ],
  [
    { q: 2, r: 1 },
    { q: 1, r: 1 },
    { q: 3, r: 1 },
    { q: 2, r: 2 },
  ],
  [
    { q: -2, r: 1 },
    { q: -3, r: 1 },
    { q: -1, r: 1 },
    { q: -2, r: 2 },
  ],
]

/** Where each section's name sits, in tiles from the centre. Clockwise from the top left. */
const NAME_AT = [
  { x: -1.5, y: -2.36 },
  { x: 1.5, y: -2.36 },
  { x: 1.5, y: 2.36 },
  { x: -1.5, y: 2.36 },
] as const

/**
 * The map's box, in tiles.
 *
 * Tiles reach 2.69 across and 2.11 down from the centre; the section names sit at 2.36 down. The box's
 * width divided by `w` **is** the tile, so every tile of slack here comes straight off the size of the
 * hexagons and the 14px text inside them.
 */
const CANVAS = { w: 5.8, h: 5.4 }

/** A flat-top hexagon of width 1, centred on the origin: the corner offsets, in tiles. */
const CORNERS = [
  [-0.25, -0.4330127],
  [0.25, -0.4330127],
  [0.5, 0],
  [0.25, 0.4330127],
  [-0.25, 0.4330127],
  [-0.5, 0],
] as const

const pos = (q: number, r: number) => ({ x: q * 0.75, y: rowOf(q, r) * 0.8660254 })
const vkey = (x: number, y: number) => `${x.toFixed(3)},${y.toFixed(3)}`

/**
 * The lattice's corners as a graph: every vertex has exactly three edges.
 *
 * Built once at module load, over a range wider than the canvas so the network runs off every edge
 * rather than stopping at it. This is what the traces walk, and it is the reason a trace takes corners
 * like the grid does instead of cutting across it.
 */
const { VERT, ADJ } = (() => {
  const vert = new Map<string, [number, number]>()
  const adj = new Map<string, Set<string>>()
  for (let q = -5; q <= 5; q += 1) {
    for (let r = -5; r <= 5; r += 1) {
      const c = pos(q, r)
      const corners = CORNERS.map(([vx, vy]) => [c.x + vx, c.y + vy] as [number, number])
      corners.forEach((p, i) => {
        const n = corners[(i + 1) % 6]
        const a = vkey(p[0], p[1])
        const b = vkey(n[0], n[1])
        if (!vert.has(a)) vert.set(a, p)
        if (!vert.has(b)) vert.set(b, n)
        if (!adj.has(a)) adj.set(a, new Set())
        if (!adj.has(b)) adj.set(b, new Set())
        adj.get(a)!.add(b)
        adj.get(b)!.add(a)
      })
    }
  }
  return { VERT: vert, ADJ: adj }
})()

const BY_RADIUS = [...VERT.entries()].sort(
  ([, a], [, b]) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]),
)

/**
 * The wandering traces: short walks along the lattice edges.
 *
 * Starts are **seeded** at both ends of the field rather than left to chance. Drawn uniformly from some
 * five hundred vertices, a start almost never lands near the middle or out at the rim — measured, the
 * closest any line came to the centre was 2.78 cells. Four now begin at the core, where they run behind
 * the solid hub, and six at the outermost vertices, so the edges carry lines instead of trailing off.
 *
 * Deterministic: a small generator per walk rather than `Math.random`, so the routes are identical on
 * the server and the client and React has nothing to replace on hydration.
 */
const WALKS: string[] = (() => {
  const out: string[] = []
  const total = 24
  const edgeFirst = [...BY_RADIUS].reverse()
  for (let t = 0; t < total; t += 1) {
    let seed = 7717 + t * 104729
    const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
    const from =
      t < 4
        ? BY_RADIUS[(t * 3) % BY_RADIUS.length]
        : t < 10
          ? edgeFirst[((t - 4) * 7) % 40]
          : BY_RADIUS[Math.floor(rand() * BY_RADIUS.length)]
    let cur = from[0]
    let prev: string | null = null
    const pts: string[] = []
    const steps = 3 + Math.floor(rand() * 4)
    for (let s = 0; s <= steps; s += 1) {
      const p = VERT.get(cur)
      if (!p) break
      pts.push(`${p[0].toFixed(4)},${p[1].toFixed(4)}`)
      const options = [...(ADJ.get(cur) ?? [])].filter((nb) => nb !== prev && VERT.has(nb))
      if (!options.length) break
      prev = cur
      cur = options[Math.floor(rand() * options.length)]
    }
    if (pts.length >= 3) out.push(pts.join(' '))
  }
  return out
})()

/**
 * A section's outline: the boundary of its four cells, as an ordered ring.
 *
 * Computed rather than drawn. List the four cells' 24 edges, drop the five any two of them share, and
 * the 14 that remain are the boundary; threading those by shared vertex gives the perimeter in order. So
 * the path is always exactly that section's outline and can never stray into the middle.
 */
function sectionLoop(cells: readonly Cell[]): string {
  const edges = new Map<string, [[string, [number, number]], [string, [number, number]]]>()
  cells.forEach((cell) => {
    const c = pos(cell.q, cell.r)
    const corners = CORNERS.map(([vx, vy]) => [c.x + vx, c.y + vy] as [number, number])
    corners.forEach((p, i) => {
      const n = corners[(i + 1) % 6]
      const a = vkey(p[0], p[1])
      const b = vkey(n[0], n[1])
      const k = a < b ? `${a}|${b}` : `${b}|${a}`
      /* Seen twice means two cells share it, so it is interior. */
      if (edges.has(k)) edges.delete(k)
      else edges.set(k, [[a, p], [b, n]])
    })
  })

  const adj = new Map<string, string[]>()
  const at = new Map<string, [number, number]>()
  edges.forEach(([[a, pa], [b, pb]]) => {
    at.set(a, pa)
    at.set(b, pb)
    if (!adj.has(a)) adj.set(a, [])
    if (!adj.has(b)) adj.set(b, [])
    adj.get(a)!.push(b)
    adj.get(b)!.push(a)
  })

  const start = [...adj.keys()].sort()[0]
  if (!start) return ''
  const ring = [start]
  let prev: string | null = null
  let cur = start
  for (let i = 0; i < 64; i += 1) {
    const next = (adj.get(cur) ?? []).find((n) => n !== prev)
    if (!next || next === start) break
    ring.push(next)
    prev = cur
    cur = next
  }
  return ring.map((v) => at.get(v)!).map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join(' ')
}

const SECTION_LOOPS = CLUSTER_CELLS.map(sectionLoop)

/** The hub's own loop, at 1.10 of its silhouette so it rides just outside the solid edge. */
const HUB_LOOP = CORNERS.map(([x, y]) => [x * 1.8 * 0.88 * 1.1, y * 1.8 * 0.88 * 1.1])
  .map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`)
  .join(' ')

/** Breadth-first over the vertex graph: the shortest route along lattice edges from one corner to another. */
function pathBetween(from: string, to: string): [number, number][] | null {
  const prev = new Map<string, string | null>([[from, null]])
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) break
    for (const nb of ADJ.get(cur) ?? []) {
      if (!prev.has(nb)) {
        prev.set(nb, cur)
        queue.push(nb)
      }
    }
  }
  if (!prev.has(to)) return null
  const out: [number, number][] = []
  for (let cur: string | null | undefined = to; cur; cur = prev.get(cur)) out.push(VERT.get(cur)!)
  return out.reverse()
}

/**
 * The connectors: one route from the hub out to each section, so the figure says the products are wired
 * to the platform rather than merely arranged around it.
 *
 * They start on the first ring of vertices *outside* the hub, which is 1.0 cells out. Not 0.866 — that
 * is the lattice's neighbour distance, not a vertex radius, and anchoring to it matched nothing and
 * produced four empty strings with no error at all.
 */
const CONNECTORS: string[] = CLUSTER_CELLS.map((cells) => {
  const inner = cells.reduce((a, b) => {
    const pa = pos(a.q, a.r)
    const pb = pos(b.q, b.r)
    return Math.hypot(pa.x, pa.y) < Math.hypot(pb.x, pb.y) ? a : b
  })
  const i = pos(inner.q, inner.r)

  const start = [...VERT.entries()]
    .filter(([, p]) => Math.abs(Math.hypot(p[0], p[1]) - 1) < 0.06)
    .sort(([, a], [, b]) => {
      const da = (a[0] * i.x + a[1] * i.y) / Math.hypot(a[0], a[1])
      const db = (b[0] * i.x + b[1] * i.y) / Math.hypot(b[0], b[1])
      return db - da
    })[0]

  const target = CORNERS.map(([vx, vy]) => [i.x + vx, i.y + vy] as [number, number]).sort(
    (a, b) => Math.hypot(b[0], b[1]) - Math.hypot(a[0], a[1]),
  )[0]
  const end = [...VERT.entries()].sort(
    ([, a], [, b]) =>
      Math.hypot(a[0] - target[0], a[1] - target[1]) - Math.hypot(b[0] - target[0], b[1] - target[1]),
  )[0]

  if (!start || !end) return ''
  const route = pathBetween(start[0], end[0])
  if (!route || route.length < 3) return ''
  return route.map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join(' ')
}).filter(Boolean)

export interface CapabilityMapProps extends BoxProps, Omit<ElementProps<'div'>, 'title'> {
  /**
   * The four sections, clockwise from the top left. Fewer than four is fine — the map draws the ones it
   * is given — and more than four are dropped, since there is no fifth diamond.
   */
  clusters: CapabilityCluster[]

  /** The thing at the centre: `IconGlassDXP` for the product map. */
  hubIcon?: ReactNode
  /** The name under it. */
  hubLabel?: ReactNode
  /** Where the hub goes, if it is a target too. */
  hubHref?: string

  /**
   * The gradient behind the hub — the light the whole figure sits in.
   *
   * Static and deliberately strong. Nothing in this figure pulses, so the centre's presence has to come
   * from the wash being *there* rather than from it moving.
   *
   * @default true
   */
  wash?: boolean

  /**
   * The network: traces walking the lattice, a loop around each section, and a connector from the hub
   * out to each one.
   *
   * Off under `prefers-reduced-motion` except the connectors, which carry the topology and are worth
   * keeping still and visible.
   *
   * @default true
   */
  network?: boolean
}

/**
 * Writes the pointer's position onto the tile as `--sds-card-x/y`, the same two custom properties
 * `Card` uses, so the hover outline and the sheen light from where the pointer entered.
 *
 * Straight to the element rather than through state: it fires on every pointer move, and a re-render
 * per frame to move a gradient buys nothing. Mouse only — a finger does not hover, and a drag across
 * the map should not light every tile it crosses.
 */
const track = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType !== 'mouse') return
  const box = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--sds-card-x', `${event.clientX - box.left}px`)
  event.currentTarget.style.setProperty('--sds-card-y', `${event.clientY - box.top}px`)
}

/** A cell's position, as the two numbers the stylesheet needs to place it. */
const place = (q: number, r: number): CSSProperties =>
  ({ '--sds-map-q': q, '--sds-map-r': rowOf(q, r) }) as CSSProperties

/** Which arrow key moves which way. */
const DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
}

/**
 * CapabilityMap — the product constellation from the homepage redesign
 * (`Homepage Redesign`, node `7703:16084`): sixteen products in four sections of four, around the
 * platform they all sit on.
 *
 * ```tsx
 * <CapabilityMap
 *   hubIcon={<IconGlassDXP />}
 *   hubLabel="DXP"
 *   clusters={[
 *     { label: 'Commerce & Sales', items: [
 *       { label: 'PIM', icon: <IconGlassPIM />, href: '/pim' },
 *       …four in all, read top, left, right, bottom
 *     ] },
 *     …four sections, clockwise from the top left
 *   ]}
 * />
 * ```
 *
 * ## A honeycomb, and why nothing can overlap
 *
 * The tiles are **flat-top hexagons on a hexagonal lattice**. Each is placed by lattice cell — a column
 * and a row — and the stylesheet turns a cell into a position with three constants: a column is
 * `0.75 × tile` across, a row is `0.866 × tile` down, and odd columns hang half a row lower.
 *
 * That is the whole guarantee. Two different cells are at least one hexagon apart *because the
 * arithmetic says so*, so there is no table of positions anyone has to keep true and no z-order to
 * arbitrate between shapes that overlap. A tile then fills 88% of its cell, which turns the leftover
 * into an even gap on all six sides.
 *
 * A section is a **diamond of four cells around an empty one** — the shape the Figma frame draws, and
 * the tightest of the twelve symmetric arrangements the lattice allows without two sections touching. A
 * fifth item or section is **dropped**: silently reflowing would break the lattice, and throwing would
 * take a page down over a content edit.
 *
 * ## The network
 *
 * Three things share one SVG layer, all of them walking the lattice's own edges rather than cutting
 * across it: two dozen short **traces** that draw themselves on and off, a **loop** around each
 * section's outline and the hub's, and a **connector** from the hub out to each section.
 *
 * Every line is stroked with one gradient in `objectBoundingBox` units, so each runs base
 * `Brand/Primary` to base `Accent/Product Accent` along its own length from a single definition. The
 * connectors sit a step brighter than the traffic because they are the part carrying a message.
 *
 * Two rendering rules the hard way. `pathLength` and `vector-effect: non-scaling-stroke` **cannot both**
 * apply to one stroke: the second measures a normalised dash in device pixels and turns a travelling
 * line into a row of dots. And nothing may render below about 1.25 device pixels, which is where a
 * diagonal stops antialiasing and starts flickering — hence `--sds-map-tw`, a floor this component sets
 * from its own rendered width.
 *
 * ## Interaction
 *
 * `Card`'s hover, on a hexagon: the tile grows to 1.14, its edge fills with `card-Focus Ring` lit from
 * where the pointer entered, a sheen follows the cursor across the glass, and the label comes up to
 * full white. Focus mirrors it exactly, so the keyboard sees the same tile.
 *
 * On top of that, **the section stays lit**: everything outside the hovered tile's section drops
 * further than the section itself, and the section's name comes up with its four tiles. The hover
 * teaches the taxonomy instead of a legend.
 *
 * **Arrow keys walk the lattice.** Tab order on a spatial figure follows the DOM rather than the
 * drawing; the arrow keys move to the nearest tile in that direction, through a 70° cone — wide,
 * because a hexagon lattice's only off-vertical neighbours are at 60° and a tighter cone skips them.
 *
 * A tile with no `href` and no `onClick` gets none of it, so a capability without a page yet does not
 * promise one.
 *
 * ## The hub
 *
 * The one block that is not glass: opaque, with no backdrop-filter, and lit from within by a radial of
 * `Brand/Primary`. Being solid is what lets the traces cross the middle — a line passing behind a
 * platform disappears behind it — and it keeps the brightest edge in the figure around the thing the
 * figure is about. Its `Components/Glass Line` is the full token value where a tile's is half, because
 * sixteen tiles at full strength made the edges the brightest thing on screen and the centre the
 * dimmest.
 *
 * Nothing here pulses. Every keyframe for it is still defined; see `wash` and the notes in the
 * stylesheet.
 */
export const CapabilityMap = forwardRef<HTMLDivElement, CapabilityMapProps>(function CapabilityMap(
  { clusters, hubIcon, hubLabel, hubHref, wash = true, network = true, className, ...props },
  ref,
) {
  const HubTag: ElementType = hubHref ? 'a' : 'div'
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const tiles = useRef<(HTMLElement | null)[]>([])

  const cells = clusters
    .slice(0, 4)
    .flatMap((cluster, ci) =>
      cluster.items.slice(0, 4).map((item, ii) => ({ item, cell: CLUSTER_CELLS[ci][ii], group: ci })),
    )

  /**
   * The stroke floor. Widths are authored in tiles so they scale with the figure; this only steps in
   * when the figure is small enough that the thinnest of them would land under 1.25 device pixels.
   */
  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    const CORE_W = 0.013
    const set = () => {
      const unit = field.getBoundingClientRect().width / CANVAS.w
      if (!unit) return
      field.style.setProperty('--sds-map-tw', String(Math.max(1, 1.25 / (CORE_W * unit))))
    }
    set()
    const observer = new ResizeObserver(set)
    observer.observe(field)
    return () => observer.disconnect()
  }, [])

  /** Lighting a section is a property of the cell, not of where the tile sits in the markup. */
  const markSection = useCallback(
    (group: number | null) => {
      const field = fieldRef.current
      if (!field) return
      field.querySelectorAll('[data-sds-group]').forEach((n) => n.removeAttribute('data-sds-group'))
      field.querySelectorAll('[data-sds-lit]').forEach((n) => n.removeAttribute('data-sds-lit'))
      if (group === null) return
      cells.forEach(({ group: g }, i) => {
        if (g === group) tiles.current[i]?.setAttribute('data-sds-group', '')
      })
      field.querySelector(`[data-sds-name="${group}"]`)?.setAttribute('data-sds-lit', '')
    },
    [cells],
  )

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dir = DIRS[event.key]
    if (!dir) return
    const from = tiles.current.indexOf(document.activeElement as HTMLElement)
    if (from < 0) return
    event.preventDefault()
    const a = cells[from].cell
    const pa = pos(a.q, a.r)
    let best = -1
    let bestD = Infinity
    cells.forEach(({ cell }, i) => {
      if (i === from) return
      const p = pos(cell.q, cell.r)
      const dx = p.x - pa.x
      const dy = p.y - pa.y
      const len = Math.hypot(dx, dy) || 1
      /* A 70° cone: a hexagon lattice's only off-vertical neighbours sit at 60°. */
      if ((dx / len) * dir[0] + (dy / len) * dir[1] < 0.34) return
      if (len < bestD) {
        bestD = len
        best = i
      }
    })
    if (best >= 0) tiles.current[best]?.focus()
  }

  const viewBox = `${-CANVAS.w / 2} ${-CANVAS.h / 2} ${CANVAS.w} ${CANVAS.h}`

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        fieldRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={[classes.mapRoot, className].filter(Boolean).join(' ')}
      onKeyDown={onKeyDown}
      onPointerLeave={() => markSection(null)}
      /*
       * The canvas is the one place the figure's overall size is decided, so it is set here rather than
       * duplicated in the stylesheet: the box's proportions and the tile's share of its width both come
       * out of `CANVAS`, and a change to either cannot get halfway applied.
       */
      style={
        {
          aspectRatio: `${CANVAS.w} / ${CANVAS.h}`,
          '--sds-map-tile': `${100 / CANVAS.w}cqw`,
        } as CSSProperties
      }
      {...props}
    >
      {wash ? (
        <span className={classes.mapWash} aria-hidden>
          <span />
          <span />
          <span />
        </span>
      ) : null}

      {network ? (
        <svg
          className={classes.mapNetwork}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          {/*
           * One gradient for every line. `objectBoundingBox` units resolve it against each line's own
           * box, so all of them run blue to purple along their own length from one definition.
           */}
          <defs>
            <linearGradient id="sds-map-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--sds-brand-primary-primary)" />
              <stop offset="1" stopColor="var(--sds-accent-product-accent)" />
            </linearGradient>
          </defs>

          {WALKS.map((points, i) => {
            const style = { '--sds-map-delay': `${-(i * (7.5 / WALKS.length)).toFixed(2)}s` } as CSSProperties
            return (
              <g key={`walk-${i}`}>
                <polyline className={classes.mapTraceHalo} points={points} pathLength={100} style={style} />
                <polyline className={classes.mapTrace} points={points} pathLength={100} style={style} />
              </g>
            )
          })}

          {[HUB_LOOP, ...SECTION_LOOPS].map((points, i) => {
            const style = { '--sds-map-delay': `${(i * -4.75).toFixed(1)}s` } as CSSProperties
            return (
              <g key={`loop-${i}`}>
                <polygon className={classes.mapLoopRest} points={points} />
                <polygon className={classes.mapLoopHalo} points={points} pathLength={100} style={style} />
                <polygon className={classes.mapLoop} points={points} pathLength={100} style={style} />
              </g>
            )
          })}

          {CONNECTORS.map((points, i) => {
            const style = { '--sds-map-delay': `${(i * -1.6).toFixed(1)}s` } as CSSProperties
            return (
              <g key={`link-${i}`}>
                <polyline className={classes.mapLinkHalo} points={points} pathLength={100} style={style} />
                <polyline className={classes.mapLink} points={points} pathLength={100} style={style} />
              </g>
            )
          })}
        </svg>
      ) : null}

      {clusters.slice(0, 4).map((cluster, i) => (
        <div
          key={cluster.label}
          className={classes.mapName}
          data-sds-name={i}
          style={{ '--sds-map-nx': NAME_AT[i].x, '--sds-map-ny': NAME_AT[i].y } as CSSProperties}
        >
          {cluster.label}
        </div>
      ))}

      {hubIcon || hubLabel ? (
        <HubTag
          href={hubHref}
          className={`${classes.mapTile} ${classes.mapHub}`}
          data-interactive={hubHref ? true : undefined}
          onPointerMove={hubHref ? track : undefined}
          style={place(0, 0)}
        >
          <span className={classes.mapTileBody}>
            <span className={classes.mapTileFace} aria-hidden />
            <span className={classes.mapTileWell} aria-hidden />
            <span className={classes.mapTileCore} aria-hidden />
            <span className={classes.mapTileSheen} aria-hidden />
            <span className={classes.mapTileIcon} data-hub>
              {hubIcon}
            </span>
            {hubLabel ? <span className={classes.mapTileLabel}>{hubLabel}</span> : null}
          </span>
        </HubTag>
      ) : null}

      {cells.map(({ item, cell }, i) => {
        const clickable = Boolean(item.href || item.onClick)
        const Tag: ElementType = item.href ? 'a' : item.onClick ? 'button' : 'div'

        return (
          <Tag
            key={item.label}
            ref={(node: HTMLElement | null) => {
              tiles.current[i] = node
            }}
            href={item.href}
            type={!item.href && item.onClick ? 'button' : undefined}
            onClick={item.onClick}
            onPointerMove={clickable ? track : undefined}
            onPointerEnter={() => markSection(cells[i].group)}
            onFocus={() => markSection(cells[i].group)}
            onBlur={() => markSection(null)}
            className={classes.mapTile}
            data-interactive={clickable || undefined}
            aria-label={item.description ?? undefined}
            style={place(cell.q, cell.r)}
          >
            <span className={classes.mapTileBody}>
              <span className={classes.mapTileFace} aria-hidden />
              <span className={classes.mapTileWell} aria-hidden />
              <span className={classes.mapTileSheen} aria-hidden />
              <span className={classes.mapTileIcon}>{item.icon}</span>
              <span className={classes.mapTileLabel}>{item.label}</span>
            </span>
          </Tag>
        )
      })}
    </Box>
  )
})
