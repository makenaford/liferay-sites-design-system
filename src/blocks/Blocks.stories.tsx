import type { Meta, StoryObj } from '@storybook/react-vite'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { List } from '../components/List'
import { Marquee } from '../components/Marquee'
import { Tabs } from '../components/Tabs'
import { ContentMedia, Section, SectionTitle } from '../components/Section'
import { Stat, StatBar } from '../components/Stat'
import {
  IconArrowRight,
  IconArrowUp,
  IconGlassComposable,
  IconGlassDatabase,
  IconGlassMail,
} from '../icons'

/* -------------------------------------------------------------------------- offline placeholders */

const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#adc9ff"/><stop offset="0.55" stop-color="#7414ff"/><stop offset="1" stop-color="#0b5fff"/>
  </linearGradient></defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <circle cx="150" cy="120" r="62" fill="#fff" opacity="0.8"/>
</svg>`)}`

const Cover = () => <Image src={PHOTO} alt="" ratio="3:2" radius={0} />

function Logo({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 120 24" role="img" aria-label={name} style={{ aspectRatio: '5 / 1' }}>
      <rect x="0" y="4" width="16" height="16" rx="3" fill="currentColor" opacity="0.55" />
      <text x="22" y="18" fontSize="17" fontWeight="700" fill="currentColor">
        {name}
      </text>
    </svg>
  )
}

const CUSTOMERS = ['Airbus', 'Carrefour', 'Bosch', 'Petrobras', 'Rabobank', 'Excellus']

const RESOURCES = [
  ['Guide', 'The composable enterprise, in twelve decisions'],
  ['Report', 'What changed in enterprise DXP this year'],
  ['Webinar', 'Migrating eleven sites in a single quarter'],
] as const

