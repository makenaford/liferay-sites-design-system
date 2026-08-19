import { createTheme, colorsTuple, virtualColor, type MantineColorsTuple } from '@mantine/core'
import { colorDark, colorLight, radius, spacing, type ColorToken } from './tokens.generated'
import { componentTheme } from './components'

/** A font size + line height pair pointing at the responsive variables from typography.generated.css. */
const type = (size: string, lineHeight: string) => ({
  fontSize: `var(--sds-size-${size})`,
  lineHeight: `var(--sds-line-height-${lineHeight})`,
})

/**
 * Registers a light/dark pair plus the `virtualColor` that switches between them, for a token
 * Figma defines differently per mode. Keeps the three related entries declared in one place.
 */
function modeColor(name: string, light: string, dark: string) {
  return {
    [`${name}Light`]: colorsTuple(light),
    [`${name}Dark`]: colorsTuple(dark),
    [name]: virtualColor({ name, light: `${name}Light`, dark: `${name}Dark` }),
  }
}

/**
 * The Figma `Brand/Primary` ramp as a Mantine 10-shade tuple, lightest to darkest. Figma publishes
 * 12 steps (6 lightens, the primary, 5 darkens); the two deepest darkens do not fit Mantine's
 * fixed-width tuple and are reachable as `var(--sds-brand-primary-darken-4|-5)` instead.
 * Identical in both Figma modes.
 */
const brand = [
  colorLight['brand-primary-lighten-6'],
  colorLight['brand-primary-lighten-5'],
  colorLight['brand-primary-lighten-4'],
  colorLight['brand-primary-lighten-3'],
  colorLight['brand-primary-lighten-2'],
  colorLight['brand-primary-lighten-1'],
  colorLight['brand-primary-primary'], // index 6 — primaryShade
  colorLight['brand-primary-darken-1'],
  colorLight['brand-primary-darken-2'],
  colorLight['brand-primary-darken-3'],
] as unknown as MantineColorsTuple

/**
 * The `Neutral` ramp, which Figma inverts between modes: `Neutral/00` is white in light mode and
 * near-black in dark. Both real ramps are registered and a `virtualColor` picks the right one, so
 * `c="neutral.5"` means the same thing visually in either mode. `Neutral/10` is the 11th step and
 * likewise lives on as `var(--sds-neutral-10)`.
 */
const neutralRamp = (color: Record<ColorToken, string>) =>
  [
    color['neutral-00'],
    color['neutral-01'],
    color['neutral-02'],
    color['neutral-03'],
    color['neutral-04'],
    color['neutral-05'],
    color['neutral-06'],
    color['neutral-07'],
    color['neutral-08'],
    color['neutral-09'],
  ] as unknown as MantineColorsTuple

/**
 * The Mantine theme for the Scratch design system.
 *
 * Every value traces back to `tokens.generated.ts`, which is built from the Figma exports in
 * `tokens/figma/`. Component appearance is configured centrally in `./components.ts` so that a
 * given treatment is defined once and reached through a `variant` prop rather than repeated at
 * call sites.
 */
export const theme = createTheme({
  primaryColor: 'brand',
  /** `Brand/Primary/Primary` (#0b5fff) sits at index 6 and is identical in both Figma modes. */
  primaryShade: 6,
  autoContrast: true,

  colors: {
    brand,
    neutralLight: neutralRamp(colorLight),
    neutralDark: neutralRamp(colorDark),
    neutral: virtualColor({ name: 'neutral', light: 'neutralLight', dark: 'neutralDark' }),

    /**
     * Status and accent colours. Figma publishes a single value per mode rather than a ramp, so
     * these are flat tuples — no intermediate shades are invented.
     */
    ...modeColor('error', colorLight['status-error-error'], colorDark['status-error-error']),
    ...modeColor('warning', colorLight['status-warning-warning'], colorDark['status-warning-warning']),
    ...modeColor('success', colorLight['status-success-success-icon'], colorDark['status-success-success-icon']),
    ...modeColor('info', colorLight['status-info-info'], colorDark['status-info-info']),
    ...modeColor('accent', colorLight['accent-product-accent'], colorDark['accent-product-accent']),
  },

  /** `Neutral/00` in light mode and `Neutral/10` in dark — i.e. the same two physical colours. */
  white: colorLight['neutral-00'],
  black: colorLight['neutral-10'],

  /** Figma's `Action/*` and body styles are all set in Source Sans 3. */
  fontFamily: '"Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',

  /**
   * The `Size/Paragraph` scale. These are `var()` references rather than numbers so the responsive
   * media queries in `typography.generated.css` stay in effect — Figma ships three typography
   * modes and this is what keeps all three live.
   */
  fontSizes: {
    xs: 'var(--sds-size-paragraph-x-small)',
    sm: 'var(--sds-size-paragraph-small)',
    md: 'var(--sds-size-paragraph-base)',
    lg: 'var(--sds-size-paragraph-large)',
    xl: 'var(--sds-size-heading-f4)',
  },
  lineHeights: {
    xs: 'var(--sds-line-height-paragraph-x-small)',
    sm: 'var(--sds-line-height-paragraph-small)',
    md: 'var(--sds-line-height-paragraph-base)',
    lg: 'var(--sds-line-height-paragraph-large)',
    xl: 'var(--sds-line-height-heading-f4)',
  },

  /** The `Size/Heading` scale — Figma's F1–F6 map onto h1–h6. */
  headings: {
    fontWeight: '600',
    sizes: {
      h1: type('heading-f1', 'heading-f1'),
      h2: type('heading-f2', 'heading-f2'),
      h3: type('heading-f3', 'heading-f3'),
      h4: type('heading-f4', 'heading-f4'),
      h5: type('heading-f5', 'heading-f5'),
      h6: type('heading-f6', 'heading-f6'),
    },
  },

  /** Figma's Source Sans 3 weights: Regular 400, SemiBold 600, Bold 700. */
  fontWeights: { regular: '400', medium: '600', bold: '700' },

  /**
   * The `padding`/`gap` step scale, keyed by its pixel value so a Figma spec reading "gap/16"
   * translates directly to `gap={16}`. The t-shirt aliases cover the common steps.
   */
  spacing: {
    ...Object.fromEntries(Object.entries(spacing).map(([step, value]) => [step, `${value}px`])),
    xs: `${spacing['8']}px`,
    sm: `${spacing['12']}px`,
    md: `${spacing['16']}px`,
    lg: `${spacing['24']}px`,
    xl: `${spacing['32']}px`,
  },

  /** The `Border Radius` collection. `round` is Figma's 1000px pill. */
  radius: {
    xs: `${radius.xsm}px`,
    sm: `${radius.small}px`,
    md: `${radius.medium}px`,
    lg: `${radius.large}px`,
    xl: `${radius.xlg}px`,
    round: `${radius.round}px`,
  },
  /** `Border Radius/medium` (8px) is what the medium and large buttons use. */
  defaultRadius: 'md',

  shadows: {
    xs: 'var(--sds-elevation-tight-4)',
    sm: 'var(--sds-elevation-tight-4)',
    md: 'var(--sds-elevation-tight-4)',
    /** `glass effect card` — offset 0 0, radius 6, spread 1, colour `Components/Glass Card/shadow`. */
    lg: '0 0 6px 1px var(--sds-glass-shadow)',
    xl: '0 0 6px 1px var(--sds-glass-shadow)',
  },

  components: componentTheme,
})
