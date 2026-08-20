// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=8309-482671
// source=src/index.ts
// component=Link
//
// Code Connect mapping for the Figma `Inline Link` set — a link inside a paragraph, which is the same
// `Link` component with `underline="always"`.
//
// That underline is not a preference. A link in running text that is distinguished only by colour is
// invisible to anyone who cannot see the colour difference (WCAG 1.4.1), and unlike a standalone link
// there is no position or icon to identify it either.
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('Color', {
  Primary: 'default',
  Neutral: 'secondary',
})

/** Hover, Active and Visited are real CSS states; only Disabled reaches a prop. */
const disabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Active: false,
  Visited: false,
  Disabled: true,
})

const text = instance.getString('Text')

export default {
  example: figma.code`
    <Link href="/page" variant="${variant}" underline="always" aria-disabled={${disabled}}>
      ${text}
    </Link>
  `,
  imports: ['import { Link } from "scratch"'],
  id: 'inline-link',
  metadata: { nestable: true },
}
