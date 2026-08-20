import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, Text, Title } from '@mantine/core'
import { Tabs } from './Tabs'
import { IconGlassComposable, IconGlassDatabase, IconGlassMail } from '../../icons'

/** The six tabs Figma draws in `Tabs Menu Bottom`, at their drawn labels. */
const TABS = [
  { value: 'websites', label: 'Enterprise Websites' },
  { value: 'commerce', label: 'Digital Commerce' },
  { value: 'portals', label: 'Customer Portals' },
  { value: 'intranets', label: 'Intranets' },
  { value: 'apps', label: 'Apps' },
  { value: 'search', label: 'Search' },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultValue: 'websites',
  },
  argTypes: {
    inverted: {
      control: 'boolean',
      description:
        'On by default: the rule and indicator sit above the labels, as `Tabs Menu Bottom` draws them. Off puts them underneath.',
    },
    orientation: { control: false },
    variant: {
      options: ['default', 'pills'],
      control: 'inline-radio',
      description:
        '`default` is Figma’s `Tabs Menu Bottom`; `pills` is its `Tabs Pill Menu` — a glass container with a pill sliding under the selection.',
    },
  },
  parameters: {
    frame: { width: 1216 },
    docs: {
      description: {
        component: [
          'Mantine `Tabs` themed to the Figma `Tabs Menu Bottom` component set (node `22570:34600`).',
          '',
          'The name is literal: **the rule and the active indicator sit on the top edge**, above the labels, because this bar closes a section rather than opening one — in Figma the divider, the tab bar and the active indicator all share the same y. `inverted={false}` gives a conventional underline.',
          '',
          "Figma's `Size` axis is responsive here rather than a prop: 18/24px labels in 52px tall tabs from 1200px, and 14/20px labels in 48px tabs below it, where the row scrolls.",
          '',
          '`variant="pills"` is the other set Figma draws, `Tabs Pill Menu` (node `17900:62310`) — a glass container with a full-radius pill under the selection. It used to be a separate `SegmentedControl` component; the Figma set is named for tabs, its cells are `Tabs Pill`, and it swaps panels, so it is a variant here instead.',
          '',
          'These are **tabs** in both variants: `role="tablist"`, arrow-key navigation, panels that swap. A segmented control is a radio group, for picking a value where the choice itself is the outcome — if that is what a screen needs, a `Radio.Group` or a `Select` is the honest control.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function Panels() {
  return (
    <>
      {TABS.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value}>
          <Stack gap="8">
            <Title order={3} fz="var(--sds-size-heading-f4)">
              {tab.label}
            </Title>
            <Text c="var(--sds-surfaces-text-secondary)">
              The panel for {tab.label.toLowerCase()}. Panels are unstyled beyond the space that
              separates them from the bar — Figma draws the menu, not what it reveals.
            </Text>
          </Stack>
        </Tabs.Panel>
      ))}
    </>
  )
}

/** Every prop wired to a control. Click a tab, or tab into the bar and use the arrow keys. */
export const Playground: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        {TABS.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/**
 * As drawn: six equal cells across the bar, the 1px `Neutral/03` rule running behind them, and a 3px
 * gradient over the rule on the active tab — `Action/Primary/Active` into `Accent/Product Accent`.
 * Hover a tab for the same line at 1px.
 */
export const Default: Story = {
  render: Playground.render,
}

/**
 * `inverted={false}`, for a bar that opens a section instead of closing one. Same treatment, mirrored:
 * the rule and the indicator move under the labels.
 */
export const Underline: Story = {
  args: { inverted: false },
  render: Playground.render,
}

/**
 * Two tabs, which is where the indicator's travel reads most clearly, and the shape a tab bar most
 * often takes outside a marketing page.
 */
export const TwoTabs: Story = {
  args: { defaultValue: 'overview' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="specification">Specification</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <Text c="var(--sds-surfaces-text-secondary)">The overview panel.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="specification">
        <Text c="var(--sds-surfaces-text-secondary)">The specification panel.</Text>
      </Tabs.Panel>
    </Tabs>
  ),
}

/**
 * A disabled tab — not a state Figma draws. It follows the half-opacity every other disabled control
 * in this library uses, and the arrow keys skip it.
 */
export const DisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="websites">Enterprise Websites</Tabs.Tab>
        <Tabs.Tab value="commerce">Digital Commerce</Tabs.Tab>
        <Tabs.Tab value="portals" disabled>
          Customer Portals
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="websites">
        <Text c="var(--sds-surfaces-text-secondary)">Enterprise websites.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="commerce">
        <Text c="var(--sds-surfaces-text-secondary)">Digital commerce.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="portals">
        <Text c="var(--sds-surfaces-text-secondary)">Customer portals.</Text>
      </Tabs.Panel>
    </Tabs>
  ),
}

