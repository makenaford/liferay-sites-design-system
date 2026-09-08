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
