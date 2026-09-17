import { prisma } from "@/server/db";
import { errorJson, json } from "@/server/http";
import { getStripe } from "@/server/stripe";
import { createPaidOrderFromCheckoutSession } from "@/server/orders";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return errorJson("Stripe webhook secret is not configured.", 500);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return errorJson("Missing Stripe signature.", 400);

  const rawBody = await request.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return errorJson("Invalid Stripe webhook signature.", 400);
  }

  const existing = await prisma.processedStripeEvent.findUnique({ where: { eventId: event.id } });
  if (existing) return json({ received: true, duplicate: true });

  if (event.type === "checkout.session.completed") {
    await createPaidOrderFromCheckoutSession(event.data.object);
  }

  await prisma.processedStripeEvent.create({
    data: { eventId: event.id, type: event.type },
  });

  return json({ received: true });
}
