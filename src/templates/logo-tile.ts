/*
 * Its own module to keep `shared.tsx` and `site-nav-render.tsx` from importing each other.
 *
 * `SITE_NAV_ITEMS` is built at module scope, so it calls this while the module graph is still
 * initialising — and in a cycle that resolves to `undefined` rather than to a function.
 */
/** The 270×180 logo tile a customer-story card carries, drawn as a brand-coloured field. */
export const logoTile = (name: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="360" viewBox="0 0 540 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${hue} 70% 34%)"/>
    <stop offset="1" stop-color="hsl(${hue} 80% 12%)"/>
  </linearGradient></defs>
  <rect width="540" height="360" fill="url(#g)"/>
  <text x="270" y="196" font-size="46" font-weight="700" text-anchor="middle"
        fill="#fff" font-family="Source Sans 3, sans-serif">${name}</text>
</svg>`)}`
