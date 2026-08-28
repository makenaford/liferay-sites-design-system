/**
 * The two lists down the left: what you can add, and what is already there.
 *
 * They answer different questions and are deliberately not merged. The palette is "what exists"; the
 * layer tree is "what this page is made of". A designer uses the first once per section and the second
 * constantly.
 */
import { useState } from 'react'
import { ActionIcon, Box, Group, ScrollArea, Stack, Text, TextInput, UnstyledButton } from '@mantine/core'
import type { PageDocument } from './document'
import { entryFor, PALETTE, type Entry } from './registry'
import { summarise } from './Inspector'

/* ------------------------------------------------------------------ the palette */

export interface PaletteProps {
  /** Adds to the current selection if it will take it, otherwise to the page. */
  onAdd: (component: string) => void
  onDragStart: (component: string) => void
  onDragEnd: () => void
}

export function Palette({ onAdd, onDragStart, onDragEnd }: PaletteProps) {
  const [query, setQuery] = useState('')

  const matches = (entry: Entry) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return `${entry.label} ${entry.name} ${entry.hint ?? ''}`.toLowerCase().includes(needle)
  }

  return (
    <Stack gap={0} h="100%">
      <Box p="xs">
        <TextInput
          size="xs"
          placeholder="Search components"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </Box>

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="xs" p="xs" pt={0}>
          {PALETTE.map(({ group, entries }) => {
            const shown = entries.filter(matches)
            if (!shown.length) return null
            return (
              <Box key={group}>
                <Text size="10px" tt="uppercase" fw={700} c="dimmed" mb={4}>
                  {group}
                </Text>
                <Stack gap={2}>
                  {shown.map((entry) => (
                    <UnstyledButton
                      key={entry.name}
                      /*
                       * Draggable *and* clickable. Dragging is the direct way — drop it exactly where
                       * it goes — and clicking is the reliable one, which matters for a long page
                       * where the drop target is three screens away from the palette.
                       */
                      draggable
                      onDragStart={() => onDragStart(entry.name)}
                      onDragEnd={onDragEnd}
                      onClick={() => onAdd(entry.name)}
                      p={6}
                      style={{
                        borderRadius: 6,
                        border: '1px solid var(--mantine-color-dark-5)',
                        cursor: 'grab',
                      }}
                    >
                      <Text size="xs" fw={600}>
                        {entry.label}
                      </Text>
                      {entry.hint ? (
                        <Text size="10px" c="dimmed" lineClamp={2}>
                          {entry.hint}
                        </Text>
                      ) : null}
                    </UnstyledButton>
                  ))}
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  )
}

/* ------------------------------------------------------------------ the layer tree */

export interface LayersProps {
  doc: PageDocument
  selectedId: string | null
  onSelect: (id: string) => void
  onMoveWithin: (id: string, by: -1 | 1) => void
  onRemove: (id: string) => void
}

export function Layers({ doc, selectedId, onSelect, onMoveWithin, onRemove }: LayersProps) {
  return (
    <ScrollArea style={{ flex: 1 }}>
      <Stack gap={1} p={6}>
        {doc.root.length ? (
          doc.root.map((id) => (
            <Branch
              key={id}
              doc={doc}
              id={id}
              depth={0}
              selectedId={selectedId}
              onSelect={onSelect}
              onMoveWithin={onMoveWithin}
              onRemove={onRemove}
            />
          ))
        ) : (
          <Text size="xs" c="dimmed" p="xs">
            Nothing on the page yet.
          </Text>
        )}
      </Stack>
    </ScrollArea>
  )
}

/**
 * One node and its subtree.
 *
 * Slot names are shown as their own faint rows rather than being flattened away, because "this
 * heading is in the card's `hero` slot" is the fact a designer needs when the card is not laying out
 * the way they expected — and it is invisible on the canvas.
 */
function Branch({
  doc,
  id,
  depth,
  selectedId,
  onSelect,
  onMoveWithin,
  onRemove,
}: {
  doc: PageDocument
  id: string
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
  onMoveWithin: (id: string, by: -1 | 1) => void
  onRemove: (id: string) => void
}) {
  const node = doc.nodes[id]
  if (!node) return null

  const entry = entryFor(node.component)
  const selected = id === selectedId
  const filled = Object.entries(node.slots).filter(([, ids]) => ids.length)

  return (
    <Box>
      <Group
        gap={2}
        wrap="nowrap"
        pl={6 + depth * 10}
        pr={4}
        py={3}
        style={{
          borderRadius: 4,
          background: selected ? 'var(--mantine-color-dark-5)' : undefined,
        }}
      >
        <UnstyledButton style={{ flex: 1, minWidth: 0 }} onClick={() => onSelect(id)}>
          <Text size="xs" truncate fw={selected ? 600 : 400}>
            {summarise(node.component, node.props)}
          </Text>
          <Text size="9px" c="dimmed">
            {entry?.label ?? node.component}
          </Text>
        </UnstyledButton>
        <ActionIcon size="xs" variant="subtle" aria-label="Move up" onClick={() => onMoveWithin(id, -1)}>↑</ActionIcon>
        <ActionIcon size="xs" variant="subtle" aria-label="Move down" onClick={() => onMoveWithin(id, 1)}>↓</ActionIcon>
        <ActionIcon size="xs" variant="subtle" color="red" aria-label="Delete" onClick={() => onRemove(id)}>×</ActionIcon>
      </Group>

      {filled.map(([slot, ids]) => (
        <Box key={slot}>
          <Text size="9px" c="dimmed" pl={16 + depth * 10} tt="uppercase" fw={700}>
            {slot}
          </Text>
          {ids.map((child) => (
            <Branch
              key={child}
              doc={doc}
              id={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onMoveWithin={onMoveWithin}
              onRemove={onRemove}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}
