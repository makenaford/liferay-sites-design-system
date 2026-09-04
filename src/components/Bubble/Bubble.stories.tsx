import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@mantine/core'
import { Bubble, BUBBLE_DEFAULTS } from './Bubble'
import { BUBBLE_ARG_TYPES } from './Bubble.argTypes'
import { BUBBLE_LAYER2_ARG_TYPES, BUBBLE_LAYER2_DEFAULTS, splitBubbleLayerArgs } from './Bubble.layer2'
import type { BubbleLayer2Args } from './Bubble.layer2'
import type { BubbleProps } from './Bubble'

/** Fills a fixed-height, positioned box — the same wrapper the prototype and its README ask for. */
function Frame({ height = 420, children }: { height?: number; children: React.ReactNode }) {
  return (
    <Box pos="relative" h={height} w="100%" style={{ overflow: 'hidden' }}>
      {children}
    </Box>
  )
}

const meta = {
  title: 'Components/Bubble',
  component: Bubble,
  parameters: {
    frame: { width: 900 },
    docs: {
      description: {
        component: [
          'Ported from the `glowing-wave-studio` prototype: a single luminous wave sweeping across a',
          "`<canvas>`, recreating the reference \"bubble canvas\" look — a deep black field with a blue →",
          'violet → magenta rim glow riding a low crest. Fills its parent, so give the parent an explicit',
          'height (or `position: absolute; inset: 0` inside a positioned container).',
          '',
          '**Working the Controls panel below:** with 24 props, the fastest way in is *not* the alphabetical',
          'list — it opens grouped into the same seven sections the prototype used (Animation, Wave shape,',
          'Glow, Body, Color, Cursor interaction, Performance). Start from one of the preset stories in the',
          'sidebar (`BubbleCanvas`, `Aurora`, `Sunset`, `ReactbitsDefault`) rather than the bare `Playground`',
          '— a preset is already a coherent combination, and it is much easier to see what one slider does',
          'against a settled composition than against defaults. From there:',
          '',
          '- Open **Wave shape** and **Glow** first — `swell`/`swellFrequency` set the crest’s motion, and',
          '  `glow`/`halo` set how hot it reads; those two groups account for most of the visual character.',
          '- **Color** has three swatches — `color` (the deep fill), `hotColor` (the crest/glow), and',
          '  `backgroundColor` — plus `richness`, which drifts the hue *along* the crest rather than',
          '  changing it outright; push `richness` before reaching for a different `hotColor`.',
          '- Leave **Performance** (`adaptiveQuality`, `targetFps`) alone unless the canvas is visibly',
          '  stuttering in the preview — it exists to protect frame rate, not to be tuned for looks.',
          '- Toggle `paused` on while dialing in **Body**/**Wave shape** values that are easier to judge on a',
          '  still frame, then switch it back off to check the motion.',
        ].join('\n'),
      },
    },
  },
  args: { ...BUBBLE_DEFAULTS },
  argTypes: BUBBLE_ARG_TYPES,
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control, grouped by the sections noted above. Starts from the bare defaults. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/**
 * The component's own defaults, and the reference look this was built to match: deep black field, low
 * crest, blue → violet → magenta rim band.
 */
export const BubbleCanvas: Story = { render: (args) => <Frame><Bubble {...args} /></Frame> }

/** Teal → lime crest riding higher in the frame. */
export const Aurora: Story = {
  args: {
    speed: 0.8,
    swell: 0.07,
    swellFrequency: 1.3,
    ripple: 0.025,
    rippleFrequency: 2.1,
    waterline: 0.18,
    glow: 1,
    glowWidth: 0.04,
    halo: 0.9,
    haloWidth: 0.24,
    depth: 0.5,
    edgeSoftness: 0.06,
    color: '#031a12',
    hotColor: '#34e8b0',
    backgroundColor: '#000003',
    richness: 0.5,
    saturation: 1.1,
    grain: 0.03,
    cursorLift: 0.1,
    cursorReach: 0.22,
  },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** Warm amber crest over a maroon deep, calmer motion. */
export const Sunset: Story = {
  args: {
    speed: 0.6,
    swell: 0.12,
    swellFrequency: 2,
    ripple: 0.04,
    rippleFrequency: 4,
    waterline: 0.1,
    glow: 0.9,
    glowWidth: 0.05,
    halo: 0.7,
    haloWidth: 0.22,
    depth: 0.7,
    edgeSoftness: 0.12,
    color: '#210a10',
    hotColor: '#ff9d4d',
    backgroundColor: '#0a0503',
    richness: 0.25,
    saturation: 1.1,
    grain: 0.06,
    cursorLift: 0.08,
    cursorReach: 0.3,
  },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** The component's un-tuned starting point before "Bubble Canvas" was dialed in — cool slate on white. */
export const ReactbitsDefault: Story = {
  args: {
    speed: 1,
    swell: 0.15,
    swellFrequency: 3,
    ripple: 0.08,
    rippleFrequency: 6,
    waterline: 0,
    glow: 0.6,
    glowWidth: 0.05,
    halo: 0.35,
    haloWidth: 0.2,
    depth: 0.6,
    edgeSoftness: 0.1,
    color: '#0f172a',
    hotColor: '#c7d2fe',
    backgroundColor: '#ffffff',
    richness: 0.35,
    saturation: 0.9,
    grain: 0.05,
    cursorLift: 0.12,
    cursorReach: 0.25,
  },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/**
 * Two layers stacked with `position: absolute` and a `mix-blend-mode` on the top one — the prototype's
 * two-wave overlap, reproduced with plain CSS rather than a prop the component doesn't need.
 *
 * The bottom layer is driven by the same args as every other story (change `hotColor`, `swell`, etc. in
 * the main groups above and it responds). The top layer gets its own small set of controls under
 * **Layers** — its own `color` / `hotColor` / `backgroundColor`, `waterline`, `swell` and blend mode —
 * since giving it the full 24-control set would just duplicate the panel above for no benefit.
 */
export const TwoLayers = {
  args: { ...BUBBLE_LAYER2_DEFAULTS },
  argTypes: BUBBLE_LAYER2_ARG_TYPES,
  render: (args: BubbleProps & BubbleLayer2Args) => {
    const { bottomLayerProps, topLayerProps, layer2BlendMode } = splitBubbleLayerArgs(args)
    return (
      <Frame height={480}>
        <Box pos="absolute" inset={0}>
          <Bubble {...bottomLayerProps} />
        </Box>
        <Box pos="absolute" inset={0} style={{ mixBlendMode: layer2BlendMode }}>
          <Bubble {...topLayerProps} />
        </Box>
      </Frame>
    )
  },
}

/** `paused` frozen on one frame — useful while dialing in Wave shape or Body values by eye. */
export const Paused: Story = {
  args: { paused: true },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}
