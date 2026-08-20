import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, SimpleGrid, Stack, Text } from '@mantine/core'
import { Card } from './Card'
import { Button } from '../Button'
import { Image } from '../Image'
import { Label } from '../Label'
import { Link } from '../Link'
import { Stat, StatBar } from '../Stat'
import {
  IconArrowRight,
  IconArrowUp,
  IconGlassComposable,
  IconGlassDatabase,
  IconGlassMail,
} from '../../icons'

const SURFACES = ['glass', 'no-bg', 'grey', 'gradient-blue', 'gradient-purple'] as const

/** Stands in for a photograph: the stories have to render offline, so no remote images. */
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#adc9ff"/><stop offset="0.55" stop-color="#7414ff"/><stop offset="1" stop-color="#0b5fff"/>
  </linearGradient></defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <circle cx="150" cy="120" r="62" fill="#fff" opacity="0.8"/>
</svg>`)}`

function Cover({ ratio = '3:2' as const }) {
  return <Image src={PHOTO} alt="" ratio={ratio} radius={0} />
}

/** Figma's `card-image` `Property 1=Customer Story`: a customer logo centred on a flat panel. */
function CustomerThumb({ name }: { name: string }) {
  return (
    <Box
      bg="var(--sds-surfaces-card-bg-grey)"
      c="var(--sds-surfaces-text-primary)"
      fw={700}
      fz="21"
      style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}
    >
      {name}
    </Box>
  )
}

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    align: 'vertical',
    padding: 'all',
    headerAlign: 'vertical',
    titleSize: 'small',
    imageRatio: '3:2',
    interactive: false,
  },
  argTypes: {
    surface: {
      options: SURFACES,
      control: 'inline-radio',
      description:
        'Figma `Surface` `Style`. Defaults from `interactive`: `glass` when clickable, `grey` when not — glass is the clickable surface and a static card should not wear it.',
    },
    align: { options: ['vertical', 'horizontal'], control: 'inline-radio' },
    padding: {
      options: ['all', 'content', 'none'],
      control: 'inline-radio',
      description:
        '`all` is Figma’s `Padding=True`; `content` is its `no image padding` frame, where the image bleeds and the text stays inset; `none` is `Padding=False`.',
    },
    headerAlign: { options: ['vertical', 'center'], control: 'inline-radio' },
    titleSize: { options: ['small', 'full'], control: 'inline-radio' },
    imageRatio: { options: ['3:2', '16:9'], control: 'inline-radio' },
    interactive: {
      control: 'boolean',
      description: 'Hover and focus. Only for a card that really is a link or a button.',
    },
    image: { control: false },
    top: { control: false },
    hero: { control: false },
    main: { control: false },
    secondary: { control: false },
    bottom: { control: false },
    children: { control: false },
  },
  parameters: {
    frame: { width: 1040 },
    docs: {
      description: {
        component: [
          'Figma `card-main` (node `16728:26513`) with `Surface`, `card-image`, `header-alignment`, `Card hero` and `Content Text`.',
          '',
          '`card-main` is **one** component with four slots and a boolean per slot, and every card in the `Common Cards` set is that component with different slots filled. This mirrors it: a slot is a prop, and passing it is the toggle. There is no `type` prop, because Figma has not got one either — the five cards in `Card Examples` are five arrangements of the same thing, and each is five or six lines.',
          '',
          '**Where the hover goes depends on the layout, not on a style.** Figma’s `Surface` `State=Hover` cell is byte-for-byte its `State=Default`, so hover is inferred; `State=Focus` is the only state the file distinguishes, and it differs by one thing — the ring goes 1px to 2px. An image that runs to the card’s edge *is* the card’s edge, so a full-bleed card hovers on its **image** and a padded card hovers as a **card**.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Every prop wired to a control, with every slot filled so the arrangement is visible. */
export const Playground: Story = {
  args: {
    image: <Cover />,
    hero: (
      <Label size="sm" variant="outline">
        Label
      </Label>
    ),
    title: 'Card Title',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    bottom: (
      <Link href="#" size="md" rightSection={<IconArrowRight />}>
        Read more
      </Link>
    ),
  },
  render: (args) => (
    <Box w={320}>
      <Card {...args} />
    </Box>
  ),
}

/* ------------------------------------------------------------------ the five types in Card Examples */

/**
 * **`Type=Resource`** — `Surface Style=no-bg`, `Padding=False`, a 3:2 image, a Label hero and a title.
 * Nothing behind it: an image and two lines of text.
 *
 * This is the card the hover rule was written for. With no padding, the image is the card's edge, so the
 * hover is on the image alone — it scales inside its own box and lifts its brightness while the card
 * stays exactly where it is.
 */
export const Resource: Story = {
  render: (args) => (
    <Box w={320}>
      <Card
        {...args}
        component="a"
        href="#"
        interactive
        surface="no-bg"
        padding="none"
        image={<Cover />}
        hero={
          <Label size="sm" variant="outline">
            Guide
          </Label>
        }
        title="The composable enterprise, in twelve decisions"
      />
    </Box>
  ),
}

/**
 * **`Type=CS- Quote`** — `Padding=True`, a Customer Story image, a `Stat` in the **Top Content** slot,
 * a description with no title, and the quotee in **Bottom Content**.
 */
export const CustomerQuote: Story = {
  render: (args) => (
    <Box w={320}>
      <Card
        {...args}
        image={<CustomerThumb name="Advanced Energy" />}
        top={<Stat size="sm" value="845" label="Months to Launch" rightSection={<IconArrowUp />} />}
        description="Liferay’s out-of-the-box features let us stand up eleven regional sites in a single quarter, on one codebase."
        bottom={
          <Stack gap="4">
            <Text fz="16" fw={600} c="var(--sds-surfaces-text-primary)">
              Anne Anderson
            </Text>
            <Text
              fz="12"
              fw={600}
              c="var(--sds-surfaces-text-secondary)"
              tt="uppercase"
              style={{ letterSpacing: '0.04em' }}
            >
              VP of Experience and Change Management
            </Text>
          </Stack>
        }
      />
    </Box>
  ),
}

/** **`Type=CS- Details`** — the same padded shape with a title and a description, and no slots. */
export const CustomerStory: Story = {
  render: (args) => (
    <Box w={320}>
      <Card
        {...args}
        component="a"
        href="#"
        interactive
        image={<CustomerThumb name="Advanced Energy" />}
        title="NGO Empowers Educators and Families Across Twelve Countries"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Box>
  ),
}

/**
 * **`Type=Icon-Left`** — no image, so `card-main`'s gap opens from 16 to 20. A 40px glass icon as the
 * hero, a title and a description.
 */
export const IconLeft: Story = {
  render: (args) => (
    <Box w={320}>
      <Card
        {...args}
        hero={<IconGlassComposable width={40} height={40} />}
        title="Card Title"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do."
      />
    </Box>
  ),
}

/** **`Type=Icon-Center`** — the same card with `header-alignment Align=Center`: centred, gap 20, no description. */
export const IconCenter: Story = {
  render: (args) => (
    <Box w={320}>
      <Card
        {...args}
        headerAlign="center"
        hero={<IconGlassDatabase width={40} height={40} />}
        title="Card Title"
      />
    </Box>
  ),
}

/** The five cards from `Card Examples`, side by side. */
export const CardExamples: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="24" verticalSpacing="40">
      <Card
        {...args}
        component="a"
        href="#"
        interactive
        surface="no-bg"
        padding="none"
        image={<Cover />}
        hero={
          <Label size="sm" variant="outline">
            Guide
          </Label>
        }
        title="Resource"
      />
      <Card
        {...args}
        image={<CustomerThumb name="Advanced Energy" />}
        top={<Stat size="sm" value="845" label="Months to Launch" rightSection={<IconArrowUp />} />}
        description="CS- Quote: a stat on top, a quote, and the quotee underneath."
        bottom={
          <Text fz="16" fw={600}>
            Anne Anderson
          </Text>
        }
      />
      <Card
        {...args}
        component="a"
        href="#"
        interactive
        image={<CustomerThumb name="Advanced Energy" />}
        title="CS- Details"
        description="A title and a description over a customer thumbnail."
      />
      <Card
        {...args}
        hero={<IconGlassComposable width={40} height={40} />}
        title="Icon-Left"
        description="No image, so the stack opens to 20px."
      />
      <Card
        {...args}
        headerAlign="center"
        hero={<IconGlassMail width={40} height={40} />}
        title="Icon-Center"
      />
    </SimpleGrid>
  ),
}

/* ------------------------------------------------------------------------------ the axes */

/**
 * The three padding shapes. The middle one is Figma's `no image padding` frame: `card-main` is still
 * `Padding=True`, but the 20px has been moved down onto the content so the image can reach the edge.
 */
export const Padding: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="24">
      {(['all', 'content', 'none'] as const).map((padding) => (
        <Stack key={padding} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
            padding=&quot;{padding}&quot;
          </Text>
          <Card
            {...args}
            padding={padding}
            surface={padding === 'none' ? 'no-bg' : 'glass'}
            interactive
            component="a"
            href="#"
            image={<Cover />}
            title="Card Title"
            description="Where the twenty pixels go."
          />
        </Stack>
      ))}
    </SimpleGrid>
  ),
}

