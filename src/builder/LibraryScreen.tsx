/**
 * The page library — the home screen for anyone signed in.
 *
 * Every page the team has made, newest first, with its status, who owns it and who touched it last.
 * Live: a colleague's page moving to "In review" changes here without a refresh, because the list is
 * fed by the library's socket (`useLibrary`).
 *
 * The status can be changed from the row as well as from inside the builder, because moving a batch
 * of pages to "Handed off" after a review is a library job, not something to open each page for.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  SegmentedControl,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { useLibrary } from './useLibrary'
import {
  PAGE_STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
  type LibraryEntry,
  type PageStatus,
} from './library'
import { BUILT_PAGES, builtPageFor, type BuiltPage } from './templates'

/** Where a new page is made — a path the Access application covers. */
const NEW_PAGE = '/edit/new'

type Filter = 'active' | PageStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'active', label: 'All active' },
  ...PAGE_STATUSES.map((status) => ({ value: status as Filter, label: STATUS_LABEL[status] })),
]

/** `3 min ago`, `yesterday`, `12 Oct` — how long since, at the precision anyone cares about. */
export function ago(at: number | null | undefined, now = Date.now()): string {
  if (!at) return '—'
  const seconds = Math.round((now - at) / 1000)
  if (seconds < 45) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

/** `makena.ford@liferay.com` reads as `makena.ford`. The whole address is in the tooltip. */
const person = (email: string | null) => (email ? email.split('@')[0] : '—')

async function changeStatus(id: string, status: PageStatus): Promise<void> {
  await fetch(`/api/pages/${id}/status`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  // Nothing to do with the answer: the library socket brings the change back, to everyone at once.
}

export function StatusBadge({ status }: { status: PageStatus }) {
  return (
    <Badge size="sm" variant="light" color={STATUS_COLOR[status]}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}

/** A status that can be changed in place. */
export function StatusMenu({ status, onChange }: { status: PageStatus; onChange: (status: PageStatus) => void }) {
  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <UnstyledButton aria-label={`Status: ${STATUS_LABEL[status]}. Change it`}>
          <StatusBadge status={status} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {PAGE_STATUSES.map((option) => (
          <Menu.Item key={option} onClick={() => option !== status && onChange(option)} disabled={option === status}>
            <StatusBadge status={option} />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

/** "New page" and the built pages to start from instead. */
function NewPage() {
  const groups = BUILT_PAGES.reduce<Record<string, BuiltPage[]>>((acc, page) => {
    ;(acc[page.group] ??= []).push(page)
    return acc
  }, {})

  return (
    <Group gap="xs">
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <Button size="sm" variant="default">
            Start from a built page
          </Button>
        </Menu.Target>
        <Menu.Dropdown mah={420} style={{ overflowY: 'auto' }}>
          {Object.entries(groups).map(([group, pages]) => (
            <Box key={group}>
              <Menu.Label>{group}</Menu.Label>
              {pages.map((page) => (
                <Menu.Item key={page.id} component="a" href={`${NEW_PAGE}?template=${page.id}`}>
                  <Text size="sm">{page.label}</Text>
                  {page.hint ? (
                    <Text size="xs" c="dimmed" maw={280} lineClamp={2}>
                      {page.hint}
                    </Text>
                  ) : null}
                </Menu.Item>
              ))}
            </Box>
          ))}
        </Menu.Dropdown>
      </Menu>
      <Button component="a" href={NEW_PAGE} size="sm">
        New page
      </Button>
    </Group>
  )
}

export function Library({ email }: { email: string | null }) {
  const library = useLibrary(true)
  const [filter, setFilter] = useState<Filter>('active')
  const [mine, setMine] = useState(false)
  const [query, setQuery] = useState('')

  // "3 min ago" has to keep counting while the tab sits open.
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(timer)
  }, [])

  const entries = library.status === 'ready' ? library.entries : []

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return entries.filter((entry) => {
      if (filter === 'active' ? entry.status === 'archived' : entry.status !== filter) return false
      if (mine && entry.createdBy !== email) return false
      if (!needle) return true
      const template = builtPageFor(entry.template)?.label ?? ''
      return [entry.title, entry.id, template, entry.createdBy ?? '', entry.updatedBy ?? '']
        .some((text) => text.toLowerCase().includes(needle))
    })
  }, [entries, filter, mine, query, email])

  /* How many in each status, so the filter says where the work is before it is clicked. */
  const counts = useMemo(() => {
    const tally: Record<string, number> = { active: 0 }
    for (const entry of entries) {
      tally[entry.status] = (tally[entry.status] ?? 0) + 1
      if (entry.status !== 'archived') tally.active += 1
    }
    return tally
  }, [entries])

  return (
    <Box maw={1180} mx="auto" p="xl">
      <Group justify="space-between" align="flex-end" mb="lg">
        <Box>
          <Group gap="xs" align="center">
            <Text fz={32} fw={700}>
              Pages
            </Text>
            {library.status === 'ready' ? (
              <Tooltip label={library.live ? 'Updates as the team works' : 'Reconnecting…'}>
                <Box
                  w={8}
                  h={8}
                  style={{ borderRadius: 4, background: `var(--mantine-color-${library.live ? 'green' : 'gray'}-6)` }}
                />
              </Tooltip>
            ) : null}
          </Group>
          <Text c="dimmed" size="sm">
            Every page the team has built from the design system — the deliverable, not a picture of it.
          </Text>
          {email ? (
            <Text size="xs" c="dimmed" mt={4}>
              Signed in as {email}
            </Text>
          ) : null}
        </Box>
        <NewPage />
      </Group>

      <Group justify="space-between" mb="sm" gap="sm">
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={(value) => setFilter(value as Filter)}
          data={FILTERS.map(({ value, label }) => ({
            value,
            label: counts[value] ? `${label} ${counts[value]}` : label,
          }))}
        />
        <Group gap="sm">
          <Switch size="xs" label="Only mine" checked={mine} onChange={(event) => setMine(event.currentTarget.checked)} />
          <TextInput
            size="xs"
            w={220}
            placeholder="Search title, owner, template"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </Group>
      </Group>

      {library.status === 'loading' ? (
        <Text c="dimmed" size="sm" py="xl" ta="center">
          Loading the library…
        </Text>
      ) : library.status === 'denied' ? (
        <Text c="dimmed" size="sm" py="xl" ta="center">
          The library is for people signed in to the team.
        </Text>
      ) : shown.length ? (
        <Table highlightOnHover verticalSpacing="xs" fz="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Page</Table.Th>
              <Table.Th w={130}>Status</Table.Th>
              <Table.Th w={150}>Owner</Table.Th>
              <Table.Th w={200}>Last edited</Table.Th>
              <Table.Th w={70} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {shown.map((entry) => (
              <Row key={entry.id} entry={entry} />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Stack align="center" gap={4} py="xl">
          <Text size="sm">{entries.length ? 'Nothing matches.' : 'No pages yet.'}</Text>
          <Text size="xs" c="dimmed">
            {entries.length
              ? 'Try another status, or clear the search.'
              : 'Start one from a built page, or from the standard skeleton.'}
          </Text>
        </Stack>
      )}
    </Box>
  )
}

function Row({ entry }: { entry: LibraryEntry }) {
  const template = builtPageFor(entry.template)

  return (
    <Table.Tr>
      <Table.Td>
        <Anchor href={`/edit/${entry.id}`} fw={600} c="inherit">
          {entry.title || 'Untitled page'}
        </Anchor>
        <Text size="xs" c="dimmed">
          {template ? `From ${template.label} · ` : ''}
          {entry.sections} block{entry.sections === 1 ? '' : 's'} · rev {entry.rev}
          {entry.colorScheme === 'light' ? ' · light' : ''}
          {entry.openComments ? (
            <Anchor href={`/p/${entry.id}`} size="xs" c="orange" fw={600}>
              {' · '}
              {entry.openComments} open comment{entry.openComments === 1 ? '' : 's'}
            </Anchor>
          ) : null}
        </Text>
      </Table.Td>
      <Table.Td>
        <Tooltip
          label={entry.statusBy ? `${entry.statusBy}, ${ago(entry.statusAt)}` : 'Not reviewed yet'}
          disabled={entry.status === 'draft' && !entry.statusBy}
        >
          <Box w="fit-content">
            <StatusMenu status={entry.status} onChange={(status) => void changeStatus(entry.id, status)} />
          </Box>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip label={entry.createdBy ?? 'Made before owners were recorded'}>
          <Text size="sm" span>
            {person(entry.createdBy)}
          </Text>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{ago(entry.updatedAt)}</Text>
        {entry.updatedBy ? (
          <Text size="xs" c="dimmed">
            by {person(entry.updatedBy)}
          </Text>
        ) : null}
      </Table.Td>
      <Table.Td>
        <Anchor href={`/p/${entry.id}`} size="xs">
          View
        </Anchor>
      </Table.Td>
    </Table.Tr>
  )
}
