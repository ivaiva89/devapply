# Design System Specification: The Kinetic Workspace

## 1. Overview & Creative North Star

**Creative North Star: The Technical Architect**
This design system moves away from the "static dashboard" and toward a "high-performance IDE." For a developer-focused job tracker, the experience must feel efficient, low-latency, and intentional. We achieve this through **Organic Technicality**: combining a rigid, geometric layout with soft tonal transitions and editorial-grade typography.

The system breaks the "template" look by favoring **Asymmetric Compositions** and **Tonal Depth** over traditional grids. By utilizing significant white space (8-unit scale) and removing structural lines, we create a UI that feels like it’s breathing. We are not building a CRM; we are building a mission control center for a developer's career.

---

## 2. Colors & Surface Philosophy

The palette is rooted in deep, atmospheric blues (`#0b1326`) and punctuated by the "Electric Indigo" (`#c0c1ff`) and "Mint Tech" (`#4edea3`) accents.

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be defined solely through background color shifts or subtle tonal transitions.

- _Bad:_ A sidebar with a `border-right: 1px solid #464555`.
- _Good:_ A `surface-container-low` sidebar resting against a `surface` main content area.

### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:

1.  **Background (`surface`):** The canvas.
2.  **Primary Layout Blocks (`surface-container-low`):** For main content areas.
3.  **Interactive Elements (`surface-container-high`):** For cards or hovered states.
4.  **Prominent Overlays (`surface-container-highest`):** For modals or popovers.

### Glassmorphism & Signature Textures

To achieve a "premium software" feel, use **Backdrop Blurs** (12px–20px) on floating elements like navigation bars or context menus.

- **The Signature Gradient:** For primary CTAs and hero states, use a linear gradient from `primary` (#c0c1ff) to `primary_container` (#4b4dd8) at a 135-degree angle. This provides "visual soul" that flat colors cannot replicate.

---

## 3. Typography

The typography is a dialogue between the human-centric **Manrope**, the functional **Inter**, and the technical **Space Grotesk**.

- **Display & Headlines (Manrope):** High-contrast and authoritative. Used for page titles and major section headers to provide an editorial feel.
- **Body & UI (Inter):** The workhorse. Crisp, legible, and neutral. Used for all application data, descriptions, and inputs.
- **Labels & Accents (Space Grotesk):** Our "Technical Accent." Use this for metadata, status tags, and micro-copy (e.g., "Last updated 2m ago"). It provides that subtle "monospaced" dev-tool aesthetic without sacrificing readability.

---

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering** rather than heavy shadows or lines.

### The Layering Principle

- **Stacking:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
- **Ambient Shadows:** For "floating" elements (Modals, Tooltips), use an extra-diffused shadow:
  - _Values:_ `0px 12px 32px rgba(6, 14, 32, 0.4)`
  - The shadow color is a tinted version of `surface_container_lowest` to ensure it feels like a natural part of the atmosphere.

### The "Ghost Border" Fallback

If a border is required for accessibility (e.g., in a high-density table), use a **Ghost Border**:

- `outline_variant` at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons

- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. No border. `xl` (0.75rem) roundedness.
- **Secondary:** `surface_container_high` background with `primary` text.
- **Tertiary:** Transparent background, `on_surface_variant` text. High-contrast `primary` text on hover.

### Cards & Application Items

- **Constraint:** No divider lines. Use `1.5` (0.375rem) to `4` (1rem) spacing shifts to separate header from body content.
- **Background:** Use `surface_container_low`. On hover, transition to `surface_container_high`.

### Input Fields

- **Surface:** `surface_container_lowest`.
- **State:** On focus, the "Ghost Border" becomes `primary` at 50% opacity with a 2px outer glow of `primary` at 10% opacity.
- **Labels:** Use `label-md` (Space Grotesk) for a technical, form-factor feel.

### Status Chips

- **Applied:** `secondary_container` background with `on_secondary_container` text.
- **Interviewing:** `tertiary_container` background with `on_tertiary_container` (Mint) text.
- **Rejected:** `error_container` background with `on_error_container` text.

### Progress Kanban (Context Specific)

Instead of column borders, use vertical columns of `surface_container_lowest` against the `surface` background. This creates a "track" feel common in high-end project management tools like Linear.

---

## 6. Do's and Don'ts

### Do

- **Do** use `0.75rem` (xl) rounding for large containers and `0.375rem` (md) for small buttons to create a nested visual rhythm.
- **Do** prioritize vertical rhythm. Use the `spacing-8` or `spacing-10` tokens between major sections to let the technical data "breathe."
- **Do** use `tertiary` (Mint) sparingly for success states or "Offer Received" highlights to ensure maximum impact.

### Don't

- **Don't** use pure black `#000000` or pure white `#FFFFFF`. Always stay within the `surface` and `on_surface` tonal range.
- **Don't** use 100% opaque `outline` tokens for structural separation. It creates "visual noise" that fatigues the developer user.
- **Don't** mix the font families within a single line of text. Use Manrope for the "What" (Title) and Inter/Space Grotesk for the "How" (Details).
