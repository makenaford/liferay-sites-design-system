import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { total: 68, defaultPageSize: 12, defaultPage: 2 },
  argTypes: {
    total: { control: { type: 'number', min: 0 } },
  },
  /* The 1280 column the blog category gives it, capped so a phone canvas does not scroll sideways. */
  decorators: [(Story) => <div style={{ width: 1280, maxWidth: '100%' }}>{Story()}</div>],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** The catalog's pager (node `24581:100572`): the count and the page buttons, no page-size menu. */
export const Default: Story = {}

/** `Blog Category Page` (node `25181:70081`): the `12 entries` menu ahead of the count. */
export const WithPageSize: Story = { args: { pageSizes: [12, 24, 48] } }

/** More pages than fit: five numbers at most, following the current page. */
export const ManyPages: Story = { args: { total: 400, defaultPage: 12 } }
