import solutionMedia from '../../assets/home/teams-media.png'
import oemMedia from '../../assets/home/platform-diagram.png'
import technologyMedia from '../../assets/home/capability-media.png'
import type { PageSpec } from './page-schema'

/*
 * The Liferay Partner home page, as data.
 *
 * The copy is the `Partner Home` draft as written. Its pictures are not drawn yet, so the program
 * panel borrows stand-ins from the Home page, the logo strip is set as wordmarks, and every link is
 * `#` until the program pages exist.
 */
export const PARTNER_HOME_PAGE: PageSpec = {
  hero: {
    background: 'full',
    align: 'center',
    title: { text: 'Grow more.', highlight: 'Deliver faster.' },
    description: {
      text: 'Partner with Liferay to expand your offerings, reach new markets, and create greater value for your customers.',
    },
    buttons: [{ label: 'Become a Partner', href: '#' }],
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
      type: 'cardGrid',
      title: 'Why Partner with Liferay?',
      description:
        'Join the Liferay partner network and transform your business with proven enterprise software that delivers powerful and scalable solutions.',
      cards: [
        {
          icon: 'enterprise-websites',
          title: 'Deliver World-Class Digital Experiences',
          description:
            "Integrate and customize with a flexible platform that adapts seamlessly to your client's technology, your delivery model, and your business needs.",
        },
        {
          icon: 'security',
          title: 'Expand With a Flexible and Secure Platform',
          description:
            'Extend your offering with a secure, enterprise-ready platform designed to support your customers’ security and compliance requirements.',
        },
        {
          icon: 'global-services',
          title: 'Leverage Global Trust',
          description:
            'Strengthen your market presence with a proven digital platform trusted by global organizations and supported by a global network of partners and customers.',
        },
        {
          icon: 'certifications',
          title: 'Partner with an Industry Recognized DXP Leader',
          description:
            'Benefit from third-party peer validation: Liferay is named a Customers’ Choice in the 2026 Gartner® Voice of the Customer for DXP with a 4.6/5 rating and 91% user recommendation rate, as well as a Leader ranked #2 on G2.',
        },
      ],
    },

    {
      /* One tab, so no pill bar: the three programs are the accordion's rows. */
      type: 'tabbedContent',
      title: 'Explore Our Partnership Programs',
      titleHighlight: 'Partnership Programs',
      description:
        'Whether you deliver solutions, build digital products, or extend your technology, there’s a partnership path designed to fit your business.',
      tabs: [
        {
          value: 'programs',
          label: 'Programs',
          content: {
            title: 'Find the path that fits your business.',
            description: 'Three programs, each with its own benefits, enablement and route to market.',
            items: [
              {
                question: 'Solution Partner',
                answer:
                  'Turn every Liferay deal into a 5x services opportunity: Deliver digital transformation solutions and build a strong services business around DXP. Access deal registration, co-selling support, enablement, and incentives designed to help you win more business and grow your practice.',
                link: { label: 'Learn more', href: '#' },
                media: { src: solutionMedia, alt: 'A partner team delivering a Liferay project' },
              },
              {
                question: 'OEM Partner',
                answer:
                  'Launch faster with Liferay DXP instead of building digital capabilities from scratch. Leverage a proven, flexible platform to accelerate development and focus on differentiating your own product.',
                link: { label: 'Learn more', href: '#' },
                media: { src: oemMedia, alt: 'The Liferay DXP platform under a partner product' },
              },
              {
                question: 'Technology Partner',
                answer:
                  'Build pre-integrated connectors and applications, earn referrals, co-market enterprise solutions, and showcase your applications on the Liferay Marketplace.',
                link: { label: 'Learn more', href: '#' },
                media: { src: technologyMedia, alt: 'Applications and connectors extending Liferay DXP' },
              },
            ],
          },
        },
      ],
    },

    {
      type: 'statsBar',
      title: 'Join a Growing Global Ecosystem',
      description: 'See the scale, trust, and community behind the Liferay ecosystem.',
      stats: [
        { value: '500', suffix: '+', label: 'A global network of partners delivering Liferay solutions worldwide.' },
        {
          value: '180K',
          suffix: '+',
          label: 'Join a global community of 180,000+ members building, sharing, and innovating with Liferay.',
        },
      ],
    },

    {
      type: 'customerStories',
      title: 'What Partners Are Saying',
      titleHighlight: 'Partners',
      description:
        'Discover the people, expertise, and solutions driving success across the Liferay partner ecosystem.',
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
      columns: 2,
      cards: [
        {
          icon: 'partner-portals',
          title: 'Partner Directory',
          description:
            'Connect with a global network of Liferay partners to deliver digital solutions across industries and markets.',
          action: { label: 'View the Partner Directory', href: '#' },
        },
        {
          icon: 'integration',
          title: 'Marketplace',
          description: 'Discover apps, integrations, and solutions that extend Liferay DXP.',
          action: { label: 'Visit Marketplace', href: '#' },
        },
      ],
    },
  ],
}
