import type { Meta, StoryObj } from '@storybook/react-vite'
import { SecondaryNav, type SecondaryNavItem } from '../components/SecondaryNav'
import { IconGlassDigitalCommerce } from '../icons/glass.generated'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { SOLUTIONS_DETAIL_PAGE } from './solutions-detail-page'

/*
 * The solution's own bar, `Secondary Nav` in the frame's hero (node `25339:81552`): `Digital Commerce`
 * with four sections, drawn closed. What each opens is the page's own: its sections and its resources.
 */
const DETAIL_NAV: SecondaryNavItem[] = [
  {
    value: 'related-solutions',
    label: 'Related Solutions',
    links: [
      { label: 'Customer Portals', href: '#' },
      { label: 'Partner Portals', href: '#' },
      { label: 'Supplier Portals', href: '#' },
      { label: 'Browse all solutions', href: '#' },
    ],
  },
  {
    value: 'capabilities',
    label: 'Capabilities',
    links: [
      { label: 'Key customer portal capabilities', href: '#capabilities' },
      { label: 'Customer portal features', href: '#features' },
      { label: 'What sets Liferay portals apart', href: '#why-liferay' },
    ],
  },
  {
    value: 'industries',
    label: 'Industries',
    links: [
      { label: 'Financial Services', href: '#' },
      { label: 'Manufacturing', href: '#' },
      { label: 'Public Sector', href: '#' },
      { label: 'Browse all industries', href: '#' },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { label: 'Plan your customer portal', href: '#resources' },
      { label: 'Built on Liferay', href: '#built-on-liferay' },
      { label: 'Frequently asked questions', href: '#faq' },
    ],
  },
]

function SolutionsDetail() {
  return (
    <>
      <SiteHeader />
      {/* Directly before the hero, which reaches up behind both bars — see `.secondaryNav + .hero`. */}
      <SecondaryNav
        icon={<IconGlassDigitalCommerce size={32} />}
        title="Digital Commerce"
        items={DETAIL_NAV}
        mt="var(--sds-header-offset, 65px)"
      />
      <PageRenderer page={SOLUTIONS_DETAIL_PAGE} />
      {/* The page makes its own closing ask before the FAQ, so the footer's band is left off. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Product Pages/Solutions Detail',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'A solution’s own page, laid out as the Solutions Library’s `Solutions Detail` frame (Figma `Solutions-Library--2026`, node `25152:59285`). Rendered from `solutions-detail-page.ts` through `PageRenderer`, so every section is a library section type rather than bespoke markup.',
          '',
          'The hero is the frame’s `Hero` (node `25339:81552`, `layout: \'media-proof\'`): the `Digital Commerce` bar under the site header, the heading and value props beside the picture, then the email field and links beside the Gartner section under the picture. Then the logos, the key capabilities, the overview, the challenges, the feature tabs, two capability grids, a customer story, why Liferay, the customer carousel, the resources, the closing ask and the FAQ — in the frame’s order.',
          '',
          '## Not final yet',
          '',
          '- **Placeholder copy is replaced.** Where the frame draws placeholders (`This is an example of a key feature`, `Team Name 1`, `Capability 1`, `Challenge Description Example`, `Customer Story Title`, the FAQ), the words are the `solution` preset’s customer-portal copy.',
          '- **The feature tabs past `Self Service` are drafts.** The frame draws only that tab’s panel; Whitepaper, Onboarding, Integration and Content Management carry short drafted copy over the same photograph.',
          '- **The customer story has no logo tabs.** The frame’s `Tabs Menu Logo` row under it is not a section type yet; the story renders as `customerStory`.',
          '- **The challenges draw one link per row**; the frame draws two (`CTA Link 1`, `CTA Link 2`).',
          '- **The `What is a customer portal?` callout** is the content block’s lead line and link rather than the frame’s bordered card with an arrow.',
          '- **The logos are liferay.com’s customer strip**, not the frame’s set — the same six marks the hub runs. Every link is `href="#"`, and the forms send nothing.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <SolutionsDetail /> }

/** The same page at a phone's width. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <SolutionsDetail />,
}
