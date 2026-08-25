import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text, Title } from '@mantine/core'
import { Carousel } from './Carousel'
import { Card } from '../Card'
import { Label } from '../Label'
import { Link } from '../Link'
import { Stat } from '../Stat'
import { IconArrowRight, IconArrowUp } from '../../icons'

/** Stands in for a photograph: the stories have to render offline. */
function Cover() {
  return (
    <Box
      data-card-image
      style={{ aspectRatio: '3 / 2' }}
      bg="linear-gradient(120deg, var(--sds-brand-primary-lighten-4), var(--sds-accent-product-accent))"
    />
  )
}

const QUOTES = [
  ['Airbus', 'We consolidated eleven regional sites onto one platform in a single quarter.', '11 sites'],
  ['Rabobank', 'The portal our advisers use every day is now the same codebase as the public site.', '1 codebase'],
  ['Bosch', 'Search across three product catalogues finally returns one answer.', '3 catalogues'],
  ['Baystate Health', 'Patients book, pay and message from one account.', '1 account'],
  ['Kennametal', 'Commerce and content ship on the same release train.', '1 train'],
  ['Bundesagentur', 'Accessibility went from a project to a default.', 'AA by default'],
  ['Hyundai', 'Dealer sites launch in days rather than months.', '4 days'],
]

/** Seven quote cards, the way the Figma section fills its `List` with `CS- Quote` cards. */
function quoteCards() {
  return QUOTES.map(([customer, quote, stat]) => (
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
  ))
}

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  args: {
    label: 'Customer stories',
    slideSize: 310,
    gap: 13,
    arrows: true,
    indicators: 'dots',
    fade: true,
    fadeWidth: '15%',
    gutter: 0,
  },
  argTypes: {
    indicators: {
      options: ['dots', 'lines', 'none'],
      control: 'inline-radio',
      description: "Figma's `Type`: `dots` is the row inside `Type=arrows`, `lines` is `Type=lines`.",
    },
    arrows: { control: 'boolean' },
    fade: { control: 'boolean', description: "Figma's `Overlay`, as a mask." },
    slideSize: { control: 'text' },
    header: { control: false },
    children: { control: false },
  },
  parameters: {
    frame: { width: 1120 },
    docs: {
      description: {
        component: [
          'The `card carousel` section (node `24465:66866`) with the Figma `Carousel` control set (node `20440:16714`) under it: 310px cards at a 13px gap, clipped with a fade at each edge, and either the arrow pair, the dot row or the line bars.',
          '',
          '**It is a scroll container with CSS scroll snapping, not a transformed strip.** The alternative was `@mantine/carousel`, which brings `embla-carousel-react` into a library that depends on `@mantine/core` and `@mantine/hooks` and nothing else. Snapping gets touch and trackpad momentum, keyboard scrolling and reduced-motion handling from the browser; what it does not get is mouse drag, autoplay or an infinite loop. If one of those three is needed, swap this component for `@mantine/carousel` — nothing else changes.',
          '',
          'Two deliberate departures from the drawing, both in README.md: the inactive indicator moves off `Neutral/02` (1.24:1 in light mode) to `Neutral/06`, and the edge fade appears only on the side that has more content instead of always being on.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control, with the section's seven quote cards. */
export const Playground: Story = { render: (args) => <Carousel {...args}>{quoteCards()}</Carousel> }

/** **`Type=arrows`** as the section draws it: the two outline buttons with the dot row between them. */
export const Arrows: Story = {
  args: { arrows: true, indicators: 'dots' },
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
}

/** **`Type=lines`** — the 8px bars, 24px inactive and 64px active, with no arrows. */
export const Lines: Story = {
  args: { arrows: false, indicators: 'lines' },
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
}

/** The arrows on their own, which is what the section's own instance draws — the dots are hidden there. */
export const ArrowsOnly: Story = {
  args: { arrows: true, indicators: 'none' },
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
}

/**
 * The whole section: `Section Title` above the list, the cards, then the controls. The heading is passed
 * in rather than built in — a carousel should not decide what a heading level is.
 */
export const WithHeader: Story = {
  render: (args) => (
    <Carousel
      {...args}
      gutter={80}
      header={
        <Stack gap="8" align="center" ta="center">
          <Title order={2} fz="var(--sds-size-heading-f2)">
            Customer stories
          </Title>
          <Text c="var(--sds-surfaces-text-secondary)">
            Seven teams that put content, commerce and search on one platform.
          </Text>
        </Stack>
      }
    >
      {quoteCards()}
    </Carousel>
  ),
}

/** Image cards, at Figma's 310px. The hover zoom survives the scroll container. */
export const ImageCards: Story = {
  render: (args) => (
    <Carousel {...args}>
      {QUOTES.map(([customer, quote]) => (
        <Card
          key={customer}
          interactive
          component="a"
          href="#"
          padding="content"
          image={<Cover />}
          hero={
            <Label size="sm" variant="gradient">
              Story
            </Label>
          }
          title={customer}
          description={quote}
        />
      ))}
    </Carousel>
  ),
}

/**
 * One card at a time, with the next peeking in — `slideSize="82%"`. The same component; the indicators
 * now count every slide, because every slide can reach the left edge.
 */
export const OneAtATime: Story = {
  args: { slideSize: '82%', indicators: 'dots' },
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
}

/** Wide slides, so the whole set fits and there is nothing to scroll: the controls go away by themselves. */
export const NothingToScroll: Story = {
  args: { slideSize: 310 },
  render: (args) => <Carousel {...args}>{quoteCards().slice(0, 2)}</Carousel>,
}

/** Stats rather than cards — the slide is a slot, so anything can go in it. */
export const StatSlides: Story = {
  args: { slideSize: 240, indicators: 'lines', arrows: false },
  render: (args) => (
    <Carousel {...args}>
      {[
        ['845', 'Sites migrated'],
        ['98%', 'Uptime'],
        ['3x', 'Faster releases'],
        ['11', 'Regions'],
        ['4d', 'To first launch'],
        ['1', 'Codebase'],
      ].map(([value, labelText]) => (
        <Card key={labelText} surface="grey" main={<Stat value={value} label={labelText} leftSection={<IconArrowUp />} />} />
      ))}
    </Carousel>
  ),
}

/** No fade, for a carousel that sits in a container with a hard edge of its own. */
export const NoFade: Story = {
  args: { fade: false },
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
}

/** Narrow, as it renders on a phone: the slide is capped at the track width and the cards scroll. */
export const Narrow: Story = {
  render: (args) => <Carousel {...args}>{quoteCards()}</Carousel>,
  parameters: { viewport: { defaultViewport: 'mobile1' }, frame: { width: 360 } },
}
