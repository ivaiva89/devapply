# Storybook and Preview Plan

## Purpose

Keep reusable UI and major presentational feature components reviewable
without auth, database, or server actions.

Use:

- `stories/` for isolated component states
- `app/(v0)/preview/page.tsx` for in-app screen composition with shared
  mock data
- `shared/mocks/ui-fixtures.ts` as the shared fixture source

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
- presenters may live beside wrappers in `features/*/components/` or in
  canonical `widgets/*/ui` and `entities/*/ui` locations, depending on
  whether the surface is feature-local or broadly reusable
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

- `shared/ui/button.tsx`
- `shared/ui/badge.tsx`
- `shared/ui/card.tsx`
- `shared/ui/field.tsx`
- `shared/ui/input.tsx`
- `shared/ui/select.tsx`
- `shared/ui/table.tsx`
- `shared/ui/tabs.tsx`
- `shared/ui/tooltip.tsx`
- `shared/design/data-table.tsx`
- `shared/design/empty-state.tsx`
- `shared/design/section-header.tsx`
- `shared/design/stats-card.tsx`
- `shared/design/status-badge.tsx`

Follow-up refactor needed before Storybook coverage:

- none for the current shared primitive set

## Major presentational feature components

Covered now:

- `widgets/dashboard/ui/dashboard-header.tsx`
- `widgets/dashboard/ui/dashboard-loading-state.tsx`
- `widgets/dashboard/ui/dashboard-error-state.tsx`
- `widgets/app-shell/ui/app-header-presenter.tsx`
- `widgets/app-shell/ui/app-sidebar-presenter.tsx`
- `widgets/dashboard/ui/stats-grid.tsx`
- `widgets/dashboard/ui/dashboard-empty-state.tsx`
- `widgets/dashboard/ui/pipeline-overview-card.tsx`
- `widgets/dashboard/ui/applications-over-time-chart-section.tsx`
- `widgets/dashboard/ui/conversion-summary-section.tsx`
- `widgets/dashboard/ui/recent-applications-card.tsx`
- `widgets/dashboard/ui/upcoming-reminders-card.tsx`
- `widgets/reminders-panel/ui/reminders-list-presenter.tsx`
- `features/reminders/components/create-reminder-form-presenter.tsx`
- `widgets/resumes-panel/ui/resume-list-presenter.tsx`
- `features/resumes/components/upload-resume-form-presenter.tsx`
- `features/resumes/components/attach-resume-form-presenter.tsx`
- `widgets/settings-billing/ui/plan-summary-presenter.tsx`
- `features/billing/components/billing-action-button-presenter.tsx`
- `entities/application/ui/application-status-badge.tsx`
- `features/applications/components/applications-filters-presenter.tsx`
- `features/applications/components/application-form-modal-presenter.tsx`
- `features/applications/components/application-delete-dialog-presenter.tsx`
- `features/applications/components/new-application-trigger.tsx`
- `entities/application/ui/application-row-actions-menu.tsx`
- `entities/application/ui/application-card.tsx`
- `widgets/pipeline-board/ui/application-kanban-column.tsx`
- `features/applications/components/applications-empty-state.tsx`
- `widgets/applications-table/ui/applications-table.tsx`
- `widgets/pipeline-board/ui/pipeline-board-presenter.tsx`
- `features/applications/components/pipeline-empty-state.tsx`
- `features/billing/components/upgrade-prompt.tsx`
- `widgets/reminders-panel/ui/reminders-empty-state.tsx`
- `widgets/resumes-panel/ui/resumes-empty-state.tsx`

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

- preview data must come from `shared/mocks/ui-fixtures.ts`
- no server actions, Prisma, Clerk, or authenticated data loading
- ESLint enforces restricted imports in `stories/`,
  `app/(v0)/preview`, and `shared/mocks`
- when a reusable screen section changes materially, update Storybook
  and `/preview` in the same task
