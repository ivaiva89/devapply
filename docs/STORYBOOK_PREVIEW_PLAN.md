# Storybook and Preview Plan

## Purpose

Keep reusable UI and major presentational feature components reviewable
without auth, database, or server actions.

Use:

- `stories/` for isolated component states
- `app/(v0)/preview/page.tsx` for in-app screen composition with shared
  mock data
- `lib/mocks/ui-fixtures.ts` as the shared fixture source

## When to use which

Use Storybook for:

- isolated reusable components
- multiple visual states of the same component
- presenter-level feature UI that should be reviewed by props alone

Use `/preview` for:

- full-screen or multi-section composition
- app-shell context, spacing, and density checks
- mock screens that need several Storybook-covered pieces working
  together

Update both when:

- a reusable component also appears in a previewed screen
- a presenter changes enough to affect both isolated and composed review
- a new mock screen section introduces reusable UI that needs isolated
  state coverage

## Presenter vs wrapper rule

For feature UI that needs Storybook or `/preview` coverage:

- presenters render the visual surface and stay backend-agnostic
- wrappers handle auth, server actions, mutations, refresh logic, and
  provider/session wiring
- presenters live beside wrappers in `features/*/components/`
- preview and Storybook should import presenters or already-pure
  presentational components, not wrappers that depend on backend state

Use a presenter split when a component would otherwise import:

- feature `server/` modules
- Clerk or auth helpers
- Prisma helpers
- storage or billing integrations

Keep wrappers thin:

- map real data into presenter props
- call mutations
- handle optimistic UI or refresh behavior
- avoid adding extra visual logic when the presenter can own it

## Reusable UI components

Covered now:

- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/table.tsx`
- `components/ui/tabs.tsx`
- `components/ui/tooltip.tsx`
- `components/design/data-table.tsx`
- `components/design/empty-state.tsx`
- `components/design/section-header.tsx`
- `components/design/stats-card.tsx`
- `components/design/status-badge.tsx`

Follow-up refactor needed before Storybook coverage:

- `components/ui/dialog.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/sonner.tsx`

## Major presentational feature components

Covered now:

- `features/dashboard/components/dashboard-header.tsx`
- `features/dashboard/components/dashboard-loading-state.tsx`
- `features/dashboard/components/dashboard-error-state.tsx`
- `features/navigation/components/app-header-presenter.tsx`
- `features/navigation/components/app-sidebar-presenter.tsx`
- `features/dashboard/components/stats-grid.tsx`
- `features/dashboard/components/dashboard-empty-state.tsx`
- `features/dashboard/components/pipeline-overview-card.tsx`
- `features/dashboard/components/applications-over-time-chart-section.tsx`
- `features/dashboard/components/conversion-summary-section.tsx`
- `features/dashboard/components/recent-applications-card.tsx`
- `features/dashboard/components/upcoming-reminders-card.tsx`
- `features/reminders/components/reminders-list-presenter.tsx`
- `features/reminders/components/create-reminder-form-presenter.tsx`
- `features/resumes/components/resume-list-presenter.tsx`
- `features/resumes/components/upload-resume-form-presenter.tsx`
- `features/resumes/components/attach-resume-form-presenter.tsx`
- `features/billing/components/plan-summary-presenter.tsx`
- `features/billing/components/billing-action-button-presenter.tsx`
- `features/applications/components/application-status-badge.tsx`
- `features/applications/components/applications-filters-presenter.tsx`
- `features/applications/components/application-form-modal-presenter.tsx`
- `features/applications/components/application-delete-dialog-presenter.tsx`
- `features/applications/components/new-application-trigger.tsx`
- `features/applications/components/application-row-actions-menu.tsx`
- `features/applications/components/application-card.tsx`
- `features/applications/components/application-kanban-column.tsx`
- `features/applications/components/applications-empty-state.tsx`
- `features/applications/components/applications-table.tsx`
- `features/applications/components/pipeline-board-presenter.tsx`
- `features/applications/components/pipeline-empty-state.tsx`
- `features/billing/components/upgrade-prompt.tsx`
- `features/reminders/components/reminders-empty-state.tsx`
- `features/resumes/components/resumes-empty-state.tsx`

Story-safe refactor still needed:

- none for the current app shell and feature surface

## Preview route coverage

The preview route should keep static showcase coverage for:

- dashboard analytics and list sections
- authenticated app shell chrome
- dashboard empty, loading, and error states
- applications table states
- pipeline composition and row actions
- reminders and resumes screen composition
- billing and upgrade states

Rules:

- preview data must come from `lib/mocks/ui-fixtures.ts`
- no server actions, Prisma, Clerk, or authenticated data loading
- ESLint enforces restricted imports in `stories/`,
  `app/(v0)/preview`, and `lib/mocks`
- when a reusable screen section changes materially, update Storybook
  and `/preview` in the same task
