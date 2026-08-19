import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { Button } from './Button'
import { IconArrowRight, IconRefresh } from '../../icons'

/** The four Figma appearances, in the order they are enumerated for design review. */
const VARIANTS = ['filled', 'outline', 'neutral', 'rounded'] as const
const SIZES = ['lg', 'md', 'sm'] as const

const SIZE_LABELS: Record<(typeof SIZES)[number], string> = {
  lg: 'Large',
  md: 'Medium',
  sm: 'Small',
}

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'filled',
    size: 'lg',
    disabled: false,
  },
  argTypes: {
    variant: {
      options: VARIANTS,
      control: 'inline-radio',
      description: 'Figma Color x Style, flattened. `neutral` is Color Neutral; `rounded` is the pill.',
    },
    size: {
      options: SIZES,
      control: 'inline-radio',
      description: 'Figma Size. Large 56px, Medium 48px, Small 40px tall.',
    },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Mantine `Button` themed to the Figma `Button` component set (node `16123:189647`).',
          '',
          "Figma spreads the appearance over two axes — Color (Primary | Neutral) and Style (Solid | Outline | Rounded) — which are collapsed into Mantine's single `variant` prop so the variations read as one flat list. Icons come from `leftSection` / `rightSection`.",
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Start here to try a combination. */
export const Playground: Story = {
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />,
  },
}

/**
 * The four appearances. `filled`, `rounded` and `neutral` are gradient fills; `outline` is the
 * glass treatment — a translucent sheen over a blurred backdrop, so it takes on whatever sits
 * behind it.
 */
export const Variants: Story = {
  render: (args) => (
    <Group gap="16">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </Group>
  ),
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />,
  },
}

/** Large, Medium and Small. Height, padding, gap, label size and corner radius all change. */
export const Sizes: Story = {
  render: (args) => (
    <Group gap="16" align="center">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {SIZE_LABELS[size]}
        </Button>
      ))}
    </Group>
  ),
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />,
  },
}

/** Figma's Icon axis: a leading icon, a trailing icon, both, or neither. */
export const Icons: Story = {
  render: (args) => (
    <Group gap="16">
      <Button {...args} leftSection={<IconRefresh />}>
        Left
      </Button>
      <Button {...args} rightSection={<IconArrowRight />}>
        Right
      </Button>
      <Button {...args} leftSection={<IconRefresh />} rightSection={<IconArrowRight />}>
        Both
      </Button>
      <Button {...args}>None</Button>
    </Group>
  ),
}

/**
 * Hover, focus and pressed are real CSS states — hover and click these to see them, or tab to one
 * for the focus ring. Only Disabled is a prop, and Figma draws it as the default fill at 50%
 * opacity.
 */
export const States: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Stack key={variant} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
            {variant}
          </Text>
          <Group gap="16">
            <Button {...args} variant={variant}>
              Interactive
            </Button>
            <Button {...args} variant={variant} disabled>
              Disabled
            </Button>
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />,
  },
}

/** Every variant against every size — the grid to scan when checking a change against Figma. */
export const Matrix: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Group key={variant} gap="16" align="center">
          {SIZES.map((size) => (
            <Button key={size} {...args} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </Group>
      ))}
    </Stack>
  ),
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />,
  },
}
