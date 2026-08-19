import type { SVGProps } from 'react'

/**
 * The two icons used by the Button examples, exported from the Figma component set
 * (`system/refresh_2` and `arrow/arrow_right`, both Outline style).
 *
 * The path data is Figma's; only the wrapper is normalised — re-framed to a 24x24 viewBox and
 * switched to `currentColor` so an icon inherits the colour of the button it sits in. They size to
 * their container, which the button's `section` class fixes at Figma's 20px icon box.
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
