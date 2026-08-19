import type { CSSVariablesResolver } from '@mantine/core'
import { colorDark, colorLight, type ColorToken } from './tokens.generated'

/**
 * Colour tokens that Figma keeps in its `Base Colors` / `Components` collections rather than the
 * `Color Styles` collection exported to `tokens/figma/`. Wherever the Figma value is a reference to
 * a token that *was* exported, it is expressed as that reference here so there is still one source
 * of truth; the remaining handful are literals transcribed from the component.
 *
 * When those collections get exported too, delete the literals and read them from
 * `tokens.generated.ts` instead.
 */
function componentTokens(color: Record<ColorToken, string>, scheme: 'light' | 'dark') {
  return {
    /** `Action/Primary/Default` — the base fill of a solid button. */
    'action-primary-default': color['brand-primary-primary'],
    /** `Action/Primary/Hover` — the lighter gradient stop. */
    'action-primary-hover': color['brand-primary-lighten-1'],
    /** `Action/Primary/Active` — the pressed/focus gradient stop. */
    'action-primary-active': color['brand-primary-darken-3'],
    /** `Action/Neutral/Inverted` — label colour on any solid button. White in both modes. */
    'action-neutral-inverted': '#ffffff',

    /** `Components/Button Outline/text` */
    'btn-outline-text':
      scheme === 'light' ? color['brand-primary-darken-2'] : color['surfaces-text-primary'],
    /** `Components/Button Outline/line-stp-01` — the resting outline stroke. */
    'btn-outline-line': scheme === 'light' ? color['brand-primary-primary'] : 'rgba(255, 255, 255, 0.7)',
    /** `Components/Button Outline/line-stp-02` — the stroke once hovered or pressed. */
    'btn-outline-line-active':
      scheme === 'light' ? color['brand-primary-darken-3'] : color['accent-primary-blue-accent'],
    /** `Components/Button Outline/bg-step-01` / `-02` — the two stops of the glass sheen. */
    'btn-glass-from': scheme === 'light' ? 'rgba(187, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
    'btn-glass-to': scheme === 'light' ? 'rgba(187, 210, 255, 0)' : 'rgba(255, 255, 255, 0)',
    /** `Components/Glass Card/shadow` — the 6px ambient glow under an outline button. */
    'glass-shadow': scheme === 'light' ? 'rgba(173, 201, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
    /** `Base Colors/Primary Btn Solid/button-stroke` — 1px hairline on hover and pressed. */
    'btn-stroke': scheme === 'light' ? color['brand-primary-primary'] : 'rgba(255, 255, 255, 0.7)',
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
