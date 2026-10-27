/**
 * The conversation about a page, beside it.
 *
 * Three groups, in the order someone reviewing wants them: **open** threads, numbered to match their
 * pins; **detached** ones, whose component has since been deleted — kept, because the conversation
 * about a removed section is often why it was removed; and **resolved**, folded away.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { ActionIcon, Box, Button, Divider, Group, Menu, Stack, Text, Textarea, Tooltip, UnstyledButton } from '@mantine/core'
import type { PageDocument } from './document'
import { handle, threadsOf, type CommentsState, type PageComment, type Thread } from './comments'
import type { CommentActions } from './usePage'
import type { Draft } from './CommentLayer'
import { summarise } from './Inspector'
import { ago } from './LibraryScreen'

export interface CommentsPanelProps {
  doc: PageDocument
  state: CommentsState
  me: string | null
  actions: CommentActions
  activeThread: string | null
  onActivate: (thread: string | null) => void
  /** A new comment being written, placed by a click on the page. */
  draft: Draft | null
  onDraftDone: () => void
  /** Brings a thread's component into view. */
  onReveal?: (node: string) => void
}

/** The threads that get pins, in pin-number order: open ones on a component that still exists. */
export function pinnedThreads(doc: PageDocument, state: CommentsState | null, activeThread?: string | null): Thread[] {
  if (!state) return []
  return threadsOf(state.comments).filter(
    ({ root }) => root.node && doc.nodes[root.node] && (root.resolvedAt === null || root.id === activeThread),
  )
}

const anchorLabel = (doc: PageDocument, node: string | null) => {
  if (!node) return 'The whole page'
  const found = doc.nodes[node]
  return found ? summarise(found.component, found.props, found.data) : 'A deleted component'
}

/** Cmd/Ctrl+Enter sends — the reflex from every other comment box. */
const submitOnShortcut = (send: () => void) => (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    send()
  }
}

export function CommentsPanel({ doc, state, me, actions, activeThread, onActivate, draft, onDraftDone, onReveal }: CommentsPanelProps) {
  const [showResolved, setShowResolved] = useState(false)
  const threads = useMemo(() => threadsOf(state.comments), [state])
  // The same list the pins are drawn from, so a thread's number here matches its pin on the page.
  const pinned = useMemo(() => pinnedThreads(doc, state, activeThread), [doc, state, activeThread])

  const open = threads.filter(({ root }) => root.resolvedAt === null && (!root.node || doc.nodes[root.node]))
  const detached = threads.filter(({ root }) => root.node && !doc.nodes[root.node])
  const resolved = threads.filter(({ root }) => root.resolvedAt !== null && (!root.node || doc.nodes[root.node]))

  const number = (thread: string) => {
    const index = pinned.findIndex(({ root }) => root.id === thread)
    return index === -1 ? null : index + 1
  }

  const card = (thread: Thread) => (
    <ThreadCard
      key={thread.root.id}
      doc={doc}
      thread={thread}
      number={number(thread.root.id)}
      me={me}
      actions={actions}
      active={thread.root.id === activeThread}
      onActivate={() => {
        onActivate(thread.root.id)
        if (thread.root.node && doc.nodes[thread.root.node]) onReveal?.(thread.root.node)
      }}
    />
  )

  return (
    <Stack gap="sm" p="sm">
      {draft ? <Composer doc={doc} draft={draft} actions={actions} onDone={onDraftDone} /> : null}

      {open.length ? (
        open.map(card)
      ) : !draft ? (
        <Text size="xs" c="dimmed">
          No open comments. Press <b>C</b> or use <b>Comment</b>, then click anywhere on the page to start
          one.
        </Text>
      ) : null}

      {detached.length ? (
        <>
          <Divider label={<Text size="10px" tt="uppercase" fw={700} c="dimmed">On deleted components</Text>} />
          {detached.map(card)}
        </>
      ) : null}

      {resolved.length ? (
        <>
          <Divider
            label={
              <UnstyledButton onClick={() => setShowResolved((was) => !was)}>
                <Text size="10px" tt="uppercase" fw={700} c="dimmed">
                  {showResolved ? '▾' : '▸'} Resolved {resolved.length}
                </Text>
              </UnstyledButton>
            }
          />
          {showResolved ? resolved.map(card) : null}
        </>
      ) : null}
    </Stack>
  )
}

/* ------------------------------------------------------------------ writing a new thread */

function Composer({ doc, draft, actions, onDone }: { doc: PageDocument; draft: Draft; actions: CommentActions; onDone: () => void }) {
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const field = useRef<HTMLTextAreaElement>(null)

  // A new placement is a new comment: focus it, wherever the panel was scrolled to.
  useEffect(() => {
    field.current?.focus()
  }, [draft])

  const send = async () => {
    if (!body.trim() || busy) return
    setBusy(true)
    const ok = await actions.add({ node: draft.node, point: draft.point, body })
    setBusy(false)
    if (ok) {
      setBody('')
      onDone()
    }
  }

  return (
    <Box p="xs" style={{ border: '1px solid var(--mantine-color-orange-6)', borderRadius: 6 }}>
      <Text size="10px" c="dimmed" mb={4}>
        New comment on <b>{anchorLabel(doc, draft.node)}</b>
      </Text>
      <Textarea
        ref={field}
        size="xs"
        autosize
        minRows={2}
        placeholder="What should change?"
        value={body}
        onChange={(event) => setBody(event.currentTarget.value)}
        onKeyDown={submitOnShortcut(() => void send())}
      />
      <Group justify="flex-end" gap="xs" mt={6}>
        <Button size="compact-xs" variant="subtle" color="gray" onClick={onDone}>
          Cancel
        </Button>
        <Button size="compact-xs" onClick={() => void send()} loading={busy} disabled={!body.trim()}>
          Comment
        </Button>
      </Group>
    </Box>
  )
}

