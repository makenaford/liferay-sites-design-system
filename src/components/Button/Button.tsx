import { forwardRef } from 'react'
import { Button as MantineButton } from '@mantine/core'
import type { ButtonProps as MantineButtonProps, ElementProps } from '@mantine/core'

export interface ButtonProps
  extends MantineButtonProps,
    /**
     * Mirrors how Mantine types its own components: everything a native `<button>` accepts, minus
     * the props Mantine defines differently.
     */
    ElementProps<'button', keyof MantineButtonProps> {}

/**
 * Button — Figma `Button` component set (node `16123:189647`).
 *
 * A thin wrapper over Mantine's `Button` that deliberately adds no props of its own. All appearance
 * lives in the theme (`src/theme/components.ts` + `components.module.css`), which maps the Figma
 * axes onto Mantine's:
 *
 * | Figma | Prop |
 * | --- | --- |
 * | Color Primary, Style Solid | `variant="filled"` (default) |
 * | Color Primary, Style Outline | `variant="outline"` |
 * | Color Neutral, Style Solid | `variant="neutral"` |
 * | Color Primary, Style Rounded | `variant="rounded"` |
 * | Size Small / Medium / Large | `size="sm" \| "md" \| "lg"` (default `lg`) |
 * | Icon Left / Right / None | `leftSection` / `rightSection` |
 * | State Default/Hover/Focus/Pressed | the real CSS interaction states |
 * | State Disabled | `disabled` |
 *
 * Radius is decided by the variant and size, so pass an explicit `radius` only to deviate from the
 * design. For a polymorphic button (rendering as an anchor or a router link), use Mantine's
 * `Button` directly with its `component` prop.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  return <MantineButton ref={ref} {...props} />
})
