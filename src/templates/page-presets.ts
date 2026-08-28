import heroMedia from '../../assets/home/hero-media.png'
import industryHeroMedia from '../../assets/industry/hero-media.jpg'
import type { PageSpec, SectionSpec } from './page-schema'
import { sectionTypeFor } from './section-catalog'

/**
 * What a new mockup starts as.
 *
 * A preset is a **starting point, not a template**. It is copied once, on creation, and the copy is
 * then the designer's — editing a preset later does not reach back into mockups already made from it.
 * That is the whole difference between this and a CMS, and it is the reason this file can stay a few
 * plain factories: nothing has to migrate, nothing has to stay in sync, and a preset that turns out to
 * be wrong costs one page's worth of re-editing rather than a data migration.
 *
 * ## Why they are short
 *
 * The file draws component sets, not pages — its only two pages are `Cover` and `❖ Components`. There
 * is no drawn Industry page to copy, so the section run below is inferred, and an inferred preset that
 * guesses long is worse than one that guesses short: **a designer adds a section in one click and
 * deletes one in one click, but they have to first work out that the extra section was never meant to
 * be there.** So each preset carries the sections that kind of page cannot be without, and stops.
 *
 * ## Where a default actually belongs
 *
 * Three layers, and only the third is in this file:
 *
 * 1. **Always true → `PageRenderer`.** The marquee's 64px logos, the carousel's bleed, the card grid's
 *    32px gap. Not defaults — properties of the type. Never in the data.
 * 2. **True of every new section of a type → `blank()` in `section-catalog.ts`.**
 * 3. **True of this kind of page → here.**
 *
 * A preset composes `blank()` sections rather than restating their content, so placeholder copy has
 * exactly one home. When a preset needs a section to differ from its blank, it overrides the field —
 * and that override is the honest signal that the difference is the *page kind's*, not the type's.
 */

export interface PagePreset {
  id: string
  /** What the picker calls it. */
  label: string
  /** One line on which handoff this is for. */
  hint: string
  /** A fresh `PageSpec`. Called once per new mockup — never shared, never referenced afterwards. */
  create: () => PageSpec
}

/** A blank of the given type, so presets never restate placeholder copy. */
function blank<T extends SectionSpec['type']>(type: T) {
  const entry = sectionTypeFor(type)
  if (!entry) throw new Error(`No section type '${type}' in the catalog`)
  return entry.blank() as Extract<SectionSpec, { type: T }>
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non lacinia mi. Etiam nec mauris fringilla, tincidunt tellus sed, feugiat nulla.'

export const PAGE_PRESETS: PagePreset[] = [
  {
    id: 'landing',
    label: 'Landing page',
    hint: 'Email capture and proof up top, then the platform story. The Home page’s spine.',
    create: () => ({
      /*
       * What makes this a landing page is the hero: a form and the Gartner proof, not buttons. Someone
       * arriving here is being asked for an address, so the field is the primary action and the link
       * under it is the way out for people not ready to give one.
       *
       * The Home page's solution finder banner is deliberately absent. It is one page's device — the
       * `HeroBanner` union has exactly one kind in it for that reason — and a designer who wants it
       * should be choosing it, not deleting it.
       */
      hero: {
        background: 'corner',
        title: { text: 'A headline that names the outcome,', highlight: 'not the product' },
        description: {
          text: 'One or two lines on who this is for and what changes for them.',
          emphasis: 'The clause worth emphasising goes last.',
        },
        form: { placeholder: 'Work email', submit: 'Get started' },
        action: { label: 'Talk to sales instead', href: '#' },
        proof: {
          rating: { score: '4.5', outOf: 5, source: 'Gartner Peer Insights' },
          marks: ['SOC 2', 'ISO 27001', 'GDPR'],
        },
        media: { src: heroMedia, alt: 'Replace with this page’s product shot', ratio: '4:3' },
      },
      /*
       * Logos immediately under the hero, because that is the one section whose position is load-bearing
       * — it renders flush against the band above it, and anywhere else in the run it reads as an
       * orphan rather than as proof attached to the claim.
       */
      sections: [
        blank('logoMarquee'),
        blank('cardGrid'),
        blank('tabbedContent'),
        blank('customerStories'),
      ],
    }),
  },
  {
    id: 'industry',
    label: 'Industry page',
    hint: 'Two buttons, a 3:2 photo, and the industry’s own solutions and proof.',
    create: () => ({
      /*
       * Figma node `24223:209534`. Two buttons rather than a form, and no proof row: someone on an
       * industry page has already self-identified, so the job is to route them — demo or sales — not to
       * qualify them.
       *
       * The photo is 3:2 where the landing hero's is 4:3. That is the drawn difference between the two
       * cells, and it is why `ImageRef` carries a ratio at all.
       */
      hero: {
        background: 'corner',
        title: { text: 'Hero Title' },
        description: { text: LOREM },
        buttons: [
          { label: 'Book a Demo', href: '#' },
          { label: 'Contact Sales', href: '#', variant: 'outline' },
        ],
        media: {
          src: industryHeroMedia,
          alt: 'Replace with a photograph from this industry',
          ratio: '3:2',
        },
      },
      /*
       * `fullCard` before the grids, and it is the reason this preset exists rather than being the
       * landing one with a different hero: an industry page's first job after the hero is the one card
       * that says what the offer is *for this industry*, with its numbers on it.
       */
      sections: [
        blank('logoMarquee'),
        (() => {
          const section = blank('fullCard')
          /* The tab rule is the industry list, so the page kind names it — not the type's blank. */
          return { ...section, title: 'Built for your industry' }
        })(),
        blank('resourceGrid'),
        blank('customerStories'),
      ],
    }),
  },
]

export const presetFor = (id: string) => PAGE_PRESETS.find((preset) => preset.id === id)
