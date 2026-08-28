// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7574-35260
// source=src/index.ts
// component=Header
//
// Code Connect mapping for the Figma `LRDC Primary Nav ` set — the bar itself.
//
// Its one axis is `Breakpoint`, and none of the four cells is a prop: the header is responsive, and the
// same component draws all four. Below 1200px it becomes the burger and the drawer on its own, which is
// what `Tablet 600+` and `Mobile 0+` are; the two 1200+ cells differ only in whether the bar's content
// is capped, and it is — `.headerInner` holds the file's 1280.
//
// `items`, `actions` and `drawerControls` are composed rather than drawn, so the snippet names the
// project's own nav rather than inventing one. `SITE_NAV_ITEMS` and `SITE_ACTIONS` are what both the
// templates and the component's stories render.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: every cell is the same responsive component. */
instance.getEnum('Breakpoint', {
  '1200+ Dyanmic Width': 'responsive',
  'Desktop 1200+': 'responsive',
  'Tablet 600+': 'responsive',
  'Mobile 0+': 'responsive',
})

export default {
  example: figma.code`
    <Header
      items={SITE_NAV_ITEMS}
      actions={SITE_ACTIONS}
      drawerControls={SITE_DRAWER_CONTROLS}
    />
  `,
  imports: ['import { Header } from "liferay-sites-design-system"'],
  id: 'header',
  metadata: { nestable: false },
}
