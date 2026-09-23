import type Stripe from "stripe";
import { prisma } from "./db";
import { getOperationalSettings } from "./operational-settings";
import { sendEmailSafely } from "./email";
import { orderConfirmationEmail } from "./email-templates";
import { getAppUrl } from "./stripe";

export function createOrderReference() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `ITN-${year}-${suffix}`;
}

export async function createPaidOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;

  const checkoutIntentId = session.metadata?.checkoutIntentId;
  const userId = session.metadata?.userId;
  if (!checkoutIntentId || !userId) {
    throw new Error("Stripe session metadata is incomplete.");
  }

  const order = await prisma.$transaction(async (tx) => {
    const intent = await tx.checkoutIntent.findUnique({
      where: { id: checkoutIntentId },
      include: { package: true, order: true },
    });
    if (!intent) throw new Error("Checkout intent not found.");
    if (intent.userId !== userId) throw new Error("Checkout user mismatch.");
    if (intent.order) return intent.order;

    const paidIntent = await tx.checkoutIntent.update({
      where: { id: intent.id },
      data: {
        status: "PAID",
        stripeSessionId: session.id,
        paidAt: new Date(),
      },
    });

    let reference = createOrderReference();
    for (let index = 0; index < 3; index += 1) {
      const existing = await tx.order.findUnique({ where: { reference } });
      if (!existing) break;
      reference = createOrderReference();
    }

    return tx.order.create({
      data: {
        reference,
        userId: paidIntent.userId,
        packageId: paidIntent.packageId,
        checkoutIntentId: paidIntent.id,
        status: "PAID",
        amountCents: paidIntent.amountCents,
        currency: paidIntent.currency,
        application: {
          create: {
            userId: paidIntent.userId,
            status: "DRAFT",
            applicationJson: "{}",
          },
        },
      },
    });
  });

  if (order) {
    const settings = await getOperationalSettings();
    if (settings.notifications.orders) {
      const user = await prisma.user.findUnique({ where: { id: order.userId } });
      const pkg = await prisma.formPackage.findUnique({ where: { id: order.packageId } });
      if (user && pkg) {
        const amount = (order.amountCents / 100).toLocaleString("en-US", { style: "currency", currency: order.currency });
        await sendEmailSafely(user.email, orderConfirmationEmail({
          fullName: user.fullName,
          reference: order.reference,
          packageName: pkg.name,
          amount,
          dashboardUrl: `${getAppUrl()}/dashboard`,
          supportEmail: settings.smtp.mainEmail,
        }));
      }
    }
  }

  return order;
}
