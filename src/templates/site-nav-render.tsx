import { Button } from '../components/Button'
import { MegaMenu } from '../components/Header'
import { IconArrowRight } from '../icons'
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
        {menu.tiles ? (
          <MegaMenu.Tiles>
            {menu.tiles.map((tile) => (
              <MegaMenu.Tile key={tile.title} href={tile.href}>
                {tile.title}
              </MegaMenu.Tile>
            ))}
          </MegaMenu.Tiles>
        ) : null}

        <MegaMenu.Columns>
          {menu.columns.map((column, i) => (
            <MegaMenu.Column key={column.heading ?? i} heading={column.heading}>
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
           * `wide` where the cards carry a thumbnail: the Resources rail in the file is landscape
           * images beside their text, not a narrow list of links.
           */
          <MegaMenu.Featured
            heading={menu.featuredHeading ?? 'Featured'}
            wide={menu.featured.some((item) => item.hue !== undefined)}
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
          <Button rightSection={<IconArrowRight />}>{menu.cta.label}</Button>
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
      { label: 'Create Account', href: '#' },
      { label: 'Sign In', href: '#' },
    ],
  },
  cta: (
    <Button size="md">Contact Sales</Button>
  ),
}
