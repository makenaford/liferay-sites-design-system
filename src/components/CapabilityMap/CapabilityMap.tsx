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
/** A cell on the lattice: a column, and a row in units of one row-step. */
interface Cell {
  q: number
  r: number
}

/**
 * The two lattices the map can be drawn on.
 *
 * Everything below this point — a section's outline, its connector, the leader to an outside name, the
 * traces wandering the field, the empty grid behind them — is **computed from the cells and the tile's
 * corners**. Nothing is a measurement anyone typed twice. That is what makes a second lattice cheap
 * enough to be worth having: an octagon is nine numbers and four lists of cells, and every line in the
 * drawing follows from them.
 *
 * `hexagon` is the figure `Homepage Redesign` draws and the default. `octagon` is the earlier
 * exploration — octagons on a square grid, the way `dxp-grid` had it — kept because the two answer the
 * same question differently: a honeycomb packs tighter and reads as one surface, a square grid reads as
 * a set of things placed on a plane.
 */
interface Lattice {
  /** The tile's corners for a tile of width 1 centred on the origin, in tiles. */
  corners: readonly (readonly [number, number])[]
  /** A cell's centre, in tiles. */
  pos: (q: number, r: number) => { x: number; y: number }
  /** A tile's height as a share of its width. */
  ratio: number
  /** The tile's silhouette, for `clip-path`. */
  clip: string
  /** A column and a row, in tiles: what the stylesheet multiplies a cell by. */
  step: { x: number; y: number }
  /** The four sections when their names sit in the hollow they ring. */
  cellsNested: readonly (readonly Cell[])[]
  /** The four sections when their names sit outside the figure. */
  cellsTight: readonly (readonly Cell[])[]
  /** Where a nested name goes: the hollow its four tiles ring. */
  nameAt: readonly { x: number; y: number }[]
  /** Where an outside name goes, and where its leader starts. */
  nameAtOutside: readonly { x: number; y: number }[]
  /** The figure's box, in tiles, for each name placement. */
  canvas: { w: number; h: number }
  canvasOutside: { w: number; h: number }
  /** How far the drawing is lifted inside its box, in tiles. */
  oy: number
  /** The hub's width, in tiles. */
  hub: number
  /** How much of its cell a tile fills; the rest is the gap. */
  fill: number
  /**
   * How far the label and icon are held off the tile's left and right edges, in tiles.
   *
   * A property of the silhouette, not a margin anyone likes the look of: a hexagon comes to a point on
   * both sides and its text has to clear the taper, while an octagon's cut corners are a fifth of its
   * width and leave a straight edge either side of the label's own line. The hexagon's inset applied to
   * an octagon simply throws away room the shape has, which is what was breaking `Commerce` mid-word.
   */
  padX: number
}

/** Odd columns hang half a row lower. This one line is the honeycomb. */
const rowOfHex = (q: number, r: number) => (Math.abs(q) % 2 === 1 ? r + 0.5 : r)

/** A flat-top hexagon of width 1, centred on the origin: the corner offsets, in tiles. */
const HEX_CORNERS = [
  [-0.25, -0.4330127],
  [0.25, -0.4330127],
  [0.5, 0],
  [0.25, 0.4330127],
  [-0.25, 0.4330127],
  [-0.5, 0],
] as const

/**
 * A regular octagon of width 1. The cut is `(√2 - 1) / 2 ≈ 0.2071` of the width off each corner, which
 * is what makes all eight edges the same length — the same fact the hexagon's 25% corner cuts carry.
 */
const OCT_C = 0.2071068
const OCT_CORNERS = [
  [-OCT_C, -0.5],
  [OCT_C, -0.5],
  [0.5, -OCT_C],
  [0.5, OCT_C],
  [OCT_C, 0.5],
  [-OCT_C, 0.5],
  [-0.5, OCT_C],
  [-0.5, -OCT_C],
] as const

