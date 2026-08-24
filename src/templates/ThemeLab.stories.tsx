import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accordion as MantineAccordion,
  Box,
  Button as MantineButton,
  ColorInput,
  Divider,
  Group,
  ScrollArea,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import classes from '../theme/components.module.css'
import { PageRenderer } from './PageRenderer'
import { HOME_PAGE } from './home-page'
import { SiteFooter, SiteHeader } from './shared'

/*
 * A tuning bench for the design system.
 *
 * The page builder is the opposite tool: it deliberately refuses to let a *page* set its own spacing,
 * because a page that drifts makes the handoff worthless. This one exists for the other job — changing
 * the **system** — and every control here moves the value for every page at once.
 *
 * It works by writing `--sds-*` custom properties onto a wrapper around the preview, so a change lands
 * instantly with no rebuild. Nothing here is persisted: the output panel gives you the CSS, and the
 * notes say which file each value's real home is, because that is the part that is easy to get wrong.
 */

type ControlKind = 'color' | 'px' | 'ms'

interface Control {
  /** The custom property, exactly as the stylesheet spells it. */
  name: string
  label: string
  kind: ControlKind
  min?: number
  max?: number
  step?: number
  /**
   * Which element the property is declared on.
   *
   * `root` values are theme-wide and inherit, so setting them on a wrapper is enough. The
   * `--sds-section-*` group is **declared on `.sectionRoot` itself**, which beats anything inherited —
   * so those have to be written as a rule against the section, not onto an ancestor. Getting this
   * wrong looks like a slider that moves and does nothing.
   */
  scope: 'root' | 'section'
  /** Where to make the change permanent. */
  home: string
}

/**
 * A curated set, not everything. There are ~90 colour tokens; a panel of ninety sliders is not a tool,
 * it is a haystack. These are the ones that change how the whole thing feels.
 */
