/**
 * Turns the Figma token exports in `tokens/figma/` into the two generated files the theme reads:
 *
 *   src/theme/tokens.generated.ts    — every token as a typed, flat record
 *   src/theme/typography.generated.css — the three typography modes as responsive CSS variables
 *
 * Run it with `pnpm tokens` after re-exporting from Figma (Figma → Variables → Export). Nothing
 * here is hand-maintained: if a value looks wrong, fix it in Figma and re-export.
 *
 * Usage: node scripts/build-tokens.mjs [--check]
 *   --check  exits non-zero if the generated files are out of date, without writing them (for CI)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const figmaDir = join(root, 'tokens', 'figma')
const outDir = join(root, 'src', 'theme')
const checkOnly = process.argv.includes('--check')

/**
 * The colour files that make up each mode. Figma's variable export writes one file per mode, but a
 * mode can be assembled from several files — `color.action.*` was read out of the Plugin API because
 * the UI export omitted the `Action/*` group. Later files override earlier ones on key collisions,
 * and aliases are resolved across the whole merged set.
 */
const COLOR_MODES = {
  light: ['color.light.tokens.json', 'color.action.light.tokens.json'],
  dark: ['color.dark.tokens.json', 'color.action.dark.tokens.json'],
}

/** The three Figma typography modes, and the min-width each one takes over at. */
const BREAKPOINTS = [
  { mode: 'mobile', file: 'typography.mobile.tokens.json', minWidth: null },
  { mode: 'tablet', file: 'typography.tablet.tokens.json', minWidth: '576px' },
  { mode: 'desktop', file: 'typography.desktop.tokens.json', minWidth: '1200px' },
]

// ---------------------------------------------------------------------------- reading Figma JSON

const read = (file) => JSON.parse(readFileSync(join(figmaDir, file), 'utf8'))

/**
 * Walks a DTCG token tree into `[path, token]` pairs, where `path` is the slash-joined Figma name
 * (`Brand/Primary/Lighten/1`). Figma's `$extensions` and other `$`-prefixed metadata are skipped.
 */
function flatten(node, path = []) {
  if (node === null || typeof node !== 'object') return []
  if ('$value' in node) return [[path.join('/'), node]]
  return Object.entries(node)
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, child]) => flatten(child, [...path, key]))
}

/** `Brand/Primary/Lighten/1` -> `brand-primary-lighten-1`. Also the CSS variable suffix. */
const toKey = (figmaPath) =>
  figmaPath
    .split('/')
    .map((part) =>
      part
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .toLowerCase(),
    )
    .join('-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

// ------------------------------------------------------------------------------------- colours

/** Figma exports an opaque `hex` alonga separate `alpha`, so translucent tokens need rebuilding. */
function toCss(value) {
  const { hex, alpha = 1, components } = value
  if (alpha >= 1) return String(hex).toLowerCase()
  const [r, g, b] = components
    ? components.slice(0, 3).map((c) => Math.round(c * 255))
    : [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(4))})`
}

/**
 * Resolves one colour mode. Figma writes cross-token references as `{Brand.Primary.Primary}` —
 * in the light mode most Status colours are aliases of the Brand ramp — so those are followed
 * until they reach a literal. Cycles and dangling references fail loudly rather than silently
 * producing `undefined` in the theme.
 */
function resolveColors(files) {
  const entries = files.flatMap((file) => flatten(read(file)))
  const byDotPath = new Map(entries.map(([path, token]) => [path.replace(/\//g, '.'), token]))
  const out = {}

  for (const [path, token] of entries) {
    if (token.$type !== 'color') continue
    let value = token.$value
    const seen = new Set([path.replace(/\//g, '.')])

    while (typeof value === 'string') {
      const ref = value.replace(/^\{|\}$/g, '')
      if (seen.has(ref)) throw new Error(`Circular token alias: ${path} -> ${ref}`)
      seen.add(ref)
      const target = byDotPath.get(ref)
      if (!target) throw new Error(`Token ${path} references missing token {${ref}}`)
      value = target.$value
    }

    out[toKey(path)] = toCss(value)
  }
  return out
}

/** Number tokens (radius, spacing, font sizes) keyed the same way, with the raw Figma number. */
function resolveNumbers(file, stripPrefix = '') {
  return Object.fromEntries(
    flatten(read(file))
      .filter(([, token]) => token.$type === 'number')
      .map(([path, token]) => [toKey(path.replace(stripPrefix, '')), token.$value]),
  )
}

// ------------------------------------------------------------------------------------ generating

const light = resolveColors(COLOR_MODES.light)
const dark = resolveColors(COLOR_MODES.dark)

const radius = resolveNumbers('radius.tokens.json')
const spacingAll = resolveNumbers('spacing.tokens.json')
/** `padding/*` and `gap/*` are the same 14-step scale in Figma, so one scale is generated. */
const spacing = Object.fromEntries(
  Object.entries(spacingAll)
    .filter(([key]) => key.startsWith('padding-'))
    .map(([key, value]) => [key.replace('padding-', ''), value]),
)

