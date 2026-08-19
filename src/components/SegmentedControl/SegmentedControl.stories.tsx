import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, Text } from '@mantine/core'
import { SegmentedControl } from './SegmentedControl'
import { IconCheck, IconInformation, IconSearch } from '../../icons'

/** The five tabs Figma draws in the Tabs section, at their drawn labels. */
const TABS = [
  { value: 'websites', label: 'Enterprise Websites' },
  { value: 'commerce', label: 'Digital Commerce' },
  { value: 'portals', label: 'Customer Portals' },
  { value: 'intranets', label: 'Intranets' },
  { value: 'apps', label: 'Apps' },
]

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: {
    data: TABS,
    defaultValue: 'portals',
  },
  argTypes: {
    data: { control: false },
    fullWidth: {
      control: 'boolean',
      description: 'Equal-width segments filling the container, as Figma draws the desktop size.',
    },
    disabled: { control: 'boolean', description: 'Disables every segment. Not a state Figma draws.' },
    readOnly: { control: 'boolean', description: 'Shows the selection but refuses changes.' },
    orientation: { control: false },
  },
  parameters: {
    /**
     * Figma's desktop frame is 1280px wide with a 1280px container; the frame gives the story a real
     * width to divide, since Storybook's centred layout would otherwise shrink-wrap the control and
     * hide what `fullWidth` does.
     */
    frame: { width: 1216 },
    docs: {
      description: {
        component: [
          'Mantine `SegmentedControl` themed to the Figma `Tabs Menu Carded` component set (node `17900:62310`) — the carded glass container, with the selected segment as one pill that slides between options.',
          '',
          "Figma's `Sizes` axis (Desktop / Mobile) is **responsive here rather than a prop**: the desktop treatment applies from 1200px, the design's own desktop breakpoint, and the mobile one below it — 44px segments that hug their labels and scroll. Narrow the Storybook viewport to see it switch.",
          '',
          'Renders radio inputs, because a segmented control is a choice. If you need tabs that swap panels, use Mantine `Tabs` — the semantics are different even where the visual is not.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Click, tab into it and use the arrow keys, or hover a segment. */
export const Playground: Story = {}

/**
 * The default, at Figma's five tabs. Above 1200px the segments divide the width equally with a zero
 * gap; below it they hug their labels, take a 12px gap and the row scrolls.
 */
export const Default: Story = {}

/**
 * With icons. Figma models these as a `Show Icon Left` boolean plus an instance swap on each tab; in
 * code an icon is just part of the item's label, and the theme sizes it per breakpoint — 20px on
 * desktop, 16px below — with Figma's 8px gap.
 */
export const WithIcons: Story = {
  args: {
    data: [
      { value: 'all', label: <>All results</> },
      { value: 'docs', label: <><IconSearch />Documentation</> },
      { value: 'guides', label: <><IconInformation />Guides</> },
      { value: 'done', label: <><IconCheck />Completed</> },
    ],
    defaultValue: 'docs',
  },
}

/**
 * Two segments — the shape a segmented control is most often used in, and where the sliding indicator
 * reads most clearly. Click between them to watch the pill travel rather than jump.
 */
export const TwoOptions: Story = {
  args: {
    data: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'annual', label: 'Annual' },
    ],
    defaultValue: 'monthly',
  },
  parameters: { frame: { width: 420 } },
}

/**
 * Hugging its content instead of filling the container. `fullWidth` is on by default because Figma's
 * desktop container spans its frame; turn it off for a control that sits inline next to other things.
 */
export const HugContents: Story = {
  args: {
    fullWidth: false,
    data: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
      { value: 'table', label: 'Table' },
    ],
    defaultValue: 'grid',
  },
}

/**
 * The states Figma does not draw, all inferred: a whole disabled control, a single disabled segment
 * (`disabled` on the `data` item), and read-only. Disabled follows Button — the resting appearance at
 * half opacity — and neither disabled nor read-only can be moved with the arrow keys.
 */
export const InferredStates: Story = {
  render: (args) => (
    <Stack gap="24">
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          one segment disabled
        </Text>
        <SegmentedControl
          {...args}
          data={[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'table', label: 'Table', disabled: true },
          ]}
          defaultValue="grid"
        />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          the whole control disabled
        </Text>
        <SegmentedControl {...args} disabled />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
          read only
        </Text>
        <SegmentedControl {...args} readOnly />
      </Stack>
    </Stack>
  ),
}

/** Controlled, with the current value echoed back — the usual way this is wired to state. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('commerce')

    return (
      <Stack gap="16">
        <SegmentedControl {...args} value={value} onChange={setValue} />
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          value: <code>{value}</code>
        </Text>
      </Stack>
    )
  },
}

/**
 * The mobile treatment, forced by a narrow frame: 44px segments hugging their labels, a 12px gap, and
 * a row that scrolls — Figma's mobile tab bar is 762px wide inside a 366px container, so scrolling is
 * the drawn behaviour rather than an addition. Swipe or drag horizontally.
 */
export const Scrolling: Story = {
  parameters: { frame: { width: 360 } },
}
