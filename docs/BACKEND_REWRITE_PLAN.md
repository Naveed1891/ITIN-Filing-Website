# ITINFiling Backend Rewrite Plan

## Current Mock/Local-Only Logic

Files containing old mock, localStorage, payment, order, or auth logic:

- `src/features/itin/mock-service.ts` - browser-side mock backend; creates local orders, marks payment as paid, submits applications.
- `src/features/itin/mock-data.ts` - static package data named as mock data.
- `src/features/itin/storage.ts` - localStorage customer session and application draft persistence.
- `src/features/itin/storage.test.ts` - tests for localStorage session/draft parsing.
- `src/features/itin/types.ts` - mock service/order/session contracts.
- `src/app/(checkout)/checkout/page.tsx` - creates mock orders and completes mock payment from the client.
- `src/app/(checkout)/payment/success/page.tsx` - trusts localStorage paid session.
- `src/app/(portal)/application/page.tsx` - gates access with localStorage paid order and submits through mock service.
- `src/app/(portal)/application/documents/page.tsx` - legacy redirect to mock single-page application flow.
- `src/app/(portal)/application/review/page.tsx` - legacy redirect to mock single-page application flow.
- `src/app/(portal)/orders/[orderId]/page.tsx` - reads order details from localStorage.
- `src/app/(auth)/login/page.tsx` - static login UI without authentication.
- `src/app/(auth)/setup-account/page.tsx` - static signup UI without account creation.
- `src/app/(marketing)/packages/page.tsx` and `src/app/(marketing)/packages/[slug]/page.tsx` - duplicate package price data embedded in pages.

## Delete vs Refactor

Deleted:

- `src/features/itin/mock-service.ts` after API route handlers replace browser mock backend behavior.
- `src/features/itin/mock-data.ts` after package data moves to trusted server-side package definitions.
- `src/features/itin/storage.test.ts` after local application draft storage is removed.

Refactored:

- `src/features/itin/types.ts` to represent production-style DTOs returned by APIs.
- `src/features/itin/storage.ts` to remove auth/order/application draft storage and keep only a non-authoritative selected package hint.
- Checkout, payment success, login, signup, application, and order pages to call real API routes while preserving existing layout and visual components.
- Marketing package pages to read shared package metadata so displayed prices match trusted server-side package data.

Added:

- Prisma SQLite local development persistence with models for users, packages, checkout intents, orders, applications, document metadata, sessions, and processed Stripe events.
- Secure session cookies backed by server-side sessions.
- Stripe Checkout route handler and webhook handler with signature verification and idempotency.
- Server-side ownership checks on orders and applications.
- Focused API tests for auth, checkout, webhook idempotency, and authorization.

## Implementation Notes

- Use Prisma with SQLite because the project has no existing database layer.
- Seed package records from shared trusted package definitions and use server-side price data for Stripe line items.
- Use scrypt password hashing from Node crypto to avoid adding unnecessary auth packages.
- Keep Stripe keys in environment variables only; `.env.example` will contain placeholders.
- Do not create orders on the payment success page. The page only polls checkout status until the webhook-created order exists.
- Store only safe Stripe metadata: `userId`, `packageSlug`, and `checkoutIntentId`.
- Document upload remains a secure metadata adapter placeholder for local development; raw files are not persisted in this rewrite.
