import authorPhoto1 from '../../assets/blog/authors/author-1.webp'
import authorPhoto2 from '../../assets/blog/authors/author-2.webp'
import authorPhoto3 from '../../assets/blog/authors/author-3.webp'
import authorPhoto4 from '../../assets/blog/authors/author-4.webp'
import liferayTeamMark from '../../assets/blog/authors/liferay-team.png'
import type { BlogPostSpec, PageSpec } from './page-schema'

/*
 * The blog hub, as data.
 *
 * `Solutions Library` -> `Blog Hub` (node `25025:51238`). Every card is a real liferay.com post: the
 * title, read time, author, date and topic tags are what the post's own page shows, and the cover is
 * the image under its heading, linked from liferay.com rather than copied in.
 *
 * Where a post's page names no author, the card credits `Liferay Team`; where it shows no date or topics,
 * the card carries the Figma frame's own placeholders — `October 20, 2026` and its three topics — so every card is the full shape
 * the design draws. Most posts name no author, and the four on the older `/blog/` template carry no
 * tags and no publish date (two of those show a "last updated" date, which is the date their cards
 * print). The placeholders are added in one place, `withPlaceholders`, so `POST_DATA` stays exactly
 * what liferay.com shows.
 */

const doc = (path: string) => `https://www.liferay.com/documents/${path}`

/*
 * The named authors' portraits are stand-ins — stock headshots, not photos of Marc Hermann, Jake Belardes,
 * Peter Richards or Bryan Cheung. Swap in their real portraits before this page is shown as theirs.
 */
