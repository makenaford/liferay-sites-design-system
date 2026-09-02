import type { CapabilityCluster } from '../components/CapabilityMap'
import {
  IconGlassAiHub,
  IconGlassAnalytics,
  IconGlassCloudNativeExperience,
  IconGlassCommerce,
  IconGlassContentManagement,
  IconGlassContentMarketingPlatform,
  IconGlassContentPerformance,
  IconGlassDigitalSalesRooms,
  IconGlassIntegration,
  IconGlassLiferayDataPlatform,
  IconGlassLowCode,
  IconGlassPIM,
  IconGlassPersonalization,
  IconGlassPremiumSecurity,
  IconGlassSearch,
  IconGlassSites,
} from '../icons'

/**
 * The sixteen products, clockwise from the top left, each cluster read top → left → right → bottom.
 *
 * Every icon is the product's own from `assets/glass-icons` — `Commerce/PIM`, `General/ai`,
 * `General/Liferay Data Platform` and so on — rather than a UI glyph standing in for it. SEO Studio is
 * the one product with no icon of its own in the set, and borrows
 * `Product Modules/Content Performance/CDN`, since content performance is what it is for. The design
 * draws a magnifier with sparkles there; that icon does not exist yet, and is worth asking for.
 *
 * It lives here rather than in a story because two places draw it: the Home template's *Everything You
 * Need in One Platform* band, and `CapabilityMap`'s own stories. Sixteen products in two files is
 * sixteen chances for them to disagree about what Liferay sells.
 */
/**
 * How tall the product map may be on a page.
 *
 * Sized by its column alone the figure is taller than the window it is read in, so the reader meets it a
 * third at a time and never sees the shape the drawing is about. This spends the window's height
 * instead: `100svh` less the section's own furniture — 120px of block padding at each end, the 40px gap
 * under the title, and the title itself — and `CapabilityMap` turns what is left into a width.
 *
 * `svh` rather than `vh`, so a phone whose address bar is showing does not get a figure sized for the
 * window it will have *after* the bar retracts.
 *
 * ## Why the floor is low, and why that is the point
 *
 * The page draws `names="outside"`, whose canvas is 8.2 x 4.5 tiles — about 2:1, wider than any window.
 * That is what makes **height** the binding dimension at every ordinary width, and it is the whole
 * reason this arrangement answers the window at all: the figure gets shorter when the window does,
 * rather than sitting at a fixed size and being scrolled past.
 *
 * So the floor is deliberately modest. 860 — the number the nested arrangement wanted, being a 167px
 * card worked back through its taller canvas — would put this figure wider than any window and stop the
 * height from ever binding, which is the opposite of what it is for. 520 keeps a card readable on a
 * short window and otherwise gets out of the way.
 *
 * A 1440 x 900 window draws about a 122px card; a 1440 x 1080 one about 152, where the page's own width
 * takes over as the limit.
 */
export const PRODUCT_MAP_MAX_HEIGHT = 'max(520px, 100svh - 320px)'

export const PRODUCT_CLUSTERS: CapabilityCluster[] = [
  {
    label: 'Commerce & Sales',
    items: [
      { label: 'PIM', icon: <IconGlassPIM />, href: '#pim', description: 'Product Information Management' },
      {
        /*
         * A soft hyphen, because `hyphens: auto` cannot be relied on.
         *
         * `Personalization` is the one product name too long for a hexagon once the figure is fitted to
         * a window, and the stylesheet's `hyphens: auto` is supposed to break it with a hyphen. It does
         * not always: Chromium ships its hyphenation dictionaries through the component updater, and a
         * build that has not received them — an embedded browser, a fresh container — finds no
         * hyphenation opportunity and falls through to `overflow-wrap: break-word`, which breaks the
         * word with no hyphen at all. `Personaliza / tion`.
         *
         * `\u00AD` puts the break where the dictionary would have: it draws a hyphen when the word
         * wraps there and nothing at all when it does not. `description` then carries the unbroken name,
         * which the tile uses as its `aria-label`, so what is announced has no soft hyphen in it.
         */
        label: 'Personali\u00ADzation',
        description: 'Personalization',
        icon: <IconGlassPersonalization />,
        href: '#personalization',
      },
      { label: 'DSR', icon: <IconGlassDigitalSalesRooms />, href: '#dsr', description: 'Digital Sales Rooms' },
      { label: 'Commerce', icon: <IconGlassCommerce />, href: '#commerce' },
    ],
  },
  {
    label: 'Content & Experience',
    items: [
      { label: 'Sites', icon: <IconGlassSites />, href: '#sites' },
      { label: 'CMS', icon: <IconGlassContentManagement />, href: '#cms', description: 'Content Management System' },
      {
        label: 'CMP',
        icon: <IconGlassContentMarketingPlatform />,
        href: '#cmp',
        description: 'Content Marketing Platform',
      },
      { label: 'SEO Studio', icon: <IconGlassContentPerformance />, href: '#seo-studio' },
    ],
  },
  {
    /*
     * The one section name with an explicit break in it.
     *
     * The other three run out of room and wrap after the ampersand on their own; `Intelligence & AI` is
     * short enough to sit on one line, and one label a line shorter than the three beside it reads as an
     * oversight rather than as a fit. The break is here rather than in the component because it is a fact
     * about *this* set of names — a different four might all fit, or none of them.
     */
    label: 'Intelligence &\nAI',
    items: [
      { label: 'LDP', icon: <IconGlassLiferayDataPlatform />, href: '#ldp', description: 'Liferay Data Platform' },
      { label: 'AI Hub', icon: <IconGlassAiHub />, href: '#ai-hub' },
      { label: 'Search', icon: <IconGlassSearch />, href: '#search' },
      { label: 'Analytics', icon: <IconGlassAnalytics />, href: '#analytics' },
    ],
  },
  {
    label: 'Platform & Infrastructure',
    items: [
      { label: 'Cloud Native', icon: <IconGlassCloudNativeExperience />, href: '#cloud-native' },
      { label: 'Security', icon: <IconGlassPremiumSecurity />, href: '#security' },
      { label: 'Low-Code', icon: <IconGlassLowCode />, href: '#low-code' },
      { label: 'Integration', icon: <IconGlassIntegration />, href: '#integration' },
    ],
  },
]
