/**
 * The design system's theme, applied to the page and to nothing else.
 *
 * ## Why this has to be scoped
 *
 * The builder's own chrome is built from Mantine — toolbars, selects, the layer tree — and the design
 * system is *also* built from Mantine, by re-theming its components. Put one `MantineProvider`
 * carrying the library's theme around the whole application and the toolbar's buttons become 56px
 * Figma buttons with brand gradients: the chrome stops being chrome, and a designer can no longer tell
 * what is the page and what is the tool wrapped around it.
 *
 * So there are two providers. The outer one, in `App.tsx`, is stock Mantine and styles the tool. This
 * one is nested, carries the library's theme, and writes its variables to a **selector** rather than
 * to `:root` — `getRootElement` returning nothing is what stops it claiming the document. Everything
 * inside the wrapper is the page; everything outside it is the builder.
 *
 * It is also the single place the two live renderings agree: the canvas and the published page both go
 * through here, so a page cannot look one way while being built and another way when it is shared.
 */
import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { cssVariablesResolver } from '../theme/cssVariables'
import { theme } from '../theme/theme'

/** The class the library's variables are written to. Also the container the sections measure against. */
export const PAGE_CLASS = 'sds-page'

export function PageTheme({
  children,
  className,
  style,
  colorScheme = 'dark',
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** The page's own scheme, which is a property of the page rather than of the browser. */
  colorScheme?: 'dark' | 'light'
}) {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      forceColorScheme={colorScheme}
      cssVariablesSelector={`.${PAGE_CLASS}`}
      /*
       * Returning nothing keeps this provider from writing `data-mantine-color-scheme` onto `<html>`,
       * which the outer provider owns. Without it the two fight over the document element and the
       * chrome flips theme whenever this one mounts.
       */
      getRootElement={() => undefined}
      withGlobalClasses={false}
    >
      {/*
        * The colour scheme attribute is set by hand because `getRootElement` above stopped Mantine
        * setting it. It is not decoration: Mantine writes a theme's scheme-dependent values to
        * `.sds-page[data-mantine-color-scheme="dark"]`, so without the attribute every `--sds-*`
        * colour silently falls back and the page renders as unstyled text on a flat ground.
        */}
      <div
        className={[PAGE_CLASS, className].filter(Boolean).join(' ')}
        data-mantine-color-scheme={colorScheme}
        /*
         * The wrapper paints the page's own ground. Without it a light page sits on whatever the
         * document body happens to be — which is the builder's near-black — and the page appears to
         * end halfway down the window.
         */
        style={{
          background: 'var(--mantine-color-body)',
          /*
           * The page is the container its sections measure against. `Section`'s gutter is
           * `clamp(20px, 5.56cqi, 80px)` of *this* element, so without a containment context every
           * `cqi` resolves to zero and the whole page loses its gutters — which is exactly what the
           * first static artefact came out looking like.
           */
          containerType: 'inline-size',
          ...style,
        }}
      >
        {children}
      </div>
    </MantineProvider>
  )
}
