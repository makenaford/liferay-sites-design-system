// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7101-15143
// source=src/index.ts
// component=Header
//
// Code Connect mapping for the Figma `Mega Menu Nav Item` set — one section in the bar.
//
// There is no component for it: a section is an entry in `Header`'s `items`, and the header draws the
// button, the caret and the panel from that. So the snippet is the entry, not an element — which is the
// honest answer to "how do I add Platform to the nav".
//
// `State` is where that shows. `Expanded` is not a prop on the item either: it is `Header`'s open state,
// one at a time across the whole bar, so the cell maps to `defaultOpen` on the header rather than to
// anything here. `Hover` and `Current` are drawn by the stylesheet.
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('Nav Item Text')

const open = instance.getEnum('State', {
  Default: false,
  Current: false,
  Hover: false,
  'Expanded Hover': true,
  Expanded: true,
})

/** Read to be explicit that it is deliberately unused: the bar is responsive, not three components. */
instance.getEnum('Breakpoint', {
  Desktop: 'responsive',
  Tablet: 'responsive',
  Mobile: 'responsive',
})

export default {
  example: figma.code`
    const items = [
      { value: '${label}', label: '${label}', menu: <MegaMenu>{/* … */}</MegaMenu> },
    ]

    <Header items={items}${open ? figma.code` defaultOpen="${label}"` : ''} />
  `,
  imports: ['import { Header, MegaMenu } from "liferay-sites-design-system"'],
  id: 'header-nav-item',
  metadata: { nestable: false },
}
