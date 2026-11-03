/**
 * Comments on a page: what the Worker stores and the builder draws.
 *
 * ## Anchored to nodes, not to pixels
 *
 * A comment is pinned to a **node id** plus a point inside that node, as fractions of its width and
 * height. Node ids are stable — reordering sections, editing copy and changing a variant all leave them
 * alone (see `document.ts`) — so a comment on the third card stays on the third card when the cards are
 * shuffled, and stays at the same spot on it when the preview goes from desktop to mobile. A pixel
 * position on the page would be wrong after the first edit.
 *
 * Each comment also records the revision it was made against, so "this was said about rev 12" survives
 * the page moving on. When the node is deleted the thread is not: it is listed as **detached**, with
 * what it said, because the conversation about a removed section is often the reason it was removed.
 *
 * ## Internal only, and only the people the page is shared with
 *
 * Comments are for people signed in through Access. A share code opens the page; it does not open the
 * conversation about it.
 *
 * Within the team, a page starts out with its conversation open to everyone signed in. **Sharing** it
 * with colleagues by email narrows that to its **members**: whoever made the page, the people added,
 * and whoever added the first of them. Being added is what lets someone see the threads, reply, and be
 * @mentioned — and it emails them a link. Editing the page itself is unchanged: that is still anyone
 * signed in.
 *
 * ## Mentions
 *
 * `@makena.ford` (or the whole address, when two members share a handle) names a member. The Worker
 * works out who a comment mentions from its text, against the member list, rather than taking a list
 * from the client — so a mention cannot reach someone the page was never shared with, and each one
 * sends that person an email with a link to the thread.
 */

export interface PagePoint {
  /** 0–1 across the node. */
  x: number
  /** 0–1 down the node. */
  y: number
}

export interface PageComment {
  id: string
  /** The thread's first comment. A thread's root has `thread === id`. */
  thread: string
  /** The node the thread is pinned to; `null` for a comment on the page as a whole. Roots only. */
  node: string | null
  point: PagePoint | null
  /** The page revision the comment was written against. */
  rev: number
  body: string
  author: string
  at: number
  editedAt: number | null
  /** Resolution belongs to the thread, so only a root carries it. */
  resolvedAt: number | null
  resolvedBy: string | null
  /** The members this comment @mentions, by email. Worked out by the Worker from `body`. */
  mentions: string[]
}

/** Someone a page is shared with. */
export interface PageMember {
  email: string
  /** The person who made the page. Always a member, and cannot be removed. */
  owner: boolean
  addedBy: string | null
  addedAt: number | null
}

/** Everything the page's object knows, and a version to tell a stale copy from a fresh one. */
export interface CommentsState {
  /** The time of the last change. A client keeps whichever copy has the larger one. */
  version: number
  comments: PageComment[]
  /** Who the conversation belongs to. Empty for a page nobody has shared yet — open to the team. */
  members: PageMember[]
}

export interface Thread {
  root: PageComment
  replies: PageComment[]
}

export const COMMENT_LIMIT = 4000

/** Groups a flat list into threads, oldest first, replies in order under each. */
export function threadsOf(comments: PageComment[]): Thread[] {
  const roots = comments.filter((comment) => comment.thread === comment.id).sort((a, b) => a.at - b.at)
  return roots.map((root) => ({
    root,
    replies: comments.filter((c) => c.thread === root.id && c.id !== root.id).sort((a, b) => a.at - b.at),
  }))
}

/** `makena.ford@liferay.com` reads as `makena.ford`. */
export const handle = (email: string | null | undefined) => (email ? email.split('@')[0] : 'someone')

export const MEMBER_LIMIT = 100

/** A plausible address, lower-cased — or `null`. Access decides who can actually sign in. */
export function cleanEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

/**
 * `@handle` or `@whole.address@domain`. The character before the `@` must not be part of a word, so
 * an address written out in a comment is not read as a mention of its domain.
 */
export const MENTION = /(^|[^\w.@])@([\w.+-]+(?:@[\w-]+(?:\.[\w-]+)+)?)/g

/**
 * The member a written mention names: a whole address, or a handle exactly one member has. A handle
 * two members share names neither — the person writing has to use the address.
 */
export function memberFor(written: string, members: PageMember[]): string | null {
  const token = written.toLowerCase().replace(/\.+$/, '')
  if (token.includes('@')) return members.some((m) => m.email === token) ? token : null
  const matches = members.filter((m) => handle(m.email).toLowerCase() === token)
  return matches.length === 1 ? matches[0].email : null
}

/** Everyone `body` mentions, once each, in the order they appear. */
export function mentionsIn(body: string, members: PageMember[]): string[] {
  const found: string[] = []
  for (const match of body.matchAll(MENTION)) {
    const email = memberFor(match[2], members)
    if (email && !found.includes(email)) found.push(email)
  }
  return found
}

/** What to type to mention `email`: the handle, or the address when another member shares the handle. */
export function mentionText(email: string, members: PageMember[]): string {
  const own = handle(email)
  return members.filter((m) => handle(m.email) === own).length > 1 ? email : own
}
