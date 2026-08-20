import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { Accordion } from './Accordion'
import { Button } from '../Button'
import { Link } from '../Link'
import { IconArrowRight, IconInformation, IconQuestion } from '../../icons'

const FAQ = [
  {
    value: 'hosting',
    label: 'Where is my data hosted?',
    body: 'In the region you pick when you provision the environment, on infrastructure we operate — and it stays there. Nothing is replicated outside it without you asking for it.',
  },
  {
    value: 'migration',
    label: 'How long does a migration take?',
    body: 'A single site is usually four to six weeks. A portfolio of twenty is a programme, not a project, and the first two sites set the pattern for the rest.',
  },
  {
    value: 'support',
    label: 'What is included in support?',
    body: '24/7 for anything that stops a production site, with a named engineer once you are live. Everything else runs through the same ticket queue your team already uses.',
  },
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { size: 'lg', defaultValue: 'hosting' },
  argTypes: {
    size: {
      options: ['lg', 'sm'],
      control: 'inline-radio',
      description: "Figma's `Size`: `lg` is Default, `sm` is Condensed.",
    },
    multiple: { control: 'boolean' },
    order: { options: [undefined, 2, 3, 4, 5, 6], control: 'select' },
    disableChevronRotation: { control: 'boolean' },
    chevronPosition: { options: ['left', 'right'], control: 'inline-radio' },
    chevron: { control: false },
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    frame: { width: 600 },
    docs: {
      description: {
        component: [
          'Figma `Accordion` component set (node `17019:127517`) — two variants across `Expand` × `Size` — on Mantine’s `Accordion`.',
          '',
          '`size="lg"` is Figma’s **Default** (56px row, 21px semibold label, 32px arrow) and `size="sm"` its **Condensed** (40px, 18px, 24px). The row height comes from the arrow rather than the text, which is why 32 + 24 = 56 and 24 + 16 = 40.',
          '',
          '**The rule is the state.** Figma changes the divider under the header from flat `Neutral/02` to a `Neutral/06` → `Brand/Primary/Lighten/3` gradient when the row opens. Hover brings that gradient half way up, so a row previews what clicking it does. Everything between the two drawn cells — hover, press, focus — is inferred; see the component docs for each.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. */
export const Playground: Story = {
  render: (args) => (
    <Accordion {...args}>
      {FAQ.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>{item.label}</Accordion.Control>
          <Accordion.Panel>
            <p>{item.body}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
}

/** **`Size=Default`** — the 56px row, `Paragraph/Large/Semi Bold`, a 32px arrow. */
export const Large: Story = { ...Playground, args: { size: 'lg' } }

/** **`Size=Condensed`** — 40px, `Paragraph/Default/Semi Bold`, a 24px arrow. */
export const Small: Story = { ...Playground, args: { size: 'sm' } }

/** The two sizes together, which is the clearest way to see which one a layout wants. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="40">
      {(['lg', 'sm'] as const).map((size) => (
        <Stack key={size} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            size=&quot;{size}&quot;
          </Text>
          <Accordion {...args} size={size}>
            {FAQ.slice(0, 2).map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>{item.label}</Accordion.Control>
                <Accordion.Panel>
                  <p>{item.body}</p>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Stack>
      ))}
    </Stack>
  ),
}

/** **`Expand=Closed`** for every row — nothing open, which is what a long FAQ should start as. */
export const AllClosed: Story = { ...Playground, args: { defaultValue: null } }

/**
 * `multiple` lets rows stay open together. Figma draws one at a time, and one at a time is the default:
 * it keeps the page from growing under the reader while they are still in it.
 */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['hosting', 'support'] },
  render: (args) => (
    <Accordion {...args}>
      {FAQ.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>{item.label}</Accordion.Control>
          <Accordion.Panel>
            <p>{item.body}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
}

/**
 * `order` wraps each control in a real heading, so a screen reader can navigate a page of these by
 * heading rather than by tabbing every row. There is no default: only the page knows whether these sit
 * under an `h2`.
 */
export const Headings: Story = { ...Playground, args: { order: 3 } }

/** The `icon` slot on a control, before the label. Not in Figma; it inherits the label's colour. */
export const WithIcon: Story = {
  render: (args) => (
    <Accordion {...args}>
      {FAQ.map((item, index) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control icon={index === 2 ? <IconInformation /> : <IconQuestion />}>
            {item.label}
          </Accordion.Control>
          <Accordion.Panel>
            <p>{item.body}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
}

/** The arrow on the leading edge instead, which suits a dense list of short labels. */
export const ChevronLeft: Story = { ...Playground, args: { chevronPosition: 'left', size: 'sm' } }

/** A disabled row. Figma draws no disabled state; this is the half-opacity every other control uses. */
export const Disabled: Story = {
  render: (args) => (
    <Accordion {...args}>
      {FAQ.map((item, index) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control disabled={index === 1}>{item.label}</Accordion.Control>
          <Accordion.Panel>
            <p>{item.body}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
}

/**
 * A panel is a slot, not a paragraph: the 10px gap Figma draws between its children is what stacks
 * several blocks of content inside one row.
 */
export const RichPanel: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue="migration">
      <Accordion.Item value="migration">
        <Accordion.Control>What does a migration actually involve?</Accordion.Control>
        <Accordion.Panel>
          <p>
            Three phases, and the first one is the only one with any real uncertainty in it: an audit of
            what you have, a pattern set built from the two hardest pages, then the rest at pace.
          </p>
          <p>The second site is normally a third of the effort of the first.</p>
          <Group gap="16">
            <Button size="sm" rightSection={<IconArrowRight />}>
              Book a migration review
            </Button>
            <Link href="#" size="md">
              Read the playbook
            </Link>
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="cost">
        <Accordion.Control>How is it priced?</Accordion.Control>
        <Accordion.Panel>
          <p>Per environment, not per seat. The migration itself is a fixed scope once the audit lands.</p>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
}

/**
 * A header long enough to wrap. Figma's cell hugs one line; a real question does not, so the label
 * wraps rather than truncating — an ellipsis on a question hides the part that identifies it.
 */
export const LongHeader: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue="long">
      <Accordion.Item value="long">
        <Accordion.Control>
          If we already run two content platforms and a separate commerce stack, what does consolidating
          onto one platform actually change for the teams that maintain them?
        </Accordion.Control>
        <Accordion.Panel>
          <p>
            One deployment pipeline, one set of components, and one place where a change to the header
            happens. The teams stay; the handoffs between them stop.
          </p>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="short">
        <Accordion.Control>And the licence cost?</Accordion.Control>
        <Accordion.Panel>
          <p>Usually lower than the sum of what it replaces, which is the easy part of the case.</p>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ),
}
