/**
 * The controls for the selected component.
 *
 * Nothing in this file knows what a `Card` is. It reads the generated catalogue, and draws a control
 * per prop according to its kind — which is why adding a variant to a component in Figma and then to
 * its TypeScript type makes it appear here with no work at all.
 *
 * ## What is not offered
 *
 * There is no colour picker, no font size, no padding. That is the design system's central bargain and
 * this is where it is kept: a designer picks from the values the components were **drawn with**, and
 * every one of those values came out of Figma. `Card`'s five surfaces are five cells in the file. A
 * free `background` field would let a page invent a sixth, and the page would then be undeliverable —
 * a developer building it would have nothing in the library to build it from.
 *
 * The measurements that *are* editable — a `Grid`'s column count, a `Section`'s max width — are the
 * ones the components themselves take as props, which is the library saying they are a caller's
 * decision.
 */
import { useRef, useState } from 'react'
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Menu,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core'
import type { PageDocument, PropValue } from './document'
import type { PropSpec } from './catalog.generated'
import { allowedIn, entryFor, humanise, PALETTE, REGISTRY, slotsOf } from './registry'
import { presetsFor } from './presets'
import { uploadImage } from './upload'

export interface InspectorProps {
  doc: PageDocument
  selectedId: string | null
  onSelect: (id: string) => void
  onProp: (id: string, name: string, value: PropValue | undefined) => void
  /** Refills the node from one of its component's Storybook stories. */
  onPreset: (id: string, preset: string) => void
  onAdd: (parentId: string, slot: string, component: string) => void
  onRemove: (id: string) => void
  onMoveWithin: (id: string, by: -1 | 1) => void
  onDuplicate: (id: string) => void
}

/** `mediaSide` reads as `Media side`. The prop name is the label, tidied. */
const label = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())

/**
 * Documentation is written for developers and is full of Figma node ids and backticks. This keeps the
 * part a designer can act on — the first clause — and drops the markup.
 */
