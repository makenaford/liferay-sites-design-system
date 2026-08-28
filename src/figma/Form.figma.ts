// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=21405-74359
// source=src/index.ts
// component=Form
//
// Code Connect mapping for the Figma `Form` set.
//
// Neither axis reaches the snippet. `Format` has one option (`Short`), so there is nothing to switch on,
// and `Size` is a container query on the card's own width rather than a prop — a form dropped into a hero
// column is narrow while the window is not.
//
// The six numbered slots are not mapped individually either. `Slot 1`–`5` and `Slot 8` are not in visual
// order, there is no 6 or 7, and whether a given slot holds one field or two is set per instance — that is
// Figma's slot mechanism showing through, not a description of a form. `Form.Row` is one repeatable thing.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that both are deliberately unused. */
instance.getEnum('Format', { Short: 'short' })
instance.getEnum('Size', { Desktop: 'responsive', Mobile: 'responsive' })

export default {
  example: figma.code`
    <Form
      title="Start your free 30 day trial"
      description="No credit card required."
      terms={<>This site is protected by reCAPTCHA and the Google <Link href="/privacy">Privacy Policy</Link> applies.</>}
      submit={<Button type="submit" size="md" fullWidth>Download</Button>}
      footnote={<>Already have a trial? <Link href="/renew">Renew here</Link>.</>}
      onSubmit={handleSubmit}
    >
      <Form.Row>
        <TextInput floating label="Work Email" type="email" required />
      </Form.Row>
      <Form.Row>
        <TextInput floating label="First Name" required />
        <TextInput floating label="Last Name" required />
      </Form.Row>
      <Form.Row>
        <Select floating label="Industry" required data={industries} />
        <TextInput floating label="Company" required />
      </Form.Row>
    </Form>
  `,
  imports: ['import { Button, Form, Link, Select, TextInput } from "liferay-sites-design-system"'],
  id: 'form',
  metadata: { nestable: false },
}
