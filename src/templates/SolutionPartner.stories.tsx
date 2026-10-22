import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { SOLUTION_PARTNER_PAGE } from './solution-partner-page'

function SolutionPartner() {
  return (
    <>
      <SiteHeader />
      <PageRenderer page={SOLUTION_PARTNER_PAGE} />
      {/* No `Ready for the future?` band: the page closes on its own application form. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Partner Pages/Solution Partner',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay Solution Partner page — the `COPY - Solutions` tab of `LRDC Partner Pages Revamp`, on the OEM Partner page’s template, rendered from `solution-partner-page.ts` through `PageRenderer`.',
          '',
          'It adds `tierTable` — `Partner Levels Designed for Growth`: the four tiers as cards, then the program overview, with the Program Benefits and Program Requirements tables behind a pill bar (the sheet’s `COPY - Solutions 5. Partnership` tab). The partner tracks are two tabs whose accordion rows carry bullet lists. `Become a Solution Partner` jumps to the application band, on the darkened mesh.',
          '',
          '## Not final yet',
          '',
          '- **The pictures are stand-ins** — the AI Hub film and a still from it, and Home’s trending images on the two success stories. The quotes’ video thumbnails are not drawn yet.',
          '- **The `Why Partner` layout is ours** — the sheet leaves it to design; here it is six tagged cards.',
          '- **The `Other Ways to Partner` descriptions are the OEM page’s**; the sheet gives only names and `Learn More`.',
          '- **The logo strip is wordmarks**, and every link is `href="#"`. The form and the Info Kit download do nothing.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <SolutionPartner /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <SolutionPartner />,
}
