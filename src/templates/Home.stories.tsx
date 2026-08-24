import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Footer } from '../components/Footer'
import { Form } from '../components/Form'
import { Header, MegaMenu } from '../components/Header'
import { Hero } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { List } from '../components/List'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section, SectionTitle } from '../components/Section'
import { Stat, StatBar } from '../components/Stat'
import { Tabs } from '../components/Tabs'
import { TextInput } from '../components/Input'
import {
  IconArrowRight,
  IconArrowUp,
  IconGlassComposable,
  IconGlassDatabase,
  IconGlassMail,
} from '../icons'

/* ------------------------------------------------------------------ offline placeholders */

const shot = (w: number, h: number, seed = 0) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${['#adc9ff', '#7aa8ff', '#ba8fff'][seed % 3]}"/>
    <stop offset="0.6" stop-color="#7414ff"/><stop offset="1" stop-color="#0b5fff"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g${seed})"/>
  <circle cx="${w * 0.25}" cy="${h * 0.3}" r="${Math.min(w, h) * 0.18}" fill="#fff" opacity="0.75"/>
</svg>`)}`

function Logo() {
  return (
    <svg viewBox="0 0 134 40" role="img" aria-label="Liferay" height={32}>
      <rect x="0" y="8" width="24" height="24" rx="6" fill="currentColor" opacity="0.65" />
      <text x="32" y="28" fontSize="20" fontWeight="700" fill="currentColor">
        Liferay
      </text>
    </svg>
  )
}

