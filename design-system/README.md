# Solutions Library — Design System

A React + Storybook component library ported from the Figma-sourced design system export
(`Solutions Library — Design System`). Every component reads from the same CSS custom
properties (`src/styles/tokens.css`), so light/dark mode and future rebrands are one-file edits.

## What's in here

```
src/
├── styles/
│   ├── tokens.css     ← all design tokens (color, spacing, radius, shadow), light + dark
│   └── base.css       ← resets + small shared utility classes (.card-demo, .demo-row, etc.)
├── components/
│   ├── Button/
│   ├── Labels/            Chip, Tag, Badge, LabelCTA
│   ├── Links/             Link, LinkInline, Pagination
│   ├── TextField/         TextField, TextArea, Select, SearchField
│   ├── Selection/         Checkbox, Radio
│   ├── Dropdown/          DropdownMenu
│   ├── Search/            SearchResults
│   ├── Navigation/        Breadcrumb, Tabs, PillTabs, NumberTabs, TOC
│   ├── Accordion/
│   ├── Table/             DSTable
│   ├── Card/              ResourceCard, GlassCard, HorizontalCard
│   └── Carousel/          CarouselControls
├── foundations/           Color, Typography, Spacing & Radius, Surfaces & Elevation docs pages
└── index.ts               barrel export of every component
```

Each component folder has a `.tsx` (the component), a `.css` (its styles, scoped by class name,
reading tokens from `tokens.css`), and a `.stories.tsx` (the Storybook demo — these mirror the
sections of the original design system page 1:1).

## Getting started

```bash
npm install
npm run storybook       # opens http://localhost:6006
```

Use the toolbar's sun/moon toggle at the top of Storybook to preview light and dark mode —
it flips `data-theme` on the root element, same mechanism as the original static page.

Build a static, shareable Storybook site:

```bash
npm run build-storybook   # outputs to storybook-static/
```

## Editing tokens / components

- **Change a color, spacing value, or radius everywhere at once** → edit `src/styles/tokens.css`.
- **Change one component's behavior or markup** → edit its `.tsx`/`.css` pair. Nothing else references
  those class names outside that component's own file (aside from the shared utility classes in `base.css`).
- **Add a new variant to Storybook** → add another named export to the relevant `.stories.tsx`.

## Publishing this as a GitHub repo

This folder is already a git repo (`git init` has been run) with everything staged in an initial commit.
From here:

```bash
cd design-system

# create the repo on GitHub (via the web UI, or the gh CLI if you have it installed & authenticated)
gh repo create YOUR-ORG/solutions-library-design-system --private --source=. --remote=origin

# or, if you created the repo on github.com first:
git remote add origin git@github.com:YOUR-ORG/solutions-library-design-system.git

git branch -M main
git push -u origin main
```

If you'd rather do this from **Claude Code**, just open this folder there — it can run `gh repo create`,
push, open PRs, and keep iterating on components with full terminal + git access, which this chat interface
doesn't have.

## Linking these styles to Figma (Code Connect)

[Figma Code Connect](https://www.figma.com/code-connect-docs/) maps a Figma component to the actual
code component that implements it, so when a designer inspects a node in Figma, they see *this* code
snippet instead of a generic CSS dump.

To wire it up for real:

1. Open the Figma file that contains your source design-system components (the one this export came from).
2. For each component (Button, Chip, Card, etc.), find its Figma node URL — right-click the component
   in Figma → **Copy link to selection**.
3. Use the Figma MCP connector's Code Connect tools (`get_context_for_code_connect`,
   `add_code_connect_map` / `send_code_connect_mappings`) to generate and publish a mapping file per
   component. Each mapping links a Figma node ID to the corresponding export in this repo, e.g.:

   ```ts
   // Button.figma.tsx (generated/edited by Code Connect)
   import figma from "@figma/code-connect";
   import { Button } from "./src/components/Button/Button";

   figma.connect(Button, "https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>", {
     props: {
       label: figma.string("Label"),
       size: figma.enum("Size", { Large: "lg", Medium: "md", Small: "sm" }),
     },
     example: (props) => <Button size={props.size}>{props.label}</Button>,
   });
   ```

4. Run `figma connect publish` (from the [Code Connect CLI](https://www.npmjs.com/package/@figma/code-connect))
   to push the mappings live.

**This repo doesn't include real `.figma.tsx` mapping files yet** because that requires your actual Figma
file key and node IDs, which weren't part of the exported page. Share the Figma file URL and I (or Claude
Code, with the Figma connector) can generate the real mapping files component-by-component.

## Notes on fidelity

Every token value, gradient, shadow, and breakpoint in this repo was copied directly from the exported
CSS — nothing was redesigned or approximated. Interactive behavior (accordions, tabs, dropdown search,
pagination, carousel dots) was rebuilt in React since the original relied on inline `onclick`/vanilla JS
in the static export.