/**
 * The mobile treatment, which the design draws as a 758px bar inside a 366px frame: the tabs hug their
 * labels and the row scrolls. Switch the Storybook viewport to a phone — the breakpoint is the
 * viewport, at 1200px, the same one the segmented control uses.
 */
export const Scrolling: Story = {
  render: Playground.render,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

/* -------------------------------------------------------------------------------- pills */

/** **`variant="pills"`** — Figma `Tabs Pill Menu`. The pill slides between tabs. */
export const Pills: Story = {
  args: { variant: 'pills', defaultValue: 'commerce' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        {TABS.slice(0, 4).map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/** `grow` spreads the pills across the container, which is how the Figma cell is drawn. */
export const PillsGrow: Story = {
  args: { variant: 'pills', defaultValue: 'websites' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List grow>
        {TABS.slice(0, 3).map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/**
 * Labels of very different lengths. The pill is measured from the active tab rather than assuming equal
 * widths, so it fits each one — which is the case that a CSS-only implementation gets wrong.
 */
export const PillsUnevenLabels: Story = {
  args: { variant: 'pills', defaultValue: 'search' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="websites">Enterprise Websites and Portals</Tabs.Tab>
        <Tabs.Tab value="search">Search</Tabs.Tab>
        <Tabs.Tab value="commerce">Digital Commerce</Tabs.Tab>
        <Tabs.Tab value="apps">Apps</Tabs.Tab>
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/** `Show Icon Left` — the pill's icon slot, at 20px on desktop and 16px below 1200px. */
export const PillsWithIcons: Story = {
  args: { variant: 'pills', defaultValue: 'commerce' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List grow>
        <Tabs.Tab value="websites" leftSection={<IconGlassComposable />}>
          Websites
        </Tabs.Tab>
        <Tabs.Tab value="commerce" leftSection={<IconGlassDatabase />}>
          Commerce
        </Tabs.Tab>
        <Tabs.Tab value="portals" leftSection={<IconGlassMail />}>
          Portals
        </Tabs.Tab>
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/** A disabled pill. Figma draws no disabled cell; this is the half-opacity every other control uses. */
export const PillsDisabled: Story = {
  args: { variant: 'pills', defaultValue: 'websites' },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        {TABS.slice(0, 4).map((tab, index) => (
          <Tabs.Tab key={tab.value} value={tab.value} disabled={index === 2}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/** **`Sizes=Mobile`** — a 44px pill, 12px between them, a 16px icon, and a bar that scrolls. */
export const PillsMobile: Story = {
  args: { variant: 'pills', defaultValue: 'websites' },
  parameters: { viewport: { defaultViewport: 'mobile1' }, frame: { width: 366 } },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        {TABS.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
}

/** The two variants together: the underline bar Figma calls `Tabs Menu Bottom`, and the pill menu. */
export const Variants: Story = {
  render: (args) => (
    <Stack gap="60">
      <Tabs {...args} variant="default" defaultValue="websites">
        <Tabs.List>
          {TABS.slice(0, 4).map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <Tabs {...args} variant="pills" defaultValue="websites">
        <Tabs.List>
          {TABS.slice(0, 4).map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Stack>
  ),
}
