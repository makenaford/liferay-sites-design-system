/**
 * Where mockup footage lives.
 *
 * Videos are **served, not bundled**: they sit in the git-ignored `media/` folder, Storybook serves it
 * at `/media`, and the page data holds a URL rather than an imported module. See `media/README.md` for
 * why, and for how to get the files onto a fresh clone.
 *
 * The indirection buys two things. A missing file costs a 404 and an empty slot instead of a build
 * that will not compile — which is the normal state of a fresh clone here. And the base can be pointed
 * at real hosting for a deployed build without touching a single page:
 *
 * ```sh
 * VITE_MEDIA_BASE=https://cdn.example.com/liferay-media pnpm build-storybook
 * ```
 */

/**
 * `import.meta.env` exists under Vite, which is both Storybook and the library build — but this module
 * is also read by Node when the schema is imported outside a bundler, so it is reached for defensively
 * rather than assumed.
 */
const BASE: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_MEDIA_BASE) ||
  '/media'

/** Resolves a file in `media/` to a URL. Absolute URLs are passed through untouched. */
export function mediaUrl(file: string): string {
  if (/^(https?:)?\/\//.test(file)) return file
  return `${BASE.replace(/\/$/, '')}/${file.replace(/^\//, '')}`
}
