// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17019-127517
// source=src/index.ts
// component=Accordion
//
// Code Connect mapping for the Figma `Accordion` set.
//
// **Neither axis is read off the instance, and that is not a choice.** The set is in an error state:
// two of its four variants are both named `Expand=Closed, Size=Condensed`, so Figma refuses to resolve
// its property definitions — `componentPropertyDefinitions` and `variantProperties` both throw
// `Component set has existing errors`. `getEnum` has nothing to read until the duplicate is renamed,
// which is recorded in README.md. Once it is, `Size` can map to `size` here directly.
//
// `Expand` would not reach the snippet anyway: an open row is a `value`, i.e. runtime state, not a prop.
import figma from 'figma'

export default {
  example: figma.code`
    {/* size="sm" for Figma's Condensed row */}
    <Accordion size="lg" defaultValue="hosting">
      <Accordion.Item value="hosting">
        <Accordion.Control>Where is my data hosted?</Accordion.Control>
        <Accordion.Panel>In the region you choose, on infrastructure we operate.</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="migration">
        <Accordion.Control>How long does a migration take?</Accordion.Control>
        <Accordion.Panel>Four to six weeks for a single site.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  `,
  imports: ['import { Accordion } from "scratch"'],
  id: 'accordion',
  metadata: { nestable: false },
}
