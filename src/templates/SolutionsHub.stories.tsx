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
          'The Liferay Solutions hub — liferay.com/solutions, as the solutions-and-capabilities mockup lays it out. Rendered from `solutions-hub-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The solutions are two card grids — `Portals` three across, `Websites & Commerce` two — each card a glass icon, the pitch and one customer’s figure. The industries are a `tabbedContent` with each tab’s three figures under its picture, and the platform is the same `capabilityMap` the Home page draws.',
          '',
          '## Not final yet',
          '',
          '- **The pictures are stand-ins** from elsewhere in the library — the commerce dashboard in the hero, and a borrowed photograph per industry tab.',
          '- **Each solution’s three feature bullets are folded into its description**, because a card has no bullet list.',
          '- **The mockup’s `Jump to` bar, `Browse all industries` and `Browse all customer stories` are not drawn**; the sections carry anchors (`#portals`, `#websites-commerce`, `#industries`, `#platform`, `#faq`) for a sub-nav to point at.',
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
