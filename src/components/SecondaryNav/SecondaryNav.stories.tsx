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
import { IconGlassCommerce, IconGlassContentManagement } from '../../icons/glass.generated'
import {
  IconChartLine,
  IconGroup,
  IconSettings5,
  IconShop,
  IconShoppingBag1,
  IconShoppingCart1,
} from '../../icons'

/** Not drawn in the file: `Capabilities` stands in, in the `Features` layout. */
const PLACEHOLDER = 'Placeholder — not drawn in the file.'

/**
 * The file's four sections. `Features` is the dropdown `LRDC- Secondary Nav` draws, copy and all.
 * `Customer Stories` and `Resources` are titles alone — the story titles are the file's, the resource
 * titles placeholders — and `Capabilities` is not drawn, so it is a placeholder too.
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
      },
      {
        label: 'Sapphire Group builds fast, easy, and intuitive ordering system',
        href: '#sapphire-group',
      },
      { label: 'Tag Makes B2B Ordering Easier with Self-Service', href: '#tag' },
      { label: 'BRE Reduces Digital Footprint by 88%', href: '#bre' },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { label: 'What Is B2B Commerce?', href: '#what-is-b2b-commerce' },
      { label: 'B2B vs B2C Commerce: What You Need to Know', href: '#b2b-vs-b2c' },
      { label: 'A Guide to Headless Commerce', href: '#headless-commerce' },
    ],
  },
]

/**
 * `Opened- 2 Columns` (node `28:1450`): CMS, with five sections that are plain links and two dropdowns.
 * `Resources` is the two-column panel the file draws, titles and all; `Customer Stories` is not drawn,
 * so its titles are placeholders.
 */
const CMS_ITEMS: SecondaryNavItem[] = [
  { value: 'enterprise', label: 'Enterprise', href: '#enterprise' },
  { value: 'headless', label: 'Headless', href: '#headless' },
  { value: 'seo', label: 'SEO', href: '#seo' },
  { value: 'intranet', label: 'Intranet', href: '#intranet' },
  { value: 'open-source', label: 'Open Source', href: '#open-source' },
  {
    value: 'resources',
    label: 'Resources',
    columns: 2,
    links: [
      { label: 'What is a CMS?', href: '#what-is-a-cms' },
      { label: 'DXP vs CMS: What You Need to Know', href: '#dxp-vs-cms' },
      { label: 'CMS 101: Architecture, Components, and Core Concepts', href: '#cms-101' },
      {
        label: 'From CMS to HTML: A Guide to Computing Acronyms and Definitions',
        href: '#cms-to-html',
      },
      {
        label: "A Beginner's Guide to Learning the Differences Between CMS and HTML",
        href: '#cms-vs-html',
      },
      { label: 'An Overview of CMS Types and Benefits', href: '#cms-types' },
      { label: 'A Guide to Headless CMS', href: '#headless-cms' },
      { label: "What's the Difference Between a CMS, Portal, and DXP?", href: '#cms-portal-dxp' },
    ],
  },
  {
    value: 'customer-stories',
    label: 'Customer Stories',
    links: [
      { label: 'Customer story title — placeholder', href: '#story-1' },
      { label: 'Customer story title — placeholder', href: '#story-2' },
      { label: 'Customer story title — placeholder', href: '#story-3' },
    ],
  },
]

/** The CMS bar's own props — the product swapped in over the Commerce defaults. */
const CMS = {
  icon: <IconGlassContentManagement size={32} />,
  title: 'CMS',
  items: CMS_ITEMS,
}

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
          'Dropdowns hang flush from the bar under their trigger: icon rows with a description (**Features**), or titles alone in one column or two (**Customer Stories**, **Resources**, and CMS’s two-column **Resources**). **Click to open**, Escape or a click outside to close, one at a time, as the header does. **On scroll it replaces the header**: the site header slides away and this bar takes the top of the page.',
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

/** **Customer Stories** open — the story titles alone, one column. */
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

/** The file's `Mobile` frames are 414 wide — Storybook's `mobile2`. */
const PHONE = { viewport: { value: 'mobile2', isRotated: false } }

/**
 * **Mobile** — the file's `Mobile- Default`. The site header becomes its logo, call to action and
 * burger; under it the product's bar keeps the product's name and trades its sections for a chevron.
 * Tap it for the menu. Scroll, and the bar replaces the header here too.
 */
export const Mobile: Story = {
  ...OnAPage,
  globals: PHONE,
}

/**
 * **Mobile, menu open** — `Mobile- Opened`. The chevron turns over, a sheet drops from the bar with a
 * row per section, and the page behind goes to black at 80%. Tap the scrim or press Escape to close.
 */
export const MobileMenuOpen: Story = {
  ...OnAPage,
  args: { sticky: true, defaultMenuOpen: true },
  globals: PHONE,
}

/**
 * **Mobile, a section expanded** — `Mobile- Opened 2`. **Features** expands its links in place, the
 * same rows the desktop dropdown holds; tap another section to expand it instead.
 */
export const MobileFeaturesExpanded: Story = {
  ...OnAPage,
  args: { sticky: true, defaultOpen: 'features' },
  globals: PHONE,
}

/** **Mobile, Customer Stories expanded** — the story titles, 20px in and 24px apart. */
export const MobileCustomerStoriesExpanded: Story = {
  ...OnAPage,
  args: { sticky: true, defaultOpen: 'customer-stories' },
  globals: PHONE,
}

/**
 * **Two columns** — `Opened- 2 Columns`. CMS, whose first five sections are plain links (no caret),
 * with **Resources** open: eight titles in two 271px columns, 24px apart.
 */
export const TwoColumns: Story = {
  args: { ...CMS, defaultOpen: 'resources' },
  render: Default.render,
}

/** Two columns on a page — the file's frame, with the site header above and the hero below. */
export const OnAPageTwoColumns: Story = {
  ...OnAPage,
  args: { ...CMS, sticky: true, defaultOpen: 'resources' },
}

/**
 * **Mobile, CMS** — `Mobile- CMS Group Features`. The plain-link sections are rows with no chevron;
 * **Resources** expands its eight titles in one list.
 */
export const MobileCms: Story = {
  ...OnAPage,
  args: { ...CMS, sticky: true, defaultMenuOpen: true },
  globals: PHONE,
}

