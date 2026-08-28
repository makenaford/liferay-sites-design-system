// url=https://www.figma.com/design/KihJKyGA20stc2SSjAlxYU/Solutions-Library--2026?node-id=16288-12662
// source=src/index.ts
// component=Footer
//
// Code Connect mapping for the Figma `LRDC footer` set.
//
// `Property 1` is Desktop or Mobile and does not reach the snippet: the columns are a grid of 214px tracks
// — Figma's own column width — so the count follows the available space rather than a variant. The file's
// two cells are the two ends of that range.
//
// The CTA and figures bands are slots rather than built in: they are a `Section` with a `Form` and a
// `StatBar`, both of which already exist. The snippet shows the footer alone, since that is what most pages
// need; `FullFooter` in Storybook shows all three bands.
import figma from 'figma'

const instance = figma.selectedInstance

/** Read to be explicit that it is deliberately unused: both cells are the same code at different widths. */
instance.getEnum('Property 1', {
  Desktop: 'responsive',
  Mobile: 'responsive',
})

export default {
  example: figma.code`
    <Footer
      brand={
        <Footer.Brand
          logo={<Logo />}
          address={'1400 Montefino Avenue\\nDiamond Bar, CA 91765'}
          social={socialIcons}
        />
      }
      legal={
        <>
          <span>© 2026 Liferay, Inc.</span>
          <Link href="/privacy" variant="secondary" size="md">Privacy policy</Link>
        </>
      }
    >
      <Footer.Column title="Getting Started">
        <Footer.Link href="/trial">Start a trial</Footer.Link>
        <Footer.Link href="/docs">Documentation</Footer.Link>
      </Footer.Column>

      <Footer.Column title="Company">
        <Footer.Link href="/about">About us</Footer.Link>
        <Footer.Link href="/careers">Careers</Footer.Link>
      </Footer.Column>
    </Footer>
  `,
  imports: ['import { Footer, Link } from "liferay-sites-design-system"'],
  id: 'footer',
  metadata: { nestable: false },
}
