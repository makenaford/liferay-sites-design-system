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
     * The four stops of `CapabilityMap`'s wash — the pulsing glow behind the hub, in `Brand/Primary` and
     * `Accent/Product Accent`.
     *
     * Tokens rather than a `color-mix` at the point of use, because the strength has to change with the
     * scheme and an alpha buried in a `color-mix` percentage cannot. The same alpha that reads as a lit
     * core on the near-black canvas is a purple blob on a white one: light needs roughly a third of it to
     * say the same thing.
     *
     * Stronger than they were, because nothing in the figure pulses any more — the centre's presence has
     * to come from the wash being there rather than from it moving.
     */
    'map-wash-core': scheme === 'light' ? 'rgba(11, 95, 255, 0.2)' : 'rgba(11, 95, 255, 0.52)',
    'map-wash-halo': scheme === 'light' ? 'rgba(116, 20, 255, 0.13)' : 'rgba(116, 20, 255, 0.4)',
    'map-wash-inner': scheme === 'light' ? 'rgba(55, 124, 255, 0.22)' : 'rgba(55, 124, 255, 0.6)',
    /**
     * The highlight that passes over gradient heading text.
     *
     * White on the dark canvas, where lightening the phrase brightens it. **Not** white on the light
     * one: there the gradient is blue-to-violet on a near-white page, and a white sheen would wash the
     * text toward its background exactly where it is meant to catch the eye. Light mode brightens by
     * *saturating* instead — the accent's own blue at a low alpha, which lifts the phrase without
     * lowering its contrast.
     */
    'gradient-sheen':
      scheme === 'light' ? 'rgba(99, 153, 255, 0.55)' : 'rgba(255, 255, 255, 0.62)',
    /** The network's resting outline. Dark wants a lit line; light wants a shadow of one. */
    'map-grid-line': scheme === 'light' ? 'rgba(11, 95, 255, 0.14)' : 'rgba(99, 153, 255, 0.22)',

    /**
     * `CapabilityMap`'s tile edge: `Components/Glass Line` at about half its token value.
     *
     * The token is calibrated for one card on a page. Sixteen tiles ringing a single hub is a different
     * problem — at full strength the edges were the brightest thing in the figure and the centre, which
     * is the subject, read as the dimmest. The hub keeps the full `glass-line-*` values, so the
     * hierarchy runs core, then tiles, then network. Recorded in README.md.
     */
    'map-tile-line-from':
      scheme === 'light' ? 'rgba(111, 160, 255, 0.34)' : 'rgba(255, 255, 255, 0.09)',
    'map-tile-line-to':
      scheme === 'light' ? 'rgba(111, 160, 255, 0.22)' : 'rgba(255, 255, 255, 0.062)',

    /** The tile's ground, and the firmer version it takes on hover so the rim stays a rim. */
    'map-tile-fill': scheme === 'light' ? 'rgba(255, 255, 255, 0.62)' : 'rgba(11, 17, 33, 0.72)',
    'map-tile-fill-hover': scheme === 'light' ? 'rgba(255, 255, 255, 0.78)' : 'rgba(16, 25, 48, 0.8)',

    /** `Glass Step 01` and `02`, halved on a tile for the same reason the edge is. */
    'map-tile-sheen-from':
      scheme === 'light' ? 'rgba(173, 201, 255, 0.05)' : 'rgba(255, 255, 255, 0.026)',
    'map-tile-sheen-to': 'rgba(140, 150, 169, 0.016)',

    /**
     * The hub's fill. Opaque, which is what lets the network cross the middle and vanish behind it.
     * Light mode gets a near-white rather than a tint, so the platform still reads as solid.
     */
    'map-hub-fill': scheme === 'light' ? '#f4f7ff' : '#0c1326',

    /**
     * The socket: the even shadow inside a tile's outline, and the shallower one inside the hub's.
     *
     * Tokens because black does not translate. 66% black on the near-black canvas is a well; on a white
     * one it is a smudge that turns every tile into a grey blob and buries the icons. Light mode uses a
     * fifth of the strength, in the neutral the rest of the light theme shades with rather than pure
     * black.
     */
    'map-well-mid': scheme === 'light' ? 'rgba(16, 24, 40, 0.045)' : 'rgba(0, 0, 0, 0.2)',
    'map-well-edge': scheme === 'light' ? 'rgba(16, 24, 40, 0.13)' : 'rgba(0, 0, 0, 0.66)',
    'map-well-hub-mid': scheme === 'light' ? 'rgba(16, 24, 40, 0.03)' : 'rgba(0, 0, 0, 0.14)',
    'map-well-hub-edge': scheme === 'light' ? 'rgba(16, 24, 40, 0.07)' : 'rgba(0, 0, 0, 0.34)',

    /** The core: `Brand/Primary` lighting the hub from within. */
    'map-core-from': scheme === 'light' ? 'rgba(11, 95, 255, 0.2)' : 'rgba(11, 95, 255, 0.36)',
    'map-core-to': scheme === 'light' ? 'rgba(11, 95, 255, 0.07)' : 'rgba(11, 95, 255, 0.13)',

    /**
     * The hover outline — `card-Focus Ring`, one step down at both ends: `Brand/Primary` into a darkened
     * `Accent/Product Accent` rather than `Lighten/1` into the full accent. The lit version was the
     * brightest thing on the page by some margin, which put the emphasis on the rim instead of on the
     * tile it is drawn around.
     */
    'map-rim-from': color['brand-primary-primary'],
    'map-rim-to': scheme === 'light' ? color['accent-product-accent'] : '#5a10c9',

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
    /*
     * The drawn bubble's own colours, given rather than sampled.
     *
     * `Brand/Primary/Primary` carries the blue; these four carry the rest, and none of them has a home
     * in the ramp yet — there is no violet this deep, no sky this light and nothing near `#070d52` — so
     * they live here, once, and are flagged for `Accent/*` in the file if the drawn bubble ships.
     *
     * Published rather than declared on the hero's own rule because the `MeshBackdrop` runs the same
     * palette: the page's ambient light should be the light the hero is made of, and two copies of five
     * hexes is two places to change it.
     */
    '--sds-bubble-magenta': '#9500f2',
    '--sds-bubble-violet': '#6f0bd2',
    '--sds-bubble-sky': '#3fa2f7',
    '--sds-bubble-deep': '#070d52',
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
