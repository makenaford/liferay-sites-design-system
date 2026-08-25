import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],

  /**
   * Mockup footage is served, not bundled.
   *
   * `media/` is **git-ignored**: a single 1200x800 alpha webm runs to 15MB, and a library that
   * accumulates one per mockup would put hundreds of megabytes into everyone's clone forever — git
   * keeps every version of a binary it has ever seen. Files here are copied into the build as-is and
   * referenced by URL, so nothing goes through the bundler and a missing file costs a 404 rather than
   * a failed build.
   *
   * See `media/README.md` for where the files come from and how the deployed Storybook gets them.
   */
  staticDirs: [{ from: '../media', to: '/media' }],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  /**
   * vite.config.ts builds the library bundle; that `lib` target would otherwise override
   * Storybook's own multi-entry build.
   */
  viteFinal: async (config) => {
    delete config.build?.lib
    delete config.build?.rollupOptions
    return config
  },
}

export default config
