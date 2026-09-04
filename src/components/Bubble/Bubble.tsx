import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface BubbleProps {
  /** Travel speed of the wave. @default 1 */
  speed?: number
  /** Height of the primary swell (fraction of canvas height). @default 0.09 */
  swell?: number
  /** Frequency of the primary swell across the width. @default 1 */
  swellFrequency?: number
  /** Height of the secondary ripple (fraction of canvas height). @default 0.02 */
  ripple?: number
  /** Frequency of the secondary ripple across the width. @default 1 */
  rippleFrequency?: number
  /** Vertical placement of the wave; 0 = centered, -1..1. @default -0.15 */
  waterline?: number
  /** Brightness of the crest line. @default 1 */
  glow?: number
  /** Width of the crest line (fraction of the shorter canvas side). @default 0.045 */
  glowWidth?: number
  /** Brightness of the blurred halo around the crest. @default 1 */
  halo?: number
  /** Width of the halo (fraction of the shorter canvas side). @default 0.28 */
  haloWidth?: number
  /** How far the colour gradient reaches below the crest (0..1). @default 0.55 */
  depth?: number
  /** Softness of the fill's top edge, in canvas-height fraction. @default 0.06 */
  edgeSoftness?: number
  /** Deep colour under the wave. @default '#050110' */
  color?: string
  /** Colour of the crest and glow. @default '#8b3bd6' */
  hotColor?: string
  /** Canvas background colour. @default '#000003' */
  backgroundColor?: string
  /** Iridescence intensity — hue drift along the crest. @default 0.62 */
  richness?: number
  /** Vividness of the colour bands. @default 1.15 */
  saturation?: number
  /** Film grain strength. @default 0.04 */
  grain?: number
  /** Whether the pointer raises the crest near it. @default true */
  cursorInteraction?: boolean
  /** Height the pointer lifts the crest (fraction of canvas height). @default 0.1 */
  cursorLift?: number
  /** Width of the pointer's lift effect (fraction of canvas width). @default 0.22 */
  cursorReach?: number
  /** Scale internal render resolution down under frame-time pressure. @default true */
  adaptiveQuality?: boolean
  /** Frame-rate budget adaptive quality scales against. @default 60 */
  targetFps?: number
  /** Overall opacity of the canvas. @default 1 */
  opacity?: number
  /** Freeze the animation on its current frame. @default false */
  paused?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * `Bubble`'s own defaults render the "Bubble Canvas" look: a deep black field with a low crest and a
 * blue → violet → magenta rim band. Every value here is a plain prop, so the component works with zero
 * configuration — `<Bubble />` — and every one of them is exposed as a Storybook control.
 */
export const BUBBLE_DEFAULTS: Required<Omit<BubbleProps, 'className' | 'style'>> = {
  speed: 1,
  swell: 0.09,
  swellFrequency: 1,
  ripple: 0.02,
  rippleFrequency: 1,
  waterline: -0.15,
  glow: 1,
  glowWidth: 0.045,
  halo: 1,
  haloWidth: 0.28,
  depth: 0.55,
  edgeSoftness: 0.06,
  color: '#050110',
  hotColor: '#8b3bd6',
  backgroundColor: '#000003',
  richness: 0.62,
  saturation: 1.15,
  grain: 0.04,
  cursorInteraction: true,
  cursorLift: 0.1,
  cursorReach: 0.22,
  adaptiveQuality: true,
  targetFps: 60,
  opacity: 1,
  paused: false,
}

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
  return `hsla(${hue.toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%, ${a})`
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

/** Catmull-Rom -> cubic bezier so the crest reads as one smooth curve. */
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
 * Bubble — a single luminous wave sweeping slowly across a canvas, ported from the
 * `glowing-wave-studio` prototype.
 *
 * Self-contained: one `<canvas>`, driven by `requestAnimationFrame`, with every visual parameter as a
 * plain prop. It fills its parent, so give the parent an explicit height (or `position: absolute; inset:
 * 0` inside a positioned container) — the same way `Marquee` and other full-bleed decoration in this
 * library work.
 *
 * ```tsx
 * <div style={{ height: 480, position: 'relative' }}>
 *   <Bubble />
 * </div>
 * ```
 *
 * Two instances stacked with `position: absolute` and a `mix-blend-mode` (`screen`, `lighten`,
 * `difference`) on the second reproduce the prototype's two-wave overlap.
 *
 * `adaptiveQuality` scales the internal render resolution down when a frame is taking too long against
 * `targetFps`, so the animation degrades gracefully on slower devices instead of dropping frames outright.
 * `prefers-reduced-motion` freezes the wave on its current frame regardless of `paused`.
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
      cssW: 0,
      cssH: 0,
      pointer: { x: 0.5, y: 0.5, active: false },
      pausedT: 0,
    }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      state.cssW = rect.width
      state.cssH = rect.height
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
    const fillLayer = document.createElement('canvas')
    const maskLayer = document.createElement('canvas')
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

      /*
       * `fillRect` with an opaque `backgroundColor` overwrites every pixel and would look the same
       * without this — but a *transparent* `backgroundColor` (two `Bubble` layers stacked with a CSS
       * blend mode, see the docs above) makes that fill a no-op: `source-over` with zero alpha composites
       * to nothing, so the previous frame's pixels would stay right where they were. The halo and glow
       * passes below use additive `lighter` blending, so without a real clear here they never reset —
       * they just keep stacking on the frame before, saturating to solid white within about a second and
       * staying there. `clearRect` is what actually resets the canvas to transparent, regardless of what
       * `fillRect` is about to paint over it.
       */
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.filter = 'none'
      ctx.fillStyle = p.backgroundColor
      ctx.fillRect(0, 0, W, H)

      const level = Math.min(0.95, Math.max(0.05, 0.5 - p.waterline * 0.4))

      const N = 96
      const pts: [number, number][] = []
      for (let i = 0; i <= N; i++) {
        const u = i / N
        let y = level + waveY(u, time, p.swell, p.swellFrequency, p.ripple, p.rippleFrequency)
        if (p.cursorInteraction && state.pointer.active) {
          const du = u - state.pointer.x
          const reach = Math.max(0.02, p.cursorReach)
          y -= p.cursorLift * Math.exp(-(du * du) / (2 * reach * reach))
        }
        pts.push([u * W, y * H])
      }

      const [hh, hs, hl] = hexToHsl(p.hotColor)
      const [ch, cs, cl] = hexToHsl(p.color)
      const sat = Math.max(0, Math.min(1.5, p.saturation))

      const rim = ctx.createLinearGradient(0, 0, W, 0)
      const stops = 6
      for (let i = 0; i <= stops; i++) {
        const f = i / stops
        const hueShift = (f - 0.5) * 2 * p.richness * 70
        rim.addColorStop(f, hsl(hh + hueShift, Math.min(1, hs * sat), hl))
      }

      if (fillLayer.width !== W || fillLayer.height !== H) {
        fillLayer.width = maskLayer.width = W
        fillLayer.height = maskLayer.height = H
      }
      const fg = fillLayer.getContext('2d')!
      const mg = maskLayer.getContext('2d')!
      fg.clearRect(0, 0, W, H)
      mg.clearRect(0, 0, W, H)

      // deep fill + rim wash + depth fade, drawn unclipped onto an offscreen layer
      fg.fillStyle = hsl(ch, cs * sat, cl)
      fg.fillRect(0, 0, W, H)

      fg.globalCompositeOperation = 'lighter'
      fg.globalAlpha = 0.55
      fg.fillStyle = rim
      fg.fillRect(0, 0, W, H)
      fg.globalAlpha = 1

      fg.globalCompositeOperation = 'source-over'
      const reach = Math.max(0.02, p.depth) * H
      const fade = fg.createLinearGradient(0, level * H, 0, Math.max(0, level * H - reach))
      const deep = hsl(ch, cs * sat, cl, 0)
      const deepFull = hsl(ch, cs * sat, cl * 0.4, 0.95)
      fade.addColorStop(0, deep)
      fade.addColorStop(0.35, hsl(ch, cs * sat, cl * 0.6, 0.7))
      fade.addColorStop(1, deepFull)
      fg.fillStyle = fade
      fg.fillRect(0, 0, W, H)

      // mask: the area above the crest, blurred so edgeSoftness feathers the
      // fill's top boundary instead of leaving a hard clipped edge
      mg.filter = p.edgeSoftness > 0 ? `blur(${Math.max(0.5, S * p.edgeSoftness * 0.5)}px)` : 'none'
      mg.fillStyle = '#fff'
      mg.beginPath()
      mg.moveTo(pts[0][0], pts[0][1])
      smoothTo(mg, pts)
      mg.lineTo(W, 0)
      mg.lineTo(0, 0)
      mg.closePath()
      mg.fill()
      mg.filter = 'none'

      fg.globalCompositeOperation = 'destination-in'
      fg.drawImage(maskLayer, 0, 0)
      fg.globalCompositeOperation = 'source-over'

      ctx.drawImage(fillLayer, 0, 0)

      ctx.globalCompositeOperation = 'lighter'
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      const haloLayers: [number, number, number][] = [
        [p.haloWidth * 1.0, 0.5, p.halo * 0.6],
        [p.haloWidth * 0.5, 0.2, p.halo],
      ]
      for (const [w, blur, a] of haloLayers) {
        if (w <= 0 || a <= 0) continue
        ctx.strokeStyle = rim
        ctx.globalAlpha = Math.min(1, a)
        ctx.lineWidth = Math.max(0.8, S * w)
        ctx.filter = `blur(${Math.max(1, S * blur)}px)`
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        smoothTo(ctx, pts)
        ctx.stroke()
      }
      ctx.filter = 'none'
      ctx.globalAlpha = 1

      ctx.strokeStyle = rim
      ctx.globalAlpha = Math.min(1, p.glow)
      ctx.lineWidth = Math.max(1, S * p.glowWidth * 0.3)
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      smoothTo(ctx, pts)
      ctx.stroke()

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      if (p.grain > 0) {
        ctx.globalCompositeOperation = 'overlay'
        ctx.globalAlpha = Math.min(1, p.grain)
        const ox = Math.random() * noiseTile.width
        const oy = Math.random() * noiseTile.height
        const pattern = ctx.createPattern(noiseTile, 'repeat')!
        const m = new DOMMatrix().translate(ox, oy)
        pattern.setTransform(m)
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
