# Launch Checklist

Checked items below are reconciled against the current repository state.
Unchecked items still require live-environment verification, production
setup, or missing implementation work.

## Product

- [ ] Application CRUD works end-to-end
- [ ] Pipeline view works correctly
- [ ] Dashboard shows useful metrics
- [ ] Resume upload works
- [x] Reminders creation/edit/delete works
- [ ] Free vs Pro feature gating works

## Reliability

- [x] Empty states handled
- [x] Loading states handled
- [x] Error states handled
- [x] Form validation verified
- [x] Auth checks verified
- [x] Ownership checks verified
- [x] Plan limit checks verified

## Billing

- [ ] Polar hosted checkout works
- [ ] Checkout success updates entitlements via webhook sync
- [ ] Subscription status sync works
- [ ] Cancel / downgrade behavior verified
- [ ] Billing webhook handling verified
- [ ] Sandbox and production billing configs verified separately

Local verification reference:

- `docs/polar-sandbox-setup.md`

## Uploads

- [x] Resume file types restricted
- [x] File size limits enforced
- [x] Upload failures handled
- [x] Uploaded files scoped to correct user
- [x] Cross-user access impossible

## Analytics

- [x] Signup tracked
- [ ] First application created tracked
- [x] Application created tracked
- [x] Reminder created tracked
- [x] Upgrade click tracked
- [x] Checkout started tracked
- [ ] Checkout success tracked

## UX

- [ ] Mobile layout verified
- [ ] Forms usable on smaller screens
- [ ] Clear navigation for first-time users
- [x] Confirmation for destructive actions

## Marketing

- [ ] Landing page ready
- [ ] Pricing page ready
- [ ] Product copy written
- [ ] Demo screenshots ready
- [ ] Launch post drafted
- [ ] LinkedIn post drafted
- [ ] Reddit launch draft ready

## Production Readiness

- [ ] Production env vars configured
- [x] Vercel project uses `npm run build:vercel`
- [ ] Vercel Blob token configured
- [ ] Database migrations applied
- [ ] Prisma runtime and migration env vars verified on Vercel (`DATABASE_URL`, `DIRECT_URL`, `SHADOW_DATABASE_URL`)
- [ ] Polar webhook configured
- [ ] Resend sending verified
- [ ] PostHog production project configured
- [x] Production build succeeds without blocked external network dependencies

## Trust

- [ ] Privacy policy available
- [ ] Terms of service available
- [ ] Support/contact email visible

## Post-launch

- [ ] Collect user feedback
- [ ] Review onboarding drop-off
- [ ] Review most-used features
- [ ] Review upgrade funnel
