import {
  Accordion,
  Anchor,
  Badge,
  Chip as MantineChipComponent,
  List,
  Button,
  Select,
  Tabs,
  Textarea,
  TextInput,
  type MantineThemeComponents,
} from '@mantine/core'
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
 * The three Figma label sizes, from the `Label CTA` component set. Height, horizontal padding, the
 * 4px gap, the icon box, the border weight and the corner radius are all taken from the component;
 * the label size comes from its text style.
 *
 * Radius is bound to Size in Figma — `Border Radius/round` at Large, `/medium` at Medium,
 * `/small` at Small — so it is part of the size spec rather than a separate axis. An explicit
 * `radius` prop still overrides it.
 *
 * Large and Medium share one text style (`Paragraph/Base/Heavy`, 16/24); Small uses
 * `Paragraph/X-Small/Semi Bold`, which is 14px at 125% line height. Note that style's *name*
 * disagrees with the `Size/Paragraph/X-Small` variable, which reads 11px — the same
 * text-style-versus-variable split Button and Link have, and the text style wins here too.
 */
const LABEL_SIZES = {
  /**
   * Small takes `Paragraph/Small` — 13/20 from the typography collection — rather than the 14px its
   * Figma text style is set at. The style is named `Paragraph/X-Small/Semi Bold` and reads 14px, which
   * matches neither the X-Small variable (11px) nor Small (13px); the token is the one thing in that
   * set that is unambiguous.
   */
  sm: {
    height: 22,
    paddingX: 8,
    fontSize: 'var(--sds-size-paragraph-small)',
    lineHeight: 'var(--sds-line-height-paragraph-small)',
    icon: 16,
    border: 1,
    radius: radius.small,
  },
  md: { height: 32, paddingX: 8, fontSize: 16, lineHeight: 24, icon: 20, border: 1.5, radius: radius.medium },
  lg: { height: 40, paddingX: 16, fontSize: 16, lineHeight: 24, icon: 20, border: 2, radius: radius.round },
} as const

export type LabelThemeSize = keyof typeof LABEL_SIZES

/** The label colour per variant. Constant across sizes in Figma. */
const LABEL_TEXT_COLOR = {
  /** Figma `Style=Gradient`. The one label colour Figma leaves untokenised — see `cssVariables.ts`. */
  filled: 'var(--sds-label-grad-text)',
  /** Figma `Style=Tonal` — `Components/Label/lab-tonal-text`. */
  light: 'var(--sds-label-tonal-text)',
  /** Figma `Style=Outline` — `Surfaces/Text/Primary`. */
  outline: 'var(--sds-surfaces-text-primary)',
} as const

/**
 * The variables every field shares, from the Figma `Input` set: a 48px box with `Border Radius/medium`
 * corners and 16px of horizontal padding. The 1px gradient border is painted by the stylesheet, since
 * no `border-color` can be a gradient, so Mantine's own border is switched off here.
 *
 * The placeholder is `Surfaces/Text/Tertiary` rather than the `Surfaces/Text/Primary` Figma draws —
 * see README.md: at full contrast a placeholder is indistinguishable from a real value.
 */
const INPUT_VARS = {
  '--input-height': '48px',
  '--input-fz': '16px',
  '--input-radius': `${radius.medium}px`,
  /**
   * Only the base padding: Mantine swaps `--input-padding-inline-start/end` for the section size when
   * a field has an icon, and hardcoding those would leave the icon sitting on top of the text.
   */
  '--input-padding': '16px',
  /**
   * Figma's icon slots: 16px of padding, a 16px glyph, then an 8px gap before the text — so the text
   * starts at 40px and the stylesheet pins the glyph to the box's own padding edge.
   */
  '--input-left-section-size': '40px',
  '--input-right-section-size': '40px',
  '--input-color': 'var(--sds-neutral-10)',
  '--input-placeholder-color': 'var(--sds-surfaces-text-tertiary)',
  '--input-bd': 'none',
  '--input-bg': 'transparent',
} as const

/**
 * Figma puts the help text *below* the box; Mantine's default order puts the description above it. The
 * error message follows the description, so a field that has both reads box, help, problem.
 */
