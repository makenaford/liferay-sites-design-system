import type { ReactNode } from 'react'
import { Box } from '@mantine/core'

export interface StoryFrameOptions {
  /** Constrain the story to a fixed width. Omit to let it size to its content. */
  width?: number | string
  /** Upper bound so a fixed-width story still behaves on a narrow viewport. */
  maxWidth?: number | string
  /**
   * Centre the story horizontally. Defaults to on in the canvas when a width is set, and always off
   * in Docs, where stories read better aligned to the surrounding prose.
   */
  centered?: boolean
}

export interface StoryFrameProps extends StoryFrameOptions {
  /**
   * Whether the frame should fill the viewport and paint the page background. True on the canvas,
   * where the story is the whole page; false in Docs, where each story is one block among many —
   * filling the viewport there leaves a screen-height gap between every example.
   */
  fullBleed?: boolean
  children: ReactNode
}

/**
 * The shared wrapper every story renders inside.
 *
 * This is the single place for styling that applies across the whole Storybook — page background,
 * outer padding, story width. Individual stories must not wrap themselves in layout markup; they
 * declare what they need through the `frame` parameter instead:
 *
 * ```ts
 * export const Playground: Story = {
 *   parameters: { frame: { width: 400 } },
 * }
 * ```
 *
 * Anything added here is picked up by every story automatically.
 */
export function StoryFrame({
  width,
  maxWidth = '100%',
  centered,
  fullBleed = true,
  children,
}: StoryFrameProps) {
  const isCentered = centered ?? (fullBleed && width !== undefined)

  return (
    <Box
      bg="var(--mantine-color-body)"
      p={fullBleed ? 'xl' : 'md'}
      mih={fullBleed ? '100vh' : undefined}
      /*
       * Full width, so the inner `maxWidth: 100%` has something real to resolve against.
       *
       * Storybook's default `layout: 'centered'` wraps the story in a shrink-to-fit flex box, so
       * without this the outer box took its width *from* the fixed-width story inside it — and then
       * `100%` of that was the fixed width, clamping nothing. Every `frame: { width: N }` story
       * overflowed a phone viewport by design that had never worked. Caught by the Playwright
       * overflow check, which reported ~40 stories at 375 all with the same shape.
       */
      w="100%"
    >
      <Box w={width} maw={maxWidth} mx={isCentered ? 'auto' : undefined}>
        {children}
      </Box>
    </Box>
  )
}
