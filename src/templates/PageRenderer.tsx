import { useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import type { ReactNode } from 'react'
import { Button as MantineButton, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Hero } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { Marquee } from '../components/Marquee'
import { ContentMedia, Section, SectionTitle } from '../components/Section'
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
  IconGlassSearch,
  IconGlassSites,
  IconGlassSupplierPortals,
  IconSearch,
  IconShoppingCart1,
  IconStarFilled,
  IconUser1,
} from '../icons'
import { Quotee, VendorTile, Wordmark, unit } from './shared'
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

function renderHero(hero: HeroSpec) {
  return (
    <Hero
      background={hero.background ?? 'corner'}
      banner={hero.banner ? <SolutionFinder banner={hero.banner} /> : undefined}
      title={
        <h1>
          {hero.title.text}
          {hero.title.highlight ? (
            <>
              {' '}
              <Text span inherit variant="gradient" gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}>
                {hero.title.highlight}
              </Text>
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
              <Button size="md" rightSection={<IconArrowRight />}>
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
    <Card surface="glass" padding="none" bdrs={{ base: 24, md: 30 }} w="100%" maw={1000}>
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
      interactive={Boolean(card.href)}
      padding={card.image ? 'all' : undefined}
      image={
        card.image ? (
          <Image src={card.image.src} alt={card.image.alt} ratio="3:2" radius="sm" />
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

/** The 270×180 logo tile a customer-story card carries. A stand-in: the marks are not ours to ship. */
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
      image={<Image src={logoTile(story.customer)} alt={story.customer} ratio="3:2" radius="sm" />}
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
    <Section bleed title={<SectionTitle align="center" title={spec.title} />}>
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
      title={<SectionTitle align="center" title={spec.title} description={spec.description} />}
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
                <Stack gap={0}>
                  <Image src={panel.media.src} alt={panel.media.alt} ratio="3:2" radius="md" />
                  {panel.stats?.length ? (
                    <StatBar align="center">{panel.stats.map((st) => renderStat(st, 'center'))}</StatBar>
                  ) : null}
                </Stack>
              ) : undefined
            }
          >
            {panel.items?.length ? (
              <Accordion size="lg" order={4} defaultValue={panel.items[0].question}>
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
      title={<SectionTitle title={spec.title} />}
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

/** A centred band holding one wide graphic. The column is capped at the drawn 1000. */
function MediaBandSection({ spec }: { spec: Extract<SectionSpec, { type: 'mediaBand' }> }) {
  return (
    <Section maxWidth={1000} gap={40} title={<SectionTitle align="center" title={spec.title} />}>
      <Image src={spec.image.src} alt={spec.image.alt} ratio="auto" fit="contain" />
    </Section>
  )
}

/**
 * `Type=Integrations Section` — a wrapping row of 64px glass tiles, not a marquee.
 *
 * The tile is `card-main` at 64x64 and padding 12, which is not a value on the `Padding` axis, so the
 * box is sized here. Recorded in the README.
 */
function IntegrationsSection({ spec }: { spec: Extract<SectionSpec, { type: 'integrations' }> }) {
  return (
    <Section
      gap={32}
      title={
        <SectionTitle
          title={spec.title}
          description={spec.description}
          actions={
            spec.action ? (
              <Button
                variant="outline"
                size="md"
                w={{ base: '100%', md: 'auto' }}
                rightSection={<IconArrowRight />}
              >
                {spec.action.label}
              </Button>
            ) : undefined
          }
        />
      }
    >
      <Group gap={16} wrap="wrap">
        {spec.logos.map((name, i) => (
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
    case 'integrations':
      return <IntegrationsSection key={index} spec={spec} />
    default: {
      /* A new section type in the data with no renderer is a mistake worth failing the build over. */
      const never: never = spec
      return never
    }
  }
}

export function PageRenderer({ page }: { page: PageSpec }) {
  return (
    <>
      {renderHero(page.hero)}
      {page.sections.map(renderSection)}
    </>
  )
}

/** Convenience for a story: the chrome around a rendered page. */
export function renderPage(page: PageSpec) {
  return <PageRenderer page={page} />
}

export { Stack }
