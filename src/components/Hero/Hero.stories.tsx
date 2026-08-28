import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Group, Stack, Text } from '@mantine/core'
import { Hero } from './Hero'
import { Button } from '../Button'
import { Label } from '../Label'
import { Link } from '../Link'
import { Stat, StatBar } from '../Stat'
import { TextInput } from '../Input'
import { IconArrowRight, IconArrowUp, IconCheck } from '../../icons'

/*
 * The bubble animations, resolved to URLs by the bundler. The library does not ship them inside its
 * JavaScript — they are 2MB and 1.7MB — so a call site points at the file the same way these stories do.
 */
import bubbleFull from '../../../assets/bubbles/bubble_center.webm'
import bubbleFullLight from '../../../assets/bubbles/bubble_center_light.webm'
import bubbleCorner from '../../../assets/bubbles/bubble_corner.webm'
import bubbleCornerLight from '../../../assets/bubbles/bubble_corner_light.webm'

/** Stands in for the hero shot: the stories have to render offline. */
function Shot() {
  return (
    <Box
      h={340}
      style={{ borderRadius: 8, display: 'grid', placeItems: 'center' }}
      bg="linear-gradient(135deg, var(--sds-brand-primary-lighten-4), var(--sds-accent-product-accent))"
      c="var(--sds-action-neutral-inverted)"
      fw={700}
    >
      Product shot
    </Box>
  )
}

/** The Gartner proof row: a logo lockup and the categories it names. */
function GartnerProof() {
  return (
    <>
      <Box
        px="12"
        py="6"
        style={{ borderRadius: 4, border: '1px solid var(--sds-neutral-03)' }}
        fw={700}
        fz="14"
      >
        Gartner
      </Box>
      <Group gap="8">
        <Label size="sm" variant="gradient">
          Magic Quadrant Leader
        </Label>
        <Label size="sm" variant="gradient">
          DXP 2026
        </Label>
      </Group>
    </>
  )
}

