import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text, Title } from '@mantine/core'
import { AnchorNav } from './AnchorNav'

const SECTIONS = ['Overview', 'Features', 'Customers', 'Pricing', 'FAQ']
const slug = (label: string) => label.toLowerCase()

const meta = {
  title: 'Components/AnchorNav',
  component: AnchorNav,
  args: {
    items: SECTIONS.map((label) => ({ label, href: `#${slug(label)}` as const })),
    sticky: true,
    spy: true,
  },
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'Jump links to the sections of the page it sits on, under `SecondaryNav`. Not a frame in the Solutions Library — there is no anchor-link component there — so it is built from its neighbours: `SecondaryNav`’s glass and hairline, and the `Tabs` way of marking where you are.',
          '',
          '- **`spy`** marks the link for the section under the bar as the reader scrolls, measured off the bar’s own foot, so it holds whether the header is showing or has been replaced.',
          '- **`sticky`** keeps it under the product bar once the page scrolls to it.',
          '- A phone scrolls the links sideways rather than wrapping them.',
          '',
          'A page whose product bar has room can put `#fragment` items in `SecondaryNav` itself; this is for a bar that is full of menus.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof AnchorNav>

export default meta
type Story = StoryObj<typeof meta>

/** Scroll the canvas: the bar sticks, and the current link follows the section under it. */
export const Default: Story = {
  render: (args) => (
    <>
      <AnchorNav {...args} />
      <Stack gap={0}>
        {SECTIONS.map((label) => (
          <Box key={label} id={slug(label)} py={80} px={{ base: 20, md: 80 }} mih={480} style={{ scrollMarginTop: 72 }}>
            <Title order={2}>{label}</Title>
            <Text c="var(--sds-surfaces-text-secondary)" mt={8}>
              A section of the page, long enough to scroll past.
            </Text>
          </Box>
        ))}
      </Stack>
    </>
  ),
}
