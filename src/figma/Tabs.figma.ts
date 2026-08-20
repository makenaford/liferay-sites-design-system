// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=22570-34600
// source=src/index.ts
// component=Tabs
//
// Code Connect mapping for the Figma `Tabs Menu Bottom` set.
//
// Its only axis is `Size`, and that does not reach the snippet: the implementation switches treatment
// on a media query at 1200px rather than taking a size prop, so both cells are the same code. The tabs
// themselves are nested `Tab Element` instances rather than a component property, so the labels cannot
// be read out of the file — the snippet carries the ones Figma draws for a developer to replace.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: Mobile is the same code, seen below 1200px. */
instance.getEnum('Size', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

export default {
  example: figma.code`
    <Tabs defaultValue="websites">
      <Tabs.List>
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
  id: 'tabs',
  metadata: { nestable: false },
}
