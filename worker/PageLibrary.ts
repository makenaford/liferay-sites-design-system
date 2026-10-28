/**
 * The index of every page — one Durable Object for the whole deployment, addressed as `library`.
 *
 * ## Why one object, and not a query over the pages
 *
 * Each page is its own Durable Object, and there is no way to ask the platform for "all of them": an
 * object is reached by name, and the names are not listed anywhere. So the pages report in. After a
 * write, a page's object pushes its listing here (see `PageDocument.alarm`), and this keeps one row per
 * page in its own SQLite table.
 *
 * A single object is the right size for this. It holds a few hundred bytes per page and takes a write
 * per page per burst of editing — an internal team's whole output is a small table — and being one
 * object is what lets it own the open home screens' sockets and push a change to all of them as a
 * method call. If it ever needed to be bigger, the rows are derived: it can be emptied and the pages
 * will re-report the next time each is opened.
 *
 * ## Live
 *
 * The home screen holds a hibernatable WebSocket here and gets every upsert and removal as it happens,
 * so a page a colleague moves to "In review" changes on everyone's screen without a refresh.
 */
import { DurableObject } from 'cloudflare:workers'
import type { LibraryEntry, LibraryMessage } from '../src/builder/library'
import type { Env } from './PageDocument'

type Row<T> = T & Record<string, SqlStorageValue>
type EntryRow = Row<{ json: string }>

export class PageLibrary extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS pages (
          id TEXT PRIMARY KEY,
          json TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `)
    })
  }

  /** Every page, most recently edited first. */
  list(): LibraryEntry[] {
    return this.ctx.storage.sql
      .exec<EntryRow>('SELECT json FROM pages ORDER BY updated_at DESC')
      .toArray()
      .map((row) => JSON.parse(row.json) as LibraryEntry)
  }

  /** A page's current listing. Stamped here, so `indexedAt` is the library's clock and nobody else's. */
  upsert(incoming: Omit<LibraryEntry, 'indexedAt'>): void {
    const entry: LibraryEntry = { ...incoming, indexedAt: Date.now() }
    this.ctx.storage.sql.exec(
      'INSERT OR REPLACE INTO pages (id, json, updated_at) VALUES (?, ?, ?)',
      entry.id,
      JSON.stringify(entry),
      entry.updatedAt,
    )
    this.broadcast({ type: 'upsert', entry })
  }

  remove(id: string): void {
    this.ctx.storage.sql.exec('DELETE FROM pages WHERE id = ?', id)
    this.broadcast({ type: 'removed', id })
  }

  /**
   * A home screen's socket. Accepted for hibernation, so an idle library tab costs nothing; it only
   * ever receives. The Worker checks Access before handing the upgrade on — this object trusts that.
   */
  override async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('This endpoint speaks WebSocket', { status: 426 })
    }
    const pair = new WebSocketPair()
    this.ctx.acceptWebSocket(pair[1])
    return new Response(null, { status: 101, webSocket: pair[0] })
  }

  async webSocketMessage(): Promise<void> {
    // Nothing to say: the library is read over HTTP and pushed over the socket.
  }

  async webSocketClose(ws: WebSocket): Promise<void> {
    ws.close()
  }

  private broadcast(message: LibraryMessage): void {
    const text = JSON.stringify(message)
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(text)
      } catch {
        // A dropped tab. Its close handler tidies up.
      }
    }
  }
}
