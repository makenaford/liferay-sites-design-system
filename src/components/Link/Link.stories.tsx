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
      description:
        'Defaults to `hover` — the non-colour state cue WCAG 1.4.1 asks for. Use `always` inside a paragraph.',
    },
    disabled: {
      control: 'boolean',
      description: 'Drops the href, so the element stops being a focusable, activatable link.',
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
          'Unlike Button, the icon box scales with the label (20px / 16px / 12px).',
          '',
          "The `default` style uses Figma's colour ramp unchanged. The `secondary` style is restructured against WCAG, because Figma only ever draws it on the dark canvas — see the **States** story and the state table in README.md.",
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
 * The two styles. `secondary` now uses the mode-aware `Surfaces/Text/Primary` rather than Figma's
 * hard `#ffffff`, so it reads in both colour modes — switch the toolbar to Light and both still
 * appear.
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
 * Hover, focus, active, visited and disabled. Hover and click these, and tab to them for the focus
 * ring — every state carries a non-colour cue as well as a colour change.
 *
 * `default` uses Figma's ramp as drawn. `secondary` is restructured: its resting colour is the
 * mode-aware neutral, and hover moves to the link accent instead of the 4% shift Figma specifies.
 * Disabled drops the href entirely, so tabbing skips it.
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
            <Link {...args} variant={variant} underline="always">
              Always underlined
            </Link>
            <Link {...args} variant={variant} href="https://example.com">
              Visited
            </Link>
            <Link {...args} variant={variant} disabled>
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
 * A link inside a paragraph needs `underline="always"`: at rest it has to be distinguishable from the
 * text around it, and colour alone does not do that (WCAG 1.4.1). The default `hover` underline is for
 * standalone links, where being a separate element is itself the cue.
 */
export const InProse: Story = {
  render: (args) => (
    <Text maw={520} c="var(--sds-surfaces-text-secondary)">
      Tokens are exported from Figma and committed to the repo, so the theme is generated rather than
      transcribed. The{' '}
      <Link {...args} size="md" underline="always">
        design tokens page
      </Link>{' '}
      renders every value straight from that export, and the{' '}
      <Link {...args} size="md" underline="always" variant="secondary">
        secondary style
      </Link>{' '}
      is shown alongside it for comparison.
    </Text>
  ),
  args: { rightSection: undefined },
  parameters: { frame: { width: 560 } },
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
