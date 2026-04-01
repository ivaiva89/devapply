# DevApply — Pre-Launch Audit

Completed: 2026-03-30
Status: Pre-launch review across all feature areas.

---

## How to read this

P0 = launch blocker or causes data/money loss
P1 = significant UX gap that hurts conversion or retention
P2 = polish, reliability, correctness
P3 = nice to have

---

## Billing & Webhooks

### [P0] Subscription cancellation doesn't downgrade users

**File:** `app/api/webhooks/polar/route.ts` line 47
`onSubscriptionCanceled` calls `syncBillingLinkageFromPayload()` which does NOT change the plan.
`onSubscriptionRevoked` (line 54) correctly calls `syncUserPlanFromBillingPayload(..., "FREE")`.
**Fix:** Add `syncUserPlanFromBillingPayload(payload, "FREE")` call in `onSubscriptionCanceled`.

### [P0] Checkout ignores user input

**File:** `features/billing/server/provider.ts` line 31
`void input;` — the `HostedCheckoutInput` parameter is explicitly discarded. Customer email and metadata are never passed to Polar.
**Fix:** Pass `input` into `getPolarCheckoutSearchParams()`.

### [P1] Webhook silent failures hide billing sync errors

**File:** `features/billing/server/subscription-sync.ts` lines 189, 204
When `userId` is missing or user doesn't exist, the function logs a warning and returns silently. A user can complete checkout and never get PRO access.
**Fix:** Integrate error tracking (e.g. console.error or a monitoring hook) and ensure the webhook returns a non-2xx to trigger Polar retry.

### [P2] `onSubscriptionCanceled` vs `onSubscriptionRevoked` inconsistency

Both events should downgrade the user. Currently only `onSubscriptionRevoked` does.

### [P2] Polar environment silently falls back to sandbox

**File:** `features/billing/server/provider-config.ts` lines 25–28
Invalid `POLAR_ENVIRONMENT` value silently defaults to sandbox. Should warn/throw if the value is invalid.

### [P2] Billing API routes use `getCurrentUser()` instead of `requireCurrentUser()`

**Files:** `app/api/billing/checkout/route.ts` line 13, `app/api/billing/portal/route.ts` line 10
These are protected routes. Should use `requireCurrentUser()` for consistency and to avoid null handling bugs.

### [P2] Race condition in resume upload plan gate check

**File:** `features/resumes/server/upload-resume.ts` lines 95–102
Plan gate is checked then resume is created in a separate step. Concurrent uploads from the same account could exceed the free plan limit.

---

## Applications

### [P0] `lastActivityAt` never fetched or set

**File:** `features/applications/server/application-service.ts`
The `applicationListSelect` query does not include `lastActivityAt`. The table renders it using `updatedAt` instead.
Additionally, none of the mutation actions (create, update, status change) explicitly set `lastActivityAt`.
**Fix:**

1. Add `lastActivityAt: true` to `applicationListSelect`.
2. Add `lastActivityAt: new Date()` in `createApplication`, `updateApplication`, and `updateApplicationStatus` service calls.
3. Add `lastActivityAt` to `ApplicationListItem` type.

### [P1] No analytics charts (Milestone 9 = 0% built)

**File:** `TASKS.md` Milestone 9
Dashboard promises funnel metrics (response rate, interview rate, offer rate). No chart components exist.
**Items missing:** Applications per status chart, applications over time, conversion funnel.

### [P1] No pagination on applications list

**File:** `features/applications/server/application-service.ts` lines 114–137
All matching applications are fetched at once. With hundreds of applications this will cause slow page loads.

### [P2] Pipeline drag-and-drop doesn't revert on server error

**File:** `features/applications/components/pipeline-board.tsx` lines 83–90
If the server action fails, the error is shown but the UI is not reverted. User sees inconsistent state until refresh.

### [P2] Search only covers company and role

**File:** `features/applications/server/application-service.ts` lines 89–94
Can't search by location or notes.

### [P2] Salary validation: no cross-field check for zero values

Both salary min and max can be 0 with no warning. The min <= max check exists but doesn't catch the 0/0 case meaningfully.

### [P3] Pipeline cards don't show location

**File:** `features/applications/server/application-service.ts` lines 36–44
`pipelineApplicationSelect` omits location. Cards can't show remote/on-site context.

### [P3] No bulk operations

