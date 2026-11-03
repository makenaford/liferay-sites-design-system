/**
 * Who a page's conversation is shared with, and @mentioning them.
 *
 * - **`MentionTextarea`** — a comment box that offers the page's members as soon as `@` is typed,
 *   and inserts the handle someone would have typed by hand. Nothing is attached to the comment but
 *   its text: the Worker works out who is mentioned (see `comments.ts`), so a hand-typed mention
 *   counts exactly as much as a picked one.
 * - **`CommentText`** — a comment's words with its mentions picked out, yours more strongly.
 * - **`PeopleBar`** — who the page is shared with, and adding or removing someone by email.
 */
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  UnstyledButton,
  type TextareaProps,
} from '@mantine/core'
import {
  MENTION,
  cleanEmail,
  handle,
  memberFor,
  mentionText,
  type CommentsState,
  type PageMember,
} from './comments'
import type { CommentActions } from './usePage'

/* ------------------------------------------------------------------ the comment box */

/** `@` and what has been typed after it, when the caret is at the end of a mention being written. */
const PENDING = /(^|[^\w.@])@([\w.+@-]*)$/

const MAX_SUGGESTIONS = 6

export interface MentionTextareaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  members: PageMember[]
  /** The signed-in person, left out of the suggestions. Not `me`, which is Mantine's margin prop. */
  self: string | null
}

export const MentionTextarea = forwardRef<HTMLTextAreaElement, MentionTextareaProps>(function MentionTextarea(
  { value, onChange, members, self, onKeyDown, ...props },
  forwarded,
) {
  const own = useRef<HTMLTextAreaElement | null>(null)
  const [query, setQuery] = useState<{ text: string; start: number } | null>(null)
  const [index, setIndex] = useState(0)

  const options = useMemo(() => {
    if (!query) return []
    const text = query.text.toLowerCase()
    return members
      .filter((member) => member.email !== self)
      .filter((member) => member.email.startsWith(text) || handle(member.email).toLowerCase().includes(text))
      // Whoever's name starts with what was typed comes first; a match in the middle is a fallback.
      .sort((a, b) => Number(!a.email.startsWith(text)) - Number(!b.email.startsWith(text)))
      .slice(0, MAX_SUGGESTIONS)
  }, [query, members, self])

  useEffect(() => setIndex(0), [query?.text])

  /** Reads what is being typed at the caret, after every change and every caret move. */
  const track = (field: HTMLTextAreaElement) => {
    const before = field.value.slice(0, field.selectionStart ?? field.value.length)
    const match = PENDING.exec(before)
    setQuery(match ? { text: match[2], start: before.length - match[2].length - 1 } : null)
  }

  const pick = (member: PageMember) => {
    const field = own.current
    if (!field || !query) return
    const end = field.selectionStart ?? value.length
    const inserted = `@${mentionText(member.email, members)} `
    const next = value.slice(0, query.start) + inserted + value.slice(end)
    onChange(next)
    setQuery(null)
    const caret = query.start + inserted.length
    requestAnimationFrame(() => {
      field.focus()
      field.setSelectionRange(caret, caret)
    })
  }

  return (
    <Box pos="relative">
      <Textarea
        {...props}
        ref={(node) => {
          own.current = node
          if (typeof forwarded === 'function') forwarded(node)
          else if (forwarded) forwarded.current = node
        }}
        value={value}
        onChange={(event) => {
          onChange(event.currentTarget.value)
          track(event.currentTarget)
        }}
        onSelect={(event) => track(event.currentTarget)}
        onBlur={() => setTimeout(() => setQuery(null), 120)}
        onKeyDown={(event) => {
          if (options.length) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              const step = event.key === 'ArrowDown' ? 1 : -1
              return setIndex((was) => (was + step + options.length) % options.length)
            }
            if ((event.key === 'Enter' && !event.metaKey && !event.ctrlKey) || event.key === 'Tab') {
              event.preventDefault()
              return pick(options[index])
            }
            if (event.key === 'Escape') {
              // The list closes; the builder does not also take Escape as "stop commenting".
              event.preventDefault()
              event.stopPropagation()
              return setQuery(null)
            }
          }
          onKeyDown?.(event)
        }}
      />
      {query && options.length ? (
        <Paper
          shadow="md"
          withBorder
          p={4}
          pos="absolute"
          left={0}
          right={0}
          top="100%"
          mt={4}
          style={{ zIndex: 20 }}
          role="listbox"
          aria-label="Mention someone"
        >
          {options.map((member, i) => (
            <UnstyledButton
              key={member.email}
              role="option"
              aria-selected={i === index}
              display="block"
              w="100%"
              px={6}
              py={4}
              style={{ borderRadius: 4, background: i === index ? 'var(--mantine-color-dark-5)' : undefined }}
              onMouseDown={(event) => {
                event.preventDefault()
                pick(member)
              }}
              onMouseEnter={() => setIndex(i)}
            >
              <Text size="xs" fw={600} truncate>
                {handle(member.email)}
              </Text>
              <Text size="10px" c="dimmed" truncate>
                {member.email}
              </Text>
            </UnstyledButton>
          ))}
        </Paper>
      ) : null}
    </Box>
  )
})

