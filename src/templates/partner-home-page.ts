import heroAnimation from '../../assets/partner-home/hero-animation.webm'
import heroPoster from '../../assets/partner-home/hero-poster.png'
import whyPartnerPhoto from '../../assets/oem-partner/why-partner.jpg'
import programSolution from '../../assets/partner-home/program-solution.png'
import programOem from '../../assets/partner-home/program-oem.png'
import programTechnology from '../../assets/partner-home/program-technology.png'
import accentureMark from '../../assets/partner-home/logo-accenture.svg'
import capgeminiMark from '../../assets/partner-home/logo-capgemini.svg'
import tcsMark from '../../assets/partner-home/logo-tcs.svg'
import stripeMark from '../../assets/partner-home/logo-stripe.svg'
import vaiMark from '../../assets/oem-partner/logo-vai.svg'
import placecubeMark from '../../assets/oem-partner/logo-placecube.svg'
import smcMark from '../../assets/oem-partner/logo-smc.svg'
import paypalMark from '../../assets/technology-partner/logo-paypal.svg'
import type { PageSpec } from './page-schema'

/*
 * The Liferay Partner home page, as data — Partner Pages -> `Partner Home` (node `290:57750`).
 *
 * The hero is the Marketing Assets library's `partner-home-animation`. The export arrives on a dark
 * ground, so the asset is cropped to the photograph and re-encoded at 1200x800 with alpha: rounded
 * corners, and the transparent 34px strip along the top that `.heroMedia > video` clips off. The programs sit behind a pill bar, each with its own
 * illustration — the frame's `Partner Illustrations` (node `464:29728`). The photographs, the partners'
 * logos and the quote tiles are the frame's own, and every link is `#` until the program pages exist.
 */
export const PARTNER_HOME_PAGE: PageSpec = {
  hero: {
    background: 'corner',
    title: { text: 'Grow more.', highlight: 'Deliver faster.' },
    description: {
      text: 'Partner with Liferay to expand your offerings, reach new markets, and create greater value for your customers.',
    },
    media: {
      /* Opaque inside its rounded corners — the cards sit on the photograph — so one file serves both canvases. */
      src: heroAnimation,
      poster: heroPoster,
      alt: 'Two colleagues shaking hands as your business connects to integrations, portals, growth, cloud, experiences and global reach',
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
      images: [
        { src: accentureMark, alt: 'Accenture' },
        { src: capgeminiMark, alt: 'Capgemini' },
        { src: tcsMark, alt: 'TCS' },
        { src: vaiMark, alt: 'VAI' },
        { src: placecubeMark, alt: 'Placecube' },
        { src: smcMark, alt: 'SMC' },
        { src: paypalMark, alt: 'PayPal' },
        { src: stripeMark, alt: 'Stripe' },
      ],
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
      mediaSide: 'left',
      tabs: [
        {
          value: 'why',
          label: 'Why partner',
          content: {
            title: '',
            description: '',
            media: { src: whyPartnerPhoto, alt: 'A presenter in a blue blazer talking to a meeting room', ratio: '3:2' },
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
      /*
       * The three programs behind a pill bar (node `338:12552`): each its glass mark, its case and the way
       * in, beside its own illustration.
       */
      type: 'tabbedContent',
      title: 'Explore Our Partnership Programs',
      description:
        'Whether you deliver solutions, build digital products, or extend your technology, there’s a partnership path designed to fit your business.',
      tabs: [
        {
          value: 'solution',
          label: 'Solution Partner',
          icon: 'group-2',
          content: {
            eyebrow: 'solution-partner',
            eyebrowSize: 64,
            textSize: 'lg',
            title: 'Solution Partner',
            description:
              'Turn Liferay deals into a 5x services opportunity. Deliver digital transformation solutions and win more business with dedicated deal registration, co-selling, enablement, and incentives.',
            action: { label: 'Learn More', href: '#' },
            media: {
              src: programSolution,
              alt: 'A smiling partner shaking hands beside the Liferay Partner Portal, its deals pipeline and revenue growth',
              ratio: '3:2',
            },
          },
        },
        {
          value: 'oem',
          label: 'OEM Partner',
          icon: 'webhook',
          content: {
            eyebrow: 'oem-partner',
            eyebrowSize: 64,
            textSize: 'lg',
            title: 'OEM Partner',
            description:
              'Launch faster with Liferay DXP instead of building digital capabilities from scratch. Leverage a proven, flexible platform to accelerate development and focus on differentiating your own product.',
            action: { label: 'Learn More', href: '#' },
            media: {
              src: programOem,
              alt: 'Two colleagues in conversation beside a partner’s supplier portal, powered by Liferay DXP with sites, commerce, self-service and security',
              ratio: '3:2',
            },
          },
        },
        {
          value: 'technology',
          label: 'Technology Partner',
          icon: 'web',
          content: {
            eyebrow: 'technology-partner',
            eyebrowSize: 64,
            textSize: 'lg',
            title: 'Technology Partner',
            description:
              'Build pre-integrated connectors and applications, earn referrals, co-market enterprise solutions, and showcase your applications on the Liferay Marketplace.',
            action: { label: 'Learn More', href: '#' },
            media: {
              src: programTechnology,
              alt: 'Two colleagues at a tablet as Liferay DXP and a partner’s technology join into joint solutions',
              ratio: '3:2',
            },
          },
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
      cardSet: 'partner',
      title: 'Explore the Liferay Ecosystem',
      columns: 2,
      cards: [
        {
          icon: 'user-badge',
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
