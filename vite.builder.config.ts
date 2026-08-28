import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Builds the page builder — an application, unlike `vite.config.ts`, which builds the library.
 *
 * They cannot be one config. The library build is a `lib` target with React and Mantine left external,
 * because a component library must not ship a second copy of Mantine into its host. The builder is the
 * opposite: a self-contained bundle that a Worker serves to a browser, so everything it needs has to
 * be *in* it. Two targets, two files, and the Storybook config already deletes the `lib` target for
 * the same reason.
 */
export default defineConfig({
  plugins: [react()],
  /*
   * The app's own directory is the Vite root, which keeps its `index.html` from colliding with the
   * library's dev entry at the repository root and makes the built output land as `index.html` —
   * which is the file the Worker falls back to for `/edit/:id` and `/p/:id`.
   */
  root: 'src/builder',
  build: {
    outDir: '../../dist/builder',
    emptyOutDir: true,
  },
  server: {
    /**
     * `pnpm builder:dev` serves the app from Vite and everything under `/api` from `wrangler dev`,
     * so the builder gets hot reloading while talking to a real Durable Object. Without this the
     * choice would be a fast loop against a fake, or a real one with a full rebuild per change.
     */
    proxy: {
      '/api': { target: 'http://127.0.0.1:8787', ws: true, changeOrigin: true },
    },
  },
})
