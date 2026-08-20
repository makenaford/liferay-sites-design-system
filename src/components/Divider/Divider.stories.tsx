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
          '**The neutrals are not symmetric between the axes.** A normal horizontal rule is `Neutral/02` and a normal vertical one is `Neutral/03` — nothing about turning a line 90° should change its weight, so this looks like drift rather than intent. Both are reproduced as drawn and it is in the README’s gaps list.',
          '',
          'That matters: `Neutral/02` is **1.24:1 against the light page**, so a normal horizontal divider is close to invisible in light mode. If a rule has to be *seen* rather than merely be present, `Neutral/05` is the step that reads in both modes.',
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
 * The asymmetry, side by side. The horizontal rule is `Neutral/02` and the vertical one `Neutral/03` — the
 * vertical is visibly the stronger of the two, which is the drift the docs describe.
 */
export const TheAsymmetry: Story = {
  render: () => (
    <Stack gap="16">
      <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
        Both are <code>tone=&quot;normal&quot;</code>. Only the axis differs.
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
    <Card w={420} title="Plan details" description="What is included at this tier.">
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
    <Stack gap="12" w={420}>
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
