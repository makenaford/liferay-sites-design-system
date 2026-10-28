import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { PARTNER_HOME_PAGE } from './partner-home-page'

function PartnerHome() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={PARTNER_HOME_PAGE} />
      {/* No `Ready for the future?` band: the frame goes from the ecosystem cards straight to the links. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Partner Pages/Partner Home',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay partner home page — Partner Pages -> `Partner Home` (node `148:32204`). Rendered from `partner-home-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'A left-aligned hero with the handshake photograph; `Why Partner` as a one-tab `tabbedContent` — the accordion led by a UI icon per row, beside one picture; the three programs and the two ecosystem destinations as glass card grids; the figures band; and the partner quotes on their own logo tiles.',
          '',
          '## Not final yet',
          '',
          '- **The partner logos are wordmarks**, not the partners’ own marks; the frame’s strip is a placeholder set.',
          '- **`Reach Enterprise Customers` is a draft answer** — the frame leaves that row closed.',
          '- **Every link is `href="#"`**, as on every other built page.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <PartnerHome /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <PartnerHome />,
}
