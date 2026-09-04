import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface BubbleProps {
  /** How fast the bubbles wander, morph and pulse. @default 0.4 */
  speed?: number
  /**
   * Size of the bubbles, as a fraction of the **height**.
   *
   * Height, so the bubbles are the same size on a laptop and an ultrawide and the visible edge lands in
   * the same place on both. Measured against the width they would grow with the window, and the edge —
   * the thing that has to sit right against the copy in front of it — would move every time it changed.
   * Widening the frame adds room beside them instead, which `bubbleSpread` is there to use.
   *
   * @default 0.65
   */
  bubbleScale?: number
  /**
   * The distance between the two centres, as a fraction of the **height**.
   *
   * Height, like `bubbleScale`, so the gap between them holds as the window widens instead of opening up
   * — measured across the width, the pair drifts apart on a wide screen and the two shapes stop being
   * one form. Widening the frame now leaves more page either side of the pair rather than pulling it
   * open.
   *
   * Read against `bubbleScale`: close together they merge into one form, far apart they read as two
   * bubbles that happen to share a frame. The interesting range is where they just touch.
   *
   * @default 1.05
   */
  bubbleSpread?: number
  /**
   * How far each outline departs from a circle — the "changing form" part.
   *
   * Each bubble carries two harmonics turning at their own rates, so the outline is never the same shape
   * twice and never a shape you can name. 0 gives two plain circles.
   *
   * @default 0.2
   */
  bubbleMorph?: number
  /**
   * How tall the bubbles are, as a multiple of their width. 1 is a circle.
   *
   * Below 1 flattens them, so their lower edge sweeps across without the shape reaching so far down;
   * above 1 stretches them into columns. The axis to reach for when the edge is in the right place
   * horizontally but the wrong place vertically.
   *
   * Read with `bubbleY`: together they decide where the visible edge falls, which is the thing worth
   * placing against the content in front of it.
   *
   * @default 1
   */
  bubbleHeight?: number
  /**
   * How far the two are staggered vertically, as a fraction of the height — one rides higher, the other
   * lower, either side of `bubbleY`.
   *
   * 0 hangs them level, which is the one setting that reads as a single wide shape rather than two
   * bubbles: an edge that is the same height all the way across has nothing in it to say there are two.
   * Negative swaps which one is on top.
   *
   * @default 0.09
   */
  bubbleStagger?: number
  /**
   * How much bigger one bubble is than the other, as a seesaw around `bubbleScale`: one grows by this
   * fraction as the other shrinks by it, so the pair's average size does not move.
   *
   * 0 makes them identical — worth avoiding for the same reason as a stagger of 0, since two circles of
   * exactly one size read as a repeated shape rather than a pair. Negative makes the left one the larger.
   *
   * @default -0.1
   */
  bubbleBalance?: number
  /**
   * Where the pair sits horizontally, 0 being the left edge and 1 the right. The two bubbles are placed
   * either side of this, `bubbleSpread` apart.
   *
   * A fraction of the frame, like `bubbleY` — placement is the one thing that should follow the frame's
   * own proportions, while the sizes and the gap between the pair stay fixed against the height.
   *
   * @default 0.5
   */
  bubbleX?: number
  /**
   * Where the bubbles' centres sit vertically, 0 being the top edge and 1 the bottom.
   *
   * Well above centre by default, which is the point: the bubbles are bigger than the frame is tall, so
   * their tops run off it and what is left on screen is their **lower halves** — an edge sweeping across
   * the frame with colour above it, rather than two shapes sitting in the middle of it.
   *
   * @default 0.18
   */
  bubbleY?: number
  /** How much the bubbles swell and shrink as they go. @default 0.12 */
  bubblePulse?: number
  /** How far they drift from where they sit. @default 0.05 */
  bubbleWander?: number
  /** Softness of the bubbles' edge, as a fraction of the height. 0 is a crisp cut. @default 0.03 */
  edgeSoftness?: number
  /**
   * The colour everything outside the bubbles is painted in — **the page's own background**.
   *
   * This is what makes the component read as transparent without being transparent: the bubbles are not
   * shapes drawn *over* the mesh, they are the only places the plate covering it is missing. Accepts
   * `var(--token)` and resolves it against the canvas, which is what lets one value follow the scheme.
   *
   * @default 'var(--sds-surfaces-page-bg-base-default)'
   */
  surfaceColor?: string
  /**
   * The mesh's ground — the colour its masses sit on, used when `surfaceColor` resolves to a **dark**
   * surface. Worth keeping close to the surface itself, so the bubbles' interiors fall away into the
   * page where the colour thins out rather than ending on a disc.
   *
   * @default '#0b0a1c'
   */
  color?: string
  /** The mesh's lit colour on a dark surface. Masses are hues drifted off this one. @default '#6d3bf5' */
  hotColor?: string
  /**
   * The mesh's **second** lit colour on a dark surface — the other pole the masses are shared between.
   *
   * `richness` spreads hues either side of a colour, which varies a field without ever leaving it; this
   * gives the mesh a second colour to actually be. Each mass sits somewhere between the two by a fixed
   * amount, so both bubbles carry some of each rather than one going blue and the other violet.
   *
   * Hues interpolate the short way round the wheel, so a pair that straddles red does not travel through
   * green to meet.
   *
   * @default '#2563eb'
   */
  accentColor?: string
  /**
   * The ground on a **light** surface.
   *
   * One palette cannot serve both: a violet mesh that reads as depth on near-black reads as a stain on
   * white, and the text over it flips from light to dark at the same moment. Which pair is used is
   * decided by the luminance of the resolved `surfaceColor`, so it follows the colour scheme by the same
   * route the bubbles do — no separate flag to keep in sync.
   *
   * @default '#f2f0fb'
   */
  colorLight?: string
  /** The mesh's lit colour on a light surface. @default '#8b5cf6' */
  hotColorLight?: string
  /** The mesh's second lit colour on a light surface. @default '#93c5fd' */
  accentColorLight?: string
  /** How far the masses' hues drift either side of `hotColor` — the mesh's colour spread. @default 1 */
  richness?: number
  /**
   * How far the spectrum sweeps either side of the palette over time, in hue degrees.
   *
   * It **oscillates** rather than advances: the hue leaves the palette by up to this much and comes back.
   * An unbounded rotation would eventually put every hue on screen, which is how a violet mesh ends up
   * showing greens and golds — the palette stops meaning anything.
   *
   * Together with `richness`, the furthest any mass strays from `hotColor` is `richness * 70 + this`.
   *
   * @default 18
   */
  spectralDrift?: number
  /**
   * How strongly the mesh is carried by the bubbles, 0..1.
   *
   * The masses are positioned against the bubbles' own centres and radii, so when a bubble wanders, swells
   * or morphs, the colour inside it goes with it. At 0 they sit still in the canvas and the bubbles slide
   * over them like windows onto a fixed painting — which is a different, flatter effect, and occasionally
   * the one you want.
   *
   * @default 0.85
   */
  meshFollow?: number
  /** Vividness of the mesh. @default 1.05 */
  saturation?: number
  /** Size of the mesh's colour masses, relative to the bubble holding them. @default 1 */
  meshScale?: number
  /**
   * How far the colour masses travel inside their bubble.
   *
   * Distinct from `speed`, which sets how fast everything moves — this sets how *far* the colours go, so
   * the mesh can churn without the bubbles wandering faster. At 0 the masses hold station and the mesh
   * only changes because the bubble under it does; high, the colours circulate visibly within it.
   *
   * @default 1
   */
  meshMotion?: number
  /**
   * How far down the mesh dissolves into `surfaceColor` at the top edge, 0..1.
   *
   * **Off by default.** The bubbles already end the mesh on every side; this exists only for a component
   * whose ground has been pulled well away from the surface colour.
   *
   * @default 0
   */
  meshFade?: number
  /**
   * Brightness of the rim light around each bubble.
   *
   * Drawn between the mesh and the plate, so the plate trims whatever falls outside the outline and what
   * survives is a rim on the inside of the edge — light caught in the bubble's own skin. 0 turns the
   * layer off and skips its offscreen pass.
   *
   * @default 0.8
   */
  glow?: number
  /** Overall opacity of the rim layer, applied as it is composited. @default 0.9 */
  glowOpacity?: number
  /** The rim's colour on a dark surface. Its hues spread with `richness`, like the mesh's. @default '#c4a2ff' */
  glowColor?: string
  /** The rim's colour on a light surface. @default '#7c3aed' */
  glowColorLight?: string
  /** Thickness of the rim, as a fraction of the height. @default 0.16 */
  glowWidth?: number
  /**
   * How much the rim's own outline wanders off the bubble's, 1 tracking it exactly.
   *
   * Above 1 the rim carries an extra, slower harmonic of its own, so the light gathers on one part of the
   * edge and thins on another instead of ringing the whole outline evenly.
   *
   * @default 1.6
   */
  glowDistortion?: number
  /**
   * Moves the rim inside (positive) or outside (negative) the bubble's edge, as a fraction of its radius.
   *
   * Outside the edge it is trimmed by the plate, so pushing it out fades the rim rather than moving it;
   * pulling it in floats a ring of light within the bubble.
   *
   * @default 0.06
   */
  glowOffset?: number
  /**
   * How much of each outline is lit, from the bottom up.
   *
   * 1 rings the whole edge evenly. Below it the light is held back from the top and gathers along the
   * **lower** edge, which is where it belongs when the bubbles are hanging off the top of the frame:
   * light pools where a shape's underside catches it, and a ring lit all the way round reads as a
   * drawn outline instead.
   *
   * @default 0.45
   */
  glowArc?: number
  /**
   * How the rim is composited over the mesh.
   *
   * `screen` and `lighten` add light without flattening what is under them, which is usually what a glow
   * over a colour field wants; `overlay` and `soft-light` keep more of the mesh's own hue; `source-over`
   * paints it flat.
   *
   * @default 'screen'
   */
  glowBlend?: 'screen' | 'lighten' | 'overlay' | 'soft-light' | 'color-dodge' | 'source-over'
  /** Film grain strength. @default 0.035 */
  grain?: number
  /** Whether the pointer draws the bubbles toward it and steers the mesh. @default true */
  cursorInteraction?: boolean
  /** How far the bubbles are drawn toward the pointer, 0..1 of the distance. @default 0.16 */
  cursorLift?: number
  /** How close the pointer has to be to pull, as a fraction of the height. @default 0.5 */
  cursorReach?: number
  /** How far the pointer pulls the mesh within the bubbles — its parallax against them. @default 0.12 */
  meshDrift?: number
  /** Scale internal render resolution down under frame-time pressure. @default true */
  adaptiveQuality?: boolean
  /** Frame-rate budget adaptive quality scales against. @default 60 */
  targetFps?: number
  /** Overall opacity of the canvas. @default 1 */
  opacity?: number
  /** Freeze on the current frame. @default false */
  paused?: boolean
  className?: string
  style?: CSSProperties
}

