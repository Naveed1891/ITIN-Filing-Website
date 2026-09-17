import type { Application, FormPackage, Order, User } from "@prisma/client";
import { publicUser } from "./auth";

export function serializePackage(pkg: FormPackage) {
  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    description: pkg.description,
    price: pkg.priceCents / 100,
    priceCents: pkg.priceCents,
    currency: pkg.currency,
    features: JSON.parse(pkg.featuresJson) as string[],
  };
}

export function serializeOrder(
  order: Order & { package: FormPackage; user?: User; application?: Application | null },
) {
  return {
    id: order.id,
    reference: order.reference,
    packageId: order.packageId,
    packageSlug: order.package.slug,
    packageName: order.package.name,
    amount: order.amountCents / 100,
    amountCents: order.amountCents,
    currency: order.currency,
    status: order.status,
    applicationStatus: order.application?.status ?? "NOT_STARTED",
    createdAt: order.createdAt.toISOString(),
    user: order.user ? publicUser(order.user) : undefined,
  };
}
