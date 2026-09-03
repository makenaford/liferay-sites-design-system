import type { PageSpec, PanelSpec } from './page-schema'
import { VENDOR_NAMES } from './vendor-logos'

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
import teamsMedia from '../../assets/home/teams-media.png'
import trendingAi from '../../assets/home/trending/ai-transformation.jpg'
import trendingB2b from '../../assets/home/trending/b2b-ecommerce.jpg'
import trendingKms from '../../assets/home/trending/knowledge-management.jpg'
import trendingLowCode from '../../assets/home/trending/low-code.jpg'
import trendingStrategy from '../../assets/home/trending/digital-strategy.jpg'
import trendingPortals from '../../assets/home/trending/web-portals.jpg'

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

/*
 * The teams panel's footage.
 *
 * Placed by the names the export carried — `t1c1`…`t1c4` and `t2c2`, meaning tab 1 cards 1 to 4 and
 * tab 2 card 2 — rather than by reading the product names against the copy.
 */
import aiHubClip from '../../assets/home/teams/ai-hub.mp4'
import cmpClip from '../../assets/home/teams/cmp.mp4'
import personalizationClip from '../../assets/home/teams/personalization.mp4'
import cmsClip from '../../assets/home/teams/cms.mp4'
import sitesClip from '../../assets/home/teams/sites.mp4'
/* A still rather than footage — the B2B row is the one card that was exported as a picture. */
import b2bStill from '../../assets/home/teams/b2b-commerce.png'

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
        media: { src: aiHubClip, alt: 'AI Hub tagging and translating content' },
      },
      {
        question: 'Launch campaigns without waiting on IT',
        answer:
          'Build and publish pages from the same components engineering ships, so a landing page stops being a release.',
        link: { label: 'Explore the page builder', href: '#' },
        media: { src: sitesClip, alt: 'A page being built and published from shared components' },
      },
      {
        question: 'Reach every visitor with the right message',
        answer:
          'Segment on behaviour, account and locale, then personalise any fragment on the page against those segments.',
        link: { label: 'Explore personalization', href: '#' },
        media: { src: personalizationClip, alt: 'A page fragment personalised against a visitor segment' },
      },
      {
        question: 'Keep content and assets consistent across every channel',
        answer:
          'One content tree and one asset library feed the website, the portal, commerce and every headless surface.',
        link: { label: 'Explore the DAM', href: '#' },
        media: { src: cmpClip, alt: 'One content tree and asset library feeding several channels' },
      },
      {
        question: 'Turn your site into a B2B revenue engine',
        answer:
          'Catalogues, negotiated pricing and self-serve reordering sit on the same content the marketing site uses.',
        link: { label: 'Explore commerce', href: '#' },
        media: { src: b2bStill, alt: 'A B2B order moving through a two-step approval workflow' },
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
        media: { src: cmsClip, alt: 'The same platform running on SaaS, PaaS and self-hosted' },
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



export const HOME_PAGE: PageSpec = {
  hero: {
    background: 'full',
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
      titleHighlight: '1,200+ Enterprises',
      stories: [
        /*
         * The eight from the `§4 Customer Testimonials` sheet, kept in step with `Home.stories.tsx`.
         * Two copies of one list is a duplication worth closing, but not while the builder is landing.
         *
         * Sky's entry was wrong here too: Mueller's quote under an author who is not in the source.
         */
        {
          customer: 'Sky TV',
          value: '140',
          suffix: '%',
          label: 'Increase in customer self-service',
          quote:
            'With Liferay, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
          name: 'Jacques Hefer',
          role: 'Solution Architect',
        },
        {
          customer: 'City of Vienna',
          value: '100M',
          prefix: '+',
          label: 'Site views per month',
          quote:
            'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
          name: 'Nikolaus Reisel',
          role: 'GBS Group Leader: Basic Systems and platforms',
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
        {
          customer: 'Airbus',
          value: '24,000',
          label: 'Users served by portal',
          quote:
            'Keycopter brings efficiency and autonomy to helicopter operators. By providing coherent online services with Liferay, it is easy for our customers to keep their aircraft in good condition.',
          name: 'Jérôme Chauvin',
          role: 'IM Project Manager',
        },
        {
          customer: 'Mueller, Inc.',
          value: '73',
          suffix: '%',
          label: 'Quote increase',
          quote:
            'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
          name: 'Hab Adkins',
          role: 'Corporate Technology Manager',
        },
        {
          customer: 'Jose Cuervo',
          value: '7',
          label: 'Teams unified via intranet',
          quote:
            'Our new corporate communication media needed to be effective and provide an optimal user experience, and now that was finally possible with Liferay.',
          name: 'Loria Saviñon',
          role: 'HR Manager',
        },
        {
          customer: 'MacDon',
          value: '50',
          suffix: '%',
          label: 'Increase in online transactions',
          quote:
            'It was just time for an upgrade, and now we get ecstatic reviews on the customer experience every week.',
          name: 'Derek Boonstra',
          role: 'Manager, Business Systems',
        },
      ],
    },

    {
      type: 'tabbedContent',
      title: 'Different Teams. One Platform.',
      titleHighlight: 'One Platform.',
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
      titleHighlight: 'Built for Growth.',
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

    /*
     * The product map, drawn rather than exported.
     *
     * This was `platform-diagram.png` — the same figure as one 1000×806 image with one alt string. As
     * data it is sixteen products with names, initialisms spelled out and destinations of their own,
     * which is what lets a tile be a link and the figure be read rather than described.
     */
    {
      type: 'capabilityMap',
      title: 'Everything You Need in One Platform',
      titleHighlight: 'One Platform',
      hub: { icon: 'dxp', label: 'DXP' },
      clusters: [
        {
          label: 'Commerce & Sales',
          items: [
            { label: 'PIM', icon: 'pim', href: '#pim', description: 'Product Information Management' },
            /* The soft hyphen is deliberate — see `product-map.tsx`. `description` keeps the announced name whole. */
            {
              label: 'Personali\u00ADzation',
              description: 'Personalization',
              icon: 'personalization',
              href: '#personalization',
            },
            { label: 'DSR', icon: 'dsr', href: '#dsr', description: 'Digital Sales Rooms' },
            { label: 'Commerce', icon: 'commerce', href: '#commerce' },
          ],
        },
        {
          label: 'Content & Experience',
          items: [
            { label: 'Sites', icon: 'sites', href: '#sites' },
            { label: 'CMS', icon: 'cms', href: '#cms', description: 'Content Management System' },
            { label: 'CMP', icon: 'cmp', href: '#cmp', description: 'Content Marketing Platform' },
            { label: 'SEO Studio', icon: 'content-performance', href: '#seo-studio' },
          ],
        },
        {
          /* The explicit break keeps it two lines like the three beside it — see `product-map.tsx`. */
          label: 'Intelligence &\nAI',
          items: [
            { label: 'LDP', icon: 'ldp', href: '#ldp', description: 'Liferay Data Platform' },
            { label: 'AI Hub', icon: 'ai-hub', href: '#ai-hub' },
            { label: 'Search', icon: 'search', href: '#search' },
            { label: 'Analytics', icon: 'analytics', href: '#analytics' },
          ],
        },
        {
          label: 'Platform & Infrastructure',
          items: [
            { label: 'Cloud Native', icon: 'cloud-native', href: '#cloud-native' },
            { label: 'Security', icon: 'security', href: '#security' },
            { label: 'Low-Code', icon: 'low-code', href: '#low-code' },
            { label: 'Integration', icon: 'integration', href: '#integration' },
          ],
        },
      ],
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
      titleHighlight: 'Integrate without limits.',
      description:
        'Liferay connects flexibly with the platforms and vendors your team relies on every day.',
      action: { label: 'Explore integrations', href: '#' },
      logos: VENDOR_NAMES,
    },

    /*
     * The file's six resources, thumbnails included — node `7655:15414`. It carried six identical
     * `Card Title` / lorem placeholders with a mail icon, from before the cell was drawn.
     */
    {
      type: 'resourceGrid',
      title: 'Trending Now',
      description: 'Latest insights and resources from Liferay.',
      cards: [
        {
          title: 'What is AI Transformation?',
          tag: 'Guide',
          href: '#',
          image: {
            src: trendingAi,
            alt: 'Hands at a laptop keyboard under a blue overlay of circuitry and data',
          },
        },
        {
          title: 'What is the Purpose of a Knowledge Management System?',
          tag: 'Blog',
          href: '#',
          image: {
            src: trendingKms,
            alt: 'Flat illustration of a woman beside a lightbulb, a video player and message cards',
          },
        },
        {
          title: 'What is Low-Code and No-Code?',
          tag: 'Blog',
          href: '#',
          image: { src: trendingLowCode, alt: 'Someone at a monitor reading a screen of code' },
        },
        {
          title: 'What is Digital Strategy?',
          tag: 'Article',
          href: '#',
          image: {
            src: trendingStrategy,
            alt: 'Two colleagues at a whiteboard covered in sticky notes',
          },
        },
        {
          title: '16 Awesome Web Portal Examples',
          tag: 'Blog',
          href: '#',
          image: {
            src: trendingPortals,
            alt: 'A 3D render of a lit platform ringed by Create, Find, Share, Trust and Improve tiles',
          },
        },
        {
          title: 'What Is B2B Ecommerce?',
          tag: 'Blog',
          href: '#',
          image: { src: trendingB2b, alt: 'A laptop keyboard from above with a hand resting on it' },
        },
      ],
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
