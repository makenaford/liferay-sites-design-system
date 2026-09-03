import { useMemo } from 'react'
import {
  Box,
  Checkbox,
  Combobox,
  Group,
  InputBase,
  Stack,
  Text,
  UnstyledButton,
  useCombobox,
} from '@mantine/core'
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
 * One filter — a select-shaped control that opens a checkable list.
 *
 * `Combobox` + `InputBase component="button"`, wearing the same `field*` classes the theme puts on
 * `Select`. That is the point: this *is* a select as far as the eye is concerned — same height, same
 * hairline, same focus ring, same dropdown — so it sits in a row with the hero's solution finder
 * without either looking like the odd one out. Hand-rolling the pill got the shape right and the
 * dropdown wrong, and left a second set of styles to keep in step with the real inputs.
 *
 * **It keeps its label and shows a count, rather than showing the values inside.** A `MultiSelect`
 * would put the chosen values in the control and grow it as they are added; the file draws a control
 * of fixed width with the values below it as chips, so `Combobox` is the primitive and the display is
 * this component's own.
 *
 * `radius="xl"` because the file draws these as pills — the same radius the solution finder's selects
 * take, which is the other place this shape appears.
 */
function FilterPill({
  filter,
  chosen,
  onToggle,
}: {
  filter: StoryFilter
  chosen: string[]
  /** One value at a time — the bar owns the set, so this never builds a new array from a stale one. */
  onToggle: (value: string) => void
}) {
  const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() })

  return (
    <Combobox
      store={combobox}
      withinPortal
      position="bottom-start"
      onOptionSubmit={onToggle}
      classNames={{
        dropdown: classes.fieldDropdown,
        options: classes.fieldOptions,
        option: classes.fieldOption,
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          radius="xl"
          w="auto"
          /*
           * `md` explicitly. The theme sets it as a default on `Select` and `TextInput`, but `InputBase`
           * is not extended, so it falls back to `sm` and this control comes out 36px beside a 47px
           * field — close enough to look like a mistake rather than a choice.
           */
          size="md"
          classNames={{
            root: classes.fieldRoot,
            wrapper: classes.fieldWrapper,
            input: classes.filterInput,
            section: classes.fieldSection,
          }}
          rightSection={<IconDown />}
          /* The caret is part of the control, not a second target inside it. */
          rightSectionPointerEvents="none"
          data-active={chosen.length ? true : undefined}
          aria-label={
            chosen.length ? `${filter.label}, ${chosen.length} selected` : filter.label
          }
          onClick={() => combobox.toggleDropdown()}
        >
          {filter.label}
          {chosen.length ? (
            <span className={classes.filterPillCount} aria-hidden>
              {chosen.length}
            </span>
          ) : null}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {filter.options.map((option) => (
            <Combobox.Option value={option} key={option} active={chosen.includes(option)}>
              <Group gap={10} wrap="nowrap">
                {/*
                 * The box is decoration. `Combobox.Option` already carries `aria-selected`, so a real
                 * checkbox here would be a second control announcing the same state and taking its own
                 * turn in the tab order.
                 */}
                <Checkbox
                  checked={chosen.includes(option)}
                  readOnly
                  tabIndex={-1}
                  aria-hidden
                  size="xs"
                />
                <span>{option}</span>
              </Group>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
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
  /**
   * Takes an updater, not a value.
   *
   * Every control here derives the next selection from the current one, and React batches updates
   * within a tick — so two changes in the same batch both read the selection as it was before either of
   * them, and the second silently overwrites the first. Caught it doing exactly that: two options
   * picked in one tick left only the second selected. An updater reads the state React is holding.
   */
  onSelectionChange: (update: (previous: StorySelection) => StorySelection) => void
}) {
  const chips = useMemo(
    () =>
      filters.flatMap((filter) =>
        (selection[filter.label] ?? []).map((value) => ({ label: filter.label, value })),
      ),
    [filters, selection],
  )

  const remove = (label: string, value: string) =>
    onSelectionChange((previous) => ({
      ...previous,
      [label]: (previous[label] ?? []).filter((v) => v !== value),
    }))

  return (
    <Stack gap={12} w="100%">
      <Group gap={12} wrap="wrap">
        {filters.map((filter) => (
          <FilterPill
            key={filter.label}
            filter={filter}
            chosen={selection[filter.label] ?? []}
            onToggle={(value) =>
              onSelectionChange((previous) => {
                const held = previous[filter.label] ?? []
                return {
                  ...previous,
                  [filter.label]: held.includes(value)
                    ? held.filter((v) => v !== value)
                    : [...held, value],
                }
              })
            }
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
          <UnstyledButton
            className={classes.filterClear}
            onClick={() => onSelectionChange(() => ({}))}
          >
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
