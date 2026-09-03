import { useMemo } from 'react'
import { Box, Checkbox, Group, Menu, Stack, Text, UnstyledButton } from '@mantine/core'
import { Chip } from '../components/Chip'
import { IconClose, IconDown } from '../icons'
import classes from '../theme/components.module.css'

/** What a filter offers: its label, which is also the key into a card's `facets`, and its options. */
export interface StoryFilter {
  label: string
  options: string[]
}

/** The current selection, keyed by filter label. A filter with no entry has nothing selected. */
export type StorySelection = Record<string, string[]>

/**
 * Does this card's facets satisfy the selection?
 *
 * **OR within a filter, AND across them.** A card matches one filter when it carries *any* of that
 * filter's selected values, and it is shown when it matches *every* filter that has a selection. That
 * is what a reader means by picking Website and Customer Portal under Solutions and then narrowing by
 * Industry: widen inside a category, narrow between them. A filter with nothing selected narrows
 * nothing rather than excluding everything, which is the mistake the other reading makes.
 */
export function matchesSelection(
  facets: Record<string, string[]> | undefined,
  selection: StorySelection,
): boolean {
  return Object.entries(selection).every(([label, chosen]) => {
    if (!chosen.length) return true
    const held = facets?.[label] ?? []
    return chosen.some((value) => held.includes(value))
  })
}

/**
 * One filter — a pill that opens a list of checkboxes.
 *
 * A `Popover` of checkboxes rather than a `Select multiple`: the file draws a pill that keeps its label
 * and gains a count, where a multi-select input shows the chosen values inside itself and grows as they
 * are added. The chosen values are shown as chips under the row instead, so the row's height never
 * depends on what is selected.
 */
function FilterPill({
  filter,
  chosen,
  onChange,
}: {
  filter: StoryFilter
  chosen: string[]
  onChange: (values: string[]) => void
}) {
  /*
   * `Menu`, not `Popover`.
   *
   * `Popover.Target` clones its child and re-spreads its own props over the child's, which drops an
   * `onClick` the child brought with it — the pill rendered, `aria-expanded` stayed `false`, and
   * nothing opened. `Menu` owns the open state and wires the target itself, which is what this needs:
   * the pill is a disclosure, and the only thing it has to do is disclose.
   *
   * `closeOnItemClick={false}` because this is a multiselect. A menu that closes on the first pick
   * makes choosing two values two round trips through the same control.
   */
  return (
    <Menu position="bottom-start" withinPortal shadow="md" closeOnItemClick={false}>
      <Menu.Target>
        <UnstyledButton
          className={classes.filterPill}
          data-active={chosen.length ? true : undefined}
          aria-haspopup="true"
        >
          {filter.label}
          {chosen.length ? (
            <span className={classes.filterPillCount} aria-label={`${chosen.length} selected`}>
              {chosen.length}
            </span>
          ) : null}
          <span className={classes.filterPillCaret} aria-hidden>
            <IconDown />
          </span>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown className={classes.filterDropdown}>
        {/*
         * A group rather than loose checkboxes: it gives the set one accessible name, so the list is
         * announced as "Solutions, group" instead of five unrelated boxes.
         */}
        <Checkbox.Group value={chosen} onChange={onChange} label={filter.label}>
          <Stack gap={8} mt={8}>
            {filter.options.map((option) => (
              <Checkbox key={option} value={option} label={option} />
            ))}
          </Stack>
        </Checkbox.Group>
      </Menu.Dropdown>
    </Menu>
  )
}

/**
 * The filter bar — the pills, the chips they produce, and the way back out.
 *
 * Everything here updates the list as it is pressed. There is no Apply button because the file draws
 * none, and the result count beside the heading is what tells a reader their press did something.
 */
export function StoryFilterBar({
  filters,
  selection,
  onSelectionChange,
}: {
  filters: StoryFilter[]
  selection: StorySelection
  onSelectionChange: (selection: StorySelection) => void
}) {
  const chips = useMemo(
    () =>
      filters.flatMap((filter) =>
        (selection[filter.label] ?? []).map((value) => ({ label: filter.label, value })),
      ),
    [filters, selection],
  )

  const remove = (label: string, value: string) =>
    onSelectionChange({
      ...selection,
      [label]: (selection[label] ?? []).filter((v) => v !== value),
    })

  return (
    <Stack gap={12} w="100%">
      <Group gap={12} wrap="wrap">
        {filters.map((filter) => (
          <FilterPill
            key={filter.label}
            filter={filter}
            chosen={selection[filter.label] ?? []}
            onChange={(values) => onSelectionChange({ ...selection, [filter.label]: values })}
          />
        ))}

        {/*
         * Only when there is something to clear. A permanent Clear Filters is a control that does
         * nothing most of the time, and one that appears is also the clearest signal that a filter is on.
         */}
        {chips.length ? (
          /*
           * A button styled as a link, not `Link` with `component="button"`: the wrapper is
           * deliberately non-polymorphic — see its own docs — and this clears state rather than going
           * anywhere, so a `<button>` is what it should have been either way.
           */
          <UnstyledButton className={classes.filterClear} onClick={() => onSelectionChange({})}>
            <IconClose aria-hidden />
            Clear Filters
          </UnstyledButton>
        ) : null}
      </Group>

      {chips.length ? (
        /*
         * The chips carry the filter's name in their accessible label but not in their text: on screen
         * the pill above already says which filter a chip came from, and repeating it would make every
         * chip twice as long. A screen reader has no such column, so it gets the long form.
         */
        <Group gap={8} wrap="wrap" role="list" aria-label="Selected filters">
          {chips.map((chip) => (
            <Box key={`${chip.label}-${chip.value}`} role="listitem">
              {/*
               * A `Chip` removes itself by being unchecked — it is a toggle, and every cell the file
               * draws carries the close glyph on the right. So the glyph is decoration and the chip's
               * own change handler is the remove; a `<button>` inside it would be a control inside a
               * control.
               */}
              <Chip
                checked
                rightSection={<IconClose />}
                aria-label={`Remove ${chip.value} from ${chip.label}`}
                onChange={() => remove(chip.label, chip.value)}
              >
                {chip.value}
              </Chip>
            </Box>
          ))}
        </Group>
      ) : null}
    </Stack>
  )
}

/** `60 Results` — the count beside the heading, and the only feedback a press gets. */
export function ResultCount({ count }: { count: number }) {
  return (
    <Text fz={18} fw={600} c="var(--sds-surfaces-text-secondary)" aria-live="polite">
      {count} {count === 1 ? 'Result' : 'Results'}
    </Text>
  )
}
