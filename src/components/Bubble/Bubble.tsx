import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface BubbleProps {
  /** How fast the bubbles wander, morph and pulse. @default 0.4 */
  speed?: number
  /** Size of the bubbles, as a fraction of the **height**, so it holds as the window widens. @default 0.65 */
  bubbleScale?: number
  /** Distance between the two centres, also a fraction of the height. @default 1.05 */
  bubbleSpread?: number
  /** How far each outline departs from a circle. 0 gives two plain circles. @default 0.2 */
  bubbleMorph?: number
  /**
   * How far the two are staggered vertically, either side of `bubbleY`.
   *
   * **0 levels the visible edges, not the centres**: `bubbleBalance` makes one bubble bigger and a bigger
   * bubble centred at the same height reaches further down, so the size difference is taken back out of
   * the placement. The edge is all anyone sees of a shape hanging off the top of the frame.
   *
   * @default 0.09
   */
  bubbleStagger?: number
  /**
   * How much bigger one bubble is than the other, as a seesaw around `bubbleScale` — which is therefore
   * the pair's *average* size, not either one's.
   *
   * @default -0.1
   */
  bubbleBalance?: number
  /** Where the pair sits horizontally, the two either side of it. @default 0.5 */
  bubbleX?: number
  /** Where the centres sit — high, so what shows is the bubbles' **lower halves**. @default 0.18 */
  bubbleY?: number
  /** How much the bubbles swell and shrink as they go. @default 0.12 */
  bubblePulse?: number
  /** How far they drift from where they sit. @default 0.05 */
  bubbleWander?: number
  /** Softness of the bubbles' edge, as a fraction of the height. 0 is a crisp cut. @default 0.03 */
  edgeSoftness?: number
  /**
   * The colour everything outside the bubbles is painted in — **the page's own background**, and the one
   * value that has to be right: the bubbles are not shapes drawn over the mesh, they are the only places
   * the plate covering it is missing. Wrong here and it is a coloured rectangle with two holes. Takes
   * `var(--token)`, resolved against the canvas, which is how one value follows the colour scheme.
   *
   * @default 'var(--sds-surfaces-page-bg-base-default)'
   */
  surfaceColor?: string
  /** The mesh's ground on a **dark** surface. Keep it near `surfaceColor`. @default '#0b0a1c' */
  color?: string
  /** The mesh's lit colour on a dark surface. @default '#6d3bf5' */
  hotColor?: string
  /**
   * The mesh's **second** lit colour, each mass sitting somewhere between this and `hotColor`. Distinct
   * from `richness`, which spreads hues either side of wherever a mass already is: two poles let the mesh
   * be two colours, `richness` varies within one. Hues interpolate the short way round the wheel.
   *
   * @default '#2563eb'
   */
  accentColor?: string
  /**
   * The ground on a **light** surface. One palette cannot serve both, and the pair is chosen from the
   * resolved `surfaceColor`'s luminance, so there is no separate flag to keep in sync.
   *
   * @default '#f2f0fb'
   */
  colorLight?: string
  /** The mesh's lit colour on a light surface. @default '#8b5cf6' */
  hotColorLight?: string
  /** The mesh's second lit colour on a light surface. @default '#93c5fd' */
  accentColorLight?: string
  /** How far the masses' hues drift either side of their colour — the mesh's spread. @default 1 */
  richness?: number
  /**
   * How far the spectrum sweeps either side of the palette, in hue degrees. It **oscillates** rather than
   * advances — an unbounded rotation puts every hue on screen sooner or later, which is how a violet mesh
   * comes to show greens and golds. The furthest a mass strays is `richness * 70 + this`.
   *
   * @default 18
   */
  spectralDrift?: number
  /** How strongly the mesh is carried by its bubble: 1 nails it, 0 leaves it in the canvas. @default 0.85 */
  meshFollow?: number
  /** Vividness of the mesh. @default 1.05 */
  saturation?: number
  /** Size of the mesh's colour masses, relative to the bubble holding them. @default 1 */
  meshScale?: number
  /** How far the masses travel inside their bubble, where `speed` is how fast. @default 1 */
  meshMotion?: number
  /**
   * Brightness of the rim light. Drawn between the mesh and the plate, so the plate trims what falls
   * outside the outline and what survives is light caught inside the bubble's skin. 0 skips the pass.
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
  /** How far the rim's outline wanders off the bubble's, 1 tracking it exactly. @default 1.6 */
  glowDistortion?: number
  /** Moves the rim inward from every side (positive) or outward, as a fraction of the radius. @default 0.06 */
  glowOffset?: number
  /**
   * Which side the light gathers on, left at negative. The value names the side the light ends up on,
   * which is the **opposite** of the way the ring moves: sliding it right pushes its right side past the
   * edge where the plate trims it, leaving the left side deep enough inside to show.
   *
   * @default 0
   */
  glowOffsetX?: number
  /** How much of the outline is lit, from the bottom up. 1 rings the whole edge. @default 0.45 */
  glowArc?: number
  /** How the rim is composited over the mesh. @default 'screen' */
  glowBlend?: 'screen' | 'lighten' | 'overlay' | 'soft-light' | 'color-dodge' | 'source-over'
  /**
   * A glowing border along the outline, **off at 0**. Drawn *after* the plate where the rim is drawn
   * before, so it straddles the outline and glows onto the page instead of being trimmed to the inside
   * of it — the rim is light caught inside the bubble, this is the edge itself being lit.
   *
   * @default 0
   */
  borderOpacity?: number
  /** Thickness of the border, as a fraction of the height. @default 0.004 */
  borderWidth?: number
  /** Blur on the border. 0 is a drawn line; past its own width it becomes a halo. @default 0.012 */
  borderBlur?: number
  /** The border's colour on a dark surface. @default '#c9b0ff' */
  borderColor?: string
  /** The border's colour on a light surface. @default '#7c3aed' */
  borderColorLight?: string
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
  glow: 0.8,
  glowOpacity: 0.9,
  glowColor: '#c4a2ff',
  glowColorLight: '#7c3aed',
  glowWidth: 0.16,
  glowDistortion: 1.6,
  glowOffset: 0.06,
  glowOffsetX: 0,
  glowArc: 0.45,
  glowBlend: 'screen',
  borderOpacity: 0,
  borderWidth: 0.004,
  borderBlur: 0.012,
  borderColor: '#c9b0ff',
  borderColorLight: '#7c3aed',
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
 * The two bubbles — fixed rather than random, so a designer tuning against a screenshot gets the same two
 * next time. `wobble` is the pair of harmonics that morph the outline (`k` lobes, `a` strength, `s` rate
 * and direction), differing between the entries so the two never fall into the same shape at once.
 *
 * How high each hangs and how big it is relative to the other are deliberately *not* here — they are
 * `bubbleStagger` and `bubbleBalance`, being the difference between a pair and one shape drawn twice.
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
 * Bubble — two morphing bubbles filled with a drifting colour mesh, drawn in four passes: mesh, rim,
 * plate, border. The plate is `surfaceColor` filling everything *except* the bubbles, so that value has
 * to match the page behind it. Fills its parent, which needs a height.
 *
 * The docs page carries the longer version, in `Bubble.stories.tsx`.
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
    /* Shared by the rim and border passes, which never run at once. */
    const edgeLayer = document.createElement('canvas')
    const edgeScratch = document.createElement('canvas')

    let surfaceSource = ''
    let surfaceValue = '#000000'
    let surfaceCheckedAt = -Infinity

    let raf = 0
    let dead = false
    let last = performance.now()
    let t = 0

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
      /* Every size is a fraction of the height, so it holds as the window widens. Only `bubbleX` uses W. */
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

      /* Each bubble's centre and radius this frame; the mesh and the rim are both placed against these. */
      const placed = BUBBLES.map((b) => {
        const wander = time * b.rate + b.phase
        const pulse = 1 + p.bubblePulse * Math.sin(time * b.rate * 1.7 + b.phase)
        const mean = basis * p.bubbleScale * pulse
        const radius = Math.max(1, mean * (1 + b.side * p.bubbleBalance))

        /* Cancels the size difference, so a stagger of 0 levels the visible edges rather than the centres. */
        const evenEdges = mean * b.side * p.bubbleBalance

        let cx = p.bubbleX * W + b.side * p.bubbleSpread * 0.5 * basis
          + Math.cos(wander) * p.bubbleWander * basis
        let cy = (p.bubbleY + b.side * p.bubbleStagger * 0.5) * H - evenEdges
          + Math.sin(wander * 1.3) * p.bubbleWander * basis
        if (p.cursorInteraction && state.pointer.active) {
          const dx = state.pointer.x * W - cx
          const dy = state.pointer.y * H - cy
          const reach = Math.max(0.02, p.cursorReach) * basis
          const pull = p.cursorLift * Math.exp(-((dx * dx + dy * dy) / (2 * reach * reach)))
          cx += dx * pull
          cy += dy * pull
        }
        return { b, cx, cy, radius }
      })

      /** One bubble's outline, optionally scaled and given an extra harmonic (used by the rim). */
      const outline = (
        i: number,
        scale: number,
        extra: number,
        offX: number,
        offY: number,
      ): [number, number][] => {
        const { b, cx, cy, radius } = placed[i]
        const pts: [number, number][] = []
        for (let s = 0; s < STEPS; s++) {
          const theta = (s / STEPS) * Math.PI * 2
          let m = 1
          for (const w of b.wobble) {
            m += p.bubbleMorph * w.a * Math.sin(w.k * theta + time * w.s + b.phase)
          }
          if (extra !== 0) {
            /* 0.15 because `extra` is a ratio: added raw to a multiplier around 1 it swings the rim by
             * most of the radius, past the edge on one side and deep inside on the other. */
            m += extra * 0.15 * Math.sin(theta * 1.5 - time * 0.5 + b.phase)
          }
          pts.push([
            cx + Math.cos(theta) * radius * scale * m + offX,
            cy + Math.sin(theta) * radius * scale * m + offY,
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

      /* `source-over`, not `lighter`: additive light accumulates to white where the masses overlap. */
      for (const blob of MESH_BLOBS) {
        const home = placed[blob.bubble]
        const orbit = blob.phase + time * blob.rate
        const travel = blob.orbit * p.meshMotion
        const anchorX = home.cx + (blob.x + Math.cos(orbit) * travel) * home.radius
        const anchorY = home.cy + (blob.y + Math.sin(orbit) * travel) * home.radius
        const looseX = (0.5 + blob.x * 0.5) * W
        const looseY = (0.5 + blob.y * 0.5) * H
        const cx = looseX + (anchorX - looseX) * p.meshFollow + state.lean.x * p.meshDrift * W
        const cy = looseY + (anchorY - looseY) * p.meshFollow + state.lean.y * p.meshDrift * H
        const radius = Math.max(1, home.radius * blob.r * p.meshScale)
        const baseHue = lerpHue(hh, ah, blob.tint)
        const baseSat = lerp(hs, as, blob.tint)
        const baseLight = lerp(hl, al, blob.tint) * blob.light
        /* Oscillates around the palette; advancing would rotate every hue onto the screen. */
        const sweep = Math.sin(time * 0.35 + blob.phase * 0.5) * p.spectralDrift
        const hue = baseHue + blob.hue * p.richness * 70 + sweep
        const tone = Math.min(1, baseSat * sat)
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, hsl(hue, tone, baseLight, 0.62))
        gradient.addColorStop(0.55, hsl(hue, tone, baseLight * 0.75, 0.28))
        gradient.addColorStop(1, hsl(hue, tone, baseLight * 0.5, 0))
        ctx.fillStyle = gradient
        /* Its own square, not the canvas: the gradient is already at zero alpha by `radius`. */
        const x0 = Math.max(0, Math.floor(cx - radius))
        const y0 = Math.max(0, Math.floor(cy - radius))
        const x1 = Math.min(W, Math.ceil(cx + radius))
        const y1 = Math.min(H, Math.ceil(cy + radius))
        if (x1 > x0 && y1 > y0) ctx.fillRect(x0, y0, x1 - x0, y1 - y0)
      }

      /* ---------------------------------------------------- shared by the rim and border passes */

      const rimOn = p.glow > 0 && p.glowOpacity > 0
      const borderOn = p.borderOpacity > 0 && p.borderWidth > 0
      const glowBlur = Math.max(1, basis * p.glowWidth * 0.45)
      const bWidth = Math.max(0.5, basis * p.borderWidth)
      const bBlur = p.borderBlur > 0 ? Math.max(0.5, basis * p.borderBlur) : 0
      /* One padding for both, so the layers are sized once rather than resized between passes. */
      const ePad = Math.ceil(Math.max(rimOn ? glowBlur * 2.5 : 0, borderOn ? bWidth + bBlur * 3 : 0))
      const EW = W + ePad * 2
      const EH = H + ePad * 2
      if ((rimOn || borderOn) && (edgeLayer.width !== EW || edgeLayer.height !== EH)) {
        edgeLayer.width = EW
        edgeLayer.height = EH
        edgeScratch.width = EW
        edgeScratch.height = EH
      }

      /**
       * Strokes every outline onto `acc`, one bubble at a time with its neighbours erased from it —
       * without that erase, the arcs where two bubbles overlap draw a seam through the merged shape.
       */
      const strokeOuterForm = (
        acc: CanvasRenderingContext2D,
        scratch: CanvasRenderingContext2D,
        o: {
          blur: number
          lineWidth: number
          stroke: string | CanvasGradient
          scale: number
          extra: number
          shiftX?: (i: number) => number
        },
      ) => {
        scratch.lineJoin = 'round'
        scratch.lineWidth = o.lineWidth
        scratch.strokeStyle = o.stroke
        for (let i = 0; i < placed.length; i++) {
          scratch.globalCompositeOperation = 'source-over'
          scratch.clearRect(0, 0, EW, EH)
          if (o.blur > 0) scratch.filter = `blur(${o.blur}px)`
          scratch.beginPath()
          traceClosed(scratch, outline(i, o.scale, o.extra, ePad + (o.shiftX?.(i) ?? 0), ePad))
          scratch.stroke()

          scratch.globalCompositeOperation = 'destination-out'
          for (let j = 0; j < placed.length; j++) {
            if (j === i) continue
            scratch.beginPath()
            traceClosed(scratch, outline(j, 1, 0, ePad, ePad))
            scratch.fill()
          }
          scratch.filter = 'none'
          scratch.globalCompositeOperation = 'source-over'
          acc.drawImage(scratch.canvas, 0, 0)
        }
      }

      /* ---------------------------------------------------------------- 2. the rim */

      if (rimOn) {
        const gg = edgeLayer.getContext('2d')!
        gg.clearRect(0, 0, EW, EH)
        const rg = edgeScratch.getContext('2d')!

        /* Banded by the same spectrum the mesh runs. */
        const [gh, gs, gl] = hexToHsl(rimColor)
        const band = rg.createLinearGradient(0, 0, EW, 0)
        const stops = 6
        for (let i = 0; i <= stops; i++) {
          const f = i / stops
          const hue = gh + (f - 0.5) * 2 * p.richness * 70 + Math.sin(time * 0.35) * p.spectralDrift
          band.addColorStop(f, hsl(hue, Math.min(1, gs * sat), gl, Math.min(1, p.glow)))
        }

        strokeOuterForm(gg, rg, {
          blur: glowBlur,
          lineWidth: Math.max(1, basis * p.glowWidth),
          stroke: band,
          scale: 1 - p.glowOffset,
          extra: p.glowDistortion - 1,
          /* Negated: the ring and the light move opposite ways, and the prop names the side the light
           * lands on. See `glowOffsetX`. */
          shiftX: (i) => -p.glowOffsetX * placed[i].radius,
        })

        /*
         * Takes the top off the ring so the light gathers on the lower edges. Masked afterwards rather
         * than stroked per-segment: the stroke is far wider than the gap between sample points, so
         * per-segment alphas would overlap and band.
         */
        if (p.glowArc < 1) {
          const top = Math.min(...placed.map((q) => q.cy - q.radius)) + ePad
          const bottom = Math.max(...placed.map((q) => q.cy + q.radius)) + ePad
          const mask = gg.createLinearGradient(0, top, 0, bottom)
          mask.addColorStop(0, 'rgba(255,255,255,0)')
          mask.addColorStop(Math.max(0.01, 1 - Math.max(0, p.glowArc)), 'rgba(255,255,255,0)')
          mask.addColorStop(1, 'rgba(255,255,255,1)')
          gg.globalCompositeOperation = 'destination-in'
          gg.fillStyle = mask
          gg.fillRect(0, 0, EW, EH)
          gg.globalCompositeOperation = 'source-over'
        }

        ctx.globalCompositeOperation = p.glowBlend
        ctx.globalAlpha = Math.min(1, p.glowOpacity)
        ctx.drawImage(edgeLayer, ePad, ePad, W, H, 0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      /* ---------------------------------------------------------------- 3. the plate */

      const blur = p.edgeSoftness > 0 ? Math.max(0.5, basis * p.edgeSoftness * 0.5) : 0
      /*
       * On an oversized layer, cropped back: a blurred shape drawn to the canvas edge has nothing beyond
       * the boundary to average with and fades there, which reads as a vignette down every side.
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
       * Erased, not excluded by a fill rule: `evenodd` counts crossings, so where the bubbles overlap the
       * parity flips back to filled and the plate returns as a wedge bitten out of where they meet
       * (`nonzero` fails the same way). On its own layer, or the erase takes the mesh with it.
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

      /* ---------------------------------------------------------------- 4. the border */

      /* After the plate, so it straddles the outline where the rim is trimmed to the inside of it. */
      if (borderOn) {
        const bg = edgeLayer.getContext('2d')!
        bg.clearRect(0, 0, EW, EH)
        strokeOuterForm(bg, edgeScratch.getContext('2d')!, {
          blur: bBlur,
          lineWidth: bWidth,
          stroke: surfaceIsLight ? p.borderColorLight : p.borderColor,
          scale: 1,
          extra: 0,
        })

        ctx.globalAlpha = Math.min(1, p.borderOpacity)
        ctx.drawImage(edgeLayer, ePad, ePad, W, H, 0, 0, W, H)
        ctx.globalAlpha = 1
      }

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
