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
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay Solution Partner page — the copy of the `COPY - Solutions` sheet, laid out as Partner Pages -> `Solutions` (node `272:38182`). Rendered from `solution-partner-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          '`Why Partner` as a one-tab accordion beside a photograph; the partner quotes and success stories as one row of four picture cards; the two partner tracks side by side (`tabbedContent` `layout: \'columns\'`); the tier cards carrying each level’s points, certified headcount and fee over a foldable benefits table (`compareLabel`); `Path to Partnership` on the corner glow; and `Still Evaluating?` as a glass bar (`highlightText` `surface: \'glass\'`).',
          '',
          '## Not final yet',
          '',
          '- **Where the frame and the copy sheet disagree, the sheet’s words stand**: the frame repeats the OEM page’s `Why Partner` line and first step, names Steven LaGow under both quotes, labels every card `Read the Story`, and draws five `Why Partner` rows to the sheet’s six.',
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
export const Page: Story = { render: () => <SolutionPartner /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <SolutionPartner />,
}
