// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=20440-16714
// source=src/index.ts
// component=Carousel
//
// Code Connect mapping for the Figma `Carousel` control set.
//
// The set is only the controls — the track, the cards and the edge fade live in the `card carousel`
// section (`24465:66866`), which is a section rather than a component and so cannot be mapped. `Type`
// is the one axis, and it conflates two independent things: `arrows` draws the button pair *and* a dot
// row, `lines` draws bars and no buttons. The component splits them into `arrows` and `indicators`,
// which is why one enum sets two props.
import figma from 'figma'

const instance = figma.selectedInstance

const indicators = instance.getEnum('Type', {
  arrows: 'dots',
  lines: 'lines',
})

const arrows = instance.getEnum('Type', {
  arrows: true,
  lines: false,
})

export default {
  example: figma.code`
    <Carousel label="Customer stories" arrows={${arrows}} indicators="${indicators}">
      <Card>{/* … */}</Card>
      <Card>{/* … */}</Card>
    </Carousel>
  `,
  imports: ['import { Carousel, Card } from "scratch"'],
  id: 'carousel',
  metadata: { nestable: false },
}
