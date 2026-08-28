import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Builds the part of the builder that runs inside the Worker — the HTML renderer for `/p/:id.html`,
 * and the starter page a new document is created with.
 *
 * ## Why this exists at all
 *
 * The obvious thing is to let wrangler bundle `src/builder/html.tsx` along with the rest of the
 * Worker, and it very nearly works — the markup comes out correct and the page comes out unstyled.
 *
 * The reason is CSS Modules. `components.module.css` gives every class a scoped name, and **the
 * bundler chooses that name**: Vite emits `_root_1uwax_29`, esbuild emits `components_root`. The
 * Worker would therefore render markup referring to classes that the built stylesheet — produced by
 * Vite, for the browser — does not contain. Two bundlers, two vocabularies, no overlap.
 *
 * So the renderer is built by Vite as well, from the same source, and the Worker imports the result.
 * One bundler, one set of class names, and the artefact matches the live page because both were
 * compiled by the same thing.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: 'dist/ssr',
    emptyOutDir: true,
    lib: { entry: 'src/builder/server.ts', formats: ['es'], fileName: () => 'server.js' },
    /*
     * The stylesheet the client build already produces is the one that gets inlined, so the copy this
     * build would emit is dead weight. It cannot be turned off entirely, but it can be kept in one
     * file that nothing reads.
     */
    cssCodeSplit: false,
  },
  ssr: {
    /*
     * Bundle everything rather than leaving imports for the runtime to resolve. `webworker` is what
     * makes `react-dom/server.browser` resolve to the build that has no Node streams in it — the Node
     * build imports `stream` and fails to start under workerd.
     */
    noExternal: true,
    target: 'webworker',
  },
})
