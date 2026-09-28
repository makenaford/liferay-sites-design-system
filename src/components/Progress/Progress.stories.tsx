import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '@mantine/core'
import { Progress } from './Progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 50, label: 'Course progress' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    state: { control: 'inline-radio', options: [undefined, 'loading', 'warning', 'completed'] },
  },
  /* The width the course card gives it, capped so a phone canvas does not scroll sideways. */
  decorators: [(Story) => <div style={{ width: 363, maxWidth: '100%' }}>{Story()}</div>],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** `State=Loading, Value=50%` — the cell the Learn course card draws. */
export const Default: Story = {}

/** Every `State`, at the values the file draws them. `Completed` swaps the figure for a check. */
export const States: Story = {
  render: () => (
    <Stack gap={24}>
      <Progress value={50} label="Loading" />
      <Progress value={30} state="warning" label="Warning" />
      <Progress value={100} label="Completed" />
    </Stack>
  ),
}

/** The `Value` axis, 0 to 90 — then 100, which is `Completed` rather than a full `Loading` bar. */
export const Values: Story = {
  render: () => (
    <Stack gap={16}>
      {[0, 10, 30, 50, 70, 90, 100].map((value) => (
        <Progress key={value} value={value} label={`${value} percent`} />
      ))}
    </Stack>
  ),
}