export const BUBBLE_DEFAULTS: Required<Omit<BubbleProps, 'className' | 'style'>> = {
  speed: 0.4,
  /*
   * The average of the two, not the size of either — `bubbleBalance` puts one above it and one below.
   * It reads lower than the single size it replaced for that reason, and the pair renders the same.
   */
  bubbleScale: 0.59,
  bubbleSpread: 1.05,
  bubbleBalance: -0.1,
  bubbleHeight: 1,
  bubbleX: 0.5,
  bubbleY: 0.18,
  bubbleStagger: 0.09,
  bubbleMorph: 0.2,
  bubblePulse: 0.12,
  bubbleWander: 0.05,
  edgeSoftness: 0.03,
  surfaceColor: 'var(--sds-surfaces-page-bg-base-default)',
  color: '#0b0a1c',
  hotColor: '#6d3bf5',
  accentColor: '#2563eb',
  colorLight: '#f2f0fb',
  hotColorLight: '#8b5cf6',
  accentColorLight: '#93c5fd',
  richness: 1,
  spectralDrift: 18,
  meshFollow: 0.85,
  saturation: 1.05,
  meshScale: 1,
  meshMotion: 1,
  meshFade: 0,
  glow: 0.8,
  glowOpacity: 0.9,
  glowColor: '#c4a2ff',
  glowColorLight: '#7c3aed',
  glowWidth: 0.16,
  glowDistortion: 1.6,
  glowOffset: 0.06,
  glowArc: 0.45,
  glowBlend: 'screen',
  grain: 0.035,
  cursorInteraction: true,
  cursorLift: 0.16,
  cursorReach: 0.5,
  meshDrift: 0.12,
  adaptiveQuality: true,
  targetFps: 60,
  opacity: 1,
  paused: false,
}

