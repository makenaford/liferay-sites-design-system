import { Button } from '../components/Button'
import { MegaMenu } from '../components/Header'
import { LanguagePicker } from '../components/Input'
import { Link } from '../components/Link'
import { IconArrowRight, IconDown, IconUser1Filled } from '../icons'
import { navIcon } from './nav-icons'
import { logoTile } from './logo-tile'
import { SITE_NAV, type NavMenu } from './site-nav'

/**
 * The nav, rendered from `SITE_NAV`.
 *
 * One renderer for both consumers. The `Header` stories and `SiteHeader` used to build their own menus
 * from separate copies of the content, so the templates — which is what a designer actually opens —
 * showed a plainer nav than the component's own stories, and neither picked up the other's changes.
 */
function menuOf(menu: NavMenu) {
  return (
    <MegaMenu>
      <MegaMenu.Body>
        {menu.heading ? <MegaMenu.Heading>{menu.heading}</MegaMenu.Heading> : null}

        <MegaMenu.Columns>
          {menu.columns.map((column, i) => (
            /*
             * A menu with tiles heads each column with its own, in place of the label: the tile is the
             * group's destination, and pairing the two here rather than drawing a separate row above
             * keeps a tile over the column it introduces at every width.
             */
            <MegaMenu.Column
              key={column.heading ?? i}
              heading={column.heading}
              tile={
                menu.tiles?.[i] ? (
                  <MegaMenu.Tile
                    href={menu.tiles[i].href}
                    icon={navIcon(menu.tiles[i].icon)}
                  >
                    {menu.tiles[i].title}
                  </MegaMenu.Tile>
                ) : undefined
              }
            >
              {column.links.map((link) => (
                <MegaMenu.Item
                  key={link.title}
                  href={link.href}
                  icon={navIcon(link.icon)}
                  title={link.title}
                  description={link.description}
                />
              ))}
            </MegaMenu.Column>
          ))}
        </MegaMenu.Columns>

        {menu.featured?.length ? (
          /*
           * `wide` where the cards carry a thumbnail *beside* their text: the Resources rail in the
           * file is landscape images in a wide rail. Solutions stacks instead — image over text in a
           * narrow rail — which is also what leaves the columns room for four across.
           */
          <MegaMenu.Featured
            heading={menu.featuredHeading ?? 'Featured'}
            wide={!menu.featuredStacked && menu.featured.some((item) => item.hue !== undefined)}
          >
            {menu.featured.map((item) => (
              <MegaMenu.FeaturedCard
                key={item.title}
                href={item.href}
                thumbnail={
                  item.hue === undefined ? undefined : (
                    <img src={logoTile(item.title.split(/[\s']/)[0], item.hue)} alt="" />
                  )
                }
                stacked={menu.featuredStacked}
                title={item.title}
                description={item.description}
              />
            ))}
            {menu.featuredMore ? (
              <MegaMenu.More href={menu.featuredMore.href}>{menu.featuredMore.label}</MegaMenu.More>
            ) : null}
          </MegaMenu.Featured>
        ) : null}
      </MegaMenu.Body>

      {menu.cta ? (
        <MegaMenu.Cta label="Ready to Evaluate?">
          <Button variant="outline" size="md" rightSection={<IconArrowRight />}>
            {menu.cta.label}
          </Button>
        </MegaMenu.Cta>
      ) : null}
    </MegaMenu>
  )
}

/** What `Header` takes for `items`. */
export const SITE_NAV_ITEMS = SITE_NAV.map((menu) => ({
  value: menu.value,
  label: menu.label,
  menu: menuOf(menu),
}))

/** The foot of the mobile drawer: the same three controls the bar holds, as data. */
export const SITE_DRAWER_CONTROLS = {
  language: {
    label: 'EN (US)',
    value: 'en-US',
    options: [
      { value: 'en-US', label: 'EN (US)' },
      { value: 'fr-FR', label: 'Français' },
      { value: 'de-DE', label: 'Deutsch' },
      { value: 'it-IT', label: 'Italiano' },
      { value: 'pt-BR', label: 'Português (BR)' },
      { value: 'es-ES', label: 'Español' },
      { value: 'zh-CN', label: '中文' },
      { value: 'ja-JP', label: '日本語' },
    ],
  },
  login: {
    items: [
      { label: 'Login', href: '#' },
      { label: 'Create an Account', href: '#' },
    ],
  },
  /*
   * `sm`, because this button is drawn twice on a phone — compact in the bar beside the burger, and
   * stretched full width at the foot of the drawer. One source, so a page cannot ship two different
   * calls to action; the width is the drawer's, the height is the bar's.
   */
  cta: <Button size="sm">Contact Sales</Button>,
}

/**
 * The right-hand side of the bar: language, account, a call to action.
 *
 * Exported for the same reason the menus are. `SiteHeader` and the `Header` stories each built their
 * own, so the stories showed two bare links where the templates showed the file's combobox and an
 * account link with its person and its caret — and a fix to one never reached the other.
 */
export const SITE_ACTIONS = (
  <>
    {/*
     * Both carets are the nav's `IconDown`, not the field's small filled one: these sit in the same row
     * as Platform and Solutions, and two different arrows across one bar reads as an oversight. The
     * picker takes it as an override — its own default is right for a caret inside a form field.
     */}
    <LanguagePicker
      aria-label="Language"
      defaultValue={SITE_DRAWER_CONTROLS.language.value}
      data={SITE_DRAWER_CONTROLS.language.options}
      rightSection={<IconDown />}
    />
    <Link href="#" size="md" leftSection={<IconUser1Filled />} rightSection={<IconDown />}>
      Log In
    </Link>
    <Button size="sm">Contact Sales</Button>
  </>
)
