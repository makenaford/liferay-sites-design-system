import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { TECHNOLOGY_PARTNER_PAGE } from './technology-partner-page'

function TechnologyPartner() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={TECHNOLOGY_PARTNER_PAGE} />
      {/* No `Ready for the future?` band: the page closes on its own application form. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Partner Pages/Technology Partner',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay Technology Partner page — `Partner Pages` -> `Technology Partner` (node `106:25461`). The OEM Partner page’s template, rendered from `technology-partner-page.ts` through `PageRenderer`.',
          '',
          'It adds `partnershipModels` — the three partnership models down the right, each with what Liferay looks for in a partner — and a card grid of the support partners get. `Become a Technology Partner` and `Apply Now` both jump to the application band, on the darkened mesh.',
          '',
          '## Not final yet',
          '',
          '- **The pictures are stand-ins** — the AI Hub film in the hero and a still from it in the two media sections.',
          '- **Copy the frame carried over from the OEM page is rewritten here**: the first FAQ answer, the form’s title and the last step. Those, three of the four `Why Partner` answers and four of the five FAQ answers are drafts.',
          '- **The logo strip is wordmarks**, and every link is `href="#"`, as on every other built page. The form sends nothing.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <TechnologyPartner /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <TechnologyPartner />,
}
