// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=24385-65090
// source=src/index.ts
// component=Card
//
// Code Connect mapping for the Figma `card-main` set — the box. Its skin comes from a nested
// `Surface` instance (`24385:58962`) rather than a property of this component, and a mapping can only
// read the properties of the instance a designer selects, so `variant` cannot be derived here: the
// snippet carries the default `glass` and a developer picks the Style from the Surface layer.
//
// `interactive` is likewise a judgement rather than a variant. The spreadsheet marks Glass as the
// clickable surface and Grey as not, so the snippet turns it on for the default and leaves the
// element to the developer — a card that looks clickable has to be an `<a>` or a `<button>`.
import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('Align', {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
})

/**
 * Figma's `Padding` is a boolean: on means the drawn padding for that orientation — 20px vertical,
 * 40px horizontal — and off means the image card's zero.
 */
const padded = instance.getBoolean('Padding')
const padding = padded ? (orientation === 'horizontal' ? 'lg' : 'md') : 'none'

export default {
  example: figma.code`
    <Card variant="glass" orientation="${orientation}" padding="${padding}">
      {/* Top: label, icon, stat or subheading. Content: title, description, list.
          Bottom: author, link, button or stats. */}
    </Card>
  `,
  imports: ['import { Card } from "scratch"'],
  id: 'card',
  metadata: { nestable: true },
}
