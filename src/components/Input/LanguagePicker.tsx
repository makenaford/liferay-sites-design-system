import { forwardRef, type ReactNode } from 'react'
import { Select } from '@mantine/core'
import type { SelectProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface LanguageOption {
  /** The value stored, e.g. `en-GB`. */
  value: string
  /** What is shown in the field — a language or country code, e.g. `EN`. */
  label: string
  /** An optional flag, rendered before the code. See the note below about Figma's flag set. */
  flag?: ReactNode
}

export interface LanguagePickerProps
  extends Omit<SelectProps, 'data' | 'value' | 'defaultValue' | 'onChange'> {
  /** The languages on offer. */
  data: LanguageOption[]
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string | null) => void
}

/**
 * LanguagePicker — Figma's `Country Selector` (node `17205:21114`), the 34×24 slot that sits inside a
 * field before its text.
 *
 * It is a real `Select` underneath rather than a styled button, so it comes with the combobox keyboard
 * behaviour and an accessible name. Compact by design: it shows the code, not the language's full name,
 * which is what the drawn slot has room for.
 *
 * **The flags are not in this library.** Figma draws them from a `Flags` component set that belongs to
 * neither icon pipeline — not the MingCute UI glyphs, not the illustrative set — so nothing is invented
 * here: each option takes an optional `flag` node, and without one the code stands alone. Recorded in
 * README.md.
 *
 * Sitting inside a field it needs a label of its own that the field's label does not provide:
 * `aria-label` is required, and defaults to "Language".
 */
export const LanguagePicker = forwardRef<HTMLInputElement, LanguagePickerProps>(
  function LanguagePicker({ data, ...props }, ref) {
    return (
      <Select
        ref={ref}
        classNames={{ input: classes.langPicker }}
        data={data.map(({ value, label }) => ({ value, label }))}
        aria-label={props['aria-label'] ?? 'Language'}
        withCheckIcon={false}
        allowDeselect={false}
        w={78}
        comboboxProps={{ width: 220, position: 'bottom-start' }}
        {...props}
      />
    )
  },
)
