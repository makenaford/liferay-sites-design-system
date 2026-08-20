import { forwardRef, type ReactNode } from 'react'
import { TextInput as MantineTextInput } from '@mantine/core'
import type { TextInputProps as MantineTextInputProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'

export interface TextInputProps extends MantineTextInputProps {
  /**
   * Figma's `Condensed=True` cell: the label sits inside the 48px box and shrinks up out of the way
   * once the field has a value or focus, rather than sitting above it.
   *
   * A floating label is a label, not a placeholder — it stays visible when the field is filled, which
   * is what keeps the field understandable after typing. Do not pair it with a `placeholder` saying
   * the same thing.
   */
  floating?: boolean
  /** Figma's `Info Button`: an explanation beside the label, in a tooltip. */
  info?: ReactNode
  /**
   * A button inside the field's right edge — a submit for a single-field form. Not drawn in Figma;
   * composed from the drawn field and this library's `Button`. Use `size="sm"`: that is 40px here, so
   * it leaves 4px of air inside the 48px box. `size="md"` is 48px and fills the field edge to edge.
   */
  containedButton?: ReactNode
}

/**
 * TextInput — Figma `Input` set (node `16166:23969`), `Type=Text`.
 *
 * A themed Mantine `TextInput`. The set's axes land as states and props rather than variants:
 * `State=Active` is `:focus-within`, `Filled` is simply having a value, `Condensed` is `floating`, and
 * the booleans (`Label`, `Required`, `Help Text`, `Icon Left`, `Icon Right`, `Info Button`,
 * `Country Selector`) are props or slots.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Label Text` + `Label` | `label` |
 * | `Required` | `required` |
 * | `Help Text` | `description` |
 * | `Info Button` | `info` |
 * | `Icon Left` / `Icon Right` | `leftSection` / `rightSection` |
 * | `Condensed` | `floating` |
 * | `Country Selector` | `leftSection={<LanguagePicker … />}` |
 *
 * ```tsx
 * <TextInput label="Work email" required description="We only use this to send the report." />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { floating, info, containedButton, label, rightSection, rightSectionWidth, ...props },
  ref,
) {
  return (
    <MantineTextInput
      ref={ref}
      /**
       * On the *root*, not the input: an input component forwards unknown props to the `<input>`
       * itself, so a plain `data-` attribute would land on the wrong element for the stylesheet.
       */
      attributes={{
        root: {
          ...(floating ? { 'data-floating': 'true' } : null),
          ...(containedButton ? { 'data-contained-button': 'true' } : null),
        },
      }}
      label={
        info ? (
          <>
            {label} <InfoTooltip>{info}</InfoTooltip>
          </>
        ) : (
          label
        )
      }
      /**
       * A floating label needs a placeholder to key `:placeholder-shown` off, but it must not be
       * visible — the label is already in the box. The stylesheet hides it until focus.
       */
      placeholder={floating ? (props.placeholder ?? ' ') : props.placeholder}
      rightSection={containedButton ?? rightSection}
      rightSectionWidth={containedButton ? 'auto' : rightSectionWidth}
      rightSectionPointerEvents={containedButton ? 'auto' : undefined}
      {...props}
    />
  )
})
