# Launch Checklist

## Product

-   [ ] Application CRUD works end-to-end
-   [ ] Pipeline view works correctly
-   [ ] Dashboard shows useful metrics
-   [ ] Resume upload works
-   [ ] Reminders creation/edit/delete works
-   [ ] Free vs Pro feature gating works

## Reliability

-   [ ] Empty states handled
-   [ ] Loading states handled
-   [ ] Error states handled
-   [ ] Form validation verified
-   [ ] Auth checks verified
-   [ ] Ownership checks verified
-   [ ] Plan limit checks verified

## Billing

-   [ ] Polar hosted checkout works
-   [ ] Checkout success updates entitlements via webhook sync
-   [ ] Subscription status sync works
-   [ ] Cancel / downgrade behavior verified
-   [ ] Billing webhook handling verified
-   [ ] Sandbox and production billing configs verified separately

Local verification reference:

-   `docs/polar-sandbox-setup.md`

## Uploads

-   [ ] Resume file types restricted
-   [ ] File size limits enforced
-   [ ] Upload failures handled
-   [ ] Uploaded files scoped to correct user
-   [ ] Cross-user access impossible

## Analytics

-   [ ] Signup tracked
-   [ ] First application created tracked
-   [ ] Application created tracked
-   [ ] Reminder created tracked
-   [ ] Upgrade click tracked
-   [ ] Checkout started tracked
-   [ ] Checkout success tracked

## UX

-   [ ] Mobile layout verified
-   [ ] Forms usable on smaller screens
-   [ ] Clear navigation for first-time users
-   [ ] Confirmation for destructive actions

## Marketing

-   [ ] Landing page ready
-   [ ] Pricing page ready
-   [ ] Product copy written
-   [ ] Demo screenshots ready
-   [ ] Launch post drafted
-   [ ] LinkedIn post drafted
-   [ ] Reddit launch draft ready

## Production Readiness

-   [ ] Production env vars configured
-   [ ] Vercel Blob token configured
-   [ ] Database migrations applied
-   [ ] Polar webhook configured
-   [ ] Resend sending verified
-   [ ] PostHog production project configured

## Trust

-   [ ] Privacy policy available
-   [ ] Terms of service available
-   [ ] Support/contact email visible

## Post-launch

-   [ ] Collect user feedback
-   [ ] Review onboarding drop-off
-   [ ] Review most-used features
-   [ ] Review upgrade funnel
