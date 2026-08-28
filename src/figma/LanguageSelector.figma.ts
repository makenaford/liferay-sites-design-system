// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7101-15275
// source=src/index.ts
// component=LanguagePicker
//
// Code Connect mapping for the Figma `Language Selector` set — the language control in the bar.
//
// A real `Select` underneath rather than a styled button, so it comes with the combobox keyboard
// behaviour and an accessible name. `State` is its only axis and all four cells are the same component:
// hover and active are drawn by the stylesheet.
//
// The caret is an override here. The picker's own default is the field's small filled caret, which is
// right inside a form field; in the bar it takes the nav's `IconDown`, so one arrow runs across the row.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: hover and active are CSS, not props. */
instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Active: 'default',
  'Active Hover': 'default',
})

export default {
  example: figma.code`
    <LanguagePicker
      aria-label="Language"
      defaultValue="en-US"
      data={[{ value: 'en-US', label: 'EN (US)' }, { value: 'fr-FR', label: 'Français' }]}
      rightSection={<IconDown />}
    />
  `,
  imports: [
    'import { LanguagePicker } from "liferay-sites-design-system"',
    'import { IconDown } from "liferay-sites-design-system"',
  ],
  id: 'language-selector',
  metadata: { nestable: true },
}
