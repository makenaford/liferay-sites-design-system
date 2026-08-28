// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7638-20265
// source=src/index.ts
// component=MegaMenu.Item
//
// Code Connect mapping for the Figma `Text Nav Item` set — one row of a mega menu.
//
// `Type` decides which component it is, not which prop:
//
// - `Text`, `Product Icon`, `Lexion Icon` and `Illustrative Icon` are all `MegaMenu.Item`. They differ
//   only in which icon set the glyph comes from, and the glyph arrives through `icon` either way.
// - `Image` is the featured rail's card, which is `MegaMenu.FeaturedCard` — a thumbnail over its text,
//   with its own title and description properties in the file.
//
// `State` is drawn by the stylesheet: `Hover` is the fill and the blue title, `Current` the page you are
// on. Neither is a prop, and inventing one would be worse than saying so.
import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('Nav item header')
const description = instance.getString('Description Item')
const hasDescription = instance.getBoolean('Description')

const contentTitle = instance.getString('Content Title')
const contentDescription = instance.getString('Content Description')
const hasImage = instance.getBoolean('Show Image')

const type = instance.getEnum('Type', {
  Text: 'item',
  Image: 'card',
  'Product Icon': 'item',
  'Lexion Icon': 'item',
  'Illustrative Icon': 'item',
})

/** Read to be explicit that it is deliberately unused: hover and current are CSS, not props. */
instance.getEnum('State', { Default: 'default', Current: 'default', Hover: 'default' })

/** Read to be explicit that it is deliberately unused: the row is the same at every width. */
instance.getEnum('Breakpoint', { Desktop: 'responsive', Mobile: 'responsive' })

const navIcon = instance.getInstanceSwap('Nav Icon')
let iconCode
if (navIcon && navIcon.type === 'INSTANCE') {
  iconCode = navIcon.executeTemplate().example
}

export default {
  example:
    type === 'card'
      ? figma.code`
    <MegaMenu.FeaturedCard
      href="#"
      ${hasImage ? 'thumbnail={<img src="…" alt="" />}' : ''}
      title="${contentTitle}"
      ${hasDescription ? figma.code`description="${contentDescription}"` : ''}
    />
  `
      : figma.code`
    <MegaMenu.Item
      href="#"
      ${iconCode ? figma.code`icon={${iconCode}}` : ''}
      title="${title}"
      ${hasDescription ? figma.code`description="${description}"` : ''}
    />
  `,
  imports: ['import { MegaMenu } from "liferay-sites-design-system"'],
  id: 'mega-menu-item',
  metadata: { nestable: true },
}
