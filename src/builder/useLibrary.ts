/**
 * Every page in the library, kept live.
 *
 * The socket is opened **before** the list is fetched, so nothing that happens between the two is
 * missed; the two are then merged by `indexedAt`, the library's own clock, so an upsert that raced the
 * fetch wins over the older row the fetch returned, and the fetch cannot roll back an upsert it did not
 * know about. A dropped socket reconnects and refetches, because whatever happened while it was down
 * was not pushed to anyone.
 */
import { useEffect, useMemo, useState } from 'react'
import type { LibraryEntry, LibraryMessage } from './library'

export type LibraryState =
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'ready'; entries: LibraryEntry[]; live: boolean }

const RETRY_AFTER = 3_000

const newer = (a: LibraryEntry | undefined, b: LibraryEntry) => !a || b.indexedAt >= a.indexedAt

export function useLibrary(enabled: boolean): LibraryState {
  const [entries, setEntries] = useState<Map<string, LibraryEntry> | null>(null)
  const [denied, setDenied] = useState(false)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let stopped = false
    let socket: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | null = null
    /* Pushes that arrive before the list does, applied on top of it. */
    let pending: LibraryMessage[] = []
    let loaded = false

    const apply = (map: Map<string, LibraryEntry>, message: LibraryMessage) => {
      if (message.type === 'removed') map.delete(message.id)
      else if (newer(map.get(message.entry.id), message.entry)) map.set(message.entry.id, message.entry)
    }

    const connect = () => {
      if (stopped) return
      loaded = false
      pending = []

      const url = new URL('/api/library/socket', location.href)
      url.protocol = url.protocol.replace('http', 'ws')
      socket = new WebSocket(url)
      socket.onopen = () => setLive(true)
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data as string) as LibraryMessage
        if (!loaded) return void pending.push(message)
        setEntries((current) => {
          const next = new Map(current ?? [])
          apply(next, message)
          return next
        })
      }
      socket.onclose = () => {
        setLive(false)
        if (!stopped) retry = setTimeout(connect, RETRY_AFTER)
      }

      void fetch('/api/library')
        .then(async (response) => {
          if (response.status === 401 || response.status === 403) {
            stopped = true
            setDenied(true)
            socket?.close()
            return
          }
          if (!response.ok) throw new Error(String(response.status))
          const list = (await response.json()) as LibraryEntry[]
          const map = new Map(list.map((entry) => [entry.id, entry]))
          for (const message of pending) apply(map, message)
          pending = []
          loaded = true
          setEntries(map)
        })
        .catch(() => socket?.close())
    }

    connect()

    return () => {
      stopped = true
      if (retry) clearTimeout(retry)
      socket?.close()
    }
  }, [enabled])

  return useMemo<LibraryState>(() => {
    if (denied) return { status: 'denied' }
    if (!entries) return { status: 'loading' }
    const sorted = [...entries.values()].sort((a, b) => b.updatedAt - a.updatedAt)
    return { status: 'ready', entries: sorted, live }
  }, [entries, denied, live])
}
