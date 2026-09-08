import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import { Box, Group, Stack, Text } from '@mantine/core'
import { Button } from '../components/Button'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Link } from '../components/Link'
import { Logo } from '../components/Logo'
import { SectionTitle } from '../components/Section'
import { Stat, StatBar } from '../components/Stat'
import { TextInput } from '../components/Input'
import {
  IconFacebook,
  IconGithub,
  IconInstagram,
  IconLinkedin,
  IconSocialX,
  IconYoutube,
} from '../icons'
import classes from '../theme/components.module.css'
import { logoTile } from './logo-tile'

/* Re-exported: it used to live here, and the templates import it from here. */
export { logoTile }
import { SITE_ACTIONS, SITE_DRAWER_CONTROLS, SITE_NAV_ITEMS, navItems } from './site-nav-render'
import { FOOTER_CONTENT, type FooterContent } from './footer-content'
import type { NavMenu } from './site-nav'

/*
 * What every page template shares.
 *
 * The Home page and the three Detail Pages all draw the same `LRDC Primary Nav` and the same
 * `LRDC footer`. Copying either into each story would mean four places to change a footer link and four
 * chances for them to drift, so the chrome lives here and a template is only the part that differs.
 *
 * Page content does **not** belong here. Anything one template says and another does not — its cards,
 * its stats, its tabs — stays in that template's own file.
 */

/* ------------------------------------------------------------------ stand-ins for other people's marks
 *
 * The page draws customer logos (Airbus, Sky, Broadcom, Unilever, Stadt Wien, Carrefour, Petrobras…)
 * and vendor logos (OpenAI, Asana…) in the marquee, the carousel tiles and the integration row. Those
 * are third-party trademarks, not design-system assets, so they are **not** committed here — the
 * shapes below hold their place at the drawn size. Everything that belongs to the design — copy,
 * structure, tokens, the product screenshots and the platform diagram — is the real thing.
 */

/** A customer wordmark at the marquee's drawn proportion. */
export function Wordmark({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 160 32" role="img" aria-label={name} style={{ aspectRatio: '5 / 1' }}>
      <text
        x="0"
        y="23"
        fontSize="19"
        fontWeight="700"
        letterSpacing="1"
        fill="currentColor"
        fontFamily="inherit"
      >
        {name}
      </text>
    </svg>
  )
}


