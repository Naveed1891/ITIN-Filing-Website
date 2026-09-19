import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { getStripe } from "@/server/stripe";
import { createPaidOrderFromCheckoutSession } from "@/server/orders";
import { json, routeError } from "@/server/http";
import { serializeOrder } from "@/server/serializers";
import { checkoutStatusSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

const orderInclude = { order: { include: { package: true, user: true, application: true } } } as const;

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const parsed = checkoutStatusSchema.parse(Object.fromEntries(new URL(request.url).searchParams));

    let intent = await prisma.checkoutIntent.findUnique({
      where: { stripeSessionId: parsed.session_id },
      include: orderInclude,
    });
    if (!intent || intent.userId !== user.id) throw new Error("NOT_FOUND");

    // Reconcile directly with Stripe so the order is created on return even if
    // the webhook is delayed or (in local dev) not being forwarded at all.
    if (!intent.order) {
      try {
        const session = await getStripe().checkout.sessions.retrieve(parsed.session_id);
        if (session.payment_status === "paid") {
          await createPaidOrderFromCheckoutSession(session);
          intent =
            (await prisma.checkoutIntent.findUnique({
              where: { stripeSessionId: parsed.session_id },
              include: orderInclude,
            })) ?? intent;
        }
      } catch {
        // Leave as pending; the client keeps polling and the webhook may still land.
      }
    }

    const paid = intent.status === "PAID" || Boolean(intent.order);
    return json({
      status: paid ? "application_ready" : "pending",
      paymentStatus: paid ? "PAID" : "UNPAID",
      orderReference: intent.order?.reference ?? null,
      applicationStatus: intent.order?.application?.status ?? "NOT_STARTED",
      applicationUnlocked: paid,
      nextUrl: intent.order ? `/application/${intent.order.id}` : null,
      message: paid ? "Your application is ready." : "Payment is being confirmed.",
      order: intent.order ? serializeOrder(intent.order) : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Stripe session id is required." }, 400);
    return routeError(error);
  }
}
