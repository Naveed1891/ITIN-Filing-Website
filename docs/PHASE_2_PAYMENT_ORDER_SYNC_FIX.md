# Phase 2 Payment / Order Sync Fix (ITINFiling)

## Root causes

### ITIN Renewal checkout error
- Usually central catalog missing `itin-renewal` (fixed by re-seeding service-dashboard) or central API error surfaced as generic checkout failure.
- ITINFiling now forwards `CentralDashboardError` messages from `create-session`.

### Success page “Completing your order” then failure
- Success page required `order` object while central status only included it after webhook confirmation.
- Status proxy stripped `applicationUnlocked` and `nextUrl`.
- **Fix:** Proxy returns full central status; success page polls up to ~60s, redirects on `applicationUnlocked`, offers refresh/track-order instead of sending users home.

### Orders not visible on ITINFiling / customer dashboard
- Customer id mismatch when duplicate central customers existed for the same email (missing `emailNormalized`).
- service-dashboard `/dashboard` requires NextAuth login at `/portal/login` with the same email/password as ITINFiling signup.

## Fixed flow

1. Package from `/api/forms/[slug]` → central catalog.
2. `POST /api/checkout/create-session` → central Stripe session (bridge token + package slug).
3. Success page polls `GET /api/checkout/status` → central status (with payment sync fallback).
4. `GET /api/orders` → central orders for bridge customer when `USE_CENTRAL_DASHBOARD=true`.

## Manual test checklist

- [ ] `USE_CENTRAL_DASHBOARD=true` in `.env.local`
- [ ] `CENTRAL_DASHBOARD_API_URL=http://localhost:3001`
- [ ] `CENTRAL_DASHBOARD_API_KEY` matches seeded integration key
- [ ] `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- [ ] ITIN Renewal opens Stripe Checkout
- [ ] New ITIN Application success page unlocks application
- [ ] `/orders` shows paid order when logged in
- [ ] Same email on `localhost:3001/portal/login` shows order in dashboard

## Required environment variables

| Variable | Example |
|----------|---------|
| `USE_CENTRAL_DASHBOARD` | `true` |
| `CENTRAL_DASHBOARD_API_URL` | `http://localhost:3001` |
| `CENTRAL_DASHBOARD_API_KEY` | `hptx_dev_itinfiling_...` |
| `CENTRAL_DASHBOARD_WEBSITE_SLUG` | `itinfiling` |
| `ITINFILING_SESSION_SECRET` | random secret (validated in central mode) |

## Key files changed

- `src/app/api/checkout/status/route.ts` — full central status proxy
- `src/app/(checkout)/payment/success/page.tsx` — polling + redirect logic
- `src/lib/central-dashboard/client.ts` — status response types
- `src/lib/central-dashboard/config.ts` — env validation
- `src/app/api/checkout/create-session/route.ts` — central error mapping
- `src/lib/central-dashboard/integration.test.ts` — proxy/success tests

## Auth bridge note

ITINFiling stores the central **bridge token** in the `itin_session` cookie. It does not create a service-dashboard NextAuth session. Customer dashboard access requires logging in at the unified portal (`/portal/login`) with the same credentials. ITINFiling order tracking uses the bridge token and central `/api/integration/v1/orders`.
