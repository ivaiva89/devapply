# Storybook and Preview Plan

## Purpose

Keep reusable UI and major presentational feature components reviewable
without auth, database, or server actions.

Use:

- `stories/` for isolated component states
- `app/(v0)/preview/page.tsx` for in-app screen composition with shared
  mock data
- `lib/mocks/ui-fixtures.ts` as the shared fixture source

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
- `features/applications/components/application-card.tsx`
- `features/applications/components/application-kanban-column.tsx`
- `features/applications/components/applications-empty-state.tsx`
- `features/applications/components/applications-table.tsx`
- `features/applications/components/pipeline-empty-state.tsx`
- `features/billing/components/upgrade-prompt.tsx`
- `features/reminders/components/reminders-empty-state.tsx`
- `features/resumes/components/resumes-empty-state.tsx`

Story-safe refactor still needed:

- `features/applications/components/pipeline-board.tsx`
- navigation components that depend on Clerk session state

## Preview route coverage

The preview route should keep static showcase coverage for:

- dashboard analytics and list sections
- dashboard empty, loading, and error states
- applications table states
- pipeline composition
- reminders and resumes screen composition
- billing and upgrade states

Rules:

- preview data must come from `lib/mocks/ui-fixtures.ts`
- no server actions, Prisma, Clerk, or authenticated data loading
- when a reusable screen section changes materially, update Storybook
  and `/preview` in the same task
