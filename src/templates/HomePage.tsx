/*
 * The Home page's markup.
 *
 * Lifted out of `Home.stories.tsx` when the page gained a second locale. Everything here is layout,
 * icons and footage; every string comes from the `HomeContent` object passed in — `home-content.ts`
 * for the global page, `home-content.ja.ts` for Japan. Pictures and clips are zipped in **by
 * position**, so a locale supplies copy and nothing else.
 */

import { useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import type { ComponentProps, ReactNode } from 'react'
import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Bubble } from '../components/Bubble'
import type { BubbleProps } from '../components/Bubble'
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
import { HOME_CONTENT, type HomeContent, type SplitTitle } from './home-content'
import type { FooterContent } from './footer-content'
import type { NavMenu } from './site-nav'
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
 * The analyst badges in the hero.
 *
 * Third-party marks, and the one class of other-people's-logo this repository *does* commit: unlike the
 * customer and vendor logos, these are awarded to Liferay and supplied by G2 and Gartner for exactly
 * this use, so a stand-in would be saying something untrue rather than holding a place.
 */
import g2Badge from '../../assets/home/badges/g2-leader-enterprise-fall-2026.png'
import gartnerBadge from '../../assets/home/badges/gartner-peer-insights-customers-choice-2026-white.png'
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

/* ------------------------------------------------------- the artwork, keyed to the copy's order */

/** The four goal thumbnails, in the order the four cards on each tab are written. */
const GOAL_IMAGES: Record<string, string[]> = {
  marketers: [goal1, goal2, goal3, goal4],
  developers: [goal3, goal2, goal4, goal1],
}

const GOAL_TAB_ICONS: Record<string, ReactNode> = {
  marketers: <IconPresentation1 />,
  developers: <IconBracketsAngle />,
}

/**
 * A teams row's clip, by tab and row index. A row with no entry keeps the panel's own still — which
 * is the Marketers B2B row and every IT row but the second, exactly as the export arrived.
 */
const TEAM_MEDIA: Record<string, Record<number, { src: string; alt: string }>> = {
  marketers: {
    0: { src: aiHubClip, alt: 'AI Hub tagging and translating content' },
    1: { src: sitesClip, alt: 'A page being built and published from shared components' },
    2: { src: personalizationClip, alt: 'A page fragment personalised against a visitor segment' },
    3: { src: cmpClip, alt: 'One content tree and asset library feeding several channels' },
    4: { src: b2bStill, alt: 'A B2B order moving through a two-step approval workflow' },
  },
  it: {
    1: { src: cmsClip, alt: 'The same platform running on SaaS, PaaS and self-hosted' },
  },
  partners: {},
}

const TEAM_ICONS: Record<string, ReactNode> = {
  marketers: <IconUser1 />,
  it: <IconUser1 />,
  partners: <IconUser1 />,
}

/** The segmented bar's glass hero and its pill icon, by the panel's stable `value`. */
const CAPABILITY_ICONS: Record<string, { glass: ReactNode; icon: ReactNode }> = {
  'customer-portals': {
    glass: <IconGlassCustomerPortals width={40} height={40} />,
    icon: <IconUser1 />,
  },
  'supplier-portals': {
    glass: <IconGlassSupplierPortals width={40} height={40} />,
    icon: <IconMonitor />,
  },
  'partner-portals': {
    glass: <IconGlassPartnerPortals width={40} height={40} />,
    icon: <IconDepartment />,
  },
  'enterprise-websites': {
    glass: <IconGlassEnterpriseWebsite4 width={40} height={40} />,
    icon: <IconBuilding2 />,
  },
  intranets: { glass: <IconGlassIntranets width={40} height={40} />, icon: <IconGroup /> },
  'digital-commerce': {
    glass: <IconGlassCommerce width={40} height={40} />,
    icon: <IconShoppingCart1 />,
  },
}

