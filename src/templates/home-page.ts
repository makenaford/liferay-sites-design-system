import type { PageSpec, PanelSpec } from './page-schema'

/*
 * The Home page, as data.
 *
 * Lives on its own so the schema proof and the page builder can both use it without one importing the
 * other's story. This is what a builder would export and a developer would paste — content only, with
 * every drawn measurement left to `PageRenderer`.
 */

import heroAnimation from '../../assets/home/hero-animation.webm'
import heroMedia from '../../assets/home/hero-media.png'
import capabilityMedia from '../../assets/home/capability-media.png'
import goal1 from '../../assets/home/goal-1.png'
import goal2 from '../../assets/home/goal-2.png'
import goal3 from '../../assets/home/goal-3.png'
import goal4 from '../../assets/home/goal-4.png'
import industryMedia from '../../assets/home/industry-media.png'
import platformDiagram from '../../assets/home/platform-diagram.png'
import teamsMedia from '../../assets/home/teams-media.png'

/*
 * The whole Home page, expressed as data instead of JSX.
 *
 * Every one of its eleven sections renders to the same height as the hand-written `Templates/Home`,
 * and everything below is content: no widths, no gaps, no `bleed`, no component imports. All of that
 * lives in `PageRenderer`, once per section type.
 *
 * Two things the port caught that reading the code had not:
 *
 * - The hand-written page used a 40px gap between the pill bar and the panel in one tabbed section and
 *   24 in the other. The file draws 24 in both. Home was wrong and is now fixed.
 * - `Trending Now` and `Our Latest Research & Data` are a *different* Figma cell from the goals grid,
 *   with a 24px section gap rather than 32. Folding all three into one section type left two of them
 *   8px out, which is why `resourceGrid` exists separately from `cardGrid`.
 */

const TEAM_PANELS = {
  marketers: {
    title: 'Launch faster. Convert more.',
    description: 'For teams that drive campaigns, content, and customer experience.',
    items: [
      {
        question: 'Create smarter content. Convert more visitors.',
        answer:
          'Use AI to create and manage content faster, while agents auto-tag assets, translate pages, and segment visitors in real time – so every piece of content lands with the right audience automatically.',
        link: { label: 'Explore AI Hub', href: '#' },
      },
      {
        question: 'Launch campaigns without waiting on IT',
        answer:
          'Build and publish pages from the same components engineering ships, so a landing page stops being a release.',
        link: { label: 'Explore the page builder', href: '#' },
      },
      {
        question: 'Reach every visitor with the right message',
        answer:
          'Segment on behaviour, account and locale, then personalise any fragment on the page against those segments.',
        link: { label: 'Explore personalization', href: '#' },
      },
      {
        question: 'Keep content and assets consistent across every channel',
        answer:
          'One content tree and one asset library feed the website, the portal, commerce and every headless surface.',
        link: { label: 'Explore the DAM', href: '#' },
      },
      {
        question: 'Turn your site into a B2B revenue engine',
        answer:
          'Catalogues, negotiated pricing and self-serve reordering sit on the same content the marketing site uses.',
        link: { label: 'Explore commerce', href: '#' },
      },
    ],
    media: { src: teamsMedia, alt: 'Two colleagues building an AI agent in Liferay' },
    stats: [
      { value: '56', label: 'Websites launched' },
      { value: '24', label: 'Industries served' },
      { value: '77', label: 'Countries served' },
    ],
  },
  it: {
    title: 'One platform to build on and to operate.',
    description: 'For teams that own the stack, the upgrades and the audit.',
    items: [
      {
        question: 'Build against APIs, not a template language',
        answer:
          'REST and GraphQL for everything on the page, with typed client SDKs and local development in one command.',
        link: { label: 'Read the API reference', href: '#' },
      },
      {
        question: 'Run it where your policy says you can',
        answer: 'The same distribution as SaaS, PaaS or self-hosted, with one upgrade path between them.',
        link: { label: 'Compare deployment options', href: '#' },
      },
      {
        question: 'One identity, one audit surface',
        answer:
          'Content, commerce, search and portals behind a single identity provider and a single audit log.',
        link: { label: 'Visit the Trust Center', href: '#' },
      },
      {
        question: 'Extend without forking',
        answer: 'Low-code for the small things, OSGi modules for the rest — upgrades stay upgrades.',
        link: { label: 'Explore low-code', href: '#' },
      },
    ],
    media: { src: teamsMedia, alt: 'Two colleagues building an AI agent in Liferay' },
    stats: [
      { value: '56', label: 'Websites launched' },
      { value: '24', label: 'Industries served' },
      { value: '77', label: 'Countries served' },
    ],
  },
  partners: {
    title: 'Deliver more, with less rebuilding.',
    description: 'For agencies and integrators shipping on behalf of clients.',
    items: [
      {
        question: 'Reuse what you built for the last client',
        answer: 'Ship accelerators as modules and design systems, then reuse them across engagements.',
        link: { label: 'Visit the Marketplace', href: '#' },
      },
      {
        question: 'Get your team certified',
        answer: 'Role-based learning paths and certification for developers, architects and administrators.',
        link: { label: 'Explore training', href: '#' },
      },
      {
        question: 'Grow with the programme',
        answer: 'Co-selling, deal registration and technical enablement through the partner portal.',
        link: { label: 'Become a partner', href: '#' },
      },
    ],
    media: { src: teamsMedia, alt: 'Two colleagues building an AI agent in Liferay' },
    stats: [
      { value: '56', label: 'Websites launched' },
      { value: '24', label: 'Industries served' },
      { value: '77', label: 'Countries served' },
    ],
  },
} satisfies Record<string, PanelSpec>

