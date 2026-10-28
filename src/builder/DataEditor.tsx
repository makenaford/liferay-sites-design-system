/**
 * The form for a built-page block's `data` — a hero or a section.
 *
 * Nothing in here knows what a `cardGrid` is. It walks the shape `sections.generated.ts` read off
 * `page-schema.ts` and draws a control per value: a text field for a string, a select for a union of
 * literals, a list with add / reorder / remove for an array. Add a field to a section type and it
 * appears here on the next build.
 *
 * The same bargain as the rest of the inspector holds, and for free: the schema has no colour and no
 * spacing in it, because `page-schema.ts` deliberately keeps measurements in the section *type*. So
 * there is nothing here a page could use to drift off the design.
 */
import { useState, type ReactNode } from 'react'
import {
  ActionIcon,
  Box,
  Button,
  Code,
  Group,
  Menu,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { DEFS, type Field, type Shape } from './sections.generated'
import type { JsonValue } from './document'
import { ImageField } from './Inspector'

type Obj = { [key: string]: JsonValue }

export interface DataEditorProps {
  shape: Shape
  value: JsonValue
  pageId: string
  onChange: (value: JsonValue) => void
  /**
   * Content for a union variant a designer switches to — a section type with real copy in it, rather
   * than the empty form `blankOf` would give. Returning `undefined` falls back to the blank.
   */
  example?: (tag: string) => JsonValue | undefined
}

/* ------------------------------------------------------------------ reading shapes */

const resolve = (shape: Shape): Shape => (shape.kind === 'ref' ? resolve(DEFS[shape.name] ?? { kind: 'unknown' }) : shape)

const isObj = (value: JsonValue | undefined): value is Obj =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** `mediaSide` reads as `Media side`. */
const label = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())

