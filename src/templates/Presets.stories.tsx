import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { presetFor } from './page-presets'
import type { PageSpec } from './page-schema'

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

/**
 * `backdrop` — the section background option, kept but no longer given away.
 *
 * A `MeshBackdrop` used to be part of the integrations band itself, so every page built from that
 * section type inherited a lit ground whether or not the page wanted one. A pool of brand light is a
 * decision about a page, not a property of a section type, so it is a field now: absent by default,
 * and either tone on request.
 *
 * `hero` is three blobs of the hero's palette at about one size, which reads as a **field** — the page
 * is not flat here, and no part of it is the source. `wash` is `CapabilityMap`'s construction — a wide
 * blue core, a violet halo offset against it, and a small much brighter lift where they cross — which
 * reads as light arriving from a **point**, and suits a band with one centred object in it.
 *
 * Both are held well back, and the ceiling is set by the text over them rather than by the pool: at the
 * strength `wash` first shipped at, the heading's own gradient phrase measured 2.76:1 against the
 * ground under it.
 */
export const SectionBackdrop: Story = {
  render: () => {
    const page = (backdrop?: 'hero' | 'wash'): PageSpec => ({
      hero: {
        title: { text: backdrop ? `backdrop="${backdrop}"` : 'No backdrop' },
        description: { text: 'The same band, three ways.' },
        background: 'none',
      },
      sections: [
        {
          type: 'integrations',
          title: 'Extend Your platform. Integrate without limits.',
          titleHighlight: 'Integrate without limits.',
          description: 'Liferay connects flexibly with the platforms and vendors your team relies on.',
          action: { label: 'Explore integrations', href: '#' },
          backdrop,
          logos: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
        },
      ],
    })

    return (
      <>
        <PageRenderer page={page()} />
        <PageRenderer page={page('wash')} />
        <PageRenderer page={page('hero')} />
      </>
    )
  },
}
