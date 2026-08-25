// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=15121-237267
// source=src/index.ts
// component=Label
//
// Code Connect mapping for the Figma `Label CTA` component set (9 variants: Style x Size).
//
// **The set was restyled.** `Style` used to be Gradient / Tonal / Outline; it is now Filled / Glass /
// Gradient, and this mapping produced snippets for cells that no longer exist. Two of the three
// survived under new names — Tonal's flat fill is `filled`, Outline's gradient stroke is `gradient` —
// while the old Gradient *background* has no cell any more and `Glass` is new:
//
//   Filled   -> variant="filled"
//   Glass    -> variant="glass"
//   Gradient -> variant="gradient"
//
// Size is passed through, and carries the corner radius with it — Figma binds the radius to Size, so
// the generated snippet never needs a `radius` prop.
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('Style', {
  Filled: 'filled',
  Glass: 'glass',
  Gradient: 'gradient',
})

const size = instance.getEnum('Size', {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
})

/** Figma models the icon as a boolean plus an instance swap; in code it is the `leftSection` slot. */
const hasIcon = instance.getBoolean('Show Icon')
const icon = hasIcon ? instance.getInstanceSwap('Instance') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`
    <Label
      variant="${variant}"
      size="${size}"
      ${iconCode ? figma.code`leftSection={${iconCode}}` : ''}
    >
      ${instance.getString('Text')}
    </Label>
  `,
  imports: ['import { Label } from "liferay-sites-design-system"'],
  id: 'label',
  metadata: { nestable: true },
}
