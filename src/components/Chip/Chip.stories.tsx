import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Group, Stack, Text } from '@mantine/core'
import { Chip } from './Chip'
import { IconClose, IconSearch } from '../../icons'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { children: 'Text', disabled: false },
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    dragging: { control: 'boolean', description: "Figma's `State=Dragged`." },
  },
  parameters: {
    frame: { width: 720 },
    docs: {
      description: {
        component: [
          'Figma `Chip` component set (node `16858:51126`) on Mantine’s `Chip`. A **removable filter chip** — it toggles, it takes focus, and every drawn cell carries a close glyph. For a read-only tag, use `Label`, which is Figma’s separate set.',
          '',
          'One drawn size (90×30), so there is no size axis: 8px horizontal padding, 6px vertical, an 8px gap, `Border Radius/medium`, and `Paragraph/X-Small/Semi Bold`.',
          '',
          '**Three of the five states are not props.** `Focused` and `Disabled` are real CSS states, so they are `:focus-visible` and `:disabled` rather than an enum — the same treatment `Button`, `Link` and `Card` get. That leaves `Selected` (the checkbox) and `Dragged` (a hook for whatever is doing the dragging, since a chip cannot know it is being reordered).',
          '',
          '**No check mark.** Mantine puts a tick inside a checked chip and reflows the label around it; Figma does not — `Selected` is the same pill with `Surfaces/Card BG/Blue` behind it. The tick is hidden and the padding is held constant, so picking a chip does not resize it and shove every chip after it along the row.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {
  render: (args) => (
    <Chip {...args} leftSection={<IconSearch />} rightSection={<IconClose />} />
  ),
}

/**
 * All five cells of the `State` axis, in the order the file draws them. `Focused` is shown as the real
 * thing — tab to it — because a screenshot of a focus ring is not a focus ring.
 */
export const States: Story = {
  render: () => (
    <Stack gap="32">
      {(
        [
          ['Default', {}],
          ['Selected', { defaultChecked: true }],
          ['Focused', {}],
          ['Dragged', { dragging: true }],
          ['Disabled', { disabled: true }],
        ] as const
      ).map(([label, props]) => (
        <Stack key={label} gap="12">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            {label}
            {label === 'Focused' ? ' — tab to it' : ''}
          </Text>
          <Group>
            <Chip {...props} leftSection={<IconSearch />} rightSection={<IconClose />}>
              Text
            </Chip>
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
}

/** With one slot, both, or neither. */
export const Slots: Story = {
  render: () => (
    <Group gap="16">
      <Chip>Label only</Chip>
      <Chip leftSection={<IconSearch />}>Left icon</Chip>
      <Chip rightSection={<IconClose />}>Right icon</Chip>
      <Chip leftSection={<IconSearch />} rightSection={<IconClose />}>
        Both
      </Chip>
    </Group>
  ),
}

/**
 * A row of filters, which is what the Detail Page templates use it for — the `Row Chip` frame is three
 * of these side by side. Picking one does not resize it, so the row never reflows.
 */
export const FilterRow: Story = {
  render: () => {
    const [picked, setPicked] = useState<string[]>(['Financial Services'])
    const options = ['Financial Services', 'Public Sector', 'Healthcare', 'Manufacturing']

    return (
      <Stack gap="16">
        <Group gap="12">
          {options.map((option) => (
            <Chip
              key={option}
              checked={picked.includes(option)}
              onChange={(checked) =>
                setPicked((current) =>
                  checked ? [...current, option] : current.filter((value) => value !== option),
                )
              }
              rightSection={<IconClose />}
            >
              {option}
            </Chip>
          ))}
        </Group>
        <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
          {picked.length ? `Filtering by ${picked.join(', ')}` : 'No filters'}
        </Text>
      </Stack>
    )
  },
}