const hint = (doc?: string) => {
  if (!doc) return undefined
  const plain = doc.replace(/`/g, '').replace(/\s*\(node [^)]*\)/g, '')
  return plain.length > 150 ? `${plain.slice(0, 147)}…` : plain
}

/* ------------------------------------------------------------------ one control */

function Control({
  spec,
  value,
  pageId,
  onChange,
}: {
  spec: PropSpec
  value: PropValue | undefined
  /** Which page an uploaded file belongs to. Only the `image` control uses it. */
  pageId: string
  onChange: (value: PropValue | undefined) => void
}) {
  const description = hint(spec.doc)

  switch (spec.kind) {
    case 'image':
      return (
        <ImageField
          spec={spec}
          value={typeof value === 'string' ? value : undefined}
          pageId={pageId}
          onChange={onChange}
        />
      )

    case 'enum':
      return (
        <Select
          size="xs"
          label={label(spec.name)}
          description={description}
          data={(spec.options ?? []).map((option) => ({
            value: option,
            // Icon names arrive as `IconArrowRight`; everything else is already a designer's word.
            label: option.startsWith('Icon') ? humanise(option) : option,
          }))}
          value={(value as string) ?? null}
          /* Clearable so a prop can go back to the component's own default rather than being pinned. */
          clearable
          searchable={(spec.options?.length ?? 0) > 12}
          placeholder={spec.default ? `${spec.default} (default)` : 'Default'}
          onChange={(next) => onChange(next ?? undefined)}
        />
      )

    case 'boolean':
      return (
        <Switch
          size="xs"
          label={label(spec.name)}
          description={description}
          checked={value === undefined ? spec.default === 'true' : Boolean(value)}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
      )

    case 'number':
      return (
        <NumberInput
          size="xs"
          label={label(spec.name)}
          description={description}
          value={(value as number) ?? ''}
          placeholder={spec.default ?? 'Default'}
          onChange={(next) => onChange(next === '' ? undefined : Number(next))}
        />
      )

    case 'text':
    default: {
      // A description or a paragraph wants room; a label or an href is one line.
      const long = /content|description|quote|answer/i.test(spec.name)
      const Field = long ? Textarea : TextInput
      return (
        <Field
          size="xs"
          label={label(spec.name)}
          description={description}
          autosize={long || undefined}
          minRows={long ? 2 : undefined}
          value={(value as string) ?? ''}
          placeholder={spec.default ?? ''}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      )
    }
  }
}

/* ------------------------------------------------------------------ the image control */

/**
 * A picture, dropped or pasted.
 *
 * The only control here that stores something a designer *brought* rather than something the library
 * offers, which is why it is the only one written by hand. A mock of a real page needs the client's
 * real photographs, and the alternative — telling a designer to host the file somewhere and paste a
 * URL — is the step at which people stop using the builder.
 *
 * Both ways in are kept. The dropzone is what anyone reaches for; the URL field underneath still
 * takes a path to something already in the deployment, which is how the library's own artwork gets
 * onto a page without being uploaded a second time.
 */
function ImageField({
  spec,
  value,
  pageId,
  onChange,
}: {
  spec: PropSpec
  value: string | undefined
  pageId: string
  onChange: (value: PropValue | undefined) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)

  const take = async (file: File | undefined) => {
    if (!file) return
    setFailed(null)
    setBusy(true)
    try {
      onChange(await uploadImage(pageId, file))
    } catch (reason) {
      setFailed((reason as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box>
      <Text size="xs" fw={500} mb={2}>
        {label(spec.name)}
      </Text>

      <Box
        role="button"
        tabIndex={0}
        aria-label="Upload an image"
        onClick={() => input.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            input.current?.click()
          }
        }}
        /*
         * `preventDefault` on drag-over is what tells the browser this element accepts a drop; without
         * it the file is opened in the tab instead, which loses the page.
         */
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)
          void take(event.dataTransfer.files[0])
        }}
        style={{
          border: `1px dashed var(--mantine-color-${over ? 'blue' : 'dark'}-4)`,
          borderRadius: 6,
          background: over ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-dark-6)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {value && !busy ? (
          /*
           * The stored image itself, not a name. A page can hold a dozen of these and a designer picks
           * the one they mean by looking at it — a list of `a3f9…` would be useless.
           */
          <Box
            component="img"
            src={value}
            alt=""
            display="block"
            w="100%"
            h={110}
            style={{ objectFit: 'contain', background: 'var(--mantine-color-dark-7)' }}
          />
        ) : (
          <Group justify="center" gap="xs" h={110}>
            {busy ? <Loader size="xs" /> : null}
            <Text size="xs" c="dimmed">
              {busy ? 'Uploading…' : 'Drop an image, or click to choose'}
            </Text>
          </Group>
        )}
      </Box>

      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
        hidden
        onChange={(event) => {
          void take(event.currentTarget.files?.[0])
          // Cleared so that choosing the same file twice in a row still fires a change.
          event.currentTarget.value = ''
        }}
      />

      {failed ? (
        <Text size="10px" c="red" mt={4}>
          {failed}
        </Text>
      ) : null}

      <Group gap={4} mt={4} wrap="nowrap" align="flex-end">
        <TextInput
          size="xs"
          style={{ flex: 1, minWidth: 0 }}
          description={hint(spec.doc)}
          placeholder="…or a URL"
          value={value ?? ''}
          onChange={(event) => onChange(event.currentTarget.value || undefined)}
        />
        {value ? (
          <Tooltip label="Remove the image">
            <ActionIcon size="md" variant="default" aria-label="Remove the image" onClick={() => onChange(undefined)}>
              ×
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>
    </Box>
  )
}

/* ------------------------------------------------------------------ the panel */

export function Inspector({
  doc,
  selectedId,
  onSelect,
  onProp,
  onPreset,
  onAdd,
  onRemove,
  onMoveWithin,
  onDuplicate,
}: InspectorProps) {
  const node = selectedId ? doc.nodes[selectedId] : null
  const entry = node ? entryFor(node.component) : undefined

  if (!node || !entry) {
    return (
      <Box p="md">
        <Text size="xs" c="dimmed">
          Click something on the page to change it.
        </Text>
      </Box>
    )
  }

  const controls = entry.spec.props.filter((prop) => prop.kind !== 'slot')
  const slots = slotsOf(node.component)

  return (
    <Stack gap={0} h="100%">
      <Group justify="space-between" p="sm" wrap="nowrap">
        <Box style={{ minWidth: 0 }}>
          <Text fw={700} size="sm" truncate>
            {entry.label}
          </Text>
          {entry.hint ? (
            <Text size="10px" c="dimmed" lineClamp={2}>
              {entry.hint}
            </Text>
          ) : null}
        </Box>
        <Group gap={4} wrap="nowrap">
          <Tooltip label="Move up"><ActionIcon size="sm" variant="subtle" aria-label="Move up" onClick={() => onMoveWithin(node.id, -1)}>↑</ActionIcon></Tooltip>
          <Tooltip label="Move down"><ActionIcon size="sm" variant="subtle" aria-label="Move down" onClick={() => onMoveWithin(node.id, 1)}>↓</ActionIcon></Tooltip>
          <Tooltip label="Duplicate"><ActionIcon size="sm" variant="subtle" aria-label="Duplicate" onClick={() => onDuplicate(node.id)}>⧉</ActionIcon></Tooltip>
          <Tooltip label="Delete"><ActionIcon size="sm" variant="subtle" color="red" aria-label="Delete" onClick={() => onRemove(node.id)}>×</ActionIcon></Tooltip>
        </Group>
      </Group>

      <Divider />

      <Box style={{ overflowY: 'auto', flex: 1 }} p="sm">
        <Stack gap="sm">
          <Presets
            component={node.component}
            current={node.preset}
            onPick={(preset) => onPreset(node.id, preset)}
          />

          {controls.length ? (
            controls.map((prop) => (
              <Control
                key={prop.name}
                spec={prop}
                value={node.props[prop.name]}
                pageId={doc.id}
                onChange={(value) => onProp(node.id, prop.name, value)}
              />
            ))
          ) : (
            <Text size="xs" c="dimmed">
              Nothing to set on this one — it is all in what you put inside it.
            </Text>
          )}

          {slots.length ? (
            <>
              <Divider
                my="xs"
                label={
                  <Text size="10px" c="dimmed" tt="uppercase" fw={700}>
                    Contents
                  </Text>
                }
              />
              {slots.map((slot) => (
                <Slot
                  key={slot.name}
                  doc={doc}
                  node={node.id}
                  spec={slot}
                  onSelect={onSelect}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              ))}
            </>
          ) : null}

          {entry.spec.unsupported?.length ? (
            /*
             * Named rather than hidden. These are props the component really has and this panel
             * cannot draw — an array of objects, a render function — and a designer who cannot find
             * something deserves to know it exists and is not offered, rather than concluding the
             * component cannot do it.
             */
            <Text size="10px" c="dimmed" mt="xs">
              Set in code only: {entry.spec.unsupported.join(', ')}
            </Text>
          ) : null}

        </Stack>
      </Box>
    </Stack>
  )
}

/* ------------------------------------------------------------------ presets */

/**
 * The component's Storybook stories, offered as starting points.
 *
 * Not a stored property of the node — picking one writes its props and its contents in and then has
 * nothing more to do with it, which is why the control shows no current value. A designer who then
 * changes the copy has not "departed from the preset"; they have a card.
 */
function Presets({
  component,
  current,
  onPick,
}: {
  component: string
  current?: string
  onPick: (preset: string) => void
}) {
  const available = presetsFor(component)
  if (!available.length) return null

  const chosen = current && available.some((preset) => preset.label === current) ? current : null

  return (
    <Box>
      <Group justify="space-between" align="flex-end" gap="xs" wrap="nowrap">
        <Select
          size="xs"
          style={{ flex: 1, minWidth: 0 }}
          label="Preset"
          description="A worked example from the Storybook stories. Replaces what is in this component."
          placeholder="Choose one…"
          data={available.map((preset) => preset.label)}
          value={chosen}
          /*
           * Deselection is off. Clicking the option that is already showing is how a person says "put
           * it back the way it was", and Mantine's default reading of that gesture is "clear the
           * field" — which would empty the control and change nothing on the page.
           */
          allowDeselect={false}
          onChange={(label) => label && onPick(label)}
          comboboxProps={{ withinPortal: true }}
        />
        {chosen ? (
          /*
           * And this is that gesture, made explicit. `onChange` cannot fire for a value that has not
           * changed, so re-applying after editing the copy needs a control of its own rather than a
           * second click on the same option.
           */
          <Tooltip label={`Fill this in from ${chosen} again, discarding changes`}>
            <ActionIcon size="lg" variant="default" aria-label="Re-apply preset" onClick={() => onPick(chosen)}>
              ↺
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>
    </Box>
  )
}

/* ------------------------------------------------------------------ a slot */

/**
 * One named hole in a component, and what is in it.
 *
 * This is the other half of direct manipulation. The canvas is how a designer edits something they can
 * see; a slot list is how they reach something they cannot — an empty `Card.bottom`, drawn as nothing
 * at all, has no pixels to click on. Every slot the component has appears here whether or not it is
 * filled, so the shape of the component is legible from the panel.
 */
function Slot({
  doc,
  node,
  spec,
  onSelect,
  onAdd,
  onRemove,
}: {
  doc: PageDocument
  node: string
  spec: PropSpec
  onSelect: (id: string) => void
  onAdd: (parentId: string, slot: string, component: string) => void
  onRemove: (id: string) => void
}) {
  const parent = doc.nodes[node]
  const children = (parent?.slots[spec.name] ?? []).map((id) => doc.nodes[id]).filter(Boolean)

  const choices = Object.values(REGISTRY).filter((candidate) =>
    allowedIn(parent.component, spec.name, candidate.name),
  )

  return (
    <Box>
      <Group justify="space-between" mb={4} wrap="nowrap">
        <Text size="xs" fw={600}>
          {label(spec.name)}
        </Text>
        <Menu position="bottom-end" withinPortal shadow="md">
          <Menu.Target>
            <Button size="compact-xs" variant="subtle">
              Add
            </Button>
          </Menu.Target>
          <Menu.Dropdown mah={360} style={{ overflowY: 'auto' }}>
            {/* Grouped the same way the palette is, so the two read as one vocabulary. */}
            {PALETTE.map(({ group, entries }) => {
              const offered = entries.filter((entry) => choices.includes(entry))
              const subcomponents = choices.filter((entry) => entry.parentOnly && entry.group === group)
              const all = [...subcomponents, ...offered]
              if (!all.length) return null
              return (
                <Box key={group}>
                  <Menu.Label>{group}</Menu.Label>
                  {all.map((entry) => (
                    <Menu.Item key={entry.name} onClick={() => onAdd(node, spec.name, entry.name)}>
                      <Text size="xs">{entry.label}</Text>
                    </Menu.Item>
                  ))}
                </Box>
              )
            })}
          </Menu.Dropdown>
        </Menu>
      </Group>

      {spec.doc ? (
        <Text size="10px" c="dimmed" mb={4} lineClamp={2}>
          {hint(spec.doc)}
        </Text>
      ) : null}

      {children.length ? (
        <Stack gap={2}>
          {children.map((child) => (
            <Group
              key={child.id}
              gap={4}
              wrap="nowrap"
              px={6}
              py={3}
              style={{ borderRadius: 4, background: 'var(--mantine-color-dark-6)' }}
            >
              <Text
                size="xs"
                truncate
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => onSelect(child.id)}
              >
                {summarise(child.component, child.props)}
              </Text>
              <ActionIcon
                size="xs"
                variant="subtle"
                color="red"
                aria-label="Remove"
                onClick={() => onRemove(child.id)}
              >
                ×
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      ) : (
        <Text size="10px" c="dimmed" fs="italic">
          Empty
        </Text>
      )}
    </Box>
  )
}

/** What a node is called in a list: its own text if it has any, otherwise its component's name. */
export function summarise(component: string, props: Record<string, PropValue>): string {
  const entry = entryFor(component)
  const text = entry?.textProp ? props[entry.textProp] : undefined
  const written = String(text ?? props.title ?? props.content ?? props.label ?? '').trim()
  if (written) return written.length > 40 ? `${written.slice(0, 39)}…` : written
  return entry?.label ?? component
}
