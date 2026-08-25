import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, Stack, Text, Title } from '@mantine/core'
import { Header } from './Header'
import { MegaMenu } from './MegaMenu'
import { Button } from '../Button'
import { Link } from '../Link'
import {
  IconArrowRight,
  IconCheck,
  IconDown,
  IconGlassComposable,
  IconGlassDatabase,
  IconGlassDocumentation,
  IconGlassIntranets,
  IconGlassMail,
  IconGlassPremiumSecurity,
  IconGlassSearch,
  IconGlassSites,
  IconGlassSupport,
  IconInformation,
  IconSearch,
} from '../../icons'

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
function Thumb({ label, color }: { label: string; color: string }) {
  return (
    <Box bg={color} w="100%" h="100%" style={{ display: 'grid', placeItems: 'center' }}>
      {label}
    </Box>
  )
}

const iconSize = 20

/** Platform: four columns of links, closed by a CTA strip. */
const platformMenu = (
  <MegaMenu>
    <MegaMenu.Body>
      <MegaMenu.Columns>
        <MegaMenu.Column heading="Digital Experience">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassComposable size={iconSize} />}
            title="Platform Overview"
            description="Explore the complete digital experience platform."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassMail size={iconSize} />}
            title="Content Marketing Platform"
            description="Plan and deliver marketing campaigns."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDatabase size={iconSize} />}
            title="Digital Asset Management"
            description="Organize and publish assets in one place."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSites size={iconSize} />}
            title="Sites"
            description="Build and manage on-brand websites fast."
          />
        </MegaMenu.Column>
        <MegaMenu.Column heading="Content Management">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDocumentation size={iconSize} />}
            title="CMS Overview"
            description="Create and publish content with ease."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassIntranets size={iconSize} />}
            title="Intranet"
            description="Keep employees informed and connected."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSearch size={iconSize} />}
            title="AI Search & SEO"
            description="Optimize content for AI and search."
          />
        </MegaMenu.Column>
        <MegaMenu.Column heading="Digital Commerce">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassComposable size={iconSize} />}
            title="Commerce Overview"
            description="End-to-end commerce, built into your DXP."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDatabase size={iconSize} />}
            title="Product Information Management"
            description="Centralize product data for every channel."
          />
        </MegaMenu.Column>
        <MegaMenu.Column heading="Developer">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassPremiumSecurity size={iconSize} />}
            title="Security"
            description="Enterprise-grade security, built in."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSupport size={iconSize} />}
            title="Integration"
            description="Connect Liferay to your existing systems."
          />
        </MegaMenu.Column>
      </MegaMenu.Columns>
    </MegaMenu.Body>
    <MegaMenu.Cta label="Ready to Evaluate?">
      <Button variant="outline" size="sm" rightSection={<IconArrowRight />}>
        See Subscription &amp; Deployment Options
      </Button>
    </MegaMenu.Cta>
  </MegaMenu>
)

/** Solutions: the columns are headed by tiles that are themselves destinations, plus a featured rail. */
const solutionsMenu = (
  <MegaMenu>
    <MegaMenu.Body>
      <MegaMenu.Columns>
        <MegaMenu.Column
          tile={
            <MegaMenu.Tile href="#" icon={<IconSearch />}>
              Improve SEO &amp; AEO
            </MegaMenu.Tile>
          }
        >
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSearch size={iconSize} />}
            title="AI Search"
            description="Get found and cited by AI search engines."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDocumentation size={iconSize} />}
            title="Audit"
            description="Catch SEO and accessibility issues early."
          />
        </MegaMenu.Column>
        <MegaMenu.Column
          tile={
            <MegaMenu.Tile href="#" icon={<IconInformation />}>
              Build Portals &amp; Intranets
            </MegaMenu.Tile>
          }
        >
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSupport size={iconSize} />}
            title="Customer Portals"
            description="Help customers self-serve and succeed."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassIntranets size={iconSize} />}
            title="Intranets"
            description="Give employees a connected digital home."
          />
        </MegaMenu.Column>
        <MegaMenu.Column
          tile={
            <MegaMenu.Tile href="#" icon={<IconCheck />}>
              Build Modern Websites
            </MegaMenu.Tile>
          }
        >
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSites size={iconSize} />}
            title="Enterprise Websites"
            description="Launch and manage websites at scale."
          />
        </MegaMenu.Column>
      </MegaMenu.Columns>
      <MegaMenu.Featured heading="Featured">
        <MegaMenu.FeaturedCard
          href="#"
          stacked
          thumbnail={<Thumb label="ŠKODA" color="#0e2f56" />}
          title="Skoda Auto's Intranet Serves 40,000 Employees"
          description="Inside Škoda's personalized employee experience."
        />
        <MegaMenu.FeaturedCard
          href="#"
          stacked
          thumbnail={<Thumb label="CHECKLIST" color="#374151" />}
          title="11 Building Blocks for a High-Performing Supplier Portal"
          description="Automate workflows, boost efficiency."
        />
      </MegaMenu.Featured>
    </MegaMenu.Body>
  </MegaMenu>
)

/** Resources: two columns and a wide rail of customer stories. */
const resourcesMenu = (
  <MegaMenu>
    <MegaMenu.Body>
      <MegaMenu.Columns>
        <MegaMenu.Column heading="Knowledge Center">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDocumentation size={iconSize} />}
            title="Resource Hub"
            description="Explore guides, ebooks, and whitepapers."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassSupport size={iconSize} />}
            title="Webinars & Events"
            description="Save your seat, live or in person."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDocumentation size={iconSize} />}
            title="Documentation"
            description="Official guides for Liferay DXP."
            external
          />
        </MegaMenu.Column>
        <MegaMenu.Column heading="Technical Insights">
          <MegaMenu.Item
            href="#"
            icon={<IconGlassComposable size={iconSize} />}
            title="Headless CMS vs Traditional CMS"
            description="Find the right fit for your team."
          />
          <MegaMenu.Item
            href="#"
            icon={<IconGlassDatabase size={iconSize} />}
            title="DXP vs CMS: What's the Difference?"
            description="One manages content. The other does a lot more."
          />
        </MegaMenu.Column>
      </MegaMenu.Columns>
      <MegaMenu.Featured heading="Customer Stories" wide>
        <MegaMenu.FeaturedCard
          href="#"
          thumbnail={<Thumb label="UNILEVER" color="#0a2a63" />}
          title="Unilever Achieves 133% Faster Go to Market"
          description="How a platform overhaul sped up rollouts."
        />
        <MegaMenu.FeaturedCard
          href="#"
          thumbnail={<Thumb label="PETROBRAS" color="#0d3b2e" />}
          title="Petrobras's New Digital Transformation"
          description="Unified sites for 4M+ users."
        />
        <MegaMenu.More href="#">See All Customer Stories</MegaMenu.More>
      </MegaMenu.Featured>
    </MegaMenu.Body>
  </MegaMenu>
)

const items = [
  { value: 'platform', label: 'Platform', menu: platformMenu },
  { value: 'solutions', label: 'Solutions', menu: solutionsMenu },
  { value: 'resources', label: 'Resources', menu: resourcesMenu },
]

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
  args: { items, actions, logo: <Logo /> },
  argTypes: {
    items: { control: false },
    actions: { control: false },
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
