// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19660-37508
// source=src/index.ts
// component=List.Item
//
// Code Connect mapping for the Figma `Main List Item` set.
//
// Two of its axes belong to the list rather than the row in this implementation: `Size` moves the marker
// and `Padding` brings the grey surface, and Figma draws both the same way for every row in a list — so
// they are `List` props and appear here as the enclosing element rather than as attributes on the item.
// `Type` has one option (`Main Item`) and maps to nothing.
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  Default: 'md',
  Medium: 'lg',
})

const padded = instance.getEnum('Padding', { Yes: true, No: false })
const hasHeader = instance.getBoolean('Show Header')
const hasDescription = instance.getBoolean('Show description')
const description = instance.getString('Description')

export default {
  example: figma.code`
    <List size="${size}" padded={${padded}}>
      <List.Item ${hasHeader ? 'title="Key Point Main List"' : ''}>
        ${hasDescription ? description : ''}
      </List.Item>
    </List>
  `,
  imports: ['import { List } from "liferay-sites-design-system"'],
  id: 'list-item',
  metadata: { nestable: false },
}
