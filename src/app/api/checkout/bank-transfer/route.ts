import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { createOrderReference } from "@/server/orders";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { paymentProofReceivedEmail } from "@/server/email-templates";
import { getAppUrl } from "@/server/stripe";

const schema = z.object({ packageSlug: z.string().trim().min(1), fileName: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "application/pdf"]), fileBase64: z.string().min(1).max(7_000_000) });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const pkg = await prisma.formPackage.findFirst({ where: { slug: input.packageSlug, isActive: true } });
    if (!pkg) throw new Error("The selected package is not available.");
    const result = await prisma.$transaction(async (tx) => {
      const intent = await tx.checkoutIntent.create({ data: { userId: user.id, packageId: pkg.id, amountCents: pkg.priceCents, currency: pkg.currency } });
      let reference = createOrderReference();
      while (await tx.order.findUnique({ where: { reference } })) reference = createOrderReference();
      const order = await tx.order.create({ data: { reference, userId: user.id, packageId: pkg.id, checkoutIntentId: intent.id, status: "PENDING_PAYMENT", amountCents: pkg.priceCents, currency: pkg.currency, application: { create: { userId: user.id, status: "NOT_STARTED", applicationJson: "{}" } } } });
      await tx.bankTransfer.create({ data: { checkoutIntentId: intent.id, userId: user.id, proofFileName: input.fileName, proofMimeType: input.mimeType, proofDataBase64: input.fileBase64 } });
      await tx.notification.create({ data: { userId: user.id, title: "Payment proof received", body: `Your proof for order ${reference} is awaiting review.`, href: "/dashboard" } });
      return order;
    });
    const settings = await getOperationalSettings();
    if (settings.notifications.payments) {
      await sendEmailSafely(user.email, paymentProofReceivedEmail({ fullName: user.fullName, reference: result.reference, amount: (pkg.priceCents / 100).toLocaleString("en-US", { style: "currency", currency: pkg.currency }), dashboardUrl: `${getAppUrl()}/dashboard`, supportEmail: settings.smtp.mainEmail }));
    }
    return json({ orderId: result.id, reference: result.reference }, 201);
  } catch (error) { return routeError(error); }
}
