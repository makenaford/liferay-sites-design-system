import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnchorNav, type AnchorNavItem } from '../components/AnchorNav'
import { SecondaryNav } from '../components/SecondaryNav'
import { IconGlassBlogs } from '../icons'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { BLOG_HUB_PAGE, POSTS } from './blog-hub-page'
import type { BlogPostSpec, PageSpec, SectionSpec } from './page-schema'
import { BLOG_NAV } from './blog-nav'

/** A jump link per anchored section, labelled with the section's own title. */
const JUMP_LINKS: AnchorNavItem[] = BLOG_HUB_PAGE.sections.flatMap((section) =>
  section.anchor && 'title' in section && section.title
    ? [{ label: section.title, href: `#${section.anchor}` as const }]
    : [],
)

function BlogHub() {
  return (
    <>
      <SiteHeader />
      {/* `mt` 65, the header's height: the hero reaches up behind all three bars from there. */}
      <SecondaryNav title="Blogs" icon={<IconGlassBlogs size={32} />} titleHref="#" items={BLOG_NAV} mt={65} />
      <AnchorNav items={JUMP_LINKS} />
      <PageRenderer page={BLOG_HUB_PAGE} />
      <SiteFooter />
    </>
  )
}

const meta = {
  title: 'Built Pages/Assets to Web/Blog Hub',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The liferay.com blog hub — `Solutions Library` -> `Blog Hub` (node `25025:51238`). Rendered from `blog-hub-page.ts` through `PageRenderer`; the page brought in the `blogGrid` and `blogFeature` section types and the hero’s `label`.',
          '',
          'Every shelf uses the same card: no surface or padding, so the picture is the card; the topics as `Label` `Filled` `XS` pills over the headline; and the two-line byline at the foot. It was chosen from the side-by-side in `Card Styles`, which keeps every option for reference. The other options — glass and overlay cards, text and small-caps topics, the one-row byline, the two-column list — are still on `blogGrid` and `blogFeature` if a page wants them.',
          '',
          'The blog’s own bar sits under the header, as on a post (`Templates/Page Templates` -> `Blog`), without the reading-progress line — there is nothing to read through yet. Under it, an `AnchorNav` jumps to each shelf; its links are the shelves’ own titles, read from the sections that carry an `anchor`.',
          '',
          '## Content',
          '',
          'Every card is a real liferay.com post and links to it. Titles, read times, authors, dates and topic tags are what each post’s page shows; covers are linked from liferay.com, not copied into the repo. Where a page names no author, the card credits `Liferay Team`, with the logo for a portrait. Where it shows no date or topic, the card shows the Figma frame’s placeholder instead — `October 20, 2026` and `Digital Experience · Developer · Customer Experience` — to be replaced when the post has its own.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <BlogHub /> }

/** The same page at a phone's width: one card per row, and the shelf's stacked cards stack their pictures. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <BlogHub />,
}

/* ------------------------------------------------------------------ the comparison */

/** The same three posts in every row, chosen to span the data: a named author, a placeholder, one and two tags. */
const SAMPLE: BlogPostSpec[] = [POSTS.buyersWantFromAi, POSTS.modernizeLegacy, POSTS.cmsMcpServer]

type BlogGridSpec = Extract<SectionSpec, { type: 'blogGrid' }>

const style = (title: string, description: string, options: Partial<BlogGridSpec>): BlogGridSpec => ({
  type: 'blogGrid',
  title,
  description,
  posts: SAMPLE,
  ...options,
})

const CARD_STYLES: PageSpec = {
  hero: {
    background: 'none',
    label: 'Proposal',
    title: { text: 'Nine blog card styles, side by side.' },
    titleMaxWidth: 800,
    description: {
      text: 'The same three posts in each row. Rows 1–3, 7 and 8 are drawn in Figma; the rest are proposals built from the same parts. Row 6 is the one the Blog Hub uses.',
    },
  },
  sections: [
    style(
      '1 · Glass, stacked byline',
      'The original Blog Hub frame. The surface makes each post an obvious target; the two-line byline and dot-separated topics give it the most information, at the cost of the most height.',
      { card: 'glass', byline: 'stacked', tagStyle: 'text' },
    ),
    style(
      '2 · Plain, topic pills',
      'The updated Featured Blogs frame. No surface, so the picture is the card — quieter on a busy page, and the pills make the topics read as scannable labels.',
      { card: 'plain', byline: 'stacked', tagStyle: 'pill' },
    ),
    style(
      '3 · Glass, one-row byline',
      'The Common Cards “Blog” frame. Author, date and read time on one line saves a row of height per card, so a grid of them reads tighter without losing anything.',
      { card: 'glass', byline: 'inline', tagStyle: 'pill' },
    ),
    style(
      '4 · Editorial — topics over the title',
      'Plain, with the topics as a kicker above the headline, as a magazine sets a section name. The reader learns what kind of post it is before reading the title; the byline drops to a single quiet line.',
      { card: 'plain', byline: 'inline', tagPosition: 'top', tagStyle: 'text' },
    ),
    style(
      '5 · Overlay',
      'The picture fills a taller 4:5 card and the text sits on its foot over a dark scrim. The most image-led and the most striking for a featured row, but it depends on every post having a strong picture.',
      { card: 'overlay', byline: 'inline', tagPosition: 'top', tagStyle: 'text' },
    ),
    style(
      '6 · Plain, topic pills over the title — chosen',
      'No surface, with the topics as pills above the headline. The pills give the card a clear starting point when there is no box around it, and the byline stays at the foot where readers look for it. This is the card the Blog Hub uses.',
      { card: 'plain', byline: 'stacked', tagPosition: 'top', tagStyle: 'pill' },
    ),
    style(
      '7 · Blog, no padding',
      'The “Blog- no padding” card frame (node 25025:53104). No surface, with the topics in uppercase small caps over the title — quieter than pills, and set 8px over the headline so it reads as its kicker. The date is in primary text.',
      { card: 'blog' },
    ),
    style(
      '8 · Glass, small caps over the title',
      'The Common Cards “Blog” frame as it is drawn now (node 24980:63861). The glass card with the topics in uppercase small caps above the headline, and a compact two-line byline with a 32px portrait.',
      { card: 'blogGlass' },
    ),
    {
      ...style(
        '9 · Compact list',
        'Two columns of the shelf’s horizontal cards. Roughly half the height of a grid row per post, so it suits an archive or a “more from this topic” list where scanning titles matters more than pictures.',
        { align: 'horizontal', card: 'glass', byline: 'inline', tagPosition: 'top', tagStyle: 'text' },
      ),
      posts: [...SAMPLE, POSTS.vibeCodingExamples],
    },
  ],
}

/**
 * Nine card styles for the hub, one per row, each with the same posts so only the card changes. Rows 1–3,
 * 7 and 8 are frames in the file; the rest are proposals assembled from the same options — tag position,
 * tag style, byline layout and surface — plus the `overlay` card and the two-column list. Row 6 is the one
 * `Page` uses.
 */
export const CardStyles: Story = {
  render: () => (
    <>
      <SiteHeader />
      <PageRenderer page={CARD_STYLES} />
    </>
  ),
}
