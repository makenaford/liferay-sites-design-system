import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Grid, Stack, Text, Title } from '@mantine/core'
import { TableOfContents } from './TableOfContents'

const ITEMS = ['Key Takeaways', 'Background', 'Challenges', 'Implementation', 'Results'].map((label) => ({
  label,
  href: `#toc-demo-${label.toLowerCase().replace(/\s+/g, '-')}`,
}))

const meta = {
  title: 'Components/Table of Contents',
  component: TableOfContents,
  args: { label: 'Outline', items: ITEMS, active: 0, spy: false },
  argTypes: {
    label: { control: 'text' },
    active: { control: { type: 'number', min: 0, max: ITEMS.length - 1 } },
    spy: { control: 'boolean' },
  },
  parameters: {
    frame: { width: 240 },
    docs: {
      description: {
        component: [
          'Figma `Table of Contents` (node `17927:12691`), built from the `Toc Item` set. An outline label over a column of anchor rows; the active row takes a 3px `Brand/Primary/Primary` rail and primary text, the rest share a 1px `Neutral/03` rule.',
          '',
          'With `spy` on (the default) it follows the page: the active row is the last one whose `#id` target has scrolled past a third of the way down the viewport. Set `active` to drive it yourself.',
          '',
          '**One deviation:** Figma draws the active row 4px taller than the rest. Every row is the same height here, because the active row moves as the reader scrolls and the change would nudge every row under it.',
          '',
          'It does not position itself — sticking it beside an article is the page’s job. See `Templates/Page Templates` → Blog.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof TableOfContents>

export default meta
type Story = StoryObj<typeof meta>

/** The cell as drawn: five rows, the first active. Change `active` to move the rail. */
export const Default: Story = {}

/**
 * Following the page. Scroll the column on the right and the rail moves with the section you are
 * reading; click a row and the page jumps to it.
 */
export const FollowsThePage: Story = {
  args: { active: undefined, spy: true },
  parameters: { frame: { width: 960 } },
  render: (args) => (
    /* Side by side from `sm`; stacked on a phone, where there is no column for the outline. */
    <Grid gap={32} align="flex-start">
      <Grid.Col span={{ base: 12, sm: 4 }} style={{ position: 'sticky', top: 24 }}>
        <TableOfContents {...args} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 8 }}>
      <Stack gap={40}>
        {ITEMS.map((item) => (
          <Box key={item.href} id={item.href.slice(1)} style={{ minHeight: 480 }}>
            <Title order={2} size="h3" mb={16}>
              {item.label}
            </Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est metus, commodo vel
              condimentum ut, iaculis at felis. Donec sed sollicitudin mauris. Donec tempor, odio et
              fringilla vehicula, turpis dolor cursus lacus, sit amet pulvinar urna mi in ante.
            </Text>
          </Box>
        ))}
      </Stack>
      </Grid.Col>
    </Grid>
  ),
}
