import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { Label } from './Label'
import { IconCheck, IconInformation } from '../../icons'

/** The three Figma styles, in the order the component set enumerates them. */
const VARIANTS = ['filled', 'light', 'outline'] as const
const SIZES = ['lg', 'md', 'sm'] as const

const SIZE_LABELS: Record<(typeof SIZES)[number], string> = {
  lg: 'Large',
  md: 'Medium',
  sm: 'Small',
}

const VARIANT_LABELS: Record<(typeof VARIANTS)[number], string> = {
  filled: 'Gradient',
  light: 'Tonal',
  outline: 'Outline',
}

const meta = {
  title: 'Components/Label',
  component: Label,
  args: {
    children: 'Label',
    variant: 'light',
    size: 'lg',
  },
  argTypes: {
    variant: {
      options: VARIANTS,
      control: 'inline-radio',
      description: 'Figma Style — Gradient / Tonal / Outline, under Mantine\'s variant names.',
    },
    size: {
      options: SIZES,
      control: 'inline-radio',
      description: 'Figma Size. Large 40px, Medium 32px, Small 22px — the radius comes with it.',
    },
    radius: {
      options: ['round', 'md', 'sm'],
      control: 'inline-radio',
      description:
        'Only for deviating from the design: Figma binds the radius to Size. `round` is the 1000px pill, `sm` the 4px corner.',
    },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Mantine `Badge` themed to the Figma `Label CTA` component set (node `15121:237267`).',
          '',
          "Figma's Style axis (Gradient | Tonal | Outline) maps onto Mantine's `variant` names — `filled`, `light`, `outline` — and Size onto `size`. There are no interaction states: a label is not a control, so it renders a plain `<div>`.",
          '',
          'The corner radius is part of the size in Figma (pill at Large, 8px at Medium, 4px at Small), so pass `radius` only to deviate from the design.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Switch the toolbar between Light and Dark to see both modes. */
export const Playground: Story = {}

/**
 * The three styles. `filled` is the `Components/Label/lab-grad-bg-step-01/-02` gradient, `light` the
 * flat `lab-tonal-bg`, and `outline` a gradient stroke from `Brand/Primary/Primary` out to
 * `Accent/Product Accent` over no fill at all.
 */
export const Variants: Story = {
  render: (args) => (
    <Group gap="16">
      {VARIANTS.map((variant) => (
        <Label key={variant} {...args} variant={variant}>
          {VARIANT_LABELS[variant]}
        </Label>
      ))}
    </Group>
  ),
}

/** Large, Medium and Small. Height, padding, label size, icon box, border weight and radius all change. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Group key={variant} gap="16" align="center">
          {SIZES.map((size) => (
            <Label key={size} {...args} variant={variant} size={size}>
              {SIZE_LABELS[size]}
            </Label>
          ))}
        </Group>
      ))}
    </Stack>
  ),
}

/**
 * Figma's `Show Icon` boolean, as `leftSection`. The icon box is 20px at Large and Medium and 16px
 * at Small, with a 4px gap. `rightSection` is available too, though the design only draws a leading
 * icon.
 */
export const WithIcon: Story = {
  render: (args) => (
    <Stack gap="24">
      {SIZES.map((size) => (
        <Group key={size} gap="16" align="center">
          <Label {...args} size={size} leftSection={<IconCheck />}>
            Leading
          </Label>
          <Label {...args} size={size} variant="filled" leftSection={<IconInformation />}>
            Gradient
          </Label>
          <Label {...args} size={size} variant="outline" rightSection={<IconCheck />}>
            Trailing
          </Label>
        </Group>
      ))}
    </Stack>
  ),
}

/**
 * Radius follows the size in Figma, which is what the first row shows. The other two rows are
 * deviations, available for a call site that needs one shape at every size: Figma's 1000px pill
 * (`Border Radius/round`) and its 4px corner (`Border Radius/small`).
 */
export const Radius: Story = {
  render: (args) => (
    <Stack gap="24">
      {([undefined, 'round', 'sm'] as const).map((radius) => (
        <Stack key={radius ?? 'default'} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
            {radius ? `radius="${radius}"` : 'from the size, as Figma binds it'}
          </Text>
          <Group gap="16" align="center">
            {SIZES.map((size) => (
              <Label key={size} {...args} size={size} radius={radius}>
                {SIZE_LABELS[size]}
              </Label>
            ))}
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
}

/** Every style against every size — the grid to scan when checking a change against Figma. */
export const Matrix: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Stack key={variant} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
            {VARIANT_LABELS[variant]}
          </Text>
          <Group gap="16" align="center">
            {SIZES.map((size) => (
              <Label key={size} {...args} variant={variant} size={size} leftSection={<IconCheck />}>
                {SIZE_LABELS[size]}
              </Label>
            ))}
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
}
