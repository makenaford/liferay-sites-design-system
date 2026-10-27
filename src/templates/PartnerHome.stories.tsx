import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { PARTNER_HOME_PAGE } from './partner-home-page'

function PartnerHome() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={PARTNER_HOME_PAGE} />
      <SiteFooter />
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
          'The Liferay partner home page — Grow more. Deliver faster. Rendered from `partner-home-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The page is the reason four section types grew a little: a `tabbedContent` with one tab leaves its pill bar out, a `statsBar` can take a centred heading, a story can be a quote with no figure, and a `cardGrid` can be two across with a button on each card.',
          '',
          '## Not final yet',
          '',
          '- **The partner logos are wordmarks**, not the partners’ own marks.',
          '- **The program images are stand-ins** from `assets/home/`, and the panel heading over the three programs is ours — the draft has none.',
          '- **The partner quotes use generated tiles**, since there are no partner thumbnails yet.',
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
