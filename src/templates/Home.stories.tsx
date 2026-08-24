import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Footer } from '../components/Footer'
import { Header, MegaMenu } from '../components/Header'
import { Hero } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section, SectionTitle } from '../components/Section'
import { Stat, StatBar } from '../components/Stat'
import { Tabs } from '../components/Tabs'
import { LanguagePicker, Select, TextInput } from '../components/Input'
import {
  IconArrowDown,
  IconArrowRight,
  IconBracketsAngle,
  IconBuilding2,
  IconDepartment,
  IconFacebook,
  IconGithub,
  IconGlassCommerce,
  IconGlassCustomerPortals,
  IconGlassEnterpriseWebsite4,
  IconGlassFinancialServices,
  IconGlassIntranets,
  IconGlassMail,
  IconGlassPartnerPortals,
  IconGlassSupplierPortals,
  IconGroup,
  IconInstagram,
  IconLinkedin,
  IconMonitor,
  IconPresentation1,
  IconShoppingCart1,
  IconSocialX,
  IconStarFilled,
  IconUser1,
  IconYoutube,
} from '../icons'

import goal1 from '../../assets/home/goal-1.png'
import goal2 from '../../assets/home/goal-2.png'
import goal3 from '../../assets/home/goal-3.png'
import goal4 from '../../assets/home/goal-4.png'
import capabilityMedia from '../../assets/home/capability-media.png'
import heroMedia from '../../assets/home/hero-media.png'
import industryMedia from '../../assets/home/industry-media.png'
import platformDiagram from '../../assets/home/platform-diagram.png'
import teamsMedia from '../../assets/home/teams-media.png'

/* ------------------------------------------------------------------ stand-ins for other people's marks
 *
 * The page draws customer logos (Airbus, Sky, Broadcom, Unilever, Stadt Wien, Carrefour, Petrobras…)
 * and vendor logos (OpenAI, Asana…) in the marquee, the carousel tiles and the integration row. Those
 * are third-party trademarks, not design-system assets, so they are **not** committed here — the
 * shapes below hold their place at the drawn size. Everything that belongs to the design — copy,
 * structure, tokens, the product screenshots and the platform diagram — is the real thing.
 */

/** A customer wordmark at the marquee's drawn proportion. */
function Wordmark({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 160 32" role="img" aria-label={name} style={{ aspectRatio: '5 / 1' }}>
      <text
        x="0"
        y="23"
        fontSize="19"
        fontWeight="700"
        letterSpacing="1"
        fill="currentColor"
        fontFamily="inherit"
      >
        {name}
      </text>
    </svg>
  )
}

