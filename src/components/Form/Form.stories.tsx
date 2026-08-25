import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { Form } from './Form'
import { Button } from '../Button'
import { Link } from '../Link'
import { Select, TextInput } from '../Input'

const INDUSTRIES = ['Technology', 'Financial Services', 'Healthcare', 'Public Sector', 'Retail']
const COUNTRIES = ['USA', 'Brazil', 'Germany', 'Spain', 'Japan']

/** Figma's `Description/Terms` line, verbatim in shape if not in wording. */
const Terms = () => (
  <>
    This site is protected by reCAPTCHA and the Google{' '}
    <Link href="#" size="sm" underline="always">
      Privacy Policy
    </Link>{' '}
    and{' '}
    <Link href="#" size="sm" underline="always">
      Terms of Service
    </Link>{' '}
    apply.
  </>
)

const meta = {
  title: 'Components/Form',
  component: Form,
  args: {
    title: 'Start your free 30 day trial',
    description: 'No credit card required, and nothing installs on your machine.',
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    terms: { control: false },
    submit: { control: false },
    footnote: { control: false },
    children: { control: false },
  },
  parameters: {
    frame: { width: 680 },
    docs: {
      description: {
        component: [
          'Figma `Form` component set (node `21405:74359`): a glass card holding a heading, rows of fields, the terms line and a submit button.',
          '',
          'It renders a **real `<form>`**, so `onSubmit` fires, Enter submits, and a `Button type="submit"` inside it does what it looks like it does.',
          '',
          '**The numbered slots are not the API.** Figma has `Slot 1`, `2`, `3`, `4`, `5` and `8` — not in visual order, no 6 or 7, and whether one holds a single field or two is set per instance. That is how Figma’s slot system works, not a description of a form, so this is one repeatable `Form.Row` and the order you write is the order it renders.',
          '',
          '**Every field is `floating`.** All the inputs in the file are `Condensed=True` — the notched label chip sitting on the border, with a red asterisk when required — which is `TextInput`’s `floating` prop.',
          '',
          '**`terms` renders above `submit`**, which is where Figma puts it and the only defensible order: text you agree to by pressing a button has to be readable before the button.',
          '',
          'Responsive by **container query**, not viewport — the card is dropped into a hero column, a section or a modal, so its own width decides. Drag the preview narrower than 520px and the two-up rows become single columns.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

/** Figma's `Format=Short, Size=Desktop` cell: six rows, the terms line, a full-width button, a footnote. */
export const Playground: Story = {
  render: (args) => (
    <Form
      {...args}
      terms={<Terms />}
      submit={
        <Button type="submit" size="md" fullWidth>
          Download
        </Button>
      }
      footnote={
        <>
          Already have a Liferay DXP trial?{' '}
          <Link href="#" size="sm" underline="always">
            Renew here
          </Link>
          .
        </>
      }
      onSubmit={(event) => event.preventDefault()}
    >
      <Form.Row>
        <TextInput floating label="Work Email" type="email" required />
      </Form.Row>
      <Form.Row>
        <TextInput floating label="First Name" required />
        <TextInput floating label="Last Name" required />
      </Form.Row>
      <Form.Row>
        <Select floating label="Industry" required data={INDUSTRIES} />
        <TextInput floating label="Company" required />
      </Form.Row>
      <Form.Row>
        <Select floating label="Country" required data={COUNTRIES} />
        <Select floating label="State" data={['New York', 'California', 'Texas']} />
      </Form.Row>
      <Form.Row>
        <Select floating label="Number of employees" required data={['1–50', '51–500', '500+']} />
      </Form.Row>
      <Form.Row>
        <TextInput floating label="Phone" type="tel" required />
      </Form.Row>
    </Form>
  ),
}

/** The shortest useful form: one field and a button. */
export const SingleField: Story = {
  render: (args) => (
    <Form
      {...args}
      title="Get the report"
      description="We will email it within the hour."
      submit={
        <Button type="submit" size="md" fullWidth>
          Send it to me
        </Button>
      }
      terms={<Terms />}
      onSubmit={(event) => event.preventDefault()}
    >
      <Form.Row>
        <TextInput floating label="Work Email" type="email" required />
      </Form.Row>
    </Form>
  ),
}

/** No heading — for a form that already sits under a section title. */
export const NoHeading: Story = {
  args: { title: undefined, description: undefined },
  render: (args) => (
    <Form
      {...args}
      submit={
        <Button type="submit" size="md" fullWidth>
          Subscribe
        </Button>
      }
      onSubmit={(event) => event.preventDefault()}
    >
      <Form.Row>
        <TextInput floating label="Work Email" type="email" required />
      </Form.Row>
      <Form.Row>
        <TextInput floating label="First Name" required />
        <TextInput floating label="Last Name" required />
      </Form.Row>
    </Form>
  ),
}

/**
 * **`Size=Mobile`**, reached by narrowing the card rather than the window. Padding 40 → 16, gap 40 → 24,
 * and every two-up row becomes a single column.
 */
export const Narrow: Story = {
  parameters: { frame: { width: 420 } },
  render: (args) => (
    <Box w={380} maw="100%">
      {Playground.render!(args as never, {} as never)}
    </Box>
  ),
}

/** Both widths side by side, which is the clearest way to see the container query do its work. */
export const BothSizes: Story = {
  parameters: { frame: { width: 1040 } },
  render: (args) => (
    <SimpleGrid cols={2} spacing="40" style={{ alignItems: 'start' }}>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          wide — two-up rows
        </Text>
        {Playground.render!(args as never, {} as never)}
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          under 520px — single column
        </Text>
        <Box w={360} maw="100%">{Playground.render!(args as never, {} as never)}</Box>
      </Stack>
    </SimpleGrid>
  ),
}

/** Validation is the browser's: `required` fields block submit and report themselves. */
export const Validation: Story = {
  render: (args) => (
    <Form
      {...args}
      title="Try submitting it empty"
      description="The required fields report themselves — no JavaScript involved."
      submit={
        <Button type="submit" size="md" fullWidth>
          Submit
        </Button>
      }
      onSubmit={(event) => {
        event.preventDefault()
        // eslint-disable-next-line no-alert
        window.alert('Submitted')
      }}
    >
      <Form.Row>
        <TextInput floating label="Work Email" type="email" required />
      </Form.Row>
      <Form.Row>
        <Select floating label="Industry" required data={INDUSTRIES} />
      </Form.Row>
    </Form>
  ),
}
