import type { CSSProperties } from 'react'
import type { BubbleProps } from './Bubble'

/**
 * The extra args a "two `Bubble` layers, stacked with a CSS blend mode" composition needs for its top
 * layer — its own colours, wave shape, and blend mode — kept separate from the full `BubbleProps` set so
 * a story can give the top layer a small, distinct control group instead of duplicating all 24 props a
 * second time. Shared between `Bubble.stories.tsx`'s `TwoLayers` and `Home.stories.tsx`'s
 * `BubbleBackground`, which both compose two layers the same way.
 */
export interface BubbleLayer2Args {
  layer2BlendMode: CSSProperties['mixBlendMode']
  layer2Color: string
  layer2HotColor: string
  layer2BackgroundColor: string
  layer2Waterline: number
  layer2Swell: number
  layer2SwellFrequency: number
}

/** A teal → lime top layer over whatever the bottom layer is set to — the prototype's Aurora pairing. */
export const BUBBLE_LAYER2_DEFAULTS: BubbleLayer2Args = {
  layer2BlendMode: 'screen',
  layer2Color: '#031a12',
  layer2HotColor: '#34e8b0',
  layer2BackgroundColor: 'transparent',
  layer2Waterline: 0.18,
  layer2Swell: 0.07,
  layer2SwellFrequency: 1.3,
}

/**
 * A **colour-mesh** pairing rather than two readable waves: broad, overlapping bands of violet, blue and
 * magenta that bleed into each other, with no drawn crest.
 *
 * Same component, same two-layer composition — only the props differ, and each one is doing a specific
 * job in getting there:
 *
 * - **`glow: 0.1`** is the important one. The crest stroke is what makes the default read as *a wave*
 *   with a lit edge; a mesh has no line in it anywhere. Taking it almost to zero leaves the colour mass
 *   without the contour that was announcing it.
 * - **`halo: 1.6` / `haloWidth: 0.55`** put the light back as a wide, blurred band instead — that band,
 *   not the crest, is the mesh's shape.
 * - **`edgeSoftness: 0.32`** turns the fill's boundary into a ~100px gradient, so the colour arrives
 *   rather than starting.
 * - **`richness: 1.15`** is what makes it multi-colour at all: it drifts the hue *along* the band, which
 *   is how one `hotColor` becomes blue → violet → magenta across the width.
 * - **`swellFrequency: 0.7`** with **`ripple: 0`** gives one slow sweep across the frame instead of a
 *   repeating wave train, and **`speed: 0.35`** keeps it drifting rather than travelling.
 * - **Both backgrounds `transparent`**, so what is *not* mesh is the page rather than a dark slab of the
 *   component's own — see `Bubble`'s `backgroundColor` note.
 */
export const BUBBLE_MESH: BubbleProps & BubbleLayer2Args = {
  speed: 0.35,
  swell: 0.16,
  swellFrequency: 0.7,
  ripple: 0,
  rippleFrequency: 1.4,
  waterline: -0.35,
  glow: 0.1,
  glowWidth: 0.02,
  halo: 0.6,
  haloWidth: 0.5,
  depth: 1.5,
  edgeSoftness: 0.24,
  color: '#120631',
  hotColor: '#4c1d95',
  backgroundColor: 'transparent',
  richness: 1.1,
  saturation: 1.08,
  grain: 0.035,
  cursorInteraction: true,
  cursorLift: 0.06,
  cursorReach: 0.35,
  adaptiveQuality: true,
  targetFps: 60,
  opacity: 1,
  paused: false,

  layer2BlendMode: 'lighten',
  layer2Color: '#06122e',
  layer2HotColor: '#1e3a8a',
  layer2BackgroundColor: 'transparent',
  layer2Waterline: -0.08,
  layer2Swell: 0.1,
  layer2SwellFrequency: 1.1,
}

export const BUBBLE_LAYER2_ARG_TYPES = {
  layer2BlendMode: {
    control: 'select',
    options: ['screen', 'lighten', 'difference', 'normal'],
    table: { category: 'Layers' },
    description: 'CSS `mix-blend-mode` on the top layer.',
  },
  layer2Color: { control: 'color', table: { category: 'Layers' }, description: "Top layer's deep colour." },
  layer2HotColor: { control: 'color', table: { category: 'Layers' }, description: "Top layer's crest colour." },
  layer2BackgroundColor: {
    control: 'color',
    table: { category: 'Layers' },
    description: "Top layer's canvas background — usually `transparent` so the bottom layer shows through.",
  },
  layer2Waterline: {
    control: { type: 'range', min: -1, max: 1, step: 0.02 },
    table: { category: 'Layers' },
  },
  layer2Swell: {
    control: { type: 'range', min: 0, max: 0.3, step: 0.005 },
    table: { category: 'Layers' },
  },
  layer2SwellFrequency: {
    control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
    table: { category: 'Layers' },
  },
}

/** Splits a combined args object into the bottom layer's `BubbleProps` and the top layer's overrides. */
export function splitBubbleLayerArgs<T extends BubbleProps & BubbleLayer2Args>(args: T) {
  const {
    layer2BlendMode,
    layer2Color,
    layer2HotColor,
    layer2BackgroundColor,
    layer2Waterline,
    layer2Swell,
    layer2SwellFrequency,
    ...bottomLayerProps
  } = args
  const topLayerProps: BubbleProps = {
    ...bottomLayerProps,
    color: layer2Color,
    hotColor: layer2HotColor,
    backgroundColor: layer2BackgroundColor,
    waterline: layer2Waterline,
    swell: layer2Swell,
    swellFrequency: layer2SwellFrequency,
  }
  return { bottomLayerProps: bottomLayerProps as BubbleProps, topLayerProps, layer2BlendMode }
}
