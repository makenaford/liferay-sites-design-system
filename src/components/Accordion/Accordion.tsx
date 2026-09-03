import { Children, isValidElement, useCallback, useEffect, useRef, useState, type Ref } from 'react'
import { Accordion as MantineAccordion } from '@mantine/core'
import type { AccordionProps as MantineAccordionProps } from '@mantine/core'
import { useMergedRef } from '@mantine/hooks'
import { IconDown } from '../../icons'

/**
 * Figma's `Size` axis, renamed to this library's scale.
 *
 * `lg` is Figma's `Size=Default` — a 56px row, `Paragraph/Large/Semi Bold`, a 32px chevron box. `sm` is
 * its `Size=Condensed` — 40px, `Paragraph/Default/Semi Bold`, 24px. The names are `lg`/`sm` rather than
 * `default`/`condensed` so that a size means the same thing here as it does on `Button` and `Label`.
 */
export type AccordionSize = 'sm' | 'lg'

export interface AccordionProps<Multiple extends boolean = false>
  extends MantineAccordionProps<Multiple> {
  /** React 19 ref, forwarded to the root element. */
  ref?: Ref<HTMLDivElement>

  /**
   * Figma's `Size`: `lg` is `Default` (56px row, 21px label), `sm` is `Condensed` (40px, 18px).
   *
   * @default 'lg'
   */
  size?: AccordionSize

  /**
   * Open each row in turn, on a timer, with the open row's rule filling as its time runs out.
   *
   * `true` takes 5.5s a row; a number sets that in milliseconds. Only for a single-open accordion whose
   * value it owns — passing `value` yourself, or `multiple`, turns it off, since two things cannot both
   * decide which row is open.
   *
   * **The progress bar is the rule the component already draws.** Figma's open row carries a
   * `Neutral/06` -> `Brand/Primary/Lighten/3` gradient under its header; here that gradient grows from
   * the leading edge over the row's time instead of appearing at full width. A separate 2px bar — what
   * the demo this comes from adds — would be a second horizontal line a pixel away from the first, and
   * the component already owns a line whose whole job is to say which row is open.
   *
   * ## Stopping it
   *
   * WCAG 2.2.2: anything that updates itself for longer than five seconds needs a way to stop it. Three,
   * in the order a reader would find them:
   *
   * **Opening a row yourself stops it for good.** Not "restarts the timer", which is what the demo does:
   * choosing a row is the reader saying which one they want to read, and moving on from it a few seconds
   * later is the exact behaviour that makes a carousel infuriating. The rows are the mechanism, and they
   * are already the most obvious control here.
   *
   * **Hover or focus pauses it**, and it resumes on leaving — for a reader part-way through a panel who
   * has not clicked anything.
   *
   * **It only runs while it is on screen**, on an `IntersectionObserver`, so nothing advances in a
   * section nobody is looking at and the row on screen is the row that was there when it scrolled in.
   *
   * Under `prefers-reduced-motion` it never starts: the first row is open and it stays that way.
   *
   * @default false
   */
  autoplay?: boolean | number
}

/** The demo's 5.5s: long enough to read three lines, short enough that a reader waits rather than leaves. */
const AUTOPLAY_MS = 5500

/**
 * The timer behind `autoplay`.
 *
 * Progress is written to the DOM as a custom property rather than held in state: it moves every frame,
 * and re-rendering an accordion sixty times a second to grow a line is work with nothing to show for it.
 * Only the *row* changing is a render.
 */
