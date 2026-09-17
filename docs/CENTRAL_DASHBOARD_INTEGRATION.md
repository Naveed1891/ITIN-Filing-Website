# Central dashboard integration (ITINFiling)

## Feature flag

```env
USE_CENTRAL_DASHBOARD=true
```

When `true`, ITINFiling API routes proxy to the central service-dashboard. When `false`, the legacy local MySQL/Prisma flow is used.

## What is proxied

| ITINFiling route | Central route |
|------------------|---------------|
| `POST /api/auth/signup` | `POST /api/integration/v1/auth/signup` |
| `POST /api/auth/login` | `POST /api/integration/v1/auth/login` |
| `GET /api/auth/me` | `GET /api/integration/v1/auth/me` |
| `GET /api/forms` | `GET /api/integration/v1/catalog` |
| `GET /api/forms/[slug]` | `GET /api/integration/v1/catalog/packages/[slug]` |
| `POST /api/checkout/create-session` | `POST /api/integration/v1/checkout/create-stripe-session` |
| `GET /api/checkout/status` | `GET /api/integration/v1/checkout/status` |
| `GET/PATCH /api/applications/[orderId]` | `GET/PATCH /api/integration/v1/applications/[orderReference]` |
| `POST /api/applications/[orderId]/submit` | `POST .../submit` |
| `POST /api/documents/upload` | `POST /api/integration/v1/documents/register` |
| `GET /api/orders` | `GET /api/integration/v1/orders` |
| `GET /api/orders/[orderId]` | `GET /api/integration/v1/orders/[publicReference]` |

## What stays local (temporarily)

- `src/server/db.ts` and Prisma schema (legacy fallback)
- `POST /api/webhooks/stripe` (unused when central mode is on; Stripe forwards to dashboard)
- All frontend pages, form fields, conditional logic, document UX, checkout UX

## Session model

Central mode stores the **bridge token** from central auth in the `itin_session` httpOnly cookie. No local `User` / `Session` rows are created.

## Required env

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
USE_CENTRAL_DASHBOARD=true
CENTRAL_DASHBOARD_API_URL=http://localhost:3001
CENTRAL_DASHBOARD_WEBSITE_SLUG=itinfiling
CENTRAL_DASHBOARD_API_KEY=<raw integration key>
ITINFILING_SESSION_SECRET=<random secret>  # local fallback sessions only
```

`CENTRAL_DASHBOARD_API_KEY` is server-only (read in `src/lib/central-dashboard/client.ts`). Never prefix with `NEXT_PUBLIC_`.

## Rollback

```env
USE_CENTRAL_DASHBOARD=false
```

Ensure local `DATABASE_URL` is configured and run ITINFiling migrations/seed.

## Order IDs

In central mode, API responses use central public references (`ORD-...`) as `order.id` so existing portal URLs keep working without UI changes.

## Cleanup plan

After Phase 2 is verified in staging/production:

1. Remove local checkout/order/application writes from API routes
2. Archive or drop ITINFiling operational tables
3. Keep package-catalog.json only as documentation or remove after central catalog is canonical everywhere
