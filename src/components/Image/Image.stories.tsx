import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { Image, IMAGE_RATIOS, type ImageRatio } from './Image'
import { Card } from '../Card'
import { Label } from '../Label'

/**
 * A generated data-URI photograph, so the stories render offline. Deliberately not square and not
 * centred: `cover`, `contain` and `fill` only look different on an image whose own ratio fights the box.
 */
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#adc9ff"/>
      <stop offset="0.6" stop-color="#7414ff"/>
      <stop offset="1" stop-color="#0b5fff"/>
    </linearGradient>
  </defs>
  <rect width="600" height="240" fill="url(#g)"/>
  <circle cx="120" cy="70" r="46" fill="#fff" opacity="0.85"/>
  <rect x="0" y="190" width="600" height="50" fill="#070b13" opacity="0.55"/>
  <text x="20" y="224" font-family="sans-serif" font-size="22" fill="#fff">600 × 240 source</text>
</svg>`)}`

const RATIOS = [...(Object.keys(IMAGE_RATIOS) as ImageRatio[]), 'auto'] as ImageRatio[]

const meta = {
  title: 'Components/Image',
  component: Image,
  args: {
    src: PHOTO,
    alt: '',
    ratio: '3:2',
    orientation: 'horizontal',
    fit: 'cover',
    radius: 'md',
  },
  argTypes: {
    ratio: { options: RATIOS, control: 'select' },
    orientation: { options: ['horizontal', 'vertical'], control: 'inline-radio' },
    fit: {
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      control: 'inline-radio',
      description: 'How the image fills the box a ratio gives it.',
    },
    fill: {
      control: 'boolean',
      description: 'Cover the nearest positioned ancestor instead. `ratio` is ignored.',
    },
    src: { control: false },
  },
  parameters: {
    frame: { width: 720 },
    docs: {
      description: {
        component: [
          "The ratios from Figma's `Aspect Ratio` set (node `12305:1754909`) on Mantine's `Image`: nine ratios plus `auto` for its `Adjustable` cell, and an `orientation` that inverts them the way the set's vertical cells do.",
          '',
          '`alt` is a required prop with no default. `alt=""` is a valid and often correct answer — a photograph next to text that already says it — but it has to be said. An image component that lets you forget the alt text produces a codebase without any.',
          '',
          'The ratio is `aspect-ratio` on the image itself, not a wrapper: one element, and the image takes part in its parent’s layout directly.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. The source is 600×240, so the box and the image disagree on purpose. */
export const Playground: Story = {}

/** Every ratio the Figma set draws, at the same width. */
export const Ratios: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="20">
      {RATIOS.map((ratio) => (
        <Stack key={ratio} gap="8">
          <Image {...args} ratio={ratio} />
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            {ratio}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  ),
}

/**
 * `orientation="vertical"` inverts the ratio — a vertical 3:2 is 2:3 — which is how the Figma set draws
 * its portrait cells rather than listing them twice.
 */
export const Orientation: Story = {
  render: (args) => (
    <SimpleGrid cols={4} spacing="20">
      {(['3:2', '4:3', '16:9', '2:1'] as ImageRatio[]).map((ratio) => (
        <Stack key={ratio} gap="8">
          <Image {...args} ratio={ratio} orientation="vertical" />
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            {ratio} vertical
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  ),
}

/**
 * The five `fit` values in one box, so the difference is visible. The source is 600×240 in a 3:2 box:
 * `cover` crops the sides, `contain` letterboxes it, `fill` stretches it, `none` shows it at its own
 * size, and `scale-down` picks the smaller of `none` and `contain`.
 */
export const Fit: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="20">
      {(['cover', 'contain', 'fill', 'none', 'scale-down'] as const).map((fit) => (
        <Stack key={fit} gap="8">
          <Box bg="var(--sds-surfaces-card-bg-grey)" style={{ borderRadius: 8 }}>
            <Image {...args} fit={fit} ratio="3:2" />
          </Box>
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            {fit}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  ),
}

/**
 * `fill` covers the nearest positioned ancestor, for an image behind content. The parent needs
 * `position: relative` and a size of its own; the ratio is ignored, because the parent already decides
 * the box.
 */
export const Fill: Story = {
  render: (args) => (
    <Box pos="relative" h={280} style={{ borderRadius: 8, overflow: 'hidden' }}>
      <Image {...args} fill radius={0} />
      <Stack gap="8" pos="relative" p="32" justify="flex-end" h="100%">
        <Label size="sm" variant="gradient">
          Behind the content
        </Label>
        <Text fz="var(--sds-size-heading-f4)" fw={700} c="var(--sds-action-neutral-inverted)">
          The image fills its parent
        </Text>
      </Stack>
    </Box>
  ),
}

/**
 * In a card. `Card.Image` handles the bleed and the hover zoom; this is the same thing with an `Image`
 * inside it, which is what you would write with a real photograph and a ratio to hold.
 */
export const InACard: Story = {
  render: (args) => (
    <SimpleGrid cols={2} spacing="20">
      <Card
        interactive
        component="a"
        href="#"
        padding="content"
        image={<Image {...args} ratio="3:2" radius={0} alt="" />}
        hero={
          <Label size="sm" variant="gradient">
            3:2
          </Label>
        }
        description="The ratio comes from the image, not the card."
      />
      <Card
        interactive
        component="a"
        href="#"
        padding="content"
        image={<Image {...args} ratio="16:9" radius={0} alt="" />}
        hero={
          <Label size="sm" variant="gradient">
            16:9
          </Label>
        }
        description="Same card, a wider crop."
      />
    </SimpleGrid>
  ),
}

/**
 * Alt text is the point of an image component that anyone else has to use. `alt` is required and has no
 * default: an empty string for a decorative image, a sentence for one that carries information.
 */
export const AltText: Story = {
  render: (args) => (
    <Stack gap="24">
      <Stack gap="8">
        <Image {...args} alt="" ratio="3:1" />
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          <code>alt=&quot;&quot;</code> — decorative. The text beside it already says what it shows, so a
          screen reader should skip it.
        </Text>
      </Stack>
      <Stack gap="8">
        <Image {...args} alt="Campaign dashboard with six live campaigns and a 24% lift" ratio="3:1" />
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          A sentence — the image carries information that is not in the surrounding copy.
        </Text>
      </Stack>
    </Stack>
  ),
}
