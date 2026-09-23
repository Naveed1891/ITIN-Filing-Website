import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.");
  }
  return new Stripe(secretKey);
}

export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_APP_URL is not set. Add it to your environment variables.");
  }
  return url ?? "http://localhost:3000";
}
