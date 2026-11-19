import commerceDashboard from '../../assets/solutions/commerce-dashboard.webp'
import aiHubAnimation from '../../assets/solutions/ai-hub-animation.webm'
import aiHubStill from '../../assets/solutions/ai-hub-animation-still.webp'
import keyCapability from '../../assets/solutions-detail/key-capability.jpg'
import forgeDashboard from '../../assets/solutions-detail/forge-dashboard.jpg'
import selfService from '../../assets/solutions-detail/self-service.jpg'
import aiBlueprint from '../../assets/solutions-detail/ai-blueprint.jpg'
import einaSalut from '../../assets/solutions-detail/einasalut.png'
import governmentEcm from '../../assets/solutions-detail/government-ecm.jpg'
import gartnerBadge from '../../assets/home/badges/gartner-peer-insights-customers-choice-2026-white.png'
import g2Badge from '../../assets/home/badges/g2-leader-enterprise-fall-2026.png'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import type { PageSpec } from './page-schema'
import { CUSTOMER_STORIES } from './customer-stories'
import { CUSTOMER_LOGO_MARQUEE } from './customer-logos'

/*
 * A solution's own page, as data — laid out as the Solutions Library's `Solutions Detail` frame (Figma
 * `Solutions-Library--2026`, node `25152:59285`).
 *
 * The frame is the layout and, where it has real words, the copy. Where it draws placeholders — `This is
 * an example of a key feature`, `Team Name 1`, `Capability 1`, `Challenge Description Example`, `Customer
 * Story Title` and the lorem under them — the words are the `solution` preset's customer-portal copy
 * (`page-presets.ts`), which is the same page's argument, held in the frame's shape.
 *
 * Pictures: the hero's operator at the orders dashboard is the library's `commerce-dashboard`, the
 * challenges' agent builder is `industry/hero-media`, and the rest are the frame's own, in
 * `assets/solutions-detail/`.
 */

/*
 * The Solutions Library heroes' motion: the marketing assets' `AI Hub- Animation` (Different Teams), two
 * people at a laptop with the Agent Builder, Liferay Search and Google Gemini panels building over them.
 *
 * The dark export is 1600x1066 on an opaque #060a12 ground with 44px of it round the photograph. Re-encoded
 * here: the empty left, top and bottom margins cropped off (1556x980), and the ground keyed to alpha —
 * hard outside the photograph's 28px corners, soft in the right margin, where the panels and their glow
 * run past the photograph's edge. 8.4s; the still is its 6s frame, with every panel in. Re-export, and
 * the crop and the key need re-measuring.
 */
export const AI_HUB_ANIMATION = {
  src: aiHubAnimation,
  poster: aiHubStill,
  alt: 'Two colleagues at a laptop, with an agent workflow — Agent Builder, Liferay Search and Google Gemini — assembling beside them',
  ratio: '3:2',
} as const

const DASHBOARD = {
  src: commerceDashboard,
  alt: 'An operator at a control desk, beside an open-orders dashboard of totals, channels and inventory turnover',
}

const FORGE = {
  src: forgeDashboard,
  alt: 'A customer portal dashboard: refills, tanks and cylinders, a refill schedule, invoice history and tank usage',
}

