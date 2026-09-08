/*
 * The `LRDC footer`'s copy, as data — same reason as `home-content.ts`.
 *
 * The footer is chrome: every template draws the same one, and a locale changes what it says rather
 * than what it is. Structure (the two link rows, the brand block between them, the social icons) stays
 * in `shared.tsx`.
 */

export interface FooterContent {
  /** BCP 47. Only used to decide whether the CTA heading's two clauses take a space between them. */
  locale: string
  cta: {
    /** The design gradients the second clause only, so the question is plain and the answer lights up. */
    title: { lead: string; accent: string }
    description: string
    emailLabel: string
    emailPlaceholder: string
    trialCta: string
    contactCta: string
  }
  /** The small print above the link grid. The second entry is the Gartner attribution. */
  disclaimers: string[]
  stats: { value: string; accent: string; label: string }[]
  legal: { built: string; copyright: string; links: string[] }
  /** The first row of link columns, above the brand block. */
  columns: [string, string[]][]
  /** The second row, below it. */
  columnsBelow: [string, string[]][]
  address: string
}

export const FOOTER_CONTENT: FooterContent = {
  locale: 'en',
  cta: {
    title: { lead: 'Ready for the future?', accent: 'Let’s get there together.' },
    description:
      'Join thousands of organizations transforming their digital experiences with Liferay. Start your free trial today.',
    emailLabel: 'Work email',
    emailPlaceholder: 'Enter Your Email',
    trialCta: 'Start Free Trial',
    contactCta: 'Contact Sales',
  },

  disclaimers: [
    '*Metrics reflect results from individual Liferay customer stories and may vary by organization.',
    '*Gartner, Voice of the Customer for Digital Experience Platforms, Peer Community Contributor, 27 July 2026.\nGartner, Peer Insights, and Customers’ Choice are trademarks of Gartner, Inc., and/or its affiliates. Gartner Peer Insights content consists of the opinions of individual end users based on their own experiences, and should not be construed as statements of fact, nor do they represent the views of Gartner or its affiliates. Gartner does not endorse any vendor, product or service depicted in this content nor makes any warranties, expressed or implied, with respect to this content, about its accuracy or completeness, including any warranties of merchantability or fitness for a particular purpose.',
  ],

  stats: [
    { value: '1,200', accent: '+', label: 'Enterprise Customers' },
    { value: '17', accent: '+', label: 'Years of Innovation' },
  ],

  legal: {
    built: 'Built on Liferay Digital Experience Platform',
    copyright: '© 2023 Liferay Inc. All Rights Reserved',
    links: ['GDPR', 'Accessibility', 'Legal', 'Compliance', 'Privacy Policy'],
  },

  columns: [
    [
      'Getting Started',
      [
        'Request a Demo',
        'Start Free Trial',
        'Marketplace',
        'Liferay SaaS/PaaS/Self-Hosted',
        'Implementation Guide',
      ],
    ],
    ['More Industries', ['Insurance', 'Transport & Logistics', 'Education', 'Wealth Management']],
    [
      'Compare',
      [
        'Liferay vs. Adobe',
        'Liferay vs. Sitecore',
        'Liferay vs. Optimizely',
        'Liferay vs. SharePoint',
        'Liferay vs. Magnolia',
        'Liferay vs. Salesforce',
      ],
    ],
    [
      'New to Liferay?',
      [
        'What is a DXP?',
        'SaaS vs PaaS',
        'Web Portals Explained',
        'Portal Examples',
        'Headless CMS Guide',
        'Get Your Website Management Score in 2 Minutes',
      ],
    ],
    [
      'Digital Transformation',
      ['Financial Services', 'Public Sector', 'Healthcare', 'Manufacturing'],
    ],
  ],

  columnsBelow: [
    [
      'See What’s Possible',
      [
        '16 Awesome Web Portal Examples',
        '3 Examples of Successful Digital Transformation in Manufacturing',
        '8 Exceptional Customer Portal Examples',
        '7 Intranet Examples That Boost Productivity',
        '3 Real-World Examples of Self-Service in Manufacturing',
      ],
    ],
    [
      'Company',
      [
        'About Us',
        'What’s New',
        'What’s Next',
        'Liferay in the News',
        'Careers',
        'Locations',
        'Contact Us',
      ],
    ],
    [
      'Legal',
      [
        'Trust Center',
        'Customer Agreement Framework',
        'Privacy Policy',
        'Compliance',
        'Accessibility',
      ],
    ],
    [
      'Developers',
      [
        'Developer Blog',
        'Liferay Discuss',
        'Liferay User Groups',
        'Download Liferay DXP',
        'GitHub',
        'Upgrading Liferay DXP to Jakarta',
        'Liferay Cloud Platform Status',
      ],
    ],
  ],

  address: '1400 Montefino Avenue\nDiamond Bar, CA 91765\nUSA\n+1-877-LIFERAY',
}
