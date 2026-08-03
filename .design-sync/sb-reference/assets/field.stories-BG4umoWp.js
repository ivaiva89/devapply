import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{n,t as r}from"./input-BYPrqvFJ.js";import{i,n as a,t as o}from"./field-A33W4j1U.js";var s,c,l,u,d,f,p;e((()=>{s=t(),i(),n(),c={title:`UI/Field`,component:o,parameters:{layout:`padded`},args:{htmlFor:`storybook-field`,label:`Company`,children:(0,s.jsx)(r,{id:`storybook-field`,placeholder:`Linear`,defaultValue:`Linear`})}},l={},u={args:{description:`Optional helper text shown below the field.`}},d={args:{error:`This field is required.`}},f={render:()=>(0,s.jsxs)(`div`,{className:`max-w-md space-y-4`,children:[(0,s.jsx)(o,{htmlFor:`storybook-email`,label:`Email`,error:`Enter a valid email address.`,children:(0,s.jsx)(r,{id:`storybook-email`,defaultValue:`invalid-email`})}),(0,s.jsx)(a,{children:`The form could not be submitted. Review the highlighted fields.`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    description: "Optional helper text shown below the field."
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    error: "This field is required."
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="max-w-md space-y-4">
      <FieldShell htmlFor="storybook-email" label="Email" error="Enter a valid email address.">
        <Input id="storybook-email" defaultValue="invalid-email" />
      </FieldShell>
      <FormErrorMessage>
        The form could not be submitted. Review the highlighted fields.
      </FormErrorMessage>
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`WithDescription`,`WithError`,`FormLevelError`]}))();export{l as Default,f as FormLevelError,u as WithDescription,d as WithError,p as __namedExportsOrder,c as default};