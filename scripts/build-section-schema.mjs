/**
 * Generates `src/builder/sections.generated.ts` — the shape of every built-page section, read off
 * `src/templates/page-schema.ts` — so the builder can edit a `HeroSpec` or a `SectionSpec` with a
 * form instead of a code change.
 *
 * ## Why this is generated rather than written
 *
 * The same argument as `build-builder-catalog.mjs`. `page-schema.ts` already says, exactly once, what
 * a `cardGrid` holds and which values `mediaSide` may take — and it is the list the compiler enforces
 * on every built page. A hand-written form description would be a second copy, and the day someone
 * adds a section type the builder would quietly not offer it. `--check` fails the build on drift.
 *
 * ## The shape
 *
 * A small recursive description, not JSON Schema: the inspector needs to know "text field", "pick
 * one of these", "a list of these objects", "one of these section types", and nothing more. Named
 * interfaces and aliases are emitted once under `DEFS` and referenced by name, which keeps the file
 * readable and is what makes a recursive type (if one ever appears) terminate.
 *
 * Anything the walk cannot describe as JSON comes out as `unknown`, so the omission is visible in the
 * generated file — and the editor shows it as read-only rather than dropping it.
 *
 * Usage: node scripts/build-section-schema.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const schemaFile = join(root, 'src', 'templates', 'page-schema.ts')
const outFile = join(root, 'src', 'builder', 'sections.generated.ts')
const checkOnly = process.argv.includes('--check')

const program = ts.createProgram([schemaFile], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
})
const checker = program.getTypeChecker()
const source = program.getSourceFile(schemaFile)
const moduleSymbol = checker.getSymbolAtLocation(source)
const exported = new Map(checker.getExportsOfModule(moduleSymbol).map((s) => [s.getName(), s]))

/** The two roots a built page is made of. */
const ROOTS = ['HeroSpec', 'SectionSpec']

const flagged = (type, flag) => (type.getFlags() & flag) !== 0

/** The first paragraph of a JSDoc, flattened — what the inspector shows under a field. */
function docOf(symbol) {
  const text = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()
  if (!text) return undefined
  const [first] = text.split(/\n\s*\n/)
  const flat = first.replace(/\s+/g, ' ').trim()
  return flat.length > 220 ? `${flat.slice(0, 219)}…` : flat || undefined
}

/**
 * A name worth emitting under `DEFS`: a non-generic interface or alias declared in this repository.
 * Generic instantiations (`TabGroup<CardSpec[]>`) are inlined, since one name would cover several shapes.
 */
function nameOf(type) {
  const symbol = type.aliasSymbol ?? type.getSymbol()
  if (!symbol) return undefined
  const name = symbol.getName()
  if (!name || name.startsWith('__')) return undefined
  if (type.aliasTypeArguments?.length || type.typeArguments?.length) return undefined
  const declaration = symbol.declarations?.[0]
  if (!declaration) return undefined
  const file = declaration.getSourceFile().fileName
  if (!file.startsWith(join(root, 'src'))) return undefined
  return name
}

const defs = new Map()
const building = new Set()

/** Literal values in source order where the declaration is a plain union of literals. */
function literalsInSourceOrder(typeNode, resolved) {
  if (!typeNode || !ts.isUnionTypeNode(typeNode)) return resolved
  const written = []
  for (const member of typeNode.types) {
    if (!ts.isLiteralTypeNode(member)) return resolved
    const literal = member.literal
    if (ts.isStringLiteral(literal)) written.push(literal.text)
    else if (ts.isNumericLiteral(literal)) written.push(Number(literal.text))
    else return resolved
  }
  const same = written.length === resolved.length && written.every((value) => resolved.includes(value))
  return same ? written : resolved
}

/** The type node an alias or a property was written with, for source-order literals. */
function writtenNode(type, declaration) {
  if (declaration && (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration))) {
    return declaration.type
  }
  const alias = type.aliasSymbol?.declarations?.[0]
  return alias && ts.isTypeAliasDeclaration(alias) ? alias.type : undefined
}

function describe(rawType, declaration) {
  const type = checker.getNonNullableType(rawType)
  const name = nameOf(type)

  if (name) {
    if (!defs.has(name) && !building.has(name)) {
      building.add(name)
      defs.set(name, null)
      defs.set(name, shapeOf(type, writtenNode(type, undefined)))
      building.delete(name)
    }
    return { kind: 'ref', name }
  }
  return shapeOf(type, writtenNode(type, declaration))
}

