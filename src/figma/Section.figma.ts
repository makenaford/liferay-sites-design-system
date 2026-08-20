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
import figma from 'figma'

const instance = figma.selectedInstance

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
    <Section title={<SectionTitle title="Section title" description="Description" />}>
      ${body}
    </Section>
  `,
  imports: ['import { Section, SectionTitle } from "scratch"'],
  id: 'section',
  metadata: { nestable: false },
}
