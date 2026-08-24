import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'

import { HOME_PAGE } from './home-page'

const meta = {
  title: 'Templates/Schema proof',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The **whole Home page** rendered from data rather than JSX. All eleven sections come out to the same heights as the hand-written `Templates/Home`, and every interaction is the real one — three pill bars, an underline bar, a snapping carousel, an accordion, a running marquee.',
          '',
          '**Nothing in the page data is a measurement.** No widths, no gaps, no `bleed`, no component imports — only content and the handful of real choices. Every drawn number lives in `PageRenderer`, once per section type, because it belongs to the *kind* of section rather than to the page.',
          '',
          'Porting it caught two things reading the code had not: the hand-written page used a 40px gap in one tabbed section where the file draws 24, and the two three-column resource grids are a different Figma cell from the goals grid with a different gap — which is why `resourceGrid` is its own type rather than `cardGrid` with a `columns` knob.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page, from data, with the shared chrome around it. */
export const FromData: Story = {
  render: () => (
    <>
      <SiteHeader />
      <PageRenderer page={HOME_PAGE} />
      <SiteFooter />
    </>
  ),
}
