import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import type { ReactNode } from 'react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Bubble, BUBBLE_DEFAULTS } from '../components/Bubble'
import type { BubbleProps } from '../components/Bubble'
import { BUBBLE_ARG_TYPES } from '../components/Bubble/Bubble.argTypes'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CapabilityMap } from '../components/CapabilityMap'
import { Carousel } from '../components/Carousel'
import bubbleFull from '../../assets/bubbles/bubble_center.webm'
import bubbleFullLight from '../../assets/bubbles/bubble_center_light.webm'
import { GradientText } from '../components/GradientText'
import { Hero } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section, SectionTitle } from '../components/Section'
import { Stat, StatBar, CountUp } from '../components/Stat'
import { PRODUCT_CLUSTERS, PRODUCT_MAP_MAX_HEIGHT } from './product-map'
import { VENDOR_LOGOS } from './vendor-logos'
import classes from '../theme/components.module.css'
import { CUSTOMER_THUMBNAILS, customerThumbnailAlt } from './customer-thumbnails'
import { CrossfadeMedia } from './PageRenderer'
import { Quotee, SiteFooter, SiteHeader, StarRating, Wordmark, logoTile, unit } from './shared'
import { Tabs } from '../components/Tabs'
import { Select, TextInput } from '../components/Input'
import {
  IconArrowDown,
  IconArrowRight,
  IconBracketsAngle,
  IconBuilding2,
  IconDepartment,
  IconGlassCommerce,
  IconGlassCustomerPortals,
  IconGlassDXP,
  IconGlassEnterpriseWebsite4,
  IconGlassFinancialServices,
  IconGlassIntranets,
  IconGlassPartnerPortals,
  IconGlassSupplierPortals,
  IconGroup,
  IconMonitor,
  IconPresentation1,
  IconShoppingCart1,
  IconUser1,
} from '../icons'

import goal1 from '../../assets/home/goal-1.png'
import goal2 from '../../assets/home/goal-2.png'
import goal3 from '../../assets/home/goal-3.png'
import goal4 from '../../assets/home/goal-4.png'
import heroAnimation from '../../assets/home/hero-animation.webm'
import heroMedia from '../../assets/home/hero-media.png'
import capabilityMedia from '../../assets/home/capability-media.png'
import industryMedia from '../../assets/home/industry-media.png'
import teamsMedia from '../../assets/home/teams-media.png'
/*
 * The teams panel's footage.
 *
 * Placed by the names the export carried — `t1c1`…`t1c4` and `t2c2`, meaning tab 1 cards 1 to 4 and
 * tab 2 card 2 — rather than by reading the product names against the copy. Guessing from the product
 * names put all five on Marketers, which is wrong twice over: `cms` belongs to IT/Developers, and
 * Marketers' fifth row has no clip at all and keeps the still.
 */
import aiHubClip from '../../assets/home/teams/ai-hub.mp4'
import cmpClip from '../../assets/home/teams/cmp.mp4'
import personalizationClip from '../../assets/home/teams/personalization.mp4'
import cmsClip from '../../assets/home/teams/cms.mp4'
import sitesClip from '../../assets/home/teams/sites.mp4'
/* A still rather than footage — the B2B row is the one card that was exported as a picture. */
import b2bStill from '../../assets/home/teams/b2b-commerce.png'
import trendingAi from '../../assets/home/trending/ai-transformation.jpg'
import trendingB2b from '../../assets/home/trending/b2b-ecommerce.jpg'
import trendingKms from '../../assets/home/trending/knowledge-management.jpg'
import trendingLowCode from '../../assets/home/trending/low-code.jpg'
import trendingStrategy from '../../assets/home/trending/digital-strategy.jpg'
import trendingPortals from '../../assets/home/trending/web-portals.jpg'


