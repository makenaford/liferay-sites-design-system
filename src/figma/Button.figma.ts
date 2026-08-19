// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16123-189647
// source=src/index.ts
// component=Button
//
// Code Connect mapping for the Figma `Button` component set. With this published, selecting a
// Button in Figma's Dev Mode shows this library's real code instead of generated CSS.
//
// Figma's Color and Style axes are collapsed into Mantine's single `variant` prop, so the mapping
// reads both and combines them:
//
//   Primary + Solid   -> variant="filled"
//   Primary + Outline -> variant="outline"
//   Primary + Rounded -> variant="rounded"
//   Neutral + Solid   -> variant="neutral"
import figma from 'figma'

const instance = figma.selectedInstance

const isNeutral = instance.getEnum('Color', {
  Primary: false,
  Neutral: true,
})

const styleVariant = instance.getEnum('Style', {
  Solid: 'filled',
  Outline: 'outline',
  Rounded: 'rounded',
})

/** Color=Neutral only exists with Style=Solid, so it simply replaces the solid variant. */
const variant = isNeutral ? 'neutral' : styleVariant

const size = instance.getEnum('Size', {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
})

/** Hover, Focus and Pressed are real CSS states in code, so only Disabled maps to a prop. */
const disabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Focus: false,
  Pressed: false,
  Disabled: true,
})

const hasIconLeft = instance.getBoolean('Icon Left')
const iconLeft = hasIconLeft ? instance.getInstanceSwap('↳ Icon Left') : null
let iconLeftCode
if (iconLeft && iconLeft.type === 'INSTANCE') {
  iconLeftCode = iconLeft.executeTemplate().example
}

const hasIconRight = instance.getBoolean('Icon Right')
const iconRight = hasIconRight ? instance.getInstanceSwap('↳ Icon Right') : null
let iconRightCode
if (iconRight && iconRight.type === 'INSTANCE') {
  iconRightCode = iconRight.executeTemplate().example
}

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      size="${size}"
      ${disabled ? 'disabled' : ''}
      ${iconLeftCode ? figma.code`leftSection={${iconLeftCode}}` : ''}
      ${iconRightCode ? figma.code`rightSection={${iconRightCode}}` : ''}
    >
      Button
    </Button>
  `,
  imports: ['import { Button } from "scratch"'],
  id: 'button',
  metadata: { nestable: true },
}
