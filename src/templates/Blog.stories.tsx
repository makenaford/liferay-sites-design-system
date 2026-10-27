import type { Meta, StoryObj } from '@storybook/react-vite'
import { SecondaryNav } from '../components/SecondaryNav'
import { IconGlassBlogs } from '../icons'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { BLOG_NAV } from './blog-nav'
import { presetFor } from './page-presets'

function BlogPost() {
  return (
    <>
      <SiteHeader />
      {/* `mt` 65, the header's height: the hero reaches up behind both bars from there. */}
      <SecondaryNav title="Blogs" icon={<IconGlassBlogs size={32} />} titleHref="#" items={BLOG_NAV} progress mt={65} />
      <PageRenderer page={presetFor('blog')!.create()} />
      {/* No `Ready for the future?` band: the post makes its own ask, in the article's CTA card. */}
      <SiteFooter cta={false} />
    </>
  )
}

const meta = {
  title: 'Built Pages/Assets to Web/Blog',
  parameters: {
    layout: 'fullscreen',
    /* `padding: 0`, so the canvas shows the page's own gutter and nothing else — see `Built Pages/Home/Home`. */
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'A blog post — `Solutions Library` -> `Blog` (node `24223:173039`), the page a card on `Built Pages/Assets to Web/Blog Hub` opens onto.',
          '',
          'The same page as the `Blog` preset in `Templates/Page Templates`, rendered from `presetFor(\'blog\')`: the blog’s own bar with a reading-progress line under the header, a byline hero, the outlined article with a sticky featured card, and Related Content.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole post. */
export const Page: Story = { render: () => <BlogPost /> }

/** The same post at a phone's width, where the outline goes and the featured card drops under the article. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <BlogPost />,
}