const typography = Object.fromEntries(
  BREAKPOINTS.map(({ mode, file }) => [mode, resolveNumbers(file)]),
)

const missing = Object.keys(light).filter((key) => !(key in dark))
if (missing.length) throw new Error(`Tokens present in light but not dark: ${missing.join(', ')}`)

const banner = `/**
 * AUTO-GENERATED by scripts/build-tokens.mjs from tokens/figma/*.tokens.json.
 * Do not edit by hand — change the value in Figma, re-export, and run \`pnpm tokens\`.
 *
 * Keys are the Figma token names kebab-cased: \`Brand/Primary/Lighten/1\` -> \`brand-primary-lighten-1\`.
 */`

const ts = `${banner}

/** Colour tokens for the Figma "Light" mode. */
export const colorLight = ${JSON.stringify(light, null, 2)} as const

/** Colour tokens for the Figma "LRDC-Dark" mode. Same keys as \`colorLight\`. */
export const colorDark: Record<keyof typeof colorLight, string> = ${JSON.stringify(dark, null, 2)}

/** Every colour token name, usable as \`--sds-\${ColorToken}\` at runtime. */
export type ColorToken = keyof typeof colorLight

/** \`Border Radius\` variable collection, in px. */
export const radius = ${JSON.stringify(radius, null, 2)} as const

/** The shared \`padding\`/\`gap\` step scale, in px. */
export const spacing = ${JSON.stringify(spacing, null, 2)} as const

/** Font sizes and line heights per Figma typography mode, in px. */
export const typography = ${JSON.stringify(typography, null, 2)} as const

/** The min-width each typography mode takes over at; \`mobile\` is the base. */
export const typographyBreakpoints = ${JSON.stringify(
  Object.fromEntries(BREAKPOINTS.map((b) => [b.mode, b.minWidth])),
  null,
  2,
)} as const
`

const cssBlocks = BREAKPOINTS.map(({ mode, minWidth }) => {
  const declarations = Object.entries(typography[mode])
    .map(([key, value]) => `    --sds-${key}: ${value}px;`)
    .join('\n')
  return minWidth
    ? `@media (min-width: ${minWidth}) {\n  :root {\n${declarations}\n  }\n}`
    : `:root {\n${declarations}\n}`
})

const css = `/*
 * AUTO-GENERATED by scripts/build-tokens.mjs — do not edit.
 *
 * Figma publishes typography as three modes of one variable collection (Mobile 0+, Tablet 576+,
 * Desktop 1200+). Emitting them as media-queried CSS variables is what makes the type scale
 * responsive: the theme refers to \`var(--sds-size-paragraph-base)\`, and the value changes with
 * the viewport without any component re-rendering.
 */

${cssBlocks.join('\n\n')}
`

const outputs = [
  [join(outDir, 'tokens.generated.ts'), ts],
  [join(outDir, 'typography.generated.css'), css],
]

let stale = false
for (const [path, contents] of outputs) {
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null
  if (current === contents) continue
  stale = true
  if (!checkOnly) writeFileSync(path, contents)
  console.log(`${checkOnly ? 'stale' : 'wrote'} ${path.replace(`${root}/`, '')}`)
}

if (checkOnly && stale) {
  console.error('\nGenerated token files are out of date. Run `pnpm tokens`.')
  process.exit(1)
}
if (!stale) console.log('Token files already up to date.')
console.log(
  `${Object.keys(light).length} colours, ${Object.keys(radius).length} radii, ` +
    `${Object.keys(spacing).length} spacing steps, ` +
    `${Object.keys(typography.desktop).length} type tokens x ${BREAKPOINTS.length} modes.`,
)
