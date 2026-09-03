import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'

export interface CountUpProps {
  /** The figure to arrive at. */
  value: number
  /** How long the count takes, in milliseconds. @default 1200 */
  duration?: number
  /** Decimal places to hold while counting, so `12.5` does not flicker between one and none. */
  decimals?: number
  /**
   * How each step is written. Defaults to grouping separators — `1,200` rather than `1200`.
   *
   * Given the running number rather than the final one, so a format that depends on magnitude behaves
   * the same on the way up as it does at rest.
   */
  format?: (value: number) => string
}

/**
 * CountUp — a number that counts up to itself when it first comes into view.
 *
 * A component rather than a prop on `Stat`, because `Stat.value` is a `ReactNode` and often a fragment:
 * `45` with a `%` beside it, `1,200` with a `+`. Animating "the value" would mean reaching into that
 * node and guessing which part of it is the number. Composed instead, it goes exactly where the number
 * is and the units stay where they were:
 *
 * ```tsx
 * <Stat value={<CountUp value={56} />} label="Websites launched" />
 * <Stat value={<><CountUp value={45} />{unit('%')}</>} label="Faster loading time" />
 * ```
 *
 * ## When it runs
 *
 * **On entering the viewport, once.** A count that has already finished by the time you scroll to it is
 * an animation nobody sees, and one that restarts every time it scrolls past is a distraction — so it
 * runs on first intersection and then holds.
 *
 * **To replay it, remount it.** There is no `replay` prop: a `key` on the row already means "this is a
 * different thing now", which is exactly the condition a replay wants, and a prop would be a second way
 * to say it that can disagree with the first. A tab whose stats differ keys its bar by the tab.
 *
 * ## Reduced motion
 *
 * The final number, immediately. The figure is the content — it is not decoration that can be dropped —
 * so what goes is the counting, not the number.
 *
 * The element reserves its final width with a hidden copy of the finished string, or a row of stats
 * shifts sideways as its digits grow.
 */
export function CountUp({ value, duration = 1200, decimals = 0, format }: CountUpProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(reducedMotion ? value : 0)

  const write = format ?? ((n: number) => n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }))

  useEffect(() => {
    if (reducedMotion) {
      setShown(value)
      return undefined
    }

    const node = ref.current
    if (!node) return undefined

    let raf = 0
    let started = false

    const run = () => {
      const from = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - from) / Math.max(1, duration))
        /* Ease-out cubic: fast enough to read as counting, and it settles rather than stopping dead. */
        setShown(value * (1 - Math.pow(1 - t, 3)))
        if (t < 1) raf = requestAnimationFrame(step)
        else setShown(value)
      }
      raf = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return
        started = true
        observer.disconnect()
        run()
      },
      /* A sliver is enough: the row is wide and short, and waiting for half of it wastes the scroll. */
      { threshold: 0.01 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, reducedMotion])

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/*
       * The finished number, laid out and invisible, so the element is already as wide as it will ever
       * be. Without it every stat in a row grows as its digits arrive and the row shuffles sideways.
       */}
      <span aria-hidden style={{ visibility: 'hidden' }}>
        {write(value)}
      </span>
      <span style={{ position: 'absolute', inset: 0 }}>{write(shown)}</span>
    </span>
  )
}

export default CountUp
