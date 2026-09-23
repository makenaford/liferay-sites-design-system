import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text, Title } from '@mantine/core'
import { SecondaryNav, type SecondaryNavItem } from './SecondaryNav'
import { Header } from '../Header'
import { Button } from '../Button'
import { SITE_ACTIONS, SITE_DRAWER_CONTROLS, SITE_NAV_ITEMS } from '../../templates/site-nav-render'

const PRODUCT_ITEMS: SecondaryNavItem[] = [
  { value: 'overview', label: 'Overview', href: '#overview' },
  { value: 'features', label: 'Features', href: '#features' },
  { value: 'use-cases', label: 'Use Cases', href: '#use-cases' },
  { value: 'integrations', label: 'Integrations', href: '#integrations' },
  { value: 'customers', label: 'Customers', href: '#customers' },
  { value: 'resources', label: 'Resources', href: '#resources' },
]

const PAGE_ITEMS: SecondaryNavItem[] = [
  { value: 'overview', label: 'Overview', href: '/dxp' },
  { value: 'pricing', label: 'Pricing', href: '/dxp/pricing' },
  { value: 'docs', label: 'Documentation', href: '/dxp/docs' },
  { value: 'support', label: 'Support', href: '/dxp/support' },
]

/** A tall stand-in section for each fragment, so the spy has somewhere to go. */
function ProductPage({ items }: { items: SecondaryNavItem[] }) {
  return (
    <>
      {items.map((item, index) => (
        <Box
          key={item.value}
          component="section"
          id={item.href?.slice(1)}
          px="clamp(20px, calc(20px + (100vw - 390px) * 0.05714), 80px)"
          py="80"
          maw="calc(1280px + 2 * clamp(20px, calc(20px + (100vw - 390px) * 0.05714), 80px))"
          mx="auto"
          mih={index === items.length - 1 ? 320 : 560}
        >
          <Stack gap="16">
            <Title order={2} fz="var(--sds-size-heading-f3)">
              {item.label}
            </Title>
            <Text c="var(--sds-surfaces-text-secondary)" maw={640}>
              Placeholder content for the {String(item.label).toLowerCase()} section. Scroll and the
              bar above follows along; click an item and the page scrolls here with the heading clear of
              the bar.
            </Text>
          </Stack>
        </Box>
      ))}
    </>
  )
}

/** A hero-height block above the bar, so there is something to scroll past before it sticks. */
function Intro() {
  return (
    <Stack gap="16" pt={160} pb="80" px="clamp(20px, calc(20px + (100vw - 390px) * 0.05714), 80px)">
      <Title order={1} fz="var(--sds-size-heading-f2)">
        Liferay DXP
      </Title>
      <Text c="var(--sds-surfaces-text-secondary)" maw={640}>
        A product page: the header at the top, and the secondary nav below the hero. Scroll down and it
        sticks under the header, takes the glass, and highlights the section you are in.
      </Text>
    </Stack>
  )
}

const meta = {
  title: 'Components/SecondaryNav',
  component: SecondaryNav,
  args: {
    title: 'Liferay DXP',
    items: PRODUCT_ITEMS,
    action: <Button size="sm">Request a Demo</Button>,
  },
  argTypes: {
    items: { control: false },
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
          'The in-page bar for a product or a long page, under the `Header`. **Work in progress** — there is no Figma component set for it yet, so it borrows the header’s gutter and glass and the tabs’ label and gradient.',
          '',
          '**Links, not tabs**: each item is an `<a>` and the current one carries `aria-current`. An item whose `href` is a `#fragment` is tracked by the **scroll spy**; clicking one scrolls there with the heading clear of the bar. On a phone the links scroll sideways and the title steps aside.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SecondaryNav>

export default meta
type Story = StoryObj<typeof meta>

/** The bar on its own, with every prop on a control. Nothing is current until a link is clicked. */
export const Playground: Story = {
  args: { sticky: false, spy: false },
}

/** A current item set on mount — the gradient line and the Bold label. */
export const WithCurrentItem: Story = {
  args: { sticky: false, spy: false, defaultValue: 'features' },
}

/** No title and no action: just the links, starting on the gutter. */
export const LinksOnly: Story = {
  args: { sticky: false, spy: false, title: undefined, action: undefined, defaultValue: 'overview' },
}

/**
 * Links to other pages rather than sections of this one. The spy has nothing to track, and the current
 * item is `aria-current="page"`.
 */
export const PageLinks: Story = {
  args: { sticky: false, items: PAGE_ITEMS, defaultValue: 'pricing' },
}

/**
 * The whole arrangement: the fixed `Header`, a hero, and the bar below it. Scroll and it sticks under
 * the condensed header; each section becomes current as it reaches the bar.
 */
export const OnAPage: Story = {
  render: (args) => (
    <>
      <Header items={SITE_NAV_ITEMS} actions={SITE_ACTIONS} drawerControls={SITE_DRAWER_CONTROLS} />
      <Intro />
      <SecondaryNav {...args} />
      <ProductPage items={args.items ?? []} />
    </>
  ),
}

/**
 * A phone. The title gives way, the links scroll sideways, and the current one is kept in view as the
 * spy moves along.
 */
export const Mobile: Story = {
  ...OnAPage,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
