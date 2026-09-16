#!/usr/bin/env node
/**
 * Turns the flat glass icons in `assets/glass-icons/` into extruded 3D ones in
 * `assets/glass-icons-3d/`, without touching the sources.
 *
 * ## What "3D" means here
 *
 * These stay SVG. A real renderer would trace light through the solid; this fakes the same five cues
 * a viewer actually reads as glass, in the order they are painted:
 *
 *   1. **Contact shadow** — a blurred dark copy below the body, so it sits on the backplate rather
 *      than floating over it.
 *   2. **Extruded side wall** — `STEPS` copies of the silhouette marched along the depth axis and
 *      shaded dark-to-light. This is what supplies thickness, and it is the whole reason the result
 *      reads as a solid rather than a sticker.
 *   3. **Top face** — the original silhouette, its flat `#70A1FF` at 0.3 swapped for a gradient that
 *      runs pale at the lit corner to saturated at the shaded one. Thin parts stay pale and thick
 *      parts deepen, which is what volume absorption does in a real glass shader.
 *   4. **Bevel highlight** — the silhouette nudged toward the light and clipped back to itself, so
 *      only a crescent survives along the lit edge. The chamfer catching the key light does most of
 *      the work in a rendered glass icon; this is the cheap stand-in for it.
 *   5. **Rim specular** — a thin bright stroke, faded around to the shaded side.
 *
 * ## Why the light direction is a constant and not a parameter
 *
 * The fastest way to make 165 icons look like 165 unrelated icons is to let the highlight wander. The
 * key is fixed at upper-left for the entire set, so the extrusion always marches down-right and the
 * bevel always sits up-left. Every constant below is expressed on a 64px grid and scaled per icon,
 * because the sources do not share a viewBox — `fit-glass-icon-viewbox.mjs` sized each one to its own
 * artwork, so a fixed pixel depth would read as a different thickness on each.
 *
 * ## The hook
 *
 * Figma gave every one of the 165 the same shape: a gradient backplate, then the glass body as
 * `fill="#70A1FF" fill-opacity="0.3"` inside a `_dii_` filter group. The body paths are found by that
 * fill, so an icon with several of them (`General/ai` has two) gets each extruded separately.
 *
 * Usage: node scripts/build-3d-glass-icons.mjs [--light] [icon path ...]
 *   --light  converts `assets/glass-icons-light/` into `assets/glass-icons-3d-light/` with the
 *            light-canvas palette. The two runs are independent, and an icon with no light artwork
 *            simply has none here either — which is what the existing generator already expects.
 *   With no arguments, converts the whole set. With arguments, converts just those
 *   (e.g. `node scripts/build-3d-glass-icons.mjs "General/Mail" "Content/Search"`).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, sep } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'assets', 'glass-icons')
const outDir = join(root, 'assets', 'glass-icons-3d')
const lightSourceDir = join(root, 'assets', 'glass-icons-light')
const lightOutDir = join(root, 'assets', 'glass-icons-3d-light')

/* ---------------------------------------------------------------- look ---- */

/**
 * The look, per canvas.
 *
 * A single palette cannot serve both. Frosted glass is defined against its background: on the dark
 * canvas the slab is read by being *lighter* than what is behind it, so a near-white face and a bright
 * edge work. Put that same artwork on white and it disappears — white glass on white has nothing to
 * separate it. The light canvas therefore keeps more blue in the face, takes the edge *down* in value
 * instead of up, and leans harder on the ground shadow, which is what the reference set does.
 *
 * Everything not listed here is shared, because it is geometry rather than colour — depth, direction
 * and step count have to match across the two, or an icon would change shape between themes.
 */
const LOOKS = {
  dark: {
    wallBack: [150, 186, 232],
    wallFront: [232, 243, 255],
    wallAlpha: 0.55,
    face: [
      ['0', '#FFFFFF', 0.62],
      ['0.5', '#DBE9FB', 0.4],
      ['1', '#A9C6EC', 0.52],
    ],
    rim: [
      ['0', '#FFFFFF', 0.95],
      ['0.45', '#EAF3FF', 0.45],
      ['1', '#B9D3F2', 0.65],
    ],
    shadow: '#1B3A66',
    shadowAlpha: 0.22,
  },
  light: {
    // Edge runs darker than the face here: on white it is the only thing drawing the silhouette.
    wallBack: [96, 140, 200],
    wallFront: [186, 214, 246],
    wallAlpha: 0.72,
    face: [
      ['0', '#F2F8FF', 0.86],
      ['0.5', '#C9DFF6', 0.68],
      ['1', '#9BC0E8', 0.78],
    ],
    rim: [
      ['0', '#FFFFFF', 0.98],
      ['0.45', '#AFCDEE', 0.62],
      ['1', '#6E9AD0', 0.72],
    ],
    shadow: '#264A7A',
    shadowAlpha: 0.3,
  },
}

