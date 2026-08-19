// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=15121-237267
// source=src/index.ts
// component=Label
//
// Code Connect mapping for the Figma `Label CTA` component set (9 variants: Style x Size).
//
// The Style axis maps onto Mantine's variant names one for one:
//
//   Gradient -> variant="filled"
//   Tonal    -> variant="light"
//   Outline   -> variant="outline"
//
// Size is passed through, and carries the corner radius with it — Figma binds the radius to Size, so
// the generated snippet never needs a `radius` prop.
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('Style', {
  Gradient: 'filled',
  Tonal: 'light',
  Outline: 'outline',
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
  imports: ['import { Label } from "scratch"'],
  id: 'label',
  metadata: { nestable: true },
}
