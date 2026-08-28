#!/usr/bin/env node
/**
 * Keeps committed assets small enough to live in git.
 *
 * Page assets *are* committed here, deliberately: the deployed Storybook is what the designers use as
 * a reference, and it has to render on every branch and every preview with no configuration. External
 * hosting would be one more thing that can be misconfigured or forgotten, and when it breaks every
 * page looks broken.
 *
 * What makes that safe is compression, not restraint. A raw 1200x800 alpha webm out of a design tool
 * is 15MB; the same clip at CRF 33 is 2.1MB and scores 0.995 SSIM. The failure mode is not "someone
 * adds too many files", it is "someone commits the raw export because compressing was one step too
 * many" — and git keeps that forever, even after it is deleted.
 *
 * So this is the policy in executable form. Anything genuinely oversized belongs in the git-ignored
 * `media/` folder instead; `media/README.md` has the ffmpeg recipe and the alpha-channel trap.
 */
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const ASSETS = join(ROOT, 'assets')

/** Per file. Comfortably above the compressed hero animation (2.1MB) and the bubbles (2.0 / 1.7MB). */
const MAX_FILE_MB = 4
/** Across everything. A warning rather than a failure — it is a smell, not a breach. */
const WARN_TOTAL_MB = 40

const MB = 1024 * 1024

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

const files = walk(ASSETS).map((path) => ({ path, bytes: statSync(path).size }))
const total = files.reduce((sum, file) => sum + file.bytes, 0)
const oversized = files.filter((file) => file.bytes > MAX_FILE_MB * MB)

const mb = (bytes) => `${(bytes / MB).toFixed(2)}MB`

if (oversized.length) {
  console.error(`\n${oversized.length} asset(s) over the ${MAX_FILE_MB}MB limit:\n`)
  for (const file of oversized.sort((a, b) => b.bytes - a.bytes)) {
    console.error(`  ${mb(file.bytes).padStart(9)}  ${relative(ROOT, file.path)}`)
  }
  console.error(
    [
      '',
      'Compress it, or move it to the git-ignored media/ folder.',
      '',
      'For video, media/README.md has the recipe. The short version — and note the decoder flag',
      'goes BEFORE -i, or the alpha channel is silently dropped:',
      '',
      '  ffmpeg -c:v libvpx-vp9 -i in.webm \\',
      '    -c:v libvpx-vp9 -pix_fmt yuva420p -crf 33 -b:v 0 -row-mt 1 -cpu-used 2 -an out.webm',
      '',
      'Once a large file is committed it is in history for good, so this gate is before the fact',
      'rather than a cleanup afterwards.',
      '',
    ].join('\n'),
  )
  process.exit(1)
}

if (total > WARN_TOTAL_MB * MB) {
  console.warn(
    `assets/ is ${mb(total)} across ${files.length} files, over the ${WARN_TOTAL_MB}MB guideline.\n` +
      'Nothing is broken — worth a look at whether older page assets can move to media/.',
  )
}

console.log(`assets/ ok — ${files.length} files, ${mb(total)}, largest ${mb(Math.max(...files.map((f) => f.bytes)))}`)
