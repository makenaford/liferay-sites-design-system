/**
 * Holds one page in the browser, and keeps it level with its Durable Object.
 *
 * ## The shape of the problem
 *
 * A builder has to feel like a local document — a dropdown changes and the canvas has already
 * changed — while actually being a shared one. So every edit is applied **locally first** and sent
 * afterwards. The network is never in the path between a click and what the designer sees.
 *
 * That leaves three things to get right, and this file is mostly those three things:
 *
 * - **Saving without spamming.** Dragging a number field fires an edit per pixel. Saves are
 *   coalesced on a short timer, so a drag is one write.
 * - **Undo.** Local, and a stack of whole documents rather than a log of inverse operations. A page
 *   is a few kilobytes; a hundred of them is nothing, and "the document as it was" cannot be wrong
 *   about anything, whereas a hand-written inverse for every operation has to be right about all of
 *   them.
 * - **Someone else editing the same page.** See `adopt` below.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PageDocument } from './document'

export type Status = 'loading' | 'ready' | 'denied' | 'error'

/** How long to sit on an edit before writing it. Long enough to swallow a drag, short enough to feel saved. */
const SAVE_AFTER = 350

/** How deep undo goes. */
const UNDO_LIMIT = 100

interface Snapshot {
  doc: PageDocument
  editors: number
}

/** Thrown for a 401 or 403, so the catch can tell "you may not" from "something broke". */
class Denied extends Error {}

