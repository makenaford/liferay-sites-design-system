import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, Text } from '@mantine/core'
import { Banner } from './Banner'
import { Link } from '../Link'
import { IconAlert, IconRocket, IconArrowRight } from '../../icons'

const meta = {
  title: 'Components/Banner',
  component: Banner,
  args: {
    tone: 'brand',
    label: 'New',
    align: 'center',
    position: 'static',
    children: 'Liferay DXP 2026.Q3 is generally available — self-hosted and SaaS.',
  },
  argTypes: {
    tone: {
      options: ['brand', 'accent', 'neutral'],
      control: 'inline-radio',
      description: 'The wash and the pill colour.',
    },
    align: { options: ['center', 'left'], control: 'inline-radio' },
    position: { options: ['static', 'sticky'], control: 'inline-radio' },
    icon: { control: false },
    action: { control: false },
    onClose: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The announcement band across the top of the site: one sentence, a category pill, one link and a dismiss button, in a 40px strip above the header.',
          '',
          'It is deliberately the quietest coloured surface in the library. The wash is two stops of `color-mix()` against `Surfaces/Page BG base/Default` — the brand at 10% on one side, 4% or `Accent/Product Accent` on the other — so the band is always a tint of the page it sits on. One declaration then serves both colour schemes, and the tint never competes with the `Header` glass above it, which is that same page background at 60%.',
          '',
          '**Not in Figma.** Every other component here traces to a node in `Solutions Library- 2026`; this one has no cell in the file yet, so its axes are proposals rather than transcriptions and it carries no Code Connect mapping.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

const releaseLink = (
  <Link href="#" size="sm" rightSection={<IconArrowRight />}>
    Read the release notes
  </Link>
)

/** Every prop wired to a control. */
export const Playground: Story = {
  args: { action: releaseLink, onClose: () => {} },
}

/**
 * The three washes. `brand` is the default release note, `accent` carries the blue into
 * `Accent/Product Accent` for a campaign that has to be told apart, and `neutral` is the quietest —
 * procedural news that has to be seen but not sold.
 */
export const Tones: Story = {
  render: (args) => (
    <Stack gap={0}>
      <Banner {...args} tone="brand" label="New" action={releaseLink}>
        Liferay DXP 2026.Q3 is generally available — self-hosted and SaaS.
      </Banner>
      <Banner
        {...args}
        tone="accent"
        label="Event"
        icon={<IconRocket />}
        action={
          <Link href="#" size="sm" rightSection={<IconArrowRight />}>
            Register
          </Link>
        }
      >
        DEVCON 2026 — Amsterdam, 12–14 May. Early-bird pricing ends Friday.
      </Banner>
      <Banner
        {...args}
        tone="neutral"
        label="Maintenance"
        icon={<IconAlert />}
        action={
          <Link href="#" size="sm">
            See the maintenance window
          </Link>
        }
      >
        Publishing is read-only on Sunday, 02:00–04:00 UTC.
      </Banner>
    </Stack>
  ),
}

/**
 * `align="left"` ranges the message in the page gutter and pushes the dismiss button to the far edge —
 * the band then reads as part of the page rather than as an announcement over it. Centred is the
 * default, and the one to use above a centred header.
 */
export const Alignment: Story = {
  render: (args) => (
    <Stack gap={0}>
      <Banner {...args} align="center" action={releaseLink} onClose={() => {}} />
      <Banner {...args} align="left" action={releaseLink} onClose={() => {}} />
    </Stack>
  ),
}

/**
 * Dismissal is the caller's to keep.
 *
 * `onClose` fires and nothing else happens: the banner does not hide itself and does not remember. Only
 * the page knows which announcement this is and how long "dismissed" should last — this session, this
 * browser, this account — so it drops the banner from the tree and persists that decision itself.
 */
export const Dismissible: Story = {
  render: function Dismissible(args) {
    const [open, setOpen] = useState(true)
    return (
      <Stack gap={16}>
        {open ? (
          <Banner {...args} action={releaseLink} onClose={() => setOpen(false)} />
        ) : null}
        <Text size="sm" c="dimmed" px={20}>
          {open ? 'Dismiss the banner above.' : 'Dismissed. Reload the story to bring it back.'}
        </Text>
      </Stack>
    )
  },
}

/**
 * Above the header, which is where it belongs.
 *
 * With a **static** header the banner simply precedes it and the two scroll away together. With a
 * **fixed** header the banner cannot precede it — the header is pinned to the viewport's top edge and
 * would cover the band — so put both in one fixed container and leave the header `static` inside it.
 */
export const WithPageChrome: Story = {
  render: (args) => (
    <div>
      <Banner {...args} action={releaseLink} onClose={() => {}} />
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 5.56vw, 80px)',
          borderBottom: '1px solid var(--sds-neutral-02)',
          background: 'var(--sds-surfaces-page-bg-base-default)',
        }}
      >
        <Text fw={700}>Header</Text>
        <Text size="sm" c="dimmed">
          Platform · Solutions · Resources
        </Text>
      </div>
      <div style={{ padding: 'clamp(20px, 5.56vw, 80px)' }}>
        <Text size="sm" c="dimmed">
          Page content starts here.
        </Text>
      </div>
    </div>
  ),
}