const HEXAGON: Lattice = {
  corners: HEX_CORNERS,
  pos: (q, r) => ({ x: q * 0.75, y: rowOfHex(q, r) * 0.8660254 }),
  ratio: 0.8660254,
  clip: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  step: { x: 0.75, y: 0.8660254 },

  /*
   * Where each section's four tiles sit, and the cell they leave empty in the middle.
   *
   * A section is **four tiles ringing a hollow**, and the hollow holds the section's name — the shape
   * `Homepage Redesign` node `7435:7003` draws. It is a ring of five neighbours with two left open, and
   * the two left open are the pair facing the hub, so each section reads as a C turned toward the middle
   * and the connector has somewhere to arrive.
   *
   * Naming a group by sitting inside it is what the old arrangement could not do. The name used to be
   * set above or below the whole figure, which left the pairing to be inferred from position, and it
   * cost two rows of canvas that came straight off the size of the hexagons.
   *
   * Listed in the order a section's four products are read: the tile beyond the hollow first, then its
   * two flanks, then the one that hangs on the hub side.
   */
  cellsNested: [
    /* Upper left — the hollow is (-2,-1), and (-1,-2) / (-2,0) are left open toward the hub. */
    [
      { q: -2, r: -2 },
      { q: -3, r: -2 },
      { q: -1, r: -2 },
      { q: -3, r: -1 },
    ],
    /* Upper right — the same ring mirrored, hollow (2,-1). */
    [
      { q: 2, r: -2 },
      { q: 1, r: -2 },
      { q: 3, r: -2 },
      { q: 3, r: -1 },
    ],
    /*
     * Lower right — hollow (2,2), a row further out than the upper pair.
     *
     * Not the upper ring mirrored, which is what it looks like it should be. A mirrored ring puts its
     * hub-side tile one row from the upper ring's, and one row *is* touching on this lattice: the two
     * sections would fuse into one eight-tile mass. Dropping the lower hollows to r=2 buys the row back
     * and costs the figure its top-to-bottom symmetry, which `oy` then re-centres.
     */
    [
      { q: 2, r: 1 },
      { q: 3, r: 1 },
      { q: 1, r: 1 },
      { q: 1, r: 2 },
    ],
    /* Lower left — hollow (-2,2), mirroring the lower right. */
    [
      { q: -2, r: 1 },
      { q: -3, r: 1 },
      { q: -1, r: 1 },
      { q: -1, r: 2 },
    ],
  ],

  /*
   * The tight arrangement, for when the names are **outside**: four tiles that touch, with no hollow.
   *
   * A section that carries its own name needs a hole to put it in; a section whose name is out on the
   * lattice does not, and a hole it does not need is a hole in the drawing. So this is the diamond the
   * figure was originally built on — a centre column of two with a flank on each side — which is what
   * `Homepage Redesign` node `8144:21713` draws beside each of its outside names.
   *
   * Listed top, left, right, bottom.
   */
  cellsTight: [
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
  ],

  /*
   * Where each section's name sits, in tiles from the centre: **the hollow its four tiles ring**, placed
   * by the same arithmetic as the tiles rather than by a measurement that could drift away from them.
   */
  nameAt: [
    { x: -1.5, y: -0.8660254 },
    { x: 1.5, y: -0.8660254 },
    { x: 1.5, y: 1.7320508 },
    { x: -1.5, y: 1.7320508 },
  ],

  /*
   * Where a name sits when it is set **outside** the figure — node `8144:21713`. Level with its own
   * group, out past the tiles, on the empty lattice beyond them.
   */
  nameAtOutside: [
    { x: -3.45, y: -1.2990381 },
    { x: 3.45, y: -1.2990381 },
    { x: 3.45, y: 1.2990381 },
    { x: -3.45, y: 1.2990381 },
  ],

  /*
   * The map's box, in tiles.
   *
   * Tiles reach 2.73 across, 2.17 above the hub and 2.60 below it, and the section names are inside the
   * figure now rather than beyond it, so nothing sits outside the tiles and the box is theirs alone. The
   * box's width divided by `w` **is** the tile, so every tile of slack here comes straight off the size
   * of the hexagons and the 14px text inside them.
   */
  canvas: { w: 5.6, h: 4.9 },

  /*
   * The box when the names are outside: a different figure, not the same one with margins. The sections
   * are the tight diamonds there, which are shorter than the rings — 4.33 tiles rather than 4.76 — and
   * the names then claim about four tiles of width on each side, glow included. The result is close to
   * 2:1, which is wider than any window, so **height is what binds** at every ordinary width.
   */
  canvasOutside: { w: 8.2, h: 4.5 },
  oy: -0.2165,

  /*
   * 1.9 cells across. It went to 2.5 while the sections were pushed out to ±4 columns and the middle was
   * empty; with them back at ±2 and their names inside them, 2.5 reached the section names. 1.9 is the
   * largest that clears the nearest tile — 2.14 cells out — with the gap the lattice gives everything
   * else. It is what `Homepage Redesign` draws, too.
   */
  hub: 1.9,
  fill: 0.95,
  padX: 0.11,
}

