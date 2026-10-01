import { z } from "zod";
import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { createOrderReference } from "@/server/orders";
import { findPublishedPackage } from "@/server/packages";

const schema = z.object({ packageSlug: z.string().trim().min(1) });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const pkg = await prisma.formPackage.findFirst({
      where: { slug: input.packageSlug, isActive: true },
    });
    const publishedPackage = pkg ? findPublishedPackage(pkg.slug) : null;
    if (!pkg || !publishedPackage) throw new Error("The selected package is not available.");

    const order = await prisma.$transaction(async (tx) => {
      const intent = await tx.checkoutIntent.create({
        data: {
          userId: user.id,
          packageId: pkg.id,
          amountCents: publishedPackage.priceCents,
          currency: pkg.currency,
        },
      });

      let reference = createOrderReference();
      while (await tx.order.findUnique({ where: { reference } })) {
        reference = createOrderReference();
      }

      return tx.order.create({
        data: {
          reference,
          userId: user.id,
          packageId: pkg.id,
          checkoutIntentId: intent.id,
          status: "APPLICATION_IN_PROGRESS",
          amountCents: publishedPackage.priceCents,
          currency: pkg.currency,
          application: {
            create: {
              userId: user.id,
              status: "NOT_STARTED",
              applicationJson: "{}",
            },
          },
        },
      });
    });

    return json({ orderId: order.id, reference: order.reference }, 201);
  } catch (error) {
    return routeError(error);
  }
}
