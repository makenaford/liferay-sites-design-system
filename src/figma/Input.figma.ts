// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16166-23969
// source=src/index.ts
// component=TextInput
//
// Code Connect mapping for the Figma `Input` set. Its `Type` axis picks the component rather than a
// prop — a text field, a multi-line field and a select are three different elements — so the mapping
// emits `TextInput`, `Textarea` or `Select` accordingly.
//
// `State` and `Filled` do not appear in the snippet: Active is focus and Filled is having a value, both
// of which are runtime states rather than props.
import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Text: 'TextInput',
  'Text Area': 'Textarea',
  Dropdown: 'Select',
})

/** `Condensed=True` is the floating label; False puts the label above the box. */
const floating = instance.getEnum('Condensed', { True: true, False: false })

const hasLabel = instance.getBoolean('Label')
const required = instance.getBoolean('Required')
const hasHelp = instance.getBoolean('Help Text')
const hasInfo = instance.getBoolean('Info Button')
const hasCountry = instance.getBoolean('Country Selector')

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
    <${type}
      ${hasLabel ? figma.code`label="${instance.getString('Label Text')}"` : ''}
      placeholder="${instance.getString('Placeholder Text')}"
      ${required ? 'required' : ''}
      ${hasHelp ? 'description="This is the description area"' : ''}
      ${floating ? 'floating' : ''}
      ${hasInfo ? 'info="What this field is for."' : ''}
      ${hasCountry ? 'leftSection={<LanguagePicker data={languages} />} leftSectionWidth={86} leftSectionPointerEvents="auto"' : ''}
      ${iconLeftCode ? figma.code`leftSection={${iconLeftCode}}` : ''}
      ${iconRightCode ? figma.code`rightSection={${iconRightCode}}` : ''}
    />
  `,
  imports: ['import { LanguagePicker, Select, Textarea, TextInput } from "scratch"'],
  id: 'input',
  metadata: { nestable: true },
}
