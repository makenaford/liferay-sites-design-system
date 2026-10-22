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
  title: 'Built Pages/OEM Partner',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The Liferay OEM partner page — `Partner Pages` -> `OEM Partner` (node `87:20818`). Rendered from `oem-partner-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'It brought two section types: `quotes`, the partner quote cards, and `stepsForm`, the `Path to Partnership` band — the steps after applying beside the application form, on the footer’s drifting mesh (`backdrop: \'mesh\'`). `Become an OEM Partner` in the hero jumps to it.',
          '',
          '## Not final yet',
          '',
          '- **The pictures are stand-ins** — the AI Hub film in the hero and a still from it in the two media sections.',
          '- **Four of the five `Why Partner` answers and two of the three FAQ answers are drafts**; the file shows only the open rows.',
          '- **The logo strip is wordmarks**, and every link is `href="#"`, as on every other built page. The form sends nothing.',
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
