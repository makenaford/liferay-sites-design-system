import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { presetFor } from './page-presets'

const meta = {
  title: 'Templates/Presets',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'What a new mockup starts as. Each of these is exactly what the **New** menu in `Templates/Page builder` drops in — the same `create()` call, so a story going wrong is the preset going wrong.',
          '',
          'A preset is a **starting point, not a template**: it is copied once, on creation, and the copy belongs to the mockup. Editing a preset never reaches back into pages already made from it. That is deliberate — nothing has to migrate, and a preset that turns out to be wrong costs one page of re-editing rather than a data migration.',
          '',
          '**They are short on purpose.** The Figma file draws component sets, not pages — its only two pages are `Cover` and `❖ Components` — so these section runs are inferred rather than copied. Adding a section is one click; noticing that a section was never meant to be there is not. So each preset carries what that kind of page cannot be without, and stops.',
          '',
          'A preset composes `blank()` sections from `section-catalog.ts` rather than restating their placeholder copy, so a default has one home. Where a preset *does* override a blank, that override is the claim that the difference belongs to the page kind rather than the section type.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/**
 * Email capture and proof in the hero, then the platform story — the Home page's spine without its
 * bespoke solution finder, which is one page's device rather than a landing page's.
 */
export const Landing: Story = {
  render: () => (
    <>
      <SiteHeader />
      <PageRenderer page={presetFor('landing')!.create()} />
      <SiteFooter />
    </>
  ),
}

/**
 * The hero is Figma node `24223:209534` — two buttons rather than a form, and no proof row, because
 * someone on an industry page has already self-identified and the job is to route them.
 *
 * It is also the design that made `HeroSpec` carry a button row and `ImageRef` carry a ratio: the
 * schema could express one primary link and a 4:3 image, and this hero is two buttons and a 3:2 photo.
 */
export const Industry: Story = {
  render: () => (
    <>
      <SiteHeader />
      <PageRenderer page={presetFor('industry')!.create()} />
      <SiteFooter />
    </>
  ),
}
