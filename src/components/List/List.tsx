import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type ReactNode,
} from 'react'
import { List as MantineList } from '@mantine/core'
import type { ListProps as MantineListProps, ElementProps } from '@mantine/core'
import classes from '../../theme/components.module.css'
import { IconCheck } from '../../icons'

/**
 * Figma's `List` `Type` axis, plus a `none` cell it does not draw.
 *
 * `check` is Figma's `Type=Icon`, which renders `system/check` — the `Icon Type` instance swap is the
 * `icon` prop here. `number` and `bullet` are its other two cells.
 */
export type ListMarker = 'check' | 'number' | 'bullet' | 'none'

/**
 * The marker's box, from the `Sub Item List` `Size` axis and the `Main List Item` `Size` axis together:
 * `sm` is its 16px `Size=Small` cell, `md` the 24px `Size=Default`, `lg` the 32px box that
 * `Main List Item` `Size=Medium` uses.
 *
 * It sizes **the marker only**. Every cell in Figma keeps its text at 18px, and so does this.
 */
export type ListSize = 'sm' | 'md' | 'lg'

interface ListContextValue {
  /**
   * Set by any list, read by the next one down. Figma's `Sub List` is a different thing from the list it
   * sits in — always bullets, 8px apart, 2px from its marker instead of 8, a semibold rather than bold
   * title, and flush against its description — so nesting is detected rather than configured.
   */
  nested: boolean
  marker: ListMarker
  icon?: ReactNode
}

const ListContext = createContext<ListContextValue>({ nested: false, marker: 'check' })

export interface ListProps
  extends Omit<MantineListProps, 'type' | 'icon' | 'size' | 'spacing' | 'center' | 'listStyleType'> {
  /** Figma's `List` `Type`. @default 'check', or `'bullet'` inside another list */
  marker?: ListMarker
  /** The marker's box. Does not change the text. @default 'md' */
  size?: ListSize
  /**
   * Swaps the glyph for the `check` marker — Figma's `Icon Type` instance swap. Set it on the list for
   * every item, or on a single `List.Item`.
   */
  icon?: ReactNode
  /** Between items. Figma's `List` uses 20 and its `Sub List` 8, which are the two defaults. */
  spacing?: number | string
  /**
   * Figma's `Main List Item` `Padding=Yes`: each item gets 20/16 of padding and the
   * `Surfaces/Card BG/Grey` surface behind it. The two are one cell in Figma, so they are one prop here.
   */
  padded?: boolean
}

export interface ListItemProps extends Omit<ElementProps<'li'>, 'title'> {
  /**
   * Figma's `Header list`. Bold at 18px, with the children below it as the description — Figma's
   * `Show Header` and `Show description` booleans are simply which of the two you pass.
   *
   * Named for the slot it fills rather than the HTML `title` attribute, which it deliberately shadows.
   */
  title?: ReactNode
  /** Swaps this row's glyph — the `Icon Type` instance swap on one item. */
  icon?: ReactNode
  children?: ReactNode
}

/** Marks the component so `List.Item` can tell a sublist apart from its description. */
const LIST_MARKER = Symbol.for('sds.List')

