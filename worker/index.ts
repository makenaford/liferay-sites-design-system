/**
 * The Worker in front of the pages.
 *
 * It does three things and deliberately no more: it names pages, it forwards everything about a page
 * to that page's Durable Object, and it serves the builder's own files. There is no application state
 * here at all — a Worker is spun up per request in whichever data centre took the connection, so
 * anything it remembered would be wrong for the next request.
 *
 * ## Routing
 *
 * ## Who may do what
 *
 * Two ways in, and they are not equivalent:
 *
 * - **Cloudflare Access** — a signed-in editor. Required to create a page, to change one, to see its
 *   history, and to mint or rotate its share link.
 * - **A share code** — a reader. Enough to see one page, and nothing else. It buys no access to any
 *   other page and no ability to write to this one.
 *
 * Uploaded images are the one exception to both, and the route says why: they are served to anyone
 * who has the URL, so that a mock's pictures survive being pasted into a branch or opened somewhere
 * the cookie did not follow.
 *
 * The code travels in the URL exactly once, on the first open. From then on it lives in an HttpOnly
 * cookie, so the address bar is clean: copying the URL out of it and passing it on does not pass on
 * the access. That is a **speed bump, not a wall** — the person who was given the link can always
 * forward the original — and it is the honest limit of a scheme with no reader accounts.
 *
 * | Route | Who |
 * | --- | --- |
 * | `GET /edit/new` | Access. Names a page and redirects into it |
 * | `GET /api/me` | anyone — reports whether you are signed in |
 * | `GET /api/pages/:id` | Access, or the page's code |
 * | `PUT /api/pages/:id` | Access |
 * | `DELETE /api/pages/:id` | Access |
 * | `GET /api/pages/:id/socket` | Access, or the code. Only Access may write over it |
 * | `POST /api/pages/:id/assets` | Access. Stores an uploaded image |
 * | `GET /api/pages/:id/assets/:asset` | anyone holding the link — see the route |
 * | `GET /api/pages/:id/history` | Access |
 * | `POST /api/pages/:id/restore` | Access |
 * | `POST /api/pages/:id/share` | Access. `{ rotate: true }` replaces the code |
 * | `POST /api/pages/:id/status` | Access. `{ status }` moves the page through review |
 * | `GET`/`POST /api/pages/:id/comments` | Access. The conversation; `POST` adds a thread or a reply |
 * | `PATCH`/`DELETE /api/pages/:id/comments/:c` | Access. Reword or delete your own; resolve any |
 * | `GET /api/pages/:id/versions` | Access, or the code. The named versions |
 * | `POST /api/pages/:id/versions` | Access. `{ name, note, status? }` freezes the page as a version |
 * | `GET /api/pages/:id/versions/:n` | Access, or the code. A version's frozen document |
 * | `POST /api/pages/:id/versions/:n/restore` | Access. Puts a version back as the newest revision |
 * | `GET /p/:id/v/:n.html`, `.tsx` | Access, or the code. The frozen deliverable |
 * | `GET /p/:id/v/:n/assets/:file` | anyone — a frozen copy of a public design-system file |
 * | `GET /api/library` | Access. Every page's listing |
 * | `GET /api/library/socket` | Access. Live library changes |
 * | `GET /p/:id.html` | Access, or the code |
 * | anything else | The builder's files. The shell is not secret; the page data behind it is |
 */
import { LIBRARY_NAME, PageDocument, type Env } from './PageDocument'
import { PageLibrary } from './PageLibrary'
import { isPageStatus } from '../src/builder/library'
import { cookie, identify, type Identity } from './access'
/*
 * The renderer, built by Vite rather than by wrangler — see `vite.ssr.config.ts` for why that is not
 * optional. `#ssr` is typed against the source in `worker/tsconfig.json` and resolved to the built
 * file by `alias` in `wrangler.jsonc`, so the editor sees real types and the runtime gets the bundle
 * whose CSS class names match the stylesheet.
 */
import { handoff, pageToHtml } from '#ssr'
import type { PageDocument as Page } from '../src/builder/document'

export { PageDocument, PageLibrary }

