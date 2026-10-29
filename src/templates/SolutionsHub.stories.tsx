import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { SOLUTIONS_HUB_PAGE } from './solutions-hub-page'

function SolutionsHub() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={SOLUTIONS_HUB_PAGE} />
      {/* No `Ready for the future?` band: the page makes its own ask before the reading and the FAQ. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Product Pages/Solutions Hub',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay Solutions hub, laid out as the Solutions Library’s `Solutions Hub` frame (Figma `Solutions-Library--2026`, node `24920:83473`) with the copy of liferay.com/solutions as the solutions-and-capabilities mockup has it. Rendered from `solutions-hub-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The frame brought the media-and-proof hero; card grids whose cards carry a checked list and a figure (`Common Cards` `Type=Portal`) or a picture, two links and three figures (`Type=Industry`); the customer carousel with a button on its heading; a centred line under the product map; the closing ask as a panel on the footer’s drifting mesh (`surface: \'card\'`, `backdrop: \'mesh\'`); and the FAQ with its key takeaways beside the questions (`layout: \'side\'`).',
          '',
          '## Not final yet',
          '',
          '- **The frame draws three industries**, its second row repeating the first; the mockup has six. Energy & Utilities, Healthcare and All Industries borrow a photograph each from elsewhere in the library, and lead with the library’s Energy and supply, Healthcare 2 and Integration icons.',
          '- **The icons are the frame’s, including two it repeats**: Enterprise-Grade Websites leads with User Validation and Digital Commerce with Partner Portals 2, as drawn.',
          '- **The frame shows the customer carousel twice**; the mockup has it once, so this page does too.',
          '- **Meridian Bank is the mockup’s own example customer**, not a published story. Every link is `href="#"`, and the forms send nothing.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <SolutionsHub /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <SolutionsHub />,
}