/**
 * The hero's analyst badges, in the order the two are written in the content.
 *
 * `plate` marks a badge whose artwork is white-only and so needs a dark ground under it on the light
 * canvas — see `.heroBadgePlate`. Gartner supplies a dark variant of this mark; when that file replaces
 * this one, the flag comes off.
 */
const HERO_BADGES = [
  { src: g2Badge, plate: false },
  { src: gartnerBadge, plate: true },
]

/** The six Trending thumbnails, in the order the six cards are written. */
const TRENDING_IMAGES = [
  trendingAi,
  trendingKms,
  trendingLowCode,
  trendingStrategy,
  trendingPortals,
  trendingB2b,
]

/* ------------------------------------------------------------------------------- small helpers */

/**
 * A heading, with the gradient on the clause the design gradients.
 *
 * `spaced` is off for Japanese. Japanese sets no space between clauses — a heading is one unbroken
 * run, and its punctuation already carries the pause — so joining the parts with a space the way
 * English needs would open a visible gap mid-sentence.
 */
function Split({
  title,
  animate = true,
  spaced = true,
}: {
  title: SplitTitle
  animate?: boolean
  spaced?: boolean
}) {
  const gap = spaced ? ' ' : ''
  return (
    <>
      {title.lead ? <>{title.lead}{gap}</> : null}
      {title.accent ? <GradientText animate={animate}>{title.accent}</GradientText> : null}
      {title.trail ? <>{gap}{title.trail}</> : null}
    </>
  )
}

/* ------------------------------------------------------------------------------------ the page */

export interface HomePageProps {
  /**
   * `heroBackground="bubble"` swaps the hero's production video (`bubble_center.webm`) for the
   * `Bubble` canvas component — an exploration of it as a candidate background, alongside Hero's own
   * `drawn` SVG prototype. It does not touch `Hero.tsx`: `background="none"` skips Hero's own
   * gradient/video layer, and `Bubble` is layered behind it in a plain positioned wrapper.
   */
  heroBackground?: 'video' | 'bubble'
  bubbleProps?: BubbleProps
  /** The page's copy. Defaults to the global English page. */
  content?: HomeContent
  /** The header's menus, when this locale has its own. */
  nav?: NavMenu[]
  /** The bar's right-hand cluster, when this locale has its own — see `siteActions`. */
  navActions?: ReactNode
  /** The foot of the mobile drawer — language, log-in, call to action. */
  navDrawerControls?: NonNullable<ComponentProps<typeof SiteHeader>>['drawerControls']
  /** The footer's copy, when this locale has its own. */
  footer?: FooterContent
  /** The product map's sixteen tiles, when this locale has its own labels for them. */
  clusters?: typeof PRODUCT_CLUSTERS
}

