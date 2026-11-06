import { BLOG_HUB_PAGE, BLOG_NEWSLETTER, LIFERAY_TEAM, POSTS, type BlogCategory } from './blog-hub-page'
import type { BlogPostSpec, PageSpec, SectionSpec } from './page-schema'

/*
 * One blog category, as data — `Solutions Library` -> `Blog Category Page` (node `25181:62613`).
 *
 * The category is `Digital Experience`, and its posts are every blog the Resource Hub lists under
 * `Product Module: Digital Experience Platform (DXP)` (`/resource-hub?productModule=521408749`), in the
 * hub's own order — 53 of them; its one Spanish entry, a translation of `Why Security Should Be a Business
 * Leader Concern`, is left out. The date is the one the hub sorts them by, which is also the date a
 * post's own page shows where it shows one. The read time and the cover are the post's page's own, and
 * the cover is linked from liferay.com rather than copied in, as on the hub.
 *
 * Only a handful of posts name an author; those come from the hub's own posts, so a portrait (still a
 * stand-in) is never drawn twice for one person. Everyone else is `Liferay Team`.
 */

const doc = (path: string) => `https://www.liferay.com/documents/${path}`

const POST_DATA: Omit<BlogPostSpec, 'author'>[] = [
  {
    title: 'Sitecore Migration Strategy: Should You Stay, Step Up to SitecoreAI, or Switch?',
    href: 'https://www.liferay.com/w/sitecore-migration-stay-step-up-switch',
    image: { src: doc('10182/545817862/marvin-meyer-SYTO3xs06fU-unsplash.jpg/c52cbdc0-e2e3-ff6b-aa2e-31a580415e4f/marvin-meyer-SYTO3xs06fU-unsplash.jpg?version=1.0&t=1793809550071'), alt: '' },
    date: 'November 4, 2026',
    readTime: '12 Min Read',
  },
  {
    title: 'Omnichannel vs. Multichannel: Key Differences',
    href: 'https://www.liferay.com/blog/multichannel-vs-omnichannel',
    image: { src: doc('10182/542803387/a-laptop-and-a-smartphone-side-by-side-on-a-white-desk.jpg/6218561a-86d0-bf41-1b5b-192061f75bd7/a-laptop-and-a-smartphone-side-by-side-on-a-white-desk.jpg?version=1.0&t=1793026313546'), alt: '' },
    date: 'October 29, 2026',
    readTime: '14 Min Read',
  },
  {
    title: 'How to Modernize Legacy Systems Without Migration: A DXP Approach',
    href: 'https://www.liferay.com/resource-hub/blogs/how-to-modernize-legacy-systems-without-migration',
    image: { src: doc('10182/539729694/samuel-isaacs-zUcr96R2MV8-unsplash.jpg/f897659a-9f78-c58c-95dc-99f8ce235d0c/samuel-isaacs-zUcr96R2MV8-unsplash.jpg?version=1.0&t=1791917626608'), alt: '' },
    date: 'October 14, 2026',
    readTime: '11 Min Read',
  },
  {
    title: 'CMS MCP Server: How AI Agents Migrate Content in Liferay',
    href: 'https://www.liferay.com/blog/liferay-experience/cms-mcp-server-how-ai-agents-migrate-content-in-liferay',
    image: { src: doc('246440966/376969236/MH+Blog+Bild+1.jpg/0b96f843-45b2-0751-0437-4a1c4beb7d13/MH+Blog+Bild+1.jpg?version=1.0&t=1787058374641'), alt: '' },
    date: 'August 18, 2026',
    readTime: '10 Min Read',
  },
  {
    title: 'What is Liferay? The Independent DXP That Outlasted Oracle and Sun',
    href: 'https://www.liferay.com/blog/category/what-is-liferay-the-independent-dxp-that-outlasted-oracle-and-sun',
    image: { src: doc('246440966/372654306/ChatGPT+Image+Jun+22%2C+2026%2C+11_01_47+AM.png/68f6fef4-86f1-90a3-383e-a108f4a05e28/ChatGPT+Image+Jun+22%2C+2026%2C+11_01_47+AM.png?version=1.0&t=1782137452218'), alt: '' },
    date: 'June 22, 2026',
    readTime: '4 Min Read',
  },
  {
    title: 'Partner Pulse: How Netways Is Building AI-Ready Digital Platforms Across the Gulf',
    href: 'https://www.liferay.com/blog/business-partner-experience/netways-ai-ready-digital-platforms-gulf',
    image: { src: doc('246440966/376969236/partner-pulse-netways-ai-ready-digital-platforms-gulf.jpg/e14228c4-c0d1-2b3f-7961-88f6403c1879/partner-pulse-netways-ai-ready-digital-platforms-gulf.jpg?version=1.0&t=1779102611737'), alt: '' },
    date: 'May 18, 2026',
    readTime: '8 Min Read',
  },
  {
    title: 'Liferay DXP Free Tier: What It Is, How to Get It, and When to Upgrade',
    href: 'https://www.liferay.com/blog/liferay-experience/liferay-dxp-free-tier-how-to-get-it-when-upgrade',
    image: { src: doc('246440966/376969236/Liferay-DXP-Free-Tier-blog-hero.jpg/375ea886-f43b-ed0b-7787-0a2b70740cfd/Liferay-DXP-Free-Tier-blog-hero.jpg?version=1.0&t=1776927312727'), alt: '' },
    date: 'April 22, 2026',
    readTime: '4 Min Read',
  },
  {
    title: 'Partner Pulse: How Asponte Technology Delivers Mission-First Digital Experiences at Scale',
    href: 'https://www.liferay.com/blog/business-partner-experience/partner-pulse-asponte-technology-digital-experiences-at-scale',
    image: { src: doc('246440966/376969236/partner-pulse-asponte-technology.jpg/96e52606-1dab-4957-8a5f-3a5b831d1f74/partner-pulse-asponte-technology.jpg?version=1.0&t=1776865554322'), alt: '' },
    date: 'April 22, 2026',
    readTime: '5 Min Read',
  },
  {
    title: 'What is Total Experience (TX)? Why Digital Strategies Fail',
    href: 'https://www.liferay.com/blog/category/what-is-total-experience-tx',
    image: { src: doc('246440966/372654306/What+Is+Total+Experience+%281%29.png/c7562c47-4616-0f8a-8ac0-c18a56ef4888/What+Is+Total+Experience+%281%29.png?version=1.0&t=1776699726263'), alt: '' },
    date: 'April 17, 2026',
    readTime: '6 Min Read',
  },
  {
    title: 'Headless CMS vs Traditional CMS: Which Architecture Fits Your Team?',
    href: 'https://www.liferay.com/blog/current-experiences/headless-cms-vs-traditional-cms-which-architecture-fits-your-team-',
    image: { src: doc('246440966/376969236/traditional-vs-headless-cms.jpg/cb98928e-7859-c6c0-a967-580905f7cb63/traditional-vs-headless-cms.jpg?version=1.0&t=1770896011437'), alt: '' },
    date: 'February 12, 2026',
    readTime: '8 Min Read',
  },
  {
    title: 'Revolutionizing Banking Customer Experience: Combining Liferay DXP and Camunda Agentic Automation',
    href: 'https://www.liferay.com/blog/business-partner-experience/revolutionizing-banking-customer-experience-liferay-camunda',
    image: { src: doc('246440966/376969236/liferay-camunda-banking_header.jpg/3f6bcde7-1ddc-2880-a27c-7ee81628460e/liferay-camunda-banking_header.jpg?version=1.0&t=1764949580850'), alt: '' },
    date: 'December 5, 2025',
    readTime: '6 Min Read',
  },
  {
    title: 'Partner Pulse: How Aixtor Builds Telecom-Grade DXPs – and What Every Enterprise Can Learn',
    href: 'https://www.liferay.com/blog/business-partner-experience/partner-pulse-how-aixtor-builds-telecom-grade-dxps',
    image: { src: doc('246440966/376969236/Partner+Pulse+-+How+Aixtor+Builds+Telecom-Grade+DXPs_th.jpg/947e1cf8-1ce3-7d09-22d2-d43c833f26e6/Partner+Pulse+-+How+Aixtor+Builds+Telecom-Grade+DXPs_th.jpg?version=1.0&t=1760343307976'), alt: '' },
    date: 'October 13, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Partner Pulse: How VASS is Navigating LATAM’s Digital Divide',
    href: 'https://www.liferay.com/blog/business-partner-experience/partner-pulse-vass-navigating-latam-digital-divide',
    image: { src: doc('246440966/376969236/partner-pulse-blog-post-interview-series-custom.jpg/bfc79484-5220-081f-701c-27af290d09d7/partner-pulse-blog-post-interview-series-custom.jpg?version=1.0&t=1758187267062'), alt: '' },
    date: 'September 17, 2025',
    readTime: '2 Min Read',
  },
  {
    title: 'How a Modern CMS Powers Advanced Personalization in Public Services',
    href: 'https://www.liferay.com/blog/customer-experience/how-a-modern-cms-powers-advanced-personalization-in-public-services',
    image: { src: doc('246440966/376969236/Gemini_Generated_Image_w6o9o8w6o9o8w6o9.png/ddf97b94-b9ca-ef69-6e0c-4c02c4fa9169/Gemini_Generated_Image_w6o9o8w6o9o8w6o9.png?version=2.0&t=1790693511094'), alt: '' },
    date: 'September 4, 2025',
    readTime: '8 Min Read',
  },
  {
    title: 'Partner Pulse: TCS Interactive on AI, Headless CMS, and Personalization',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-tcs-interactive-ai-headless-cms-personalization',
    image: { src: doc('246440966/376969236/Partner+Pulse+TCS+Interactive+AI+_Headless+CMS_Personalization.jpeg/058b6a45-f3d1-a2fb-9d8f-236bd103e9a0/Partner+Pulse+TCS+Interactive+AI+_Headless+CMS_Personalization.jpeg?version=1.0&t=1754904452365'), alt: '' },
    date: 'August 11, 2025',
    readTime: '2 Min Read',
  },
  {
    title: 'Conquering Technical Debt & Legacy Systems: A Roadmap to Modernizing Your Digital Foundation',
    href: 'https://www.liferay.com/blog/customer-experience/conquering-technical-debt-legacy-systems-a-roadmap-to-modernizing-your-digital-foundation',
    image: { src: doc('246440966/376969236/mina-rad-qFSQFSmfZkA-unsplash.jpg/ddda97da-5fd4-b3ef-884c-adc3652ebe58/mina-rad-qFSQFSmfZkA-unsplash.jpg?version=1.0&t=1754587005481'), alt: '' },
    date: 'August 7, 2025',
    readTime: '5 Min Read',
  },
  {
    title: 'What Downtime Actually Costs and How to Avoid It',
    href: 'https://www.liferay.com/blog/category/what-downtime-actually-costs-and-how-to-avoid-it',
    image: { src: doc('246440966/376969236/Adobe+Express+-+file+%283%29.jpg/2740c2b1-0b83-fdb1-be9c-76c1b0ebc27f/Adobe+Express+-+file+%283%29.jpg?version=1.0&t=1753398903942'), alt: '' },
    date: 'July 24, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Partner Pulse: How Technopolis Embraces Digital Transformation with Liferay',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-how-technopolis-embraces-digital-transformation',
    image: { src: doc('246440966/376969236/Partner+Pulse+-+How+Technopolis+Embraces+Digital+Transformation+with+Liferay_header.jpeg/45169ede-c9c7-37cd-6c8d-e65956a75935/Partner+Pulse+-+How+Technopolis+Embraces+Digital+Transformation+with+Liferay_header.jpeg?version=1.0&t=1753174867641'), alt: '' },
    date: 'July 25, 2025',
    readTime: '1 Min Read',
  },
  {
    title: 'Partner Pulse: From Brazil to North America – Objective Group’s Journey to Rising Star',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-from-brazil-to-north-america-objective-group',
    image: { src: doc('246440966/376969236/Partner+Pulse+-+From+Brazil+to+North+America+%E2%80%93+Objective+Group_th.jpg/d569d7f9-6805-76c5-6697-8df007495dbf/Partner+Pulse+-+From+Brazil+to+North+America+%E2%80%93+Objective+Group_th.jpg?version=1.0&t=1753172018923'), alt: '' },
    date: 'July 22, 2025',
    readTime: '1 Min Read',
  },
  {
    title: "Navigating the Digital Experience Landscape: Liferay's Position in the 2025 Voice of the Customer for DXPs",
    href: 'https://www.liferay.com/blog/liferay-experience/liferay-2025-voice-of-the-customer-for-dxps',
    image: { src: doc('246440966/376969236/Adobe+Express+-+file+%282%29.jpg/792e902b-1846-0b7c-0907-f00c1410471a/Adobe+Express+-+file+%282%29.jpg?version=1.0&t=1752762881065'), alt: '' },
    date: 'July 16, 2025',
    readTime: '2 Min Read',
  },
  {
    title: 'How a DXP Can Help You Ensure Compliance With the European Accessibility Act',
    href: 'https://www.liferay.com/blog/category/how-a-dxp-can-help-you-ensure-compliance-with-the-european-accessibility-act',
    image: { src: doc('246440966/376969236/Adobe+Express+-+file.jpg/769f4cb2-6c09-4935-fb98-f48ea6b385a6/Adobe+Express+-+file.jpg?version=1.0&t=1752525133245'), alt: '' },
    date: 'July 14, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Partner Pulse: How Aggity Breaks Down Silos and Builds Smarter Experiences',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-how-aggity-breaks-down-silos-and-builds-smarter-experiences',
    image: { src: doc('246440966/376969236/partner-pulse-aggity.jpeg/5ad8bedd-b02d-609f-61ff-8627e3a94ec9/partner-pulse-aggity.jpeg?version=1.0&t=1751017008312'), alt: '' },
    date: 'June 27, 2025',
    readTime: '1 Min Read',
  },
  {
    title: 'Partner Pulse: Solteq on Digital Growth and DXP Strategy',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-solteq-digital-growth-and-dxp-strategy',
    image: { src: doc('246440966/376969236/Partner+Pulse+-+Solteq+on+Digital+Growth+and+DXP+Strategy_th.png/0a0c2aac-bd8b-863e-cca5-c0e7695bc68d/Partner+Pulse+-+Solteq+on+Digital+Growth+and+DXP+Strategy_th.png?version=2.0&t=1791275239510'), alt: '' },
    date: 'May 23, 2025',
    readTime: '1 Min Read',
  },
  {
    title: '6 Pillars for a Successful Citizen Relationship Management Platform',
    href: 'https://www.liferay.com/blog/category/6-pillars-for-successful-citizen-relationship-management-platform',
    image: { src: doc('246440966/376969236/AdobeStock_366256959.jpg/770b88c5-c72a-dbcd-6d6b-a152bfbcf920/AdobeStock_366256959.jpg?version=1.0&t=1760338055049'), alt: '' },
    date: 'June 5, 2025',
    readTime: '4 Min Read',
  },
  {
    title: 'Partner Pulse: Protiviti on Digital Transformation in the Middle East',
    href: 'https://www.liferay.com/blog/customer-experience/partner-pulse-protiviti-digital-transformation-middle-east',
    image: { src: doc('246440966/376969236/protiviti-ai-cms-low-code-partner-pulse.jpeg/787f6816-aa86-0fe2-1355-69dc66868291/protiviti-ai-cms-low-code-partner-pulse.jpeg?version=1.0&t=1750155476364'), alt: '' },
    date: 'June 9, 2025',
    readTime: '1 Min Read',
  },
  {
    title: '5 Security Best Practices to Keep Your Liferay Deployment Safe',
    href: 'https://www.liferay.com/blog/customer-experience/security-best-practices-to-keep-your-liferay-deployment-safe',
    image: { src: doc('246440966/376969236/cropped-philipp-katzenberger-iIJrUoeRoCQ-unsplash+%281%29.jpg/dcfaf91e-c638-e3f4-6e4e-d71417b62ea7/cropped-philipp-katzenberger-iIJrUoeRoCQ-unsplash+%281%29.jpg?version=1.0&t=1748549201562'), alt: '' },
    date: 'May 13, 2025',
    readTime: '2 Min Read',
  },
  {
    title: 'What Is an Enterprise Website? Don’t Neglect These Essential Elements',
    href: 'https://www.liferay.com/blog/customer-experience/are-you-neglecting-these-3-essential-elements-of-an-enterprise-website',
    image: { src: doc('246440966/376969236/AdobeStock_109998677+%281%29.jpeg/c8a5b232-ac0a-7bfc-0975-29bb29ef9041/AdobeStock_109998677+%281%29.jpeg?version=1.0&t=1748549562939'), alt: '' },
    date: 'May 6, 2025',
    readTime: '9 Min Read',
  },
  {
    title: 'How to Achieve Digital Agility for Your Website',
    href: 'https://www.liferay.com/blog/customer-experience/how-to-achieve-digital-agility-for-your-website',
    image: { src: doc('246440966/376969236/digital-agility-website2+%281%29.jpeg/2bf00171-9944-3a2c-5ac1-d4a2b78f5b69/digital-agility-website2+%281%29.jpeg?version=1.0&t=1748550717550'), alt: '' },
    date: 'May 7, 2025',
    readTime: '9 Min Read',
  },
  {
    title: 'What Exactly Is Modern Application Development in Liferay?',
    href: 'https://www.liferay.com/blog/liferay-experience/what-exactly-is-modern-application-development-in-liferay',
    image: { src: doc('246440966/376969236/volodymyr-dobrovolskyy-KrYbarbAx5s-unsplash+%281%29.jpg/549fdc58-2683-9689-8437-f9d429e1e2e5/volodymyr-dobrovolskyy-KrYbarbAx5s-unsplash+%281%29.jpg?version=2.0&t=1790693132572'), alt: '' },
    date: 'April 21, 2025',
    readTime: '6 Min Read',
  },
  {
    title: 'How Global Companies Are Defending Against DDoS Attacks',
    href: 'https://www.liferay.com/blog/category/how-global-companies-are-defending-against-ddos-attacks',
    image: { src: doc('246440966/376969236/towfiqu-barbhuiya-FnA5pAzqhMM-unsplash+%281%29.jpg/8a2e3080-e35f-76fa-3b7b-4fbe3f1e6c32/towfiqu-barbhuiya-FnA5pAzqhMM-unsplash+%281%29.jpg?version=1.0&t=1748550673307'), alt: '' },
    date: 'March 19, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Empower Technical Teams: The No-Code/Low-Code Evolution of Data Sets',
    href: 'https://www.liferay.com/blog/liferay-experience/empower-technical-teams-the-no-code-low-code-evolution-of-data-sets',
    image: { src: doc('246440966/376969236/fabio-oyXis2kALVg-unsplash+%281%29.jpg/ca6c2e6b-ead3-b0bb-91c1-4a48f211026b/fabio-oyXis2kALVg-unsplash+%281%29.jpg?version=2.0&t=1791275262104'), alt: '' },
    date: 'March 11, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Do You Actually Need a Low-Code Platform?',
    href: 'https://www.liferay.com/blog/category/do-you-actually-need-a-low-code-platform',
    image: { src: doc('246440966/376969236/simon-abrams-k_T9Zj3SE8k-unsplash+%282%29.jpg/5e75e465-1517-88a2-3a47-5a49f913f526/simon-abrams-k_T9Zj3SE8k-unsplash+%282%29.jpg?version=1.0&t=1748550271706'), alt: '' },
    date: 'January 13, 2025',
    readTime: '3 Min Read',
  },
  {
    title: 'Looking Back and Looking Ahead: What’s Happening with Enablement at Liferay',
    href: 'https://www.liferay.com/blog/category/looking-back-and-looking-ahead-what-is-happening-with-enablement-at-liferay',
    image: { src: doc('246440966/376969236/Enablement-Collage-16x9.png/90cf41d9-5a49-748f-0083-0c3a6ff5de03/Enablement-Collage-16x9.png?version=1.0&t=1793608852764'), alt: '' },
    date: 'December 19, 2024',
    readTime: '2 Min Read',
  },
  {
    title: 'The State of the Art in Shipping: A Seamless Experience for Customers and Businesses',
    href: 'https://www.liferay.com/blog/customer-experience/the-state-of-the-art-in-shipping',
    image: { src: doc('246440966/376969236/state-of-the-art-shipping_b+%281%29.jpg/0c4d6a17-2cb6-599b-d53b-310685d2f5b9/state-of-the-art-shipping_b+%281%29.jpg?version=1.0&t=1748552530856'), alt: '' },
    date: 'December 16, 2024',
    readTime: '3 Min Read',
  },
  {
    title: 'The Future of B2B Commerce in 2030',
    href: 'https://www.liferay.com/blog/customer-experience/the-future-of-b2b-commerce-in-2030',
    image: { src: doc('246440966/376969236/fabian-irsara-67l-QujB14w-unsplash+%281%29.jpg/b3dd7cd4-b572-2eae-44a5-df7da5af8e73/fabian-irsara-67l-QujB14w-unsplash+%281%29.jpg?version=1.0&t=1748552473969'), alt: '' },
    date: 'November 26, 2024',
    readTime: '4 Min Read',
  },
  {
    title: 'Partner Pulse: Insights on Digital Innovation in the CEE Region',
    href: 'https://www.liferay.com/blog/current-experiences/partner-pulse-insights-on-digital-innovation-in-the-cee-region',
    image: { src: doc('246440966/376969236/Partner+Pulse+CEE+%281%29.jpg/7ff9bba9-3e41-9a87-8dea-7c47af9ca73e/Partner+Pulse+CEE+%281%29.jpg?version=1.0&t=1748551688775'), alt: '' },
    date: 'October 20, 2024',
    readTime: '7 Min Read',
  },
  {
    title: 'The Top 6 Trends That Will Shape the Student Experience in 2025',
    href: 'https://www.liferay.com/blog/current-experiences/top-6-trends-that-will-shape-the-student-experience-in-2025',
    image: { src: doc('246440966/376969236/dom-fou-YRMWVcdyhmI-unsplash+%281%29.jpg/9fa5aad1-4312-da6f-81c5-c548959d416a/dom-fou-YRMWVcdyhmI-unsplash+%281%29.jpg?version=1.0&t=1748552539191'), alt: '' },
    date: 'October 8, 2024',
    readTime: '5 Min Read',
  },
  {
    title: 'Encouraging Collaboration and Innovation: The Impact of Digital Transformation on Research',
    href: 'https://www.liferay.com/blog/current-experiences/encouraging-collaboration-and-innovation-the-impact-of-digital-transformation-on-research',
    image: { src: doc('246440966/376969236/cropped-john-schnobrich-FlPc9_VocJ4-unsplash+%281%29.jpg/2d2e41e1-f298-7a65-3e8f-aaf1919a8bab/cropped-john-schnobrich-FlPc9_VocJ4-unsplash+%281%29.jpg?version=1.0&t=1748550369831'), alt: '' },
    date: 'September 30, 2024',
    readTime: '4 Min Read',
  },
  {
    title: 'The Evolution of the Plugin Model — And Why It Needed to Evolve in the First Place',
    href: 'https://www.liferay.com/blog/liferay-experience/the-evolution-of-the-plugin-model',
    image: { src: doc('246440966/376969236/Evolution-of-Plugins.jpg/793fa89b-458e-09eb-31e9-aef0b09878e4/Evolution-of-Plugins.jpg?version=1.0&t=1748552454626'), alt: '' },
    date: 'September 23, 2024',
    readTime: '8 Min Read',
  },
  {
    title: 'Why Security Should Be a Business Leader Concern',
    href: 'https://www.liferay.com/blog/current-experiences/why-security-should-be-a-business-leader-concern',
    image: { src: doc('246440966/376969236/christina-wocintechchat-com-ws6CJRzdOg8-unsplash.jpg/64b009fe-f5f3-7118-309b-f26adf6f73f2/christina-wocintechchat-com-ws6CJRzdOg8-unsplash.jpg?version=1.0&t=1748553231017'), alt: '' },
    date: 'June 10, 2024',
    readTime: '4 Min Read',
  },
  {
    title: 'Why Migrating to Liferay DXP from HCL DX Makes Sense For Your Business',
    href: 'https://www.liferay.com/blog/liferay-experience/why-migrating-to-liferay-dxp-makes-sense-for-your-business',
    image: { src: doc('246440966/372654306/Migration.jpg/63c62668-26c1-367e-050d-41417cf925ef/Migration.jpg?version=1.0&t=1715708906481'), alt: '' },
    date: 'May 14, 2024',
    readTime: '2 Min Read',
  },
  {
    title: 'Maximizing Employee Value at Škoda Auto',
    href: 'https://www.liferay.com/blog/employee-experience/maximizing-employee-value-at-skoda-auto',
    image: { src: doc('246440966/376969236/Maximizing+Employee+Value+at+S%CC%8Ckoda+Auto+%281%29.jpg/24993e4c-d4d8-0146-38fc-60a3a7faf8e6/Maximizing+Employee+Value+at+S%CC%8Ckoda+Auto+%281%29.jpg?version=1.0&t=1748551436048'), alt: '' },
    date: 'February 14, 2024',
    readTime: '4 Min Read',
  },
  {
    title: 'How Can You Use ChatGPT to Reduce Costs and Improve Customer Experience in the Automotive Industry?',
    href: 'https://www.liferay.com/blog/current-experiences/how-can-chatgpt-reduce-costs-and-improve-customer-experience-in-automotive-industry',
    image: { src: doc('246440966/376969236/ChatGPT_blog_automotive+%282%29.jpg/eef4e200-05e0-037c-354d-5fc633dfe5b6/ChatGPT_blog_automotive+%282%29.jpg?version=1.0&t=1748550605709'), alt: '' },
    date: 'February 7, 2023',
    readTime: '8 Min Read',
  },
  {
    title: 'The Role of Technology in Alumni Engagement',
    href: 'https://www.liferay.com/blog/current-experiences/technology-alumni-engagement',
    image: { src: doc('246440966/376969236/The+Role+of+Technology+in+Alumni+Engagement+%281%29.jpg/43cc7d36-3d7e-51fd-3748-49a595b41acf/The+Role+of+Technology+in+Alumni+Engagement+%281%29.jpg?version=1.0&t=1748552495620'), alt: '' },
    date: 'October 28, 2022',
    readTime: '4 Min Read',
  },
  {
    title: 'Innovative Student Experiences',
    href: 'https://www.liferay.com/blog/current-experiences/innovative-student-experiences',
    image: { src: doc('246440966/376969236/Innovative+Student+Experiences+-+3+Universities+Leading+the+Way+%281%29.jpg/e3d0c261-19f5-d4ca-ea70-1a66d6272edb/Innovative+Student+Experiences+-+3+Universities+Leading+the+Way+%281%29.jpg?version=1.0&t=1748550899198'), alt: '' },
    date: 'October 21, 2022',
    readTime: '3 Min Read',
  },
  {
    title: 'Self Service Banking: How B2B and B2C Customers See Self Service',
    href: 'https://www.liferay.com/blog/customer-experience/self-service-banking-how-b2b-and-b2c-customers-see-self-service',
    image: { src: doc('246440966/376969236/Self+Service+Banking+Blog+Header+%282%29.jpg/829d4cb9-eb5f-ed9c-a8aa-45a9e6e6d26b/Self+Service+Banking+Blog+Header+%282%29.jpg?version=1.0&t=1748552268525'), alt: '' },
    date: 'August 8, 2022',
    readTime: '6 Min Read',
  },
  {
    title: 'Financial Services Transformation',
    href: 'https://www.liferay.com/blog/customer-experience/digital-transformation-in-financial-services',
    image: { src: doc('246440966/376969236/Financial+Services+Transformation+-+Why+a+Digital-First+Approach+is+the+Way+to+Go+%281%29.jpg/a7fa052a-c404-acdc-7d54-14fa5cc2d0df/Financial+Services+Transformation+-+Why+a+Digital-First+Approach+is+the+Way+to+Go+%281%29.jpg?version=1.0&t=1748550490395'), alt: '' },
    date: 'June 3, 2022',
    readTime: '3 Min Read',
  },
  {
    title: 'Implementing Student Portals',
    href: 'https://www.liferay.com/blog/liferay-experience/implementing-student-portals',
    image: { src: doc('246440966/376969236/3+Core+Considerations+When+Looking+To+Implement+a+Student+Portal+%281%29.jpg/b19e3eaa-a47e-bdeb-aa90-b432d3221abf/3+Core+Considerations+When+Looking+To+Implement+a+Student+Portal+%281%29.jpg?version=1.0&t=1748550852795'), alt: '' },
    date: 'March 31, 2022',
    readTime: '2 Min Read',
  },
  {
    title: 'How Digital Transformation Helps You Develop Long-Term Student Relationships',
    href: 'https://www.liferay.com/blog/current-experiences/how-digital-transformation-helps-you-develop-long-term-student-relationships',
    image: { src: doc('246440966/376969236/digital-transformation-long-term-student-relationships+%281%29.jpg/2ecafcf4-d7b8-8b85-a62d-b0ab1d556067/digital-transformation-long-term-student-relationships+%281%29.jpg?version=1.0&t=1748550647418'), alt: '' },
    date: 'March 21, 2022',
    readTime: '3 Min Read',
  },
  {
    title: 'Redefining the Student Experience in a Hybrid Learning Environment',
    href: 'https://www.liferay.com/blog/current-experiences/hybrid-student-experience',
    image: { src: doc('246440966/376969236/resized-image-Promo.jpeg/282d5b3d-3ccc-d2b6-4627-7a952de96965/resized-image-Promo.jpeg?version=1.0&t=1748552161021'), alt: '' },
    date: 'March 1, 2022',
    readTime: '5 Min Read',
  },
  {
    title: 'What Is a Knowledge Management System? Benefits and Examples',
    href: 'https://www.liferay.com/blog/current-experiences/what-is-the-purpose-of-a-knowledge-management-system-',
    image: { src: doc('246440966/376969236/Purpose-Knowledge-Management-System+%281%29.jpg/886e9c44-4e54-a15f-e90a-7a730aa9b4ba/Purpose-Knowledge-Management-System+%281%29.jpg?version=1.0&t=1787212771183'), alt: '' },
    date: 'January 19, 2021',
    readTime: '7 Min Read',
  },
  {
    title: '16 Awesome Web Portal Examples',
    href: 'https://www.liferay.com/blog/current-experiences/16-awesome-web-portal-examples',
    image: { src: doc('246440966/376969236/faris-mohammed-d30sszrW7Vw-unsplash+%283%29.jpg/aff1aae1-d116-af72-cbca-2d1d8c957e83/faris-mohammed-d30sszrW7Vw-unsplash+%283%29.jpg?version=1.0&t=1748548652901'), alt: '' },
    date: 'September 25, 2024',
    readTime: '9 Min Read',
  },
  {
    title: 'Diagnosing and Correcting Your Common SEO Problems',
    href: 'https://www.liferay.com/blog/customer-experience/diagnosing-and-correcting-your-common-seo-problems',
    image: { src: doc('10182/372672896/f8fe092b-1988-4926-917e-f667cba5acc5/f0afd3b2-bab0-b9ab-f26c-6196181fc6ff/f8fe092b-1988-4926-917e-f667cba5acc5?version=1.0&t=1624066533901'), alt: '' },
    date: 'April 26, 2018',
    readTime: '6 Min Read',
  },
]

