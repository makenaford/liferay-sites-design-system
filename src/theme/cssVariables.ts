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

    /**
     * `Components/Glass Tab/*` — the segmented control. The whole group is properly mode-aware, which
     * is why this component needs no restructuring: in light mode `bg-gradient-*` is the opaque blue
     * `Brand/Primary` pair and the stroke pair is fully transparent, and on dark the fill becomes
     * translucent white and the stroke picks up the brand/accent gradient.
     */
    'tab-fill-1': scheme === 'light' ? '#f8faff' : 'rgba(121, 121, 121, 0.03)',
    'tab-bg-from':
      scheme === 'light' ? color['brand-primary-primary'] : 'rgba(255, 255, 255, 0.1)',
    'tab-bg-to': scheme === 'light' ? color['brand-primary-darken-1'] : 'rgba(121, 121, 121, 0.05)',
    /** Transparent in light mode by design — there the fill is opaque and needs no edge. */
    'tab-stroke-from':
      scheme === 'light' ? 'rgba(55, 124, 255, 0)' : color['brand-primary-lighten-1'],
    'tab-stroke-to': scheme === 'light' ? 'rgba(116, 20, 255, 0)' : color['accent-purple'],
    /** `Components/Glass Tab/tab-focus-shadow` — the selected segment's cast shadow. */
    'tab-shadow': scheme === 'light' ? color['brand-primary-lighten-4'] : color['neutral-01'],

    /**
     * `Components/Glass Card/Glass Step 01` / `02` — the two stops of the glass card's fill, and the
     * three of its hover sheen (which reuses `02` at both ends).
     */
    /*
     * Back to the drawn 5% / 3%. The 9% I had tried made glass read as a grey card with a bright edge
     * rather than as a material, and it was solving the wrong problem: glass does not need a heavy fill
     * once the static card is sitting where it belongs.
     */
    'glass-step-01': scheme === 'light' ? 'rgba(173, 201, 255, 0.1)' : 'rgba(255, 255, 255, 0.055)',
    'glass-step-02': 'rgba(140, 150, 169, 0.03)',
    /**
     * `Components/Gradient Card/blue` / `purple` — the coloured stop of a gradient card. Its other
     * three stops are all `Surfaces/Card BG/Grey`, which is exported, so only these two are here.
     */
    'gradient-card-blue': scheme === 'light' ? color['brand-primary-lighten-4'] : '#0117ae',
    'gradient-card-purple': scheme === 'light' ? color['accent-product-accent'] : '#7414ff',

    /**
     * The lit top edge that raises a glass card on the dark canvas. Not a Figma value.
     *
     * Light mode takes nothing here — its own shadow does the work.
     */
    'card-lit-edge': scheme === 'light' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
    /**
     * The cast shadow, also not a Figma value.
     *
     * I had claimed a black shadow does nothing on a near-black page. That is only true of the *flat*
     * one the file draws — `0 0 6px 1px #000 @8%`, no offset, which lands symmetrically and cancels
     * itself out. An offset, blurred shadow darkens the ground beneath the card and reads perfectly
     * well on dark, which is what the reference uses and what is reproduced here.
     */
    'card-cast-shadow':
      scheme === 'light'
        ? '0 8px 20px rgba(16, 24, 40, 0.08), 0 1px 3px rgba(16, 24, 40, 0.06)'
        : '0 8px 20px rgba(0, 0, 0, 0.28), 0 1px 3px rgba(0, 0, 0, 0.22)',
    /** The static card's edge: present, but a third of the strength of glass's. */
    'card-static-line': scheme === 'light' ? 'rgba(16, 24, 40, 0.06)' : 'rgba(255, 255, 255, 0.05)',

    /** `Components/Glass Line/01` / `02` — the two stops of the container's hairline. */
    'glass-line-from':
      scheme === 'light' ? 'rgba(111, 160, 255, 0.6)' : 'rgba(255, 255, 255, 0.16)',
    /*
     * 16% into 12% — a mean of 14%, which is the flat rim the reference draws, kept as a gradient
     * because that is the shape Figma draws.
     *
     * This is well under the 3:1 that WCAG 1.4.11 asks of a boundary *identifying* an interactive
     * component, and that is a deliberate call rather than an oversight. The rim is not carrying the
     * distinction alone: glass sits slightly forward of the static card, has a lit top edge and a real
     * shadow, and moves on hover. A clickable card should still carry something non-tonal — a
     * link-styled title, an arrow — for the boundary not to be the only signal. Recorded in README.md.
     */
    'glass-line-to': scheme === 'light' ? 'rgba(111, 160, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)',
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
    /*
     * The footer's dark band. Mode-independent on purpose: that band carries the dark bubble artwork and
     * white text in *both* colour modes, so a mode-aware page colour would turn it inside out in light
     * mode. `Neutral/00`'s dark value, and the `Components/Overlay Carousel/Dark/02` vignette over it.
     */
    '--sds-footer-ground': '#070b13',
    '--sds-footer-vignette': 'rgba(7, 11, 19, 0.5)',
    /*
     * The mesh blooms. Brand blue, the product accent purple, and a deeper indigo between them — the
     * three the file's gradient runs through. Mode-independent like the rest of the band: it is dark in
     * both colour modes, so a mode-aware hue would turn it inside out in light mode.
     */
    '--sds-footer-mesh-1': 'rgba(116, 20, 255, 0.55)',
    '--sds-footer-mesh-2': 'rgba(11, 95, 255, 0.45)',
    '--sds-footer-mesh-3': 'rgba(1, 23, 174, 0.5)',
    /*
     * And the text on it, for the same reason. `Surfaces/Text/Primary` and `Action/Link/Hover Link` are
     * mode-aware, which is right on a page and wrong on a band that is dark in both modes — in light mode
     * they resolve to dark ink on a dark ground. These are their dark-canvas values, pinned.
     */
    '--sds-footer-text': '#f0f1f5',
    '--sds-footer-link-hover': '#bbd2ff',
    '--sds-motion-fast': '120ms',
    '--sds-motion-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    /**
     * Also not published by Figma. Used where something travels a distance rather than just changing
     * colour — the segmented control's indicator sliding between segments — which needs longer than a
     * state change to read as one object moving.
     *
     * The curve leaves almost immediately and settles slowly, with no overshoot, so the movement reads
     * as gliding to a stop rather than snapping into place. Its long tail is why the duration is
     * longer than it looks: most of it is the final few pixels.
     */
    '--sds-motion-medium': '280ms',
    /** For something large enough that 280ms reads as a jump — a card's image scaling under the cursor. */
    '--sds-motion-slow': '420ms',
    '--sds-motion-ease-out': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    /**
     * The same feel over a short distance: the press of a control, and the small settle a segment
     * makes as it becomes selected. Fast enough to feel like a response, slow enough not to snap.
     */
    '--sds-motion-press': '180ms',
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
