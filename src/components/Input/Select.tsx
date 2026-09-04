import { forwardRef, type ReactNode } from 'react'
import { Select as MantineSelect } from '@mantine/core'
import type { SelectProps as MantineSelectProps } from '@mantine/core'
import { InfoTooltip } from './InfoTooltip'
import { radius } from '../../theme/tokens.generated'

export interface SelectProps extends MantineSelectProps {
  /** Figma's `Info Button`: an explanation beside the label, in a tooltip. */
  info?: ReactNode
  /**
   * Figma's `Condensed` axis — the notched label chip sitting on the field's border rather than above it.
   *
   * Every dropdown in the `Form` set is `Condensed=True`, which is why this exists: without it a form built
   * from the file would have floating labels on its text fields and stacked labels on its selects.
   */
  floating?: boolean
  /**
   * `Border Radius/round` corners instead of the set's `Border Radius/medium` — the field as a pill.
   *
   * A boolean rather than `radius="round"` for the same reason `Button` makes `rounded` a variant: the
   * two shapes are the two the library draws, and a call site that can name any radius will eventually
   * name one the system does not have. An explicit `radius` prop still wins, for the rare field that
   * needs to match something else on the page.
   */
  rounded?: boolean
}

/**
 * Select — Figma `Input` set (node `16166:23969`), `Type=Dropdown`, with the menu from the `Dropdown`
 * set (`16884:46299`).
 *
 * The field is the same 48px box as `TextInput`; the menu is the glass card surface the rest of the
 * library uses. Three of the `Dropdown` set's five cells are covered, because they are the three a
 * select actually does:
 *
 * | Figma `Variant` | How |
 * | --- | --- |
 * | Simple | `data` as a flat list |
 * | Groups | `data` as `{ group, items }` |
 * | Search | `searchable` |
 *
 * `floating` is Figma's `Condensed` axis, the same as on `TextInput` — every dropdown in the `Form` set uses
 * it.
 *
 * `Drilldown` and `Slot` are not select behaviours — nested menus and arbitrary content need `Menu` or
 * a `Popover` underneath — so they are deliberately out of scope rather than approximated. See
 * README.md.
 *
 * Renders a combobox: the button is focusable, the list opens on Enter or Space, the arrow keys move
 * through options and Escape closes it. That is why this is a `Select` and not a styled `div` — the
 * keyboard behaviour is the component.
 */
export const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
  { info, floating, rounded, label, ...props },
  ref,
) {
  return (
    <MantineSelect
      ref={ref}
      /* On the root, not the input: extra props on an input component land on the `<input>` itself. */
      attributes={{ root: floating ? { 'data-floating': 'true' } : {} }}
      /*
       * The radius goes through Mantine's own prop rather than a data attribute: the theme's `inputVars`
       * drops its default `--input-radius` as soon as `radius` is given, so this is the one path that
       * does not fight the set's 8px default. `props.radius` is spread after this, so a call site that
       * states one still wins.
       */
      radius={rounded ? radius.round : undefined}
      /*
       * A floating label keys off `:placeholder-shown`, so the field needs a placeholder that is not
       * visible — the label is already in the box, and the stylesheet hides this until focus.
       */
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
