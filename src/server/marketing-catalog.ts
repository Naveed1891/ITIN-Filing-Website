import type { PricingCardData } from "@/components/packages/PricingCard";
import { packageDefinitions, priceDollars } from "@/server/packages";

function catalogCards(): PricingCardData[] {
  return packageDefinitions.map((pkg) => ({
    slug: pkg.slug,
    name: pkg.name,
    price: priceDollars(pkg.priceCents),
    featured: Boolean(pkg.featured),
    description: pkg.description,
    features: pkg.features,
    cta: pkg.slug === "itin-renewal" ? "Renew my ITIN" : "Get started",
  }));
}

/** Marketing package cards, served from the local package catalogue. */
export async function getMarketingPackages(): Promise<{
  packages: PricingCardData[];
  source: "live" | "fallback";
}> {
  return { packages: catalogCards(), source: "fallback" };
}

export async function getMarketingPackage(slug: string) {
  const normalized = slug.trim().toLowerCase();
  const { packages, source } = await getMarketingPackages();
  const live = packages.find((pkg) => pkg.slug.toLowerCase() === normalized) ?? null;
  const local = packageDefinitions.find((pkg) => pkg.slug.toLowerCase() === normalized) ?? null;
  return { live, local, source };
}
