#!/usr/bin/env node
/**
 * Emits importable silhouettes from the glass icons, for the Blender pipeline in `render-glass-3d.py`.
 *
 * Blender's SVG importer reads paths and flat fills. It does not read Figma's `<foreignObject>`
 * backdrop blur, its `feGaussianBlur`/`feBlend` filter stacks, or gradient fills — feeding it a source
 * icon directly imports a pile of stray curves and no usable material. So this strips each icon back
 * to the only two things a renderer needs, geometry and which material it wants:
 *
 *   - the **backplate**, the one path filled from a `paint*_linear` gradient, re-flattened to a solid;
 *   - the **glass bodies**, every path carrying a Figma glass fill (`#70A1FF` dark, `#99BCFF` light).
 *
 * Both come out as flat named fills rather than gradients, because the importer classifies by colour
 * and the shading is the renderer's job now, not the file's.
 *
 * Each icon also carries filter copies of its glass paths with no `fill` at all — same `d`, drawn only
 * to catch an inner shadow. Those are dropped; keeping them would stack a second solid on every glass
 * element and quietly double its thickness.
 *
 * Usage: node scripts/export-glass-silhouettes.mjs [--light] [icon path ...]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, sep } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const light = process.argv.includes('--light')
const from = join(root, 'assets', light ? 'glass-icons-light' : 'glass-icons')
const to = join(root, 'assets', 'glass-silhouettes')

/** Flat stand-ins the Blender side matches on. Nothing reads them as colour — they are labels. */
const SOLID = '#0B5FFF'
const GLASS = '#70A1FF'

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (e.endsWith('.svg')) out.push(full)
  }
  return out
}
const keyOf = (f) => relative(from, f).replace(/\.svg$/, '').split(sep).join('/')

const attrOf = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) ?? [, null])[1]
/** `fill-rule`/`clip-rule` decide whether a hole is a hole, so they travel with the geometry. */
const shapeAttrs = (tag) => {
  const r = attrOf(tag, 'fill-rule')
  return r ? ` fill-rule="${r}" clip-rule="${attrOf(tag, 'clip-rule') ?? r}"` : ''
}

function extract(svg) {
  const viewBox = (svg.match(/viewBox="([^"]+)"/) ?? [, '0 0 64 64'])[1]
  const body = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '')

  const solid = []
  const glass = []
  for (const tag of body.match(/<path\b[^>]*\/>/g) ?? []) {
    const fill = attrOf(tag, 'fill')
    const d = attrOf(tag, 'd')
    if (!d || !fill || fill === 'none') continue
    if (/^url\(#paint\d+_linear/.test(fill)) solid.push({ d, s: shapeAttrs(tag) })
    else if (/^#(70A1FF|99BCFF)$/i.test(fill)) glass.push({ d, s: shapeAttrs(tag) })
  }
  if (!solid.length && !glass.length) return null

  const draw = (list, fill) =>
    list.map(({ d, s }) => `<path d="${d}"${s} fill="${fill}"/>`).join('\n')

  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
<g id="solid">
${draw(solid, SOLID)}
</g>
<g id="glass">
${draw(glass, GLASS)}
</g>
</svg>
`
}

const all = walk(from)
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const files = wanted.length ? all.filter((f) => wanted.includes(keyOf(f))) : all

const missing = wanted.filter((w) => !all.some((f) => keyOf(f) === w))
if (missing.length) {
  console.error(`Not in ${relative(root, from)}: ${missing.join(', ')}`)
  process.exit(1)
}

let n = 0
const skipped = []
for (const file of files) {
  const out = extract(readFileSync(file, 'utf8'))
  if (!out) {
    skipped.push(keyOf(file))
    continue
  }
  // Flattened to one directory: Blender is handed explicit file paths, and a flat name is what comes
  // back out as the render's filename.
  const target = join(to, `${keyOf(file).replace(/\//g, '__')}.svg`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, out)
  n += 1
}
console.log(`Wrote ${n} silhouette${n === 1 ? '' : 's'} to ${relative(root, to)}/`)
if (skipped.length) console.warn(`Nothing extractable, skipped: ${skipped.join(', ')}`)
