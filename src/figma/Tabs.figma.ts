// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=22570-34600
// source=src/index.ts
// component=Tabs
//
// Code Connect mapping for the Figma `Tabs Menu Logo` set — the underline tab bar, whose rule and active
// indicator sit on the top edge.
//
// It has two axes and neither reaches the snippet in the same way:
//
// - `Size` is responsive here rather than a prop, so Desktop and Mobile are the same code.
// - `Type` is Text or Logo. **Only Text is implemented.** `Type=Logo` puts customer logos in the tabs
//   instead of labels, and `Tabs.Tab` has no logo mode; the mapping says so rather than pretending.
//
// The tabs themselves are nested instances rather than a component property, so the labels cannot be read
// out of the file — the snippet carries the ones Figma draws for a developer to replace.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: Mobile is the same code, seen below 1200px. */
instance.getEnum('Size', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

/** `Logo` has no implementation; the snippet is the same and the comment above says why. */
instance.getEnum('Type', {
  Text: 'text',
  Logo: 'text',
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