/** One of the 64px integration tiles. */
export function VendorTile({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label={name} width={40} height={40}>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="26" fontSize="16" fontWeight="700" textAnchor="middle" fill="currentColor">
        {name.slice(0, 1)}
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ small compositions
 *
 * Two shapes the page repeats that the library has no component for. Both are noted in the README:
 * a `Stat` whose figure carries a unit, and the attribution under a customer quote — which the
 * `Common Cards` Code Connect snippet used to call `Quotee`, a component that never existed.
 */

/**
 * A slow mesh of brand light behind a section, with its edges dissolved into the page.
 *
 * Wrap the section in `meshHost` and drop this in as its first child. The backdrop is absolutely
 * positioned and masked to nothing at its own edges, so it needs no knowledge of the page colour behind
 * it and leaves no seam to keep in sync when the scheme changes.
 *
 * **Nothing turns this on by default.** It was on the integrations band and is not any more: a lit
 * ground behind a section is a decision about a page, not a property of the section type, and every
 * page using that type inherited it. `SectionSpec` carries a `backdrop` field for the pages that want
 * one — see `Blocks/Sections`, where the option is drawn.
 *
 * Decoration, and marked as such: `aria-hidden`, no content, and it stops drifting under
 * `prefers-reduced-motion` rather than disappearing — it is a ground, not a message.
 *
 * `tone` picks which light it is:
 *
 * `hero` — three blobs of the hero's own palette at about the same size, which is a *field*: the page
 * is not flat here, and no part of it is the source.
 *
 * `wash` — `CapabilityMap`'s: a blue core, a violet halo set off against it and a brighter lift where
 * they cross, at three quite different sizes. That difference in size is what makes it read as light
 * arriving from a point rather than as coloured air, and it is why a band carrying one centred object —
 * the integrations strip, the map itself — wants this one.
 */
export function MeshBackdrop({ tone = 'hero' }: { tone?: 'hero' | 'wash' } = {}) {
  return (
    <div className={classes.meshBackdrop} data-tone={tone === 'wash' ? 'wash' : undefined} aria-hidden>
      <span />
      <span />
      <span />
    </div>
  )
}

/** The small unit that rides beside a `Stat`'s figure — the `%` in `140%`, the `+` in `+100M`. */
export const unit = (u: string) => (
  <Text span inherit fz={20} fw={600}>
    {u}
  </Text>
)

/**
 * The same unit, keeping `Accent/Primary Blue Accent` where the figure beside it does not — the footer's
 * `1,200` is white and its `+` is blue, which is what `Number Footer` draws.
 */
export const unitAccent = (u: string) => (
  <Text span inherit fz={20} fw={600} c="var(--sds-accent-primary-blue-accent)">
    {u}
  </Text>
)

/** The star, from the `IconStarFilled` set, so the rating and the icon are the same shape. */
const STAR_PATH =
  'M10.92 2.37a1.25 1.25 0 0 1 2.16 0l2.795 4.8 5.428 1.175a1.25 1.25 0 0 1 .667 2.054l-3.7 4.142.56 5.525a1.25 1.25 0 0 1-1.748 1.27L12 19.096l-5.082 2.24a1.25 1.25 0 0 1-1.747-1.27l.559-5.525-3.7-4.142a1.25 1.25 0 0 1 .667-2.054L8.125 7.17z'

export interface StarRatingProps {
  /** The rating, 0..`max`. Fractional: `4.6` fills four stars and three fifths of the next. */
  value: number
  /** @default 5 */
  max?: number
  /** Star size in px. @default 16 */
  size?: number
  /** The accessible sentence. Without it the rating is decorative and the figure beside it carries it. */
  label?: string
}

/**
 * StarRating — the Gartner rating, filled with the brand gradient and filling on arrival.
 *
 * One `<svg>` rather than a row of icon components, for three reasons that all come back to the same
 * thing: a gradient across *the row* cannot be done a star at a time. The stars share one
 * `linearGradient` spanning the whole width, so the sweep runs across all five instead of restarting in
 * each; the fill is clipped by one rect, so `4.6` is four stars and three fifths of the next rather than
 * five whole ones and a rounding error; and animating that rect's width is what makes it fill.
 *
 * Two layers of the same five stars: the track underneath at the secondary text colour, the gradient
 * over it clipped to the rating. No masking of icon components, no `background-clip` on an SVG — both
 * are ways of getting a gradient onto a shape that stop working the moment the shape has to be
 * partially filled.
 *
 * The fill runs once, on entering the viewport, and `prefers-reduced-motion` gets it filled already —
 * the rating is the content; the filling is the decoration.
 */
export function StarRating({ value, max = 5, size = 16, label }: StarRatingProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const [filled, setFilled] = useState(false)

  const clamped = Math.max(0, Math.min(max, value))
  const width = size * max

  useEffect(() => {
    if (reducedMotion) {
      setFilled(true)
      return undefined
    }
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setFilled(true)
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  const stars = Array.from({ length: max }, (_, i) => (
    <path key={i} d={STAR_PATH} transform={`translate(${i * 24} 0)`} />
  ))

  return (
    <svg
      ref={ref}
      width={width}
      height={size}
      viewBox={`0 0 ${max * 24} 24`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={{ display: 'block', flex: 'none' }}
    >
      <defs>
        <linearGradient id="sds-star-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--sds-brand-primary-lighten-3)" />
          <stop offset="100%" stopColor="var(--sds-accent-product-accent)" />
        </linearGradient>
        <clipPath id="sds-star-clip">
          {/*
           * The width is the whole animation. A `transition` on an SVG geometry attribute is not
           * reliable across engines, so it is set as a style property, which is.
           */}
          <rect
            x="0"
            y="0"
            height="24"
            width={max * 24}
            style={{
              transform: `scaleX(${filled ? clamped / max : 0})`,
              transformOrigin: 'left',
              transition: reducedMotion
                ? undefined
                : 'transform var(--sds-motion-slow, 420ms) var(--sds-motion-ease-out, ease-out)',
            }}
          />
        </clipPath>
      </defs>

      {/* The track: every star, dim, so an unfilled one is still a star rather than a gap. */}
      <g fill="var(--sds-surfaces-text-secondary)" opacity={0.35}>
        {stars}
      </g>

      <g fill="url(#sds-star-fill)" clipPath="url(#sds-star-clip)">
        {stars}
      </g>
    </svg>
  )
}

export function Quotee({ name, title }: { name: string; title: string }) {
  return (
    <Stack gap={4}>
      {/*
        * `Paragraph/Base` for the name — 16px, through the theme scale rather than a literal, so it
        * follows the token if the ramp moves. It was `sm` (13px), which put the person's name below the
        * size of ordinary body copy and made the attribution read as a caption rather than as a person.
        */}
      <Text fz="md" fw={600}>
        {name}
      </Text>
      {/*
        * `.quoteeTitle` rather than style props: Mantine writes `tt`/`lts` as inline styles, and the
        * Japanese layer has to be able to turn both off — see the rule and its `:lang(ja)` companion.
        */}
      <Text component="span" display="block" className={classes.quoteeTitle}>
        {title}
      </Text>
    </Stack>
  )
}

/* ------------------------------------------------------------------ the chrome's content */

const SOCIALS: [string, ReactNode][] = [
  ['Facebook', <IconFacebook key="f" />],
  ['GitHub', <IconGithub key="g" />],
  ['Instagram', <IconInstagram key="i" />],
  ['LinkedIn', <IconLinkedin key="l" />],
  ['X', <IconSocialX key="x" />],
  ['YouTube', <IconYoutube key="y" />],
]

/* ------------------------------------------------------------------ the chrome */

/**
 * `LRDC Primary Nav` — the same header on every template.
 *
 * **Fixed, and it overlays the hero.** The file draws the bubble as the first thing on the page — node
 * `7655:14899` sits at y=0, and the nav at y=0 on top of it — so the artwork starts at the very top and
 * the bar rides on it. A static header cannot do that: it takes a band of its own above the hero, and
 * the bubble then begins 64px down with a strip of flat page above it, which is the one place on this
 * page where the artwork should be at its fullest.
 *
 * `condense={false}`, so the bar keeps its glass from the first frame. Condensing was the other reading
 * of "the nav sits on the artwork" — transparent at rest, glass once the page moves — and it costs the
 * header its container: at the top of the page, which is where a reader arrives, there was a row of
 * links floating on a picture with no surface under it. The band is translucent, so the bubble is still
 * visible through it and still starts at the very top; what it stops doing is disappearing.
 */
export function SiteHeader({
  menus,
  actions,
  drawerControls,
}: {
  /** This locale's menus. Defaults to the global nav in `site-nav.ts`. */
  menus?: NavMenu[]
  actions?: ReactNode
  drawerControls?: typeof SITE_DRAWER_CONTROLS
} = {}) {
  return (
    <Header
      position="fixed"
      condense={false}
      items={menus ? navItems(menus) : SITE_NAV_ITEMS}
      drawerControls={drawerControls ?? SITE_DRAWER_CONTROLS}
      actions={actions ?? SITE_ACTIONS}
    />
  )
}

/** `LRDC footer` — the action band, the disclaimers, the numbers and the link grid. */
export function SiteFooter({ content = FOOTER_CONTENT }: { content?: FooterContent } = {}) {
  return (
  <Footer
    cta={
      <Stack gap={40} maw={1280} mx="auto">
        <Stack gap={32} align="center">
          <SectionTitle
            align="center"
            order={2}
            /*
             * The gradient runs on the second clause only, which is how the file draws it: the question
             * is asked in plain white and the answer is what lights up. Wrapping the whole line made it
             * one long gradient with nothing to contrast against.
             */
            title={
              <>
                {content.cta.title.lead}
                {/* Japanese sets no space between the clauses; see `Split` in `HomePage.tsx`. */}
                {content.locale.startsWith('ja') ? '' : ' '}
                <Text
                  span
                  inherit
                  variant="gradient"
                  gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}
                >
                  {content.cta.title.accent}
                </Text>
              </>
            }
            description={content.cta.description}
          />
          {/*
            * A bare form row rather than `Form`: `Form` is Figma's glass *form card* — a 40px
            * padded surface — and the action band draws the field and the button straight onto
            * the page. Same submit semantics, none of the surface.
            */}
          <Box
            component="form"
            maw={600}
            w="100%"
            onSubmit={(event) => event.preventDefault()}
          >
            <Group gap={16} align="flex-start" wrap="nowrap">
              <TextInput
                aria-label={content.cta.emailLabel}
                type="email"
                placeholder={content.cta.emailPlaceholder}
                required
                flex="1 1 auto"
              />
              <Button type="submit" size="md" flex="0 0 auto">
                {content.cta.trialCta}
              </Button>
            </Group>
          </Box>
          <Group gap={16} justify="center">
            <Button variant="outline" size="md">
              {content.cta.trialCta}
            </Button>
            <Button variant="outline" size="md">
              {content.cta.contactCta}
            </Button>
          </Group>
        </Stack>

        <Stack gap={16} c="var(--sds-surfaces-text-secondary)">
          {content.disclaimers.map((text) => (
            /* The Gartner notice is two paragraphs in one string; the break is where it splits. */
            <Text key={text.slice(0, 40)} fz="xs" style={{ whiteSpace: 'pre-line' }}>
              {text}
            </Text>
          ))}
        </Stack>
      </Stack>
    }
    stats={
      <Box maw={1280} mx="auto">
        <StatBar align="center">
          {content.stats.map((stat) => (
            <Stat
              key={stat.label}
              size="sm"
              layout="inline"
              value={<>{stat.value}{unitAccent(stat.accent)}</>}
              label={stat.label}
            />
          ))}
        </StatBar>
      </Box>
    }
    legal={
      <>
        <Text fz="sm" span>
          {content.legal.built}
        </Text>
        <Text fz="sm" span>
          {content.legal.copyright}
        </Text>
        {content.legal.links.map((label) => (
          <Link key={label} href="#" variant="secondary" size="sm">
            {label}
          </Link>
        ))}
      </>
    }
  >
    {content.columns.map(([title, links]) => (
      <Footer.Column key={title} title={title}>
        {links.map((label) => (
          <Footer.Link key={label} href="#">
            {label}
          </Footer.Link>
        ))}
      </Footer.Column>
    ))}

    {/*
     * The brand block starts the second row of the grid, which is where the file draws it — so it
     * is the sixth child rather than the `brand` prop, which would put it first.
     */}
    <Footer.Brand
      /* The file heads the brand block with the lockup; it was the one slot left empty. */
      logo={<Logo height={40} />}
      address={content.address}
      social={SOCIALS.map(([name, icon]) => (
        <a key={name} href="#" aria-label={name}>
          {icon}
        </a>
      ))}
    />

    {content.columnsBelow.map(([title, links]) => (
      <Footer.Column key={title} title={title}>
        {links.map((label) => (
          <Footer.Link key={label} href="#">
            {label}
          </Footer.Link>
        ))}
      </Footer.Column>
    ))}
  </Footer>
  )
}
