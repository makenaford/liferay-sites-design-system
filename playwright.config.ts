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

export default defineConfig({
  testDir: './tests',
  /* The suite walks every story; a slow machine should not turn that into a failure. */
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  /**
   * Its own port, so a test run cannot collide with a Storybook you already have open on 6006 or
   * 6007 — and `reuseExistingServer` locally so repeat runs do not pay the startup twice.
   */
  webServer: {
    command: `pnpm exec storybook dev -p ${PORT} --no-open --quiet`,
    url: `http://localhost:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
