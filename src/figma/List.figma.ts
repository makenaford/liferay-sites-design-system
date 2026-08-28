// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19130-63824
// source=src/index.ts
// component=List
//
// Code Connect mapping for the Figma `List` set.
//
// `Type` is its only axis. Note that its `Icon` cell renders `system/check` — the marker is an icon slot
// with a check in it — so it maps to `marker="check"`, and the `Icon Type` instance swap on the marker is
// the `icon` prop. The items themselves are nested `Main List Item` instances rather than a component
// property, so their text cannot be read out of the file; the snippet carries what Figma draws.
import figma from 'figma'

const instance = figma.selectedInstance

const marker = instance.getEnum('Type', {
  Icon: 'check',
  Number: 'number',
  Bullet: 'bullet',
})

export default {
  example: figma.code`
    <List marker="${marker}">
      <List.Item title="Key Point Main List">Short description here</List.Item>
      <List.Item title="Key Point Main List">Short description here</List.Item>
      <List.Item title="Key Point Main List">Short description here</List.Item>
    </List>
  `,
  imports: ['import { List } from "liferay-sites-design-system"'],
  id: 'list',
  metadata: { nestable: false },
}
