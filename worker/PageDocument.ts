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

/** How many past versions to keep. Roughly a working day of edits at the rate a person makes them. */
const HISTORY = 200

export interface Env extends AccessConfig {
  PAGES: DurableObjectNamespace<PageDocument>
  /** The built builder — the Worker's own files, not anything a designer uploaded. */
  ASSETS: Fetcher
  /** Uploaded images. Named for what a designer does, to keep it apart from `ASSETS`. */
  UPLOADS: R2Bucket
}

/** What a client is told after a write, and what a broadcast carries. */
export interface Snapshot {
  doc: Page
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

  snapshot(): Snapshot {
    return { doc: this.load(), editors: this.ctx.getWebSockets().length }
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
  save(incoming: unknown, baseRev: number, from?: WebSocket): Snapshot & { accepted: boolean } {
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

    const snapshot = { doc, editors: this.ctx.getWebSockets().length }
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
  restore(rev: number): Snapshot {
    const row = this.ctx.storage.sql
      .exec<PageRow>('SELECT json FROM revisions WHERE rev = ?', rev)
      .toArray()[0]
    if (!row) throw new Error(`No revision ${rev}`)

    const current = this.load()
    const { accepted, ...snapshot } = this.save(JSON.parse(row.json), current.rev)
    void accepted
    return snapshot
  }

  /** Throws the page away. The Durable Object's storage goes with it. */
  async destroy(): Promise<void> {
    await this.ctx.storage.deleteAll()
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
    pair[1].serializeAttachment({ canWrite: new URL(request.url).searchParams.get('write') === '1' })

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

    const { canWrite } = (ws.deserializeAttachment() ?? {}) as { canWrite?: boolean }
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
      const result = this.save(payload.doc, payload.baseRev, ws)
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
