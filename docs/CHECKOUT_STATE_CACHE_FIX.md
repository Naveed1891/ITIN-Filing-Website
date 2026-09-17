# Checkout Stale State / Cache Fix

## Root cause
Checkout customer details come from `/api/auth/me`, fetched client-side via
`apiFetch`. `apiFetch` called `fetch()` with **no `cache` option** (browser
default), and the API route sent **no `Cache-Control` header**. The browser
therefore reused a previously cached `/api/auth/me` response — an *old
authenticated user* — even after logout or session change. The checkout step is
derived as `user ? Payment review : Sign in`, so a stale non-null user made a
logged-out visitor land on **Payment review with old customer details**. This
was a caching bug, not a step-logic bug: the step calculation already depends
only on `(selectedPackage, user)` and never reads browser storage or old orders.

## Stale-state sources found
- `apiFetch` allowed HTTP caching of dynamic user/auth/order/checkout responses. **(fixed)**
- API JSON responses carried no cache headers, so browsers/proxies could cache them. **(fixed)**
- `src/features/itin/storage.ts` persisted the selected package slug in
  `localStorage`. It was **dead code** (no importers) but was a browser-storage
  vector, so it was neutralised. **(fixed)**
- No `sessionStorage`, no module-level user/order/checkout caches, and no
  "last order / current customer / paid session" fallback exist. The only
  module-level global is the Prisma client singleton (correct, not user state).

## State removed vs still allowed
Removed / never persisted in the browser: customer name, email, WhatsApp,
country, payment state, order details, application answers, checkout step. The
`localStorage` selected-package persistence is gone.

Still allowed: the **package slug in the URL** (`/checkout?package=<slug>`) is the
only selection state; customer details come **only** from the authenticated
session (`/api/auth/me`); the selected package comes from trusted server data via
`GET /api/forms/[slug]`.

## Cache / no-store changes
- `apiFetch` now sends `cache: "no-store"` by default — no client reuse of
  auth/order/checkout/user data.
- `src/server/http.ts` `json()` (and `errorJson()`, which delegates to it) now
  set `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`,
  `Pragma: no-cache`, `Expires: 0` on every API response.
- `export const dynamic = "force-dynamic"` added to the user-specific route
  handlers (auth, orders, checkout, applications, documents) so they are never
  statically optimised.
- The user-specific **pages** (`/checkout`, `/payment/*`, `/orders`,
  `/orders/[orderId]`, `/application/[orderId]/*`) are Client Components, where
  Next.js forbids `export const dynamic`. Their freshness is guaranteed by the
  `no-store` fetches above (all their data flows through `apiFetch`).

## Checkout step logic (deterministic)
- No package slug → "select a package" screen (link to `/packages`).
- Invalid/inactive slug → "selected package unavailable" screen.
- Valid slug + not authenticated → **Sign in / Create account**.
- Valid slug + authenticated → **Payment review** (fresh checkout intent created
  only when the user proceeds to pay).
Derived solely from the URL slug + current session — never from localStorage or a
previous order. Completed/paid orders are surfaced only under `/orders` and
`/orders/[orderId]`; they are never loaded as checkout state.

## Logout cleanup
`clearSession()` deletes the server session row and the httpOnly cookie. Because
customer/order/checkout details are never stored in the browser, there is nothing
client-side to leak after logout; the next `/api/auth/me` (no-store) returns
`null`, so checkout falls back to the Sign in / Create account step.

## Signup auto-login
Signup creates the account, establishes the session cookie server-side
(`createSession`), returns the authenticated user, and redirects to a validated
internal `returnTo` (e.g. `/checkout?package=itin-renewal`). The user is then on
Payment review as the newly created user — never old customer data.
