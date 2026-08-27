// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7101-15225
// source=src/index.ts
// component=Link
//
// Code Connect mapping for the Figma `Utility Link` set — the small links at the right of the bar.
//
// It is a `Link` with sections, not a component of its own. The header states their size for the row it
// owns: the file draws them at 16px, level with the sections beside them, and the link scale is
// 14 / 18 / 21 — so `size` is the nearest, and `.headerActions` brings it to 16.
//
// `Avatar` has no code equivalent. The set can draw a signed-in avatar in place of the glyph, and this
// library has no avatar; the mapping omits it rather than emitting a prop that does not exist.
import figma from 'figma'

const instance = figma.selectedInstance

const hasIcon = instance.getBoolean('Icon')
const hasText = instance.getBoolean('Text')

/** Read to be explicit that it is deliberately unused: there is no avatar in this library. */
instance.getBoolean('Avatar')

/** Read to be explicit that it is deliberately unused: hover and active are CSS, not props. */
instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Active: 'default',
  'Active Hover': 'default',
})

export default {
  example: figma.code`
    <Link href="#" size="md" ${hasIcon ? 'leftSection={<IconUser1Filled />}' : ''} rightSection={<IconDown />}>
      ${hasText ? 'Log In' : ''}
    </Link>
  `,
  imports: [
    'import { Link } from "liferay-sites-design-system"',
    'import { IconDown, IconUser1Filled } from "liferay-sites-design-system"',
  ],
  id: 'utility-link',
  metadata: { nestable: true },
}
