// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16290-53873
// source=src/index.ts
// component=Divider
//
// Code Connect mapping for the Figma `divider` set.
//
// Publishing this also **replaces the stale UI-created mapping** on the same set, which pointed at
// `src/components/Divider.tsx` in an older sample codebase. That one has no snippet template, so it renders
// as a bare filename in Dev Mode; publishing over it needs `--force`.
import figma from 'figma'

const instance = figma.selectedInstance

const tone = instance.getEnum('Property 1', {
  normal: 'normal',
  gradient: 'gradient',
})

const orientation = instance.getEnum('Property 2', {
  horizontal: 'horizontal',
  vertical: 'vertical',
})

export default {
  example: figma.code`<Divider tone="${tone}" orientation="${orientation}" />`,
  imports: ['import { Divider } from "scratch"'],
  id: 'divider',
  metadata: { nestable: true },
}
