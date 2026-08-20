// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19110-9503
// source=src/index.ts
// component=Hero
//
// Code Connect mapping for the Figma `Hero` set.
//
// `Theme` does not reach the snippet — the colour scheme handles it — and neither does `Size`, which is
// a media query at 1200px. `Type=Form` and `Type=Guide` are content compositions rather than chrome, so
// they map to the props that carry that content: a form instead of buttons, and no media.
import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Default: 'none',
  'Full Bubble': 'full',
  'Corner Bubble': 'corner',
  Form: 'corner',
  Guide: 'none',
})

/** Figma spells this axis `Alignnemt`. */
const align = instance.getEnum('Alignnemt', {
  Left: 'left',
  Center: 'center',
})

const hasImage = instance.getEnum('Image', { Yes: true, No: false })
const isForm = instance.getEnum('Type', {
  Form: true,
  Default: false,
  'Full Bubble': false,
  'Corner Bubble': false,
  Guide: false,
})

export default {
  example: figma.code`
    <Hero
      background="${type}"
      ${type !== 'none' ? 'video={bubble}' : ''}
      align="${align}"
      label={<Label size="sm" variant="outline">Platform</Label>}
      title={<h1>One platform, every channel</h1>}
      description="Build once and deliver everywhere."
      ${isForm
        ? 'form={<TextInput label="Work email" required containedButton={<Button size="sm">Get access</Button>} />}'
        : 'actions={<Button>Book a demo</Button>}'}
      ${hasImage ? 'media={<img src={shot} alt="" />}' : ''}
    />
  `,
  imports: [
    'import { Button, Hero, Label, TextInput } from "scratch"',
    'import bubble from "./assets/bubbles/bubble_corner.webm"',
  ],
  id: 'hero',
  metadata: { nestable: false },
}