const POST_DATA = {
  sevenReasons: {
    title: '7 Reasons Why Our Customers Choose Liferay DXP',
    href: 'https://www.liferay.com/blog/liferay-experience/7-reasons-why-our-customers-choose-liferay-dxp',
    image: {
      src: doc(
        '246440966/376969236/7-Reasons-Customers-Choose-Liferay-DXP-Header_2+%281%29.jpg/ea4e04e5-6a9e-4ee2-3fa8-01bf92e678a6/7-Reasons-Customers-Choose-Liferay-DXP-Header_2+%281%29.jpg?version=1.0&t=1748549386501',
      ),
      alt: '',
    },
    date: 'October 2025',
    readTime: '6 Min Read',
  },
  digitalAgility: {
    title: 'How to Achieve Digital Agility for Your Website',
    href: 'https://www.liferay.com/blog/customer-experience/how-to-achieve-digital-agility-for-your-website',
    image: {
      src: doc(
        '246440966/376969236/digital-agility-website2+%281%29.jpeg/2bf00171-9944-3a2c-5ac1-d4a2b78f5b69/digital-agility-website2+%281%29.jpeg?version=1.0&t=1748550717550',
      ),
      alt: '',
    },
    date: 'August 1, 2025',
    readTime: '9 Min Read',
  },
  cmsMcpServer: {
    title: 'CMS MCP Server: How AI Agents Migrate Content in Liferay',
    href: 'https://www.liferay.com/blog/liferay-experience/cms-mcp-server-how-ai-agents-migrate-content-in-liferay',
    image: {
      src: doc(
        '246440966/376969236/MH+Blog+Bild+1.jpg/0b96f843-45b2-0751-0437-4a1c4beb7d13/MH+Blog+Bild+1.jpg?version=1.0&t=1787058374641',
      ),
      alt: '',
    },
    author: { name: 'Marc Hermann', avatar: { src: authorPhoto3, alt: '' } },
    readTime: '10 Min Read',
  },
  buyersWantFromAi: {
    title: 'What Buyers Actually Want From AI in Their Website Platform',
    href: 'https://www.liferay.com/resource-hub/blogs/what-buyers-actually-want-from-ai',
    image: {
      src: doc(
        '10182/541907499/julio-lopez-f1x6BURlxmc-unsplash.jpg/501f8b58-b9be-ef42-425c-91366d55d924/julio-lopez-f1x6BURlxmc-unsplash.jpg?version=1.1&t=1792782747077',
      ),
      alt: '',
    },
    author: { name: 'Jake Belardes', avatar: { src: authorPhoto1, alt: '' } },
    date: 'October 23, 2026',
    readTime: '8 Min Read',
    tags: ['Sites'],
  },
  modernizeLegacy: {
    title: 'How to Modernize Legacy Systems Without Migration: A DXP Approach',
    href: 'https://www.liferay.com/resource-hub/blogs/how-to-modernize-legacy-systems-without-migration',
    image: {
      src: doc(
        '10182/539729694/samuel-isaacs-zUcr96R2MV8-unsplash.jpg/f897659a-9f78-c58c-95dc-99f8ce235d0c/samuel-isaacs-zUcr96R2MV8-unsplash.jpg?version=1.0&t=1791917626608',
      ),
      alt: '',
    },
    date: 'October 14, 2026',
    readTime: '11 Min Read',
    tags: ['Integration', 'Digital Experience Platform (DXP)'],
  },
  evaluateCms: {
    title: 'How to Evaluate a CMS in 5 Steps',
    href: 'https://www.liferay.com/blog/how-to-evaluate-a-cms',
    image: {
      src: doc(
        '10182/539867880/cms-evaluation-checklist.jpg/32960f19-53bd-7a58-242d-700123ff907d/cms-evaluation-checklist.jpg?version=1.0&t=1791931033396',
      ),
      alt: '',
    },
    date: 'October 20, 2026',
    readTime: '10 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  vibeCodingExamples: {
    title: 'Vibe Coding Examples: 6 Practical Projects to Explore',
    href: 'https://www.liferay.com/blog/vibe-coding-examples-practical-projects-to-explore',
    image: {
      src: doc(
        '10182/539867783/vibe-coding-examples-wireframe.jpg/85c28572-a9e9-1d58-47be-73b51a47c5bc/vibe-coding-examples-wireframe.jpg?version=1.0&t=1791931025976',
      ),
      alt: '',
    },
    date: 'October 20, 2026',
    readTime: '12 Min Read',
    tags: ['Low-Code'],
  },
  aiAgentsInAction: {
    title: 'AI Agents in Action: 12 Real Enterprise Use Cases Across Your Organization',
    href: 'https://www.liferay.com/blog/ai-agents-in-action-real-enterprise-use-cases-across-your-organization',
    image: {
      src: doc(
        '10182/539867589/ai-agents-robotic-hand-laptop.jpg/d93298bb-0d34-34f0-8b14-b2c909310cfb/ai-agents-robotic-hand-laptop.jpg?version=1.0&t=1791931008714',
      ),
      alt: '',
    },
    date: 'October 20, 2026',
    readTime: '16 Min Read',
    tags: ['AI'],
  },
  vibeCodingDebt: {
    title: 'Vibe Coding Technical Debt: Why It Happens and How to Prevent It',
    href: 'https://www.liferay.com/blog/vibe-coding-technical-debt-why-it-happens-and-how-to-prevent-it',
    image: {
      src: doc(
        '10182/539867686/vibe-coding-technical-debt-tangled-wires.jpg/9c20dce3-293b-1237-761e-c164471cb34b/vibe-coding-technical-debt-tangled-wires.jpg?version=1.0&t=1791931017565',
      ),
      alt: '',
    },
    date: 'October 20, 2026',
    readTime: '11 Min Read',
    tags: ['Low-Code'],
  },
  whatIsLiferay: {
    title: 'What is Liferay? The Independent DXP That Outlasted Oracle and Sun',
    href: 'https://www.liferay.com/blog/category/what-is-liferay-the-independent-dxp-that-outlasted-oracle-and-sun',
    image: {
      src: doc(
        '246440966/376969236/ChatGPT+Image+Jun+22%2C+2026%2C+11_01_47+AM.png/7c9ed0a8-5a0c-cc6f-0b6f-28dc285bf7e8/ChatGPT+Image+Jun+22%2C+2026%2C+11_01_47+AM.png?version=2.0&t=1791275344191',
      ),
      alt: '',
    },
    author: { name: 'Peter Richards', avatar: { src: authorPhoto2, alt: '' } },
    readTime: '4 Min Read',
  },
  netwaysPartnerPulse: {
    title: 'Partner Pulse: How Netways Is Building AI-Ready Digital Platforms Across the Gulf',
    href: 'https://www.liferay.com/blog/business-partner-experience/netways-ai-ready-digital-platforms-gulf',
    image: {
      src: doc(
        '246440966/376969236/partner-pulse-netways-ai-ready-digital-platforms-gulf.jpg/e14228c4-c0d1-2b3f-7961-88f6403c1879/partner-pulse-netways-ai-ready-digital-platforms-gulf.jpg?version=1.0&t=1779102611737',
      ),
      alt: '',
    },
    readTime: '8 Min Read',
  },
  translationNotEnough: {
    title: "Functional Isn't Enough: Why Basic Translation Is Costing Brands Multilingual Customers",
    href: 'https://www.liferay.com/blog/functional-not-enough-basic-translation-is-costing-brands-multilingual-customers',
    /* The post has no cover; this is the first chart in its body, from the 2026 localization report. */
    image: {
      src: doc(
        '10182/0/liferay-2026-website-localization-report-abandoned-purchases-poor-localization.png/23115f43-8755-e089-fe2d-654cdfda4b29/liferay-2026-website-localization-report-abandoned-purchases-poor-localization.png',
      ),
      alt: '',
    },
    author: { name: 'Bryan Cheung', avatar: { src: authorPhoto4, alt: '' } },
    /* Not shown on the page — estimated from the article's ~2,670 words at 230 a minute. */
    readTime: '12 Min Read',
  },
  agentGovernanceAccess: {
    title: 'AI Agent Governance Starts With Access Control: Who Gave It Access to That Data?',
    href: 'https://www.liferay.com/resource-hub/blogs/ai-agent-governance-starts-with-access-control',
    image: {
      src: doc(
        '10182/539469653/Robot+Faces+Access+Denied.png/0952a930-6aea-b6f7-7d14-d6bdb5c7786a/Robot+Faces+Access+Denied.png?version=1.0&t=1791543211890',
      ),
      alt: '',
    },
    /* Initials rather than a stand-in: the four stock portraits are already in use by other authors. */
    author: { name: 'Kris Patefield' },
    date: 'October 9, 2026',
    readTime: '11 Min Read',
    tags: ['AI'],
  },
  solvingAiGovernance: {
    title: 'Solving the AI Governance Problem: Managing Access and Authority',
    href: 'https://www.liferay.com/blog/solving-the-ai-governance-problem-managing-access-and-authority',
    image: {
      src: doc(
        '10182/0/solving+ai+governance+problem+%281%29.jpg/890016d9-8079-76be-5ec9-697c55ebeda4/solving+ai+governance+problem+%281%29.jpg?version=2.0&t=1790693508841',
      ),
      alt: '',
    },
    date: 'August 27, 2026',
    readTime: '17 Min Read',
    tags: ['AI'],
  },
  structuredContent: {
    title: 'What Is Structured Content? Why It Matters When Choosing a CMS',
    href: 'https://www.liferay.com/blog/what-is-structured-content-why-it-matters-when-choosing-a-cms',
    image: {
      src: doc(
        '10182/539867977/structured-content-building-blocks.jpg/a957225c-e42c-7db0-b7fb-c2be4d326790/structured-content-building-blocks.jpg?version=1.0&t=1791931041087',
      ),
      alt: '',
    },
    date: 'October 26, 2026',
    readTime: '10 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  webtownPartnerPulse: {
    title: 'Partner Pulse: Webtown on 16 Years of Building Secure, AI-Ready Banking Portals with Liferay',
    href: 'https://www.liferay.com/blog/partner-pulse-webtown-16-years-of-building-portals',
    image: {
      src: doc(
        '10182/537711792/Partner+Pulse+-+Webtown+on+16+Years+of+Building+Portals.jpg/afc46a7d-6d69-da15-dafe-2b4e996540a9/Partner+Pulse+-+Webtown+on+16+Years+of+Building+Portals.jpg?version=1.0&t=1789470490677',
      ),
      alt: '',
    },
    date: 'September 15, 2026',
    readTime: '12 Min Read',
    /* The page carries a fourth, `Security`; a card shows three. */
    tags: ['Content Management System (CMS)', 'Commerce', 'Integration'],
  },
  intranetContentManagement: {
    title: 'Intranet Content Management Best Practices: How to Keep Employee Content Accurate and Findable',
    href: 'https://www.liferay.com/blog/intranet-content-management-best-practices',
    image: {
      src: doc(
        '10182/0/intranet+content+management+%281%29.jpg/f59d3e40-6cd6-f724-e202-84a19c7f2fab/intranet+content+management+%281%29.jpg?version=2.0&t=1791275234662',
      ),
      alt: '',
    },
    date: 'September 10, 2026',
    readTime: '12 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  composableVsHeadless: {
    title: 'Composable Commerce vs. Headless Commerce: Key Differences and How to Choose',
    href: 'https://www.liferay.com/blog/composable-commerce-vs-headless-commerce-differences-and-how-to-choose',
    image: {
      src: doc(
        '10182/0/composable+commerce+v+headless+commerce+%281%29.jpg/3e8ba0ea-e41c-8ddd-a573-845655caa387/composable+commerce+v+headless+commerce+%281%29.jpg?version=1.0&t=1787841421991',
      ),
      alt: '',
    },
    date: 'August 27, 2026',
    readTime: '11 Min Read',
    tags: ['Commerce'],
  },
  headlessVsTraditional: {
    title: 'Headless Commerce vs. Traditional Commerce: Key Differences and How to Choose',
    href: 'https://www.liferay.com/blog/headless-commerce-vs-traditional-commerce-key-differences-and-how-to-choose',
    image: {
      src: doc(
        '10182/0/headless+commerce+v+traditional+how+to+choose+%281%29.jpeg/3f1de3e3-8d37-15c7-7c3d-7a4f71800510/headless+commerce+v+traditional+how+to+choose+%281%29.jpeg?version=1.0&t=1787839711469',
      ),
      alt: '',
    },
    date: 'August 27, 2026',
    readTime: '11 Min Read',
    tags: ['Commerce'],
  },
  b2bDataQuestions: {
    title: '12 Questions to Ask Before Your Next B2B Data Project',
    href: 'https://www.liferay.com/blog/questions-to-ask-before-your-next-data-project',
    /* Served from the journal image endpoint rather than `/documents`, so the full address. */
    image: { src: 'https://www.liferay.com/image/journal/article?img_id=535344637&t=1793045275252', alt: '' },
    date: 'August 12, 2026',
    readTime: '12 Min Read',
    tags: ['Commerce'],
  },
  ecmHigherEducation: {
    title: 'Enterprise Content Management for Higher Education: How To Choose the Right System',
    href: 'https://www.liferay.com/blog/enterprise-content-management-for-higher-education',
    image: {
      src: doc(
        '10182/0/higher+education+cms+%281%29.jpg/16bdbafd-663d-ea5a-650f-3445ff81ee5e/higher+education+cms+%281%29.jpg?version=2.0&t=1791275272152',
      ),
      alt: '',
    },
    date: 'August 25, 2026',
    readTime: '13 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  ecmGovernment: {
    title:
      'Enterprise Content Management for Government: How Agencies Can Modernize Content, Records, and Citizen Services',
    href: 'https://www.liferay.com/blog/enterprise-content-management-government',
    image: {
      src: doc(
        '10182/0/government+building+%281%29.jpg/4f315013-91dc-3123-9654-beedbb0a1f21/government+building+%281%29.jpg?version=2.0&t=1790693504932',
      ),
      alt: '',
    },
    date: 'August 24, 2026',
    readTime: '13 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  ecmHealthcare: {
    title: 'The Importance of Enterprise Content Management in Healthcare',
    href: 'https://www.liferay.com/blog/enterprise-content-management-healthcare',
    image: {
      src: doc(
        '10182/0/Screenshot+2026-08-21+at+1.45.54%E2%80%AFPM+%281%29.jpg/5a6025c9-bf5b-1fbe-1b6e-2ff3a769c259/Screenshot+2026-08-21+at+1.45.54%E2%80%AFPM+%281%29.jpg?version=1.0&t=1787334546430',
      ),
      alt: '',
    },
    date: 'August 21, 2026',
    readTime: '13 Min Read',
    tags: ['Content Management System (CMS)'],
  },
  vibeCodingVsLowCode: {
    title: 'Vibe Coding vs. Low-Code Solutions: Which Development Tools Fit Your Enterprise?',
    href: 'https://www.liferay.com/blog/vibe-coding-vs-low-code-solutions-which-development-tools-fit-your-enterprise',
    image: {
      src: doc(
        '10182/0/low+code+screen+%281%29.jpg/3eca6023-501b-3d67-05db-0f698e3a3f06/low+code+screen+%281%29.jpg?version=2.0&t=1791275278710',
      ),
      alt: '',
    },
    date: 'August 26, 2026',
    readTime: '13 Min Read',
    tags: ['Low-Code'],
  },
  agenticAiMarketing: {
    title: 'Agentic AI in Marketing: The Next Evolution of Marketing Automation',
    href: 'https://www.liferay.com/blog/agentic-ai-the-next-evolution-of-marketing-automation',
    image: {
      src: doc(
        '10182/0/agentic-ai-in-marketing+%283%29.jpeg/f91802ac-2a96-0763-8efa-676c5676b38e/agentic-ai-in-marketing+%283%29.jpeg?version=1.0&t=1786643443523',
      ),
      alt: '',
    },
    date: 'August 13, 2026',
    readTime: '15 Min Read',
    tags: ['Low-Code'],
  },
  technopolisPartnerPulse: {
    title: 'Partner Pulse: How Technopolis Embraces Digital Transformation with Liferay',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-how-technopolis-embraces-digital-transformation',
    image: {
      src: doc(
        '246440966/376969236/Partner+Pulse+-+How+Technopolis+Embraces+Digital+Transformation+with+Liferay_header.jpeg/45169ede-c9c7-37cd-6c8d-e65956a75935/Partner+Pulse+-+How+Technopolis+Embraces+Digital+Transformation+with+Liferay_header.jpeg?version=1.0&t=1753174867641',
      ),
      alt: '',
    },
    readTime: '1 Min Read',
  },
  europeanAccessibilityAct: {
    title: 'How a DXP Can Help You Ensure Compliance With the European Accessibility Act',
    href: 'https://www.liferay.com/blog/category/how-a-dxp-can-help-you-ensure-compliance-with-the-european-accessibility-act',
    image: {
      src: doc(
        '246440966/376969236/Adobe+Express+-+file.jpg/769f4cb2-6c09-4935-fb98-f48ea6b385a6/Adobe+Express+-+file.jpg?version=1.0&t=1752525133245',
      ),
      alt: '',
    },
    readTime: '3 Min Read',
  },
  skodaEmployeeValue: {
    title: 'Maximizing Employee Value at Škoda Auto',
    href: 'https://www.liferay.com/blog/employee-experience/maximizing-employee-value-at-skoda-auto',
    image: {
      src: doc(
        '246440966/376969236/Maximizing+Employee+Value+at+S%CC%8Ckoda+Auto+%281%29.jpg/24993e4c-d4d8-0146-38fc-60a3a7faf8e6/Maximizing+Employee+Value+at+S%CC%8Ckoda+Auto+%281%29.jpg?version=1.0&t=1748551436048',
      ),
      alt: '',
    },
    readTime: '4 Min Read',
  },
  /* The page's heading is `Innovative Student Experiences | Liferay`; the suffix is its SEO title's. */
  innovativeStudentExperiences: {
    title: 'Innovative Student Experiences',
    href: 'https://www.liferay.com/blog/current-experiences/innovative-student-experiences',
    image: {
      src: doc(
        '246440966/376969236/Innovative+Student+Experiences+-+3+Universities+Leading+the+Way+%281%29.jpg/e3d0c261-19f5-d4ca-ea70-1a66d6272edb/Innovative+Student+Experiences+-+3+Universities+Leading+the+Way+%281%29.jpg?version=1.0&t=1748550899198',
      ),
      alt: '',
    },
    readTime: '3 Min Read',
  },
  selfServiceBanking: {
    title: 'Self Service Banking: How B2B and B2C Customers See Self Service',
    href: 'https://www.liferay.com/blog/customer-experience/self-service-banking-how-b2b-and-b2c-customers-see-self-service',
    image: {
      src: doc(
        '246440966/376969236/Self+Service+Banking+Blog+Header+%282%29.jpg/829d4cb9-eb5f-ed9c-a8aa-45a9e6e6d26b/Self+Service+Banking+Blog+Header+%282%29.jpg?version=1.0&t=1748552268525',
      ),
      alt: '',
    },
    readTime: '6 Min Read',
  },
  /* As above: the heading carries a ` | Liferay` suffix. */
  implementingStudentPortals: {
    title: 'Implementing Student Portals',
    href: 'https://www.liferay.com/blog/liferay-experience/implementing-student-portals',
    image: {
      src: doc(
        '246440966/376969236/3+Core+Considerations+When+Looking+To+Implement+a+Student+Portal+%281%29.jpg/b19e3eaa-a47e-bdeb-aa90-b432d3221abf/3+Core+Considerations+When+Looking+To+Implement+a+Student+Portal+%281%29.jpg?version=1.0&t=1748550852795',
      ),
      alt: '',
    },
    readTime: '2 Min Read',
  },
} satisfies Record<string, BlogPostSpec>

