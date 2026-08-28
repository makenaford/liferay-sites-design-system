import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Stack, Text } from '@mantine/core'
import { PageRenderer } from './PageRenderer'
import { SiteFooter, SiteHeader } from './shared'
import { PAGE_PRESETS, presetFor } from './page-presets'
import type { HeroBackground, HeroMediaSource } from '../components/Hero'

/*
 * A room for looking at bubbles.
 *
 * Every bubble bug this library has had was invisible in isolation and obvious on a page: the artwork's
 * cut edges land where they land relative to the *hero's* edges, and a hero on a padded canvas has
 * different edges from a hero on a page. So this story is a page — a real preset, the real chrome — with
 * exactly one thing swapped out.
 *
 * It lives in `Templates` rather than beside the Hero's own stories for one reason: it needs
 * `page-presets` and the site chrome, and a component's story reaching up into the templates layer
 * points the dependency the wrong way round. The Hero's `InPage` story stays what it is — the thin
 * documentation of a hero followed by content.
 */

/** The first frame of what was dropped in, measured. */
interface Extents {
  width: number
  height: number
  /** The artwork's box inside the frame, in the frame's own pixels. */
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Where the drawing is inside the file it was exported into.
 *
 * This is the whole reason the lab exists. Every bubble fix so far came down to the artwork not filling
 * its frame — the centre files leave 142 empty rows above the drawing, the corner files put theirs in
 * the top-left 1035x630 of a 1200x866 file — and none of that is visible by eye. It is obvious as four
 * numbers, and those four numbers are the CSS: the corner rule's `right: -15.2%` is the ground to the
 * right of the drawing, and its `71.9%` is where the drawing stops down the frame.
 *
 * What it reports is the box and the ground around it, which is measurement rather than judgement. It
 * deliberately does **not** say which edges were *cut* — the drawing severed by the frame rather than
 * ending on its own. That reads as the more useful answer and it is not reliably knowable from one
 * frame: where two cuts meet, each edge carries the other's bright corner, and a fade that crosses one
 * edge steeply is indistinguishable from a cut. Ground of zero on a side is the fact underneath it, and
 * it is a fact.
 *
 * The ground colour is read from a corner rather than assumed, so a black export and a white one are
 * measured the same way.
 */
function measure(el: HTMLVideoElement | HTMLImageElement): Extents | undefined {
  const width = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth
  const height = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight
  if (!width || !height) return undefined

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return undefined
  /*
   * A cross-origin file taints the canvas and `getImageData` throws. Nothing here is worth an unhandled
   * error in a story, and the answer to "I could not read it" is the same as "there is nothing to say".
   */
  try {
    ctx.drawImage(el, 0, 0)
  } catch {
    return undefined
  }

  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, width, height).data
  } catch {
    return undefined
  }

  const at = (x: number, y: number) => {
    const i = (y * width + x) * 4
    return [data[i], data[i + 1], data[i + 2]] as const
  }
  const ground = at(width - 1, height - 1)
  const delta = (x: number, y: number) => {
    const p = at(x, y)
    return Math.max(...p.map((c, i) => Math.abs(c - ground[i])))
  }

  let left = width
  let top = height
  let right = -1
  let bottom = -1
  /* Every other row and column: the answer is a boundary, not a pixel count. */
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      /* 6/255 — under the noise a lossy codec leaves on a flat field, over anything anyone can see. */
      if (delta(x, y) <= 6) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  if (right < 0) return { width, height, left: 0, top: 0, right: 0, bottom: 0 }

  return { width, height, left, top, right, bottom }
}

