/**
 * Generates `src/builder/catalog.generated.ts` — the palette and the variant controls the website
 * builder offers — by reading the components' own TypeScript types.
 *
 * ## Why this is generated rather than written
 *
 * The builder has to answer two questions for every component: *what can a designer set*, and *what
 * are the legal values*. Both answers already exist, exactly once, in each component's `Props`
 * interface: `variant?: 'filled' | 'outline' | 'neutral' | 'rounded'` is the complete list of
 * Figma appearances, and it is the list the compiler enforces. A hand-written catalogue would be a
 * second copy of that list, and the day someone adds a fifth appearance the builder would quietly
 * keep offering four.
 *
 * So the catalogue is derived, and `--check` fails CI when it drifts — the same arrangement as
 * `build-tokens.mjs` and `build-icons.mjs`.
 *
 * ## What it keeps, and what it drops
 *
 * Every component here spreads Mantine's `BoxProps` and `ElementProps`, which between them carry
 * several hundred properties — `onCopyCapture`, `aria-colindex`, `mih`. None of that is a design
 * decision, and a palette that offered it would be unusable. The filter is the source file: a
 * property survives only if it is **declared in this repository**, which is precisely the set of
 * props the library authored on purpose.
 *
 * Props are then classified by type:
 *
 * - a union of string literals -> a variant control, options in the order the type declares them
 * - `boolean` / `number` / `string`   -> a switch, a number field, a text field
 * - `ReactNode`                       -> a **slot**, which in the builder holds child nodes
 *
 * Anything else — a render function, an array of objects, a `LinkRef[]` — is dropped and listed
 * under `unsupported`, so the omission is visible in the generated file rather than silent. Those
 * are the components that want a purpose-built editor.
 *
 * Usage: node scripts/build-builder-catalog.mjs [--check]
 *   --check  exits non-zero if the generated file is out of date, without writing it (for CI)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')
const entry = join(srcDir, 'index.ts')
const outFile = join(srcDir, 'builder', 'catalog.generated.ts')
const checkOnly = process.argv.includes('--check')

/**
 * Components the builder deliberately does not offer.
 *
 * These are not missing work — they are things a *page* does not compose. The header and the footer
 * belong to the site chrome and are drawn around every page by the builder itself; the form inputs
 * are parts of a `Form`, not sections a designer drops onto a page on their own.
 */
const EXCLUDE = new Set([
  /*
   * A whole navigation panel, several columns deep, with featured cards and its own calls to action.
   * A mock needs a header with the site's sections in it; building the panel behind each one is a
   * separate exercise, and until someone asks for it the palette is better without a component that
   * takes twenty nodes to fill in.
   */
  'MegaMenu',
  /* An explanation attached to a field's label, not something a page composes on its own. */
  'InfoTooltip',
  /* A header widget with its own behaviour, not a page section. */
  'LanguagePicker',
  'PageRenderer',
])

/* ------------------------------------------------------------------ the program */

/** Every `*.stories.tsx` under `src/`. Roots of the program in their own right: nothing imports them. */
function storyFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return storyFiles(path)
    return entry.name.endsWith('.stories.tsx') ? [path] : []
  })
}

const program = ts.createProgram([entry, ...storyFiles(srcDir)], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
})
const checker = program.getTypeChecker()

const entrySource = program.getSourceFile(entry)
if (!entrySource) {
  console.error(`Cannot read ${relative(root, entry)}`)
  process.exit(1)
}

const entryExports = checker.getExportsOfModule(checker.getSymbolAtLocation(entrySource))
const exportNames = new Set(entryExports.map((s) => s.getName()))

/** A component is an exported value `X` that ships an exported `XProps` type beside it. */
const components = entryExports
  .filter((symbol) => exportNames.has(`${symbol.getName()}Props`))
  .map((symbol) => symbol.getName())
  .filter((name) => !EXCLUDE.has(name))
  .sort()

