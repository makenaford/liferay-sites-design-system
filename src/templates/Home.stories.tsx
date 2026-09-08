import type { Meta, StoryObj } from '@storybook/react-vite'
import { BUBBLE_DEFAULTS, type BubbleProps } from '../components/Bubble'
import { BUBBLE_ARG_TYPES } from '../components/Bubble/Bubble.argTypes'
import { HomePage } from './HomePage'

const meta = {
  title: 'Built Pages/Home',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The `Home` page from the Figma file (node `24563:52720`) — a 1440×8559 frame — built out of the library. Twelve sections, and everything on them is a real component: the header opens its mega menus, three separate pill sets swap the panel below them, the industry tabs retitle the card, the carousel scrolls and snaps, the marquee runs, the accordion expands, and both forms validate and submit.',
          '',
          'The copy, the numbers, the quotes and the link taxonomy are the file’s. So are the product screenshots and the platform diagram, which are committed under `assets/home/`. Customer and vendor logos are **not** — they are other companies’ trademarks rather than design-system assets, so stand-ins hold their place at the drawn size.',
          '',
          'Where the file is unfinished or contradicts itself, the README records what was done instead, under **What the Home template needed**.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The whole page. Scroll it, and use it — nothing here is a screenshot of a design. */
export const Page: Story = { render: () => <HomePage /> }

/** The same page at a phone's width, where every section collapses on its own. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <HomePage />,
}

/* ---------------------------------------------------------------- the phone preview
 *
 * Storybook's viewport addon resizes the *canvas*, which is the honest way to see a phone layout and a
 * poor way to work: the toolbar sets one width for whatever story you are on, and going back to the
 * desktop page means setting it back. `Narrow` above is that, kept because it is the cheapest way in.
 *
 * This is the other thing you want — a phone on a desk. It is an `iframe` at the device's width holding
 * the `Page` story, so what renders inside it has a real 375px viewport: `@media (max-width: 479px)`
 * resolves, `100vw` is 375, and the header drops its Contact Sales exactly as it does on a phone. A
 * `transform: scale()` on a desktop-width page would do none of that — it would draw the desktop layout
 * smaller, which is the one thing a mobile preview must not do.
 *
 * Same origin, so it is the same dev server, the same CSS and the same hot reload as the canvas around it.
 */

/*
 * The widths worth checking, keyed by the width itself.
 *
 * The annotation is a `labels` entry on the control rather than part of the key, so the arg value stays a
 * plain number: readable in the Controls panel, and usable in a URL — `&args=width:480` links someone
 * straight to the breakpoint you are talking about, which a key with an em-dash in it cannot do.
 */
const DEVICES = {
  320: { height: 720, label: '320 — smallest supported' },
  375: { height: 812, label: '375 — iPhone SE / mini' },
  390: { height: 844, label: '390 — iPhone 15/16' },
  430: { height: 932, label: '430 — iPhone Pro Max' },
  480: { height: 900, label: '480 — header CTA breakpoint' },
  768: { height: 1024, label: '768 — tablet' },
} as const

type DeviceWidth = keyof typeof DEVICES

const DEVICE_LABELS = Object.fromEntries(
  Object.entries(DEVICES).map(([w, d]) => [w, d.label]),
) as Record<string, string>

interface MobileArgs {
  width: DeviceWidth
  /** Fit the device's full height on screen. Off by default: a phone scrolls, and so should this. */
  fitHeight: boolean
}

function PhonePreview({ width, fitHeight, colorScheme }: MobileArgs & { colorScheme: string }) {
  const { height } = DEVICES[width]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        /* `fitHeight` caps the device to the canvas rather than shrinking it — the width stays true. */
        maxHeight: fitHeight ? '100%' : undefined,
      }}
    >
      {/*
       * The bezel is the wrapper's, not the frame's.
       *
       * A 1px border on the `iframe` itself comes off the viewport inside it — 375 became 373, and a
       * preview whose whole job is to be exact about width should not be two pixels out. So the device
       * chrome sits on a box around it and the frame is borderless at precisely the device width.
       */}
      <div
        style={{
          display: 'flex',
          minHeight: 0,
          flex: fitHeight ? '1 1 auto' : 'none',
          maxWidth: '100%',
          padding: 1,
          background: 'var(--sds-glass-line-to, rgba(255,255,255,.14))',
          /* A phone's own corner radius. Enough to read as a device, not enough to clip the content. */
          borderRadius: 29,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,.55)',
        }}
      >
        <iframe
          /*
           * `id` selects the story; `globals` carries the toolbar's colour scheme in, so the light/dark
           * switch above the canvas still drives the page inside the phone.
           *
           * `key` on both, because an `iframe` does not reload from a `src` change alone in every browser
           * and a stale frame at the previous width is worse than a flash.
           */
          key={`${width}-${colorScheme}`}
          title={`Home page at ${width}px`}
          src={`iframe.html?id=built-pages-home--page&viewMode=story&globals=colorScheme:${colorScheme}`}
          style={{
            width,
            height: fitHeight ? 'auto' : height,
            /* Only ever gives way to a canvas narrower than the device — see the `desktop-only` tag. */
            maxWidth: '100%',
            minHeight: 0,
            border: 0,
            borderRadius: 28,
            background: 'var(--sds-surfaces-page-bg-base-default, #0b0d14)',
            colorScheme: 'unset',
          }}
        />
      </div>
      <p
        style={{
          margin: 0,
          font: '600 12px/1.4 ui-monospace, "SF Mono", Menlo, monospace',
          letterSpacing: '.08em',
          color: 'var(--sds-surfaces-text-secondary, #848da3)',
        }}
      >
        {width} × {height}
      </p>
    </div>
  )
}

