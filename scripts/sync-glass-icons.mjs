#!/usr/bin/env node
/**
 * Mirrors the Marketing Assets library's glass icons into `assets/glass-icons/library/`.
 *
 * The library (liferaymarketingassets-site…/library?kind=icon) is built from `liferay-illustration-system`,
 * whose built-in glass icons are committed there as `assets/glass-icons/<Category> - <Name> - <Dark|Light>.svg`.
 * This copies every one of them across, both artworks, so the design system ships the whole set and can be
 * brought up to date with one command rather than by hand-exporting from Figma.
 *
 * ## Why a folder of its own
 *
 * The icons already in `assets/glass-icons/<category>/` are not the library's files. They are the October
 * 2026 export, several of them redrawn, refitted and renamed (`industries/public-sector` is the library's
 * `Industries - Government`), and no two files match byte for byte. Folding the library into those folders
 * would mean deciding, icon by icon, which drawing wins — and a sync that guesses would quietly swap the
 * artwork on a live page.
 *
 * So the sync owns `library/` outright and nothing else: it adds, updates and **removes** files there until
 * the folder is an exact mirror, and never touches a curated icon. A library icon becomes a component named
 * from its category and its name — `Product Modules - DXP` is `IconGlassProductModulesDxp` — so it cannot
 * collide with the curated `IconGlassDxp` beside it. Picking one of them for a page is a design decision,
 * made where the icon is used.
 *
 * ## What it does to each file
 *
 * 1. **Drops the frame clip** on the icons the library lists in its `viewboxes.json` — the ones whose
 *    artwork the 64px Figma frame cuts flat — exactly as the library's own build does (`unclipFrame` in its
 *    `src/figmaGlass.ts`). The rest keep their frame, as they do in the library.
 * 2. **Fits the viewBox** to the artwork with `fit-glass-icon-viewbox.mjs`, on the library files only, so
 *    the set renders at one apparent size like the curated icons.
 *
 * Then `build-glass-icons.mjs` turns them into components. `library/SOURCE.json` records the commit the
 * mirror was taken from.
 *
 * Usage:
 *   node scripts/sync-glass-icons.mjs [--from <dir>] [--github [ref]] [--check]
 *   --from <dir>    a checkout of liferay-illustration-system. Defaults to $GLASS_ICON_LIBRARY, then to the
 *                   sibling folder ../liferay-illustration-system.
 *   --github [ref]  fetch from GitHub instead (default ref: main), through the GitHub CLI's own sign-in —
 *                   the repository is private, so `gh auth status` has to pass.
 *   --check         exits non-zero if the mirror differs from the source, without writing (for CI).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'makenaford/liferay-illustration-system'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const darkDir = join(root, 'assets', 'glass-icons', 'library')
const lightDir = join(root, 'assets', 'glass-icons-light', 'library')
const sourceRecord = join(darkDir, 'SOURCE.json')

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const flag = (name) => {
  const i = args.indexOf(name)
  if (i < 0) return undefined
  const next = args[i + 1]
  return next && !next.startsWith('--') ? next : ''
}

/* ------------------------------------------------------------------ the source */

let checkout = null
let commit = null
let cleanup = () => {}
const githubRef = flag('--github')

if (githubRef !== undefined) {
  const ref = githubRef || 'main'
  const into = mkdtempSync(join(tmpdir(), 'glass-icons-'))
  cleanup = () => rmSync(into, { recursive: true, force: true })
  try {
    commit = execFileSync('gh', ['api', `repos/${REPO}/commits/${ref}`, '--jq', '.sha'], { encoding: 'utf8' }).trim()
    const tarball = execFileSync('gh', ['api', `repos/${REPO}/tarball/${commit}`], { maxBuffer: 1 << 30 })
    writeFileSync(join(into, 'source.tgz'), tarball)
    execFileSync('tar', ['-xzf', 'source.tgz', '--strip-components=1', '--wildcards', '*/assets/glass-icons/*'], { cwd: into })
  } catch (error) {
    cleanup()
    console.error(`Could not fetch ${REPO}@${ref} with the GitHub CLI — is \`gh auth status\` signed in?\n${error.message}`)
    process.exit(1)
  }
  checkout = into
} else {
  checkout = flag('--from') || process.env.GLASS_ICON_LIBRARY || join(root, '..', 'liferay-illustration-system')
  try {
    commit = execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    const dirty = execFileSync('git', ['-C', checkout, 'status', '--porcelain', '--', 'assets/glass-icons'], { encoding: 'utf8' }).trim()
    if (dirty) commit += ' (with uncommitted changes)'
  } catch {
    commit = null
  }
}

const sourceDir = join(checkout, 'assets', 'glass-icons')
if (!existsSync(sourceDir)) {
  cleanup()
  console.error(`No glass icons at ${sourceDir}. Pass --from <checkout of ${REPO}>, or --github.`)
  process.exit(1)
}

/* ------------------------------------------------------------------ the mirror, in memory */

/** `Safety & Compliance` -> `safety-compliance`; `Out of the box3` -> `out-of-the-box3`. */
const slug = (text) => text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).join('-')

/** The library's measured boxes: which icons its own build unclips. */
const viewboxes = JSON.parse(readFileSync(join(sourceDir, 'viewboxes.json'), 'utf8'))

