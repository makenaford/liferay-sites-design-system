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
          'A drifting colour mesh with a wave cut across it — two passes on one canvas, and the second is',
          'the whole trick:',
          '',
          '1. **The mesh** — overlapping soft colour masses on a deep ground, hues drifted either side of',
          '   `hotColor` by `richness`, each on its own slow orbit. This is the part with the colour in it.',
          '2. **The wave** — a flat plate of `surfaceColor`, *the page\'s own background*, filling everything',
          '   below the curve.',
          '',
          'So the wave is not lit and nothing is blended. The component is opaque everywhere and still reads',
          'as though the mesh were fading into the page, because below the curve it paints exactly what the',
          'page would have painted.',
          '',
          '**That only works while `surfaceColor` matches what is behind the component.** It defaults to the',
          'page-background token and resolves `var()` against the canvas, so it follows the colour scheme on',
          'its own — but sitting the component on a card means passing that card\'s colour.',
          '',
          '**Working the Controls panel below:** it opens grouped by what each prop draws — **Mesh**,',
          '**Wave**, **Cursor**, plus Animation and Performance — rather than alphabetically.',
          '',
          '- **Mesh** carries the look. `hotColor` sets the colour, and `richness` is what turns that one',
          '  colour into several by spreading the blobs\' hues either side of it — reach for `richness`',
          '  before reaching for a different `hotColor`. `meshScale` sizes the masses.',
          '- **Wave** is shape only: `waterline` places the curve, `swell`/`swellFrequency` bend it,',
          '  `edgeSoftness` decides whether it is a crisp cut or a soft dissolve.',
          '- **Cursor** does two jobs from one pointer — `cursorLift` raises the wave under it while',
          '  `meshDrift` pulls the mesh the other way, so the two layers separate as you move.',
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