function useAutoplay(
  enabled: boolean,
  duration: number,
  values: string[],
  onAdvance: (value: string) => void,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const frame = useRef<number | null>(null)
  const started = useRef<number | null>(null)
  /* The previous frame's timestamp: what a pause is measured in. */
  const last = useRef<number | null>(null)
  /* Set by the observer and the pointer, read by the loop — refs, so neither restarts it. */
  const inView = useRef(false)
  const held = useRef(false)
  const [stopped, setStopped] = useState(false)
  const indexRef = useRef(0)

  const running = enabled && !stopped

  /** The reader took over. Once, and it does not come back — see the note on the prop. */
  const stop = useCallback(() => setStopped(true), [])

  /** Which row the timer is on. Kept in a ref so a click can retarget the loop without restarting it. */
  const setIndex = useCallback((index: number) => {
    indexRef.current = index
    started.current = null
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !running || values.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const write = (progress: number) =>
      root.style.setProperty('--sds-acc-progress', progress.toFixed(4))

    const tick = (now: number) => {
      const delta = now - (last.current ?? now)
      last.current = now

      /*
       * Paused: push the start forward by exactly the time that passed, so `now - started` — the elapsed
       * time everything else is measured from — does not grow while nobody is watching. Freezing it any
       * other way means either losing the bar's position or accumulating drift across a long pause; this
       * is the one that keeps both.
       */
      if (held.current || !inView.current) {
        if (started.current !== null) started.current += delta
        frame.current = requestAnimationFrame(tick)
        return
      }

      if (started.current === null) started.current = now
      const elapsed = now - started.current
      write(Math.min(1, elapsed / duration))
      if (elapsed >= duration) {
        const next = (indexRef.current + 1) % values.length
        indexRef.current = next
        started.current = now
        write(0)
        onAdvance(values[next])
      }
      frame.current = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { inView.current = entry.isIntersecting }),
      { threshold: 0.2 },
    )
    observer.observe(root)
    frame.current = requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      if (frame.current) cancelAnimationFrame(frame.current)
      last.current = null
      write(0)
      root.style.removeProperty('--sds-acc-progress')
    }
  }, [running, duration, values, onAdvance])

  return {
    rootRef,
    running,
    stop,
    setIndex,
    hold: (value: boolean) => {
      held.current = value
    },
  }
}

function AccordionBase<Multiple extends boolean = false>({
  size = 'lg',
  chevron = <IconDown />,
  mod,
  autoplay,
  ref,
  ...props
}: AccordionProps<Multiple>) {
  /*
   * The row values, in order, read off the children rather than asked for as a prop: they are already
   * there on every `Accordion.Item`, and a second list to keep in step is a list that will drift.
   */
  const values = Children.toArray(props.children)
    .filter(isValidElement<{ value?: string }>)
    .map((child) => child.props.value)
    .filter((value): value is string => typeof value === 'string')

  /* It can only own the value if nothing else does. */
  const canAutoplay =
    Boolean(autoplay) && !props.multiple && props.value === undefined && values.length > 1

  const [current, setCurrent] = useState<string | null>(
    () => (props.defaultValue as string | null | undefined) ?? values[0] ?? null,
  )

  /*
   * An automatic advance is a change like any other.
   *
   * `onChange` used to fire only when a reader opened a row by hand, so a caller watching which row is
   * open — the Home page's tabbed panel swaps its media with it — saw the manual opens and none of the
   * automatic ones, and the media stuck on whichever row was open last. Autoplay cannot report through
   * `value`, since owning `value` is exactly what turns autoplay off, so it reports here.
   */
  const onChangeRef = useRef(props.onChange)
  onChangeRef.current = props.onChange

  const advance = useCallback((value: string) => {
    setCurrent(value)
    ;(onChangeRef.current as ((value: string | null) => void) | undefined)?.(value)
  }, [])
  const auto = useAutoplay(
    canAutoplay,
    typeof autoplay === 'number' ? autoplay : AUTOPLAY_MS,
    values,
    advance,
  )
  const rootRef = useMergedRef(ref as Ref<HTMLDivElement>, auto.rootRef)

  const controlled = canAutoplay
    ? {
        value: current as AccordionProps<Multiple>['value'],
        onChange: ((value: string | null) => {
          /* A row opened by hand: the reader has taken over, so the timer does not come back. */
          auto.stop()
          setCurrent(value)
          ;(props.onChange as ((value: string | null) => void) | undefined)?.(value)
        }) as AccordionProps<Multiple>['onChange'],
        onPointerEnter: () => auto.hold(true),
        onPointerLeave: () => auto.hold(false),
        onFocusCapture: () => auto.hold(true),
        onBlurCapture: () => auto.hold(false),
      }
    : null

  return (
    <MantineAccordion
      ref={rootRef}
      chevron={chevron}
      /*
       * `size` is not a Mantine Accordion prop, so it is not forwarded — it becomes `data-size` on the
       * root and the stylesheet reads it from there. Passing it through would land a stray `size`
       * attribute on the root div.
       */
      mod={[{ size, autoplay: auto.running || undefined }, mod]}
      {...props}
      {...controlled}
    />
  )
}