const GROUPS: { group: string; note?: string; controls: Control[] }[] = [
  {
    group: 'Colour',
    note: 'Generated from the Figma variable export. Change them there and re-run `pnpm tokens`; editing the generated file by hand is undone on the next build.',
    controls: [
      {
        name: '--sds-surfaces-page-bg-base-default',
        label: 'Page background',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-surfaces-text-primary',
        label: 'Text primary',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-surfaces-text-secondary',
        label: 'Text secondary',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-brand-primary-primary',
        label: 'Brand primary',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-accent-product-accent',
        label: 'Product accent',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-accent-primary-blue-accent',
        label: 'Blue accent',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
      {
        name: '--sds-surfaces-card-bg-grey',
        label: 'Card grey',
        kind: 'color',
        scope: 'root',
        home: 'tokens/figma → tokens.generated.ts',
      },
    ],
  },
  {
    group: 'Rhythm',
    note: 'The section skeleton. `gutter` and `block` are normally a clamp that interpolates on the section’s own width — overriding them to a fixed px here is fine for judging a value, but put the clamp back when you commit it.',
    controls: [
      {
        name: '--sds-section-gap',
        label: 'Section gap',
        kind: 'px',
        min: 0,
        max: 80,
        scope: 'section',
        home: 'components.module.css → .sectionRoot',
      },
      {
        name: '--sds-section-gutter',
        label: 'Gutter',
        kind: 'px',
        scope: 'section',
        min: 0,
        max: 160,
        home: 'components.module.css → .sectionRoot',
      },
      {
        name: '--sds-section-block',
        label: 'Block padding',
        kind: 'px',
        scope: 'section',
        min: 0,
        max: 160,
        home: 'components.module.css → .sectionRoot',
      },
      {
        name: '--sds-section-max',
        label: 'Content max width',
        kind: 'px',
        scope: 'section',
        min: 800,
        max: 1600,
        home: 'components.module.css → .sectionRoot',
      },
    ],
  },
  {
    group: 'Shape',
    note: 'Figma’s `Border Radius/*`, reaching CSS through Mantine’s radius scale.',
    controls: [
      { name: '--mantine-radius-xs', label: 'Radius xs', kind: 'px', min: 0, max: 24, scope: 'root', home: 'theme.ts → radius' },
      { name: '--mantine-radius-sm', label: 'Radius sm', kind: 'px', min: 0, max: 24, scope: 'root', home: 'theme.ts → radius' },
      { name: '--mantine-radius-md', label: 'Radius md', kind: 'px', min: 0, max: 32, scope: 'root', home: 'theme.ts → radius' },
      { name: '--mantine-radius-lg', label: 'Radius lg', kind: 'px', min: 0, max: 48, scope: 'root', home: 'theme.ts → radius' },
    ],
  },
  {
    group: 'Type',
    note: 'Responsive: three modes in `typography.generated.css`. Overriding here sets one value across all three, so check the other breakpoints before committing.',
    controls: [
      {
        name: '--sds-size-paragraph-base',
        label: 'Paragraph base',
        kind: 'px',
        scope: 'root',
        min: 12,
        max: 24,
        home: 'typography.generated.css',
      },
      {
        name: '--sds-size-paragraph-large',
        label: 'Paragraph large',
        kind: 'px',
        scope: 'root',
        min: 14,
        max: 28,
        home: 'typography.generated.css',
      },
      {
        name: '--sds-size-heading-f1',
        label: 'Heading f1',
        kind: 'px',
        scope: 'root',
        min: 20,
        max: 56,
        home: 'typography.generated.css',
      },
      {
        name: '--sds-size-display-display-sm',
        label: 'Display sm',
        kind: 'px',
        scope: 'root',
        min: 32,
        max: 96,
        home: 'typography.generated.css',
      },
    ],
  },
  {
    group: 'Motion',
    note: 'Every transition in the library reads these. Turning them all to 0 is the quickest way to see whether an interaction depends on motion to be legible — it should not.',
    controls: [
      { name: '--sds-motion-fast', label: 'Fast', kind: 'ms', min: 0, max: 400, scope: 'root', home: 'cssVariables.ts' },
      { name: '--sds-motion-medium', label: 'Medium', kind: 'ms', min: 0, max: 600, scope: 'root', home: 'cssVariables.ts' },
      { name: '--sds-motion-slow', label: 'Slow', kind: 'ms', min: 0, max: 1200, scope: 'root', home: 'cssVariables.ts' },
    ],
  },
]

const ALL = GROUPS.flatMap((g) => g.controls)

const toNumber = (value: string) => Number.parseFloat(value.trim()) || 0

/** A plain class, not a CSS-module one, so the generated rules can name it. */
const SCOPE = 'sds-theme-lab'

function Lab() {
  const scope = useRef<HTMLDivElement>(null)
  const [defaults, setDefaults] = useState<Record<string, string>>({})
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [width, setWidth] = useState<'Desktop' | 'Mobile'>('Desktop')

  /*
   * Read what the theme currently resolves to, so the panel opens on the real values — each from the
   * element that actually declares it, which is the wrapper for theme-wide tokens and a real section
   * for the `--sds-section-*` group.
   */
  useEffect(() => {
    if (!scope.current) return
    const rootStyle = getComputedStyle(scope.current)
    const sectionEl = scope.current.querySelector(`.${classes.sectionRoot}`)
    const sectionStyle = sectionEl ? getComputedStyle(sectionEl) : rootStyle
    setDefaults(
      Object.fromEntries(
        ALL.map((c) => [
          c.name,
          (c.scope === 'section' ? sectionStyle : rootStyle).getPropertyValue(c.name).trim(),
        ]),
      ),
    )
  }, [])

  const value = (c: Control) => overrides[c.name] ?? defaults[c.name] ?? ''
  const set = (name: string, next: string) => setOverrides((o) => ({ ...o, [name]: next }))

  const changed = useMemo(
    () => ALL.filter((c) => overrides[c.name] && overrides[c.name] !== defaults[c.name]),
    [overrides, defaults],
  )

  /*
   * The overrides, as a real stylesheet.
   *
   * Theme-wide tokens could ride on the wrapper's inline style, but the section group cannot: it is
   * declared on `.sectionRoot`, and a declaration on the element beats anything it inherits. So both
   * go out as rules, and the section rule is two classes deep, which outranks the component's own.
   */
  const liveCss = useMemo(() => {
    const root = changed.filter((c) => c.scope === 'root')
    const section = changed.filter((c) => c.scope === 'section')
    const decl = (list: Control[]) => list.map((c) => `${c.name}: ${overrides[c.name]};`).join(' ')
    return [
      root.length ? `.${SCOPE} { ${decl(root)} }` : '',
      section.length ? `.${SCOPE} .${classes.sectionRoot} { ${decl(section)} }` : '',
    ]
      .filter(Boolean)
      .join('\n')
  }, [changed, overrides])

  /*
   * The output is grouped by the selector each value actually belongs to, not lumped under `:root`.
   * A `--sds-section-*` pasted into `:root` does nothing, because `.sectionRoot` declares its own —
   * so an output that implied otherwise would send you off debugging a change that never applied.
   */
  const css = useMemo(() => {
    if (!changed.length) return '/* Nothing changed yet. */'
    const block = (selector: string, list: Control[]) =>
      list.length
        ? `${selector} {\n${list
            .map((c) => `  /* ${c.home} */\n  ${c.name}: ${overrides[c.name]};`)
            .join('\n')}\n}`
        : ''
    return [
      block(':root', changed.filter((c) => c.scope === 'root')),
      block('.sectionRoot', changed.filter((c) => c.scope === 'section')),
    ]
      .filter(Boolean)
      .join('\n\n')
  }, [changed, overrides])

  return (
    <Group align="stretch" gap={0} h="100vh" wrap="nowrap">
      <Stack gap={0} w={330} style={{ borderRight: '1px solid var(--mantine-color-dark-4)', flex: 'none' }}>
        <Group justify="space-between" p="sm">
          <Text fw={700} size="sm">
            Theme
          </Text>
          <MantineButton size="xs" variant="subtle" disabled={!changed.length} onClick={() => setOverrides({})}>
            Reset
          </MantineButton>
        </Group>

        <Divider />

        <ScrollArea style={{ flex: 1 }}>
          <MantineAccordion multiple defaultValue={['Rhythm']} chevronPosition="left">
            {GROUPS.map((group) => (
              <MantineAccordion.Item key={group.group} value={group.group}>
                <MantineAccordion.Control>
                  <Text size="sm">{group.group}</Text>
                </MantineAccordion.Control>
                <MantineAccordion.Panel>
                  <Stack gap="sm">
                    {group.note ? (
                      <Text size="10px" c="dimmed" lh={1.4}>
                        {group.note}
                      </Text>
                    ) : null}
                    {group.controls.map((c) =>
                      c.kind === 'color' ? (
                        <ColorInput
                          key={c.name}
                          size="xs"
                          format="hex"
                          label={c.label}
                          value={value(c)}
                          onChange={(v) => set(c.name, v)}
                        />
                      ) : (
                        <Box key={c.name}>
                          <Group justify="space-between" mb={2}>
                            <Text size="xs">{c.label}</Text>
                            <Text size="xs" c="dimmed" ff="monospace">
                              {value(c) || '—'}
                            </Text>
                          </Group>
                          <Slider
                            size="xs"
                            min={c.min}
                            max={c.max}
                            step={c.step ?? 1}
                            value={toNumber(value(c))}
                            onChange={(n) => set(c.name, `${n}${c.kind === 'ms' ? 'ms' : 'px'}`)}
                          />
                        </Box>
                      ),
                    )}
                  </Stack>
                </MantineAccordion.Panel>
              </MantineAccordion.Item>
            ))}
          </MantineAccordion>

          <Box p="sm">
            <Text size="xs" fw={600} mb={4}>
              Changes ({changed.length})
            </Text>
            <Textarea
              readOnly
              autosize
              minRows={4}
              maxRows={16}
              value={css}
              styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)', fontSize: 10 } }}
              onFocus={(e) => e.currentTarget.select()}
            />
          </Box>
        </ScrollArea>
      </Stack>

      <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
        <Group p="sm">
          <SegmentedControl
            size="xs"
            value={width}
            data={['Desktop', 'Mobile']}
            onChange={(v) => setWidth(v as 'Desktop' | 'Mobile')}
          />
          <Text size="xs" c="dimmed">
            Every control moves the value for every page at once.
          </Text>
        </Group>

        <Divider />

        <ScrollArea style={{ flex: 1, background: 'var(--mantine-color-dark-8)' }}>
          {/* The overrides land here, so they cascade into the preview and nothing else. */}
          <style>{liveCss}</style>
          <Box
            ref={scope}
            className={SCOPE}
            mx="auto"
            w={width === 'Desktop' ? 1440 : 390}
            style={{ containerType: 'inline-size' }}
          >
            <SiteHeader />
            <PageRenderer page={HOME_PAGE} />
            <SiteFooter />
          </Box>
        </ScrollArea>
      </Stack>
    </Group>
  )
}

