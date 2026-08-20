/**
 * The icon set.
 *
 * Icons come from [MingCute](https://mingcute.com) (Apache-2.0) via the `@mingcute/svg` devDependency,
 * and are generated into `generated.tsx` by `pnpm icons`. The Figma library's icons are MingCute's —
 * `system/refresh_2` and `arrow/arrow_right` there are `refresh_2` and `arrow_right` here — so the two
 * sides stay aligned by using the same set rather than re-exporting each glyph by hand.
 *
 * To add one: put its MingCute name in `manifest.json` and run `pnpm icons`. Find the name with the
 * MingCute MCP server's `search_icons`, or browse mingcute.com.
 */
export * from './generated'

/**
 * The illustrative set, generated into `glass.generated.tsx` by `pnpm glass-icons` from the SVGs in
 * `assets/glass-icons/`. These are 64px illustrations with their own gradients — the ones a card puts
 * in a 48px container — so they do not inherit `currentColor` and are not interchangeable with the UI
 * glyphs above.
 *
 * To add one: put its path (`Data/DAM`) in `glass-manifest.json` and run `pnpm glass-icons`.
 */
export * from './glass.generated'
