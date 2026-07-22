import{n as e}from"./chunk-vNrZSFDR.js";import{_ as t}from"./iframe-DtGyfQJJ.js";import{n,t as r}from"./empty-state-B99ycmWL.js";import{a as i,n as a,s as o,t as s}from"./card-DZWtIy6V.js";import{n as c,t as l}from"./badge-BaGIKsQf.js";import{mockUpcomingReminders as u}from"@/shared/mocks/ui-fixtures";function d(e){return new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`}).format(new Date(e))}function f(e){return new Date(e).getTime()<Date.now()}function p({items:e}){return(0,m.jsxs)(s,{children:[(0,m.jsxs)(i,{className:`pb-3 sm:pb-4`,children:[(0,m.jsx)(`p`,{className:`font-display text-lg font-semibold tracking-tight text-text`,children:`Upcoming Reminders`}),(0,m.jsx)(`p`,{className:`text-sm text-text-3`,children:`Scheduled follow-ups.`})]}),(0,m.jsx)(a,{className:`pt-0`,children:e.length>0?(0,m.jsx)(`div`,{className:`flex flex-col gap-1`,children:e.map(e=>{let t=f(e.dueAt);return(0,m.jsxs)(`div`,{className:`group -mx-2 flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-1/40 sm:flex-row sm:items-center sm:justify-between sm:gap-3`,children:[(0,m.jsxs)(`div`,{className:`min-w-0`,children:[(0,m.jsx)(`p`,{className:`truncate text-sm font-medium text-text`,children:e.title}),(0,m.jsx)(`p`,{className:`truncate text-xs text-text-3`,children:e.company??`General reminder`})]}),(0,m.jsx)(l,{variant:t?`destructive`:`outline`,className:`w-fit font-label tabular-nums sm:ml-4 sm:shrink-0`,children:t?`Overdue`:d(e.dueAt)})]},e.id)})}):(0,m.jsx)(r,{compact:!0,title:`No reminders scheduled`,description:`Upcoming reminders will appear here once follow-ups are created.`})})]})}var m,h=e((()=>{m=t(),n(),c(),o(),p.__docgenInfo={description:``,methods:[],displayName:`UpcomingRemindersCard`,props:{items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string;
  title: string;
  dueAt: string;
  company: string | null;
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`title`,value:{name:`string`,required:!0}},{key:`dueAt`,value:{name:`string`,required:!0}},{key:`company`,value:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}],required:!0}}]}}],raw:`Array<{
  id: string;
  title: string;
  dueAt: string;
  company: string | null;
}>`},description:``}}}})),g,_,v,y;e((()=>{h(),g={title:`Features/Dashboard/UpcomingRemindersCard`,component:p,args:{items:u}},_={},v={args:{items:[]}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...v.parameters?.docs?.source}}},y=[`Default`,`Empty`]}))();export{_ as Default,v as Empty,y as __namedExportsOrder,g as default};