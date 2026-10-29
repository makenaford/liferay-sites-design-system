import heroHandshake from '../../assets/partner-home/hero-handshake.jpg'
import agentBuilder from '../../assets/industry/hero-media.jpg'
import type { PageSpec } from './page-schema'

/*
 * The Liferay Partner home page, as data — Partner Pages -> `Partner Home` (node `148:32204`).
 *
 * The hero's handshake and the partner quote tiles are the frame's own; the `Why Partner` picture is the
 * agent-builder photograph the library already holds as `industry/hero-media.jpg`. The logo strip is
 * still set as wordmarks, and every link is `#` until the program pages exist.
 */
export const PARTNER_HOME_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Grow more.', highlight: 'Deliver faster.' },
    description: {
      text: 'Partner with Liferay to expand your offerings, reach new markets, and create greater value for your customers.',
    },
    buttons: [{ label: 'Become a Partner', href: '#' }],
    media: {
      src: heroHandshake,
      alt: 'Three colleagues at a meeting table, two of them shaking hands across it',
      ratio: '3:2',
    },
  },
  /*
   * The case, then the ways in, then the proof — the scale and the partners' own words — and last the
   * two places a reader goes next.
   */
  sections: [
    {
      type: 'logoMarquee',
      label: 'Partners delivering with Liferay',
      logos: ['Accenture', 'Capgemini', 'TCS', 'VAI', 'Placecube', 'SMC', 'PayPal', 'Stripe'],
    },

    {
      /*
       * One tab, so no pill bar, and no panel heading — the frame draws the accordion straight under the
       * section title, each row led by a UI icon, beside one photograph.
       */
      type: 'tabbedContent',
      title: 'Why Partner with Liferay?',
      description:
        'Join the Liferay partner network and transform your business with proven enterprise software that delivers powerful and scalable solutions.',
      mediaSide: 'right',
      tabs: [
        {
          value: 'why',
          label: 'Why partner',
          content: {
            title: '',
            description: '',
            media: {
              src: agentBuilder,
              alt: 'Two colleagues at a laptop, an agent builder and a search workflow beside them',
            },
            items: [
              {
                icon: 'world',
                question: 'Deliver World-Class Digital Experiences',
                answer:
                  "Integrate and customize with a flexible platform that adapts seamlessly to your client's technology, your delivery model, and your business needs.",
              },
              {
                icon: 'office-building',
                question: 'Reach Enterprise Customers',
                /* Draft — the frame leaves this row closed. */
                answer:
                  'Work with enterprise buyers across industries and regions, and bring Liferay into the large, long-running digital programs they run.',
              },
              {
                icon: 'settings',
                question: 'Expand With a Flexible and Secure Platform',
                answer:
                  'Extend your offering with a secure, enterprise-ready platform designed to support your customers’ security and compliance requirements.',
              },
              {
                icon: 'safety-certificate',
                question: 'Leverage Global Trust',
                answer:
                  'Strengthen your market presence with a proven digital platform trusted by global organizations and supported by a global network of partners and customers.',
              },
              {
                icon: 'rocket',
                question: 'Partner with an Industry Recognized DXP Leader',
                answer:
                  'Benefit from third-party peer validation: Liferay is named a Customers’ Choice in the 2026 Gartner® Voice of the Customer for DXP with a 4.6/5 rating and 91% user recommendation rate, as well as a Leader ranked #2 on G2.',
              },
            ],
          },
        },
      ],
    },

    {
      type: 'cardGrid',
      title: 'Explore Our Partnership Programs',
      description:
        'Whether you deliver solutions, build digital products, or extend your technology, there’s a partnership path designed to fit your business.',
      align: 'center',
      columns: 3,
      cards: [
        {
          icon: 'security',
          title: 'Solution Partner',
          description:
            'Turn every Liferay deal into a 5x services opportunity: Deliver digital transformation solutions and build a strong services business around DXP. Access deal registration, co-selling support, enablement, and incentives designed to help you win more business and grow your practice.',
          href: '#',
        },
        {
          icon: 'module-integration',
          title: 'OEM Partner',
          description:
            'Launch faster with Liferay DXP instead of building digital capabilities from scratch. Leverage a proven, flexible platform to accelerate development and focus on differentiating your own product.',
          href: '#',
        },
        {
          icon: 'general-personalization',
          title: 'Technology Partner',
          description:
            'Build pre-integrated connectors and applications, earn referrals, co-market enterprise solutions, and showcase your applications on the Liferay Marketplace.',
          href: '#',
        },
      ],
    },

    {
      type: 'statsBar',
      size: 'lg',
      title: 'Join a Growing Global Ecosystem',
      description: 'See the scale, trust, and community behind the Liferay ecosystem.',
      stats: [
        { value: '500', suffix: '+', label: 'A global network of partners delivering Liferay solutions worldwide.' },
        {
          value: '180K',
          suffix: '+',
          label: 'Join a global community of 180,000+ members building, sharing, and innovating with Liferay.',
        },
        { value: '800', suffix: '+', label: 'Partner-created applications on Liferay Marketplace' },
      ],
    },

    {
      type: 'customerStories',
      title: 'Join the Liferay Global Partner Ecosystem',
      description:
        'Connect with a community of partners, developers, and enterprise teams building what’s next with Liferay.',
      layout: 'grid',
      surface: 'glass',
      stories: [
        {
          customer: 'puntus',
          quote:
            'Our customers love the platform because it is rock solid. It is constantly developing to cover new use cases, so our clients feel safe and secure on the platform.',
          name: 'Michael Bartz',
          role: 'Director Digital Business, puntus',
        },
        {
          customer: 'VAI',
          quote:
            'It’s taking about half the number of man-hours to get a Liferay system up and running compared to our previous software. Support tickets for Liferay almost go to zero because customers are just doing everything themselves.',
          name: 'Ralph Sosebee',
          role: 'Director of Ecommerce, VAI',
        },
        {
          customer: 'Demandbase',
          quote:
            "As AI reshapes go-to-market, the companies that grow will be those that connect intelligence across their technology ecosystem. With Liferay, we're enabling customers to activate account intelligence where digital experiences begin, making every engagement more impactful.",
          name: 'Christopher Amabile',
          role: 'VP, Global Ecosystem, Demandbase',
        },
      ],
    },

    {
      type: 'cardGrid',
      title: 'Explore the Liferay Ecosystem',
      align: 'center',
      columns: 2,
      cards: [
        {
          icon: 'partners',
          title: 'Partner Directory',
          description:
            'Connect with a global network of Liferay partners to deliver digital solutions across industries and markets.',
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
  ],
}