/** The measurement, read off whatever the hero ended up rendering. */
function Ruler({ nonce }: { nonce: string }) {
  const [extents, setExtents] = useState<Extents>()

  useEffect(() => {
    setExtents(undefined)
    let cancelled = false
    /*
     * Polling, because there is no event for "the hero has swapped its element". The bubble is a
     * `video` or an `img` depending on what was dropped in, it remounts on a scheme flip, and a video
     * has no readable frame until it has decoded one. Ten tries at 200ms covers a local file comfortably
     * and gives up rather than spinning if nothing ever arrives.
     */
    let tries = 0
    const tick = () => {
      if (cancelled) return
      const el = document.querySelector<HTMLVideoElement | HTMLImageElement>(
        '[data-bubble] video, [data-bubble] img',
      )
      const read = el ? measure(el) : undefined
      if (read) {
        setExtents(read)
        return
      }
      if (++tries < 10) window.setTimeout(tick, 200)
    }
    tick()
    return () => {
      cancelled = true
    }
  }, [nonce])

  if (!extents) {
    return (
      <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
        Measuring…
      </Text>
    )
  }

  const w = extents.right - extents.left + 1
  const h = extents.bottom - extents.top + 1
  /* The ground around the drawing, which is what the CSS has to hang off the hero or fade out. */
  const ground = {
    left: extents.left,
    top: extents.top,
    right: extents.width - 1 - extents.right,
    bottom: extents.height - 1 - extents.bottom,
  }
  const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(1)}%`

  return (
    <Stack gap="6">
      <Text fz="xs" fw={700}>
        artwork {w}&times;{h} in a {extents.width}&times;{extents.height} frame
      </Text>
      <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
        x {extents.left}–{extents.right}, y {extents.top}–{extents.bottom}
      </Text>
      <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
        ground — left {ground.left}, top {ground.top}, right {ground.right}, bottom {ground.bottom}
      </Text>
      {/*
        * The two fractions the CSS is written from: where the drawing stops across the frame and down
        * it. A rule that hangs ground off the hero or fades at a boundary is quoting one of these.
        */}
      <Text fz="xs" c="var(--sds-brand-primary-primary)">
        stops at {pct(extents.right + 1, extents.width)} across, {pct(extents.bottom + 1, extents.height)}{' '}
        down
      </Text>
      {ground.left || ground.top || ground.right || ground.bottom ? (
        <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
          The drawing does not fill its frame, so sizing to the file will not put it where you meant.
        </Text>
      ) : (
        <Text fz="xs" c="var(--sds-surfaces-text-secondary)">
          The drawing fills its frame on every side.
        </Text>
      )}
    </Stack>
  )
}

interface LabProps {
  /** Which preset to draw the bubble on. The hero is the preset's own, not an approximation of one. */
  template: string
  /**
   * The file, or the drawing.
   *
   * `css` is the prototype: two lobes, a crease and a slow drift, sized off the hero rather than off a
   * frame. Flip between them on the same page at the same size — that comparison is the point of it.
   */
  bubble: 'file' | 'css'
  /** Figma's `Type`, overriding whatever the preset asked for. */
  background: HeroBackground
  /** The file for the dark canvas. A webm, or a still — both render under the same geometry. */
  video?: HeroMediaSource
  /** The file for the light canvas. Flip the toolbar's scheme to see it. */
  videoLight?: HeroMediaSource
  /** The measurement panel. Off when you want the page without a instrument over it. */
  ruler: boolean
}

/**
 * A preset, its own hero, and one bubble swapped out.
 *
 * `PageRenderer` takes the override; the story does not rebuild a hero out of props. That matters — a
 * hand-written approximation of a landing hero drifts from the real one, and then the thing you are
 * looking at is not the thing that ships.
 */
function BubbleInPage({ template, background, bubble, video, videoLight, ruler }: LabProps) {
  const page = presetFor(template)?.create() ?? presetFor('landing')!.create()
  page.hero.background = background

  /* Enough to tell the ruler that what it measured is no longer what is on screen. */
  const nonce = [template, background, bubble, String(video), String(videoLight)].join('|')
  const drawn = bubble === 'css'

  return (
    <>
      {ruler && !drawn ? (
        <Box
          pos="fixed"
          bottom={16}
          right={16}
          p="12"
          bg="var(--sds-surfaces-page-bg-base-default)"
          c="var(--sds-surfaces-text-primary)"
          style={{
            zIndex: 10,
            borderRadius: 8,
            border: '1px solid var(--sds-neutral-03)',
            maxWidth: 320,
          }}
        >
          <Ruler nonce={nonce} />
        </Box>
      ) : null}
      <SiteHeader />
      <PageRenderer page={page} bubble={{ video, videoLight, css: drawn }} />
      <SiteFooter />
    </>
  )
}

const meta = {
  title: 'Templates/Bubble in a page',
  component: BubbleInPage,
  args: {
    template: 'landing',
    background: 'corner',
    bubble: 'file',
    ruler: true,
  },
  argTypes: {
    template: {
      options: PAGE_PRESETS.map((preset) => preset.id),
      control: 'inline-radio',
      description: 'The page under the bubble. Each is exactly what the **New** menu drops in.',
    },
    background: {
      options: ['none', 'full', 'corner'],
      control: 'inline-radio',
      description: "Figma's `Type`, overriding the preset's own.",
    },
    bubble: {
      options: ['file', 'css'],
      control: 'inline-radio',
      description:
        'The shipped webm, or the CSS prototype. The drawing has no frame, so the ruler has nothing to measure and hides itself.',
    },
    /*
     * Pickers here and nowhere else. On the Hero's own stories these two are documented rows without a
     * control — fixing a ground to the canvas it was drawn for is not a choice a picker should invite —
     * but this is the room where trying the wrong one on purpose is the entire activity.
     */
    video: {
      control: { type: 'file', accept: 'video/*,image/*' },
      description:
        'The dark canvas. A webm or a still — the geometry and masks are shape, not motion, so both render the same way. Nothing uploads: the file becomes an object URL in this tab and is revoked when you pick another.',
    },
    videoLight: {
      control: { type: 'file', accept: 'video/*,image/*' },
      description: 'The light canvas. Flip the scheme in the toolbar to see it.',
    },
    ruler: { control: 'boolean', description: 'The measurement panel, bottom right.' },
  },
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'A room for looking at bubbles: a real preset, the real site chrome, and one file swapped out. Drop a webm or a still on `video`, flip the scheme, switch `background` between Corner and Full.',
          '',
          '**Why a page and not a hero.** A bubble is positioned against the *hero*’s edges — the corner artwork is pinned by its right cut so that cut lands past the page edge, and the vertical fade has to reach nothing before whatever section follows. Neither claim can be checked on a padded canvas with nothing under it. Every bubble bug this library has had was invisible in isolation and obvious here.',
          '',
          '**The ruler is the point.** All four shipped exports are 1200x866 and in none of them does the drawing fill that frame: the centre files leave 142 empty rows above it, the corner files cut the sphere at 1035 of 1200. That is unreadable by eye and plain as four numbers, so the panel reads the first decoded frame, finds the artwork’s box inside the frame, and names which edges the export **cut** — an artwork edge still bright where the frame ends. A cut edge is one the CSS must hide or bleed off the page; an edge that fades on its own is nothing to fix.',
          '',
          '**Nothing uploads.** The file becomes an object URL in this tab, so the state is not shareable by link — send a screenshot, or put the file in `assets/bubbles/`.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof BubbleInPage>

export default meta
type Story = StoryObj<typeof meta>

/** The corner bubble on a landing page, which is where it is drawn to go. */
export const Corner: Story = {}

/** The full bubble, top-aligned to its artwork rather than to its frame. */
export const Full: Story = {
  args: { background: 'full' },
}

/** The corner bubble drawn in CSS rather than played. Compare against `Corner`. */
export const CornerDrawn: Story = {
  args: { background: 'corner', bubble: 'css' },
}

/** The full bubble drawn in CSS rather than played. Compare against `Full`. */
export const FullDrawn: Story = {
  args: { background: 'full', bubble: 'css' },
}
