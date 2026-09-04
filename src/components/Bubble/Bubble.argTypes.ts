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

  bubbleScale: {
    control: { type: 'range', min: 0.1, max: 1.6, step: 0.01 },
    table: { category: 'Bubbles' },
    description:
      'Radius as a fraction of the **height**, so the bubbles are the same size however wide the frame gets.',
  },
  bubbleHeight: {
    control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
    table: { category: 'Bubbles' },
    description:
      'How tall they are as a multiple of their width. 1 is a circle; below it flattens them so the edge sweeps without reaching so far down.',
  },
  bubbleY: {
    control: { type: 'range', min: -0.3, max: 1, step: 0.01 },
    table: { category: 'Bubbles' },
    description:
      'Where the centres sit vertically. Well above centre by default, so what shows is the bubbles’ lower halves.',
  },
  bubbleSpread: {
    control: { type: 'range', min: 0, max: 0.8, step: 0.01 },
    table: { category: 'Bubbles' },
    description: 'How far apart the two sit. At 0 they stack and read as one shape.',
  },
  bubbleMorph: {
    control: { type: 'range', min: 0, max: 0.6, step: 0.01 },
    table: { category: 'Bubbles' },
    description: 'How far each outline departs from a circle. 0 gives two plain circles.',
  },
  bubblePulse: {
    control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
    table: { category: 'Bubbles' },
    description: 'How much they swell and shrink as they go.',
  },
  bubbleWander: {
    control: { type: 'range', min: 0, max: 0.25, step: 0.005 },
    table: { category: 'Bubbles' },
  },
  edgeSoftness: {
    control: { type: 'range', min: 0, max: 0.3, step: 0.005 },
    table: { category: 'Bubbles' },
    description: '0 is a crisp edge. Anything above it costs an extra offscreen pass.',
  },
  surfaceColor: {
    control: 'text',
    table: { category: 'Bubbles' },
    description:
      'The colour everything outside the bubbles is painted in — **must match the page behind the component**, or it stops reading as transparency. Takes `var(--token)`.',
  },

  color: {
    control: 'color',
    table: { category: 'Mesh (dark)' },
    description: "The ground the blobs sit on. Keep it near `surfaceColor` or the mesh gains an edge.",
  },
  hotColor: {
    control: 'color',
    table: { category: 'Mesh (dark)' },
    description: 'The lit colour the masses drift either side of.',
  },
  accentColor: {
    control: 'color',
    table: { category: 'Mesh (dark)' },
    description:
      'The second lit colour. Each mass sits somewhere between this and `hotColor`, so the mesh is two colours rather than one plus spread.',
  },
  colorLight: {
    control: 'color',
    table: { category: 'Mesh (light)' },
    description: 'The ground on a light surface. Which pair is used follows `surfaceColor`’s luminance.',
  },
  hotColorLight: {
    control: 'color',
    table: { category: 'Mesh (light)' },
    description: 'The lit colour on a light surface.',
  },
  accentColorLight: {
    control: 'color',
    table: { category: 'Mesh (light)' },
    description: 'The second lit colour on a light surface.',
  },
  richness: {
    control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
    table: { category: 'Mesh' },
    description: 'Hue spread across the blobs — what makes one colour read as several.',
  },
  spectralDrift: {
    control: { type: 'range', min: 0, max: 90, step: 2 },
    table: { category: 'Mesh' },
    description:
      'How far the hue sweeps either side of the palette, in degrees. It oscillates and returns — it does not rotate away.',
  },
  meshFollow: {
    control: { type: 'range', min: 0, max: 1, step: 0.05 },
    table: { category: 'Mesh' },
    description:
      'How strongly the colour masses are nailed to their bubble. At 0 they sit still and the bubbles slide over them.',
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

  glow: {
    control: { type: 'range', min: 0, max: 1, step: 0.05 },
    table: { category: 'Glow' },
    description: 'Brightness of the band. 0 turns the layer off and skips its pass.',
  },
  glowOpacity: {
    control: { type: 'range', min: 0, max: 1, step: 0.05 },
    table: { category: 'Glow' },
  },
  glowColor: {
    control: 'color',
    table: { category: 'Glow' },
    description: 'On a dark surface.',
  },
  glowColorLight: {
    control: 'color',
    table: { category: 'Glow' },
    description: 'On a light surface.',
  },
  glowWidth: {
    control: { type: 'range', min: 0.02, max: 0.8, step: 0.01 },
    table: { category: 'Glow' },
  },
  glowDistortion: {
    control: { type: 'range', min: 1, max: 3, step: 0.05 },
    table: { category: 'Glow' },
    description:
      "How far the rim's outline wanders off the bubble's. 1 rings the edge evenly; above it the light gathers and thins.",
  },
  glowOffset: {
    control: { type: 'range', min: -0.2, max: 0.4, step: 0.01 },
    table: { category: 'Glow' },
    description:
      'Moves the rim inside (positive) or outside (negative) the edge, as a fraction of the radius. Outside, the plate trims it.',
  },
  glowArc: {
    control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
    table: { category: 'Glow' },
    description:
      'How much of the outline is lit, from the bottom up. 1 rings the whole edge; below it the light gathers along the lower edge.',
  },
  glowBlend: {
    control: 'select',
    options: ['screen', 'lighten', 'overlay', 'soft-light', 'color-dodge', 'source-over'],
    table: { category: 'Glow' },
    description: 'How the glow is composited over the mesh.',
  },

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
