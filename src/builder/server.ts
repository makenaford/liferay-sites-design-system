/**
 * What the Worker needs from the builder.
 *
 * The Worker cannot import these from source: they pull in the whole component library, and **CSS
 * Module class names are chosen by the bundler** — wrangler's esbuild names them differently from
 * Vite, so a Worker-bundled renderer emits markup whose classes are absent from the stylesheet Vite
 * built for the browser. See `vite.ssr.config.ts`.
 *
 * So this is the entry point Vite builds into `dist/ssr/`, and the Worker reaches it through the
 * `#ssr` alias. Keeping it to one small file makes the boundary legible: everything crossing from the
 * builder into the Worker is listed here — and it is worth keeping short. The starter page briefly
 * lived here too, and the story modules it reads took the bundle past what a Worker is allowed to be.
 */
export { pageToHtml } from './html'
