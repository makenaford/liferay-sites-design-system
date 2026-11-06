import type { Meta, StoryObj } from '@storybook/react-vite'
import { SecondaryNav } from '../components/SecondaryNav'
import { IconGlassBlogs } from '../icons'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { BLOG_CATEGORY_PAGE } from './blog-category-page'
import { BLOG_NAV } from './blog-nav'

function BlogCategory() {
  return (
    <>
      <SiteHeader />
      {/*
       * `mt` 65, the header's height: the hero reaches up behind both bars from there. No `Jump to` menu:
       * it lists the sections a page anchors, and a category is one grid — nothing on it to jump between.
       */}
      <SecondaryNav title="Liferay Blog" icon={<IconGlassBlogs size={32} />} titleHref="#" items={BLOG_NAV} mt={65} />
      <PageRenderer page={BLOG_CATEGORY_PAGE} />
      {/* No `Ready for the future?` band: the page closes on the blog's newsletter sign-up, as the hub does. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Assets to Web/Blog Category',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'One category of the liferay.com blog — `Solutions Library` -> `Blog Category Page` (node `25181:62613`). Rendered from `blog-category-page.ts` through `PageRenderer`.',
          '',
          'The category is `Digital Experience`, and the posts are every blog the Resource Hub files under `Product Module: Digital Experience Platform (DXP)`, in the hub’s order: 53 of them, twelve to a page.',
          '',
          'The hero names the category with the hub shelf’s own line under it. The grid is a `blogGrid` with `pageSize` — the hub’s card, three across — and `Pagination` under it, whose `12 entries` menu changes how many show. The cards name no topic: every one would say the category the hero has just named, as on the hub’s topic shelves.',
          '',
          'It closes on the blog’s newsletter sign-up, the same section as the hub’s.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. */
export const Page: Story = { render: () => <BlogCategory /> }

/** The same page at a phone's width: one card per row, and the pager's count above its buttons. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <BlogCategory />,
}
