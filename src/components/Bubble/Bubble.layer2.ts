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
