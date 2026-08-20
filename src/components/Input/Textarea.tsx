import { forwardRef, type ReactNode } from 'react'
import { Textarea as MantineTextarea } from '@mantine/core'
import type { TextareaProps as MantineTextareaProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'

export interface TextareaProps extends MantineTextareaProps {
  /** Figma's `Info Button`: an explanation beside the label, in a tooltip. */
  info?: ReactNode
}

/**
 * Textarea — Figma `Input` set (node `16166:23969`), `Type=Text Area`.
 *
 * The same box and the same states as `TextInput`, over multiple lines. It autosizes from three rows,
 * because a field that scrolls internally hides what has been typed.
 *
 * The floating label is deliberately not offered here: with several lines of text the label would have
 * to float above content that is already at the top of the box, and Figma's `Condensed` cells are drawn
 * for single-line fields.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { info, label, ...props },
  ref,
) {
  return (
    <MantineTextarea
      ref={ref}
      label={
        info ? (
          <>
            {label} <InfoTooltip>{info}</InfoTooltip>
          </>
        ) : (
          label
        )
      }
      {...props}
    />
  )
})
