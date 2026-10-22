import aiHubFilm from '../../assets/solutions/ai-hub.webm'
import aiHubStill from '../../assets/solutions/ai-hub-poster.jpg'
import type { PageSpec } from './page-schema'

/*
 * The OEM partner page, as data — `Partner Pages` -> `OEM Partner` (node `87:20818`).
 *
 * The case for building on Liferay rather than from scratch, then who it suits, then the application.
 * `Become an OEM Partner` in the hero jumps to the form at the foot of the page, where the steps after
 * applying sit beside it on the footer's drifting mesh.
 *
 * The photographs are the AI Hub film and a still from it, standing in for the frame's own; the answers
 * the file leaves closed — four of the five `Why Partner` rows and two of the three FAQs — are drafts.
 */

const STILL = { src: aiHubStill, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' }

export const OEM_PARTNER_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Scale Faster with an', highlight: 'Enterprise-Grade DXP' },
    description: {
      text: 'No more building from scratch. Partner with Liferay and build on a leading and trusted DXP platform that brings your product visions to market faster',
    },
    buttons: [{ label: 'Become an OEM Partner', href: '#apply' }],
    media: { src: aiHubFilm, poster: aiHubStill, alt: STILL.alt, ratio: '3:2' },
  },
  sections: [
    {
      type: 'cardGrid',
      title: 'Everything You Need to Move Faster',
      description:
        'Liferay DXP combines enterprise-grade security, seamless integration, and flexible capabilities to help you bring your product visions within a modern digital experience to market faster.',
      cards: [
        {
          icon: 'security',
          title: 'Enterprise-Grade Security',
          description:
            'Deliver secure digital experiences with built-in identity management, role-based access, auditing, and compliance capabilities designed for complex enterprise and regulated environments.',
        },
        {
          icon: 'integration',
          title: 'Seamless Integration',
          description:
            'Connect with existing systems and technologies through a headless, API-first architecture, REST and GraphQL APIs, and flexible integration capabilities.',
        },
        {
          icon: 'low-code',
          title: 'Built for Flexibility',
          description:
            'Customize and extend the platform to fit your product with modular architecture, low-code tools, custom theming, and composable capabilities.',
        },
        {
          icon: 'ai-hub',
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
                answer:
                  'Go beyond your core software to deliver more value, reach new opportunities, and bring modern digital experiences to market faster.',
              },
              {
                question: 'Accelerate Time to Market',
                answer:
                  'Start from a proven platform instead of a blank repository: portals, content, search and commerce are there on day one, so your roadmap goes to what makes your product different.',
              },
              {
                question: 'Expand and Monetize Your Offering',
                answer:
                  'Add digital experiences your customers will pay for — self-service portals, personalized content and commerce — and open new revenue on top of the software they already buy from you.',
              },
              {
                question: 'Deliver White-Label Experience',
                answer:
                  'Ship under your own brand. Themes, fragments and custom domains make the experience yours end to end, with Liferay underneath rather than in front.',
              },
              {
                question: 'Strengthen Your Market Position',
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
      title: 'What Partners Are Saying',
      description: 'Discover the people, expertise, and solutions driving success across the Liferay partner ecosystem.',
      quotes: [
        {
          quote:
            '“It’s taking about half the number of man-hours to get a Liferay system up and running compared to our previous software. Support tickets for Liferay almost go to zero because customers are just doing everything themselves.”',
          name: 'Ralph Sosebee',
          role: 'Chief Executive Officer, Placecube',
          link: { label: 'Read the Story', href: '#' },
        },
        {
          quote:
            '“Liferay’s commitment to openness, interoperability, and long-term digital sustainability complements Placecube’s mission to give customers choice and control over their digital futures. The Liferay team has been supportive as we collaboratively and consistently focus on delivering real-world outcomes.”',
          name: 'Jason Fahy',
          role: 'VP of Experience and Change Management',
          link: { label: 'Read the Story', href: '#' },
        },
      ],
    },

    {
      type: 'contentBlock',
      title: 'Is Liferay the Right Partner to Grow Your Business?',
      titleHighlight: 'Grow Your Business?',
      description: 'See if an OEM partnership is right for your business.',
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

    {
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How are OEM fees, pricing and commercial terms structured?',
          answer:
            'The Liferay OEM program is governed by a revenue-sharing model with terms negotiated on a case-by-case basis. Due to the high-volume sales capability of our partners, the financial scope of these agreements frequently surpasses that of standard enterprise license costs.',
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
      type: 'cardGrid',
      title: 'Discover the Liferay Ecosystem',
      columns: 2,
      cards: [
        {
          icon: 'partner-portals',
          title: 'Partner Directory',
          description: 'Connect with a global network of Liferay partners to deliver digital solutions across industries and markets.',
          href: '#',
        },
        {
          icon: 'commerce',
          title: 'Liferay Marketplace',
          description: 'Discover apps, integrations, and solutions that extend Liferay DXP.',
          href: '#',
        },
      ],
    },

    {
      type: 'cardGrid',
      title: 'Other Ways to Partner with Liferay',
      columns: 2,
      cards: [
        {
          icon: 'integration',
          title: 'Technology Partner',
          description:
            'Build pre-integrated connectors and applications, earn referrals, co-market enterprise solutions, and showcase your applications on the Liferay Marketplace.',
          href: '#',
        },
        {
          icon: 'enterprise-websites',
          title: 'Solution Partner',
          description:
            'Turn every Liferay deal into a 5x services opportunity: Deliver digital transformation solutions and build a strong services business around DXP.',
          href: '#',
        },
      ],
    },

    {
      type: 'stepsForm',
      anchor: 'apply',
      backdrop: 'mesh',
      title: 'Path to Partnership',
      subtitle: 'What Happens Next?',
      steps: [
        {
          title: 'Meet with Liferay',
          body: 'After submitting your application, a Liferay team member will reach out within 5 business days to schedule a meeting and learn more about your business and solution.',
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
        description: 'Fill out the form below to initiate your application',
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
  ],
}