function shapeOf(type, typeNode) {
  if (flagged(type, ts.TypeFlags.String)) return { kind: 'string' }
  if (flagged(type, ts.TypeFlags.TemplateLiteral)) return { kind: 'string' }
  if (flagged(type, ts.TypeFlags.Number)) return { kind: 'number' }
  if (flagged(type, ts.TypeFlags.Boolean) || flagged(type, ts.TypeFlags.BooleanLiteral)) {
    return { kind: 'boolean' }
  }
  if (type.isStringLiteral() || type.isNumberLiteral()) return { kind: 'enum', options: [type.value] }

  if (type.isUnion()) {
    const members = type.types.filter((member) => !flagged(member, ts.TypeFlags.Undefined | ts.TypeFlags.Null))

    // `true | false` is how the checker spells `boolean`.
    const booleans = members.filter((member) => flagged(member, ts.TypeFlags.BooleanLiteral))
    const rest = members.filter((member) => !flagged(member, ts.TypeFlags.BooleanLiteral))
    if (booleans.length === 2 && rest.length === 0) return { kind: 'boolean' }

    if (rest.length && booleans.length === 0 && rest.every((m) => m.isStringLiteral() || m.isNumberLiteral())) {
      return { kind: 'enum', options: literalsInSourceOrder(typeNode, rest.map((m) => m.value)) }
    }

    const objects = members.filter((member) => flagged(member, ts.TypeFlags.Object) || member.isIntersection())
    if (objects.length === members.length) {
      for (const tag of ['type', 'kind']) {
        const values = objects.map((member) => {
          const prop = checker.getPropertyOfType(member, tag)
          const propType = prop && checker.getTypeOfSymbol(prop)
          return propType?.isStringLiteral() ? propType.value : undefined
        })
        if (values.every((value) => value !== undefined) && new Set(values).size === values.length) {
          return {
            kind: 'union',
            tag,
            variants: Object.fromEntries(objects.map((member, i) => [values[i], objectShape(member)])),
          }
        }
      }
    }

    const options = []
    if (booleans.length === 2) options.push({ kind: 'boolean' })
    for (const member of rest) options.push(describe(member))
    return { kind: 'oneOf', options }
  }

  if (checker.isArrayType(type)) {
    const [element] = checker.getTypeArguments(type)
    return { kind: 'array', of: describe(element) }
  }

  if (flagged(type, ts.TypeFlags.Object) || type.isIntersection()) {
    if (type.getCallSignatures().length) return { kind: 'unknown' }
    return objectShape(type)
  }

  return { kind: 'unknown' }
}

function objectShape(type) {
  const fields = checker.getPropertiesOfType(type).map((prop) => {
    const declaration = prop.valueDeclaration ?? prop.declarations?.[0]
    const field = {
      name: prop.getName(),
      optional: (prop.getFlags() & ts.SymbolFlags.Optional) !== 0,
      shape: describe(checker.getTypeOfSymbol(prop), declaration),
    }
    const doc = docOf(prop)
    if (doc) field.doc = doc
    return field
  })
  return { kind: 'object', fields }
}

const roots = {}
for (const name of ROOTS) {
  const symbol = exported.get(name)
  if (!symbol) {
    console.error(`page-schema.ts no longer exports ${name}`)
    process.exit(1)
  }
  roots[name] = describe(checker.getDeclaredTypeOfSymbol(symbol))
}

const sortedDefs = Object.fromEntries([...defs.entries()].sort(([a], [b]) => a.localeCompare(b)))
const json = (value) => JSON.stringify(value, null, 2)

const output = `/*
 * GENERATED by scripts/build-section-schema.mjs from src/templates/page-schema.ts — do not edit.
 * Run \`pnpm builder:sections\` after changing a section type.
 */

/** How the builder's data editor draws one value. */
export type Shape =
  | { kind: 'string' }
  | { kind: 'number' }
  | { kind: 'boolean' }
  | { kind: 'enum'; options: (string | number)[] }
  | { kind: 'object'; fields: Field[] }
  | { kind: 'array'; of: Shape }
  /** Objects told apart by one literal field — a section's \`type\`, a banner's \`kind\`. */
  | { kind: 'union'; tag: string; variants: Record<string, Shape> }
  /** Anything else with more than one form: \`boolean | string | { level: number }\`. */
  | { kind: 'oneOf'; options: Shape[] }
  | { kind: 'ref'; name: string }
  /** Not describable as JSON. Shown read-only. */
  | { kind: 'unknown' }

export interface Field {
  name: string
  optional: boolean
  doc?: string
  shape: Shape
}

export const DEFS: Record<string, Shape> = ${json(sortedDefs)}

export const ROOTS = ${json(roots)} as const satisfies Record<string, Shape>
`

const existing = existsSync(outFile) ? readFileSync(outFile, 'utf8') : null

if (checkOnly) {
  if (existing !== output) {
    console.error(`${relative(root, outFile)} is out of date. Run \`pnpm builder:sections\` and commit the result.`)
    process.exit(1)
  }
  console.log(`${relative(root, outFile)} is up to date (${defs.size} named types).`)
} else {
  writeFileSync(outFile, output)
  const sections = defs.get('SectionSpec')
  const count = sections?.kind === 'union' ? Object.keys(sections.variants).length : 0
  console.log(`Wrote ${relative(root, outFile)}: ${defs.size} named types, ${count} section types.`)
}