const ListBase = forwardRef<HTMLUListElement & HTMLOListElement, ListProps>(function List(
  { marker, size, icon, spacing, padded, className, style, children, ...props },
  ref,
) {
  const parent = useContext(ListContext)

  const resolvedMarker = marker ?? (parent.nested ? 'bullet' : 'check')
  const resolvedSize = size ?? 'md'
  const resolvedSpacing = spacing ?? (parent.nested ? 8 : 20)

  return (
    <ListContext.Provider value={{ nested: true, marker: resolvedMarker, icon }}>
      <MantineList
        ref={ref}
        /* An ordered list for numbers, so the count is in the document and not only in the CSS. */
        type={resolvedMarker === 'number' ? 'ordered' : 'unordered'}
        className={[classes.listRoot, className].filter(Boolean).join(' ')}
        data-marker={resolvedMarker}
        data-size={resolvedSize}
        data-padded={padded || undefined}
        data-nested={parent.nested || undefined}
        /*
         * Safari drops list semantics from a `ul`/`ol` styled `list-style: none`, which is what a custom
         * marker requires. The explicit role puts them back.
         */
        role="list"
        {...props}
        /* After the spread: Mantine's `spacing` is not passed through, so this is the only gap. */
        style={{
          '--list-spacing':
            typeof resolvedSpacing === 'number' ? `${resolvedSpacing}px` : resolvedSpacing,
          ...style,
        }}
      >
        {children}
      </MantineList>
    </ListContext.Provider>
  )
})

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { title, icon, children, className, ...props },
  ref,
) {
  const { marker, icon: listIcon } = useContext(ListContext)

  /*
   * A sublist is pulled out of the description and rendered as a sibling of the row, because that is
   * where a nested list belongs: a child of the `<li>`, not of a `<span>` inside it. Figma indents it to
   * line up with the content, which the stylesheet does with the marker column's own width.
   */
  const content: ReactNode[] = []
  const sublists: ReactNode[] = []

  Children.toArray(children).forEach((child) => {
    const isSublist =
      isValidElement(child) &&
      (child.type as { [LIST_MARKER]?: boolean } | undefined)?.[LIST_MARKER] === true
    ;(isSublist ? sublists : content).push(child)
  })

  return (
    <li ref={ref} className={[classes.listItem, className].filter(Boolean).join(' ')} {...props}>
      <div className={classes.listItemRow}>
        {marker === 'none' ? null : (
          <span className={classes.listItemIcon}>
            <span className={classes.listMarker} data-marker={marker} aria-hidden>
              {marker === 'check' ? (icon ?? listIcon ?? <IconCheck />) : null}
            </span>
          </span>
        )}

        <div className={classes.listItemLabel}>
          {title ? <span className={classes.listTitle}>{title}</span> : null}
          {content.length ? <span className={classes.listDescription}>{content}</span> : null}
        </div>
      </div>

      {sublists}
    </li>
  )
})

/**
 * List — Figma `List` (node `19130:63824`), `Main List Item` (`19660:37508`), `Sub List Item`
 * (`19660:53930`) and the `Sub Item List` marker set (`19129:50376`), on Mantine's `List`.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `List` `Type` — Icon / Number / Bullet | `marker="check" \| "number" \| "bullet"` |
 * | `Sub Item List` `Icon Type` (instance swap) | `icon`, on the list or on one item |
 * | `Main List Item` `Size` — Default / Medium | `size="md"` / `size="lg"` |
 * | `Sub Item List` `Size=Small` | `size="sm"` |
 * | `Main List Item` `Padding` — No / Yes | `padded` |
 * | `Show Header` + `Header list` | `<List.Item title="…">` |
 * | `Show description` + `Description` | the item's children |
 * | `Show Sublist` + `Sub List` | a `List` inside a `List.Item` |
 * | `List` gap 20, `Sub List` gap 8 | `spacing`, defaulted per level |
 *
 * ```tsx
 * <List marker="check">
 *   <List.Item title="Key point">Short description here</List.Item>
 *   <List.Item title="Another point">
 *     With a sublist under it.
 *     <List>
 *       <List.Item title="Sub point">Bullets, 8px apart, a semibold title.</List.Item>
 *     </List>
 *   </List.Item>
 * </List>
 * ```
 *
 * ## A sublist knows it is one
 *
 * Figma's `Sub List` is not the same component as the list around it: bullets rather than checks, 8px
 * between items rather than 20, 2px from the marker rather than 8, a semibold title rather than bold, and
 * no gap between title and description. Every one of those is a different **value**, not a different
 * component, so a `List` inside a `List.Item` picks all five up on its own — there is no `nested` prop to
 * remember, and passing `marker` or `spacing` still overrides.
 *
 * The nested list is also lifted out of the description and rendered as a child of the `<li>`, which is
 * where a nested list belongs; it is then indented by the marker column's own width so it lines up with
 * the content above it, as Figma draws it.
 *
 * ## Semantics
 *
 * A real `<ul>`, or `<ol>` when `marker="number"` — so a screen reader announces how many items there
 * are, and the numbering comes from the document. The visible number is a **CSS counter** for the same
 * reason: it cannot disagree with the item's position, and inserting a row in the middle needs no edits.
 *
 * `role="list"` is set explicitly because Safari removes list semantics from a list styled
 * `list-style: none`, which a custom marker requires.
 *
 * Every marker is `aria-hidden`, the check included. The list role already says "list", the `<ol>` says
 * what number an item is, and a dot read out before each line is noise. That does mean a tick carries no
 * announced meaning: if it stands for something the copy does not say — "included in this plan" — then
 * the copy is the place to say it, or pass an `icon` with a label of its own. An invented alt text on a
 * decorative marker would be worse than a silent one.
 */
export const List = Object.assign(ListBase, { Item: ListItem, [LIST_MARKER]: true })
