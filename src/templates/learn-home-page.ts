import articleMedia from '../../assets/home/trending/web-portals.jpg'
import type { PageSpec } from './page-schema'

/*
 * The Liferay Learn home page, as data.
 *
 * `LEARN - New Pages` -> `Home - Redesign` (node `8495:4755`), the redesign of learn.liferay.com. Its
 * own file for the same reason `home-page.ts` is: the story renders it and nothing else has to import
 * the story to get at it. Content only — every drawn measurement is `PageRenderer`'s.
 *
 * The copy the file uses as placeholder — the course names, the popular topics and the card
 * descriptions — is carried over as drawn, and is the first thing to replace.
 */
export const LEARN_HOME_PAGE: PageSpec = {
  /*
   * The hero is a search box, and it is the page. Someone arriving at a documentation site already
   * has a question, so the field is centred and wide, there is no media column to compete with it,
   * and the topics under it are the searches other people made first.
   */
  hero: {
    background: 'full',
    align: 'center',
    title: { text: 'Welcome to Liferay Learn' },
    description: {
      text: 'Documentation, courses, learning paths and certifications — everything you need to build with Liferay, in one place.',
    },
    search: {
      placeholder: 'Search…',
      popular: ['Installation', 'Upgrading', 'Headless APIs', 'Objects', 'Fragments', 'Liferay Cloud'].map(
        (label) => ({ label, href: '#' }),
      ),
    },
  },
  /*
   * The ways in, then what they are about, then the ask. The sign-in card sits after the two grids
   * rather than above them: it asks for something, and it has more to offer once the reader has seen
   * what there is to track.
   */
  sections: [
    {
      type: 'resourceGrid',
      title: 'Start Learning',
      action: { label: 'Browse Documentation', href: '#' },
      cards: [
        { icon: 'documentation', title: 'Documentation', description: 'Guides and references for every Liferay capability, from installation to APIs.', href: '#' },
        { icon: 'courses', title: 'Courses', description: 'Self-paced courses that walk you through real Liferay projects step by step.', href: '#' },
        { icon: 'learning-paths', title: 'Learning Paths', description: 'Curated sequences of courses built around a role — developer, admin or content creator.', href: '#' },
        { icon: 'certifications', title: 'Certifications', description: 'Validate your expertise and showcase your skills with official Liferay certifications.', href: '#' },
        { icon: 'support', title: 'Knowledge Base', description: 'Find answers fast with how-to guides and troubleshooting tips.', href: '#' },
        { icon: 'global-services', title: 'Enablement Hub', description: 'Partner and customer enablement materials, webinars and playbooks.', href: '#' },
      ],
    },
    {
      type: 'quickLinks',
      title: 'DXP Capabilities',
      action: { label: 'Explore All', href: '#' },
      links: (
        [
          ['AI', 'ai-hub'],
          ['CMS', 'cms'],
          ['DAM', 'dam'],
          ['Commerce', 'commerce'],
          ['Personalization', 'personalization'],
          ['Search', 'search'],
          ['Sites', 'sites'],
          ['Integration', 'integration'],
          ['Security', 'security'],
          ['Cloud', 'cloud-native'],
          ['Self-Hosted Installation', 'database'],
          ['Low-Code', 'low-code'],
        ] as const
      ).map(([label, icon]) => ({ label, icon, href: '#' })),
    },
    {
      type: 'highlightText',
      icon: 'certifications',
      title: 'Save your learning progress and start earning Course Badges',
      body: 'Sign in to track completed courses, pick up where you left off and collect badges as you go.',
      action: { label: 'Log In to Liferay Learn', href: '#', style: 'button' },
    },
    {
      type: 'contentBlock',
      label: 'Article',
      title: 'Mastering Search Engine Optimization with Liferay',
      description:
        'Search is often the first thing visitors reach for. This guide walks through configuring Liferay’s search, tuning relevance and structuring content so people find the right page on the first try.',
      action: { label: 'Read More', href: '#' },
      media: { src: articleMedia, alt: 'Replace with this article’s own image' },
    },
    {
      type: 'resourceGrid',
      /*
       * The file's `Course Card`, `Property 1=Progress`: no tag, and a progress bar at the foot. The
       * three sit at three different points so the grid shows the bar's states rather than one
       * value three times.
       */
      title: 'Continue from Where You Left Off',
      action: { label: 'Go to User Dashboard', href: '#' },
      cards: [
        { title: 'Liferay DXP Fundamentals', description: 'Get oriented with sites, pages, users and permissions before building anything.', href: '#', progress: 50 },
        { title: 'Pages with Fragments', description: 'Assemble flexible, on-brand pages from reusable fragments and page templates.', href: '#', progress: 70 },
        { title: 'Headless APIs 101', description: 'Read and write Liferay content from any front end using the headless REST APIs.', href: '#', progress: 100 },
      ],
    },
    {
      type: 'highlightText',
      icon: 'support',
      title: 'Looking for more information?',
      body: 'Explore the FAQ to learn how our resources and programs work.',
      action: { label: 'Go to Learn FAQ', href: '#' },
    },
  ],
}