/**
 * The octagonal lattice: the **truncated square tiling**, which is the only way octagons tile a plane.
 *
 * Cells sit on a plain square grid one tile apart, so a tile shares its four flat edges with its
 * orthogonal neighbours and the diagonal corners leave a small square gap. Those gaps are the visible
 * difference between this and the honeycomb: a hexagon lattice has no leftover space, so the figure
 * reads as one cut surface, while the squares here read as a grid something has been placed on.
 *
 * It costs size, and the reason is worth stating plainly: a hexagon column advances 0.75 of a tile
 * because the columns interlock, and an octagon column advances a whole one. The same sixteen products
 * therefore need a 7-tile box rather than a 5.6-tile one, and since the tile *is* the box divided by
 * that number, every octagon is about a fifth smaller than the hexagon it replaces at the same width.
 *
 * The sections are the same four-around-a-hollow rings, one column further out and symmetric top to
 * bottom — the row of the hub is left empty, which is what keeps the upper and lower rings from
 * touching, so unlike the honeycomb this figure needs no lift inside its box.
 */
const OCTAGON: Lattice = {
  corners: OCT_CORNERS,
  pos: (q, r) => ({ x: q, y: r }),
  ratio: 1,
  clip: `polygon(${(0.5 - OCT_C) * 100}% 0%, ${(0.5 + OCT_C) * 100}% 0%, 100% ${(0.5 - OCT_C) * 100}%, 100% ${
    (0.5 + OCT_C) * 100
  }%, ${(0.5 + OCT_C) * 100}% 100%, ${(0.5 - OCT_C) * 100}% 100%, 0% ${(0.5 + OCT_C) * 100}%, 0% ${
    (0.5 - OCT_C) * 100
  }%)`,
  step: { x: 1, y: 1 },
  cellsNested: [
    [
      { q: -2, r: -3 },
      { q: -3, r: -2 },
      { q: -1, r: -2 },
      { q: -2, r: -1 },
    ],
    [
      { q: 2, r: -3 },
      { q: 1, r: -2 },
      { q: 3, r: -2 },
      { q: 2, r: -1 },
    ],
    [
      { q: 2, r: 3 },
      { q: 3, r: 2 },
      { q: 1, r: 2 },
      { q: 2, r: 1 },
    ],
    [
      { q: -2, r: 3 },
      { q: -3, r: 2 },
      { q: -1, r: 2 },
      { q: -2, r: 1 },
    ],
  ],
  /* Outside names: the 2x2 block the `dxp-grid` iteration used, which is the tightest four on a square grid. */
  cellsTight: [
    [
      { q: -3, r: -2 },
      { q: -2, r: -2 },
      { q: -3, r: -1 },
      { q: -2, r: -1 },
    ],
    [
      { q: 2, r: -2 },
      { q: 3, r: -2 },
      { q: 2, r: -1 },
      { q: 3, r: -1 },
    ],
    [
      { q: 2, r: 1 },
      { q: 3, r: 1 },
      { q: 2, r: 2 },
      { q: 3, r: 2 },
    ],
    [
      { q: -3, r: 1 },
      { q: -2, r: 1 },
      { q: -3, r: 2 },
      { q: -2, r: 2 },
    ],
  ],
  nameAt: [
    { x: -2, y: -2 },
    { x: 2, y: -2 },
    { x: 2, y: 2 },
    { x: -2, y: 2 },
  ],
  /*
   * As close in as the leader can still be a line. The blocks end at 3.5 tiles out and the name's box is
   * one tile wide, so 3.95 leaves the leader a fifth of a tile — the same gap the honeycomb's names
   * keep, measured the same way. Every tenth of a tile saved here is a tenth added to sixteen tiles.
   */
  nameAtOutside: [
    { x: -3.95, y: -1.5 },
    { x: 3.95, y: -1.5 },
    { x: 3.95, y: 1.5 },
    { x: -3.95, y: 1.5 },
  ],
  canvas: { w: 7.1, h: 7.1 },
  /*
   * 9.1 x 5.2. The blocks and their names span 8.9 tiles, and the height is the blocks' own 5 plus the
   * usual slack — this figure is wider than it is tall by nearly two to one, so **width binds** and the
   * tile is the window's width divided by 9.1. That division is the whole cost of the octagon: the same
   * sixteen products on the honeycomb divide 8.2, which is a fifth more tile for every one of them.
   */
  canvasOutside: { w: 9.1, h: 5.2 },
  /* Symmetric top to bottom — the hub's own row is the gap — so nothing needs lifting. */
  oy: 0,
  hub: 1.9,
  /*
   * A tighter gap than the honeycomb's. The square left at every diagonal is already a gap, so the 5%
   * that reads as an even seam between hexagons reads as tiles adrift here; 2% puts the flat edges back
   * within a hair of touching and lets the squares do the separating.
   */
  fill: 0.98,
  padX: 0.05,
}