/**
 * Page names are readable on purpose.
 *
 * The name is the routing key *and* the URL a designer pastes into a message, so `dawn-harbor-4f2`
 * beats a UUID: it survives being read aloud, and two pages open in two tabs are told apart at a
 * glance. The random tail is what keeps names from colliding and from being guessable enough to
 * enumerate.
 */
const ADJECTIVES = ['amber', 'bright', 'calm', 'dawn', 'ember', 'fresh', 'golden', 'harbor', 'ivory', 'jade', 'keen', 'lunar', 'north', 'opal', 'plain', 'quiet', 'rapid', 'still', 'true', 'urban', 'vivid', 'warm']
const NOUNS = ['anchor', 'beacon', 'cedar', 'delta', 'echo', 'field', 'grove', 'harbor', 'inlet', 'jetty', 'kite', 'lantern', 'meadow', 'nest', 'orchard', 'pier', 'quarry', 'ridge', 'summit', 'terrace', 'vale', 'willow']

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

const newName = () =>
  `${pick(ADJECTIVES)}-${pick(NOUNS)}-${Math.random().toString(36).slice(2, 6)}`

/**
 * What a page id is allowed to look like.
 *
 * A Durable Object name can be any string, so this is not about the storage layer — it is about not
 * turning a typo'd or hostile URL into a permanently allocated object. Anything outside this shape is
 * a 404 rather than an empty new page.
 */
const VALID_ID = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/

/** What `newAssetId` mints. Checked before the bucket is asked, so a junk path is a 404, not a read. */
const VALID_ASSET = /^[a-f0-9]{32}$/

/**
 * The largest image the bucket will take.
 *
 * A bucket has no meaningful size limit, so this is a judgement rather than a constraint: 10MB is
 * past anything a web page should be serving, and it is the point at which an accidental upload — a
 * print export, a screen recording saved as a GIF — is better refused than quietly stored. The
 * builder re-encodes before it gets here (see `src/builder/upload.ts`), so a photograph arrives well
 * under it and this only ever catches the accident.
 */
const UPLOAD_LIMIT = 10 * 1024 * 1024

/**
 * What may be stored.
 *
 * An allowlist rather than a check for `image/`: this is what the Worker will later hand back with
 * that same `Content-Type`, and a page must not become a way to serve arbitrary files from its own
 * origin. SVG is on the list because the library's own artwork is vector; the response that serves
 * it is what makes it safe.
 */
const IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
])

/**
 * Where a page's images live in the bucket.
 *
 * Keyed by page first so that everything one page owns shares a prefix — which is what makes
 * deleting a page able to delete its images, a bucket having no equivalent of the Durable Object's
 * `deleteAll`.
 */
const assetKey = (page: string, asset: string) => `pages/${page}/${asset}`

/** 32 hex characters, which is what `VALID_ASSET` matches. */
const newAssetId = (): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

const oops = (message: string, status: number) => json({ error: message }, status)

/* ------------------------------------------------------------------ the share cookie */

/**
 * Where a reader's code is kept after its one trip through the URL.
 *
 * One cookie per page rather than one cookie holding every code: a reader usually has one, the 4KB
 * limit stops mattering, and a page whose code is rotated can have its cookie cleared on its own.
 *
 * `HttpOnly` is the point of using a cookie at all. The alternative — `localStorage` — is readable by
 * any script on the origin, and it does not travel on a top-level navigation, which `/p/:id.html`
 * and the WebSocket handshake both are.
 */
const keyCookie = (id: string) => `sds_key_${id.replace(/-/g, '_')}`

const SHARE_MAX_AGE = 60 * 60 * 24 * 180

const setKeyCookie = (response: Response, id: string, code: string, url: URL): Response => {
  const secure = url.protocol === 'https:' ? ' Secure;' : ''
  const merged = new Response(response.body, response)
  merged.headers.append(
    'Set-Cookie',
    `${keyCookie(id)}=${code}; Path=/;${secure} HttpOnly; SameSite=Lax; Max-Age=${SHARE_MAX_AGE}`,
  )
  return merged
}

