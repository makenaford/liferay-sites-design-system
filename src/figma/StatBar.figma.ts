// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16708-102931
// source=src/index.ts
// component=StatBar
//
// Code Connect mapping for the Figma `Stats Bar` set.
//
// Its `Size` axis changes both the size of each stat and how many stats the bar holds, and its
// `Align=Vertical` cell is the stacked layout that code reaches responsively below 576px. So only
// `Align` maps to a prop: the stats themselves are children, each carrying its own `size`.
import figma from 'figma'

const instance = figma.selectedInstance

const align = instance.getEnum('Align', {
  Left: 'left',
  Center: 'center',
  Vertical: 'left',
})

const size = instance.getEnum('Size', {
  Large: 'md',
  XL: 'md',
  Small: 'sm',
})

export default {
  example: figma.code`
    <StatBar align="${align}">
      <Stat size="${size}" value="845" label="Months to launch" />
      <Stat size="${size}" value="98%" label="Uptime" />
      <Stat size="${size}" value="3x" label="Faster releases" />
    </StatBar>
  `,
  imports: ['import { Stat, StatBar } from "liferay-sites-design-system"'],
  id: 'stat-bar',
  metadata: { nestable: false },
}
