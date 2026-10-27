/**
 * A version on its own (`/p/:id/v/:n`), and two versions side by side (`/p/:id/compare/:a/:b`).
 *
 * The version page draws the frozen *document* with today's components, so it scrolls, tabs and
 * carousels work. The frozen *HTML* is the signed-off rendering, a link away in the bar along the bottom
 * — and it is what the comparison shows, because comparing two deliverables means comparing what was
 * actually handed over.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Anchor, Box, Button, Group, Popover, ScrollArea, Stack, Text } from '@mantine/core'
import type { PageDocument } from './document'
import { Renderer } from './Renderer'
import { PageTheme } from './PageTheme'
import { StatusBadge, ago } from './LibraryScreen'
import { handle } from './comments'
import { changeCount, diffDocs, versionPath, type PageVersion } from './versions'
import { ChangesList, useVersionDoc } from './VersionsPanel'

type Loaded = { status: 'loading' } | { status: 'denied' } | { status: 'missing' } | { status: 'ready'; version: PageVersion; doc: PageDocument }

function useVersion(page: string, number: number): Loaded {
  const [state, setState] = useState<Loaded>({ status: 'loading' })
  useEffect(() => {
    let live = true
    void fetch(`/api/pages/${page}/versions/${number}`).then(async (response) => {
      if (!live) return
      if (response.status === 401 || response.status === 403) return setState({ status: 'denied' })
      if (!response.ok) return setState({ status: 'missing' })
      const body = (await response.json()) as { version: PageVersion; doc: PageDocument }
      setState({ status: 'ready', ...body })
    })
    return () => {
      live = false
    }
  }, [page, number])
  return state
}

const Message = ({ children }: { children: React.ReactNode }) => (
  <Box p="xl" ta="center">
    <Text c="dimmed">{children}</Text>
  </Box>
)

const BAR: React.CSSProperties = {
  position: 'fixed',
  insetInline: 0,
  insetBlockEnd: 0,
  zIndex: 1000,
  background: 'rgba(16, 17, 19, 0.94)',
  backdropFilter: 'blur(8px)',
  borderBlockStart: '1px solid var(--mantine-color-dark-4)',
  color: 'var(--mantine-color-dark-0)',
}

/* ------------------------------------------------------------------ one version */

export function VersionView({ page, number }: { page: string; number: number }) {
  const loaded = useVersion(page, number)
  const previousDoc = useVersionDoc(page, number > 1 ? number - 1 : null)
  const changes = useMemo(
    () => (loaded.status === 'ready' && previousDoc ? diffDocs(previousDoc, loaded.doc) : null),
    [loaded, previousDoc],
  )

  useEffect(() => {
    if (loaded.status === 'ready') document.title = `v${number} · ${loaded.version.name} — ${loaded.doc.title}`
  }, [loaded, number])

  if (loaded.status === 'loading') return <Message>Loading…</Message>
  if (loaded.status === 'denied') return <Message>This version is not open to you. Ask for a link, or sign in.</Message>
  if (loaded.status === 'missing') return <Message>There is no version {number} of this page.</Message>

  const { version, doc } = loaded
  const base = versionPath(page, number)

  return (
    <>
      <Box pb={64}>
        <PageTheme colorScheme={doc.colorScheme} style={{ minBlockSize: '100vh' }}>
          <Renderer doc={doc} />
        </PageTheme>
      </Box>

      <Group style={BAR} justify="space-between" px="md" py={10} wrap="nowrap" gap="md">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <Box style={{ minWidth: 0 }}>
            <Text size="sm" fw={700} truncate>
              {doc.title} · v{number} · {version.name}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              Frozen {ago(version.at)} by {handle(version.by)} from revision {version.rev}
              {version.note ? ` — ${version.note}` : ''}
            </Text>
          </Box>
          <StatusBadge status={version.status} />
        </Group>
        <Group gap="xs" wrap="nowrap">
          {changes ? (
            <Popover position="top-end" withinPortal width={340} shadow="md">
              <Popover.Target>
                <Button size="xs" variant="default">
                  {changeCount(changes)} change{changeCount(changes) === 1 ? '' : 's'} since v{number - 1}
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <ChangesList changes={changes} />
                <Anchor href={`/p/${page}/compare/${number - 1}/${number}`} size="xs" mt="xs" display="block">
                  Compare side by side
                </Anchor>
              </Popover.Dropdown>
            </Popover>
          ) : null}
          <Button component="a" href={`${base}.html`} size="xs" variant="default" target="_blank">
            HTML
          </Button>
          <Button component="a" href={`${base}.tsx`} size="xs" variant="default">
            React
          </Button>
          <Button component="a" href={`/p/${page}`} size="xs">
            Current page
          </Button>
        </Group>
      </Group>
    </>
  )
}

