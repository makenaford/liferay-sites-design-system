/*
 * The site navigation, from the content sheet.
 *
 * Generated from `Nav & Footer Links - Global_Nav_Final.csv` and the icon library in
 * `Navigation Phase 01 - Rebrand` (node `14018:7554`), which pairs an icon with each item by name.
 * Data rather than markup so the header stories and the page templates render the same nav from one
 * source — they used to hold two different copies, and the templates' was the poorer of the two.
 *
 * `icon` is a MingCute name from this library's own set. `standin: true` marks the ten items the file
 * draws with Marketing or LRDC brand artwork, which is not in MingCute and not in this library: those
 * carry the nearest UI icon until the real SVGs are exported. Items with no icon have none in the file
 * either — Featured cards and customer stories are drawn without one.
 *
 * **`AI Agents` is deliberately not here.** The sheet lists it, but marks it with an asterisk and
 * gives eight of its nine items a `tbd` URL, and the rebrand icon library has no entry for any of
 * them. Excluded on request; re-add it from the sheet when the destinations exist.
 */

export interface NavLink {
  title: string
  href: string
  description?: string
  /** A featured card's thumbnail, drawn as a brand-coloured field at this hue. */
  hue?: number
  /** A MingCute icon name, resolved to a component in `nav-icons.tsx`. */
  icon?: string
  /** The file draws brand artwork here; this is the nearest stand-in. */
  standin?: boolean
  /** The sheet marks the destination as not yet published. */
  unpublished?: boolean
  /** Leaves the site — takes the icon that says so, and opens in a new tab. */
  external?: boolean
}

export interface NavColumn {
  heading?: string
  links: NavLink[]
}

export interface NavMenu {
  value: string
  label: string
  columns: NavColumn[]
  /** The prompt across the top of the panel, above the columns. */
  heading?: string
  /** One tile per column, each heading the column it sits above in place of its label. */
  tiles?: NavLink[]
  /** The rail on the right. Cards with a `hue` draw a thumbnail. */
  featured?: NavLink[]
  /** The heading over the rail. @default 'Featured' */
  featuredHeading?: string
  /** A narrow rail of cards with the thumbnail over the text rather than beside it. */
  featuredStacked?: boolean
  /** The "see all" link that closes the rail. */
  featuredMore?: { label: string; href: string }
  /** The strip across the bottom of the Platform menu. */
  cta?: { label: string; href: string }
}

