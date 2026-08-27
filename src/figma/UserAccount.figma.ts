// url=https://www.figma.com/design/sKjfI263TCDoHuLJSl5VRb/Homepage-Redesign?node-id=7101-15286
// source=src/index.ts
// component=Link
//
// Code Connect mapping for the Figma `User Account` set — the log-in control in the bar.
//
// A `Utility Link` with its person and its caret, so in code it is a `Link` with both sections rather
// than a component of its own.
//
// `Signed In` is the one axis with real consequences and it is **not implemented**: signed out the
// control says Log In, signed in it carries the account's name and an avatar, and this library has no
// avatar. The mapping says so rather than emitting a prop that does not exist.
//
// `Primary Button` has one cell, `False`, and maps to nothing: the bar's button is `Contact Sales`,
// which sits beside this control rather than inside it.
import figma from 'figma'

const instance = figma.selectedInstance

const signedIn = instance.getEnum('Signed In', { True: true, False: false })

/** Read to be explicit that it is deliberately unused: hover and active are CSS, not props. */
instance.getEnum('State', {
  Default: 'default',
  Hover: 'default',
  Active: 'default',
  'Active Hover': 'default',
})

/** Read to be explicit that it is deliberately unused: the bar's button is a sibling, not a section. */
instance.getEnum('Primary Button', { False: false })

export default {
  example: figma.code`
    <Link href="#" size="md" leftSection={<IconUser1Filled />} rightSection={<IconDown />}>
      ${signedIn ? '{/* Signed in: the account name. No avatar in this library yet. */}' : 'Log In'}
    </Link>
  `,
  imports: [
    'import { Link } from "liferay-sites-design-system"',
    'import { IconDown, IconUser1Filled } from "liferay-sites-design-system"',
  ],
  id: 'user-account',
  metadata: { nestable: true },
}
