import type { SecondaryNavItem } from '../components/SecondaryNav'

/**
 * The blog's own bar — `Secondary Nav` (node `24920:83110`): its three menus, as plain lists of links.
 * Shared by every page under the blog — a post and the hub draw the same bar.
 */
export const BLOG_NAV: SecondaryNavItem[] = [
  {
    value: 'categories',
    label: 'Categories',
    columns: 2,
    links: ['AI', 'CMS', 'Commerce', 'Customer Experience', 'Developers', 'Digital Experience', 'Portals', 'Search'].map(
      (label) => ({ label, href: '#' }),
    ),
  },
  {
    value: 'top-stories',
    label: 'Top Stories',
    links: ['Most read this month', 'Editor’s picks', 'Field reports'].map((label) => ({ label, href: '#' })),
  },
  {
    value: 'industries',
    label: 'Industries',
    links: ['Financial Services', 'Healthcare', 'Manufacturing', 'Public Sector'].map((label) => ({ label, href: '#' })),
  },
]
