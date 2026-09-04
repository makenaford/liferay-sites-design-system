import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface BubbleProps {
  /** Travel speed of the wave, and how fast the mesh drifts. @default 0.4 */
  speed?: number
  /** Height of the primary swell (fraction of canvas height). @default 0.14 */
  swell?: number
  /** Frequency of the primary swell across the width. @default 0.8 */
  swellFrequency?: number
  /** Height of the secondary ripple (fraction of canvas height). @default 0.03 */
  ripple?: number
  /** Frequency of the secondary ripple across the width. @default 1.6 */
  rippleFrequency?: number
  /** Vertical placement of the wave; 0 = centered, -1..1. @default -0.28 */
  waterline?: number
  /** Softness of the wave's edge, as a fraction of the shorter side. 0 is a crisp curve. @default 0.03 */
  edgeSoftness?: number
  /**
   * The colour the wave is painted in — **the page's own background**.
   *
   * This is what makes the component read as transparent without being transparent: the wave is not a lit
   * shape drawn *over* the mesh, it is a plate of the page colour that covers it, so the mesh survives
   * only where the wave is not. Accepts `var(--token)` and resolves it against the canvas, which is what
   * lets one value follow the colour scheme.
   *
   * @default 'var(--sds-surfaces-page-bg-base-default)'
   */
  surfaceColor?: string
  /** The mesh's deep colour — the ground its blobs sit on. @default '#140833' */
  color?: string
  /** The mesh's lit colour. Blobs are hues drifted off this one. @default '#5b30c4' */
  hotColor?: string
  /** How far the blobs' hues drift either side of `hotColor` — the mesh's colour spread. @default 1 */
  richness?: number
  /**
   * How fast the spectrum sweeps *through* the mesh, in hue-degrees per second of travel.
   *
   * `richness` decides how much colour is in the field; this decides whether that colour sits still or
   * moves through it. Small values read as light shifting over a surface, large ones as a rainbow band
   * running across it.
   *
   * @default 26
   */
  spectralDrift?: number
  /**
   * How strongly the mesh is carried by the wave, 0..1.
   *
   * Each colour mass is displaced by the wave's own height at that mass's position, so the field rises
   * and falls with the curve beneath it instead of drifting on an unrelated clock. This is what stops
   * the two halves looking like two animations that happen to share a canvas.
   *
   * @default 0.55
   */
  meshFollow?: number
  /** Vividness of the mesh. @default 1.05 */
  saturation?: number
  /** Size of the mesh's colour masses. @default 1 */
  meshScale?: number
  /** How far down the mesh dissolves into `surfaceColor` at the top edge, 0..1. @default 0.3 */
  meshFade?: number
  /**
   * Brightness of the glow band — the layer between the mesh and the wave.
   *
   * It follows the wave's own curve but with its amplitudes multiplied by `glowDistortion`, so it reads
   * as light pooling along the same swell rather than as a second, unrelated shape: same rhythm, looser
   * form. Everything of it that falls below the wave is covered by the wave, so what shows is the part
   * hugging the crest's upper side.
   *
   * 0 turns the layer off entirely, and skips its offscreen pass.
   *
   * @default 0.55
   */
  glow?: number
  /** Overall opacity of the glow layer, applied as it is composited. @default 0.85 */
  glowOpacity?: number
  /** The glow's colour. Its hues spread with `richness`, like the mesh's. @default '#b98cff' */
  glowColor?: string
  /** Thickness of the glow band, as a fraction of the shorter side. @default 0.3 */
  glowWidth?: number
  /** How much more distorted the glow's curve is than the wave's. 1 tracks it exactly. @default 2.2 */
  glowDistortion?: number
  /**
   * How the glow is composited over the mesh.
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
  /** Whether the pointer bends the wave and steers the mesh. @default true */
  cursorInteraction?: boolean
  /** Height the pointer lifts the wave (fraction of canvas height). @default 0.08 */
  cursorLift?: number
  /** Width of the pointer's lift (fraction of canvas width). @default 0.3 */
  cursorReach?: number
  /** How far the pointer pulls the mesh's blobs — the mesh's parallax. @default 0.12 */
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
  swell: 0.14,
  swellFrequency: 0.8,
  ripple: 0.03,
  rippleFrequency: 1.6,
  waterline: -0.28,
  edgeSoftness: 0.03,
  surfaceColor: 'var(--sds-surfaces-page-bg-base-default)',
  color: '#140833',
  hotColor: '#5b30c4',
  richness: 1,
  spectralDrift: 26,
  meshFollow: 0.55,
  saturation: 1.05,
  meshScale: 1,
  meshFade: 0.3,
  glow: 0.55,
  glowOpacity: 0.85,
  glowColor: '#b98cff',
  glowWidth: 0.3,
  glowDistortion: 2.2,
  glowBlend: 'screen',
  grain: 0.035,
  cursorInteraction: true,
  cursorLift: 0.08,
  cursorReach: 0.3,
  meshDrift: 0.12,
  adaptiveQuality: true,
  targetFps: 60,
  opacity: 1,
  paused: false,
}