function Wordmark({ name }: { name: string }) {
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
const SOCIALS = ['LinkedIn', 'X', 'YouTube', 'GitHub']

/* ------------------------------------------------------------------ the page */

function HomePage() {
  const [audience, setAudience] = useState('marketing')

  const PANELS: Record<string, { title: string; body: string; bullets: string[] }> = {
    marketing: {
      title: 'Ship campaigns without a ticket',
      body: 'Editors build and publish pages from the same components engineering uses, so a landing page stops being a release.',
      bullets: ['Reusable page fragments', 'Scheduled publishing', 'Personalisation by segment'],
    },
    it: {
      title: 'One platform to operate',
      body: 'Content, commerce, search and portals on a single deployment — one upgrade path, one security review.',
      bullets: ['Self-managed or our cloud', 'One identity provider', 'One audit surface'],
    },
    developers: {
      title: 'An API for everything on the page',
      body: 'Headless by default, with the component library and the design tokens published as packages.',
      bullets: ['REST and GraphQL', 'Typed client SDKs', 'Local dev in one command'],
    },
  }

  const panel = PANELS[audience]

  return (
    <>
      <Header
        logo={<Logo />}
        position="static"
        items={[
          {
            value: 'platform',
            label: 'Platform',
            menu: (
              <MegaMenu>
                <MegaMenu.Body>
                  <MegaMenu.Columns>
                    <MegaMenu.Column heading="Capabilities">
                      <MegaMenu.Item href="#" title="Content management" />
                      <MegaMenu.Item href="#" title="Digital commerce" />
                      <MegaMenu.Item href="#" title="Enterprise search" />
                    </MegaMenu.Column>
                    <MegaMenu.Column heading="Build">
                      <MegaMenu.Item href="#" title="Headless APIs" />
                      <MegaMenu.Item href="#" title="Design system" />
                    </MegaMenu.Column>
                  </MegaMenu.Columns>
                </MegaMenu.Body>
              </MegaMenu>
            ),
          },
          { value: 'solutions', label: 'Solutions', href: '#' },
          { value: 'resources', label: 'Resources', href: '#' },
          { value: 'pricing', label: 'Pricing', href: '#' },
        ]}
        actions={
          <>
            <Link href="#" size="md">
              Sign in
            </Link>
            <Button size="sm">Contact sales</Button>
          </>
        }
      />

      {/* 1. Left Hero */}
      <Hero
        background="corner"
        label={
          <Label size="sm" variant="outline">
            New — Liferay 2026.Q3
          </Label>
        }
        title={<h1>One platform, every channel</h1>}
        description="Build once and deliver everywhere — websites, portals, commerce and search on one DXP, with the same components and the same deployment."
        actions={
          <>
            <Button rightSection={<IconArrowRight />}>Book a demo</Button>
            <Link href="#" size="lg">
              Read the docs
            </Link>
          </>
        }
        media={<Image src={shot(620, 460, 0)} alt="" ratio="4:3" radius="md" />}
      />

      {/* 2. Logos scrolling section — Size3: a 64px logo row, 24px under the hero, 1280 wide */}
      <Section spacing="none" pt="24">
        <Marquee label="Customers" monochrome size="lg">
          {CUSTOMERS.map((name) => (
            <Wordmark key={name} name={name} />
          ))}
        </Marquee>
      </Section>

      {/* 3. Audience Specific Goals — four Padding=Full cards */}
      <Section
        gap={32}
        title={
          <SectionTitle
            title="Whatever you came here to do"
            description="Four places teams usually start."
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="24">
          {[
            ['Launch a site', 'From brief to live in weeks, not quarters.'],
            ['Replace a portal', 'One login for everything a customer can do.'],
            ['Unify search', 'One index across every system you run.'],
            ['Sell online', 'Commerce on the same content tree.'],
          ].map(([title, description], i) => (
            <Card
              key={title}
              component="a"
              href="#"
              interactive
              padding="full"
              image={<Image src={shot(262, 175, i)} alt="" ratio="3:2" radius={0} />}
              title={title}
              description={description}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 4. Carousel */}
      <Section
        bleed
        title={
          <SectionTitle
            align="center"
            title="Customer stories"
            description="Teams that put content, commerce and search on one platform."
          />
        }
      >
        <Carousel label="Customer stories" gutter={80} indicators="dots">
          {[
            ['Airbus', '11 sites', 'Eleven regional sites onto one platform in a single quarter.'],
            ['Rabobank', '1 codebase', 'The adviser portal is now the same codebase as the public site.'],
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

      {/* 5. Tabbed content — the pill menu */}
      <Section
        title={<SectionTitle align="center" title="Built for whoever is asking" />}
      >
        <Stack gap="40" align="center" w="100%">
          <Tabs variant="pills" value={audience} onChange={(v) => setAudience(v ?? 'marketing')}>
            <Tabs.List grow>
              <Tabs.Tab value="marketing">Marketing</Tabs.Tab>
              <Tabs.Tab value="it">IT</Tabs.Tab>
              <Tabs.Tab value="developers">Developers</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <ContentMedia
            mediaSide="right"
            media={<Image src={shot(620, 414, 1)} alt="" ratio="3:2" radius="md" />}
            title={panel.title}
            description={panel.body}
            actions={
              <Link href="#" size="lg" rightSection={<IconArrowRight />}>
                See how it works
              </Link>
            }
          >
            <List marker="check" size="sm" spacing={12}>
              {panel.bullets.map((b) => (
                <List.Item key={b}>{b}</List.Item>
              ))}
            </List>
          </ContentMedia>
        </Stack>
      </Section>

      {/* 6. Full card */}
      <Section title={<SectionTitle title="Financial services" description="What it does for regulated industries." />}>
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
              Read the customer story
            </Link>
          }
          image={<Image src={shot(588, 392, 2)} alt="" ratio="3:2" radius="md" />}
        />
      </Section>

      {/* 7. Customer story — a 4:3 feature */}
      <Section
        maxWidth={1000}
        gap={40}
        title={<SectionTitle align="center" title="How Airbus did it" description="Four minutes." />}
      >
        <Image src={shot(1000, 750, 1)} alt="Airbus case study video" ratio="4:3" radius="md" />
      </Section>

      {/*
       * 8. Integrations — Figma's `Type=Integrations Section` is a `List` of **64px glass tiles at gap 16**,
       * not a logo marquee. The tile is `card-main` 64x64 at padding 12, which is not a value on the
       * `Padding` axis, so the box is sized here rather than by the component. Recorded in the README.
       */}
      <Section
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
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {[
            IconGlassComposable,
            IconGlassDatabase,
            IconGlassMail,
            IconGlassComposable,
            IconGlassDatabase,
            IconGlassMail,
            IconGlassComposable,
            IconGlassDatabase,
          ].map((Glyph, i) => (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              surface="glass"
              padding="none"
              w={64}
              h={64}
              /* `flex: none` so a tile never shrinks below its 64px — it is a fixed box, not a column. */
              style={{ display: 'grid', placeItems: 'center', flex: 'none' }}
              aria-label="Integration"
            >
              <Glyph width={40} height={40} />
            </Card>
          ))}
        </Box>
      </Section>

      {/* 9. Card grid */}
      <Section
        title={<SectionTitle title="Start here" description="Three ways in." />}
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

      {/* 10. FAQ */}
      <Section
        maxWidth={900}
        title={<SectionTitle align="center" title="Frequently asked questions" />}
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

      {/* 11. Footer, all three bands */}
      <Footer
        brand={
          <Footer.Brand
            logo={<Logo />}
            address={'1400 Montefino Avenue\nDiamond Bar, CA 91765'}
            social={SOCIALS.map((name) => (
              <a key={name} href="#" aria-label={name}>
                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <text x="12" y="16" fontSize="9" textAnchor="middle" fill="currentColor">
                    {name[0]}
                  </text>
                </svg>
              </a>
            ))}
          />
        }
        legal={
          <>
            <Text fz="16" span>
              © 2026 Liferay, Inc.
            </Text>
            <Link href="#" variant="secondary" size="md">
              Privacy policy
            </Link>
            <Link href="#" variant="secondary" size="md">
              Terms of use
            </Link>
          </>
        }
        cta={
          <Box maw={1280} mx="auto">
            <SectionTitle
              align="center"
              order={2}
              title="Ready to see it on your own content?"
              description="A sandbox within the hour, and nothing to install."
            />
            <Box maw={630} mx="auto" mt="32">
              <Form
                submit={
                  <Button type="submit" size="md" fullWidth>
                    Get access
                  </Button>
                }
                onSubmit={(event) => event.preventDefault()}
              >
                <Form.Row>
                  <TextInput floating label="Work Email" type="email" required />
                </Form.Row>
              </Form>
            </Box>
          </Box>
        }
        stats={
          <Box maw={1280} mx="auto">
            <StatBar align="center">
              <Stat size="sm" value="1,200+" label="Enterprise customers" rightSection={<IconArrowUp />} />
              <Stat size="sm" value="60+" label="Countries" />
              <Stat size="sm" value="24/7" label="Support" />
            </StatBar>
          </Box>
        }
      >
        {[
          ['Getting Started', ['Start a trial', 'Documentation', 'Training', 'Support']],
          ['New to Liferay?', ['What is a DXP?', 'Why Liferay', 'Pricing', 'Book a demo']],
          ['Developers', ['API reference', 'Release notes', 'Community', 'Marketplace']],
          ['Company', ['About us', 'Careers', 'Newsroom', 'Contact us']],
        ].map(([title, links]) => (
          <Footer.Column key={title as string} title={title as string}>
            {(links as string[]).map((label) => (
              <Footer.Link key={label} href="#">
                {label}
              </Footer.Link>
            ))}
          </Footer.Column>
        ))}
      </Footer>
    </>
  )
}

const meta = {
  title: 'Templates/Home',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The `Home` template (node `24563:52720`) — a 1440×8559 page — assembled from the library. Everything on it is a real component: the header opens its mega menu, the pill tabs swap the panel below them, the carousel scrolls and snaps, the marquees run, the accordion expands, and the form validates and submits.',
          '',
          'Built to find the gaps rather than to look finished. What it needed that the library did not have is listed in the README under **What the Home template needed**.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. Scroll it, and use it — nothing here is a screenshot. */
export const Page: Story = { render: () => <HomePage /> }

/** The same page at a phone's width, where every section collapses on its own. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <HomePage />,
}
