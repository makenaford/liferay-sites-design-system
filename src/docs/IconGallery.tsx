import type { ComponentType } from 'react'
import { CopyButton, Paper, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core'
import * as icons from '../icons/generated'
import type { IconProps } from '../icons/generated'
import manifest from '../icons/manifest.json'
import { DocsFrame } from './DocsFrame'

type IconComponent = ComponentType<IconProps>

/** Every generated icon, paired with the export name a consumer would import. */
const entries = Object.entries(icons)
  .filter(([name]) => name.startsWith('Icon'))
  .map(([name, Component]) => [name, Component as IconComponent] as const)

/**
 * Renders the whole icon set at its rendered size, with the import name under each. Reads from the
 * generated module, so it cannot drift from what the library actually ships — adding a name to
 * `manifest.json` and running `pnpm icons` makes it appear here.
 */
export function IconGallery() {
  return (
    <DocsFrame>
      <Stack gap="16">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          {entries.length} icons from MingCute. Click one to copy its import name.
        </Text>
        <SimpleGrid cols={{ base: 3, xs: 4, sm: 6 }} spacing="12">
          {entries.map(([name, Icon]) => (
            <CopyButton key={name} value={name}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : name} withArrow>
                  <Paper
                    withBorder
                    p="12"
                    radius="md"
                    bg="var(--sds-surfaces-card-bg-grey)"
                    onClick={copy}
                    role="button"
                    tabIndex={0}
                  >
                    <Stack gap="8" align="center">
                      <Text fz={24} c="var(--sds-action-link-default-link)" component="span">
                        <Icon width={24} height={24} />
                      </Text>
                      <Text fz="xs" ta="center" ff="monospace" lineClamp={2}>
                        {name.replace(/^Icon/, '')}
                      </Text>
                    </Stack>
                  </Paper>
                </Tooltip>
              )}
            </CopyButton>
          ))}
        </SimpleGrid>
        <Text fz="xs" c="var(--sds-surfaces-text-tertiary)">
          Declared in <code>src/icons/manifest.json</code> ({manifest.regular.length} regular,{' '}
          {manifest.filled.length} filled).
        </Text>
      </Stack>
    </DocsFrame>
  )
}
