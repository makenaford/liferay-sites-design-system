import heroPhoto from '../../assets/oem-partner/hero.jpg'
import vaiLogo from '../../assets/oem-partner/vai-logo.png'
import placecubeLogo from '../../assets/oem-partner/placecube.svg'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import type { PageSpec } from './page-schema'

/*
 * The OEM partner page, as data — `Partner Pages` -> `OEM` (node `148:27740`).
 *
 * The case for building on Liferay rather than from scratch, then who it suits, then the application.
 * `Become an OEM Partner` in the hero jumps to the form at the foot of the page, where the steps after
 * applying sit beside it on a still corner glow.
 *
 * The hero photograph and the partners' logos are the frame's own; the agent-builder photograph is the
 * library's `industry/hero-media.jpg`, the same picture. The answers the file leaves closed — four of
 * the five `Why Partner` rows and two of the three FAQs — are drafts.
 */

const STILL = { src: agentBuilder, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' }

export const OEM_PARTNER_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Scale Faster with an', highlight: 'Enterprise-Grade DXP' },
    description: {
      text: 'No more building from scratch. Extend your software with enterprise-grade digital experiences and bring your product visions to market faster.',
    },
    buttons: [{ label: 'Become an OEM Partner', href: '#apply' }],
    media: { src: heroPhoto, alt: 'Two colleagues talking across a laptop at a meeting table', ratio: '3:2' },
  },
  sections: [
    {
      type: 'cardGrid',
      title: 'Everything You Need to Move Faster',
      description:
        'Liferay DXP combines security, integration, and flexible capabilities to help you create modern digital experiences around your products.',
      align: 'center',
      surface: 'glass',
      cards: [
        {
          icon: 'security',
          title: 'Enterprise-Grade Security',
          description:
            'Deliver secure digital experiences with built-in identity management, role-based access, auditing, and compliance capabilities designed for complex enterprise and regulated environments.',
        },
        {
          icon: 'module-integration',
          title: 'Seamless Integration',
          description:
            'Connect with existing systems and technologies through a headless, API-first architecture, REST and GraphQL APIs, and flexible integration capabilities.',
        },
        {
          icon: 'general-personalization',
          title: 'Built for Flexibility',
          description:
            'Customize and extend the platform to fit your product with modular architecture, low-code tools, custom theming, and composable capabilities.',
        },
        {
          icon: 'general-ai',
          title: 'Modern, AI-Powered Experiences',
          description:
            'Personalization, self-service, omnichannel experiences, and AI capabilities to deliver modern digital experiences from day one.',
        },
      ],
    },

    {
      /* One tab, so no pill bar: the five reasons are the accordion's rows. */
      type: 'tabbedContent',
      title: 'Why Partner with Liferay?',
      description:
        'Go beyond your core software to deliver more value, reach new opportunities, and bring modern digital experiences to market faster.',
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
                question: 'Focus on Your Core Product',
                icon: 'direction-arrow',
                answer:
                  'Keep your engineering resources focused on what makes your software unique while Liferay provides the digital experience layer.',
              },
              {
                question: 'Accelerate Time to Market',
                icon: 'dashboard',
                answer:
                  'Start from a proven platform instead of a blank repository: portals, content, search and commerce are there on day one, so your roadmap goes to what makes your product different.',
              },
              {
                question: 'Expand and Monetize Your Offering',
                icon: 'pig-money',
                answer:
                  'Add digital experiences your customers will pay for — self-service portals, personalized content and commerce — and open new revenue on top of the software they already buy from you.',
              },
              {
                question: 'Deliver White-Label Experience',
                icon: 'tag',
                answer:
                  'Ship under your own brand. Themes, fragments and custom domains make the experience yours end to end, with Liferay underneath rather than in front.',
              },
              {
                question: 'Strengthen Your Market Position',
                icon: 'barbell',
                answer:
                  'Compete on a platform recognized by analysts and trusted by global enterprises, backed by Liferay’s partner programs, enablement and co-selling support.',
              },
            ],
          },
        },
      ],
    },

    {
      type: 'logoMarquee',
      label: 'Customers using Liferay',
      logos: ['DATAMATICS', 'PETROBRAS', 'CITY OF BURBANK', 'Excellus', 'AIRBUS', 'Carrefour'],
    },

    {
      type: 'quotes',
      title: 'Join the Liferay Global Partner Ecosystem',
      description:
        'Connect with a community of partners, developers, and enterprise teams building what’s next with Liferay.',
      quotes: [
        {
          logo: { src: vaiLogo, alt: 'VAI' },
          quote:
            '“It’s taking about half the number of man-hours to get a Liferay system up and running compared to our previous software. Support tickets for Liferay almost go to zero because customers are just doing everything themselves.”',
          name: 'Ralph Sosebee',
          role: 'Director of Ecommerce, VAI',
          link: { label: 'Read the Story', href: '#' },
        },
        {
          logo: { src: placecubeLogo, alt: 'Placecube' },
          quote:
            '“Liferay’s commitment to openness, interoperability, and long-term digital sustainability complements Placecube’s mission to give customers choice and control over their digital futures. Our partnership continues to evolve as we explore new capabilities and markets.”',
          name: 'Jason Fahy',
          role: 'Chief Executive Officer, Placecube',
          link: { label: 'Read the Story', href: '#' },
        },
      ],
    },

    {
      /*
       * The heading over both columns, as the frame draws it, so a one-tab `tabbedContent`: the checked
       * points on the left, the photograph on the right, no pill bar and no panel heading.
       */
      type: 'tabbedContent',
      title: 'Is Liferay the Right Partner to Grow Your Business?',
      titleHighlight: 'Grow Your Business?',
      description: 'See if an OEM partnership is right for your business.',
      tabs: [
        {
          value: 'fit',
          label: 'Right partner',
          content: {
            title: '',
            description: '',
            points: [
              {
                title: 'Established Software Products',
                description:
                  'Established Independent Software Vendors (ISVs) or niche market leaders with proven software solutions and existing customers.',
              },
              {
                title: 'Ready to Modernize',
                description:
                  'Companies looking to enhance their software with modern, AI-powered, self-service, and on-brand digital experiences.',
              },
              {
                title: 'Industry & Market Expertise',
                description:
                  'A strong presence in industries where customers increasingly expect modern, secure, and self-service digital experiences — including but not limited to financial services, government, healthcare, insurance, and manufacturing.',
              },
              {
                title: 'A Unique Product Vision',
                description:
                  'Teams that want to keep engineering focused on their core technology while using a flexible digital experience platform to extend and differentiate their offering.',
              },
            ],
            media: STILL,
          },
        },
      ],
    },

    {
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How are OEM fees, pricing and commercial terms structured?',
          answer:
            'The Liferay OEM program is governed by a revenue-sharing model tailored to partner sales volume and integration scope. Fees are normally negotiated individually, and, in most cases, will consist of two parts: OEM Annual Fee and OEM Subscription. As partners scale their sales volume, total contract often surpasses standard enterprise license costs.',
        },
        {
          question: 'Can Liferay DXP be fully white-labeled?',
          answer:
            'Yes. Themes, page fragments, custom domains and email templates carry your brand throughout, so your customers see your product, built on Liferay underneath.',
        },
        {
          question: 'Can Liferay DXP support regulated industries?',
          answer:
            'Yes. Role-based access, auditing, data residency through on-premises or private-cloud deployment, and certified SaaS hosting support financial services, government, healthcare and insurance requirements.',
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
          title: 'Meet with Liferay',
          body: 'After submitting your application, a Liferay Sales team member will reach out to schedule a meeting and discuss the use case, customer opportunities, and value for both sides.',
        },
        {
          title: 'Discuss the Opportunity',
          body: 'Come prepared to discuss your use case, how you plan to use Liferay DXP, your prospective sales pipeline, and how you plan to monetize your solution.',
        },
        {
          title: 'Define the Partnership',
          body: 'Together, we’ll determine the right OEM partnership structure and next steps.',
        },
      ],
      form: {
        title: 'Become an OEM Partner',
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
          { icon: 'partners', title: 'Solution Partner', href: '#' },
          ],
        },
      ],
    },

  ],
}
