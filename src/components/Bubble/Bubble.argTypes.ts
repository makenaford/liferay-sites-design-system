import type { Meta } from '@storybook/react-vite'
import type { Bubble } from './Bubble'

/**
 * The Controls-panel definition for every `BubbleProps` field, grouped by the two things the component
 * actually draws — the **Mesh** behind and the **Wave** in front — rather than one flat alphabetical
 * list. Shared with any other story that wants a fully controllable `<Bubble>`, e.g.
 * `Home.stories.tsx`'s `BubbleBackground`, so the grouping and ranges stay in one place.
 */
export const BUBBLE_ARG_TYPES = {
  speed: {
    control: { type: 'range', min: 0.05, max: 2, step: 0.05 },
    table: { category: 'Animation' },
  },
  paused: { control: 'boolean', table: { category: 'Animation' } },

  swell: {
    control: { type: 'range', min: 0, max: 0.3, step: 0.005 },
    table: { category: 'Wave' },
  },
  swellFrequency: {
    control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
    table: { category: 'Wave' },
  },
  ripple: {
    control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
    table: { category: 'Wave' },
  },
  rippleFrequency: {
    control: { type: 'range', min: 0.2, max: 8, step: 0.1 },
    table: { category: 'Wave' },
  },
  waterline: {
    control: { type: 'range', min: -1, max: 1, step: 0.02 },
    table: { category: 'Wave' },
  },
  edgeSoftness: {
    control: { type: 'range', min: 0, max: 0.3, step: 0.005 },
    table: { category: 'Wave' },
    description: '0 is a crisp curve. Anything above it costs an extra offscreen pass.',
  },
  surfaceColor: {
    control: 'text',
    table: { category: 'Wave' },
    description:
      'The colour the wave is painted in — **must match the page behind the component**, or it stops reading as transparency. Takes `var(--token)`.',
  },

  color: { control: 'color', table: { category: 'Mesh' }, description: "The mesh's deep ground." },
  hotColor: {
    control: 'color',
    table: { category: 'Mesh' },
    description: 'The lit colour the blobs drift either side of.',
  },
  richness: {
    control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
    table: { category: 'Mesh' },
    description: 'Hue spread across the blobs — what makes one colour read as several.',
  },
  saturation: {
    control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
    table: { category: 'Mesh' },
  },
  meshScale: {
    control: { type: 'range', min: 0.3, max: 2.5, step: 0.05 },
    table: { category: 'Mesh' },
  },
  meshFade: {
    control: { type: 'range', min: 0, max: 1, step: 0.02 },
    table: { category: 'Mesh' },
    description: 'How far the mesh dissolves into `surfaceColor` at the top edge.',
  },
  grain: { control: { type: 'range', min: 0, max: 0.3, step: 0.005 }, table: { category: 'Mesh' } },
  opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, table: { category: 'Mesh' } },

  cursorInteraction: { control: 'boolean', table: { category: 'Cursor' } },
  cursorLift: {
    control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
    table: { category: 'Cursor' },
    description: 'How far the wave rises under the pointer.',
  },
  cursorReach: {
    control: { type: 'range', min: 0.02, max: 0.6, step: 0.01 },
    table: { category: 'Cursor' },
  },
  meshDrift: {
    control: { type: 'range', min: 0, max: 0.6, step: 0.01 },
    table: { category: 'Cursor' },
    description: 'How far the pointer pulls the mesh — its parallax against the wave.',
  },

  adaptiveQuality: { control: 'boolean', table: { category: 'Performance' } },
  targetFps: {
    control: { type: 'range', min: 15, max: 60, step: 1 },
    table: { category: 'Performance' },
  },

  className: { control: false },
  style: { control: false },
} satisfies Meta<typeof Bubble>['argTypes']