/**
 * Depth in grid units — a slab, not a column.
 *
 * The reference set builds its solidity from a thin bright edge and a ground shadow, not from a long
 * receding wall, and it is right to: at icon sizes a deep extrusion eats the silhouette. Keeping this
 * around 1 is also what stopped `General/ai` doubling — the offset now stays well under the width of
 * the sparkle's thinnest arm, so the wall reads as an edge instead of a second star.
 */
const DEPTH = 1.15
/** Direction the slab is extruded, normalised. Key light is upper-left, so the edge falls down-right. */
const DEPTH_X = 0.55
const DEPTH_Y = 0.83
/** Copies drawn along the edge. Fewer than the deep version needed, since there is less to ramp over. */
const STEPS = 10
/** How far the bevel crescent is nudged toward the light. */
const BEVEL = 0.55
/** Padding around the artwork so the edge and the ground shadow are not clipped by the viewport. */
const PAD = 2.2

/** Chosen once at startup by `--light`; every markup function reads it. */
let look = LOOKS.dark

const lerp = (a, b, t) => a + (b - a) * t
const ramp = (t) =>
  `rgb(${look.wallBack.map((c, i) => Math.round(lerp(c, look.wallFront[i], t))).join(',')})`

/** `[offset, colour, opacity]` rows into gradient stops. */
const stops = (rows) =>
  rows.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')

/* ------------------------------------------------------------- parsing ---- */

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (entry.endsWith('.svg')) out.push(full)
  }
  return out
}

const keyOf = (file) => relative(from, file).replace(/\.svg$/, '').split(sep).join('/')

/**
 * Every `<path>` painted with a Figma glass fill, whichever order its attributes are in.
 *
 * The two canvases were exported with different blues — `#70A1FF` at 0.3 on the dark artwork,
 * `#99BCFF` at 0.21 on the light. Matching only the dark one silently skipped 33 of the 34 light
 * icons and reported success, so both belong here.
 */
const GLASS_PATH = /<path\b[^>]*fill="#(?:70A1FF|99BCFF)"[^>]*\/>/gi
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) ?? [, null])[1]

/**
 * A rough extent for one path, from the coordinates in its `d`.
 *
 * Bézier control points sit outside the curve they describe, so this runs a little large — but it is
 * only ever used to ask "is this shape small", and it avoids making the converter drive a browser for
 * an exact `getBBox()` the way `fit-glass-icon-viewbox.mjs` has to.
 */
function extent(d) {
  const nums = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number)
  const xs = nums.filter((_, i) => i % 2 === 0)
  const ys = nums.filter((_, i) => i % 2 === 1)
  if (!xs.length || !ys.length) return 64
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
}

/**
 * Depth has to track the shape, not the canvas. `General/ai` is a big sparkle beside a small one; at
 * one shared depth the small one is extruded nearly its own width and collapses into a blob. Below
 * `FULL` grid units the wall is tapered off, and the bevel with it, so a small or thin element keeps
 * its silhouette instead of swelling.
 */
const FULL = 26
const shapeScale = (d, k) => Math.min(1, Math.max(0.34, extent(d) / (FULL * k)))

/* ----------------------------------------------------------- transform ---- */

/**
 * The replacement markup for one glass path: shadow, wall, face, bevel, rim.
 *
 * `d` is reused verbatim by every layer — offsets are applied with `transform`, never by rewriting
 * path data, so nothing here has to understand Béziers.
 */
