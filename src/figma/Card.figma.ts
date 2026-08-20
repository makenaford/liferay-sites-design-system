// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16728-26513
// source=src/index.ts
// component=Card
//
// Code Connect mapping for the Figma `card-main` set — the composable base, not the `Common Cards`
// presets. `Common Cards` has no axis of its own beyond `Type`, and each of its cells is `card-main` with
// different slots filled, so mapping the base is what makes every one of them a readable snippet.
//
// The slot booleans (`Show Image`, `Show Top Content`, …) do not need reading: in React a slot that is
// passed is a slot that shows, so the boolean and the content are the same decision.
import figma from 'figma'

const instance = figma.selectedInstance

const align = instance.getEnum('Align', {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
})

/**
 * Figma's `Padding` is a boolean; this implementation has a third case, `content`, for the file's
 * `no image padding` frame — `Padding=True` with the 20px moved down onto the content so the image can
 * reach the card's edge. That frame is not a variant, so it cannot be read from here.
 */
const padding = instance.getEnum('Padding', {
  True: 'all',
  False: 'none',
})

export default {
  example: figma.code`
    <Card
      align="${align}"
      padding="${padding}"
      image={<Image src={cover} alt="" ratio="3:2" radius={0} />}
      hero={<Label size="sm" variant="outline">Label</Label>}
      title="Card Title"
      description="Short description here"
      bottom={<Link href="#" size="md">Read more</Link>}
    />
  `,
  imports: ['import { Card, Image, Label, Link } from "scratch"'],
  id: 'card-main',
  metadata: { nestable: false },
}
