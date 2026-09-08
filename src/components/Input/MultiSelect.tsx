import { forwardRef, type ReactNode } from 'react'
import { MultiSelect as MantineMultiSelect } from '@mantine/core'
import type { MultiSelectProps as MantineMultiSelectProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'
import { radius } from '../../theme/tokens.generated'

export interface MultiSelectProps extends MantineMultiSelectProps {
  /** Figma's `Info Button`: an explanation beside the label, in a tooltip. */
  info?: ReactNode
  /**
   * Figma's `Condensed` axis, as `TextInput` and `Select` take it: the label starts inside the box and
   * floats above it once the field has focus or a selection.
   *
   * Unlike the single-value fields this cannot key off `:placeholder-shown` — a multi-select's own input
   * stays empty while the values live in pills beside it — so the filled state is read from the pills
   * themselves. See `components.module.css`.
   */
  floating?: boolean
  /**
   * `Border Radius/round` corners instead of the set's `Border Radius/medium` — the field as a pill.
   *
   * The same boolean `Select` takes, for the same reason: the two shapes are the two the library draws.
   * An explicit `radius` prop still wins.
   */
  rounded?: boolean
}

/**
 * MultiSelect — the Figma `Input` set's `Type=Dropdown` box (node `16166:23969`) holding more than one
 * value, with the menu from the `Dropdown` set (`16884:46299`).
 *
 * **Not drawn in the library.** `Solutions Library- 2026` has no multi-value dropdown cell, so this is
 * composed from parts that *are* drawn — the field box, the dropdown menu, and the `Chip` treatment for
 * the pills — rather than invented. It exists because the alternative in a real form is a column of
 * checkboxes, which stops being readable somewhere around six options.
 *
 * The box grows with its pills instead of scrolling them: a value the user chose and can no longer see
 * is a value they will choose twice. Everything else matches `Select` — the same 48px minimum, the same
 * gradient border and focus ring, the same `floating` and `rounded` axes.
 *
 * ```tsx
 * <MultiSelect label="Industries" data={INDUSTRIES} searchable clearable />
 * ```
 */
export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  { info, floating, rounded, label, ...props },
  ref,
) {
  return (
    <MantineMultiSelect
      ref={ref}
      /* On the root, not the input: extra props on an input component land on the `<input>` itself. */
      attributes={{ root: floating ? { 'data-floating': 'true' } : {} }}
      /*
       * Through Mantine's own prop rather than a data attribute, so the theme's `inputVars` drops its
       * default `--input-radius` and the pill value actually lands. `props.radius` is spread after this.
       */
      radius={rounded ? radius.round : undefined}
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