export interface Page {
  doc: PageDocument | null
  status: Status
  error: string | null
  /** How many people have this page open, this browser included. */
  editors: number
  /** True from the first unsaved keystroke until the Durable Object has taken it. */
  saving: boolean
  /** Applies an edit locally and schedules a save. */
  edit: (change: (doc: PageDocument) => PageDocument) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

/**
 * A reader's share code, on the one request that needs it.
 *
 * After the Worker accepts it, the code lives in an HttpOnly cookie and every later request carries
 * it without anyone having to remember to. It is still passed to the WebSocket explicitly, because
 * the socket opens in the same tick as the first fetch and cannot rely on a cookie that fetch has not
 * come back and set yet.
 */
export function usePage(id: string | null, key?: string | null): Page {
  const [doc, setDoc] = useState<PageDocument | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [editors, setEditors] = useState(1)
  const [saving, setSaving] = useState(false)
  const [depth, setDepth] = useState({ undo: 0, redo: 0 })

  /*
   * Refs, not state, for everything the *save machinery* reads. A save fires from a timer and from a
   * socket callback, both of which close over whatever the values were when they were created —
   * reading state there would save a document several edits out of date.
   */
  const current = useRef<PageDocument | null>(null)
  const socket = useRef<WebSocket | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirty = useRef(false)
  const undoStack = useRef<PageDocument[]>([])
  const redoStack = useRef<PageDocument[]>([])

  const publish = useCallback((next: PageDocument | null) => {
    current.current = next
    setDoc(next)
  }, [])

  /* ---------------------------------------------------------------- saving */

  const send = useCallback(() => {
    const doc = current.current
    if (!doc || !id) return

    const live = socket.current
    if (live && live.readyState === WebSocket.OPEN) {
      live.send(JSON.stringify({ type: 'save', doc, baseRev: doc.rev }))
      return
    }

    // The socket is closed or still opening — a save must not wait for it.
    void fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ doc, baseRev: doc.rev }),
    })
      .then(async (response) => {
        const body = (await response.json()) as Snapshot & { accepted?: boolean; error?: string }
        if (response.status === 409 || body.accepted === false) return adopt(body)
        if (!response.ok) throw new Error(body.error ?? 'Save failed')
        settle(body)
      })
      .catch((reason: Error) => setError(reason.message))
  }, [id])

  /** Coalesces edits: each one pushes the write out, so a drag lands as a single save. */
  const schedule = useCallback(() => {
    dirty.current = true
    setSaving(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(send, SAVE_AFTER)
  }, [send])

  /** The Durable Object took our write. Take its revision number; the content is already ours. */
  const settle = useCallback((snapshot: Snapshot) => {
    setEditors(snapshot.editors)
    setError(null)
    const doc = current.current
    if (!doc) return

    dirty.current = false
    setSaving(false)
    publish({ ...doc, rev: snapshot.doc.rev, updatedAt: snapshot.doc.updatedAt })
  }, [publish])

  /**
   * The page moved underneath us — someone else saved, or our own write was refused as stale.
   *
   * What happens next depends on whether this browser has unsaved work:
   *
   * - **Nothing unsaved**: take their version. This is the common case — a second tab, or a colleague
   *   working on a different section — and it is simply the page being live.
   * - **Something unsaved**: keep ours and write it again on top of their revision. The alternative is
   *   throwing away edits the designer has already seen applied on their own screen, which is the one
   *   outcome a builder must never produce.
   *
   * The second branch does mean the other person's change is superseded. That is survivable and
   * visible: every revision is kept by the Durable Object, so what they did is still there to restore,
   * and the editor count in the toolbar is what tells them someone else is in the page at all.
   */
  const adopt = useCallback((snapshot: Snapshot) => {
    setEditors(snapshot.editors)

    if (!dirty.current) {
      publish(snapshot.doc)
      setSaving(false)
      return
    }

    const doc = current.current
    if (!doc) return
    publish({ ...doc, rev: snapshot.doc.rev })
    // Re-send immediately: this is a resolution, not a new edit, and waiting would leave the two
    // sides disagreeing for as long as the designer happened to pause.
    setTimeout(send, 0)
  }, [publish, send])

  /* ---------------------------------------------------------------- loading and the socket */

  useEffect(() => {
    if (!id) return

    let live = true
    setStatus('loading')

    void fetch(`/api/pages/${id}${key ? `?k=${encodeURIComponent(key)}` : ''}`)
      .then(async (response) => {
        // 401 and 403 are not failures to report as breakage — they are the gate doing its job.
        if (response.status === 401 || response.status === 403) throw new Denied()
        if (!response.ok) throw new Error(`${response.status}`)
        return (await response.json()) as Snapshot
      })
      .then((snapshot) => {
        if (!live) return
        undoStack.current = []
        redoStack.current = []
        setDepth({ undo: 0, redo: 0 })
        publish(snapshot.doc)
        setEditors(snapshot.editors)
        setStatus('ready')
      })
      .catch((reason: unknown) => {
        if (!live) return
        setStatus(reason instanceof Denied ? 'denied' : 'error')
      })

    /*
     * The socket is an enhancement, never a dependency. Everything works over `fetch` without it; it
     * exists so a second tab sees a change without being reloaded. So a failure to open it is not
     * surfaced as an error — the page simply stops being live.
     */
    const url = new URL(`/api/pages/${id}/socket`, location.href)
    url.protocol = url.protocol.replace('http', 'ws')
    if (key) url.searchParams.set('k', key)
    const connection = new WebSocket(url)
    socket.current = connection

    connection.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as {
        type: string
        doc?: PageDocument
        editors?: number
        message?: string
      }
      if (message.type === 'error') return setError(message.message ?? 'Save failed')
      if (!message.doc) return

      const snapshot = { doc: message.doc, editors: message.editors ?? 1 }
      if (message.type === 'saved') return settle(snapshot)
      if (message.type === 'rejected') return adopt(snapshot)
      // `changed`: someone else's write, or the echo of our own.
      if (message.doc.rev !== current.current?.rev) adopt(snapshot)
      else setEditors(snapshot.editors)
    }

    return () => {
      live = false
      socket.current = null
      connection.close()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [id, key, publish, settle, adopt])

  /*
   * A page with unwritten edits must not be closed silently. The timer is at most a few hundred
   * milliseconds, but a browser closing a tab does not wait for it.
   */
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty.current) event.preventDefault()
    }
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [])

  /* ---------------------------------------------------------------- editing */

  const edit = useCallback(
    (change: (doc: PageDocument) => PageDocument) => {
      const doc = current.current
      if (!doc) return

      const next = change(doc)
      if (next === doc) return

      undoStack.current = [...undoStack.current, doc].slice(-UNDO_LIMIT)
      redoStack.current = []
      setDepth({ undo: undoStack.current.length, redo: 0 })

      publish(next)
      schedule()
    },
    [publish, schedule],
  )

  /*
   * Undo restores a whole document, but **not its revision**: the version being restored is older
   * than what the Durable Object holds, and writing it back under its old revision number would be
   * refused as stale. So the content goes back and the revision stays where it is — an undo is a new
   * edit that happens to look like an old one.
   */
  const step = useCallback(
    (from: typeof undoStack, to: typeof redoStack) => {
      const doc = current.current
      const previous = from.current[from.current.length - 1]
      if (!doc || !previous) return

      from.current = from.current.slice(0, -1)
      to.current = [...to.current, doc].slice(-UNDO_LIMIT)
      setDepth({ undo: undoStack.current.length, redo: redoStack.current.length })

      publish({ ...previous, rev: doc.rev })
      schedule()
    },
    [publish, schedule],
  )

  const undo = useCallback(() => step(undoStack, redoStack), [step])
  const redo = useCallback(() => step(redoStack, undoStack), [step])

  return useMemo(
    () => ({
      doc,
      status,
      error,
      editors,
      saving,
      edit,
      undo,
      redo,
      canUndo: depth.undo > 0,
      canRedo: depth.redo > 0,
    }),
    [doc, status, error, editors, saving, edit, undo, redo, depth],
  )
}
