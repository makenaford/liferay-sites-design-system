import { useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import type { ReactNode } from 'react'
import { Button as MantineButton, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { CapabilityMap } from '../components/CapabilityMap'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { GradientText, highlightPhrase } from '../components/GradientText'
import { Hero, type HeroMediaSource } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import bubbleFull from '../../assets/bubbles/bubble_center.webm'
import bubbleFullLight from '../../assets/bubbles/bubble_center_light.webm'
import bubbleCorner from '../../assets/bubbles/bubble_corner.webm'
import bubbleCornerLight from '../../assets/bubbles/bubble_corner_light.webm'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section as SDSSection, SectionTitle, type SectionProps } from '../components/Section'
import { Stat, StatBar } from '../components/Stat'
import { Tabs } from '../components/Tabs'
import { Select, TextInput } from '../components/Input'
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowRight,
  IconBracketsAngle,
  IconBuilding2,
  IconClose,
  IconDepartment,
  IconGroup,
  IconMonitor,
  IconPresentation1,
  IconGlassCommerce,
  IconGlassCustomerPortals,
  IconGlassEnterpriseWebsite4,
  IconGlassFinancialServices,
  IconGlassIntranets,
  IconGlassMail,
  IconGlassPartnerPortals,
  IconGlassAiHub,
  IconGlassAnalytics,
  IconGlassCloudNativeExperience,
  IconGlassContentManagement,
  IconGlassContentMarketingPlatform,
  IconGlassContentPerformance,
  IconGlassDXP,
  IconGlassDigitalSalesRooms,
  IconGlassIntegration,
  IconGlassLiferayDataPlatform,
  IconGlassLowCode,
  IconGlassPIM,
  IconGlassPersonalization,
  IconGlassPremiumSecurity,
  IconGlassSearch,
  IconGlassSites,
  IconGlassSupplierPortals,
  IconSearch,
  IconShoppingCart1,
  IconStarFilled,
  IconUser1,
} from '../icons'
import { PRODUCT_MAP_MAX_HEIGHT } from './product-map'
import { VENDOR_LOGOS } from './vendor-logos'
import { CUSTOMER_THUMBNAILS, customerThumbnailAlt } from './customer-thumbnails'
import { MeshBackdrop, Quotee, VendorTile, Wordmark, unit } from './shared'
import classes from '../theme/components.module.css'
import { isVideo } from './page-schema'
import type {
  CardSpec,
  GlassIconName,
  HeroSpec,
  ImageRef,
  IconName,
  PageSpec,
  PanelSpec,
  SectionSpec,
  StatSpec,
  StorySpec,
} from './page-schema'

/**
 * Renders a `PageSpec`.
 *
 * **Every measurement in this file is deliberate and belongs to a section type**, not to the page that
 * uses it: the carousel bleeds because a customer-story band bleeds, the goals grid is four columns at
 * a 32px gap because that is what `Type=Card Grid` is. None of it reaches the data. That is the whole
 * argument — see `page-schema.ts`.
 *
 * The interactions are real, not simulated. A tab bar here is the library's `Tabs`, so it focuses,
 * takes arrow keys and swaps its panel exactly as it will in production.
 */

const ICONS: Record<IconName, ReactNode> = {
  'arrow-right': <IconArrowRight />,
  'arrow-down': <IconArrowDown />,
  'brackets-angle': <IconBracketsAngle />,
  presentation: <IconPresentation1 />,
  user: <IconUser1 />,
  monitor: <IconMonitor />,
  department: <IconDepartment />,
  building: <IconBuilding2 />,
  group: <IconGroup />,
  cart: <IconShoppingCart1 />,
  search: <IconSearch />,
  close: <IconClose />,
}