/* ------------------------------------------------------------------ classifying a prop */

/** The first sentence of a prop's JSDoc, which is what the inspector shows under the control. */
function docOf(symbol) {
  const text = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()
  if (!text) return undefined
  const [first] = text.split(/\n\s*\n/)
  return first.replace(/\s+/g, ' ').trim() || undefined
}

/** `@default 'left'` -> `left`. The value the component uses when the prop is absent. */
function defaultOf(symbol) {
  const tag = symbol.getJsDocTags(checker).find((t) => t.name === 'default')
  if (!tag) return undefined
  const raw = ts.displayPartsToString(tag.text).trim().replace(/^['"`]|['"`]$/g, '')
  return raw || undefined
}

const flagged = (type, flag) => (type.getFlags() & flag) !== 0

/**
 * The options a designer sees, **in the order the type declares them**.
 *
 * The checker hands back union members in its own canonical order, which puts `Size` out as
 * `sm | lg | md`. That is not a scale, and a size control that reads small-large-medium looks
 * broken. The declaration order is the order a human chose, so the options are read off the syntax
 * — following a type alias like `ButtonVariant` to its own declaration — and only fall back to the
 * checker when the type is not written as a plain union of literals.
 */
function declaredOrder(typeNode) {
  if (!typeNode) return null

  if (ts.isTypeReferenceNode(typeNode)) {
    const symbol = checker.getSymbolAtLocation(typeNode.typeName)
    const alias = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    const declaration = alias?.declarations?.find(ts.isTypeAliasDeclaration)
    return declaration ? declaredOrder(declaration.type) : null
  }

  const members = ts.isUnionTypeNode(typeNode) ? typeNode.types : [typeNode]
  const options = []
  for (const member of members) {
    if (ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)) {
      options.push(member.literal.text)
    } else if (member.kind === ts.SyntaxKind.UndefinedKeyword) {
      continue
    } else {
      return null
    }
  }
  return options.length ? options : null
}

/**
 * `ReactNode` is a wide union — element, string, number, iterable, null — so it cannot be recognised
 * by shape without also catching plain strings. It is recognised by *name*, through the alias the
 * component declared, which is what `title?: ReactNode` actually says.
 */
function isReactNode(typeNode) {
  if (!typeNode) return false
  const text = typeNode.getText()
  return /^React\.ReactNode$|^ReactNode$|^React\.ReactElement|^ReactElement/.test(text.trim())
}

/**
 * Classifies one property into a control the inspector can draw, or returns null for the props that
 * want a purpose-built editor rather than a generic one.
 */
function classify(symbol, declaration) {
  const typeNode = ts.isPropertySignature(declaration) ? declaration.type : undefined

  if (isReactNode(typeNode)) return { kind: 'slot' }

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
  // `?:` puts `undefined` in the union; the control is about the values that are actually settable.
  const parts = (type.isUnion() ? type.types : [type]).filter(
    (t) => !flagged(t, ts.TypeFlags.Undefined) && !flagged(t, ts.TypeFlags.Null),
  )

  if (parts.length && parts.every((t) => t.isStringLiteral())) {
    const canonical = parts.map((t) => t.value)
    const declared = declaredOrder(typeNode)
    // Trust the source order only when it names the same set the checker resolved.
    const sameSet =
      declared && declared.length === canonical.length && declared.every((o) => canonical.includes(o))
    return { kind: 'enum', options: sameSet ? declared : canonical }
  }
  // `boolean` arrives as the union `true | false`, so it has to be tested before the scalar cases.
  if (parts.every((t) => flagged(t, ts.TypeFlags.BooleanLike))) return { kind: 'boolean' }
  if (parts.length === 1 && flagged(parts[0], ts.TypeFlags.String)) return { kind: 'text' }
  if (parts.length === 1 && flagged(parts[0], ts.TypeFlags.Number)) return { kind: 'number' }
  // `number | string` — a measurement like `gap` or `maxWidth`. A number field is the honest control.
  if (parts.length === 2 && parts.some((t) => flagged(t, ts.TypeFlags.Number))
      && parts.some((t) => flagged(t, ts.TypeFlags.String))) {
    return { kind: 'number' }
  }
  return null
}

/* ------------------------------------------------------------------ the stories as a second source */

/**
 * Some components have no props of their own on purpose.
 *
 * `Button` is eleven lines over Mantine's `Button` and adds nothing, because all four Figma
 * appearances are painted by the theme against Mantine's existing `variant` — so `filled | outline |
 * neutral | rounded` appears nowhere in `ButtonProps`, and the extraction above finds an empty
 * component. The list is not lost, though: the story declares it, as `argTypes.variant.options`,
 * because Storybook needs exactly the same list for exactly the same reason.
 *
 * So the stories are read as a second source. Types win wherever they have an answer — they are
 * compiler-enforced and cannot go stale — and the stories fill in only what the types delegated to
 * the theme. Each prop records which source it came from, so a reader can tell a guarantee from a
 * convention.
 */

/** Follows `options: VARIANTS` back to `const VARIANTS = ['filled', …]`. */
function arrayOfStrings(node) {
  if (!node) return null
  if (ts.isIdentifier(node)) {
    const declaration = checker.getSymbolAtLocation(node)?.declarations?.find(ts.isVariableDeclaration)
    return declaration ? arrayOfStrings(declaration.initializer) : null
  }
  // `['a', 'b'] as const`
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) return arrayOfStrings(node.expression)
  if (!ts.isArrayLiteralExpression(node)) return null
  const values = node.elements.map((el) => (ts.isStringLiteral(el) ? el.text : null))
  return values.every((v) => v !== null) && values.length ? values : null
}