/** Its `unclipFrame`: a clip that is just the icon's frame — a rect at least 56 across — goes. */
function unclipFrame(svg) {
  const frames = [...svg.matchAll(/<clipPath id="([^"]+)"[^>]*>\s*<rect([^>]*)\/>\s*<\/clipPath>/g)]
    .filter((m) => Number(m[2].match(/width="([\d.]+)"/)?.[1] ?? 0) >= 56 && Number(m[2].match(/height="([\d.]+)"/)?.[1] ?? 0) >= 56)
    .map((m) => m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  let out = svg
  for (const id of frames) {
    out = out.replace(new RegExp(`\\sclip-path="url\\(#${id}\\)"`, 'g'), '')
    out = out.replace(new RegExp(`<clipPath id="${id}"[^>]*>[\\s\\S]*?<\\/clipPath>`), '')
  }
  return out
}

/** What the mirror should hold: relative path under `library/` -> contents, per artwork. */
const wanted = { dark: new Map(), light: new Map() }
const keys = new Map()
const problems = []

for (const file of readdirSync(sourceDir).sort()) {
  const match = file.match(/^(.+?) - (.+) - (Dark|Light)\.svg$/)
  if (!match) continue
  const [, category, name, theme] = match
  const key = `${slug(category)}/${slug(name)}`
  const label = `${category} - ${name}`
  if (keys.has(key) && keys.get(key) !== label) problems.push(`  "${label}" and "${keys.get(key)}" both become library/${key}`)
  keys.set(key, label)

  let svg = readFileSync(join(sourceDir, file), 'utf8')
  if (viewboxes[label]?.[theme.toLowerCase()]) svg = unclipFrame(svg)
  wanted[theme === 'Dark' ? 'dark' : 'light'].set(`${key}.svg`, svg)
}

for (const key of keys.keys()) {
  if (!wanted.dark.has(`${key}.svg`)) problems.push(`  library/${key} has a Light file and no Dark one`)
}

if (problems.length) {
  cleanup()
  console.error(`The library's glass icons cannot be mirrored as they are:\n${problems.join('\n')}`)
  process.exit(1)
}

/* ------------------------------------------------------------------ compare, then write */

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : entry.endsWith('.svg') ? [full] : []
  })
}

/*
 * A file the fit step has already widened differs from its source only in its viewBox, so the comparison
 * ignores the root viewBox: otherwise every run would rewrite every fitted icon and fit it again.
 */
const sameArt = (a, b) => a.replace(/viewBox="[^"]*"/, '') === b.replace(/viewBox="[^"]*"/, '')

const changes = { added: [], updated: [], removed: [] }
const toWrite = []
for (const [theme, dir] of [['dark', darkDir], ['light', lightDir]]) {
  const present = new Map(walk(dir).map((file) => [relative(dir, file).split(sep).join('/'), file]))
  for (const [path, svg] of wanted[theme]) {
    const file = join(dir, path)
    if (!present.has(path)) changes.added.push(`${theme}/${path}`)
    else if (!sameArt(readFileSync(file, 'utf8'), svg)) changes.updated.push(`${theme}/${path}`)
    else continue
    toWrite.push({ file, svg })
  }
  for (const [path, file] of present) {
    if (!wanted[theme].has(path)) {
      changes.removed.push(`${theme}/${path}`)
      toWrite.push({ file, remove: true })
    }
  }
}

const record = `${JSON.stringify({ $comment: 'Written by scripts/sync-glass-icons.mjs — the source of this mirror.', repository: REPO, commit }, null, 2)}\n`
const recordChanged = !existsSync(sourceRecord) || readFileSync(sourceRecord, 'utf8') !== record
const total = changes.added.length + changes.updated.length + changes.removed.length

const summary = () =>
  [
    changes.added.length ? `${changes.added.length} added` : '',
    changes.updated.length ? `${changes.updated.length} updated` : '',
    changes.removed.length ? `${changes.removed.length} removed` : '',
  ]
    .filter(Boolean)
    .join(', ')

if (checkOnly) {
  cleanup()
  if (total) {
    console.error(`assets/glass-icons/library is out of date with ${REPO} (${summary()}) — run \`pnpm glass-icons:sync\`.`)
    process.exit(1)
  }
  console.log(`assets/glass-icons/library mirrors ${REPO} (${keys.size} icons).`)
  process.exit(0)
}

for (const { file, svg, remove } of toWrite) {
  if (remove) rmSync(file)
  else {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, svg)
  }
}
if (recordChanged) writeFileSync(sourceRecord, record)
cleanup()

if (!total) {
  console.log(`assets/glass-icons/library already mirrors ${REPO} (${keys.size} icons).`)
} else {
  console.log(`Synced ${keys.size} icons from ${REPO}${commit ? ` @ ${commit.slice(0, 7)}` : ''}: ${summary()}.`)
  for (const [kind, list] of Object.entries(changes)) for (const path of list) console.log(`  ${kind.padEnd(7)} ${path}`)
}

/* ------------------------------------------------------------------ fit and build */

const run = (script, ...rest) => execFileSync(process.execPath, [join(root, 'scripts', script), ...rest], { stdio: 'inherit' })
const written = toWrite.filter((w) => !w.remove).map((w) => w.file)
if (written.length) run('fit-glass-icon-viewbox.mjs', ...written)
run('build-glass-icons.mjs')
