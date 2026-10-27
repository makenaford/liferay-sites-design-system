/**
 * The page library: what the Worker and the builder agree a page's listing looks like.
 *
 * ## Why there is a library at all
 *
 * Until this, a page was reachable only by knowing its name — the home screen listed the pages *this
 * browser* had opened, and a page whose link was lost was gone. That is fine for a scratchpad and
 * wrong for the thing that replaces Figma, where the point is that the team can find each other's work.
 *
 * So every page reports itself to one `PageLibrary` Durable Object (`worker/PageLibrary.ts`), which
 * keeps a row per page and pushes changes to every open home screen over a WebSocket. The page's own
 * object stays the truth for its content; the library is an index of it, rebuilt from the pages.
 *
 * ## Why status is not part of the document
 *
 * A page's status — draft, in review, approved — is a fact *about* the page, not part of what it
 * draws. Kept in the document, restoring yesterday's revision would quietly un-approve it, and every
 * status change would show up in the history as an edit. So it lives beside the document in the page's
 * object, with who set it and when.
 */

export const PAGE_STATUSES = ['draft', 'in-review', 'approved', 'handed-off', 'archived'] as const

export type PageStatus = (typeof PAGE_STATUSES)[number]

export const STATUS_LABEL: Record<PageStatus, string> = {
  draft: 'Draft',
  'in-review': 'In review',
  approved: 'Approved',
  'handed-off': 'Handed off',
  archived: 'Archived',
}

/** Mantine colour names, so a status reads the same in the library and in the builder's toolbar. */
export const STATUS_COLOR: Record<PageStatus, string> = {
  draft: 'gray',
  'in-review': 'yellow',
  approved: 'green',
  'handed-off': 'blue',
  archived: 'dark',
}

export const isPageStatus = (value: unknown): value is PageStatus =>
  typeof value === 'string' && (PAGE_STATUSES as readonly string[]).includes(value)

/** What a page's object knows about the page beyond its content. */
export interface PageMeta {
  status: PageStatus
  /** Who set the status, and when. `null` for a page nobody has moved off draft. */
  statusBy: string | null
  statusAt: number | null
  /** The first person to save the page — its owner, as far as the library is concerned. */
  createdBy: string | null
  createdAt: number | null
  /** The last person to save it. */
  updatedBy: string | null
}

/** One row in the library. */
export interface LibraryEntry extends PageMeta {
  id: string
  title: string
  /** The built page it was started from, when it was — a `BUILT_PAGES` id. */
  template: string | null
  colorScheme: 'dark' | 'light'
  rev: number
  updatedAt: number
  /** How many top-level blocks, as a rough sense of how far along it is. */
  sections: number
  /** Unresolved comment threads — where a page needs attention. */
  openComments: number
  /**
   * When the library last heard about this page. The builder merges a fetched list with pushed
   * updates by this, so a push that raced the fetch is neither lost nor overwritten by older data.
   */
  indexedAt: number
}

/** What the library socket sends. */
export type LibraryMessage = { type: 'upsert'; entry: LibraryEntry } | { type: 'removed'; id: string }
