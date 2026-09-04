import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Box } from '@mantine/core'
import { Bubble, BUBBLE_DEFAULTS } from './Bubble'
import { BUBBLE_ARG_TYPES } from './Bubble.argTypes'

/**
 * Fills a fixed-height, positioned box — what the component asks its parent for.
 *
 * No background of its own: the point of `surfaceColor` is that the wave paints what the page would
 * have, so a frame that painted its own colour here would be testing the wrong thing.
 */
function Frame({ height = 420, children }: { height?: number; children: ReactNode }) {
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
          'A drifting colour mesh with a wave cut across it — three passes on one canvas, and the last is',
          'the whole trick:',
          '',
          '1. **The mesh** — overlapping soft colour masses on a deep ground, hues drifted either side of',
          '   `hotColor` by `richness` and swept through the field by `spectralDrift`. Each mass is carried',
          '   by the wave beneath it (`meshFollow`), so the colour moves *with* the curve.',
          '2. **The glow** — a blurred band along the wave\'s own curve with its amplitudes multiplied by',
          '   `glowDistortion`: same swell, looser form. It is composited with `glowBlend` so it sits in the',
          '   mesh rather than on it, and the wave cuts it off, so what shows hugs the crest\'s upper side.',
          '3. **The wave** — a flat plate of `surfaceColor`, *the page\'s own background*, filling everything',
          '   below the curve.',
          '',
          'So the wave is not lit and nothing is blended with the page. The component is opaque everywhere and still reads',
          'as though the mesh were fading into the page, because below the curve it paints exactly what the',
          'page would have painted.',
          '',
          '**That only works while `surfaceColor` matches what is behind the component.** It defaults to the',
          'page-background token and resolves `var()` against the canvas, so it follows the colour scheme on',
          'its own — but sitting the component on a card means passing that card\'s colour.',
          '',
          '**Working the Controls panel below:** it opens grouped by what each prop draws — **Mesh**,',
          '**Glow**, **Wave**, **Cursor**, plus Animation and Performance — rather than alphabetically.',
          '',
          '- **Mesh** carries the look. `hotColor` sets the colour, and `richness` is what turns that one',
          '  colour into several by spreading the blobs\' hues either side of it — reach for `richness`',
          '  before reaching for a different `hotColor`. `spectralDrift` then sweeps that spread through',
          '  the field, and `meshFollow` ties the whole field to the wave. `meshScale` sizes the masses.',
          '- **Glow** is the band along the crest. `glow` is its brightness and `glowOpacity` the layer\'s,',
          '  which are worth having apart: the first changes how hot the band is, the second how much of',
          '  it survives the blend. `glowBlend` decides how it meets the mesh — `screen`/`lighten` add',
          '  light, `overlay`/`soft-light` keep more of the mesh\'s own hue.',
          '- **Wave** is shape only: `waterline` places the curve, `swell`/`swellFrequency` bend it,',
          '  `edgeSoftness` decides whether it is a crisp cut or a soft dissolve. The glow follows',
          '  whatever this group is set to, so the two never drift apart.',
          '- **Cursor** does three jobs from one pointer — `cursorLift` raises the wave under it, the glow',
          '  rises with it, and `meshDrift` pulls the mesh the other way.',
          '- Leave **Performance** alone unless the canvas is visibly stuttering.',
        ].join('\n'),
      },
    },
  },
  args: { ...BUBBLE_DEFAULTS },
  argTypes: BUBBLE_ARG_TYPES,
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control, grouped as described above. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** The defaults: a violet mesh, cut low, drifting slowly. */
export const Default: Story = { render: (args) => <Frame><Bubble {...args} /></Frame> }

/**
 * `edgeSoftness={0}` — the wave as a crisp curve rather than a dissolve. The cheapest version too: a soft
 * edge costs an extra offscreen pass, a crisp one is filled straight onto the canvas.
 */
export const CrispEdge: Story = {
  args: { edgeSoftness: 0 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** A soft dissolve instead of a cut, for a wave that has to sit under text. */
export const SoftEdge: Story = {
  args: { edgeSoftness: 0.12 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** Teal → lime, and a wave riding higher in the frame. Same mesh, different two colours. */
export const Aurora: Story = {
  args: { color: '#04170f', hotColor: '#2bb98a', waterline: 0.12, richness: 0.8 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** Warm amber over a maroon ground. */
export const Sunset: Story = {
  args: { color: '#220a10', hotColor: '#c2571f', waterline: -0.1, richness: 0.55, speed: 0.25 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/**
 * The glow layer on its own terms: off, default, and pushed. It is the band of light along the wave, and
 * because its curve is the wave's amplified rather than a shape of its own, it stays with the wave
 * whatever the **Wave** group is set to.
 */
export const Glow: Story = {
  render: (args) => (
    <Box>
      {[0, 0.55, 1].map((glow) => (
        <Frame key={glow} height={200}>
          <Bubble {...args} glow={glow} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * `glowBlend`, which is how the band meets the mesh rather than how bright it is: `screen` and `lighten`
 * add light and keep the mesh readable underneath, `overlay` and `soft-light` bend toward the mesh's own
 * hue, and `source-over` paints it flat on top — the one that looks pasted on, and the reason the others
 * are the defaults.
 */
export const GlowBlends: Story = {
  render: (args) => (
    <Box>
      {(['screen', 'overlay', 'soft-light', 'source-over'] as const).map((glowBlend) => (
        <Frame key={glowBlend} height={200}>
          <Bubble {...args} glowBlend={glowBlend} glow={0.8} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * `meshFollow` at both ends — whether the colour is carried by the wave or drifting past it. At 0 the two
 * halves animate on unrelated clocks and read as two things sharing a canvas; at 1 the field rises and
 * falls with the curve under it.
 */
export const MeshFollow: Story = {
  render: (args) => (
    <Box>
      {[0, 1].map((meshFollow) => (
        <Frame key={meshFollow} height={220}>
          <Bubble {...args} meshFollow={meshFollow} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * `richness` at both ends, which is the prop that decides whether this reads as a mesh at all: at 0 every
 * blob is the same hue and the field is one colour lit unevenly; high, they spread into separate colours
 * that meet.
 */
export const Richness: Story = {
  render: (args) => (
    <Box>
      {[0, 0.5, 1.4].map((richness) => (
        <Frame key={richness} height={200}>
          <Bubble {...args} richness={richness} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * On a surface that is **not** the page — a card. `surfaceColor` has to be told, or the wave paints the
 * page's colour onto a card that is not that colour and the shape stops disappearing.
 */
export const OnACard: Story = {
  args: { surfaceColor: '#101828' },
  render: (args) => (
    <Box bg="#101828" p={24} style={{ borderRadius: 16 }}>
      <Frame height={320}>
        <Bubble {...args} />
      </Frame>
    </Box>
  ),
}

/** `paused` frozen on one frame — useful while dialing values in by eye. */
export const Paused: Story = {
  args: { paused: true },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}
