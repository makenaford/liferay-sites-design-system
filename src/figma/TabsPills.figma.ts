// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17900-62310
// source=src/index.ts
// component=Tabs
//
// Code Connect mapping for the Figma `Tabs Pill Menu` set — the second of the two tab bars in the file,
// and the one that used to be mapped as a separate `SegmentedControl`. It is `Tabs variant="pills"` now.
//
// `Sizes` does not reach the snippet: the Mobile cell is a container query on the bar's own width rather
// than a prop, so both cells are the same code.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: Mobile is the same code at a narrower width. */
instance.getEnum('Sizes', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

export default {
  example: figma.code`
    <Tabs variant="pills" defaultValue="websites">
      <Tabs.List grow>
        <Tabs.Tab value="websites">Enterprise Websites</Tabs.Tab>
        <Tabs.Tab value="commerce">Digital Commerce</Tabs.Tab>
        <Tabs.Tab value="portals">Customer Portals</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="websites">{/* … */}</Tabs.Panel>
      <Tabs.Panel value="commerce">{/* … */}</Tabs.Panel>
      <Tabs.Panel value="portals">{/* … */}</Tabs.Panel>
    </Tabs>
  `,
  imports: ['import { Tabs } from "scratch"'],
  id: 'tabs-pills',
  metadata: { nestable: false },
}
