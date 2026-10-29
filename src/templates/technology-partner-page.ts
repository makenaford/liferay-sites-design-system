import heroPhoto from '../../assets/technology-partner/hero.png'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import capabilityMedia from '../../assets/home/capability-media.png'
import type { PageSpec } from './page-schema'

/*
 * The Technology Partner page, as data — Partner Pages -> `Technology` (node `272:35757` on `Mockups for
 * review`; formerly `106:25461`).
 *
 * The OEM page's template with the technology program's case: reach Liferay's customers, sell alongside
 * Liferay, and connect your product without forking it. The three partnership models sit behind a pill
 * bar, then the support partners get, and it ends on the same application band.
 *
 * The copy follows the frame. Where the frame still carries the OEM page's words — `Define the
 * Partnership`'s `OEM partnership structure` — it is rewritten for this program. The answers the file
 * leaves closed are drafts, as is the new `Does the partnership require a connector?`.
 */

/* The partnership models' picture — a stand-in for the frame's placeholder. */
const MODELS = { src: capabilityMedia, alt: 'Liferay DXP capabilities connected around a partner product' }

const STILL = { src: agentBuilder, alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them' }

export const TECHNOLOGY_PARTNER_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Take Your Technology to', highlight: 'More Enterprise Customers' },
    description: {
      text: 'Connect your product with Liferay DXP, reach enterprise buyers, and create new opportunities through referrals, Marketplace visibility, and joint selling.',
    },
    buttons: [{ label: 'Become a Technology Partner', href: '#apply' }],
    media: {
      src: heroPhoto,
      alt: 'Two colleagues at a laptop beside the Liferay Marketplace, a partner’s listing with its apps, rating and downloads',
      ratio: '3:2',
    },
  },
  sections: [
    {
      /* One tab, so no pill bar: the four reasons are the accordion's rows. */
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
                question: 'Reach Enterprise Buyers',
                icon: 'cart',
                answer:
                  'Connect your technology with organizations using Liferay DXP to power customer, partner, and employee experiences, from enterprise businesses to public-sector institutions and regulated industries.',
              },
              {
                question: 'Sell Alongside Liferay',
                icon: 'refund-dollar',
                answer:
                  'Exchange referrals and work shared accounts with Liferay’s sales teams, so your product is part of the conversation when customers plan their next digital experience.',
              },
              {
                question: 'Integrate Without Forking',
                icon: 'plugin',
                answer:
                  'Build on Client Extensions and headless APIs instead of modifying the core, so your integration keeps working as customers upgrade Liferay DXP.',
              },
              {
                question: 'Start Simple, Scale Together',
                icon: 'scale',
                answer:
                  'Begin with referrals or a connector and grow into a strategic partnership as joint customers and pipeline grow.',
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
      description: 'Connect with a community of partners, developers, and enterprise teams building what’s next with Liferay.',
      quotes: [
        {
          quote:
            '“Our partnership with Liferay enables industrial companies to deliver world-class digital experiences with a high return on investment.”',
          name: 'Clint Oram',
          role: 'Chief Strategy Officer and Co-founder, SugarAI',
          link: { label: 'Read the Story', href: '#' },
        },
        {
          quote:
            '“With Liferay, we’re enabling customers to activate account intelligence where digital experiences begin, making every engagement more impactful.”',
          name: 'Christopher Amabile',
          role: 'VP, Global Ecosystem, Demandbase',
          link: { label: 'Read the Story', href: '#' },
        },
      ],
    },

    {
      /* One tab: the heading over both columns, the checked points beside the photograph. */
      type: 'tabbedContent',
      title: 'Is Liferay the Right Partner to Grow Your Business?',
      titleHighlight: 'Grow Your Business?',
      description:
        'Technology partnerships work best when there is a clear opportunity to create value together. See what we look for in a strong partner:',
      tabs: [
        {
          value: 'fit',
          label: 'Right partner',
          content: {
            title: '',
            description: '',
            points: [
              {
                title: 'Technology & Product',
                description:
                  'Software products, platforms, services, or add-ons that complement Liferay DXP and address needs beyond its core capabilities.',
              },
              {
                title: 'Market Presence & Customer Base',
                description:
                  'An established presence in the market and a customer base that can benefit from connecting complementary technologies with Liferay.',
              },
              {
                title: 'Partnership & Integration Readiness',
                description:
                  'A commitment to collaboration, with the business and technical resources needed to support the partnership and, where applicable, its integration.',
              },
            ],
            media: STILL,
          },
        },
      ],
    },

    {
      /*
       * The three models behind a pill bar (node `272:35811`): each its name, what it is, and what Liferay
       * looks for in a partner, beside one picture — a stand-in, since the frame's is a placeholder.
       */
      type: 'tabbedContent',
      title: 'A Partnership Model for Every Opportunity',
      titleHighlight: 'Every Opportunity',
      description:
        'Whether the goal is to exchange referrals, connect products, or build a deeper strategic relationship, there’s a partnership model designed to fit the opportunity.',
      tabs: [
        {
          value: 'referral',
          label: 'Referral Partnership',
          icon: 'share-forward',
          content: {
            title: 'Referral Partnership',
            description:
              'The starting point for complementary products. Exchange qualified referrals, align our sales teams on shared accounts, and build the joint track record that leads to a deeper partnership.',
            note: {
              label: 'What we look for in a partner:',
              text: 'Active referral sharing and a sales contact who understands when Liferay is a good fit for their customers.',
            },
            media: MODELS,
          },
        },
        {
          value: 'connector',
          label: 'Connector Partnership',
          icon: 'plugin',
          content: {
            title: 'Connector Partnership',
            description:
              'For products customers want to use with Liferay DXP. Build a Client Extension or Marketplace app with our developer resources and development license, then publish it on the Liferay Marketplace with announcement support.',
            note: {
              label: 'What we look for in a partner:',
              text: 'A well-maintained, documented integration, with published support information and compatibility with current Liferay DXP releases.',
            },
            media: MODELS,
          },
        },
        {
          value: 'strategic',
          label: 'Strategic Partnership',
          icon: 'git-compare',
          content: {
            title: 'Strategic Partnership',
            description:
              'For partners where our products and customers overlap significantly. Plan joint solutions, co-sell on shared opportunities, and run coordinated launches with a named Liferay partnership lead.',
            note: {
              label: 'What we look for in a partner:',
              text: 'Executive sponsorship, a shared business plan, and regular reviews of joint pipeline goals.',
            },
            media: MODELS,
          },
        },
      ],
    },

    {
      type: 'cardGrid',
      title: 'How We Support Our Partners',
      description:
        'From building your integration to bringing it to market, get the resources and support to make the most of your partnership with Liferay.',
      align: 'center',
      surface: 'glass',
      columns: 3,
      cards: [
        { icon: 'commerce', title: 'Marketplace Visibility', description: 'Get your technology in front of Liferay customers through a Marketplace listing.' },
        {
          icon: 'module-integration',
          title: 'Developer Resources',
          description:
            'Everything needed to start building and testing, including Client Extensions, headless APIs, and Marketplace publishing guidance.',
        },
        {
          icon: 'user-validation',
          title: 'Partner Enablement',
          description:
            'Access onboarding, product training, and positioning guidance to help teams understand and communicate the value of the partnership.',
        },
        {
          icon: 'analytics',
          title: 'Co-Marketing Opportunities',
          description:
            'Bring the partnership to market with launch announcements, co-branded content, webinars, and other joint marketing opportunities.',
        },
        { icon: 'add-user', title: 'Partner Portal', description: 'Access partner collateral, submit referrals, and track opportunities in one place.' },
        { icon: 'security', title: 'Development Environment', description: 'Use a Liferay DXP development license to build and test the integration.' },
      ],
    },

    {
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'Is there a fee to become a Technology Partner?',
          answer: 'There is no fee to join the Technology Partner Program.',
        },
        {
          question: 'Does the partnership require a connector?',
          /* Draft — the frame leaves this row closed. */
          answer:
            'No. A referral partnership needs no integration at all; a connector is what the Connector Partnership adds, and many partners start with referrals and build one later.',
        },
        {
          question: 'Who builds the integration?',
          answer:
            'You do, with our support: developer resources, a development license and Client Extension guidance help your team build and test it, and Liferay reviews it before it is listed.',
        },
        {
          question: 'What do I need before I can list on the Marketplace?',
          answer:
            'A working, documented integration compatible with current Liferay DXP releases, published support information, and a listing with your product description and screenshots.',
        },
        {
          question: 'How is the partnership measured?',
          answer:
            'By the joint pipeline and customers it creates: referrals exchanged, Marketplace adoption, and shared opportunities reviewed regularly with your Liferay contact.',
        },
        {
          question: 'What are the Liferay DXP version requirements?',
          answer:
            'Integrations should support the current Liferay DXP release, built on Client Extensions and headless APIs so they keep working as customers upgrade.',
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
          body: 'Together, we’ll determine the right technology partnership model and next steps.',
        },
        {
          title: 'Launch the Partnership',
          body: 'Bring the partnership to market with a Marketplace listing, launch announcement, and enablement for both sales teams.',
        },
      ],
      form: {
        title: 'Become a Technology Partner',
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
          { icon: 'partners', title: 'Solution Partner', href: '#' },
          { icon: 'user-cubes', title: 'OEM Partner', href: '#' },
          ],
        },
      ],
    },
  ],
}
