import type { Meta, StoryObj } from '@storybook/react-vite'
import connectedSystems from '../../assets/solutions-hub/connected-systems.png'
import { SecondaryNav, type SecondaryNavItem } from '../components/SecondaryNav'
import { IconGlassIndustriesIntegration } from '../icons/glass.generated'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import type { PageSpec } from './page-schema'
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

function SolutionsHub({ page = SOLUTIONS_HUB_PAGE }: { page?: PageSpec }) {
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
      <PageRenderer page={page} />
      {/* No `Ready for the future?` band: the page makes its own ask before the reading and the FAQ. */}
      <SiteFooter cta={false} />
    </>
  )
}

/*
 * The hero as the Solutions Library's image hero draws it (Figma node `25298:61859`): its heading and
 * one-line value props, and the analyst at the wall of dashboards with the CRM, ERP and IoT systems
 * wired into a customer portal — the picture is the frame's own. The rest of the page is unchanged.
 */
const IMAGE_HERO: PageSpec = {
  ...SOLUTIONS_HUB_PAGE,
  hero: {
    ...SOLUTIONS_HUB_PAGE.hero,
    title: { text: 'Tailor the Solutions You Need on a Flexible Platform' },
    points: [
      { icon: 'file-code', text: 'Extend legacy systems by connecting existing and new applications' },
      { icon: 'sparkles', text: 'Connect CRM, ERP, and other systems through APIs and prebuilt connectors' },
      { icon: 'list-check', text: 'Unify data across enterprise systems to accelerate AI adoption' },
    ],
    proof: SOLUTIONS_HUB_PAGE.hero.proof && {
      ...SOLUTIONS_HUB_PAGE.hero.proof,
      rating: { score: '4.6', outOf: 5, source: 'by 64 verified users as of May 2026, Source: Gartner Peer Insights', sourceHref: '#' },
    },
    media: {
      src: connectedSystems,
      alt: 'An analyst with a tablet in front of a wall of dashboards, beside a customer portal wired to Salesforce CRM, SAP ERP and IoT',
      ratio: '3:2',
    },
  },
}

/*
 * The secondary hero, as the Page Hero Update file's centred hero draws it (node `19:1488`): no picture,
 * the whole first screen. The heading, the email field and the two outline buttons centred; the value
 * props as three glass cards led by their glass icons; the Gartner section under them; and the page's
 * logo marquee pinned to the hero's foot instead of following it as a section.
 */
const logoMarquee = SOLUTIONS_HUB_PAGE.sections.find((section) => section.type === 'logoMarquee')

const CENTERED_HERO: PageSpec = {
  ...SOLUTIONS_HUB_PAGE,
  hero: {
    ...SOLUTIONS_HUB_PAGE.hero,
    layout: 'centered-cards',
    align: 'center',
    background: 'full',
    breadcrumbs: undefined,
    media: undefined,
    links: undefined,
    title: { text: 'Simplify Buying Experiences and Scale Digital Commerce' },
    form: { placeholder: 'Enter your email', submit: 'Contact Sales' },
    buttons: [
      { label: 'Request a Demo', href: '#', variant: 'outline' },
      { label: 'Browse All Solutions', href: '#portals', variant: 'outline' },
    ],
    points: [
      { glassIcon: 'commerce', text: 'Add headless storefronts without replacing your existing ordering system' },
      { glassIcon: 'global-services', text: 'Reach new markets with multilingual, multicurrency storefronts' },
      { glassIcon: 'search', text: 'Help buyers find products with search tailored to past purchases' },
    ],
    proof: SOLUTIONS_HUB_PAGE.hero.proof && {
      ...SOLUTIONS_HUB_PAGE.hero.proof,
      rating: {
        score: '4.6',
        outOf: 5,
        source: 'by 64 verified users as of May 2026, Source: Gartner Peer Insights',
        sourceHref: '#',
      },
    },
    logos:
      logoMarquee?.type === 'logoMarquee' ? { label: logoMarquee.label, logos: logoMarquee.logos } : undefined,
  },
  sections: SOLUTIONS_HUB_PAGE.sections.filter((section) => section.type !== 'logoMarquee'),
}

