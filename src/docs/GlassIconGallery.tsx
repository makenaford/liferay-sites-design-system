import type { ComponentType } from 'react'
import { CopyButton, Paper, SimpleGrid, Stack, Text, Title, Tooltip } from '@mantine/core'
import * as glassIcons from '../icons/glass.generated'
import type { GlassIconProps } from '../icons/glass.generated'
import { DocsFrame } from './DocsFrame'

type GlassIconComponent = ComponentType<GlassIconProps>
type Entry = readonly [name: string, Icon: GlassIconComponent]

/** Every generated glass icon, by the export name a consumer would import. */
const all = new Map(
  Object.entries(glassIcons)
    .filter(([name]) => name.startsWith('IconGlass'))
    .map(([name, Component]) => [name, Component as GlassIconComponent]),
)

/** `product-modules/dxp` -> `IconGlassProductModulesDxp` — the name `build-glass-icons.mjs` gives a library icon. */
const libraryName = (key: string) =>
  `IconGlass${key
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')}`

/** `customer-support` -> `Customer Support`. */
const titled = (slug: string) => slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')

/*
 * The library's icons by category, read off the folders `sync-glass-icons.mjs` mirrors them into. Only the
 * paths are wanted — the components come from the generated module — so nothing here is loaded.
 */
const libraryPaths = Object.keys(import.meta.glob('../../assets/glass-icons/library/*/*.svg'))
const libraryNames = new Set<string>()
const libraryGroups = new Map<string, Entry[]>()
const libraryKeys = libraryPaths
  .map((path) => path.replace(/^.*\/library\//, '').replace(/\.svg$/, ''))
  /*
   * By category, then name, compared part by part — so `cdn` comes before `cdn-2` and `customer` before
   * `customer-support`. Sorting the whole path put `-` (and the `.svg` it ended in) between them.
   */
  .sort((a, b) => {
    const [ac, an] = a.split('/')
    const [bc, bn] = b.split('/')
    return ac !== bc ? (ac < bc ? -1 : 1) : an < bn ? -1 : an > bn ? 1 : 0
  })
for (const key of libraryKeys) {
  const name = libraryName(key)
  const Icon = all.get(name)
  if (!Icon) continue
  libraryNames.add(name)
  const category = titled(key.split('/')[0])
  libraryGroups.set(category, [...(libraryGroups.get(category) ?? []), [name, Icon]])
}

const curated: Entry[] = [...all].filter(([name]) => !libraryNames.has(name))

function Grid({ entries, strip = '' }: { entries: readonly Entry[]; strip?: string }) {
  return (
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
                    {name.replace(/^IconGlass/, '').replace(strip, '') || name.replace(/^IconGlass/, '')}
                  </Text>
                </Stack>
              </Paper>
            </Tooltip>
          )}
        </CopyButton>
      ))}
    </SimpleGrid>
  )
}

/**
 * The curated icons at the 48px box a card uses, with the import name under each. Reads from the
 * generated module, so it cannot drift from what the library ships — adding a path to
 * `glass-manifest.json` and running `pnpm glass-icons` makes it appear here.
 */
export function GlassIconGallery() {
  return (
    <DocsFrame>
      <Stack gap="16">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          {curated.length} illustrative icons, shown at their 48px card box. Click one to copy its import name.
        </Text>
        <Grid entries={curated} />
      </Stack>
    </DocsFrame>
  )
}

/**
 * The Marketing Assets library's set, by its own categories — what `pnpm glass-icons:sync` mirrors into
 * `assets/glass-icons/library/`. Each tile shows the name within its category; the tooltip and the copy
 * are the full import name.
 */
export function GlassIconLibraryGallery() {
  return (
    <DocsFrame>
      <Stack gap="24">
        <Text fz="sm" c="var(--sds-surfaces-text-tertiary)">
          {libraryNames.size} icons from the Marketing Assets library, in {libraryGroups.size} categories. Click one to
          copy its import name.
        </Text>
        {[...libraryGroups].map(([category, entries]) => (
          <Stack key={category} gap="8">
            <Title order={4} fz="sm">
              {category}
            </Title>
            <Grid entries={entries} strip={category.replace(/\s+/g, '')} />
          </Stack>
        ))}
      </Stack>
    </DocsFrame>
  )
}