/**
 * Figma's `Surface` `Style` axis, set explicitly. **`glass` is shown here as a clickable card**, because
 * that is the only kind that should have it — see `NonClickableSurfaces` for the rule.
 */
export const Surfaces: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="24" verticalSpacing="24">
      {SURFACES.map((surface) => (
        <Card
          {...args}
          key={surface}
          surface={surface}
          interactive={surface === 'glass' || surface === 'no-bg'}
          component={surface === 'glass' || surface === 'no-bg' ? 'a' : 'div'}
          href={surface === 'glass' || surface === 'no-bg' ? '#' : undefined}
          hero={
            <Label size="sm" variant="outline">
              {surface}
            </Label>
          }
          title="Card Title"
          description="One surface, six ways."
        />
      ))}
    </SimpleGrid>
  ),
}

/**
 * **A card that is not clickable uses `grey`, never `glass`** — and it gets there on its own,
 * because `surface` defaults from `interactive`. Glass exists to carry the interaction: the hairline that
 * warms, the ring that appears, the lift. On a static card none of those ever fire, so glass promises
 * something the card does not do. `grey` is the only static surface — Figma's `Blue` cell was removed for
 * being indistinguishable from it.
 *
 * Neither card below passes `surface`. The left one is a link and comes out glass; the right one is not and
 * comes out grey.
 */
