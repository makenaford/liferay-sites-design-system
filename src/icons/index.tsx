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