const meta = {
  title: 'Templates/Theme lab',
  parameters: {
    layout: 'fullscreen',
    frame: { fullBleed: true },
    docs: {
      description: {
        component: [
          'Tune the design system with a real page in front of you.',
          '',
          'Every control writes a `--sds-*` custom property onto a wrapper around the preview, so a change lands instantly with no rebuild — and moves the value **for every page at once**, which is the point. This is the counterpart to the page builder, which deliberately refuses to let a single page set its own spacing.',
          '',
          'Nothing is persisted. The **Changes** box gives you the CSS, and each line is annotated with the file the value actually lives in — which is the part that is easy to get wrong:',
          '',
          '- **Colour and type** are generated. Change them in `tokens/figma/` and re-run `pnpm tokens`; editing the generated file by hand is undone on the next build, and CI’s `--check` gate will catch it.',
          '- **Rhythm** is the section skeleton in `components.module.css`. `gutter` and `block` are normally a clamp interpolating on the section’s own width, so a flat px here is for judging a value, not for committing.',
          '- **Shape** is Figma’s `Border Radius/*` reaching CSS through Mantine’s scale in `theme.ts`.',
          '- **Motion** lives in `cssVariables.ts`. Dropping all three to 0 is the fastest check that no interaction *depends* on motion to be legible.',
          '',
          'The set is curated rather than exhaustive — there are around ninety colour tokens, and a panel of ninety sliders is a haystack, not a tool.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** The bench. */
export const Tune: Story = { render: () => <Lab /> }
