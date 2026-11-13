import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionBlock } from './PageRenderer'
import type { CardSpec, PageSpec, SectionSpec } from './page-schema'
import { presetFor } from './page-presets'
import { BLOG_CATEGORY_PAGE } from './blog-category-page'
import { BLOG_HUB_PAGE } from './blog-hub-page'
import { OEM_PARTNER_PAGE } from './oem-partner-page'
import { PARTNER_HOME_PAGE } from './partner-home-page'
import { SOLUTIONS_HUB_PAGE } from './solutions-hub-page'
import { TECHNOLOGY_PARTNER_PAGE } from './technology-partner-page'

/*
 * Every card type a built page or a page template actually draws — found by scanning the rendered pages, not
 * by reading the Figma set — and each one is the page's own section, taken out of the page's own data and
 * rendered by the same `SectionBlock` the page uses. Nothing here restates a card's props, so a story cannot
 * drift from the page it was taken from: change a card on the page and it changes here.
 *
 * A finder that comes back empty throws, on purpose. If a page stops drawing a card type, its story should
 * fail rather than quietly show something else.
 */

type Section<T extends SectionSpec['type']> = Extract<SectionSpec, { type: T }>

function find<T extends SectionSpec['type']>(
  page: PageSpec,
  type: T,
  where: (section: Section<T>) => boolean = () => true,
): Section<T> {
  const section = page.sections.find((s): s is Section<T> => s.type === type && where(s as Section<T>))
  if (!section) throw new Error(`No ${type} section matches on this page — has the card type moved?`)
  return section
}

function preset(id: string): PageSpec {
  const found = presetFor(id)
  if (!found) throw new Error(`No page template "${id}"`)
  return found.create()
}

/** Every card in a card grid, whether it lists them, tabs them or groups them. */
function cardsOf(section: Section<'cardGrid'>): CardSpec[] {
  return section.cards ?? section.tabs?.flatMap((tab) => tab.content) ?? section.groups?.flatMap((g) => g.cards) ?? []
}

/** The first `n` of whatever the section lists — a type needs one row, not the page's whole set. */
function trim<S extends SectionSpec>(section: S, n = 3): S {
  const s = { ...section } as Record<string, unknown>
  for (const key of ['cards', 'posts', 'stories', 'links']) {
    if (Array.isArray(s[key])) s[key] = (s[key] as unknown[]).slice(0, n)
  }
  if (Array.isArray(s.tabs)) s.tabs = (s.tabs as { content: unknown[] }[]).map((t) => ({ ...t, content: t.content.slice(0, n) }))
  if (Array.isArray(s.groups)) s.groups = (s.groups as { cards: unknown[] }[]).slice(0, 1).map((g) => ({ ...g, cards: g.cards.slice(0, n) }))
  return s as S
}

