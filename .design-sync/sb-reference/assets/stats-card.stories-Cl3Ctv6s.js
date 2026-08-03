import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{n,t as r}from"./utils-BRc6IKo5.js";import{n as i,s as a,t as o}from"./card-DZWtIy6V.js";import{r as s,t as c}from"./lucide-react-Dz2qR01Q.js";function l({label:e,value:t,helper:n,icon:a,highlight:s=!1,valueClassName:c}){return(0,u.jsx)(o,{className:r(s&&`border-primary/20 bg-primary/5`),children:(0,u.jsxs)(i,{className:`flex flex-col gap-2 p-4`,children:[(0,u.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,u.jsx)(`p`,{className:r(`text-sm font-medium`,s?`text-primary/90`:`text-text-3`),children:e}),a?(0,u.jsx)(a,{className:r(`size-3.5 shrink-0`,s?`text-primary/40`:`text-text-3/40`)}):null]}),(0,u.jsx)(`p`,{className:r(`font-display text-4xl font-semibold tabular-nums tracking-tight`,c??`text-text`),children:t}),n?(0,u.jsx)(`p`,{className:`font-label text-xs tracking-wide text-text-3`,children:n}):null]})})}var u,d=e((()=>{u=t(),a(),n(),l.__docgenInfo={description:``,methods:[],displayName:`StatsCard`,props:{label:{required:!0,tsType:{name:`string`},description:``},value:{required:!0,tsType:{name:`ReactNode`},description:``},helper:{required:!1,tsType:{name:`string`},description:``},icon:{required:!1,tsType:{name:`LucideIcon`},description:``},highlight:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},valueClassName:{required:!1,tsType:{name:`string`},description:``}}}})),f,p,m,h,g,_,v;e((()=>{c(),d(),f={title:`Design/StatsCard`,component:l,args:{label:`Applications this month`,value:18,helper:`Created since March 1`}},p={},m={args:{label:`Total Applications`,value:24,helper:`↑ 4 this week`,highlight:!0}},h={args:{label:`Interviews`,value:6,valueClassName:`text-primary`}},g={args:{label:`Offers`,value:1,icon:s}},_={args:{label:`Total Applications`,value:24,helper:`↑ 4 this week`,highlight:!0,icon:s}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Total Applications",
    value: 24,
    helper: "↑ 4 this week",
    highlight: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Interviews",
    value: 6,
    valueClassName: "text-primary"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Offers",
    value: 1,
    icon: Trophy
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Total Applications",
    value: 24,
    helper: "↑ 4 this week",
    highlight: true,
    icon: Trophy
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`Highlighted`,`WithColoredValue`,`WithIcon`,`HighlightedWithIcon`]}))();export{p as Default,m as Highlighted,_ as HighlightedWithIcon,h as WithColoredValue,g as WithIcon,v as __namedExportsOrder,f as default};