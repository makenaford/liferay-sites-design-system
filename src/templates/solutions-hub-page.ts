import commerceDashboard from '../../assets/solutions/commerce-dashboard.webp'
import permitApplication from '../../assets/solutions-hub/permit-application.png'
import ssoSignIn from '../../assets/solutions-hub/sso-sign-in.png'
import gartnerBadge from '../../assets/home/badges/gartner-peer-insights-customers-choice-2026-white.png'
import g2Badge from '../../assets/home/badges/g2-leader-enterprise-fall-2026.png'
import workflowStill from '../../assets/home/teams/b2b-commerce.png'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import webPortals from '../../assets/home/trending/web-portals.jpg'
import digitalStrategy from '../../assets/home/trending/digital-strategy.jpg'
import b2bEcommerce from '../../assets/home/trending/b2b-ecommerce.jpg'
import type { PageSpec } from './page-schema'
import { CUSTOMER_STORIES } from './customer-stories'

/*
 * The Solutions hub, as data — laid out as the Solutions Library's `Solutions Hub` frame (Figma
 * `Solutions-Library--2026`, node `24920:83473`), with the words of liferay.com/solutions as the
 * solutions-and-capabilities mockup has them (liferay-solutions-capabilities-indu.vercel.app/solutions).
 *
 * The frame is the layout and the mockup is the copy: where the two disagree — the frame's placeholder
 * `Ready for the future?` band, its second row of industry cards repeating the first — the mockup's
 * words win and the frame's shape holds them.
 *
 * Pictures: the hero's permit application and the first industry card's SSO sign-in are the frame's own;
 * the operator at the orders dashboard is the library's `commerce-dashboard`, the same picture. The
 * frame draws three industries, so the other three cards borrow a photograph from elsewhere in the library.
 */

const DASHBOARD = {
  src: commerceDashboard,
  alt: 'An operator at a control desk, beside an open-orders dashboard of totals, channels and inventory turnover',
}

