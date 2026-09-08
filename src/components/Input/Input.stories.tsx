import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { TextInput } from './TextInput'
import { Textarea } from './Textarea'
import { Select } from './Select'
import { MultiSelect } from './MultiSelect'
import { LanguagePicker } from './LanguagePicker'
import { Button } from '../Button'
import { IconArrowRight, IconSearch } from '../../icons'

const INDUSTRIES = ['Technology', 'Financial Services', 'Healthcare', 'Public Sector', 'Retail']

const meta = {
  title: 'Components/Input',
  component: TextInput,
  args: {
    label: 'Field Label',
    placeholder: 'Placeholder text',
    description: 'This is the description area',
    required: true,
  },
  argTypes: {
    floating: {
      control: 'boolean',
      description: "Figma's `Condensed=True`: the label sits inside the box and floats up when filled.",
    },
    info: { control: false },
    containedButton: { control: false },
  },
  parameters: {
    frame: { width: 420 },
    docs: {
      description: {
        component: [
          'Mantine `TextInput`, `Textarea` and `Select` themed to the Figma `Input` set (node `16166:23969`), plus the `Dropdown` menu (`16884:46299`) and the `Country Selector` slot (`17205:21114`).',
          '',
          "One Figma set covers all three, so its `Type` axis becomes three components — a text field, a multi-line field and a select are three different elements with three different semantics — while `Condensed`, `State` and `Filled` become a prop and two real states.",
          '',
          'Every field is a 48px box with an 8px corner and a 1px gradient border: `Neutral/04` into `Neutral/05` at rest, and `Action/Primary/Active` into `Accent/Product Accent` on focus.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Focus the field to see the border take the accent gradient. */
export const Playground: Story = {}

/** The plain field, as the `input` section draws it: label above, help text below, required marker. */
export const Default: Story = {
  render: (args) => (
    <Stack gap="24">
      <TextInput {...args} />
      <TextInput {...args} label="With a value" defaultValue="User Input" />
      <TextInput {...args} label="With icons" leftSection={<IconSearch />} />
    </Stack>
  ),
}

/**
 * **Floating label** — Figma's `Condensed=True`. The label starts inside the box at 18px and shrinks to
 * 14px SemiBold as soon as the field has focus or a value, so it stays readable after typing. Click
 * into the empty one to watch it move.
 */
export const FloatingLabel: Story = {
  args: { floating: true },
  render: (args) => (
    <Stack gap="24">
      <TextInput {...args} />
      <TextInput {...args} label="Already filled" defaultValue="User Input" />
    </Stack>
  ),
}

/**
 * **`floating` on a dropdown.** Figma's `Form` set makes every field `Condensed=True`, dropdowns included,
 * so `Select` takes the same prop as `TextInput` — without it a form built from the file would have
 * floating labels on its text fields and stacked labels on its selects.
 *
 * Pick an option in the first one and the label rises: 18px Regular inside the box while empty, 14px
 * SemiBold above it once there is a value. It is driven by `:placeholder-shown`, which a select stops
 * matching the moment an option is chosen — so it needs no extra wiring and it drops back if the value is
 * cleared.
 */
export const FloatingDropdown: Story = {
  render: () => (
    <Stack gap="24">
      <Select floating label="Industry" required data={INDUSTRIES} />
      <Select floating label="Already chosen" data={INDUSTRIES} defaultValue={INDUSTRIES[0]} />
      <Select floating label="Clearable" data={INDUSTRIES} defaultValue={INDUSTRIES[1]} clearable />
      <Select floating label="Searchable" data={INDUSTRIES} searchable />
    </Stack>
  ),
}

/**
 * A text field and a dropdown side by side, both `floating` and both empty. They have to be
 * indistinguishable at rest, or a form mixing the two looks misaligned — which is exactly what happened
 * before `Select` took the prop.
 */
export const FloatingParity: Story = {
  render: () => (
    <Stack gap="24">
      <TextInput floating label="Work Email" required type="email" />
      <Select floating label="Industry" required data={INDUSTRIES} />
    </Stack>
  ),
}

/**
 * **With a tooltip** — Figma's `Info Button`, the `Status/Info` pill beside the label. It is a real
 * button, so it is reachable by keyboard and the tooltip opens on focus as well as hover. Anything the
 * user always needs belongs in `description` instead, where it is not hidden behind an interaction.
 */
export const WithTooltip: Story = {
  args: {
    info: 'We use your work address to route the request to the right team. It is never shared.',
  },
  render: (args) => (
    <Stack gap="24">
      <TextInput {...args} label="Work email" />
      <TextInput {...args} label="Floating, with info" floating />
    </Stack>
  ),
}

/**
 * **With a contained button** — not drawn in Figma, composed from the drawn field and this library's
 * `Button` at `size="sm"`, which at 40px leaves 4px of air inside the 48px box. The field gives up its
 * right padding so the button sits against the border.
 *
 * A single-field form still needs a `<form>` and a submit, so the button is a real submit button rather
 * than a decoration — Enter in the field does the same thing.
 */
export const WithContainedButton: Story = {
  render: (args) => (
    <Stack gap="24">
      <TextInput
        {...args}
        label="Newsletter"
        description="One email a month."
        placeholder="you@company.com"
        type="email"
        containedButton={
          <Button size="sm" rightSection={<IconArrowRight />}>
            Subscribe
          </Button>
        }
      />
      <TextInput
        {...args}
        label="Search the docs"
        description={undefined}
        required={false}
        leftSection={<IconSearch />}
        containedButton={<Button size="sm">Search</Button>}
      />
    </Stack>
  ),
}

/**
 * **Language picker** — Figma's `Country Selector`, the compact slot inside a field. It is a real
 * combobox, so it has an accessible name of its own and full keyboard behaviour. The flags Figma draws
 * come from a component set that is in neither icon pipeline, so each option takes an optional `flag`
 * node and the code stands alone without one.
 */
export const LanguagePickerStory: Story = {
  name: 'Language Picker',
  render: () => {
    const languages = [
      { value: 'en-GB', label: 'EN' },
      { value: 'de-DE', label: 'DE' },
      { value: 'fr-FR', label: 'FR' },
      { value: 'pt-BR', label: 'PT' },
      { value: 'ja-JP', label: 'JA' },
    ]

    return (
      <Stack gap="24">
        <Group gap="16" align="flex-end">
          <LanguagePicker data={languages} defaultValue="en-GB" />
          <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
            On its own
          </Text>
        </Group>
        <TextInput
          label="Phone number"
          description="Including the country code."
          placeholder="7700 900000"
          leftSection={<LanguagePicker data={languages} defaultValue="en-GB" aria-label="Country" />}
          leftSectionWidth={86}
          leftSectionPointerEvents="auto"
        />
      </Stack>
    )
  },
}

/**
 * **Dropdown select** — Figma's `Type=Dropdown` with the `Dropdown` menu. Three of that set's five
 * cells are covered because they are the three a select does: a flat list, grouped options, and a
 * searchable list.
 */
export const DropdownSelect: Story = {
  render: () => (
    <Stack gap="24">
      <Select
        label="Simple"
        description="A flat list of options."
        required
        placeholder="Pick one"
        data={['Enterprise websites', 'Digital commerce', 'Customer portals', 'Intranets']}
      />
      <Select
        label="Groups"
        description="Options under group headings."
        placeholder="Pick a product"
        data={[
          { group: 'Platform', items: ['DXP', 'Cloud', 'Analytics'] },
          { group: 'Modules', items: ['Commerce', 'Search', 'Content'] },
        ]}
      />
      <Select
        label="Search"
        description="Type to filter the list."
        placeholder="Search products"
        searchable
        nothingFoundMessage="No product matches that"
        data={['DXP', 'Cloud', 'Analytics', 'Commerce', 'Search', 'Content']}
      />
    </Stack>
  ),
}

/**
 * **Multi-select** — the same box holding more than one value, as pills. Not a cell in the Figma
 * library: it is composed from the field box, the `Dropdown` menu and the `Chip` treatment, because the
 * alternative in a real form is a column of checkboxes that stops being readable around six options.
 *
 * The box grows with its pills rather than scrolling them — a value the user chose and can no longer
 * see is a value they will choose twice. Add four or five and watch it wrap.
 */
export const MultiSelectStory: Story = {
  name: 'Multi Select',
  render: () => (
    <Stack gap="24">
      <MultiSelect
        label="Industries"
        description="Pick as many as apply."
        required
        placeholder="Pick a few"
        data={INDUSTRIES}
      />
      <MultiSelect
        label="Already chosen"
        placeholder="Pick a few"
        data={INDUSTRIES}
        defaultValue={[INDUSTRIES[0], INDUSTRIES[2]]}
        clearable
      />
      <MultiSelect
        label="Searchable"
        description="Type to filter, Backspace to remove the last pill."
        placeholder="Search industries"
        data={INDUSTRIES}
        searchable
        nothingFoundMessage="No industry matches that"
      />
      <MultiSelect
        label="Groups, capped at two"
        placeholder="Pick up to two"
        maxValues={2}
        data={[
          { group: 'Platform', items: ['DXP', 'Cloud', 'Analytics'] },
          { group: 'Modules', items: ['Commerce', 'Search', 'Content'] },
        ]}
      />
    </Stack>
  ),
}

/**
 * **`floating` on a multi-select.** The same `Condensed=True` prop the text field and the select take.
 * It cannot key off `:placeholder-shown` here — a multi-select's own input stays empty whatever is
 * chosen, since the values are pills beside it — so the label rises on the first pill instead.
 */
export const FloatingMultiSelect: Story = {
  name: 'Floating Multi Select',
  render: () => (
    <Stack gap="24">
      <MultiSelect floating label="Industries" required data={INDUSTRIES} />
      <MultiSelect
        floating
        label="Already chosen"
        data={INDUSTRIES}
        defaultValue={[INDUSTRIES[1], INDUSTRIES[3]]}
      />
      <MultiSelect floating label="Searchable" data={INDUSTRIES} searchable />
    </Stack>
  ),
}

/**
 * **`rounded`** — `Border Radius/round` corners instead of the set's `Border Radius/medium`, on both
 * dropdowns. A boolean rather than `radius="round"` for the reason `Button` makes `rounded` a variant:
 * the two shapes are the two the library draws, and a call site free to name any radius will eventually
 * name one the system does not have. An explicit `radius` still wins where a field has to match
 * something else on the page.
 *
 * All four combinations of the two axes — label above the box or floating inside it, 8px corner or
 * pill — so a form can be checked for the pair it actually uses.
 */
export const RoundedDropdowns: Story = {
  name: 'Rounded',
  render: () => (
    <Stack gap="32">
      <Stack gap="16">
        <Text fz="sm" fw={600} c="var(--sds-surfaces-text-secondary)">
          Label above the box
        </Text>
        <Select label="Select, 8px" data={INDUSTRIES} placeholder="Pick one" />
        <Select rounded label="Select, round" data={INDUSTRIES} placeholder="Pick one" />
        <MultiSelect label="Multi-select, 8px" data={INDUSTRIES} placeholder="Pick a few" />
        <MultiSelect
          rounded
          label="Multi-select, round"
          data={INDUSTRIES}
          placeholder="Pick a few"
          defaultValue={[INDUSTRIES[0]]}
        />
      </Stack>
      <Stack gap="16">
        <Text fz="sm" fw={600} c="var(--sds-surfaces-text-secondary)">
          Floating label
        </Text>
        <Select floating label="Select, 8px" data={INDUSTRIES} />
        <Select floating rounded label="Select, round" data={INDUSTRIES} />
        <MultiSelect floating label="Multi-select, 8px" data={INDUSTRIES} />
        <MultiSelect
          floating
          rounded
          label="Multi-select, round"
          data={INDUSTRIES}
          defaultValue={[INDUSTRIES[2]]}
        />
      </Stack>
    </Stack>
  ),
}

/** A text area: the same box over multiple lines, autosizing from three rows. */
export const TextAreaStory: Story = {
  name: 'Text Area',
  render: () => (
    <Textarea
      label="How can we help?"
      description="A sentence or two is plenty."
      required
      placeholder="Tell us what you are trying to build"
      info="We read every one of these. Expect a reply within two working days."
    />
  ),
}

/**
 * The states. `Active` is focus, `Filled` is having a value, and disabled is **inferred** — Figma's
 * `State=Disabled (Read Only)` is drawn identically to Default, so a disabled field would look exactly
 * like one you can type in. It follows the rest of the library instead: the resting appearance at half
 * opacity, and the cursor.
 *
 * The error state is inferred too: the set has no error cell, so it reuses `Status/Error/Error` from the
 * required marker, on both the message and the field's own border.
 */
export const States: Story = {
  render: (args) => (
    <Stack gap="24">
      <TextInput {...args} label="Default" />
      <TextInput {...args} label="Filled" defaultValue="User Input" />
      <TextInput {...args} label="Disabled" defaultValue="User Input" disabled />
      <TextInput {...args} label="Error" defaultValue="not-an-email" error="Enter a valid email address" />
    </Stack>
  ),
}

/** Controlled, which is how a field usually ends up wired. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return (
      <Stack gap="16">
        <TextInput
          {...args}
          label="Work email"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          value: <code>{value || '—'}</code>
        </Text>
      </Stack>
    )
  },
}
