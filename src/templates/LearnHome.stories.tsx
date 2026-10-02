import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/Button'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { LEARN_HOME_PAGE } from './learn-home-page'
import { LEARN_NAV } from './learn-nav'
import { SITE_DRAWER_CONTROLS, siteActions } from './site-nav-render'

/* Language and log-in only: nobody on a documentation site is being sold to. */
const LEARN_ACTIONS = siteActions({ contactLabel: false })

const LEARN_DRAWER = {
  ...SITE_DRAWER_CONTROLS,
  login: { items: [{ label: 'Log In', href: '#' }] },
  /* Learn's own footer links to Contact Us, not Contact Sales. */
  cta: <Button size="md">Contact Us</Button>,
}

function LearnHome() {
  return (
    <>
      <SiteHeader menus={LEARN_NAV} actions={LEARN_ACTIONS} drawerControls={LEARN_DRAWER} />
      <PageRenderer page={LEARN_HOME_PAGE} />
      <SiteFooter />
    </>
  )
}

const meta = {
  title: 'Built Pages/Learn Home',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The learn.liferay.com home page, redesigned — `LEARN - New Pages` -> `Home - Redesign` (node `8495:4755`). Rendered from `learn-home-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'A different site from `Built Pages/Home`, so it takes Learn’s own bar: five menus from `learn-nav.ts`, and no Contact Sales. The hero is the reason `HeroSpec` grew `search` and `align` — a centred heading over a wide search field and the topics people search for most, with no media column at all.',
          '',
          '## Not like Learn yet',
          '',
          '- **The logo reads Liferay, not Learn.** `Header` has no subsite lockup.',
          '- **The footer is liferay.com’s.** `Footer` has no Learn variant.',
          '- **Every link is `href="#"`**, as on every other built page.',
          '- **The course names, popular topics and card descriptions are placeholder copy**, carried over from the Figma frame, and the article image is a stand-in from `assets/home/trending/`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. The search field, the nav and every card are the library's own components. */
export const Page: Story = { render: () => <LearnHome /> }

/** The same page at a phone's width, where the topic pills wrap under the search field. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <LearnHome />,
}