/** The code a request carries: once from the URL, thereafter from the cookie it was put in. */
const presentedKey = (request: Request, url: URL, id: string): string | undefined =>
  url.searchParams.get('k') ?? cookie(request, keyCookie(id))

/**
 * Whether this caller may read this page.
 *
 * Returns the code when it was the code that let them in, so the caller can decide to put it in a
 * cookie — only worth doing on a response the browser will keep.
 */
async function mayRead(
  request: Request,
  env: Env,
  url: URL,
  id: string,
  who: Identity,
): Promise<{ ok: boolean; code?: string }> {
  if (who.authed) return { ok: true }

  const code = presentedKey(request, url, id)
  if (!code) return { ok: false }

  return { ok: await env.PAGES.getByName(id).checkShareCode(code), code }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const who = await identify(request, env, url)

    /*
     * The one route that exists to be protected by Access rather than by this code. Access covers
     * `/edit/*`, so reaching it at all means a login has happened; the page is created here so that
     * "new page" is a single link a signed-out person can follow, rather than a button that only
     * appears after signing in somewhere else.
     */
    if (url.pathname === '/edit/new') {
      if (!who.authed) return signInNeeded(url)
      /*
       * `?template=` rides along to the new page, where the browser reads it and fills the page from
       * that built page — the same place the default skeleton is written, for the same reason (see
       * `src/builder/starter.ts`). Only a short slug is carried; the builder ignores one it does not know.
       */
      const template = url.searchParams.get('template')
      const query = template && /^[a-z0-9-]{1,64}$/.test(template) ? `?template=${template}` : ''
      return Response.redirect(new URL(`/edit/${newName()}${query}`, url).toString(), 302)
    }

    if (url.pathname.startsWith('/api/')) {
      try {
        return await api(request, env, url, who)
      } catch (error) {
        // A thrown error here is a bug or a rejected document; either way the client gets a reason
        // rather than the runtime's generic 500 page.
        return oops((error as Error).message, 400)
      }
    }

    // `/p/dawn-harbor-4f2/v/3.html` — a frozen version. `/p/dawn-harbor-4f2/v/3` is its page in the app.
    const frozen = /^\/p\/([a-z0-9-]+)\/v\/(\d{1,6})\.(html|tsx)$/.exec(url.pathname)
    if (frozen) return versionFile(request, env, url, who, frozen[1], Number(frozen[2]), frozen[3] as 'html' | 'tsx')

    const frozenAsset = /^\/p\/([a-z0-9-]+)\/v\/(\d{1,6})\/assets\/([A-Za-z0-9._-]{1,128})$/.exec(url.pathname)
    if (frozenAsset) return versionAsset(env, frozenAsset[1], Number(frozenAsset[2]), frozenAsset[3])

    // `/p/dawn-harbor-4f2.html` — the artefact. `/p/dawn-harbor-4f2` stays the live page.
    const artefact = /^\/p\/([a-z0-9-]+)\.html$/.exec(url.pathname)
    if (artefact) return snapshot(request, env, artefact[1], url, who)

    return assets(request, env, url)
  },
} satisfies ExportedHandler<Env>

/* ------------------------------------------------------------------ the static artefact */

/**
 * Renders the page to one file, server-side.
 *
 * Rendered **here**, from the document, rather than being captured in the browser and stored: a
 * snapshot written by a client is a second copy of the truth that starts drifting the moment anything
 * else writes the page — the API, a restore from history, a colleague in another tab. Rendering on
 * request means the file is always the current revision and there is nothing to keep in step.
 */
async function snapshot(
  request: Request,
  env: Env,
  id: string,
  url: URL,
  who: Identity,
): Promise<Response> {
  if (!VALID_ID.test(id)) return oops('Not a page id', 404)

  /*
   * Gated like the page's data, because it *is* the page's data — the one route that returns content
   * rather than the shell. It is reached by a top-level navigation, which cannot carry a header, so
   * the cookie set when the code was first accepted is what admits a reader here.
   */
  const read = await mayRead(request, env, url, id, who)
  if (!read.ok) return oops('No access to this page', 403)

  const { doc } = await env.PAGES.getByName(id).snapshot()
  if (!doc.root.length) return oops('That page is empty', 404)

  const file = new Response(pageToHtml(doc, await stylesheet(env, url)), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Named, so a browser's "save as" and a download both land on something recognisable.
      'content-disposition': `inline; filename="${id}.html"`,
      'cache-control': 'no-store',
    },
  })

  return read.code ? setKeyCookie(file, id, read.code, url) : file
}

