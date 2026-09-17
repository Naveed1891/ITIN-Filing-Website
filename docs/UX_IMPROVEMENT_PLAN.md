# UX Improvement Plan — ITINFiling

Audit of the customer-facing flows ahead of backend/dashboard work. Brand,
colors, typography, animations, layout direction, ITIN form fields, validation
schemas, document requirements, and conditional logic are preserved. This plan
records issues found, what was fixed in this pass, and what is staged next.

## Flows audited
Homepage package selection · package detail · selected-package checkout · login ·
signup · setup-account · payment success/cancel · application form · document
upload · review · orders / track order · mobile layouts.

## Issues found

### Auth & flow (highest priority — blocks conversion)
1. **`returnTo` was not validated** on login/signup — an attacker-supplied
   `?returnTo=https://evil.com` would have been followed after auth (open
   redirect). No allow-list for internal paths.
2. **Nested `<Link><Button>` breaks navigation.** `Button` renders a native
   `<button>`; wrapping it in a `<Link>` produces invalid `<a><button>` markup
   that the browser reparents, so the anchor becomes inert and the CTA does not
   navigate. Present in 15 files — including the checkout page's own **Sign in /
   Create account** buttons (the entry to the signup flow) and the orders
   empty-state CTA.
3. Signup gave **no client-side feedback** for password length or
   password-mismatch; the only signal was a round-trip server error.
4. No focus management — after a failed submit, focus stayed on the button
   instead of moving to the first problem field.

### Forms
5. Required fields had **no visible required indicator**.
6. Missing **field-level hints** (WhatsApp country-code format, password rule).
7. Some inputs missed `inputMode` (email/tel) for better mobile keyboards.
8. Placeholder text was doing label work in a few spots (labels are present in
   `FormField`, which is good; keep enforcing visible labels).

### Application form / documents / orders
9. Step titles, section descriptions, progress and save/continue wording can be
   clearer and more reassuring around sensitive ITIN data.
10. Document upload copy already states accepted types + max size ("JPG, PNG, or
    PDF under 10 MB") and required/optional — good; upload is still a simulated
    stub and will need real wiring during backend work.
11. Orders empty state exists ("No orders yet" + next-action CTA) — good, but its
    CTA was affected by issue #2.

### Accessibility
12. `FormField` is already strong (visible `<label>`, `aria-invalid`,
    `aria-describedby`, error `role="alert"`). Main gaps were the missing
    required marker (#5) and the clickable-anchor issue (#2).

## Changes implemented in this pass
- **`src/lib/return-to.ts`** — new `safeReturnTo()` allow-listing internal
  absolute paths only; rejects `http(s)://`, protocol-relative `//host`,
  backslash tricks, and control characters. Wired into login, signup, and
  setup-account. Preserves `/checkout?package=<slug>` through auth.
- **Signup auto-login** — confirmed the signup API already creates the session
  cookie (`createSession(user.id)`, 201). Hardened the client: validated
  `returnTo`, added inline password-length + mismatch checks, and focus to the
  first invalid field. After signup the user is authenticated and returned to
  the preserved checkout URL — no second manual login.
- **`FormField`** — visible required marker (`*`) driven by the existing
  `required` prop; reused everywhere the component is used.
- **Signup fields** — WhatsApp/password hints, `inputMode` for email/tel, inline
  `error` wiring for password + confirm-password.
- **Nested-CTA fix (core conversion flow)** — converted `<Link><Button>` to a
  real anchor styled with `buttonVariants` in `checkout/page.tsx` (Sign in,
  Create account, Back to packages ×3) and `orders/page.tsx` (empty-state CTA),
  matching the pattern already used in `PricingCard`.

## Staged next (not in this pass — same mechanical `buttonVariants`-on-`Link` fix)
Apply the anchor/button fix to the remaining files so every CTA navigates and is
accessible:
`payment/success/page.tsx`, `payment/cancel/page.tsx`,
`application/[orderId]/page.tsx`, `orders/[orderId]/page.tsx`, `not-found.tsx`,
`components/application/DocumentUpload.tsx`, `components/application/ReviewPanel.tsx`,
`components/content/ArticlePage.tsx`, `components/content/PublicPage.tsx`,
`components/home/EligibilityChecker.tsx`, `components/home/FinalCta.tsx`,
`components/home/HeroSection.tsx`, `components/home/HowItWorks.tsx`.

Also staged: top error-summary + focus for the long application form; per-step
"incomplete section" indicators; reassurance copy around sensitive ITIN
questions; payment-cancel "Return to checkout" should preserve `?package=` so the
user does not have to reselect; wire the document upload to the real endpoint.