export function HomePage({
  heroBackground = 'video',
  bubbleProps,
  content = HOME_CONTENT,
  nav,
  navActions,
  navDrawerControls,
  footer,
  clusters = PRODUCT_CLUSTERS,
}: HomePageProps = {}) {
  const reducedMotion = useReducedMotion()
  /* Japanese sets no inter-clause space; see `Split`. */
  const spaced = !content.locale.startsWith('ja')
  const bubbleBackground = heroBackground === 'bubble'
  const heroBackgroundProps = bubbleBackground
    ? { background: 'none' as const, style: { backgroundColor: 'transparent' } }
    : { background: 'full' as const, video: bubbleFull, videoLight: bubbleFullLight }

  const goalTabs = content.goals.tabs
  const teamTabs = Object.keys(content.teams.panels)
  const [goalTab, setGoalTab] = useState(goalTabs[0].value)
  const [teamTab, setTeamTab] = useState(teamTabs[0])
  const [capability, setCapability] = useState('enterprise-websites')
  const [industry, setIndustry] = useState(content.industries.panels[0].label)
  const [openRow, setOpenRow] = useState<string | null>(null)

  const team = content.teams.panels[teamTab]
  /*
   * Which accordion row is open, so the media can follow it.
   *
   * The accordion keeps ownership of its own value — taking it over is what turns its autoplay off, and
   * the panel opening itself row by row is the behaviour of this section — so it reports through
   * `onChange`, including its automatic advances, and this is a mirror rather than the source.
   */
  const teamRowIndex = Math.max(
    0,
    team.items.findIndex((item) => item.q === openRow),
  )
  const teamMedia = TEAM_MEDIA[teamTab]?.[teamRowIndex]
  const panel =
    content.capabilities.panels.find((c) => c.value === capability) ?? content.capabilities.panels[3]
  const industryPanel =
    content.industries.panels.find((p) => p.label === industry) ?? content.industries.panels[0]

  return (
    <div lang={content.locale}>
      <SiteHeader menus={nav} actions={navActions} drawerControls={navDrawerControls} />

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
            <Card surface="glass" padding="none" radius="pill" w="100%" maw={1000}>
              {/*
               * The row gives space back from the selects rather than wrapping.
               *
               * Figma draws this at 1000 wide with a 200 and a 320 select, and in English the four
               * children come to exactly 1000. Nothing in that arrangement is slack, so a label even
               * slightly longer than `Explore customized solutions` pushes the button onto a second
               * row — which is what Japanese does: `カスタマイズされたソリューションを見る` measures 416
               * against the English 289, and the bar became two rows tall.
               *
               * So the selects are bases that shrink but do not grow — `0 1 200px` and `0 1 320px`,
               * which holds them at the drawn widths whenever the row fits and takes the difference out
               * of them when it does not. The label is the opposite, `1 0 auto`: it absorbs the slack in
               * English, exactly as it did before, and in Japanese it cannot be squeezed, because a
               * label that has to be read in full is the wrong place to find the missing pixels. The
               * button never gives: it is the target.
               */}
              <div className={classes.heroFinderRow}>
                {/*
                 * 18px, a literal: the typography scale has no 18px step — `Paragraph/Large` is 21 and
                 * the one below it is 16 — which is the same gap the Accordion's condensed label records.
                 */}
                <Text fz={18} fw={600} pl={8} flex={{ base: '1 1 100%', md: '1 0 auto' }}>
                  {content.hero.finder.label}
                </Text>
                <Select
                  aria-label={content.hero.finder.industryLabel}
                  radius="xl"
                  flex={{ base: '1 1 100%', md: '0 1 200px' }}
                  miw={0}
                  defaultValue={content.hero.finder.industries[0].value}
                  data={content.hero.finder.industries}
                />
                <Select
                  aria-label={content.hero.finder.useCaseLabel}
                  radius="xl"
                  flex={{ base: '1 1 100%', md: '0 1 320px' }}
                  miw={0}
                  defaultValue={content.hero.finder.useCases[0].value}
                  data={content.hero.finder.useCases}
                />
                <Button
                  variant="rounded"
                  size="sm"
                  w={{ base: '100%', md: 'auto' }}
                  /*
                   * `0 0 auto`, or the row takes its missing pixels out of the button: at 1440 the
                   * Japanese `次へ` was being squeezed until it broke across two lines inside its own
                   * pill. A two-character label has no slack to give, and it is the thing the bar exists
                   * to be clicked.
                   */
                  flex={{ base: '1 1 100%', md: '0 0 auto' }}
                  rightSection={<IconArrowRight />}
                >
                  {content.hero.finder.cta}
                </Button>
              </div>
            </Card>
          }
          title={
            <h1>
              <Split title={content.hero.title} animate={false} spaced={spaced} />
            </h1>
          }
          description={
            <p>
              {content.hero.description.lead}
              {spaced ? ' ' : ''}
              <Text span inherit fw={700} c="var(--sds-surfaces-text-primary)">
                {content.hero.description.strong}
              </Text>
            </p>
          }
          form={
            <TextInput
              aria-label={content.hero.emailLabel}
              type="email"
              placeholder={content.hero.emailPlaceholder}
              containedButton={
                <Button size="sm" rightSection={<IconArrowRight />}>
                  {content.hero.trialCta}
                </Button>
              }
            />
          }
          actions={
            <Link href="#" size="md" rightSection={<IconArrowRight />}>
              {content.hero.demoCta}
            </Link>
          }
          proof={
            <>
              <Group gap={8} wrap="nowrap">
                <Text fz={28} fw={700} lh={1}>
                  {content.hero.rating}
                </Text>
                {/*
                 * The real rating, not four solid stars and a grey one — 4.6 is four and three fifths,
                 * and the figure beside it already says so.
                 */}
                <StarRating value={Number(content.hero.rating)} />
              </Group>
              <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
                {content.hero.ratingSource}
              </Text>
              {/*
               * The awarded badges, beside the rating they come from rather than down with the
               * compliance marks: both are third-party verdicts on the product, where `SOC 2` and
               * `HIPAA` are certifications of it, and mixing the two flattens the difference.
               */}
              <div className={classes.heroBadges}>
                {content.hero.badges.map((badge, i) => (
                  <span
                    key={badge.alt}
                    className={HERO_BADGES[i].plate ? classes.heroBadgePlate : undefined}
                  >
                    <img src={HERO_BADGES[i].src} alt={badge.alt} loading="lazy" />
                  </span>
                ))}
              </div>
              <Group gap={8} wrap="wrap">
                {content.hero.marks.map((mark) => (
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
        <Marquee label={content.logos.label} monochrome size="lg">
          {content.logos.names.map((name) => (
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
            title={content.goals.title}
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
                onChange={(v) => setGoalTab(v ?? goalTabs[0].value)}
              >
                <Tabs.List grow>
                  {goalTabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value} leftSection={GOAL_TAB_ICONS[tab.value]}>
                      {tab.label}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            }
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={24}>
          {content.goals.items[goalTab].map((goal, i) => (
            <Card
              key={goal.title}
              component="a"
              href="#"
              interactive
              /* `content` so the image reaches the card's edges; `all` framed every thumbnail in card. */
              padding="content"
              image={<Image src={GOAL_IMAGES[goalTab][i]} alt={goal.alt} ratio="3:2" />}
              title={goal.title}
            />
          ))}
        </SimpleGrid>
      </Section>

      {/* 4. CAROUSEL — customer stories, arrows rather than dots, and the row bleeds off both edges. */}
      <Section
        reveal
        bleed
        title={<SectionTitle align="center" title={<Split title={content.stories.title} spaced={spaced} />} />}
      >
        <Carousel label={content.stories.label} gutter={80} indicators="none" arrows>
          {content.stories.items.map((story) => (
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
            title={<Split title={content.teams.title} spaced={spaced} />}
            description={content.teams.description}
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
              setTeamTab(v ?? teamTabs[0])
              /* A new panel has different rows; the old one would match nothing. */
              setOpenRow(null)
            }}
          >
            <Tabs.List grow>
              {teamTabs.map((value) => (
                <Tabs.Tab key={value} value={value} leftSection={TEAM_ICONS[value]}>
                  {content.teams.panels[value].label}
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
                      alt: content.teams.mediaAlt,
                      ratio: '3:2',
                    }
                  }
                />
                {/*
                 * Keyed by the tab, so the figures count again when the panel changes.
                 *
                 * `CountUp` runs on mount and holds; a `key` is how you say "this is a different thing
                 * now", which is exactly the condition a replay wants.
                 */}
                <StatBar key={teamTab} align="center">
                  {team.metrics.map((metric) => (
                    <Stat
                      key={metric.label}
                      value={<CountUp value={metric.value} />}
                      label={metric.label}
                      align="center"
                    />
                  ))}
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
        title={<SectionTitle title={<Split title={content.industries.title} spaced={spaced} />} />}
        footer={
          /*
           * `w="100%"` so the bar fills the footer row rather than being centred at its own
           * max-content width — which on a phone is 823px of tabs overflowing both gutters. At full
           * width the list scrolls, which is what the component already does under 1200.
           */
          <Tabs
            w="100%"
            value={industry}
            onChange={(v) => setIndustry(v ?? content.industries.panels[0].label)}
          >
            <Tabs.List grow>
              {content.industries.panels.map((p) => (
                <Tabs.Tab key={p.label} value={p.label}>
                  {p.label}
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
          description={industryPanel.description}
          main={
            <Stack gap={12} align="flex-start">
              <Link href="#" size="md" rightSection={<IconArrowRight />}>
                {content.industries.solutionsCta.replace('{industry}', industry)}
              </Link>
              <Link href="#" size="md" rightSection={<IconArrowRight />}>
                {content.industries.transformationCta.replace('{industry}', industry)}
              </Link>
            </Stack>
          }
          secondary={
            <StatBar>
              {industryPanel.metrics.map((metric) => {
                const [figure, ...rest] = metric.value.split(/(?=[^\d,.])/)
                return (
                  <Stat
                    key={metric.label}
                    value={
                      <>
                        {figure}
                        {rest.length ? unit(rest.join('')) : null}
                      </>
                    }
                    label={metric.label}
                    leftSection={metric.down ? <IconArrowDown /> : undefined}
                  />
                )
              })}
            </StatBar>
          }
          image={
            <Image
              src={industryMedia}
              alt={content.industries.mediaAlt}
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
        title={<SectionTitle align="center" title={<Split title={content.platformMap.title} spaced={spaced} />} />}
      >
        <CapabilityMap
          clusters={clusters}
          names="outside"
          hubIcon={<IconGlassDXP />}
          hubLabel={content.platformMap.hubLabel}
          maxHeight={PRODUCT_MAP_MAX_HEIGHT}
        />
      </Section>

      {/* 8. Every Capability Your Enterprise Needs — the six-cell segmented bar. */}
      <Section
        reveal
        title={<SectionTitle align="center" title={content.capabilities.title} />}
      >
        <Stack gap={24} w="100%">
          <Tabs
            variant="pills"
            value={capability}
            onChange={(v) => setCapability(v ?? 'enterprise-websites')}
          >
            <Tabs.List grow>
              {content.capabilities.panels.map((c) => (
                <Tabs.Tab key={c.value} value={c.value} leftSection={CAPABILITY_ICONS[c.value].icon}>
                  {c.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          <ContentMedia
            mediaSide="right"
            order={3}
            eyebrow={CAPABILITY_ICONS[panel.value].glass}
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
                alt={content.capabilities.mediaAlt}
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
            title={<Split title={content.integrations.title} spaced={spaced} />}
            description={content.integrations.description}
          />
        }
        /*
         * The call to action goes in the section's own footer rather than the title's slot — Figma's
         * `Call to Action` cell, which the Section already centres. Below the strip it reads as the
         * thing to do *after* looking at the logos, which is the order the section actually asks for.
         */
        footer={
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            {content.integrations.cta}
          </Button>
        }
      >
        <Marquee
          label={content.integrations.label}
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
       * label and title sit under it with no inset of their own.
       */}
      <Section
        reveal
        title={
          <SectionTitle title={content.trending.title} description={content.trending.description} />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {content.trending.items.map((item, i) => (
            <Card
              key={item.title}
              component="a"
              href="#"
              interactive
              surface="none"
              padding="none"
              image={<Image src={TRENDING_IMAGES[i]} alt={item.alt ?? ''} ratio="3:2" radius="sm" />}
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
          <SectionTitle title={content.research.title} description={content.research.description} />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {content.research.items.map((report) => (
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
      <SiteFooter content={footer} />
    </div>
  )
}
