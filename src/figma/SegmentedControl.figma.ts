// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=17900-62310
// source=src/index.ts
// component=SegmentedControl
//
// Code Connect mapping for the Figma `Tabs Menu Carded` component set.
//
// The set's only axis is `Sizes` (Desktop | Mobile), and that axis does not appear in the snippet:
// the implementation switches treatment on a media query at 1200px rather than taking a size prop, so
// both variants map to the same code. The segments themselves are nested `Tab Text` instances rather
// than a component property, so the `data` array cannot be read out of the file — the snippet carries
// the tabs Figma draws, for a developer to replace with their own.
import figma from 'figma'

const instance = figma.selectedInstance

/**
 * Read only to be explicit that it is deliberately unused: a `Mobile` selection in Figma is the same
 * code as `Desktop`, seen below 1200px.
 */
instance.getEnum('Sizes', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

export default {
  example: figma.code`
    <SegmentedControl
      defaultValue="portals"
      data={[
        { value: 'websites', label: 'Enterprise Websites' },
        { value: 'commerce', label: 'Digital Commerce' },
        { value: 'portals', label: 'Customer Portals' },
        { value: 'intranets', label: 'Intranets' },
        { value: 'apps', label: 'Apps' },
      ]}
    />
  `,
  imports: ['import { SegmentedControl } from "scratch"'],
  id: 'segmented-control',
  metadata: { nestable: false },
}