const GLASS: Record<GlassIconName, (size: number) => ReactNode> = {
  'financial-services': (s) => <IconGlassFinancialServices width={s} height={s} />,
  'enterprise-websites': (s) => <IconGlassEnterpriseWebsite4 width={s} height={s} />,
  'customer-portals': (s) => <IconGlassCustomerPortals width={s} height={s} />,
  'supplier-portals': (s) => <IconGlassSupplierPortals width={s} height={s} />,
  'partner-portals': (s) => <IconGlassPartnerPortals width={s} height={s} />,
  intranets: (s) => <IconGlassIntranets width={s} height={s} />,
  commerce: (s) => <IconGlassCommerce width={s} height={s} />,
  mail: (s) => <IconGlassMail width={s} height={s} />,
  search: (s) => <IconGlassSearch width={s} height={s} />,
  sites: (s) => <IconGlassSites width={s} height={s} />,
  dxp: (s) => <IconGlassDXP width={s} height={s} />,
  pim: (s) => <IconGlassPIM width={s} height={s} />,
  personalization: (s) => <IconGlassPersonalization width={s} height={s} />,
  dsr: (s) => <IconGlassDigitalSalesRooms width={s} height={s} />,
  cms: (s) => <IconGlassContentManagement width={s} height={s} />,
  cmp: (s) => <IconGlassContentMarketingPlatform width={s} height={s} />,
  'content-performance': (s) => <IconGlassContentPerformance width={s} height={s} />,
  ldp: (s) => <IconGlassLiferayDataPlatform width={s} height={s} />,
  'ai-hub': (s) => <IconGlassAiHub width={s} height={s} />,
  analytics: (s) => <IconGlassAnalytics width={s} height={s} />,
  'cloud-native': (s) => <IconGlassCloudNativeExperience width={s} height={s} />,
  security: (s) => <IconGlassPremiumSecurity width={s} height={s} />,
  'low-code': (s) => <IconGlassLowCode width={s} height={s} />,
  integration: (s) => <IconGlassIntegration width={s} height={s} />,
}

/** A figure with its unit tight against it, and the arrow the file draws on a fall. */
function renderStat(stat: StatSpec, align?: 'center') {
  return (
    <Stat
      key={stat.label}
      align={align}
      value={
        <>
          {stat.prefix ? unit(stat.prefix) : null}
          {stat.value}
          {stat.suffix ? unit(stat.suffix) : null}
        </>
      }
      label={stat.label}
      /* A win points up regardless of which way the number went; see `sentiment` in the schema. */
      leftSection={
        stat.sentiment === 'negative' ? (
          <IconArrowDown />
        ) : stat.sentiment === 'positive' ? (
          <IconArrowUp />
        ) : undefined
      }
    />
  )
}

/* ------------------------------------------------------------------ the hero */

/**
 * The hero's media column.
 *
 * A video here is not a picture in a frame: the LRDC hero animation carries an alpha channel, so
 * `.heroMedia` blurs the bubble gradient behind it rather than boxing it in. Under
 * `prefers-reduced-motion` it still renders, paused on its first frame — the content is the point, and
 * dropping it would leave the hero half empty.
 */
function HeroMedia({ media }: { media: ImageRef }) {
  const reducedMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)

  /*
   * Footage lives in the git-ignored `media/` folder, so "the file is not there" is the *normal* case
   * on a fresh clone and on the deployed Storybook — not an edge case. Falling back to the still keeps
   * the hero a hero instead of an empty column.
   */
  const showStill = !isVideo(media.src) || (failed && media.poster)

  if (showStill) {
    return (
      <Image
        src={failed ? media.poster! : media.src}
        alt={media.alt}
        ratio={media.ratio ?? '4:3'}
        radius="md"
      />
    )
  }

  return (
    <video
      src={media.src}
      poster={media.poster}
      autoPlay={!reducedMotion}
      muted
      loop
      playsInline
      /* A posterless video that has not buffered draws nothing, so there must be a first frame. */
      preload="auto"
      onError={() => setFailed(true)}
      aria-hidden
      tabIndex={-1}
    />
  )
}

