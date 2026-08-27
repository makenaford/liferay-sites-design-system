// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7075-127570
// source=src/index.ts
// component=Logo
//
// Code Connect mapping for the Figma `Logo` set — the lockup at the left of the bar.
//
// `Breakpoint` is the size: 48 tall on desktop, which is the height `Header` passes, and smaller on a
// phone. The width follows the artwork's ratio, because a logo is pinned by height — that is what makes
// it sit level with the text beside it.
//
// `Subsite` is **not implemented**. The set can put a subsite's name beside the wordmark; `Logo` draws
// the lockup alone, and the mapping says so rather than inventing a prop.
//
// `title=""` in the bar: the lockup sits inside a link that already names itself, so an accessible name
// here would be read out twice.
import figma from 'figma'

const instance = figma.selectedInstance

const height = instance.getEnum('Breakpoint', { Desktop: 48, Mobile: 32 })

/** Read to be explicit that it is deliberately unused: there is no subsite lockup in this library. */
instance.getEnum('Subsite', { True: 'full', False: 'full' })

/** Read to be explicit that it is deliberately unused: hover is drawn by the link around it. */
instance.getEnum('State', { Default: 'default', Hover: 'default' })

export default {
  example: figma.code`<Logo height={${height}} title="" />`,
  imports: ['import { Logo } from "liferay-sites-design-system"'],
  id: 'logo',
  metadata: { nestable: true },
}
