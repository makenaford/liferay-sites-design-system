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
import { IconGlassCommerce } from '../../icons/glass.generated'
import {
  IconBook2,
  IconChartLine,
  IconDocument2,
  IconGroup,
  IconPresentation1,
  IconSettings5,
  IconShop,
  IconShoppingBag1,
  IconShoppingCart1,
} from '../../icons'
import vodafoneIdea from '../../../assets/secondary-nav/vodafone-idea.jpg'
import sapphireGroup from '../../../assets/secondary-nav/sapphire-group.jpg'
import tag from '../../../assets/secondary-nav/tag.jpg'
import bre from '../../../assets/secondary-nav/bre.jpg'

/** Not drawn in the file: `Capabilities` and `Resources` stand in, in the `Features` layout. */
const PLACEHOLDER = 'Placeholder — not drawn in the file.'

/**
 * The file's four sections. `Features` and `Customer Stories` are the two dropdowns `LRDC- Secondary
 * Nav` draws, copy and all; `Capabilities` and `Resources` are not drawn, so they are placeholders.
 */
const COMMERCE_ITEMS: SecondaryNavItem[] = [
  {
    value: 'features',
    label: 'Features',
    links: [
      {
        label: 'Commerce Overview',
        href: '#commerce-overview',
        icon: <IconShoppingCart1 />,
        description: 'End-to-end commerce, built into your DXP.',
      },
      {
        label: 'B2B Commerce Platform',
        href: '#b2b-commerce',
        icon: <IconShoppingBag1 />,
        description: 'Simplify complex B2B buying journeys.',
      },
      {
        label: 'Digital Storefronts',
        href: '#storefronts',
        icon: <IconShop />,
        description: 'Launch storefronts that convert.',
      },
    ],
  },
  {
    value: 'capabilities',
    label: 'Capabilities',
    links: [
      { label: 'Account Management', href: '#accounts', icon: <IconGroup />, description: PLACEHOLDER },
      { label: 'Pricing & Promotions', href: '#pricing', icon: <IconChartLine />, description: PLACEHOLDER },
      { label: 'Integrations', href: '#integrations', icon: <IconSettings5 />, description: PLACEHOLDER },
    ],
  },
  {
    value: 'customer-stories',
    label: 'Customer Stories',
    links: [
      {
        label: 'Vodafone Idea Unifies Partner and Customer Experiences with Liferay PaaS',
        href: '#vodafone-idea',
        thumbnail: vodafoneIdea,
      },
      {
        label: 'Sapphire Group builds fast, easy, and intuitive ordering system',
        href: '#sapphire-group',
        thumbnail: sapphireGroup,
      },
      { label: 'Tag Makes B2B Ordering Easier with Self-Service', href: '#tag', thumbnail: tag },
      { label: 'BRE Reduces Digital Footprint by 88%', href: '#bre', thumbnail: bre },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { label: 'Documentation', href: '#docs', icon: <IconBook2 />, description: PLACEHOLDER },
      { label: 'Webinars', href: '#webinars', icon: <IconPresentation1 />, description: PLACEHOLDER },
      { label: 'Analyst Reports', href: '#reports', icon: <IconDocument2 />, description: PLACEHOLDER },
    ],
  },
]

/** The primary nav (65, with its rule) and this bar (64), stacked — what the hero reaches up behind. */
const CHROME = 65 + 64

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
 * The file's `Solution` frame (node `1:6988`): the site header, the product's bar straight under it,
 * then the hero — with the bubble running up behind both bars, as the file draws it.
 *
 * The bar sits at the fixed header's foot and sticks there; the hero pulls up by both bars' height and
 * pads back down by the same, so its artwork starts at the very top of the page while its content starts
 * under the chrome. Scroll past the bar's resting place and it replaces the header — `On Scroll`.
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
        title={<h1>Streamline ordering processes to accelerate order fulfillment</h1>}
        description="Fulfill orders faster with increased accuracy using native product, ordering, and inventory management capabilities."
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
            title="Customer Story Title"
            description="Scroll: once the product bar's resting place has passed, it takes the header's place at the top of the page."
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
      <Section title={<SectionTitle title="Card Title" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}>
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
    icon: <IconGlassCommerce size={32} />,
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
          'A product’s own bar under the `Header`, from `LRDC- Secondary Nav` (node `1:11476`): the product’s glass icon and name, then the header’s own nav items, each opening a dropdown.',
          '',
          'Two dropdowns are drawn — icon rows with a description (**Features**) and thumbnail rows (**Customer Stories**) — hung flush from the bar under their trigger. **Click to open**, Escape or a click outside to close, one at a time, as the header does. **On scroll it replaces the header**: the site header slides away and this bar takes the top of the page.',
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

/** **Customer Stories** open — the file's second `Opened` frame: thumbnail rows, 381 wide. */
export const CustomerStoriesOpen: Story = {
  args: { defaultOpen: 'customer-stories' },
  render: Default.render,
}

/**
 * **On a page** — the file's `Solution` frame. The site header at the top, the product's bar directly
 * under it, and the hero below both, its bubble reaching up behind the two bars.
 *
 * **Scroll** — the file's `On Scroll` frame. Once the bar's resting place has passed, the site header
 * slides up out of view and the bar moves to the top of the page, gaining a soft shadow. Scroll back
 * above that line and the header returns. Open a section and its dropdown hangs from the bar over the
 * page; open one of the header's menus instead and the mega menu drops over the bar — opening one closes
 * the other.
 */
export const OnAPage: Story = {
  args: { sticky: true },
  render: (args) => <CommercePage nav={<SecondaryNav {...args} mt="var(--sds-header-offset, 65px)" />} />,
}

/** On a page, with **Features** open over the hero — the file's first `Opened` frame. */
export const OnAPageFeaturesOpen: Story = {
  ...OnAPage,
  args: { sticky: true, defaultOpen: 'features' },
}

/** On a page, with **Customer Stories** open — the file's second `Opened` frame. */
export const OnAPageCustomerStoriesOpen: Story = {
  ...OnAPage,
  args: { sticky: true, defaultOpen: 'customer-stories' },
}

/**
 * A phone. The header becomes its burger and call to action, the product name steps aside, the
 * sections scroll sideways, and a dropdown spans the gutters.
 */
export const OnAPageMobile: Story = {
  ...OnAPage,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
