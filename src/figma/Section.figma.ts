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
 * The heading's own words, read off the nested `Section Title`'s text layers.
 *
 * Not by interpolating the nested instance: `section-title` is declared `nestable: false`, so rendering
 * it inside this snippet made the whole Section template fall back to Figma's generic
 * `<Section type=… size=…>` output — worse than the hardcoded string it replaced. Reading the text is
 * the same technique Card and SectionTitle use, and it does not care whether the child is nestable.
 */
const text = (layerName: string) => {
  const node = instance.findText(layerName, { traverseInstances: true })
  return node && node.type === 'TEXT' && node.textContent ? node.textContent : undefined
}

const heading = text('Title')
const standfirst = text('Description')

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
  Resources: '<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="24">{/* Card surface="none" */}</SimpleGrid>',
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
    <Section title={<SectionTitle ${heading ? figma.code`title="${heading}"` : ''} ${standfirst ? figma.code`description="${standfirst}"` : ''} />}>
      ${body}
    </Section>
  `,
  imports: ['import { Section, SectionTitle } from "liferay-sites-design-system"'],
  id: 'section',
  metadata: { nestable: false },
}
