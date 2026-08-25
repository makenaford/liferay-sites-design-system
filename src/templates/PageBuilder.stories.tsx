import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button as MantineButton,
  CopyButton,
  Divider,
  Group,
  Menu,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput as MantineTextInput,
  Textarea,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { PageRenderer } from './PageRenderer'
import { SECTION_TYPES, sectionSummary, sectionTypeFor } from './section-catalog'
import type { CardSpec, PageSpec, SectionSpec } from './page-schema'
import { SiteFooter, SiteHeader } from './shared'
import { HOME_PAGE } from './home-page'
import { PAGE_PRESETS } from './page-presets'

/*
 * A page builder.
 *
 * Deliberately built from **Mantine primitives, not this library's components**. The chrome around the
 * preview has to be visibly not-the-page — a builder whose toolbar is made of the same `Button` and
 * `Card` as the thing being previewed is confusing to look at and impossible to screenshot.
 *
 * ## What it lets you change, and what it does not
 *
 * Content, ordering, and named choices the design file sanctions — `mediaSide` is `Content Left Image`
 * versus `Content- Right Image`, a cell that exists in Figma.
 *
 * **Not gaps, paddings, colours or type sizes.** Not because they are hard, but because a page that can
 * set its own spacing is a page that can drift off the design, and then the handoff stops being
 * trustworthy. When a gap is wrong that is a design-system change — it should move for every page at
 * once, in the theme, not for one section in one page. See the story description.
 */

/* ------------------------------------------------------------------ small editing helpers */

/** Replaces one section in a page, without mutating the original. */
function replaceSection(page: PageSpec, index: number, next: SectionSpec): PageSpec {
  const sections = [...page.sections]
  sections[index] = next
  return { ...page, sections }
}

function moveSection(page: PageSpec, from: number, to: number): PageSpec {
  if (to < 0 || to >= page.sections.length) return page
  const sections = [...page.sections]
  const [moved] = sections.splice(from, 1)
  sections.splice(to, 0, moved)
  return { ...page, sections }
}

/** The string-valued fields of a section, which are the ones worth a plain text box. */
const SCALARS = ['title', 'description', 'label'] as const

/* ------------------------------------------------------------------ the field editors */

function CardRepeater({
  cards,
  onChange,
}: {
  cards: CardSpec[]
  onChange: (cards: CardSpec[]) => void
}) {
  return (
    <Stack gap="xs">
      {cards.map((card, i) => (
        <Box key={i} p="xs" style={{ border: '1px solid var(--mantine-color-dark-4)', borderRadius: 6 }}>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">
              Card {i + 1}
            </Text>
            <ActionIcon
              size="xs"
              variant="subtle"
              color="red"
              aria-label={`Remove card ${i + 1}`}
              onClick={() => onChange(cards.filter((_, j) => j !== i))}
            >
              ×
            </ActionIcon>
          </Group>
          <Stack gap={6}>
            <MantineTextInput
              size="xs"
              placeholder="Title"
              value={card.title}
              onChange={(e) =>
                onChange(cards.map((c, j) => (j === i ? { ...c, title: e.currentTarget.value } : c)))
              }
            />
            <MantineTextInput
              size="xs"
              placeholder="Description"
              value={card.description ?? ''}
              onChange={(e) =>
                onChange(
                  cards.map((c, j) => (j === i ? { ...c, description: e.currentTarget.value } : c)),
                )
              }
            />
          </Stack>
        </Box>
      ))}
      <MantineButton
        size="xs"
        variant="light"
        onClick={() => onChange([...cards, { title: 'New card', description: '', href: '#' }])}
      >
        Add card
      </MantineButton>
    </Stack>
  )
}

/** A list of plain strings, one per line — logos, tab labels. */
function LineListField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <Textarea
      size="xs"
      label={label}
      description="One per line"
      autosize
      minRows={3}
      value={value.join('\n')}
      onChange={(e) =>
        onChange(
          e.currentTarget.value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        )
      }
    />
  )
}

