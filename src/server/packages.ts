import packageCatalog from "./package-catalog.json";

const SUPPORTED_CURRENCY = "USD" as const;

export interface PackageDefinition {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: typeof SUPPORTED_CURRENCY;
  features: string[];
  active?: boolean;
  published?: boolean;
  featured?: boolean;
}

// Single source of truth: package-catalog.json. Both the runtime seeder
// (server/db.ts) and the Prisma CLI seed (prisma/seed.js) read the same file,
// so trusted price/feature data can never diverge across the app.
export const packageDefinitions: PackageDefinition[] = packageCatalog.map((pkg) => {
  if (pkg.currency !== SUPPORTED_CURRENCY) {
    throw new Error(`Unsupported currency "${pkg.currency}" for package "${pkg.slug}".`);
  }
  return {
    slug: pkg.slug,
    name: pkg.name,
    description: pkg.description,
    priceCents: pkg.priceCents,
    currency: SUPPORTED_CURRENCY,
    featured: pkg.featured,
    features: pkg.features,
  };
});

export function priceDollars(priceCents: number) {
  return priceCents / 100;
}

export function findPublishedPackage(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  return packageDefinitions.find(
    (pkg) =>
      pkg.slug.toLowerCase() === normalized &&
      pkg.active !== false &&
      pkg.published !== false,
  ) ?? null;
}

export function serializePackageDefinition(pkg: PackageDefinition) {
  return {
    id: pkg.slug,
    slug: pkg.slug,
    name: pkg.name,
    description: pkg.description,
    price: priceDollars(pkg.priceCents),
    priceCents: pkg.priceCents,
    currency: pkg.currency,
    features: pkg.features,
  };
}
