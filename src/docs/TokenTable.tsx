import { Box, Group, Paper, SimpleGrid, Stack, Table, Text } from '@mantine/core'
import { colorDark, colorLight, radius, spacing, typography } from '../theme/tokens.generated'
import { DocsFrame } from './DocsFrame'

/** Groups the flat colour token record by its first Figma path segment. */
function groupByFamily(tokens: Record<string, string>) {
  const families = new Map<string, string[]>()
  for (const key of Object.keys(tokens)) {
    const family = key.split('-')[0]
    families.set(family, [...(families.get(family) ?? []), key])
  }
  return [...families.entries()]
}

/**
 * Renders every colour token as a swatch pair, so the light and dark value of a token sit side by
 * side. Reads straight from the generated tokens — this page cannot drift from the Figma export.
 */
export function ColorTokens() {
  return (
    <DocsFrame>
      <Stack gap="32">
        {groupByFamily(colorLight).map(([family, keys]) => (
          <Stack key={family} gap="12">
            <Text fz="lg" fw={600} tt="capitalize">
              {family}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="12">
              {keys.map((key) => (
                <Paper
                  key={key}
                  withBorder
                  p="12"
                  radius="md"
                  bg="var(--sds-surfaces-card-bg-grey)"
                >
                  <Group gap="12" wrap="nowrap">
                    <Group gap="4" wrap="nowrap">
                      <Box w={28} h={40} bg={colorLight[key as keyof typeof colorLight]} />
                      <Box w={28} h={40} bg={colorDark[key as keyof typeof colorDark]} />
                    </Group>
                    <Stack gap={0}>
                      <Text fz="sm" fw={600} ff="monospace">
                        --sds-{key}
                      </Text>
                      <Text fz="xs" c="var(--sds-surfaces-text-tertiary)" ff="monospace">
                        {colorLight[key as keyof typeof colorLight]} /{' '}
                        {colorDark[key as keyof typeof colorDark]}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        ))}
      </Stack>
    </DocsFrame>
  )
}

/** The border radius collection, drawn at its own value. */
export function RadiusTokens() {
  return (
    <DocsFrame>
      <Group gap="24" align="flex-end">
        {Object.entries(radius).map(([name, value]) => (
          <Stack key={name} gap="8" align="center">
            <Box
              w={72}
              h={56}
              bd="2px solid var(--sds-action-primary-default)"
              bdrs={`${value}px`}
            />
            <Text fz="sm" fw={600}>
              {name}
            </Text>
            <Text fz="xs" c="var(--sds-surfaces-text-tertiary)">
              {value}px
            </Text>
          </Stack>
        ))}
      </Group>
    </DocsFrame>
  )
}

/** The shared padding/gap step scale. */
export function SpacingTokens() {
  return (
    <DocsFrame>
      <Stack gap="8">
        {Object.entries(spacing).map(([name, value]) => (
          <Group key={name} gap="12" wrap="nowrap">
            <Text fz="sm" ff="monospace" w={48} ta="right">
              {name}
            </Text>
            <Box h={16} w={value} bg="var(--sds-action-primary-default)" bdrs="xs" />
            <Text fz="xs" c="var(--sds-surfaces-text-tertiary)">
              {value}px
            </Text>
          </Group>
        ))}
      </Stack>
    </DocsFrame>
  )
}

/**
 * Font size and line height for every type token across the three Figma modes. The values in the
 * table are the raw exports; what a component actually renders is the column matching the current
 * viewport, because these ship as media-queried CSS variables.
 */
export function TypographyTokens() {
  const names = Object.keys(typography.desktop).filter((key) => key.startsWith('size-'))

  return (
    <DocsFrame>
      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Token</Table.Th>
            <Table.Th>Mobile (0+)</Table.Th>
            <Table.Th>Tablet (576+)</Table.Th>
            <Table.Th>Desktop (1200+)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {names.map((name) => {
            const key = name as keyof typeof typography.desktop
            return (
              <Table.Tr key={name}>
                <Table.Td>
                  <Text fz="sm" ff="monospace">
                    --sds-{name}
                  </Text>
                </Table.Td>
                <Table.Td>{typography.mobile[key]}px</Table.Td>
                <Table.Td>{typography.tablet[key]}px</Table.Td>
                <Table.Td>{typography.desktop[key]}px</Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </DocsFrame>
  )
}
