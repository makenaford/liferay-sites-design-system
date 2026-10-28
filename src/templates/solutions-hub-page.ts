import commerceDashboard from '../../assets/solutions/commerce-dashboard.webp'
import financialMedia from '../../assets/home/industry-media.png'
import manufacturingMedia from '../../assets/customer-story/hero-media.jpg'
import publicSectorMedia from '../../assets/home/trending/web-portals.jpg'
import energyMedia from '../../assets/home/teams/b2b-commerce.png'
import healthcareMedia from '../../assets/industry/hero-media.jpg'
import type { PageSpec } from './page-schema'

/*
 * The Solutions hub, as data — liferay.com/solutions, as the solutions-and-capabilities mockup lays it
 * out (liferay-solutions-capabilities-indu.vercel.app/solutions).
 *
 * The order is the hub's argument: what you can build, then each solution with one customer's figure,
 * then the industries, the proof and the platform underneath every solution, and last the ask, the
 * reading and the questions.
 *
 * Every picture is one the library already holds, standing in for the mockup's own — the hero's portal
 * screen is the commerce dashboard, and each industry tab borrows a photograph from another page.
 */

export const SOLUTIONS_HUB_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Build the Digital Solutions', highlight: 'Your Business Runs On' },
    points: [
      { icon: 'monitor', text: 'Portals, websites, commerce, and intranets on one composable platform' },
      { icon: 'search', text: 'AI-assisted content, search, and personalization built into every solution' },
      { icon: 'brackets-angle', text: 'Connect ERP, CRM, and legacy systems with headless APIs and low-code' },
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
    },
    media: {
      src: commerceDashboard,
      alt: 'An operator at a control desk, beside an open-orders dashboard of totals, channels and inventory turnover',
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
      type: 'highlightText',
      icon: 'dxp',
      title: 'What can you build on Liferay DXP?',
      body: 'Liferay solutions are proven blueprints for the experiences enterprises depend on most: authenticated portals for customers, partners, and suppliers; high-performing public websites; B2B and B2C commerce; and modern intranets. Each one is built on the same composable platform, so content, identity, integrations, and AI are shared across every experience. Start with the solution you need today and expand without re-platforming tomorrow.',
      action: { label: 'Looking for individual features instead? Switch to the Platform Capabilities hub', href: '#' },
    },
    {
      type: 'cardGrid',
      anchor: 'portals',
      title: 'Portals',
      description: 'Secure, personalized workspaces for the people outside your four walls.',
      columns: 3,
      cards: [
        {
          icon: 'customer-portals',
          title: 'Customer Portals',
          description:
            'Give customers fast self-service and one place for every resource they need — dashboards, tickets, a knowledge base with AI-assisted search, and one view of orders and documents.',
          href: '#',
          stat: { value: '750', prefix: '+', suffix: '%', label: 'Processed requests per month', sentiment: 'positive' },
        },
        {
          icon: 'partner-portals',
          title: 'Partner Portals',
          description:
            'Run complex partner relationships from one collaborative platform — deal registration, MDF and lead distribution, role-based training, and co-branded assets from a central library.',
          href: '#',
          stat: { value: '96', suffix: '%', label: 'Less consulting time', sentiment: 'positive' },
        },
        {
          icon: 'supplier-portals',
          title: 'Supplier Portals',
          description:
            'Simplify supplier management with a single window into your processes — onboarding and approvals, live POs, invoices and shipments, and integrations with ERP, PLM and procurement.',
          href: '#',
          stat: { value: '80', suffix: '%', label: 'Faster registration and onboarding', sentiment: 'positive' },
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
          icon: 'enterprise-websites',
          title: 'Enterprise-Grade Websites',
          description:
            'Engage prospects with fast, personalized sites built to rank and convert — drag-and-drop pages on brand-safe templates, multi-site localization, and built-in SEO/AEO, A/B testing and segmentation.',
          href: '#',
          stat: { value: '45', suffix: '%', label: 'Faster page loading time', sentiment: 'positive' },
        },
        {
          icon: 'commerce',
          title: 'Digital Commerce',
          description:
            'Grow revenue with B2B buying that is simple to start and easy to repeat — account-specific catalogs and pricing, quick reorder, punchout and approvals, and 24/7 self-serve purchasing on your ERP.',
          href: '#',
          stat: { value: '50', prefix: '+', suffix: '%', label: 'Increase in online transactions', sentiment: 'positive' },
        },
      ],
    },
    {
      type: 'tabbedContent',
      anchor: 'industries',
      title: 'Designed for Your Industry. Built for Growth.',
      titleHighlight: 'Built for Growth.',
      mediaSide: 'right',
      tabs: [
        {
          value: 'financial-services',
          label: 'Financial Services',
          content: {
            eyebrow: 'financial-services',
            title: 'Financial Services',
            description:
              'Unify client and advisor data, personalize every financial journey, strengthen security, and simplify compliance to build lasting trust and a competitive edge.',
            action: { label: 'Financial Services Solutions', href: '#' },
            media: { src: financialMedia, alt: 'A client signing in to a secure account on his phone' },
            stats: [
              { value: '45', suffix: '%', label: 'Faster loading time', sentiment: 'positive' },
              { value: '96', suffix: '%', label: 'Less consulting time', sentiment: 'positive' },
              { value: '30', suffix: '%', label: 'Less data entry time', sentiment: 'positive' },
            ],
          },
        },
        {
          value: 'manufacturing',
          label: 'Manufacturing',
          content: {
            eyebrow: 'manufacturing',
            title: 'Manufacturing',
            description:
              'Digitize operations, simplify B2B purchasing, and strengthen your supply chain to cut costs, boost revenue, and stay resilient amid market disruption.',
            action: { label: 'Manufacturing Solutions', href: '#' },
            media: { src: manufacturingMedia, alt: 'A container ship under way, guided by a tug' },
            stats: [
              { value: '80', suffix: '%', label: 'Faster registration & onboarding', sentiment: 'positive' },
              { value: '50', prefix: '+', suffix: '%', label: 'In online transactions', sentiment: 'positive' },
              { value: '50', suffix: '%', label: 'Less catalog production time', sentiment: 'positive' },
            ],
          },
        },
        {
          value: 'public-sector',
          label: 'Public Sector',
          content: {
            eyebrow: 'public-sector',
            title: 'Public Sector',
            description:
              'Deliver self-service citizen portals, protect sensitive data, and modernize legacy systems to cut wait times, ease workloads, and build lasting public trust.',
            action: { label: 'Public Sector Solutions', href: '#' },
            media: { src: publicSectorMedia, alt: 'A portal at the centre of create, find, share, trust and improve' },
            stats: [
              { value: '200', suffix: '+', label: 'Integrated applications', sentiment: 'positive' },
              { value: '25,000', label: 'Intranet users per day', sentiment: 'positive' },
              { value: '256K', label: 'Page views / month', sentiment: 'positive' },
            ],
          },
        },
        {
          value: 'energy-utilities',
          label: 'Energy & Utilities',
          content: {
            eyebrow: 'energy-and-utilities',
            title: 'Energy & Utilities',
            description:
              'Empower customers with self-service tools, unify data across systems, and streamline your digital workplace to boost satisfaction and lower costs to serve.',
            action: { label: 'Energy & Utilities Solutions', href: '#' },
            media: { src: energyMedia, alt: 'Two colleagues at a tablet, a validated workflow beside them' },
            stats: [
              { value: '1.7M', label: 'Customers served', sentiment: 'positive' },
              { value: '50', prefix: '+', suffix: '%', label: 'In online payments', sentiment: 'positive' },
              { value: '750', prefix: '+', suffix: '%', label: 'Processed requests / month', sentiment: 'positive' },
            ],
          },
        },
        {
          value: 'healthcare',
          label: 'Healthcare',
          content: {
            eyebrow: 'healthcare',
            title: 'Healthcare',
            description:
              'Deliver secure, personalized patient and provider self-service portals, integrate legacy systems, and simplify compliance to improve health outcomes and care.',
            action: { label: 'Healthcare Solutions', href: '#' },
            media: { src: healthcareMedia, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' },
            stats: [
              { value: '10', suffix: 'x', label: 'Faster go-to-market', sentiment: 'positive' },
              { value: '8', label: 'Month implementation' },
              { value: '0', label: 'Migration downtime', sentiment: 'positive' },
            ],
          },
        },
      ],
    },
    {
      type: 'customerStories',
      title: '1,200+ Enterprises Move the Needle With Liferay',
      titleHighlight: '1,200+ Enterprises',
      stories: [
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
          customer: 'Meridian Bank',
          value: '62',
          suffix: '%',
          label: 'Fewer service calls',
          quote:
            'Clients now open accounts, upload documents, and track requests in one place, and our advisors finally see the same picture they do.',
          name: 'Dana Whitfield',
          role: 'VP Digital Channels',
        },
      ],
    },
    {
      type: 'capabilityMap',
      anchor: 'platform',
      title: 'Every solution runs on one AI-enhanced platform',
      titleHighlight: 'one AI-enhanced platform',
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
      type: 'closingCta',
      title: 'See the solution you need, built on the platform you’ll keep',
      titleHighlight: 'the platform you’ll keep',
      description:
        'Talk to a Liferay specialist about your portal, website, commerce, or intranet goals and get a tailored walkthrough with your use case in mind.',
      placeholder: 'Work email',
      submit: 'Contact Sales',
      links: [{ label: 'Book a custom demo', href: '#' }],
      aside: { label: 'Not ready yet? Get monthly DXP insights in your inbox', href: '#' },
    },
    {
      type: 'resourceGrid',
      title: 'Plan your next solution',
      description:
        'Free guides and checklists to help you scope requirements, compare architectures, and build the business case. No forms required.',
      cards: [
        { tag: 'Guide', title: 'Web portals explained: types, features, and how to choose a platform', href: '#' },
        { tag: 'Article', title: 'DXP vs. CMS vs. portal: which architecture fits your roadmap?', href: '#' },
        { tag: 'Checklist', title: 'The B2B commerce requirements checklist for manufacturers', href: '#' },
      ],
    },
    {
      type: 'faq',
      anchor: 'faq',
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
