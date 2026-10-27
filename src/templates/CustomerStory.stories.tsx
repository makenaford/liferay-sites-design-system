import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { presetFor } from './page-presets'

function CustomerStoryPage() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={presetFor('customer-story')!.create()} />
      <SiteFooter />
    </>
  )
}

const meta = {
  title: 'Built Pages/Assets to Web/Customer Story',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'One customer’s story — `Solutions Library` -> `Customer Story` (node `24179:45329`).',
          '',
          'The same page as the `Customer Story` preset in `Templates/Page Templates`, rendered from `presetFor(\'customer-story\')`: the customer’s logo over the hero heading and a read-time tag, the outlined write-up with a `Key Metrics` panel down the right, then what to read next. The copy is the frame’s own placeholder.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole story. */
export const Page: Story = { render: () => <CustomerStoryPage /> }

/** The same story at a phone's width, where the metrics panel drops under the write-up. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <CustomerStoryPage />,
}
