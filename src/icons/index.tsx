import type { SVGProps } from 'react'

/**
 * The icons used by the Button and Link examples, exported from the Figma library:
 * `system/refresh_2` and `arrow/arrow_right` (both Outline style), and `Navigation / arrow forward`.
 *
 * The path data is Figma's; only the wrapper is normalised — re-framed to a 24x24 viewBox and
 * switched to `currentColor` so an icon inherits the colour of whatever it sits in. They size to
 * their container, which the `section` classes fix at the icon box Figma specifies per size.
 */
export type IconProps = SVGProps<SVGSVGElement>

export function IconRefresh(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <g transform="translate(2.2476 2.2476)">
        <path
          d="M1.56325 6.01585C3.35194 2.08319 7.77083 -0.0960025 12.0818 1.05912C15.6839 2.0243 18.1873 5.04315 18.6698 8.51839C18.723 8.90124 18.7516 9.28964 18.7544 9.68144C18.755 9.76093 18.6664 9.80747 18.6005 9.76305L15.9225 7.95867C15.8311 7.89704 15.8921 7.75443 15.9998 7.77806L17.7522 8.16236M17.9412 13.4889C16.1525 17.4215 11.7336 19.6007 7.42263 18.4456C3.82054 17.4804 1.31715 14.4616 0.834656 10.9863C0.781501 10.6035 0.752873 10.2151 0.750005 9.82327C0.749423 9.74379 0.83804 9.69725 0.903959 9.74166L3.5818 11.546C3.67328 11.6076 3.61224 11.7502 3.5045 11.7266L1.75223 11.3421"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <g transform="translate(3.2508 5.5932)">
        <path
          d="M0.75 6.40685H15.75M10.7499 12.0637L16.4067 6.40685L10.7499 0.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

/**
 * `Navigation / arrow forward` — the filled arrow the Link component uses.
 *
 * Figma exports this one as an alpha mask rather than a stroke, reporting a mask size of
 * 15.583 x 15.185 at offset (4.209, 4.407) against the glyph's natural 10.3883 x 10.1233 bounds.
 * That is a uniform 1.5x scale, which places the arrow on the standard 24x24 icon grid — hence the
 * transform below. The path itself is untouched.
 */
export function IconArrowForward(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <g transform="translate(4.209 4.407) scale(1.5)">
        <path
          d="M0.666667 5.72832H8.11333L4.86 8.98166C4.6 9.24166 4.6 9.66832 4.86 9.92832C5.12 10.1883 5.54 10.1883 5.8 9.92832L10.1933 5.53499C10.4533 5.27499 10.4533 4.85499 10.1933 4.59499L5.80667 0.19499C5.68211 0.0701553 5.51301 0 5.33667 0C5.16032 0 4.99122 0.0701553 4.86667 0.19499C4.60667 0.45499 4.60667 0.87499 4.86667 1.13499L8.11333 4.39499H0.666667C0.3 4.39499 0 4.69499 0 5.06166C0 5.42832 0.3 5.72832 0.666667 5.72832Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
