import type { Preview } from '@storybook/react-vite'
import { MantineProvider } from '@mantine/core'
import { cssVariablesResolver } from '../src/theme/cssVariables'
import { theme } from '../src/theme/theme'
import { StoryFrame, type StoryFrameOptions } from './StoryFrame'

import '@mantine/core/styles.css'
import '../src/theme/typography.generated.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    docs: { codePanel: true },
    controls: { matchers: { color: /(background|color)$/i } },
    options: {
      storySort: {
        order: ['Overview', ['Introduction', 'Design Tokens'], 'Components'],
      },
    },
  },

  globalTypes: {
    colorScheme: {
      name: 'Color scheme',
      description: 'Light or dark mode, as defined in the Figma library',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'light', icon: 'circlehollow', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },

  /** Dark is the mode the Figma library is drawn in. */
  initialGlobals: { colorScheme: 'dark' },

  decorators: [
    (Story, context) => {
      const colorScheme = context.globals.colorScheme === 'light' ? 'light' : 'dark'
      const frame = (context.parameters.frame ?? {}) as StoryFrameOptions
      // In Docs each story is one block in a long page, so the frame must not fill the viewport.
      const fullBleed = context.viewMode !== 'docs'

      return (
        /**
         * `forceColorScheme` lets the toolbar drive the scheme directly, rather than Mantine
         * restoring a previously stored preference between stories.
         */
        <MantineProvider
          theme={theme}
          cssVariablesResolver={cssVariablesResolver}
          forceColorScheme={colorScheme}
        >
          <StoryFrame {...frame} fullBleed={fullBleed}>
            <Story />
          </StoryFrame>
        </MantineProvider>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