function renderHero(hero: HeroSpec, bubble?: BubbleOverride) {
  const background = hero.background ?? 'corner'

  return (
    <Hero
      /*
       * The bubble that goes with the background — both exports of it, since each canvas has its own
       * and the hero picks between them. A page says which shape it wants; which files those are is not
       * a page's business.
       */
      background={background}
      drawn={bubble?.css || undefined}
      video={bubble?.video ?? (background === 'full' ? bubbleFull : bubbleCorner)}
      videoLight={bubble?.videoLight ?? (background === 'full' ? bubbleFullLight : bubbleCornerLight)}
      banner={hero.banner ? <SolutionFinder banner={hero.banner} /> : undefined}
      /*
       * The page's own arrival. A rendered page is a marketing page by definition — it is what this
       * renderer is for — so the hero's entrance is on here rather than left to each spec to remember,
       * the same way sections carry their reveal.
       */
      entrance
      title={
        <h1>
          {hero.title.text}
          {hero.title.highlight ? (
            <>
              {' '}
              <GradientText>{hero.title.highlight}</GradientText>
            </>
          ) : null}
        </h1>
      }
      description={
        <p>
          {hero.description.text}
          {hero.description.emphasis ? (
            <>
              {' '}
              <Text span inherit fw={700} c="var(--sds-surfaces-text-primary)">
                {hero.description.emphasis}
              </Text>
            </>
          ) : null}
        </p>
      }
      form={
        hero.form ? (
          <TextInput
            aria-label="Work email"
            type="email"
            placeholder={hero.form.placeholder}
            containedButton={
              /* Small, so the label and padding suit the 32px the field's 8px inset leaves. */
              <Button size="sm" rightSection={<IconArrowRight />}>
                {hero.form.submit}
              </Button>
            }
          />
        ) : undefined
      }
      actions={
        hero.buttons?.length || hero.action ? (
          <>
            {hero.buttons?.map((button) => (
              /*
               * Mantine's `Button` rather than the library's, on its own advice: the wrapper is
               * deliberately non-polymorphic, and a hero CTA has to be an anchor. The theme keys on
               * `Button`, so the appearance is identical either way.
               */
              <MantineButton
                key={button.label}
                component="a"
                href={button.href}
                /* The file draws Medium in every hero, so this is the type's, not the page's. */
                size="md"
                variant={button.variant === 'outline' ? 'outline' : 'filled'}
              >
                {button.label}
              </MantineButton>
            ))}
            {hero.action ? (
              <Link href={hero.action.href} size="md" rightSection={<IconArrowRight />}>
                {hero.action.label}
              </Link>
            ) : null}
          </>
        ) : undefined
      }
      proof={hero.proof ? renderProof(hero.proof) : undefined}
      media={hero.media ? <HeroMedia media={hero.media} /> : undefined}
    />
  )
}

function renderProof(proof: NonNullable<HeroSpec['proof']>) {
  return (
    <>
      {proof.rating ? (
        <>
          <Group gap={8} wrap="nowrap">
            <Text fz={28} fw={700} lh={1}>
              {proof.rating.score}
            </Text>
            <Group gap={0} aria-hidden>
              {Array.from({ length: proof.rating.outOf }, (_, i) => (
                <IconStarFilled
                  key={i}
                  width={16}
                  height={16}
                  color={
                    i < Math.round(Number(proof.rating?.score ?? 0))
                      ? 'var(--sds-surfaces-text-primary)'
                      : 'var(--sds-surfaces-text-secondary)'
                  }
                />
              ))}
            </Group>
          </Group>
          <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
            {proof.rating.source}
          </Text>
        </>
      ) : null}
      {proof.marks?.length ? (
        <Group gap={8} wrap="wrap">
          {proof.marks.map((mark) => (
            <Label key={mark} variant="glass" size="sm" radius="sm">
              {mark}
            </Label>
          ))}
        </Group>
      ) : null}
    </>
  )
}

/**
 * The hero's solution finder. A pill at the drawn width that stops being a pill once the row wraps,
 * and fields that go full width there — all of it the banner kind's, none of it the page's.
 */
function SolutionFinder({ banner }: { banner: NonNullable<HeroSpec['banner']> }) {
  return (
    /*
     * Not interactive: this card is a container for the selects and button inside it. With the default
     * on, a hover lift and focus ring would fire on the bar itself while the real controls sit within
     * it — an affordance pointing at nothing, wrapped around things that have their own.
     */
    <Card
      surface="glass"
      interactive={false}
      padding="none"
      radius="pill"
      w="100%"
      maw={1000}
    >
      <Group gap={16} px={16} py={8} align="center">
        <Text fz="lg" fw={600} pl={8} flex={{ base: '1 1 100%', md: '1 1 auto' }}>
          {banner.label}
        </Text>
        {banner.fields.map((field) => (
          <Select
            key={field.label}
            aria-label={field.label}
            radius="xl"
            w={{ base: '100%', md: field.width ?? 200 }}
            defaultValue={field.options[0]}
            data={field.options}
          />
        ))}
        <Button
          variant="rounded"
          size="sm"
          w={{ base: '100%', md: 'auto' }}
          rightSection={<IconArrowRight />}
        >
          {banner.action}
        </Button>
      </Group>
    </Card>
  )
}

/* ------------------------------------------------------------------ the sections */

/**
 * One card in a grid. Which decoration it leads with is the card's own — an image, a glass icon, or a
 * tag — and each brings the padding the file draws with it: an image card pads all round, an icon or
 * tag card takes the default.
 */