/* ------------------------------------------------------------------ a comment's words */

export function CommentText({ body, members, me }: { body: string; members: PageMember[]; me: string | null }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of body.matchAll(MENTION)) {
    const email = memberFor(match[2], members)
    if (!email) continue
    // `match[1]` is the character before the `@`, which belongs to the text, not the mention.
    const start = match.index + match[1].length
    const written = `@${match[2].replace(/\.+$/, '')}`
    parts.push(body.slice(last, start))
    parts.push(
      <Tooltip key={start} label={email}>
        <Text
          span
          inherit
          fw={600}
          c={email === me ? 'orange.3' : 'blue.3'}
          bg={email === me ? 'rgba(255, 146, 43, 0.14)' : undefined}
          style={{ borderRadius: 3, padding: email === me ? '0 2px' : undefined }}
        >
          {written}
        </Text>
      </Tooltip>,
    )
    last = start + written.length
  }
  parts.push(body.slice(last))

  return (
    <Text size="xs" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
      {parts}
    </Text>
  )
}

/* ------------------------------------------------------------------ who it is shared with */

export function PeopleBar({ state, me, actions }: { state: CommentsState; me: string | null; actions: CommentActions }) {
  const [adding, setAdding] = useState(false)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const valid = cleanEmail(email)
  const { members } = state

  const add = async () => {
    if (!valid || busy) return
    setBusy(true)
    const ok = await actions.share(valid)
    setBusy(false)
    if (ok) {
      setEmail('')
      setAdding(false)
    }
  }

  return (
    <Box p="xs" style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 6 }}>
      <Group justify="space-between" gap={4} mb={members.length || adding ? 6 : 0}>
        <Text size="10px" tt="uppercase" fw={700} c="dimmed">
          {members.length ? `Shared with ${members.length}` : 'Open to everyone signed in'}
        </Text>
        {!adding ? (
          <Button size="compact-xs" variant="subtle" onClick={() => setAdding(true)}>
            + Add people
          </Button>
        ) : null}
      </Group>

      {members.length ? (
        <Group gap={4}>
          {members.map((member) => (
            <Tooltip
              key={member.email}
              label={member.owner ? `${member.email} · made this page` : `${member.email}${member.addedBy ? ` · added by ${handle(member.addedBy)}` : ''}`}
            >
              <Badge
                size="sm"
                variant={member.email === me ? 'filled' : 'light'}
                color={member.owner ? 'orange' : 'gray'}
                tt="none"
                rightSection={
                  member.owner ? null : (
                    <ActionIcon
                      size={14}
                      variant="transparent"
                      color="gray"
                      aria-label={member.email === me ? 'Leave this page' : `Remove ${member.email}`}
                      onClick={() => {
                        const leaving = member.email === me
                        if (leaving && !confirm('Leave this page? You will no longer see its comments.')) return
                        void actions.unshare(member.email)
                      }}
                    >
                      ×
                    </ActionIcon>
                  )
                }
              >
                {handle(member.email)}
              </Badge>
            </Tooltip>
          ))}
        </Group>
      ) : null}

      {adding ? (
        <Stack gap={4} mt={6}>
          <TextInput
            size="xs"
            autoFocus
            type="email"
            placeholder="name@liferay.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void add()
              }
              if (event.key === 'Escape') {
                event.stopPropagation()
                setAdding(false)
              }
            }}
          />
          <Text size="10px" c="dimmed">
            {members.length
              ? 'They can see these comments, reply and be @mentioned, and get an email with a link.'
              : 'Sharing makes these comments visible only to you, the page’s maker and the people you add. Each gets an email with a link.'}
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button size="compact-xs" variant="subtle" color="gray" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button size="compact-xs" onClick={() => void add()} loading={busy} disabled={!valid}>
              Share
            </Button>
          </Group>
        </Stack>
      ) : null}
    </Box>
  )
}

/* ------------------------------------------------------------------ unread mentions */

/**
 * When this browser last looked at the page's mentions. Kept locally: "unread" is a convenience for
 * the person at this screen, not a record anybody else needs.
 */
const seenKey = (page: string) => `sds-builder-mentions-seen:${page}`

export function mentionsSeenAt(page: string): number {
  try {
    return Number(localStorage.getItem(seenKey(page))) || 0
  } catch {
    return 0
  }
}

export function markMentionsSeen(page: string): void {
  try {
    localStorage.setItem(seenKey(page), String(Date.now()))
  } catch {
    // Private window or blocked storage: the badge just stays.
  }
}

/** Comments that mention `me`, by somebody else. */
export const mentioning = (state: CommentsState, me: string | null) =>
  me ? state.comments.filter((comment) => comment.mentions.includes(me) && comment.author !== me) : []