function solidify(tag, i, k) {
  const d = attr(tag, 'd')
  if (!d) return tag

  // Attributes that describe the silhouette itself rather than its paint have to ride along, or a
  // shape with a hole in it (Search's magnifier, Mail's flap) fills solid on every layer.
  const rule = attr(tag, 'fill-rule')
  const clip = attr(tag, 'clip-rule')
  const shape = rule ? ` fill-rule="${rule}" clip-rule="${clip ?? rule}"` : ''

  const z = shapeScale(d, k)
  const dx = DEPTH * DEPTH_X * k * z
  const dy = DEPTH * DEPTH_Y * k * z
  const bx = -BEVEL * DEPTH_X * k * z
  const by = -BEVEL * DEPTH_Y * k * z

  // Deepest copy first: the painter's algorithm is what makes the ramp read as a receding wall.
  const wall = Array.from({ length: STEPS }, (_, s) => {
    const t = s / (STEPS - 1)
    const f = 1 - t
    return `<path d="${d}"${shape} transform="translate(${(dx * f).toFixed(3)} ${(dy * f).toFixed(3)})" fill="${ramp(t)}"/>`
  }).join('')

  return `<g>
<g opacity="${look.shadowAlpha}" filter="url(#g3d_shadow_${i})"><path d="${d}"${shape} transform="translate(${(dx * 0.7).toFixed(3)} ${(dy * 2.6).toFixed(3)})" fill="${look.shadow}"/></g>
<g opacity="${look.wallAlpha}">${wall}</g>
<path d="${d}"${shape} fill="url(#g3d_face_${i})"/>
<g clip-path="url(#g3d_clip_${i})"><g filter="url(#g3d_soft_${i})"><path d="${d}"${shape} transform="translate(${bx.toFixed(3)} ${by.toFixed(3)})" fill="url(#g3d_bevel_${i})"/></g></g>
<path d="${d}"${shape} fill="none" stroke="url(#g3d_rim_${i})" stroke-width="${(0.42 * k * z).toFixed(3)}" opacity="0.85"/>
</g>`
}

/** Gradients, the bevel's clip, and the two blurs, for one glass path. */
function defsFor(tag, i, k) {
  const d = attr(tag, 'd')
  const rule = attr(tag, 'fill-rule')
  const clip = attr(tag, 'clip-rule')
  const shape = rule ? ` fill-rule="${rule}" clip-rule="${clip ?? rule}"` : ''
  const z = shapeScale(d, k)

  return `
<linearGradient id="g3d_face_${i}" x1="0" y1="0" x2="1" y2="1">${stops(look.face)}</linearGradient>
<linearGradient id="g3d_bevel_${i}" x1="0" y1="0" x2="0.9" y2="1">
<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
<stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.12"/>
<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="g3d_rim_${i}" x1="0" y1="0" x2="1" y2="1">${stops(look.rim)}</linearGradient>
<clipPath id="g3d_clip_${i}"><path d="${d}"${shape}/></clipPath>
<filter id="g3d_soft_${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${(0.28 * k * z).toFixed(3)}"/></filter>
<filter id="g3d_shadow_${i}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${(2.1 * k * z).toFixed(3)}"/></filter>`
}

/** One source file's markup, rewritten. */
function convert(svg) {
  const vb = (svg.match(/viewBox="([^"]+)"/) ?? [, '0 0 64 64'])[1].split(/\s+/).map(Number)
  const [vx, vy, vw, vh] = vb
  // Every constant above is drawn on a 64px grid; each icon's box was fitted to its own artwork.
  const k = vw / 64

  const bodies = svg.match(GLASS_PATH) ?? []
  if (!bodies.length) return null

  let i = 0
  const out = svg.replace(GLASS_PATH, (tag) => solidify(tag, i++, k))

  const defs = bodies.map((tag, n) => defsFor(tag, n, k)).join('')
  const withDefs = out.includes('<defs>')
    ? out.replace('<defs>', `<defs>${defs}`)
    : out.replace('</svg>', `<defs>${defs}</defs></svg>`)

  // The wall marches down-right and the shadow further still, so the box has to grow to hold them.
  const pad = PAD * k
  const box = [
    vx - pad,
    vy - pad,
    vw + pad * 2 + DEPTH * DEPTH_X * k * 1.2,
    vh + pad * 2 + DEPTH * DEPTH_Y * k * 1.3,
  ]
  return withDefs.replace(/viewBox="[^"]+"/, `viewBox="${box.map((n) => +n.toFixed(3)).join(' ')}"`)
}

/* ---------------------------------------------------------------- run ----- */

const light = process.argv.includes('--light')
if (light) look = LOOKS.light
const from = light ? lightSourceDir : sourceDir
const to = light ? lightOutDir : outDir

const all = walk(from)
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const files = wanted.length ? all.filter((f) => wanted.includes(keyOf(f))) : all

const missing = wanted.filter((w) => !all.some((f) => keyOf(f) === w))
if (missing.length) {
  console.error(`Not in ${relative(root, from)}: ${missing.join(', ')}`)
  process.exit(1)
}

let written = 0
const skipped = []
for (const file of files) {
  const result = convert(readFileSync(file, 'utf8'))
  if (!result) {
    skipped.push(keyOf(file))
    continue
  }
  const target = join(to, `${keyOf(file)}.svg`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, result)
  written += 1
}

console.log(`Wrote ${written} 3D icon${written === 1 ? '' : 's'} to ${relative(root, to)}/`)
if (skipped.length) console.warn(`No glass body found, skipped: ${skipped.join(', ')}`)