function GridCard({ card }: { card: CardSpec }) {
  return (
    <Card
      component={card.href ? 'a' : 'div'}
      href={card.href}
      /*
       * The link decides the kind of card. With one, it is a target and wears glass; without, it is a
       * panel and wears `static`. Previously both were glass and only the hover differed, so a card
       * with nowhere to go looked exactly like one that had somewhere.
       */
      surface={card.href ? 'glass' : 'static'}
      /*
       * `content`, not `all`: the image runs to the card's edges and only the text is inset. `all` pads
       * the image too, which put a 20px frame of card around every thumbnail and made the picture look
       * like it had been pasted in rather than like it was the card's face.
       */
      padding={card.image ? 'content' : undefined}
      image={
        card.image ? (
          <Image src={card.image.src} alt={card.image.alt} ratio="3:2" />
        ) : undefined
      }
      hero={
        card.icon ? (
          GLASS[card.icon](40)
        ) : card.tag ? (
          <Label variant="gradient" size="md">
            {card.tag}
          </Label>
        ) : undefined
      }
      title={card.title}
      description={card.description}
    />
  )
}

/**
 * `Section`, with the scroll reveal already on.
 *
 * A template page *is* the sequence the reveal was written for — every section here opted into it one by
 * one, which made it a thing to remember rather than a property of the page. It is the default at this
 * layer instead: a new section type gets the same arrival as the ten around it without asking, and a
 * section that genuinely should not move passes `reveal={false}`. The component's own default stays off,
 * because an app shell or a docs page has no such sequence to join.
 */
function Section({ reveal = true, ...props }: SectionProps) {
  return <SDSSection reveal={reveal} {...props} />
}

