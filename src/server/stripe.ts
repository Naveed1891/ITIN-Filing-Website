import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.");
  }
  return new Stripe(secretKey);
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "production" ? "https://itinready.com" : "http://localhost:3000")).replace(/\/$/, "");
}