export const SOLUTIONS_DETAIL_PAGE: PageSpec = {
  /* The figures print as written: they sit under a picture and beside a story, not in a band of their own. */
  countUp: false,
  /*
   * The frame's `Hero` (node `25339:81552`): the heading and value props beside the picture, then the
   * email field and links beside the Gartner section, which sits under the picture.
   */
  hero: {
    background: 'corner',
    layout: 'media-proof',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Digital Commerce', href: '#' },
    ],
    title: { text: 'Deliver Exceptional Customer Service,', highlight: 'Faster' },
    points: [
      { icon: 'safety-certificate', text: 'Give customers secure, role-based access to services and information' },
      { icon: 'book', text: 'Bring ticketing, ordering, and e-learning together in one self-service portal' },
      { icon: 'cloud', text: 'Choose on-premises, private cloud, or Liferay SaaS for your security needs' },
    ],
    form: { placeholder: 'Enter Your Email', submit: 'Contact Sales' },
    links: [
      { label: 'Request a Demo', href: '#' },
      { label: 'Browse All Solutions', href: '#' },
    ],
    proof: {
      rating: {
        score: '4.6',
        outOf: 5,
        source: 'by 64 verified users as of May 2026, Source: Gartner Peer Insights',
        sourceHref: '#',
      },
      marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'],
      badges: [
        { src: gartnerBadge, alt: 'Gartner Peer Insights Customers’ Choice 2026' },
        { src: g2Badge, alt: 'G2 Leader, Enterprise, Fall 2026' },
      ],
    },
    media: AI_HUB_ANIMATION,
  },
  sections: [
    CUSTOMER_LOGO_MARQUEE,
    {
      /* Node `25152:63063`: four glass cards, each the frame's SSO-and-audit-trail picture over its claim. */
      type: 'cardGrid',
      anchor: 'capabilities',
      title: 'Key Customer Portal Capabilities',
      surface: 'glass',
      cards: [
        {
          image: { src: keyCapability, alt: '' },
          title: 'Secure access and simplify compliance',
          description: 'Account-level permissions, SSO and audit trails for every customer, partner and dealer.',
        },
        {
          image: { src: keyCapability, alt: '' },
          title: 'Build complex portals fast with low-code',
          description: 'Page builders, forms and workflows let business teams ship without waiting on developers.',
        },
        {
          image: { src: keyCapability, alt: '' },
          title: 'Answer questions with AI search',
          description: 'Customers find articles, documents and cases in their own words, and open fewer tickets.',
        },
        {
          image: { src: keyCapability, alt: '' },
          title: 'Integrate the systems you already run',
          description: 'Headless APIs and connectors bring CRM, ERP and support data into one view.',
        },
      ],
    },
    {
      /* `5050 Section` (node `25339:81515`): the picture leads. */
      type: 'contentBlock',
      anchor: 'overview',
      label: 'Overview',
      labelSize: 'lg',
      title: 'What Is A Customer Portal?',
      description:
        'A customer portal is a secure, personalized website where customers find answers, manage accounts, track orders and raise requests without calling support. Liferay builds portals for complex B2B relationships, with account hierarchies, permissions and commerce on one open-source platform, for enterprises that have outgrown a basic help center.',
      actionLead: 'New to the category?',
      action: { label: 'Read “What is a Customer Portal” for examples and features', href: '#' },
      media: DASHBOARD,
      mediaSide: 'left',
    },
    {
      /* Node `25152:64428`: one tab, so no pill bar — the accordion beside the picture and its figures. */
      type: 'tabbedContent',
      anchor: 'challenges',
      title: 'What Challenges Does Customer Portal Software Solve?',
      description: 'The questions enterprise buyers ask most, and how Liferay answers them.',
      mediaSide: 'right',
      tabs: [
        {
          value: 'challenges',
          label: 'Challenges',
          content: {
            title: '',
            description: '',
            items: [
              {
                icon: 'user-circle',
                question: 'How do we give every account the right access?',
                answer:
                  'B2B customers are companies, not single users. Liferay models parent and child accounts, roles per account and approval rules, so a buyer, a plant manager and a finance approver each see only what they should.',
                link: { label: 'Explore account management', href: '#' },
              },
              {
                icon: 'gauge',
                question: 'Can one portal replace the tools we stitched together?',
                answer:
                  'Content, search, documents, forms and B2B ordering run on one platform with one login, so customers stop jumping between a help center, a file share and a store.',
                link: { label: 'Explore the platform', href: '#' },
              },
              {
                icon: 'pig-money',
                question: 'How do we cut support tickets without frustrating customers?',
                answer:
                  'AI search answers from your knowledge base in the customer’s own words, and anything it cannot answer becomes a case with the context attached.',
                link: { label: 'Explore AI search', href: '#' },
              },
              {
                icon: 'tag',
                question: 'Will it meet our security and compliance requirements?',
                answer:
                  'Fine-grained permissions, audit trails and SOC 2 Type 2 and ISO/IEC 27001 certified hosting — or run it on-premises or in your private cloud when data has to stay where it is.',
                link: { label: 'Explore security', href: '#' },
              },
            ],
            media: {
              src: agentBuilder,
              alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them',
            },
            stats: [
              { value: '56', label: 'Websites launched' },
              { value: '24', label: 'Industries served' },
              { value: '77', label: 'Countries served' },
            ],
          },
        },
      ],
    },
    {
      /* Node `25152:65456`: the pill bar over a key-point list beside a photograph. */
      type: 'tabbedContent',
      anchor: 'features',
      title: 'Customer Portal Features Built For Self-Service',
      titleHighlight: 'Built For Self-Service',
      description: 'Four primary capabilities, each with proof from a customer running it today.',
      tabs: [
        {
          value: 'self-service',
          label: 'Self Service',
          icon: 'user-2',
          content: {
            title: 'Provide Convenient Self-Service',
            description:
              'Alleviate your support team from repetitive tasks and reduce cost-to-serve by empowering your customers to do more on their own.',
            points: [
              { title: 'Order & Shipping', description: 'Place an order, process a return, or check the status of a shipment.' },
              {
                title: 'Service & Warranty',
                description: 'Create a service ticket, make a warranty claim, and schedule or update an appointment.',
              },
              { title: 'Profile & Payments', description: 'Update personal profile, preferences, and payment information.' },
              { title: 'Secure Documents', description: 'Access sensitive documents such as contracts or statements securely.' },
            ],
            media: { src: selfService, alt: 'A team around a meeting table with laptops and notes' },
          },
        },
        {
          value: 'whitepaper',
          label: 'Whitepaper',
          icon: 'book',
          content: {
            title: 'Publish Knowledge Customers Can Find',
            description:
              'Turn guides, manuals and whitepapers into searchable, permissioned content, so customers answer their own questions before they open a ticket.',
            points: [
              { title: 'Knowledge Base', description: 'Articles, FAQs and how-tos, versioned and organized by product.' },
              { title: 'Gated Content', description: 'Show each account the documents its contract entitles it to.' },
              { title: 'AI Search', description: 'Answers drawn from your content, in the customer’s own words.' },
            ],
            media: { src: selfService, alt: 'A team around a meeting table with laptops and notes' },
          },
        },
        {
          value: 'onboarding',
          label: 'Onboarding',
          icon: 'rocket',
          content: {
            title: 'Bring New Accounts Up To Speed',
            description:
              'Guide new customers from sign-up to first order with registration, approvals and training in the same portal they will use every day.',
            points: [
              { title: 'Self-Registration', description: 'Account requests routed for approval with the details your team needs.' },
              { title: 'Guided Setup', description: 'Checklists and courses that walk each role through the portal.' },
              { title: 'Account Hierarchies', description: 'Parent and child accounts with roles set from day one.' },
            ],
            media: { src: selfService, alt: 'A team around a meeting table with laptops and notes' },
          },
        },
        {
          value: 'integration',
          label: 'Integration',
          icon: 'plugin',
          content: {
            title: 'Connect The Systems You Already Run',
            description:
              'Bring orders, entitlements and case history in from your ERP and CRM, and write changes back, so the portal and your back office agree.',
            points: [
              { title: 'ERP & CRM Connectors', description: 'SAP, Salesforce and more, without rewrites.' },
              { title: 'Headless APIs', description: 'REST and GraphQL for every object in the portal.' },
              { title: 'Single Sign-On', description: 'SAML, OpenID Connect and LDAP with your identity provider.' },
            ],
            media: { src: selfService, alt: 'A team around a meeting table with laptops and notes' },
          },
        },
        {
          value: 'content-management',
          label: 'Content Management',
          icon: 'list-check',
          content: {
            title: 'Manage Every Page Without A Sprint',
            description:
              'Business teams build and update portal pages with drag-and-drop fragments, and personalize them by account, role and region.',
            points: [
              { title: 'Page Builder', description: 'Brand-safe fragments and templates, no code required.' },
              { title: 'Personalization', description: 'Segments from account, role and behavior.' },
              { title: 'Multilingual Sites', description: 'Translate pages and content for every market.' },
            ],
            media: { src: selfService, alt: 'A team around a meeting table with laptops and notes' },
          },
        },
      ],
    },
    {
      /* Node `25152:69882`: four glass cards led by their glass icons. */
      type: 'cardGrid',
      title: 'More Customer Portal Capabilities',
      description: 'Four primary capabilities, each with proof from a customer running it today.',
      surface: 'glass',
      cards: [
        { icon: 'security', title: 'Single sign-on (SSO)', description: 'SAML, OpenID Connect and LDAP with your identity provider.' },
        { icon: 'dam', title: 'Document management', description: 'Versioned, permissioned files customers can find.' },
        { icon: 'sites', title: 'Multilingual sites', description: 'Translate pages and content for every market.' },
        { icon: 'ai-hub', title: 'AI assistants', description: 'Agents that answer, summarize and route requests.' },
      ],
    },
    {
      /* Node `25152:73405`: the same cards, three across. */
      type: 'cardGrid',
      title: 'One Customer Portal, Built For Every Team',
      titleHighlight: 'Built For Every Team',
      description: 'How IT, service and marketing teams each get what they need from the same build.',
      columns: 3,
      surface: 'glass',
      cards: [
        {
          icon: 'integration',
          title: 'IT & Platform',
          description: 'Extend with REST and GraphQL APIs and connect CRM, ERP and identity without rewrites.',
        },
        {
          icon: 'support',
          title: 'Customer Service',
          description: 'Publish answers once, and route the rest to the right agent with SLAs attached.',
        },
        {
          icon: 'personalization',
          title: 'Digital & Marketing',
          description: 'Build pages with drag-and-drop fragments and personalize them by account and segment.',
        },
      ],
    },
    {
      /* Node `25152:71597`: the picture leading, the story and its figures beside it. */
      type: 'customerStory',
      anchor: 'customer-story',
      title: 'Portals Customers Actually Use',
      description:
        'Broadcom runs customer self-service on Liferay, Sky lifted self-service by 140%, and the City of Vienna serves more than 100 million page views a month — each on the same platform this portal runs on.',
      media: FORGE,
      stats: [
        { value: '845', label: 'Features implemented' },
        { value: '140', suffix: '%', label: 'Increase in self-service' },
        { value: '100M', prefix: '+', label: 'Site views per month' },
      ],
      action: { label: 'Read the customer stories', href: '#' },
    },
    {
      /* Node `25152:73515`: the comparison as a content block, the portal itself beside it. */
      type: 'contentBlock',
      anchor: 'why-liferay',
      label: 'Why Liferay?',
      labelSize: 'lg',
      title: 'What Sets Liferay Portals Apart',
      description: 'How Liferay compares with the options portal teams evaluate most.',
      points: [
        {
          title: 'Built for B2B account complexity',
          description: 'Parent-child accounts, roles and per-account content come native, not as custom code.',
        },
        {
          title: 'Portal, commerce and content on one platform',
          description: 'Add ordering, a public site or a knowledge base later without a second vendor.',
        },
        {
          title: 'Deploy where your data must live',
          description: 'Run on-premises, in a private cloud or on Liferay SaaS, with the same codebase.',
        },
      ],
      action: { label: 'Liferay vs Salesforce', href: '#' },
      media: FORGE,
    },
    {
      type: 'customerStories',
      anchor: 'built-on-liferay',
      title: 'Built On Liferay',
      titleHighlight: 'Liferay',
      description: 'See the support, dealer and self-service portals customers built on Liferay.',
      stories: CUSTOMER_STORIES,
    },
    {
      type: 'resourceGrid',
      anchor: 'resources',
      title: 'Plan Your Customer Portal',
      description: 'Documentation and guides for scoping requirements and building the business case.',
      card: 'resource',
      cards: [
        {
          image: { src: aiBlueprint, alt: '' },
          tag: 'Guide',
          title: 'AI Transformation Blueprint: From Use Cases to Enterprise Impact',
          href: '#',
        },
        {
          image: { src: einaSalut, alt: '' },
          tag: 'Customer Story',
          title: 'EINASalut: The Smart Digital Ecosystem for Improving Public Health on Liferay DXP',
          href: '#',
        },
        {
          image: { src: governmentEcm, alt: '' },
          tag: 'Blog',
          title: 'Enterprise Content Management for Government',
          href: '#',
        },
      ],
    },
    {
      /* Node `25152:59764`: the hub's closing panel — the ask beside the field, on the footer's mesh. */
      type: 'closingCta',
      surface: 'card',
      backdrop: 'mesh',
      layout: 'split',
      title: 'See The Solution You Need, Built On The Platform You’ll Keep',
      description:
        'Talk to a Liferay specialist about your portal, website, commerce, or intranet goals and get a tailored walkthrough with your use case in mind.',
      placeholder: 'Enter your email',
      submit: 'Contact Sales',
      buttons: [{ label: 'Book a Custom Demo', href: '#' }],
      asideLead: 'Not ready yet?',
      aside: { label: 'Get monthly DXP insights in your inbox', href: '#' },
    },
    {
      type: 'faq',
      anchor: 'faq',
      layout: 'side',
      title: 'Frequently Asked Questions',
      takeaways: [
        'Liferay customer portals handle complex B2B accounts, roles and approvals natively.',
        'Content, search, documents and commerce run on one platform with one login.',
        'Deploy on-premises, in private cloud or on Liferay SaaS with an open-source core.',
      ],
      items: [
        {
          question: 'What is customer portal software?',
          answer:
            'Customer portal software lets a company give customers a secure, personalized site to manage accounts, find answers, track orders and raise requests. Enterprise options add account hierarchies, permissions, integrations and analytics.',
        },
        {
          question: 'How is a customer portal different from a website?',
          answer:
            'A website speaks to everyone; a portal knows who signed in. It shows each account its own orders, documents, cases and prices, and lets them act on them.',
        },
        {
          question: 'Can a customer portal integrate with Salesforce or SAP?',
          answer:
            'Yes. Connectors and headless APIs bring CRM, ERP and support data into the portal, and write orders, cases and account changes back.',
        },
        {
          question: 'Is Liferay open source?',
          answer:
            'Liferay DXP is built on an open-source core you can inspect and extend, with enterprise subscriptions for support, security fixes and SaaS.',
        },
        {
          question: 'What features should a B2B customer portal include?',
          answer:
            'Account hierarchies and roles, SSO, self-service cases and documents, search, personalization, ordering where it applies, and integrations with the systems behind it.',
        },
      ],
      footnotes: ['Customer metrics are taken from published Liferay customer stories.'],
    },
  ],
}
