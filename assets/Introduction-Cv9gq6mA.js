import{j as e}from"./iframe-D0tH3cJN.js";import{u as o,M as i}from"./blocks-Bdg8ixwV.js";import"./preload-helper-C1FmrZbK.js";function t(s){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",strong:"strong",...o(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Overview/Introduction"}),`
`,e.jsx(n.h1,{id:"scratch",children:"Scratch"}),`
`,e.jsxs(n.p,{children:[`A React component library whose single source of truth is the Figma library
`,e.jsx(n.strong,{children:"Solutions Library- 2026"})," (file key ",e.jsx(n.code,{children:"KihJKyGA20stc2SSjAlxYU"}),`). Components are
`,e.jsx(n.a,{href:"https://mantine.dev",rel:"nofollow",children:"Mantine"}),` components dressed in that library's tokens — nothing is styled
from scratch, and no value is invented.`]}),`
`,e.jsx(n.h2,{id:"how-it-fits-together",children:"How it fits together"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tokens come out of Figma as files."})," ",e.jsx(n.code,{children:"tokens/figma/*.tokens.json"}),` are exports of the Figma
variable collections — colours (Light and LRDC-Dark), border radii, spacing, and the three
typography modes. They are committed, so the repo always shows exactly which snapshot it was
built from.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A script turns them into code."})," ",e.jsx(n.code,{children:"pnpm tokens"}),` reads those exports and writes
`,e.jsx(n.code,{children:"src/theme/tokens.generated.ts"})," and ",e.jsx(n.code,{children:"src/theme/typography.generated.css"}),`. It resolves Figma's
token aliases and rebuilds translucent colours as `,e.jsx(n.code,{children:"rgba()"}),`. Neither generated file is edited
by hand.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"The theme maps them onto Mantine."})," ",e.jsx(n.code,{children:"src/theme/theme.ts"}),` turns the tokens into Mantine's
theme — colour ramps, spacing scale, radii, type scale. `,e.jsx(n.code,{children:"src/theme/components.ts"}),` configures how
each component uses them.`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Components stay thin."}),` A component is a wrapper that adds no styling of its own. Everything
visual lives in the theme, reached through a `,e.jsx(n.code,{children:"variant"})," prop."]}),`
`]}),`
`,e.jsx(n.h2,{id:"changing-a-value",children:"Changing a value"}),`
`,e.jsxs(n.p,{children:["Change it in Figma, re-export the collection, drop the file into ",e.jsx(n.code,{children:"tokens/figma/"}),`, and run
`,e.jsx(n.code,{children:"pnpm tokens"}),`. Every component picks the new value up. If you find yourself editing a colour inside
a component, that is the signal something is missing from the token layer.`]}),`
`,e.jsx(n.h2,{id:"light-and-dark",children:"Light and dark"}),`
`,e.jsxs(n.p,{children:[`The Figma library defines two colour modes, and both are live here. Every colour token is published
as a `,e.jsx(n.code,{children:"--sds-*"}),` CSS variable in both modes, so a component never needs to know which one is active.
Use the `,e.jsx(n.strong,{children:"Color scheme"}),` control in the toolbar above to switch — dark is the mode the library is
drawn in.`]}),`
`,e.jsx(n.h2,{id:"typography-is-responsive",children:"Typography is responsive"}),`
`,e.jsx(n.p,{children:`Figma ships three typography modes — Mobile (0+), Tablet (576+) and Desktop (1200+). Rather than
picking one, all three are emitted as media-queried CSS variables, so the type scale changes with
the viewport on its own.`})]})}function c(s={}){const{wrapper:n}={...o(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{c as default};