/*
 * What a card shows for whatever a post's own page does not say. A post with no named author is the
 * company's — `Liferay Team` with the logo for a portrait, as the `Blog- no padding` cell draws it (node
 * `25025:53104`). The date and topics are the `Blog Hub` frame's own placeholders.
 */
const LIFERAY_TEAM = { name: 'Liferay Team', avatar: { src: liferayTeamMark, alt: '' }, brand: true }

const PLACEHOLDER = {
  date: 'October 20, 2026',
  tags: ['Digital Experience', 'Developer', 'Customer Experience'],
}

const withPlaceholders = (post: BlogPostSpec): BlogPostSpec => ({
  ...post,
  author: post.author ?? LIFERAY_TEAM,
  date: post.date ?? PLACEHOLDER.date,
  tags: post.tags?.length ? post.tags : PLACEHOLDER.tags,
})

/** Every post the hub shows, placeholders applied — exported for the card-style comparison. */
export const POSTS = Object.fromEntries(
  Object.entries(POST_DATA).map(([key, post]) => [key, withPlaceholders(post)]),
) as Record<keyof typeof POST_DATA, BlogPostSpec>

/*
 * The card every shelf uses — chosen from a side-by-side of eight: no surface or padding, so the picture
 * is the card; the topics as XS filled pills over the headline; the two-line byline at the foot.
 */