const meta = {
  title: 'Components/Card Types',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true, padding: 0 },
    docs: {
      description: {
        component: [
          'The card types the built pages and page templates **actually use** — one story per type, each the real section from the page named in its description, rendered from that page’s own data. For the `Card` props underneath them, see `Components/Card`.',
          '',
          'Ten types cover every card on the pages. The old Figma `Common Cards` set has seventeen; the seven it has and the pages do not (`CS-Stat`, `Stat Highlight`, `Icon with Link`, the padded `Blog`, …) are not here because nothing draws them.',
          '',
          'Two things on the pages are built from `Card` but are not cards, and are not here either: the Home hero’s solution-finder bar (`radius="pill"`) and the 64px vendor logo tiles. Both are containers that never link.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const show = (section: SectionSpec) => () => <SectionBlock section={section} />

/**
 * **Blog card** — `surface="none"`, `padding="none"`, the picture leading, small-caps topics over the title
 * and the byline at the foot. Figma `Blog- no padding` / `Blog Category`.
 *
 * Used on: Blog Category, Blog Hub (featured and recent grids).
 */
export const Blog: Story = {
  render: show(trim(find(BLOG_CATEGORY_PAGE, 'blogGrid'))),
}

/**
 * **Blog card, horizontal** — the same card as a row: the picture leading, the text beside it.
 *
 * Used on: Blog Hub (`Most Recent`).
 */
export const BlogHorizontal: Story = {
  render: show(trim(find(BLOG_HUB_PAGE, 'blogGrid', (s) => s.align === 'horizontal'), 4)),
}

/**
 * **Resource card** — `surface="none"`, `padding="none"`, a 3:2 picture with its hairline, a gradient
 * `Label` as the hero and a title. Hovers on the picture, not the card. Figma `Resource`.
 *
 * Used on: Home (`Trending Now`), Solutions Hub, Blog, Customer Story.
 */
export const Resource: Story = {
  render: show(trim(find(SOLUTIONS_HUB_PAGE, 'resourceGrid'))),
}

/**
 * **Icon card** — glass, a link: a 40px glass icon, a title and a line. Figma `Icon-Left`.
 *
 * Used on: Industry, Product detail, Solution detail templates; Partner Home.
 */
export const Icon: Story = {
  render: show(
    trim(find(preset('product'), 'cardGrid', (s) => cardsOf(s).some((c) => c.icon && c.href && !c.image))),
  ),
}

/**
 * **Icon card, not a link** — the same card as content only, so it is `static`: no glass, no hover.
 *
 * Used on: OEM Partner, Technology Partner, Solution detail.
 */
export const IconPanel: Story = {
  render: show(
    trim(find(TECHNOLOGY_PARTNER_PAGE, 'cardGrid', (s) => s.cardSet === 'partner' && !s.cardHeader), 4),
  ),
}

/**
 * **Icon card, centred** — glass, a link, `headerAlign="center"`: a 48px icon over a title, no line.
 * Figma `Icon-Center`.
 *
 * Used on: OEM Partner, Solution Partner, Technology Partner.
 */
export const IconCentered: Story = {
  render: show(trim(find(OEM_PARTNER_PAGE, 'cardGrid', (s) => s.cardHeader === 'center'), 4)),
}

/**
 * **Customer quote** — glass and never a link: the customer's picture, a `Stat`, the quote, and who said
 * it. Figma `CS- Quote`. One treatment wherever a customer is quoted.
 *
 * Used on: Home, Solutions Hub, the story catalog, and the Landing, Industry and Solution templates.
 */
export const CustomerQuote: Story = {
  render: show(trim(find(SOLUTIONS_HUB_PAGE, 'customerStories'))),
}

/**
 * **Partner quote** — the customer quote with no figure: the picture, the quote, who said it. Figma
 * `Quote 2`.
 *
 * Used on: Partner Home, Solution Partner.
 */
export const PartnerQuote: Story = {
  render: show(find(PARTNER_HOME_PAGE, 'customerStories')),
}

/**
 * **Image card** — glass, a link, `padding="content"`: the picture to the card's edges and only the text
 * inset. Sometimes a `Label` hero or a line under the title. Figma `Image Generic`.
 *
 * Used on: Home (`Audience Specific Goals`), Product detail, Solution detail.
 */
export const Image: Story = {
  render: show(trim(find(preset('solution'), 'cardGrid', (s) => cardsOf(s).some((c) => c.image && !c.icon)))),
}

/**
 * **Story card** — the image card with the customer's result at its foot, under a rule.
 *
 * Used on: the story catalog (`All Stories`).
 */
export const CustomerStory: Story = {
  render: show(trim(find(preset('catalog'), 'storyCatalog'))),
}

/**
 * **Tag card** — glass, a link: a gradient `Label` over a title, and nothing else (or one line).
 *
 * Used on: Home (`Our Latest Research & Data`), Solution detail.
 */
export const Tag: Story = {
  render: show(trim(find(preset('solution'), 'cardGrid', (s) => cardsOf(s).some((c) => c.tag && !c.image)))),
}

/**
 * **Solution card, Portal** — glass: a 48px icon, a title and a line, a checked list, a figure at the foot.
 * Figma `Portal`.
 *
 * Used on: Solutions Hub.
 */
export const SolutionPortal: Story = {
  render: show(trim(find(SOLUTIONS_HUB_PAGE, 'cardGrid', (s) => cardsOf(s).some((c) => c.points?.length)))),
}

/**
 * **Solution card, Industry** — glass: the picture inset, a 48px icon, a title and a line, two links, and
 * a row of figures. Figma `Industry`.
 *
 * Used on: Solutions Hub.
 */
export const SolutionIndustry: Story = {
  render: show(trim(find(SOLUTIONS_HUB_PAGE, 'cardGrid', (s) => cardsOf(s).some((c) => c.links?.length)))),
}

/**
 * **Quick link** — glass, a link: an icon and a title on one line. Figma `Quick Link`.
 *
 * Used on: Product detail.
 */
export const QuickLink: Story = {
  render: show(find(preset('product'), 'quickLinks')),
}

/**
 * **Highlight** — `surface="highlighted"`: the one card that matters more, never a link. A 40px icon, a
 * heading, a line and an action.
 *
 * Used on: Product detail, Solution detail.
 */
export const Highlight: Story = {
  render: show(find(preset('solution'), 'highlightText')),
}

/**
 * **Full card** — `align="horizontal"`, `titleSize="full"`: a 48px icon, a 32px title, links, figures, and
 * the picture closing the row. Figma `card-main` `Align=Horizontal`.
 *
 * Used on: the Industry template.
 */
export const Full: Story = {
  render: show(find(preset('industry'), 'fullCard')),
}
