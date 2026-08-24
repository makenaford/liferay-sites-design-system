// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=22570-26321
// source=src/index.ts
// component=Accordion
//
// Code Connect mapping for the Figma `Faq List` set — a stack of accordion rows, which is `Accordion`
// with more than one `Accordion.Item`.
//
// `Property 1` is Large / Small / Mobile. The first two are the `Accordion` `size` axis; `Mobile` is the
// small size at a narrow width rather than a third size, so it maps to `sm` as well.
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Property 1', {
  Large: 'lg',
  Small: 'sm',
  Mobile: 'sm',
})

export default {
  example: figma.code`
    {/* order={3} wraps each control in a real heading — pick the level the page needs */}
    <Accordion size="${size}" order={3}>
      <Accordion.Item value="hosting">
        <Accordion.Control>This is my question for the FAQ</Accordion.Control>
        <Accordion.Panel>The answer.</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="migration">
        <Accordion.Control>And another question</Accordion.Control>
        <Accordion.Panel>Its answer.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  `,
  imports: ['import { Accordion } from "liferay-sites-design-system"'],
  id: 'faq-list',
  metadata: { nestable: false },
}
