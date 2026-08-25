import { expect, test, type Page, type APIRequestContext } from '@playwright/test'

/**
 * Structural checks against every story in the library.
 *
 * The list comes from Storybook's own `index.json`, so a new component is covered the moment it has a
 * story — there is no register of tested things to keep in sync, which is the usual way a suite like
 * this rots.
 */

const WIDTHS = [
  { name: '375 (phone)', width: 375, height: 812 },
  { name: '768 (tablet)', width: 768, height: 1024 },
  { name: '1440 (desktop)', width: 1440, height: 900 },
]

const SCHEMES = ['dark', 'light'] as const

interface StoryEntry {
  id: string
  title: string
  name: string
  type?: string
  tags?: string[]
}

/**
 * Stories tagged `desktop-only` are exempt below this width.
 *
 * Only the authoring tools carry it — a builder is a rail beside a live preview, which has no phone
 * form. Tagging is deliberate over a hardcoded skip list: the exemption lives next to the story that
 * claims it, so it is visible when someone opens the file rather than buried in the test.
 */
const DESKTOP_ONLY_ABOVE = 1200

async function storyIds(request: APIRequestContext): Promise<StoryEntry[]> {
  const res = await request.get('/index.json')
  expect(res.ok(), 'Storybook index.json should be reachable').toBeTruthy()
  const index = (await res.json()) as { entries: Record<string, StoryEntry> }
  return (
    Object.values(index.entries)
      /* Docs pages stack every story of a component into one column; their width is not a claim. */
      .filter((entry) => entry.type !== 'docs')
      .sort((a, b) => a.id.localeCompare(b.id))
  )
}

const url = (id: string, scheme: string) =>
  `/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=colorScheme:${scheme}`

/**
 * Wait until the story is actually on the page.
 *
 * `load` only means the document finished; Storybook's dev server compiles stories on demand, and
 * under parallel workers one can still be rendering when the page fires load. Measuring then reports
 * an empty document, which passes — so the flake was a *false pass* as often as a false failure. Waits
 * for the root to have content and for the fonts, which change wrapping.
 */
async function settled(page: Page) {
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root')
      return Boolean(root && root.childElementCount > 0 && document.body.classList.contains('sb-show-main'))
    },
    undefined,
    { timeout: 20_000 },
  )
  await page.evaluate(() => document.fonts.ready)
}

/** Everything sticking out past the viewport that is not inside something that scrolls on purpose. */
async function overflowingElements(page: Page) {
  return page.evaluate(() => {
    const limit = document.documentElement.clientWidth
    const offenders: string[] = []

    document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.right <= limit + 1) return

      /*
       * A carousel track, a scrolling tab bar and a marquee are all *meant* to be wider than their
       * box — they are scrollers, and their overflow is clipped by an ancestor. Only overflow that
       * nothing clips reaches the document and drags the page sideways, so that is what counts.
       */
      let parent = el.parentElement
      while (parent && parent !== document.documentElement) {
        const style = getComputedStyle(parent)
        if (style.overflowX !== 'visible' || style.overflow !== 'visible') return
        parent = parent.parentElement
      }

      const name = el.tagName.toLowerCase() + (el.className ? `.${String(el.className).slice(0, 40)}` : '')
      if (!offenders.includes(name)) offenders.push(name)
    })

    return { offenders, scrollWidth: document.documentElement.scrollWidth, clientWidth: limit }
  })
}

for (const scheme of SCHEMES) {
  for (const viewport of WIDTHS) {
    test(`no horizontal overflow — ${viewport.name}, ${scheme}`, async ({ page, request }) => {
      const stories = await storyIds(request)
      expect(stories.length, 'there should be stories to check').toBeGreaterThan(0)

      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      const failures: string[] = []

      for (const story of stories) {
        if (viewport.width < DESKTOP_ONLY_ABOVE && story.tags?.includes('desktop-only')) continue

        await page.goto(url(story.id, scheme), { waitUntil: 'load' })
        await settled(page)

        const { offenders, scrollWidth, clientWidth } = await overflowingElements(page)
        if (scrollWidth > clientWidth + 1 || offenders.length) {
          failures.push(
            `${story.id} — document ${scrollWidth} > viewport ${clientWidth}` +
              (offenders.length ? `\n    ${offenders.slice(0, 4).join('\n    ')}` : ''),
          )
        }
      }

      expect(
        failures,
        `Stories overflowing at ${viewport.width}px in ${scheme} mode:\n\n${failures.join('\n')}\n`,
      ).toHaveLength(0)
    })
  }
}

/**
 * Nothing should throw while rendering.
 *
 * One width and one scheme: a component that throws does so regardless of how wide the window is, and
 * running this three times over would only make the same failure noisier.
 */
test('no console errors while rendering', async ({ page, request }) => {
  const stories = await storyIds(request)
  await page.setViewportSize({ width: 1440, height: 900 })

  const failures: string[] = []
  let current = ''

  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const text = message.text()
    /* A missing image in a story fixture is the fixture's problem, not the component's. */
    if (/Failed to load resource/i.test(text)) return
    failures.push(`${current}: ${text.slice(0, 200)}`)
  })
  page.on('pageerror', (error) => failures.push(`${current}: ${error.message.slice(0, 200)}`))

  for (const story of stories) {
    current = story.id
    await page.goto(url(story.id, 'dark'), { waitUntil: 'load' })
    await settled(page)
  }

  expect(failures, `Stories logging errors:\n\n${failures.join('\n')}\n`).toHaveLength(0)
})
