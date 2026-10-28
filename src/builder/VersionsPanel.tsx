/**
 * Named versions, in the builder's right rail.
 *
 * The top is the act — name what this is, say what changed, optionally move the page's status with it
 * — and above the button, what has changed since the last version, so nobody freezes "v4" without
 * knowing what is in it. Below, every version, each with its frozen HTML, its React, and a way back.
 */
import { useEffect, useMemo, useState } from 'react'
import { Anchor, Badge, Box, Button, Divider, Group, Menu, Select, Stack, Text, TextInput, Textarea, Tooltip } from '@mantine/core'
import type { PageDocument } from './document'
import type { Page } from './usePage'
import { STATUS_LABEL, type PageStatus } from './library'
import { changeCount, diffDocs, versionPath, VERSION_NAME_LIMIT, type DocChanges, type PageVersion } from './versions'
import { StatusBadge, ago } from './LibraryScreen'
import { summarise } from './Inspector'
import { handle } from './comments'

/** A version's frozen document, fetched once and kept. */
export function useVersionDoc(page: string, number: number | null): PageDocument | null | undefined {
  const [doc, setDoc] = useState<PageDocument | null | undefined>(undefined)
  useEffect(() => {
    if (!number) return setDoc(null)
    let live = true
    setDoc(undefined)
    void fetch(`/api/pages/${page}/versions/${number}`)
      .then(async (response) => (response.ok ? ((await response.json()) as { doc: PageDocument }).doc : null))
      .then((found) => live && setDoc(found))
      .catch(() => live && setDoc(null))
    return () => {
      live = false
    }
  }, [page, number])
  return doc
}

const KIND = {
  added: { label: 'Added', color: 'green' },
  removed: { label: 'Removed', color: 'red' },
  changed: { label: 'Changed', color: 'yellow' },
  moved: { label: 'Moved', color: 'gray' },
} as const

/** What changed, block by block, in the words the layer tree uses. */
export function ChangesList({ changes, empty = 'No changes.' }: { changes: DocChanges; empty?: string }) {
  if (!changeCount(changes)) {
    return (
      <Text size="xs" c="dimmed">
        {empty}
      </Text>
    )
  }
  return (
    <Stack gap={4}>
      {changes.title ? (
        <Text size="xs">
          Title: <s>{changes.title.from}</s> → {changes.title.to}
        </Text>
      ) : null}
      {changes.colorScheme ? (
        <Text size="xs">
          Colour scheme: {changes.colorScheme.from} → {changes.colorScheme.to}
        </Text>
      ) : null}
      {changes.blocks.map((block) => (
        <Group key={`${block.kind}-${block.id}`} gap={6} wrap="nowrap">
          <Badge size="xs" variant="light" color={KIND[block.kind].color} w={64} style={{ flex: 'none' }}>
            {KIND[block.kind].label}
          </Badge>
          <Text size="xs" truncate>
            {summarise(block.node.component, block.node.props, block.node.data)}
          </Text>
        </Group>
      ))}
    </Stack>
  )
}

const ALSO: { value: string; label: string }[] = [
  { value: '', label: 'Leave the status as it is' },
  ...(['in-review', 'approved', 'handed-off'] as PageStatus[]).map((status) => ({
    value: status,
    label: `Mark it ${STATUS_LABEL[status]}`,
  })),
]

