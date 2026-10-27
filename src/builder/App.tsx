/**
 * The builder application.
 *
 * Three screens behind one bundle:
 *
 * - `/` — name a new page, or reopen one of yours
 * - `/edit/:id` — the builder
 * - `/p/:id` — the page on its own, which is what gets shared
 *
 * The last one is the reason the renderer takes its selection state as an optional prop: a published
 * page is the same component tree with the builder's markers left off, so what a designer signs off
 * and what a visitor loads cannot drift apart.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Menu,
  Divider,
  Group,
  MantineProvider,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import {
  duplicate,
  insert,
  locate,
  move,
  refill,
  remove,
  setData,
  setProp,
  type JsonObject,
  type PageDocument,
  type PropValue,
} from './document'
import { entryFor } from './registry'
import { presetsFor } from './presets'
import { isNew, starterContent } from './starter'
import { builtPageContent, builtPageFor } from './templates'
import { Library, StatusMenu } from './LibraryScreen'
import { CommentLayer, type Draft } from './CommentLayer'
import { CommentsPanel, pinnedThreads } from './CommentsPanel'
import { VersionsPanel } from './VersionsPanel'
import { CompareView, VersionView } from './VersionScreens'
import { placementFor, refusal } from './placement'
import { usePage, type Page } from './usePage'
import type { CommentsState } from './comments'
import { Canvas } from './Canvas'
import { CodePanel, type View } from './CodePanel'
import { Inspector } from './Inspector'
import { Layers, Palette } from './Panels'
import { NODE_ATTR, Renderer } from './Renderer'
import { PageTheme } from './PageTheme'

import '@mantine/core/styles.css'
import '../theme/typography.generated.css'

/** The three widths worth checking. The numbers are the Figma frames. */
const WIDTHS = { Desktop: 1440, Tablet: 900, Mobile: 390 } as const

/* ------------------------------------------------------------------ routing */

type Route =
  | { screen: 'home' }
  | { screen: 'edit'; id: string }
  | { screen: 'view'; id: string; key: string | null }
  | { screen: 'version'; id: string; number: number }
  | { screen: 'compare'; id: string; from: number; to: number }

/**
 * Three routes do not need a router.
 *
 * A dependency here would ship a few kilobytes to solve a problem this `switch` solves, and the
 * builder already loads the whole component library.
 */
function routeOf(location: Location): Route {
  const [first, second, third, fourth, fifth] = location.pathname.split('/').filter(Boolean)
  if (first === 'edit' && second) return { screen: 'edit', id: second }
  if (first === 'p' && second && third === 'v' && /^\d+$/.test(fourth ?? '')) {
    return { screen: 'version', id: second, number: Number(fourth) }
  }
  if (first === 'p' && second && third === 'compare' && /^\d+$/.test(fourth ?? '') && /^\d+$/.test(fifth ?? '')) {
    return { screen: 'compare', id: second, from: Number(fourth), to: Number(fifth) }
  }
  if (first === 'p' && second) {
    return { screen: 'view', id: second, key: new URLSearchParams(location.search).get('k') }
  }
  return { screen: 'home' }
}

export function App() {
  const [route, setRoute] = useState(() => routeOf(location))

  useEffect(() => {
    const sync = () => setRoute(routeOf(location))
    addEventListener('popstate', sync)
    return () => removeEventListener('popstate', sync)
  }, [])

  /*
   * The share code makes exactly one trip through the address bar.
   *
   * It is taken out as soon as it has been read, before the page has finished loading and long before
   * anyone could copy the URL. The Worker puts it in an HttpOnly cookie on the first request that
   * carries it, so nothing is lost by removing it — and what is gained is that the address bar of an
   * open page is no longer a working invitation to it.
   */
  useEffect(() => {
    if (route.screen === 'view' && route.key) {
      history.replaceState({}, '', `/p/${route.id}`)
    }
  }, [route])

  return (
    /*
     * Stock Mantine, on purpose. The design system's theme is applied by `PageTheme`, around the page
     * and nothing else — see the note there for why the tool must not wear the thing it is building.
     */
    <MantineProvider forceColorScheme="dark">
      {route.screen === 'home' ? <Home /> : null}
      {route.screen === 'edit' ? <Builder id={route.id} /> : null}
      {route.screen === 'view' ? <Published id={route.id} shareKey={route.key} /> : null}
      {route.screen === 'version' ? <VersionView page={route.id} number={route.number} /> : null}
      {route.screen === 'compare' ? <CompareView page={route.id} from={route.from} to={route.to} /> : null}
    </MantineProvider>
  )
}