export const NonClickableSurfaces: Story = {
  render: (args) => (
    <SimpleGrid cols={2} spacing="24">
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          interactive — glass
        </Text>
        <Card
          {...args}
          component="a"
          href="#"
          interactive
          hero={<IconGlassComposable width={40} height={40} />}
          title="Clickable"
          description="The whole card is a link, so it wears the interactive surface."
        />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          static — grey
        </Text>
        <Card
          {...args}
          hero={<IconGlassDatabase width={40} height={40} />}
          title="Not clickable"
          description="Nothing to click, so no hairline to warm and no ring to show."
        />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          static, set explicitly — same grey
        </Text>
        <Card
          {...args}
          surface="grey"
          hero={<IconGlassMail width={40} height={40} />}
          title="Not clickable"
          description="Grey is the only static surface; setting it changes nothing."
        />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          static with its own controls — still grey
        </Text>
        <Card
          {...args}
          hero={<IconGlassComposable width={40} height={40} />}
          title="Buttons inside"
          description="A container with controls is not a clickable card."
          bottom={<Button size="sm">Book a demo</Button>}
        />
      </Stack>
    </SimpleGrid>
  ),
}

/**
 * **The hover rule, side by side.** Both cards are links across their whole area. The left one is padded,
 * so the card lifts and its ring warms. The right one has a full-bleed image, so **only the image
 * reacts** — no lift, no ring — even though clicking anywhere on it still follows the link.
 *
 * Tab to either one to see the focus ring, which is on the whole card in both cases.
 */
