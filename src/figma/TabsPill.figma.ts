// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=20517-21553
// source=src/index.ts
// component=Tabs.Tab
//
// Code Connect mapping for the Figma `Tabs Pill` set — one pill inside a `Tabs Pill Menu`. Marked
// nestable, so selecting a pill inside the bar gives the tab rather than the whole menu.
//
// `State` does not map to a prop. Selected is `value` on the parent `Tabs`, and Hover is a real CSS state.
// `Size` is the container query on the bar, not a prop on the tab.
import figma from 'figma'

const instance = figma.selectedInstance

const hasIcon = instance.getBoolean('Show Icon Left')
const icon = hasIcon ? instance.getInstanceSwap('Icon') : null

let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

/** `Show numbers` has no counterpart: a numbered pill is not implemented. */
instance.getBoolean('Show numbers')

export default {
  example: hasIcon
    ? figma.code`<Tabs.Tab value="websites" leftSection={${iconCode}}>Enterprise Websites</Tabs.Tab>`
    : figma.code`<Tabs.Tab value="websites">Enterprise Websites</Tabs.Tab>`,
  imports: ['import { Tabs } from "scratch"'],
  id: 'tabs-pill',
  metadata: { nestable: true },
}
