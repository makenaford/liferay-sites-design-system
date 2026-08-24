import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import type { PageSpec } from './page-schema'
import { SiteFooter, SiteHeader } from './shared'

import goal1 from '../../assets/home/goal-1.png'
import goal2 from '../../assets/home/goal-2.png'
import goal3 from '../../assets/home/goal-3.png'
import goal4 from '../../assets/home/goal-4.png'
import heroMedia from '../../assets/home/hero-media.png'

/*
 * Three sections of the Home page, expressed as data instead of JSX.
 *
 * Chosen because they are the awkward ones. The hero carries a banner holding a bespoke solution
 * finder; the carousel band bleeds off both edges and swaps dots for arrows; the goals grid puts a
 * pill bar in its title row and swaps its cards behind it. If those three survive being reduced to
 * data, the ten easier sections will.
 *
 * Compare against `Templates/Home`. Everything below is content — no widths, no gaps, no `bleed`, no
 * component imports. All of that lives in `PageRenderer`, once per section type.
 */
const PAGE: PageSpec = {
  hero: {
    background: 'corner',
    banner: {
      kind: 'solutionFinder',
      label: 'Explore customized solutions',
      fields: [
        {
          label: 'Industry',
          width: 200,
          options: ['Financial Services', 'Public Sector', 'Manufacturing', 'Healthcare'],
        },
        {
          label: 'Use case',
          width: 320,
          options: [
            'Knowledge Management Systems',
            'Customer Portals',
            'Digital Commerce',
            'Intranets',
          ],
        },
      ],
      action: 'Continue',
    },
    title: {
      text: 'Launch Digital Experiences That',
      highlight: 'Convert, Scale and Grow',
    },
    description: {
      text: 'Liferay DXP is the agentic platform to automate content production, localize for global markets, launch unified commerce storefronts and dominate SEO/AEO on a',
      emphasis: 'single, intelligent platform and Headless CMS.',
    },
    form: { placeholder: 'Enter Your Email', submit: 'Start Free Trial' },
    action: { label: 'Request a Demo', href: '#' },
    proof: {
      rating: { score: '4.6', outOf: 5, source: 'Source: Gartner Peer Insights™' },
      marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPPA', 'CSTAR'],
    },
    media: {
      src: heroMedia,
      alt: 'A Liferay-built product catalogue with simulation and asset-intelligence tools',
    },
  },

  sections: [
    {
      type: 'cardGrid',
      title: 'What Teams Can Achieve with Liferay',
      tabs: [
        {
          value: 'marketers',
          label: 'Marketers',
          icon: 'presentation',
          content: [
            {
              title: 'Launch Campaigns Across Channels Faster',
              href: '#',
              image: { src: goal1, alt: 'A campaign board with a rocket and a Publish button' },
            },
            {
              title: 'Drive Conversions with Tailored Experiences',
              href: '#',
              image: {
                src: goal2,
                alt: 'Segment rules switching between an enterprise buyer and a returning customer',
              },
            },
            {
              title: 'Drive B2B Revenue with 24/7 Self-Serve Commerce',
              href: '#',
              image: {
                src: goal3,
                alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
              },
            },
            {
              title: 'Turn Analytics into Immediate Action',
              href: '#',
              image: { src: goal4, alt: 'An analytics dashboard prompting a segmented campaign' },
            },
          ],
        },
        {
          value: 'developers',
          label: 'IT / Developers',
          icon: 'brackets-angle',
          content: [
            {
              title: 'Ship Features Without Rebuilding the Platform',
              href: '#',
              image: {
                src: goal3,
                alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
              },
            },
            {
              title: 'Extend Anything Through Headless APIs',
              href: '#',
              image: {
                src: goal2,
                alt: 'Segment rules switching between an enterprise buyer and a returning customer',
              },
            },
            {
              title: 'Run One Platform Instead of Six Integrations',
              href: '#',
              image: { src: goal4, alt: 'An analytics dashboard prompting a segmented campaign' },
            },
            {
              title: 'Keep Security and Compliance Auditable',
              href: '#',
              image: { src: goal1, alt: 'A campaign board with a rocket and a Publish button' },
            },
          ],
        },
      ],
    },

    {
      type: 'customerStories',
      title: '1,200+ Enterprises Move the Needle With Liferay',
      stories: [
        {
          customer: 'Sky',
          value: '140',
          suffix: '%',
          label: 'Increase in customer self-service',
          quote:
            'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
          name: 'Anne Anderson',
          role: 'VP of Experience and Change Management',
        },
        {
          customer: 'Stadt Wien',
          value: '100M',
          prefix: '+',
          label: 'Site views per month',
          quote:
            'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
          name: 'Nikolaus Reisel',
          role: 'GBS Group Leader: Basic Systems and Platforms',
        },
        {
          customer: 'Broadcom',
          value: '845',
          label: 'Features implemented',
          quote:
            'We don’t look at Liferay as the vendor. We see them as a partner. Everything we wanted to do in terms of providing customer self-service has been realized.',
          name: 'Erica Callaghan',
          role: 'Communications and UX Officer, Global Technology Organization',
        },
        {
          customer: 'Unilever',
          value: '133',
          suffix: '%',
          label: 'Faster go to market',
          quote:
            'Liferay was a bit of a no-brainer for us. The entire digital journey is now orchestrated in a unified way.',
          name: 'Srikant Chandrasekharan',
          role: 'Senior Delivery Lead for Enterprise Platforms & Products',
        },
      ],
    },
  ],
}

const meta = {
  title: 'Templates/Schema proof',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'Three sections of the Home page rendered from **data** rather than JSX — a test of whether a page can be a `PageSpec` without becoming JSX-in-JSON.',
          '',
          'The three were picked for being awkward: the hero carries a banner holding a bespoke solution finder, the carousel band bleeds off both edges with arrows instead of dots, and the goals grid puts a pill bar in its title row and swaps its cards behind it.',
          '',
          '**Nothing in the page data is a measurement.** No widths, no gaps, no `bleed`, no component imports — only content and the handful of real choices. Every drawn number lives in `PageRenderer`, once per section type, because it belongs to the *kind* of section rather than to the page. Compare with `Templates/Home`, which hardcodes all of it inline.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The three sections, from data, with the shared chrome around them. */
export const FromData: Story = {
  render: () => (
    <>
      <SiteHeader />
      <PageRenderer page={PAGE} />
      <SiteFooter />
    </>
  ),
}
