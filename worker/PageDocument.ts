/**
 * One Durable Object per page.
 *
 * ## Why a Durable Object and not a database row
 *
 * A page being built is a *session*, not a record. Two things follow from that, and both are things a
 * row in a shared database is bad at:
 *
 * - **Every write must be ordered against every other write to the same page, and against nothing
 *   else.** A Durable Object is single-threaded per instance, so "read the current revision, check it,
 *   write the new one" needs no transaction and no lock — there is only ever one of it running.
 * - **The people editing want to see each other.** The object that owns the state is also the object
 *   holding the WebSockets, so a broadcast is a method call rather than a pub/sub topic.
 *
 * The instance is addressed by the page's name, so the URL a designer shares *is* the routing key.
 *
 * ## Why history is kept
 *
 * A builder with no undo across sessions is a builder people are afraid to use. Each accepted write
 * appends the whole document to `revisions`, which is cheap — a page is a few kilobytes of JSON — and
 * turns "I broke it yesterday" into a recoverable situation. The table is trimmed to a bounded number
 * of entries so a long editing session cannot grow without limit.
 */
import { DurableObject } from 'cloudflare:workers'
import { documentProblems, emptyDocument, migrate, type PageDocument as Page } from '../src/builder/document'
import type { AccessConfig } from './access'
import { isPageStatus, type LibraryEntry, type PageMeta, type PageStatus } from '../src/builder/library'
import type { PageLibrary } from './PageLibrary'
import { COMMENT_LIMIT, type CommentsState, type PageComment, type PagePoint } from '../src/builder/comments'

/** How many past versions to keep. Roughly a working day of edits at the rate a person makes them. */
const HISTORY = 200

export interface Env extends AccessConfig {
  PAGES: DurableObjectNamespace<PageDocument>
  /** The index of every page. One instance, named `library` — see `PageLibrary.ts`. */
  LIBRARY: DurableObjectNamespace<PageLibrary>
  /** The built builder — the Worker's own files, not anything a designer uploaded. */
  ASSETS: Fetcher
  /** Uploaded images. Named for what a designer does, to keep it apart from `ASSETS`. */
  UPLOADS: R2Bucket
}

/** What a client is told after a write, and what a broadcast carries. */
export interface Snapshot {
  doc: Page
  /** Status and authorship, which live beside the document rather than in it — see `library.ts`. */
  meta: PageMeta
  /** The number of editors currently connected, including the one being answered. */
  editors: number
}

/**
 * `sql.exec` requires its row type to be indexable, because a query can return any columns. These
 * name the columns each query actually selects while satisfying that constraint.
 */
type Row<T> = T & Record<string, SqlStorageValue>

type PageRow = Row<{ json: string }>
type RevisionRow = Row<{ rev: number; at: number; json: string }>
type ShareRow = Row<{ code: string }>
type MetaRow = Row<{
  status: string
  status_by: string | null
  status_at: number | null
  created_by: string | null
  created_at: number | null
  updated_by: string | null
  indexed: number
}>

type CommentRow = Row<{
  id: string
  thread: string
  node: string | null
  x: number | null
  y: number | null
  rev: number
  body: string
  author: string
  at: number
  edited_at: number | null
  resolved_at: number | null
  resolved_by: string | null
}>

const toComment = (row: CommentRow): PageComment => ({
  id: row.id,
  thread: row.thread,
  node: row.node,
  point: row.x === null || row.y === null ? null : { x: row.x, y: row.y },
  rev: row.rev,
  body: row.body,
  author: row.author,
  at: row.at,
  editedAt: row.edited_at,
  resolvedAt: row.resolved_at,
  resolvedBy: row.resolved_by,
})

/** A comment's body, trimmed and bounded, or an error a person can act on. */
function cleanBody(body: unknown): string {
  if (typeof body !== 'string' || !body.trim()) throw new Error('A comment needs some words')
  if (body.length > COMMENT_LIMIT) throw new Error(`Comments are limited to ${COMMENT_LIMIT} characters`)
  return body.trim()
}

const fraction = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1

/**
 * How long after a save the page tells the library about it.
 *
 * Saves arrive every few hundred milliseconds while someone types. The library wants to know the page
 * changed, not every keystroke of how, so a burst of saves becomes one report: the first save sets an
 * alarm and the ones after it find it already set.
 */
