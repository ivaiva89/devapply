# TASKS_AUDIT_FOLLOWUPS.md

Follow-up work discovered during the repository audit.

## Product / MVP gaps

## UI / Design system

## Storybook

## Documentation

- Keep `TASKS.md` and `NEXT_TASK.md` synchronized after every implementation pass.

## Infrastructure

- Verify production env vars, Blob token, database migrations, and Polar webhook configuration in the deployed environment.
- Verify Resend and PostHog production configuration in the deployed environment.

## Billing / Analytics

- Investigate why a real sandbox checkout can succeed without producing persisted local billing sync (`billingSyncedAt`, `billingCustomerId`, `billingSubscriptionId`, `billingSubscriptionStatus`) in Neon.
- Verify a real Polar-delivered webhook updates `User.plan` and persisted billing linkage end to end after the checkout flow.
- Verify cancel or downgrade behavior in Polar sandbox and document the exact plan-state outcome in `docs/launch-checklist.md`.

## Trust

## Auth / Billing / Data model

## Technical debt
