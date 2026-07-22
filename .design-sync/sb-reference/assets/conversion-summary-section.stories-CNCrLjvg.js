import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{n,t as r}from"./empty-state-B99ycmWL.js";import{a as i,n as a,s as o,t as s}from"./card-DZWtIy6V.js";import{mockDashboardConversions as c}from"@/shared/mocks/ui-fixtures";function l({items:e,isEmpty:t}){return(0,u.jsxs)(s,{children:[(0,u.jsxs)(i,{className:`pb-6`,children:[(0,u.jsx)(`p`,{className:`font-display text-lg font-semibold tracking-tight text-text`,children:`Funnel Snapshot`}),(0,u.jsx)(`p`,{className:`text-sm text-text-3`,children:`Response, interview, and offer conversion rates.`})]}),(0,u.jsx)(a,{className:`pt-4`,children:t?(0,u.jsx)(r,{compact:!0,title:`No conversion data yet`,description:`Once applications move through the pipeline, the dashboard will summarize response, interview, and offer rates here.`}):(0,u.jsx)(`div`,{className:`grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8`,children:e.map(e=>(0,u.jsxs)(`div`,{className:`flex flex-col gap-1 rounded-xl bg-surface-1/20 px-4 py-4`,children:[(0,u.jsx)(`p`,{className:`text-sm text-text-3`,children:e.label}),(0,u.jsx)(`p`,{className:`font-display text-3xl font-semibold tabular-nums tracking-tight text-text`,children:e.value}),(0,u.jsx)(`p`,{className:`font-label text-xs text-text-3`,children:e.helper})]},e.label))})})]})}var u,d=e((()=>{u=t(),n(),o(),l.__docgenInfo={description:``,methods:[],displayName:`ConversionSummarySection`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  label: string;
  value: string;
  helper: string;
}`,signature:{properties:[{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`string`,required:!0}},{key:`helper`,value:{name:`string`,required:!0}}]}}],raw:`Array<{
  label: string;
  value: string;
  helper: string;
}>`},description:``},isEmpty:{required:!0,tsType:{name:`boolean`},description:``}}}})),f,p,m,h;e((()=>{d(),f={title:`Features/ConversionSummarySection`,component:l,args:{items:c,isEmpty:!1}},p={},m={args:{items:[],isEmpty:!0}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    items: [],
    isEmpty: true
  }
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Empty`]}))();export{p as Default,m as Empty,h as __namedExportsOrder,f as default};