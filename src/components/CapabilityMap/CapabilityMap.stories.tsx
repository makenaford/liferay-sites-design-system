import type { Meta, StoryObj } from '@storybook/react-vite'
import { CapabilityMap, type CapabilityCluster } from './CapabilityMap'
import {
  IconGlassAiHub,
  IconGlassAnalytics,
  IconGlassCloudNativeExperience,
  IconGlassCommerce,
  IconGlassContentManagement,
  IconGlassContentMarketingPlatform,
  IconGlassContentPerformance,
  IconGlassDXP,
  IconGlassDigitalSalesRooms,
  IconGlassIntegration,
  IconGlassLiferayDataPlatform,
  IconGlassLowCode,
  IconGlassPIM,
  IconGlassPersonalization,
  IconGlassPremiumSecurity,
  IconGlassSearch,
  IconGlassSites,
} from '../../icons'

/**
 * The sixteen products, clockwise from the top left, each cluster read top → left → right → bottom.
 *
 * Every icon is the product's own from `assets/glass-icons` — `Commerce/PIM`, `General/ai`,
 * `General/Liferay Data Platform` and so on — rather than a UI glyph standing in for it. SEO Studio is
 * the one product with no icon of its own in the set, and borrows
 * `Product Modules/Content Performance/CDN`, since content performance is what it is for. The design
 * draws a magnifier with sparkles there; that icon does not exist yet, and is worth asking for.
 */
const PRODUCTS: CapabilityCluster[] = [
  {
    label: 'Commerce & Sales',
    items: [
      { label: 'PIM', icon: <IconGlassPIM />, href: '#pim', description: 'Product Information Management' },
      { label: 'Personalization', icon: <IconGlassPersonalization />, href: '#personalization' },
      { label: 'DSR', icon: <IconGlassDigitalSalesRooms />, href: '#dsr', description: 'Digital Sales Rooms' },
      { label: 'Commerce', icon: <IconGlassCommerce />, href: '#commerce' },
    ],
  },
  {
    label: 'Content & Experience',
    items: [
      { label: 'Sites', icon: <IconGlassSites />, href: '#sites' },
      { label: 'CMS', icon: <IconGlassContentManagement />, href: '#cms', description: 'Content Management System' },
      {
        label: 'CMP',
        icon: <IconGlassContentMarketingPlatform />,
        href: '#cmp',
        description: 'Content Marketing Platform',
      },
      { label: 'SEO Studio', icon: <IconGlassContentPerformance />, href: '#seo-studio' },
    ],
  },
  {
    label: 'Intelligence & AI',
    items: [
      { label: 'LDP', icon: <IconGlassLiferayDataPlatform />, href: '#ldp', description: 'Liferay Data Platform' },
      { label: 'AI Hub', icon: <IconGlassAiHub />, href: '#ai-hub' },
      { label: 'Search', icon: <IconGlassSearch />, href: '#search' },
      { label: 'Analytics', icon: <IconGlassAnalytics />, href: '#analytics' },
    ],
  },
  {
    label: 'Platform & Infrastructure',
    items: [
      { label: 'Cloud Native', icon: <IconGlassCloudNativeExperience />, href: '#cloud-native' },
      { label: 'Security', icon: <IconGlassPremiumSecurity />, href: '#security' },
      { label: 'Low-Code', icon: <IconGlassLowCode />, href: '#low-code' },
      { label: 'Integration', icon: <IconGlassIntegration />, href: '#integration' },
    ],
  },
]

const meta = {
  title: 'Components/CapabilityMap',
  component: CapabilityMap,
  parameters: { frame: { width: 1100 } },
  args: {
    clusters: PRODUCTS,
    hubIcon: <IconGlassDXP />,
    hubLabel: 'DXP',
  },
} satisfies Meta<typeof CapabilityMap>

export default meta
type Story = StoryObj<typeof meta>

/** The homepage figure: sixteen products around DXP, every tile a link. */
export const Default: Story = {}

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
    clusters: PRODUCTS.map((cluster, index) =>
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
  args: { clusters: PRODUCTS.slice(0, 2) },
}