/**
 * The mesh's colour masses, as fractions of the canvas.
 *
 * A fixed table rather than anything random: the mesh has to look the same on every render and every
 * machine, and a designer tuning `hotColor` against a screenshot needs the blob under it to still be
 * there next time. `hue` is the blob's offset either side of `hotColor`, in `richness` units; `rate` and
 * `phase` put each one on its own slow orbit so the field never repeats visibly.
 */
const MESH_BLOBS = [
  { x: 0.16, y: 0.3, r: 0.85, hue: -1, light: 0.95, rate: 0.21, phase: 0, orbit: 0.05 },
  { x: 0.42, y: 0.52, r: 0.95, hue: -0.3, light: 1.05, rate: 0.17, phase: 1.9, orbit: 0.06 },
  { x: 0.66, y: 0.28, r: 0.8, hue: 0.35, light: 1, rate: 0.23, phase: 3.4, orbit: 0.05 },
  { x: 0.88, y: 0.56, r: 0.9, hue: 1, light: 1.1, rate: 0.15, phase: 5.1, orbit: 0.07 },
  { x: 0.3, y: 0.74, r: 0.75, hue: 0.1, light: 0.85, rate: 0.19, phase: 2.6, orbit: 0.05 },
]

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
 * held (`#rgb`, `rgb()`, a named colour) into a form worth parsing, so the fade can hold the colour and
 * move only the alpha.
 */
function toRgb(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  const previous = ctx.fillStyle
  ctx.fillStyle = color
  const normalised = ctx.fillStyle
  ctx.fillStyle = previous
  if (typeof normalised === 'string') {
    if (normalised.startsWith('#')) {
      const [h, s, l] = hexToHsl(normalised)
      // back out of HSL rather than re-parsing: hexToHsl already did the work
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l - c / 2
      const [r1, g1, b1] =
        h < 60 ? [c, x, 0]
        : h < 120 ? [x, c, 0]
        : h < 180 ? [0, c, x]
        : h < 240 ? [0, x, c]
        : h < 300 ? [x, 0, c]
        : [c, 0, x]
      return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255)]
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

/** Catmull-Rom -> cubic bezier so the wave reads as one smooth curve. */
function smoothTo(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  const n = pts.length
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2 < n ? i + 2 : n - 1]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1])
  }
}