const propertyNamed = (object, name) =>
  object.properties.find(
    (p) => ts.isPropertyAssignment(p) && p.name && p.name.getText().replace(/['"]/g, '') === name,
  )?.initializer

/** A story's `args` value, when it is something a JSON document can hold. */
function literalValue(node) {
  if (!node) return undefined
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  return undefined
}

/** Reads one story file's `meta` for the component it documents. */
function readStory(file) {
  const source = program.getSourceFile(file)
  if (!source) return null

  let meta = null
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue
    const declaration = statement.declarationList.declarations.find((d) => d.name.getText() === 'meta')
    if (!declaration) continue
    let initializer = declaration.initializer
    // `} satisfies Meta<typeof Button>`
    while (initializer && (ts.isSatisfiesExpression(initializer) || ts.isAsExpression(initializer))) {
      initializer = initializer.expression
    }
    if (initializer && ts.isObjectLiteralExpression(initializer)) meta = initializer
  }
  if (!meta) return null

  const component = propertyNamed(meta, 'component')
  if (!component || !ts.isIdentifier(component)) return null

  const options = {}
  const kinds = {}
  const argTypes = propertyNamed(meta, 'argTypes')
  if (argTypes && ts.isObjectLiteralExpression(argTypes)) {
    for (const entry of argTypes.properties) {
      if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) continue
      const prop = entry.name.getText().replace(/['"]/g, '')
      const list = arrayOfStrings(propertyNamed(entry.initializer, 'options'))
      if (list) options[prop] = list
      const control = propertyNamed(entry.initializer, 'control')
      // `control: false` is how these stories mark a prop that takes a React node — a slot.
      if (control?.kind === ts.SyntaxKind.FalseKeyword) kinds[prop] = 'slot'
      else if (control && ts.isStringLiteral(control) && control.text === 'boolean') kinds[prop] = 'boolean'
      else if (control && ts.isStringLiteral(control) && control.text === 'text') kinds[prop] = 'text'
    }
  }

  const args = {}
  const argsNode = propertyNamed(meta, 'args')
  if (argsNode && ts.isObjectLiteralExpression(argsNode)) {
    for (const entry of argsNode.properties) {
      if (!ts.isPropertyAssignment(entry)) continue
      const value = literalValue(entry.initializer)
      if (value !== undefined) args[entry.name.getText().replace(/['"]/g, '')] = value
    }
  }

  return { component: component.text, options, kinds, args }
}

const stories = new Map()
for (const source of program.getSourceFiles()) {
  if (!source.fileName.startsWith(srcDir) || !source.fileName.endsWith('.stories.tsx')) continue
  const story = readStory(source.fileName)
  if (story) stories.set(story.component, story)
}

/* ------------------------------------------------------------------ walking the components */

const catalog = []

for (const name of components) {
  const propsSymbol = entryExports.find((s) => s.getName() === `${name}Props`)
  const propsType = checker.getDeclaredTypeOfSymbol(propsSymbol)

  const props = []
  let unsupported = []

  for (const property of propsType.getProperties()) {
    const declaration = property.declarations?.[0]
    if (!declaration) continue

    // The filter that drops Mantine's several hundred inherited props: keep only what this repo wrote.
    const file = declaration.getSourceFile().fileName
    if (!file.startsWith(srcDir)) continue
    if (property.getName().startsWith('__')) continue
    // `ref` is React's, not the component's, and it is not something a designer sets.
    if (property.getName() === 'ref') continue

    const control = classify(property, declaration)
    if (!control) {
      unsupported.push(property.getName())
      continue
    }
    /*
     * A `@default` is prose as often as it is a value — Card's surface documents itself as
     * "`glass` when `interactive`, otherwise `grey`", which is true and useful to a developer but is
     * not a value any control can show as selected. Only a default that is one of the options the
     * control actually offers is kept; the rest stays in the prop's documentation where it reads
     * correctly.
     */
    const fallback = defaultOf(property)
    const usable =
      control.kind === 'enum'
        ? control.options.includes(fallback)
          ? fallback
          : undefined
        : control.kind === 'number' || control.kind === 'boolean' || control.kind === 'text'
          ? fallback
          : undefined

    props.push({ name: property.getName(), ...control, doc: docOf(property), default: usable })
  }

  const story = stories.get(name)
  if (story) {
    const known = new Set(props.map((p) => p.name))

    /**
     * What the checker makes of a prop the *story* named, wherever it was declared.
     *
     * The source-file filter above exists to drop the several hundred props nobody chose; it must not
     * also decide what a prop someone did choose to document actually is. `Tabs` extends Mantine's
     * `TabsProps` and adds nothing, so every one of its props is "inherited" — but its story hides
     * `orientation`'s control, and reading that as "therefore a React node" would put a slot in the
     * inspector where `horizontal | vertical` belongs.
     */
    const checked = (propName) => {
      const symbol = propsType.getProperty(propName)
      const declaration = symbol?.declarations?.[0]
      return declaration ? classify(symbol, declaration) : null
    }

    // Fill in what the types delegated to the theme.
    for (const [propName, options] of Object.entries(story.options)) {
      if (known.has(propName)) continue
      props.push({ name: propName, kind: 'enum', options, source: 'story' })
      known.add(propName)
    }
    for (const [propName, kind] of Object.entries(story.kinds)) {
      if (known.has(propName)) continue
      const actual = checked(propName)
      // The story's `control: false` says "not worth a control here", not "this is a slot".
      const resolved = actual && actual.kind !== 'slot' ? actual : { kind }
      props.push({ name: propName, ...resolved, source: 'story' })
      known.add(propName)
    }

    // The story's own `args` are the arrangement its author thought was worth showing first, so
    // they seed a freshly dropped component rather than leaving it blank.
    for (const prop of props) {
      const seeded = story.args[prop.name]
      if (prop.default === undefined && seeded !== undefined) prop.default = String(seeded)
    }

    // A prop the types could not classify but the story could is not unsupported after all.
    unsupported = unsupported.filter((propName) => !known.has(propName))
  }

  if (!props.length) continue

  const componentDoc = (() => {
    const symbol = entryExports.find((s) => s.getName() === name)
    const aliased = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    return docOf(aliased)
  })()

  catalog.push({ name, doc: componentDoc, props, unsupported: unsupported.sort() })
}

/* ------------------------------------------------------------------ emitting */

const lit = (value) => JSON.stringify(value)

function emitProp(prop) {
  const fields = [`name: ${lit(prop.name)}`, `kind: ${lit(prop.kind)}`]
  if (prop.options) fields.push(`options: [${prop.options.map(lit).join(', ')}]`)
  if (prop.default !== undefined) fields.push(`default: ${lit(prop.default)}`)
  if (prop.source) fields.push(`source: ${lit(prop.source)}`)
  if (prop.doc) fields.push(`doc: ${lit(prop.doc)}`)
  return `    { ${fields.join(', ')} },`
}

function emitComponent(component) {
  const lines = [`  {`, `    name: ${lit(component.name)},`]
  if (component.doc) lines.push(`    doc: ${lit(component.doc)},`)
  lines.push(`    props: [`)
  for (const prop of component.props) lines.push(`  ${emitProp(prop)}`)
  lines.push(`    ],`)
  if (component.unsupported.length) {
    lines.push(`    unsupported: [${component.unsupported.map(lit).join(', ')}],`)
  }
  lines.push(`  },`)
  return lines.join('\n')
}

const output = `/**
 * Generated by \`scripts/build-builder-catalog.mjs\` from the components' TypeScript types.
 * Do not edit. Run \`pnpm builder:catalog\` after changing a component's props.
 *
 * Every option here was read off a prop's type, so the builder cannot offer a variant the component
 * does not have, and cannot miss one it does.
 */

/** How the inspector draws a prop, and what the document is allowed to store for it. */
export type ControlKind = 'enum' | 'text' | 'number' | 'boolean' | 'slot'

export interface PropSpec {
  name: string
  kind: ControlKind
  /** For \`enum\`: the complete set of legal values, in the order the type declares them. */
  options?: string[]
  /** What the component does when the prop is absent, read from its \`@default\` tag. */
  default?: string
  /** The first sentence of the prop's documentation, shown under the control. */
  doc?: string
  /**
   * Absent when the prop was read from the component's own type — the compiler-enforced case.
   * \`'story'\` when the type delegated the values to the theme and the Storybook \`argTypes\` were the
   * only written-down list, as with \`Button\`'s four Figma appearances.
   */
  source?: 'story'
}

export interface ComponentSpec {
  name: string
  doc?: string
  props: PropSpec[]
  /**
   * Props whose type is richer than a generic control can honestly draw — an array of objects, a
   * render function. Listed rather than hidden: these are where a purpose-built editor goes next.
   */
  unsupported?: string[]
}

export const CATALOG: ComponentSpec[] = [
${catalog.map(emitComponent).join('\n')}
]

export const componentSpec = (name: string): ComponentSpec | undefined =>
  CATALOG.find((entry) => entry.name === name)
`

const existing = existsSync(outFile) ? readFileSync(outFile, 'utf8') : null

if (checkOnly) {
  if (existing !== output) {
    console.error(
      `${relative(root, outFile)} is out of date. Run \`pnpm builder:catalog\` and commit the result.`,
    )
    process.exit(1)
  }
  console.log(`${relative(root, outFile)} is up to date (${catalog.length} components).`)
} else {
  writeFileSync(outFile, output)
  const slots = catalog.reduce((n, c) => n + c.props.filter((p) => p.kind === 'slot').length, 0)
  console.log(
    `Wrote ${relative(root, outFile)}: ${catalog.length} components, ` +
      `${catalog.reduce((n, c) => n + c.props.length, 0)} props (${slots} slots).`,
  )
}