/**
 * The two bubbles.
 *
 * A fixed pair rather than anything random or configurable in number: two is the shape of the thing, and
 * a designer tuning against a screenshot needs the same two to be there next time. `wobble` is the pair
 * of harmonics that morph the outline — `k` how many lobes, `a` how strongly, `s` how fast and which way
 * they turn — and the two entries differ so the bubbles never fall into the same shape at the same time.
 *
 * What is *not* here is how high each one hangs or how big it is relative to the other. Those were fixed
 * numbers in this table and are now `bubbleStagger` and `bubbleBalance`, because they are the difference
 * between the pair reading as two bubbles and as one shape drawn twice — which is a decision worth
 * making per use, not one to bake in here. `side` is all that remains of the distinction: which of the
 * two each one is.
 */
const BUBBLES = [
  {
    side: -1,
    rate: 0.23,
    phase: 0,
    wobble: [
      { k: 2, a: 1, s: 0.9 },
      { k: 3, a: 0.55, s: -0.7 },
    ],
  },
  {
    side: 1,
    rate: 0.19,
    phase: 2.1,
    wobble: [
      { k: 3, a: 0.85, s: -0.8 },
      { k: 2, a: 0.5, s: 0.62 },
    ],
  },
]

/**
 * The mesh's colour masses, each one belonging to a bubble and placed in *its* coordinates — `x` and `y`
 * are offsets from that bubble's centre in units of its radius, so a mass stays where it was put however
 * the bubble wanders, swells or morphs. `hue` is its offset either side of `hotColor`, in `richness`
 * units.
 */
