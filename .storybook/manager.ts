import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

/**
 * The Storybook shell's own branding — the sidebar heading and the browser tab.
 *
 * Only the chrome is themed here. The stories themselves render in the library's real theme through
 * `LiferaySitesProvider` in `preview.tsx`, so nothing in this file can make a component look right when
 * it is not.
 */
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Liferay Sites Design System',
    brandUrl: 'https://github.com/makenaford/liferay-sites-design-system',
    brandTarget: '_self',
  }),
})
