import type { ReactNode } from 'react'
import { Tooltip, UnstyledButton } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { IconQuestion } from '../../icons'

export interface InfoTooltipProps {
  /** What the field needs explaining. Shown on hover and on keyboard focus. */
  children: ReactNode
  /** The pill's own text. Figma's default is "More Info". */
  label?: ReactNode
}

/**
 * The `Info Button` pill from the Figma `Input` set (`16032:242555`) — a 4px-radius
 * `Status/Info/Lighten 2` chip with 11px `Status/Info/Info` text and a question mark.
 *
 * In Figma it is a button; here it is a **tooltip trigger**, which is what an input's info affordance
 * has to be: it is rendered as a real `<button>` so it is in the tab order, and Mantine's `Tooltip`
 * wires up `aria-describedby` and opens on focus as well as hover. A tooltip attached to something
 * unfocusable is invisible to a keyboard.
 *
 * For an explanation the user always needs, use the field's `description` instead — a tooltip hides it
 * behind an interaction.
 */
export function InfoTooltip({ children, label = 'More Info' }: InfoTooltipProps) {
  return (
    <Tooltip label={children} withArrow multiline w={260} events={{ hover: true, focus: true, touch: true }}>
      <UnstyledButton className={classes.fieldInfo} type="button">
        {label}
        <IconQuestion />
      </UnstyledButton>
    </Tooltip>
  )
}
