# Final Stabilization Fix (ITINFiling)

## Root causes

### ITIN Renewal Stripe failure
- Central API errors surfaced as generic messages; failed attempts could leave visible central orders from the old order-before-Stripe flow.
- **Fix:** Central now creates orders only after Stripe session succeeds; ITINFiling shows: “Payment could not be started. Please try again or contact support.”

### Continue application
- Success page polls central status and redirects to `/application/[orderReference]` when `applicationUnlocked` is true.
- Customer dashboard links to `https://itinfiling.com/application/ORD-...` for editable paid orders.

### Documents on ITINFiling
- `/api/documents/upload` registers metadata with central (application flow). Binary upload for customer dashboard uses service-dashboard customer APIs after portal login.

## Environment variables

| Variable | Example |
|----------|---------|
| `USE_CENTRAL_DASHBOARD` | `true` |
| `CENTRAL_DASHBOARD_API_URL` | `http://localhost:3001` |
| `CENTRAL_DASHBOARD_API_KEY` | `hptx_dev_itinfiling_...` |
| `CENTRAL_DASHBOARD_WEBSITE_SLUG` | `itinfiling` |
| `ITINFILING_SESSION_SECRET` | random secret |

## Manual test checklist

1. `npm run dev` on port 3000
2. ITIN Renewal → login → Stripe opens → pay `4242...`
3. Success page unlocks → redirect to application
4. `/orders` shows order (central proxy)
5. Failed package/checkout shows friendly error, no phantom order on central side

## Key files changed

- `src/app/(checkout)/checkout/page.tsx`
- `src/app/api/checkout/create-session/route.ts`
- `src/app/(checkout)/payment/success/page.tsx`
- `src/app/api/checkout/status/route.ts`
