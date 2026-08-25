import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, Stack, Text } from '@mantine/core'
import { Divider } from './Divider'
import { Card } from '../Card'
import { Stat, StatBar } from '../Stat'

const meta = {
  title: 'Components/Divider',
  component: Divider,
  args: { tone: 'normal', orientation: 'horizontal' },
  argTypes: {
    tone: {
      options: ['normal', 'gradient'],
      control: 'inline-radio',
      description: "Figma's `Property 1`.",
    },
    orientation: { options: ['horizontal', 'vertical'], control: 'inline-radio' },
    label: { control: 'text' },
    labelPosition: { options: ['left', 'center', 'right'], control: 'inline-radio' },
  },
  parameters: {
    frame: { width: 720 },
    docs: {
      description: {
        component: [
          'Figma `divider` component set (node `16290:53873`) on Mantine’s `Divider`. Four cells: `Property 1` of normal or gradient, `Property 2` of horizontal or vertical.',
          '',
          '**One value for both axes.** Figma draws the normal tone as `Neutral/02` horizontally and `Neutral/03` vertically; nothing about turning a line 90° should change its weight, so both use `Neutral/03` here — the stronger of the pair, and what every other flat rule in the library already uses. Recorded in the README as a deviation.',
          '',
          'What that does not fix: `Neutral/03` is 1.42:1 against the light page and 2.23:1 on dark. It is the stronger of Figma’s two values, not a strong line. A rule whose job is to be *seen* wants `Neutral/05`.',
          '',
          '`size`, `color` and Mantine’s dashed/dotted line styles are deliberately not exposed: every cell in the file is 1px solid, and the colour is the `tone` axis.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {
  render: (args) => (
    <Stack gap="24">
      <Text>Above the rule.</Text>
      <Divider {...args} />
      <Text>Below it.</Text>
    </Stack>
  ),
}

/** All four cells of the set. */
export const Cells: Story = {
  render: () => (
    <Stack gap="40">
      {(['normal', 'gradient'] as const).map((tone) => (
        <Stack key={tone} gap="16">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            tone=&quot;{tone}&quot;, horizontal
          </Text>
          <Divider tone={tone} />
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            tone=&quot;{tone}&quot;, vertical
          </Text>
          <Group gap="24" h={60}>
            <Text>Left</Text>
            <Divider tone={tone} orientation="vertical" />
            <Text>Middle</Text>
            <Divider tone={tone} orientation="vertical" />
            <Text>Right</Text>
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
}

/**
 * Both axes, side by side, on the same `Neutral/03`. Figma draws the horizontal one a step lighter at
 * `Neutral/02`; matching them is the one deviation this component makes.
 */
export const BothAxes: Story = {
  render: () => (
    <Stack gap="16">
      <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
        Both are <code>tone=&quot;normal&quot;</code> and both are <code>Neutral/03</code>.
      </Text>
      <Group gap="40" align="stretch" h={80}>
        <Box style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Divider />
        </Box>
        <Divider orientation="vertical" />
      </Group>
    </Stack>
  ),
}

/** Mantine's label, which the Figma set does not draw but which a long page often wants. */
export const WithLabel: Story = {
  render: (args) => (
    <Stack gap="32">
      <Divider {...args} label="Section" />
      <Divider {...args} label="Left aligned" labelPosition="left" />
      <Divider {...args} label="Right aligned" labelPosition="right" />
    </Stack>
  ),
}

/** In a card, separating two blocks of content. */
export const InACard: Story = {
  render: () => (
    <Card w={420} maw="100%" title="Plan details" description="What is included at this tier.">
      <Stack gap="16">
        <Divider />
        <StatBar>
          <Stat size="sm" value="24/7" label="Support" />
          <Stat size="sm" value="99.9%" label="Uptime" />
        </StatBar>
      </Stack>
    </Card>
  ),
}

/**
 * The gradient tone as an accent under a heading, which is what the Accordion uses it for on an open row.
 */
export const GradientAsAccent: Story = {
  render: () => (
    <Stack gap="12" w={420} maw="100%">
      <Text fz="var(--sds-size-heading-f4)" fw={700}>
        Where is my data hosted?
      </Text>
      <Divider tone="gradient" />
      <Text c="var(--sds-surfaces-text-secondary)">
        In the region you pick when you provision the environment.
      </Text>
    </Stack>
  ),
}
