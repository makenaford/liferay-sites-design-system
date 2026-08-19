import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Stack, Text } from '@mantine/core'
import { Link } from './Link'
import { IconArrowForward, IconArrowRight } from '../../icons'

const VARIANTS = ['default', 'secondary'] as const
const SIZES = ['lg', 'md', 'sm'] as const

const SIZE_LABELS: Record<(typeof SIZES)[number], string> = {
  lg: 'Large',
  md: 'Medium',
  sm: 'Small',
}

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'CTA Link',
    variant: 'default',
    size: 'lg',
    href: '#',
  },
  argTypes: {
    variant: {
      options: VARIANTS,
      control: 'inline-radio',
      description: 'Figma Style (named Primary / Secondary there). `secondary` is white — dark surfaces only.',
    },
    size: {
      options: SIZES,
      control: 'inline-radio',
      description: 'Figma Size. Large 21px, Medium 18px, Small 14px — the icon scales with it.',
    },
    underline: {
      options: ['never', 'hover', 'always'],
      control: 'inline-radio',
      description: "Figma's Underline boolean defaults to false, so this defaults to `never`.",
    },
    leftSection: { control: false },
    rightSection: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'A themed Mantine `Anchor` matching the Figma `Link` component set — an inline row of label and optional icons with a 4px gap.',
          '',
          'Unlike Button, the icon box scales with the label (20px / 16px / 12px). All 30 Figma variants bind their label to a colour token, so every state below is read from the file rather than derived.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. Hover and click to see the colour shifts. */
export const Playground: Story = {
  args: {
    rightSection: <IconArrowForward />,
  },
}

/**
 * The two styles. `secondary` is `Action/Neutral/Default` — white in both Figma colour modes — so it
 * only reads on a dark surface. Switch the toolbar to Light to see the problem.
 */
export const Variants: Story = {
  render: (args) => (
    <Group gap="32">
      {VARIANTS.map((variant) => (
        <Link key={variant} {...args} variant={variant}>
          {variant}
        </Link>
      ))}
    </Group>
  ),
  args: {
    rightSection: <IconArrowForward />,
  },
}

/** Large, Medium and Small. The label and the icon box both change. */
export const Sizes: Story = {
  render: (args) => (
    <Group gap="32" align="center">
      {SIZES.map((size) => (
        <Link key={size} {...args} size={size}>
          {SIZE_LABELS[size]}
        </Link>
      ))}
    </Group>
  ),
  args: {
    rightSection: <IconArrowForward />,
  },
}

/** Figma's Icon axis: leading, trailing, both, or none. */
export const Icons: Story = {
  render: (args) => (
    <Group gap="32">
      <Link {...args} leftSection={<IconArrowForward />}>
        Left
      </Link>
      <Link {...args} rightSection={<IconArrowForward />}>
        Right
      </Link>
      <Link {...args} leftSection={<IconArrowForward />} rightSection={<IconArrowForward />}>
        Both
      </Link>
      <Link {...args}>None</Link>
    </Group>
  ),
}

/**
 * Hover, active, visited and disabled are all specified in Figma. `default` moves through the
 * `Action/Link/*` ramp; `secondary` shifts to `Surfaces/Text/Primary`, which on a dark surface is a
 * barely perceptible `#ffffff` -> `#f0f1f5` — hence the underline column.
 *
 * Note Figma leaves `secondary` disabled at full-contrast `Surfaces/Text/Primary`, so it does not read
 * as disabled. Reproduced as drawn; see README.md.
 */
export const States: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Stack key={variant} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
            {variant}
          </Text>
          <Group gap="32">
            <Link {...args} variant={variant}>
              Interactive
            </Link>
            <Link {...args} variant={variant} underline="hover">
              Underline on hover
            </Link>
            <Link {...args} variant={variant} href="https://example.com">
              Visited
            </Link>
            <Link {...args} variant={variant} aria-disabled="true">
              Disabled
            </Link>
          </Group>
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    rightSection: <IconArrowForward />,
  },
}

/**
 * Figma's Large link is drawn with the stroked `arrow/arrow_right` icon while Medium and Small use
 * the filled `Navigation / arrow forward`. Both ship, and the icon is a prop, so this is a choice
 * rather than something the component decides — see the note in README.md.
 */
export const ArrowGlyphs: Story = {
  render: (args) => (
    <Stack gap="16">
      <Group gap="32" align="center">
        {SIZES.map((size) => (
          <Link key={size} {...args} size={size} rightSection={<IconArrowForward />}>
            arrow forward
          </Link>
        ))}
      </Group>
      <Group gap="32" align="center">
        {SIZES.map((size) => (
          <Link key={size} {...args} size={size} rightSection={<IconArrowRight />}>
            arrow_right
          </Link>
        ))}
      </Group>
    </Stack>
  ),
}

/** Every style against every size. */
export const Matrix: Story = {
  render: (args) => (
    <Stack gap="24">
      {VARIANTS.map((variant) => (
        <Group key={variant} gap="32" align="center">
          {SIZES.map((size) => (
            <Link key={size} {...args} variant={variant} size={size}>
              {variant}
            </Link>
          ))}
        </Group>
      ))}
    </Stack>
  ),
  args: {
    rightSection: <IconArrowForward />,
  },
}
