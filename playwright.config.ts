import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright, for the one class of bug this library keeps producing: layout that breaks at a width
 * nobody looked at.
 *
 * Every real defect found while building the Home page was in that class — a pill bar collapsing to
 * zero, `ContentMedia` silently clipping a stat row, a button label running out through the gutter,
 * a tab bar 823px wide inside a 311px column. All four were found by hand. None of them needed a
 * screenshot to detect: they are all "does this story overflow its own viewport".
 *
 * So this is not a visual-regression suite. There are no reference images to approve and nothing to
 * re-baseline when a colour changes — it asks structural questions of every story at three widths, in
 * both colour schemes, and those answers are either yes or no.
 */
const PORT = 6009
const CI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests',
  /*
   * The suite walks every story in one test, so the budget is per *run* rather than per assertion. CI
   * gets more of it: a two-core runner is several times slower than a laptop, and the first attempt
   * at 120s timed out there while passing locally in 90.
   */
  timeout: CI ? 600_000 : 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  /* Seven workers against two cores thrash. Locally, let Playwright decide. */
  workers: CI ? 2 : undefined,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  /**
   * Its own port, so a run cannot collide with a Storybook already open on 6006 or 6007.
   *
   * **CI serves the built Storybook; locally it runs the dev server.** The dev server compiles each
   * story the first time it is asked for, which is fine on a laptop and ruinous on a two-core runner —
   * the first CI attempt spent its whole budget waiting for stories to compile and timed out. CI
   * builds Storybook for Pages regardless, so the tests now run against that same output: nothing to
   * compile, and no second build. `vite preview` serves it because Vite is already a dependency.
   */
  webServer: {
    command: CI
      ? `pnpm exec vite preview --outDir storybook-static --port ${PORT} --strictPort`
      : `pnpm exec storybook dev -p ${PORT} --no-open --quiet`,
    url: `http://localhost:${PORT}/index.json`,
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
})
