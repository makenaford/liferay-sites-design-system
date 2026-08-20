/**
 * Public entry point for the Scratch design system.
 *
 * Consumers wrap their app in `ScratchProvider` once, then import components from here. The
 * provider is what installs the theme and the `--sds-*` token variables that every component
 * assumes are present.
 */
export { Button, type ButtonProps } from './components/Button'
export { Card, type CardProps, type CardSurface, type CardPadding } from './components/Card'
export {
  InfoTooltip,
  LanguagePicker,
  Select,
  Textarea,
  TextInput,
  type InfoTooltipProps,
  type LanguageOption,
  type LanguagePickerProps,
  type SelectProps,
  type TextareaProps,
  type TextInputProps,
} from './components/Input'
export { Label, type LabelProps, type LabelSize, type LabelVariant } from './components/Label'
export { Link, type LinkProps, type LinkSize, type LinkVariant } from './components/Link'
export {
  SegmentedControl,
  type SegmentedControlProps,
} from './components/SegmentedControl'
export {
  Stat,
  StatBar,
  type StatProps,
  type StatBarProps,
  type StatSize,
  type StatAlign,
} from './components/Stat'
export { Tabs, type TabsProps } from './components/Tabs'

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
