import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, Text } from '@mantine/core'
import { List } from './List'
import { Card } from '../Card'
import { IconArrowRight, IconInformation, IconRefresh2 } from '../../icons'

const POINTS = [
  ['One platform, every channel', 'Websites, portals, commerce and search on the same deployment.'],
  ['Composable by default', 'Every capability is a service you can take or leave.'],
  ['Runs where you need it', 'Self-managed, on our cloud, or both at once.'],
]

function points() {
  return POINTS.map(([title, description]) => (
    <List.Item key={title} title={title}>
      {description}
    </List.Item>
  ))
}

const meta = {
  title: 'Components/List',
  component: List,
  args: { marker: 'check', size: 'md', padded: false },
  argTypes: {
    marker: {
      options: ['check', 'number', 'bullet', 'none'],
      control: 'inline-radio',
      description: "Figma's `List` `Type`. `check` is its `Type=Icon` cell.",
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: 'inline-radio',
      description: 'The marker box — 16 / 24 / 32. The text stays 18px, as it does in every Figma cell.',
    },
    padded: { control: 'boolean', description: "Figma's `Padding=Yes`: 20/16 and the grey surface." },
    icon: { control: false },
    children: { control: false },
    spacing: { control: false },
  },
  parameters: {
    frame: { width: 800 },
    docs: {
      description: {
        component: [
          "Figma `List` (node `19130:63824`) with `Main List Item`, `Sub List Item` and the `Sub Item List` marker set, on Mantine's `List`.",
          '',
          'A real `<ul>` — or `<ol>` when `marker="number"`, where the visible number is a **CSS counter** rather than a string, so it cannot disagree with the item’s position.',
          '',
          '**A sublist knows it is one.** Figma’s `Sub List` differs from its parent in five values at once: bullets rather than checks, 8px between items rather than 20, 2px from the marker rather than 8, a semibold title rather than bold, and no gap between title and description. A `List` inside a `List.Item` picks all five up on its own — there is no `nested` prop, and passing `marker` or `spacing` still overrides.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = { render: (args) => <List {...args}>{points()}</List> }

/** **`Type=Icon`** — the `system/check` marker, which is the set's default cell. */
export const Check: Story = { args: { marker: 'check' }, render: (args) => <List {...args}>{points()}</List> }

/** **`Type=Number`** — an `<ol>`, with the number drawn from a CSS counter in `Accent/Product Accent`. */
export const Number: Story = {
  args: { marker: 'number' },
  render: (args) => <List {...args}>{points()}</List>,
}

/** **`Type=Bullet`** — the 8px dot. */
export const Bullet: Story = { args: { marker: 'bullet' }, render: (args) => <List {...args}>{points()}</List> }

/** All three markers together. */
export const Markers: Story = {
  render: (args) => (
    <Stack gap="40">
      {(['check', 'number', 'bullet'] as const).map((marker) => (
        <Stack key={marker} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            marker=&quot;{marker}&quot;
          </Text>
          <List {...args} marker={marker}>
            {points()}
          </List>
        </Stack>
      ))}
    </Stack>
  ),
}

/** The three marker boxes: 16, 24 and 32. The text does not change, and neither does Figma's. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="40">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            size=&quot;{size}&quot;
          </Text>
          <List {...args} size={size}>
            {points()}
          </List>
        </Stack>
      ))}
    </Stack>
  ),
}

/**
 * `Show Header` and `Show description` are two booleans in Figma, so all three combinations are drawable:
 * a title with a description, a title alone, a description alone.
 */
export const TitleAndDescription: Story = {
  render: (args) => (
    <Stack gap="40">
      <List {...args}>
        <List.Item title="Both">Title and description, which is the default cell.</List.Item>
      </List>
      <List {...args}>
        <List.Item title="A title on its own" />
        <List.Item title="Which is what a plain feature list looks like" />
      </List>
      <List {...args}>
        <List.Item>A description on its own, with no header above it.</List.Item>
        <List.Item>Same again, for a list of sentences rather than points.</List.Item>
      </List>
    </Stack>
  ),
}

/**
 * **`Show Sublist`** — a `List` inside a `List.Item`. Nothing is passed to make it a sublist: bullets,
 * 8px spacing, the 2px marker gap, the semibold title and the flush description all come from being
 * nested.
 */
export const Sublist: Story = {
  render: (args) => (
    <List {...args}>
      <List.Item title="One platform, every channel">
        Websites, portals, commerce and search on the same deployment.
        <List>
          <List.Item title="Content">Pages, assets and translations in one tree.</List.Item>
          <List.Item title="Commerce">Catalogues, carts and orders on the same identity.</List.Item>
          <List.Item title="Search">One index across all of it.</List.Item>
        </List>
      </List.Item>
      <List.Item title="Composable by default">
        Every capability is a service you can take or leave.
      </List.Item>
    </List>
  ),
}

/** **`Padding=Yes`** — 20/16 of padding and `Surfaces/Card BG/Grey` behind each row. */
export const Padded: Story = {
  args: { padded: true },
  render: (args) => <List {...args}>{points()}</List>,
}

/**
 * `Sub Item List`'s `Icon Type` instance swap: any icon in place of the check, on the whole list or on
 * one item.
 */
export const CustomIcon: Story = {
  args: { icon: <IconArrowRight /> },
  render: (args) => (
    <List {...args}>
      <List.Item title="From the list">Takes the list's icon.</List.Item>
      <List.Item title="From the item" icon={<IconRefresh2 />}>
        Overridden on this row alone.
      </List.Item>
      <List.Item title="And again" icon={<IconInformation />}>
        Any icon in the set.
      </List.Item>
    </List>
  ),
}

/** `marker="none"` — not a cell Figma draws, for a list that wants the text flush. */
export const NoMarker: Story = {
  args: { marker: 'none' },
  render: (args) => <List {...args}>{points()}</List>,
}

/** In a card, which is where a key-point list usually ends up. */
export const InACard: Story = {
  render: (args) => (
    <Card variant="glass" padding="lg" w={480}>
      <Text component="h3">What you get</Text>
      <List {...args} size="sm" spacing={12}>
        <List.Item>One deployment pipeline for every channel.</List.Item>
        <List.Item>A component library your teams already know.</List.Item>
        <List.Item>Search that spans the whole estate.</List.Item>
      </List>
    </Card>
  ),
}

/** A long item, to show the marker staying against the first line rather than drifting to the middle. */
export const Wrapping: Story = {
  render: (args) => (
    <List {...args} size="lg">
      <List.Item title="A point long enough to wrap across more than one line, which is what most of them do">
        And a description that also runs on, so the marker has three lines of text to sit beside rather
        than one. It stays level with the first line, because that is the line it belongs to.
      </List.Item>
      <List.Item title="A short one">For contrast.</List.Item>
    </List>
  ),
}
