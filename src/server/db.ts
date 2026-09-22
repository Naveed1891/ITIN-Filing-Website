import { PrismaClient } from "@prisma/client";
import { packageDefinitions } from "./packages";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD || "";
  const port = process.env.DB_PORT || "3306";

  if (!host || !name || !user) {
    throw new Error(
      "Database not configured. Set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD in your environment variables."
    );
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
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