const meta = {
  title: 'Blocks/Sections',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The fourteen `Type` cells of Figma’s `Section` set (node `17892:146518`), each built from `Section` plus one of the library’s components.',
          '',
          '**`Type` is not a prop.** All fourteen cells share one skeleton — a centred 1280 column, a `SectionTitle`, a body, sometimes a footer — and differ only in what goes in the body. `Card Grid` is a Section holding a grid of `Card`s; `FAQ` is a Section holding an `Accordion`; `Integrations Section` is a Section holding a `Marquee`. Adding a `type` prop would mean fourteen wrappers that forward slots and add nothing.',
          '',
          'Every block here is copy-pasteable: what you see in the source is the whole block. Resize the preview — the padding, the type and the columns are all fluid rather than stepped, so there is no width at which a block is between layouts.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/* ------------------------------------------------------------------------------- the blocks */

/** **`Type=Card Grid`** — a `SectionTitle` with an action, and three clickable `Card`s. */
export const CardGrid: Story = {
  render: () => (
    <Section
      title={
        <SectionTitle
          title="Built for every team"
          description="One platform, and the same components wherever it ships."
          actions={
            <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
              See all solutions
            </Button>
          }
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">
        {[
          [IconGlassComposable, 'Composable by default', 'Take the capabilities you need.'],
          [IconGlassDatabase, 'One source of content', 'Pages, assets and translations in one tree.'],
          [IconGlassMail, 'Every channel', 'Web, portal, commerce and search together.'],
        ].map(([Icon, title, description]) => {
          const Glyph = Icon as typeof IconGlassComposable
          return (
            <Card
              key={title as string}
              component="a"
              href="#"
              interactive
              hero={<Glyph width={40} height={40} />}
              title={title as string}
              description={description as string}
            />
          )
        })}
      </SimpleGrid>
    </Section>
  ),
}

/** **`Type=Card Grid- Non Clickable`** — the same grid without links, so no hover and no anchor. */
export const CardGridNonClickable: Story = {
  render: () => (
    <Section
      title={<SectionTitle title="What you get" description="Four things, none of them optional." />}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="24">
        {['Content', 'Commerce', 'Search', 'Portals'].map((title) => (
          <Card
            key={title}
            headerAlign="center"
            hero={<IconGlassComposable width={40} height={40} />}
            title={title}
          />
        ))}
      </SimpleGrid>
    </Section>
  ),
}

/** **`Type=Resources`** — Resource cards: `surface="no-bg"`, `padding="none"`, hover on the image. */
export const Resources: Story = {
  render: () => (
    <Section
      title={
        <SectionTitle
          title="Resources"
          description="Guides, reports and recordings."
          actions={
            <Link href="#" size="lg" rightSection={<IconArrowRight />}>
              Browse the library
            </Link>
          }
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">
        {RESOURCES.map(([kind, title]) => (
          <Card
            key={title}
            component="a"
            href="#"
            interactive
            surface="no-bg"
            padding="none"
            image={<Cover />}
            hero={
              <Label size="sm" variant="outline">
                {kind}
              </Label>
            }
            title={title}
          />
        ))}
      </SimpleGrid>
    </Section>
  ),
}

/** **`Type=Content Left Image`** — the two-up, media first. */
export const ContentLeftImage: Story = {
  render: () => (
    <Section>
      <ContentMedia
        mediaSide="left"
        media={<Cover />}
        eyebrow={
          <Label size="sm" variant="outline">
            Platform
          </Label>
        }
        title="One platform, every channel"
        description="Build once and deliver everywhere — websites, portals, commerce and search on one DXP, with the same components and the same deployment."
        actions={
          <>
            <Button rightSection={<IconArrowRight />}>Book a demo</Button>
            <Link href="#" size="lg">
              Read the docs
            </Link>
          </>
        }
      />
    </Section>
  ),
}

/** **`Type=Content- Right Image`** — the same block mirrored, with a `List` in the text column. */
export const ContentRightImage: Story = {
  render: () => (
    <Section>
      <ContentMedia
        mediaSide="right"
        media={<Cover />}
        title="What changes on day one"
        description="Three things stop being anybody's job."
        actions={
          <Link href="#" size="lg" rightSection={<IconArrowRight />}>
            See the migration playbook
          </Link>
        }
      >
        <List marker="check" size="sm" spacing={12}>
          <List.Item>One deployment pipeline instead of four.</List.Item>
          <List.Item>A component library every team already knows.</List.Item>
          <List.Item>Search that spans the whole estate.</List.Item>
        </List>
      </ContentMedia>
    </Section>
  ),
}

/** **`Type=FAQ`** — a centred title over an `Accordion`, in Figma's narrower 900px measure. */
export const Faq: Story = {
  render: () => (
    <Section
      maxWidth={900}
      title={
        <SectionTitle
          align="center"
          title="Frequently asked questions"
          description="The ones that come up on every call."
        />
      }
    >
      <Accordion size="lg" order={3}>
        {[
          ['Where is my data hosted?', 'In the region you pick when you provision the environment.'],
          ['How long does a migration take?', 'Four to six weeks for a single site.'],
          ['What is included in support?', '24/7 for anything that stops a production site.'],
        ].map(([q, a]) => (
          <Accordion.Item key={q} value={q}>
            <Accordion.Control>{q}</Accordion.Control>
            <Accordion.Panel>
              <p>{a}</p>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Section>
  ),
}

/**
 * **`Type=Integrations Section`** — `bleed` so the `Marquee` runs off both edges while the title keeps the
 * gutter, at Figma's 32px gap.
 */
export const Integrations: Story = {
  render: () => (
    <Section
      bleed
      gap={32}
      title={
        <SectionTitle
          title="Extend your platform"
          description="Integrations with the systems your teams already run."
          actions={
            <Link href="#" size="lg" rightSection={<IconArrowRight />}>
              Browse integrations
            </Link>
          }
        />
      }
    >
      <Marquee label="Integrations" monochrome size="md">
        {CUSTOMERS.map((name) => (
          <Logo key={name} name={name} />
        ))}
      </Marquee>
    </Section>
  ),
}

/** **`Type=Carousel`** — `bleed` again, so the card track runs to the edges under a gutter-aligned title. */
export const CarouselSection: Story = {
  render: () => (
    <Section
      bleed
      title={<SectionTitle title="Customer stories" description="Seven teams, one platform." />}
    >
      <Carousel label="Customer stories" gutter={80} indicators="dots">
        {[
          ['Airbus', '11 sites', 'We consolidated eleven regional sites in a single quarter.'],
          ['Rabobank', '1 codebase', 'The adviser portal is the same codebase as the public site.'],
          ['Bosch', '3 catalogues', 'Search across three product catalogues returns one answer.'],
          ['Petrobras', '4 days', 'New sites launch in days rather than months.'],
          ['Excellus', '1 account', 'Members book, pay and message from one account.'],
        ].map(([customer, stat, quote]) => (
          <Card
            key={customer}
            top={<Stat size="sm" value={stat} label={customer} />}
            description={quote}
            bottom={
              <Link href="#" size="md" rightSection={<IconArrowRight />}>
                Read the story
              </Link>
            }
          />
        ))}
      </Carousel>
    </Section>
  ),
}

/** **`Type=Tabbed- Content`** — a centred title, a pill `Tabs` bar, and a panel per option. */
export const TabbedContent: Story = {
  render: () => {
    const PANELS = {
      websites: ['Enterprise websites', 'One content tree, every locale, one deployment.'],
      commerce: ['Digital commerce', 'Catalogues, carts and orders on the same identity.'],
      portals: ['Customer portals', 'Self-service that reuses the public site’s components.'],
    }
    return (
      <Section title={<SectionTitle align="center" title="One platform, four jobs" />}>
        <Tabs variant="pills" defaultValue="websites">
          <Tabs.List grow justify="center">
            {Object.entries(PANELS).map(([value, [label]]) => (
              <Tabs.Tab key={value} value={value}>
                {label.split(' ')[label.split(' ').length - 1]}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {Object.entries(PANELS).map(([value, [title, description]]) => (
            <Tabs.Panel key={value} value={value}>
              <ContentMedia
                mediaSide="right"
                media={<Cover />}
                title={title}
                description={description}
                actions={
                  <Link href="#" size="lg" rightSection={<IconArrowRight />}>
                    See how it works
                  </Link>
                }
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Section>
    )
  },
}

/** **`Type=Customer Story`** — one horizontal `Card` carrying the stats and the links. */
export const CustomerStory: Story = {
  render: () => (
    <Section>
      <Card
        align="horizontal"
        titleSize="full"
        hero={<Logo name="Airbus" />}
        title="Eleven regional sites, one quarter"
        description="Airbus consolidated eleven country sites onto a single platform without pausing a release."
        main={
          <StatBar>
            <Stat value="11" label="Sites migrated" rightSection={<IconArrowUp />} />
            <Stat value="1" label="Codebase" />
            <Stat value="4d" label="To first launch" />
          </StatBar>
        }
        bottom={
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Read the customer story
          </Link>
        }
        image={<Cover />}
      />
    </Section>
  ),
}

/** **`Type=Full Card`** — a title above one full-width horizontal card. */
export const FullCard: Story = {
  render: () => (
    <Section
      title={
        <SectionTitle
          title="Financial services"
          description="What the platform does for regulated industries."
        />
      }
    >
      <Card
        align="horizontal"
        titleSize="full"
        hero={<IconGlassComposable width={48} height={48} />}
        title="Unify client and advisor data"
        description="One identity across the public site, the adviser portal and the mobile app."
        main={
          <StatBar>
            <Stat value="845" label="Months to launch" rightSection={<IconArrowUp />} />
            <Stat value="98%" label="Uptime" />
            <Stat value="3x" label="Faster releases" />
          </StatBar>
        }
        bottom={
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            See the solution
          </Link>
        }
        image={<Cover />}
      />
    </Section>
  ),
}

/** **`Type=Highlight Text`** — `spacing="tight"`, one horizontal card, no section title. */
export const HighlightText: Story = {
  render: () => (
    <Section spacing="tight">
      <Card
        align="horizontal"
        titleSize="full"
        title="Every capability is a service you can take or leave"
        description="Start with content, add commerce when you need it, and never rebuild the shell."
        bottom={
          <Button rightSection={<IconArrowRight />}>Talk to us</Button>
        }
      />
    </Section>
  ),
}

/** **`Type=Quote`** — `spacing="tight"` around a centred pull quote and its attribution. */
export const Quote: Story = {
  render: () => (
    <Section spacing="tight" maxWidth={900}>
      <Stack gap="24" align="center" ta="center">
        <Text
          component="blockquote"
          m={0}
          fz="clamp(21px, 2.2vw, 32px)"
          lh={1.35}
          fw={600}
          c="var(--sds-surfaces-text-primary)"
        >
          “The portal our advisers use every day is now the same codebase as the public site — and that
          stopped being a project.”
        </Text>
        <Stack gap="4">
          <Text fz="16" fw={600}>
            Anne Anderson
          </Text>
          <Text
            fz="12"
            fw={600}
            tt="uppercase"
            c="var(--sds-surfaces-text-secondary)"
            style={{ letterSpacing: '0.04em' }}
          >
            VP of Experience, Rabobank
          </Text>
        </Stack>
      </Stack>
    </Section>
  ),
}

/** **`Type=Quick Links`** — a title and a column of link rows. */
export const QuickLinks: Story = {
  render: () => (
    <Section
      title={<SectionTitle title="Quick links" description="The pages people actually want." />}
    >
      <Stack gap="16">
        {[
          ['Documentation', 'Every API, every version.'],
          ['Release notes', 'What shipped, and when.'],
          ['Community forum', 'Twelve thousand developers.'],
          ['Support', 'Open a ticket, or read the SLA.'],
        ].map(([title, description]) => (
          <Card
            key={title}
            component="a"
            href="#"
            interactive
            align="horizontal"
            title={title}
            description={description}
            bottom={<IconArrowRight />}
          />
        ))}
      </Stack>
    </Section>
  ),
}

/** Several blocks in a row, which is what a page is. */
export const APage: Story = {
  render: () => (
    <>
      {CardGrid.render!({} as never, {} as never)}
      {ContentLeftImage.render!({} as never, {} as never)}
      {Integrations.render!({} as never, {} as never)}
      {Quote.render!({} as never, {} as never)}
      {Faq.render!({} as never, {} as never)}
    </>
  ),
}

/** Narrow, so the fluid padding, type and column collapse can be seen at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <>
      {CardGrid.render!({} as never, {} as never)}
      {ContentLeftImage.render!({} as never, {} as never)}
    </>
  ),
}
