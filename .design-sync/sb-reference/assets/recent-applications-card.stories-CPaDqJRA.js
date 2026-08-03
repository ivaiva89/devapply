import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{n,t as r}from"./empty-state-B99ycmWL.js";import{a as i,n as a,s as o,t as s}from"./card-DZWtIy6V.js";import{n as c,t as l}from"./application-status-badge-C1teYGSu.js";import{mockRecentApplications as u}from"@/shared/mocks/ui-fixtures";function d(e){return new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`}).format(new Date(e))}function f({items:e}){return(0,p.jsxs)(s,{children:[(0,p.jsxs)(i,{className:`pb-3 sm:pb-4`,children:[(0,p.jsx)(`p`,{className:`font-display text-lg font-semibold tracking-tight text-text`,children:`Recent Applications`}),(0,p.jsx)(`p`,{className:`text-sm text-text-3`,children:`Latest tracked roles.`})]}),(0,p.jsx)(a,{className:`pt-0`,children:e.length>0?(0,p.jsx)(`div`,{className:`flex flex-col gap-1`,children:e.map(e=>(0,p.jsxs)(`div`,{className:`group -mx-2 flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-1/40 sm:flex-row sm:items-center sm:justify-between sm:gap-3`,children:[(0,p.jsxs)(`div`,{className:`min-w-0`,children:[(0,p.jsx)(`p`,{className:`truncate text-sm font-medium text-text`,children:e.company}),(0,p.jsx)(`p`,{className:`truncate text-xs text-text-3`,children:e.role})]}),(0,p.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 text-left sm:ml-4 sm:shrink-0 sm:justify-end sm:gap-3 sm:text-right`,children:[(0,p.jsx)(`span`,{className:`font-label text-xs tabular-nums text-text-3`,children:d(e.updatedAt)}),(0,p.jsx)(l,{status:e.status})]})]},e.id))}):(0,p.jsx)(r,{compact:!0,title:`No recent applications`,description:`Applications will appear here once you start tracking roles.`})})]})}var p,m=e((()=>{p=t(),c(),n(),o(),f.__docgenInfo={description:``,methods:[],displayName:`RecentApplicationsCard`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  company: string;
  role: string;
  status: Parameters<typeof ApplicationStatusBadge>[0]["status"];
  updatedAt: string;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`company`,value:{name:`string`,required:!0}},{key:`role`,value:{name:`string`,required:!0}},{key:`status`,value:{name:`Parameters[0]["status"]`,raw:`Parameters<typeof ApplicationStatusBadge>[0]["status"]`,required:!0}},{key:`updatedAt`,value:{name:`string`,required:!0}}]}}],raw:`Array<{
  id: string;
  company: string;
  role: string;
  status: Parameters<typeof ApplicationStatusBadge>[0]["status"];
  updatedAt: string;
}>`},description:``}}}})),h,g,_,v;e((()=>{m(),h={title:`Features/Dashboard/RecentApplicationsCard`,component:f,args:{items:u}},g={},_={args:{items:[]}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`Empty`]}))();export{g as Default,_ as Empty,v as __namedExportsOrder,h as default};