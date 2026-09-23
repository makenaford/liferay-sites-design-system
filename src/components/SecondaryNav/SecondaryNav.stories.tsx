import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, SimpleGrid, Text } from '@mantine/core'
import { SecondaryNav, type SecondaryNavItem } from './SecondaryNav'
import { Button } from '../Button'
import { Card } from '../Card'
import { Hero } from '../Hero'
import { Section, SectionTitle } from '../Section'
import { SiteFooter, SiteHeader } from '../../templates/shared'
import bubbleCorner from '../../../assets/bubbles/bubble_corner.webm'
import bubbleCornerLight from '../../../assets/bubbles/bubble_corner_light.webm'
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

/** The header's bar and this one, stacked — what the hero reaches up behind. */
const CHROME = 64 + 52

/** Stands in for the hero shot, a 3:2 frame as the file's `Aspect Ratio` draws it: stories render offline. */
function Shot() {
  return (
    <Box
      style={{ aspectRatio: '3 / 2', borderRadius: 10, display: 'grid', placeItems: 'center' }}
      bg="linear-gradient(135deg, var(--sds-brand-primary-lighten-4), var(--sds-accent-product-accent))"
      c="var(--sds-action-neutral-inverted)"
      fw={700}
    >
      Product shot
    </Box>
  )
}

/**
 * The file's Commerce page (node `24826:49318`): the site header, the product's bar straight under it,
 * then the hero — with the bubble running up behind both bars, as the file draws it.
 *
 * The bar sits 64px down, which is the fixed header's height, and sticks there; the hero pulls up by
 * both bars' height and pads back down by the same, so its artwork starts at the very top of the page
 * while its content starts under the chrome.
 */
function CommercePage({ nav }: { nav: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {nav}
      <Hero
        background="corner"
        video={bubbleCorner}
        videoLight={bubbleCornerLight}
        mt={-CHROME}
        pt={CHROME}
        title={<h1>Hero Title</h1>}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non lacinia mi. Etiam nec mauris fringilla, tincidunt tellus sed, feugiat nulla. Curabitur justo urna, rutrum sit amet lectus malesuada, porttitor laoreet elit."
        actions={
          <>
            <Button>Book a Demo</Button>
            <Button variant="outline">Contact Sales</Button>
          </>
        }
        media={<Shot />}
      />
      <Section
        title={
          <SectionTitle
            title="Placeholder section"
            description="Scroll: the product bar stays under the site header all the way down the page."
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="24">
          {['Catalog', 'Storefronts', 'Orders'].map((name) => (
            <Card key={name} surface="glass">
              <Text fw={700} fz="20">
                {name}
              </Text>
              <Text c="var(--sds-surfaces-text-secondary)">Placeholder card content.</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Section>
      <Section title={<SectionTitle title="Another section" />}>
        <Box h={600} />
      </Section>
      <SiteFooter />
    </>
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
 * **On a page** — the file's Commerce page. The site header at the top, the product's bar directly
 * under it, and the hero below both, its bubble reaching up behind the two bars.
 *
 * Scroll and the bar stays under the header all the way down. Open a section and the bar takes the
 * `Opened Background` while its dropdown hangs over the page; open one of the header's menus instead
 * and the mega menu drops over the bar — clicking one closes the other.
 */
export const OnAPage: Story = {
  args: { sticky: true },
  render: (args) => <CommercePage nav={<SecondaryNav {...args} mt="var(--sds-header-offset, 64px)" />} />,
}

/** On a page, with **Features** open over the hero. */
export const OnAPageFeaturesOpen: Story = {
  ...OnAPage,
  args: { sticky: true, defaultOpen: 'features' },
}

/**
 * A phone. The header becomes its burger and call to action, the product name steps aside, the
 * sections scroll sideways, and a dropdown spans the gutters.
 */
export const OnAPageMobile: Story = {
  ...OnAPage,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
