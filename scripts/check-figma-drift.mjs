#!/usr/bin/env node
/**
 * Compares what the Code Connect mappings assert against what the Figma file actually has.
 *
 * Two component sets have been restyled underneath these mappings without anything noticing:
 *
 * - `card-main`'s `Padding` axis went from two cells to four. `On content` and `Full` produced no
 *   snippet at all, so a designer selecting either got nothing in Dev Mode.
 * - `Label CTA`'s `Style` axis went from Gradient / Tonal / Outline to Filled / Glass / Gradient. The
 *   mapping kept emitting `variant="light"` and `variant="outline"` for cells that no longer existed.
 *
 * Both were found by hand, months apart, while doing something else. This finds them on a schedule.
 *
 * It reads each `src/figma/*.figma.ts`, pulls out the node it claims and the property names and
 * variant options it asserts, then asks the Figma REST API what that node really has. Everything it
 * needs is already in the mapping files — there is no second list to maintain, which is how a check
 * like this normally rots.
 *
 * Deliberately **not** part of `pnpm build`: it needs a token and a network round trip, and a design
 * file moves for reasons that have nothing to do with whether the code compiles. Blocking a deploy on
 * a designer renaming a cell would train everyone to ignore it. Run it on a schedule instead.
 *
 *   FIGMA_ACCESS_TOKEN=… pnpm figma:drift
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const FIGMA_DIR = join(ROOT, 'src/figma')
const TOKEN = process.env.FIGMA_ACCESS_TOKEN

if (!TOKEN) {
  console.error('FIGMA_ACCESS_TOKEN is not set. It is the same token `figma connect publish` uses.')
  process.exit(2)
}

/* ------------------------------------------------------------------ reading the mappings */

/**
 * What a mapping file claims about its Figma node.
 *
 * Parsed with regexes rather than by importing the module: these files are written against Figma's
 * template runtime (`figma.selectedInstance`, `figma.code`), so they cannot be executed under plain
 * Node. The shapes here are narrow and consistent enough that pattern-matching is honest.
 */