export const Hover: Story = {
  render: (args) => (
    <SimpleGrid cols={2} spacing="24">
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          padding=&quot;all&quot; — the card leads
        </Text>
        <Card
          {...args}
          component="a"
          href="#"
          interactive
          image={<Cover />}
          title="Card Title"
          description="Rises 2px, ring warms, glow appears."
        />
      </Stack>
      <Stack gap="8">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
          padding=&quot;none&quot; — the image alone
        </Text>
        <Card
          {...args}
          component="a"
          href="#"
          interactive
          surface="no-bg"
          padding="none"
          image={<Cover />}
          hero={
            <Label size="sm" variant="outline">
              Guide
            </Label>
          }
          title="Card Title"
        />
      </Stack>
    </SimpleGrid>
  ),
}

/**
 * **`Align=Horizontal`** — Figma's wide card: 24/40 padding, gap 24, a 16px corner, `Content Text
 * Size=Full Card` at 32px, a `StatBar` in **Main Content 1** and links in **Bottom Content**.
 */
export const Horizontal: Story = {
  parameters: { frame: { width: 1280 } },
  render: (args) => (
    <Card
      {...args}
      align="horizontal"
      titleSize="full"
      hero={<IconGlassComposable width={48} height={48} />}
      title="Financial Services"
      description="Unify client and advisor data, and ship the same experience to every channel."
      main={
        <StatBar>
          <Stat value="845" label="Months to launch" rightSection={<IconArrowUp />} />
          <Stat value="98%" label="Uptime" rightSection={<IconArrowUp />} />
          <Stat value="3x" label="Faster releases" rightSection={<IconArrowUp />} />
        </StatBar>
      }
      bottom={
        <>
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            Read the customer story
          </Link>
          <Link href="#" size="md" rightSection={<IconArrowRight />}>
            See the platform
          </Link>
        </>
      }
      image={<Cover />}
    />
  ),
}

/** Every slot at once, labelled, so the order is legible. */
export const Slots: Story = {
  render: (args) => (
    <Box w={360}>
      <Card
        {...args}
        image={<Cover />}
        top={<Label size="sm" variant="filled">top</Label>}
        hero={
          <Label size="sm" variant="outline">
            hero
          </Label>
        }
        title="title"
        description="description"
        main={<Text fz="sm" c="var(--sds-surfaces-text-secondary)">main</Text>}
        secondary={<Text fz="sm" c="var(--sds-surfaces-text-secondary)">secondary</Text>}
        bottom={
          <Button size="sm" rightSection={<IconArrowRight />}>
            bottom
          </Button>
        }
      />
    </Box>
  ),
}

/** Buttons rather than a link in the bottom slot, in a card that is not itself clickable. */
export const WithButtons: Story = {
  render: (args) => (
    <Box w={360}>
      <Card
        {...args}
        hero={<IconGlassMail width={40} height={40} />}
        title="Talk to us"
        description="A card with its own controls is not a link: the buttons do the work."
        bottom={
          <>
            <Button size="sm">Book a demo</Button>
            <Link href="#" size="md">
              Contact sales
            </Link>
          </>
        }
      />
    </Box>
  ),
}

/** A row of cards of different lengths: `bottom` stays at the bottom of each. */
export const EqualHeights: Story = {
  render: (args) => (
    <SimpleGrid cols={3} spacing="24" style={{ alignItems: 'stretch' }}>
      {[
        ['One line.', 'Short'],
        ['Two lines, which is what most of these end up being in practice.', 'Medium'],
        [
          'Four or five lines, because somebody wrote the copy before the card existed and nobody wanted to cut it down afterwards.',
          'Long',
        ],
      ].map(([description, title]) => (
        <Card
          {...args}
          key={title}
          title={title}
          description={description}
          bottom={
            <Link href="#" size="md" rightSection={<IconArrowRight />}>
              Read more
            </Link>
          }
        />
      ))}
    </SimpleGrid>
  ),
}
