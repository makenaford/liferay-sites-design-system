import type { ReactNode } from 'react'
import classes from '../../theme/components.module.css'

export interface GradientTextProps {
  children?: ReactNode
  /**
   * Sweep the gradient along the text, continuously.
   *
   * The sweep needs the gradient to be **three stops rather than two** — `brand → accent → brand`, at
   * two and a half times the text's width. A two-stop gradient slid under a text mask has to jump back
   * when it reaches the end, and at heading size that jump is visible; repeating the first colour at the
   * far end lets the position run from one end to the other and land on an identical picture, so the
   * loop has no seam. `linear`, because an eased sweep reads as something sliding back and forth rather
   * than as light crossing a surface.
   *
   * Under `prefers-reduced-motion` the gradient stays and only the travel stops: the colour is what the
   * heading says, and taking it away would change the sentence.
   */
  animate?: boolean
}

/**
 * GradientText — a phrase inside a heading, filled with the brand gradient.
 *
 * `Brand/Primary/Lighten 1` to `Accent/Product Accent`, clipped to the text and running left to right
 * across it. `Homepage Redesign` uses it for the hero's `Convert, Scale and Grow` and for one phrase in
 * each of five section headings — `**1,200+ Enterprises** Move the Needle With Liferay`,
 * `Different Teams. **One Platform.**`, `Designed for Your Industry. **Built for Growth.**`,
 * `Everything You Need in **One Platform**` and `Extend Your platform. **Integrate without limits.**`
 *
 * Note that the phrase is not always the tail: the carousel's is the *first* two words. So this wraps a
 * phrase wherever it falls, and `highlightPhrase` finds it in a plain string for callers whose titles
 * are data rather than markup.
 *
 * ```tsx
 * <SectionTitle title={<>Different Teams. <GradientText animate>One Platform.</GradientText></>} />
 * ```
 *
 * A component rather than a class, because the facts that make it work — the stop order, and the
 * background size the sweep needs — are not things a caller should have to know. It also replaces a
 * Mantine `Text variant="gradient"`, whose gradient is written inline and has two stops, so the
 * stylesheet can neither animate it nor give it the third stop a seamless sweep needs.
 */
export function GradientText({ children, animate }: GradientTextProps) {
  return (
    <span className={classes.gradientText} data-animate={animate || undefined}>
      {children}
    </span>
  )
}

/**
 * A title string with one phrase in the gradient — for callers whose headings are data.
 *
 * The phrase is matched **verbatim and once**, and a title that does not contain it is returned
 * unchanged rather than throwing: a heading is content, it gets edited, and a page that renders its
 * heading as plain text because someone fixed a typo in it is a far better failure than one that does
 * not render at all.
 */
export function highlightPhrase(title: string, phrase?: string, animate?: boolean): ReactNode {
  if (!phrase) return title
  const at = title.indexOf(phrase)
  if (at < 0) return title
  return (
    <>
      {title.slice(0, at)}
      <GradientText animate={animate}>{phrase}</GradientText>
      {title.slice(at + phrase.length)}
    </>
  )
}
