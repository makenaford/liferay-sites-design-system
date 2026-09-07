import { forwardRef, type ReactNode } from 'react'
import { Textarea as MantineTextarea } from '@mantine/core'
import type { TextareaProps as MantineTextareaProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'

export interface TextareaProps extends MantineTextareaProps {
  /** Figma's `Info Button`: an explanation beside the label, in a tooltip. */
  info?: ReactNode
  /**
   * Figma's `Condensed` axis, as on `TextInput` and `Select` — the label starts in the box and moves
   * clear of it once the field has focus or a value.
   *
   * Offered here because the `Form` set's text areas are `Condensed=True` like everything else in it,
   * and a card with six notched fields and one stacked label reads as a mistake.
   */
  floating?: boolean
}

/**
 * Textarea — Figma `Input` set (node `16166:23969`), `Type=Text Area`.
 *
 * The same box and the same states as `TextInput`, over multiple lines. It autosizes from three rows,
 * because a field that scrolls internally hides what has been typed.
 *
 * `floating` is Figma's `Condensed` axis. It was withheld here on the argument that a label floating
 * over several lines of text would land on content already at the top of the box — which turned out not
 * to describe the implementation: the floated position is `translateY(-32px)`, into the 22px the root
 * reserves *above* the box, so it clears a one-line field and a six-line one identically. The stylesheet
 * had been matching `:where(input, textarea)` all along; only the prop was missing.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { info, floating, label, ...props },
  ref,
) {
  return (
    <MantineTextarea
      ref={ref}
      /* On the root, not the textarea — the stylesheet reads the field's state from the root. */
      attributes={{ root: floating ? { 'data-floating': 'true' } : {} }}
      /* A floating label keys off `:placeholder-shown`, so the field needs one that is not visible. */
      placeholder={floating ? (props.placeholder ?? ' ') : props.placeholder}
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
