/**
 * Getting a designer's image into the page.
 *
 * ## Why the browser re-encodes before uploading
 *
 * Not to fit a limit — the bucket behind this would take the original happily. The file a designer
 * drops is the file the page then serves, and a 6000px photograph behind a 600px card is a slow page
 * however cheaply it is stored. Resizing at the point of upload is what makes the mock load the way
 * the real site would, and it costs a second here rather than a second on every view.
 *
 * It also puts the one refusal a designer can act on in front of them at the moment they can act on
 * it — while they still have the file open — instead of surfacing as a broken image later.
 *
 * What is **not** touched: vector and animated formats. Redrawing an SVG through a canvas would
 * rasterise it, and a GIF would come back as its first frame. Both are passed through as they are and
 * refused if they are too large, because quietly returning something else is worse than a refusal.
 */

/** Matches `UPLOAD_LIMIT` in `worker/index.ts`, which is what actually enforces it. */
export const MAX_BYTES = 10 * 1024 * 1024

/**
 * The longest edge a stored image keeps.
 *
 * 2400 is a full-bleed hero on a 2x display and comfortably past anything else a page does with a
 * picture. Above it there is nothing to see and a great deal to download.
 */
const MAX_EDGE = 2400

/**
 * Under this, a raster file is left alone.
 *
 * Re-encoding a file that is already small costs quality and saves nothing, and the designer's own
 * export is more likely to be right about its own artwork than a second pass through a canvas.
 */
const LEAVE_ALONE = 900_000

/** Formats a canvas must not touch — one because it has no pixels, one because it has too many. */
const AS_IS = new Set(['image/svg+xml', 'image/gif'])

const ACCEPTED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif', ...AS_IS])

/** `image/jpeg` reads as `JPEG` in a message about what went wrong. */
const readableType = (type: string) => type.replace(/^image\//, '').toUpperCase()

/** `1.4MB` past a megabyte, `840KB` under it — the unit a person would have used. */
const size = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${Math.round(bytes / 1024)}KB`

/**
 * Draws a bitmap at a given scale and encodes it as WebP.
 *
 * WebP rather than the original format because it is the one every browser this builder runs in can
 * both write and read, and it is materially smaller than JPEG at the same quality — which is the
 * whole point of the exercise.
 */
async function encode(bitmap: ImageBitmap, scale: number, quality: number): Promise<Blob> {
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser will not draw the image')
  context.drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  )
  if (!blob) throw new Error('This browser will not re-encode the image')
  return blob
}

/**
 * The bytes to store for a dropped file.
 *
 * Returns the file itself when it is already small enough, and a re-encoded copy when it is not. The
 * loop is a fallback for the case a single pass does not get under the limit — a very large flat
 * illustration, say — and it gives up rather than degrading an image past the point of being useful.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (!ACCEPTED.has(file.type)) {
    throw new Error(`${file.type || 'That file'} is not an image this page can hold`)
  }

  if (AS_IS.has(file.type)) {
    if (file.size > MAX_BYTES) {
      throw new Error(
        `That ${readableType(file.type)} is ${size(file.size)} and cannot be resized without changing what it is. The limit is ${size(MAX_BYTES)}.`,
      )
    }
    return file
  }

  const bitmap = await createImageBitmap(file)
  try {
    const longest = Math.max(bitmap.width, bitmap.height)
    if (file.size <= LEAVE_ALONE && longest <= MAX_EDGE) return file

    let scale = Math.min(1, MAX_EDGE / longest)
    let quality = 0.85

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const blob = await encode(bitmap, scale, quality)
      if (blob.size <= MAX_BYTES) return blob
      // Quality first — it is nearly free visually — and only then the dimensions.
      if (quality > 0.6) quality = 0.6
      else scale *= 0.75
    }

    throw new Error(`That image will not fit under ${size(MAX_BYTES)}. Try exporting it smaller.`)
  } finally {
    bitmap.close()
  }
}

/**
 * Stores a file against a page and returns the URL to put in the node's `src`.
 *
 * The URL is relative, so a page keeps working under whichever hostname it is opened on, and it is
 * behind the same gate as the page itself — a reader with the share link can see it, and nobody else
 * can. See the `assets` route in `worker/index.ts`.
 */
export async function uploadImage(pageId: string, file: File): Promise<string> {
  const blob = await prepareImage(file)

  const response = await fetch(`/api/pages/${pageId}/assets`, {
    method: 'POST',
    headers: { 'content-type': blob.type },
    body: blob,
  })

  const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!response.ok || !body.url) throw new Error(body.error ?? 'The upload failed')

  return body.url
}
