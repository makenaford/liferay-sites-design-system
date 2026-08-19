/**
 * Public entry point for the Scratch design system.
 *
 * Consumers wrap their app in `ScratchProvider` once, then import components from here. The
 * provider is what installs the theme and the `--sds-*` token variables that every component
 * assumes are present.
 */
export { Button, type ButtonProps } from './components/Button'

export { IconArrowRight, IconRefresh, type IconProps } from './icons'

export {
  ScratchProvider,
  type ScratchProviderProps,
  theme,
  cssVariablesResolver,
  componentTheme,
  type ButtonSize,
  colorLight,
  colorDark,
  radius,
  spacing,
  typography,
  typographyBreakpoints,
  type ColorToken,
} from './theme'