const CARD = { card: 'plain', byline: 'stacked', tagPosition: 'top', tagStyle: 'pill' } as const

export const BLOG_HUB_PAGE: PageSpec = {
  /* No description, no ask: the hub's heading says what the blog is for, and the shelves do the rest. */
  hero: {
    background: 'corner',
    label: 'Liferay Blogs',
    title: { text: 'Ideas for the people building better digital experiences.' },
    /* No media column, so the heading would otherwise run under the corner bubble. */
    titleMaxWidth: 800,
  },
  sections: [
    {
      type: 'blogGrid',
      title: 'Featured Blogs',
      anchor: 'featured',
      ...CARD,
      posts: [POSTS.sevenReasons, POSTS.digitalAgility, POSTS.cmsMcpServer],
    },
    {
      type: 'blogGrid',
      title: 'Most Recent Blogs',
      anchor: 'most-recent',
      ...CARD,
      posts: [
        POSTS.buyersWantFromAi,
        POSTS.modernizeLegacy,
        POSTS.evaluateCms,
        POSTS.vibeCodingExamples,
        POSTS.aiAgentsInAction,
        POSTS.vibeCodingDebt,
      ],
    },
    {
      type: 'blogFeature',
      title: 'Digital Experience',
      anchor: 'digital-experience',
      ...CARD,
      description:
        'Platform strategy for the portals, sites, and digital experience platforms that connect every audience, including what Liferay DXP is and how it fits.',
      action: { label: 'View All', href: '#' },
      lead: POSTS.modernizeLegacy,
      posts: [POSTS.cmsMcpServer, POSTS.whatIsLiferay, POSTS.netwaysPartnerPulse],
    },
    {
      type: 'blogFeature',
      title: 'AI and Automation',
      anchor: 'ai-and-automation',
      ...CARD,
      description:
        'AI transformation, agentic AI, AI governance, MCP, and the automation that puts intelligent systems to work inside the enterprise.',
      action: { label: 'View All', href: '#' },
      lead: POSTS.aiAgentsInAction,
      posts: [POSTS.translationNotEnough, POSTS.agentGovernanceAccess, POSTS.solvingAiGovernance],
    },
    {
      type: 'blogFeature',
      title: 'Customer Experience',
      anchor: 'customer-experience',
      ...CARD,
      description:
        'CX strategy, personalization, and the customer and self-service portals that turn users into loyal customers.',
      action: { label: 'View All', href: '#' },
      lead: POSTS.structuredContent,
      posts: [POSTS.evaluateCms, POSTS.webtownPartnerPulse, POSTS.intranetContentManagement],
    },
    {
      type: 'blogFeature',
      title: 'Digital Commerce',
      anchor: 'digital-commerce',
      ...CARD,
      description:
        'B2B and B2C commerce strategy and capability, from storefront design to the platforms that power them.',
      action: { label: 'View All', href: '#' },
      /* The first four blogs in the Resource Hub's Blog + Commerce filter, in its order. */
      lead: POSTS.webtownPartnerPulse,
      posts: [POSTS.composableVsHeadless, POSTS.headlessVsTraditional, POSTS.b2bDataQuestions],
    },
    {
      type: 'blogFeature',
      title: 'Industry and Public Sector',
      anchor: 'industry-and-public-sector',
      ...CARD,
      description:
        'Perspectives for government, financial services, manufacturing, and healthcare, including compliance topics like NIS2 and accessibility.',
      action: { label: 'View All', href: '#' },
      /* The Resource Hub's Blog + every-industry filter returns these three, in this order. */
      lead: POSTS.ecmHigherEducation,
      posts: [POSTS.ecmGovernment, POSTS.ecmHealthcare],
    },
    {
      type: 'blogFeature',
      title: 'Developer',
      anchor: 'developer',
      ...CARD,
      description: 'Technical deep-dives, integration patterns, and architecture guidance for the teams who build.',
      action: { label: 'View All', href: '#' },
      /* The first four in the Resource Hub's Blog + Developer filter, in its order. */
      lead: POSTS.vibeCodingExamples,
      posts: [POSTS.vibeCodingDebt, POSTS.vibeCodingVsLowCode, POSTS.agenticAiMarketing],
    },
    {
      type: 'blogFeature',
      title: 'Marketing Automation',
      anchor: 'marketing-automation',
      ...CARD,
      description:
        'The martech stack, campaign orchestration, personalization at scale, and lead nurture programs that keep pipeline moving.',
      action: { label: 'View All', href: '#' },
      /* The first four in the Resource Hub's Blog + Marketing Automation filter, in its order. */
      lead: POSTS.buyersWantFromAi,
      posts: [POSTS.technopolisPartnerPulse, POSTS.europeanAccessibilityAct, POSTS.skodaEmployeeValue],
    },
    {
      type: 'blogFeature',
      title: 'SEO and Analytics',
      anchor: 'seo-and-analytics',
      ...CARD,
      description:
        'SEO, AEO and GEO for AI-driven search, content performance, and the analytics that show what is actually working.',
      action: { label: 'View All', href: '#' },
      /* The first four in the Resource Hub's Blog + SEO & Analytics filter, in its order. */
      lead: POSTS.skodaEmployeeValue,
      posts: [POSTS.innovativeStudentExperiences, POSTS.selfServiceBanking, POSTS.implementingStudentPortals],
    },
    /*
     * The page's closing ask, in place of the footer's `Ready for the future?` band —
     * `Page Action Section` (node `25037:46647`).
     */
    {
      type: 'closingCta',
      title: 'The Best of the Liferay Blog, Delivered Monthly.',
      titleHighlight: 'Delivered Monthly',
      description: 'Insights on digital experience, AI, and content. No fluff, just the ideas worth your time.',
      placeholder: 'Enter Your Email',
      submit: 'Subscribe',
      consent: {
        text: 'By subscribing, you agree to receive marketing emails from Liferay. You can unsubscribe at any time. See our',
        link: { label: 'Privacy Policy', href: 'https://www.liferay.com/privacy-policy' },
      },
    },
  ],
}
