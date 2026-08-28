import { MantineProvider, mergeThemeOverrides, type MantineProviderProps } from '@mantine/core'
import { cssVariablesResolver } from './cssVariables'
import { theme } from './theme'

import '@mantine/core/styles.css'
import './typography.generated.css'

export interface LiferaySitesProviderProps
  extends Omit<MantineProviderProps, 'theme' | 'cssVariablesResolver'> {
  /** Optional overrides, merged on top of the design system theme rather than replacing it. */
  theme?: MantineProviderProps['theme']
}

/**
 * Wraps `MantineProvider` with this design system's theme and its `--sds-*` variables, and pulls in
 * the two stylesheets every component depends on. Applications render it once at their root.
 *
 * Defaults to the dark colour scheme, which is the mode the Figma library is drawn in; pass
 * `defaultColorScheme="light"` or `"auto"` to change that.
 */
export function LiferaySitesProvider({
  children,
  defaultColorScheme = 'dark',
  theme: themeOverride,
  ...props
}: LiferaySitesProviderProps) {
  return (
    <MantineProvider
      theme={themeOverride ? mergeThemeOverrides(theme, themeOverride) : theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme={defaultColorScheme}
      {...props}
    >
      {children}
    </MantineProvider>
  )
}
