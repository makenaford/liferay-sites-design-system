import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import { Select } from '@mantine/core'
import type { SelectProps } from '@mantine/core'
import { IconDownSmallFilled } from '../../icons'
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
/**
 * Whether focus arrived from the keyboard.
 *
 * `:focus-visible` cannot answer this on its own: a text input matches it whenever it is focused,
 * whatever the modality, so a plain `:focus-visible` ring on this trigger appears on mouse clicks too
 * and leaves a box sitting in the nav. Buttons do not have that problem, which is why the rest of the
 * header does not need this.
 *
 * So the modality is tracked directly. `Tab` is the only key that moves focus *into* a control from
 * outside it, and by the time `focus` fires the listeners below have already recorded which it was.
 */
function useKeyboardFocus() {
  const modality = useRef<'pointer' | 'keyboard'>('pointer')
  const [keyboard, setKeyboard] = useState(false)

  useEffect(() => {
    const onPointerDown = () => (modality.current = 'pointer')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') modality.current = 'keyboard'
    }
    /* Capture, so this runs before anything that stops propagation. */
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [])

  return {
    'data-keyboard-focus': keyboard || undefined,
    onFocus: () => setKeyboard(modality.current === 'keyboard'),
    onBlur: () => setKeyboard(false),
  }
}

export const LanguagePicker = forwardRef<HTMLInputElement, LanguagePickerProps>(
  function LanguagePicker({ data, ...props }, ref) {
    const focusRing = useKeyboardFocus()

    return (
      <Select
        ref={ref}
        classNames={{ input: classes.langPicker }}
        data={data.map(({ value, label }) => ({ value, label }))}
        aria-label={props['aria-label'] ?? 'Language'}
        withCheckIcon={false}
        allowDeselect={false}
        /*
         * The file draws a small solid caret, the same one the nav items use — not Mantine's stroked
         * chevron. It is decoration beside a real select, so it takes no pointer events of its own.
         */
        rightSection={<IconDownSmallFilled width={16} height={16} />}
        /*
         * The caret slot has to be narrowed here rather than in CSS.
         *
         * The theme gives every field a 40px right section — Figma's icon slot: 16px padding, a 16px
         * glyph, an 8px gap. This trigger draws a bare 18px caret, and `.langPicker` drops the input's
         * right padding to 16px to match. But the *slot* stayed 40px, so the caret box overhung the
         * text by 24px and painted over the last glyph: `EN (US)` rendered as `EN (U9)`.
         *
         * Three things do not fix it, which is why the fix looks blunt. `rightSectionWidth` maps to
         * `--input-right-section-width`, a different variable from the `--input-right-section-size`
         * the theme sets. A stylesheet rule loses, because the theme emits its vars as *inline* styles
         * on the wrapper. And a prop-level `vars` loses too — Mantine merges theme vars last, so the
         * 40px simply overwrites it.
         *
         * So the slot is sized directly on the element. `styles` is inline on the section itself,
         * which is downstream of every variable involved.
         */
        styles={{ section: { width: 18 } }}
        rightSectionWidth={18}
        rightSectionPointerEvents="none"
        {...focusRing}
        /* Wide enough for `EN (US)` at the header's 16px, plus the 16px the caret slot reserves. */
        w={92}
        comboboxProps={{ width: 220, position: 'bottom-start' }}
        {...props}
      />
    )
  },
)
