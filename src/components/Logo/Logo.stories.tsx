import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, Stack, Text } from '@mantine/core'
import { Logo } from './Logo'

const meta = {
  title: 'Components/Logo',
  component: Logo,
  args: { variant: 'full', height: 48, title: 'Liferay' },
  argTypes: {
    variant: {
      options: ['full', 'mark'],
      control: 'inline-radio',
      description: 'The lockup, or the glyph on its own.',
    },
    height: { control: { type: 'range', min: 16, max: 96, step: 4 } },
    title: { control: 'text', description: 'The accessible name. Pass `\'\'` when it is decorative.' },
  },
  parameters: {
    frame: { width: 720 },
    docs: {
      description: {
        component: [
          'The Liferay lockup, from the supplied `Liferay Logo.svg` (152×48).',
          '',
          '**There is no Figma component behind this one.** The Solutions Library file has no logo set — the two that a library search turns up, `Liferay` in *Customer Logos* and `Logo / Desktop / Default` in *liferay-marketing*, are in other files. So this has no Code Connect mapping, and it is the only component here that does not. Recorded in the README.',
          '',
          '**The wordmark follows `currentColor`.** The source file hardcodes it to `#F0F1F5`, a near-white that only works on a dark ground and would have been invisible on a light page. The **mark keeps its `#0B5FFF`** — that is `Brand/Primary/Primary`, and a brand mark is the one thing on a page that should not change with the colour scheme.',
          '',
          'It is pinned by `height`, not width: that is what makes it sit level with the text beside it.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {}

/** The two variants, at the sizes the page actually uses. */
export const Variants: Story = {
  render: () => (
    <Stack gap="40">
      {([48, 32, 24] as const).map((height) => (
        <Stack key={height} gap="16">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            height={height}
          </Text>
          <Group gap="40" align="center">
            <Logo height={height} />
            <Logo variant="mark" height={height} />
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
}

/**
 * The wordmark takes the colour it sits in, so one component covers the page surface and the footer's
 * pinned-dark band. The mark does not move, which is the point of it.
 *
 * The third swatch is the limit of that: the mark is `Brand/Primary/Primary`, so on a
 * brand-blue ground it disappears into it and only the wordmark survives. A logo on the brand colour
 * needs an inverse lockup — a single-colour mark — which the supplied artwork does not include.
 * Recorded in the README.
 */
export const OnSurfaces: Story = {
  render: () => (
    <Stack gap="24">
      {(
        [
          ['the page', 'var(--sds-surfaces-page-bg-base-default)', 'var(--sds-surfaces-text-primary)'],
          ["the footer's band", 'var(--sds-footer-ground)', 'var(--sds-action-neutral-inverted)'],
          ['brand blue — the mark vanishes', 'var(--sds-brand-primary-primary)', '#ffffff'],
        ] as const
      ).map(([label, bg, fg]) => (
        <Box key={label} bg={bg} c={fg} p="32" bdrs="8">
          <Stack gap="16">
            <Text fz="sm" ff="monospace" style={{ opacity: 0.7 }}>
              {label}
            </Text>
            <Logo height={40} />
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
}
