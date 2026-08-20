import { forwardRef } from 'react'
import { Image as MantineImage } from '@mantine/core'
import type { ImageProps as MantineImageProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

/**
 * The ratios Figma's `Aspect Ratio` set draws (node `12305:1754909`), plus its `Adjustable` cell as
 * `auto` — no ratio at all, the image keeps its own.
 */
export const IMAGE_RATIOS = {
  '1:1': 1,
  '3:2': 3 / 2,
  '4:3': 4 / 3,
  '16:10': 16 / 10,
  '16:9': 16 / 9,
  '2:1': 2,
  '5:2': 5 / 2,
  '3:1': 3,
  '40:33': 40 / 33,
} as const

export type ImageRatio = keyof typeof IMAGE_RATIOS | 'auto'
export type ImageOrientation = 'horizontal' | 'vertical'
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface ImageProps
  extends Omit<MantineImageProps, 'fit'>,
    ElementProps<'img', keyof MantineImageProps | 'alt'> {
  /**
   * The box's aspect ratio, from Figma's `Aspect Ratio` set. `auto` is its `Adjustable` cell: no ratio,
   * so the image sets its own height.
   */
  ratio?: ImageRatio
  /**
   * Figma's second axis. `vertical` inverts the ratio — a vertical `3:2` is 2:3 — which is how the set
   * draws its portrait cells rather than listing them separately.
   */
  orientation?: ImageOrientation
  /**
   * How the image fills its box, when a `ratio` gives it one.
   *
   * `cover` (the default) fills the box and crops the overflow — right for photography, wrong for
   * anything whose edges matter. `contain` fits the whole image inside and leaves space. `fill`
   * stretches it to the box and distorts it, which is almost never what you want but is occasionally
   * what a design asks for. `none` and `scale-down` are the CSS values of the same names.
   */
  fit?: ImageFit
  /**
   * Makes the image fill its nearest positioned ancestor — `position: absolute` on all four edges —
   * for a cover layer behind content. The parent needs `position: relative` and its own size; without a
   * positioned parent the image will fill the page.
   *
   * `ratio` is ignored in this mode: the parent already decides the box.
   */
  fill?: boolean
  /**
   * Required, and empty is a valid answer: `alt=""` for an image that adds nothing a screen reader
   * needs — a decorative photograph beside text that already says it. Anything else gets a sentence.
   *
   * It has no default on purpose. An image component that lets you forget the alt text produces a
   * codebase with no alt text.
   */
  alt: string
}

/**
 * Image — the ratios from Figma's `Aspect Ratio` set (node `12305:1754909`), on Mantine's `Image`.
 *
 * ```tsx
 * <Image src={shot} alt="The dashboard, showing six live campaigns" ratio="3:2" radius="md" />
 * <Image src={portrait} alt="" ratio="3:2" orientation="vertical" fit="contain" />
 * <Image src={cover} alt="" fill />
 * ```
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Ratio` — 1:1, 3:2, 4:3, 16:10, 16:9, 2:1, 5:2, 3:1, 40:33 | `ratio` |
 * | `Ratio=Adjustable` | `ratio="auto"` |
 * | `Orientation` — Horizontal / Vertical | `orientation` |
 *
 * The ratio is `aspect-ratio` on the element itself rather than a wrapper: one element, no extra div,
 * and the image participates in its parent's layout directly — which is what lets `Card.Image` bleed to
 * a card's edge and a grid cell size itself from the ratio.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { ratio = 'auto', orientation = 'horizontal', fit = 'cover', fill, className, style, ...props },
  ref,
) {
  const base = ratio === 'auto' ? undefined : IMAGE_RATIOS[ratio]
  const aspectRatio =
    base === undefined ? undefined : orientation === 'vertical' ? 1 / base : base

  return (
    <MantineImage
      ref={ref}
      fit={fit}
      className={[classes.image, className].filter(Boolean).join(' ')}
      data-fill={fill || undefined}
      style={{ ...(fill ? null : { aspectRatio }), ...style }}
      {...props}
    />
  )
})