export function VersionsPanel({ page }: { page: Page & { doc: PageDocument } }) {
  const { doc, versions } = page
  const latest = versions?.[0] ?? null
  const latestDoc = useVersionDoc(doc.id, latest?.number ?? null)
  const sinceLatest = useMemo(() => (latestDoc ? diffDocs(latestDoc, doc) : null), [latestDoc, doc])

  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [also, setAlso] = useState('')
  const [busy, setBusy] = useState(false)
  const [made, setMade] = useState<PageVersion | null>(null)

  const save = async () => {
    if (!name.trim() || busy) return
    setBusy(true)
    const version = await page.createVersion({ name, note, status: (also || undefined) as PageStatus | undefined })
    setBusy(false)
    if (version) {
      setMade(version)
      setName('')
      setNote('')
      setAlso('')
    }
  }

  return (
    <Stack gap="sm" p="sm">
      <Box>
        <Text size="sm" fw={700}>
          Save a version
        </Text>
        <Text size="10px" c="dimmed">
          Freezes the page as it is now — its HTML, its files and its React — as the deliverable to sign off
          or hand over. Later edits never change it.
        </Text>
      </Box>

      {latest ? (
        <Box p="xs" style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 6 }}>
          <Text size="10px" tt="uppercase" fw={700} c="dimmed" mb={4}>
            Since v{latest.number} · {latest.name}
          </Text>
          {sinceLatest ? (
            <ChangesList changes={sinceLatest} empty="Nothing has changed since the last version." />
          ) : (
            <Text size="xs" c="dimmed">
              Comparing…
            </Text>
          )}
        </Box>
      ) : null}

      <TextInput
        size="xs"
        label="Name"
        placeholder={latest ? 'e.g. Approved for build' : 'e.g. First review'}
        maxLength={VERSION_NAME_LIMIT}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Textarea
        size="xs"
        label="Note"
        placeholder="What this version is for, what changed, what to look at"
        autosize
        minRows={2}
        value={note}
        onChange={(event) => setNote(event.currentTarget.value)}
      />
      <Select size="xs" data={ALSO} value={also} onChange={(value) => setAlso(value ?? '')} allowDeselect={false} comboboxProps={{ withinPortal: true }} />
      <Button
        size="xs"
        onClick={() => void save()}
        loading={busy}
        disabled={!name.trim() || (sinceLatest !== null && changeCount(sinceLatest) === 0)}
      >
        Save version {versions ? versions.length + 1 : ''}
      </Button>
      {made ? (
        <Text size="xs" c="green">
          Saved v{made.number}.{' '}
          <Anchor href={versionPath(doc.id, made.number)} size="xs" target="_blank">
            Open it
          </Anchor>
        </Text>
      ) : null}

      <Divider my={4} label={<Text size="10px" tt="uppercase" fw={700} c="dimmed">Versions</Text>} />

      {versions?.length ? (
        versions.map((version) => (
          <VersionRow
            key={version.number}
            page={doc.id}
            version={version}
            previous={versions.find((one) => one.number < version.number) ?? null}
            onRestore={() => void page.restoreVersion(version.number)}
          />
        ))
      ) : (
        <Text size="xs" c="dimmed">
          No versions yet. The first one is usually what goes to review.
        </Text>
      )}
    </Stack>
  )
}

function VersionRow({
  page,
  version,
  previous,
  onRestore,
}: {
  page: string
  version: PageVersion
  previous: PageVersion | null
  onRestore: () => void
}) {
  const base = versionPath(page, version.number)
  return (
    <Box p="xs" style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 6 }}>
      <Group justify="space-between" wrap="nowrap" gap={4}>
        <Anchor href={base} target="_blank" size="sm" fw={600} c="inherit" truncate>
          v{version.number} · {version.name}
        </Anchor>
        <StatusBadge status={version.status} />
      </Group>
      <Text size="10px" c="dimmed">
        <Tooltip label={version.by ?? 'unknown'}>
          <span>{handle(version.by)}</span>
        </Tooltip>{' '}
        · {ago(version.at)} · rev {version.rev}
      </Text>
      {version.note ? (
        <Text size="xs" mt={4} style={{ whiteSpace: 'pre-wrap' }}>
          {version.note}
        </Text>
      ) : null}
      <Group gap="xs" mt={6}>
        <Anchor href={base} target="_blank" size="xs">
          View
        </Anchor>
        <Anchor href={`${base}.html`} target="_blank" size="xs">
          HTML
        </Anchor>
        <Anchor href={`${base}.tsx`} size="xs">
          React
        </Anchor>
        {previous ? (
          <Anchor href={`/p/${page}/compare/${previous.number}/${version.number}`} target="_blank" size="xs">
            Compare with v{previous.number}
          </Anchor>
        ) : null}
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <Anchor component="button" size="xs" c="dimmed">
              Restore…
            </Anchor>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label maw={240}>
              The page becomes v{version.number} again, as a new revision. Nothing is lost: the current state
              stays in the history.
            </Menu.Label>
            <Menu.Item fz="xs" onClick={onRestore}>
              Restore v{version.number} into the page
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  )
}