/**
 * Bubble — a drifting colour mesh with a wave cut across it.
 *
 * Three passes on one canvas, and the last is the whole trick:
 *
 * 1. **The mesh.** Overlapping soft colour masses on a deep ground, their hues drifted either side of
 *    `hotColor` by `richness` and swept through the field by `spectralDrift`. This is the part with the
 *    colour in it. Each mass is displaced by the wave's own height beneath it (`meshFollow`), so the
 *    field is carried by the curve rather than drifting on a clock of its own.
 * 2. **The glow.** A blurred band along the wave's curve with its amplitudes multiplied by
 *    `glowDistortion` — same swell, looser form — composited with `glowBlend` so it sits in the mesh
 *    rather than on it. The next pass cuts it off, so what survives hugs the crest's upper side.
 * 3. **The wave.** A flat plate of `surfaceColor` — *the page's own background* — filling everything
 *    below the curve.
 *
 * So the wave is not lit and nothing is blended. The component is opaque everywhere, and still reads as
 * though the mesh were fading into the page, because below the curve it is painting exactly what the
 * page would have painted. That is worth stating plainly: **`surfaceColor` has to match the surface the
 * component is sitting on**, or the illusion is just a coloured shape. It defaults to the page-background
 * token and resolves `var()` against the canvas, so it follows the colour scheme on its own; pass a
 * concrete colour when the component sits on something else, like a card.
 *
 * The pointer does both jobs at once — bends the curve near it (`cursorLift`, `cursorReach`) and pulls
 * the mesh's masses (`meshDrift`), so the colour leans one way while the wave rises under the cursor.
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
      /** Eased toward the pointer, so the mesh leans rather than snapping. */
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
    const waveLayer = document.createElement('canvas')
    const glowLayer = document.createElement('canvas')

    /*
     * `surfaceColor` is re-resolved on a slow cadence rather than every frame: it is a computed-style
     * read, and its value only changes when the colour scheme flips — which this then picks up on its
     * own, without needing to watch for it.
     */
    let surfaceSource = ''
    let surfaceValue = '#000000'
    let surfaceCheckedAt = -Infinity

    let raf = 0
    let dead = false
    let last = performance.now()
    let t = 0

    const waveY = (
      u: number,
      time: number,
      swell: number,
      swellFreq: number,
      ripple: number,
      rippleFreq: number,
    ) => {
      const k = Math.PI * 2
      const a = swell * Math.sin(u * k * swellFreq + time)
      const b = ripple * Math.sin(u * k * rippleFreq - time * 1.4 + 1.4)
      return a + b
    }

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
      const S = Math.min(W, H)

      if (p.surfaceColor !== surfaceSource || now - surfaceCheckedAt > 500) {
        surfaceSource = p.surfaceColor
        surfaceCheckedAt = now
        surfaceValue = resolveColor(canvas, p.surfaceColor)
      }
      const surface = surfaceValue

      /* Eased toward the pointer, and back to centre when it leaves. */
      const targetX = p.cursorInteraction && state.pointer.active ? state.pointer.x - 0.5 : 0
      const targetY = p.cursorInteraction && state.pointer.active ? state.pointer.y - 0.5 : 0
      const ease = Math.min(1, dt / 220)
      state.lean.x += (targetX - state.lean.x) * ease
      state.lean.y += (targetY - state.lean.y) * ease

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.filter = 'none'

      /* ---------------------------------------------------------------- 1. the mesh */

      const sat = Math.max(0, Math.min(1.5, p.saturation))
      const [ch, cs, cl] = hexToHsl(p.color)
      const [hh, hs, hl] = hexToHsl(p.hotColor)

      ctx.fillStyle = hsl(ch, cs * sat, cl)
      ctx.fillRect(0, 0, W, H)

      /*
       * `source-over` rather than `lighter`: the masses have to *blend* into one another, and additive
       * light does not blend, it accumulates — five overlapping blobs of it climb to white in the middle
       * of the field, which is the opposite of a mesh.
       */
      for (const blob of MESH_BLOBS) {
        const orbit = blob.phase + time * blob.rate
        const u = blob.x + Math.cos(orbit) * blob.orbit + state.lean.x * p.meshDrift
        /*
         * The wave's own height under this mass, so the field is carried by the curve rather than
         * drifting on a clock of its own — which is what makes the two halves read as one thing.
         */
        const carried = p.meshFollow * waveY(
          u, time, p.swell, p.swellFrequency, p.ripple, p.rippleFrequency,
        )
        const cx = u * W
        const cy = (blob.y + Math.sin(orbit) * blob.orbit + state.lean.y * p.meshDrift + carried) * H
        const radius = Math.max(1, S * blob.r * p.meshScale)
        /* Plus a slow sweep through the spectrum, so the colour moves through the field as well as with it. */
        const hue = hh + blob.hue * p.richness * 140 + time * p.spectralDrift
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, hsl(hue, Math.min(1, hs * sat), hl * blob.light, 0.62))
        gradient.addColorStop(0.55, hsl(hue, Math.min(1, hs * sat), hl * blob.light * 0.75, 0.28))
        gradient.addColorStop(1, hsl(hue, Math.min(1, hs * sat), hl * blob.light * 0.5, 0))
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, W, H)
      }

      /*
       * The mesh dissolves into the surface at the top edge, so the component can end mid-page without
       * ruling a line across it — the same job the wave does at the bottom, done with a gradient because
       * there is no shape up there to cut.
       */
      if (p.meshFade > 0) {
        const [sr, sg, sb] = toRgb(ctx, surface)
        const fade = ctx.createLinearGradient(0, 0, 0, Math.max(1, H * p.meshFade))
        fade.addColorStop(0, `rgba(${sr}, ${sg}, ${sb}, 1)`)
        fade.addColorStop(1, `rgba(${sr}, ${sg}, ${sb}, 0)`)
        ctx.fillStyle = fade
        ctx.fillRect(0, 0, W, Math.ceil(H * p.meshFade))
      }

      const level = Math.min(0.95, Math.max(0.05, 0.5 - p.waterline * 0.4))
      const N = 96

      /* ---------------------------------------------------------------- 2. the glow */

      /*
       * Light pooling along the wave, drawn between the mesh and the wave so the wave cuts it off: what
       * survives is the half hugging the crest's upper side, which is where a glow off a lit edge would
       * actually be.
       *
       * Its curve is the wave's own with the amplitudes multiplied, not a curve of its own — same swell,
       * same rhythm, looser form. The two stay related however the wave props are changed, which a second
       * independent shape would not.
       */
      if (p.glow > 0 && p.glowOpacity > 0) {
        const glowBlur = Math.max(1, S * p.glowWidth * 0.45)
        const gPad = Math.ceil(glowBlur * 2.5)
        const GW = W + gPad * 2
        const GH = H + gPad * 2
        if (glowLayer.width !== GW || glowLayer.height !== GH) {
          glowLayer.width = GW
          glowLayer.height = GH
        }
        const gg = glowLayer.getContext('2d')!
        gg.clearRect(0, 0, GW, GH)

        /* Banded along its length by the same spectrum the mesh runs, so the glow belongs to the field. */
        const [gh, gs, gl] = hexToHsl(p.glowColor)
        const band = gg.createLinearGradient(0, 0, GW, 0)
        const stops = 6
        for (let i = 0; i <= stops; i++) {
          const f = i / stops
          const hue = gh + (f - 0.5) * 2 * p.richness * 140 + time * p.spectralDrift
          band.addColorStop(f, hsl(hue, Math.min(1, gs * sat), gl, Math.min(1, p.glow)))
        }

        gg.filter = `blur(${glowBlur}px)`
        gg.strokeStyle = band
        gg.lineWidth = Math.max(1, S * p.glowWidth)
        gg.lineJoin = 'round'
        gg.lineCap = 'round'

        const gOverhang = gPad / Math.max(1, W)
        const glowPts: [number, number][] = []
        for (let i = 0; i <= N; i++) {
          const u = -gOverhang + (i / N) * (1 + gOverhang * 2)
          let y = level + waveY(
            u,
            time,
            p.swell * p.glowDistortion,
            p.swellFrequency,
            p.ripple * p.glowDistortion,
            p.rippleFrequency,
          )
          if (p.cursorInteraction && state.pointer.active) {
            const du = u - state.pointer.x
            const reach = Math.max(0.02, p.cursorReach)
            y -= p.cursorLift * Math.exp(-(du * du) / (2 * reach * reach))
          }
          glowPts.push([u * W + gPad, y * H + gPad])
        }
        gg.beginPath()
        gg.moveTo(glowPts[0][0], glowPts[0][1])
        smoothTo(gg, glowPts)
        gg.stroke()
        gg.filter = 'none'

        ctx.globalCompositeOperation = p.glowBlend
        ctx.globalAlpha = Math.min(1, p.glowOpacity)
        ctx.drawImage(glowLayer, gPad, gPad, W, H, 0, 0, W, H)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      /* ---------------------------------------------------------------- 3. the wave */

      const blur = p.edgeSoftness > 0 ? Math.max(0.5, S * p.edgeSoftness * 0.5) : 0
      /*
       * A blurred shape drawn to the canvas's own edge fades there, because the blur has nothing beyond
       * the boundary to average with — it reads as a vignette down both sides. So a soft-edged wave is
       * drawn on a layer that is bigger than the canvas, with the curve carried past both ends, and only
       * the middle of it is copied back.
       */
      const pad = Math.ceil(blur * 3)
      const target = blur > 0 ? waveLayer.getContext('2d')! : ctx
      const LW = W + pad * 2
      const LH = H + pad * 2

      if (blur > 0) {
        if (waveLayer.width !== LW || waveLayer.height !== LH) {
          waveLayer.width = LW
          waveLayer.height = LH
        }
        target.clearRect(0, 0, LW, LH)
        target.filter = `blur(${blur}px)`
      }

      /* `u` runs past both ends by the padding, so the curve spans the whole layer. */
      const overhang = pad / Math.max(1, W)
      const pts: [number, number][] = []
      for (let i = 0; i <= N; i++) {
        const u = -overhang + (i / N) * (1 + overhang * 2)
        let y = level + waveY(u, time, p.swell, p.swellFrequency, p.ripple, p.rippleFrequency)
        if (p.cursorInteraction && state.pointer.active) {
          const du = u - state.pointer.x
          const reach = Math.max(0.02, p.cursorReach)
          y -= p.cursorLift * Math.exp(-(du * du) / (2 * reach * reach))
        }
        pts.push([u * W + (blur > 0 ? pad : 0), y * H + (blur > 0 ? pad : 0)])
      }

      target.fillStyle = surface
      target.beginPath()
      target.moveTo(pts[0][0], pts[0][1])
      smoothTo(target, pts)
      target.lineTo(pts[pts.length - 1][0], LH)
      target.lineTo(pts[0][0], LH)
      target.closePath()
      target.fill()

      if (blur > 0) {
        target.filter = 'none'
        ctx.drawImage(waveLayer, pad, pad, W, H, 0, 0, W, H)
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
