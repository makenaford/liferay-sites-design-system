// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=19097-39150
// source=src/index.ts
// component=Card
//
// Code Connect mapping for the Figma `Common Cards` set — the card library a designer actually places,
// where `card-main` is the shell underneath it.
//
// `Type` selects **which slots are filled**, not a prop: there is no `type` on `Card`, because all eight
// cells are the same component with different slots. So the enum picks the snippet.
//
// Three of the eight are not in `Card Examples` and have no verified arrangement — `CS-Stat`,
// `Quick Link` and `Stat Highlight`. They map to the nearest shape with a note rather than being left
// unmapped, so a designer placing one still gets something to start from.
import figma from 'figma'

const instance = figma.selectedInstance

const example = instance.getEnum('Type', {
  Resource: `<Card
      component="a"
      href="/resource"
      interactive
      surface="no-bg"
      padding="none"
      image={<Image src={cover} alt="" ratio="3:2" radius={0} />}
      hero={<Label size="sm" variant="outline">Guide</Label>}
      title="Card Title"
    />`,
  'CS- Quote': `<Card
      image={<Image src={logo} alt="Advanced Energy" ratio="3:2" />}
      top={<Stat size="sm" value="845" label="Months to Launch" rightSection={<IconArrowUp />} />}
      description="Short description here"
      bottom={<Quotee name="Anne Anderson" title="VP of Experience" />}
    />`,
  'CS- Details': `<Card
      component="a"
      href="/customer-story"
      interactive
      image={<Image src={logo} alt="Advanced Energy" ratio="3:2" />}
      title="Card Title"
      description="Short description here"
    />`,
  'Icon-Left': `<Card
      hero={<IconGlassComposable width={40} height={40} />}
      title="Card Title"
      description="Short description here"
    />`,
  'Icon-Center': `<Card
      headerAlign="center"
      hero={<IconGlassComposable width={40} height={40} />}
      title="Card Title"
    />`,
  /* Not in `Card Examples` — the nearest arrangement, to be confirmed against the design. */
  'CS-Stat': `<Card
      top={<Stat value="845" label="Months to Launch" rightSection={<IconArrowUp />} />}
      title="Card Title"
      description="Short description here"
    />`,
  'Quick Link': `<Card
      component="a"
      href="/link"
      interactive
      align="horizontal"
      title="Card Title"
      bottom={<IconArrowRight />}
    />`,
  'Stat Highlight': `<Card
      align="horizontal"
      titleSize="full"
      title="Card Title"
      main={<StatBar>{/* Stat per figure */}</StatBar>}
    />`,
})

export default {
  example: figma.code`${example}`,
  imports: [
    'import { Card, Image, Label, Stat, StatBar } from "liferay-sites-design-system"',
  ],
  id: 'common-cards',
  metadata: { nestable: false },
}
