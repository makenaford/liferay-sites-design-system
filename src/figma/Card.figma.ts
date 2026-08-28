// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16728-26513
// source=src/index.ts
// component=Card
//
// Code Connect mapping for the Figma `card-main` set — the composable base, not the `Common Cards`
// presets. `Common Cards` has no axis of its own beyond `Type`, and each of its cells is `card-main` with
// different slots filled, so mapping the base is what makes every one of them a readable snippet.
//
// ## This reads the instance, not an example
//
// It used to emit fixed strings — `title="Card Title"`, `description="Short description here"` — so
// `get_design_context` on a real card returned the *example* rather than the card. Building the Home page
// meant reading every headline and quote off a screenshot by eye, which is both slow and how the four
// goal-card images ended up in the wrong order on the first pass.
//
// Now the copy and the slot contents come from the selected instance:
//
// - **Title** is `Content Text`'s `Title Card` property, two instances down.
// - **Description** is read off the text layer with `findText`, because Figma does **not** expose its
//   characters as a component property — only its visibility (`Show description`). That is a gap on the
//   design side: the layer should carry a TEXT property like the title does. Until it does, `findText` is
//   the only way to reach it, and it is why this file uses a helper rather than `getString` throughout.
// - **Top / Main 1 / Main 2 / Bottom** are real SLOT properties, so `getSlot` renders whatever the
//   designer actually put in them — a `Stat`, a `StatBar`, a `Link` — with its own Code Connect snippet
//   nested inside this one, instead of a guess.
//
// The slot booleans (`Show Top Content`, …) **do** have to be read, which was not obvious: `getSlot` on a
// hidden slot returns a non-empty result that renders as `Missing snippet for undefined`, not as nothing.
// So each slot is gated on its own boolean, and an unused slot drops out of the snippet entirely.
import figma from 'figma'

const instance = figma.selectedInstance

/**
 * `findText` returns an `ErrorHandle` when the layer is missing — a renamed layer, or a cell that hides
 * it — and interpolating that into the template would put an error in the designer's snippet instead of
 * a card. Every text lookup here goes through this, so a missing layer just drops the prop.
 */
const text = (layerName: string) => {
  const node = instance.findText(layerName, { traverseInstances: true })
  return node && node.type === 'TEXT' && node.textContent ? node.textContent : undefined
}

const align = instance.getEnum('Align', {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
})

/**
 * All four cells of the `Padding` axis. It was two — True and False — when this was first mapped, and the
 * set has since gained `On content` (which this implementation already had, as `content`) and `Full`. The
 * two new cells produced no snippet until they were added here.
 */
const padding = instance.getEnum('Padding', {
  True: 'all',
  False: 'none',
  'On content': 'content',
  Full: 'full',
})

const hasImage = instance.getBoolean('Show Image')

const title = text('Title')
const description = text('Description')

/*
 * The four SLOT properties, rendered from the instance rather than invented — each behind the boolean
 * that Figma uses to show it, because a hidden slot still returns a renderable (and useless) result.
 */
const top = instance.getBoolean('Show Top Content') ? instance.getSlot('Top Content') : undefined
const main = instance.getBoolean('Show Main Content 1') ? instance.getSlot('Main Content 1') : undefined
const secondary = instance.getBoolean('Show Main Content 2')
  ? instance.getSlot('Main Content 2')
  : undefined
const bottom = instance.getBoolean('Show Bottom Content')
  ? instance.getSlot('Bottom Content')
  : undefined

export default {
  example: figma.code`
    <Card
      align="${align}"
      padding="${padding}"
      ${hasImage ? 'image={<Image src={cover} alt="" ratio="3:2" radius={0} />}' : ''}
      ${title ? figma.code`title="${title}"` : ''}
      ${description ? figma.code`description="${description}"` : ''}
      ${top?.length ? figma.code`top={${top}}` : ''}
      ${main?.length ? figma.code`main={${main}}` : ''}
      ${secondary?.length ? figma.code`secondary={${secondary}}` : ''}
      ${bottom?.length ? figma.code`bottom={${bottom}}` : ''}
    />
  `,
  imports: ['import { Card, Image } from "liferay-sites-design-system"'],
  id: 'card-main',
  metadata: { nestable: false },
}
