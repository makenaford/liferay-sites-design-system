import type { ReactNode } from 'react'
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
import { SITE_ACTIONS, SITE_DRAWER_CONTROLS, SITE_NAV_ITEMS } from './site-nav-render'

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
 * Decoration, and marked as such: `aria-hidden`, no content, and it stops drifting under
 * `prefers-reduced-motion` rather than disappearing — it is a ground, not a message.
 */
export function MeshBackdrop() {
  return (
    <div className={classes.meshBackdrop} aria-hidden>
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
      {/* Small caps, at 150% — the tracking needs the extra leading or the line sits tight under the name. */}
      <Text
        fz={12}
        lh={1.5}
        fw={600}
        tt="uppercase"
        lts="0.06em"
        c="var(--sds-surfaces-text-secondary)"
      >
        {title}
      </Text>
    </Stack>
  )
}

/* ------------------------------------------------------------------ the chrome's content */

const FOOTER_LINKS: [string, string[]][] = [
  [
    'Getting Started',
    ['Request a Demo', 'Start Free Trial', 'Marketplace', 'Liferay SaaS/PaaS/Self-Hosted', 'Implementation Guide'],
  ],
  ['More Industries', ['Insurance', 'Transport & Logistics', 'Education', 'Wealth Management']],
  [
    'Compare',
    [
      'Liferay vs. Adobe',
      'Liferay vs. Sitecore',
      'Liferay vs. Optimizely',
      'Liferay vs. SharePoint',
      'Liferay vs. Magnolia',
      'Liferay vs. Salesforce',
    ],
  ],
  [
    'New to Liferay?',
    [
      'What is a DXP?',
      'SaaS vs PaaS',
      'Web Portals Explained',
      'Portal Examples',
      'Headless CMS Guide',
      'Get Your Website Management Score in 2 Minutes',
    ],
  ],
  ['Digital Transformation', ['Financial Services', 'Public Sector', 'Healthcare', 'Manufacturing']],
]

const FOOTER_LINKS_2: [string, string[]][] = [
  [
    'See What’s Possible',
    [
      '16 Awesome Web Portal Examples',
      '3 Examples of Successful Digital Transformation in Manufacturing',
      '8 Exceptional Customer Portal Examples',
      '7 Intranet Examples That Boost Productivity',
      '3 Real-World Examples of Self-Service in Manufacturing',
    ],
  ],
  [
    'Company',
    ['About Us', 'What’s New', 'What’s Next', 'Liferay in the News', 'Careers', 'Locations', 'Contact Us'],
  ],
  ['Legal', ['Trust Center', 'Customer Agreement Framework', 'Privacy Policy', 'Compliance', 'Accessibility']],
  [
    'Developers',
    [
      'Developer Blog',
      'Liferay Discuss',
      'Liferay User Groups',
      'Download Liferay DXP',
      'GitHub',
      'Upgrading Liferay DXP to Jakarta',
      'Liferay Cloud Platform Status',
    ],
  ],
]

const SOCIALS: [string, ReactNode][] = [
  ['Facebook', <IconFacebook key="f" />],
  ['GitHub', <IconGithub key="g" />],
  ['Instagram', <IconInstagram key="i" />],
  ['LinkedIn', <IconLinkedin key="l" />],
  ['X', <IconSocialX key="x" />],
  ['YouTube', <IconYoutube key="y" />],
]

/* ------------------------------------------------------------------ the chrome */

/** `LRDC Primary Nav` — the same header on every template. */
export function SiteHeader() {
  return (
    <Header
      position="static"
      items={SITE_NAV_ITEMS}
      drawerControls={SITE_DRAWER_CONTROLS}
      actions={SITE_ACTIONS}
    />
  )
}

/** `LRDC footer` — the action band, the disclaimers, the numbers and the link grid. */
export function SiteFooter() {
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
                Ready for the future?{' '}
                <Text
                  span
                  inherit
                  variant="gradient"
                  gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}
                >
                  Let&apos;s get there together.
                </Text>
              </>
            }
            description="Join thousands of organizations transforming their digital experiences with Liferay. Start your free trial today."
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
                aria-label="Work email"
                type="email"
                placeholder="Enter Your Email"
                required
                flex="1 1 auto"
              />
              <Button type="submit" size="md" flex="0 0 auto">
                Start Free Trial
              </Button>
            </Group>
          </Box>
          <Group gap={16} justify="center">
            <Button variant="outline" size="md">
              Start Free Trial
            </Button>
            <Button variant="outline" size="md">
              Contact Sales
            </Button>
          </Group>
        </Stack>

        <Stack gap={16} c="var(--sds-surfaces-text-secondary)">
          <Text fz="xs">
            *Metrics reflect results from individual Liferay customer stories and may vary by
            organization.
          </Text>
          <Text fz="xs">
            *Gartner, Voice of the Customer for Digital Experience Platforms, Peer Community
            Contributor, 27 July 2026.
            <br />
            Gartner, Peer Insights, and Customers&apos; Choice are trademarks of Gartner, Inc.,
            and/or its affiliates. Gartner Peer Insights content consists of the opinions of
            individual end users based on their own experiences, and should not be construed as
            statements of fact, nor do they represent the views of Gartner or its affiliates.
            Gartner does not endorse any vendor, product or service depicted in this content nor
            makes any warranties, expressed or implied, with respect to this content, about its
            accuracy or completeness, including any warranties of merchantability or fitness for a
            particular purpose.
          </Text>
        </Stack>
      </Stack>
    }
    stats={
      <Box maw={1280} mx="auto">
        <StatBar align="center">
          <Stat size="sm" value={<>1,200{unit('+')}</>} label="Enterprise Customers" />
          <Stat size="sm" value={<>17{unit('+')}</>} label="Years of Innovation" />
        </StatBar>
      </Box>
    }
    legal={
      <>
        <Text fz="sm" span>
          Built on Liferay Digital Experience Platform
        </Text>
        <Text fz="sm" span>
          &copy; 2023 Liferay Inc. All Rights Reserved
        </Text>
        {['GDPR', 'Accessibility', 'Legal', 'Compliance', 'Privacy Policy'].map((label) => (
          <Link key={label} href="#" variant="secondary" size="sm">
            {label}
          </Link>
        ))}
      </>
    }
  >
    {FOOTER_LINKS.map(([title, links]) => (
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
      address={'1400 Montefino Avenue\nDiamond Bar, CA 91765\nUSA\n+1-877-LIFERAY'}
      social={SOCIALS.map(([name, icon]) => (
        <a key={name} href="#" aria-label={name}>
          {icon}
        </a>
      ))}
    />

    {FOOTER_LINKS_2.map(([title, links]) => (
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
