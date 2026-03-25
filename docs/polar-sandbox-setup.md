# Polar Sandbox Setup

## Purpose

Use this setup when validating DevApply billing locally against Polar
sandbox.

The current billing flow is:

- authenticated UI triggers a server action
- the server action redirects to `app/api/billing/checkout`
- that route delegates to Polar hosted checkout
- `app/api/webhooks/polar/route.ts` verifies webhook signatures and
  updates internal `User.plan`
- signed-in users with a matching Polar customer can open
  `app/api/billing/portal` from settings

Checkout redirects alone are not enough to grant `PRO`. Webhook delivery
must succeed before plan state changes in the app.

## Required env vars

Add these values to `.env.local` for local sandbox testing:

- `NEXT_PUBLIC_APP_URL`
- `POLAR_ACCESS_TOKEN`
- `POLAR_PRODUCT_ID_PRO`
- `POLAR_ENVIRONMENT`
- `POLAR_WEBHOOK_SECRET`

Recommended local values:

- `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
- `POLAR_ENVIRONMENT="sandbox"`

Notes:

- `POLAR_ACCESS_TOKEN` must be a valid Polar sandbox organization access
  token
- `POLAR_PRODUCT_ID_PRO` must belong to the same Polar sandbox
  organization as the access token
- `POLAR_WEBHOOK_SECRET` must match the webhook endpoint configured in
  Polar for the local test tunnel target

## Local checkout verification

1. Start the app with `npm run dev`.
2. Sign in with a local test account.
3. Trigger upgrade from settings or the signed-in pricing CTA.
4. Confirm the request reaches `/api/billing/checkout`.
5. Confirm Polar hosted checkout opens successfully.

If checkout fails before redirect:

- verify `POLAR_ACCESS_TOKEN`
- verify `POLAR_PRODUCT_ID_PRO`
- verify `POLAR_ENVIRONMENT`
- verify `NEXT_PUBLIC_APP_URL`

If Polar returns `401 invalid_token`, replace the access token with a
fresh sandbox token.

## Local customer portal verification

Customer portal access is optional, but the current implementation
supports it for authenticated users whose Polar customer record can be
resolved by external customer ID.

Portal verification flow:

1. Sign in with an account that has already completed Polar checkout.
2. Open `/settings`.
3. Trigger the billing portal action from the Pro plan section.
4. Confirm the request reaches `/api/billing/portal`.
5. Confirm Polar redirects to the hosted customer portal.

If the app redirects back to `/settings?billing=portal_unavailable`:

- verify the user has completed at least one Polar checkout
- verify the Polar customer was created with `externalCustomerId`
  matching the local `User.id`
- verify `POLAR_ACCESS_TOKEN` and `POLAR_ENVIRONMENT`

## Local webhook verification

Webhook sync is required for entitlement changes.

Local verification flow:

1. Expose the local app with a tunnel that can receive HTTPS callbacks.
2. Configure the Polar sandbox webhook target to:
   `https://<your-tunnel-host>/api/webhooks/polar`
3. Copy the matching Polar webhook secret into
   `POLAR_WEBHOOK_SECRET`.
4. Complete a sandbox checkout or replay a relevant Polar webhook.
5. Confirm the webhook returns success and the local user's `plan`
   changes in Prisma.

Relevant webhook outcomes in the current implementation:

- `order.paid` -> `PRO`
- `subscription.active` -> `PRO`
- `subscription.uncanceled` -> `PRO`
- `subscription.revoked` -> `FREE`

`subscription.canceled` does not immediately downgrade access because the
customer may still have access until the end of the billing period.

## What to inspect during debugging

- app logs for `/api/billing/checkout`
- app logs for `/api/webhooks/polar`
- Polar sandbox event delivery status
- the local user's `plan` field in Prisma

If webhook delivery succeeds but `plan` does not change:

- verify Polar customer `externalId` matches the DevApply `User.id`
- verify the checkout used the configured `POLAR_PRODUCT_ID_PRO`
- verify the event type is one of the mapped sync events above

## Current limitations

- checkout and webhook sync use normalized app plan state only:
  `FREE` / `PRO`
- provider-specific customer or subscription identifiers are not yet
  persisted in Prisma
- customer portal availability depends on Polar resolving the customer by
  external customer ID