const INDEX_AFTER = 2_000

/** The library's single instance. */
export const LIBRARY_NAME = 'library'

/**
 * A share code.
 *
 * 20 characters of base32 from the platform's own CSPRNG — around 100 bits, which is far past
 * anything guessable, and no more than a URL can carry comfortably. The alphabet leaves out the
 * characters people confuse when a link is read aloud or retyped: no `0`/`O`, no `1`/`l`/`I`.
 */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'

function newCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('')
}

/**
 * Compares two codes in time that does not depend on how much of them matches.
 *
 * `a === b` on a secret leaks its prefix: a comparison that stops at the first wrong character takes
 * measurably longer for a guess that gets the first ten right. The margin is tiny and the attack is
 * impractical over the public internet, but the correct version is four lines.
 */
function sameCode(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let difference = 0
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return difference === 0
}

export class PageDocument extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)

    /*
     * Schema setup is the one thing that legitimately blocks: it has to finish before any request is
     * served, and it runs once per instance rather than once per request.
     */
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS page (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          json TEXT NOT NULL
        )
      `)
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS revisions (
          rev INTEGER PRIMARY KEY,
          at INTEGER NOT NULL,
          json TEXT NOT NULL
        )
      `)
      /*
       * The page's share code. One row, because there is one current code: rotating replaces it, and
       * replacing it is what revokes every link already handed out. Keeping a history of codes would
       * mean a link could not be taken back, which is the only thing rotation is for.
       */
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS share (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          code TEXT NOT NULL,
          at INTEGER NOT NULL
        )
      `)
      /*
       * Status and authorship. One row, beside the document rather than in it, so restoring an old
       * revision cannot un-approve a page and a status change is not an edit in the history.
       * `indexed` says whether the library has ever heard of this page — pages made before the
       * library existed report in the first time they are opened.
       */
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS meta (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          status TEXT NOT NULL DEFAULT 'draft',
          status_by TEXT,
          status_at INTEGER,
          created_by TEXT,
          created_at INTEGER,
          updated_by TEXT,
          indexed INTEGER NOT NULL DEFAULT 0
        )
      `)
      ctx.storage.sql.exec('INSERT OR IGNORE INTO meta (id) VALUES (1)')
      /*
       * Comments. In the page's own object rather than somewhere shared, for the same reason as the
       * document: every change to a page's conversation is ordered against every other one, and the
       * object already holds the sockets of everyone looking at the page. A deleted comment is removed
       * outright; the conversation's version lives in storage beside the table (`commentsVersion`), so a
       * delete still moves it forward.
       */
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS comments (
          id TEXT PRIMARY KEY,
          thread TEXT NOT NULL,
          node TEXT,
          x REAL,
          y REAL,
          rev INTEGER NOT NULL,
          body TEXT NOT NULL,
          author TEXT NOT NULL,
          at INTEGER NOT NULL,
          edited_at INTEGER,
          resolved_at INTEGER,
          resolved_by TEXT
        )
      `)
    })
  }

  /* ---------------------------------------------------------------- reading */

  /**
   * The page's own name — the key it was addressed by, and the id every stored copy is stamped with.
   *
   * Taken from the object rather than from the request. The Worker knows the name because it routed
   * on it, and could pass it in; a WebSocket message could pass one too, and that is the problem —
   * a client that sent someone else's name would have its edits written into *this* object under
   * *that* id. There is exactly one page an instance of this class can be, so it answers the
   * question itself and no caller gets a say.
   */
  private get name(): string {
    return this.ctx.id.name ?? ''
  }

  /** The page as stored, or a fresh empty one. */
  load(): Page {
    const row = this.ctx.storage.sql.exec<PageRow>('SELECT json FROM page WHERE id = 1').toArray()[0]
    if (!row) return emptyDocument(this.name)

    const doc = JSON.parse(row.json) as Page
    /*
     * The id travels with the document but the object's name is the truth, so a page that was copied
     * from another one cannot lie about which page it is.
     *
     * `migrate` is here rather than in a script over every page because there is no list of pages to
     * run a script over — each one is its own object, reachable only by name. Reading is the moment a
     * page is in memory and the moment its staleness would show, so it is the moment to fix it. The
     * revision is deliberately *not* bumped: correcting a value nobody chose is not an edit somebody
     * made, and it must not appear in the history as one. The next real save writes it down.
     */
    return migrate({ ...doc, id: this.name })
  }

  private metaRow(): MetaRow {
    return this.ctx.storage.sql.exec<MetaRow>('SELECT * FROM meta WHERE id = 1').toArray()[0]
  }

  meta(): PageMeta {
    const row = this.metaRow()
    return {
      status: isPageStatus(row.status) ? row.status : 'draft',
      statusBy: row.status_by,
      statusAt: row.status_at,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedBy: row.updated_by,
    }
  }

  snapshot(): Snapshot {
    const doc = this.load()
    // A page from before the library, opened for the first time since: it reports in now.
    if (doc.rev > 0 && !this.metaRow().indexed) this.scheduleIndex()
    return { doc, meta: this.meta(), editors: this.ctx.getWebSockets().length }
  }

  /** Every kept version, newest first — enough to populate a history list without the bodies. */
  history(): { rev: number; at: number; title: string }[] {
    return this.ctx.storage.sql
      .exec<RevisionRow>('SELECT rev, at, json FROM revisions ORDER BY rev DESC')
      .toArray()
      .map(({ rev, at, json }) => ({ rev, at, title: (JSON.parse(json) as Page).title }))
  }

  /* ---------------------------------------------------------------- writing */

  /**
   * Accepts a new version of the page.
   *
   * `baseRev` is the revision the client had when it made the edit. If the stored page has moved on
   * since, the write is **refused and the current document returned** rather than merged: two people
   * editing the same page get the newer state and can see what happened, which is honest. A
   * last-write-wins merge here would silently discard whichever edit lost the race, and the person who
   * lost it would never know.
   *
   * Returns the snapshot either way — accepted or not — so a client always ends up holding the truth.
   */
  save(incoming: unknown, baseRev: number, from?: WebSocket, by?: string): Snapshot & { accepted: boolean } {
    const current = this.load()

    if (baseRev !== current.rev) return { ...this.snapshot(), accepted: false }

    const problems = documentProblems(incoming)
    if (problems.length) throw new Error(`Invalid page: ${problems.join('; ')}`)

    // Migrated on the way in as well as on the way out: `restore` writes an old revision back, and an
    // old revision is exactly where a value from before a rename still lives.
    const doc: Page = migrate({
      ...(incoming as Page),
      id: this.name,
      rev: current.rev + 1,
      updatedAt: Date.now(),
    })
    const json = JSON.stringify(doc)

    /*
     * Three writes with no `await` between them, which is what keeps them atomic: the Durable Object
     * runtime only interleaves other requests at an await point, so nothing can observe the page
     * updated but the revision unrecorded.
     */
    this.ctx.storage.sql.exec('INSERT OR REPLACE INTO page (id, json) VALUES (1, ?)', json)
    this.ctx.storage.sql.exec('INSERT OR REPLACE INTO revisions (rev, at, json) VALUES (?, ?, ?)', doc.rev, doc.updatedAt, json)
    this.ctx.storage.sql.exec('DELETE FROM revisions WHERE rev <= ?', doc.rev - HISTORY)
    // The first person to save a page owns it; the last one to save it is who the library names.
    this.ctx.storage.sql.exec(
      `UPDATE meta SET
         updated_by = COALESCE(?, updated_by),
         created_by = COALESCE(created_by, ?),
         created_at = COALESCE(created_at, ?)
       WHERE id = 1`,
      by ?? null,
      by ?? null,
      doc.updatedAt,
    )
    this.scheduleIndex()

    const snapshot = { doc, meta: this.meta(), editors: this.ctx.getWebSockets().length }
    this.broadcast(snapshot, from)
    return { ...snapshot, accepted: true }
  }

  /**
   * Puts an old version back as the newest one.
   *
   * A restore is an ordinary write, not a rewind: the version being restored is appended as a new
   * revision and the ones after it are kept. Undoing a restore is then just another restore, and no
   * history is ever destroyed by looking at it.
   */
  restore(rev: number, by?: string): Snapshot {
    const row = this.ctx.storage.sql
      .exec<PageRow>('SELECT json FROM revisions WHERE rev = ?', rev)
      .toArray()[0]
    if (!row) throw new Error(`No revision ${rev}`)

    const current = this.load()
    const { accepted, ...snapshot } = this.save(JSON.parse(row.json), current.rev, undefined, by)
    void accepted
    return snapshot
  }

  /** Throws the page away. The Durable Object's storage goes with it, and the library forgets it. */
  async destroy(): Promise<void> {
    await this.env.LIBRARY.getByName(LIBRARY_NAME).remove(this.name)
    await this.ctx.storage.deleteAlarm()
    await this.ctx.storage.deleteAll()
  }

  /* ---------------------------------------------------------------- comments */

  /**
   * When the conversation last changed. Kept in storage rather than derived from the rows, because a
   * delete leaves no row behind to carry the time — and a client comparing versions must see a delete
   * as newer than the list it already holds.
   */
  private commentsVersion = 0

  private touchComments(): void {
    this.commentsVersion = Math.max(Date.now(), this.commentsVersion + 1)
    void this.ctx.storage.put('commentsVersion', this.commentsVersion)
  }

  async comments(): Promise<CommentsState> {
    if (!this.commentsVersion) this.commentsVersion = (await this.ctx.storage.get<number>('commentsVersion')) ?? 0
    const rows = this.ctx.storage.sql.exec<CommentRow>('SELECT * FROM comments ORDER BY at').toArray()
    return { version: this.commentsVersion, comments: rows.map(toComment) }
  }

  /**
   * A new thread, or a reply to one. A reply's node and point come from its thread — a reply is to the
   * conversation, not to a new spot on the page.
   */
  async addComment(
    input: { thread?: string; node?: string | null; point?: PagePoint | null; body?: unknown },
    by: string,
  ): Promise<CommentsState> {
    const body = cleanBody(input.body)
    const id = crypto.randomUUID()
    const at = Date.now()
    const rev = this.load().rev

    if (input.thread) {
      const root = this.ctx.storage.sql
        .exec<CommentRow>('SELECT * FROM comments WHERE id = ? AND thread = id', input.thread)
        .toArray()[0]
      if (!root) throw new Error('No such thread')
      this.ctx.storage.sql.exec(
        'INSERT INTO comments (id, thread, node, x, y, rev, body, author, at) VALUES (?, ?, NULL, NULL, NULL, ?, ?, ?, ?)',
        id, root.id, rev, body, by, at,
      )
      // Replying to a resolved thread reopens it: somebody evidently has more to say.
      this.ctx.storage.sql.exec('UPDATE comments SET resolved_at = NULL, resolved_by = NULL WHERE id = ?', root.id)
    } else {
      const node = typeof input.node === 'string' && input.node.length <= 64 ? input.node : null
      const point = input.point && fraction(input.point.x) && fraction(input.point.y) ? input.point : null
      this.ctx.storage.sql.exec(
        'INSERT INTO comments (id, thread, node, x, y, rev, body, author, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, id, node, point?.x ?? null, point?.y ?? null, rev, body, by, at,
      )
    }
    return this.commentsChanged()
  }

  /** Only the author may reword a comment — it is their name on it. */
  async editComment(id: string, body: unknown, by: string): Promise<CommentsState> {
    const row = this.ownComment(id, by)
    this.ctx.storage.sql.exec('UPDATE comments SET body = ?, edited_at = ? WHERE id = ?', cleanBody(body), Date.now(), row.id)
    return this.commentsChanged()
  }

  /** Anyone signed in may resolve or reopen a thread; who did it is recorded. */
  async resolveThread(thread: string, resolved: boolean, by: string): Promise<CommentsState> {
    const found = this.ctx.storage.sql
      .exec<CommentRow>('UPDATE comments SET resolved_at = ?, resolved_by = ? WHERE id = ? AND thread = id RETURNING *',
        resolved ? Date.now() : null, resolved ? by : null, thread)
      .toArray()
    if (!found.length) throw new Error('No such thread')
    return this.commentsChanged()
  }

  /** The author's own comment. Deleting a thread's first comment deletes the thread. */
  async deleteComment(id: string, by: string): Promise<CommentsState> {
    const row = this.ownComment(id, by)
    if (row.thread === row.id) this.ctx.storage.sql.exec('DELETE FROM comments WHERE thread = ?', row.id)
    else this.ctx.storage.sql.exec('DELETE FROM comments WHERE id = ?', row.id)
    return this.commentsChanged()
  }

  private ownComment(id: string, by: string): CommentRow {
    const row = this.ctx.storage.sql.exec<CommentRow>('SELECT * FROM comments WHERE id = ?', id).toArray()[0]
    if (!row) throw new Error('No such comment')
    if (row.author !== by) throw new Error('Only the person who wrote a comment can change it')
    return row
  }

  /** After any change: everyone signed in sees it, and the library's open-thread count follows. */
  private async commentsChanged(): Promise<CommentsState> {
    this.touchComments()
    const state = await this.comments()
    const message = JSON.stringify({ type: 'comments', ...state })
    for (const socket of this.ctx.getWebSockets()) {
      // Only signed-in sockets: a share code opens the page, not the conversation about it.
      const { canWrite } = (socket.deserializeAttachment() ?? {}) as { canWrite?: boolean }
      if (!canWrite) continue
      try {
        socket.send(message)
      } catch {
        // Gone; the close handler tidies up.
      }
    }
    this.scheduleIndex()
    return state
  }

  private openThreads(): number {
    const row = this.ctx.storage.sql
      .exec<Row<{ n: number }>>('SELECT COUNT(*) AS n FROM comments WHERE thread = id AND resolved_at IS NULL')
      .toArray()[0]
    return row?.n ?? 0
  }

  /* ---------------------------------------------------------------- status and the library */

  /**
   * Moves the page through review. Not an edit: the revision does not move and the history does not
   * grow. Everyone with the page open sees it change, and the library hears about it at once rather
   * than after the save delay — a status change is the thing a colleague is watching for.
   */
  async setStatus(status: PageStatus, by?: string): Promise<Snapshot> {
    if (!isPageStatus(status)) throw new Error(`No status called ${String(status)}`)
    this.ctx.storage.sql.exec(
      'UPDATE meta SET status = ?, status_by = ?, status_at = ? WHERE id = 1',
      status,
      by ?? null,
      Date.now(),
    )
    const snapshot = this.snapshot()
    this.broadcast(snapshot)
    await this.report()
    return snapshot
  }

  private scheduleIndex(): void {
    void this.ctx.storage.getAlarm().then((at) => {
      if (at === null) return this.ctx.storage.setAlarm(Date.now() + INDEX_AFTER)
    })
  }

  /** The one thing the alarm is for. */
  override async alarm(): Promise<void> {
    await this.report()
  }

  /** Tells the library what this page currently is. A page nobody has written to is not listed. */
  private async report(): Promise<void> {
    const doc = this.load()
    if (doc.rev === 0) return

    const entry: Omit<LibraryEntry, 'indexedAt'> = {
      ...this.meta(),
      id: this.name,
      title: doc.title,
      template: doc.template ?? null,
      colorScheme: doc.colorScheme,
      rev: doc.rev,
      updatedAt: doc.updatedAt,
      sections: doc.root.length,
      openComments: this.openThreads(),
    }
    await this.env.LIBRARY.getByName(LIBRARY_NAME).upsert(entry)
    this.ctx.storage.sql.exec('UPDATE meta SET indexed = 1 WHERE id = 1')
  }

  /* ---------------------------------------------------------------- sharing */

  /** The page's code, minted on first use so that a page nobody shared has no way in. */
  shareCode(): string {
    const existing = this.ctx.storage.sql
      .exec<ShareRow>('SELECT code FROM share WHERE id = 1')
      .toArray()[0]
    if (existing) return existing.code

    const code = newCode()
    this.ctx.storage.sql.exec('INSERT INTO share (id, code, at) VALUES (1, ?, ?)', code, Date.now())
    return code
  }

  /** A new code, which invalidates every link already sent. */
  rotateShareCode(): string {
    const code = newCode()
    this.ctx.storage.sql.exec('INSERT OR REPLACE INTO share (id, code, at) VALUES (1, ?, ?)', code, Date.now())
    return code
  }

  /**
   * Whether a presented code opens this page.
   *
   * Returns false when no code has ever been minted, rather than treating "no code" as "no gate" —
   * an unshared page is closed, not open.
   */
  checkShareCode(presented: string): boolean {
    const row = this.ctx.storage.sql.exec<ShareRow>('SELECT code FROM share WHERE id = 1').toArray()[0]
    return row ? sameCode(row.code, presented) : false
  }

  /* ---------------------------------------------------------------- live editing */

  /**
   * A second editor's WebSocket.
   *
   * The **one** thing here that goes through `fetch` rather than an RPC method, and it has to: an
   * upgrade is answered with a `101` carrying the other half of a `WebSocketPair`, and neither a
   * `Response` nor a live socket can cross an RPC boundary. Everything else in this class is a
   * method call, which is why the Worker reads as a router rather than as a second protocol.
   *
   * The socket is accepted through `acceptWebSocket` rather than `ws.accept()`, which is what lets
   * the object **hibernate**: with no request in flight it is evicted from memory while the sockets
   * stay open, and is woken by the next message. A page left open in a tab overnight costs nothing.
   */
  override async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('This endpoint speaks WebSocket', { status: 426 })
    }

    const pair = new WebSocketPair()
    this.ctx.acceptWebSocket(pair[1])

    /*
     * Whether this connection may write, decided by the Worker that authenticated it and recorded
     * here rather than re-derived later. A browser cannot put a header on a WebSocket message, so
     * there is nothing to check per message — the permission has to be attached to the socket at the
     * moment it is accepted.
     *
     * `serializeAttachment` rather than a field: the object hibernates while sockets stay open, and a
     * field would come back `undefined` on the first message after it woke — defaulting a woken
     * viewer's socket to writable.
     */
    const params = new URL(request.url).searchParams
    pair[1].serializeAttachment({
      canWrite: params.get('write') === '1',
      // Who is on the other end, for the page's "last edited by". Set by the Worker, like `write`.
      by: params.get('by') ?? undefined,
    })

    // Everyone already in the page sees the count go up. Without this, "2 editing" only ever appears
    // for whoever arrived last, which is the wrong half of the room.
    this.broadcast(this.snapshot(), pair[1])

    return new Response(null, { status: 101, webSocket: pair[0] })
  }

  /**
   * The only message a client sends is a save.
   *
   * Sending edits over the socket rather than over `fetch` is what makes the round trip short enough
   * for the other tab to feel live, and it reuses `save` exactly — including the revision check, so a
   * socket cannot bypass the rule the HTTP route enforces.
   */
  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    let payload: { type: string; doc?: unknown; baseRev?: number }
    try {
      payload = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message))
    } catch {
      return ws.send(JSON.stringify({ type: 'error', message: 'Malformed message' }))
    }

    if (payload.type !== 'save' || typeof payload.baseRev !== 'number') return

    const { canWrite, by } = (ws.deserializeAttachment() ?? {}) as { canWrite?: boolean; by?: string }
    if (!canWrite) {
      return ws.send(JSON.stringify({ type: 'error', message: 'This link is read-only' }))
    }

    try {
      /*
       * The sender is excluded from the broadcast on purpose. Echoing a save back to whoever made it
       * is not harmless: the echo arrives before the acknowledgement, so the sender sees a revision
       * ahead of its own while it still has the edit marked unsaved, treats that as somebody else
       * having written, and re-sends to catch up — turning every edit into two writes and two
       * revisions. The sender learns the outcome from `saved` below, which is the only answer it
       * needs.
       */
      const result = this.save(payload.doc, payload.baseRev, ws, by)
      // This tells the sender whether their edit stuck.
      ws.send(JSON.stringify({ type: result.accepted ? 'saved' : 'rejected', ...result }))
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: (error as Error).message }))
    }
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    ws.close()
    // Everyone still connected sees the editor count fall.
    this.broadcast(this.snapshot())
  }

  /** Tells every other open tab what the page now is. */
  private broadcast(snapshot: Snapshot, except?: WebSocket): void {
    const message = JSON.stringify({ type: 'changed', ...snapshot })
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === except) continue
      try {
        socket.send(message)
      } catch {
        // A socket the client has already dropped. The close handler will tidy it up.
      }
    }
  }
}
