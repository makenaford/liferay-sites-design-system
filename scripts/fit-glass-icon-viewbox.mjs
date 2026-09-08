#!/usr/bin/env node
/**
 * Widens each glass icon's `viewBox` until the artwork fits inside it.
 *
 * Figma exports these with `viewBox="0 0 64 64"` — the component frame — but the artwork in most of them
 * is not inside that frame. An SVG root clips to its viewport, so whatever falls outside is simply gone:
 * `Industries/Integration` was losing a whole puzzle piece off its bottom-right, `Data/DAM` the bottom of
 * its folder, `General/Liferay Data Platform` the exploded segment that is the point of the chart. 66 of
 * the 71 icons the library ships were cropped, by up to 18.5px on a 64px grid.
 *
 * It is not obvious by eye on a 48px icon — a sliced folder still reads as a folder — which is why it
 * survived the dark set shipping and a whole light set being added beside it.
 *
 * ## Why a browser
 *
 * The fix needs the artwork's real bounds, and those cannot be had by reading the file: the geometry is
 * spread over nested groups with their own transforms, and the shapes are arbitrary Bézier paths whose
 * extent is not their control points. `getBBox()` is the browser's own answer to exactly this question,
 * so the script asks the browser rather than reimplementing a path solver and being subtly wrong.
 *
 * `getBBox()` ignores filters, and several of these icons are mostly filter — hence `PAD`.
 *
 * ## What it writes
 *
 * A square box, centred on the artwork, never smaller than the original 64. Square because these render
 * in a square container and a non-square box would letterbox them; centred because an icon nudged
 * off-centre inside its own frame reads as a mistake even when nothing is clipped.
 *
 * Idempotent: run it twice and the second run writes nothing.
 *
 * Usage: node scripts/fit-glass-icon-viewbox.mjs [--check]
 *   --check  exits non-zero if any icon is still cropped, without writing (for CI)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chromium } from '@playwright/test'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dirs = [join(root, 'assets', 'glass-icons'), join(root, 'assets', 'glass-icons-light')]
const checkOnly = process.argv.includes('--check')

/** Room for the blur `getBBox()` does not measure. Two units on a 64 grid, so about 3%. */
const PAD = 2

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path.endsWith('.svg') ? [path] : []
  })
}

const files = dirs.filter(existsSync).flatMap(walk)

const browser = await chromium.launch()
const page = await browser.newPage()

const changed = []
for (const file of files) {
  const svg = readFileSync(file, 'utf8')

  await page.setContent(`<body style="margin:0">${svg}</body>`)
  const box = await page.evaluate(() => {
    const b = document.querySelector('svg').getBBox()
    return { x: b.x, y: b.y, width: b.width, height: b.height }
  })

  const left = Math.min(0, box.x - PAD)
  const top = Math.min(0, box.y - PAD)
  const right = Math.max(64, box.x + box.width + PAD)
  const bottom = Math.max(64, box.y + box.height + PAD)

  /* Square, centred on whatever the content actually occupies. */
  const side = Math.ceil(Math.max(right - left, bottom - top))
  const x = Math.floor((left + right) / 2 - side / 2)
  const y = Math.floor((top + bottom) / 2 - side / 2)

  const viewBox = `${x} ${y} ${side} ${side}`
  const current = (svg.match(/viewBox="([^"]+)"/) ?? [])[1]
  if (current === viewBox) continue

  changed.push({ file: file.replace(`${root}/`, ''), from: current, to: viewBox })
  if (!checkOnly) writeFileSync(file, svg.replace(/viewBox="[^"]+"/, `viewBox="${viewBox}"`))
}

await browser.close()

if (changed.length === 0) {
  console.log(`All ${files.length} glass icons already fit their viewBox.`)
} else if (checkOnly) {
  console.error(
    `${changed.length} of ${files.length} glass icons are cropped by their viewBox — run \`pnpm glass-icons:fit\`:\n` +
      changed.map((c) => `  ${c.file}  ${c.from} → ${c.to}`).join('\n'),
  )
  process.exit(1)
} else {
  console.log(`Refitted ${changed.length} of ${files.length} glass icons:`)
  for (const c of changed) console.log(`  ${c.file}  ${c.from} → ${c.to}`)
  console.log('\nRun `pnpm glass-icons` to regenerate the components.')
}
