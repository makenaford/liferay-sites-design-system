/**
 * The page as a file.
 *
 * The document is the truth and the DOM is derived from it, so until now there was no *artefact* — a
 * published page was an empty shell plus 700KB of JavaScript that built the page in the browser. This
 * produces the other thing: one self-contained `.html` file with the styles inlined, which can be
 * emailed, archived, opened offline, or diffed.
 *
 * ## One generator, two callers
 *
 * The same functions run in the browser, where the code panel shows the markup beside the canvas, and
 * in the Worker, where `/p/:id.html` serves it. That is deliberate: two generators would drift, and
 * then the HTML a designer reviewed would not be the HTML anyone received. So everything here is
 * plain string work — no `DOMParser`, no `document` — because workerd has neither.
 *
 * ## What the artefact is not
 *
 * It is a **document, not an application**. The markup and the styling are exact, and everything that
 * is drawn is there; but a carousel does not scroll, a tab bar does not swap, and a marquee does not
 * move, because all of that is React and there is no React in the file. `/p/:id` remains the live
 * version. This is the one you send to someone who just needs to see the page.
 */
import { renderToStaticMarkup } from 'react-dom/server.browser'
import type { PageDocument } from './document'
import { Renderer } from './Renderer'
import { PageTheme } from './PageTheme'
import { NODE_ATTR } from './Renderer'

/* ------------------------------------------------------------------ rendering */

/**
 * The page's markup, with no surrounding document.
 *
 * `marked` adds the builder's node attributes — used by the code panel to work out which lines belong
 * to which node, and stripped again by `format` before anything is shown or served.
 */
export const renderMarkup = (doc: PageDocument, marked = false): string =>
  renderToStaticMarkup(
    <PageTheme colorScheme={doc.colorScheme}>
      <Renderer doc={doc} marked={marked} />
    </PageTheme>,
  )

/* ------------------------------------------------------------------ formatting */

/** Elements that never have a closing tag, so the indenter must not wait for one. */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
])

export interface Formatted {
  text: string
  /** Node id -> the first and last line it occupies, 1-based. What links the panel to the canvas. */
  lines: Record<string, [number, number]>
}

type Token = { kind: 'open' | 'close' | 'self' | 'text'; text: string; tag?: string; node?: string }

/** Splits markup into tags and the text between them. */
function tokenise(markup: string): Token[] {
  const tokens: Token[] = []
  const pattern = /<\/?([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g

  let at = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(markup))) {
    if (match.index > at) {
      const text = markup.slice(at, match.index)
      if (text.trim()) tokens.push({ kind: 'text', text: text.trim() })
    }

    const [whole, tag, attributes = ''] = match
    const node = /\bdata-sds-node="([^"]*)"/.exec(attributes)?.[1]

    tokens.push({
      kind: whole.startsWith('</') ? 'close' : whole.endsWith('/>') || VOID.has(tag) ? 'self' : 'open',
      text: whole,
      tag,
      node,
    })
    at = pattern.lastIndex
  }

  const tail = markup.slice(at)
  if (tail.trim()) tokens.push({ kind: 'text', text: tail.trim() })

  return tokens
}

/**
 * Indents the markup, and takes the builder's markers back out.
 *
 * The markers are the reason this cannot simply be a pretty-printer over the final string. To know
 * which lines belong to a node, the markup has to be rendered *with* the node attributes; to be worth
 * looking at, the output must not contain them. So the wrapper spans are dropped as they go past —
 * they have `display: contents` and mean nothing outside the builder — and the line each one opened
 * and closed on is recorded on the way through.
 */
export interface FormatOptions {
  /**
   * Replaces a `<style>` element's contents with a one-line note.
   *
   * The theme's CSS variables are emitted by `MantineProvider` as a single style element several
   * thousand characters long. In the file it belongs there and must be kept; in the code panel it is
   * a wall of text above the markup somebody actually wants to read.
   */
  hideStyles?: boolean
}

export function format(markup: string, options: FormatOptions = {}): Formatted {
  const tokens = tokenise(markup)
  const out: string[] = []
  const lines: Record<string, [number, number]> = {}

  /** Open elements, innermost last. `node` is set for a marker span that was dropped. */
  const stack: { dropped: boolean; node?: string; start?: number; style?: boolean }[] = []
  let depth = 0

  const push = (text: string) => out.push(`${'  '.repeat(depth)}${text}`)

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]

    if (token.kind === 'text') {
      push(stack[stack.length - 1]?.style && options.hideStyles ? '/* theme variables */' : token.text)
      continue
    }

    if (token.kind === 'self') {
      push(token.text)
      continue
    }

    if (token.kind === 'open') {
      // A marker: not part of the page, so it is dropped — but it is what the mapping is built from.
      if (token.node) {
        stack.push({ dropped: true, node: token.node, start: out.length + 1 })
        continue
      }

      /*
       * An element holding one run of text goes on a single line — `<h1>Launch faster</h1>` rather
       * than three lines for one heading. Without this a page of headings and paragraphs is three
       * times longer than it needs to be and much harder to scan.
       */
      const next = tokens[i + 1]
      const after = tokens[i + 2]
      if (token.tag !== 'style' && next?.kind === 'text' && after?.kind === 'close' && after.tag === token.tag) {
        push(`${token.text}${next.text}</${token.tag}>`)
        i += 2
        continue
      }

      /*
       * An element with nothing in it, likewise. These are not rare: an inline SVG icon is mostly
       * `<stop>` and `<clipPath>` elements with no children, and two lines each turns one glyph into
       * forty lines of nothing.
       */
      if (next?.kind === 'close' && next.tag === token.tag) {
        push(`${token.text}</${token.tag}>`)
        i += 1
        continue
      }

      push(token.text)
      stack.push({ dropped: false, style: token.tag === 'style' })
      depth += 1
      continue
    }

    // close
    const open = stack.pop()
    if (open?.dropped) {
      if (open.node) lines[open.node] = [open.start ?? 1, Math.max(open.start ?? 1, out.length)]
      continue
    }
    depth = Math.max(0, depth - 1)
    push(token.text)
  }

  return { text: out.join('\n'), lines }
}

/* ------------------------------------------------------------------ the file */

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * The whole file: one `<html>`, the stylesheet inlined, and the page inside it.
 *
 * The CSS is inlined rather than linked because the point of the artefact is that it is **one file**.
 * A link to `/assets/index-abc.css` would make it a file that only works while this Worker is up and
 * the hash has not changed, which is not an artefact — it is a bookmark.
 */
export function htmlDocument(doc: PageDocument, css: string, body: string): string {
  return `<!doctype html>
<html lang="en" data-mantine-color-scheme="${doc.colorScheme}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escape(doc.title)}</title>
    <meta name="generator" content="Liferay Sites page builder" />
    <!--
      Built from /edit/${escape(doc.id)}, revision ${doc.rev}.

      A snapshot, not the application: the markup and the styling are exact, but nothing here runs.
      Carousels do not scroll and tab bars do not swap, because that behaviour is React and there is
      no React in this file. The live page is at /p/${escape(doc.id)}.
    -->
    <style>
${css}
    </style>
    <style>
      html, body { margin: 0; }
      body { background: var(--mantine-color-body); }
    </style>
  </head>
  <body>
${body}
  </body>
</html>
`
}

/** Everything at once, for a caller that just wants the file. */
export function pageToHtml(doc: PageDocument, css: string): string {
  return htmlDocument(doc, css, format(renderMarkup(doc)).text)
}

export { NODE_ATTR }