/** The hub's named authors, by post — the same person, the same (stand-in) portrait, on every page. */
const HUB_AUTHORS = new Map(
  Object.values(POSTS)
    .filter((post) => post.author && post.author !== LIFERAY_TEAM && !post.author.brand)
    .map((post) => [post.href, post.author!]),
)

/** Every post in the category, in the Resource Hub's order. */
export const CATEGORY_POSTS: BlogPostSpec[] = POST_DATA.map((post) => ({
  ...post,
  author: HUB_AUTHORS.get(post.href) ?? LIFERAY_TEAM,
}))

const CATEGORY: BlogCategory = 'Digital Experience'

/* The hub's own line for this category, so the shelf and the category page never say it two ways. */
const shelf = BLOG_HUB_PAGE.sections.find(
  (section): section is Extract<SectionSpec, { type: 'blogFeature' | 'blogGrid' }> =>
    (section.type === 'blogFeature' || section.type === 'blogGrid') && section.title === CATEGORY,
)
const DESCRIPTION = shelf?.description

export const BLOG_CATEGORY_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: CATEGORY },
    description: DESCRIPTION ? { text: DESCRIPTION } : undefined,
    /* No media column, so the heading would otherwise run under the corner bubble. */
    titleMaxWidth: 800,
  },
  sections: [
    /*
     * No heading of its own: the hero names the category. The cards carry no topic either — every one
     * would say `Digital Experience`, which the page has just said — as the hub's topic shelves don't.
     */
    {
      type: 'blogGrid',
      card: 'blog',
      byline: 'stacked',
      pageSize: 12,
      pageSizes: [12, 24, 48],
      posts: CATEGORY_POSTS.map((post) => ({ ...post, tags: [] })),
    },
    BLOG_NEWSLETTER,
  ],
}
