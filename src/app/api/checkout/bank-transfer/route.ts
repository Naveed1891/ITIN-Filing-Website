import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { paymentProofReceivedEmail } from "@/server/email-templates";
import { getAppUrl } from "@/server/stripe";
import { uploadBase64File } from "@/server/storage";

const schema = z.object({ orderId: z.string().trim().min(1), fileName: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]), fileBase64: z.string().min(1).max(7_000_000) });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const order = await prisma.order.findFirst({ where: { id: input.orderId, userId: user.id }, include: { application: true, package: true, checkoutIntent: { include: { bankTransfer: true } } } });
    if (!order) throw new Error("NOT_FOUND");
    if (order.application?.status !== "SUBMITTED") throw new Error("Submit the application before payment.");
    if (order.checkoutIntent.status === "PAID") throw new Error("This order has already been paid.");
    if (order.checkoutIntent.bankTransfer?.status === "PENDING") throw new Error("Your payment proof is already awaiting review.");
    const proofStorageKey = await uploadBase64File(`payment-proofs/${user.id}`, input.fileName, input.mimeType, input.fileBase64);
    await prisma.$transaction(async (tx) => {
      await tx.bankTransfer.upsert({
        where: { checkoutIntentId: order.checkoutIntentId },
        create: { checkoutIntentId: order.checkoutIntentId, userId: user.id, proofFileName: input.fileName, proofMimeType: input.mimeType, proofStorageKey },
        update: { status: "PENDING", proofFileName: input.fileName, proofMimeType: input.mimeType, proofStorageKey, reviewedById: null, reviewNote: null, reviewedAt: null },
      });
      await tx.checkoutIntent.update({ where: { id: order.checkoutIntentId }, data: { status: "PENDING" } });
      await tx.order.update({ where: { id: order.id }, data: { status: "PENDING_PAYMENT" } });
      await tx.notification.create({ data: { userId: user.id, title: "Payment proof received", body: `Your proof for order ${order.reference} is awaiting review. Processing begins after payment approval.`, href: `/dashboard/orders/${order.reference}` } });
    });
    const settings = await getOperationalSettings();
    if (settings.notifications.payments) {
      await sendEmailSafely(user.email, paymentProofReceivedEmail({ fullName: user.fullName, reference: order.reference, amount: (order.amountCents / 100).toLocaleString("en-US", { style: "currency", currency: order.currency }), dashboardUrl: `${getAppUrl()}/dashboard`, supportEmail: settings.smtp.mainEmail }));
    }
    return json({ orderId: order.id, reference: order.reference }, 201);
  } catch (error) { return routeError(error); }
}
