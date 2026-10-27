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
  ],
}
