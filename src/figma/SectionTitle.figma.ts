// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17892-146487
// source=src/index.ts
// component=SectionTitle
//
// Code Connect mapping for the Figma `Section Title` set.
//
// **`Type` is not read off the instance.** The set is in an error state: two of its four variants are both
// named `Type=Centered- Description, Device=Desktop` — the second is the Mobile cell — so Figma refuses to
// resolve its property definitions and `getEnum` has nothing to read. One rename fixes it; recorded in
// README.md. `Device` would not reach the code anyway, since the type is fluid between the two cells.
import figma from 'figma'

export default {
  example: figma.code`
    {/* align="center" for the Centered- Description cell */}
    <SectionTitle
      title="Section title"
      description="Lorem ipsum dolor sit amet"
      actions={<Button variant="outline" size="md">See all</Button>}
    />
  `,
  imports: ['import { SectionTitle, Button } from "scratch"'],
  id: 'section-title',
  metadata: { nestable: false },
}