export const SOLUTIONS_HUB_PAGE: PageSpec = {
  /* The figures print as written: they sit in cards read side by side, not in a band of their own. */
  countUp: false,
  /*
   * The frame's `Hero` (node `24920:87684`): one column — the heading, the value props, the email field,
   * the links, then the rating beside the badges with the marks under it — beside the picture. The
   * `Solutions` bar above it is the story's, since the page's chrome is.
   */
  hero: {
    background: 'corner',
    layout: 'stacked',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Solutions', href: '#' },
    ],
    title: { text: 'Build the Digital Solutions Your', highlight: 'Business Runs On' },
    points: [
      { icon: 'file-code', text: 'Portals, websites, commerce, and intranets on one composable platform' },
      { icon: 'sparkles', text: 'AI-assisted content, search, and personalization built into every solution' },
      { icon: 'list-check', text: 'Connect ERP, CRM, and legacy systems with headless APIs and low-code' },
    ],
    form: { placeholder: 'Work email', submit: 'Contact Sales' },
    links: [
      { label: 'Request a demo', href: '#' },
      { label: 'Browse all solutions', href: '#portals' },
    ],
    proof: {
      rating: {
        score: '4.6',
        outOf: 5,
        source: 'by 233 verified users as of September 2026, Source: Gartner Peer Insights™',
      },
      marks: ['SOC 2 Type 2', 'ISO/IEC 27001', 'HIPAA', 'CSTAR'],
      badges: [
        { src: gartnerBadge, alt: 'Gartner Peer Insights Customers’ Choice 2026' },
        { src: g2Badge, alt: 'G2 Leader, Enterprise, Fall 2026' },
      ],
    },
    media: {
      src: permitApplication,
      alt: 'A man reading his phone beside a permit application form: permit type, name, location and project description',
      ratio: '3:2',
    },
  },
  sections: [
    {
      type: 'logoMarquee',
      label: 'Trusted by 1,200+ enterprises',
      logos: ['Lenovo', 'BROADCOM', 'Hewlett Packard Enterprise', 'AT&T', 'Sky', 'AIRBUS'],
    },
    {
      type: 'contentBlock',
      anchor: 'overview',
      label: 'Overview',
      labelSize: 'lg',
      title: 'What can you build on Liferay DXP?',
      description:
        'Liferay solutions are proven blueprints for the experiences enterprises depend on most: authenticated portals for customers, partners, and suppliers; high-performing public websites; B2B and B2C commerce; and modern intranets. Each one is built on the same composable platform, so content, identity, integrations, and AI are shared across every experience. Start with the solution you need today and expand without re-platforming tomorrow.',
      actionLead: 'Looking for individual features instead?',
      action: { label: 'Switch to the Platform Capabilities hub', href: '#' },
      media: DASHBOARD,
      /* The picture leads, as node `24920:83477` draws it. */
      mediaSide: 'left',
    },
    {
      type: 'cardGrid',
      anchor: 'portals',
      title: 'Portals',
      description: 'Secure, personalized workspaces for the people outside your four walls.',
      columns: 3,
      cards: [
        {
          icon: 'user-validation',
          title: 'Customer Portals',
          description: 'Give customers fast self-service and one place for every resource they need.',
          points: [
            'Personalized dashboards, tickets, and account management',
            'Knowledge base and AI-assisted search for deflection',
            'Unified view of orders, documents, and back-end data',
          ],
          stat: { value: '750', prefix: '+', suffix: '%', label: 'Processed requests per month' },
          href: '#',
        },
        {
          icon: 'partner-portals-2',
          title: 'Partner Portals',
          description: 'Run complex partner relationships from one collaborative platform.',
          points: [
            'Deal registration, MDF, and lead distribution workflows',
            'Role-based content, training, and certification',
            'Co-branded assets synced from a central library',
          ],
          stat: { value: '96', suffix: '%', label: 'Less consulting time' },
          href: '#',
        },
        {
          icon: 'supplier-portals-3',
          title: 'Supplier Portals',
          description: 'Simplify supplier management with a single window into your processes.',
          points: [
            'Onboarding, compliance documents, and approvals',
            'Real-time visibility into POs, invoices, and shipments',
            'Integrations with ERP, PLM, and procurement systems',
          ],
          stat: { value: '80', suffix: '%', label: 'Faster registration and onboarding' },
          href: '#',
        },
      ],
    },
    {
      type: 'cardGrid',
      anchor: 'websites-commerce',
      title: 'Websites & Commerce',
      description: 'Experiences that attract buyers, convert them, and keep them coming back.',
      columns: 2,
      cards: [
        {
          icon: 'user-validation',
          title: 'Enterprise-Grade Websites',
          description: 'Engage prospects with fast, personalized sites built to rank and convert.',
          points: [
            'Drag-and-drop page building with brand-safe templates',
            'Localization and multi-site management at global scale',
            'Built-in SEO/AEO, A/B testing, and segmentation',
          ],
          stat: { value: '45', suffix: '%', label: 'Faster page loading time' },
          href: '#',
        },
        {
          icon: 'partner-portals-2',
          title: 'Digital Commerce',
          description: 'Grow revenue with B2B buying that is simple to start and easy to repeat.',
          points: [
            'Account-specific catalogs, pricing, and contracts',
            'Quick reorder, punchout, and approval workflows',
            '24/7 self-serve purchasing with ERP integration',
          ],
          stat: { value: '50', prefix: '+', suffix: '%', label: 'Increase in online transactions' },
          href: '#',
        },
      ],
    },
    {
      type: 'cardGrid',
      anchor: 'industries',
      title: 'Designed for Your Industry. Built for Growth.',
      titleHighlight: 'Built for Growth.',
      align: 'center',
      columns: 3,
      cards: [
        {
          image: { src: ssoSignIn, alt: 'A man signing in on his phone through an enterprise SSO login with Okta and MFA' },
          icon: 'financial-services-2',
          title: 'Financial Services',
          description:
            'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
          links: [
            { label: 'Financial Services Solutions', href: '#' },
            { label: 'Digital transformation in Financial Services', href: '#' },
          ],
          stats: [
            { value: '45', suffix: '%', label: 'Faster loading time' },
            { value: '96', suffix: '%', label: 'Less consulting time' },
            { value: '30', suffix: '%', label: 'Less data entry time' },
          ],
        },
        {
          image: DASHBOARD,
          icon: 'manufacturing-2',
          title: 'Manufacturing',
          description:
            'Digitize operations, simplify B2B purchasing, and strengthen your supply chain to cut costs, boost revenue, and stay resilient amid market disruption.',
          links: [
            { label: 'Manufacturing Solutions', href: '#' },
            { label: 'Digital transformation in Manufacturing', href: '#' },
          ],
          stats: [
            { value: '80', suffix: '%', label: 'Faster registration & onboarding' },
            /* The frame draws the rise as an arrow before the figure, where the mockup writes `+50%`. */
            { value: '50', suffix: '%', label: 'In online transactions', sentiment: 'positive' },
            { value: '50', suffix: '%', label: 'Less catalog production time' },
          ],
        },
        {
          image: { src: permitApplication, alt: 'A man reading his phone beside a permit application form' },
          icon: 'government',
          title: 'Public Sector',
          description:
            'Deliver self-service citizen portals, protect sensitive data, and modernize legacy systems to cut wait times, ease workloads, and build lasting public trust.',
          links: [
            { label: 'Public Sector Solutions', href: '#' },
            { label: 'Digital transformation in the Public Sector', href: '#' },
          ],
          stats: [
            { value: '200', suffix: '+', label: 'Integrated applications' },
            { value: '25,000', label: 'Intranet users per day' },
            { value: '256K', label: 'Page views / month' },
          ],
        },
        {
          image: { src: workflowStill, alt: 'Two colleagues at a tablet, a validated workflow beside them' },
          icon: 'energy-and-supply',
          title: 'Energy & Utilities',
          description:
            'Empower customers with self-service tools, unify data across systems, and streamline your digital workplace to boost satisfaction and lower costs to serve.',
          links: [
            { label: 'Energy & Utilities Solutions', href: '#' },
            { label: 'Digital transformation in Energy & Utilities', href: '#' },
          ],
          stats: [
            { value: '1.7M', label: 'Customers served' },
            { value: '50', prefix: '+', suffix: '%', label: 'In online payments' },
            { value: '750', prefix: '+', suffix: '%', label: 'Processed requests / month' },
          ],
        },
        {
          image: { src: agentBuilder, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' },
          icon: 'healthcare-2',
          title: 'Healthcare',
          description:
            'Deliver secure, personalized patient and provider self-service portals, integrate legacy systems, and simplify compliance to improve health outcomes and care.',
          links: [
            { label: 'Healthcare Solutions', href: '#' },
            { label: 'Digital transformation in Healthcare', href: '#' },
          ],
          stats: [
            { value: '10', suffix: 'x', label: 'Faster go-to-market' },
            { value: '8', label: 'Month implementation' },
            { value: '0', label: 'Migration downtime' },
          ],
        },
        {
          image: { src: webPortals, alt: 'A portal at the centre of create, find, share, trust and improve' },
          icon: 'industries-integration',
          title: 'All Industries',
          description:
            'Explore flexible digital solutions built for financial services, manufacturing, public sector, healthcare, energy, education, insurance, and far beyond.',
          links: [{ label: 'Browse all industries', href: '#' }],
        },
      ],
    },
    {
      type: 'customerStories',
      anchor: 'customer-stories',
      title: '1,200+ Enterprises Move the Needle With Liferay',
      titleHighlight: '1,200+ Enterprises',
      align: 'left',
      surface: 'glass',
      action: { label: 'Browse all customer stories', href: '#' },
      /*
       * liferay.com's own eight, as its home page tells them. Mueller's figure is the live site's 70%;
       * the testimonials sheet the Home page follows says 73.
       */
      stories: CUSTOMER_STORIES.map((story) =>
        story.customer === 'Mueller, Inc.' ? { ...story, value: '70' } : story,
      ),
    },
    {
      type: 'capabilityMap',
      anchor: 'platform',
      title: 'Every solution runs on one AI-enhanced platform',
      description:
        'The same capabilities that power your portal also power your website, storefront, and intranet. Explore the building blocks behind every Liferay solution.',
      hub: { icon: 'dxp', label: 'DXP' },
      clusters: [
        {
          label: 'Commerce & Sales',
          items: [
            { label: 'DSR', icon: 'dsr', href: '#', description: 'Digital Sales Rooms' },
            { label: 'PIM', icon: 'pim', href: '#', description: 'Product Information Management' },
            { label: 'Commerce', icon: 'commerce', href: '#' },
            /* The soft hyphen is deliberate — see `product-map.tsx`. */
            { label: 'Personali­zation', description: 'Personalization', icon: 'personalization', href: '#' },
          ],
        },
        {
          label: 'Content & Experience',
          items: [
            { label: 'CMS', icon: 'cms', href: '#', description: 'Content Management System' },
            { label: 'Sites', icon: 'sites', href: '#' },
            { label: 'SEO Studio', icon: 'content-performance', href: '#' },
            { label: 'CMP', icon: 'cmp', href: '#', description: 'Content Marketing Platform' },
          ],
        },
        {
          label: 'Platform & Infrastructure',
          items: [
            { label: 'Low-Code', icon: 'low-code', href: '#' },
            { label: 'Cloud Native', icon: 'cloud-native', href: '#' },
            { label: 'Integration', icon: 'integration', href: '#' },
            { label: 'Security', icon: 'security', href: '#' },
          ],
        },
        {
          /* The explicit break keeps it two lines like the three beside it — see `product-map.tsx`. */
          label: 'Intelligence &\nAI',
          items: [
            { label: 'AI Hub', icon: 'ai-hub', href: '#' },
            { label: 'LDP', icon: 'ldp', href: '#', description: 'Liferay Data Platform' },
            { label: 'Analytics', icon: 'analytics', href: '#' },
            { label: 'Search', icon: 'search', href: '#' },
          ],
        },
      ],
    },
    {
      /* The frame's `Ready for the future?` panel, on the footer's drifting mesh, holding the mockup's ask. */
      type: 'closingCta',
      surface: 'card',
      backdrop: 'mesh',
      /* The frame's `Section` (node `25122:54773`): the ask beside the field rather than over it. */
      layout: 'split',
      title: 'See the solution you need, built on the platform you’ll keep',
      description:
        'Talk to a Liferay specialist about your portal, website, commerce, or intranet goals and get a tailored walkthrough with your use case in mind.',
      placeholder: 'Work email',
      submit: 'Contact Sales',
      buttons: [{ label: 'Book a custom demo', href: '#' }],
      asideLead: 'Not ready yet?',
      aside: { label: 'Get monthly DXP insights in your inbox', href: '#' },
    },
    {
      type: 'resourceGrid',
      anchor: 'resources',
      title: 'Plan your next solution',
      description:
        'Free guides and checklists to help you scope requirements, compare architectures, and build the business case. No forms required.',
      card: 'resource',
      cards: [
        {
          image: { src: webPortals, alt: '' },
          tag: 'Guide',
          title: 'Web portals explained: types, features, and how to choose a platform',
          href: '#',
        },
        {
          image: { src: digitalStrategy, alt: '' },
          tag: 'Article',
          title: 'DXP vs. CMS vs. portal: which architecture fits your roadmap?',
          href: '#',
        },
        {
          image: { src: b2bEcommerce, alt: '' },
          tag: 'Checklist',
          title: 'The B2B commerce requirements checklist for manufacturers',
          href: '#',
        },
      ],
    },
    {
      type: 'faq',
      anchor: 'faq',
      layout: 'side',
      title: 'Frequently asked questions',
      takeaways: [
        'Liferay DXP powers portals, websites, commerce, and intranets on one platform.',
        'Every solution shares the same content, security, and integration layer.',
        'Deploy as fully managed SaaS, PaaS, or self-hosted.',
        'Trusted by 1,200+ enterprises across regulated industries.',
        'Rated 4.6/5 by verified users on Gartner Peer Insights.',
      ],
      items: [
        {
          question: 'What solutions can I build with Liferay DXP?',
          answer:
            'Liferay DXP is used to build customer portals, partner portals, supplier portals, enterprise-grade websites, B2B and B2C digital commerce, and modern intranets. Because every solution runs on the same platform, you can launch one and extend to others without adding new vendors.',
        },
        {
          question: 'How is a portal different from a website?',
          answer:
            'A website primarily serves anonymous visitors with marketing content. A portal is an authenticated experience that personalizes content, data, and tools for each user or account, such as order history, support tickets, or partner deal registration.',
        },
        {
          question: 'Can I run multiple solutions on one Liferay instance?',
          answer:
            'Yes. Many customers run a public website, a customer portal, and a commerce storefront on a single instance, sharing user management, content, and integrations while keeping each experience distinct.',
        },
        {
          question: 'Does Liferay integrate with our existing systems?',
          answer:
            'Liferay connects to ERP, CRM, PIM, identity providers, and legacy applications through headless REST and GraphQL APIs, low-code integrations, and an ecosystem of prebuilt connectors.',
        },
        {
          question: 'Is Liferay available as SaaS?',
          answer:
            'Yes. Liferay is available as fully managed SaaS, as PaaS for teams that need deeper customization, or self-hosted for organizations with specific infrastructure requirements.',
        },
        {
          question: 'How does Liferay use AI across these solutions?',
          answer:
            'AI features help teams generate and translate content, auto-tag digital assets, power semantic search, and surface analytics insights, so portals, sites, and storefronts improve over time with less manual work.',
        },
        {
          question: 'How long does a typical implementation take?',
          answer:
            'Timelines vary by scope. Customers commonly launch an initial portal or site in a few months, and many report go-to-market speeds several times faster than with their previous platform.',
        },
      ],
      footnotes: ['Metrics reflect results from individual Liferay customer stories and may vary by organization.'],
    },
  ],
}
