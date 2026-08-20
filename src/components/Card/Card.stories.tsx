import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Card } from './Card'
import { Button } from '../Button'
import { Label } from '../Label'
import { Link } from '../Link'
import { Stat, StatBar } from '../Stat'
import { IconArrowRight, IconArrowUp, IconInformation } from '../../icons'

const SURFACES = ['glass', 'grey', 'blue', 'gradient-blue', 'gradient-purple', 'none'] as const

/** Stands in for a photograph: the stories have to render offline, so no remote images. */
function Cover({ ratio = '3 / 2' }: { ratio?: string }) {
  return (
    <Box
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
      <Title order={3} fz="var(--sds-size-heading-f4)">
        Enterprise websites
      </Title>
      <Text c="var(--sds-surfaces-text-secondary)">
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
          <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
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
          <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
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
        <Label size="sm">Customer story</Label>
        <Title order={3} fz="var(--sds-size-heading-f4)">
          A bank rebuilt onboarding
        </Title>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          The whole card is one link — hover, tab, press.
        </Text>
      </Card>
      <Card {...args} variant="grey" w={320}>
        <Label size="sm" variant="light">
          Reference
        </Label>
        <Title order={3} fz="var(--sds-size-heading-f4)">
          Not interactive
        </Title>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          Content only, so it has no states at all.
        </Text>
      </Card>
    </Group>
  ),
}

/**
 * **Resource card** — the spreadsheet's first type. Label on top, title and description in the middle,
 * a link at the bottom.
 */
export const ResourceCard: Story = {
  render: (args) => (
    <Card {...args} interactive component="a" href="#" w={320}>
      <Label size="sm">Whitepaper</Label>
      <Title order={3} fz="var(--sds-size-heading-f4)">
        The composable enterprise
      </Title>
      <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
        What changes when every team ships to the same platform.
      </Text>
      <Link href="#" size="md" rightSection={<IconArrowRight />}>
        Download
      </Link>
    </Card>
  ),
}

/**
 * **No padding image card** — `padding="none"` with the image in a `Card.Section`, so it reaches the
 * corner, and the text in its own padded block.
 */
export const ImageCard: Story = {
  render: (args) => (
    <Card {...args} padding="none" interactive component="a" href="#" w={320}>
      <Card.Section>
        <Cover />
      </Card.Section>
      <Stack gap="8" p="20">
        <Label size="sm">Customer story</Label>
        <Title order={3} fz="var(--sds-size-heading-f4)">
          Six weeks to launch
        </Title>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          The image bleeds to the edge; the text keeps its padding.
        </Text>
      </Stack>
    </Card>
  ),
}

/** **Full width card** — the horizontal orientation, which Figma draws at 40px padding and a 24px gap. */
export const FullWidthCard: Story = {
  render: (args) => (
    <Card {...args} orientation="horizontal" padding="lg">
      <Stack gap="8" style={{ flex: 1 }}>
        <Label size="sm">Platform</Label>
        <Title order={3} fz="var(--sds-size-heading-f3)">
          One platform, every channel
        </Title>
        <Text c="var(--sds-surfaces-text-secondary)">
          Horizontal cards centre their blocks against each other.
        </Text>
        <Group gap="16" mt="8">
          <Button size="md" rightSection={<IconArrowRight />}>
            Book a demo
          </Button>
          <Link href="#" size="md">
            Read the docs
          </Link>
        </Group>
      </Stack>
      <Box w={280} style={{ borderRadius: 8, overflow: 'hidden' }}>
        <Cover ratio="4 / 3" />
      </Box>
    </Card>
  ),
}

/** **Customer story quote card** — the quote, then the author block at the bottom. */
export const QuoteCard: Story = {
  render: (args) => (
    <Card {...args} padding="lg" w={360}>
      <Text fz="var(--sds-size-paragraph-large)" fw={600}>
        “We shipped in six weeks what used to take us three quarters.”
      </Text>
      <Group gap="12" mt="8">
        <Box w={40} h={40} bg="var(--sds-brand-primary-lighten-4)" style={{ borderRadius: 999 }} />
        <Stack gap={0}>
          <Text fz="sm" fw={600}>
            Dana Okafor
          </Text>
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
            VP Engineering, Northwind
          </Text>
        </Stack>
      </Group>
    </Card>
  ),
}

/** **Icon card** — left or centre aligned, per the spreadsheet's last type. */
export const IconCard: Story = {
  render: (args) => (
    <Group align="stretch" gap="20">
      <Card {...args} w={260}>
        <Box c="var(--sds-accent-primary-blue-accent)" fz={48} lh={1}>
          <IconInformation />
        </Box>
        <Text fw={600}>Left aligned</Text>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          The default flow of the card.
        </Text>
      </Card>
      <Card {...args} w={260} ta="center" style={{ alignItems: 'center' }}>
        <Box c="var(--sds-accent-primary-blue-accent)" fz={48} lh={1}>
          <IconInformation />
        </Box>
        <Text fw={600}>Centre aligned</Text>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          Same card, centred content.
        </Text>
      </Card>
    </Group>
  ),
}

/** A card with stats in it — the spreadsheet lists Stat on top and Stats at the bottom. */
export const WithStats: Story = {
  render: (args) => (
    <Card {...args} padding="lg" w={560}>
      <Title order={3} fz="var(--sds-size-heading-f4)">
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
