import { Anchor, Button, type MantineThemeComponents } from '@mantine/core'
import classes from './components.module.css'
import { radius } from './tokens.generated'

/**
 * The three Figma button sizes. Height, horizontal padding and gap are taken from the component's
 * auto-layout; the font size and line height come from the `Action/Button/*` text styles.
 *
 * Note the font sizes are 21/18/14, which is what the `Action/Button/Large|Medium|Small` text styles
 * and the component itself use. The separate `Size/Action/Button/*` number variables in the
 * typography collection read 18/16/14 — only the Small button is actually bound to its variable, so
 * those first two look stale. Flagged in README.md; the component is the source used here.
 */
const BUTTON_SIZES = {
  sm: { height: 40, paddingX: 12, gap: 4, fontSize: 14, lineHeight: 20, radius: radius.small },
  md: { height: 48, paddingX: 16, gap: 8, fontSize: 18, lineHeight: 24, radius: radius.medium },
  /**
   * Large's 18px horizontal padding is not a step on the `padding` scale (which jumps 16 -> 20);
   * Figma sets it directly on the component, so it is reproduced literally.
   */
  lg: { height: 56, paddingX: 18, gap: 8, fontSize: 21, lineHeight: 28, radius: radius.medium },
} as const

export type ButtonSize = keyof typeof BUTTON_SIZES

/** The label colour per variant. Constant across states in Figma. */
const BUTTON_LABEL_COLOR = {
  /** `Action/Neutral/Inverted` — white in both Figma modes. */
  filled: 'var(--sds-action-neutral-inverted)',
  rounded: 'var(--sds-action-neutral-inverted)',
  neutral: 'var(--sds-action-neutral-inverted)',
  /** `Components/Button Outline/text` */
  outline: 'var(--sds-btn-outline-text)',
} as const

/**
 * The three Figma link sizes. Font size and line height come from the `Action/Link/*` text styles;
 * the icon box is taken from the component, where it scales with the label rather than staying fixed
 * as it does on Button. The 4px gap is the same at every size.
 *
 * As with Button, the text styles read 21/18/14 while the `Size/Action/Link/*` number variables say
 * 20/16/14 and only the small one is actually bound. The component wins.
 */
const LINK_SIZES = {
  sm: { fontSize: 14, lineHeight: 20, icon: 12 },
  md: { fontSize: 18, lineHeight: 24, icon: 16 },
  lg: { fontSize: 21, lineHeight: 28, icon: 20 },
} as const

export type LinkThemeSize = keyof typeof LINK_SIZES

/**
 * Central component configuration for the theme.
 *
 * Everything visual lives here or in `components.module.css` — never at the call site. Adding a
 * variant means adding it here and to `src/mantine.d.ts`, after which consumers reach it with
 * `<Button variant="…">`.
 */
export const componentTheme: MantineThemeComponents = {
  Button: Button.extend({
    classNames: {
      root: classes.root,
      inner: classes.inner,
      section: classes.section,
      label: classes.label,
    },

    defaultProps: {
      /** Figma's default cell: Color Primary, Style Solid, Size Large. */
      variant: 'filled',
      size: 'lg',
    },

    /**
     * Resolves the size and variant axes into the CSS variables Mantine's Button already reads.
     *
     * Two of this system's variant names — `filled` and `outline` — collide with Mantine built-ins,
     * for which Mantine injects its own `--button-bg` / `--button-color` inline. Inline styles beat
     * any stylesheet rule, so those variables have to be claimed here rather than in the CSS module:
     * the fill and border are neutralised to `transparent` and then painted by
     * `components.module.css`, which can also vary them per interaction state.
     */
    vars: (_theme, props) => {
      const size = (props.size ?? 'lg') as ButtonSize
      const spec = BUTTON_SIZES[size] ?? BUTTON_SIZES.lg
      const variant = (props.variant ?? 'filled') as keyof typeof BUTTON_LABEL_COLOR
      const color = BUTTON_LABEL_COLOR[variant] ?? BUTTON_LABEL_COLOR.filled
      /**
       * Figma treats `Rounded` as a Style rather than a radius, so the variant owns the pill value
       * (`Border Radius/round`) instead of every call site passing `radius="round"`.
       */
      const isPill = variant === 'rounded'

      return {
        root: {
          '--button-height': `${spec.height}px`,
          '--button-padding-x': `${spec.paddingX}px`,
          '--button-fz': `${spec.fontSize}px`,
          '--button-radius': `${isPill ? radius.round : spec.radius}px`,

          /** Painted by the stylesheet; kept transparent so nothing shows through a glass fill. */
          '--button-bg': 'transparent',
          '--button-hover': 'transparent',
          /** Width and style only — the stylesheet sets `border-color` per state. */
          '--button-bd': '1px solid transparent',
          '--button-color': color,
          '--button-hover-color': color,

          '--sds-button-gap': `${spec.gap}px`,
          '--sds-button-lh': `${spec.lineHeight}px`,
        },
      }
    },
  }),

  Anchor: Anchor.extend({
    classNames: { root: classes.link },

    defaultProps: {
      /** Figma's default cell: Style Primary, Size Large. */
      variant: 'default',
      size: 'lg',
      /**
       * Figma's `Underline` boolean defaults to false. This defaults to `hover` instead: a state
       * change carried by colour alone is not perceivable to everyone (WCAG 1.4.1), and the resting
       * appearance still matches the design. `underline="always"` is the right choice for a link
       * inside a paragraph.
       */
      underline: 'hover',
    },

    /**
     * Anchor is a single-element component, so the label and icon sizes both resolve here and the
     * stylesheet reads them back out. `--text-fz` / `--text-lh` are Mantine's own variables; the
     * `--sds-link-*` pair is what sizes the icon boxes.
     */
    vars: (_theme, props) => {
      const size = (props.size ?? 'lg') as LinkThemeSize
      const spec = LINK_SIZES[size] ?? LINK_SIZES.lg

      return {
        root: {
          '--text-fz': `${spec.fontSize}px`,
          '--text-lh': `${spec.lineHeight}px`,
          '--sds-link-icon': `${spec.icon}px`,
          '--sds-link-gap': '4px',
        },
      }
    },
  }),
}