Each application must be edited/deleted individually. No bulk status change or bulk delete.

### [P3] Limited sort options

Can't sort by status, salary, or company name alphabetically.

---

## Dashboard

### [P2] `isEmpty` logic bug

**File:** `features/dashboard/server/dashboard-data.ts` lines 289–293
Condition includes `now instanceof Date` which is always `true`. Dead code with no effect, but semantically wrong.
**Fix:** Remove `now instanceof Date` from the isEmpty check.

### [P2] Overdue reminders not highlighted in dashboard card

**File:** `features/dashboard/components/upcoming-reminders-card.tsx`
The reminders list page marks overdue reminders visually. The dashboard card does not.

### [P3] Dashboard shows "Interviews" KPI based on application status, not Interview records

The Interview model exists in the DB but is never queried. Dashboard shows applications at INTERVIEW status as a proxy.

---

## Reminders

### [P1] Reminder `notes` field never shown

**Files:** `features/reminders/components/reminder-form-fields.tsx`, `features/reminders/server/reminder-list.ts`
The `notes` field exists in the Prisma schema but:

- The form has no notes input
- The list query doesn't select notes
- The edit dialog has no notes field
  **Fix:** Add notes field to form, select query, and edit dialog.

### [P2] `completeReminder` doesn't track analytics event

**File:** `features/reminders/server/complete-reminder.ts`
Unlike `createReminder`, completion is not tracked. Missing usage data.

### [P2] No way to reopen a completed reminder

Once marked done, a reminder cannot be uncompleted. Users who accidentally complete a reminder must recreate it.

---

## Interviews

### [P1] Interview model has no UI at all

**File:** `prisma/schema.prisma` lines 121–144
The Interview model is fully defined with type, result, dates, and notes. There is no page, form, component, or server action to create or view interviews.
This is a P1 for post-launch (it's out of MVP scope per ROADMAP.md) but should be documented as a known gap.

---

## Resumes

### [P2] Blob fetch in download route has no error handling

**File:** `app/api/resumes/[resumeId]/route.ts` lines 43–46
`get()` from `@vercel/blob` is not wrapped in try-catch. If blob storage fails, returns 404 without logging.

---

## Email

### [P1] Resend not integrated — no transactional email

No email capability exists anywhere in the project:

- No welcome email on signup
- No billing receipt on upgrade
- No plan downgrade notification
- No reminder due date notification (would be high-value)

Minimum for launch: welcome email and billing confirmation.

---

## Analytics

### [P3] Missing analytics events

**File:** `features/analytics/events.ts`
Not tracked: `application_deleted`, `reminder_deleted`, `resume_deleted`, `checkout_cancelled`, `checkout_failed`, `plan_downgrade`.

---

## Production Readiness

### [P0] Production env vars not configured

Per `docs/launch-checklist.md`: Vercel Blob token, Polar webhook, Polar product IDs, Resend key, PostHog production project — all unconfigured.

### [P1] Mobile layout not verified

Per `docs/launch-checklist.md`. Many first-time visitors from Reddit/LinkedIn will land on mobile.

### [P1] Billing end-to-end not verified

Polar checkout → webhook → entitlement sync has not been tested. See `docs/polar-sandbox-setup.md`.

### [P2] Demo screenshots not ready

Landing page hero uses static fake data. Real product screenshots would increase conversion.

---

## Prioritized Fix Order

### Before any code work

1. Fix `onSubscriptionCanceled` missing downgrade (P0)
2. Fix checkout `void input` bug (P0)
3. Fix `lastActivityAt` fetch + set (P0)

### To reach feature-complete MVP

4. Add analytics charts (P1)
5. Add Resend welcome + billing emails (P1)
6. Add `notes` field to reminders (P1)

### Before deploy

7. Configure all production env vars (P0)
8. Verify billing end-to-end in sandbox (P1)
9. Mobile layout pass (P1)
10. Fix `isEmpty` bug in dashboard-data.ts (P2)
11. Fix billing route auth to use `requireCurrentUser()` (P2)
12. Add overdue reminder highlight to dashboard card (P2)
13. Fix pipeline drag-and-drop revert on error (P2)
14. Add blob error handling in resume download route (P2)

### Post-launch

15. Pagination for applications list
16. Location in pipeline cards
17. Bulk operations
18. Expanded sort options
19. Interview UI
