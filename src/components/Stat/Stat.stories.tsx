import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { Stat } from './Stat'
import { StatBar } from './StatBar'
import { IconArrowDown, IconArrowUp } from '../../icons'

const meta = {
  title: 'Components/Stat',
  component: Stat,
  args: {
    value: '845',
    label: 'Months to launch',
    size: 'md',
  },
  argTypes: {
    size: {
      options: ['md', 'sm'],
      control: 'inline-radio',
      description: "Figma's `Property 1`: Default (40px value) or Small (32px).",
    },
    align: { options: ['left', 'center'], control: 'inline-radio' },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'From the Figma `Stats Item` set (node `15121:237366`) — a number over a caption, with an optional icon on either side of the number.',
          '',
          '**A stat is not interactive.** It has no hover, focus or pressed state and no clickable wrapper: it is content. If a number needs to lead somewhere, put a `Link` beside it.',
          '',
          'Several of them go in a `StatBar`, which is Figma `Stats Bar` (`16708:102931`) with its gradient divider.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {}

/**
 * The two Figma sizes. The value steps 40px → 32px, and the caption changes style with it: Default is
 * the uppercased small-caps style with 6% tracking, Small is plain 11/16.
 */
export const Sizes: Story = {
  render: (args) => (
    <Group gap="40" align="flex-start">
      <Stat {...args} size="md" label="Default — 40px" />
      <Stat {...args} size="sm" label="Small — 32px" />
    </Group>
  ),
}

/** Figma's two icon booleans, as `leftSection` and `rightSection`. Both are 20px at either size. */
export const Icons: Story = {
  render: (args) => (
    <Stack gap="32">
      <Group gap="40" align="flex-start">
        <Stat {...args} leftSection={<IconArrowUp />} label="Icon left" />
        <Stat {...args} rightSection={<IconArrowUp />} label="Icon right" />
        <Stat
          {...args}
          leftSection={<IconArrowUp />}
          rightSection={<IconArrowUp />}
          label="Both"
        />
        <Stat {...args} label="Neither" />
      </Group>
      <Group gap="40" align="flex-start">
        <Stat {...args} size="sm" leftSection={<IconArrowUp />} label="Small, icon left" />
        <Stat {...args} size="sm" rightSection={<IconArrowDown />} label="Small, icon right" />
      </Group>
    </Stack>
  ),
}

/**
 * The arrows are decorative and hidden from assistive technology, so a stat that means "up 12%" has
 * to say so in words — otherwise the direction is only in the glyph.
 */
export const DirectionInWords: Story = {
  render: (args) => (
    <Group gap="40" align="flex-start">
      <Stat {...args} value="12%" label="Up on last quarter" leftSection={<IconArrowUp />} />
      <Stat {...args} value="4%" label="Down on last quarter" leftSection={<IconArrowDown />} />
    </Group>
  ),
}

/**
 * `StatBar` — Figma's `Stats Bar`, with a 1px `Neutral/03` rule between every pair. Below 576px the row stacks and the rules turn horizontal,
 * which is the shape Figma's `Align=Vertical` cell draws — see the **Bar Stacked** story.
 */
export const Bar: Story = {
  render: () => (
    <StatBar>
      <Stat value="845" label="Months to launch" leftSection={<IconArrowUp />} />
      <Stat value="98%" label="Uptime" />
      <Stat value="3x" label="Faster releases" />
    </StatBar>
  ),
  parameters: { frame: { width: 720 } },
}

/** Centred, and at the small size — the bar lays out whatever stats it is given. */
export const BarVariations: Story = {
  render: () => (
    <Stack gap="40">
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          centred
        </Text>
        <StatBar align="center">
          <Stat align="center" value="845" label="Months to launch" />
          <Stat align="center" value="98%" label="Uptime" />
          <Stat align="center" value="3x" label="Faster releases" />
        </StatBar>
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          small, four stats
        </Text>
        <StatBar>
          <Stat size="sm" value="120" label="Countries" />
          <Stat size="sm" value="4.9" label="Rating" />
          <Stat size="sm" value="12k" label="Seats" />
          <Stat size="sm" value="99.99%" label="SLA" />
        </StatBar>
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          two stats
        </Text>
        <StatBar>
          <Stat value="845" label="Months to launch" />
          <Stat value="98%" label="Uptime" />
        </StatBar>
      </Stack>
    </Stack>
  ),
  parameters: { frame: { width: 720 } },
}

/**
 * Stacked, which is how the bar renders below 576px — the token collection's tablet breakpoint. The
 * rules turn horizontal with it. Switch the Storybook viewport to a phone to see it: the breakpoint is
 * the *viewport*, not the container, so narrowing a card around the bar will not trigger it. A
 * container query would, and is the fix if that case turns up — see README.md.
 */
export const BarStacked: Story = {
  render: () => (
    <StatBar>
      <Stat value="845" label="Months to launch" leftSection={<IconArrowUp />} />
      <Stat value="98%" label="Uptime" />
      <Stat value="3x" label="Faster releases" />
    </StatBar>
  ),
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
