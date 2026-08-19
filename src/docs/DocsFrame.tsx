import type { ReactNode } from 'react'
import { Box } from '@mantine/core'
import { ScratchProvider } from '../theme'
import classes from './docs.module.css'

/**
 * Storybook applies the `preview.tsx` decorators to *stories*, not to loose JSX inside an `.mdx`
 * page, so anything rendered directly in the docs has to bring its own provider. Shared by every
 * docs component rather than each repeating the setup.
 */
export function DocsFrame({ children }: { children: ReactNode }) {
  return (
    <ScratchProvider>
      <Box className={classes.frame} bg="var(--mantine-color-body)" p="16" bdrs="md">
        {children}
      </Box>
    </ScratchProvider>
  )
}
