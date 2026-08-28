/**
 * The page's source, beside the page.
 *
 * Two views of the same document, and the point of both is the **link between them**: select something
 * on the canvas and its lines scroll into view and light up; click a line and that component is
 * selected and scrolled to on the canvas. A designer who can see which markup a card came from can
 * talk to a developer about it, and a developer reading the code can find the thing on screen.
 *
 * ## React or HTML
 *
 * They are different artefacts and it is worth knowing which you are looking at.
 *
 * - **React** is the *source*: component names and props, the thing a developer pastes into the
 *   codebase and maintains. Nothing about a `Card` being three nested divs appears in it.
 * - **HTML** is the *output*: exactly what a browser receives, produced by the same renderer the
 *   Worker uses for `/p/:id.html`. Long, and useful precisely because it hides nothing.
 *
 * Neither is editable, and that is the design rather than an omission. The document is the truth and
 * both of these are derived from it; typing into the HTML would produce markup no component can
 * express, and the React that a developer is handed would stop describing the page. Editing happens in
 * the inspector, where every value on offer is one the design system actually has.
 */
import { useEffect, useMemo, useRef } from 'react'
import { Box, Button, CopyButton, Group, SegmentedControl, Text, Tooltip } from '@mantine/core'
import type { PageDocument } from './document'
import { handoff } from './handoff'
import { format, renderMarkup } from './html'

export type View = 'react' | 'html'

export interface CodePanelProps {
  doc: PageDocument
  view: View
  onView: (view: View) => void
  selectedId: string | null
  /** Selecting from the panel, which also asks the canvas to scroll to the node. */
  onPick: (id: string) => void
  onClose: () => void
}

interface Source {
  text: string
  lines: Record<string, [number, number]>
}

export function CodePanel({ doc, view, onView, selectedId, onPick, onClose }: CodePanelProps) {
  /*
   * Both views are regenerated whenever the document changes, which is on every keystroke that lands.
   * That is affordable — a page is tens of kilobytes and this is a memo — and the alternative, a
   * refresh button, means the panel is quietly wrong most of the time.
   */
  const source: Source = useMemo(() => {
    if (view === 'react') return handoff(doc)
    return format(renderMarkup(doc, true), { hideStyles: true })
  }, [doc, view])

  const lines = useMemo(() => source.text.split('\n'), [source.text])

  /** Line number -> the innermost node that owns it. What makes a click resolve to one component. */
  const owner = useMemo(() => {
    const at = new Map<number, string>()
    const ranges = Object.entries(source.lines)

    /*
     * Smallest range wins. Every line inside a `Section` is also inside that section's range, so
     * without this a click anywhere in a page selects the outermost band and nothing else is ever
     * reachable from here.
     */
    ranges.sort((a, b) => b[1][1] - b[1][0] - (a[1][1] - a[1][0]))
    for (const [id, [start, end]] of ranges) {
      for (let line = start; line <= end; line += 1) at.set(line, id)
    }
    return at
  }, [source.lines])

  const range = selectedId ? source.lines[selectedId] : undefined
  const scroller = useRef<HTMLDivElement>(null)

  /* Follow the selection. The panel is useless if you have to hunt for the thing you just clicked. */
  useEffect(() => {
    if (!range || !scroller.current) return
    const target = scroller.current.querySelector(`[data-line="${range[0]}"]`)
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [range])

  return (
    <Group align="stretch" gap={0} h="100%" wrap="nowrap">
      <Box
        w={1}
        style={{ background: 'var(--mantine-color-dark-4)', flex: 'none' }}
        aria-hidden
      />
      <Box style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <Group justify="space-between" p="xs" wrap="nowrap">
          <SegmentedControl
            size="xs"
            value={view}
            data={[
              { value: 'react', label: 'React' },
              { value: 'html', label: 'HTML' },
            ]}
            onChange={(value) => onView(value as View)}
          />
          <Group gap={6} wrap="nowrap">
            {view === 'html' ? (
              <Tooltip label="The same file the Worker serves, as one download">
                <Button
                  size="compact-xs"
                  variant="light"
                  component="a"
                  href={`/p/${doc.id}.html`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open file
                </Button>
              </Tooltip>
            ) : null}
            <CopyButton value={source.text}>
              {({ copied, copy }) => (
                <Button size="compact-xs" variant={copied ? 'filled' : 'light'} onClick={copy}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CopyButton>
            <Button size="compact-xs" variant="subtle" onClick={onClose}>
              Close
            </Button>
          </Group>
        </Group>

        <Box
          ref={scroller}
          style={{
            flex: 1,
            overflow: 'auto',
            fontFamily: 'var(--mantine-font-family-monospace)',
            fontSize: 11,
            lineHeight: '17px',
            background: 'var(--mantine-color-dark-8)',
            borderTop: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          {lines.map((text, index) => {
            const number = index + 1
            const highlighted = range ? number >= range[0] && number <= range[1] : false
            const id = owner.get(number)

            return (
              <Box
                key={number}
                data-line={number}
                onClick={() => id && onPick(id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5em 1fr',
                  cursor: id ? 'pointer' : 'default',
                  background: highlighted ? 'rgba(77, 141, 255, 0.28)' : undefined,
                  borderInlineStart: `3px solid ${highlighted ? '#4d8dff' : 'transparent'}`,
                }}
              >
                <Text component="span" c="dimmed" fz={10} ta="right" pr={8} style={{ userSelect: 'none' }}>
                  {number}
                </Text>
                {/* `pre-wrap` so a long attribute wraps instead of hiding behind a horizontal scrollbar. */}
                <Text component="span" fz={11} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {text || ' '}
                </Text>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Group>
  )
}
