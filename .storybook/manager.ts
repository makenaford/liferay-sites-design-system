import { addons } from 'storybook/manager-api'
import { CURRENT_STORY_WAS_SET, SET_INDEX } from 'storybook/internal/core-events'
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
  /*
   * Arrive with only `Built Pages` open: the finished pages are what a visitor comes to see, and the
   * library under them is a click away. Root ids are the sidebar titles, kebab-cased.
   */
  sidebar: {
    collapsedRoots: ['overview', 'components', 'templates'],
  },
})

/*
 * Arrive on a built page, not on `Overview/Introduction`.
 *
 * The sidebar always opens the group of whatever is selected, so landing on the first entry in the sort
 * — the introduction — held `Overview` open whatever `collapsedRoots` said. A visit with no `path` goes
 * to the Home page instead, so `Built Pages` is the one group open. A link to any particular story
 * carries a `path` and is left alone.
 */
const LANDING = 'built-pages-home-home--page'

/*
 * The address the page was *loaded* with. By the time this runs Storybook has already written the first
 * entry's `path` into the URL, so `location` cannot say whether the visitor asked for one.
 */
const arrivedWithPath = () => {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return new URL(entry?.name ?? window.location.href).searchParams.has('path')
}

addons.register('liferay-sites/landing', (api) => {
  if (arrivedWithPath()) return
  let done = false
  const land = () => {
    if (done) return
    done = true
    api.selectStory(LANDING)
  }
  /* Whichever comes first: the index arriving, or Storybook settling on its default entry. */
  api.on(SET_INDEX, land)
  api.on(CURRENT_STORY_WAS_SET, land)
})
