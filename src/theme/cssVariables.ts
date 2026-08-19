import type { CSSVariablesResolver } from '@mantine/core'
import { colorDark, colorLight, type ColorToken } from './tokens.generated'

/**
 * The `Components/*` colour group is the one part of Figma's `Color Styles` collection still absent
 * from `tokens/figma/` — its tokens alias a `Surfaces/Page Background/*` group that is also missing,
 * so it cannot be added without a fuller export. Values are transcribed from the Figma variables and
 * expressed as references to exported tokens wherever the alias target does exist, so only genuine
 * literals are spelled out here.
 *
 * Export those two groups and these can move into the token pipeline like `Action/*` did.
 */
function componentTokens(color: Record<ColorToken, string>, scheme: 'light' | 'dark') {
  return {
    /** `Components/Button Outline/text` */
    'btn-outline-text':
      scheme === 'light' ? color['action-link-default-link'] : color['surfaces-text-primary'],
    /**
     * `Components/Button Outline/line-stp-01` — the resting outline stroke, and the hairline that
     * appears on a hovered or pressed solid button (`Primary Btn Solid/button-stroke` resolves to
     * the same variable).
     */
    'btn-outline-line':
      scheme === 'light' ? color['accent-primary-blue-accent'] : 'rgba(255, 255, 255, 0.7)',
    /** `Components/Button Outline/bg-step-01` / `-02` — the two stops of the glass sheen. */
    'btn-glass-from': scheme === 'light' ? 'rgba(187, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
    'btn-glass-to': scheme === 'light' ? 'rgba(187, 210, 255, 0)' : 'rgba(255, 255, 255, 0)',
    /** `Components/Glass Card/shadow` — the 6px ambient glow under an outline button. */
    'glass-shadow': scheme === 'light' ? 'rgba(173, 201, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',

    /** `Components/Label/lab-tonal-bg` — the tonal label's fill. */
    'label-tonal-bg':
      scheme === 'light' ? color['brand-primary-lighten-5'] : color['neutral-02'],
    /** `Components/Label/lab-tonal-text` */
    'label-tonal-text':
      scheme === 'light' ? color['brand-primary-darken-5'] : color['action-neutral-inverted'],
    /**
     * `Components/Label/lab-grad-bg-step-01` / `-02` — the two stops of the gradient label. Only the
     * dark values alias exported tokens (`Accent/Primary Blue Accent` and `Accent/Product Accent`);
     * the light pair are literals in Figma.
     */
    'label-grad-from':
      scheme === 'light' ? '#edf3ff' : color['accent-primary-blue-accent'],
    'label-grad-to': scheme === 'light' ? '#ede2ff' : color['accent-product-accent'],
    /**
     * The gradient label's own text colour. This one is not a variable in Figma at all — the text
     * layer carries a raw `#1f2531` in every Gradient variant, which is `Neutral/01`'s *dark* value,
     * held constant across both modes. Reproduced literally rather than bound to `Neutral/01`, which
     * would flip to `#f0f1f5` in light mode and put white text on the pale gradient. Flagged in
     * README.md as a value for the design file to tokenise.
     */
    'label-grad-text': '#1f2531',
  }
}

/** Maps a token record onto `--sds-*` declarations. */
const toVars = (tokens: Record<string, string>) =>
  Object.fromEntries(Object.entries(tokens).map(([key, value]) => [`--sds-${key}`, value]))

/**
 * Publishes every Figma colour token as an `--sds-*` CSS variable, split into Mantine's `light` and
 * `dark` buckets so the values flip automatically with `data-mantine-color-scheme` — no component
 * needs to know which scheme is active.
 *
 * Scheme-independent values (blur radii, the pressed inner shadow, motion) go in `variables`.
 * Typography variables are not here: they are responsive, so they come from
 * `typography.generated.css` where they can sit inside media queries.
 */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    /** `glass effect card` — BACKGROUND_BLUR radius 100 in Figma, which is a 50px CSS blur. */
    '--sds-glass-blur': '50px',
    /** `Button/Pressed Inner Shadow` — INNER_SHADOW #00000040, offset (0, 4), radius 4. */
    '--sds-btn-pressed-shadow': 'inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
    /** `elevation/tight/4` — DROP_SHADOW #2D2D2D3D, offset (0, 2), radius 7. */
    '--sds-elevation-tight-4': '0 2px 7px 0 rgba(45, 45, 45, 0.24)',
    /** Not published by Figma: the transition applied to interactive state changes. */
    '--sds-motion-fast': '120ms',
    '--sds-motion-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  light: {
    '--mantine-color-body': colorLight['surfaces-page-bg-base-default'],
    ...toVars(colorLight),
    ...toVars(componentTokens(colorLight, 'light')),
  },
  dark: {
    '--mantine-color-body': colorDark['surfaces-page-bg-base-default'],
    ...toVars(colorDark),
    ...toVars(componentTokens(colorDark, 'dark')),
  },
})
