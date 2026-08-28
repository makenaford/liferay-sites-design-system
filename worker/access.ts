/**
 * Who is asking.
 *
 * Cloudflare Access does the actual authenticating — the email one-time-code screen, the identity
 * provider, the session — and hands the origin a signed assertion. This verifies that assertion, and
 * nothing else here trusts anything about the caller that did not come through it.
 *
 * ## Why the Worker verifies at all
 *
 * An Access application protects a *path*, and its guarantee holds for traffic that arrives through
 * the hostname it is attached to. Two things follow:
 *
 * - **Paths cannot be split by method.** `POST /api/pages/x` must require a login and
 *   `GET /api/pages/x` must not, because that is the one a share link needs. Access sees one path.
 * - **A Worker has other front doors.** `*.workers.dev`, and any hostname not covered by the
 *   application, reach the same code with no Access in front of them at all.
 *
 * So Access is what makes the login *happen*, and this is what makes it *count*. The two are not
 * redundant.
 *
 * ## Failing closed
 *
 * With no team domain and no audience configured there is no way to tell an editor from a stranger, so
 * `identify` reports nobody as signed in and every gated route refuses. A deployment that has not been
 * configured yet is inert rather than open.
 */

/** What a caller has proved about themselves. */
export interface Identity {
  /** True only for a verified Access assertion — or for the localhost bypass described below. */
  authed: boolean
  email?: string
}

export interface AccessConfig {
  /** `yourteam.cloudflareaccess.com`. */
  ACCESS_TEAM_DOMAIN?: string
  /** The Access application's Audience tag. */
  ACCESS_AUD?: string
  /**
   * Set in `.dev.vars` so `wrangler dev` is usable without a Cloudflare tunnel and a real login.
   *
   * Honoured **only for requests to localhost**, which is what stops it from being a way to open a
   * deployed Worker: a production hostname ignores it however the variable got set. `.dev.vars` is
   * never uploaded by `wrangler deploy` either, so this is two independent locks on the same door.
   */
  ACCESS_DEV_OPEN?: string
}

const ANONYMOUS: Identity = { authed: false }

/* ------------------------------------------------------------------ the signing keys */

interface Jwk {
  kid: string
  kty: string
  n: string
  e: string
}

/**
 * Access's public keys, cached for the life of the isolate.
 *
 * Fetching them per request would put a round trip in front of every save. They rotate, so the cache
 * has a short life and a miss on `kid` refetches immediately rather than waiting for it to expire —
 * which is what makes a rotation invisible instead of a minute of failed logins.
 */
let cache: { at: number; domain: string; keys: Map<string, CryptoKey> } | null = null

const CACHE_MS = 10 * 60 * 1000

async function signingKeys(domain: string, force = false): Promise<Map<string, CryptoKey>> {
  const fresh = cache && cache.domain === domain && Date.now() - cache.at < CACHE_MS
  if (fresh && !force) return cache!.keys

  const response = await fetch(`https://${domain}/cdn-cgi/access/certs`)
  if (!response.ok) throw new Error(`Access certs: ${response.status}`)

  const { keys } = (await response.json()) as { keys: Jwk[] }
  const imported = new Map<string, CryptoKey>()

  for (const key of keys) {
    imported.set(
      key.kid,
      await crypto.subtle.importKey(
        'jwk',
        { kty: key.kty, n: key.n, e: key.e, alg: 'RS256', ext: true },
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      ),
    )
  }

  cache = { at: Date.now(), domain, keys: imported }
  return imported
}

/* ------------------------------------------------------------------ the token */

const decode = (segment: string): Uint8Array => {
  // JWTs are base64url: the alphabet differs and the padding is dropped.
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(segment.length / 4) * 4, '=')
  const binary = atob(base64)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

const decodeJson = <T,>(segment: string): T =>
  JSON.parse(new TextDecoder().decode(decode(segment))) as T

interface Claims {
  aud?: string | string[]
  iss?: string
  exp?: number
  nbf?: number
  email?: string
}

/**
 * Verifies one assertion and returns its claims, or `null` for anything that does not check out.
 *
 * Deliberately silent about *which* check failed. A caller has no legitimate use for the difference
 * between "expired", "wrong audience" and "signature does not match", and the routes above treat all
 * three the same way.
 */
async function verify(token: string, domain: string, audience: string): Promise<Claims | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [rawHeader, rawPayload, rawSignature] = parts

  let header: { alg?: string; kid?: string }
  let claims: Claims
  try {
    header = decodeJson(rawHeader)
    claims = decodeJson(rawPayload)
  } catch {
    return null
  }

  // Only RS256, and only a key named by the token. Accepting `alg: none` is the classic JWT hole.
  if (header.alg !== 'RS256' || !header.kid) return null

  let keys = await signingKeys(domain)
  if (!keys.has(header.kid)) keys = await signingKeys(domain, true)

  const key = keys.get(header.kid)
  if (!key) return null

  const signed = new TextEncoder().encode(`${rawHeader}.${rawPayload}`)
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    decode(rawSignature) as unknown as BufferSource,
    signed as unknown as BufferSource,
  )
  if (!ok) return null

  const now = Math.floor(Date.now() / 1000)
  if (typeof claims.exp === 'number' && claims.exp < now) return null
  if (typeof claims.nbf === 'number' && claims.nbf > now) return null

  /*
   * The audience check is the one that matters most and is the easiest to leave out. A signature from
   * this team is valid for *every* Access application the team has; without this, a token minted for
   * some unrelated internal tool would be accepted here as an editor.
   */
  const audiences = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : []
  if (!audiences.includes(audience)) return null

  if (claims.iss && claims.iss !== `https://${domain}`) return null

  return claims
}

/* ------------------------------------------------------------------ the entry point */

export const cookie = (request: Request, name: string): string | undefined =>
  request.headers
    .get('Cookie')
    ?.split(';')
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(`${name}=`))
    ?.slice(name.length + 1)

/** Whether a request is running against a developer's own machine. */
const isLocal = (url: URL) =>
  url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]'

export async function identify(request: Request, env: AccessConfig, url: URL): Promise<Identity> {
  if (env.ACCESS_DEV_OPEN === 'true' && isLocal(url)) {
    return { authed: true, email: 'dev@localhost' }
  }

  const domain = env.ACCESS_TEAM_DOMAIN
  const audience = env.ACCESS_AUD
  if (!domain || !audience) return ANONYMOUS

  /*
   * The header is present on paths an Access application covers. The cookie is set for the whole
   * hostname once a login has happened anywhere on it — which is what lets a login taken at
   * `/edit/…` authenticate the `PUT /api/pages/…` that follows, on a path Access never sees.
   */
  const token = request.headers.get('Cf-Access-Jwt-Assertion') ?? cookie(request, 'CF_Authorization')
  if (!token) return ANONYMOUS

  try {
    const claims = await verify(token, domain, audience)
    return claims ? { authed: true, email: claims.email } : ANONYMOUS
  } catch {
    // The certs endpoint being unreachable is an outage, not an authorisation. Refuse, do not admit.
    return ANONYMOUS
  }
}
