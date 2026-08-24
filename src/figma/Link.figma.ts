// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=2144-143689
// source=src/index.ts
// component=Link
//
// Code Connect mapping for the Figma `Link` component set (30 variants: Style x Size x State).
//
// Two things are translated rather than passed through. Figma names the styles Primary and Secondary,
// while the prop values follow the variation sheet's Default and Secondary. And Figma models the icons
// as two booleans plus two instance swaps — the same shape as Button — rather than the single
// Left/Right/None axis the sheet describes.
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('Style', {
  Primary: 'default',
  Secondary: 'secondary',
})

const size = instance.getEnum('Size', {
  Small: 'sm',
  Medium: 'md',
  Large: 'lg',
})

/**
 * Hover, Active and Visited are real CSS states in code, so only Disabled maps to a prop — and to
 * `aria-disabled`, since an anchor has no `disabled` attribute.
 */
const disabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Active: false,
  Visited: false,
  Disabled: true,
})

/** Figma toggles a separate underline layer; in code this is Mantine's `underline` prop. */
const underlined = instance.getBoolean('Underline')

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
    <Link
      href="#"
      variant="${variant}"
      size="${size}"
      ${underlined ? 'underline="always"' : ''}
      ${disabled ? 'aria-disabled="true"' : ''}
      ${iconLeftCode ? figma.code`leftSection={${iconLeftCode}}` : ''}
      ${iconRightCode ? figma.code`rightSection={${iconRightCode}}` : ''}
    >
      ${instance.getString('Text')}
    </Link>
  `,
  imports: ['import { Link } from "liferay-sites-design-system"'],
  id: 'link',
  metadata: { nestable: true },
}
