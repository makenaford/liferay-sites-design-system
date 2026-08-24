// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17892-146518
// source=src/index.ts
// component=Section
//
// Code Connect mapping for the Figma `Section` set.
//
// `Type` maps to **what goes in the body**, not to a prop: all fourteen cells are the same shell — a
// centred 1280 column, a `SectionTitle`, a body and sometimes a footer — differing only in
// their content. So the enum picks the snippet's body rather than an attribute, and `Size` does not reach
// the code at all, because the padding and the type are fluid between Figma's two cells rather than
// switched between them.
//
// ## The heading comes from the instance
//
// The snippet used to restate `<SectionTitle title="Section title" description="Description" />`, so a
// section's real heading never reached the code even though `Section Title` sits right there in the
// instance. It now renders the nested `Section Title`, which carries its own Code Connect snippet and its
// own copy — see SectionTitle.figma.ts. A cell without one falls back to the placeholder.
import figma from 'figma'

const instance = figma.selectedInstance

/**
 * The nested `Section Title`. `findInstance` returns an `ErrorHandle` when the cell has no heading, and
 * interpolating that would render an error where the title should be, so it is checked before use.
 */
const heading = instance.findInstance('Section Title', { traverseInstances: true })
const hasHeading = heading && heading.type === 'INSTANCE'

/** Read to be explicit that it is deliberately unused: Desktop and Mobile are the same code. */
instance.getEnum('Size', {
  Default: 'fluid',
  Desktop: 'fluid',
  Mobile: 'fluid',
})

const body = instance.getEnum('Type', {
  'Card Grid': '<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">{/* Card */}</SimpleGrid>',
  'Card Grid- Non Clickable':
    '<SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="24">{/* Card, no href */}</SimpleGrid>',
  Resources: '<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">{/* Card surface="no-bg" */}</SimpleGrid>',
  'Content Left Image': '<ContentMedia mediaSide="left" media={/* … */} title="…" />',
  'Content- Right Image': '<ContentMedia mediaSide="right" media={/* … */} title="…" />',
  FAQ: '<Accordion size="lg" order={3}>{/* Accordion.Item */}</Accordion>',
  'Integrations Section': '<Marquee label="Integrations" monochrome>{/* logos */}</Marquee>',
  Carousel: '<Carousel label="Customer stories" gutter={80}>{/* Card */}</Carousel>',
  'Tabbed- Content': '<Tabs variant="pills" defaultValue="…">{/* Tabs.List + Tabs.Panel */}</Tabs>',
  'Customer Story': '<Card align="horizontal" titleSize="full" />',
  'Full Card': '<Card align="horizontal" titleSize="full" />',
  'Highlight Text': '<Card align="horizontal" titleSize="full" />',
  Quote: '{/* blockquote + attribution */}',
  'Quick Links': '{/* a Card per link */}',
})

export default {
  example: figma.code`
    <Section title={${hasHeading ? heading : '<SectionTitle title="Section title" />'}}>
      ${body}
    </Section>
  `,
  imports: ['import { Section, SectionTitle } from "liferay-sites-design-system"'],
  id: 'section',
  metadata: { nestable: false },
}
