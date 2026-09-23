import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text, Title } from '@mantine/core'
import { SecondaryNav, type SecondaryNavItem } from './SecondaryNav'
import { Header } from '../Header'
import { SITE_ACTIONS, SITE_DRAWER_CONTROLS, SITE_NAV_ITEMS } from '../../templates/site-nav-render'
import {
  IconBook2,
  IconBox3,
  IconBuilding2,
  IconChartLine,
  IconDocument2,
  IconGroup,
  IconPresentation1,
  IconSearch,
  IconSettings5,
  IconShop,
  IconShoppingBag1,
  IconShoppingCart2,
} from '../../icons'

/** The file's four sections, each opening onto a handful of placeholder links. */
const COMMERCE_ITEMS: SecondaryNavItem[] = [
  {
    value: 'features',
    label: 'Features',
    links: [
      {
        label: 'Product Catalog',
        href: '#catalog',
        icon: <IconBox3 />,
        description: 'Manage products, variants and pricing in one place.',
      },
      {
        label: 'Storefronts',
        href: '#storefronts',
        icon: <IconShop />,
        description: 'Launch B2B and B2C storefronts on one platform.',
      },
      {
        label: 'Search & Discovery',
        href: '#search',
        icon: <IconSearch />,
        description: 'Help buyers find the right product faster.',
      },
      {
        label: 'Order Management',
        href: '#orders',
        icon: <IconShoppingBag1 />,
        description: 'Quotes, approvals and fulfilment, end to end.',
      },
    ],
  },
  {
    value: 'capabilities',
    label: 'Capabilities',
    links: [
      { label: 'Account Management', href: '#accounts', icon: <IconGroup /> },
      { label: 'Pricing & Promotions', href: '#pricing', icon: <IconChartLine /> },
      { label: 'Integrations', href: '#integrations', icon: <IconSettings5 /> },
    ],
  },
  {
    value: 'customer-stories',
    label: 'Customer Stories',
    links: [
      { label: 'Manufacturing', href: '#manufacturing', icon: <IconBuilding2 /> },
      { label: 'Distribution', href: '#distribution', icon: <IconBox3 /> },
      { label: 'All Customer Stories', href: '#stories' },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { label: 'Documentation', href: '#docs', icon: <IconBook2 /> },
      { label: 'Webinars', href: '#webinars', icon: <IconPresentation1 /> },
      { label: 'Analyst Reports', href: '#reports', icon: <IconDocument2 /> },
    ],
  },
]

const gutter = 'clamp(20px, calc(20px + (100vw - 390px) * 0.05714), 80px)'

/** A hero-height block above the bar, so there is something to scroll past before it sticks. */
function Intro() {
  return (
    <Stack gap="16" pt={160} pb="80" px={gutter}>
      <Title order={1} fz="var(--sds-size-heading-f2)">
        Liferay Commerce
      </Title>
      <Text c="var(--sds-surfaces-text-secondary)" maw={640}>
        A product page: the site header at the top and the product&apos;s own bar under the hero. Scroll
        and it sticks under the header; open a section for its links.
      </Text>
    </Stack>
  )
}

function PageBelow() {
  return (
    <Stack gap="16" px={gutter} py="80">
      <Title order={2} fz="var(--sds-size-heading-f3)">
        Page content
      </Title>
      <Text c="var(--sds-surfaces-text-secondary)" maw={640}>
        Placeholder content, long enough to scroll the bar into its stuck state.
      </Text>
      <Box h={1600} />
    </Stack>
  )
}

const meta = {
  title: 'Components/SecondaryNav',
  component: SecondaryNav,
  args: {
    icon: <IconShoppingCart2 />,
    title: 'Commerce',
    items: COMMERCE_ITEMS,
    sticky: false,
  },
  argTypes: {
    items: { control: false },
    icon: { control: false },
    action: { control: false },
    title: { control: 'text' },
    offset: { control: { type: 'number', min: 0, step: 4 } },
  },
  parameters: {
    layout: 'fullscreen',
    frame: { padding: 0 },
    docs: {
      description: {
        component: [
          'A product’s own bar under the `Header`, from the file’s `Secondary Nav` (node `24826:50238`): the product’s icon and name, then a dropdown per section.',
          '',
          'The file draws the closed bar and the **Opened Background** it takes while a dropdown is open, but not the dropdown itself — the panel is the header panel’s glass holding `MegaMenu.Item` rows. **Click to open**, Escape or a click outside to close, one at a time, exactly as the header does.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SecondaryNav>

export default meta
type Story = StoryObj<typeof meta>

/** As the file draws it: closed, on the dark bar. Click a section to open its dropdown. */
export const Default: Story = {
  render: (args) => (
    <Box mih={420}>
      <SecondaryNav {...args} />
    </Box>
  ),
}

/** **Features** open on load — the bar takes the `Opened Background`, and the panel hangs from its trigger. */
export const FeaturesOpen: Story = {
  args: { defaultOpen: 'features' },
  render: Default.render,
}

/** **Resources** open: a shorter list, with no descriptions. */
export const ResourcesOpen: Story = {
  args: { defaultOpen: 'resources' },
  render: Default.render,
}

/**
 * The whole arrangement: the fixed `Header`, a hero, and the bar below it. Scroll and it sticks under
 * the condensed header; open a section and its dropdown hangs over the page.
 */
export const OnAPage: Story = {
  args: { sticky: true },
  render: (args) => (
    <>
      <Header items={SITE_NAV_ITEMS} actions={SITE_ACTIONS} drawerControls={SITE_DRAWER_CONTROLS} />
      <Intro />
      <SecondaryNav {...args} />
      <PageBelow />
    </>
  ),
}

/**
 * A phone. The name steps aside, the sections scroll sideways, and a dropdown spans the gutters rather
 * than hanging from a trigger that may be half off-screen.
 */
export const Mobile: Story = {
  ...OnAPage,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
