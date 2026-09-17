/**
 * Prisma client for ITINFiling. This standalone site is the single source of
 * truth for its own data (customers, orders, applications, admin).
 */
import { PrismaClient } from "@prisma/client";
import { packageDefinitions } from "./packages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function ensurePackagesSeeded() {
  await Promise.all(
    packageDefinitions.map((pkg) =>
      prisma.formPackage.upsert({
        where: { slug: pkg.slug },
        create: {
          slug: pkg.slug,
          name: pkg.name,
          description: pkg.description,
          priceCents: pkg.priceCents,
          currency: pkg.currency,
          featuresJson: JSON.stringify(pkg.features),
          isActive: true,
        },
        update: {
          name: pkg.name,
          description: pkg.description,
          priceCents: pkg.priceCents,
          currency: pkg.currency,
          featuresJson: JSON.stringify(pkg.features),
          isActive: true,
        },
      }),
    ),
  );
}
