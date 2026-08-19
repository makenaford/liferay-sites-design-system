/**
 * PostCSS config for Mantine. `postcss-preset-mantine` provides the `light-dark()`, `rem()`/`em()`
 * and `@mixin` helpers Mantine's styles rely on; `postcss-simple-vars` exposes the breakpoint
 * variables below to CSS modules, so a media query can be written as
 * `@media (max-width: $mantine-breakpoint-sm)`.
 */
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    autoprefixer: {},
  },
}