/**
 * The editor for one section.
 *
 * Scalars and the two common list shapes get real controls. The deeper structures — a carousel's
 * quotes, a tabbed panel's accordion — fall back to a validated JSON box, which is honest about where
 * this stops: they want purpose-built editors, and that is the next piece of work rather than a thing
 * to fake with a generic form.
 */
function SectionEditor({
  section,
  onChange,
}: {
  section: SectionSpec
  onChange: (next: SectionSpec) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const meta = sectionTypeFor(section.type)

  const deep = useMemo(() => {
    const { type, ...rest } = section as Record<string, unknown> & { type: string }
    const entries = Object.entries(rest).filter(
      ([key, value]) =>
        !SCALARS.includes(key as (typeof SCALARS)[number]) &&
        key !== 'cards' &&
        key !== 'logos' &&
        key !== 'mediaSide' &&
        value !== undefined,
    )
    return entries.length ? Object.fromEntries(entries) : null
  }, [section])

  return (
    <Stack gap="sm">
      <Group gap={6}>
        <Badge size="sm" variant="light">
          {meta?.label ?? section.type}
        </Badge>
      </Group>

      {SCALARS.map((key) =>
        key in section ? (
          <MantineTextInput
            key={key}
            size="xs"
            label={key === 'label' ? 'Label' : key === 'title' ? 'Title' : 'Description'}
            value={String((section as Record<string, unknown>)[key] ?? '')}
            onChange={(e) => onChange({ ...section, [key]: e.currentTarget.value } as SectionSpec)}
          />
        ) : null,
      )}

      {/*
        * A named choice from the design file, so it belongs here. Compare with a gap, which does not —
        * see the note at the top of this file.
        */}
      {section.type === 'tabbedContent' ? (
        <Box>
          <Text size="xs" fw={600} mb={4}>
            Media side
          </Text>
          <SegmentedControl
            size="xs"
            fullWidth
            value={section.mediaSide ?? 'right'}
            data={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
            onChange={(v) => onChange({ ...section, mediaSide: v as 'left' | 'right' })}
          />
        </Box>
      ) : null}

      {'cards' in section && section.cards ? (
        <Box>
          <Text size="xs" fw={600} mb={4}>
            Cards
          </Text>
          <CardRepeater
            cards={section.cards}
            onChange={(cards) => onChange({ ...section, cards } as SectionSpec)}
          />
        </Box>
      ) : null}

      {'logos' in section ? (
        <LineListField
          label="Logos"
          value={section.logos}
          onChange={(logos) => onChange({ ...section, logos } as SectionSpec)}
        />
      ) : null}

      {deep ? (
        <Box>
          <Textarea
            size="xs"
            label="Structured content"
            description="No purpose-built editor for these yet"
            autosize
            minRows={4}
            maxRows={14}
            error={error}
            value={draft ?? JSON.stringify(deep, null, 2)}
            onChange={(e) => setDraft(e.currentTarget.value)}
            onBlur={() => {
              if (draft === null) return
              try {
                onChange({ ...section, ...JSON.parse(draft) } as SectionSpec)
                setError(null)
                setDraft(null)
              } catch (err) {
                setError((err as Error).message)
              }
            }}
          />
        </Box>
      ) : null}
    </Stack>
  )
}

/* ------------------------------------------------------------------ the builder */

const WIDTHS = { Desktop: 1440, Tablet: 900, Mobile: 390 } as const

function Builder() {
  const [page, setPage] = useState<PageSpec>(HOME_PAGE)
  const [selected, setSelected] = useState(0)
  const [width, setWidth] = useState<keyof typeof WIDTHS>('Desktop')
  const [showHandoff, setShowHandoff] = useState(false)

  const section = page.sections[selected]
  const handoff = useMemo(
    () =>
      [
        "import { PageRenderer } from 'liferay-sites-design-system'",
        '',
        `const page = ${JSON.stringify(page, null, 2)}`,
        '',
        'export default () => <PageRenderer page={page} />',
      ].join('\n'),
    [page],
  )

  return (
    <Group align="stretch" gap={0} h="100vh" wrap="nowrap">
      {/* ------------------------------------------------ the rail */}
      <Stack
        gap={0}
        w={320} maw="100%"
        style={{ borderRight: '1px solid var(--mantine-color-dark-4)', flex: 'none' }}
      >
        <Group justify="space-between" p="sm">
          <Text fw={700} size="sm">
            Page
          </Text>
          <Group gap="xs">
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <MantineButton size="xs" variant="subtle">
                  New
                </MantineButton>
              </Menu.Target>
              <Menu.Dropdown>
                {PAGE_PRESETS.map((preset) => (
                  <Menu.Item
                    key={preset.id}
                    onClick={() => {
                      /*
                       * A preset replaces the whole page, so it throws away whatever is open. There is
                       * no undo here and a mockup is an hour of someone's afternoon, so this asks —
                       * once, plainly, and only when there is something to lose.
                       */
                      const dirty = page.sections.length > 0
                      if (dirty && !window.confirm(`Start a new ${preset.label.toLowerCase()}? This replaces the page you have open.`)) {
                        return
                      }
                      setPage(preset.create())
                      setSelected(0)
                    }}
                  >
                    <Text size="sm">{preset.label}</Text>
                    <Text size="xs" c="dimmed" maw={240} style={{ whiteSpace: 'normal' }}>
                      {preset.hint}
                    </Text>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <MantineButton size="xs" variant="light">
                Add section
              </MantineButton>
            </Menu.Target>
            <Menu.Dropdown>
              {SECTION_TYPES.map((entry) => (
                <Menu.Item
                  key={entry.type}
                  onClick={() => {
                    setPage((p) => ({ ...p, sections: [...p.sections, entry.blank()] }))
                    setSelected(page.sections.length)
                  }}
                >
                  <Text size="sm">{entry.label}</Text>
                  <Text size="xs" c="dimmed">
                    {entry.hint}
                  </Text>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          </Group>
        </Group>

        <Divider />

        <ScrollArea.Autosize mah="38%">
          <Stack gap={2} p={6}>
            {page.sections.map((s, i) => (
              <Group
                key={i}
                gap={4}
                wrap="nowrap"
                p={6}
                style={{
                  borderRadius: 6,
                  background: i === selected ? 'var(--mantine-color-dark-6)' : undefined,
                }}
              >
                <UnstyledButton style={{ flex: 1, minWidth: 0 }} onClick={() => setSelected(i)}>
                  <Text size="xs" truncate>
                    {sectionSummary(s)}
                  </Text>
                  <Text size="10px" c="dimmed">
                    {sectionTypeFor(s.type)?.label}
                  </Text>
                </UnstyledButton>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  aria-label="Move up"
                  onClick={() => {
                    setPage((p) => moveSection(p, i, i - 1))
                    setSelected(Math.max(0, i - 1))
                  }}
                >
                  ↑
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  aria-label="Move down"
                  onClick={() => {
                    setPage((p) => moveSection(p, i, i + 1))
                    setSelected(Math.min(page.sections.length - 1, i + 1))
                  }}
                >
                  ↓
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="red"
                  aria-label="Delete section"
                  onClick={() => {
                    setPage((p) => ({ ...p, sections: p.sections.filter((_, j) => j !== i) }))
                    setSelected((cur) => Math.max(0, cur >= i ? cur - 1 : cur))
                  }}
                >
                  ×
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </ScrollArea.Autosize>

        <Divider />

        <ScrollArea style={{ flex: 1 }}>
          <Box p="sm">
            {section ? (
              <SectionEditor
                section={section}
                onChange={(next) => setPage((p) => replaceSection(p, selected, next))}
              />
            ) : (
              <Text size="xs" c="dimmed">
                No sections. Add one above.
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Stack>

      {/* ------------------------------------------------ the preview */}
      <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
        <Group justify="space-between" p="sm" wrap="nowrap">
          <SegmentedControl
            size="xs"
            value={width}
            data={Object.keys(WIDTHS)}
            onChange={(v) => setWidth(v as keyof typeof WIDTHS)}
          />
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              {page.sections.length} sections
            </Text>
            {/*
              * The clipboard is not always available — a sandboxed iframe can refuse
              * `clipboard.writeText` outright — and a designer who cannot get the page out of the
              * builder has nothing. So the text is always reachable as text, and copying is the
              * convenience rather than the mechanism.
              */}
            <MantineButton
              size="xs"
              variant="default"
              onClick={() => setShowHandoff((open) => !open)}
            >
              {showHandoff ? 'Hide handoff' : 'Show handoff'}
            </MantineButton>
            <CopyButton value={handoff}>
              {({ copied, copy }) => (
                <Tooltip label="React + the page as data, ready to paste">
                  <MantineButton size="xs" variant={copied ? 'filled' : 'light'} onClick={copy}>
                    {copied ? 'Copied' : 'Copy handoff'}
                  </MantineButton>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Group>

        <Divider />

        {showHandoff ? (
          <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-dark-4)' }}>
            <Textarea
              readOnly
              autosize
              minRows={6}
              maxRows={14}
              value={handoff}
              styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)', fontSize: 11 } }}
              onFocus={(e) => e.currentTarget.select()}
            />
          </Box>
        ) : null}

        <ScrollArea style={{ flex: 1, background: 'var(--mantine-color-dark-8)' }}>
          {/*
            * The chosen width is honoured exactly and the pane scrolls if it does not fit, rather than
            * being clamped to the pane. `container-type: inline-size` then means the sections measure
            * themselves against a true 1440 (or 390), which is the whole point of previewing a width —
            * a hero that thinks it is 1100 wide is not the desktop hero.
            */}
          <Box mx="auto" w={WIDTHS[width]} style={{ containerType: 'inline-size' }}>
            <SiteHeader />
            <PageRenderer page={page} />
            <SiteFooter />
          </Box>
        </ScrollArea>
      </Stack>
    </Group>
  )
}

const meta = {
  title: 'Templates/Page builder',
  /*
   * Desktop-only, and the layout suite is told so rather than left to fail: this is a rail plus a live preview
   * side by side, which has no phone form. It is a tool for building pages, not a page.
   */
  tags: ['desktop-only'],
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'Assemble a page from the library and hand the result to a developer.',
          '',
          'Add sections from the palette, reorder them, edit their content, and preview at three widths. **Copy handoff** puts the page on the clipboard as a `PageSpec` plus the two lines needed to render it — a developer pastes it and gets the real thing, with no measurements to re-derive from a screenshot.',
          '',
          'The interactions in the preview are the real ones. The pill bars take arrow keys, the carousel snaps, the accordion expands, the marquee runs and can be paused. That is the part Figma prototyping cannot give you.',
          '',
          '## What it will not let you change',
          '',
          'Gaps, padding, colours and type sizes are absent on purpose. Three different things get confused under "can I change the styling":',
          '',
          '- **A named choice the design file offers** — `mediaSide` is Figma’s `Content Left Image` versus `Content- Right Image`. That is content-adjacent and it *is* editable here. Same category as `Section spacing`, `Card surface` or `Button variant`: every value was sanctioned by the design.',
          '- **A one-off measurement for one section on one page** — not offered. A page that sets its own spacing drifts off the design, and then the handoff stops being trustworthy. This is how design systems rot.',
          '- **A measurement that is simply wrong in the system** — a real problem, and the fix belongs in the theme so it moves for every page at once. Porting the Home page to data caught exactly one of these: a 40px gap where the file draws 24. That was fixed in the component, not worked around in the page.',
          '',
          'If a page genuinely needs a shape the section types do not have, that is a signal to add a section type and a matching Figma component — not to open a hole in the schema.',
          '',
          '## Where scroll-driven motion would go',
          '',
          'A shrinking header or a parallax hero is *how a section is drawn*, so it belongs in the renderer with the measurements, exposed here at most as a named choice from a closed set. The theme already carries motion tokens; what is missing is scroll-linked behaviour in the components, which is a real addition rather than a flag.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The builder, seeded with the Home page. */
export const Build: Story = { render: () => <Builder /> }
