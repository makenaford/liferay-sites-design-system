import { useState } from 'react'
import type { ReactNode } from 'react'
import { Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Carousel } from '../components/Carousel'
import { Hero } from '../components/Hero'
import { Image } from '../components/Image'
import { Label } from '../components/Label'
import { Link } from '../components/Link'
import { Section, SectionTitle } from '../components/Section'
import { Stat } from '../components/Stat'
import { Tabs } from '../components/Tabs'
import { Select, TextInput } from '../components/Input'
import {
  IconArrowDown,
  IconArrowRight,
  IconBracketsAngle,
  IconBuilding2,
  IconClose,
  IconDepartment,
  IconGroup,
  IconMonitor,
  IconPresentation1,
  IconSearch,
  IconShoppingCart1,
  IconStarFilled,
  IconUser1,
} from '../icons'
import { Quotee, unit } from './shared'
import type {
  CardSpec,
  HeroSpec,
  IconName,
  PageSpec,
  SectionSpec,
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

/* ------------------------------------------------------------------ the hero */

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
        hero.action ? (
          <Link href={hero.action.href} size="md" rightSection={<IconArrowRight />}>
            {hero.action.label}
          </Link>
        ) : undefined
      }
      proof={hero.proof ? renderProof(hero.proof) : undefined}
      media={
        hero.media ? (
          <Image src={hero.media.src} alt={hero.media.alt} ratio="4:3" radius="md" />
        ) : undefined
      }
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
            <Label key={mark} variant="outline" size="sm" radius="sm">
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

function GoalCard({ card }: { card: CardSpec }) {
  return (
    <Card
      component={card.href ? 'a' : 'div'}
      href={card.href}
      interactive={Boolean(card.href)}
      padding="all"
      image={
        card.image ? (
          <Image src={card.image.src} alt={card.image.alt} ratio="3:2" radius="sm" />
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
        {cards.map((card) => (
          <GoalCard key={card.title} card={card} />
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

function renderSection(spec: SectionSpec, index: number) {
  switch (spec.type) {
    case 'cardGrid':
      return <CardGridSection key={index} spec={spec} />
    case 'customerStories':
      return <CustomerStoriesSection key={index} spec={spec} />
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
