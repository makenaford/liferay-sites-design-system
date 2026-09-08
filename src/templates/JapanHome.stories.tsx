import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomePage } from './HomePage'
import { HOME_CONTENT_JA } from './home-content.ja'
import { FOOTER_CONTENT_JA } from './footer-content.ja'
import {
  JA_CONTACT_LABEL,
  JA_DRAWER_LANGUAGE,
  JA_LOGIN_LABEL,
  SITE_NAV_JA,
  UNTRANSLATED_NAV_LABELS,
} from './site-nav.ja'
import { siteActions } from './site-nav-render'
import { Button } from '../components/Button'

const JA_ACTIONS = siteActions({
  language: JA_DRAWER_LANGUAGE,
  loginLabel: JA_LOGIN_LABEL,
  contactLabel: JA_CONTACT_LABEL,
})

const JA_DRAWER = {
  language: JA_DRAWER_LANGUAGE,
  login: { items: [{ label: JA_LOGIN_LABEL, href: '#' }] },
  /* `md` at the foot of the drawer, matching the log-in beside it — see `SITE_DRAWER_CONTROLS`. */
  cta: <Button size="md">{JA_CONTACT_LABEL}</Button>,
}

function JapanHome() {
  return (
    <HomePage
      content={HOME_CONTENT_JA}
      nav={SITE_NAV_JA}
      navActions={JA_ACTIONS}
      navDrawerControls={JA_DRAWER}
      footer={FOOTER_CONTENT_JA}
    />
  )
}

const meta = {
  title: 'Built Pages/Japan Home',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'The Japanese homepage — the same `HomePage` component as `Built Pages/Home`, rendered from `home-content.ja.ts` instead of `home-content.ts`. Nothing about the layout is forked: swapping the content object swaps every string, and the header and footer take the Japanese nav and footer copy the same way. Change a section here and it changes on both pages, which is the point of splitting the copy out.',
          '',
          '**Light by default.** The story sets `colorScheme: light` as a Storybook global, so the page opens on the light canvas; the toolbar switch still works and will take it back to dark. Every colour on the page is a token, so nothing had to be re-specified for the light mode — this is the same page, in the other scheme.',
          '',
          '## Where this page differs from the global one',
          '',
          'The differences below are the sheet’s, not translations of convenience:',
          '',
          '- **§2 Logo strip** — six Japanese customers (パナソニック コネクト, 横河電機, 東京海上日動, 郵船ロジスティクス, 住友商事, 名古屋大学) in place of the global set, which the sheet recommends for this market. As on the global page, the marks themselves are stand-ins: they are other companies’ trademarks, not design-system assets.',
          '- **§3 What teams can achieve** — all eight cards are JP-specific copy (marked ⚑ in the sheet), pivoted from campaigns and commerce to enterprise portals, intranets and knowledge sharing. The card artwork is still the global page’s, which the sheet flags as needing new visuals to match.',
          '- **§5 Different teams** — the three tabs carry the sheet’s own figures rather than one shared set: 596/24/77 for マーケター, 1,041/700/92% for IT・開発者, 450/2,100/1,600 for パートナー. The Partners tab has four rows here where the global page has three.',
          '- **§6 Industries** — all six tabs are written out. The global page only ever drew the Financial Services card and repeats it.',
          '- **Nav** — the Solutions menu gains 医療・ヘルスケア and 物流・ロジスティクス, which the sheet adds for Japan only (【JP追加】).',
          '',
          '## Not wired, and deliberately so',
          '',
          'Every link is `href="#"`, exactly as on the global page — the sheet’s `JP URL` column records which Japanese destinations exist, which are planned in `JP_page_plan`, and which are provisional stand-ins for a page that does not exist yet. Wiring half-real URLs would make the page look routed when it is not.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/**
 * The whole page, in Japanese, on the light canvas.
 *
 * `globals` rather than a parameter: the light/dark switch is a Storybook global that the preview
 * decorator reads, so setting it here is the same lever the toolbar pulls and the toolbar can still
 * pull it back.
 */
export const Page: Story = {
  globals: { colorScheme: 'light' },
  render: () => <JapanHome />,
}

/** The same page at a phone's width — where the Japanese headings wrap differently from the English. */
export const Narrow: Story = {
  globals: { colorScheme: 'light' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => <JapanHome />,
}

/** The same page on the dark canvas, for checking the copy against the scheme the library is drawn in. */
export const Dark: Story = {
  globals: { colorScheme: 'dark' },
  render: () => <JapanHome />,
}

/**
 * Every nav string still showing in English.
 *
 * The Japanese nav is a translation layer over `site-nav.ts` — see `site-nav.ja.ts` — so anything the
 * sheet does not give a Japanese label for falls through rather than failing. This lists what fell
 * through, so a gap is visible here instead of only in the rendered menu.
 */
export const UntranslatedNavLabels: Story = {
  parameters: { layout: 'padded', frame: { fullBleed: false } },
  render: () =>
    UNTRANSLATED_NAV_LABELS.length ? (
      <ul>
        {UNTRANSLATED_NAV_LABELS.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    ) : (
      <p>Every nav string has a Japanese entry.</p>
    ),
}