const INPUT_ORDER: ('label' | 'input' | 'description' | 'error')[] = [
  'label',
  'input',
  'description',
  'error',
]

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

  /**
   * Chip — Figma `Chip` (`16858:51126`). One drawn size, so there is no size axis: 30px tall, 8px of
   * horizontal padding, 6px vertical, an 8px gap, `Border Radius/medium` and
   * `Paragraph/X-Small/Semi Bold`. The fills, the gradient hairline and the states live in
   * `components.module.css`, which is also where Mantine's tick is hidden.
   */
  Chip: MantineChipComponent.extend({
    classNames: {
      root: classes.chipWrapper,
      label: classes.chipLabel,
      input: classes.chipInput,
      iconWrapper: classes.chipIconWrapper,
    },

    vars: () => ({
      root: {
        '--chip-fz': 'var(--sds-size-paragraph-x-small)',
        '--chip-size': '30px',
        '--chip-padding': '8px',
        /* Figma keeps the padding identical when selected; Mantine narrows it to make room for a tick. */
        '--chip-checked-padding': '8px',
        '--chip-icon-size': '0px',
        /* `gap/8` — the icon-to-label gap. Mantine uses this for the label's own flex gap. */
        '--chip-spacing': '8px',
      },
    }),
  }),

  Badge: Badge.extend({
    classNames: {
      root: classes.labelRoot,
      section: classes.labelSection,
      label: classes.labelText,
    },

    defaultProps: {
      /** Figma's default cell: Style Tonal, Size Large. */
      variant: 'light',
      size: 'lg',
    },

    /**
     * Resolves the size and style axes onto the CSS variables Mantine's Badge already reads.
     *
     * All three of this system's variant names are Mantine built-ins, so — exactly as with Button —
     * Mantine injects its own `--badge-bg` / `--badge-color` / `--badge-bd` inline for each of them.
     * Inline styles beat any stylesheet rule, so those variables are claimed here: the fill is
     * neutralised to `transparent` and painted by `components.module.css`, which is where the tonal
     * fill, the gradient fill and the gradient border live.
     */
    vars: (_theme, props) => {
      const size = (props.size ?? 'lg') as LabelThemeSize
      const spec = LABEL_SIZES[size] ?? LABEL_SIZES.lg
      const variant = (props.variant ?? 'light') as keyof typeof LABEL_TEXT_COLOR
      const color = LABEL_TEXT_COLOR[variant] ?? LABEL_TEXT_COLOR.light

      return {
        root: {
          '--badge-height': `${spec.height}px`,
          '--badge-padding-x': `${spec.paddingX}px`,
          /* A number is a literal from the component; a string is a typography token. */
          '--badge-fz': typeof spec.fontSize === 'number' ? `${spec.fontSize}px` : spec.fontSize,
          /** Mantine derives its own line height from the height; Figma's text style is explicit. */
          '--badge-lh':
            typeof spec.lineHeight === 'number' ? `${spec.lineHeight}px` : spec.lineHeight,
          /**
           * Figma binds the radius to Size, so the size spec owns it — but only when the call site
           * has not asked for something else. Returning `undefined` leaves Mantine's own resolved
           * `radius` prop in place, since the merge drops undefined values.
           */
          '--badge-radius': props.radius === undefined ? `${spec.radius}px` : undefined,

          /** Painted by the stylesheet, which has the gradients and the mask the border needs. */
          '--badge-bg': 'transparent',
          '--badge-color': color,
          /** Width and style only — the stylesheet paints the outline variant's gradient border. */
          '--badge-bd': `${spec.border}px solid transparent`,
          /** Kept in step with the border above: Mantine sizes the icon slots against it. */
          '--badge-border-width': `${spec.border}px`,

          '--sds-label-icon': `${spec.icon}px`,
          '--sds-label-gap': '4px',
        },
      }
    },
  }),

  /**
   * The three `Type` cells of the Figma `Input` set (node `16166:23969`) are three Mantine components
   * rather than a prop, since a text field, a multi-line field and a select are different elements with
   * different semantics. They share one stylesheet block and one set of variables.
   *
   * The set's other axes: `Condensed` is the floating-label layout (`floating` on the component),
   * `State` is Default | Active | Disabled, and `Filled` is simply whether the field has a value —
   * all of which are real states in code rather than props.
   */
  TextInput: TextInput.extend({
    classNames: {
      root: classes.fieldRoot,
      wrapper: classes.fieldWrapper,
      input: classes.fieldInput,
      section: classes.fieldSection,
      label: classes.fieldLabel,
      required: classes.fieldRequired,
      description: classes.fieldDescription,
      error: classes.fieldError,
    },
    defaultProps: { size: 'md', inputWrapperOrder: INPUT_ORDER },
    vars: () => ({ wrapper: INPUT_VARS }),
  }),

  Textarea: Textarea.extend({
    classNames: {
      root: classes.fieldRoot,
      wrapper: classes.fieldWrapper,
      input: classes.fieldInput,
      section: classes.fieldSection,
      label: classes.fieldLabel,
      required: classes.fieldRequired,
      description: classes.fieldDescription,
      error: classes.fieldError,
    },
    defaultProps: { size: 'md', autosize: true, minRows: 3, inputWrapperOrder: INPUT_ORDER },
    vars: () => ({ wrapper: INPUT_VARS }),
  }),

  Select: Select.extend({
    classNames: {
      root: classes.fieldRoot,
      wrapper: classes.fieldWrapper,
      input: classes.fieldInput,
      section: classes.fieldSection,
      label: classes.fieldLabel,
      required: classes.fieldRequired,
      description: classes.fieldDescription,
      error: classes.fieldError,
      dropdown: classes.fieldDropdown,
      option: classes.fieldOption,
      options: classes.fieldOptions,
      group: classes.fieldGroup,
      groupLabel: classes.fieldGroupLabel,
      empty: classes.fieldEmpty,
    },
    defaultProps: { size: 'md', inputWrapperOrder: INPUT_ORDER },
    vars: () => ({ wrapper: INPUT_VARS }),
  }),

  /**
   * Figma `Accordion` (node `17019:127517`). Two variants — `Expand` × `Size` — so the classes carry
   * the treatment and `components.module.css` keys the two sizes off `data-size`, which the wrapper
   * sets from its own `size` prop.
   */
  Accordion: Accordion.extend({
    classNames: {
      root: classes.accRoot,
      item: classes.accItem,
      control: classes.accControl,
      label: classes.accLabel,
      chevron: classes.accChevron,
      icon: classes.accIcon,
      panel: classes.accPanel,
      content: classes.accContent,
      itemTitle: classes.accItemTitle,
    },

    defaultProps: {
      /**
       * 240ms rather than Mantine's 200. The row height is the largest thing that moves in this
       * library and 200ms reads as a snap; 240 is `--sds-motion-medium` less its overshoot, and it is a
       * number rather than a token because Mantine hands the value to `Collapse` in JavaScript.
       *
       * `respectReducedMotion` is on, so this drops to 0ms for anyone who has asked for less motion.
       */
      transitionDuration: 240,
      /** Figma puts the arrow after the label, on the trailing edge. */
      chevronPosition: 'right',
    },

    vars: () => ({
      root: {
        /**
         * Mantine sizes the chevron box from `--accordion-chevron-size`, which its vars resolver writes
         * inline on the root — so a stylesheet rule on the root cannot win. The stylesheet sizes the
         * chevron from its own `--sds-acc-chevron` instead, and this switches Mantine's off.
         */
        '--accordion-chevron-size': 'auto',
        /** Figma draws no rounding on an accordion row: the rule is a full-width line. */
        '--accordion-radius': '0',
      },
    }),
  }),

  /**
   * Figma `List` (node `19130:63824`) with `Main List Item`, `Sub List Item` and the `Sub Item List`
   * marker set. Every cell keeps its text at 18px — the `Size` axis moves the marker, not the type — so
   * the font is set here once and the sizes live on `data-size` in `components.module.css`.
   */
  List: List.extend({
    /*
     * Only the root. `List.Item` renders its own `<li>` rather than Mantine's, so that a nested list can
     * be a child of the `<li>` instead of landing inside the label's `<span>` — Mantine's item puts every
     * child in that span, and a `<ul>` inside a `<span>` is not a list in a document, only on screen.
     */
    classNames: { root: classes.listRoot },

    vars: () => ({
      root: {
        /** `Paragraph/Default/Regular` — 18px at 125%, the size every cell in the set uses. */
        '--list-fz': '18px',
        '--list-lh': '24px',
        /**
         * Mantine indents the list by a marker gap and then positions the icon with a margin. Figma has
         * a fixed marker column and an 8px gap, drawn flush to the container, so both are switched off
         * here and the stylesheet lays the row out.
         */
        '--list-marker-gap': '0',
      },
    }),
  }),

  Tabs: Tabs.extend({
    classNames: {
      root: classes.tabsRoot,
      list: classes.tabsList,
      tab: classes.tabsTab,
      tabSection: classes.tabsTabSection,
      tabLabel: classes.tabsTabLabel,
      panel: classes.tabsPanel,
    },

    /*
     * `inverted` is not defaulted here. `Tabs` owns it, because the answer depends on the variant: the
     * underline bar wants it (Figma draws that rule on the top edge) and the pill menu has no rule to
     * invert. One source of truth beats a default that one variant then has to undo.
     */
    vars: () => ({
      root: {
        /**
         * Mantine draws both the list's rule and the active indicator with borders, one width for
         * both. Figma has a 1px `Neutral/03` rule and a 3px gradient indicator, and a gradient cannot
         * be a border colour — so the tab border is switched off here and `components.module.css`
         * draws the indicator itself. The list's own hairline is Mantine's, recoloured.
         */
        '--tabs-list-border-width': '0',
        '--tab-border-color': 'var(--sds-neutral-03)',
        /** Neutralised: the stylesheet owns the indicator, and Figma gives hover no background. */
        '--tabs-color': 'transparent',
        '--tab-hover-color': 'transparent',
      },
    }),
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