/**
 * The box an outside name needs, in tiles.
 *
 * Narrow, and close in. The name is a label on the group beside it, not a heading for that side of the
 * figure, so it wants to be near enough that the leader reads as a tie rather than a journey — but not
 * so near that the line disappears and the name looks like it fell off the section. 1.0 wide leaves the
 * leader a fifth of a tile: short, and still unmistakably a line.
 *
 * The name is also aligned toward the figure — ranged right on the left side, left on the right — so the
 * words end where the leader begins. Centred in its box, a short name like `Search` stopped a third of a
 * tile short of its own line and read as much further out than it was.
 */
const NAME_OUTSIDE_W = 1

export type CapabilityShape = 'hexagon' | 'octagon'

/**
 * Everything the drawing needs, computed from one lattice.
 *
 * Built twice at module load rather than per render: the walks alone are a few thousand steps over a
 * vertex graph, and none of it depends on props.
 */
function build(L: Lattice) {
  const { corners: CORNERS, pos } = L
  const N = CORNERS.length
  const vkey = (x: number, y: number) => `${x.toFixed(3)},${y.toFixed(3)}`

  /**
   * The lattice's corners as a graph.
   *
   * Built over a range wider than the canvas so the network runs off every edge rather than stopping at
   * it. This is what the traces walk, and it is the reason a trace takes corners like the grid does
   * instead of cutting across it.
   */
  const VERT = new Map<string, [number, number]>()
  const ADJ = new Map<string, Set<string>>()
  for (let q = -8; q <= 8; q += 1) {
    for (let r = -8; r <= 8; r += 1) {
      const c = pos(q, r)
      const pts = CORNERS.map(([vx, vy]) => [c.x + vx, c.y + vy] as [number, number])
      pts.forEach((p, i) => {
        const n = pts[(i + 1) % N]
        const a = vkey(p[0], p[1])
        const b = vkey(n[0], n[1])
        if (!VERT.has(a)) VERT.set(a, p)
        if (!VERT.has(b)) VERT.set(b, n)
        if (!ADJ.has(a)) ADJ.set(a, new Set())
        if (!ADJ.has(b)) ADJ.set(b, new Set())
        ADJ.get(a)!.add(b)
        ADJ.get(b)!.add(a)
      })
    }
  }

  const BY_RADIUS = [...VERT.entries()].sort(
    ([, a], [, b]) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]),
  )

  /**
   * The wandering traces: short walks along the lattice edges.
   *
   * Starts are **seeded** at both ends of the field rather than left to chance. Drawn uniformly from
   * some five hundred vertices, a start almost never lands near the middle or out at the rim — measured,
   * the closest any line came to the centre was 2.78 cells. Four now begin at the core, where they run
   * behind the solid hub, and six at the outermost vertices, so the edges carry lines instead of
   * trailing off.
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
   * Computed rather than drawn. List the cells' edges, drop the ones any two of them share, and what
   * remains is the boundary; threading those by shared vertex gives the perimeter in order. So the path
   * is always exactly that section's outline and can never stray into the middle.
   */
  function sectionLoop(cells: readonly Cell[]): string {
    const edges = new Map<string, [[string, [number, number]], [string, [number, number]]]>()
    cells.forEach((cell) => {
      const c = pos(cell.q, cell.r)
      const pts = CORNERS.map(([vx, vy]) => [c.x + vx, c.y + vy] as [number, number])
      pts.forEach((p, i) => {
        const n = pts[(i + 1) % N]
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
    return ring
      .map((v) => at.get(v)!)
      .map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`)
      .join(' ')
  }

  /**
   * The leader from an outside name to the section it names.
   *
   * It ends **on the section's own outline** — the same loop the figure already draws — rather than
   * pointing vaguely at the group, so the name and the four tiles read as one object.
   *
   * Two segments, and the second one takes the lattice's own angle: a horizontal run out from the name,
   * then a leg at whatever slope this lattice's diagonal edge has — 60° on the honeycomb, 45° on the
   * octagons. A straight line from the name to the corner would be the only stroke in the drawing that
   * ignores the grid, and it looks like it.
   */
  const slope = L === OCTAGON ? 1 : 1.7320508
  const leaders = (nameW: number): string[] =>
    L.cellsTight.map((cells, i) => {
      const name = L.nameAtOutside[i]
      const dir = name.x < 0 ? 1 : -1
      const start = { x: name.x + dir * (nameW / 2), y: name.y }

      /*
       * The **end tile** — the one furthest out on the name's side — and the corner of it that faces the
       * name. Picked by which cell it is rather than by which corner happens to be nearest, so the line
       * always arrives at the same place in every section.
       */
      const end = cells.reduce((a, b) => (dir * pos(a.q, a.r).x < dir * pos(b.q, b.r).x ? a : b))
      const c = pos(end.q, end.r)
      const target = CORNERS.map(([vx, vy]) => ({ x: c.x + vx, y: c.y + vy })).reduce((a, b) =>
        Math.hypot(a.x - start.x, a.y - start.y) < Math.hypot(b.x - start.x, b.y - start.y) ? a : b,
      )

      /* The elbow: back off along the run by however far the angled leg has to climb. */
      const rise = target.y - start.y
      const elbow = { x: target.x - (dir * Math.abs(rise)) / slope, y: start.y }

      return [start, elbow, target].map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`).join(' ')
    })

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
   * The connectors: one route from the hub out to each section, so the figure says the products are
   * wired to the platform rather than merely arranged around it.
   *
   * They start on the first ring of vertices *outside* the hub. Which ring that is depends on the tile:
   * the honeycomb's is 1.0 cells out — not 0.866, which is the lattice's neighbour distance and not a
   * vertex radius, and anchoring to it matched nothing and produced four empty strings with no error at
   * all. So the radius is found rather than assumed: the smallest vertex ring that clears the hub.
   */
  const hubClear = (L.hub / 2) * 1.05
  const ringR = [...VERT.values()]
    .map((p) => Math.hypot(p[0], p[1]))
    .filter((d) => d > hubClear)
    .sort((a, b) => a - b)[0]

  const connectorsFor = (all: readonly (readonly Cell[])[]): string[] =>
    all
      .map((cells) => {
        const inner = cells.reduce((a, b) => {
          const pa = pos(a.q, a.r)
          const pb = pos(b.q, b.r)
          return Math.hypot(pa.x, pa.y) < Math.hypot(pb.x, pb.y) ? a : b
        })
        const i = pos(inner.q, inner.r)

        const start = [...VERT.entries()]
          .filter(([, p]) => Math.abs(Math.hypot(p[0], p[1]) - ringR) < 0.06)
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
            Math.hypot(a[0] - target[0], a[1] - target[1]) -
            Math.hypot(b[0] - target[0], b[1] - target[1]),
        )[0]

        if (!start || !end) return ''
        const route = pathBetween(start[0], end[0])
        if (!route || route.length < 3) return ''
        return route.map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join(' ')
      })
      .filter(Boolean)

  /**
   * The empty lattice behind everything: every cell the canvas can show, drawn as an outline.
   *
   * This is the grid the figure is built on, which the figure itself only ever shows sixteen cells of.
   * Revealed under the pointer rather than drawn all the time — see `.mapGrid` — so the lattice is
   * something the reader uncovers by moving across the map instead of a texture behind it.
   *
   * One `<path>` for all of it. A hundred-odd polygons is a hundred-odd nodes to lay out and composite
   * on every frame of a mask that moves with the pointer; one path with a hundred subpaths is one node.
   */
  const gridPath = (box: { w: number; h: number }): string => {
    const reach = Math.max(box.w, box.h) / 2 + 1
    let d = ''
    for (let q = -12; q <= 12; q += 1) {
      for (let r = -12; r <= 12; r += 1) {
        const c = pos(q, r)
        if (Math.abs(c.x) > reach || Math.abs(c.y) > reach) continue
        d += CORNERS.map(([vx, vy], i) => `${i ? 'L' : 'M'}${(c.x + vx).toFixed(3)} ${(c.y + vy).toFixed(3)}`).join(' ')
        d += ' Z '
      }
    }
    return d
  }

  /** The hub's own loop, at 1.10 of its silhouette so it rides just outside the solid edge. */
  const hubLoop = CORNERS.map(([x, y]) => [x * L.hub * L.fill * 1.1, y * L.hub * L.fill * 1.1])
    .map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`)
    .join(' ')

  return {
    lattice: L,
    walks: WALKS,
    hubLoop,
    nested: {
      cells: L.cellsNested,
      nameAt: L.nameAt,
      canvas: L.canvas,
      oy: L.oy,
      loops: L.cellsNested.map(sectionLoop),
      connectors: connectorsFor(L.cellsNested),
      leaders: null as string[] | null,
      grid: gridPath(L.canvas),
    },
    outside: {
      cells: L.cellsTight,
      nameAt: L.nameAtOutside,
      canvas: L.canvasOutside,
      /* The tight sections mirror top to bottom, so this figure needs no lifting inside its box. */
      oy: 0,
      loops: L.cellsTight.map(sectionLoop),
      connectors: connectorsFor(L.cellsTight),
      leaders: leaders(NAME_OUTSIDE_W),
      grid: gridPath(L.canvasOutside),
    },
  }
}

/**
 * The two arrangements on each of the two lattices, each complete: where the tiles go, where the names
 * go, how big the box is, and the lines that follow from those. Nothing is shared between them but the
 * lattice itself, because a section's outline, its connector and its leader are all *computed from its
 * cells*.
 */
const GEOMETRY = {
  hexagon: build(HEXAGON),
  octagon: build(OCTAGON),
} as const

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
   * Where each section's name goes.
   *
   * `nested` sets it in the hollow its four tiles ring — `Homepage Redesign` node `7435:7003`. The name
   * is inside the thing it names, and the figure is compact, which is what makes the card big.
   *
   * `outside` sets it out past the tiles on the empty lattice, joined to the section by a leader that
   * lands on the section's own outline — node `8144:21713`. The name gets a whole line to itself and can
   * be as long as it likes, and the four groups read as four labelled objects rather than four
   * arrangements. It costs card size: the names claim about four tiles of width, and width is what binds
   * the card on a normal window.
   *
   * @default 'nested'
   */
  names?: 'nested' | 'outside'

  /**
   * The tile, and the lattice under it.
   *
   * `hexagon` is the figure the file draws: a honeycomb, which is the tighter of the two by a fifth and
   * which reads as one cut surface because it leaves no space between tiles.
   *
   * `octagon` is the earlier exploration, kept because it says something different. Octagons only tile a
   * plane alongside small squares, and those leftover squares are the whole character of it: the tiles
   * read as sixteen things set down on a grid rather than as one surface divided up. It costs size — a
   * hexagon column advances three-quarters of a tile and an octagon column a whole one, so the same
   * sixteen products need a 7-tile box instead of a 5.6-tile one, and every tile is about a fifth
   * smaller at the same width.
   *
   * @default 'hexagon'
   */
  shape?: CapabilityShape

  /**
   * The lattice itself, revealed under the pointer.
   *
   * The map draws sixteen cells of a grid that goes on past the edge of the canvas in every direction.
   * This shows the rest of it — every cell the box can hold, as an outline — through a soft circle that
   * follows the cursor, so moving across the figure uncovers the structure the figure is built on and
   * leaving it puts the structure away.
   *
   * Pointer only, and only where a pointer hovers: there is nothing to reveal on a touchscreen, and a
   * reader who asked for less motion gets the grid at rest rather than a circle chasing their finger.
   *
   * @default true
   */
  grid?: boolean
  /**
   * A ceiling on how tall the figure may be — a length, or a number of pixels.
   *
   * The map is square-ish and sized by its column, so a wide page gives it a height nobody asked for:
   * at 1100 across it is a little over 1000 tall, which is more than most windows have. This caps the
   * height and lets the **width** come down to meet it, so the figure stays whole and in proportion
   * instead of being cropped or scrolled through.
   *
   * It is a max-width underneath — `height × 5.8/5.4` — because a box with an `aspect-ratio` takes its
   * height from its width and not the other way round. Clamping the height directly would squash the
   * lattice.
   *
   * Any CSS length works, including one that reads the viewport:
   *
   * ```tsx
   * <CapabilityMap maxHeight="calc(100svh - 260px)" … />
   * ```
   *
   * Give a short window a floor rather than letting it shrink without limit, and work that floor back
   * from the card you want: a hexagon is `fill × height / 5.1`, so `max(860px, …)` is a 160px card. A
   * label scales with the figure down to 14px and then stops; below that the words wrap inside the
   * hexagon instead, and at about 75px per hexagon they start breaking mid-word.
   */
  maxHeight?: number | string
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

/**
 * The pointer's position on the map itself, as a percentage of the box, for the grid reveal's mask.
 *
 * Percentages rather than pixels because the mask is one gradient over a box whose size changes with the
 * column; and written straight to the element for the same reason `track` is — it fires on every pointer
 * move, and a re-render per frame to move a mask buys nothing.
 */
const trackField = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType !== 'mouse') return
  const box = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty(
    '--sds-map-gx',
    `${(((event.clientX - box.left) / box.width) * 100).toFixed(2)}%`,
  )
  event.currentTarget.style.setProperty(
    '--sds-map-gy',
    `${(((event.clientY - box.top) / box.height) * 100).toFixed(2)}%`,
  )
}

/**
 * A cell's position, as the two numbers the stylesheet needs to place it.
 *
 * The row is the lattice's own — a hexagon's odd columns hang half a row lower, an octagon's do not — so
 * this asks the lattice rather than assuming the honeycomb.
 */
const place = (L: Lattice, q: number, r: number): CSSProperties =>
  ({ '--sds-map-q': q, '--sds-map-r': L.pos(q, r).y / L.step.y }) as CSSProperties

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
  {
    clusters,
    hubIcon,
    hubLabel,
    hubHref,
    names = 'nested',
    shape = 'hexagon',
    grid = true,
    maxHeight,
    wash = true,
    network = true,
    className,
    style,
    ...props
  },
  ref,
) {
  const geometry = GEOMETRY[shape === 'octagon' ? 'octagon' : 'hexagon']
  const lattice = geometry.lattice
  const layout = geometry[names === 'outside' ? 'outside' : 'nested']
  const { canvas, nameAt } = layout

  const HubTag: ElementType = hubHref ? 'a' : 'div'
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const tiles = useRef<(HTMLElement | null)[]>([])

  const cells = clusters
    .slice(0, 4)
    .flatMap((cluster, ci) =>
      cluster.items.slice(0, 4).map((item, ii) => ({ item, cell: layout.cells[ci][ii], group: ci })),
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
      const unit = field.getBoundingClientRect().width / canvas.w
      if (!unit) return
      field.style.setProperty('--sds-map-tw', String(Math.max(1, 1.25 / (CORE_W * unit))))
    }
    set()
    const observer = new ResizeObserver(set)
    observer.observe(field)
    return () => observer.disconnect()
  }, [canvas.w])

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
    const pa = lattice.pos(a.q, a.r)
    let best = -1
    let bestD = Infinity
    cells.forEach(({ cell }, i) => {
      if (i === from) return
      const p = lattice.pos(cell.q, cell.r)
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

  /* The same lift the tiles get, applied to the window rather than to the paths inside it. */
  const viewBox = `${-canvas.w / 2} ${-canvas.h / 2 - layout.oy} ${canvas.w} ${canvas.h}`

  return (
    <Box
      ref={(node: HTMLDivElement | null) => {
        fieldRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={[classes.mapRoot, className].filter(Boolean).join(' ')}
      data-names={layout.leaders ? 'outside' : undefined}
      data-shape={shape === 'octagon' ? 'octagon' : undefined}
      onKeyDown={onKeyDown}
      onPointerMove={grid ? trackField : undefined}
      onPointerLeave={() => markSection(null)}
      /*
       * The canvas is the one place the figure's overall size is decided, so it is set here rather than
       * duplicated in the stylesheet: the box's proportions and the tile's share of its width both come
       * out of `CANVAS`, and a change to either cannot get halfway applied.
       */
      style={{
        ...({
          aspectRatio: `${canvas.w} / ${canvas.h}`,
          '--sds-map-tile': `${100 / canvas.w}cqw`,
          /*
           * The lattice, as the five numbers the stylesheet places tiles with. They live here rather
           * than in the stylesheet because they and the canvas above are the same fact — a tile's
           * silhouette, its step and the box it all has to fit in cannot get halfway changed if they
           * are written down once, together.
           */
          '--sds-map-shape': lattice.clip,
          '--sds-map-step-x': `calc(var(--sds-map-tile) * ${lattice.step.x})`,
          '--sds-map-step-y': `calc(var(--sds-map-tile) * ${lattice.step.y})`,
          '--sds-map-ratio': lattice.ratio,
          '--sds-map-oy': `calc(var(--sds-map-tile) * ${layout.oy})`,
          '--sds-map-hub-w': lattice.hub,
          '--sds-map-pad-x': `calc(var(--sds-map-tile) * ${lattice.padX})`,
          '--sds-map-fill': lattice.fill,
          /*
           * The height budget, spent as width. Parenthesised because `maxHeight` may itself be an
           * expression — `100svh - 260px` is only a valid calc operand once it is bracketed.
           */
          ...(maxHeight === undefined
            ? null
            : {
                '--sds-map-max-w': `calc((${
                  typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
                }) * ${canvas.w / canvas.h})`,
              }),
        } as CSSProperties),
        ...style,
      }}
      {...props}
    >
      {grid ? (
        <svg
          className={classes.mapGrid}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          <path d={layout.grid} />
        </svg>
      ) : null}

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

          {geometry.walks.map((points, i) => {
            const style = {
              '--sds-map-delay': `${-(i * (7.5 / geometry.walks.length)).toFixed(2)}s`,
            } as CSSProperties
            return (
              <g key={`walk-${i}`}>
                <polyline className={classes.mapTraceHalo} points={points} pathLength={100} style={style} />
                <polyline className={classes.mapTrace} points={points} pathLength={100} style={style} />
              </g>
            )
          })}

          {[geometry.hubLoop, ...layout.loops].map((points, i) => {
            const style = { '--sds-map-delay': `${(i * -4.75).toFixed(1)}s` } as CSSProperties
            return (
              <g key={`loop-${i}`}>
                <polygon className={classes.mapLoopRest} points={points} />
                <polygon className={classes.mapLoopHalo} points={points} pathLength={100} style={style} />
                <polygon className={classes.mapLoop} points={points} pathLength={100} style={style} />
              </g>
            )
          })}

          {layout.leaders?.map((points, i) => (
            <polyline key={`leader-${i}`} className={classes.mapLeader} points={points} />
          ))}

          {layout.connectors.map((points, i) => {
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
          data-side={nameAt[i].x < 0 ? 'start' : 'end'}
          style={{ '--sds-map-nx': nameAt[i].x, '--sds-map-ny': nameAt[i].y } as CSSProperties}
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
          style={place(lattice, 0, 0)}
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
            style={place(lattice, cell.q, cell.r)}
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