/** Developer documentation, cut to the part a designer can act on. */
const hint = (doc?: string) => {
  if (!doc) return undefined
  const plain = doc.replace(/`/g, '').replace(/\s*\(node [^)]*\)/g, '')
  return plain.length > 140 ? `${plain.slice(0, 137)}…` : plain
}

/** A value of a shape, for a field being added. Real-shaped rather than clever: the designer types over it. */
export function blankOf(shape: Shape): JsonValue {
  const resolved = resolve(shape)
  switch (resolved.kind) {
    case 'string':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'enum':
      return resolved.options[0]
    case 'array':
      return []
    case 'object':
      return Object.fromEntries(resolved.fields.filter((f) => !f.optional).map((f) => [f.name, blankOf(f.shape)]))
    case 'union': {
      const [tag, variant] = Object.entries(resolved.variants)[0]
      return { ...(blankOf(variant) as Obj), [resolved.tag]: tag }
    }
    case 'oneOf':
      return blankOf(resolved.options[0])
    default:
      return null
  }
}

/** Whether a value is plausibly of a shape — used to tell which branch of a `oneOf` it is on. */
function fits(shape: Shape, value: JsonValue | undefined): boolean {
  const resolved = resolve(shape)
  switch (resolved.kind) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number'
    case 'boolean':
      return typeof value === 'boolean'
    case 'enum':
      return resolved.options.includes(value as string | number)
    case 'array':
      return Array.isArray(value)
    case 'object':
    case 'union':
      return isObj(value)
    default:
      return false
  }
}

const KIND_LABEL: Partial<Record<Shape['kind'], string>> = {
  boolean: 'Yes / no',
  string: 'Text',
  number: 'Number',
  enum: 'Choice',
  object: 'Details',
  array: 'List',
}

/** A list row's name: its own words if it has any. */
function summary(value: JsonValue | undefined, fallback: string): string {
  if (typeof value === 'string') return value || fallback
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (isObj(value)) {
    for (const key of ['title', 'label', 'question', 'name', 'text', 'value', 'src']) {
      const found = summary(value[key], '')
      if (found) return found.length > 48 ? `${found.slice(0, 47)}…` : found
    }
  }
  return fallback
}

/* ------------------------------------------------------------------ the editor */

export function DataEditor({ shape, value, pageId, onChange, example }: DataEditorProps) {
  return (
    <Stack gap="sm">
      <Value shape={shape} value={value} onChange={onChange} ctx={{ pageId, example }} depth={0} />
    </Stack>
  )
}

interface Ctx {
  pageId: string
  example?: (tag: string) => JsonValue | undefined
}

interface ValueProps {
  shape: Shape
  value: JsonValue | undefined
  onChange: (value: JsonValue) => void
  ctx: Ctx
  depth: number
  name?: string
  doc?: string
  /** A control for the field's row header — removing an optional field. */
  aside?: ReactNode
}

function Value(props: ValueProps) {
  const { shape, value, onChange, ctx, depth, name, doc, aside } = props
  const title = name ? label(name) : undefined
  const description = hint(doc)

  /*
   * A picture. `ImageRef` is the one named type with a purpose-built control, because a mock of a real
   * page needs the real photographs — and uploading is the step at which a URL field loses people.
   */
  if (shape.kind === 'ref' && shape.name === 'ImageRef' && isObj(value)) {
    return (
      <Group gap={4} align="flex-start" wrap="nowrap">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <ImageField
            spec={{ name: name ?? 'image', kind: 'image', doc }}
            value={typeof value.src === 'string' ? value.src : undefined}
            pageId={ctx.pageId}
            onChange={(src) => onChange({ ...value, src: (src as string | undefined) ?? '' })}
          />
          <ObjectFields
            shape={resolve(shape) as Extract<Shape, { kind: 'object' }>}
            value={value}
            onChange={onChange}
            ctx={ctx}
            depth={depth + 1}
            skip={['src']}
          />
        </Box>
        {aside}
      </Group>
    )
  }

  const resolved = resolve(shape)

  switch (resolved.kind) {
    case 'string': {
      const text = typeof value === 'string' ? value : ''
      const long = /text|description|body|quote|answer|content|summary|consent|terms/i.test(name ?? '') || text.length > 60
      const Input = long ? Textarea : TextInput
      return (
        <Group gap={4} align="flex-end" wrap="nowrap">
          <Input
            size="xs"
            style={{ flex: 1, minWidth: 0 }}
            label={title}
            description={description}
            autosize={long || undefined}
            minRows={long ? 2 : undefined}
            value={text}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
          {aside}
        </Group>
      )
    }

    case 'number':
      return (
        <Group gap={4} align="flex-end" wrap="nowrap">
          <NumberInput
            size="xs"
            style={{ flex: 1, minWidth: 0 }}
            label={title}
            description={description}
            value={typeof value === 'number' ? value : ''}
            onChange={(next) => onChange(next === '' ? 0 : Number(next))}
          />
          {aside}
        </Group>
      )

    case 'boolean':
      return (
        <Group gap={4} justify="space-between" wrap="nowrap">
          <Switch
            size="xs"
            label={title}
            description={description}
            checked={value === true}
            onChange={(event) => onChange(event.currentTarget.checked)}
          />
          {aside}
        </Group>
      )

    case 'enum':
      return (
        <Group gap={4} align="flex-end" wrap="nowrap">
          <Select
            size="xs"
            style={{ flex: 1, minWidth: 0 }}
            label={title}
            description={description}
            data={resolved.options.map((option) => ({ value: String(option), label: String(option) }))}
            value={value === undefined || value === null ? null : String(value)}
            allowDeselect={false}
            searchable={resolved.options.length > 12}
            onChange={(next) => {
              if (next === null) return
              const option = resolved.options.find((one) => String(one) === next)
              if (option !== undefined) onChange(option)
            }}
            comboboxProps={{ withinPortal: true }}
          />
          {aside}
        </Group>
      )

    case 'object':
      return (
        <Disclosure title={title ?? 'Details'} summary={summary(value, '')} open={depth === 0} aside={aside} bare={depth === 0}>
          <ObjectFields shape={resolved} value={isObj(value) ? value : {}} onChange={onChange} ctx={ctx} depth={depth + 1} />
        </Disclosure>
      )

    case 'union':
      return <UnionValue {...props} shape={resolved} />

    case 'array':
      return (
        <ArrayValue
          shape={resolved}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          ctx={ctx}
          depth={depth}
          title={title ?? 'Items'}
          description={description}
          aside={aside}
        />
      )

    case 'oneOf': {
      const current = Math.max(0, resolved.options.findIndex((option) => fits(option, value)))
      const option = resolved.options[current]
      return (
        <Stack gap={4}>
          <Select
            size="xs"
            label={title}
            description={description}
            data={resolved.options.map((one, i) => ({
              value: String(i),
              label: KIND_LABEL[resolve(one).kind] ?? resolve(one).kind,
            }))}
            value={String(current)}
            allowDeselect={false}
            onChange={(next) => next !== null && onChange(blankOf(resolved.options[Number(next)]))}
            comboboxProps={{ withinPortal: true }}
          />
          <Value shape={option} value={value} onChange={onChange} ctx={ctx} depth={depth + 1} />
        </Stack>
      )
    }

    default:
      return (
        <Box>
          {title ? (
            <Text size="xs" fw={500}>
              {title}
            </Text>
          ) : null}
          <Code block fz="10px">
            {JSON.stringify(value, null, 2)}
          </Code>
          <Text size="10px" c="dimmed">
            Set in code only.
          </Text>
        </Box>
      )
  }
}

/* ------------------------------------------------------------------ objects */

function ObjectFields({
  shape,
  value,
  onChange,
  ctx,
  depth,
  skip = [],
}: {
  shape: Extract<Shape, { kind: 'object' }>
  value: Obj
  onChange: (value: JsonValue) => void
  ctx: Ctx
  depth: number
  skip?: string[]
}) {
  const fields = shape.fields.filter((field) => !skip.includes(field.name))
  const present = fields.filter((field) => !field.optional || value[field.name] !== undefined)
  const absent = fields.filter((field) => field.optional && value[field.name] === undefined)

  const set = (field: Field, next: JsonValue | undefined) => {
    const copy = { ...value }
    if (next === undefined) delete copy[field.name]
    else copy[field.name] = next
    onChange(copy)
  }

  return (
    <Stack gap="xs">
      {present.map((field) => (
        <Value
          key={field.name}
          shape={field.shape}
          value={value[field.name]}
          name={field.name}
          doc={field.doc}
          ctx={ctx}
          depth={depth}
          onChange={(next) => set(field, next)}
          aside={
            field.optional ? (
              <Tooltip label={`Remove ${label(field.name).toLowerCase()}`}>
                <ActionIcon size="sm" variant="subtle" color="gray" aria-label={`Remove ${field.name}`} onClick={() => set(field, undefined)}>
                  ×
                </ActionIcon>
              </Tooltip>
            ) : null
          }
        />
      ))}

      {absent.length ? (
        /*
         * Optional fields that are not set are offered rather than drawn. A hero has two dozen optional
         * parts — a form, a search, a proof strip — and drawing every one as an empty control would bury
         * the four this page actually uses.
         */
        <Menu position="bottom-start" withinPortal>
          <Menu.Target>
            <Button size="compact-xs" variant="subtle" color="gray" style={{ alignSelf: 'flex-start' }}>
              + Add…
            </Button>
          </Menu.Target>
          <Menu.Dropdown mah={320} style={{ overflowY: 'auto' }}>
            {absent.map((field) => (
              <Menu.Item key={field.name} fz="xs" onClick={() => set(field, blankOf(field.shape))}>
                {label(field.name)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      ) : null}
    </Stack>
  )
}

/* ------------------------------------------------------------------ unions */

function UnionValue({ shape, value, onChange, ctx, depth, name, aside }: ValueProps & { shape: Extract<Shape, { kind: 'union' }> }) {
  const current = isObj(value) ? value : {}
  const tag = typeof current[shape.tag] === 'string' ? (current[shape.tag] as string) : Object.keys(shape.variants)[0]
  const variant = resolve(shape.variants[tag] ?? { kind: 'unknown' })

  const fields =
    variant.kind === 'object' ? (
      <ObjectFields shape={variant} value={current} onChange={onChange} ctx={ctx} depth={depth + 1} skip={[shape.tag]} />
    ) : null

  return (
    <Stack gap="xs">
      <Group gap={4} align="flex-end" wrap="nowrap">
        <Select
          size="xs"
          style={{ flex: 1, minWidth: 0 }}
          label={name ? label(name) : label(shape.tag)}
          description={depth === 0 ? 'Changing this replaces the content with an example of the new type.' : undefined}
          data={Object.keys(shape.variants).map((one) => ({ value: one, label: label(one) }))}
          value={tag}
          allowDeselect={false}
          searchable
          onChange={(next) => {
            if (!next || next === tag) return
            const replacement = ctx.example?.(next) ?? { ...(blankOf(shape.variants[next]) as Obj), [shape.tag]: next }
            onChange(replacement)
          }}
          comboboxProps={{ withinPortal: true }}
        />
        {aside}
      </Group>
      {depth === 0 ? fields : <Box pl="xs" style={{ borderLeft: '1px solid var(--mantine-color-dark-4)' }}>{fields}</Box>}
    </Stack>
  )
}

/* ------------------------------------------------------------------ arrays */

function ArrayValue({
  shape,
  value,
  onChange,
  ctx,
  depth,
  title,
  description,
  aside,
}: {
  shape: Extract<Shape, { kind: 'array' }>
  value: JsonValue[]
  onChange: (value: JsonValue) => void
  ctx: Ctx
  depth: number
  title: string
  description?: string
  aside?: ReactNode
}) {
  const item = resolve(shape.of)
  const isImage = shape.of.kind === 'ref' && shape.of.name === 'ImageRef'
  const scalar = item.kind === 'string' || item.kind === 'number' || item.kind === 'enum' || item.kind === 'boolean'

  const replace = (index: number, next: JsonValue) => onChange(value.map((one, i) => (i === index ? next : one)))
  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index))
  const moveBy = (index: number, by: number) => {
    const to = index + by
    if (to < 0 || to >= value.length) return
    const copy = [...value]
    ;[copy[index], copy[to]] = [copy[to], copy[index]]
    onChange(copy)
  }
  /*
   * A new row copies the last one when there is one. A fourth card that arrives looking like the
   * third — same icon, same shape of copy — is what a designer adding a card wants; an empty form
   * makes them rebuild what the third already shows.
   */
  const add = () => onChange([...value, value.length ? structuredClone(value[value.length - 1]) : blankOf(shape.of)])

  const controls = (index: number) => (
    <Group gap={0} wrap="nowrap">
      <ActionIcon size="xs" variant="subtle" color="gray" aria-label="Move up" onClick={() => moveBy(index, -1)}>↑</ActionIcon>
      <ActionIcon size="xs" variant="subtle" color="gray" aria-label="Move down" onClick={() => moveBy(index, 1)}>↓</ActionIcon>
      <ActionIcon size="xs" variant="subtle" color="red" aria-label="Remove" onClick={() => removeAt(index)}>×</ActionIcon>
    </Group>
  )

  return (
    <Disclosure title={title} summary={`${value.length}`} open={depth === 0 || value.length <= 4} aside={aside} hint={description}>
      <Stack gap={6}>
        {value.map((entry, index) =>
          scalar ? (
            <Value key={index} shape={shape.of} value={entry} onChange={(next) => replace(index, next)} ctx={ctx} depth={depth + 1} aside={controls(index)} />
          ) : (
            <Disclosure key={index} title={summary(entry, `${index + 1}`)} open={false} aside={controls(index)}>
              {/* An object row opens straight onto its fields — the row is already its frame. */}
              {item.kind === 'object' && !isImage ? (
                <ObjectFields shape={item} value={isObj(entry) ? entry : {}} onChange={(next) => replace(index, next)} ctx={ctx} depth={depth + 2} />
              ) : (
                <Value shape={shape.of} value={entry} onChange={(next) => replace(index, next)} ctx={ctx} depth={depth + 2} />
              )}
            </Disclosure>
          ),
        )}
        <Button size="compact-xs" variant="subtle" color="gray" onClick={add} style={{ alignSelf: 'flex-start' }}>
          + Add
        </Button>
      </Stack>
    </Disclosure>
  )
}

/* ------------------------------------------------------------------ disclosure */

function Disclosure({
  title,
  summary: note,
  open: initiallyOpen,
  aside,
  hint: description,
  bare,
  children,
}: {
  title: string
  summary?: string
  open: boolean
  aside?: ReactNode
  hint?: string
  /** No frame and no toggle — the top level of the form. */
  bare?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(initiallyOpen)
  if (bare) return <>{children}</>

  return (
    <Box style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 6 }}>
      <Group gap={4} wrap="nowrap" px={6} py={4}>
        <UnstyledButton onClick={() => setOpen((was) => !was)} style={{ flex: 1, minWidth: 0 }}>
          <Group gap={6} wrap="nowrap">
            <Text size="10px" c="dimmed" w={8}>
              {open ? '▾' : '▸'}
            </Text>
            <Text size="xs" fw={500} truncate>
              {title}
            </Text>
            {note ? (
              <Text size="10px" c="dimmed" truncate>
                {note}
              </Text>
            ) : null}
          </Group>
        </UnstyledButton>
        {aside}
      </Group>
      {open ? (
        <Box px={6} pb={6}>
          {description ? (
            <Text size="10px" c="dimmed" mb={4}>
              {description}
            </Text>
          ) : null}
          {children}
        </Box>
      ) : null}
    </Box>
  )
}
