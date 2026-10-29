import type { Meta, StoryObj } from '@storybook/react-vite'
import { SecondaryNav, type SecondaryNavItem } from '../components/SecondaryNav'
import { IconGlassIndustriesIntegration } from '../icons/glass.generated'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { SOLUTIONS_HUB_PAGE } from './solutions-hub-page'

/*
 * The hub's own bar, `Secondary Nav` in the frame's hero (node `24920:87684`). The frame draws the four
 * sections closed, so what each opens is the page's own: its sections, its customers and its guides.
 */
const SOLUTIONS_NAV: SecondaryNavItem[] = [
  {
    value: 'new-to-liferay',
    label: 'New to Liferay',
    links: [
      { label: 'What can you build on Liferay DXP?', href: '#overview' },
      { label: 'Portals', href: '#portals' },
      { label: 'Websites & Commerce', href: '#websites-commerce' },
      { label: 'Solutions by industry', href: '#industries' },
    ],
  },
  {
    value: 'learn',
    label: 'Learn',
    links: [
      { label: 'Every solution runs on one AI-enhanced platform', href: '#platform' },
      { label: 'Frequently asked questions', href: '#faq' },
      { label: 'Switch to the Platform Capabilities hub', href: '#' },
    ],
  },
  {
    value: 'customer-stories',
    label: 'Customer Stories',
    links: [
      { label: 'Sky TV: 140% increase in customer self-service', href: '#customer-stories' },
      { label: 'City of Vienna: 100M+ site views per month', href: '#customer-stories' },
      { label: 'Broadcom: 845 features implemented', href: '#customer-stories' },
      { label: 'Browse all customer stories', href: '#' },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { label: 'Web portals explained: types, features, and how to choose a platform', href: '#resources' },
      { label: 'DXP vs. CMS vs. portal: which architecture fits your roadmap?', href: '#resources' },
      { label: 'The B2B commerce requirements checklist for manufacturers', href: '#resources' },
    ],
  },
]

function SolutionsHub() {
  return (
    <>
      <SiteHeader />
      {/* Directly before the hero, which reaches up behind both bars — see `.secondaryNav + .hero`. */}
      <SecondaryNav
        icon={<IconGlassIndustriesIntegration size={32} />}
        title="Solutions"
        items={SOLUTIONS_NAV}
        mt="var(--sds-header-offset, 65px)"
      />
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
          'The Liferay Solutions hub, laid out as the Solutions Library’s `Solutions Hub` frame (Figma `Solutions-Library--2026`, node `24920:83473`) with the copy of liferay.com/solutions as the solutions-and-capabilities mockup has it. Rendered from `solutions-hub-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The hero is the frame’s `Hero` (node `24920:87684`): the `Solutions` product bar under the site header, then one column — the heading, the value props, the email field, the links, and the rating beside the badges with the marks under it — beside the picture, on the corner bubble that runs up behind both bars.',
          '',
          'The page frame brought card grids whose cards carry a checked list and a figure (`Common Cards` `Type=Portal`) or a picture, two links and three figures (`Type=Industry`); the customer carousel with a button on its heading; a centred line under the product map; the closing ask as a panel (`Page Action Section`, node `25113:53301`) on the footer’s drifting mesh, darkened and recoloured from the hero’s bubble — indigo, electric blue, cyan and violet down its right side under a dark vignette — with its button and `Not ready yet?` sharing one row (`surface: \'card\'`, `backdrop: \'mesh\'`); and the FAQ with its key takeaways beside the questions (`layout: \'side\'`).',
          '',
          '## Not final yet',
          '',
          '- **The `Solutions` bar’s menus are drafts.** The frame draws its four sections closed, so each opens links to this page’s own sections, customers and guides.',
          '- **The rating line keeps the mockup’s figures** (233 users, September 2026); the hero frame’s reads 64 users, May 2026.',
          '- **The frame draws three industries**, its second row repeating the first; the mockup has six. Energy & Utilities, Healthcare and All Industries borrow a photograph each from elsewhere in the library, and lead with the library’s Energy and supply, Healthcare 2 and Integration icons.',
          '- **The icons are the frame’s, including two it repeats**: Enterprise-Grade Websites leads with User Validation and Digital Commerce with Partner Portals 2, as drawn.',
          '- **The frame shows the customer carousel twice**; the mockup has it once, so this page does too.',
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
