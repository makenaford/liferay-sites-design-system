#!/usr/bin/env node
/**
 * Turns a Figma SVG *export* of one glass icon into a committable asset.
 *
 * The MCP `download_assets` export of an icon instance is not the icon: Figma renders the node inside
 * its surroundings, so the file opens with the canvas colour as a 64x64 `<rect fill="#1E1E1E">` and the
 * enclosing section as two paths with coordinates in the thousands, and only then reaches the artwork.
 * Saving that as-is would commit a dark grey square with an icon on it — which on the light canvas this
 * set exists for is exactly wrong, and would not be obvious until it rendered.
 *
 * `svgAssets` from the same response is not the answer either: those are individual vector *layers*,
 * each with its own off-square viewBox and `preserveAspectRatio="none"`, so reassembling an icon from
 * them means redoing Figma's layout by hand.
 *
 * So this takes the export and keeps the one subtree that is the icon — the `<g id="Glass icon / …">`
 * Figma names after the component — plus the `<defs>` its `url(#…)` references resolve against. The
 * result is a 64x64 file shaped like the ones already in `assets/glass-icons/`, which is what
 * `build-glass-icons.mjs` downstream expects.
 *
 * Usage: node scripts/extract-figma-glass-icon.mjs <in.svg> <out.svg>
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * The substring from `<g` at `start` to its matching `</g>`.
 *
 * A regex cannot do this: these subtrees nest six or seven groups deep and `<g[\s\S]*?<\/g>` stops at
 * the first close, which takes the outermost group's opening tag and an inner group's closing one.
 */
function groupAt(svg, start) {
  let depth = 0
  const tag = /<\/?g\b[^>]*?(\/?)>/g
  tag.lastIndex = start
  for (let m = tag.exec(svg); m; m = tag.exec(svg)) {
    if (m[0].startsWith('</')) {
      depth -= 1
      if (depth === 0) return svg.slice(start, m.index + m[0].length)
    } else if (m[1] !== '/') {
      depth += 1
    }
  }
  throw new Error('unbalanced <g> — no matching close tag')
}

export function extractGlassIcon(svg) {
  const open = svg.search(/<g id="Glass ?[Ii]con ?\//)
  if (open === -1) throw new Error('no `<g id="Glass icon / …">` group in this export')

  const artwork = groupAt(svg, open)

  /*
   * Every `<defs>` block, not the ones this subtree happens to reference. Figma emits one per export and
   * the gradients inside it are shared across layers; pruning by which ids the artwork mentions would
   * have to follow references *through* the defs — a gradient that references another gradient — and
   * getting that wrong loses a fill silently. The generator downstream namespaces every id anyway, so an
   * unused one costs a few bytes and nothing else.
   */
  const defs = [...svg.matchAll(/<defs>[\s\S]*?<\/defs>/g)].map((m) => m[0]).join('\n')

  /*
   * Is the artwork actually on the 64 grid?
   *
   * Usually yes — Figma exports a node translated to the origin. One instance in 34 came back with its
   * paths at their *canvas* coordinates instead (`Product Modules/Low-Code`, at around x=320 y=230), and
   * the file it produced was valid SVG, the right size, and completely blank: everything it drew was
   * outside the viewBox. Nothing downstream would have caught that, and a blank icon on a page reads as
   * a loading state rather than as a bug.
   *
   * This is a smell test, not a bounding box — a real one means parsing every path command, and the
   * failure is not subtle. If every path in the file starts somewhere far outside the box, say so and
   * let a human place it; a `transform="translate(…)"` on the artwork group is the fix, measured against
   * a sibling rather than guessed.
   */
  const starts = [...artwork.matchAll(/<path[^>]*\sd="M\s*(-?[\d.]+)[ ,](-?[\d.]+)/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ])
  const outside = starts.length > 0 && starts.every(([x, y]) => x > 100 || y > 100)

  return {
    svg: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
${artwork}
${defs}
</svg>
`,
    outside,
  }
}

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('usage: node scripts/extract-figma-glass-icon.mjs <in.svg> <out.svg>')
  process.exit(1)
}

const { svg, outside } = extractGlassIcon(readFileSync(input, 'utf8'))
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, svg)
console.log(`${output} — ${svg.length} bytes`)

if (outside) {
  console.error(
    `\n  ⚠ ${output}\n  Every path in this icon starts outside the 64x64 box, so it will render blank.` +
      `\n  Figma exported it at its canvas position. Measure it in a browser —` +
      `\n    svg.getBBox()  → {x, y, w, h}` +
      `\n  — and wrap the artwork group in transform="translate(-x, -y)", offset so the box matches a` +
      `\n  sibling's (they sit at about -1, 0).\n`,
  )
  process.exitCode = 2
}
