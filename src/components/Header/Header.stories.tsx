import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, Stack, Text, Title } from '@mantine/core'
import { Header } from './Header'
import { Button } from '../Button'
import { Link } from '../Link'
import {
  IconDown,
} from '../../icons'
import { SITE_DRAWER_CONTROLS, SITE_NAV_ITEMS } from '../../templates/site-nav-render'

/** The prototype's logo: a 28px mark and the wordmark beside it. */
function Logo() {
  return (
    <>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect width="28" height="28" rx="6" fill="var(--sds-brand-primary-primary)" />
        <rect x="5" y="5" width="7" height="7" rx="1.5" fill="#fff" />
        <rect x="16" y="5" width="7" height="7" rx="1.5" fill="#fff" opacity=".55" />
        <rect x="5" y="16" width="7" height="7" rx="1.5" fill="#fff" opacity=".55" />
        <rect x="16" y="16" width="7" height="7" rx="1.5" fill="#fff" />
      </svg>
      <span>Liferay</span>
    </>
  )
}

/**
 * Stands in for the customer-story imagery. The prototype uses colour blocks for the same reason: the
 * stories have to render offline.
 */
const actions = (
  <>
    <Link href="#" size="md" rightSection={<IconDown />}>
      EN (US)
    </Link>
    <Link href="#" size="md">
      Log In
    </Link>
    <Button size="sm">Contact Sales</Button>
  </>
)

/**
 * The drawer's own controls. The same three things the bar holds, as data — so the drawer can draw the
 * language and log-in as accordions rather than as a combobox and a link.
 */
/** Page content, so the glass has something to blur and the fixed band has something to overlay. */
function PageBelow() {
  return (
    <Stack gap="16" pt={120} px="40" pb="80">
      <Title order={2} fz="var(--sds-size-heading-f3)">
        Page content
      </Title>
      <Text c="var(--sds-surfaces-text-secondary)" maw={640}>
        The header overlays the page, so the content starts underneath it. Scroll and the glass has real
        content to blur; open a menu and the panel drops out of the band over the top.
      </Text>
      <Group gap="16">
        <Button>Get started</Button>
        <Button variant="outline">Talk to sales</Button>
      </Group>
      <Box h={600} />
    </Stack>
  )
}

const meta = {
  title: 'Components/Header',
  component: Header,
  args: { items: SITE_NAV_ITEMS, actions, drawerControls: SITE_DRAWER_CONTROLS, logo: <Logo /> },
  argTypes: {
    items: { control: false },
    actions: { control: false },
    drawerControls: { control: false },
    logo: { control: false },
    position: { options: ['fixed', 'static'], control: 'inline-radio' },
  },
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The primary navigation: a fixed glass band with a mega menu per section, built from the desktop prototype rather than a Figma component set.',
          '',
          '**Click to open, not hover** — a hover menu is unusable on touch and punishing for anyone with a tremor. **It is a disclosure, not a menubar**: each section is a `<button aria-expanded aria-controls>` over a region of ordinary links, so Tab works the way people expect, Escape closes and returns focus, and a click outside closes.',
          '',
          'Below 1200px the bar becomes a burger and a drawer, with each section an accordion over the same menu content — the prototype is desktop-only, and a fixed header that breaks at tablet width is not shippable.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Click Platform, Solutions or Resources. */
export const Playground: Story = {
  render: (args) => (
    <>
      <Header {...args} />
      <PageBelow />
    </>
  ),
}

/**
 * The default: nothing open. Click a section for its panel — the caret turns over, the underline wipes
 * out from the centre, and the columns arrive a beat behind the panel, each slightly after the last.
 */
export const Default: Story = {
  render: Playground.render,
}

/**
 * **Platform** — four columns of links closed by a CTA strip, open on load the way the prototype
 * opens it so the layout is visible immediately.
 */
export const PlatformOpen: Story = {
  args: { defaultOpen: 'platform' },
  render: Playground.render,
}

/**
 * **Solutions** — the columns are headed by tiles that are destinations in their own right, with a
 * featured rail of stacked cards beside them.
 */
export const SolutionsOpen: Story = {
  args: { defaultOpen: 'solutions' },
  render: Playground.render,
}

/** **Resources** — two columns and the wide rail, with landscape cards and a "see all" link. */
export const ResourcesOpen: Story = {
  args: { defaultOpen: 'resources' },
  render: Playground.render,
}

/**
 * `position="static"` for a header that sits in the flow rather than overlaying the page — the glass
 * still reads, but there is nothing scrolling under it to blur.
 */
export const Static: Story = {
  args: { position: 'static', defaultOpen: 'platform' },
  render: (args) => (
    <>
      <Header {...args} />
      <Stack gap="16" p="40">
        <Title order={2} fz="var(--sds-size-heading-f3)">
          In the flow
        </Title>
        <Text c="var(--sds-surfaces-text-secondary)">The page starts below the header, not under it.</Text>
      </Stack>
    </>
  ),
}

/**
 * Condense on scroll — on by default, and the reason `Header` now has scroll behaviour at all.
 *
 * **Scroll the preview.** At the top the band is nothing: no fill, no blur, no hairline, no shadow, so
 * it sits on the hero and reads as part of it — which is what the file draws, with the nav inside the
 * `Left Hero` frame over the bubble. Past 24px the glass arrives and the bar tightens from 64 to 56.
 *
 * It fixes a real problem rather than adding polish: the band used to carry the blur, the hairline
 * *and* a 30px drop shadow at all times, so an unscrolled header cast a shadow separating it from
 * content that had not arrived yet.
 *
 * Set `condense={false}` to keep the band glassy throughout. Under `prefers-reduced-motion` the state
 * still changes — it just arrives immediately, because the separation is the point, not the fade.
 */
export const CondenseOnScroll: Story = {
  args: { position: 'fixed' },
  parameters: { layout: 'fullscreen', frame: { fullBleed: true } },
  render: (args) => (
    <>
      <Header {...args} />
      {/* A stand-in hero: the band should be invisible against it until the page moves. */}
      <Box
        h={420}
        style={{
          background:
            'radial-gradient(60% 80% at 20% 0%, var(--sds-brand-primary-primary) 0%, transparent 60%), radial-gradient(50% 70% at 90% 10%, var(--sds-accent-product-accent) 0%, transparent 55%), var(--sds-surfaces-page-bg-base-default)',
        }}
      >
        <Stack gap="16" pt={140} px="40">
          <Title order={1} fz="var(--sds-size-display-display-sm)">
            Scroll me
          </Title>
          <Text c="var(--sds-surfaces-text-secondary)">
            The band is transparent up here, then takes its glass on the way down.
          </Text>
        </Stack>
      </Box>
      <Stack gap="16" p="40" pb={400}>
        {Array.from({ length: 12 }, (_, i) => (
          <Text key={i} c="var(--sds-surfaces-text-secondary)">
            Content scrolling under the band, which now has something to separate itself from.
          </Text>
        ))}
      </Stack>
    </>
  ),
}

/**
 * What the bar becomes below 1200px: a burger, and a full-width panel where each section expands its own
 * menu in place. It runs on the same open state as the desktop menus, and the menu content needs no
 * mobile variant — the column grid and the featured rail collapse on their own. Switch the Storybook
 * viewport to a phone, then tap the burger.
 */
export const StackedPanel: Story = {
  render: Playground.render,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

/** An external link in a menu gets the icon and, for a screen reader, the words. */
export const ExternalLinks: Story = {
  args: { defaultOpen: 'resources' },
  render: Playground.render,
}
