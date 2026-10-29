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
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay Technology Partner page — Partner Pages -> `Technology` (node `272:35757`). Rendered from `technology-partner-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          '`Why Partner` and `Is Liferay the Right Partner` as one-tab `tabbedContent`s beside a photograph; the three partnership models behind a pill bar, each with what Liferay looks for in a partner (`PanelSpec.note`); the support partners get as glass cards; and `Path to Partnership` on the corner glow.',
          '',
          '## Not final yet',
          '',
          '- **The copy has not been checked against the `COPY - Technology` sheet yet.**',
          '- **The partnership models’ picture is a stand-in** — the frame draws a placeholder.',
          '- **The quote cards have no logos**: the frame’s are VAI and Placecube under SugarAI and Demandbase quotes.',
          '- **Three of the four `Why Partner` answers and five of the six FAQ answers are drafts**; the file shows only the open rows.',
          '- **Every link is `href="#"`**, as on every other built page. The form sends nothing.',
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
