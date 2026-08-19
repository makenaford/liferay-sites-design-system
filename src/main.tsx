import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Group, Stack, Text, Title } from '@mantine/core'
import { Button } from './components/Button'
import { IconArrowRight, IconRefresh2 } from './icons'
import { ScratchProvider } from './theme'

/**
 * A minimal preview page for `pnpm dev`. Storybook is the real documentation surface — this exists
 * so the library can be exercised in a plain Vite app, the same way a consumer would use it.
 */
function App() {
  return (
    <ScratchProvider>
      <Stack p="xl" gap="xl" mih="100vh" bg="var(--mantine-color-body)">
        <Stack gap="4">
          <Title order={1}>Scratch</Title>
          <Text c="var(--sds-surfaces-text-tertiary)">
            Sourced from the Figma “Solutions Library- 2026” library.
          </Text>
        </Stack>
        <Group gap="16">
          <Button leftSection={<IconRefresh2 />} rightSection={<IconArrowRight />}>
            Button
          </Button>
          <Button variant="outline" leftSection={<IconRefresh2 />} rightSection={<IconArrowRight />}>
            Button
          </Button>
          <Button variant="rounded" leftSection={<IconRefresh2 />} rightSection={<IconArrowRight />}>
            Button
          </Button>
          <Button variant="neutral" leftSection={<IconRefresh2 />} rightSection={<IconArrowRight />}>
            Button
          </Button>
        </Group>
        <Group gap="16" align="center">
          <Button size="lg">Large</Button>
          <Button size="md">Medium</Button>
          <Button size="sm">Small</Button>
        </Group>
      </Stack>
    </ScratchProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
