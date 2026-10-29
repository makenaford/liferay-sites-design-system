import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { OEM_PARTNER_PAGE } from './oem-partner-page'

function OemPartner() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={OEM_PARTNER_PAGE} />
      {/* No `Ready for the future?` band: the page closes on its own application form. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Partner Pages/OEM Partner',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay OEM partner page — Partner Pages -> `OEM` (node `148:27740`). Rendered from `oem-partner-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The feature cards in glass; `Why Partner` and `Is Liferay the Right Partner` as one-tab `tabbedContent`s beside the agent-builder photograph; the partner quotes with each partner’s logo opposite the quote mark; and `Path to Partnership` on a still corner glow (`backdrop: \'glow\'`). `Become an OEM Partner` in the hero jumps to the form.',
          '',
          '## Not final yet',
          '',
          '- **Four of the five `Why Partner` answers and two of the three FAQ answers are drafts**; the file shows only the open rows.',
          '- **The ecosystem cards repeat the frame’s icons** — DAM on both destinations, the person-and-cubes mark on both programs.',
          '- **Every link is `href="#"`**, as on every other built page. The form sends nothing.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <OemPartner /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <OemPartner />,
}