const MESH_BLOBS = [
  { bubble: 0, x: -0.35, y: -0.3, r: 0.85, hue: -1, tint: 0.85, light: 0.95, rate: 0.21, phase: 0, orbit: 0.06 },
  { bubble: 0, x: 0.3, y: 0.25, r: 0.95, hue: -0.25, tint: 0.1, light: 1.05, rate: 0.17, phase: 1.9, orbit: 0.07 },
  { bubble: 0, x: 0.1, y: -0.45, r: 0.6, hue: 0.4, tint: 0.5, light: 0.9, rate: 0.26, phase: 4.2, orbit: 0.05 },
  { bubble: 1, x: -0.25, y: 0.3, r: 0.8, hue: 0.35, tint: 0.15, light: 1, rate: 0.23, phase: 3.4, orbit: 0.06 },
  { bubble: 1, x: 0.3, y: -0.2, r: 0.9, hue: 1, tint: 0.9, light: 1.1, rate: 0.15, phase: 5.1, orbit: 0.08 },
]

/**
 * Hue interpolation the short way round the wheel.
 *
 * A straight lerp between two hues takes whichever route the numbers happen to describe, so a pair
 * straddling red — 350 and 10 — travels 340 degrees through green to cover what is really a 20 degree
 * gap, and the mesh sweeps the whole spectrum on its way between two neighbouring colours.
 */
function lerpHue(from: number, to: number, t: number): number {
  return from + ((((to - from) % 360) + 540) % 360 - 180) * t
}

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

function hexToHsl(hex: string): [number, number, number] {
  const m = hex.replace('#', '')
  const full = m.length === 3
    ? m.split('').map((c) => c + c).join('')
    : m
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hsl(h: number, s: number, l: number, a = 1): string {
  const hue = ((h % 360) + 360) % 360
  return `hsla(${hue.toFixed(1)}, ${Math.min(100, s * 100).toFixed(1)}%, ${Math.min(100, l * 100).toFixed(1)}%, ${a})`
}

/**
 * A CSS colour as something `fillStyle` will take: `var(--token)` resolved against the element it is
 * drawn in, so `surfaceColor` can name a token and follow the colour scheme.
 */
function resolveColor(el: Element, value: string): string {
  const match = /^var\(\s*(--[^,)\s]+)\s*(?:,([\s\S]*))?\)$/.exec(value.trim())
  if (!match) return value
  const resolved = getComputedStyle(el).getPropertyValue(match[1]).trim()
  if (resolved) return resolved
  return match[2] ? resolveColor(el, match[2].trim()) : 'transparent'
}

/**
 * A colour's channels, via the canvas's own parser.
 *
 * Needed because the mesh's fade has to end on `surfaceColor` at **zero alpha**, and a gradient run to
 * the `transparent` keyword ends on transparent *black* — which greys the middle of the fade on any
 * surface that is not black. Assigning to `fillStyle` and reading it back normalises whatever the token
 * held into a form worth parsing, so the fade can hold the colour and move only the alpha.
 */
function toRgb(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  const previous = ctx.fillStyle
  ctx.fillStyle = color
  const normalised = ctx.fillStyle
  ctx.fillStyle = previous
  if (typeof normalised === 'string') {
    if (normalised.startsWith('#')) {
      const hex = normalised.slice(1)
      const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
      return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16),
      ]
    }
    const nums = normalised.match(/[\d.]+/g)
    if (nums && nums.length >= 3) return [Number(nums[0]), Number(nums[1]), Number(nums[2])]
  }
  return [0, 0, 0]
}

function makeNoiseTile(size: number): HTMLCanvasElement {
  const tile = document.createElement('canvas')
  tile.width = tile.height = size
  const g = tile.getContext('2d')!
  const img = g.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  g.putImageData(img, 0, 0)
  return tile
}

/**
 * A closed Catmull-Rom loop as cubic beziers, so an outline sampled at a few dozen angles reads as one
 * smooth shape rather than a polygon. Closed rather than open: the indices wrap, which is what keeps the
 * seam at angle 0 from showing as a corner.
 */
function traceClosed(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  const n = pts.length
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
      p2[0],
      p2[1],
    )
  }
  ctx.closePath()
}

