import type { Meta, StoryObj } from '@storybook/react-vite'
import { CapabilityMap } from './CapabilityMap'
import { PRODUCT_CLUSTERS } from '../../templates/product-map'
import { IconGlassDXP } from '../../icons'

const meta = {
  title: 'Components/CapabilityMap',
  component: CapabilityMap,
  argTypes: {
    names: {
      options: ['nested', 'outside'],
      control: 'inline-radio',
      description: "Where each section's name goes: in the hollow its tiles ring, or out past them on a leader.",
    },
    shape: {
      options: ['hexagon', 'octagon'],
      control: 'inline-radio',
      description: 'The tile, and the lattice under it.',
    },
  },
  parameters: { frame: { width: 1100 } },
  args: {
    clusters: PRODUCT_CLUSTERS,
    hubIcon: <IconGlassDXP />,
    hubLabel: 'DXP',
  },
} satisfies Meta<typeof CapabilityMap>

export default meta
type Story = StoryObj<typeof meta>

/** The homepage figure: sixteen products around DXP, every tile a link. */
export const Default: Story = {}

/**
 * The same sixteen products on an **octagonal** grid — the `dxp-grid` iteration's shape, drawn by the
 * component rather than placed by hand.
 *
 * Worth looking at with the honeycomb open beside it, because the difference is not really the tile.
 * Octagons cannot tile a plane on their own: the arrangement leaves a small square at every diagonal, so
 * the figure reads as sixteen things set down on a grid, where the honeycomb reads as one surface that
 * has been divided up. Which is right depends on what the picture is claiming — a platform whose parts
 * are cut from one thing, or a platform things are placed on.
 *
 * It costs size, and the cost is structural rather than a matter of tuning: a hexagon column advances
 * three-quarters of a tile because the columns interlock, an octagon column advances a whole one, and
 * the sections need a clear row between them, so the box goes from 5.6 x 4.9 tiles to 7.1 x 7.1. Since
 * the tile is the box divided by those numbers, every octagon is about a fifth smaller than the hexagon
 * it replaces at the same width — and the 14px label floor is what that eventually runs into.
 */
export const Octagons: Story = {
  args: { shape: 'octagon', names: 'outside' },
}

/**
 * The octagons with each name in the hollow its four tiles ring, the way the hexagon figure carries its
 * own. It is the more compact of the two — the names cost no width at all — but on this lattice the
 * hollow is a whole empty cell rather than a hexagon's narrow gap, so the name sits in more space than
 * it needs and the group reads as five things rather than four around a label.
 */
export const OctagonsNamesInside: Story = {
  args: { shape: 'octagon' },
}

/**
 * Without the grid reveal. The lattice stays hidden, which is the right call where the map sits on a
 * page that already has a texture of its own.
 */
export const NoGrid: Story = {
  args: { grid: false },
}

/** The hub as a target too, for a page that has somewhere to send someone who clicks the middle. */
export const HubLinked: Story = {
  args: { hubHref: '#dxp' },
}

/**
 * Half the map without links — what a capability with no page yet looks like. Those tiles keep their
 * fill and their label and lose the cursor, the ring and the growth, so the drawing stays intact and
 * nothing promises a destination that does not exist.
 */
export const PartiallyLinked: Story = {
  args: {
    clusters: PRODUCT_CLUSTERS.map((cluster, index) =>
      index % 2
        ? { ...cluster, items: cluster.items.map(({ href: _href, ...item }) => item) }
        : cluster,
    ),
  },
}

/** Without the wash, for a section that already has a background treatment of its own. */
export const NoWash: Story = {
  args: { wash: false },
}

/**
 * Without the network. The figure still reads, and this is the version to reach for on a page that is
 * already busy — but the sections lose the one thing that says they are wired to the platform.
 */
export const NoNetwork: Story = {
  args: { network: false },
}

/**
 * Narrow. Every distance in the map is a fraction of one tile and the tile is a fraction of the column,
 * so the figure scales whole — it does not reflow, because a honeycomb has no other arrangement. The
 * label holds at its 14px floor rather than shrinking, so below roughly 850px the two longest product
 * names wrap to two lines, and a page with less room than that should show a list instead.
 */
export const Narrow: Story = {
  parameters: { frame: { width: 360 } },
}

/** Two clusters, four items each — the map drawn with only half its groups. */
export const TwoClusters: Story = {
  args: { clusters: PRODUCT_CLUSTERS.slice(0, 2) },
}

/**
 * `maxHeight` — the figure fitted to the window rather than to its column.
 *
 * Sized by width alone the map is a little over 1000px tall in an 1100px section, which is more than
 * most windows have: the reader meets it a third at a time and never sees the shape the drawing is
 * about. A height ceiling brings the **width** down to meet it, so the whole figure stays in proportion
 * instead of being cropped or scrolled through. Resize the window and watch it settle.
 *
 * The Home page passes `max(860px, 100svh - 320px)` — the window less the section's own furniture, with a
 * floor of 860, which is a **167px hexagon** worked back through the canvas: 860 ÷ 4.9 cells tall × 0.95
 * fill. A card that size fits every product name on one line.
 */
export const FittedToTheWindow: Story = {
  args: { maxHeight: 'max(860px, 100svh - 120px)' },
}

/**
 * `names="outside"` — the section names set out past the tiles, each joined to its group by a leader
 * that lands on the group's own outline (`Homepage Redesign` node `8144:21713`).
 *
 * The name gets a line to itself and can be as long as it likes, and the four groups read as four
 * labelled objects rather than four arrangements. It is paid for in width: the names claim about four
 * tiles on each side, and width is what binds the card on an ordinary window — compare the card here
 * with `FittedToTheWindow`, which is the same figure with the names nested in their hollows.
 */
export const NamesOutside: Story = {
  /*
   * No 860 floor here. That number is a card size worked back through the *nested* canvas; this one is
   * close to 2:1, so a floor that tall would put the figure wider than any window and the height would
   * never bind. Left to the window, it answers it.
   */
  args: { names: 'outside', maxHeight: 'max(420px, 100svh - 120px)' },
  /*
   * Wider than the other stories — the names claim four tiles a side, and a 1100 frame starves them —
   * but not wider than the narrowest desktop the layout suite checks. At 1500 the frame itself pushed a
   * 1440 viewport 4px sideways, which is the story overflowing rather than the component.
   */
  parameters: { frame: { width: 1400 } },
}
