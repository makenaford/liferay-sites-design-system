import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text, Title } from '@mantine/core'
import { Marquee } from './Marquee'
import { Card } from '../Card'

/**
 * Stand-in wordmarks. Real logos are files; these are inline SVG so the stories render offline, and they
 * use `currentColor` so `monochrome` has something to ink.
 */
function Wordmark({ name, width }: { name: string; width: number }) {
  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      /* No `height`: the cell caps it, so the same wordmark shows the `size` axis doing something. */
      style={{ aspectRatio: `${width} / 24` }}
      role="img"
      aria-label={name}
    >
      <rect x="0" y="4" width="16" height="16" rx="3" fill="currentColor" opacity="0.55" />
      <text
        x="22"
        y="18"
        fontFamily="var(--mantine-font-family)"
        fontSize="17"
        fontWeight="700"
        fill="currentColor"
      >
        {name}
      </text>
    </svg>
  )
}

const LOGOS = [
  ['Airbus', 96],
  ['Carrefour', 122],
  ['Damatics', 116],
  ['Petrobras', 124],
  ['Burbank', 110],
  ['Excellus', 112],
  ['Rabobank', 122],
] as const

function logos() {
  return LOGOS.map(([name, width]) => <Wordmark key={name} name={name} width={width} />)
}

const meta = {
  title: 'Components/Marquee',
  component: Marquee,
  args: {
    label: 'Customers',
    size: 'lg',
    gap: 60,
    logoWidth: 109,
    speed: 60,
    direction: 'left',
    fade: true,
    fadeWidth: '20%',
    monochrome: true,
    withControl: true,
    pauseOnHover: true,
  },
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: 'inline-radio',
      description: "Figma's `Size`, as the logo cell's height: Mobile 24, Desktop 49, Size3 64.",
    },
    direction: { options: ['left', 'right'], control: 'inline-radio' },
    speed: { control: { type: 'range', min: 10, max: 240, step: 10 }, description: 'Pixels per second.' },
    monochrome: { control: 'boolean', description: "Figma's one-colour logo treatment." },
    withControl: { control: 'boolean', description: 'The pause button. Required by WCAG 2.2.2.' },
    children: { control: false },
  },
  parameters: {
    frame: { width: 1120 },
    docs: {
      description: {
        component: [
          'The `marque` section (node `24465:67388`) and the Figma `Logos scrolling section` set (`22522:24157`): a strip of logos that scrolls forever, faded at both edges.',
          '',
          '**Figma draws the strip twice** — `Frame 1332` and `Frame 1333`, identical — which is how a seamless marquee is built, so that is what this does: one set of children rendered twice, translated by the width of one copy plus one gap. The second copy is `aria-hidden`.',
          '',
          '`speed` is **pixels per second, not a duration**. The distance is measured from the live layout and the duration comes out of it, so a five-logo strip and a twenty-logo strip move at the same speed.',
          '',
          '**The pause button is a conformance requirement, not a nicety.** WCAG 2.2.2 asks for a way to stop motion that starts by itself and runs more than five seconds. Hover-to-pause is on too, but it is not that mechanism — it does nothing on a keyboard or a touch screen. Figma draws no control, so this one is inferred.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Marquee>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = { render: (args) => <Marquee {...args}>{logos()}</Marquee> }

/** **`Size=Size3`** — the 64px cell, which is the set's default. */
export const Large: Story = { args: { size: 'lg' }, render: (args) => <Marquee {...args}>{logos()}</Marquee> }

/** **`Size=Desktop`** — the 49px cell. */
export const Medium: Story = { args: { size: 'md' }, render: (args) => <Marquee {...args}>{logos()}</Marquee> }

/** **`Size=Mobile`** — the 24px cell, which a narrow viewport also drops to on its own. */
export const Small: Story = { args: { size: 'sm' }, render: (args) => <Marquee {...args}>{logos()}</Marquee> }

/** All three cell heights. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="40">
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <Stack key={size} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            size=&quot;{size}&quot;
          </Text>
          <Marquee {...args} size={size} label={`Customers ${size}`}>
            {logos()}
          </Marquee>
        </Stack>
      ))}
    </Stack>
  ),
}

/** Travelling the other way, for a second strip under the first. */
export const TwoDirections: Story = {
  render: (args) => (
    <Stack gap="32">
      <Marquee {...args} direction="left" label="Customers">
        {logos()}
      </Marquee>
      <Marquee {...args} direction="right" label="Partners">
        {[...logos()].reverse()}
      </Marquee>
    </Stack>
  ),
}

/**
 * Full colour rather than Figma's one-colour treatment — its `Theme` axis exists because a one-colour
 * logo needs a different ink per theme, which `Surfaces/Text/Primary` already handles.
 */
export const FullColour: Story = {
  args: { monochrome: false },
  render: (args) => (
    <Marquee {...args}>
      {LOGOS.map(([name, width], index) => (
        <Box key={name} c={['#02225a', '#1d5bc6', '#bf2026', '#007ac2', '#1f88c8', '#13a4cc', '#f26522'][index]}>
          <Wordmark name={name} width={width} />
        </Box>
      ))}
    </Marquee>
  ),
}

/** Slow, which is what a logo strip usually wants — fast enough to notice, slow enough to read. */
export const Speeds: Story = {
  render: (args) => (
    <Stack gap="40">
      {[25, 60, 140].map((speed) => (
        <Stack key={speed} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            speed={speed} px/s
          </Text>
          <Marquee {...args} speed={speed} label={`Customers at ${speed}`}>
            {logos()}
          </Marquee>
        </Stack>
      ))}
    </Stack>
  ),
}

/** No edge fade, for a strip inside a container with a hard edge of its own. */
export const NoFade: Story = { args: { fade: false }, render: (args) => <Marquee {...args}>{logos()}</Marquee> }

/**
 * `withControl={false}` — only correct when the page provides its own pause mechanism. Without one, an
 * endless strip fails WCAG 2.2.2.
 */
export const NoControl: Story = {
  args: { withControl: false },
  render: (args) => <Marquee {...args}>{logos()}</Marquee>,
}

/** Few enough logos that one copy does not fill the strip — the loop still closes, with a wider gap. */
export const FewLogos: Story = {
  render: (args) => <Marquee {...args}>{logos().slice(0, 3)}</Marquee>,
}

/**
 * The whole section, as Figma composes it: a `Section Title` above and the strip below at the section's
 * 32px gap.
 */
export const InASection: Story = {
  render: (args) => (
    <Stack gap="32" py="80">
      <Stack gap="8" px="80">
        <Title order={2} fz="var(--sds-size-heading-f2)">
          Extend your platform
        </Title>
        <Text c="var(--sds-surfaces-text-secondary)">
          Integrations with the systems your teams already run.
        </Text>
      </Stack>
      <Marquee {...args}>{logos()}</Marquee>
    </Stack>
  ),
}

/** In a card, at the small cell — a logo strip as a footnote rather than a section. */
export const InACard: Story = {
  render: (args) => (
    <Card variant="glass" padding="lg" w={520}>
      <Text component="h3">Trusted by</Text>
      <Marquee {...args} size="sm" gap={32} speed={30}>
        {logos()}
      </Marquee>
    </Card>
  ),
}
