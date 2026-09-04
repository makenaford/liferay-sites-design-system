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
        /*
         * The docs page's only description — setting this replaces the component's JSDoc rather than
         * adding to it, so the explanation lives here and `Bubble`'s own docblock stays a short
         * orientation for whoever has the file open.
         */
        component: [
          'Two morphing bubbles filled with a drifting colour mesh. Four passes on one canvas: the **mesh**',
          'inside them, the **rim** just within each edge, the **plate** of `surfaceColor` filling',
          'everything *except* the bubbles, and an optional **border** on the outline.',
          '',
          'Nothing is blended with the page. The component is opaque throughout and reads as two bubbles',
          'floating on it only because everywhere that is not a bubble it paints exactly what the page',
          'would have — **so `surfaceColor` has to match what is behind it.** On a card, pass the card\'s',
          'colour.',
          '',
          '**The Controls below** are grouped by what each prop draws rather than alphabetically. The ones',
          'worth knowing before reaching for a slider:',
          '',
          '- **Bubbles** — `bubbleY` places the **visible edge**, which is all you see of them and the part',
          '  that has to sit right against the content in front. `bubbleScale`/`bubbleSpread` are read',
          '  together, and the interesting range is where the two just touch. `bubbleStagger` and',
          '  `bubbleBalance` stop the pair reading as one shape drawn twice; at 0 they show why.',
          '- **Mesh** — two poles, `hotColor` and `accentColor`, with each mass between them. `richness` is',
          '  a different thing: spread either side of wherever a mass already sits, variation within a',
          '  colour rather than a second one. `meshMotion` is how *far* the colour travels, `speed` how',
          '  fast. Each pole has a value per scheme.',
          '- **Glow** and **Border** are the two ways to light an edge. The rim is drawn before the plate',
          '  and trimmed to the inside of the outline; the border after it, straddling the outline and',
          '  glowing onto the page.',
          '- **Cursor** does two jobs at once — `cursorLift` draws the bubbles toward the pointer while',
          '  `meshDrift` pulls the mesh the other way, so the colour lags behind the shape.',
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
 * Placing the bubbles — and the thing being placed is not really the bubble, it is **the edge you can
 * see**, since the rest of it is off the top of the frame.
 *
 * - `bubbleY` moves the pair up and down, and is what decides how far down that edge falls. Low values
 *   hang them off the top, which is the default.
 * - `bubbleX` moves the pair across, `bubbleScale` and `bubbleSpread` set how much of the frame they
 *   cover, read together.
 *
 * The bubbles stay circles — there is no separate control for how tall they are, because on a shape
 * hanging off the top of the frame, stretching it downward and moving it down are the same picture.
 *
 * Below: high and tight, the default, and low and wide.
 */
export const Placement: Story = {
  render: (args) => (
    <Box>
      {[
        { bubbleY: 0.02, bubbleScale: 0.5, bubbleSpread: 0.85 },
        { bubbleY: 0.18, bubbleScale: 0.59, bubbleSpread: 1.05 },
        { bubbleY: 0.34, bubbleScale: 0.72, bubbleSpread: 1.35 },
      ].map((placement) => (
        <Frame key={placement.bubbleY} height={220}>
          <Bubble {...args} {...placement} />
        </Frame>
      ))}
    </Box>
  ),
}

/**
 * What makes the two read as a **pair** rather than as one shape drawn twice — `bubbleStagger` hanging
 * one higher than the other, and `bubbleBalance` making one larger as the other shrinks.
 *
 * The first row has both at 0, and it is the useful thing to look at: two identical circles at identical
 * heights read as a repeat, and their shared edge is the same height all the way across, so nothing in
 * it says there are two. The rows below put the difference back.
 */
export const Pair: Story = {
  render: (args) => (
    <Box>
      {[
        { bubbleStagger: 0, bubbleBalance: 0 },
        { bubbleStagger: 0.09, bubbleBalance: -0.1 },
        { bubbleStagger: 0.3, bubbleBalance: 0.35 },
      ].map((pair) => (
        <Frame key={pair.bubbleStagger} height={220}>
          <Bubble {...args} {...pair} />
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
 * The border: off, a drawn line, and blurred into a halo.
 *
 * It is drawn *after* the plate, which is the whole difference between it and the rim — the rim comes
 * before and is trimmed to the inside of the edge, this straddles the outline and glows out onto the
 * page. A shape can want either, both or neither.
 *
 * `borderBlur` is what decides which of the two things it is. At 0 it is an outline, and the shape reads
 * as drawn; past roughly its own width it stops being an edge at all and becomes a halo around the form.
 */
export const Border: Story = {
  render: (args) => (
    <Box>
      {[
        { borderOpacity: 0 },
        { borderOpacity: 1, borderBlur: 0 },
        { borderOpacity: 1, borderBlur: 0.03 },
      ].map((border, i) => (
        <Frame key={i} height={220}>
          <Bubble {...args} {...border} borderWidth={0.006} />
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