/* ------------------------------------------------------------------ frozen versions */

const versionKey = (page: string, number: number, file: string) => `pages/${page}/versions/${number}/${file}`

/** The largest built file copied into a version. Past this a file is linked rather than kept. */
const FREEZE_FILE_LIMIT = 25 * 1024 * 1024

/**
 * Freezes a version's deliverable into the bucket: the HTML, the React handoff, and a copy of every
 * built file the HTML uses.
 *
 * The copies are the point. The library's images, footage and fonts are served from `/assets/` under
 * content-hashed names, and the next deploy that changes one removes the old name — so HTML that linked
 * to them would lose its pictures the first time a component was touched. Each file is copied beside
 * the version and the HTML is rewritten to point there, with **absolute** URLs so that a downloaded copy
 * opened from disk still finds them. Uploaded images are already in the bucket for the life of the page,
 * so they are only made absolute.
 */
async function freeze(env: Env, url: URL, id: string, number: number, doc: Page): Promise<void> {
  let html = pageToHtml(doc, await stylesheet(env, url))
  const origin = url.origin

  const built = new Set<string>()
  for (const match of html.matchAll(/(["'(\s,])\/assets\/([A-Za-z0-9._-]+)/g)) built.add(match[2])

  const copied = new Set<string>()
  await Promise.all(
    [...built].map(async (file) => {
      const response = await env.ASSETS.fetch(new URL(`/assets/${file}`, url))
      if (!response.ok) return
      const size = Number(response.headers.get('content-length') ?? 0)
      if (size > FREEZE_FILE_LIMIT) return
      await env.UPLOADS.put(versionKey(id, number, `assets/${file}`), await response.arrayBuffer(), {
        httpMetadata: { contentType: response.headers.get('content-type') ?? 'application/octet-stream' },
      })
      copied.add(file)
    }),
  )

  html = html
    .replace(/(["'(\s,])\/assets\/([A-Za-z0-9._-]+)/g, (_whole, lead: string, file: string) =>
      copied.has(file) ? `${lead}${origin}/p/${id}/v/${number}/assets/${file}` : `${lead}${origin}/assets/${file}`,
    )
    .replace(/(["'(\s,])\/api\/pages\//g, `$1${origin}/api/pages/`)

  await Promise.all([
    env.UPLOADS.put(versionKey(id, number, 'page.html'), html, {
      httpMetadata: { contentType: 'text/html; charset=utf-8' },
    }),
    env.UPLOADS.put(versionKey(id, number, 'page.tsx'), handoff(doc).text, {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
    }),
  ])
}

/**
 * A version's HTML or React, as frozen. Gated like the page.
 *
 * Should the stored file be missing — a freeze that failed part-way — the HTML is rendered from the
 * version's stored document instead, and says so in a header: the right content, without the guarantee
 * that today's components draw it the way they did then.
 */
async function versionFile(
  request: Request,
  env: Env,
  url: URL,
  who: Identity,
  id: string,
  number: number,
  kind: 'html' | 'tsx',
): Promise<Response> {
  if (!VALID_ID.test(id)) return oops('Not a page id', 404)
  const read = await mayRead(request, env, url, id, who)
  if (!read.ok) return oops('No access to this page', 403)

  const headers: Record<string, string> = {
    'content-type': kind === 'html' ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8',
    'content-disposition': `${kind === 'html' ? 'inline' : 'attachment'}; filename="${id}-v${number}.${kind}"`,
    'cache-control': 'private, max-age=31536000, immutable',
  }

  const stored = await env.UPLOADS.get(versionKey(id, number, `page.${kind}`))
  let response: Response
  if (stored) {
    response = new Response(stored.body, { headers })
  } else {
    const found = await env.PAGES.getByName(id).version(number)
    if (!found) return oops(`No version ${number}`, 404)
    const body = kind === 'html' ? pageToHtml(found.doc, await stylesheet(env, url)) : handoff(found.doc).text
    response = new Response(body, { headers: { ...headers, 'cache-control': 'no-store', 'x-frozen': 'missing; rendered now' } })
  }
  return read.code ? setKeyCookie(response, id, read.code, url) : response
}

/**
 * A frozen copy of a built file. Ungated, like an uploaded image and for the same reason — a downloaded
 * version opened from disk carries no cookie — and with less at stake: these are the design system's
 * own public images and footage, which `/assets/` already serves to anyone.
 */
async function versionAsset(env: Env, id: string, number: number, file: string): Promise<Response> {
  if (!VALID_ID.test(id)) return oops('Not a page id', 404)
  const stored = await env.UPLOADS.get(versionKey(id, number, `assets/${file}`))
  if (!stored) return oops('No such file', 404)
  return new Response(stored.body, {
    headers: {
      'content-type': stored.httpMetadata?.contentType ?? 'application/octet-stream',
      'content-length': String(stored.size),
      etag: stored.httpEtag,
      'cache-control': 'public, max-age=31536000, immutable',
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
      'x-content-type-options': 'nosniff',
    },
  })
}

/**
 * The built stylesheet, read out of the deployed assets.
 *
 * Found by looking at `index.html` rather than by hardcoding a path, because Vite fingerprints the
 * filename — `index-D26IPooU.css` changes on every build that touches a style, and a constant here
 * would produce unstyled artefacts the first time someone edited a component.
 */
async function stylesheet(env: Env, url: URL): Promise<string> {
  const shell = await (await env.ASSETS.fetch(new URL('/', url))).text()
  const href = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/.exec(shell)?.[1]
  if (!href) return ''

  const response = await env.ASSETS.fetch(new URL(href, url))
  return response.ok ? await response.text() : ''
}

/* ------------------------------------------------------------------ the api */

async function api(request: Request, env: Env, url: URL, who: Identity): Promise<Response> {
  const segments = url.pathname.split('/').filter(Boolean) // ['api', 'pages', id?, action?, rest?]

  if (segments[1] === 'me') return json({ authed: who.authed, email: who.email ?? null })

  /*
   * The library is for the team, so it is Access-only throughout: a share code opens one page and
   * says nothing about which others exist.
   */
  if (segments[1] === 'library') {
    if (!who.authed) return signInNeeded(url)
    const library = env.LIBRARY.getByName(LIBRARY_NAME)
    if (segments[2] === 'socket') {
      if (request.headers.get('Upgrade') !== 'websocket') return oops('Expected a WebSocket', 426)
      return library.fetch(new Request('https://library/socket', request))
    }
    if (segments[2] !== undefined) return oops('No such endpoint', 404)
    if (request.method !== 'GET') return oops('Method not allowed', 405)
    return json(await library.list())
  }

  if (segments[1] !== 'pages') return oops('No such endpoint', 404)

  const [, , id, action, rest] = segments

  // Creating a page is a signed-in act, and it happens at `/edit/new` so Access can prompt for it.
  if (!id) return oops('Create a page at /edit/new', 404)
  if (!VALID_ID.test(id)) return oops('Not a page id', 404)

  const page = env.PAGES.getByName(id)

  /** Everything an editor can do. One place, so a route cannot be added without deciding this. */
  const editorOnly = () => (who.authed ? null : signInNeeded(url))

  switch (action) {
    case 'socket': {
      if (request.headers.get('Upgrade') !== 'websocket') return oops('Expected a WebSocket', 426)

      const read = await mayRead(request, env, url, id, who)
      if (!read.ok) return oops('No access to this page', 403)

      /*
       * The upgrade is the only route that hands the request to the object rather than calling a
       * method on it, and the URL is rebuilt rather than forwarded. That is what makes `write` a
       * decision this file gets to make: a client that appended `?write=1` to its own socket URL
       * would otherwise be granting itself the permission it is asking for.
       */
      const target = new URL('https://page/socket')
      if (who.authed) target.searchParams.set('write', '1')
      if (who.authed && who.email) target.searchParams.set('by', who.email)
      return page.fetch(new Request(target, request))
    }

    /*
     * The images on this page.
     *
     * The two halves are gated differently on purpose, and this is the clearest case of why the
     * Worker checks Access itself: **putting** an image on a page is editing it, while **seeing** one
     * is reading it, so a share link that opens the page has to open its pictures too or a shared
     * page arrives full of holes.
     */
    case 'assets': {
      if (!rest) {
        const refused = editorOnly()
        if (refused) return refused
        if (request.method !== 'POST') return oops('Method not allowed', 405)

        const type = (request.headers.get('content-type') ?? '').split(';')[0].trim()
        if (!IMAGE_TYPES.has(type)) return oops(`${type || 'That file'} is not an image`, 415)

        const size = Number(request.headers.get('content-length') ?? 0)
        if (size > UPLOAD_LIMIT) {
          return oops(`That image is ${Math.round(size / 1024 / 1024)}MB; the limit is ${UPLOAD_LIMIT / 1024 / 1024}MB`, 413)
        }

        const bytes = await request.arrayBuffer()
        if (!bytes.byteLength) return oops('No image in that upload', 400)
        // Checked again against what actually arrived: `Content-Length` is the client's claim, and a
        // chunked upload need not send one at all.
        if (bytes.byteLength > UPLOAD_LIMIT) {
          return oops(`That image is ${Math.round(bytes.byteLength / 1024 / 1024)}MB; the limit is ${UPLOAD_LIMIT / 1024 / 1024}MB`, 413)
        }

        const asset = newAssetId()
        await env.UPLOADS.put(assetKey(id, asset), bytes, {
          httpMetadata: { contentType: type },
        })
        return json({ id: asset, url: `/api/pages/${id}/assets/${asset}` }, 201)
      }

      /*
       * **Reading an image needs nothing.** This is the one route on a page that is not gated, and it
       * is a deliberate exception rather than an oversight.
       *
       * A gated image is a picture that only renders inside this builder. Paste the handoff code into
       * a branch and it is a broken image; open the artefact anywhere the cookie did not follow and it
       * is a broken image. The point of a mock is to be looked at, and every one of those failures is
       * this check doing its job.
       *
       * What stands in for the gate is the id: 128 bits from `crypto.getRandomValues`, so a URL cannot
       * be guessed, walked, or arrived at from the page's name. That is the honest boundary — **anyone
       * holding the link holds the image** — and it is the same bargain as the share code one level
       * up. The page's *contents* stay gated; a photograph on it does not.
       */
      if (request.method !== 'GET') return oops('Method not allowed', 405)
      if (!VALID_ASSET.test(rest)) return oops('Not an image id', 404)

      const stored = await env.UPLOADS.get(assetKey(id, rest))
      if (!stored) return oops('No such image', 404)

      /*
       * `public` and `immutable`, which together are what make this cheap: the id is random and the
       * bytes behind it never change, so nothing ever needs to revalidate. A browser fetches each
       * image once for a year, and Cloudflare's own cache answers everyone else's first request
       * without the Worker or the bucket being touched at all.
       *
       * `public` is only correct *because* the route is ungated. The two go together — a shared cache
       * holding a gated response would hand it to whoever asked next — so if this ever goes back
       * behind a check, this header has to go back to `private` with it.
       *
       * The `Content-Security-Policy` is what makes SVG safe to accept. Script inside an SVG never
       * runs when it is drawn by an `<img>`, but *navigating* to this URL renders it as a document on
       * this origin, where it would run with the page's own privileges. The policy denies it
       * everything, and `nosniff` stops the type from being reinterpreted on the way.
       */
      return new Response(stored.body, {
        headers: {
          'content-type': stored.httpMetadata?.contentType ?? 'application/octet-stream',
          'content-length': String(stored.size),
          etag: stored.httpEtag,
          'cache-control': 'public, max-age=31536000, immutable',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
          'x-content-type-options': 'nosniff',
        },
      })
    }

    case 'history':
      return editorOnly() ?? (request.method === 'GET' ? json(await page.history()) : oops('Method not allowed', 405))

    case 'restore': {
      const refused = editorOnly()
      if (refused) return refused
      if (request.method !== 'POST') return oops('Method not allowed', 405)

      const { rev } = (await request.json()) as { rev?: number }
      if (typeof rev !== 'number') return oops('Which revision?', 400)
      return json(await page.restore(rev, who.email))
    }

    case 'status': {
      const refused = editorOnly()
      if (refused) return refused
      if (request.method !== 'POST') return oops('Method not allowed', 405)

      const { status } = ((await request.json().catch(() => ({}))) ?? {}) as { status?: unknown }
      if (!isPageStatus(status)) return oops('Not a status', 400)
      return json(await page.setStatus(status, who.email))
    }

    /*
     * The conversation. Access-only in both directions: comments are internal, and a share code
     * opens the page without opening what the team said about it.
     */
    case 'comments': {
      const refused = editorOnly()
      if (refused) return refused
      const by = who.email ?? 'unknown'

      if (!rest) {
        if (request.method === 'GET') return json(await page.comments())
        if (request.method !== 'POST') return oops('Method not allowed', 405)
        const body = (await request.json().catch(() => ({}))) as {
          thread?: string
          node?: string | null
          point?: { x: number; y: number } | null
          body?: unknown
        }
        return json(await page.addComment(body, by), 201)
      }

      if (request.method === 'DELETE') return json(await page.deleteComment(rest, by))
      if (request.method !== 'PATCH') return oops('Method not allowed', 405)

      const body = (await request.json().catch(() => ({}))) as { body?: unknown; resolved?: unknown }
      if (typeof body.resolved === 'boolean') return json(await page.resolveThread(rest, body.resolved, by))
      return json(await page.editComment(rest, body.body, by))
    }

    /*
     * Named versions — the frozen deliverable. Reading follows the page (a share code that opens the
     * page opens what was handed over); making one is an editor's act, and does the freezing here
     * because the Worker holds the renderer, the built files and the bucket.
     */
    case 'versions': {
      // `/api/pages/:id/versions/:n/restore` — `rest` is the number, the segment after it the verb.
      const verb = segments[5]
      if (!rest) {
        if (request.method === 'GET') {
          const read = await mayRead(request, env, url, id, who)
          return read.ok ? json(await page.versions()) : oops('No access to this page', 403)
        }
        const refused = editorOnly()
        if (refused) return refused
        if (request.method !== 'POST') return oops('Method not allowed', 405)

        const body = (await request.json().catch(() => ({}))) as { name?: unknown; note?: unknown; status?: unknown }
        const made = await page.createVersion(body.name, body.note, who.email, body.status)
        await freeze(env, url, id, made.version.number, made.doc)
        return json({ version: made.version, versions: await page.versions() }, 201)
      }

      const n = Number(rest)
      if (!Number.isInteger(n) || n < 1) return oops('Not a version number', 404)
      if (verb === 'restore') {
        const refused = editorOnly()
        if (refused) return refused
        if (request.method !== 'POST') return oops('Method not allowed', 405)
        return json(await page.restoreVersion(n, who.email))
      }
      if (verb !== undefined) return oops('No such endpoint', 404)
      if (request.method !== 'GET') return oops('Method not allowed', 405)

      const read = await mayRead(request, env, url, id, who)
      if (!read.ok) return oops('No access to this page', 403)
      const found = await page.version(n)
      return found ? json(found) : oops(`No version ${n}`, 404)
    }

    case 'share': {
      const refused = editorOnly()
      if (refused) return refused
      if (request.method !== 'POST') return oops('Method not allowed', 405)

      const { rotate } = ((await request.json().catch(() => ({}))) ?? {}) as { rotate?: boolean }
      const code = rotate ? await page.rotateShareCode() : await page.shareCode()
      return json({ code, url: new URL(`/p/${id}?k=${code}`, url).toString() })
    }

    case undefined:
      break

    default:
      return oops('No such endpoint', 404)
  }

  switch (request.method) {
    case 'GET': {
      const read = await mayRead(request, env, url, id, who)
      if (!read.ok) return oops('No access to this page', 403)

      const response = json(await page.snapshot())
      /*
       * The moment the code is accepted it moves out of the URL and into a cookie. This is the only
       * response that does it, because this is the first request a reader's browser makes with `?k=`
       * on it — everything afterwards, including the artefact and the WebSocket handshake, travels on
       * the cookie.
       */
      return read.code ? setKeyCookie(response, id, read.code, url) : response
    }

    case 'PUT': {
      const refused = editorOnly()
      if (refused) return refused

      const body = (await request.json()) as { doc?: unknown; baseRev?: number }
      if (typeof body.baseRev !== 'number') return oops('A save must say what it was based on', 400)

      const result = await page.save(body.doc, body.baseRev, undefined, who.email)
      // 409 is the honest answer to "I edited the version before last": the client has to look at
      // what came back before it can try again.
      return json(result, result.accepted ? 200 : 409)
    }

    case 'DELETE': {
      const refused = editorOnly()
      if (refused) return refused

      await page.destroy()
      // The images are the one thing the object cannot take with it: `deleteAll` empties its own
      // storage, and the bucket is not its storage. Without this, deleting a page leaves its
      // photographs behind, paid for and reachable by nobody.
      await deleteAssets(env, id)
      return new Response(null, { status: 204 })
    }

    default:
      return oops('Method not allowed', 405)
  }
}

/**
 * Removes every image a page owns.
 *
 * Listed and deleted in pages rather than in one call: a bucket lists a bounded number of keys at a
 * time, and a page that has been worked on for months can hold more images than one listing returns.
 * Stopping at the first batch would leave the rest orphaned, which is the failure that is invisible
 * until a storage bill arrives.
 */
async function deleteAssets(env: Env, page: string): Promise<void> {
  let cursor: string | undefined

  do {
    const listing = await env.UPLOADS.list({ prefix: `pages/${page}/`, cursor })
    if (listing.objects.length) {
      await env.UPLOADS.delete(listing.objects.map((object) => object.key))
    }
    cursor = listing.truncated ? listing.cursor : undefined
  } while (cursor)
}

/**
 * The answer to an unauthenticated attempt at an editor's route.
 *
 * `401` with somewhere to go rather than a bare refusal: the builder turns this into a sign-in link,
 * and the link points at the one path an Access application covers, so following it produces the
 * login screen rather than another 401.
 */
const signInNeeded = (url: URL) =>
  json({ error: 'Sign in to edit', signIn: new URL('/edit/new', url).toString() }, 401)

/* ------------------------------------------------------------------ the builder's own files */

/**
 * Serves the built builder, and its shell for anything that is not a file.
 *
 * `/edit/dawn-harbor-4f2` and `/p/dawn-harbor-4f2` are routes inside a single-page app, not files on
 * disk, so they have to be answered with `index.html` and left for the browser to work out.
 *
 * The split is made **here, on the path**, rather than by trying the assets binding first and
 * catching a miss. Two reasons, both learned the hard way: the binding answers an unknown path with a
 * `307` to `/` rather than a `404`, so there is no miss to catch; and its own single-page-app mode
 * would happily answer a mistyped `/api/` path with HTML and a `200`, which turns a typo in a fetch
 * call into a JSON parse error a long way from its cause.
 *
 * A request for a file — anything with an extension — is passed through and allowed to 404 honestly.
 * Everything else is fetched as `/` rather than as `/index.html`, because the binding's HTML handling
 * treats the explicit filename as non-canonical and answers it with a redirect back to `/`.
 */
async function assets(request: Request, env: Env, url: URL): Promise<Response> {
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return env.ASSETS.fetch(request)

  const shell = await env.ASSETS.fetch(new Request(new URL('/', url), request))
  // Rewritten, so the browser keeps the address it asked for and the app can route on it.
  return new Response(shell.body, shell)
}
