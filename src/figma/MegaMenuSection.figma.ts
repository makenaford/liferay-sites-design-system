// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7638-20479
// source=src/index.ts
// component=MegaMenu.Column
//
// Code Connect mapping for the Figma `Section` set — a heading over a list of links inside a mega menu.
//
// Most of its axes are the file drawing more of the same thing rather than configuring one thing. The
// `Column 2/3/4` and `Row 2/3/4` booleans add columns and rows to the frame; in code those are more
// `MegaMenu.Column` children and more `MegaMenu.Item`s, so they cannot be attributes here. The snippet
// grows with them instead, which is what a developer actually writes.
//
// `Featured BG` and `Line Featured` are the rail's gradient and its dividing rule — `MegaMenu.Featured`
// carries both, so a section with them on is that component rather than this one.
import figma from 'figma'

const instance = figma.selectedInstance

const heading = instance.getString('Section Title')
const featured = instance.getBoolean('Featured BG')

/** Read to be explicit that it is deliberately unused: the rule comes with the rail, not separately. */
instance.getBoolean('Line Featured')

const columns = [
  true,
  instance.getBoolean('Column 2'),
  instance.getBoolean('Column 3'),
  instance.getBoolean('Column 4'),
].filter(Boolean).length

/** Read to be explicit that it is deliberately unused: the column grid collapses on its own. */
instance.getEnum('Breakpoint', {
  Desktop: 'responsive',
  Tablet: 'responsive',
  Mobile: 'responsive',
})

const column = figma.code`
      <MegaMenu.Column heading="${heading}">
        <MegaMenu.Item href="#" title="…" description="…" />
      </MegaMenu.Column>`

export default {
  example: featured
    ? figma.code`
    <MegaMenu.Featured heading="${heading}">
      <MegaMenu.FeaturedCard href="#" title="…" description="…" />
    </MegaMenu.Featured>
  `
    : figma.code`
    <MegaMenu.Columns>${column}${columns > 1 ? column : ''}${columns > 2 ? column : ''}${
        columns > 3 ? column : ''
      }
    </MegaMenu.Columns>
  `,
  imports: ['import { MegaMenu } from "liferay-sites-design-system"'],
  id: 'mega-menu-section',
  metadata: { nestable: false },
}