export const SITE_NAV: NavMenu[] = [
  {
    value: 'platform',
    label: 'Platform',
    columns: [
      {
        heading: 'Digital Experience',
        links: [
          { title: 'Platform Overview', href: 'https://www.liferay.com/platform', description: 'Explore the complete digital experience platform.', icon: 'IconLayoutGrid', standin: true },
          { title: 'Content Marketing Platform', href: 'https://www.liferay.com/capabilities/cmp', description: 'Plan and deliver marketing campaigns.', icon: 'IconBulb', standin: true },
          { title: 'Digital Asset Management', href: 'https://www.liferay.com/capabilities/dam', description: 'Organize and publish assets in one place.', icon: 'IconFolder2', standin: true },
          { title: 'Personalization', href: 'https://www.liferay.com/capabilities/personalization', description: 'Deliver personalized content to every visitor.', icon: 'IconSettings2' },
          { title: 'Sites', href: 'https://www.liferay.com/capabilities/sites', description: 'Build and manage on-brand websites fast.', icon: 'IconWeb', standin: true },
          { title: 'Analytics & Optimization', href: 'https://www.liferay.com/capabilities/analytics', description: 'Track engagement and optimize experiences.', icon: 'IconChartLine' },
        ],
      },
      {
        heading: 'Content Management',
        links: [
          { title: 'CMS Overview', href: 'https://www.liferay.com/capabilities/cms', description: 'Create and publish content with ease.', icon: 'IconDocument2', standin: true },
          { title: 'Enterprise', href: 'https://www.liferay.com/capabilities/cms/enterprise', description: 'Govern content across global teams.', icon: 'IconBuilding1' },
          { title: 'Headless', href: 'https://www.liferay.com/capabilities/cms/headless', description: 'Deliver content anywhere via API.', icon: 'IconBracketsAngle', standin: true },
          { title: 'AI Search & SEO', href: 'https://www.liferay.com/capabilities/cms/seo', description: 'Optimize content for AI and search.', icon: 'IconSearchAi' },
          { title: 'Intranet', href: 'https://www.liferay.com/capabilities/cms/intranet', description: 'Keep employees informed and connected.', icon: 'IconGroup3' },
          { title: 'Open-Source', href: 'https://www.liferay.com/capabilities/cms/open-source', description: 'API-first, open source, built to scale.', icon: 'IconTerminalBox' },
        ],
      },
      {
        heading: 'Digital Commerce',
        links: [
          { title: 'Commerce Overview', href: 'https://www.liferay.com/capabilities/commerce', description: 'End-to-end commerce, built into your DXP.', icon: 'IconShoppingCart1' },
          { title: 'B2B Commerce Platform', href: 'https://www.liferay.com/capabilities/commerce/b2b-commerce-platform', description: 'Simplify complex B2B buying journeys.', icon: 'IconShoppingBag1' },
          { title: 'Digital Storefronts', href: 'https://www.liferay.com/capabilities/commerce/digital-storefronts', description: 'Launch storefronts that convert.', icon: 'IconShop' },
          { title: 'Composable Commerce Platform', href: 'https://www.liferay.com/capabilities/commerce/composable', description: 'Mix and match your commerce stack.', icon: 'IconCube', unpublished: true },
          { title: 'Headless Commerce', href: 'https://www.liferay.com/capabilities/commerce/headless', description: 'Power commerce through flexible APIs.', icon: 'IconCube', unpublished: true },
          { title: 'Product Information Management', href: 'https://www.liferay.com/capabilities/commerce/pim', description: 'Centralize product data for every channel.', icon: 'IconListSearch', unpublished: true },
        ],
      },
      {
        heading: 'Capabilities',
        links: [
          { title: 'AI Agent Builder', href: 'https://www.liferay.com/capabilities/ai-hub', description: 'Build and deploy smart AI agents fast.', icon: 'IconRocket' },
          { title: 'Internal Search', href: 'https://www.liferay.com/capabilities/search', description: 'Help users find answers instantly.', icon: 'IconSearch' },
          { title: 'Integration', href: 'https://www.liferay.com/capabilities/integration', description: 'Connect Liferay to your existing systems.', icon: 'IconSettings5' },
          { title: 'Low-Code', href: 'https://www.liferay.com/capabilities/low-code', description: 'Build apps and workflows without code.', icon: 'IconPlugin2', standin: true },
          { title: 'Security', href: 'https://www.liferay.com/capabilities/security', description: 'Enterprise-grade security, built in.', icon: 'IconLock' },
          { title: 'Content Delivery Network', href: 'https://www.liferay.com/capabilities/cdn', description: 'Deliver content fast, worldwide.', icon: 'IconSend' },
        ],
      },
    ],
    cta: { label: 'See Subscription & Deployment Options', href: 'https://www.liferay.com/subscriptions' },
  },
  {
    value: 'solutions',
    label: 'Solutions',
    heading: 'What are you looking to achieve?',
    tiles: [
      { title: 'Improve SEO & AEO', href: 'https://www.liferay.com/capabilities/cms/seo', description: 'Manage every layer of SEO in one CMS.', icon: 'IconSearchAi' },
      { title: 'Build Portals & Intranets', href: 'https://www.liferay.com/enterprise-portals', icon: 'IconWeb' },
      { title: 'Centralize Systems', href: 'https://www.liferay.com/solutions/build-modern-digital-experience', description: 'Attract more traffic with a modern site.', icon: 'IconMindMap' },
      { title: 'Customize Experiences', href: 'https://www.liferay.com/industries', description: 'Tailored solutions for your industry.', icon: 'IconUser1' },
    ],
    columns: [
      {
        heading: 'Improve SEO & AEO',
        links: [
          { title: 'AI Search', href: 'https://www.liferay.com/capabilities/cms/seo/ai-search', description: 'Get found and cited by AI search engines.', icon: 'IconSearchAi' },
          { title: 'Technical & Events', href: 'https://www.liferay.com/capabilities/cms/seo/technical-seo', description: 'Fix technical SEO, no developer needed.', icon: 'IconTool' },
          { title: 'Multilingual', href: 'https://www.liferay.com/capabilities/cms/seo/multilingual', description: 'Reach global audiences in 50+ languages.', icon: 'IconTranslate2Ai' },
          { title: 'Audit', href: 'https://www.liferay.com/capabilities/cms/seo/audit', description: 'Catch SEO and accessibility issues early.', icon: 'IconFileSearch' },
        ],
      },
      {
        heading: 'Build Portals & Intranets',
        links: [
          { title: 'Customer Portals', href: 'https://www.liferay.com/solutions/customer-portals', description: 'Help customers self-serve and succeed.', icon: 'IconUser1' },
          { title: 'Partner Portals', href: 'https://www.liferay.com/solutions/partner-portals', description: 'Simplify how partners work with you.', icon: 'IconUser4' },
          { title: 'Supplier Portals', href: 'https://www.liferay.com/solutions/supplier-portals', description: 'Centralize supplier communication.', icon: 'IconTruck' },
          { title: 'Intranets', href: 'https://www.liferay.com/solutions/intranets', description: 'Give employees a connected digital home.', icon: 'IconDocument2' },
        ],
      },
      {
        heading: 'Centralize Systems',
        links: [
          { title: 'Enterprise Websites', href: 'https://www.liferay.com/solutions/enterprise-websites', description: 'Launch and manage websites at scale.', icon: 'IconBuilding1' },
          { title: 'Integrate siloed enterprise applications', href: 'https://www.liferay.com/solutions/integrate-siloed-enterprise-applications', description: 'Unify your CRM, ERP, and legacy systems on one platform', icon: 'IconSettings5' },
          { title: 'Modernize Legacy Infrastructure', href: 'https://www.liferay.com/solutions/modernize-legacy-digital-infrastructure-for-growth', description: 'Migrate on your terms while keeping the business running.', icon: 'IconCube' },
          { title: 'Personalized experiences at scale', href: 'https://www.liferay.com/solutions/deliver-personalized-digital-experiences-at-scale', description: 'Personalize without IT delays, and prove it\'s working.', icon: 'IconSettings2' },
        ],
      },
      {
        heading: 'Customize Experiences',
        links: [
          { title: 'Financial Services', href: 'https://www.liferay.com/industries/financial-services', description: 'Secure and compliant solutions for financial services.', icon: 'IconBuilding1' },
          { title: 'Manufacturing', href: 'https://www.liferay.com/industries/manufacturing', description: 'Modernize operations and B2B buying./Drive revenue and reduce costs with digitized operations.', icon: 'IconFactory', standin: true },
          { title: 'Public Sector', href: 'https://www.liferay.com/industries/public-sector', description: 'Deliver secure digital citizen services.', icon: 'IconGovernment', standin: true },
          { title: 'Energy & Utilities', href: 'https://www.liferay.com/industries/energy-and-utilities', description: 'Offer intuitive and cost-effective customer experiences.', icon: 'IconHighVoltagePower' },
        ],
      },
    ],
    featuredStacked: true,
    featured: [
      { title: 'Skoda Auto\'s Intranet Serves 40,000 Employees', href: 'https://www.liferay.com/web/guest/resources/case-studies/skoda-auto', description: 'Inside Škoda personalized employee experience', hue: 205 },
      { title: '11 Building Blocks for a High-Performing Supplier Portal', href: 'https://www.liferay.com/blog/business-partner-experience/-11-building-blocks-for-a-high-performing-supplier-portal', description: 'Checklist: Automate workflows, boost efficiency.', hue: 268 },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    columns: [
      {
        heading: 'Knowledge Center',
        links: [
          { title: 'Resource Hub', href: 'https://www.liferay.com/resource-hub', description: 'Explore guides, ebooks, and whitepapers.', icon: 'IconBook2' },
          { title: 'Webinars & Events', href: 'https://www.liferay.com/events', description: 'Save your seat for our next session, live or in person.', icon: 'IconPresentation1' },
          { title: 'Blog', href: 'https://www.liferay.com/blogs', description: 'Insights on digital strategy and customer experience.', icon: 'IconChat1' },
          { title: 'Documentation', href: 'https://learn.liferay.com/documentation', description: 'All in one spot: Official guides for Liferay DXP.', icon: 'IconDocument2' },
          { title: 'Online Courses', href: 'https://learn.liferay.com/education/courses', description: 'Master Liferay DXP, self-paced and in-depth.', icon: 'IconMortarboard' },
          { title: 'In-Person Training', href: 'https://www.liferay.com/classroom-training', description: 'Get hands-on with instructor-led training.', icon: 'IconClipboard' },
        ],
      },
      {
        heading: 'AI & Digital Strategy',
        links: [
          { title: 'AI For Your Enterprise Needs', href: 'https://www.liferay.com/resources-hub/guide/ai-for-your-entire-organization', description: 'Purpose-built agents, grounded in your data.', icon: 'IconBuilding1' },
          { title: 'Operationalizing an AI Governance Framework', href: 'https://www.liferay.com/resource-hub/blogs/ai-governance-framework', description: 'AI governance: from strategy to execution.', icon: 'IconShieldShape', standin: true },
          { title: 'How the AI Governance Maturity Model Works', href: 'https://www.liferay.com/resource-hub/guides/ai-governance-maturity-model', description: 'The five levels of AI governance maturity.', icon: 'IconChartLine', standin: true },
        ],
      },
      {
        heading: 'Technical Insights',
        links: [
          { title: 'Headless CMS vs Traditional CMS', href: 'https://www.liferay.com/blog/current-experiences/traditional-vs-headless-choosing-the-right-cms-architecture', description: 'Find the right fit for your team.', icon: 'IconLayoutGrid', standin: true },
          { title: 'DXP vs CMS: What\'s the Difference?', href: 'https://www.liferay.com/blog/current-experiences/what-s-the-difference-between-a-cms-portal-and-dxp-', description: 'One manages content. The other does a lot more.', icon: 'IconCube' },
          { title: 'Composable Architecture Guide', href: '#', icon: 'IconBracketsAngle', standin: true },
        ],
      },
    ],
    featuredHeading: 'Customer Stories',
    featured: [
      { title: 'Unilever Achieves 133% Faster Go to Market', href: 'https://www.liferay.com/resources/case-studies/unilever', description: 'How a platform overhaul sped up new product rollouts.', hue: 232 },
      { title: 'Petrobras creates better experiences for employees and customers', href: 'https://www.liferay.com/resources/case-studies/petrobras', description: 'See how Petrobras unified sites for 4M+ users.', hue: 150 },
      { title: 'Lenovo increases partner satisfaction and sales', href: 'https://www.liferay.com/resources/case-studies/lenovo', description: 'How one unified hub set partners up for success.', hue: 356 },
    ],
    featuredMore: { label: 'See All Customer Stories', href: 'https://www.liferay.com/resources-hub/customer-stories' },
  },
  {
    value: 'partners',
    label: 'Partners',
    columns: [
      {
        /*
         * One column, not two of one row each. Find a Partner and Partner Portal were a heading apiece
         * over a single link — a column that is all label and no list, twice — so they share the one
         * they were always describing.
         */
        heading: 'Resources',
        links: [
          { title: 'Partner Directory', href: 'https://www.liferay.com/partners/directory', description: 'Find a certified Liferay partner.', icon: 'IconContacts3' },
          { title: 'Partner Portal', href: 'https://partner.liferay.com/', description: 'Partner resources and support in one place.', icon: 'IconUser4', external: true },
        ],
      },
      {
        heading: 'Become a Partner',
        links: [
          { title: 'Solution Partner', href: 'https://www.liferay.com/partners/solution-partner', description: 'Become a certified Solution Partner.', icon: 'IconUserFollow2' },
          { title: 'OEM Partner', href: 'https://www.liferay.com/partners/oem-partner', description: 'License Liferay and make it part of your product.', icon: 'IconCube' },
          { title: 'Technology Partner', href: 'https://www.liferay.com/partners/technology-partner', description: 'Join our growing ecosystem.', icon: 'IconWeb' },
        ],
      },
      {
        heading: 'Liferay Services',
        links: [
          { title: 'Global Services', href: 'https://www.liferay.com/consulting', description: 'Expert consulting for your DXP project.', icon: 'IconWorld2' },
          { title: 'Technical Account Management', href: 'https://www.liferay.com/subscriptions/technical-account-management', description: 'Get hands-on guidance from launch onward.', icon: 'IconContacts2' },
          { title: 'Managed Services', href: 'https://www.liferay.com/consulting', description: 'Let Liferay manage your DXP for you.', icon: 'IconSettings5' },
          { title: 'Customer Support Portal', href: 'https://support.liferay.com/', description: 'Get help and manage support tickets.', icon: 'IconQuestion' },
        ],
      },
    ],
    featuredStacked: true,
    featured: [
      { title: 'Techem\'s Customer Portal Goes Live in 18 Countries', href: 'https://www.liferay.com/resources/case-studies/techem', description: 'tech', hue: 20 },
      { title: 'Maschio Gaspardo Builds a Single Source of Truth for Product Data', href: 'https://www.liferay.com/resources/case-studies/maschio-gaspardo', description: 'From 6,000 printed catalogs a year to just 100.', hue: 96 },
    ],
  },
]
