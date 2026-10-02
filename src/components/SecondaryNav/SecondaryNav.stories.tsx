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

/** `On Scroll`'s calls to action: small buttons, outline then solid, as the file ends the bar. */
const SCROLL_ACTIONS = (
  <>
    <Button size="sm" variant="outline">
      Request a Demo
    </Button>
    <Button size="sm">Contact Sales</Button>
  </>
)

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
    scrollActions: SCROLL_ACTIONS,
    sticky: true,
  },
  argTypes: {
    items: { control: false },
    icon: { control: false },
    action: { control: false },
    scrollActions: { control: false },
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
          'Dropdowns hang flush from the bar under their trigger: icon rows with a description (**Features**), or titles alone in one column or two (**Customer Stories**, **Resources**, and CMS’s two-column **Resources**). **Click to open**, Escape or a click outside to close, one at a time, as the header does. **On scroll it replaces the header**: the site header slides away and this bar takes the top of the page, with **Request a Demo** and **Contact Sales** fading in at its end.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SecondaryNav>

export default meta
type Story = StoryObj<typeof meta>

/**
 * **On a page** — the file's `Solution` frame. The site header at the top, the product's bar directly
 * under it, and the hero below both, its bubble reaching up behind the two bars. Click a section to open
 * its dropdown.
 *
 * **Scroll** — the file's `On Scroll` frame. Once the bar's resting place has passed, the site header
 * slides up out of view and the bar moves to the top of the page, gaining a soft shadow, and **Request a
 * Demo** and **Contact Sales** fade in at its end. Scroll back above that line and the header returns.
 */
export const OnAPage: Story = {
  render: (args) => <CommercePage nav={<SecondaryNav {...args} mt="var(--sds-header-offset, 65px)" />} />,
}

/**
 * **Mobile** — the file's `Mobile` frames, 414 wide. The bar keeps the product's name and trades its
 * sections for a chevron; tap it for a sheet with a row per section, each expanding its links in place.
 * The scroll buttons stay off on a phone.
 */
export const Mobile: Story = {
  ...OnAPage,
  globals: { viewport: { value: 'mobile2', isRotated: false } },
}

/**
 * **Two columns** — `Opened- 2 Columns`. CMS, whose first five sections are plain links (no caret),
 * with **Resources** open: eight titles in two 271px columns, 24px apart.
 */
export const TwoColumns: Story = {
  ...OnAPage,
  args: { ...CMS, defaultOpen: 'resources' },
}
