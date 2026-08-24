import { forwardRef, type FormHTMLAttributes, type ReactNode } from 'react'
import { Box } from '@mantine/core'
import type { BoxProps } from '@mantine/core'
import classes from '../../theme/components.module.css'

export interface FormRowProps extends BoxProps {
  children?: ReactNode
}

/**
 * One of Figma's numbered slots — a row of one or two fields, 16px apart, that becomes a single column on a
 * narrow card.
 *
 * The numbers in the file (`Slot 1`, `Slot 2`, `Slot 3`, `Slot 4`, `Slot 5`, `Slot 8`) are an artefact of
 * how Figma slots work, not an API: they are not in visual order, `Slot 6` and `7` do not exist, and which
 * one holds two fields rather than one is a property of the instance. So they are one repeatable `Form.Row`
 * here, and the order is the order you write.
 */
const FormRow = forwardRef<HTMLDivElement, FormRowProps>(function FormRow(
  { className, children, ...props },
  ref,
) {
  return (
    <Box ref={ref} className={[classes.formRow, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Box>
  )
})

export interface FormProps
  extends Omit<BoxProps, 'title'>,
    Omit<FormHTMLAttributes<HTMLFormElement>, keyof BoxProps | 'title'> {
  /** Figma's `Content Text` title — 28px semibold on the desktop card, 23px on a narrow one. */
  title?: ReactNode
  /** The line under it. */
  description?: ReactNode
  /**
   * Figma's `Description/Terms` slot: the reCAPTCHA and privacy line. It sits **above** the submit button,
   * which is where the file puts it and where it belongs — terms you agree to by submitting have to be
   * readable before the button, not after it.
   */
  terms?: ReactNode
  /** The submit control. Figma draws a full-width `Size=Medium` solid button. */
  submit?: ReactNode
  /** The line under the button — Figma's second `Description Card`, for an "already have an account?" link. */
  footnote?: ReactNode
  /** `Form.Row`s, or anything else that belongs between the heading and the terms. */
  children?: ReactNode
}

const FormBase = forwardRef<HTMLFormElement, FormProps>(function Form(
  { title, description, terms, submit, footnote, children, className, ...props },
  ref,
) {
  /*
   * A wrapper carries the container, and the `<form>` inside it is the card. A container cannot be styled by
   * its own query, so with `container-type` on the form itself the mobile padding and gap silently never
   * applied — measured: 40px at every width while the rows below did collapse. The wrapper has no padding,
   * so its inline size *is* the card's outer width, which is what the breakpoint should be about.
   */
  return (
    <div className={classes.formShell}>
      <Box
        component="form"
        ref={ref}
        className={[classes.formRoot, className].filter(Boolean).join(' ')}
        {...props}
      >
        {title || description ? (
          <div className={classes.formHeader}>
            {title ? <p className={classes.formTitle}>{title}</p> : null}
            {description ? <p className={classes.formDescription}>{description}</p> : null}
          </div>
        ) : null}

        {children || terms ? (
          <div className={classes.formFields}>
            {children}
            {terms ? <div className={classes.formTerms}>{terms}</div> : null}
          </div>
        ) : null}

        {submit || footnote ? (
          <div className={classes.formActions}>
            {submit}
            {footnote ? <div className={classes.formFootnote}>{footnote}</div> : null}
          </div>
        ) : null}
      </Box>
    </div>
  )
})

/**
 * Form — Figma `Form` component set (node `21405:74359`).
 *
 * A glass card holding a heading, rows of fields, the terms line, and a submit button. It renders a real
 * `<form>`, so `onSubmit` works, Enter submits, and a `Button type="submit"` inside it does what it looks
 * like it does.
 *
 * | Figma | Prop |
 * | --- | --- |
 * | `Content Text` title + description | `title`, `description` |
 * | `Slot 1`–`Slot 5`, `Slot 8` | `Form.Row`, one per row |
 * | `Description/Terms` | `terms` |
 * | `Action section` `Type=Button` | `submit` |
 * | The second `Description Card` | `footnote` |
 * | `Size` — Desktop / Mobile | **responsive**, a container query |
 * | `Format` — Short | the only cell; nothing to switch on |
 *
 * ```tsx
 * <Form
 *   title="Start your free 30 day trial"
 *   description="No credit card required."
 *   terms={<>This site is protected by reCAPTCHA. <Link href="/privacy">Privacy Policy</Link>.</>}
 *   submit={<Button type="submit" size="md" fullWidth>Download</Button>}
 *   footnote={<>Already have a trial? <Link href="/renew">Renew here</Link>.</>}
 *   onSubmit={handleSubmit}
 * >
 *   <Form.Row>
 *     <TextInput floating label="Work Email" required type="email" />
 *   </Form.Row>
 *   <Form.Row>
 *     <TextInput floating label="First Name" required />
 *     <TextInput floating label="Last Name" required />
 *   </Form.Row>
 * </Form>
 * ```
 *
 * ## The numbered slots are not the API
 *
 * Figma's slots are `Slot 1`, `2`, `3`, `4`, `5` and `8` — not in visual order, with no 6 or 7, and whether
 * a given one holds one field or two is set per instance. That numbering is how Figma's slot system works,
 * not a description of a form. `Form.Row` is one repeatable thing instead, and the order you write is the
 * order it renders.
 *
 * ## Fields are `floating`
 *
 * Every input in the file is `Condensed=True` — the notched floating label, with a `Neutral/00` chip sitting
 * on the border and a red asterisk when required. That is `TextInput`'s `floating` prop, so a row is
 * `<TextInput floating label="…" required />` and the label behaves as a label rather than a placeholder
 * that vanishes the moment someone types.
 *
 * ## Terms above the button
 *
 * `terms` renders **above** `submit`, which is where Figma puts it. It is also the only defensible order:
 * text you agree to by pressing a button has to be readable before the button, not underneath it.
 */
export const Form = Object.assign(FormBase, { Row: FormRow })
