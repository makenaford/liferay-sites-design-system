// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=22522-24157
// source=src/index.ts
// component=Marquee
//
// Code Connect mapping for the Figma `Logos scrolling section` set.
//
// `Size` is the logo cell's height, so it maps to `size`. `Theme` does not become a prop: it exists in
// the file because a one-colour logo needs a different ink on each canvas, and `Surfaces/Text/Primary`
// already inverts with the colour scheme — so both cells are `monochrome`, and the mode does the rest.
// The logos are nested instances rather than a component property, so they cannot be read out of the file.
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  Mobile: 'sm',
  Desktop: 'md',
  Size3: 'lg',
})

/** Read to be explicit that it is deliberately not a prop: both cells are the same code. */
instance.getEnum('Theme', {
  Dark: 'monochrome',
  Light: 'monochrome',
})

export default {
  example: figma.code`
    <Marquee label="Customers" size="${size}" monochrome>
      <img src={airbus} alt="Airbus" />
      <img src={carrefour} alt="Carrefour" />
      <img src={petrobras} alt="Petrobras" />
    </Marquee>
  `,
  imports: ['import { Marquee } from "scratch"'],
  id: 'marquee',
  metadata: { nestable: false },
}
