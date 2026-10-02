import type { NavMenu } from './site-nav'

/*
 * Liferay Learn's navigation — the five menus the `LEARN - New Pages` file draws across its bar
 * (`Home - Desktop`, node `7571:5691`), filled from the link groups learn.liferay.com carries today.
 *
 * Its own file rather than a locale of `site-nav.ts`, because it is a different site rather than the
 * same one translated: Learn has no Platform or Solutions menu, and liferay.com has no Knowledge Base.
 *
 * Every `href` is `#`. The destinations exist on learn.liferay.com, but a template that looks routed
 * when it is not is worse than one that is plainly a mockup — the same call the Japan page makes.
 */
export const LEARN_NAV: NavMenu[] = [
  {
    value: 'documentation',
    label: 'Documentation',
    heading: 'Find documents categorized by capability',
    columns: [
      {
        heading: 'Capabilities',
        links: [
          { title: 'AI', href: '#' },
          { title: 'CMS', href: '#' },
          { title: 'DAM', href: '#' },
          { title: 'Commerce', href: '#' },
          { title: 'Personalization', href: '#' },
          { title: 'Search', href: '#' },
        ],
      },
      {
        links: [
          { title: 'Sites', href: '#' },
          { title: 'Integration', href: '#' },
          { title: 'Security', href: '#' },
          { title: 'Cloud', href: '#' },
          { title: 'Self-Hosted Installation', href: '#' },
          { title: 'Low-Code', href: '#' },
        ],
      },
      {
        heading: 'Product',
        links: [
          { title: 'DXP', href: '#' },
          { title: 'Commerce', href: '#' },
          { title: 'Liferay Cloud', href: '#' },
          { title: 'Analytics Cloud', href: '#' },
        ],
      },
    ],
    cta: { label: 'View All Capabilities', href: '#', prompt: 'Not sure where to start?' },
  },
  {
    value: 'education',
    label: 'Education',
    columns: [
      {
        heading: 'Learn',
        links: [
          { title: 'Courses', href: '#', description: 'Learn Liferay through engaging courses.' },
          { title: 'Learning Paths', href: '#', description: 'Courses in sequence, built around a role.' },
          { title: 'Certifications', href: '#', description: 'Validate your expertise with official Liferay certifications.' },
        ],
      },
    ],
  },
  {
    value: 'knowledge-base',
    label: 'Knowledge Base',
    columns: [
      {
        heading: 'Knowledge Base',
        links: [
          { title: 'How-to', href: '#', description: 'Step-by-step guides for common tasks.' },
          { title: 'Troubleshooting', href: '#', description: 'Fixes for known problems and error messages.' },
        ],
      },
    ],
  },
  {
    value: 'announcements',
    label: 'Announcements',
    columns: [
      {
        heading: 'Announcements',
        links: [
          { title: 'Release Notes', href: '#' },
          { title: 'Events', href: '#' },
        ],
      },
    ],
  },
  {
    value: 'enablement-hub',
    label: 'Enablement Hub',
    columns: [
      {
        heading: 'Enablement Hub',
        links: [
          { title: 'Partner Enablement', href: '#' },
          { title: 'Customer Enablement', href: '#' },
        ],
      },
    ],
  },
]
