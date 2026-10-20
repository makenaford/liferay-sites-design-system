import heroMedia from '../../assets/home/hero-media.png'
import aiHubFilm from '../../assets/solutions/ai-hub.webm'
import commerceDashboard from '../../assets/solutions/commerce-dashboard.webp'
import aiHubPoster from '../../assets/solutions/ai-hub-poster.jpg'
import gartnerBadge from '../../assets/home/badges/gartner-peer-insights-customers-choice-2026-white.png'
import g2Badge from '../../assets/home/badges/g2-leader-enterprise-fall-2026.png'
import blogHeroMedia from '../../assets/blog/hero-media.webp'
import featuredMedia from '../../assets/home/trending/b2b-ecommerce.jpg'
import customerStoryHero from '../../assets/customer-story/hero-media.jpg'
import customerStoryImplementation from '../../assets/customer-story/implementation.jpg'
import yusenLogo from '../../assets/customer-story/yusen-logistics-logo.png'
import storyAgia from '../../assets/customer-stories/agia.jpg'
import storyCsob from '../../assets/customer-stories/csob.jpg'
import storySigla from '../../assets/customer-stories/sigla.jpg'
import storySpringboard from '../../assets/customer-stories/springboard.jpg'
import storySamoa from '../../assets/customer-stories/samoa.jpg'
import storyUnilever from '../../assets/customer-stories/unilever.jpg'
import implementationPartner from '../../assets/customer-stories/implementation-partner.png'
import industryHeroMedia from '../../assets/industry/hero-media.jpg'
import goal1 from '../../assets/home/goal-1.png'
import goal2 from '../../assets/home/goal-2.png'
import goal3 from '../../assets/home/goal-3.png'
import goal4 from '../../assets/home/goal-4.png'
import teamsMedia from '../../assets/home/teams-media.png'
import capabilityMedia from '../../assets/home/capability-media.png'
import industryMedia from '../../assets/home/industry-media.png'
import resourceA from '../../assets/home/trending/ai-transformation.jpg'
import resourceB from '../../assets/home/trending/digital-strategy.jpg'
import resourceC from '../../assets/home/trending/web-portals.jpg'
import type { PageSpec, SectionSpec } from './page-schema'
import { sectionTypeFor } from './section-catalog'

/**
 * What a new mockup starts as.
 *
 * A preset is a **starting point, not a template**. It is copied once, on creation, and the copy is
 * then the designer's — editing a preset later does not reach back into mockups already made from it.
 * That is the whole difference between this and a CMS, and it is the reason this file can stay a few
 * plain factories: nothing has to migrate, nothing has to stay in sync, and a preset that turns out to
 * be wrong costs one page's worth of re-editing rather than a data migration.
 *
 * ## Why they are short
 *
 * The file draws component sets, not pages — its only two pages are `Cover` and `❖ Components`. There
 * is no drawn Industry page to copy, so the section run below is inferred, and an inferred preset that
 * guesses long is worse than one that guesses short: **a designer adds a section in one click and
 * deletes one in one click, but they have to first work out that the extra section was never meant to
 * be there.** So each preset carries the sections that kind of page cannot be without, and stops.
 *
 * ## Where a default actually belongs
 *
 * Three layers, and only the third is in this file:
 *
 * 1. **Always true → `PageRenderer`.** The marquee's 64px logos, the carousel's bleed, the card grid's
 *    32px gap. Not defaults — properties of the type. Never in the data.
 * 2. **True of every new section of a type → `blank()` in `section-catalog.ts`.**
 * 3. **True of this kind of page → here.**
 *
 * A preset composes `blank()` sections rather than restating their content, so placeholder copy has
 * exactly one home. When a preset needs a section to differ from its blank, it overrides the field —
 * and that override is the honest signal that the difference is the *page kind's*, not the type's.
 */

export interface PagePreset {
  id: string
  /** What the picker calls it. */
  label: string
  /** One line on which handoff this is for. */
  hint: string
  /** A fresh `PageSpec`. Called once per new mockup — never shared, never referenced afterwards. */
  create: () => PageSpec
}