/** `Type=Card Grid` — four columns at a 32px section gap, optionally behind a pill bar. */
function CardGridSection({ spec }: { spec: Extract<SectionSpec, { type: 'cardGrid' }> }) {
  const [tab, setTab] = useState(spec.tabs?.[0]?.value ?? '')
  const cards = spec.tabs ? (spec.tabs.find((t) => t.value === tab)?.content ?? []) : (spec.cards ?? [])

  return (
    <Section
      gap={32}
      title={
        <SectionTitle
          title={spec.title}
          description={spec.description}
          actions={
            spec.tabs ? (
              /* Explicit width: a pill bar is its own `inline-size` container and collapses in a row. */
              <Tabs variant="pills" w={{ base: '100%', md: 520 }} value={tab} onChange={(v) => setTab(v ?? '')}>
                <Tabs.List grow>
                  {spec.tabs.map((t) => (
                    <Tabs.Tab key={t.value} value={t.value} leftSection={t.icon ? ICONS[t.icon] : undefined}>
                      {t.label}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            ) : undefined
          }
        />
      }
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={24}>
        {cards.map((card, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <GridCard key={`${card.title}-${i}`} card={card} />
        ))}
      </SimpleGrid>
    </Section>
  )
}

/** `Type=Resources` — three columns at the drawn 24px gap, icon- or tag-led cards. */
function ResourceGridSection({ spec }: { spec: Extract<SectionSpec, { type: 'resourceGrid' }> }) {
  return (
    <Section title={<SectionTitle title={spec.title} description={spec.description} />}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
        {spec.cards.map((card, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <GridCard key={`${card.title}-${i}`} card={card} />
        ))}
      </SimpleGrid>
    </Section>
  )
}

/**
 * The 270x180 tile a customer-story card carries when there is no thumbnail for that customer — a drawn
 * stand-in, so a story can be written before its artwork exists. The eight the file draws have real
 * marks now; see `customer-thumbnails.ts`.
 */
const logoTile = (name: string) => {
  const hue = [...name].reduce((total, ch) => total + ch.charCodeAt(0), 0) % 360
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="360" viewBox="0 0 540 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${hue} 70% 34%)"/>
    <stop offset="1" stop-color="hsl(${hue} 80% 12%)"/>
  </linearGradient></defs>
  <rect width="540" height="360" fill="url(#g)"/>
  <text x="270" y="196" font-size="46" font-weight="700" text-anchor="middle"
        fill="#fff" font-family="Source Sans 3, sans-serif">${name}</text>
</svg>`)}`
}

function StoryCard({ story }: { story: StorySpec }) {
  return (
    <Card
      /* A quote is content, not a destination. */
      surface="static"
      image={
        <Image
          src={CUSTOMER_THUMBNAILS[story.customer] ?? logoTile(story.customer)}
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
      bottom={<Quotee name={story.name} title={story.role} />}
    />
  )
}

/** `Type=Carousel` — centre-titled, bleeding off both edges, arrows rather than dots. */
function CustomerStoriesSection({
  spec,
}: {
  spec: Extract<SectionSpec, { type: 'customerStories' }>
}) {
  return (
    <Section
      bleed
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
        />
      }
    >
      <Carousel label={spec.title} gutter={80} indicators="none" arrows>
        {spec.stories.map((story) => (
          <StoryCard key={story.customer} story={story} />
        ))}
      </Carousel>
    </Section>
  )
}

/** `Logos scrolling section` — 64px monochrome logos, flush against the band above. */
function LogoMarqueeSection({ spec }: { spec: Extract<SectionSpec, { type: 'logoMarquee' }> }) {
  return (
    <Section spacing="none" pt={24}>
      <Marquee label={spec.label} monochrome size="lg">
        {spec.logos.map((name) => (
          <Wordmark key={name} name={name} />
        ))}
      </Marquee>
    </Section>
  )
}

/**
 * `Type=Tabbed- Content` — a centred title, a pill bar, and a panel the bar swaps.
 *
 * The 776px bar width is the type's, and it is explicit for the same reason as the card grid's: a pill
 * bar is its own `inline-size` container and collapses to nothing in a centred column.
 */
function TabbedContentSection({ spec }: { spec: Extract<SectionSpec, { type: 'tabbedContent' }> }) {
  const [tab, setTab] = useState(spec.tabs[0]?.value ?? '')
  const panel: PanelSpec | undefined = spec.tabs.find((t) => t.value === tab)?.content

  return (
    <Section
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
    >
      {/*
        * 24, which is what the file draws between the bar and the panel in *both* tabbed sections —
        * `Tabs Pill Menu` ends at 248 and `Content` starts at 272. The hand-written Home template used
        * 40 on one of them and 24 on the other; porting to data is what caught it.
        */}
      <Stack gap={24} align="center" w="100%">
        <Tabs variant="pills" w={{ base: '100%', md: 776 }} value={tab} onChange={(v) => setTab(v ?? '')}>
          <Tabs.List grow>
            {spec.tabs.map((t) => (
              <Tabs.Tab key={t.value} value={t.value} leftSection={t.icon ? ICONS[t.icon] : undefined}>
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        {panel ? (
          <ContentMedia
            mediaSide={spec.mediaSide ?? 'right'}
            /* A stat row under the media makes the column taller than 3:2, so the box takes its height. */
            mediaRatio={panel.stats?.length ? 'auto' : '3:2'}
            order={3}
            eyebrow={panel.eyebrow ? GLASS[panel.eyebrow](40) : undefined}
            title={panel.title}
            description={panel.description}
            actions={
              panel.action ? (
                <Link href={panel.action.href} size="lg" rightSection={<IconArrowRight />}>
                  {panel.action.label}
                </Link>
              ) : undefined
            }
            media={
              panel.media ? (
                /*
                 * One object, not two stacked. The container and the gap are what make the stat row
                 * read as belonging to the picture rather than sitting under it — see `.mediaStats`.
                 * Without stats there is nothing to contain, so the frame does not appear.
                 */
                <div className={panel.stats?.length ? classes.mediaStats : undefined}>
                  <Image src={panel.media.src} alt={panel.media.alt} ratio="3:2" radius="md" />
                  {panel.stats?.length ? (
                    <StatBar align="center">{panel.stats.map((st) => renderStat(st, 'center'))}</StatBar>
                  ) : null}
                </div>
              ) : undefined
            }
          >
            {panel.items?.length ? (
              /*
               * The panel opens itself, row by row. A tabbed section is the page showing what it can do
               * rather than answering a question the reader arrived with — the FAQ block is the other
               * one, and it deliberately does not do this: someone reading an FAQ came for one answer.
               */
              <Accordion size="lg" order={4} autoplay defaultValue={panel.items[0].question}>
                {panel.items.map((item) => (
                  <Accordion.Item key={item.question} value={item.question}>
                    <Accordion.Control>{item.question}</Accordion.Control>
                    <Accordion.Panel>
                      <p>{item.answer}</p>
                      {item.link ? (
                        <Link href={item.link.href} size="md" rightSection={<IconArrowRight />}>
                          {item.link.label}
                        </Link>
                      ) : null}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : null}
          </ContentMedia>
        ) : null}
      </Stack>
    </Section>
  )
}

/**
 * `Type=Full Card` — one horizontal card over a rule of tabs.
 *
 * `{tab}` in the card's title or a link label is replaced with the active tab, because the file draws
 * one card that the bar relabels rather than a card per industry. See the note in `page-schema.ts`.
 */
function FullCardSection({ spec }: { spec: Extract<SectionSpec, { type: 'fullCard' }> }) {
  const [tab, setTab] = useState(spec.tabs?.[0] ?? '')
  const fill = (text: string) => text.replace(/\{tab\}/g, tab)

  return (
    <Section
      gap={24}
      title={<SectionTitle title={highlightPhrase(spec.title, spec.titleHighlight, true)} />}
      footer={
        spec.tabs?.length ? (
          /* Full width so the bar fills the row and scrolls, rather than centring at its own width. */
          <Tabs w="100%" value={tab} onChange={(v) => setTab(v ?? '')}>
            <Tabs.List grow>
              {spec.tabs.map((name) => (
                <Tabs.Tab key={name} value={name}>
                  {name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        ) : undefined
      }
    >
      <Card
        align="horizontal"
        /* Its links do the work — see the nested-interactive note in Card's docs. */
        interactive={false}
        titleSize="full"
        hero={spec.card.icon ? GLASS[spec.card.icon](48) : undefined}
        title={fill(spec.card.title)}
        description={spec.card.description}
        main={
          spec.card.links?.length ? (
            <Stack gap={12} align="flex-start">
              {spec.card.links.map((link) => (
                <Link key={link.label} href={link.href} size="md" rightSection={<IconArrowRight />}>
                  {fill(link.label)}
                </Link>
              ))}
            </Stack>
          ) : undefined
        }
        secondary={
          spec.card.stats?.length ? <StatBar>{spec.card.stats.map((st) => renderStat(st))}</StatBar> : undefined
        }
        image={
          spec.card.media ? (
            <Image src={spec.card.media.src} alt={spec.card.media.alt} ratio="3:2" radius="md" />
          ) : undefined
        }
      />
    </Section>
  )
}

/**
 * The product constellation — *Everything You Need in One Platform*.
 *
 * `bleed`, unlike the media band's 1000 column: `names="outside"` is 8.2 tiles across, and a cap would be
 * paid for out of card size rather than out of the gutter. The title keeps the gutter — that is what
 * `bleed` means here — and only the figure runs to the edges.
 *
 * The glass icons come out of the same `GLASS` table every other section uses, at the size the tile
 * sets — `CapabilityMap` sizes what it is given, so nothing is passed here.
 *
 * `maxHeight` spends the window's height rather than the column's width, so the whole figure is visible
 * at once on a laptop instead of being scrolled through. See `PRODUCT_MAP_MAX_HEIGHT`.
 */
function CapabilityMapSection({ spec }: { spec: Extract<SectionSpec, { type: 'capabilityMap' }> }) {
  return (
    <Section
      bleed
      gap={40}
      title={
        <SectionTitle align="center" title={highlightPhrase(spec.title, spec.titleHighlight, true)} />
      }
    >
      <CapabilityMap
        names="outside"
        clusters={spec.clusters.map((cluster) => ({
          label: cluster.label,
          items: cluster.items.map((item) => ({
            label: item.label,
            description: item.description,
            href: item.href,
            icon: GLASS[item.icon](48),
          })),
        }))}
        maxHeight={PRODUCT_MAP_MAX_HEIGHT}
        hubIcon={GLASS[spec.hub.icon](56)}
        hubLabel={spec.hub.label}
        hubHref={spec.hub.href}
      />
    </Section>
  )
}

/** A centred band holding one wide graphic. The column is capped at the drawn 1000. */
function MediaBandSection({ spec }: { spec: Extract<SectionSpec, { type: 'mediaBand' }> }) {
  return (
    <Section maxWidth={1000} gap={40} title={<SectionTitle align="center" title={spec.title} />}>
      <Image src={spec.image.src} alt={spec.image.alt} ratio="auto" fit="contain" />
    </Section>
  )
}

/**
 * `Type=Integrations Section`, scrolling — a **deliberate divergence from the file.**
 *
 * Figma draws a static wrapping row of 64px glass tiles. A fixed row can only ever show as many
 * integrations as fit across, and the claim the section is making is that there are more than that, so
 * the row scrolls instead: `Marquee`, which brings a measured speed, the edge fade and the pause button
 * WCAG 2.2.2 requires, and a `MeshBackdrop` behind it. The tile stays the drawn 64 square and holds the
 * mark alone. Recorded in the README.
 *
 * Logos arrive as names. A name in the invented set draws its lockup; anything else falls back to the
 * initial tile, so a page carrying real vendor names still renders.
 */
function IntegrationsSection({ spec }: { spec: Extract<SectionSpec, { type: 'integrations' }> }) {
  return (
    <Section
      bleed
      gap={32}
      className={spec.backdrop ? classes.meshHost : undefined}
      title={
        <SectionTitle
          align="center"
          title={highlightPhrase(spec.title, spec.titleHighlight, true)}
          description={spec.description}
        />
      }
      /*
       * The call to action sits in the section's footer — Figma's `Call to Action` cell, centred by the
       * Section — rather than beside the heading. Below the strip it reads as the thing to do after
       * looking at the logos.
       */
      footer={
        spec.action ? (
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            {spec.action.label}
          </Button>
        ) : undefined
      }
    >
      {spec.backdrop ? <MeshBackdrop tone={spec.backdrop} /> : null}
      <Marquee label="Integrations" gap={16} logoWidth={64} size="lg" speed={38} fade fadeWidth={120}>
        {spec.logos.map((name, i) => {
          const logo = VENDOR_LOGOS.find((v) => v.name === name)
          return (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}-${i}`}
              surface="glass"
              padding="none"
              w={64}
              h={64}
            >
              <Group justify="center" align="center" h="100%">
                {logo ? (
                  <svg viewBox="0 0 24 24" width={28} height={28} role="img" aria-label={name}>
                    {logo.mark}
                  </svg>
                ) : (
                  /* A name the invented set does not cover — the initial tile still stands in for it. */
                  <VendorTile name={name} />
                )}
              </Group>
            </Card>
          )
        })}
      </Marquee>
    </Section>
  )
}

function renderSection(spec: SectionSpec, index: number) {
  switch (spec.type) {
    case 'cardGrid':
      return <CardGridSection key={index} spec={spec} />
    case 'resourceGrid':
      return <ResourceGridSection key={index} spec={spec} />
    case 'customerStories':
      return <CustomerStoriesSection key={index} spec={spec} />
    case 'logoMarquee':
      return <LogoMarqueeSection key={index} spec={spec} />
    case 'tabbedContent':
      return <TabbedContentSection key={index} spec={spec} />
    case 'fullCard':
      return <FullCardSection key={index} spec={spec} />
    case 'mediaBand':
      return <MediaBandSection key={index} spec={spec} />
    case 'capabilityMap':
      return <CapabilityMapSection key={index} spec={spec} />
    case 'integrations':
      return <IntegrationsSection key={index} spec={spec} />
    default: {
      /* A new section type in the data with no renderer is a mistake worth failing the build over. */
      const never: never = spec
      return never
    }
  }
}

/**
 * The bubble a page draws, when something outside the page is choosing it.
 *
 * A page normally does not choose — `renderHero` pairs a file with the shape the data asked for, and
 * which file that is is not a page's business. The one caller that *is* allowed to say is a tool for
 * looking at bubbles, where the whole point is putting a file that is not in `assets/` on a real page.
 * So this is an override rather than a field on `PageSpec`: it does not round-trip, it does not belong
 * to the mockup, and nothing serialised can set it.
 */
export interface BubbleOverride {
  video?: HeroMediaSource
  videoLight?: HeroMediaSource
  /**
   * Draw the bubble in CSS instead of playing a file — the prototype the lab exists to judge.
   *
   * A data attribute rather than a prop, because that is the honest status of it: the stylesheet
   * knows how to draw a bubble, nothing in the component's API says so yet, and if the drawing wins
   * that is the moment to give it a name.
   */
  css?: boolean
}

export function PageRenderer({ page, bubble }: { page: PageSpec; bubble?: BubbleOverride }) {
  return (
    <>
      {renderHero(page.hero, bubble)}
      {page.sections.map(renderSection)}
    </>
  )
}

/** Convenience for a story: the chrome around a rendered page. */
export function renderPage(page: PageSpec) {
  return <PageRenderer page={page} />
}

export { Stack }