/*
 * The split glass-card hero — option 3 of the Solutions hub hero versions, without its `Sign up now`
 * label or the cards' arrows: the heading, the email field and two links on the left; the three value
 * props from the `Solutions Hub` frame (node `25305:65773`) stacked as glass cards on the right, each led
 * by its glass icon; and the proof as a strip under both columns.
 */
const SPLIT_CARDS_HERO: PageSpec = {
  ...SOLUTIONS_HUB_PAGE,
  hero: {
    ...SOLUTIONS_HUB_PAGE.hero,
    layout: 'split-cards',
    breadcrumbs: undefined,
    media: undefined,
    title: { text: 'Build the Digital Solutions Your', highlight: 'Business Runs On' },
    form: { placeholder: 'Enter your email', submit: 'Contact Sales' },
    links: [
      { label: 'Start Free Trial', href: '#' },
      { label: 'Browse All Solutions', href: '#portals' },
    ],
    points: [
      {
        glassIcon: 'customer-portals',
        text: 'Built for complex B2B portals, with account hierarchies, fine-grained permissions and approvals',
      },
      { glassIcon: 'dxp', text: 'Run portals, content and B2B commerce on one platform instead of stitching separate tools' },
      { glassIcon: 'database', text: 'Deploy on-premises, in your private cloud or on Liferay SaaS, on an open-source core' },
    ],
    proof: SOLUTIONS_HUB_PAGE.hero.proof && {
      ...SOLUTIONS_HUB_PAGE.hero.proof,
      rating: {
        score: '4.6',
        outOf: 5,
        source: 'by 64 verified users as of May 2026, Source: Gartner Peer Insights',
        sourceHref: '#',
      },
    },
  },
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
          'The page frame brought card grids whose cards carry a checked list and a figure (`Common Cards` `Type=Portal`) or a picture, two links and three figures (`Type=Industry`); the customer carousel with a button on its heading; a centred line under the product map; the closing ask as a panel (`Page Action Section`, node `25113:53301`) on the footer’s drifting mesh, darkened and recoloured from the hero’s bubble — indigo, electric blue, cyan and violet down its right side under a dark vignette — laid out side by side — the ask on the left, the field with `Book a custom demo` and the newsletter link on the right (`surface: \'card\'`, `backdrop: \'mesh\'`, `layout: \'split\'`); and the FAQ with its key takeaways beside the questions (`layout: \'side\'`).',
          '',
          '## Not final yet',
          '',
          '- **The `Solutions` bar’s menus are drafts.** The frame draws its four sections closed, so each opens links to this page’s own sections, customers and guides.',
          '- **The rating line keeps the mockup’s figures** (233 users, September 2026); the hero frame’s reads 64 users, May 2026.',
          '- **The frame draws three industries**, its second row repeating the first; the mockup has six. Energy & Utilities, Healthcare and All Industries borrow a photograph each from elsewhere in the library, and lead with the library’s Energy and supply, Healthcare 2 and Integration icons.',
          '- **The icons are the frame’s, including two it repeats**: Enterprise-Grade Websites leads with User Validation and Digital Commerce with Partner Portals 2, as drawn.',
          '- **The frame shows the customer carousel twice**; the mockup has it once, so this page does too.',
          '- **The customer stories are liferay.com’s eight** (`customer-stories.ts`, shared with Home), with Mueller at the live site’s 70% where the Home page’s testimonials sheet says 73. Every link is `href="#"`, and the forms send nothing.',
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

/**
 * The image hero: the heading, one-line value props, the email field, the links and the proof beside
 * the connected-systems picture, as Figma node `25298:61859` draws it.
 */
export const ImageHero: Story = { render: () => <SolutionsHub page={IMAGE_HERO} /> }

/**
 * The secondary hero (Page Hero Update, node `19:1488`): centred, no picture, and all of it above the
 * fold — the heading, the email field, the outline buttons, three glass cards, the Gartner section, and
 * the logos pinned to the foot in a glass bar.
 */
export const CenteredHero: Story = { render: () => <SolutionsHub page={CENTERED_HERO} /> }

/**
 * The split glass-card hero: the heading, the email field and the links on the left, the value props as
 * stacked glass cards on the right, and the rating, badges and marks as a strip under both.
 */
export const SplitCardsHero: Story = { render: () => <SolutionsHub page={SPLIT_CARDS_HERO} /> }
