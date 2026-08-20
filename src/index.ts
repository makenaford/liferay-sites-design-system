/**
 * Public entry point for the Scratch design system.
 *
 * Consumers wrap their app in `ScratchProvider` once, then import components from here. The
 * provider is what installs the theme and the `--sds-*` token variables that every component
 * assumes are present.
 */
export {
  Accordion,
  type AccordionProps,
  type AccordionSize,
} from './components/Accordion'
export { Button, type ButtonProps } from './components/Button'
export { Card, type CardProps, type CardSurface, type CardPadding } from './components/Card'
export { Carousel, type CarouselProps, type CarouselIndicators } from './components/Carousel'
export { Divider, type DividerProps, type DividerTone } from './components/Divider'
export { Hero, type HeroProps, type HeroBackground, type HeroAlign } from './components/Hero'
export {
  Image,
  IMAGE_RATIOS,
  type ImageProps,
  type ImageRatio,
  type ImageOrientation,
  type ImageFit,
} from './components/Image'
export {
  Header,
  MegaMenu,
  type HeaderProps,
  type HeaderNavItem,
  type MegaMenuProps,
  type MegaColumnProps,
  type MegaItemProps,
  type MegaTileProps,
  type MegaFeaturedProps,
  type MegaFeaturedCardProps,
  type MegaCtaProps,
} from './components/Header'
export {
  List,
  type ListProps,
  type ListItemProps,
  type ListMarker,
  type ListSize,
} from './components/List'
export {
  Section,
  SectionTitle,
  ContentMedia,
  type SectionProps,
  type SectionSpacing,
  type SectionTitleProps,
  type SectionTitleAlign,
  type SectionTitleOrder,
  type ContentMediaProps,
  type ContentMediaSide,
  type ContentMediaRatio,
} from './components/Section'
export {
  Marquee,
  type MarqueeProps,
  type MarqueeSize,
  type MarqueeDirection,
} from './components/Marquee'
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