const CAPABILITY_MEDIA = {
  src: capabilityMedia,
  alt: 'A financial-services website built on Liferay',
}

const VENDORS = ['Asana', 'Postmark', 'Trello', 'OpenAI', 'Mixpanel', 'Auth0', 'Figma', 'Payhip']

export const HOME_PAGE: PageSpec = {
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
      marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'],
    },
    media: {
      src: heroAnimation,
      /* The still is the fallback, not decoration — see `poster` in page-schema.ts. */
      poster: heroMedia,
      alt: 'A Liferay-built product catalogue with simulation and asset-intelligence tools',
    },
  },

  sections: [
    {
      type: 'logoMarquee',
      label: 'Customers using Liferay',
      logos: ['DATAMATICS', 'PETROBRAS', 'CITY OF BURBANK', 'Excellus', 'AIRBUS', 'Carrefour'],
    },

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

    {
      type: 'tabbedContent',
      title: 'Different Teams. One Platform.',
      description:
        'Whether you drive campaigns, build infrastructure, or grow partnerships – Liferay empowers your success.',
      tabs: [
        { value: 'marketers', label: 'Marketers', icon: 'user', content: TEAM_PANELS.marketers },
        { value: 'it', label: 'IT/Developers', icon: 'user', content: TEAM_PANELS.it },
        { value: 'partners', label: 'Partners', icon: 'user', content: TEAM_PANELS.partners },
      ],
    },

    {
      type: 'fullCard',
      title: 'Designed for Your Industry. Built for Growth.',
      tabs: [
        'Financial Services',
        'Energy and Utilities',
        'Manufacturing',
        'Public Sector',
        'Healthcare',
        'All Industries',
      ],
      card: {
        icon: 'financial-services',
        title: '{tab}',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        links: [
          { label: '{tab} Solutions', href: '#' },
          { label: 'Digital transformation in {tab}', href: '#' },
        ],
        stats: [
          { value: '45', suffix: '%', label: 'Faster loading time' },
          { value: '96', suffix: '%', label: 'Less consulting time', sentiment: 'positive' },
          { value: '845', suffix: '%', label: 'Less data entry time*', sentiment: 'positive' },
        ],
        media: { src: industryMedia, alt: 'Someone signing in to their account from a phone' },
      },
    },

    {
      type: 'mediaBand',
      title: 'Everything You Need in One Platform',
      image: {
        src: platformDiagram,
        alt: 'DXP at the centre of four groups: Content & Experience, Commerce & Sales, Platform & Infrastructure, and Intelligence & AI',
      },
    },

    {
      type: 'tabbedContent',
      title: 'Every Capability Your Enterprise Needs',
      tabs: [
        {
          value: 'customer-portals',
          label: 'Customer Portals',
          icon: 'user',
          content: {
            eyebrow: 'customer-portals',
            title: 'Give customers one place to do everything.',
            description:
              'Let customers find answers, raise a case and manage their account without calling — on the same content your site runs on.',
            action: { label: 'Explore Customer Portals', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
        {
          value: 'supplier-portals',
          label: 'Supplier Portals',
          icon: 'monitor',
          content: {
            eyebrow: 'supplier-portals',
            title: 'Onboard suppliers in days, not quarters.',
            description:
              'Collect documents, track compliance and settle invoices in one place, with the approvals your finance team already runs.',
            action: { label: 'Explore Supplier Portals', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
        {
          value: 'partner-portals',
          label: 'Partner Portals',
          icon: 'department',
          content: {
            eyebrow: 'partner-portals',
            title: 'Arm your partners with what they need to sell.',
            description:
              'Deal registration, co-branded assets and enablement behind one login, personalised by partner tier.',
            action: { label: 'Explore Partner Portals', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
        {
          value: 'enterprise-websites',
          label: 'Enterprise Websites',
          icon: 'building',
          content: {
            eyebrow: 'enterprise-websites',
            title: 'Captivate visitors, generate leads, and grow fast.',
            description:
              'Turn visitors into conversions and conversions into customers and lifelong advocates with personalized, scalable websites.',
            action: { label: 'Explore Enterprise Websites', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
        {
          value: 'intranets',
          label: 'Intranets',
          icon: 'group',
          content: {
            eyebrow: 'intranets',
            title: 'One place your people actually go.',
            description:
              'Company news, the document you need and the form you have to file, searchable in one index and one login.',
            action: { label: 'Explore Intranets', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
        {
          value: 'digital-commerce',
          label: 'Digital Commerce',
          icon: 'cart',
          content: {
            eyebrow: 'commerce',
            title: 'Sell the way your buyers buy.',
            description:
              'Negotiated pricing, self-serve reordering and quote-to-cash on the same content tree as the marketing site.',
            action: { label: 'Explore Digital Commerce', href: '#' },
            media: CAPABILITY_MEDIA,
          },
        },
      ],
    },

    {
      type: 'integrations',
      title: 'Extend Your platform. Integrate without limits.',
      description:
        'Liferay connects flexibly with the platforms and vendors your team relies on every day.',
      action: { label: 'Explore our integration capabilities', href: '#' },
      logos: [...VENDORS, ...VENDORS],
    },

    {
      type: 'resourceGrid',
      title: 'Trending Now',
      description: 'Latest insights and resources from Liferay.',
      cards: Array.from({ length: 6 }, () => ({
        title: 'Card Title',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'mail' as const,
        href: '#',
      })),
    },

    {
      type: 'resourceGrid',
      title: 'Our Latest Research & Data',
      description: 'New studies and reports to help you make smarter decisions.',
      cards: [
        { tag: 'CMS Trends', title: '2026 Liferay Digital Content Management Report', href: '#' },
        {
          tag: 'Agentic AI',
          title: 'Liferay 2026 Agentic AI Adoption and Governance Report',
          href: '#',
        },
        { tag: 'Digital Trust', title: 'Liferay 2026 Broken Trust Report', href: '#' },
      ],
    },
  ],
}