/* ------------------------------------------------------------------ two versions */

/** The width the frozen pages are drawn at before being scaled into their half of the screen. */
const DRAWN_AT = 1440

export function CompareView({ page, from, to }: { page: string; from: number; to: number }) {
  const left = useVersion(page, from)
  const right = useVersion(page, to)
  const changes = useMemo(
    () => (left.status === 'ready' && right.status === 'ready' ? diffDocs(left.doc, right.doc) : null),
    [left, right],
  )

  const area = useRef<HTMLDivElement>(null)
  const frames = [useRef<HTMLIFrameElement>(null), useRef<HTMLIFrameElement>(null)]
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const box = area.current?.getBoundingClientRect()
      if (box) setSize({ width: box.width, height: box.height })
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [])

  /*
   * Scrolling either page scrolls the other to the same point, as a fraction of its height — two
   * versions of a page are rarely the same length, and matching pixels would drift apart by the end.
   * The frames are same-origin and script-free, so the parent reads their scroll position directly.
   */
  const sync = (index: number) => {
    const source = frames[index].current?.contentWindow
    const target = frames[1 - index].current?.contentWindow
    if (!source || !target) return
    const s = source.document.scrollingElement
    const t = target.document.scrollingElement
    if (!s || !t) return
    const fraction = s.scrollTop / Math.max(1, s.scrollHeight - s.clientHeight)
    const wanted = fraction * (t.scrollHeight - t.clientHeight)
    if (Math.abs(t.scrollTop - wanted) > 2) t.scrollTop = wanted
  }

  if (left.status === 'denied' || right.status === 'denied') return <Message>These versions are not open to you.</Message>
  if (left.status === 'missing' || right.status === 'missing') return <Message>One of those versions does not exist.</Message>

  const half = Math.max(0, (size.width - 16) / 2)
  const scale = half / DRAWN_AT

  const label = (state: Loaded, number: number) =>
    state.status === 'ready' ? (
      <Group gap="xs" wrap="nowrap">
        <Anchor href={versionPath(page, number)} fw={700} size="sm" c="inherit">
          v{number} · {state.version.name}
        </Anchor>
        <StatusBadge status={state.version.status} />
        <Text size="xs" c="dimmed">
          {ago(state.version.at)}
        </Text>
      </Group>
    ) : (
      <Text size="sm">v{number}</Text>
    )

  return (
    <Stack gap={0} h="100vh" bg="dark.8">
      <Group justify="space-between" p="sm" wrap="nowrap" align="flex-start">
        <Group gap="xl" wrap="nowrap">
          {label(left, from)}
          <Text c="dimmed">→</Text>
          {label(right, to)}
        </Group>
        {changes ? (
          <Popover position="bottom-end" withinPortal width={360} shadow="md">
            <Popover.Target>
              <Button size="xs" variant="default">
                {changeCount(changes)} change{changeCount(changes) === 1 ? '' : 's'}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <ScrollArea.Autosize mah={400}>
                <ChangesList changes={changes} />
              </ScrollArea.Autosize>
            </Popover.Dropdown>
          </Popover>
        ) : null}
      </Group>

      <Box ref={area} style={{ flex: 1, minHeight: 0, display: 'flex', gap: 16, padding: '0 0 0 0', overflow: 'hidden' }}>
        {[from, to].map((number, index) => (
          <Box key={number} style={{ width: half, height: '100%', overflow: 'hidden', flex: 'none' }}>
            {scale > 0 ? (
              <iframe
                ref={frames[index]}
                title={`Version ${number}`}
                src={`${versionPath(page, number)}.html`}
                /* Same origin so the scroll can be read; no scripts, because the frozen HTML has none. */
                sandbox="allow-same-origin"
                onLoad={() =>
                  frames[index].current?.contentWindow?.addEventListener('scroll', () => sync(index), { passive: true })
                }
                style={{
                  width: DRAWN_AT,
                  height: size.height / scale,
                  border: 0,
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                  background: '#0b0c0e',
                }}
              />
            ) : null}
          </Box>
        ))}
      </Box>
    </Stack>
  )
}
