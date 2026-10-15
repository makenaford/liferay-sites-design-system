// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17927-12691
// source=src/index.ts
// component=TableOfContents
//
// Code Connect mapping for the Figma `Table of Contents`. The rows are `Toc Item` instances whose text is
// placeholder in the file, so the snippet shows the shape of `items` rather than reading them back.
import figma from 'figma'

export default {
  example: figma.code`<TableOfContents
  label="Outline"
  items={[
    { label: 'Key Takeaways', href: '#key-takeaways' },
    { label: 'Background', href: '#background' },
    { label: 'Challenges', href: '#challenges' },
  ]}
/>`,
  imports: ['import { TableOfContents } from "liferay-sites-design-system"'],
  id: 'table-of-contents',
  metadata: { nestable: true },
}
