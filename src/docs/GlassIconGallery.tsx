import type { ComponentType } from 'react'
import { CopyButton, Paper, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core'
import * as glassIcons from '../icons/glass.generated'
import type { GlassIconProps } from '../icons/glass.generated'
import { DocsFrame } from './DocsFrame'

type GlassIconComponent = ComponentType<GlassIconProps>

/** Every generated glass icon, paired with the export name a consumer would import. */
const entries = Object.entries(glassIcons)
  .filter(([name]) => name.startsWith('IconGlass'))
  .map(([name, Component]) => [name, Component as GlassIconComponent] as const)

/**
 * Renders the declared illustrative icons at the 48px box a card uses, with the import name under
 * each. Reads from the generated module, so it cannot drift from what the library ships — adding a
 * path to `glass-manifest.json` and running `pnpm glass-icons` makes it appear here.
 */
export function GlassIconGallery() {
  return (
    <DocsFrame>
      <Stack gap="16">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          {entries.length} of the 165 illustrative icons are declared, shown at their 48px card box.
          Click one to copy its import name.
        </Text>
        <SimpleGrid cols={{ base: 2, xs: 3, sm: 4 }} spacing="12">
          {entries.map(([name, Icon]) => (
            <CopyButton key={name} value={name}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : name} withArrow>
                  <Paper
                    withBorder
                    p="16"
                    radius="md"
                    bg="var(--sds-surfaces-card-bg-grey)"
                    onClick={copy}
                    role="button"
                    tabIndex={0}
                  >
                    <Stack gap="8" align="center">
                      <Icon />
                      <Text fz="xs" ta="center" ff="monospace" lineClamp={2}>
                        {name.replace(/^IconGlass/, '')}
                      </Text>
                    </Stack>
                  </Paper>
                </Tooltip>
              )}
            </CopyButton>
          ))}
        </SimpleGrid>
      </Stack>
    </DocsFrame>
  )
}
