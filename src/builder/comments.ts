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
 * ## Internal only
 *
 * Comments are for people signed in through Access. A share code opens the page; it does not open the
 * conversation about it.
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
}

/** Everything the page's object knows, and a version to tell a stale copy from a fresh one. */
export interface CommentsState {
  /** The time of the last change. A client keeps whichever copy has the larger one. */
  version: number
  comments: PageComment[]
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