function readMapping(file) {
  const source = readFileSync(join(FIGMA_DIR, file), 'utf8')

  const node = source.match(/node-id=([\d]+[-:][\d]+)/)?.[1]?.replace('-', ':')
  const fileKey = source.match(/figma\.com\/design\/([0-9a-zA-Z]{22,128})\//)?.[1]

  /** `instance.getEnum('Style', { Filled: …, 'On content': … })` — the axis and the cells it names. */
  const enums = []
  for (const match of source.matchAll(/getEnum\(\s*'([^']+)'\s*,\s*\{([\s\S]*?)\}\s*\)/g)) {
    const options = [...match[2].matchAll(/(?:^|\n)\s*(?:'([^']+)'|([A-Za-z_$][\w$]*))\s*:/g)].map(
      (option) => option[1] ?? option[2],
    )
    enums.push({ axis: match[1], options })
  }

  /** Everything else the mapping names by string: text, booleans, swaps, slots. */
  const props = [
    ...source.matchAll(/get(?:String|Boolean|InstanceSwap|Slot|PropertyValue)\(\s*'([^']+)'/g),
  ].map((match) => match[1])

  return { file, node, fileKey, enums, props: [...new Set(props)] }
}

const mappings = readdirSync(FIGMA_DIR)
  .filter((file) => file.endsWith('.figma.ts'))
  .map(readMapping)
  .filter((mapping) => {
    if (!mapping.node || !mapping.fileKey) {
      console.warn(`skipping ${mapping.file}: no node-id/file key in its \`// url=\` comment`)
      return false
    }
    return true
  })

/* ------------------------------------------------------------------ asking Figma */

const byFile = new Map()
for (const mapping of mappings) {
  if (!byFile.has(mapping.fileKey)) byFile.set(mapping.fileKey, [])
  byFile.get(mapping.fileKey).push(mapping)
}

/** Figma keys properties as `Show Icon#19392:9`; the part before the `#` is what a mapping names. */
const displayName = (key) => key.split('#')[0]

async function fetchNodes(fileKey, ids) {
  /* The endpoint takes a batch, but a long enough URL 414s — 40 at a time is comfortably under. */
  const found = new Map()
  for (let i = 0; i < ids.length; i += 40) {
    const batch = ids.slice(i, i + 40)
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${batch.join(',')}&depth=1`
    const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
    if (!res.ok) throw new Error(`Figma API ${res.status} ${res.statusText} for ${fileKey}`)
    const body = await res.json()
    for (const [id, entry] of Object.entries(body.nodes ?? {})) found.set(id, entry?.document ?? null)
  }
  return found
}

/* ------------------------------------------------------------------ comparing */

const drift = []
const note = (mapping, kind, detail) => drift.push({ file: mapping.file, kind, detail })

for (const [fileKey, group] of byFile) {
  const nodes = await fetchNodes(fileKey, [...new Set(group.map((m) => m.node))])

  for (const mapping of group) {
    const node = nodes.get(mapping.node)

    if (!node) {
      note(mapping, 'missing node', `${mapping.node} does not resolve — deleted, or moved to another file`)
      continue
    }

    const definitions = node.componentPropertyDefinitions ?? {}
    const byName = new Map(Object.entries(definitions).map(([key, value]) => [displayName(key), value]))

    for (const { axis, options } of mapping.enums) {
      const definition = byName.get(axis)
      if (!definition) {
        note(mapping, 'axis gone', `getEnum('${axis}') — the set has no such property now`)
        continue
      }
      const real = definition.variantOptions ?? []
      const removed = options.filter((option) => !real.includes(option))
      const added = real.filter((option) => !options.includes(option))

      /* A cell the mapping still names but the file has dropped: the snippet is for a dead variant. */
      if (removed.length) note(mapping, 'cells removed', `${axis}: ${removed.join(', ')}`)
      /* A cell the file has and the mapping does not: selecting it in Dev Mode yields no snippet. */
      if (added.length) note(mapping, 'cells unmapped', `${axis}: ${added.join(', ')}`)
    }

    for (const prop of mapping.props) {
      /*
       * Only flag properties the *set itself* declares. A mapping may legitimately reach into a
       * nested instance — Card reads `Title` off a `Content Text` two levels down — and `depth=1`
       * cannot see those, so a miss here is inconclusive rather than wrong.
       */
      if (!byName.has(prop) && Object.keys(definitions).length) {
        note(mapping, 'property not on the set', `'${prop}' — nested, or renamed. Worth a look`)
      }
    }
  }
}

/* ------------------------------------------------------------------ reporting */

console.log(`Checked ${mappings.length} mappings against Figma.\n`)

if (!drift.length) {
  console.log('No drift. Every axis and cell the mappings name still exists, and nothing is unmapped.')
  process.exit(0)
}

const HEADLINE = {
  'missing node': 'Node is gone',
  'axis gone': 'Axis renamed or removed',
  'cells removed': 'Mapping names cells the file no longer has',
  'cells unmapped': 'File has cells the mapping does not name',
  'property not on the set': 'Property not declared on the set',
}

for (const kind of Object.keys(HEADLINE)) {
  const items = drift.filter((item) => item.kind === kind)
  if (!items.length) continue
  console.log(`${HEADLINE[kind]}:`)
  for (const item of items) console.log(`  ${item.file.padEnd(28)} ${item.detail}`)
  console.log()
}

console.log(
  [
    'Not every line here is a bug. A newly added cell is a gap in coverage; a removed one means the',
    'mapping is emitting a snippet for a variant nobody can select. "Property not on the set" is the',
    'weakest signal — a mapping that reads a nested instance will always show up here.',
    '',
    'Confirm against the set before editing: get_context_for_code_connect is the authority, not this.',
  ].join('\n'),
)

process.exit(1)
