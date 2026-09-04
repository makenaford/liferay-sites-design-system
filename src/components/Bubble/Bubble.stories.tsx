import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Box } from '@mantine/core'
import { Bubble, BUBBLE_DEFAULTS } from './Bubble'
import { BUBBLE_ARG_TYPES } from './Bubble.argTypes'

/**
 * Fills a fixed-height, positioned box — what the component asks its parent for.
 *
 * No background of its own: the point of `surfaceColor` is that the plate paints what the page would
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
          'Two morphing bubbles filled with a drifting colour mesh — three passes on one canvas, and the',
          'last is the whole trick:',
          '',
          '1. **The mesh** — overlapping soft colour masses on a deep ground, hues drifted either side of',
          '   `hotColor` by `richness` and swept around it by `spectralDrift`. Every mass belongs to a',
          '   bubble and is placed in *that bubble\'s* coordinates, so when a bubble wanders, swells or',
          '   morphs, the colour inside it goes with it (`meshFollow`).',
          '2. **The rim** — a blurred outline just inside each bubble\'s edge, composited with `glowBlend`',
          '   so it sits in the mesh rather than on it. The plate trims whatever falls outside, so what',
          '   survives is light caught in the bubble\'s own skin.',
          '3. **The plate** — `surfaceColor`, *the page\'s own background*, filling everything **except**',
          '   the two bubbles.',
          '',
          'So nothing is lit and nothing is blended with the page. The component is opaque everywhere and still reads',
          'as two bubbles floating on the page, because everywhere that is not a bubble it paints exactly',
          'what the page would have painted.',
          '',
          '**That only works while `surfaceColor` matches what is behind the component.** It defaults to the',
          'page-background token and resolves `var()` against the canvas, so it follows the colour scheme on',
          'its own — but sitting the component on a card means passing that card\'s colour.',
          '',
          '**Working the Controls panel below:** it opens grouped by what each prop draws — **Bubbles**,',
          '**Mesh**, **Glow**, **Cursor**, plus Animation and Performance — rather than alphabetically.',
          '',
          '- **Bubbles** is shape and placement. `bubbleMorph` decides whether they read as bubbles or as',
          '  two discs. `bubbleY` and `bubbleHeight` place the **visible edge** — the bubbles are taller',
          '  than the frame, so that edge is all you see, and it is what has to sit right against the',
          '  content in front of it. `bubbleScale` and `bubbleSpread` are read together, and the',
          '  interesting range is where the two just touch. `edgeSoftness` decides crisp or dissolved.',
          '- **Mesh** carries the colour, and it has two poles: `hotColor` and `accentColor`, with each',
          '  mass sitting somewhere between them. Those are what make the mesh two colours; `richness` is',
          '  different, spreading hues either side of wherever a mass already sits — variation within a',
          '  colour rather than a second one. `spectralDrift` sweeps that spread around and back;',
          '  `meshFollow` is what nails the colour to the bubbles rather than to the canvas. Each pole has',
          '  its own value per scheme, under **Mesh (dark)** and **Mesh (light)**.',
          '- **Glow** is the rim inside each edge. `glow` is its brightness and `glowOpacity` the layer\'s,',
          '  which are worth having apart: the first changes how hot the rim is, the second how much of it',
          '  survives the blend. `glowOffset` floats it inward. `glowBlend` decides how it meets the mesh —',
          '  `screen`/`lighten` add light, `overlay`/`soft-light` keep more of the mesh\'s own hue.',
          '- **Cursor** does two jobs from one pointer — `cursorLift` draws the bubbles toward it while',
          '  `meshDrift` pulls the mesh within them the other way, so the colour lags behind the shape.',
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

/** The defaults: two violet bubbles, morphing and drifting slowly. */
export const Default: Story = { render: (args) => <Frame><Bubble {...args} /></Frame> }

/**
 * `edgeSoftness={0}` — the bubbles as crisp shapes rather than dissolves. The cheapest version too: a
 * soft edge costs an extra offscreen pass, a crisp one is filled straight onto the canvas.
 */
export const CrispEdge: Story = {
  args: { edgeSoftness: 0 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** A soft dissolve instead of a cut, for bubbles that have to sit under text. */
export const SoftEdge: Story = {
  args: { edgeSoftness: 0.12 },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/**
 * Placing the bubbles, which is four props read together — and the thing being placed is not really the
 * bubble, it is **the edge you can see**, since the rest of it is off the top of the frame.
 *
 * - `bubbleY` moves the centres up and down. Low values hang them off the top, which is the default.
 * - `bubbleHeight` decides how far down they reach without changing how wide they are — the axis that
 *   would otherwise be locked, since size comes from the width.
 * - `bubbleScale` and `bubbleSpread` set how much of the frame they cover, read together.
 *
 * Below: flattened and high, the default, and tall and low.
 */
export const Placement: Story = {
  render: (args) => (
    <Box>
      {[
        { bubbleHeight: 0.55, bubbleY: 0.1 },
        { bubbleHeight: 1, bubbleY: 0.18 },
        { bubbleHeight: 1.4, bubbleY: 0.3 },
      ].map((placement) => (
        <Frame key={placement.bubbleHeight} height={220}>
          <Bubble {...args} {...placement} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * `bubbleMorph` at both ends: two plain circles, and two shapes you could not name. This is the prop
 * that decides whether they read as *bubbles* or as discs with colour in them.
 */
export const Morph: Story = {
  render: (args) => (
    <Box>
      {[0, 0.2, 0.45].map((bubbleMorph) => (
        <Frame key={bubbleMorph} height={220}>
          <Bubble {...args} bubbleMorph={bubbleMorph} />
        </Frame>
      ))}
    </Box>
  ),
}

/** Teal and lime as the two poles, on a near-black ground. */
export const Aurora: Story = {
  args: {
    color: '#04170f',
    hotColor: '#2bb98a',
    accentColor: '#7fd93a',
    glowColor: '#8ff0c4',
    richness: 0.8,
  },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/** Amber and rose over a maroon ground — a pair that straddles red, which the short-arc hue lerp handles. */
export const Sunset: Story = {
  args: {
    color: '#220a10',
    hotColor: '#c2571f',
    accentColor: '#d6317a',
    glowColor: '#ffb877',
    richness: 0.55,
    speed: 0.25,
  },
  render: (args) => (
    <Frame>
      <Bubble {...args} />
    </Frame>
  ),
}

/**
 * The rim on its own terms: off, default, and pushed. Because its outline is each bubble's own, scaled
 * inward, it stays on the edge whatever the **Bubbles** group is set to — it is not a second shape that
 * has to be kept in step.
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
 * `meshFollow` at both ends — whether the colour belongs to the bubbles or to the canvas. At 1 each mass
 * is nailed to its bubble and travels, swells and morphs with it. At 0 the masses sit still and the
 * bubbles slide over them like windows onto a fixed painting, which is a flatter effect and occasionally
 * the one you want.
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
 * On a surface that is **not** the page — a card. `surfaceColor` has to be told, or the plate paints the
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
