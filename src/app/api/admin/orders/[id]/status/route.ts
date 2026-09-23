import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { sendEmailSafely } from "@/server/email";
import { statusUpdateEmail } from "@/server/email-templates";
import { getOperationalSettings } from "@/server/operational-settings";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "APPLICATION_IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "MORE_INFO_REQUIRED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  APPLICATION_IN_PROGRESS: "Application In Progress",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  MORE_INFO_REQUIRED: "More Info Required",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().trim().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireUser();
    if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(actor.role)) {
      return errorJson("Forbidden.", 403);
    }

    const { id } = await params;
    const input = await parseJson(request, updateStatusSchema);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, package: true },
    });
    if (!order) return errorJson("Order not found.", 404);
    if (order.status === input.status) {
      return errorJson("Order is already in this status.", 400);
    }

    const fromStatus = order.status;

    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status: input.status },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus,
          toStatus: input.status,
          note: input.note || null,
          actorId: actor.id,
        },
      }),
      prisma.notification.create({
        data: {
          userId: order.userId,
          title: "Order status updated",
          body: `Your order ${order.reference} status has been updated to ${STATUS_LABELS[input.status] ?? input.status}.${input.note ? ` Note: ${input.note}` : ""}`,
          href: "/dashboard",
        },
      }),
    ]);

    const settings = await getOperationalSettings();
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://itinready.com").replace(/\/$/, "");

    await sendEmailSafely(order.user.email, statusUpdateEmail({
      fullName: order.user.fullName,
      reference: order.reference,
      status: STATUS_LABELS[input.status] ?? input.status,
      message: input.note,
      dashboardUrl: `${appUrl}/dashboard`,
      supportEmail: settings.smtp.mainEmail || undefined,
    }));

    return json({ ok: true, status: input.status });
  } catch (error) {
    return routeError(error);
  }
}
