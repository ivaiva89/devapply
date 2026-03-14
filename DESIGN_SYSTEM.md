# DevApply Design System

## Philosophy

DevApply UI should feel:

-   clean
-   structured
-   developer-friendly
-   efficient
-   distraction free

Inspired by tools like Linear, Vercel, GitHub, and Notion.

------------------------------------------------------------------------

# Layout Principles

Use consistent spacing and alignment.

Spacing scale:

  Token   Value
  ------- -------
  xs      4px
  sm      8px
  md      16px
  lg      24px
  xl      32px
  2xl     48px

Rules:

-   prefer whitespace over visual clutter
-   align elements to consistent grid
-   avoid nested containers where unnecessary

------------------------------------------------------------------------

# Component Rules

## Buttons

Primary

-   background: brand indigo
-   text: white
-   radius: rounded-xl

Secondary

-   outline button
-   neutral border

Sizes

  Size   Height
  ------ --------
  sm     32px
  md     40px
  lg     48px

------------------------------------------------------------------------

## Cards

Cards are used for:

-   job entries
-   analytics widgets
-   feature panels

Rules:

-   rounded-2xl
-   subtle border
-   light shadow only in light mode

Padding:

-   16--24px

------------------------------------------------------------------------

## Inputs

Inputs should:

-   have clear borders
-   show visible focus ring
-   maintain accessibility contrast

Focus state:

-   ring color: primary indigo

------------------------------------------------------------------------

## Icons

Use Lucide icons.

Guidelines:

-   outline icons
-   consistent stroke width
-   avoid mixing icon styles

------------------------------------------------------------------------

## Tables

Tables are used for:

-   job lists
-   analytics
-   history logs

Rules:

-   zebra rows optional
-   hover state subtle
-   clear column spacing

------------------------------------------------------------------------

# Dashboard Patterns

Common patterns:

-   KPI cards
-   pipeline boards
-   activity timeline
-   compact lists

Use cards to separate sections.

------------------------------------------------------------------------

# Responsiveness

Breakpoints:

  Device    Width
  --------- -------------
  Mobile    \<640px
  Tablet    640--1024px
  Desktop   \>1024px

Rules:

-   stack cards on mobile
-   reduce sidebar width
-   avoid horizontal scroll

------------------------------------------------------------------------

# Visual Effects

Allowed:

-   subtle gradients
-   soft shadows
-   blur backgrounds in hero

Avoid:

-   neon colors
-   excessive animation
-   heavy skeuomorphism
