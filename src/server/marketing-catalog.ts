import type { PricingCardData } from "@/components/packages/PricingCard";
import { prisma } from "@/server/db";
import { packageDefinitions, priceDollars } from "@/server/packages";

function fallbackCards(): PricingCardData[] {
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

export async function getMarketingPackages(): Promise<{
  packages: PricingCardData[];
  source: "live" | "fallback";
}> {
  try {
    const dbPackages = await prisma.formPackage.findMany({
      where: { isActive: true },
      orderBy: { priceCents: "asc" },
    });
    if (dbPackages.length > 0) {
      return {
        packages: dbPackages.map((pkg) => {
          let features: string[] = [];
          try { features = JSON.parse(pkg.featuresJson); } catch { /* ignore */ }
          return {
            slug: pkg.slug,
            name: pkg.name,
            price: pkg.priceCents / 100,
            featured: pkg.slug === dbPackages.reduce((best, p) => p.priceCents > best.priceCents ? p : best, dbPackages[0]).slug,
            description: pkg.description,
            features,
            cta: pkg.slug === "itin-renewal" ? "Renew my ITIN" : "Get started",
          };
        }),
        source: "live",
      };
    }
  } catch {
    // DB unavailable, fall through to fallback
  }
  return { packages: fallbackCards(), source: "fallback" };
}

export async function getMarketingPackage(slug: string) {
  const normalized = slug.trim().toLowerCase();
  const { packages, source } = await getMarketingPackages();
  const live = packages.find((pkg) => pkg.slug.toLowerCase() === normalized) ?? null;
  const local = packageDefinitions.find((pkg) => pkg.slug.toLowerCase() === normalized) ?? null;
  return { live, local, source };
}
