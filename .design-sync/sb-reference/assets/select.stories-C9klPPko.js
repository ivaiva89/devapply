import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{a as n,i as r,l as i,n as a,o,r as s,s as c,t as l}from"./select-CUOJFKj6.js";var u,d,f,p,m,h,g,_;e((()=>{u=t(),i(),o(),d=[{value:`wishlist`,label:`Wishlist`},{value:`applied`,label:`Applied`},{value:`interview`,label:`Interview`},{value:`offer`,label:`Offer`}],f={title:`UI/Select`,component:l,parameters:{layout:`padded`},render:e=>(0,u.jsx)(`div`,{className:`w-72`,children:(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(r,{children:(0,u.jsx)(n,{placeholder:`Choose a status`})}),(0,u.jsx)(a,{children:d.map(e=>(0,u.jsx)(s,{value:e.value,children:e.label},e.value))})]})}),args:{items:d}},p={},m={args:{defaultValue:`interview`}},h={args:{disabled:!0,defaultValue:`applied`}},g={render:e=>(0,u.jsx)(`div`,{className:`w-56`,children:(0,u.jsxs)(l,{...e,children:[(0,u.jsx)(r,{className:c,children:(0,u.jsx)(n,{placeholder:`Choose a status`})}),(0,u.jsx)(a,{children:d.map(e=>(0,u.jsx)(s,{value:e.value,children:e.label},e.value))})]})})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "interview"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "applied"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="w-56">
      <Select {...args}>
        <SelectTrigger className={compactControlClassName}>
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>)}
        </SelectContent>
      </Select>
    </div>
}`,...g.parameters?.docs?.source}}},_=[`Default`,`WithValue`,`Disabled`,`Compact`]}))();export{g as Compact,p as Default,h as Disabled,m as WithValue,_ as __namedExportsOrder,f as default};