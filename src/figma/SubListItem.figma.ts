// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19660-53930
// source=src/index.ts
// component=List.Item
//
// Code Connect mapping for the Figma `Sub List Item` set — a row inside a `Sub List`.
//
// There is no `nested` prop to set: a `List` inside a `List.Item` becomes a sublist on its own, picking up
// the bullet marker, the 8px spacing, the 2px marker gap, the semibold title and the flush description that
// Figma changes all at once. So the snippet is a nested `List` and the nesting does the rest.
import figma from 'figma'

const instance = figma.selectedInstance

const hasTitle = instance.getBoolean('Show Header')
const hasDescription = instance.getBoolean('Show description')
const description = instance.getString('Description')

export default {
  example: figma.code`
    {/* inside a List.Item of the parent list */}
    <List>
      <List.Item ${hasTitle ? 'title="Key Point Sublist"' : ''}>
        ${hasDescription ? description : ''}
      </List.Item>
    </List>
  `,
  imports: ['import { List } from "liferay-sites-design-system"'],
  id: 'sub-list-item',
  metadata: { nestable: true },
}
