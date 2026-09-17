# Stripe Testing

## Test Keys

1. Open the Stripe Dashboard.
2. Toggle **Test mode**.
3. Go to **Developers > API keys**.
4. Copy the test publishable key and test secret key into `.env.local`.

Required variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
DATABASE_URL=file:./dev.db
SESSION_SECRET=replace-with-a-long-random-string
```

Do not commit `.env.local`.

## Stripe CLI Webhooks

Install the Stripe CLI from Stripe's documentation for your operating system, then authenticate:

```bash
stripe login
```

Forward local webhook events:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the displayed `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Test Cards

- Successful payment: `4242 4242 4242 4242`
- 3D Secure authentication: `4000 0025 0000 3155`
- Declined payment: `4000 0000 0000 9995`

Use any future expiration date, any CVC, and any postal code.

Never use live card details in test mode.

## Success Payment Test

1. Run the app locally.
2. Run the Stripe CLI listener.
3. Sign up or log in.
4. Choose a package and continue to Stripe Checkout.
5. Pay with `4242 4242 4242 4242`.
6. Return to `/payment/success?session_id=...`.
7. Confirm the success page polls until the webhook-created order appears.
8. Open `/orders` and verify the order is listed.
9. Open `/application/[orderId]` and verify the application is unlocked.

## Failed Payment Test

1. Start checkout.
2. Pay with `4000 0000 0000 9995`.
3. Confirm Stripe declines the payment.
4. Confirm no order appears in `/orders`.
5. Confirm `/application/[orderId]` is not accessible without a paid order.

## Webhook Idempotency Check

The webhook stores processed Stripe event IDs. Replaying the same `checkout.session.completed` event should not create another order for the checkout intent.
