/**
 * Generates `src/icons/glass.generated.tsx` from the illustrative "glass" icons in
 * `assets/glass-icons/`.
 *
 * These are a different kind of icon from the MingCute set in `build-icons.mjs`. Those are 24px
 * monochrome UI glyphs that draw in `currentColor`; these are 64px illustrations with their own
 * gradients and filters, used in a 48px container on a card. They cannot inherit text colour, and they
 * are not interchangeable with the UI set — hence a second pipeline rather than a second style.
 *
 * What the generator does to each file, and why:
 *
 * 1. **Strips Figma's `<foreignObject>` blocks.** Figma exports a background blur as a `<div>` with
 *    `backdrop-filter` inside a `<foreignObject>`. That is invalid in most SVG renderers, needs a
 *    `style` string React will not accept as-is, and contributes nothing an icon-sized illustration
 *    shows. The real artwork is the sibling `<g filter="…">`, which is kept. The now-unused
 *    `bgblur_*` clip paths go with it.
 * 2. **Namespaces every id per rendered instance.** Ids like `paint0_linear_65_14601` happen to be
 *    unique across this export, but that is not enough on its own: the same icon rendered twice on one
 *    page would emit the id twice, which is invalid and leaves the browser resolving `url(#…)` to
 *    whichever copy came first. Each id is prefixed with React's `useId()` instead, so every instance
 *    owns its own gradients and filters. The colons `useId` includes are stripped, since an id used
 *    through `url(#…)` should stay simple.
 * 3. **Drops the root `width`/`height`.** The container decides the size — 48px by default, which is
 *    what the Figma card draws.
 *
 * Usage: node scripts/build-glass-icons.mjs [--check]
 *   --check  exits non-zero if the generated file is out of date, without writing it (for CI)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, sep } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'assets', 'glass-icons')
const outFile = join(root, 'src', 'icons', 'glass.generated.tsx')
const manifestPath = join(root, 'src', 'icons', 'glass-manifest.json')
const checkOnly = process.argv.includes('--check')

/** Every `.svg` under `assets/glass-icons`, keyed by its path without the extension. */
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (entry.endsWith('.svg')) out.push(full)
  }
  return out
}

const available = new Map(
  walk(sourceDir).map((file) => [
    relative(sourceDir, file).replace(/\.svg$/, '').split(sep).join('/'),
    file,
  ]),
)

/** `Liferay Data Platform` -> `LiferayDataPlatform`; `Out of the box3` -> `OutOfTheBox3`. */
const pascal = (name) =>
  name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

/** `General/Mail` -> `general-mail`, used to compare names when a manifest entry is not found. */
const slugify = (path) =>
  path
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .join('-')
    .toLowerCase()

/** `stroke-linecap` -> `strokeLinecap`; leaves already-camel or single-word attributes alone. */
const camel = (attr) => attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

/**
 * Rewrites SVG markup into JSX: hyphenated attribute names become camelCase, and an inline `style`
 * string becomes an object, since JSX will not take the string form. Figma leaves a few of these
 * behind — `mask-type:alpha` on a mask, `mix-blend-mode:overlay` on a layer.
 */
const toJsx = (markup) =>
  markup
    .replace(/style="([^"]*)"/g, (_, declarations) => {
      const props = declarations
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
          const [prop, ...rest] = part.split(':')
          return `${camel(prop.trim())}: '${rest.join(':').trim()}'`
        })
      return `style={{ ${props.join(', ')} }}`
    })
    .replace(/(\s)([a-z]+(?:-[a-z]+)+)=/g, (_, space, attr) => `${space}${camel(attr)}=`)

/** Suggests close matches so a typo in the manifest is easy to fix. */
function nearest(name, all) {
  const needle = slugify(name)
  return all
    .filter((n) => slugify(n).includes(needle) || needle.includes(slugify(n)))
    .slice(0, 6)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const declared =
  manifest.icons === '*'
    ? [...available.keys()].sort()
    : (manifest.icons ?? []).map((entry) => (typeof entry === 'string' ? { path: entry } : entry))

const entries = manifest.icons === '*' ? declared.map((path) => ({ path })) : declared

const components = []
const errors = []
const seen = new Map()

for (const { path, as } of entries) {
  const file = available.get(path)
  if (!file) {
    const hints = nearest(path, [...available.keys()])
    errors.push(
      `  "${path}" is not in assets/glass-icons` + (hints.length ? ` — did you mean ${hints.join(', ')}?` : ''),
    )
    continue
  }

  const name = `IconGlass${pascal(as ?? path.split('/').pop())}`
  if (seen.has(name)) {
    errors.push(
      `  "${path}" and "${seen.get(name)}" both generate ${name} — give one an "as" name in the manifest`,
    )
    continue
  }
  seen.set(name, path)

  const svg = readFileSync(file, 'utf8')
  const viewBox = (svg.match(/viewBox="([^"]+)"/) ?? [, '0 0 64 64'])[1]

  let inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    // 1. Figma's background-blur export, and the clip paths only it referenced.
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '')
    .replace(/<clipPath[^>]*id="bgblur[^"]*"[\s\S]*?<\/clipPath>/g, '')
    .replace(/\sdata-figma-bg-blur-radius="[^"]*"/g, '')
    .trim()

  // 2. Namespace every id, and every reference to one, against the instance's own `uid`.
  inner = toJsx(inner)
    .replace(/id="([^"]+)"/g, (_, id) => `id={\`\${uid}-${id}\`}`)
    .replace(/="url\(#([^)]+)\)"/g, (_, id) => `={\`url(#\${uid}-${id})\`}`)

  components.push({ export: name, path, viewBox, inner })
}

if (errors.length) {
  console.error(`Problems in src/icons/glass-manifest.json:\n${errors.join('\n')}`)
  process.exit(1)
}

components.sort((a, b) => a.export.localeCompare(b.export))

const body = components
  .map(
    (c) => `/** Glass icon \`${c.path}\`. */
export function ${c.export}({ size = 48, ...props }: GlassIconProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="${c.viewBox}"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      {...props}
    >
      ${c.inner}
    </svg>
  )
}`,
  )
  .join('\n\n')

const contents = `/**
 * AUTO-GENERATED by scripts/build-glass-icons.mjs from assets/glass-icons/.
 * Do not edit by hand — add the icon's path to src/icons/glass-manifest.json and run \`pnpm glass-icons\`.
 *
 * These are illustrations, not UI glyphs: they carry their own gradients and filters, so unlike the
 * MingCute set they do not inherit \`currentColor\`. They are drawn on a 64px grid and default to a 48px
 * box, which is the container the Figma card puts them in. \`aria-hidden\` is set because a card's
 * meaning is in its heading, not its icon — give the icon a label at the call site if it ever stands
 * alone.
 *
 * Every id is namespaced with the rendering instance's own \`useId()\`, so two copies of one icon on a
 * page cannot cross-wire each other's gradients or filters.
 */
import { useId, type SVGProps } from 'react'

export interface GlassIconProps extends SVGProps<SVGSVGElement> {
  /** Both dimensions of the icon box. Defaults to the 48px the Figma card draws. */
  size?: number | string
}

${body}
`

const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : null
if (current === contents) {
  console.log(`Glass icon file already up to date (${components.length} icons).`)
} else if (checkOnly) {
  console.error(
    'src/icons/glass.generated.tsx is out of date with src/icons/glass-manifest.json — run `pnpm glass-icons`.',
  )
  process.exit(1)
} else {
  writeFileSync(outFile, contents)
  console.log(
    `Wrote ${relative(root, outFile)} (${components.length} of ${available.size} available icons).`,
  )
}