/**
 * Bubble — two morphing bubbles, filled with a drifting colour mesh.
 *
 * Three passes on one canvas, and the last is the whole trick:
 *
 * 1. **The mesh.** Overlapping soft colour masses on a deep ground, each sitting somewhere between
 *    `hotColor` and `accentColor`, with hues drifted either side of that by `richness` and swept around
 *    by `spectralDrift`. Every mass belongs to a bubble and is placed in that bubble's own coordinates,
 *    so the colour wanders, swells and morphs with it.
 * 2. **The rim.** A blurred outline just inside each bubble's edge, composited with `glowBlend` so it
 *    sits in the mesh rather than on it.
 * 3. **The plate.** `surfaceColor` — *the page's own background* — filling everything **except** the two
 *    bubbles, punched out with an even-odd fill.
 *
 * So nothing is lit and nothing is blended with the page. The component is opaque everywhere and still
 * reads as two bubbles floating on the page, because everywhere that is not a bubble it is painting
 * exactly what the page would have painted. That is worth stating plainly: **`surfaceColor` has to match
 * the surface the component is sitting on**, or the bubbles become a coloured rectangle with two holes
 * in it. It defaults to the page-background token and resolves `var()` against the canvas, so it follows
 * the colour scheme on its own; pass a concrete colour when the component sits on something else.
 *
 * The pointer draws the bubbles toward it (`cursorLift`, `cursorReach`) and pulls the mesh within them
 * the other way (`meshDrift`), so the colour lags behind the shape as it moves.
 *
 * Fills its parent, so give the parent an explicit height (or `position: absolute; inset: 0` inside a
 * positioned container).
 *
 * ```tsx
 * <div style={{ height: 480, position: 'relative' }}>
 *   <Bubble />
 * </div>
 * ```
 */
