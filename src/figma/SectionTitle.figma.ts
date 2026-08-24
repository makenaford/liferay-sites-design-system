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
//
// ## This reads the instance, not an example
//
// It used to emit `title="Section title" description="Lorem ipsum dolor sit amet"` and never touch the
// instance at all — so every section heading on a page came back as filler. Since this component supplies
// the heading for all fourteen `Section` cells, that was the single biggest source of hand-transcribed
// copy when building the Home page.
//
// The heading and the standfirst live on a nested `Content Text` instance, in text layers named `Title`
// and `Description` — the same component, and the same two layer names, that `card-main` uses. Figma
// exposes the title as a TEXT property (`Title Card`) but **not** the description, whose characters are
// unreachable as a property; `findText` reads both off the layers instead. The missing description
// property is a gap on the design side, noted in README.md.
import figma from 'figma'

const instance = figma.selectedInstance

/**
 * `findText` hands back an `ErrorHandle` when a layer is absent — renamed, or hidden by the cell — and
 * interpolating that would put an error into the designer's snippet instead of a heading. So a missing
 * layer drops the prop instead.
 */
const text = (layerName: string) => {
  const node = instance.findText(layerName, { traverseInstances: true })
  return node && node.type === 'TEXT' && node.textContent ? node.textContent : undefined
}

const title = text('Title')
const description = text('Description')

export default {
  example: figma.code`
    {/* align="center" for the Centered- Description cell */}
    <SectionTitle
      ${title ? figma.code`title="${title}"` : ''}
      ${description ? figma.code`description="${description}"` : ''}
    />
  `,
  /*
   * The `actions` slot is deliberately not bound yet. Figma models it as a SLOT named `Slot` — the Home
   * page put a `Tabs Menu Features` in it — but reading a slot safely means gating it on the boolean that
   * controls its visibility, because `getSlot` on a *hidden* slot renders as `Missing snippet` rather than
   * as nothing (learned the hard way in Card.figma.ts). That boolean's name has not been read off the set
   * yet, so binding it now would risk putting `Missing snippet` into the snippet for every section that
   * has no action — which is most of them. One `get_context_for_code_connect` call closes this.
   */
  imports: ['import { SectionTitle } from "liferay-sites-design-system"'],
  id: 'section-title',
  metadata: { nestable: false },
}
