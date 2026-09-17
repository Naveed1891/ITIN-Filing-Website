# Global Auth State / Header Fix

## 1. Root cause: header not updating after login
`Header` and `MobileNav` were static client components that hard-coded **Login**
and **Get Started** links and never checked the session. There was no auth
context and no `/api/auth/me` call in the navigation, so nothing could change the
header after login, signup auto-login, or logout — the CTAs were literally
constant JSX.

## 2. Where stale auth/checkout state was found
- Header/MobileNav rendered a fixed logged-out state (this fix).
- (Prior fixes) `apiFetch` and API routes now use `no-store`; the dead
  `localStorage` selected-package helper was neutralised; checkout state is
  derived only from the URL slug + `/api/auth/me`. No `sessionStorage`, no
  module-level user/order caches.

## 3. How auth nav works now
New client component **`src/components/layout/AuthNav.tsx`**:
- Fetches `/api/auth/me` (via `apiFetch`, which is `cache: "no-store"`).
- Re-checks on **every route change** (`usePathname()` dependency), so login,
  signup auto-login, and logout all reflect immediately — the auth pages already
  `router.push(returnTo)` + `router.refresh()`, which changes the path and
  triggers a re-check. No manual refresh required.
- Tri-state (`undefined` = resolving, `null` = logged out, object = logged in):
  renders a neutral skeleton while resolving so it never flashes the wrong CTAs.
- Logged out → **Login** + **Get Started** (unchanged look).
- Logged in → **Track Order** (`/orders`) + **Log out**. Logout calls
  `POST /api/auth/logout`, clears local UI state, `router.push("/")` +
  `router.refresh()`.
Reused in both `Header` (desktop) and `MobileNav` (mobile) with the existing
classes — no visual redesign.

## 4. Dynamic / no-store routes
- `apiFetch` defaults to `cache: "no-store"`.
- `http.ts` `json()`/`errorJson()` send `Cache-Control: no-store, no-cache,
  must-revalidate, proxy-revalidate`, `Pragma: no-cache`, `Expires: 0`.
- User-specific API route handlers export `dynamic = "force-dynamic"`
  (`auth/*`, `orders/*`, `checkout/*`, `applications/[orderId]/*`,
  `documents/upload`).
- User-specific **pages** are Client Components (Next forbids `export const
  dynamic` there); freshness comes from the no-store fetches they use.

## 5. Browser storage removed / limited
`localStorage` package-slug persistence removed. No customer name, email,
WhatsApp, country, payment status, order details, application answers, or auth
state are stored in the browser. Selection state lives only in the URL; auth
lives only in the httpOnly session cookie.

## 6. Manual test checklist
- Logged out: homepage header shows **Login** + **Get Started**.
- Log in via `/login` → after redirect the header shows **Track Order** + **Log
  out** with no manual refresh.
- From a package card while logged out → `/checkout?package=<slug>` shows Sign in
  / Create account (no old customer details, no payment review).
- Sign up during checkout → auto-logged-in, returned to the checkout URL, header
  shows authenticated nav.
- Click **Log out** → header returns to Login + Get Started; `/orders` now
  requires signing in again.
- DevTools: `/api/auth/me` responds `Cache-Control: no-store` and refetches on
  navigation.