export function Bubble(props: BubbleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement!
    const noiseTile = makeNoiseTile(128)
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const state = {
      qualityScale: dpr,
      frameTimeAvg: 1000 / 60,
      lean: { x: 0, y: 0 },
      pointer: { x: 0.5, y: 0.5, active: false },
      pausedT: 0,
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const w = Math.max(2, Math.round(rect.width * state.qualityScale))
      const h = Math.max(2, Math.round(rect.height * state.qualityScale))
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
    }
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      state.pointer.x = (e.clientX - rect.left) / Math.max(1, rect.width)
      state.pointer.y = (e.clientY - rect.top) / Math.max(1, rect.height)
      state.pointer.active = true
    }
    const onLeave = () => {
      state.pointer.active = false
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const plateLayer = document.createElement('canvas')
    const glowLayer = document.createElement('canvas')
    /** One bubble's rim at a time, so erasing its neighbour cannot touch the neighbour's own rim. */
    const rimLayer = document.createElement('canvas')

    let surfaceSource = ''
    let surfaceValue = '#000000'
    let surfaceCheckedAt = -Infinity

    let raf = 0
    let dead = false
    let last = performance.now()
    let t = 0

    /** Angles sampled around each outline. Enough that the beziers have nothing left to smooth. */
    const STEPS = 72

    const draw = (now: number) => {
      if (dead) return
      const p = { ...BUBBLE_DEFAULTS, ...propsRef.current }
      const dt = now - last
      last = now

      if (p.adaptiveQuality) {
        state.frameTimeAvg = state.frameTimeAvg * 0.9 + dt * 0.1
        const budget = (1000 / Math.max(1, p.targetFps)) * 1.35
        if (state.frameTimeAvg > budget && state.qualityScale > 0.4) {
          state.qualityScale = Math.max(0.4, state.qualityScale - 0.05)
          resize()
        } else if (state.frameTimeAvg < budget * 0.7 && state.qualityScale < dpr) {
          state.qualityScale = Math.min(dpr, state.qualityScale + 0.02)
          resize()
        }
      }

      if (!p.paused && !reduced) {
        t += (dt / 1000) * p.speed
      }
      const time = p.paused || reduced ? state.pausedT : t
      state.pausedT = time

      const W = canvas.width
      const H = canvas.height
      if (!W || !H) {
        raf = requestAnimationFrame(draw)
        return
      }
      /*
       * Every size in the component is a fraction of the **height**, and nothing is a fraction of the
       * width.
       *
       * The width is the dimension that moves — a hero is the same height on a laptop and an ultrawide,
       * and a very different width — so anything measured against it changes size as the window changes,
       * and the visible edge lands somewhere new each time. Measured against the height, the bubbles keep
       * their size and that edge keeps its place, and the extra width shows up as what it is: more room
       * either side. `bubbleSpread` is the one thing still measured across the width, because spreading
       * the pair over the frame is exactly its job.
       *
       * `Math.min(W, H)` was the same thing on a wide frame and quietly different on a narrow one, where
       * it would shrink the bubbles, the rim and the plate's edge together as the window narrowed.
       */
      const basis = H

      if (p.surfaceColor !== surfaceSource || now - surfaceCheckedAt > 500) {
        surfaceSource = p.surfaceColor
        surfaceCheckedAt = now
        surfaceValue = resolveColor(canvas, p.surfaceColor)
      }
      const surface = surfaceValue

      const targetX = p.cursorInteraction && state.pointer.active ? state.pointer.x - 0.5 : 0
      const targetY = p.cursorInteraction && state.pointer.active ? state.pointer.y - 0.5 : 0
      const ease = Math.min(1, dt / 220)
      state.lean.x += (targetX - state.lean.x) * ease
      state.lean.y += (targetY - state.lean.y) * ease

      /*
       * Where each bubble is and how big it is *this frame*, worked out once and then used by all three
       * passes. The mesh's masses and the rim are both positioned against these, which is what keeps the
       * colour and the light inside the shape while it moves rather than merely near it.
       */
      const placed = BUBBLES.map((b) => {
        const wander = time * b.rate + b.phase
        /*
         * Placement follows the frame (`bubbleX`, `bubbleY`); everything else is measured against the
         * height, so the gap between the pair and the distance each one drifts stay put as the window
         * widens. Only where the pair sits moves with the frame.
         */
        let cx = p.bubbleX * W + b.side * p.bubbleSpread * 0.5 * basis
          + Math.cos(wander) * p.bubbleWander * basis
        let cy = (p.bubbleY + b.side * p.bubbleStagger * 0.5) * H
          + Math.sin(wander * 1.3) * p.bubbleWander * basis
        if (p.cursorInteraction && state.pointer.active) {
          const dx = state.pointer.x * W - cx
          const dy = state.pointer.y * H - cy
          const reach = Math.max(0.02, p.cursorReach) * basis
          const pull = p.cursorLift * Math.exp(-((dx * dx + dy * dy) / (2 * reach * reach)))
          cx += dx * pull
          cy += dy * pull
        }
        const pulse = 1 + p.bubblePulse * Math.sin(time * b.rate * 1.7 + b.phase)
        /*
         * Off the height, so widening the frame adds room beside the bubbles rather than inflating them.
         * `bubbleBalance` is a seesaw around `bubbleScale`: one side gains what the other gives up, so
         * changing it resizes the two against each other without resizing the pair.
         */
        const radius = Math.max(1, basis * p.bubbleScale * (1 + b.side * p.bubbleBalance) * pulse)
        return { b, cx, cy, radius, radiusY: radius * p.bubbleHeight }
      })

      /** One bubble's outline, optionally scaled and given an extra harmonic (used by the rim). */
      const outline = (
        i: number,
        scale: number,
        extra: number,
        offX: number,
        offY: number,
      ): [number, number][] => {
        const { b, cx, cy, radius, radiusY } = placed[i]
        const pts: [number, number][] = []
        for (let s = 0; s < STEPS; s++) {
          const theta = (s / STEPS) * Math.PI * 2
          let m = 1
          for (const w of b.wobble) {
            m += p.bubbleMorph * w.a * Math.sin(w.k * theta + time * w.s + b.phase)
          }
          if (extra !== 0) {
            /*
             * Scaled well down before it reaches the radius. `extra` arrives as `glowDistortion - 1`,
             * which is a ratio, and adding a ratio straight to a multiplier around 1 is not a wander but
             * a catapult: at 1.6 it swung the rim by 60% of the radius, burying it inside the bubble on
             * one side and throwing it past the edge — where the plate trims it — on the other. That is
             * a rim that appears on one bubble and not the other.
             */
            m += extra * 0.15 * Math.sin(theta * 1.5 - time * 0.5 + b.phase)
          }
          /* The morph is a multiplier on both axes, so flattening the bubble flattens its wobble too. */
          pts.push([
            cx + Math.cos(theta) * radius * scale * m + offX,
            cy + Math.sin(theta) * radiusY * scale * m + offY,
          ])
        }
        return pts
      }

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.filter = 'none'

      /* ---------------------------------------------------------------- 1. the mesh */

      const sat = Math.max(0, Math.min(1.5, p.saturation))
      const [surfR, surfG, surfB] = toRgb(ctx, surface)
      const surfaceIsLight = 0.2126 * surfR + 0.7152 * surfG + 0.0722 * surfB > 140
      const groundColor = surfaceIsLight ? p.colorLight : p.color
      const litColor = surfaceIsLight ? p.hotColorLight : p.hotColor
      const secondColor = surfaceIsLight ? p.accentColorLight : p.accentColor
      const rimColor = surfaceIsLight ? p.glowColorLight : p.glowColor

      const [ch, cs, cl] = hexToHsl(groundColor)
      const [hh, hs, hl] = hexToHsl(litColor)
      const [ah, as, al] = hexToHsl(secondColor)

      ctx.fillStyle = hsl(ch, cs * sat, cl)
      ctx.fillRect(0, 0, W, H)

      /*
       * `source-over` rather than `lighter`: the masses have to *blend* into one another, and additive
       * light does not blend, it accumulates — overlapping blobs of it climb to white in the middle of
       * the field, which is the opposite of a mesh.
       */
      for (const blob of MESH_BLOBS) {
        const home = placed[blob.bubble]
        const orbit = blob.phase + time * blob.rate
        /*
         * Placed in the bubble's coordinates, then eased back toward the canvas's by `meshFollow`. At 1
         * the mass is nailed to the bubble; at 0 it sits still and the bubble slides over it.
         */
        const travel = blob.orbit * p.meshMotion
        const anchorX = home.cx + (blob.x + Math.cos(orbit) * travel) * home.radius
        const anchorY = home.cy + (blob.y + Math.sin(orbit) * travel) * home.radiusY
        const looseX = (0.5 + blob.x * 0.5) * W
        const looseY = (0.5 + blob.y * 0.5) * H
        const cx = looseX + (anchorX - looseX) * p.meshFollow + state.lean.x * p.meshDrift * W
        const cy = looseY + (anchorY - looseY) * p.meshFollow + state.lean.y * p.meshDrift * H
        const radius = Math.max(1, home.radius * blob.r * p.meshScale)
        /* Somewhere between the two lit colours, by a fixed amount, so both bubbles carry some of each. */
        const baseHue = lerpHue(hh, ah, blob.tint)
        const baseSat = lerp(hs, as, blob.tint)
        const baseLight = lerp(hl, al, blob.tint) * blob.light
        /* Oscillating around the palette rather than advancing through it — see `spectralDrift`. */
        const sweep = Math.sin(time * 0.35 + blob.phase * 0.5) * p.spectralDrift
        const hue = baseHue + blob.hue * p.richness * 70 + sweep
        const tone = Math.min(1, baseSat * sat)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, hsl(hue, tone, baseLight, 0.62))
        gradient.addColorStop(0.55, hsl(hue, tone, baseLight * 0.75, 0.28))
        gradient.addColorStop(1, hsl(hue, tone, baseLight * 0.5, 0))
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, W, H)
      }

      if (p.meshFade > 0) {
        const fade = ctx.createLinearGradient(0, 0, 0, Math.max(1, H * p.meshFade))
        fade.addColorStop(0, `rgba(${surfR}, ${surfG}, ${surfB}, 1)`)
        fade.addColorStop(1, `rgba(${surfR}, ${surfG}, ${surfB}, 0)`)
        ctx.fillStyle = fade
        ctx.fillRect(0, 0, W, Math.ceil(H * p.meshFade))
      }

      /* ---------------------------------------------------------------- 2. the rim */

      if (p.glow > 0 && p.glowOpacity > 0) {
        const glowBlur = Math.max(1, basis * p.glowWidth * 0.45)
        const gPad = Math.ceil(glowBlur * 2.5)
        const GW = W + gPad * 2
        const GH = H + gPad * 2
        if (glowLayer.width !== GW || glowLayer.height !== GH) {
          glowLayer.width = GW
          glowLayer.height = GH
        }
        const gg = glowLayer.getContext('2d')!
        gg.clearRect(0, 0, GW, GH)
        if (rimLayer.width !== GW || rimLayer.height !== GH) {
          rimLayer.width = GW
          rimLayer.height = GH
        }
        const rg = rimLayer.getContext('2d')!

        /* Banded across the frame by the same spectrum the mesh runs, so the rim belongs to the field. */
        const [gh, gs, gl] = hexToHsl(rimColor)
        const band = rg.createLinearGradient(0, 0, GW, 0)
        const stops = 6
        for (let i = 0; i <= stops; i++) {
          const f = i / stops
          const hue = gh + (f - 0.5) * 2 * p.richness * 70 + Math.sin(time * 0.35) * p.spectralDrift
          band.addColorStop(f, hsl(hue, Math.min(1, gs * sat), gl, Math.min(1, p.glow)))
        }

        /*
         * One bubble at a time, and each one's rim has the *other* bubble's interior taken out of it.
         *
         * Stroking both outlines onto one layer lights every edge each bubble has, including the arcs
         * that run inside its neighbour — so where the two overlap the light draws a seam straight
         * through the middle of the merged shape. But the plate opens the **union** of the two, so those
         * arcs are interior to the shape the viewer sees, and an interior edge is not an edge at all.
         * Erasing the neighbour leaves only the parts of each outline that are genuinely on the outside.
         *
         * It needs a layer per bubble because the erase is indiscriminate: done on the shared layer it
         * would also take out the neighbour's own rim, which sits just inside the neighbour. The erase
         * carries the same blur as the stroke, so the two rims meet in a soft join rather than a cut.
         */
        rg.lineJoin = 'round'
        rg.lineWidth = Math.max(1, basis * p.glowWidth)
        rg.strokeStyle = band

        for (let i = 0; i < placed.length; i++) {
          rg.globalCompositeOperation = 'source-over'
          rg.clearRect(0, 0, GW, GH)
          rg.filter = `blur(${glowBlur}px)`
          rg.beginPath()
          traceClosed(rg, outline(i, 1 - p.glowOffset, p.glowDistortion - 1, gPad, gPad))
          rg.stroke()

          rg.globalCompositeOperation = 'destination-out'
          for (let j = 0; j < placed.length; j++) {
            if (j === i) continue
            rg.beginPath()
            traceClosed(rg, outline(j, 1, 0, gPad, gPad))
            rg.fill()
          }
          rg.filter = 'none'
          rg.globalCompositeOperation = 'source-over'

          gg.drawImage(rimLayer, 0, 0)
        }

        /*
         * Then the top of it is taken away, so the light gathers along the bubbles' **lower** edges.
         *
         * Masked after the fact rather than stroked segment by segment with its own alpha: the stroke is
         * far wider than the gap between sample points, so per-segment alphas overlap heavily and
         * accumulate into bands. One gradient over the finished ring has nothing to accumulate. It spans
         * the bubbles' own vertical extent rather than the canvas, so it stays put as they wander.
         */
        if (p.glowArc < 1) {
          const top = Math.min(...placed.map((q) => q.cy - q.radiusY)) + gPad
          const bottom = Math.max(...placed.map((q) => q.cy + q.radiusY)) + gPad
          const mask = gg.createLinearGradient(0, top, 0, bottom)
          mask.addColorStop(0, 'rgba(255,255,255,0)')
          mask.addColorStop(Math.max(0.01, 1 - Math.max(0, p.glowArc)), 'rgba(255,255,255,0)')
          mask.addColorStop(1, 'rgba(255,255,255,1)')
          gg.globalCompositeOperation = 'destination-in'
          gg.fillStyle = mask
          gg.fillRect(0, 0, GW, GH)
          gg.globalCompositeOperation = 'source-over'
        }

        ctx.globalCompositeOperation = p.glowBlend
        ctx.globalAlpha = Math.min(1, p.glowOpacity)
        ctx.drawImage(glowLayer, gPad, gPad, W, H, 0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      /* ---------------------------------------------------------------- 3. the plate */

      const blur = p.edgeSoftness > 0 ? Math.max(0.5, basis * p.edgeSoftness * 0.5) : 0
      /*
       * A blurred shape drawn to the canvas's own edge fades there, because the blur has nothing beyond
       * the boundary to average with — it reads as a vignette down every side. So a soft-edged plate is
       * drawn on a layer bigger than the canvas, its outer rectangle carried past the edges, and only the
       * middle of it copied back.
       */
      const pad = Math.ceil(blur * 3)
      const PW = W + pad * 2
      const PH = H + pad * 2
      if (plateLayer.width !== PW || plateLayer.height !== PH) {
        plateLayer.width = PW
        plateLayer.height = PH
      }
      const pg = plateLayer.getContext('2d')!
      pg.clearRect(0, 0, PW, PH)
      pg.globalCompositeOperation = 'source-over'
      pg.filter = 'none'
      pg.fillStyle = surface
      pg.fillRect(0, 0, PW, PH)

      /*
       * The holes are *erased*, not excluded by a fill rule.
       *
       * One path holding the rectangle and both outlines is the obvious way to write this and it is
       * wrong: `evenodd` counts crossings, so where the two bubbles overlap the parity flips back to
       * filled and the plate returns as a wedge through the middle of them — two bubbles with a bite
       * taken out of where they meet. `nonzero` has the same problem from the other side. Erasing with
       * `destination-out` has no parity to get wrong: overlapping shapes simply erase the same pixels
       * twice.
       *
       * It also has to happen on its own layer. Erasing on the main canvas would take the mesh with it
       * and leave a hole through to whatever is behind the canvas, rather than a hole through the plate.
       */
      pg.globalCompositeOperation = 'destination-out'
      if (blur > 0) pg.filter = `blur(${blur}px)`
      for (let i = 0; i < placed.length; i++) {
        pg.beginPath()
        traceClosed(pg, outline(i, 1, 0, pad, pad))
        pg.fill()
      }
      pg.filter = 'none'
      pg.globalCompositeOperation = 'source-over'

      ctx.drawImage(plateLayer, pad, pad, W, H, 0, 0, W, H)

      /* ---------------------------------------------------------------- grain */

      if (p.grain > 0) {
        ctx.globalCompositeOperation = 'overlay'
        ctx.globalAlpha = Math.min(1, p.grain)
        const pattern = ctx.createPattern(noiseTile, 'repeat')!
        pattern.setTransform(
          new DOMMatrix().translate(Math.random() * noiseTile.width, Math.random() * noiseTile.height),
        )
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={props.className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        opacity: props.opacity ?? BUBBLE_DEFAULTS.opacity,
        ...props.style,
      }}
    />
  )
}

export default Bubble
