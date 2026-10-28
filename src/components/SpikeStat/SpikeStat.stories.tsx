import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group } from '@mantine/core'
import { SpikeStat } from './SpikeStat'
import { IconArrowUp } from '../../icons'

const meta = {
  title: 'Components/SpikeStat',
  component: SpikeStat,
  args: {
    value: '845',
    label: 'Months to launch',
    size: 'md',
    tone: 'brand',
  },
  argTypes: {
    size: { options: ['md', 'sm', 'hero'], control: 'inline-radio' },
    tone: { options: ['brand', 'gradient'], control: 'inline-radio' },
    align: { options: ['left', 'center'], control: 'inline-radio' },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          '**TEST component for the Liferay DXP sync spike — do not use or merge.** A copy of `Stat` with a `hero` size and a `gradient` tone.',
      },
    },
  },
} satisfies Meta<typeof SpikeStat>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {}

/** The three sizes: 32px, 40px and the new 56px hero. */
export const Sizes: Story = {
  render: (args) => (
    <Group gap="40" align="flex-end">
      <SpikeStat {...args} size="sm" label="Small — 32px" />
      <SpikeStat {...args} size="md" label="Default — 40px" />
      <SpikeStat {...args} size="hero" label="Hero — 56px" />
    </Group>
  ),
}

/** The brand blue, and the blue-to-purple gradient across the digits. */
export const Tones: Story = {
  render: (args) => (
    <Group gap="40" align="flex-end">
      <SpikeStat {...args} tone="brand" label="Brand" />
      <SpikeStat {...args} tone="gradient" label="Gradient" />
    </Group>
  ),
}

/** The figure a section leads with: hero size, gradient tone, centred. */
export const HeroGradient: Story = {
  args: { size: 'hero', tone: 'gradient', align: 'center', value: '3x', label: 'Faster time to market' },
}

/** Caption beside the figure, with an icon. */
export const InlineWithIcon: Story = {
  args: { layout: 'inline', leftSection: <IconArrowUp />, value: '1,200+', label: 'Enterprise customers' },
}
