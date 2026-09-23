import { z } from "zod";
import { requireAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { orderConfirmationEmail, statusUpdateEmail } from "@/server/email-templates";
import { getAppUrl } from "@/server/stripe";

const schema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(1000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin();
    const { id } = await params;
    const input = await parseJson(request, schema);

    const transfer = await prisma.bankTransfer.findUnique({
      where: { id },
      include: { checkoutIntent: { include: { order: true, package: true } } },
    });
    if (!transfer || !transfer.checkoutIntent.order) throw new Error("NOT_FOUND");
    if (transfer.status !== "PENDING") throw new Error("This payment proof has already been reviewed.");

    const order = transfer.checkoutIntent.order;
    const pkg = transfer.checkoutIntent.package;

    await prisma.$transaction(async (tx) => {
      await tx.bankTransfer.update({
        where: { id },
        data: { status: input.decision, reviewedById: actor.id, reviewNote: input.note, reviewedAt: new Date() },
      });

      if (input.decision === "APPROVED") {
        await tx.checkoutIntent.update({ where: { id: transfer.checkoutIntentId }, data: { status: "PAID", paidAt: new Date() } });
        await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
        await tx.payment.create({ data: { orderId: order.id, provider: "bank transfer", amountCents: order.amountCents, currency: order.currency, status: "PAID" } });
      } else {
        await tx.checkoutIntent.update({ where: { id: transfer.checkoutIntentId }, data: { status: "FAILED" } });
      }

      await tx.notification.create({
        data: {
          userId: transfer.userId,
          title: input.decision === "APPROVED" ? "Payment approved" : "Payment proof needs attention",
          body: input.decision === "APPROVED"
            ? `Payment for ${order.reference} was approved. You can now start your application.`
            : (input.note || `Payment proof for ${order.reference} was rejected.`),
          href: input.decision === "APPROVED" ? `/application/${order.id}` : "/dashboard",
        },
      });

      await tx.auditLog.create({ data: { actorId: actor.id, action: `Bank payment ${input.decision.toLowerCase()}`, target: order.reference } });
    });

    const user = await prisma.user.findUnique({ where: { id: transfer.userId } });
    if (user) {
      const settings = await getOperationalSettings();
      const appUrl = getAppUrl();
      const amount = (order.amountCents / 100).toLocaleString("en-US", { style: "currency", currency: order.currency });

      if (input.decision === "APPROVED" && settings.notifications.orders) {
        await sendEmailSafely(user.email, orderConfirmationEmail({
          fullName: user.fullName,
          reference: order.reference,
          packageName: pkg.name,
          amount,
          dashboardUrl: `${appUrl}/dashboard`,
          supportEmail: settings.smtp.mainEmail,
        }));
      }

      if (input.decision === "REJECTED" && settings.notifications.orderStatus) {
        await sendEmailSafely(user.email, statusUpdateEmail({
          fullName: user.fullName,
          reference: order.reference,
          status: "Payment proof rejected",
          message: input.note || "Please re-upload a clearer proof of payment or contact us for assistance.",
          dashboardUrl: `${appUrl}/dashboard`,
          supportEmail: settings.smtp.mainEmail,
        }));
      }
    }

    return json({ ok: true });
  } catch (error) { return routeError(error); }
}
