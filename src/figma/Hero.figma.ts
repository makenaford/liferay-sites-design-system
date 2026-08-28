// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19110-9503
// source=src/index.ts
// component=Hero
//
// Code Connect mapping for the Figma `Hero` set.
//
// `Theme` does not reach the snippet — the colour scheme handles it — and neither does `Size`, which is
// a media query at 1200px. `Type=Form` and `Type=Minimal` are content compositions rather than chrome, so
// they map to the props that carry that content: a form instead of buttons, and no media.
//
// The `banner` prop is not in this snippet because this component set has no slot for it. It is a band
// across the top of the hero, above both columns, and the Home page (node `24563:52720`) draws a
// solution finder there — see `src/templates/Home.stories.tsx`.
import figma from 'figma'

const instance = figma.selectedInstance

/**
 * `Guide` was **renamed to `Minimal`**, not deleted — its placeholder still reads "This Is An Example
 * Of A Guide Title". It also draws a corner bubble, which the old `Guide: 'none'` did not reflect, so
 * this is a corrected mapping rather than a renamed one.
 */
const type = instance.getEnum('Type', {
  Default: 'none',
  Minimal: 'corner',
  'Full Bubble': 'full',
  'Corner Bubble': 'corner',
  Form: 'corner',
})

/** Figma spells this axis `Alignnemt`. */
/*
 * `Alignnemt` is not read any more. The axis has a single cell — `Left` — since `Center` was dropped
 * from the set, and an enum with one option only emits the default. `Hero` keeps `align="center"` as a
 * capability; see the note in Hero.tsx and README.md.
 */

const hasImage = instance.getEnum('Image', { Yes: true, No: false })
const isForm = instance.getEnum('Type', {
  Form: true,
  Default: false,
  Minimal: false,
  'Full Bubble': false,
  'Corner Bubble': false,
})

export default {
  example: figma.code`
    <Hero
      background="${type}"
      ${type !== 'none' ? 'video={bubble}' : ''}
      ${type !== 'none' ? 'videoLight={bubbleLight}' : ''}
      label={<Label size="sm" variant="gradient">Platform</Label>}
      title={<h1>One platform, every channel</h1>}
      description="Build once and deliver everywhere."
      ${isForm
        ? 'form={<TextInput label="Work email" required containedButton={<Button size="sm">Get access</Button>} />}'
        : 'actions={<Button>Book a demo</Button>}'}
      ${hasImage ? 'media={<img src={shot} alt="" />}' : ''}
    />
  `,
  imports: [
    'import { Button, Hero, Label, TextInput } from "liferay-sites-design-system"',
    'import bubble from "./assets/bubbles/bubble_corner.webm"',
    'import bubbleLight from "./assets/bubbles/bubble_corner_light.webm"',
  ],
  id: 'hero',
  metadata: { nestable: false },
}
