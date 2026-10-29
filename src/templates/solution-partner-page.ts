import heroPhoto from '../../assets/solution-partner/hero.jpg'
import americaneagle from '../../assets/solution-partner/americaneagle.jpg'
import inetum from '../../assets/solution-partner/inetum.jpg'
import globalquark from '../../assets/solution-partner/globalquark-infographic.jpg'
import vass from '../../assets/solution-partner/vass-interview.jpg'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import type { PageSpec } from './page-schema'

/*
 * The Solution Partner page, as data — the `COPY - Solutions` tab of `LRDC Partner Pages Revamp`, with
 * its partner-level tables from `COPY - Solutions 5. Partnership`, laid out as Partner Pages ->
 * `Solutions` (node `272:38182`, formerly `205:11746`).
 *
 * The copy is the sheet's, section for section; the frame is the layout. Where the two disagree — the
 * frame repeats the OEM page's `Why Partner` line and its first step, names Steven LaGow under both
 * quotes, and labels every card `Read the Story` — the sheet's words stand. The pictures are the frame's
 * own; the agent-builder photograph is the library's `industry/hero-media.jpg`, the same picture. Every
 * link is `#`.
 */

const STILL = { src: agentBuilder, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' }

/** `Authorized`, `Silver`, `Gold`, `Platinum` — the sheet's ✔️ and — as booleans, its coins as levels. */
const yes = true
const no = false
const coins = (level: number) => ({ level })

export const SOLUTION_PARTNER_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Where Your Expertise Meets', highlight: 'Our Technology' },
    description: {
      text: 'Partner with Liferay to unlock new opportunities, expand your services offering, and build long-term customer relationships.',
    },
    buttons: [{ label: 'Become a Solution Partner', href: '#apply' }],
    media: { src: heroPhoto, alt: 'Two people shaking hands across a desk, one of them smiling', ratio: '3:2' },
  },
  sections: [
    {
      /* One tab, so no pill bar: the six reasons are the accordion's rows, beside one photograph. */
      type: 'tabbedContent',
      title: 'Why Partner with Liferay?',
      description: 'Discover the technology, support, and business opportunities that make Liferay a Partner-First choice.',
      tabs: [
        {
          value: 'why',
          label: 'Why partner',
          content: {
            title: '',
            description: '',
            media: STILL,
            items: [
              {
                question: 'A Partner-First Approach',
                icon: 'heart-hand',
                answer:
                  'Liferay never competes with our partners. You lead delivery, while we work together to grow accounts and build long-term customer relationships.',
              },
              {
                question: 'Turn Every Deal into a Services Opportunity',
                icon: 'briefcase',
                answer:
                  'For every $1 in Liferay software sold, Solution Partners generate an average of $5 in implementation and services revenue.',
              },
              {
                question: 'Create New Revenue Streams',
                icon: 'pig-money',
                answer:
                  'Expand your business model with recurring services like optimization, support, and digital growth consulting beyond initial implementation.',
              },
              {
                question: 'Win Regulated Enterprise Deals',
                icon: 'office-building',
                answer:
                  'Expand into regulated industries with an enterprise-ready platform designed to support your customers’ security, governance, and compliance requirements.',
              },
              {
                question: 'Get the Support You Need, Where You Need It',
                icon: 'headphone',
                answer:
                  'Work with Liferay teams in your region for local sales, technical, and partner support throughout the opportunity and delivery lifecycle.',
              },
              {
                question: 'Get Rewarded for Your Success',
                icon: 'trophy',
                answer:
                  'Take advantage of incentive programs designed to recognize partner performance and support your business goals.',
              },
            ],
          },
        },
      ],
    },

    {
      type: 'logoMarquee',
      label: 'Liferay partners',
      logos: ['Accenture', 'Capgemini', 'Tata Consultancy Services', 'Cognizant', 'NTT DATA', 'Infosys'],
    },

    {
      /*
       * The partners' quotes and their success stories as one row of four (node `217:27595`): each card
       * a picture, the words, and one link at the foot. A quote card has no title — the attribution
       * follows the quote.
       */
      type: 'cardGrid',
      title: 'Join the Liferay Global Partner Ecosystem',
      description:
        'Join a global community of partners working with Liferay to deliver successful digital experiences and create lasting customer value.',
      align: 'center',
      columns: 4,
      cards: [
        {
          image: { src: americaneagle, alt: 'Americaneagle.com' },
          title: '',
          description:
            '“It’s been easy for us to onboard ourselves. With the help of the Liferay team, we are able to better articulate and deliver the Liferay story.”',
          attribution: { name: 'Steven LaGow', role: 'Partner Director, Americaneagle.com' },
          cta: { label: 'Watch the interview', href: '#' },
        },
        {
          image: { src: inetum, alt: 'Inetum' },
          title: '',
          description:
            '“Growth does not happen without customer satisfaction. While we develop large accounts together, we can only do this if we repeatedly deliver successful projects.”',
          attribution: { name: 'Tanguy Commault', role: 'Group VP - Digital eXperience Platforms, Inetum' },
          cta: { label: 'Watch the interview', href: '#' },
        },
        {
          image: { src: globalquark, alt: '17+ Years of Growth: How GlobalQuark Scaled to $3.5M+ with Liferay' },
          title: '17 Years of Partnership, 30+ New Clients and $3.5M in Annual Revenue:',
          description: 'Growing Together with Liferay',
          cta: { label: 'Access the infographic', href: '#' },
        },
        {
          image: { src: vass, alt: 'Partner Pulse — VASS & Liferay: Leading the Digital Change in LATAM' },
          title: 'How VASS is Navigating LATAM’s Digital Divide:',
          description:
            'Sergio Rojas of VASS LATAM shares digital transformation insights and why VASS won Liferay’s LATAM Partner of the Year Award again.',
          cta: { label: 'Read the interview', href: '#' },
        },
      ],
    },

    {
      type: 'tabbedContent',
      title: 'Is Liferay the Right Partner to Grow Your Business?',
      titleHighlight: 'Grow Your Business?',
      description:
        'We collaborate with top systems integrators and digital agencies to deliver exceptional digital experiences. Choose your partner track below to explore our core requirements and see where your expertise aligns with our ecosystem.',
      /* The two tracks side by side, as the frame draws them, rather than behind a pill bar. */
      layout: 'columns',
      tabs: [
        {
          value: 'system-integrators',
          label: 'System Integrators',
          content: {
            title: '',
            description: '',
            items: [
              {
                question: 'Company Profile & Market Focus',
                answer:
                  'We partner with Boutique to Mid-Tier Systems Integrators ready to scale enterprise-level solutions, with the following profile.',
                list: [
                  'Target Audience: Focused on Mid-Market and Enterprise customers.',
                  'Company Size: 35+ full-time employees.',
                  'Key Industries: Strong presence in Banking & Financial Services (BFS), Manufacturing, Healthcare, Government, Higher Education, and Utilities.',
                  'Strategic Fit: Your services enhance Liferay’s value proposition by focusing on specific verticals, tailored solutions (customer/supplier portals, intranets), or solving complex pain points like ERP/CRM integrations.',
                ],
              },
              {
                question: 'Technical & Delivery Expertise',
                answer:
                  'System Integrators partners must possess the backend architecture skills to handle complex, scalable deployments.',
                list: [
                  'Core Practice: Dedicated DXP, CMS/WCM, or Portal practice with broad domain expertise in CRM, ERP, and B2B.',
                  'Delivery & Architecture: Strong back-end development capabilities. Ability to create remote apps, API integrations, and the technical infrastructure to seamlessly integrate with the Liferay DXP platform.',
                  'Pre-Sales Readiness: Capability to solo pitch, demonstrate the product, and execute Proof of Concepts (POCs).',
                ],
              },
              {
                question: 'Go-to-Market & Commercial Capabilities',
                answer:
                  'Successful System Integrators are committed to co-selling, joint marketing, and collaborative growth.',
                list: [
                  'Sales Expertise: Professional teams with experience selling SaaS, DXPs, or Portals.',
                  'GTM Execution: Have proven ability to execute demand generation initiatives.',
                  'Investment: Willingness to invest time and resources into joint marketing initiatives, co-selling efforts, and collaborative solution development.',
                ],
              },
            ],
          },
        },
        {
          value: 'digital-agencies',
          label: 'Digital Agencies',
          content: {
            title: '',
            description: '',
            items: [
              {
                question: 'Company Profile & Market Focus',
                answer:
                  'We are looking for established digital agencies with a proven track record in digital transformation and user experience, and the following profile:',
                list: [
                  'Target Audience: Focused on Mid-Market clients.',
                  'Company Revenue: Approximately $50M in revenue with global or regional coverage.',
                  'Key Industries: Expertise in Manufacturing, Financial Services, Insurance, Education, Healthcare, Government, and Public Sector.',
                  'Strategic Fit: Liferay naturally complements your current offerings. You are positioned to offer end-to-end digital transformation or help customers replatform from outdated portals (IBM, Oracle, SharePoint).',
                ],
              },
              {
                question: 'Technical & Delivery Expertise',
                answer: 'Our ideal agency partners blend deep technical knowledge with outstanding user experience design.',
                list: [
                  'Core Practice: Dedicated DXP, CMS/WCM, or Portal practice.',
                  'Development Skills: Strong UX/UI/CSS practice and front-end development capabilities.',
                  'Pre-Sales Readiness: Ability to identify Liferay fit, understand differentiators, and qualify opportunities based on need and timeline.',
                ],
              },
              {
                question: 'Go-to-Market & Commercial Capabilities',
                answer: 'We partner with agencies ready to drive joint pipeline and deliver end-to-end digital experiences.',
                list: [
                  'Sales Readiness: Sales and pre-sales teams with experience selling digital solutions.',
                  'Marketing Capabilities: Ability to drive demand generation initiatives and create relevant content.',
                  'Investment: Willingness to invest time and resources into joint marketing initiatives and co-selling efforts, and collaborative solution development.',
                ],
              },
            ],
          },
        },
      ],
    },

    {
      type: 'tierTable',
      title: 'Partner Levels Designed for Growth',
      titleHighlight: 'Designed for Growth',
      description:
        'A successful partnership is built on mutual investment and shared success. Explore the specific technical expectations, commercial commitments, and exclusive benefits associated with each partner tier.',
      /* The requirements table's figures, carried on the cards now, as the frame draws them. */
      tiers: [
        {
          name: 'Authorized',
          points: '0',
          certified: 'No certified headcount minimum',
          description: 'For companies beginning to grow their Liferay practice or focusing on deal referrals.',
          fee: '—',
        },
        {
          name: 'Silver',
          points: '5-6',
          certified: '1 Sales · 1 Pre-Sales · 2 Developers',
          description: 'For partners with proven commitment, certified staff, and consistent engagement.',
          fee: '2,500 USD',
        },
        {
          name: 'Gold',
          points: '7-9',
          certified: '2 Sales · 2 Pre-Sales · 3 Developers',
          description: 'For established experts driving new subscriptions and demonstrating strong growth.',
          fee: '2,500 USD',
        },
        {
          name: 'Platinum',
          points: '10+',
          certified: '4 Sales · 3 Pre-Sales · 5 Developers',
          description: 'Reserved for Liferay’s most strategic, highest-performing, and committed partners.',
          fee: '2,500 USD',
        },
      ],
      tiersNote:
        '*Partner tiers are earned through a points-based score evaluating four metrics: Growth ARR, NRR, Marketing & Demand Generation, and Certified Headcount.',
      compareLabel: 'Compare every benefit and requirement',
      tables: [
        {
          label: 'Benefit Category & Feature',
          tab: 'Benefits',
          groups: [
            {
              label: 'Financial & Compensation',
              rows: [
                { label: 'Growth & Renewal Subscriptions Margin', values: [coins(1), coins(2), coins(3), coins(4)] },
                { label: 'Referral Deals Margin', values: [yes, yes, yes, yes] },
                { label: 'Partner Incentives (Quarterly)', values: [no, no, yes, yes] },
              ],
            },
            {
              label: 'Sales, Support & Enablement',
              rows: [
                { label: 'Deal Registration & Protection', values: [yes, yes, yes, yes] },
                { label: 'Access to online, on-demand education content', values: [yes, yes, yes, yes] },
                { label: 'Dedicated Liferay Team', values: [no, yes, yes, yes] },
                { label: 'Demonstration Access & Roadmap Access', values: [no, yes, yes, yes] },
                { label: 'Executive Sponsor & Advisory Boards', values: [no, no, no, yes] },
              ],
            },
            {
              label: 'Marketing & Demand Generation',
              rows: [
                { label: 'Liferay Field Marketing Team Support', values: [no, yes, yes, yes] },
                { label: 'Market Development Funds (MDF)', values: [no, yes, yes, yes] },
                { label: 'Co-Marketing Opportunities', values: [no, yes, yes, yes] },
              ],
            },
          ],
        },
      ],
    },

    {
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Is there a fee to join the Liferay Solution Partner Program?',
          answer:
            'Yes, there is an annual partnership fee required to access the full resources and benefits of the Silver, Gold, and Platinum partner levels. The specific fee amount is detailed in the Partner Acceptance Form or in the invoice provided by Liferay for the applicable calendar year.',
        },
        {
          question: 'Do you offer co-marketing incentives or funding?',
          answer:
            'Absolutely. Solution Partners at the Silver, Gold, and Platinum levels can submit proposals for Market Development Funds (MDF) to subsidize up to 50% of the costs for joint demand generation activities. Additionally, eligible partners gain access to the Liferay Marketing Center, a through-channel marketing automation (TCMA) tool to launch campaigns across web, social media, and email.',
        },
        {
          question: 'Does Liferay provide leads to its partners?',
          answer:
            'Liferay operates under a co-sell methodology, collaborating closely to capture new markets and customers. While partners are expected to actively promote Liferay and register their own deals, Liferay may pass referred opportunities to qualified partners to work and close.',
        },
        {
          question: 'How does the partner points system work?',
          answer:
            'Liferay utilizes a comprehensive, points-based system to determine and maintain Solution Partner levels. To qualify for a specific tier, partners must achieve a minimum total point score calculated from their performance across four critical areas: Growth Annual Recurring Revenue (ARR), Net Revenue Retention (NRR), Marketing & Demand Generation, and Certified Headcount.',
        },
        {
          question: 'What is the certification process for our team?',
          answer:
            'Individuals must obtain role-specific certifications by successfully passing exams delivered in accordance with Liferay’s Certification Program. To help your team prepare, Liferay provides comprehensive webinars, self-guided courses on Liferay Learn, and in-person classroom training. Technical certification exams are officially administered and registered through the Webassessor platform.',
        },
        {
          question: 'Will we have a dedicated support team at Liferay?',
          answer:
            'Yes, all Liferay Solution Partners are supported by dedicated resources. You will have access to a Partner Success Specialist (PSS) who manages onboarding and daily operational support, as well as a dedicated Account Executive who acts as your sales coach and extension of your core team.',
        },
      ],
    },

    {
      type: 'stepsForm',
      anchor: 'apply',
      backdrop: 'glow',
      title: 'Path to Partnership',
      subtitle: 'What Happens Next?',
      steps: [
        {
          title: 'Exploratory Fit Call',
          body: 'After submitting your application, a Liferay Sales team member will reach out within 5 business days to schedule a meeting and learn more about your business and solution.',
        },
        {
          title: 'Legal & Partnership Agreement',
          body: 'We will finalize standard legal documentation, including an NDA (where needed) and Partnership Agreement.',
        },
        {
          title: 'Program & Tier Alignment',
          body: 'We will define your partner level, align on program expectations, and map out your strategic benefits.',
        },
        {
          title: 'Onboarding & Enablement',
          body: 'You will activate your Partner Portal account, gain access to exclusive technical and sales training, and receive your demo licenses.',
        },
      ],
      form: {
        title: 'Become a Solution Partner',
        description: 'Fill out the form below to initiate your application.',
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
            { label: 'Company Website', required: true },
            {
              label: 'Country',
              type: 'select',
              options: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Spain', 'Brazil', 'Japan', 'Other'],
            },
          ],
          [{ label: 'Integration Description', type: 'textarea', required: true }],
        ],
        submit: 'Apply Now',
      },
    },

    {
      type: 'highlightText',
      icon: 'documentation',
      surface: 'glass',
      title: 'Still Evaluating?',
      body: 'Check out key resources to help you learn about Liferay’s partner program and solutions.',
      action: { label: 'Download the Info Kit', href: '#', style: 'button' },
    },

    {
      /*
       * The ecosystem frame (Solutions Library node `25120:53447`): one section, the two ways into the
       * ecosystem and then, under a smaller heading, the other two programs. Title-only cards, each icon beside its title.
       */
      type: 'cardGrid',
      title: 'Discover the Liferay Ecosystem',
      columns: 2,
      cardHeader: 'horizontal',
      cards: [
        { icon: 'user-badge', title: 'Partner Directory', href: '#' },
        { icon: 'commerce', title: 'Liferay Marketplace', href: '#' },
      ],
      groups: [
        {
          title: 'Other Ways to Partner with Liferay',
          cards: [
          { icon: 'user-screen', title: 'Technology Partner', href: '#' },
          { icon: 'user-cubes', title: 'OEM Partner', href: '#' },
          ],
        },
      ],
    },
  ],
}
