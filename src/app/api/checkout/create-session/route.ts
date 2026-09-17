import { requireUser } from "@/server/auth";
import { ensurePackagesSeeded, prisma } from "@/server/db";
import { getAppUrl, getStripe } from "@/server/stripe";
import { json, parseJson, routeError } from "@/server/http";
import { createCheckoutSessionSchema } from "@/server/validation";
import { findPublishedPackage } from "@/server/packages";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, createCheckoutSessionSchema);

    const trustedDefinition = findPublishedPackage(input.packageSlug);
    if (!trustedDefinition) throw new Error("The selected package is unavailable.");
    await ensurePackagesSeeded();
    const pkg = await prisma.formPackage.findUnique({ where: { slug: input.packageSlug } });
    if (!pkg || !pkg.isActive) throw new Error("The selected package is unavailable.");

    const intent = await prisma.checkoutIntent.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        amountCents: pkg.priceCents,
        currency: pkg.currency,
      },
    });

    const appUrl = getAppUrl();
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pkg.currency.toLowerCase(),
            unit_amount: pkg.priceCents,
            product_data: {
              name: pkg.name,
              description: pkg.description,
            },
          },
        },
      ],
      customer_email: user.email,
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel?package=${pkg.slug}`,
      metadata: {
        userId: user.id,
        packageSlug: pkg.slug,
        checkoutIntentId: intent.id,
      },
    });

    await prisma.checkoutIntent.update({
      where: { id: intent.id },
      data: { stripeSessionId: session.id },
    });

    return json({ url: session.url, checkoutIntentId: intent.id });
  } catch (error) {
    return routeError(error);
  }
}