/**
 * Where a key belongs to the field rather than to the builder's shortcuts. Text entry only: a segmented
 * control is a set of radio inputs, and focus left on one after a click must not swallow `C` or `Delete`.
 */
const TYPING = 'textarea, [contenteditable="true"], input:not([type="radio"]):not([type="checkbox"])'

/* ------------------------------------------------------------------ home */

/**
 * Recently opened pages.
 *
 * Kept in this browser rather than on the server, because there is no account system and no list
 * endpoint — a page is reached by knowing its name. That is the right trade for a mocking tool: no
 * sign-in between an idea and a page, and a link that works for whoever it is sent to. The cost is
 * that a page whose link is lost is genuinely lost, which is why the names are readable.
 */
const RECENT_KEY = 'sds-builder-recent'

/** Where an unauthenticated visitor is sent to sign in — a path the Access application covers. */
const SIGN_IN = '/edit/new'

interface Me {
  authed: boolean
  email: string | null
}

/**
 * Whether this browser is signed in.
 *
 * Asked of the server rather than inferred from a cookie: the Access cookie is `HttpOnly` and cannot
 * be read here, which is the correct arrangement — the answer has to come from whoever verifies the
 * signature, and that is the Worker.
 */
function useMe(): Me | null {
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    void fetch('/api/me')
      .then((response) => response.json() as Promise<Me>)
      .then(setMe)
      .catch(() => setMe({ authed: false, email: null }))
  }, [])

  return me
}

interface Recent {
  id: string
  title: string
  at: number
}

const readRecent = (): Recent[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as Recent[]
  } catch {
    return []
  }
}

const noteRecent = (id: string, title: string) => {
  const kept = readRecent().filter((entry) => entry.id !== id)
  localStorage.setItem(RECENT_KEY, JSON.stringify([{ id, title, at: Date.now() }, ...kept].slice(0, 20)))
}

