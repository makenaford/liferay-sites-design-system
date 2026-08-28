// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=15121-237366
// source=src/index.ts
// component=Stat
//
// Code Connect mapping for the Figma `Stats Item` set. Both icon slots are booleans plus a swapped
// instance, the same shape Button and Link use.
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Property 1', {
  Default: 'md',
  Small: 'sm',
})

const hasIconLeft = instance.getBoolean('Show Stat Icon Left')
const iconLeft = hasIconLeft ? instance.getInstanceSwap('Stat Icon') : null
let iconLeftCode
if (iconLeft && iconLeft.type === 'INSTANCE') {
  iconLeftCode = iconLeft.executeTemplate().example
}

const hasIconRight = instance.getBoolean('Show Stat Icon Right')

export default {
  example: figma.code`
    <Stat
      size="${size}"
      value="${instance.getString('Value')}"
      label="${instance.getString('Label')}"
      ${iconLeftCode ? figma.code`leftSection={${iconLeftCode}}` : ''}
      ${hasIconRight ? 'rightSection={<IconArrowUp />}' : ''}
    />
  `,
  imports: ['import { Stat } from "liferay-sites-design-system"'],
  id: 'stat',
  metadata: { nestable: true },
}
