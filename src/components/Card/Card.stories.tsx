import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Card } from './Card'
import { Button } from '../Button'
import { Label } from '../Label'
import { Link } from '../Link'
import { Stat, StatBar } from '../Stat'
import {
  IconArrowRight,
  IconArrowUp,
  IconGlassComposable,
  IconGlassDatabase,
  IconGlassMail,
} from '../../icons'

const SURFACES = ['glass', 'grey', 'blue', 'gradient-blue', 'gradient-purple', 'none'] as const

/**
 * Stands in for a photograph: the stories have to render offline, so no remote images.
 *
 * `data-card-image` is what marks it as the card's image. A real `<img>` needs no such marker — the
 * stylesheet targets `img` directly — but a placeholder div does, or it would miss the hover zoom.
 */
function Cover({ ratio = '3 / 2' }: { ratio?: string }) {
  return (
    <Box
      data-card-image
      style={{ aspectRatio: ratio }}
      bg="linear-gradient(120deg, var(--sds-brand-primary-lighten-4), var(--sds-accent-product-accent))"
    />
  )
}

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    variant: 'glass',
    padding: 'md',
    orientation: 'vertical',
    interactive: false,
  },
  argTypes: {
    variant: {
      options: SURFACES,
      control: 'inline-radio',
      description: "Figma's Surface Style axis. `glass` is the clickable surface, `grey` is not.",
    },
    padding: {
      options: ['none', 'sm', 'md', 'lg'],
      control: 'inline-radio',
      description: 'Small 16, Medium 20, Large 40, or none for a full-bleed image card.',
    },
    orientation: { options: ['vertical', 'horizontal'], control: 'inline-radio' },
    interactive: {
      control: 'boolean',
      description:
        'Turns on the hover ring, the focus ring and the lift. Only for a card that really is a link or a button.',
    },
  },
  parameters: {
    frame: { width: 880 },
    docs: {
      description: {
        component: [
          "Mantine `Card` dressed in the Figma `Surface` set (`24385:58962`) with `card-main`'s geometry (`24385:65090`), and the axes the accompanying spreadsheet enumerates.",
          '',
          'Content is composed rather than configured — the spreadsheet\'s Top / Content / Bottom slots are just children, which is what lets one component cover all five of its card types. `Card.Section` reverses the padding for a full-bleed image.',
          '',
          'The interaction states are opt-in through `interactive`, because the spreadsheet is explicit that Glass is the clickable surface and Grey is not.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Turn on `interactive` and hover or tab to it. */
export const Playground: Story = {
  render: (args) => (
    <Card {...args} w={360}>
      <Title order={3}>
        Enterprise websites
      </Title>
      <Text component="p">
        A platform teams can ship on without waiting for a release train.
      </Text>
      <Link href="#" rightSection={<IconArrowRight />}>
        Read more
      </Link>
    </Card>
  ),
}

/** The six Surface styles. Only `glass` and `grey` appear in the spreadsheet's clickable column. */
export const Surfaces: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="20">
      {SURFACES.map((variant) => (
        <Card key={variant} {...args} variant={variant}>
          <Text fw={600}>{variant}</Text>
          <Text component="p">
            Surface Style = {variant}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  ),
}

/** The padding scale from the spreadsheet: 16, 20, 40 — and 0, which only makes sense with a section. */
export const Padding: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="20">
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          <Text fw={600}>padding=&quot;{padding}&quot;</Text>
          <Text component="p">
            {padding === 'sm' ? '16px' : padding === 'md' ? '20px' : '40px'}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  ),
}

/**
 * The interaction states, which only apply when `interactive` is set. Hover for the 1px gradient ring
 * and the lift, tab to it for the 2px ring, press for the settle. The glass surface also swaps its
 * diagonal fill for a radial sheen on hover, as Figma draws it. The second card is the same content
 * without `interactive` — nothing responds, which is the point.
 */
export const Interactive: Story = {
  render: (args) => (
    <Group align="stretch" gap="20">
      <Card {...args} interactive component="a" href="#" w={320}>
        <Label size="sm" variant="outline">Customer story</Label>
        <Title order={3}>
          A bank rebuilt onboarding
        </Title>
        <Text component="p">
          The whole card is one link — hover, tab, press.
        </Text>
      </Card>
      <Card {...args} variant="grey" w={320}>
        <Label size="sm" variant="outline">
          Reference
        </Label>
        <Title order={3}>
          Not interactive
        </Title>
        <Text component="p">
          Content only, so it has no states at all.
        </Text>
      </Card>
    </Group>
  ),
}

/**
 * **Resource card** — Figma `Special Cards / Type=Resource` (`24397:75886`): a 3:2 image at the top of an
 * unpadded card, then the outline label and a 21px title. The surface is `no-bg`, so the image and the
 * text sit on the page rather than on a card fill.
 *
 * Hover it: the image grows 6% inside its own frame. The section already clips to the corner, so the
 * image scales rather than pushing the card around, and it runs on `transform` — off the layout path,
 * on the same curve as the lift so the two read as one movement.
 *
 * Note what the two cards do differently. The first **is** a link, so its call to action is *text* with
 * the link's colour and arrow — a nested `<a>` inside an `<a>` is invalid HTML, and browsers unnest it
 * into something neither element controls. The second is a plain container with a real `Link` inside,
 * which is the right choice when the card holds more than one destination.
 */
export const ResourceCard: Story = {
  render: (args) => (
    <Group align="stretch" gap="20">
      <Card {...args} variant="none" padding="none" interactive component="a" href="#" w={320}>
        <Card.Image>
          <Cover />
        </Card.Image>
        <Card.Top>
          <Label size="sm" variant="outline">
            Whitepaper
          </Label>
        </Card.Top>
        <Title order={3}>The composable enterprise</Title>
        <Card.Cta>
          <Group gap="4" c="var(--sds-action-link-default-link)" fw={600} fz="var(--sds-size-action-link-medium)">
            Download
            <IconArrowRight />
          </Group>
        </Card.Cta>
      </Card>
      <Card {...args} w={320}>
        <Card.Top>
          <Label size="sm" variant="outline">
            Whitepaper
          </Label>
        </Card.Top>
        <Title order={3}>Not itself a link</Title>
        <Text component="p">So the call to action can be a real Link component.</Text>
        <Card.Cta>
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Download
          </Link>
        </Card.Cta>
      </Card>
    </Group>
  ),
}

/**
 * **No padding image card** — `padding="none"` with the image in a `Card.Section`, so it reaches the
 * corner, and the text in its own padded block.
 */
export const ImageCard: Story = {
  render: (args) => (
    <Card {...args} interactive component="a" href="#" w={320}>
      <Card.Image>
        <Cover />
      </Card.Image>
      <Card.Top>
        <Label size="sm" variant="outline">
          Customer story
        </Label>
      </Card.Top>
      <Title order={3}>Six weeks to launch</Title>
      <Text component="p">
        The image reverses the card&apos;s padding to reach the corner; everything else keeps it.
      </Text>
    </Card>
  ),
}

/** **Full width card** — the horizontal orientation, which Figma draws at 40px padding and a 24px gap. */
export const FullWidthCard: Story = {
  render: (args) => (
    <Card {...args} orientation="horizontal" padding="lg">
      <Stack gap="8" style={{ flex: 1 }}>
        <Label size="sm" variant="outline">Platform</Label>
        <Title order={3}>
          One platform, every channel
        </Title>
        <Text component="p">
          Horizontal cards centre their blocks against each other.
        </Text>
        <Card.Cta>
          <Button size="md" rightSection={<IconArrowRight />}>
            Book a demo
          </Button>
          <Link href="#" size="md">
            Read the docs
          </Link>
        </Card.Cta>
      </Stack>
      <Box w={280} style={{ borderRadius: 8, overflow: 'hidden' }}>
        <Cover ratio="4 / 3" />
      </Box>
    </Card>
  ),
}

/**
 * **Customer story card** — Figma `Special Cards / Type=CS- Quote` (`24397:75912`): the customer's image,
 * a stat above the quote, the quote as the description with **no title**, and the author as name and
 * position with no avatar.
 *
 * The quote is the description rather than a heading. Figma puts it in the title slot, but a pull quote
 * is not a heading — it is the card's body, and a screen reader jumping by heading should not land in the
 * middle of someone's sentence.
 */
export const CustomerStoryCard: Story = {
  render: (args) => (
    <Card {...args} padding="md" w={320}>
      <Card.Image>
        <Cover ratio="3 / 2" />
      </Card.Image>
      <Card.Top>
        <Stat value="845" label="Months to launch" rightSection={<IconArrowUp />} />
      </Card.Top>
      <Text component="p">
        “With Liferay we can scale automatically, or on a schedule, a lot quicker than we could
        before.”
      </Text>
      <Stack gap={4} pt="8">
        <Text fz="var(--sds-size-paragraph-small)" fw={600}>
          Anne Anderson
        </Text>
        <Text
          fz="var(--sds-size-paragraph-small-caps-xs)"
          fw={600}
          tt="uppercase"
          c="var(--sds-surfaces-text-secondary)"
          style={{ letterSpacing: '0.06em' }}
        >
          VP of Experience and Change Management
        </Text>
      </Stack>
    </Card>
  ),
}

/**
 * **Icon card** — left or centre aligned, per the spreadsheet's last type. The illustration is one of
 * the glass icons, at the 48px container Figma draws them in; they are illustrations rather than UI
 * glyphs, so they keep their own colours instead of inheriting the text colour.
 */
export const IconCard: Story = {
  render: (args) => (
    <Group align="stretch" gap="20">
      <Card {...args} w={260}>
        <Card.Top>
          <IconGlassComposable />
        </Card.Top>
        <Text fw={600}>Left aligned</Text>
        <Text component="p">
          The default flow of the card.
        </Text>
      </Card>
      <Card {...args} w={260} ta="center" style={{ alignItems: 'center' }}>
        <Card.Top>
          <IconGlassDatabase />
        </Card.Top>
        <Text fw={600}>Centre aligned</Text>
        <Text component="p">
          Same card, centred content.
        </Text>
      </Card>
    </Group>
  ),
}

/**
 * The illustrative icon in the card's top slot, which is what Figma's `card-main` puts there — a
 * `Glass icon` instance at 48px. `size` overrides the box if a layout needs something else; the art is
 * drawn on a 64px grid, so it stays crisp either way.
 */
export const WithIllustrativeIcon: Story = {
  render: (args) => (
    <Group align="stretch" gap="20">
      <Card {...args} interactive component="a" href="#" w={280}>
        <IconGlassMail />
        <Label size="sm" variant="outline">
          Product
        </Label>
        <Title order={3}>
          Campaign delivery
        </Title>
        <Text component="p">
          One icon, one label, one heading — the card's top slot as drawn.
        </Text>
      </Card>
      <Card {...args} w={280}>
        <Group gap="16">
          <IconGlassDatabase size={32} />
          <IconGlassComposable size={32} />
          <IconGlassMail size={32} />
        </Group>
        <Text component="p">
          The same icons at <code>size=&#123;32&#125;</code>.
        </Text>
      </Card>
    </Group>
  ),
}

/**
 * **The slots.** `Card.Image`, `Card.Top` and `Card.Cta` around whatever content belongs in the middle.
 * All three are optional and the order is yours — the card is a flex column.
 *
 * Look at the bottom row: these cards carry different amounts of copy and their actions still line up,
 * because `Card.Cta` pins itself to the bottom.
 */
export const Slots: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="20">
      <Card {...args}>
        <Card.Image>
          <Cover />
        </Card.Image>
        <Card.Top>
          <Label size="sm" variant="outline">
            Image and label
          </Label>
        </Card.Top>
        <Title order={3}>All three slots</Title>
        <Text component="p">Image, top and cta.</Text>
        <Card.Cta>
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Read more
          </Link>
        </Card.Cta>
      </Card>
      <Card {...args}>
        <Card.Top>
          <Stat size="sm" value="98%" label="Uptime" />
        </Card.Top>
        <Title order={3}>A stat on top</Title>
        <Text component="p">
          No image, and a longer description — so the cards do not agree on height, which is what makes
          the bottom row worth looking at.
        </Text>
        <Card.Cta>
          <Button size="sm">Book a demo</Button>
        </Card.Cta>
      </Card>
      <Card {...args}>
        <Card.Top>
          <IconGlassComposable />
        </Card.Top>
        <Title order={3}>An icon on top</Title>
        <Card.Cta>
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Read more
          </Link>
        </Card.Cta>
      </Card>
    </SimpleGrid>
  ),
}

/** A card with stats in it — the spreadsheet lists Stat on top and Stats at the bottom. */
export const WithStats: Story = {
  render: (args) => (
    <Card {...args} padding="lg" w={560}>
      <Title order={3}>
        Migration in numbers
      </Title>
      <StatBar>
        <Stat value="845" label="Months to launch" leftSection={<IconArrowUp />} />
        <Stat value="98%" label="Uptime" />
        <Stat value="3x" label="Faster releases" />
      </StatBar>
    </Card>
  ),
}
