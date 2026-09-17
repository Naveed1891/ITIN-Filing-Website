import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, routeError } from "@/server/http";
import { serializeOrder } from "@/server/serializers";
import { checkoutStatusSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const parsed = checkoutStatusSchema.parse(Object.fromEntries(new URL(request.url).searchParams));

    const intent = await prisma.checkoutIntent.findUnique({
      where: { stripeSessionId: parsed.session_id },
      include: {
        order: { include: { package: true, user: true, application: true } },
      },
    });
    if (!intent || intent.userId !== user.id) throw new Error("NOT_FOUND");
    const paid = intent.status === "PAID";
    return json({
      status: paid ? "application_ready" : "pending",
      paymentStatus: paid ? "PAID" : "UNPAID",
      orderReference: intent.order?.reference ?? null,
      applicationStatus: intent.order?.application?.status ?? "NOT_STARTED",
      applicationUnlocked: paid,
      nextUrl: intent.order ? `/application/${intent.order.reference}` : null,
      message: paid ? "Your application is ready." : "Payment is being confirmed.",
      order: intent.order ? serializeOrder(intent.order) : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Stripe session id is required." }, 400);
    return routeError(error);
  }
}
