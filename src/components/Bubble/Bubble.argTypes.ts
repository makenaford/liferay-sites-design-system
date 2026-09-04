import type { Meta } from '@storybook/react-vite'
import type { Bubble } from './Bubble'

/**
 * The Controls-panel definition for every `BubbleProps` field, grouped into the same seven sections the
 * `glowing-wave-studio` prototype used (Animation, Wave shape, Glow, Body, Color, Cursor interaction,
 * Performance) rather than one flat alphabetical list.
 *
 * Shared between `Bubble.stories.tsx`'s own stories and any other story that wants a fully controllable
 * `<Bubble>` — e.g. `Home.stories.tsx`'s `BubbleBackground` — so the grouping and ranges stay in one
 * place rather than drifting between copies.
 */
export const BUBBLE_ARG_TYPES = {
  speed: {
    control: { type: 'range', min: 0.1, max: 3, step: 0.05 },
    table: { category: 'Animation' },
  },
  paused: { control: 'boolean', table: { category: 'Animation' } },

  swell: {
    control: { type: 'range', min: 0, max: 0.3, step: 0.005 },
    table: { category: 'Wave shape' },
  },
  swellFrequency: {
    control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
    table: { category: 'Wave shape' },
  },
  ripple: {
    control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
    table: { category: 'Wave shape' },
  },
  rippleFrequency: {
    control: { type: 'range', min: 0.5, max: 12, step: 0.1 },
    table: { category: 'Wave shape' },
  },
  waterline: {
    control: { type: 'range', min: -1, max: 1, step: 0.02 },
    table: { category: 'Wave shape' },
  },

  glow: { control: { type: 'range', min: 0, max: 2, step: 0.05 }, table: { category: 'Glow' } },
  glowWidth: {
    control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
    table: { category: 'Glow' },
  },
  halo: { control: { type: 'range', min: 0, max: 2, step: 0.05 }, table: { category: 'Glow' } },
  haloWidth: {
    control: { type: 'range', min: 0, max: 0.6, step: 0.01 },
    table: { category: 'Glow' },
  },

  depth: { control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 }, table: { category: 'Body' } },
  edgeSoftness: {
    control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
    table: { category: 'Body' },
  },

  color: { control: 'color', table: { category: 'Color' }, description: 'Deep colour under the wave.' },
  hotColor: {
    control: 'color',
    table: { category: 'Color' },
    description: 'Colour of the crest and glow.',
  },
  backgroundColor: {
    control: 'color',
    table: { category: 'Color' },
    description: 'Canvas background colour.',
  },
  richness: { control: { type: 'range', min: 0, max: 1.5, step: 0.05 }, table: { category: 'Color' } },
  saturation: {
    control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
    table: { category: 'Color' },
  },
  grain: { control: { type: 'range', min: 0, max: 0.3, step: 0.01 }, table: { category: 'Color' } },
  opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, table: { category: 'Color' } },

  cursorInteraction: { control: 'boolean', table: { category: 'Cursor interaction' } },
  cursorLift: {
    control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
    table: { category: 'Cursor interaction' },
  },
  cursorReach: {
    control: { type: 'range', min: 0.02, max: 0.6, step: 0.01 },
    table: { category: 'Cursor interaction' },
  },

  adaptiveQuality: { control: 'boolean', table: { category: 'Performance' } },
  targetFps: {
    control: { type: 'range', min: 15, max: 60, step: 1 },
    table: { category: 'Performance' },
  },

  className: { control: false },
  style: { control: false },
} satisfies Meta<typeof Bubble>['argTypes']
