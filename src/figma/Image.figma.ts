// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=12305-1754909
// source=src/index.ts
// component=Image
//
// Code Connect mapping for the Figma `Aspect Ratio` set, which is what `Image`'s ratios come from.
import figma from 'figma'

const instance = figma.selectedInstance

const ratio = instance.getEnum('Ratio', {
  '1:1': '1:1',
  '3:2': '3:2',
  '4:3': '4:3',
  '16:10': '16:10',
  '16:9': '16:9',
  '2:1': '2:1',
  '5:2': '5:2',
  '3:1': '3:1',
  '40:33': '40:33',
  /** The set's `Adjustable` cell is "no ratio at all" — the image keeps its own. */
  Adjustable: 'auto',
})

const orientation = instance.getEnum('Orientation', {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
})

export default {
  example: figma.code`
    {/* alt is required and has no default: "" for a decorative image, a sentence otherwise */}
    <Image src={shot} alt="" ratio="${ratio}" orientation="${orientation}" radius="md" />
  `,
  imports: ['import { Image } from "scratch"'],
  id: 'image',
  metadata: { nestable: false },
}
