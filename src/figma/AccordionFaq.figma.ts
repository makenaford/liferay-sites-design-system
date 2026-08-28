// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19322-43580
// source=src/index.ts
// component=Accordion
//
// Code Connect mapping for the Figma `Accordion` set at `19322:43580` — the FAQ row, which is a second
// accordion component in the file alongside `17019:127517`. This one carries its text as component
// properties, so the snippet can be filled in from the instance.
//
// Two axes are read and one is not: `Device` is Desktop or Mobile, which is a width rather than a prop.
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  Large: 'lg',
  Small: 'sm',
})

/** Open or closed is `defaultValue`, i.e. runtime state rather than an appearance. */
const open = instance.getEnum('Property 1', {
  opened: true,
  closed: false,
})

/** Read to be explicit that it is deliberately unused: Mobile is the same code at a narrower width. */
instance.getEnum('Device', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

const title = instance.getString('Dropdown Title')
const description = instance.getString('Description')

export default {
  example: figma.code`
    <Accordion size="${size}" order={3} defaultValue={${open} ? 'question' : null}>
      <Accordion.Item value="question">
        <Accordion.Control>${title}</Accordion.Control>
        <Accordion.Panel>${description}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  `,
  imports: ['import { Accordion } from "liferay-sites-design-system"'],
  id: 'accordion-faq',
  metadata: { nestable: false },
}