/* ------------------------------------------------------------------ the page's content */


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
/*
 * The eight customer stories, from the `§4 Customer Testimonials` sheet — company, metric, quote and
 * source, transcribed rather than paraphrased.
 *
 * Four of these are new. Of the four that were here, **Sky's was wrong**: it carried Mueller's quote and
 * an author who does not appear anywhere in the source, so the card was attributing one customer's words
 * to another under a made-up name. Mueller is now its own entry with that quote, and Sky has the one the
 * sheet gives it.
 *
 * `hue` is the drawn stand-in's colour, and is the only field here that is not from the sheet — it is
 * used only for a customer with no thumbnail in `customer-thumbnails.ts`, which at present is none of
 * them.
 */
const STORIES = [
  {
    customer: 'Sky TV',
    hue: 214,
    value: '140',
    suffix: '%',
    label: 'Increase in customer self-service',
    quote:
      'With Liferay, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
    name: 'Jacques Hefer',
    title: 'Solution Architect',
  },
  {
    customer: 'City of Vienna',
    hue: 0,
    value: '100M',
    prefix: '+',
    label: 'Site views per month',
    quote:
      'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
    name: 'Nikolaus Reisel',
    title: 'GBS Group Leader: Basic Systems and platforms',
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
  {
    customer: 'Airbus',
    hue: 196,
    value: '24,000',
    label: 'Users served by portal',
    quote:
      'Keycopter brings efficiency and autonomy to helicopter operators. By providing coherent online services with Liferay, it is easy for our customers to keep their aircraft in good condition.',
    name: 'Jérôme Chauvin',
    title: 'IM Project Manager',
  },
  {
    customer: 'Mueller, Inc.',
    hue: 264,
    value: '73',
    suffix: '%',
    label: 'Quote increase',
    quote:
      'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
    name: 'Hab Adkins',
    title: 'Corporate Technology Manager',
  },
  {
    customer: 'Jose Cuervo',
    hue: 24,
    value: '7',
    label: 'Teams unified via intranet',
    quote:
      'Our new corporate communication media needed to be effective and provide an optimal user experience, and now that was finally possible with Liferay.',
    name: 'Loria Saviñon',
    title: 'HR Manager',
  },
  {
    customer: 'MacDon',
    hue: 156,
    value: '50',
    suffix: '%',
    label: 'Increase in online transactions',
    quote:
      'It was just time for an upgrade, and now we get ecstatic reviews on the customer experience every week.',
    name: 'Derek Boonstra',
    title: 'Manager, Business Systems',
  },
]

/** `Different Teams. One Platform.` — the accordion behind each pill. */
const TEAMS: Record<
  string,
  {
    icon: ReactNode
    label: string
    title: string
    description: string
    /* `media` on a row replaces the panel's while that row is open; rows without one fall back to it. */
    items: { q: string; a: string; link?: string; media?: { src: string; alt: string } }[]
  }
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
        media: { src: aiHubClip, alt: 'AI Hub tagging and translating content' },
      },
      {
        q: 'Launch campaigns without waiting on IT',
        a: 'Build and publish pages from the same components engineering ships, so a landing page stops being a release.',
        link: 'Explore the page builder',
        media: { src: sitesClip, alt: 'A page being built and published from shared components' },
      },
      {
        q: 'Reach every visitor with the right message',
        a: 'Segment on behaviour, account and locale, then personalise any fragment on the page against those segments.',
        link: 'Explore personalization',
        media: { src: personalizationClip, alt: 'A page fragment personalised against a visitor segment' },
      },
      {
        q: 'Keep content and assets consistent across every channel',
        a: 'One content tree and one asset library feed the website, the portal, commerce and every headless surface.',
        link: 'Explore the DAM',
        media: { src: cmpClip, alt: 'One content tree and asset library feeding several channels' },
      },
      {
        q: 'Turn your site into a B2B revenue engine',
        a: 'Catalogues, negotiated pricing and self-serve reordering sit on the same content the marketing site uses.',
        link: 'Explore commerce',
        media: { src: b2bStill, alt: 'A B2B order moving through a two-step approval workflow' },
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
        media: { src: cmsClip, alt: 'The same platform running on SaaS, PaaS and self-hosted' },
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

/*
 * `Trending Now` — node `7655:15414`.
 *
 * Six resource cards: a label over a title, under an image, on the page's own ground. Titles, labels and
 * **thumbnails are the file's** — exported from the `card-image` fills rather than stood in for, which is
 * the one section where a placeholder was doing real damage: the cards are mostly picture, so six flat
 * gradient panels said nothing about whether the section works.
 *
 * Each is centre-cropped to the card's 3:2 and saved at 820x547 — twice the ~410px the card renders at —
 * as JPEG at quality 82. 281KB for the six.
 *
 * **They are photography and illustration from the design, not design-system assets.** Four are stock
 * photographs, and committing them here puts them in a public repository. Recorded in README.md under
 * *What is committed, and what is not*, which until now said this section's thumbnails were deliberately
 * left out for exactly that reason.
 */
const TRENDING = [
  {
    tag: 'Guide',
    title: 'What is AI Transformation?',
    image: trendingAi,
    alt: 'Hands at a laptop keyboard under a blue overlay of circuitry and data',
  },
  {
    tag: 'Blog',
    title: 'What is the Purpose of a Knowledge Management System?',
    image: trendingKms,
    alt: 'Flat illustration of a woman beside a lightbulb, a video player and message cards',
  },
  {
    tag: 'Blog',
    title: 'What is Low-Code and No-Code?',
    image: trendingLowCode,
    alt: 'Someone at a monitor reading a screen of code',
  },
  {
    tag: 'Article',
    title: 'What is Digital Strategy?',
    image: trendingStrategy,
    alt: 'Two colleagues at a whiteboard covered in sticky notes',
  },
  {
    tag: 'Blog',
    title: '16 Awesome Web Portal Examples',
    image: trendingPortals,
    alt: 'A 3D render of a lit platform ringed by Create, Find, Share, Trust and Improve tiles',
  },
  {
    tag: 'Blog',
    title: 'What Is B2B Ecommerce?',
    image: trendingB2b,
    alt: 'A laptop keyboard from above with a hand resting on it',
  },
]


const RESEARCH = [
  { tag: 'CMS Trends', title: '2026 Liferay Digital Content Management Report' },
  { tag: 'Agentic AI', title: 'Liferay 2026 Agentic AI Adoption and Governance Report' },
  { tag: 'Digital Trust', title: 'Liferay 2026 Broken Trust Report' },
]


/* ------------------------------------------------------------------ the page */

/**
 * `heroBackground="bubble"` swaps the hero's production video (`bubble_center.webm`) for the `Bubble`
 * canvas component — an exploration of it as a candidate background, alongside Hero's own `drawn` SVG
 * prototype. It does not touch `Hero.tsx`: `background="none"` skips Hero's own gradient/video layer,
 * and `Bubble` is layered behind it in a plain positioned wrapper.
 *
 * The hero is given a transparent background so the mesh shows, and `Bubble` is handed the page's own
 * background token as `surfaceColor` — which is what lets everything outside its bubbles paint the page's
 * own colour, so they read as floating on it without the component being transparent or blending.
 */
function HomePage({
  heroBackground = 'video',
  bubbleProps,
}: {
  heroBackground?: 'video' | 'bubble'
  bubbleProps?: BubbleProps
} = {}) {
  const reducedMotion = useReducedMotion()
  const bubbleBackground = heroBackground === 'bubble'
  const heroBackgroundProps = bubbleBackground
    ? { background: 'none' as const, style: { backgroundColor: 'transparent' } }
    : { background: 'full' as const, video: bubbleFull, videoLight: bubbleFullLight }
  const [goalTab, setGoalTab] = useState('marketers')
  const [teamTab, setTeamTab] = useState('marketers')
  const [capability, setCapability] = useState('enterprise-websites')
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [openRow, setOpenRow] = useState<string | null>(null)

  const team = TEAMS[teamTab]
  /*
   * Which accordion row is open, so the media can follow it.
   *
   * The accordion keeps ownership of its own value — taking it over is what turns its autoplay off, and
   * the panel opening itself row by row is the behaviour of this section — so it reports through
   * `onChange`, including its automatic advances, and this is a mirror rather than the source.
   */
  const teamRow = TEAMS[teamTab].items.find((item) => item.q === openRow) ?? TEAMS[teamTab].items[0]
  const teamMedia = teamRow.media
  const panel = CAPABILITIES.find((c) => c.value === capability) ?? CAPABILITIES[3]

  return (
    <>
      <SiteHeader />

      {/* 1. Left Hero — the solution finder above the fold, the form in the content column. */}
      <Box pos="relative" style={{ overflow: 'hidden' }}>
        {bubbleBackground ? (
          /*
           * The whole hero, which is the same ground `bubble_center.webm` covers — this is standing in
           * for that file, so anything less leaves a band of bare page above it where the video would
           * have reached. A fixed height was tried first and is what put that band there.
           *
           * The cost is that the bubbles are sized and placed against a box whose height moves with the
           * hero's content, so `bubbleScale` is set against the hero as it actually renders rather than
           * against a number chosen here.
           */
          <Box pos="absolute" inset={0} style={{ zIndex: 0 }}>
            <Bubble {...bubbleProps} />
          </Box>
        ) : null}
        <Hero
          {...heroBackgroundProps}
          entrance
        banner={
          <Card
            surface="glass"
            padding="none"
            radius="pill"
            w="100%"
            maw={1000}
          >
            <Group gap={16} px={16} py={8} align="center">
              {/*
               * 18px, a literal: the typography scale has no 18px step — `Paragraph/Large` is 21 and
               * the one below it is 16 — which is the same gap the Accordion's condensed label records.
               */}
              <Text fz={18} fw={600} pl={8} flex={{ base: '1 1 100%', md: '1 1 auto' }}>
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
            <GradientText>Convert, Scale and Grow</GradientText>
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
              {/*
               * The real rating, not four solid stars and a grey one — 4.6 is four and three fifths, and
               * the figure beside it already says so.
               */}
              <StarRating value={4.6} />
            </Group>
            <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
              Source: Gartner Peer Insights&trade;
            </Text>
            <Group gap={8} wrap="wrap">
              {['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'].map((mark) => (
                <Label key={mark} variant="glass" size="sm" radius="sm">
                  {mark}
                </Label>
              ))}
            </Group>
          </>
        }
        media={
          /*
           * The animation carries an alpha channel, so it is not a picture in a frame — the corners
           * are transparent and the middle is about 70% opaque. `.heroMedia` blurs the bubble behind
           * it; see components.module.css.
           *
           * Under `prefers-reduced-motion` it still renders, paused on its first frame: the content is
           * the point and removing it would leave the hero half empty. `preload="auto"` so there *is*
           * a first frame to show — a posterless video that has not buffered draws nothing.
           */
          <video
            src={heroAnimation}
            poster={heroMedia}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
          />
        }
        />
      </Box>

      {/* 2. Logos scrolling section — a 64px logo row directly under the hero. */}
      <Section reveal spacing="none" pt={24}>
        <Marquee label="Customers using Liferay" monochrome size="lg">
          {CUSTOMERS.map((name) => (
            <Wordmark key={name} name={name} />
          ))}
        </Marquee>
      </Section>

      {/* 3. Audience Specific Goals — the title and its pills share one row. */}
      <Section
        reveal
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
              /* `content` so the image reaches the card's edges; `all` framed every thumbnail in card. */
              padding="content"
              image={<Image src={goal.image} alt={goal.alt} ratio="3:2" />}
              title={goal.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 4. CAROUSEL — customer stories, arrows rather than dots, and the row bleeds off both edges. */}
      <Section
        reveal
        bleed
        title={
          <SectionTitle
            align="center"
            title={
              <>
                <GradientText animate>1,200+ Enterprises</GradientText> Move the Needle With Liferay
              </>
            }
          />
        }
      >
        <Carousel label="Customer stories" gutter={80} indicators="none" arrows>
          {STORIES.map((story) => (
            <Card
              key={story.customer}
              image={
                <Image
                  src={CUSTOMER_THUMBNAILS[story.customer] ?? logoTile(story.customer, story.hue)}
                  alt={
                    CUSTOMER_THUMBNAILS[story.customer]
                      ? customerThumbnailAlt(story.customer)
                      : story.customer
                  }
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
        reveal
        title={
          <SectionTitle
            align="center"
            title={
              <>
                Different Teams. <GradientText animate>One Platform.</GradientText>
              </>
            }
            description="Whether you drive campaigns, build infrastructure, or grow partnerships – Liferay empowers your success."
          />
        }
      >
        {/*
          * 24, not 40. The file puts `Tabs Pill Menu` ending at 248 and `Content` starting at 272 in
          * both tabbed sections; this one had 40 until porting the page to data caught the mismatch.
          */}
        <Stack gap={24} align="center" w="100%">
          {/* Same explicit width as the goals row, and for the same reason. 776 is the drawn width. */}
          <Tabs
            variant="pills"
            w={{ base: '100%', md: 776 }}
            value={teamTab}
            onChange={(v) => {
                  setTeamTab(v ?? 'marketers')
                  /* A new panel has different rows; the old one would match nothing. */
                  setOpenRow(null)
                }}
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
            /* The accordion grows and shrinks as rows open; the picture stays where it can be seen. */
            stickyMedia
            order={3}
            title={team.title}
            description={team.description}
            media={
              /* The picture and its figures as one panel — see `.mediaStats`. */
              <div className={classes.mediaStats}>
                {/*
                 * `CrossfadeMedia` rather than `Image`: a row's media is a clip, so it needs the video path,
                 * the poster fallback for a missing file, and the held first frame under
                 * `prefers-reduced-motion`, and fades between rows rather than cutting.
                 */}
                <CrossfadeMedia
                  media={
                    teamMedia ?? {
                      src: teamsMedia,
                      alt: 'Two colleagues building an AI agent in Liferay',
                      ratio: '3:2',
                    }
                  }
                />
                {/*
                 * Keyed by the tab, so the figures count again when the panel changes.
                 *
                 * `CountUp` runs on mount and holds; a `key` is how you say "this is a different thing
                 * now", which is exactly the condition a replay wants. When these numbers differ per
                 * team — they are the same three today — the count will be counting to a new figure
                 * rather than repeating the last one, which is the point of replaying it at all.
                 */}
                <StatBar key={teamTab} align="center">
                  <Stat value={<CountUp value={56} />} label="Websites launched" align="center" />
                  <Stat value={<CountUp value={24} />} label="Industries served" align="center" />
                  <Stat value={<CountUp value={77} />} label="Countries served" align="center" />
                </StatBar>
              </div>
            }
          >
            {/* The panel opens itself, row by row — see the note in `PageRenderer`. */}
            <Accordion
              size="lg"
              order={4}
              autoplay
              /* The panel is showing what the platform does; the open row is what it is saying. */
              spotlight
              defaultValue={team.items[0].q}
              onChange={(value) => setOpenRow(value)}
            >
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
        reveal
        gap={24}
        title={
          <SectionTitle
            title={
              <>
                Designed for Your Industry. <GradientText animate>Built for Growth.</GradientText>
              </>
            }
          />
        }
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
          /*
           * Its links do the work — the same call `PageRenderer` already makes for this section.
           *
           * A `glass` card is a target by default, which is right where the whole surface goes one
           * place. This one carries two links and a stat row, so a card-wide target would be a control
           * wrapped around two other controls with no single destination of its own to offer.
           */
          interactive={false}
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

      {/*
        7. Everything You Need in One Platform — the product map.

        Drawn rather than exported: this was `platform-diagram.png` at 1000×806, and is now the
        `CapabilityMap` component, so the sixteen products are real tiles with real links, real labels
        and a keyboard path through them. The section names sit outside the tiles on their own leader
        lines — `Homepage Redesign` node `8144:21713` — which is why this section bleeds: that
        arrangement is 8.2 tiles across and a 1280 column would pay for the width in card size.
        `maxHeight` is what keeps the whole figure inside the window.
      */}
      <Section
        reveal
        bleed
        gap={40}
        title={
          <SectionTitle
            align="center"
            title={
              <>
                Everything You Need in <GradientText animate>One Platform</GradientText>
              </>
            }
          />
        }
      >
        <CapabilityMap
          clusters={PRODUCT_CLUSTERS}
          names="outside"
          hubIcon={<IconGlassDXP />}
          hubLabel="DXP"
          maxHeight={PRODUCT_MAP_MAX_HEIGHT}
        />
      </Section>

      {/* 8. Every Capability Your Enterprise Needs — the six-cell segmented bar. */}
      <Section
        reveal
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
       * 9. Integrations — a scrolling row of vendor lockups on a drifting mesh.
       *
       * **A deliberate divergence from the file.** Figma's `Type=Integrations Section` is a static
       * `List` of 64px glass tiles at gap 16, not a marquee; the row here scrolls instead, because a
       * fixed row can only ever show as many integrations as fit and the point of the section is that
       * there are more than that. `Marquee` is the library's existing strip — measured speed, edge fade,
       * and the pause button WCAG 2.2.2 asks for — so this is a composition rather than new motion.
       *
       * The logos are invented. Real vendor marks are other companies' trademarks and are not committed
       * here, the same rule the customer marquee follows; `vendor-logos.tsx` says so at more length.
       */}
      <Section
        reveal
        bleed
        gap={32}
        title={
          <SectionTitle
            align="center"
            title={
              <>
                Extend Your platform. <GradientText animate>Integrate without limits.</GradientText>
              </>
            }
            description="Liferay connects flexibly with the platforms and vendors your team relies on every day."
          />
        }
        /*
         * The call to action goes in the section's own footer rather than the title's slot — Figma's
         * `Call to Action` cell, which the Section already centres. Below the strip it reads as the
         * thing to do *after* looking at the logos, which is the order the section actually asks for.
         */
        footer={
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            Explore integrations
          </Button>
        }
      >
        <Marquee
          label="Integrations"
          gap={16}
          logoWidth={64}
          size="lg"
          speed={38}
          /*
           * The strip carries its own fade, so the tiles dissolve at the same edges the mesh does rather
           * than sliding out from under a hard cut.
           */
          fade
          fadeWidth={120}
        >
          {/*
           * The mark inside the glass tile, at half its width. The `alt` is the only thing announcing
           * which vendor this is, since there is no text in the row.
           */}
          {VENDOR_LOGOS.map((vendor) => (
            <Card key={vendor.name} surface="glass" padding="none" w={64} h={64}>
              <Group justify="center" align="center" h="100%">
                <img
                  src={vendor.src}
                  alt={vendor.name}
                  width={32}
                  height={32}
                  loading="lazy"
                  draggable={false}
                  style={{ display: 'block' }}
                />
              </Group>
            </Card>
          ))}
        </Marquee>
      </Section>

      {/*
       * 10. Trending Now — node `7655:15414`. Six resource cards: `Type=Resources`, which is a link
       * with no fill, so the image sits on the page's own ground rather than inside a panel and the
       * label and title sit under it with no inset of their own. It used to be six glass cards with a
       * mail icon reading `Card Title` and a line of lorem, because the cell had not been drawn yet.
       */}
      <Section
        reveal
        title={
          <SectionTitle title="Trending Now" description="Latest insights and resources from Liferay." />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {TRENDING.map((item) => (
            <Card
              key={item.title}
              component="a"
              href="#"
              interactive
              surface="none"
              padding="none"
              image={
                <Image src={item.image} alt={item.alt} ratio="3:2" radius="sm" />
              }
              top={
                /*
                 * Gradient, always: the tag is the one piece of colour on a card that is otherwise a
                 * photograph and two lines of type, and `glass` on top of a photograph is whatever the
                 * photograph happens to be underneath it.
                 */
                <Label variant="gradient" size="sm">
                  {item.tag}
                </Label>
              }
              title={item.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 11. Our Latest Research & Data — a tag over a title, and nothing else. */}
      <Section
        reveal
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
                <Label variant="gradient" size="md">
                  {report.tag}
                </Label>
              }
              title={report.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 12. LRDC footer — the action band, the disclaimers, the numbers, and the link grid. */}
      <SiteFooter />
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

/**
 * Exploration only — not what ships. The hero's production video (`bubble_center.webm`) is swapped for
 * `Bubble`, sitting where Hero's own `drawn` SVG-wave prototype would otherwise go. Nothing in
 * `Hero.tsx` changes: it sits behind a `background="none"` Hero in a plain positioned wrapper here.
 *
 * One canvas, and no blending with the page at all. Everything outside the two bubbles is painted in
 * `surfaceColor` — the page-background token — so they read as floating on the page while the component
 * stays opaque throughout. Because that token resolves against the canvas, the plate follows the colour
 * scheme without the story having to know which one is on.
 *
 * Every prop is on the Controls panel, grouped as **Bubbles** / **Mesh** / **Glow** / **Cursor** — see
 * the component's own docs page for which prop is worth reaching for first.
 *
 * `frame: { padding: 0 }` because this one is judged on whether it reaches the viewport's edges.
 *
 * Both schemes are set here: `color`/`hotColor`/`glowColor` for the dark canvas and the `*Light` trio for
 * the light one. The component picks between them from the luminance of the resolved `surfaceColor`, so
 * the story never has to know which scheme is on.
 */
export const BubbleBackground: Story = {
  parameters: { frame: { fullBleed: true, padding: 0 } },
  /*
   * Tuned for the hero rather than left on the component's defaults — though neither `bubbleScale` nor
   * `bubbleSpread` is among the changes, which is the point of both being fractions of the height: the
   * component's own values already put the bubbles at the right size and the right distance apart here,
   * in a frame nearly twice as wide as its own.
   *
   * What does change is `bubbleY`, pulled higher so their lower edges sweep across at about two thirds
   * down, leaving the copy on colour and the foot of the hero on bare page.
   */
  args: {
    ...BUBBLE_DEFAULTS,
    bubbleY: 0.1,
    bubbleMorph: 0.22,
    bubbleWander: 0.04,
    edgeSoftness: 0.07,
    /*
     * The grounds sit almost on the page's own colour in both schemes, so where the colour thins out the
     * bubbles fall away into the page rather than ending on a visible disc. All the colour comes from
     * the masses inside them.
     */
    color: '#0a0a1e',
    hotColor: '#7c4dff',
    /* The brand blue against the violet, which is the pair the hero's own gradient headline runs. */
    accentColor: '#2f6bff',
    colorLight: '#f7f6fd',
    /*
     * Much paler than the dark canvas's lit colour, and not by taste. The two schemes put *opposite*
     * text on this: light copy on the dark canvas gains contrast as the mesh deepens, dark copy on the
     * light one loses it. A violet that reads as depth behind white text is a wash behind black text.
     */
    hotColorLight: '#c4b5fd',
    accentColorLight: '#a9c9ff',
    richness: 0.85,
    spectralDrift: 18,
    saturation: 1.12,
    glow: 0.7,
    glowOpacity: 0.8,
    glowColor: '#c9a6ff',
    glowColorLight: '#a78bfa',
    glowWidth: 0.14,
    glowOffset: 0.06,
    glowArc: 0.4,
  },
  argTypes: BUBBLE_ARG_TYPES,
  render: (args) => <HomePage heroBackground="bubble" bubbleProps={args as BubbleProps} />,
}
