/*
 * The Home page's copy, as data.
 *
 * The page used to hold its strings inline. It now has more than one locale — `Built Pages/Home` and
 * `Built Pages/Japan Home` render the *same* `HomePage` component from two of these objects — so the
 * copy is here and the markup is in `HomePage.tsx`. Nothing in this file is a component: icons, images
 * and clips belong to the layout and are zipped in by position, so a translation is text only.
 *
 * `SplitTitle` exists because the design gradients the second clause of most headings rather than the
 * whole line. `lead` is plain, `accent` takes the gradient, `trail` is whatever follows it.
 */

export interface SplitTitle {
  lead?: string
  accent?: string
  trail?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface GoalItem {
  title: string
  /** Describes the drawn thumbnail, which is the same picture in every locale. */
  alt: string
}

export interface StoryItem {
  customer: string
  /** The stand-in tile's colour, used only where `customer-thumbnails.ts` has no picture. */
  hue: number
  value: string
  prefix?: string
  suffix?: string
  label: string
  quote: string
  name: string
  title: string
}

export interface TeamRow {
  q: string
  a: string
  link?: string
}

export interface TeamPanel {
  label: string
  title: string
  description: string
  items: TeamRow[]
  /** The three figures under the panel's picture. The value counts up; the label is copy. */
  metrics: { value: number; label: string }[]
}

/** One industry tab's card. */
export interface IndustryPanel {
  label: string
  description: string
  metrics: { value: string; label: string; down?: boolean }[]
}

export interface CapabilityPanel {
  /** Matches the layout's icon and media map in `HomePage.tsx`; never translated. */
  value: string
  label: string
  title: string
  description: string
  cta: string
}

export interface ResourceItem {
  tag: string
  title: string
  /** Only the six `trending` cards carry a picture; the research cards are type only. */
  alt?: string
}

export interface HomeContent {
  /** BCP 47, used for the page's `lang` and for anything that formats per locale. */
  locale: string
  hero: {
    finder: {
      label: string
      industryLabel: string
      industries: SelectOption[]
      useCaseLabel: string
      useCases: SelectOption[]
      cta: string
    }
    title: SplitTitle
    /** The subhead's closing clause is bolded in the design; `strong` is that clause. */
    description: { lead: string; strong: string }
    emailLabel: string
    emailPlaceholder: string
    trialCta: string
    demoCta: string
    rating: string
    ratingSource: string
    /**
     * The analyst badges, zipped by position with the artwork in `HomePage.tsx`. Alt text only —
     * the files are the same in every locale, because a trademark badge is not translated.
     */
    badges: { alt: string }[]
    marks: string[]
    mediaAlt: string
  }
  logos: { label: string; names: string[] }
  goals: {
    title: string
    tabs: SelectOption[]
    /** Keyed by the tab's `value`; four per tab, zipped with the four drawn thumbnails. */
    items: Record<string, GoalItem[]>
  }
  stories: { title: SplitTitle; label: string; items: StoryItem[] }
  teams: {
    title: SplitTitle
    description: string
    /** Keyed by tab value — `marketers`, `it`, `partners`. */
    panels: Record<string, TeamPanel>
    mediaAlt: string
  }
  industries: {
    title: SplitTitle
    /**
     * One card per tab, in the order the tabs are drawn.
     *
     * The global page only ever drew Financial Services, so its six entries repeat that card's copy;
     * the Japan page has all six written, which is why this is per-tab rather than one shared card.
     */
    panels: IndustryPanel[]
    /** `{industry}` is replaced with the showing tab's label. */
    solutionsCta: string
    transformationCta: string
    mediaAlt: string
  }
  platformMap: { title: SplitTitle; hubLabel: string }
  capabilities: { title: string; panels: CapabilityPanel[]; mediaAlt: string }
  integrations: {
    title: SplitTitle
    description: string
    cta: string
    label: string
  }
  trending: { title: string; description: string; items: ResourceItem[] }
  research: { title: string; description: string; items: ResourceItem[] }
}

export const HOME_CONTENT: HomeContent = {
  locale: 'en',

  hero: {
    finder: {
      label: 'Explore customized solutions',
      industryLabel: 'Industry',
      industries: [
        { value: 'financial-services', label: 'Financial Services' },
        { value: 'public-sector', label: 'Public Sector' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'healthcare', label: 'Healthcare' },
      ],
      useCaseLabel: 'Use case',
      useCases: [
        { value: 'kms', label: 'Knowledge Management Systems' },
        { value: 'customer-portals', label: 'Customer Portals' },
        { value: 'commerce', label: 'Digital Commerce' },
        { value: 'intranets', label: 'Intranets' },
      ],
      cta: 'Continue',
    },
    title: { lead: 'Launch Digital Experiences That', accent: 'Convert, Scale and Grow' },
    description: {
      lead: 'Liferay DXP is the agentic platform to automate content production, localize for global markets, launch unified commerce storefronts and dominate SEO/AEO on a',
      strong: 'single, intelligent platform and Headless CMS.',
    },
    emailLabel: 'Work email',
    emailPlaceholder: 'Enter Your Email',
    trialCta: 'Start Free Trial',
    demoCta: 'Request a Demo',
    rating: '4.6',
    ratingSource: 'Source: Gartner Peer Insights™',
    badges: [
      { alt: 'G2 Fall 2026 Leader, Enterprise' },
      { alt: 'Gartner Peer Insights Customers’ Choice 2026' },
    ],
    marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'],
    mediaAlt: 'Liferay DXP composing a page',
  },

  logos: {
    label: 'Customers using Liferay',
    names: ['DATAMATICS', 'PETROBRAS', 'CITY OF BURBANK', 'Excellus', 'AIRBUS', 'Carrefour'],
  },

  goals: {
    title: 'What Teams Can Achieve with Liferay',
    tabs: [
      { value: 'marketers', label: 'Marketers' },
      { value: 'developers', label: 'IT / Developers' },
    ],
    items: {
      marketers: [
        {
          title: 'Launch Campaigns Across Channels Faster',
          alt: 'A campaign board with a rocket and a Publish button',
        },
        {
          title: 'Drive Conversions with Tailored Experiences',
          alt: 'Segment rules switching between an enterprise buyer and a returning customer',
        },
        {
          title: 'Drive B2B Revenue with 24/7 Self-Serve Commerce',
          alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
        },
        {
          title: 'Turn Analytics into Immediate Action',
          alt: 'An analytics dashboard prompting a segmented campaign',
        },
      ],
      /*
       * The file draws this second set hidden and empty, so the copy here is written rather than read.
       * Recorded in the README — a tab that changes nothing is worse than a tab with a stated guess.
       */
      developers: [
        {
          title: 'Ship Features Without Rebuilding the Platform',
          alt: 'A negotiated pricing catalogue confirming an order placed without a sales rep',
        },
        {
          title: 'Extend Anything Through Headless APIs',
          alt: 'Segment rules switching between an enterprise buyer and a returning customer',
        },
        {
          title: 'Run One Platform Instead of Six Integrations',
          alt: 'An analytics dashboard prompting a segmented campaign',
        },
        {
          title: 'Keep Security and Compliance Auditable',
          alt: 'A campaign board with a rocket and a Publish button',
        },
      ],
    },
  },

  stories: {
    title: { accent: '1,200+ Enterprises', trail: 'Move the Needle With Liferay' },
    label: 'Customer stories',
    items: [
      {
        customer: 'Sky TV',
        hue: 214,
        value: '140',
        suffix: '%',
        label: 'Increase in customer self-service',
        quote:
          'With Liferay, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
        name: 'Jacques Hefer',
        title: 'Solution Architect',
      },
      {
        customer: 'City of Vienna',
        hue: 0,
        value: '100M',
        prefix: '+',
        label: 'Site views per month',
        quote:
          'Liferay’s out-of-the-box features mean we can offer state-of-the-art communication trends and methods, quickly and conveniently.',
        name: 'Nikolaus Reisel',
        title: 'GBS Group Leader: Basic Systems and platforms',
      },
      {
        customer: 'Broadcom',
        hue: 300,
        value: '845',
        label: 'Features implemented',
        quote:
          'We don’t look at Liferay as the vendor. We see them as a partner. Everything we wanted to do in terms of providing customer self-service has been realized.',
        name: 'Erica Callaghan',
        title: 'Communications and UX Officer, Global Technology Organization',
      },
      {
        customer: 'Unilever',
        hue: 228,
        value: '133',
        suffix: '%',
        label: 'Faster go to market',
        quote:
          'Liferay was a bit of a no-brainer for us. The entire digital journey is now orchestrated in a unified way.',
        name: 'Srikant Chandrasekharan',
        title: 'Senior Delivery Lead for Enterprise Platforms & Products',
      },
      {
        customer: 'Airbus',
        hue: 196,
        value: '24,000',
        label: 'Users served by portal',
        quote:
          'Keycopter brings efficiency and autonomy to helicopter operators. By providing coherent online services with Liferay, it is easy for our customers to keep their aircraft in good condition.',
        name: 'Jérôme Chauvin',
        title: 'IM Project Manager',
      },
      {
        customer: 'Mueller, Inc.',
        hue: 264,
        value: '73',
        suffix: '%',
        label: 'Quote increase',
        quote:
          'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
        name: 'Hab Adkins',
        title: 'Corporate Technology Manager',
      },
      {
        customer: 'Jose Cuervo',
        hue: 24,
        value: '7',
        label: 'Teams unified via intranet',
        quote:
          'Our new corporate communication media needed to be effective and provide an optimal user experience, and now that was finally possible with Liferay.',
        name: 'Loria Saviñon',
        title: 'HR Manager',
      },
      {
        customer: 'MacDon',
        hue: 156,
        value: '50',
        suffix: '%',
        label: 'Increase in online transactions',
        quote:
          'It was just time for an upgrade, and now we get ecstatic reviews on the customer experience every week.',
        name: 'Derek Boonstra',
        title: 'Manager, Business Systems',
      },
    ],
  },

  teams: {
    title: { lead: 'Different Teams.', accent: 'One Platform.' },
    description:
      'Whether you drive campaigns, build infrastructure, or grow partnerships – Liferay empowers your success.',
    mediaAlt: 'Two colleagues building an AI agent in Liferay',
    panels: {
      marketers: {
        label: 'Marketers',
        title: 'Launch faster. Convert more.',
        description: 'For teams that drive campaigns, content, and customer experience.',
        metrics: [
          { value: 56, label: 'Websites launched' },
          { value: 24, label: 'Industries served' },
          { value: 77, label: 'Countries served' },
        ],
        items: [
          {
            q: 'Create smarter content. Convert more visitors.',
            a: 'Use AI to create and manage content faster, while agents auto-tag assets, translate pages, and segment visitors in real time – so every piece of content lands with the right audience automatically.',
            link: 'Explore AI Hub',
          },
          {
            q: 'Launch campaigns without waiting on IT',
            a: 'Build and publish pages from the same components engineering ships, so a landing page stops being a release.',
            link: 'Explore the page builder',
          },
          {
            q: 'Reach every visitor with the right message',
            a: 'Segment on behaviour, account and locale, then personalise any fragment on the page against those segments.',
            link: 'Explore personalization',
          },
          {
            q: 'Keep content and assets consistent across every channel',
            a: 'One content tree and one asset library feed the website, the portal, commerce and every headless surface.',
            link: 'Explore the DAM',
          },
          {
            q: 'Turn your site into a B2B revenue engine',
            a: 'Catalogues, negotiated pricing and self-serve reordering sit on the same content the marketing site uses.',
            link: 'Explore commerce',
          },
        ],
      },
      /* Same as the goals tabs: the file draws the other two pills without content behind them. */
      it: {
        label: 'IT/Developers',
        title: 'One platform to build on and to operate.',
        description: 'For teams that own the stack, the upgrades and the audit.',
        metrics: [
          { value: 56, label: 'Websites launched' },
          { value: 24, label: 'Industries served' },
          { value: 77, label: 'Countries served' },
        ],
        items: [
          {
            q: 'Build against APIs, not a template language',
            a: 'REST and GraphQL for everything on the page, with typed client SDKs and local development in one command.',
            link: 'Read the API reference',
          },
          {
            q: 'Run it where your policy says you can',
            a: 'The same distribution as SaaS, PaaS or self-hosted, with one upgrade path between them.',
            link: 'Compare deployment options',
          },
          {
            q: 'One identity, one audit surface',
            a: 'Content, commerce, search and portals behind a single identity provider and a single audit log.',
            link: 'Visit the Trust Center',
          },
          {
            q: 'Extend without forking',
            a: 'Low-code for the small things, OSGi modules for the rest — upgrades stay upgrades.',
            link: 'Explore low-code',
          },
        ],
      },
      partners: {
        label: 'Partners',
        title: 'Deliver more, with less rebuilding.',
        description: 'For agencies and integrators shipping on behalf of clients.',
        metrics: [
          { value: 56, label: 'Websites launched' },
          { value: 24, label: 'Industries served' },
          { value: 77, label: 'Countries served' },
        ],
        items: [
          {
            q: 'Reuse what you built for the last client',
            a: 'Ship accelerators as modules and design systems, then reuse them across engagements.',
            link: 'Visit the Marketplace',
          },
          {
            q: 'Get your team certified',
            a: 'Role-based learning paths and certification for developers, architects and administrators.',
            link: 'Explore training',
          },
          {
            q: 'Grow with the programme',
            a: 'Co-selling, deal registration and technical enablement through the partner portal.',
            link: 'Become a partner',
          },
        ],
      },
    },
  },

  industries: {
    title: { lead: 'Designed for Your Industry.', accent: 'Built for Growth.' },
    /*
     * The file draws only the Financial Services card, so the other five repeat it rather than
     * inventing five sets of figures. The Japan page has all six written and does not.
     */
    panels: [
      {
        label: 'Financial Services',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
      {
        label: 'Energy and Utilities',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
      {
        label: 'Manufacturing',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
      {
        label: 'Public Sector',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
      {
        label: 'Healthcare',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
      {
        label: 'All Industries',
        description:
          'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
        metrics: [
          { value: '45%', label: 'Faster loading time' },
          { value: '96%', label: 'Less consulting time', down: true },
          { value: '845%', label: 'Less data entry time*', down: true },
        ],
      },
    ],
    solutionsCta: '{industry} Solutions',
    transformationCta: 'Digital transformation in {industry}',
    mediaAlt: 'Someone signing in to their account from a phone',
  },

  platformMap: {
    title: { lead: 'Everything You Need in', accent: 'One Platform' },
    hubLabel: 'DXP',
  },

  capabilities: {
    title: 'Every Capability Your Enterprise Needs',
    mediaAlt: 'A financial-services website built on Liferay',
    panels: [
      {
        value: 'customer-portals',
        label: 'Customer Portals',
        title: 'Give customers one place to do everything.',
        description:
          'Let customers find answers, raise a case and manage their account without calling — on the same content your site runs on.',
        cta: 'Explore Customer Portals',
      },
      {
        value: 'supplier-portals',
        label: 'Supplier Portals',
        title: 'Onboard suppliers in days, not quarters.',
        description:
          'Collect documents, track compliance and settle invoices in one place, with the approvals your finance team already runs.',
        cta: 'Explore Supplier Portals',
      },
      {
        value: 'partner-portals',
        label: 'Partner Portals',
        title: 'Arm your partners with what they need to sell.',
        description:
          'Deal registration, co-branded assets and enablement behind one login, personalised by partner tier.',
        cta: 'Explore Partner Portals',
      },
      {
        value: 'enterprise-websites',
        label: 'Enterprise Websites',
        title: 'Captivate visitors, generate leads, and grow fast.',
        description:
          'Turn visitors into conversions and conversions into customers and lifelong advocates with personalized, scalable websites.',
        cta: 'Explore Enterprise Websites',
      },
      {
        value: 'intranets',
        label: 'Intranets',
        title: 'One place your people actually go.',
        description:
          'Company news, the document you need and the form you have to file, searchable in one index and one login.',
        cta: 'Explore Intranets',
      },
      {
        value: 'digital-commerce',
        label: 'Digital Commerce',
        title: 'Sell the way your buyers buy.',
        description:
          'Negotiated pricing, self-serve reordering and quote-to-cash on the same content tree as the marketing site.',
        cta: 'Explore Digital Commerce',
      },
    ],
  },

  integrations: {
    title: { lead: 'Extend Your platform.', accent: 'Integrate without limits.' },
    description:
      'Liferay connects flexibly with the platforms and vendors your team relies on every day.',
    cta: 'Explore integrations',
    label: 'Integrations',
  },

  trending: {
    title: 'Trending Now',
    description: 'Latest insights and resources from Liferay.',
    items: [
      {
        tag: 'Guide',
        title: 'What is AI Transformation?',
        alt: 'Hands at a laptop keyboard under a blue overlay of circuitry and data',
      },
      {
        tag: 'Blog',
        title: 'What is the Purpose of a Knowledge Management System?',
        alt: 'Flat illustration of a woman beside a lightbulb, a video player and message cards',
      },
      {
        tag: 'Blog',
        title: 'What is Low-Code and No-Code?',
        alt: 'Someone at a monitor reading a screen of code',
      },
      {
        tag: 'Article',
        title: 'What is Digital Strategy?',
        alt: 'Two colleagues at a whiteboard covered in sticky notes',
      },
      {
        tag: 'Blog',
        title: '16 Awesome Web Portal Examples',
        alt: 'A 3D render of a lit platform ringed by Create, Find, Share, Trust and Improve tiles',
      },
      {
        tag: 'Blog',
        title: 'What Is B2B Ecommerce?',
        alt: 'A laptop keyboard from above with a hand resting on it',
      },
    ],
  },

  research: {
    title: 'Our Latest Research & Data',
    description: 'New studies and reports to help you make smarter decisions.',
    items: [
      { tag: 'CMS Trends', title: '2026 Liferay Digital Content Management Report' },
      { tag: 'Agentic AI', title: 'Liferay 2026 Agentic AI Adoption and Governance Report' },
      { tag: 'Digital Trust', title: 'Liferay 2026 Broken Trust Report' },
    ],
  },
}
