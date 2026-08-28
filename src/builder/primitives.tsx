/**
 * The builder's own components: the handful of things a page needs that the design system does not
 * ship, because they are not design decisions.
 *
 * A library of `Card`s and `Hero`s has nothing that just says a sentence, and nothing that puts three
 * things in a row — those are not components anyone would draw in Figma, but a page cannot be
 * assembled without them. Every one of them is deliberately **thin**: it sets no colour, no type size
 * and no spacing of its own beyond what the caller picks from the token scales, so a page built out of
 * these still cannot drift off the design system.
 *
 * `Heading` and `Paragraph` are the two that matter. Almost every slot in the catalogue — `Hero.title`,
 * `Card.description`, `SectionTitle.title` — is typed `ReactNode`, which is the library saying "put
 * whatever you like here". For a designer, what goes there is nearly always a line of text, and these
 * are what make that line something they can click on the canvas and type into.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Box, Group, SimpleGrid, Stack as MantineStack, Text, Title } from '@mantine/core'

/** The three text colours the token set defines. Every one of them inverts with the colour scheme. */
const TONES = {
  primary: 'var(--sds-surfaces-text-primary)',
  secondary: 'var(--sds-surfaces-text-secondary)',
  tertiary: 'var(--sds-surfaces-text-tertiary)',
} as const

export type Tone = keyof typeof TONES

export const toneColor = (tone?: string) => TONES[(tone ?? 'primary') as Tone] ?? TONES.primary

/* ------------------------------------------------------------------ text */

export interface HeadingProps {
  content?: string
  /** `h1`–`h6`, mapped onto the theme's `Size/Heading` F1–F6 scale. */
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /**
   * The two `Size/Display` steps, which sit above F1 and are what a hero headline uses. `none` leaves
   * the heading at its level's own size.
   */
  display?: 'none' | 'display-sm' | 'display-lg'
  align?: 'left' | 'center' | 'right'
  tone?: Tone
  /**
   * The brand-to-accent gradient the Home hero puts on the second half of its headline. Applied to the
   * whole heading here: splitting a line into a plain half and a gradient half is a job for two
   * headings side by side, not for a second copy of the text in one.
   */
  gradient?: boolean
  children?: ReactNode
}

export function Heading({
  content,
  level = 'h2',
  display = 'none',
  align = 'left',
  tone = 'primary',
  gradient,
  children,
}: HeadingProps) {
  const order = Number(level.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6
  const sized: CSSProperties =
    display === 'none'
      ? {}
      : {
          fontSize: `var(--sds-size-display-${display === 'display-lg' ? 'display-lg' : 'display-sm'})`,
          lineHeight: `var(--sds-line-height-display-${display === 'display-lg' ? 'display-lg' : 'display-sm'})`,
        }

  const text = children ?? content

  return (
    <Title order={order} ta={align} c={gradient ? undefined : toneColor(tone)} style={sized}>
      {/*
        * The gradient goes on an inner `span` rather than on the `Title`, because Mantine puts
        * `variant="gradient"` on `Text` and not on `Title`. `inherit` keeps the span at the
        * heading's own size and weight, so the only thing it changes is the ink.
        */}
      {gradient ? (
        <Text span inherit variant="gradient" gradient={{ from: 'brand.3', to: 'accent', deg: 90 }}>
          {text}
        </Text>
      ) : (
        text
      )}
    </Title>
  )
}

export interface ParagraphProps {
  content?: string
  /** The `Size/Paragraph` scale: X-Small, Small, Base, Large. */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  weight?: 'regular' | 'medium' | 'bold'
  align?: 'left' | 'center' | 'right'
  tone?: Tone
  /** A ceiling on the line length, in pixels. Long measure is the commonest readability fault here. */
  maxWidth?: number
  children?: ReactNode
}

export function Paragraph({
  content,
  size = 'md',
  weight = 'regular',
  align = 'left',
  tone = 'secondary',
  maxWidth,
  children,
}: ParagraphProps) {
  return (
    <Text
      fz={size}
      fw={{ regular: 400, medium: 600, bold: 700 }[weight]}
      ta={align}
      c={toneColor(tone)}
      maw={maxWidth}
      /* A paragraph typed on one line in the inspector should still break where it was typed. */
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {children ?? content}
    </Text>
  )
}

/* ------------------------------------------------------------------ arrangement */

export interface StackProps {
  /** A step from the theme's spacing scale, which is keyed by its own pixel value. */
  gap?: number
  align?: 'stretch' | 'start' | 'center' | 'end'
  children?: ReactNode
}

export const Stack = ({ gap = 16, align = 'stretch', children }: StackProps) => (
  <MantineStack gap={gap} align={align}>
    {children}
  </MantineStack>
)

export interface RowProps {
  gap?: number
  align?: 'stretch' | 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'space-between'
  /** Off makes a row that overflows rather than folding — for a nav bar, not for content. */
  wrap?: boolean
  children?: ReactNode
}

export const Row = ({ gap = 16, align = 'center', justify = 'start', wrap = true, children }: RowProps) => (
  <Group gap={gap} align={align} justify={justify} wrap={wrap ? 'wrap' : 'nowrap'}>
    {children}
  </Group>
)

export interface GridProps {
  /** Columns at desktop. The grid halves at tablet and goes to one column on a phone. */
  columns?: number
  gap?: number
  children?: ReactNode
}

export const Grid = ({ columns = 3, gap = 24, children }: GridProps) => (
  <SimpleGrid
    cols={{ base: 1, sm: Math.min(2, columns), md: columns }}
    spacing={gap}
    verticalSpacing={gap}
  >
    {children}
  </SimpleGrid>
)

/**
 * Vertical space, on purpose.
 *
 * The one primitive here that is easy to misuse: reach for it and the page starts carrying its own
 * measurements, which is the drift the design system exists to prevent. It is offered because the
 * alternative — a designer who needs one gap and cannot get it — is worse, and because `Section`'s
 * own spacing covers the honest cases. If a spacer is doing real work in a finished page, the section
 * around it is probably missing a variant.
 */
export const Spacer = ({ height = 40 }: { height?: number }) => <Box h={height} aria-hidden />

/* ------------------------------------------------------------------ raw text */

/**
 * An escape hatch for a run of inline text that is not a heading and not a paragraph — a word inside a
 * marquee cell, a tab's label. It renders as a bare string so it can sit inside anything.
 */
export const Plain = ({ content, children }: { content?: string; children?: ReactNode }) => (
  <>{children ?? content}</>
)