/**
 * The Home page on a phone, viewable from a desktop canvas.
 *
 * A real `iframe` at the device's width rather than a scaled-down desktop render, so every media query
 * and container query resolves the way it does on the device — including the 480px point where the
 * header hands Contact Sales to the drawer.
 *
 * Pick a width on the Controls panel. The list is the widths that decide something: 320 is the narrowest
 * this library supports, 375 is what the mobile audit measured, 430 is the widest phone, and 480 and 768
 * are the two breakpoints the page changes shape at — worth a look either side.
 */
export const Mobile: StoryObj<MobileArgs> = {
  /*
   * `desktop-only`, which is the one tag `tests/layout.spec.ts` exempts below 1200px — and this story is
   * the clearest case for it there is. A phone frame on a phone is a 375px box in a 375px viewport with
   * the bezel hanging 2px over the edge, and nothing to learn from it that `Narrow` does not show better.
   * The tag is what the suite reads to skip it at the narrow widths rather than fail it there.
   */
  tags: ['desktop-only'],
  parameters: {
    layout: 'centered',
    frame: { fullBleed: true },
    docs: {
      description: {
        story:
          'The page inside a phone-width `iframe`, so it renders at a true device viewport rather than a scaled desktop one. The width control lists the sizes that decide something, including both breakpoints the page changes shape at.',
      },
    },
  },
  args: { width: 375, fitHeight: false },
  argTypes: {
    width: {
      name: 'Width',
      control: { type: 'select', labels: DEVICE_LABELS },
      options: Object.keys(DEVICES).map(Number),
      description: 'The device viewport the page renders at.',
    },
    fitHeight: {
      name: 'Fit height',
      control: 'boolean',
      description: 'Cap the device to the canvas height. The width is never scaled.',
    },
  },
  render: (args, context) => (
    <PhonePreview
      {...args}
      colorScheme={context.globals.colorScheme === 'light' ? 'light' : 'dark'}
    />
  ),
}

/**
 * Exploration only — not what ships. The hero's production video (`bubble_center.webm`) is swapped for
 * `Bubble`, sitting where Hero's own `drawn` SVG-wave prototype would otherwise go. Nothing in
 * `Hero.tsx` changes: it sits behind a `background="none"` Hero in a plain positioned wrapper here.
 *
 * One canvas, and no blending with the page at all. Everything outside the two bubbles is painted in
 * `surfaceColor` — the page-background token — so they read as floating on the page while the component
 * stays opaque throughout. Because that token resolves against the canvas, the plate follows the colour
 * scheme without the story having to know which one is on.
 *
 * Every prop is on the Controls panel, grouped as **Bubbles** / **Mesh** / **Glow** / **Cursor** — see
 * the component's own docs page for which prop is worth reaching for first.
 *
 * `frame: { padding: 0 }` because this one is judged on whether it reaches the viewport's edges.
 *
 * Both schemes are set here: `color`/`hotColor`/`glowColor` for the dark canvas and the `*Light` trio for
 * the light one. The component picks between them from the luminance of the resolved `surfaceColor`, so
 * the story never has to know which scheme is on.
 */
export const BubbleBackground: Story = {
  parameters: { frame: { fullBleed: true, padding: 0 } },
  /*
   * Tuned for the hero rather than left on the component's defaults — though neither `bubbleScale` nor
   * `bubbleSpread` is among the changes, which is the point of both being fractions of the height: the
   * component's own values already put the bubbles at the right size and the right distance apart here,
   * in a frame nearly twice as wide as its own.
   *
   * What does change is `bubbleY`, pulled higher so their lower edges sweep across at about two thirds
   * down, leaving the copy on colour and the foot of the hero on bare page.
   */
  args: {
    ...BUBBLE_DEFAULTS,
    bubbleY: 0.1,
    bubbleMorph: 0.22,
    bubbleWander: 0.04,
    edgeSoftness: 0.07,
    /*
     * The grounds sit almost on the page's own colour in both schemes, so where the colour thins out the
     * bubbles fall away into the page rather than ending on a visible disc. All the colour comes from
     * the masses inside them.
     */
    color: '#0a0a1e',
    hotColor: '#7c4dff',
    /* The brand blue against the violet, which is the pair the hero's own gradient headline runs. */
    accentColor: '#2f6bff',
    colorLight: '#f7f6fd',
    /*
     * Much paler than the dark canvas's lit colour, and not by taste. The two schemes put *opposite*
     * text on this: light copy on the dark canvas gains contrast as the mesh deepens, dark copy on the
     * light one loses it. A violet that reads as depth behind white text is a wash behind black text.
     */
    hotColorLight: '#c4b5fd',
    accentColorLight: '#a9c9ff',
    richness: 0.85,
    spectralDrift: 18,
    saturation: 1.12,
    glow: 0.7,
    glowOpacity: 0.8,
    glowColor: '#c9a6ff',
    glowColorLight: '#a78bfa',
    glowWidth: 0.14,
    glowOffset: 0.06,
    glowArc: 0.4,
  },
  argTypes: BUBBLE_ARG_TYPES,
  render: (args) => <HomePage heroBackground="bubble" bubbleProps={args as BubbleProps} />,
}