/** A blank of the given type, so presets never restate placeholder copy. */
function blank<T extends SectionSpec['type']>(type: T) {
  const entry = sectionTypeFor(type)
  if (!entry) throw new Error(`No section type '${type}' in the catalog`)
  return entry.blank() as Extract<SectionSpec, { type: T }>
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non lacinia mi. Etiam nec mauris fringilla, tincidunt tellus sed, feugiat nulla.'

/** A paragraph at the length the `Blog` frame draws its body copy. */
const ARTICLE_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus est metus, commodo vel condimentum ut, iaculis at felis. Donec sed sollicitudin mauris. Donec tempor, odio et fringilla vehicula, turpis dolor cursus lacus, sit amet pulvinar urna mi in ante. Sed quis eros ut ante dapibus pulvinar. Quisque ac velit neque. Suspendisse vel turpis eget augue ultricies suscipit at vel felis. Phasellus interdum dapibus felis, ut accumsan metus. Aliquam fermentum lacus at sodales tristique.'

/** The catalog's three filter pills, as the file labels them. */
const CATALOG_FILTERS = [
  { label: 'Product Module', options: ['DXP', 'Commerce', 'CMS', 'Search', 'AI Hub'] },
  { label: 'Industry', options: ['Financial Services', 'Public Sector', 'Manufacturing', 'Healthcare'] },
  { label: 'Solution', options: ['Customer Portals', 'Websites', 'Partner Portals', 'Intranets'] },
]

/** The catalog grid's six stories — `Customer Stories- Hub` (node `24581:69993`). */
const CATALOG_STORIES = [
  { customer: 'AGIA Affinity', title: 'RSPCA Sees 38% Increase in Engagement with Liferay Solution', image: storyAgia },
  { customer: 'ČSOB', title: 'Upgrade Gives ČSOB More Flexibility in Web Content Management', image: storyCsob },
  { customer: 'Sigla Credit', title: 'Sigla Simplifies Client Loan Process with New Liferay Partner Portal', image: storySigla },
  { customer: 'Springboard', title: 'Integration: The Foundation for New Experiences with Embasa', image: storySpringboard },
  { customer: 'SAMOA', title: 'ENGIE Re-Energizes Their Website, Putting the User Experience at the Center', image: storySamoa },
  { customer: 'Unilever', title: 'Agility, Autonomy, and New Touchpoints for BNB’s Users', image: storyUnilever },
]

export const PAGE_PRESETS: PagePreset[] = [
  {
    id: 'landing',
    label: 'Landing page',
    hint: 'Email capture and proof up top, then the platform story. The Home page’s spine.',
    create: () => ({
      /*
       * What makes this a landing page is the hero: a form and the Gartner proof, not buttons. Someone
       * arriving here is being asked for an address, so the field is the primary action and the link
       * under it is the way out for people not ready to give one.
       *
       * The Home page's solution finder banner is deliberately absent. It is one page's device — the
       * `HeroBanner` union has exactly one kind in it for that reason — and a designer who wants it
       * should be choosing it, not deleting it.
       */
      hero: {
        background: 'corner',
        title: { text: 'A headline that names the outcome,', highlight: 'not the product' },
        description: {
          text: 'One or two lines on who this is for and what changes for them.',
          emphasis: 'The clause worth emphasising goes last.',
        },
        form: { placeholder: 'Work email', submit: 'Get started' },
        action: { label: 'Talk to sales instead', href: '#' },
        proof: {
          rating: { score: '4.5', outOf: 5, source: 'Gartner Peer Insights' },
          marks: ['SOC 2', 'ISO 27001', 'GDPR'],
        },
        media: { src: heroMedia, alt: 'Replace with this page’s product shot', ratio: '4:3' },
      },
      /*
       * Logos immediately under the hero, because that is the one section whose position is load-bearing
       * — it renders flush against the band above it, and anywhere else in the run it reads as an
       * orphan rather than as proof attached to the claim.
       */
      sections: [
        blank('logoMarquee'),
        blank('cardGrid'),
        blank('tabbedContent'),
        blank('customerStories'),
      ],
    }),
  },
  {
    id: 'industry',
    label: 'Industry page',
    hint: 'Two buttons, a 3:2 photo, and the industry’s own solutions and proof.',
    create: () => ({
      /*
       * Figma node `24223:209534`. Two buttons rather than a form, and no proof row: someone on an
       * industry page has already self-identified, so the job is to route them — demo or sales — not to
       * qualify them.
       *
       * The photo is 3:2 where the landing hero's is 4:3. That is the drawn difference between the two
       * cells, and it is why `ImageRef` carries a ratio at all.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: {
          src: industryHeroMedia,
          alt: 'Replace with a photograph from this industry',
          ratio: '3:2',
        },
      },
      /*
       * `fullCard` before the grids, and it is the reason this preset exists rather than being the
       * landing one with a different hero: an industry page's first job after the hero is the one card
       * that says what the offer is *for this industry*, with its numbers on it.
       */
      sections: [
        blank('logoMarquee'),
        (() => {
          const section = blank('fullCard')
          /* The tab rule is the industry list, so the page kind names it — not the type's blank. */
          return { ...section, title: 'Built for your industry' }
        })(),
        blank('resourceGrid'),
        blank('customerStories'),
      ],
    }),
  },
  {
    id: 'product',
    label: 'Product detail',
    hint: 'What it does, who it worked for, the questions, and the ways out.',
    create: () => ({
      /*
       * `Detail Pages` -> `Product Info` (node `24631:68532`), section by section as the file draws it.
       *
       * The first pass at this preset was assembled from section *heights* without looking at the page,
       * and three of the eight were wrong: the tabbed panel is a key-point list rather than an
       * accordion, the grid is six icon cards rather than four image ones, and the band after it is a
       * customer story — a photograph, a paragraph, three figures and a link — where a `mediaBand` had
       * been guessed. A height identifies a cell; only the drawing says what is in it.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: { src: heroMedia, alt: 'Replace with this product’s own shot', ratio: '3:2' },
      },
      sections: [
        /* The pill bar over a panel of key points — five audiences, one claim each. */
        (() => {
          const section = blank('tabbedContent')
          return {
            ...section,
            tabs: [
              'Customer Portals',
              'Supplier Portals',
              'Financial Services',
              'Digital Commerce',
              'Intranets',
            ].map((label) => ({
              label,
              value: label.toLowerCase().replace(/\s+/g, '-'),
              content: {
                label: 'Label',
                title: 'Card Title',
                description: LOREM,
                points: Array.from({ length: 3 }, () => ({
                  title: 'Key Point Main List',
                  description: 'Short description here',
                })),
                media: { src: industryHeroMedia, alt: 'Replace with this tab’s own photograph' },
              },
            })),
          }
        })(),
        /* `Feature Highlights (Clickable)` — six icon cards, two rows of three. */
        (() => {
          const section = blank('cardGrid')
          return {
            ...section,
            title: 'Feature Highlights (Clickable)',
            columns: 3 as const,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            cards: Array.from({ length: 6 }, () => ({
              title: 'Card Title',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              icon: 'sites' as const,
              href: '#',
            })),
          }
        })(),
        (() => {
          const section = blank('customerStory')
          /* The picture closes the row here: the panel above it ends on a photograph of its own. */
          return { ...section, mediaSide: 'right' as const }
        })(),
        blank('highlightText'),
        blank('faq'),
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            title: 'Additional Resources',
            cards: [
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceA, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceB, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceC, alt: 'Replace with this resource’s own image' } },
            ],
          }
        })(),
        blank('quickLinks'),
      ],
    }),
  },
  {
    id: 'solution',
    label: 'Solution detail',
    hint: 'A solution or use case: the commercial claim, the problem, the features, the proof, the cost case and the questions.',
    create: () => ({
      /*
       * The solution page — liferay.com/solutions/customer-portals, as the solutions mockup lays it out.
       *
       * The order is an argument: what it is and who it is for, then the problem before the features,
       * then what people built and why Liferay over the alternatives, then the cost case, the proof and
       * the plan. The sub-nav anchors are on the sections a buyer jumps between: Challenges, Features,
       * Built on Liferay, Why Liferay, Pricing and the FAQ.
       */
      hero: {
        background: 'corner',
        breadcrumbs: [
          { label: 'Solutions', href: '#' },
          { label: 'Customer Portals', href: '#' },
        ],
        title: { text: 'Customer Portal Software for', highlight: 'Complex B2B Accounts' },
        points: [
          {
            icon: 'building',
            text: 'Built for complex B2B portals, with account hierarchies, fine-grained permissions and approvals',
          },
          {
            icon: 'monitor',
            text: 'Run portals, content and B2B commerce on one platform instead of stitching separate tools',
          },
          {
            icon: 'brackets-angle',
            text: 'Deploy on-premises, in your private cloud or on Liferay SaaS, on an open-source core',
          },
        ],
        form: { placeholder: 'Work email', submit: 'Contact Sales' },
        links: [
          { label: 'Request a demo', href: '#' },
          { label: 'Calculate your savings', href: '#pricing' },
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
        /* The Home page's four visual tiles: the reasons to buy, at a glance. */
        {
          type: 'cardGrid',
          title: 'Key customer portal capabilities',
          cards: [
            {
              title: 'Secure access and simplify compliance',
              description: 'Account-level permissions, SSO and audit trails for every customer, partner and dealer.',
              image: { src: goal1, alt: '' },
              href: '#',
            },
            {
              title: 'Build complex portals fast with low-code',
              description: 'Page builders, forms and workflows let business teams ship without waiting on developers.',
              image: { src: goal2, alt: '' },
              href: '#',
            },
            {
              title: 'Answer questions with AI search',
              description: 'Customers find articles, documents and cases in their own words, and open fewer tickets.',
              image: { src: goal3, alt: '' },
              href: '#',
            },
            {
              title: 'Integrate the systems you already run',
              description: 'Headless APIs and connectors bring CRM, ERP and support data into one view.',
              image: { src: goal4, alt: '' },
              href: '#',
            },
          ],
        },
        /* The definition: 40–60 words that stand on their own, for the snippet and the AI overview. */
        {
          type: 'highlightText',
          icon: 'customer-portals',
          title: 'What is a customer portal?',
          body: 'A customer portal is a secure, personalized website where customers find answers, manage accounts, track orders and raise requests without calling support. Liferay builds portals for complex B2B relationships, with account hierarchies, permissions and commerce on one open-source platform, for enterprises that have outgrown a basic help center.',
          action: { label: 'New to the category? Read What is a customer portal?', href: '#' },
        },
        {
          type: 'tabbedContent',
          anchor: 'challenges',
          title: 'What challenges does customer portal software solve?',
          titleHighlight: 'customer portal software',
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
                    question: 'How do we give every account the right access?',
                    answer:
                      'B2B customers are companies, not single users. Liferay models parent and child accounts, roles per account and approval rules, so a buyer, a plant manager and a finance approver each see only what they should. SSO through SAML or OpenID Connect keeps your identity provider the source of truth.',
                    link: { label: 'Explore account management', href: '#' },
                  },
                  {
                    question: 'Can one portal replace the tools we stitched together?',
                    answer:
                      'Content, search, documents, forms and B2B ordering run on one platform with one login, so customers stop jumping between a help center, a file share and a store — and your team stops maintaining the glue between them.',
                    link: { label: 'Explore the platform', href: '#' },
                  },
                  {
                    question: 'Will it meet our security and compliance requirements?',
                    answer:
                      'Fine-grained permissions, audit trails and SOC 2 Type 2 and ISO/IEC 27001 certified hosting — or run it on-premises or in your private cloud when data has to stay where it is.',
                    link: { label: 'Explore security', href: '#' },
                  },
                  {
                    question: 'How do we cut support tickets without frustrating customers?',
                    answer:
                      'AI search answers from your knowledge base in the customer’s own words, and anything it cannot answer becomes a case with the context attached — so agents start from the history rather than from scratch.',
                    link: { label: 'Explore AI search', href: '#' },
                  },
                ],
                media: { src: teamsMedia, alt: 'A support lead reviewing account cases on a dashboard' },
                stats: [
                  { value: '140', suffix: '%', label: 'More self-service · Sky' },
                  { value: '845', label: 'Features shipped · Broadcom' },
                  { value: '1,200', suffix: '+', label: 'Enterprise customers' },
                ],
              },
            },
          ],
        },
        {
          type: 'tabbedContent',
          anchor: 'features',
          title: 'Customer portal features built for self-service',
          titleHighlight: 'built for self-service',
          description: 'Four primary capabilities, each with proof from a customer running it today.',
          tabs: [
            {
              value: 'self-service',
              label: 'Self-service',
              content: {
                title: 'Self-service account and case management',
                description:
                  'Give customers one place to check orders, download invoices, update account details and raise cases. Liferay Objects model warranties, service requests or claims without custom code, and workflow routes each request to the right team with SLAs attached.',
                points: [
                  { title: 'Case submission, tracking and status alerts' },
                  { title: 'Invoices, contracts and orders in one dashboard' },
                  { title: 'No-code objects for any service request' },
                ],
                proof: { customer: 'Sky', value: '140%', label: 'increase in customer self-service', href: '#', linkLabel: 'Read the story' },
                action: { label: 'Explore Liferay Objects', href: '#' },
                media: { src: capabilityMedia, alt: 'A customer dashboard of orders, invoices and open cases' },
              },
            },
            {
              value: 'ai-search',
              label: 'AI search',
              content: {
                title: 'Answers in the customer’s own words',
                description:
                  'AI search reads across articles, documents and past cases and answers with its sources, so customers resolve the routine questions themselves and agents get the ones that need a person.',
                points: [
                  { title: 'Answers drawn from your knowledge base, with sources' },
                  { title: 'Search across content, documents and cases at once' },
                  { title: 'Case deflection measured per article' },
                ],
                proof: { customer: 'Broadcom', value: '845', label: 'features implemented', href: '#', linkLabel: 'Read the story' },
                action: { label: 'Explore AI Hub', href: '#' },
                media: { src: heroMedia, alt: 'An AI answer drawn from three knowledge articles' },
              },
            },
            {
              value: 'personalization',
              label: 'Personalization',
              content: {
                title: 'A portal that knows which account it is talking to',
                description:
                  'Segment by account, role and region, and personalize any fragment on the page against those segments — the same portal shows a distributor, a dealer and an end customer what each of them needs.',
                points: [
                  { title: 'Segments from account, role and behavior' },
                  { title: 'Personalize any page fragment, no code' },
                  { title: 'Analytics on what each segment uses' },
                ],
                proof: { customer: 'Meridian Bank', value: '62%', label: 'fewer service calls', href: '#', linkLabel: 'Read the story' },
                action: { label: 'Explore personalization', href: '#' },
                media: { src: industryMedia, alt: 'One portal page shown to two account segments' },
              },
            },
            {
              value: 'ordering',
              label: 'Ordering',
              content: {
                title: 'B2B ordering and integrations in the same portal',
                description:
                  'Account-specific catalogs, pricing and approvals, with connectors to the ERP and CRM you already run — orders, entitlements and case history flow both ways, so the portal and your back office agree.',
                points: [
                  { title: 'Account price lists, quotes and approval flows' },
                  { title: 'ERP and CRM connectors — SAP, Salesforce and more' },
                  { title: 'Headless APIs for every object' },
                ],
                proof: { customer: 'Grain & Protein Technologies', value: '700K', label: 'parts in a self-service catalog', href: '#', linkLabel: 'Read the story' },
                action: { label: 'Explore B2B commerce', href: '#' },
                media: { src: industryHeroMedia, alt: 'A dealer reordering parts from an account catalog' },
              },
            },
          ],
        },
        {
          type: 'cardGrid',
          title: 'More customer portal capabilities',
          cards: [
            { icon: 'security', title: 'Single sign-on (SSO)', description: 'SAML, OpenID Connect and LDAP with your identity provider.', href: '#' },
            { icon: 'dam', title: 'Document management', description: 'Versioned, permissioned files customers can find.', href: '#' },
            { icon: 'sites', title: 'Multilingual sites', description: 'Translate pages and content for every market.', href: '#' },
            { icon: 'ai-hub', title: 'AI assistants', description: 'Agents that answer, summarize and route requests.', href: '#' },
          ],
        },
        {
          type: 'cardGrid',
          title: 'One customer portal, built for every team',
          description: 'How IT, service and marketing teams each get what they need from the same build.',
          columns: 3,
          cards: [
            {
              tag: 'IT & Platform',
              title: 'Customer portal for IT teams',
              description:
                'Extend with REST and GraphQL APIs, client extensions and your CI/CD pipeline. Connect CRM, ERP and identity without rewrites, on-premises, in private cloud or SaaS.',
              href: '#',
            },
            {
              tag: 'Customer Service',
              title: 'Customer portal for service teams',
              description:
                'Publish answers once and let search route customers to them. Case forms, SLAs and workflow move requests to the right agent, so routine questions resolve themselves.',
              href: '#',
            },
            {
              tag: 'Digital & Marketing',
              title: 'Customer portal for marketers',
              description:
                'Build and update pages with drag-and-drop fragments, personalize content by account and segment, and measure what customers use — without a development sprint.',
              href: '#',
            },
          ],
        },
        {
          type: 'buildGallery',
          anchor: 'built-on-liferay',
          title: 'Built on Liferay',
          titleHighlight: 'Liferay',
          description: 'See the support, dealer and self-service portals customers built on Liferay.',
          action: { label: 'Browse all customer stories', href: '#' },
          builds: [
            {
              url: 'support.broadcom.com',
              image: { src: teamsMedia, alt: 'Broadcom’s support portal: cases, documents and downloads' },
              tag: 'Customer Portal',
              customer: 'Broadcom',
              industry: 'Technology',
              headline: 'A single support portal for cases, docs and downloads',
              features: ['Case management', 'Knowledge base search', 'Entitlements'],
              link: { label: 'Read the Broadcom story', href: '#' },
            },
            {
              url: 'sky.com/myaccount',
              image: { src: customerStoryImplementation, alt: 'Sky’s account hub: billing, packages and faults' },
              tag: 'Customer Portal',
              customer: 'Sky',
              industry: 'Media & Telecom',
              headline: 'A self-service account hub for billing, packages and faults',
              features: ['Bill pay', 'Package upgrades', 'Guided troubleshooting'],
              link: { label: 'Read the Sky story', href: '#' },
            },
            {
              url: 'airbusworld.com',
              image: { src: capabilityMedia, alt: 'Airbus’s operator portal: fleet documents and service requests' },
              tag: 'Customer Portal',
              customer: 'Airbus',
              industry: 'Aerospace',
              headline: 'An operator portal for fleet docs, service requests and parts',
              features: ['Fleet dashboard', 'Technical library', 'Service tracking'],
              link: { label: 'Read the Airbus story', href: '#' },
            },
            {
              url: 'dealers.grainprotein.com',
              image: { src: industryMedia, alt: 'A dealer portal with a self-service parts catalog' },
              tag: 'Partner Portal',
              customer: 'Grain & Protein Technologies',
              industry: 'Durable Goods',
              headline: 'A dealer portal with a 700K-part self-service catalog',
              features: ['Parts catalog', 'Warranty claims', 'Dealer marketing assets'],
              link: { label: 'Read the Grain & Protein Technologies story', href: '#' },
            },
          ],
        },
        {
          type: 'comparison',
          anchor: 'why-liferay',
          title: 'What sets Liferay portals apart',
          titleHighlight: 'Liferay portals',
          description: 'How Liferay compares with the options portal teams evaluate most.',
          cards: [
            { icon: 'customer-portals', title: 'Built for B2B account complexity', description: 'Parent-child accounts, roles and per-account content come native, not as custom code.' },
            { icon: 'commerce', title: 'Portal, commerce and content on one platform', description: 'Add ordering, a public site or a knowledge base later without a second vendor.' },
            { icon: 'cloud-native', title: 'Deploy where your data must live', description: 'Run on-premises, in a private cloud or on Liferay SaaS, with the same codebase.' },
          ],
          table: {
            caption: 'Feature comparison: Liferay and alternatives',
            columns: ['Liferay', 'Salesforce Experience Cloud', 'Adobe Experience Manager', 'Custom build'],
            rows: [
              { feature: 'Native B2B account hierarchies and roles', values: ['yes', 'yes', 'partial', 'no'] },
              { feature: 'Portal, commerce and CMS in one platform', values: ['yes', 'partial', 'partial', 'no'] },
              { feature: 'On-premises, private cloud or SaaS', values: ['yes', 'no', 'partial', 'yes'] },
              { feature: 'Low-code page, form and workflow builders', values: ['yes', 'yes', 'yes', 'no'] },
              { feature: 'Open-source, inspectable core', values: ['yes', 'no', 'no', 'partial'] },
            ],
            links: [
              { label: 'Liferay vs Salesforce', href: '#' },
              { label: 'Liferay vs Adobe', href: '#' },
            ],
            note: 'Comparison based on publicly available product documentation at time of writing. Capabilities vary by edition and add-ons.',
          },
        },
        {
          type: 'costCalculator',
          anchor: 'pricing',
          title: 'Estimate your customer portal savings',
          titleHighlight: 'customer portal savings',
          description:
            'See a three to five year cost estimate you can share with finance and procurement, and get a PDF with a feature comparison.',
          accounts: { label: 'Customer accounts on the portal', min: 5000, max: 500000, step: 5000, value: 50000 },
          tools: {
            label: 'Point tools the portal would replace',
            hint: 'CMS, community, knowledge base, search, forms, analytics…',
            min: 1,
            max: 8,
            value: 4,
          },
          horizons: [3, 5],
          /* The mockup's model, read back from its outputs: linear in accounts, tools and years. */
          model: {
            stack: { label: 'Stitched stack of point tools', oneTime: 180_000, perYear: 60_000, perTool: 40_000, perToolPerYear: 45_000, perAccountPerYear: 0.9 },
            liferay: { label: 'Liferay DXP', oneTime: 150_000, perYear: 85_000, perAccountPerYear: 0.35 },
          },
          report: {
            prompt: 'Get the full report as a PDF, with a line-by-line feature comparison.',
            placeholder: 'Work email',
            submit: 'Email my report',
            success: 'Your report is on its way. Check your inbox in a few minutes.',
          },
          compare: { label: 'Compare Liferay vs Salesforce Experience Cloud', href: '#' },
          note: 'Illustrative estimate based on typical licensing, implementation, and integration costs. Your results will vary.',
        },
        {
          type: 'customerStories',
          title: 'Customer portals customers actually use',
          stories: [
            {
              customer: 'Broadcom',
              value: '845',
              label: 'Features implemented',
              quote:
                'We don’t look at Liferay as the vendor. We see them as a partner. Everything we wanted to do in terms of providing customer self-service has been realized.',
              name: 'Erica Callaghan',
              role: 'Communications and UX Officer, Broadcom',
            },
            {
              customer: 'Sky TV',
              value: '140',
              suffix: '%',
              label: 'Increase in customer self-service',
              quote: 'With Liferay, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
              name: 'Jacques Hefer',
              role: 'Solution Architect, Sky',
            },
            {
              customer: 'Meridian Bank',
              value: '62',
              suffix: '%',
              label: 'Fewer service calls',
              quote:
                'Clients now open accounts, upload documents, and track requests in one place, and our advisors finally see the same picture they do.',
              name: 'Dana Whitfield',
              role: 'VP Digital Channels, Meridian Bank',
            },
          ],
        },
        {
          type: 'resourceGrid',
          title: 'Plan your customer portal',
          description: 'Documentation and guides for scoping requirements and building the business case.',
          cards: [
            { tag: 'Liferay Learn', title: 'Build a customer portal on Liferay DXP: documentation', href: '#' },
            { tag: 'Guide', title: 'The customer portal planning guide for B2B enterprises', href: '#' },
            { tag: 'Checklist', title: 'Customer portal requirements checklist for IT and service teams', href: '#' },
          ],
        },
        {
          type: 'closingCta',
          title: 'Launch a customer portal your team won’t have to rebuild',
          titleHighlight: 'won’t have to rebuild',
          description: 'Talk to a portal specialist about your accounts, systems and goals.',
          placeholder: 'Work email',
          submit: 'Contact Sales',
          links: [
            { label: 'Book a custom demo', href: '#' },
            { label: 'Calculate your savings', href: '#pricing' },
          ],
          aside: { label: 'Not ready yet? Get monthly DXP insights in your inbox', href: '#' },
        },
        {
          type: 'faq',
          anchor: 'faq',
          title: 'Customer portal software FAQ',
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
              question: 'How much does customer portal software cost?',
              answer:
                'It depends on accounts, deployment and the tools it replaces. The calculator above gives a three- or five-year estimate; a specialist can price your case.',
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
          footnotes: [
            'Customer metrics are taken from published Liferay customer stories.',
            'Savings estimates are illustrative.',
          ],
        },
      ],
    }),
  },
  {
    id: 'form',
    label: 'Form Page',
    hint: 'A form card in the hero, over the numbers, the logos, and what the platform does.',
    create: () => ({
      /*
       * `Forms` -> `Contact Sales` (node `24263:76429`). The file draws four variants of this page; they
       * differ in what sits under the form, not in the shape above it, so this is the common spine.
       *
       * **The proof is stacked directly under the hero, and that is the page.** A contact page has one
       * job and everything below the fold is there to make the form worth filling in: the figures, then
       * the logos, then what the platform does, then the questions that stop someone writing in. There
       * is nothing to read *after* the form, so the page ends at the FAQ rather than handing on.
       */
      hero: {
        background: 'corner',
        title: { text: 'Talk to sales' },
        description: { text: LOREM },
        /*
         * The whole form, in the column the media would otherwise fill — which is what the file draws.
         * It was an inline email field and a button, the shape a marketing hero uses to start a trial;
         * this page's hero *is* the form, and the fields it asks for are the point of the page.
         */
        formCard: {
          title: 'Form Heading',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          rows: [
            [
              { label: 'First Name', required: true },
              { label: 'Last Name', required: true },
            ],
            [
              { label: 'Work Email', type: 'email', required: true },
              { label: 'Company', required: true },
            ],
            [
              {
                label: 'Country',
                type: 'select',
                required: true,
                options: ['United States', 'United Kingdom', 'Germany', 'Brazil', 'Japan'],
              },
              { label: 'Phone', type: 'tel', required: true },
            ],
            [{ label: 'What would you like to talk about', type: 'textarea', required: true }],
          ],
          consent:
            'I agree that Liferay may share my contact details with Partners operating in my country to offer extended expertise and support, if their involvement is considered to bring value.',
          terms:
            'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.',
          submit: 'Submit',
        },
      },
      /*
       * The file's spine under the hero: the numbers, the logos, then what the platform does. No FAQ —
       * node `24263:171708` ends on a second content section and the footer, and the FAQ that used to
       * be here was carried over from the detail pages rather than drawn on this one.
       */
      sections: [blank('statsBar'), blank('logoMarquee'), blank('tabbedContent'), blank('mediaBand')],
    }),
  },
  {
    id: 'catalog',
    label: 'Customer story catalog',
    hint: 'A short hero with two ways in, the stories worth leading with, the whole filtered list, then a partner band.',
    create: () => ({
      /*
       * `Solutions Library` -> `Customer Stories- Hub` (node `24581:69993`).
       *
       * A catalog hero is **short** — 434 in the file against the 624 a detail page uses — because the
       * page's content is the list, and a hero that fills the screen puts the first row of it below the
       * fold. So: no media, the corner bubble rather than the full one, and the two buttons for the
       * reader who already knows they want to talk.
       */
      hero: {
        background: 'corner',
        title: { text: 'Customer Stories' },
        description: {
          text: 'Increased revenue. Happier clients. Major efficiency gains. Read winning stories from successful Liferay customers to get inspired on your own digital transformation journey.',
        },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
      },
      sections: [
        /* The stories worth leading with — the file's six, its heading still its placeholder. */
        {
          type: 'customerStories',
          title: 'Card Title',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          align: 'left',
          surface: 'glass',
          stories: [
            {
              customer: 'Sky TV',
              value: '140',
              suffix: '%',
              label: 'Increase in customer self-service',
              quote:
                'Liferay’s out-of-the-box features and development toolset empower us to create a customer experience that moves us toward the vision of engaging customers wherever they are and completing the whole purchase process online.',
              name: 'Anne Anderson',
              role: 'VP of Experience and Change Management',
            },
            {
              customer: 'City of Vienna',
              prefix: '+',
              value: '100M',
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
              customer: 'AGIA Affinity',
              value: '133',
              suffix: '%',
              label: 'Faster go to market',
              quote:
                'Liferay was a bit of a no-brainer for us. The entire digital journey is now orchestrated in a unified way.',
              name: 'Srikant Chandrasekharan',
              role: 'Senior Delivery Lead for Enterprise Platforms & Products',
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
              customer: 'Airbus',
              value: '24,000',
              label: 'Users served by portal',
              quote:
                'Keycopter brings efficiency and autonomy to helicopter operators. By providing coherent online services with Liferay, it is easy for our customers to keep their aircraft in good condition.',
              name: 'Jérôme Chauvin',
              role: 'IM Project Manager',
            },
          ],
        },
        /*
         * The whole list behind its filters, nine to a page. The file's six cards, twice over, so the
         * pagination has a second page to go to; their descriptions and figures are its placeholders.
         */
        {
          type: 'storyCatalog',
          title: 'All Stories',
          pageSize: 9,
          filters: CATALOG_FILTERS,
          cards: [...CATALOG_STORIES, ...CATALOG_STORIES].map((story, i) => ({
            title: story.title,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '#',
            image: { src: story.image, alt: `${story.customer} logo` },
            stat: { value: '845', label: 'Months to Launch' },
            facets: CATALOG_FILTERS.reduce<Record<string, string[]>>((facets, filter, f) => {
              facets[filter.label] = [filter.options[(i + f) % filter.options.length]]
              return facets
            }, {}),
          })),
        },
        {
          type: 'contentBlock',
          title: 'Looking for an Implementation Partner?',
          description:
            'We have an extensive network of trusted solution and technology partners ready to help you solve business challenges and create the custom solutions you need.',
          buttons: [
            { label: 'Find a Partner', href: '#' },
            { label: 'Become a Partner', href: '#', variant: 'outline' },
          ],
          media: { src: implementationPartner, alt: 'Two people shaking hands across a desk' },
        },
      ],
    }),
  },
  {
    id: 'blog',
    label: 'Blog',
    hint: 'A byline hero, an outlined article, the author, and what to read next.',
    create: () => ({
      /*
       * `Solutions Library` -> `Blog` (node `24223:173039`).
       *
       * The hero names who wrote it and when rather than asking for anything: a post earns its call to
       * action by the end, so the one ask sits in the article, after the last section.
       */
      hero: {
        background: 'corner',
        breadcrumbs: [
          { label: 'Home', href: '#' },
          { label: 'Blogs', href: '#' },
          { label: 'CMS MCP Server', href: '#' },
        ],
        title: { text: 'CMS MCP Server: How AI Agents Migrate Content in Liferay' },
        description: {
          text: "A CMS MCP server lets AI agents migrate legacy content and Asset Libraries into Liferay's new CMS. A field report on how it works today. By Marc Hermann, Managing Director of Portalworks",
        },
        byline: { name: 'Author Name', date: '10/20/1994', readTime: '2 min read' },
        tags: ['SEO & Analytics', 'Developer', 'Digital Experience'],
        media: {
          src: blogHeroMedia,
          alt: 'Two colleagues at a desk at night, one pointing at a tablet the other is holding',
          ratio: '3:2',
        },
      },
      sections: [
        (() => {
          /* The blank's one-line paragraphs, at the length the file draws them, so the outline has a page to follow. */
          const section = blank('article')
          return {
            ...section,
            featured: {
              tag: 'Featured Asset',
              title: '4 Best Practices to Design an Effective Ecommerce Website',
              href: '#',
              image: { src: featuredMedia, alt: 'Replace with the featured asset’s own cover' },
            },
            sections: section.sections.map((part) => ({
              ...part,
              body: part.body?.map(() => ARTICLE_LOREM),
              subsections: part.subsections?.map((sub) => ({ ...sub, body: [ARTICLE_LOREM] })),
            })),
          }
        })(),
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            /*
             * The Home page's `Trending Now` resource section, cut to the three a post has room for —
             * real-looking titles and a type tag on each, and no button: the cards are the way on.
             */
            title: 'Related Content',
            description: 'More insights and resources from Liferay.',
            card: 'resource',
            cards: [
              {
                title: 'What is AI Transformation?',
                tag: 'Guide',
                href: '#',
                image: { src: resourceA, alt: 'Hands at a laptop keyboard under a blue overlay of circuitry and data' },
              },
              {
                title: 'What is Digital Strategy?',
                tag: 'Article',
                href: '#',
                image: { src: resourceB, alt: 'Two colleagues at a whiteboard covered in sticky notes' },
              },
              {
                title: '16 Awesome Web Portal Examples',
                tag: 'Blog',
                href: '#',
                image: {
                  src: resourceC,
                  alt: 'A 3D render of a lit platform ringed by Create, Find, Share, Trust and Improve tiles',
                },
              },
            ],
          }
        })(),
      ],
    }),
  },
  {
    id: 'customer-story',
    label: 'Customer Story',
    hint: 'One customer’s story: their logo, the outlined write-up, the figures beside it, then what to read next.',
    create: () => ({
      /*
       * `Solutions Library` -> `Customer Story` (node `24179:45329`).
       *
       * The blog's article, told about a customer: their logo over the heading instead of a byline, and
       * the `Key Metrics` panel down the right instead of a featured asset — the figures are the proof, so
       * they stay in view while the reader works through how they were reached.
       *
       * The file's copy is carried over as drawn — a Yusen Logistics hero over SkyTV's write-up — and is
       * the first thing to replace.
       */
      hero: {
        background: 'corner',
        breadcrumbs: [
          { label: 'Home', href: '#' },
          { label: 'Customer Stories', href: '#' },
          { label: 'Yusen Logistics', href: '#' },
        ],
        logo: { src: yusenLogo, alt: 'Yusen Logistics' },
        title: { text: 'Yusen Logistics Transforms Global Freight Booking with Liferay' },
        description: {
          text: 'Enabling faster, more efficient freight booking through a centralized digital collaboration',
        },
        readTime: '2 Minute Read',
        media: {
          src: customerStoryHero,
          alt: 'A container ship stacked with containers, guided by tugboats across open water',
          ratio: '3:2',
        },
      },
      sections: [
        {
          type: 'article',
          outlineLabel: 'Table of contents',
          metrics: {
            title: 'Key Metrics',
            stats: Array.from({ length: 3 }, () => ({
              value: '845',
              label: 'Months to Launch',
              sentiment: 'positive' as const,
            })),
          },
          sections: [
            {
              title: 'Key Takeaways',
              blocks: [
                {
                  type: 'list',
                  items: [
                    'Redesigning your website with a more modern look and feel nets tangible benefits. With the new zero-touch end-to-end integration, easily searchable and continuously updated content display, and exclusive add-ons for subscribers, SkyTV has seen cart acquisition jump to over 7%.',
                    'Offering more self-service options takes the pressure off customer service. Since SkyTV enabled customers to manage and make purchases from their own accounts, 140% more customer transactions are digitally self-serviced, and calls to the customer call center have decreased.',
                    'Scaling is crucial for fast-paced, evolving markets. Previously, SkyTV deployed changes every three weeks, making scaling for special events difficult. Now, changes are deployed daily through Liferay DXP Cloud, and monitoring and high-availability environments ensure minimal downtime during peak hours.',
                  ],
                },
              ],
            },
            {
              title: 'Background',
              body: [
                'SkyTV is a Top 30 New Zealand-based digital broadcaster and telecom provider connecting over 1 million customers and counting with the entertainment they love on any device they want. They are serving both employees and retirees with the goal of guaranteeing affordable and responsible credit to enable customers to meet their daily expenses sustainably and improve their quality of life.',
              ],
            },
            {
              title: 'Challenges',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'Hoping to continue their success as a dominant player in the streaming world, SkyTV decided to refresh their website.\n\nSkyTV wanted to resolve these challenges:',
                },
                {
                  type: 'list',
                  items: [
                    'Their website was dated and kept users from making purchasing decisions. Competitors had websites with a simplified UI and modern functionalities that made it easy for users to find what they need, but SkyTV’s website didn’t live up to increasing user expectations across the entire customer lifecycle.',
                    'Call centers were burdened trying to manually support customers. The original website didn’t include many self-service options, which meant call center operators had to field every customer question and sale.',
                    'A monolithic on-premise platform made scaling difficult. The existing CMS required slow, manual deployments and custom code, so maintenance was difficult and time-consuming, with deployments happening every three weeks. Special events, like PPV, saw an uptick in traffic that required easy scaling.',
                  ],
                },
                {
                  type: 'quote',
                  text: 'With Liferay Experience Cloud SM, [Sky can] scale automatically or on a schedule a lot quicker than we could do before.',
                  emphasis: ['scale automatically', 'a lot quicker'],
                  name: 'Jacques Hefer',
                  role: 'Solution Architect For SkyTV',
                },
              ],
            },
            {
              title: 'Implementation',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'SkyTV had already been leveraging some content management of the capabilities from Liferay on their website, the decision to migrate to Liferay Experience Cloud Managed (SM) for simplified deployment and the possibility of business made sense.\n\nIntergen assisted SkyTV through the rollout process, which took only ten months and happened in two phases. Critical to the success of the implementation was the Getting Started with DXP Cloud Journey.',
                },
                {
                  type: 'image',
                  image: {
                    src: customerStoryImplementation,
                    alt: 'The redesigned SkyTV site: a featured show banner over a grid of programmes',
                  },
                },
              ],
            },
            {
              title: 'Results',
              blocks: [
                {
                  type: 'paragraph',
                  text: 'Post Liferay Experience Cloud SM implementation, SkyTV’s and the development with operations teams have become better aligned by following a DevOps. This ensures that the IT team is more efficient and agile, able to meet business demands quickly.\n\nSkyTV has also reaped the following benefits:',
                },
                {
                  type: 'list',
                  items: [
                    'Cart acquisition has increased to 7%. The website redesign includes an enhanced user experience and zero-touch end-to-end integration, with a content display that’s always updated and easy to browse as well as new and existing customer add-ons.',
                    'Customer self-service has increased 140%. A new section of the website for logged in users called My Account offers self-service options for account management and purchases, reducing the number of call center calls.',
                    'Customer self-service has increased 140%. A new section of the website for logged in users called My Account offers self-service options for account management and purchases, reducing the number of call center calls.',
                  ],
                },
                {
                  type: 'paragraph',
                  text: 'With Liferay, SkyTV can continue offering their customers the ability to watch the entertainment they love and manage exactly what they want from their SkyTV subscription.',
                },
              ],
            },
          ],
          cta: {
            label: 'Label',
            title: 'Liferay Recognized in the 2025 Gartner Critical Capabilities for DXPs Report',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '#',
          },
        },
        (() => {
          const section = blank('resourceGrid')
          return {
            ...section,
            title: 'Related Content',
            description:
              'Whether you drive campaigns, build infrastructure, or grow partnerships — Liferay empowers your success.',
            card: 'resource' as const,
            cards: [
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceA, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceB, alt: 'Replace with this resource’s own image' } },
              { title: 'Card Title', tag: 'Label', href: '#', image: { src: resourceC, alt: 'Replace with this resource’s own image' } },
            ],
          }
        })(),
      ],
    }),
  },
  {
    id: 'solution-media-proof',
    label: 'Solution detail — media and proof',
    hint: 'The solution page with its second hero: the copy beside the product video, the form beside the proof.',
    /*
     * The same page as `solution`, with the hero the file draws as its second option (node `24920:87684`):
     * two aligned rows, the heading and value props beside the media and the email field beside the
     * proof, which moves under the media and gains the analyst badges. The media is the AI Hub film.
     */
    create: () => {
      const page = PAGE_PRESETS.find((preset) => preset.id === 'solution')!.create()
      return {
        ...page,
        hero: {
          ...page.hero,
          layout: 'media-proof',
          form: { placeholder: 'Enter your email', submit: 'Contact Sales' },
          links: [
            { label: 'Request a demo', href: '#' },
            { label: 'Browse all solutions', href: '#' },
          ],
          proof: {
            ...page.hero.proof,
            badges: [
              { src: gartnerBadge, alt: 'Gartner Peer Insights Customers’ Choice 2026' },
              { src: g2Badge, alt: 'G2 Leader, Enterprise, Fall 2026' },
            ],
          },
          media: {
            src: aiHubFilm,
            poster: aiHubPoster,
            alt: 'Liferay AI Hub: an agent builder and a search workflow over a team at work',
            ratio: '3:2',
          },
        },
      }
    },
  },
]

export const presetFor = (id: string) => PAGE_PRESETS.find((preset) => preset.id === id)
