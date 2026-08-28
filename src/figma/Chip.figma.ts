// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16858-51126
// source=src/index.ts
// component=Chip
//
// Code Connect mapping for the Figma `Chip` set.
//
// Three of the five `State` cells are not props, because they are real states: `Focused` is
// `:focus-visible`, `Disabled` is `:disabled`, and `Default` is the resting pill. That leaves `Selected`
// (the checkbox) and `Dragged` (a hook for whatever is doing the dragging — a chip cannot know it is
// being reordered).
//
// Both icon slots are read. The `Left Icon` / `Right Icon` booleans say whether a slot is filled, and
// `↳ Left Icon` / `↳ Right Icon` are instance swaps onto the `UI Icon` set — so the snippet names the
// glyph the designer actually chose rather than assuming one. The older mapping in the sibling
// `solutions-design-system` repo read only `Label` and `State`, so a chip with icons produced a snippet
// without them.
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('Label')

const checked = instance.getEnum('State', {
  Default: false,
  Selected: true,
  Focused: false,
  Disabled: false,
  Dragged: false,
})

const disabled = instance.getEnum('State', {
  Default: false,
  Selected: false,
  Focused: false,
  Disabled: true,
  Dragged: false,
})

const dragging = instance.getEnum('State', {
  Default: false,
  Selected: false,
  Focused: false,
  Disabled: false,
  Dragged: true,
})

/*
 * The swaps resolve to the chosen `UI Icon`. `getInstanceSwap` hands back an `ErrorHandle` when the
 * slot is off, so each is gated on its own boolean rather than on the handle being truthy.
 */
const leftIcon = instance.getBoolean('Left Icon')
  ? instance.getInstanceSwap('↳ Left Icon')
  : undefined
const rightIcon = instance.getBoolean('Right Icon')
  ? instance.getInstanceSwap('↳ Right Icon')
  : undefined

export default {
  example: figma.code`
    <Chip
      ${checked ? 'defaultChecked' : ''}
      ${disabled ? 'disabled' : ''}
      ${dragging ? 'dragging' : ''}
      ${leftIcon ? figma.code`leftSection={${leftIcon}}` : ''}
      ${rightIcon ? figma.code`rightSection={${rightIcon}}` : ''}
    >
      ${label}
    </Chip>
  `,
  imports: ['import { Chip } from "liferay-sites-design-system"'],
  id: 'chip',
  metadata: { nestable: true },
}