/** The 270×180 logo tile a customer-story card carries, drawn as a brand-coloured field. */
const logoTile = (name: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="360" viewBox="0 0 540 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${hue} 70% 34%)"/>
    <stop offset="1" stop-color="hsl(${hue} 80% 12%)"/>
  </linearGradient></defs>
  <rect width="540" height="360" fill="url(#g)"/>
  <text x="270" y="196" font-size="46" font-weight="700" text-anchor="middle"
        fill="#fff" font-family="Source Sans 3, sans-serif">${name}</text>
</svg>`)}`

/** One of the 64px integration tiles. */
function VendorTile({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label={name} width={40} height={40}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" fontSize="16" fontWeight="700" textAnchor="middle" fill="currentColor">
        {name.slice(0, 1)}
      </text>
    </svg>
  )
}

function LiferayLogo() {
  return (
    <svg viewBox="0 0 134 40" role="img" aria-label="Liferay" height={32}>
      <rect x="0" y="8" width="24" height="24" rx="4" fill="currentColor" opacity="0.85" />
      <text x="32" y="29" fontSize="24" fontWeight="600" fill="currentColor" fontFamily="inherit">
        Liferay
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ small compositions
 *
 * Two shapes the page repeats that the library has no component for. Both are noted in the README:
 * a `Stat` whose figure carries a unit, and the attribution under a customer quote — which the
 * `Common Cards` Code Connect snippet used to call `Quotee`, a component that never existed.
 */

/** The small unit that rides beside a `Stat`'s figure — the `%` in `140%`, the `+` in `+100M`. */
const unit = (u: string) => (
  <Text span inherit fz={20} fw={600}>
    {u}
  </Text>
)

function Quotee({ name, title }: { name: string; title: string }) {
  return (
    <Stack gap={4}>
      <Text fz="sm" fw={600}>
        {name}
      </Text>
      <Text fz={12} fw={600} tt="uppercase" lts="0.06em" c="var(--sds-surfaces-text-secondary)">
        {title}
      </Text>
    </Stack>
  )
}

/* ------------------------------------------------------------------ the page's content */

const NAV = [
  {
    value: 'platform',
    label: 'Platform',
    columns: [
      ['Compare', ['Liferay vs. Adobe', 'Liferay vs. Sitecore', 'Liferay vs. Optimizely', 'Liferay vs. SharePoint']],
      ['New to Liferay?', ['What is a DXP?', 'SaaS vs PaaS', 'Web Portals Explained', 'Headless CMS Guide']],
    ],
  },
  {
    value: 'solutions',
    label: 'Solutions',
    columns: [
      ['Digital Transformation', ['Financial Services', 'Public Sector', 'Healthcare', 'Manufacturing']],
      ['More Industries', ['Insurance', 'Transport & Logistics', 'Education', 'Wealth Management']],
    ],
  },
  {
    value: 'ai-agents',
    label: 'AI Agents',
    columns: [['Agentic platform', ['AI Hub', 'Agent Studio', 'SEO Studio', 'Personalization']]],
  },
  {
    value: 'resources',
    label: 'Resources',
    columns: [
      ['See What’s Possible', ['16 Awesome Web Portal Examples', '8 Exceptional Customer Portal Examples']],
      ['Developers', ['Developer Blog', 'Liferay Discuss', 'Download Liferay DXP', 'GitHub']],
    ],
  },
  {
    value: 'partners',
    label: 'Partners',
    columns: [['Partner with us', ['Find a partner', 'Become a partner', 'Partner Portal']]],
  },
] as const

/** `Audience Specific Goals` — the four cards, per tab. */
const GOALS: Record<string, { title: string; image: string; alt: string }[]> = {
  marketers: [
    {
      title: 'Launch Campaigns Across Channels Faster',
      image: goal1,
      alt: 'A campaign board with a rocket and a Publish button',
    },
    {
      title: 'Drive Conversions with Tailored Experiences',
      image: goal2,
      alt: 'Segment rules switching between an enterprise buyer and a returning customer',
    },
    {
      title: 'Drive B2B Revenue with 24/7 Self-Serve Commerce',
      image: goal3,
      alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
    },
    {
      title: 'Turn Analytics into Immediate Action',
      image: goal4,
      alt: 'An analytics dashboard prompting a segmented campaign',
    },
  ],
  /*
   * The file draws this second set hidden and empty, so the copy here is written rather than read.
   * Recorded in the README — a tab that changes nothing is worse than a tab with a stated guess.
   */
  developers: [
    {
      title: 'Ship Features Without Rebuilding the Platform',
      image: goal3,
      alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
    },
    {
      title: 'Extend Anything Through Headless APIs',
      image: goal2,
      alt: 'Segment rules switching between an enterprise buyer and a returning customer',
    },
    {
      title: 'Run One Platform Instead of Six Integrations',
      image: goal4,
      alt: 'An analytics dashboard prompting a segmented campaign',
    },
    {
      title: 'Keep Security and Compliance Auditable',
      image: goal1,
      alt: 'A campaign board with a rocket and a Publish button',
    },
  ],
}

/** The four fully drawn customer-story cards in the `CAROUSEL` section. */
const STORIES = [
  {
    customer: 'Sky',
    hue: 214,
    value: '140',
    suffix: '%',
    label: 'Increase in customer self-service',
    quote:
      'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
    name: 'Anne Anderson',
    title: 'VP of Experience and Change Management',
  },
  {
    customer: 'Stadt Wien',
    hue: 0,
    value: '100M',
    prefix: '+',
    label: 'Site views per month',
    quote:
      'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
    name: 'Nikolaus Reisel',
    title: 'GBS Group Leader: Basic Systems and Platforms',
  },
  {
    customer: 'Broadcom',
    hue: 300,
    value: '845',
    label: 'Features implemented',
    quote:
      'We don’t look at Liferay as the vendor. We see them as a partner. Everything we wanted to do in terms of providing customer self-service has been realized.',
    name: 'Erica Callaghan',
    title: 'Communications and UX Officer, Global Technology Organization',
  },
  {
    customer: 'Unilever',
    hue: 228,
    value: '133',
    suffix: '%',
    label: 'Faster go to market',
    quote:
      'Liferay was a bit of a no-brainer for us. The entire digital journey is now orchestrated in a unified way.',
    name: 'Srikant Chandrasekharan',
    title: 'Senior Delivery Lead for Enterprise Platforms & Products',
  },
]

/** `Different Teams. One Platform.` — the accordion behind each pill. */
const TEAMS: Record<
  string,
  { icon: ReactNode; label: string; title: string; description: string; items: { q: string; a: string; link?: string }[] }
> = {
  marketers: {
    icon: <IconUser1 />,
    label: 'Marketers',
    title: 'Launch faster. Convert more.',
    description: 'For teams that drive campaigns, content, and customer experience.',
    items: [
      {
        q: 'Create smarter content. Convert more visitors.',
        a: 'Use AI to create and manage content faster, while agents auto-tag assets, translate pages, and segment visitors in real time – so every piece of content lands with the right audience automatically.',
        link: 'Explore AI Hub',
      },
      {
        q: 'Launch campaigns without waiting on IT',
        a: 'Build and publish pages from the same components engineering ships, so a landing page stops being a release.',
        link: 'Explore the page builder',
      },
      {
        q: 'Reach every visitor with the right message',
        a: 'Segment on behaviour, account and locale, then personalise any fragment on the page against those segments.',
        link: 'Explore personalization',
      },
      {
        q: 'Keep content and assets consistent across every channel',
        a: 'One content tree and one asset library feed the website, the portal, commerce and every headless surface.',
        link: 'Explore the DAM',
      },
      {
        q: 'Turn your site into a B2B revenue engine',
        a: 'Catalogues, negotiated pricing and self-serve reordering sit on the same content the marketing site uses.',
        link: 'Explore commerce',
      },
    ],
  },
  /* Same as the goals tabs: the file draws the other two pills without content behind them. */
  it: {
    icon: <IconUser1 />,
    label: 'IT/Developers',
    title: 'One platform to build on and to operate.',
    description: 'For teams that own the stack, the upgrades and the audit.',
    items: [
      {
        q: 'Build against APIs, not a template language',
        a: 'REST and GraphQL for everything on the page, with typed client SDKs and local development in one command.',
        link: 'Read the API reference',
      },
      {
        q: 'Run it where your policy says you can',
        a: 'The same distribution as SaaS, PaaS or self-hosted, with one upgrade path between them.',
        link: 'Compare deployment options',
      },
      {
        q: 'One identity, one audit surface',
        a: 'Content, commerce, search and portals behind a single identity provider and a single audit log.',
        link: 'Visit the Trust Center',
      },
      {
        q: 'Extend without forking',
        a: 'Low-code for the small things, OSGi modules for the rest — upgrades stay upgrades.',
        link: 'Explore low-code',
      },
    ],
  },
  partners: {
    icon: <IconUser1 />,
    label: 'Partners',
    title: 'Deliver more, with less rebuilding.',
    description: 'For agencies and integrators shipping on behalf of clients.',
    items: [
      {
        q: 'Reuse what you built for the last client',
        a: 'Ship accelerators as modules and design systems, then reuse them across engagements.',
        link: 'Visit the Marketplace',
      },
      {
        q: 'Get your team certified',
        a: 'Role-based learning paths and certification for developers, architects and administrators.',
        link: 'Explore training',
      },
      {
        q: 'Grow with the programme',
        a: 'Co-selling, deal registration and technical enablement through the partner portal.',
        link: 'Become a partner',
      },
    ],
  },
}

/** `Every Capability Your Enterprise Needs` — the segmented bar and the panel behind each cell. */
const CAPABILITIES = [
  {
    value: 'customer-portals',
    glass: <IconGlassCustomerPortals width={40} height={40} />,
    label: 'Customer Portals',
    icon: <IconUser1 />,
    title: 'Give customers one place to do everything.',
    description:
      'Let customers find answers, raise a case and manage their account without calling — on the same content your site runs on.',
    cta: 'Explore Customer Portals',
  },
  {
    value: 'supplier-portals',
    glass: <IconGlassSupplierPortals width={40} height={40} />,
    label: 'Supplier Portals',
    icon: <IconMonitor />,
    title: 'Onboard suppliers in days, not quarters.',
    description:
      'Collect documents, track compliance and settle invoices in one place, with the approvals your finance team already runs.',
    cta: 'Explore Supplier Portals',
  },
  {
    value: 'partner-portals',
    glass: <IconGlassPartnerPortals width={40} height={40} />,
    label: 'Partner Portals',
    icon: <IconDepartment />,
    title: 'Arm your partners with what they need to sell.',
    description:
      'Deal registration, co-branded assets and enablement behind one login, personalised by partner tier.',
    cta: 'Explore Partner Portals',
  },
  {
    value: 'enterprise-websites',
    glass: <IconGlassEnterpriseWebsite4 width={40} height={40} />,
    label: 'Enterprise Websites',
    icon: <IconBuilding2 />,
    title: 'Captivate visitors, generate leads, and grow fast.',
    description:
      'Turn visitors into conversions and conversions into customers and lifelong advocates with personalized, scalable websites.',
    cta: 'Explore Enterprise Websites',
  },
  {
    value: 'intranets',
    glass: <IconGlassIntranets width={40} height={40} />,
    label: 'Intranets',
    icon: <IconGroup />,
    title: 'One place your people actually go.',
    description:
      'Company news, the document you need and the form you have to file, searchable in one index and one login.',
    cta: 'Explore Intranets',
  },
  {
    value: 'digital-commerce',
    glass: <IconGlassCommerce width={40} height={40} />,
    label: 'Digital Commerce',
    icon: <IconShoppingCart1 />,
    title: 'Sell the way your buyers buy.',
    description:
      'Negotiated pricing, self-serve reordering and quote-to-cash on the same content tree as the marketing site.',
    cta: 'Explore Digital Commerce',
  },
]

const INDUSTRIES = [
  'Financial Services',
  'Energy and Utilities',
  'Manufacturing',
  'Public Sector',
  'Healthcare',
  'All Industries',
]

const CUSTOMERS = [
  'DATAMATICS',
  'PETROBRAS',
  'CITY OF BURBANK',
  'Excellus',
  'AIRBUS',
  'Carrefour',
]

const VENDORS = ['Asana', 'Postmark', 'Trello', 'OpenAI', 'Mixpanel', 'Auth0', 'Figma', 'Payhip']

const RESEARCH = [
  { tag: 'CMS Trends', title: '2026 Liferay Digital Content Management Report' },
  { tag: 'Agentic AI', title: 'Liferay 2026 Agentic AI Adoption and Governance Report' },
  { tag: 'Digital Trust', title: 'Liferay 2026 Broken Trust Report' },
]

const FOOTER_LINKS: [string, string[]][] = [
  [
    'Getting Started',
    ['Request a Demo', 'Start Free Trial', 'Marketplace', 'Liferay SaaS/PaaS/Self-Hosted', 'Implementation Guide'],
  ],
  ['More Industries', ['Insurance', 'Transport & Logistics', 'Education', 'Wealth Management']],
  [
    'Compare',
    [
      'Liferay vs. Adobe',
      'Liferay vs. Sitecore',
      'Liferay vs. Optimizely',
      'Liferay vs. SharePoint',
      'Liferay vs. Magnolia',
      'Liferay vs. Salesforce',
    ],
  ],
  [
    'New to Liferay?',
    [
      'What is a DXP?',
      'SaaS vs PaaS',
      'Web Portals Explained',
      'Portal Examples',
      'Headless CMS Guide',
      'Get Your Website Management Score in 2 Minutes',
    ],
  ],
  ['Digital Transformation', ['Financial Services', 'Public Sector', 'Healthcare', 'Manufacturing']],
]

const FOOTER_LINKS_2: [string, string[]][] = [
  [
    'See What’s Possible',
    [
      '16 Awesome Web Portal Examples',
      '3 Examples of Successful Digital Transformation in Manufacturing',
      '8 Exceptional Customer Portal Examples',
      '7 Intranet Examples That Boost Productivity',
      '3 Real-World Examples of Self-Service in Manufacturing',
    ],
  ],
  [
    'Company',
    ['About Us', 'What’s New', 'What’s Next', 'Liferay in the News', 'Careers', 'Locations', 'Contact Us'],
  ],
  ['Legal', ['Trust Center', 'Customer Agreement Framework', 'Privacy Policy', 'Compliance', 'Accessibility']],
  [
    'Developers',
    [
      'Developer Blog',
      'Liferay Discuss',
      'Liferay User Groups',
      'Download Liferay DXP',
      'GitHub',
      'Upgrading Liferay DXP to Jakarta',
      'Liferay Cloud Platform Status',
    ],
  ],
]

const SOCIALS: [string, ReactNode][] = [
  ['Facebook', <IconFacebook key="f" />],
  ['GitHub', <IconGithub key="g" />],
  ['Instagram', <IconInstagram key="i" />],
  ['LinkedIn', <IconLinkedin key="l" />],
  ['X', <IconSocialX key="x" />],
  ['YouTube', <IconYoutube key="y" />],
]

/* ------------------------------------------------------------------ the page */

function HomePage() {
  const [goalTab, setGoalTab] = useState('marketers')
  const [teamTab, setTeamTab] = useState('marketers')
  const [capability, setCapability] = useState('enterprise-websites')
  const [industry, setIndustry] = useState(INDUSTRIES[0])

  const team = TEAMS[teamTab]
  const panel = CAPABILITIES.find((c) => c.value === capability) ?? CAPABILITIES[3]

  return (
    <>
      <Header
        logo={<LiferayLogo />}
        position="static"
        items={NAV.map((item) => ({
          value: item.value,
          label: item.label,
          menu: (
            <MegaMenu>
              <MegaMenu.Body>
                <MegaMenu.Columns>
                  {item.columns.map(([heading, links]) => (
                    <MegaMenu.Column key={heading} heading={heading}>
                      {links.map((label) => (
                        <MegaMenu.Item key={label} href="#" title={label} />
                      ))}
                    </MegaMenu.Column>
                  ))}
                </MegaMenu.Columns>
              </MegaMenu.Body>
            </MegaMenu>
          ),
        }))}
        actions={
          <>
            <LanguagePicker
              aria-label="Language"
              /* The drawn label is `EN (US)`; the component's default 78px is cut for "EN" alone. */
              w={116}
              defaultValue="en-US"
              data={[
                { value: 'en-US', label: 'EN (US)' },
                { value: 'de-DE', label: 'DE' },
                { value: 'pt-BR', label: 'PT (BR)' },
                { value: 'ja-JP', label: 'JA' },
              ]}
            />
            <Link href="#" size="md" leftSection={<IconUser1 />}>
              Log In
            </Link>
            <Button size="sm">Contact Sales</Button>
          </>
        }
      />

      {/* 1. Left Hero — the solution finder above the fold, the form in the content column. */}
      <Hero
        background="corner"
        banner={
          <Card
            surface="glass"
            padding="none"
            /* A pill at the drawn width; once the row wraps on a narrow canvas, a pill is wrong. */
            bdrs={{ base: 24, md: 30 }}
            w="100%"
            maw={1000}
          >
            <Group gap={16} px={16} py={8} align="center">
              <Text fz="lg" fw={600} pl={8} flex={{ base: '1 1 100%', md: '1 1 auto' }}>
                Explore customized solutions
              </Text>
              <Select
                aria-label="Industry"
                radius="xl"
                w={{ base: '100%', md: 200 }}
                defaultValue="financial-services"
                data={[
                  { value: 'financial-services', label: 'Financial Services' },
                  { value: 'public-sector', label: 'Public Sector' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'healthcare', label: 'Healthcare' },
                ]}
              />
              <Select
                aria-label="Use case"
                radius="xl"
                w={{ base: '100%', md: 320 }}
                defaultValue="kms"
                data={[
                  { value: 'kms', label: 'Knowledge Management Systems' },
                  { value: 'customer-portals', label: 'Customer Portals' },
                  { value: 'commerce', label: 'Digital Commerce' },
                  { value: 'intranets', label: 'Intranets' },
                ]}
              />
              <Button
                variant="rounded"
                size="sm"
                w={{ base: '100%', md: 'auto' }}
                rightSection={<IconArrowRight />}
              >
                Continue
              </Button>
            </Group>
          </Card>
        }
        title={
          <h1>
            Launch Digital Experiences That{' '}
            <Text
              span
              inherit
              variant="gradient"
              gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}
            >
              Convert, Scale and Grow
            </Text>
          </h1>
        }
        description={
          <p>
            Liferay DXP is the agentic platform to automate content production, localize for global
            markets, launch unified commerce storefronts and dominate SEO/AEO on a{' '}
            <Text span inherit fw={700} c="var(--sds-surfaces-text-primary)">
              single, intelligent platform and Headless CMS.
            </Text>
          </p>
        }
        form={
          <TextInput
            aria-label="Work email"
            type="email"
            placeholder="Enter Your Email"
            containedButton={
              <Button size="sm" rightSection={<IconArrowRight />}>
                Start Free Trial
              </Button>
            }
          />
        }
        actions={
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Request a Demo
          </Link>
        }
        proof={
          <>
            <Group gap={8} wrap="nowrap">
              <Text fz={28} fw={700} lh={1}>
                4.6
              </Text>
              <Group gap={0} aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStarFilled
                    key={i}
                    width={16}
                    height={16}
                    color={
                      i < 4
                        ? 'var(--sds-surfaces-text-primary)'
                        : 'var(--sds-surfaces-text-secondary)'
                    }
                  />
                ))}
              </Group>
            </Group>
            <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
              Source: Gartner Peer Insights&trade;
            </Text>
            <Group gap={8} wrap="wrap">
              {['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPPA', 'CSTAR'].map((mark) => (
                <Label key={mark} variant="outline" size="sm" radius="sm">
                  {mark}
                </Label>
              ))}
            </Group>
          </>
        }
        media={
          <Image
            src={heroMedia}
            alt="A Liferay-built product catalogue with simulation and asset-intelligence tools"
            ratio="4:3"
            radius="md"
          />
        }
      />

      {/* 2. Logos scrolling section — a 64px logo row directly under the hero. */}
      <Section spacing="none" pt={24}>
        <Marquee label="Customers using Liferay" monochrome size="lg">
          {CUSTOMERS.map((name) => (
            <Wordmark key={name} name={name} />
          ))}
        </Marquee>
      </Section>

      {/* 3. Audience Specific Goals — the title and its pills share one row. */}
      <Section
        gap={32}
        title={
          <SectionTitle
            title="What Teams Can Achieve with Liferay"
            actions={
              /*
               * The width is explicit because `variant="pills"` makes its own root an `inline-size`
               * container — which is what lets the bar switch to the Mobile cell on its own width
               * rather than the window's, but also means the root contributes nothing to a
               * content-based measurement and collapses to 0 in a row. 520 is the drawn width. In
               * the README.
               */
              <Tabs
                variant="pills"
                w={{ base: '100%', md: 520 }}
                value={goalTab}
                onChange={(v) => setGoalTab(v ?? 'marketers')}
              >
                <Tabs.List grow>
                  <Tabs.Tab value="marketers" leftSection={<IconPresentation1 />}>
                    Marketers
                  </Tabs.Tab>
                  <Tabs.Tab value="developers" leftSection={<IconBracketsAngle />}>
                    IT / Developers
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            }
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={24}>
          {GOALS[goalTab].map((goal) => (
            <Card
              key={goal.title}
              component="a"
              href="#"
              interactive
              padding="all"
              image={<Image src={goal.image} alt={goal.alt} ratio="3:2" radius="sm" />}
              title={goal.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 4. CAROUSEL — customer stories, arrows rather than dots, and the row bleeds off both edges. */}
      <Section
        bleed
        title={<SectionTitle align="center" title="1,200+ Enterprises Move the Needle With Liferay" />}
      >
        <Carousel label="Customer stories" gutter={80} indicators="none" arrows>
          {STORIES.map((story) => (
            <Card
              key={story.customer}
              image={
                <Image
                  src={logoTile(story.customer, story.hue)}
                  alt={story.customer}
                  ratio="3:2"
                  radius="sm"
                />
              }
              top={
                <Stat
                  value={
                    <>
                      {story.prefix ? unit(story.prefix) : null}
                      {story.value}
                      {story.suffix ? unit(story.suffix) : null}
                    </>
                  }
                  label={story.label}
                />
              }
              description={`“${story.quote}”`}
              bottom={<Quotee name={story.name} title={story.title} />}
            />
          ))}
        </Carousel>
      </Section>

      {/* 5. Different Teams. One Platform. — pills over an accordion, media and stats on the right. */}
      <Section
        title={
          <SectionTitle
            align="center"
            title="Different Teams. One Platform."
            description="Whether you drive campaigns, build infrastructure, or grow partnerships – Liferay empowers your success."
          />
        }
      >
        <Stack gap={40} align="center" w="100%">
          {/* Same explicit width as the goals row, and for the same reason. 776 is the drawn width. */}
          <Tabs
            variant="pills"
            w={{ base: '100%', md: 776 }}
            value={teamTab}
            onChange={(v) => setTeamTab(v ?? 'marketers')}
          >
            <Tabs.List grow>
              {Object.entries(TEAMS).map(([value, t]) => (
                <Tabs.Tab key={value} value={value} leftSection={t.icon}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          <ContentMedia
            mediaSide="right"
            /* Image plus a stat row: taller than 3:2, so the box takes its height from them. */
            mediaRatio="auto"
            order={3}
            title={team.title}
            description={team.description}
            media={
              <Stack gap={0}>
                <Image
                  src={teamsMedia}
                  alt="Two colleagues building an AI agent in Liferay"
                  ratio="3:2"
                  radius="md"
                />
                <StatBar align="center">
                  <Stat value="56" label="Websites launched" align="center" />
                  <Stat value="24" label="Industries served" align="center" />
                  <Stat value="77" label="Countries served" align="center" />
                </StatBar>
              </Stack>
            }
          >
            <Accordion size="lg" order={4} defaultValue={team.items[0].q}>
              {team.items.map((item) => (
                <Accordion.Item key={item.q} value={item.q}>
                  <Accordion.Control>{item.q}</Accordion.Control>
                  <Accordion.Panel>
                    <p>{item.a}</p>
                    {item.link ? (
                      <Link href="#" size="md" rightSection={<IconArrowRight />}>
                        {item.link}
                      </Link>
                    ) : null}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ContentMedia>
        </Stack>
      </Section>

      {/* 6. Designed for Your Industry — one full card, with the industry tabs under it. */}
      <Section
        gap={24}
        title={<SectionTitle title="Designed for Your Industry. Built for Growth." />}
        footer={
          /*
           * `w="100%"` so the bar fills the footer row rather than being centred at its own
           * max-content width — which on a phone is 823px of tabs overflowing both gutters. At full
           * width the list scrolls, which is what the component already does under 1200.
           */
          <Tabs w="100%" value={industry} onChange={(v) => setIndustry(v ?? INDUSTRIES[0])}>
            <Tabs.List grow>
              {INDUSTRIES.map((name) => (
                <Tabs.Tab key={name} value={name}>
                  {name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        }
      >
        <Card
          align="horizontal"
          titleSize="full"
          hero={<IconGlassFinancialServices width={48} height={48} />}
          title={industry}
          description="Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge."
          main={
            <Stack gap={12} align="flex-start">
              <Link href="#" size="md" rightSection={<IconArrowRight />}>
                {industry} Solutions
              </Link>
              <Link href="#" size="md" rightSection={<IconArrowRight />}>
                Digital transformation in {industry}
              </Link>
            </Stack>
          }
          secondary={
            <StatBar>
              <Stat value={<>45{unit('%')}</>} label="Faster loading time" />
              <Stat
                value={<>96{unit('%')}</>}
                label="Less consulting time"
                leftSection={<IconArrowDown />}
              />
              <Stat
                value={<>845{unit('%')}</>}
                label="Less data entry time*"
                leftSection={<IconArrowDown />}
              />
            </StatBar>
          }
          image={
            <Image
              src={industryMedia}
              alt="Someone signing in to their account from a phone"
              ratio="3:2"
              radius="md"
            />
          }
        />
      </Section>

      {/* 7. Everything You Need in One Platform — the product map, drawn at 1000×806. */}
      <Section
        maxWidth={1000}
        gap={40}
        title={<SectionTitle align="center" title="Everything You Need in One Platform" />}
      >
        <Image
          src={platformDiagram}
          alt="DXP at the centre of four groups: Content & Experience, Commerce & Sales, Platform & Infrastructure, and Intelligence & AI"
          ratio="auto"
          fit="contain"
        />
      </Section>

      {/* 8. Every Capability Your Enterprise Needs — the six-cell segmented bar. */}
      <Section
        title={<SectionTitle align="center" title="Every Capability Your Enterprise Needs" />}
      >
        <Stack gap={24} w="100%">
          <Tabs
            variant="pills"
            value={capability}
            onChange={(v) => setCapability(v ?? 'enterprise-websites')}
          >
            <Tabs.List grow>
              {CAPABILITIES.map((c) => (
                <Tabs.Tab key={c.value} value={c.value} leftSection={c.icon}>
                  {c.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          <ContentMedia
            mediaSide="right"
            order={3}
            eyebrow={panel.glass}
            title={panel.title}
            description={panel.description}
            actions={
              <Link href="#" size="lg" rightSection={<IconArrowRight />}>
                {panel.cta}
              </Link>
            }
            media={
              <Image
                src={capabilityMedia}
                alt="A financial-services website built on Liferay"
                ratio="3:2"
                radius="md"
              />
            }
          />
        </Stack>
      </Section>

      {/*
       * 9. Integrations — Figma's `Type=Integrations Section` is a `List` of 64px glass tiles at gap
       * 16, not a logo marquee. The tile is `card-main` 64×64 at padding 12, which is not a value on
       * the `Padding` axis, so the box is sized here rather than by the component. In the README.
       */}
      <Section
        gap={32}
        title={
          <SectionTitle
            title="Extend Your platform. Integrate without limits."
            description="Liferay connects flexibly with the platforms and vendors your team relies on every day."
            actions={
              <Button
                variant="outline"
                size="md"
                /* Full width once the row has wrapped, so the label has somewhere to go. */
                w={{ base: '100%', md: 'auto' }}
                rightSection={<IconArrowRight />}
              >
                Explore our integration capabilities
              </Button>
            }
          />
        }
      >
        <Group gap={16} wrap="wrap">
          {[...VENDORS, ...VENDORS].map((name, i) => (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}-${i}`}
              surface="glass"
              padding="none"
              w={64}
              h={64}
              /* `flex: none` so a tile never shrinks below its 64px — a fixed box, not a column. */
              style={{ display: 'grid', placeItems: 'center', flex: 'none' }}
            >
              <VendorTile name={name} />
            </Card>
          ))}
        </Group>
      </Section>

      {/*
       * 10. Trending Now — six resource cards. The file has not been written yet here: every card
       * says `Card Title` and a line of lorem, so that is what this renders rather than inventing
       * six headlines the design has not chosen.
       */}
      <Section
        title={
          <SectionTitle title="Trending Now" description="Latest insights and resources from Liferay." />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card
              key={i}
              component="a"
              href="#"
              interactive
              hero={<IconGlassMail width={40} height={40} />}
              title="Card Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 11. Our Latest Research & Data — a tag over a title, and nothing else. */}
      <Section
        title={
          <SectionTitle
            title="Our Latest Research &amp; Data"
            description="New studies and reports to help you make smarter decisions."
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {RESEARCH.map((report) => (
            <Card
              key={report.tag}
              component="a"
              href="#"
              interactive
              hero={
                <Label variant="outline" size="md">
                  {report.tag}
                </Label>
              }
              title={report.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 12. LRDC footer — the action band, the disclaimers, the numbers, and the link grid. */}
      <Footer
        cta={
          <Stack gap={40} maw={1280} mx="auto">
            <Stack gap={32} align="center">
              <SectionTitle
                align="center"
                order={2}
                title={
                  <Text
                    span
                    inherit
                    variant="gradient"
                    gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}
                  >
                    Ready for the future? Let&apos;s Get There Together.
                  </Text>
                }
                description="Join thousands of organizations transforming their digital experiences with Liferay. Start your free trial today."
              />
              {/*
                * A bare form row rather than `Form`: `Form` is Figma's glass *form card* — a 40px
                * padded surface — and the action band draws the field and the button straight onto
                * the page. Same submit semantics, none of the surface.
                */}
              <Box
                component="form"
                maw={600}
                w="100%"
                onSubmit={(event) => event.preventDefault()}
              >
                <Group gap={16} align="flex-start" wrap="nowrap">
                  <TextInput
                    aria-label="Work email"
                    type="email"
                    placeholder="Enter Your Email"
                    required
                    flex="1 1 auto"
                  />
                  <Button type="submit" size="md" flex="0 0 auto">
                    Start Free Trial
                  </Button>
                </Group>
              </Box>
              <Group gap={16} justify="center">
                <Button variant="outline" size="md">
                  Book a Demo
                </Button>
                <Button variant="outline" size="md">
                  Contact Sales
                </Button>
              </Group>
            </Stack>

            <Stack gap={16} c="var(--sds-surfaces-text-secondary)">
              <Text fz="xs">
                *Metrics reflect results from individual Liferay customer stories and may vary by
                organization.
              </Text>
              <Text fz="xs">
                *Gartner, Voice of the Customer for Digital Experience Platforms, Peer Community
                Contributor, 27 July 2026.
                <br />
                Gartner, Peer Insights, and Customers&apos; Choice are trademarks of Gartner, Inc.,
                and/or its affiliates. Gartner Peer Insights content consists of the opinions of
                individual end users based on their own experiences, and should not be construed as
                statements of fact, nor do they represent the views of Gartner or its affiliates.
                Gartner does not endorse any vendor, product or service depicted in this content nor
                makes any warranties, expressed or implied, with respect to this content, about its
                accuracy or completeness, including any warranties of merchantability or fitness for a
                particular purpose.
              </Text>
            </Stack>
          </Stack>
        }
        stats={
          <Box maw={1280} mx="auto">
            <StatBar align="center">
              <Stat size="sm" value={<>1,200{unit('+')}</>} label="Enterprise Customers" />
              <Stat size="sm" value={<>17{unit('+')}</>} label="Years of Innovation" />
            </StatBar>
          </Box>
        }
        legal={
          <>
            <Text fz="sm" span>
              Built on Liferay Digital Experience Platform
            </Text>
            <Text fz="sm" span>
              &copy; 2023 Liferay Inc. All Rights Reserved
            </Text>
            {['GDPR', 'Accessibility', 'Legal', 'Compliance', 'Privacy Policy'].map((label) => (
              <Link key={label} href="#" variant="secondary" size="sm">
                {label}
              </Link>
            ))}
          </>
        }
      >
        {FOOTER_LINKS.map(([title, links]) => (
          <Footer.Column key={title} title={title}>
            {links.map((label) => (
              <Footer.Link key={label} href="#">
                {label}
              </Footer.Link>
            ))}
          </Footer.Column>
        ))}

        {/*
         * The brand block starts the second row of the grid, which is where the file draws it — so it
         * is the sixth child rather than the `brand` prop, which would put it first.
         */}
        <Footer.Brand
          logo={<LiferayLogo />}
          address={'1400 Montefino Avenue\nDiamond Bar, CA 91765\nUSA\n+1-877-LIFERAY'}
          social={SOCIALS.map(([name, icon]) => (
            <a key={name} href="#" aria-label={name}>
              {icon}
            </a>
          ))}
        />

        {FOOTER_LINKS_2.map(([title, links]) => (
          <Footer.Column key={title} title={title}>
            {links.map((label) => (
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
          'The `Home` page from the Figma file (node `24563:52720`) — a 1440×8559 frame — built out of the library. Twelve sections, and everything on them is a real component: the header opens its mega menus, three separate pill sets swap the panel below them, the industry tabs retitle the card, the carousel scrolls and snaps, the marquee runs, the accordion expands, and both forms validate and submit.',
          '',
          'The copy, the numbers, the quotes and the link taxonomy are the file’s. So are the product screenshots and the platform diagram, which are committed under `assets/home/`. Customer and vendor logos are **not** — they are other companies’ trademarks rather than design-system assets, so stand-ins hold their place at the drawn size.',
          '',
          'Where the file is unfinished or contradicts itself, the README records what was done instead, under **What the Home template needed**.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. Scroll it, and use it — nothing here is a screenshot of a design. */
export const Page: Story = { render: () => <HomePage /> }

/** The same page at a phone's width, where every section collapses on its own. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <HomePage />,
}
