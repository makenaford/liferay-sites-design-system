import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { TextInput as MantineTextInput } from '@mantine/core'
import type { TextInputProps as MantineTextInputProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'
import classes from '../../theme/components.module.css'

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
   * composed from the drawn field and this library's `Button`.
   *
   * Use `size="sm"` for the label and padding. The **height comes from the field**, not the size: the
   * stylesheet insets the button 8px on all four sides, which is 32px inside the drawn 48px box. 32 is
   * not a step on the button scale (40 / 48 / 56) and adding one for this single context would put a
   * size in the system that Figma does not draw.
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
  /*
   * How much room the button takes, so the text can stop before it.
   *
   * The field reserves space for a right section from `rightSectionWidth`, but a contained button has
   * no fixed width — it is as wide as its label — so that is `auto` and the input got a flat 8px of
   * end padding instead. A realistic address then ran underneath the button: `Start Free Trial` needs
   * 150px, and there was nothing stopping the value from being painted under all of it.
   *
   * So it is measured. A `ResizeObserver` rather than a one-off read, because the label can change
   * (a different `submit` string, a translation) and the font can load late.
   */
  const [buttonWidth, setButtonWidth] = useState(0)
  const slot = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = slot.current
    if (!node) return undefined
    const measure = () => setButtonWidth(Math.ceil(node.getBoundingClientRect().width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [containedButton])

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
      /*
       * `styles`, not `attributes` — the latter takes DOM attributes and drops `style`, so the
       * variable silently never landed and the padding fell back to its 16px floor.
       */
      styles={
        containedButton
          ? { root: { '--sds-contained-button-width': `${buttonWidth}px` } as CSSProperties }
          : undefined
      }
      rightSection={
        containedButton ? (
          <span ref={slot} className={classes.containedButtonSlot}>
            {containedButton}
          </span>
        ) : (
          rightSection
        )
      }
      rightSectionWidth={containedButton ? 'auto' : rightSectionWidth}
      rightSectionPointerEvents={containedButton ? 'auto' : undefined}
      {...props}
    />
  )
})
