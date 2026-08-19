import{r as q,j as e,B as J}from"./iframe-D0tH3cJN.js";import{G as g,S as m,T as K}from"./Stack-Drjqavoc.js";import"./preload-helper-C1FmrZbK.js";const r=q.forwardRef(function(n,u){return e.jsx(J,{ref:u,...n})});r.__docgenInfo={description:'Button — Figma `Button` component set (node `16123:189647`).\n\nA thin wrapper over Mantine\'s `Button` that deliberately adds no props of its own. All appearance\nlives in the theme (`src/theme/components.ts` + `components.module.css`), which maps the Figma\naxes onto Mantine\'s:\n\n| Figma | Prop |\n| --- | --- |\n| Color Primary, Style Solid | `variant="filled"` (default) |\n| Color Primary, Style Outline | `variant="outline"` |\n| Color Neutral, Style Solid | `variant="neutral"` |\n| Color Primary, Style Rounded | `variant="rounded"` |\n| Size Small / Medium / Large | `size="sm" \\| "md" \\| "lg"` (default `lg`) |\n| Icon Left / Right / None | `leftSection` / `rightSection` |\n| State Default/Hover/Focus/Pressed | the real CSS interaction states |\n| State Disabled | `disabled` |\n\nRadius is decided by the variant and size, so pass an explicit `radius` only to deviate from the\ndesign. For a polymorphic button (rendering as an anchor or a router link), use Mantine\'s\n`Button` directly with its `component` prop.',methods:[],displayName:"Button",composes:["MantineButtonProps","ElementProps"]};function o(t){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,...t,children:e.jsx("g",{transform:"translate(2.2476 2.2476)",children:e.jsx("path",{d:"M1.56325 6.01585C3.35194 2.08319 7.77083 -0.0960025 12.0818 1.05912C15.6839 2.0243 18.1873 5.04315 18.6698 8.51839C18.723 8.90124 18.7516 9.28964 18.7544 9.68144C18.755 9.76093 18.6664 9.80747 18.6005 9.76305L15.9225 7.95867C15.8311 7.89704 15.8921 7.75443 15.9998 7.77806L17.7522 8.16236M17.9412 13.4889C16.1525 17.4215 11.7336 19.6007 7.42263 18.4456C3.82054 17.4804 1.31715 14.4616 0.834656 10.9863C0.781501 10.6035 0.752873 10.2151 0.750005 9.82327C0.749423 9.74379 0.83804 9.69725 0.903959 9.74166L3.5818 11.546C3.67328 11.6076 3.61224 11.7502 3.5045 11.7266L1.75223 11.3421",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}function a(t){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,...t,children:e.jsx("g",{transform:"translate(3.2508 5.5932)",children:e.jsx("path",{d:"M0.75 6.40685H15.75M10.7499 12.0637L16.4067 6.40685L10.7499 0.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})})}o.__docgenInfo={description:"",methods:[],displayName:"IconRefresh"};a.__docgenInfo={description:"",methods:[],displayName:"IconArrowRight"};const h=["filled","outline","neutral","rounded"],S=["lg","md","sm"],Q={lg:"Large",md:"Medium",sm:"Small"},ee={title:"Components/Button",component:r,args:{children:"Button",variant:"filled",size:"lg",disabled:!1},argTypes:{variant:{options:h,control:"inline-radio",description:"Figma Color x Style, flattened. `neutral` is Color Neutral; `rounded` is the pill."},size:{options:S,control:"inline-radio",description:"Figma Size. Large 56px, Medium 48px, Small 40px tall."},leftSection:{control:!1},rightSection:{control:!1}},parameters:{docs:{description:{component:["Mantine `Button` themed to the Figma `Button` component set (node `16123:189647`).","","Figma spreads the appearance over two axes — Color (Primary | Neutral) and Style (Solid | Outline | Rounded) — which are collapsed into Mantine's single `variant` prop so the variations read as one flat list. Icons come from `leftSection` / `rightSection`."].join(`
`)}}}},s={args:{leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{})}},i={render:t=>e.jsx(g,{gap:"16",children:h.map(n=>e.jsx(r,{...t,variant:n,children:n},n))}),args:{leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{})}},c={render:t=>e.jsx(g,{gap:"16",align:"center",children:S.map(n=>e.jsx(r,{...t,size:n,children:Q[n]},n))}),args:{leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{})}},d={render:t=>e.jsxs(g,{gap:"16",children:[e.jsx(r,{...t,leftSection:e.jsx(o,{}),children:"Left"}),e.jsx(r,{...t,rightSection:e.jsx(a,{}),children:"Right"}),e.jsx(r,{...t,leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{}),children:"Both"}),e.jsx(r,{...t,children:"None"})]})},l={render:t=>e.jsx(m,{gap:"24",children:h.map(n=>e.jsxs(m,{gap:"8",children:[e.jsx(K,{fz:"sm",c:"var(--sds-surfaces-text-tertiary)",tt:"uppercase",fw:600,children:n}),e.jsxs(g,{gap:"16",children:[e.jsx(r,{...t,variant:n,children:"Interactive"}),e.jsx(r,{...t,variant:n,disabled:!0,children:"Disabled"})]})]},n))}),args:{leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{})}},p={render:t=>e.jsx(m,{gap:"24",children:h.map(n=>e.jsx(g,{gap:"16",align:"center",children:S.map(u=>e.jsx(r,{...t,variant:n,size:u,children:n},u))},n))}),args:{leftSection:e.jsx(o,{}),rightSection:e.jsx(a,{})}};var f,x,j,v,y;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />
  }
}`,...(j=(x=s.parameters)==null?void 0:x.docs)==null?void 0:j.source},description:{story:"Every prop wired to a control. Start here to try a combination.",...(y=(v=s.parameters)==null?void 0:v.docs)==null?void 0:y.description}}};var B,I,w,R,k;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: args => <Group gap="16">
      {VARIANTS.map(variant => <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>)}
    </Group>,
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />
  }
}`,...(w=(I=i.parameters)==null?void 0:I.docs)==null?void 0:w.source},description:{story:"The four appearances. `filled`, `rounded` and `neutral` are gradient fills; `outline` is the\nglass treatment — a translucent sheen over a blurred backdrop, so it takes on whatever sits\nbehind it.",...(k=(R=i.parameters)==null?void 0:R.docs)==null?void 0:k.description}}};var C,A,L,b,z;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: args => <Group gap="16" align="center">
      {SIZES.map(size => <Button key={size} {...args} size={size}>
          {SIZE_LABELS[size]}
        </Button>)}
    </Group>,
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />
  }
}`,...(L=(A=c.parameters)==null?void 0:A.docs)==null?void 0:L.source},description:{story:"Large, Medium and Small. Height, padding, gap, label size and corner radius all change.",...(z=(b=c.parameters)==null?void 0:b.docs)==null?void 0:z.description}}};var M,E,N,F,G;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => <Group gap="16">
      <Button {...args} leftSection={<IconRefresh />}>
        Left
      </Button>
      <Button {...args} rightSection={<IconArrowRight />}>
        Right
      </Button>
      <Button {...args} leftSection={<IconRefresh />} rightSection={<IconArrowRight />}>
        Both
      </Button>
      <Button {...args}>None</Button>
    </Group>
}`,...(N=(E=d.parameters)==null?void 0:E.docs)==null?void 0:N.source},description:{story:"Figma's Icon axis: a leading icon, a trailing icon, both, or neither.",...(G=(F=d.parameters)==null?void 0:F.docs)==null?void 0:G.description}}};var P,T,_,V,D;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => <Stack gap="24">
      {VARIANTS.map(variant => <Stack key={variant} gap="8">
          <Text fz="sm" c="var(--sds-surfaces-text-tertiary)" tt="uppercase" fw={600}>
            {variant}
          </Text>
          <Group gap="16">
            <Button {...args} variant={variant}>
              Interactive
            </Button>
            <Button {...args} variant={variant} disabled>
              Disabled
            </Button>
          </Group>
        </Stack>)}
    </Stack>,
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />
  }
}`,...(_=(T=l.parameters)==null?void 0:T.docs)==null?void 0:_.source},description:{story:`Hover, focus and pressed are real CSS states — hover and click these to see them, or tab to one
for the focus ring. Only Disabled is a prop, and Figma draws it as the default fill at 50%
opacity.`,...(D=(V=l.parameters)==null?void 0:V.docs)==null?void 0:D.description}}};var Z,H,O,W,$;p.parameters={...p.parameters,docs:{...(Z=p.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: args => <Stack gap="24">
      {VARIANTS.map(variant => <Group key={variant} gap="16" align="center">
          {SIZES.map(size => <Button key={size} {...args} variant={variant} size={size}>
              {variant}
            </Button>)}
        </Group>)}
    </Stack>,
  args: {
    leftSection: <IconRefresh />,
    rightSection: <IconArrowRight />
  }
}`,...(O=(H=p.parameters)==null?void 0:H.docs)==null?void 0:O.source},description:{story:"Every variant against every size — the grid to scan when checking a change against Figma.",...($=(W=p.parameters)==null?void 0:W.docs)==null?void 0:$.description}}};const te=["Playground","Variants","Sizes","Icons","States","Matrix"];export{d as Icons,p as Matrix,s as Playground,c as Sizes,l as States,i as Variants,te as __namedExportsOrder,ee as default};