/**
 * Accordion — Figma `Accordion` component set (node `17019:127517`).
 *
 * A themed Mantine `Accordion` in the two sizes the set draws, with the divider that separates every
 * row and the arrow that flips when a row opens.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Size` — Default / Condensed | `size="lg"` / `size="sm"` |
 * | `Expand` — Closed / Expanded | `value` / `defaultValue`, or the user clicking |
 * | The header's `UI Icon` | a chevron — see below |
 * | `Header` text | `<Accordion.Control>` children |
 * | `divider` `Property 1=normal` | the closed row's rule, `Neutral/02` |
 * | `divider` `Property 1=gradient` | the open row's rule, `Neutral/06` → `Brand/Primary/Lighten/3` |
 * | The panel's placeholder frame | `<Accordion.Panel>` children |
 *
 * ```tsx
 * <Accordion size="lg" defaultValue="hosting">
 *   <Accordion.Item value="hosting">
 *     <Accordion.Control>Where is my data hosted?</Accordion.Control>
 *     <Accordion.Panel>In the region you choose, on infrastructure we operate.</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 *
 * ## Interaction
 *
 * Figma draws two cells — closed and open — so everything between them is inferred, from the same
 * motion tokens the rest of the library uses.
 *
 * **The rule previews the expand.** Figma changes the divider from flat `Neutral/02` to the
 * `Neutral/06` → `Brand/Primary/Lighten/3` gradient when a row opens. Hover brings that gradient up
 * part of the way, so the row says what clicking it will do before it is clicked. It is one layer whose
 * opacity moves 0 → 0.5 → 1, which runs on the compositor rather than repainting a border.
 *
 * **A chevron, not an arrow.** Figma's header draws `UI Icon Name=arrow/arrow_down` — a full arrow with a
 * shaft — and this uses `arrow/down`, the chevron, instead. An arrow says "go", which is what it means on a
 * `Link` and a `Button` in this same library; a chevron says "there is more of this here", which is what a
 * disclosure does. Using the same glyph for both makes the accordion look like it will navigate somewhere.
 * A deviation, recorded in README.md, and one the file could adopt — the `UI Icon` set has both.
 *
 * **The chevron is the affordance, so it gets the target.** A soft disc grows in behind it on hover — the
 * full 32px (or 24px) box, not a smaller hit area — and the arrow itself nudges 1px in the direction it
 * is about to travel while the row is held. Rotation is Mantine's, retimed to `--sds-motion-medium` on
 * this library's easing so it settles rather than stops.
 *
 * **The panel content follows the height.** The row's height and the panel's fade are Mantine's
 * `Collapse`; the content additionally rises 4px into place, 40ms behind the height, so the panel reads
 * as opening rather than as appearing at full size. That rise is a keyframe animation rather than a
 * transition, because Mantine hides a closed panel with `display: none` and a transition out of
 * `display: none` has no starting value to run from — measured, not assumed.
 *
 * All of it is off under `prefers-reduced-motion` — including the height, which Mantine drops to 0ms —
 * and the disc and gradient are dropped under `forced-colors`, where the rule becomes `CanvasText`.
 *
 * ## Semantics
 *
 * The control is a `<button aria-expanded aria-controls>` and the panel a `role="region"` labelled by
 * it, with the arrow keys moving between rows. Pass `order` to wrap each control in a real heading —
 * `order={3}` for `<h3>` — which is what a screen reader needs to navigate a page of these by heading.
 * There is no default, because only the page knows its own heading levels.
 *
 * `multiple` lets more than one row stand open. Figma shows one at a time, which is the default.
 */
export const Accordion = Object.assign(AccordionBase, {
  Item: MantineAccordion.Item,
  Control: MantineAccordion.Control,
  Panel: MantineAccordion.Panel,
  Chevron: MantineAccordion.Chevron,
})
