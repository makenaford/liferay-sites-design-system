import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
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
