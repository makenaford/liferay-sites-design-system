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
  /** The link columns before the brand block — two rows of five. */
  columns: [string, string[]][]
  /** The columns after it, sharing its row. */
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

  /*
   * `LRDC footer`, node `8977:16496`: two full rows of five, then the brand block and three more. The
   * order is the file's, left to right and top to bottom.
   */
  columns: [
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
      'Getting Started',
      [
        'Request a Demo',
        'Start Free Trial',
        'Liferay DXP for Marketers',
        'Marketplace',
        'Liferay SaaS/PaaS/Self-Hosted',
        'Implementation Guide',
      ],
    ],
    ['More Industries', ['Insurance', 'Transport & Logistics', 'Education', 'Wealth Management']],
    [
      'Documentation',
      [
        'AI',
        'CMS',
        'DAM',
        'Commerce',
        'Personalization',
        'Search',
        'Sites',
        'Integration',
        'Security',
        'Low-Code',
      ],
    ],
    [
      'Digital Glossary',
      [
        'What is AI Transformation?',
        'What is Digital Strategy?',
        'What is Digital Business?',
        'What Is an Enterprise Website?',
        'What is Low-Code and No-Code?',
        'What is B2B2C?',
        'Data Sovereignty vs. Data Residency',
      ],
    ],
    [
      /*
       * ⚠ The file's heading, verbatim. It reads as a working note rather than published copy, so it
       * wants a real title before this ships.
       */
      '5 More High Opportunity pieces from Navin',
      [
        'What is a Content Management System?',
        'What is Digital Customer Experience?',
        '7 Intranet Examples That Boost Productivity',
        'What is a Digital Experience?',
      ],
    ],
    [
      'How-to-Guides',
      [
        'Digital Transformation Strategy',
        'Managing Enterprise AI at Scale',
        'Composable Commerce Migration',
        'Agentic AI in Marketing',
        'Vibe Coding vs. Low-Code',
        'Composable Commerce for B2B',
      ],
    ],
  ],

  columnsBelow: [
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
