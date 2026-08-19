/**
 * Public entry point for the Scratch design system.
 *
 * Consumers wrap their app in `ScratchProvider` once, then import components from here. The
 * provider is what installs the theme and the `--sds-*` token variables that every component
 * assumes are present.
 */
export { Button, type ButtonProps } from './components/Button'
export { Label, type LabelProps, type LabelSize, type LabelVariant } from './components/Label'
export { Link, type LinkProps, type LinkSize, type LinkVariant } from './components/Link'

export * from './icons'

export {
  ScratchProvider,
  type ScratchProviderProps,
  theme,
  cssVariablesResolver,
  componentTheme,
  type ButtonSize,
  type LabelThemeSize,
  type LinkThemeSize,
  colorLight,
  colorDark,
  radius,
  spacing,
  typography,
  typographyBreakpoints,
  type ColorToken,
} from './theme'