/* ------------------------------------------------------------------ one thread */

function ThreadCard({
  doc,
  thread,
  number,
  me,
  actions,
  active,
  onActivate,
}: {
  doc: PageDocument
  thread: Thread
  number: number | null
  me: string | null
  actions: CommentActions
  active: boolean
  onActivate: () => void
}) {
  const { root, replies } = thread
  const [reply, setReply] = useState('')
  const resolved = root.resolvedAt !== null

  const send = async () => {
    if (!reply.trim()) return
    if (await actions.add({ thread: root.id, body: reply })) setReply('')
  }

  return (
    <Box
      p="xs"
      style={{
        border: `1px solid var(--mantine-color-${active ? 'orange-6' : 'dark-4'})`,
        borderRadius: 6,
        opacity: resolved && !active ? 0.75 : 1,
      }}
    >
      <Group justify="space-between" wrap="nowrap" gap={4} mb={4}>
        <UnstyledButton onClick={onActivate} style={{ minWidth: 0 }}>
          <Text size="10px" c="dimmed" truncate>
            {number ? <b>#{number} · </b> : null}
            {anchorLabel(doc, root.node)}
          </Text>
        </UnstyledButton>
        <Tooltip label={resolved ? `Resolved by ${handle(root.resolvedBy)} ${ago(root.resolvedAt)} — reopen` : 'Resolve'}>
          <ActionIcon
            size="sm"
            variant={resolved ? 'light' : 'subtle'}
            color={resolved ? 'green' : 'gray'}
            aria-label={resolved ? 'Reopen thread' : 'Resolve thread'}
            onClick={() => void actions.resolve(root.id, !resolved)}
          >
            ✓
          </ActionIcon>
        </Tooltip>
      </Group>

      <Stack gap={8} onClick={active ? undefined : onActivate} style={{ cursor: active ? undefined : 'pointer' }}>
        <CommentView comment={root} doc={doc} me={me} actions={actions} />
        {replies.map((comment) => (
          <CommentView key={comment.id} comment={comment} doc={doc} me={me} actions={actions} />
        ))}
      </Stack>

      {active ? (
        <Box mt={8}>
          <Textarea
            size="xs"
            autosize
            minRows={1}
            placeholder={resolved ? 'Reply to reopen…' : 'Reply…'}
            value={reply}
            onChange={(event) => setReply(event.currentTarget.value)}
            onKeyDown={submitOnShortcut(() => void send())}
          />
          {reply.trim() ? (
            <Group justify="flex-end" mt={4}>
              <Button size="compact-xs" onClick={() => void send()}>
                Reply
              </Button>
            </Group>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}

function CommentView({ comment, doc, me, actions }: { comment: PageComment; doc: PageDocument; me: string | null; actions: CommentActions }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const mine = me !== null && comment.author === me

  const save = async () => {
    if (await actions.edit(comment.id, draft)) setEditing(false)
  }

  return (
    <Box>
      <Group justify="space-between" gap={4} wrap="nowrap">
        <Tooltip label={comment.author}>
          <Text size="xs" fw={600} truncate>
            {handle(comment.author)}
            <Text span size="10px" c="dimmed" fw={400}>
              {' '}
              {ago(comment.at)}
              {comment.editedAt ? ' · edited' : ''}
              {comment.rev < doc.rev && comment.thread === comment.id ? ` · on rev ${comment.rev}` : ''}
            </Text>
          </Text>
        </Tooltip>
        {mine && !editing ? (
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon size="xs" variant="subtle" color="gray" aria-label="Comment options" onClick={(event) => event.stopPropagation()}>
                ⋯
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item fz="xs" onClick={() => setEditing(true)}>
                Edit
              </Menu.Item>
              <Menu.Item fz="xs" color="red" onClick={() => void actions.remove(comment.id)}>
                {comment.thread === comment.id ? 'Delete thread' : 'Delete'}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : null}
      </Group>
      {editing ? (
        <Box mt={4}>
          <Textarea size="xs" autosize value={draft} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={submitOnShortcut(() => void save())} />
          <Group justify="flex-end" gap="xs" mt={4}>
            <Button size="compact-xs" variant="subtle" color="gray" onClick={() => { setEditing(false); setDraft(comment.body) }}>
              Cancel
            </Button>
            <Button size="compact-xs" onClick={() => void save()}>
              Save
            </Button>
          </Group>
        </Box>
      ) : (
        <Text size="xs" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {comment.body}
        </Text>
      )}
    </Box>
  )
}