function Home() {
  const me = useMe()
  const [recent] = useState(readRecent)

  // The team's library, for anyone signed in. What follows is for everyone else: a reader who holds
  // share links, and the way in for someone who has not signed in yet.
  if (me?.authed) return <Library email={me.email} />

  return (
    <Box maw={640} mx="auto" p="xl">
      <Text fz={32} fw={700}>
        Page builder
      </Text>
      <Text c="dimmed" mt="8" mb="24">
        Build a page out of the design system’s real components. Every page lives at its own address
        and saves itself as you go.
      </Text>

      {/*
        * One link either way. Signing in *is* creating a page: `/edit/new` is covered by the Access
        * application, so following it produces the one-time-code screen for anyone who has not signed
        * in, and lands on a fresh page for anyone who has. A separate "sign in" button would be a
        * second way to reach the same screen.
        */}
      <Button component="a" href={SIGN_IN} size="md" disabled={me === null}>
        {me?.authed ? 'New page' : 'Sign in to create a page'}
      </Button>

      {me?.authed && me.email ? (
        <Text size="xs" c="dimmed" mt="8">
          Signed in as {me.email}
        </Text>
      ) : null}

      {recent.length ? (
        <Box mt="40">
          <Text fz="sm" fw={600} mb="4">
            Opened on this computer
          </Text>
          {/*
            * This browser's own list, not an account's. There is no reader sign-in, so the server has
            * no idea who is asking — what it can tell is whether the request carries a page's cookie,
            * and that is per page. So the list of *which* pages lives here, and the permission to open
            * any one of them stays with the Worker.
            */}
          <Text size="xs" c="dimmed" mb="8">
            Kept in this browser. A page opens if you are signed in, or if you have opened its share
            link here before.
          </Text>
          <Stack gap={4}>
            {recent.map((entry) => (
              <Anchor key={entry.id} href={`/p/${entry.id}`} fz="sm">
                {entry.title}{' '}
                <Text span c="dimmed" fz="xs">
                  /{entry.id}
                </Text>
              </Anchor>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}

/* ------------------------------------------------------------------ the published page */

function Published({ id, shareKey }: { id: string; shareKey: string | null }) {
  const page = usePage(id, shareKey)
  const { doc, status } = page

  useEffect(() => {
    if (!doc) return
    document.title = doc.title
    // Recorded once it has actually opened, so the home page never lists a page you cannot get into.
    noteRecent(doc.id, doc.title)
  }, [doc])

  if (status === 'loading') return <Centered>Loading…</Centered>
  if (status === 'denied') return <NoAccess />
  if (!doc) return <Centered>There is no page at this address.</Centered>

  /*
   * No frame, no toolbar, no marker attributes — the components and nothing else, at the browser's own
   * width. This is the artefact the mock exists to produce.
   *
   * Signed in, it is also where a page is **reviewed**: the same page, with comment pins over it and
   * the conversation beside it. A reviewer never needs the editor — they open the link they were sent.
   * A share-code reader gets the bare page, because comments are internal.
   */
  if (page.comments) return <Review page={page as Page & { doc: PageDocument; comments: CommentsState }} />

  return (
    <PageTheme colorScheme={doc.colorScheme} style={{ minBlockSize: '100vh' }}>
      <Renderer doc={doc} />
    </PageTheme>
  )
}

/** The shared page with its comments: pins on the page, the conversation in a panel on the right. */
function Review({ page }: { page: Page & { doc: PageDocument; comments: CommentsState } }) {
  const me = useMe()
  const { doc, comments } = page
  const [open, setOpen] = useState(true)
  const [commenting, setCommenting] = useState(false)
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const pageArea = useRef<HTMLDivElement>(null)

  const openThreads = comments.comments.filter((c) => c.thread === c.id && c.resolvedAt === null).length

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest(TYPING)) return
      if (event.key === 'Escape') {
        setCommenting(false)
        setDraft(null)
      }
      if (event.key.toLowerCase() === 'c' && !event.metaKey && !event.ctrlKey) {
        setCommenting((was) => !was)
        setOpen(true)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const reveal = (node: string) => {
    const marker = pageArea.current?.querySelector(`[${NODE_ATTR}="${CSS.escape(node)}"]`)
    marker?.firstElementChild?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  return (
    <>
      <Box ref={pageArea} style={{ position: 'relative', marginInlineEnd: open ? PANEL_WIDTH : 0 }}>
        <PageTheme colorScheme={doc.colorScheme} style={{ minBlockSize: '100vh' }}>
          <Renderer doc={doc} marked editing={false} />
        </PageTheme>
        <CommentLayer
          doc={doc}
          threads={pinnedThreads(doc, comments, activeThread)}
          activeThread={activeThread}
          commenting={commenting}
          draft={draft}
          onPlace={(placed) => {
            setDraft(placed)
            setActiveThread(null)
            setCommenting(false)
            setOpen(true)
          }}
          onOpen={(thread) => {
            setActiveThread(thread)
            setOpen(true)
          }}
        />
      </Box>

      {open ? (
        <Stack
          gap={0}
          style={{
            position: 'fixed',
            insetBlock: 0,
            insetInlineEnd: 0,
            width: PANEL_WIDTH,
            zIndex: 1000,
            background: 'var(--mantine-color-dark-7)',
            borderInlineStart: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          <Group justify="space-between" p="sm" wrap="nowrap">
            <Box style={{ minWidth: 0 }}>
              <Text fw={700} size="sm" truncate>
                {doc.title}
              </Text>
              <Group gap={6}>
                {page.meta ? <StatusMenu status={page.meta.status} onChange={(status) => void page.setStatus(status)} /> : null}
                <Anchor href={`/edit/${doc.id}`} size="xs">
                  Open in the builder
                </Anchor>
              </Group>
            </Box>
            <ActionIcon variant="subtle" aria-label="Hide comments" onClick={() => setOpen(false)}>
              ×
            </ActionIcon>
          </Group>
          <Box px="sm" pb="xs">
            <Button
              fullWidth
              size="xs"
              variant={commenting ? 'filled' : 'default'}
              color={commenting ? 'orange' : undefined}
              onClick={() => setCommenting((was) => !was)}
            >
              {commenting ? 'Click the page to place it — Esc to cancel' : 'Add a comment (C)'}
            </Button>
          </Box>
          <Divider />
          <ScrollArea style={{ flex: 1, minHeight: 0 }}>
            <CommentsPanel
              doc={doc}
              state={comments}
              me={me?.email ?? null}
              actions={page.commentActions}
              activeThread={activeThread}
              onActivate={setActiveThread}
              draft={draft}
              onDraftDone={() => setDraft(null)}
              onReveal={reveal}
            />
          </ScrollArea>
          {page.error ? (
            <Text size="xs" c="red" p="xs">
              {page.error}
            </Text>
          ) : null}
        </Stack>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          style={{ position: 'fixed', insetInlineEnd: 20, insetBlockEnd: 20, zIndex: 1000 }}
        >
          Comments{openThreads ? ` · ${openThreads}` : ''}
        </Button>
      )}
    </>
  )
}

/** The review panel's width. The page gives up exactly this much, so nothing hides under it. */
const PANEL_WIDTH = 340

/**
 * The refusal, written for the person who hit it.
 *
 * A reader who follows a stale link and a colleague who was never sent one both land here, and the
 * two useful things to say are "ask for a fresh link" and "or sign in, if this is yours".
 */
const NoAccess = () => (
  <Box p="xl" ta="center" maw={420} mx="auto">
    <Text fw={600}>This page is not open to you</Text>
    <Text c="dimmed" size="sm" mt="8">
      Share links carry a code, and this browser has not been given one for this page — or the code
      has since been replaced. Ask whoever sent it for a new link.
    </Text>
    <Button component="a" href={SIGN_IN} variant="light" size="xs" mt="16">
      Sign in
    </Button>
  </Box>
)

const Centered = ({ children }: { children: React.ReactNode }) => (
  <Box p="xl" ta="center">
    <Text c="dimmed">{children}</Text>
  </Box>
)

/* ------------------------------------------------------------------ the builder */

function Builder({ id }: { id: string }) {
  const me = useMe()
  const page = usePage(id)
  const { doc, edit } = page

  /*
   * An editor's link forwarded to somebody who is not one.
   *
   * In production Access is in front of `/edit/*` and this rarely fires — but the Worker serves the
   * app shell for any path, so without it a reader who has this page's code would be shown the whole
   * editing interface and discover it was decorative only when a save failed. Sending them to the
   * read-only view is the honest answer: they see the page if they may, and the refusal if they may
   * not.
   */
  useEffect(() => {
    if (me && !me.authed) location.replace(`/p/${id}`)
  }, [me, id])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [width, setWidth] = useState<keyof typeof WIDTHS>('Desktop')
  const [dragging, setDragging] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [panel, setPanel] = useState<View | null>(null)
  /*
   * Bumped when a selection comes *from the code panel*, which is the only case where the canvas
   * should scroll itself. Selecting by clicking the canvas must not move the canvas — the thing was
   * already under the pointer, and jumping it is disorienting.
   */
  const [reveal, setReveal] = useState(0)

  /*
   * Comments. `commenting` is the mode in which a click on the canvas places a comment rather than
   * selecting; it ends after one placement, the way a comment tool does in any design app, so the
   * next click goes back to editing.
   */
  const [commenting, setCommenting] = useState(false)
  const [rail, setRail] = useState<'inspect' | 'comments' | 'versions'>('inspect')
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)

  useEffect(() => {
    if (doc) {
      document.title = `${doc.title} — Page builder`
      noteRecent(doc.id, doc.title)
    }
  }, [doc])

  /*
   * A page that has never been written gets the starting skeleton.
   *
   * `rev === 0` is the whole test, and it is exact: a page someone emptied has a revision history and
   * is left alone. Applied as an ordinary edit, so it saves itself and the first undo takes it back to
   * nothing — which is the right answer for someone who wanted a blank page after all.
   */
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current || !doc || !isNew(doc)) return
    seeded.current = true

    // `/edit/new?template=blog-hub` starts the page as a copy of that built page instead.
    const built = builtPageFor(new URLSearchParams(location.search).get('template'))
    if (location.search) history.replaceState({}, '', location.pathname)

    edit((current) =>
      built
        ? { ...current, title: built.label, template: built.id, ...builtPageContent(built) }
        : { ...current, ...starterContent() },
    )
  }, [doc, edit])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  /* ---------------------------------------------------------------- operations */

  const add = useCallback(
    (component: string, near: string | null) => {
      const entry = entryFor(component)
      if (!doc || !entry) return

      const target = placementFor(doc, component, near ?? selectedId)
      if (!target) return setNotice(refusal(component))

      const { node, extra } = entry.blank()
      edit((current) => insert(current, target, node, extra))
      setSelectedId(node.id)
    },
    [doc, edit, selectedId],
  )

  const onProp = useCallback(
    (nodeId: string, name: string, value: PropValue | undefined) =>
      edit((current) => setProp(current, nodeId, name, value)),
    [edit],
  )

  const onData = useCallback(
    (nodeId: string, data: JsonObject) => edit((current) => setData(current, nodeId, data)),
    [edit],
  )

  const onRemove = useCallback(
    (nodeId: string) => {
      edit((current) => remove(current, nodeId))
      setSelectedId((selected) => (selected === nodeId ? null : selected))
    },
    [edit],
  )

  const onDuplicate = useCallback(
    (nodeId: string) => {
      edit((current) => {
        const result = duplicate(current, nodeId)
        // The copy is what the designer wants to work on next; selecting the original would be a
        // silent no-op from their side of the screen.
        queueMicrotask(() => setSelectedId(result.id))
        return result.doc
      })
    },
    [edit],
  )

  /**
   * Fills a node in from one of its component's stories.
   *
   * The preset is built fresh on each use rather than kept as a shared object, because it carries node
   * ids: applying the same preset to two cards must not give them children with the same ids.
   */
  const onPreset = useCallback(
    (nodeId: string, label: string) => {
      const component = doc?.nodes[nodeId]?.component
      const preset = component ? presetsFor(component).find((entry) => entry.label === label) : undefined
      if (!preset) return

      const { node, extra } = preset.build()
      edit((current) => refill(current, nodeId, node.props, node.slots, extra, label))
    },
    [doc, edit],
  )

  /** Nudges a node within the slot it is already in. */
  const onMoveWithin = useCallback(
    (nodeId: string, by: -1 | 1) =>
      edit((current) => {
        const at = locate(current, nodeId)
        if (!at) return current
        return move(current, nodeId, { ...at, index: (at.index ?? 0) + by })
      }),
    [edit],
  )

  /* ---------------------------------------------------------------- keyboard */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      // Never steal a key from a field or from text being edited on the canvas.
      if (target.closest(TYPING)) return

      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        return event.shiftKey ? page.redo() : page.undo()
      }
      if (meta && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        return page.redo()
      }
      if (event.key === 'Escape') {
        if (commenting || draft) {
          setCommenting(false)
          return setDraft(null)
        }
        return setSelectedId(null)
      }
      if (!meta && event.key.toLowerCase() === 'c' && page.comments) {
        event.preventDefault()
        setCommenting((was) => !was)
        return setRail('comments')
      }
      if ((event.key === 'Backspace' || event.key === 'Delete') && selectedId) {
        event.preventDefault()
        onRemove(selectedId)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [page, selectedId, onRemove, commenting, draft])

  /* ---------------------------------------------------------------- render */

  const openThreads = page.comments
    ? page.comments.comments.filter((comment) => comment.thread === comment.id && comment.resolvedAt === null).length
    : 0

  if (me === null || page.status === 'loading') return <Centered>Loading…</Centered>
  if (page.status === 'denied' || !me.authed) return <NoAccess />
  if (!doc) return <Centered>There is no page at this address.</Centered>

  return (
    <Group align="stretch" gap={0} h="100vh" wrap="nowrap">
      {/* ------------------------------------------------ left rail */}
      <Stack gap={0} w={260} style={{ borderRight: '1px solid var(--mantine-color-dark-4)', flex: 'none' }}>
        <Box style={{ height: '46%', minHeight: 0 }}>
          <Palette
            onAdd={(component) => add(component, null)}
            onDragStart={setDragging}
            onDragEnd={() => setDragging(null)}
          />
        </Box>
        <Divider />
        <Group justify="space-between" px="xs" py={6}>
          <Text size="10px" tt="uppercase" fw={700} c="dimmed">
            Page
          </Text>
          <Text size="10px" c="dimmed">
            {doc.root.length} section{doc.root.length === 1 ? '' : 's'}
          </Text>
        </Group>
        <Layers
          doc={doc}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMoveWithin={onMoveWithin}
          onRemove={onRemove}
        />
      </Stack>

      {/* ------------------------------------------------ the middle */}
      <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
        <Group justify="space-between" p="xs" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <TextInput
              size="xs"
              w={220}
              value={doc.title}
              aria-label="Page title"
              onChange={(event) => {
                const title = event.currentTarget.value
                edit((current) => ({ ...current, title }))
              }}
            />
            <SegmentedControl
              size="xs"
              value={width}
              data={Object.keys(WIDTHS)}
              onChange={(value) => setWidth(value as keyof typeof WIDTHS)}
            />
            {/*
              * The scheme belongs to the **page**, not to the person looking at it: a page built for
              * light has to be light when it is shared. So it is stored in the document and travels
              * with it, rather than being a preference of this browser.
              */}
            <SegmentedControl
              size="xs"
              value={doc.colorScheme}
              data={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
              ]}
              onChange={(value) =>
                edit((current) => ({ ...current, colorScheme: value as 'dark' | 'light' }))
              }
            />
            <ActionIcon.Group>
              <ActionIcon size="md" variant="default" aria-label="Undo" disabled={!page.canUndo} onClick={page.undo}>↶</ActionIcon>
              <ActionIcon size="md" variant="default" aria-label="Redo" disabled={!page.canRedo} onClick={page.redo}>↷</ActionIcon>
            </ActionIcon.Group>
          </Group>

          <Group gap="xs" wrap="nowrap">
            {page.meta ? (
              /* Not an edit: it does not save the page, move the revision, or join the undo stack. */
              <StatusMenu status={page.meta.status} onChange={(status) => void page.setStatus(status)} />
            ) : null}
            <SaveState saving={page.saving} error={page.error} rev={doc.rev} />
            {page.editors > 1 ? (
              <Tooltip label="People with this page open">
                <Badge size="sm" variant="light">
                  {page.editors} editing
                </Badge>
              </Tooltip>
            ) : null}
            <Button
              size="xs"
              variant={panel ? 'light' : 'default'}
              onClick={() => setPanel((open) => (open ? null : 'react'))}
            >
              Code
            </Button>
            {page.comments ? (
              <Tooltip label="Click anywhere on the page to comment there (C)">
                <Button
                  size="xs"
                  variant={commenting ? 'filled' : 'default'}
                  color={commenting ? 'orange' : undefined}
                  onClick={() => {
                    setCommenting((was) => !was)
                    setRail('comments')
                  }}
                >
                  Comment{openThreads ? ` · ${openThreads}` : ''}
                </Button>
              </Tooltip>
            ) : null}
            <Share id={doc.id} onNotice={setNotice} />
          </Group>
        </Group>

        {notice ? (
          <Box px="xs" pb="xs">
            <Text size="xs" c="orange">
              {notice}
            </Text>
          </Box>
        ) : null}

        <Divider />

        <Group align="stretch" gap={0} style={{ flex: 1, minHeight: 0 }} wrap="nowrap">
          <ScrollArea style={{ flex: 1, minWidth: 0, background: 'var(--mantine-color-dark-8)' }}>
            <Box py="xl">
              <Canvas
                doc={doc}
                width={WIDTHS[width]}
                selectedId={selectedId}
                revealToken={reveal}
                onSelect={setSelectedId}
                onText={(nodeId, value) => {
                  const prop = entryFor(doc.nodes[nodeId]?.component)?.textProp
                  if (prop) onProp(nodeId, prop, value)
                }}
                dragging={dragging}
                onDrop={(component, overId) => {
                  add(component, overId)
                  setDragging(null)
                }}
                overlay={
                  page.comments ? (
                    <CommentLayer
                      doc={doc}
                      threads={pinnedThreads(doc, page.comments, activeThread)}
                      activeThread={activeThread}
                      commenting={commenting}
                      draft={draft}
                      onPlace={(placed) => {
                        setDraft(placed)
                        setActiveThread(null)
                        setCommenting(false)
                        setRail('comments')
                      }}
                      onOpen={(thread) => {
                        setActiveThread(thread)
                        setRail('comments')
                      }}
                    />
                  ) : null
                }
              />
            </Box>
          </ScrollArea>

          {panel ? (
            <Box w={460} style={{ flex: 'none', minWidth: 0 }}>
              <CodePanel
                doc={doc}
                view={panel}
                onView={setPanel}
                selectedId={selectedId}
                onPick={(id) => {
                  setSelectedId(id)
                  setReveal((n) => n + 1)
                }}
                onClose={() => setPanel(null)}
              />
            </Box>
          ) : null}
        </Group>
      </Stack>

      {/* ------------------------------------------------ right rail */}
      <Stack gap={0} w={300} style={{ borderLeft: '1px solid var(--mantine-color-dark-4)', flex: 'none' }}>
        <Box p="xs" pb={0}>
          <SegmentedControl
            size="xs"
            fullWidth
            value={rail}
            onChange={(value) => setRail(value as typeof rail)}
            data={[
              { value: 'inspect', label: 'Inspect' },
              ...(page.comments
                ? [{ value: 'comments', label: openThreads ? `Comments ${openThreads}` : 'Comments' }]
                : []),
              { value: 'versions', label: page.versions?.length ? `Versions ${page.versions.length}` : 'Versions' },
            ]}
          />
        </Box>
        {rail === 'versions' ? (
          <ScrollArea style={{ flex: 1, minHeight: 0 }}>
            <VersionsPanel page={page as typeof page & { doc: PageDocument }} />
          </ScrollArea>
        ) : rail === 'comments' && page.comments ? (
          <ScrollArea style={{ flex: 1, minHeight: 0 }}>
            <CommentsPanel
              doc={doc}
              state={page.comments}
              me={me.email}
              actions={page.commentActions}
              activeThread={activeThread}
              onActivate={setActiveThread}
              draft={draft}
              onDraftDone={() => setDraft(null)}
              onReveal={(node) => {
                setSelectedId(node)
                setReveal((n) => n + 1)
              }}
            />
          </ScrollArea>
        ) : (
        <Box style={{ flex: 1, minHeight: 0 }}>
        <Inspector
          doc={doc}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onProp={onProp}
          onData={onData}
          onPreset={onPreset}
          onAdd={(parentId, slot, component) => {
            const entry = entryFor(component)
            if (!entry) return
            const { node, extra } = entry.blank()
            edit((current) => insert(current, { parentId, slot }, node, extra))
            setSelectedId(node.id)
          }}
          onRemove={onRemove}
          onMoveWithin={onMoveWithin}
          onDuplicate={onDuplicate}
        />
        </Box>
        )}
      </Stack>
    </Group>
  )
}

/**
 * The share link, and the ability to take it back.
 *
 * The link is not a property of the page's address — `/p/:id` on its own opens nothing. It is the
 * address plus a code minted here, and **Reset** replaces that code, which is the only way to
 * un-send a link that has already gone out. Worth having in reach rather than buried: a mock shared
 * with the wrong person is the ordinary reason to want it.
 */
function Share({ id, onNotice }: { id: string; onNotice: (message: string) => void }) {
  const [busy, setBusy] = useState(false)

  const mint = async (rotate: boolean): Promise<string | null> => {
    setBusy(true)
    try {
      const response = await fetch(`/api/pages/${id}/share`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rotate }),
      })
      if (!response.ok) throw new Error('Could not make a link')

      const { url } = (await response.json()) as { url: string }
      return url
    } catch (error) {
      onNotice((error as Error).message)
      return null
    } finally {
      setBusy(false)
    }
  }

  /*
   * The clipboard write has to happen in the same gesture as the click, and awaiting the network
   * first loses that in Safari. So the link is written to the clipboard through a promise, which is
   * the form the API accepts for exactly this case; where that is unavailable the URL is put in the
   * notice bar instead, so it is always reachable as text.
   */
  const copy = async (rotate: boolean) => {
    const url = await mint(rotate)
    if (!url) return

    try {
      await navigator.clipboard.writeText(url)
      onNotice(rotate ? 'New link copied. The old one no longer works.' : 'Share link copied.')
    } catch {
      onNotice(url)
    }
  }

  return (
    <Menu position="bottom-end" withinPortal shadow="md">
      <Menu.Target>
        <Button size="xs" variant="light" loading={busy}>
          Share
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => copy(false)}>
          <Text size="xs" fw={600}>
            Copy share link
          </Text>
          <Text size="10px" c="dimmed">
            Anyone with it can read this page
          </Text>
        </Menu.Item>
        <Menu.Item color="orange" onClick={() => copy(true)}>
          <Text size="xs" fw={600}>
            Reset the link
          </Text>
          <Text size="10px" c="dimmed">
            Copies a new one and stops the old one working
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

/** Saved / saving / failed, and the revision — which is what makes "it saved" checkable. */
function SaveState({ saving, error, rev }: { saving: boolean; error: string | null; rev: number }) {
  if (error) {
    return (
      <Tooltip label={error}>
        <Text size="xs" c="red">
          Not saved
        </Text>
      </Tooltip>
    )
  }
  return (
    <Text size="xs" c="dimmed">
      {saving ? 'Saving…' : `Saved · v${rev}`}
    </Text>
  )
}
