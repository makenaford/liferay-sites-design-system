import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Text } from '@mantine/core'
import { Footer } from './Footer'
import { Button } from '../Button'
import { Form } from '../Form'
import { TextInput } from '../Input'
import { Link } from '../Link'
import { SectionTitle } from '../Section'
import { Logo } from '../Logo'
import { Stat, StatBar } from '../Stat'
import {
  IconArrowUp,
  IconFacebook,
  IconGithub,
  IconInstagram,
  IconLinkedin,
  IconSocialX,
  IconYoutube,
} from '../../icons'

const socialIcons = [
  ['LinkedIn', IconLinkedin],
  ['X', IconSocialX],
  ['YouTube', IconYoutube],
  ['GitHub', IconGithub],
  ['Facebook', IconFacebook],
  ['Instagram', IconInstagram],
].map(([name, Glyph]) => {
  const Icon = Glyph as typeof IconLinkedin
  return (
    <a key={name as string} href="#" aria-label={name as string}>
      <Icon aria-hidden />
    </a>
  )
})

const COLUMNS = [
  ['Getting Started', ['Start a trial', 'Documentation', 'Training', 'Partner directory', 'Support']],
  ['New to Liferay?', ['What is a DXP?', 'Why Liferay', 'Customer stories', 'Pricing', 'Book a demo']],
  ['See What’s Possible', ['Enterprise websites', 'Customer portals', 'Digital commerce', 'Intranets']],
  ['Developers', ['API reference', 'Release notes', 'Community forum', 'Marketplace', 'Contribute']],
  ['Company', ['About us', 'Careers', 'Newsroom', 'Events', 'Contact us']],
  ['Legal', ['Privacy policy', 'Terms of service', 'Cookie preferences', 'Trademarks']],
]

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'Figma `LRDC footer` component set (node `16288:12662`) — three stacked bands that the file draws as one component: a grey CTA (`Page Action Section`), a blue figures strip (`Number Footer`), and the dark footer proper (`Footer LRDC Base`).',
          '',
          '**The top two bands are slots, not built in.** They are separate sections that happen to sit above a footer: the CTA is a `Section` with a `Form`, and the strip is a `StatBar`. Building them in would mean a second, worse copy of two components that already exist — and plenty of pages want the footer without either.',
          '',
          '**The columns reflow without a breakpoint.** Figma has a nine-column Desktop cell and a Mobile cell 4,828px tall with everything stacked. Rather than switch between those, the columns are a grid of `minmax(214px, 1fr)` tracks — 214px being Figma’s own column width — so the count follows the space, and Figma’s two cells are the two ends of that range.',
          '',
          '**`Action/Neutral/Inverted` is correct here**, for once. That token is `#ffffff` in both colour modes, which is what made the `neutral` button and the `secondary` link invisible in light mode. The dark band is dark in *both* modes by design, so white is right — and its ground and vignette are mode-independent for the same reason.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

const columns = COLUMNS.map(([title, links]) => (
  <Footer.Column key={title as string} title={title as string}>
    {(links as string[]).map((label) => (
      <Footer.Link key={label} href="#">
        {label}
      </Footer.Link>
    ))}
  </Footer.Column>
))

const brand = (
  <Footer.Brand
    logo={<Logo />}
    address={'1400 Montefino Avenue\nDiamond Bar, CA 91765\nUnited States'}
    social={socialIcons}
  />
)

const legal = (
  <>
    <Text fz="16" span>
      © 2026 Liferay, Inc. All rights reserved.
    </Text>
    <Link href="#" variant="secondary" size="md">
      Privacy policy
    </Link>
    <Link href="#" variant="secondary" size="md">
      Terms of use
    </Link>
  </>
)

/** The dark footer on its own — no CTA band, no figures strip. What most pages want. */
export const Playground: Story = {
  render: () => (
    <Footer brand={brand} legal={legal}>
      {columns}
    </Footer>
  ),
}

/** **All three bands**, as the Figma component draws them: the CTA, the figures strip, then the footer. */
export const FullFooter: Story = {
  render: () => (
    <Footer
      brand={brand}
      legal={legal}
      cta={
        <Box maw={1280} mx="auto">
          <SectionTitle
            align="center"
            order={2}
            title="Ready to see it on your own content?"
            description="A sandbox within the hour, and nothing to install."
          />
          <Box maw={630} mx="auto" mt="32">
            <Form
              submit={
                <Button type="submit" size="md" fullWidth>
                  Get access
                </Button>
              }
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Row>
                <TextInput floating label="Work Email" type="email" required />
              </Form.Row>
            </Form>
          </Box>
        </Box>
      }
      stats={
        <Box maw={1280} mx="auto">
          <StatBar align="center">
            <Stat size="sm" value="1,200+" label="Enterprise customers" rightSection={<IconArrowUp />} />
            <Stat size="sm" value="60+" label="Countries" />
            <Stat size="sm" value="24/7" label="Support" />
          </StatBar>
        </Box>
      }
    >
      {columns}
    </Footer>
  ),
}

/** With the bubble artwork behind the dark band. The asset is not bundled — this is a CSS stand-in. */
export const WithBackdrop: Story = {
  render: () => (
    <Footer
      brand={brand}
      legal={legal}
      backdrop={
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(60% 80% at 30% 10%, rgba(55,124,255,0.55) 0%, transparent 70%), radial-gradient(50% 70% at 80% 30%, rgba(186,143,255,0.4) 0%, transparent 70%)',
          }}
        />
      }
    >
      {columns}
    </Footer>
  ),
}

/** Two columns and no brand — a small site's footer, from the same component. */
export const Minimal: Story = {
  render: () => (
    <Footer legal={legal}>
      {columns.slice(0, 2)}
    </Footer>
  ),
}

/** Narrow, where the grid has resolved to a single column. */
export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <Footer brand={brand} legal={legal}>
      {columns.slice(0, 3)}
    </Footer>
  ),
}