const meta = {
  title: 'Components/Hero',
  component: Hero,
  args: {
    background: 'corner',
    align: 'left',
    label: (
      <Label size="sm" variant="gradient">
        Platform
      </Label>
    ),
    title: <h1>One platform, every channel</h1>,
    description: 'Build once and deliver everywhere — websites, portals, commerce and search on one DXP.',
    actions: (
      <>
        <Button rightSection={<IconArrowRight />}>Book a demo</Button>
        <Link href="#" size="md">
          Read the docs
        </Link>
      </>
    ),
  },
  argTypes: {
    background: {
      options: ['none', 'full', 'corner'],
      control: 'inline-radio',
      description: "Figma's `Type`: Default, Full Bubble, Corner Bubble.",
    },
    align: { options: ['left', 'center'], control: 'inline-radio' },
    /*
     * Uploads, not URLs. Each takes a file straight from disk — pick one and the hero swaps to it —
     * because that is what a person has when they want to try an animation, and making them host it
     * first to get a string is a step that proves nothing.
     *
     * The descriptions are not decoration: `video` and `videoPoster` say nothing about *when* each is
     * on screen, and the answer is a loading state apart.
     */
    video: {
      control: { type: 'file', accept: 'video/*' },
      description:
        'The bubble animation for the dark canvas. Its black ground is blended away with `screen`, so upload something drawn on black — the light canvas takes `videoLight`, whose white ground comes off with `multiply`.',
    },
    /*
     * Documented, not driveable. `videoLight` is fixed by the story to the export drawn for the light
     * canvas, and the point of it is what happens when the scheme toolbar flips — a picker beside it
     * only invites putting the wrong ground on the wrong page. `videoPoster` is a loading state, and a
     * loading state a control can hold open is not the one anybody has.
     */
    videoLight: {
      control: false,
      description:
        'The same animation exported for the light canvas. Two files, because each carries its own ground: `video` is a bright sphere on black, this one a coloured sphere on white. The hero picks by the computed colour scheme — flip the toolbar and watch it swap.',
    },
    videoPoster: {
      control: false,
      description:
        'What stands in for `video` until it can play — and if it never can, so a missing file leaves a hero rather than a hole. An image or a video: HTML takes only an image on its own `poster` attribute, so a moving one is rendered behind the animation and swapped on `canplay`.',
    },
    label: { control: false },
    title: { control: false },
    actions: { control: false },
    media: { control: false },
    form: { control: false },
    proof: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'Mantine-free composition from the Figma `Hero` set (node `19110:9503`), with the slots the accompanying spreadsheet lists: label, header, description, buttons, link, input-with-button, Gartner logo and tags, and an image or video.',
          '',
          "The background is **a gradient in CSS with the webm on top**. The gradient needs no network, survives a blocked file, and is what shows under `prefers-reduced-motion` — where the video is not rendered at all, so it is never fetched. An autoplaying 2MB loop is exactly what that preference is for.",
          '',
          'The video is not bundled: pass its URL, **or a file**. Both `video` and `videoPoster` take a `File` as readily as a string, so a builder can hand over what someone just picked from disk without hosting it first — the hero makes the object URL and revokes it when the file changes. The controls below are file pickers for exactly that; drop a webm on `video` and watch the background change.',
          '',
          '**A file per canvas, each blended.** `screen` drops the dark export’s black ground, `multiply` the light export’s white one, against the hero’s own surface — both grounds are pure, which is what makes the blends exact. The fades that used to hide the files’ frames are gone with them: the artwork now plays at full strength everywhere it is seen, and one fade is left for what hangs below the hero’s foot.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control. The bubble plays behind the content. */
export const Playground: Story = {
  args: { video: bubbleCorner, videoLight: bubbleCornerLight, media: <Shot /> },
}

/** **Corner Bubble** with an image — Figma's `Type=Corner Bubble, Image=Yes`. */
export const CornerBubble: Story = {
  args: { background: 'corner', video: bubbleCorner, videoLight: bubbleCornerLight, media: <Shot /> },
}

/** **Full Bubble** — the animation fills the hero, centred and slightly high, behind the content. */
export const FullBubble: Story = {
  args: { background: 'full', video: bubbleFull, videoLight: bubbleFullLight, media: <Shot /> },
}

/** **Default** — no bubble at all, just the page surface. */
export const Default: Story = {
  args: { background: 'none', media: <Shot /> },
}

/**
 * **A moving poster.** `videoPoster` takes a video as readily as an image.
 *
 * HTML's own `poster` attribute takes an image and nothing else, so a motion poster is rendered as a
 * second video behind the animation and swapped out when the animation can play. Both keep running
 * while they wait — a paused stand-in shows as a frozen frame the moment it is revealed.
 *
 * It earns its keep where the animation is the heavy file and the poster is a light loop of the same
 * artwork: the hero moves from the first frame rather than sitting still until the download lands. Here
 * the corner bubble stands in for the centre one, which is the pairing you can see happen.
 */
export const MotionPoster: Story = {
  args: {
    background: 'full',
    video: bubbleFull,
    videoLight: bubbleFullLight,
    videoPoster: bubbleCorner,
    media: <Shot />,
  },
}

/**
 * **A poster that is all there is.** The animation's URL is broken, so the poster stays up.
 *
 * The animation is the enhancement and the poster is the page: a file that 404s leaves the stand-in
 * running rather than a hole where the hero was.
 */
export const PosterWhenTheVideoFails: Story = {
  args: {
    background: 'full',
    video: '/does-not-exist.webm',
    videoPoster: bubbleCorner,
    media: <Shot />,
  },
}

/** Centre aligned, with no media: Figma's `Alignnemt=Center, Image=No`. */
export const Centered: Story = {
  args: {
    background: 'full',
    video: bubbleFull,
    videoLight: bubbleFullLight,
    align: 'center',
    media: undefined,
    description:
      'Build once and deliver everywhere. One platform for websites, portals, commerce and search.',
  },
}

/**
 * **Form** — Figma's `Type=Form`: an email field with a contained button instead of the buttons. The
 * field is a real form, so Enter submits and the button is a submit button.
 */
export const Form: Story = {
  args: {
    background: 'corner',
    video: bubbleCorner,
    videoLight: bubbleCornerLight,
    actions: undefined,
    media: <Shot />,
    title: <h1>See it on your own content</h1>,
    description: 'Enter your work email and we will send a sandbox within the hour.',
    form: (
      <TextInput
        label="Work email"
        required
        placeholder="you@company.com"
        type="email"
        containedButton={<Button size="sm">Get access</Button>}
      />
    ),
  },
}

/**
 * **Minimal** — Figma's `Type=Minimal`, the cell that used to be called `Guide`; its placeholder in the
 * file still reads *"This Is An Example Of A Guide Title"*.
 *
 * A heading, one line under it, and the corner bubble. Nothing else: no label, no actions, no media. It
 * is the shortest hero in the set — a section header for a page whose content starts immediately — which
 * is why it is the one cell where `background` matters on its own.
 *
 * This story used to render a label, two actions and the Gartner proof row over a plain surface, which
 * was neither the old cell nor this one. `pnpm figma:drift` caught the rename; the drawing was wrong
 * independently of it.
 */
export const Minimal: Story = {
  args: {
    background: 'corner',
    media: undefined,
    label: undefined,
    title: <h1>This is an example of a guide title</h1>,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    actions: undefined,
  },
}

/** The Gartner logo and tags under a standard hero — the spreadsheet's last content slot. */
export const WithProof: Story = {
  args: { background: 'corner', video: bubbleCorner, videoLight: bubbleCornerLight, media: <Shot />, proof: <GartnerProof /> },
}

/** Stats in the hero, which is what the `children` slot is for. */
export const WithStats: Story = {
  args: {
    background: 'full',
    video: bubbleFull,
    videoLight: bubbleFullLight,
    media: undefined,
    align: 'center',
    children: (
      <Box pt="16" w="100%">
        <StatBar align="center">
          <Stat align="center" value="845" label="Months to launch" leftSection={<IconArrowUp />} />
          <Stat align="center" value="98%" label="Uptime" />
          <Stat align="center" value="3x" label="Faster releases" />
        </StatBar>
      </Box>
    ),
  },
}

/**
 * Without a `video`, the gradient stands on its own — which is also exactly what someone with
 * `prefers-reduced-motion` set sees, since the component does not render the video for them at all.
 */
export const GradientOnly: Story = {
  args: { background: 'corner', media: <Shot /> },
}

/** Stacked, as it renders below 1200px: the media drops under the content. */
export const Stacked: Story = {
  args: { background: 'corner', video: bubbleCorner, videoLight: bubbleCornerLight, media: <Shot /> },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

/** A page: the hero, then what follows it. */
export const InPage: Story = {
  args: { background: 'corner', video: bubbleCorner, videoLight: bubbleCornerLight, media: <Shot />, proof: <GartnerProof /> },
  render: (args) => (
    <>
      <Hero {...args} />
      <Stack gap="16" p="40" maw={800}>
        <Text fw={600} fz="var(--sds-size-heading-f4)">
          What comes next
        </Text>
        <Text c="var(--sds-surfaces-text-secondary)">
          The hero ends where the page begins — it is a section, not a layout, so it does not care what
          follows it.
        </Text>
        <Group gap="8">
          <IconCheck />
          <Text fz="sm" c="var(--sds-surfaces-text-secondary)">
            No fixed height, no overflow surprises.
          </Text>
        </Group>
      </Stack>
    </>
  ),
}
