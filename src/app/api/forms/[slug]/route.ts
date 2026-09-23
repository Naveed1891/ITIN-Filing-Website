import { prisma } from "@/server/db";
import { findPublishedPackage, serializePackageDefinition } from "@/server/packages";
import { json, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const normalized = slug.trim().toLowerCase();

    const dbPkg = await prisma.formPackage.findUnique({
      where: { slug: normalized },
    }).catch(() => null);

    if (dbPkg && dbPkg.isActive) {
      let features: string[] = [];
      try { features = JSON.parse(dbPkg.featuresJson); } catch { /* ignore */ }
      return json({
        package: {
          id: dbPkg.id,
          slug: dbPkg.slug,
          name: dbPkg.name,
          description: dbPkg.description,
          price: dbPkg.priceCents / 100,
          priceCents: dbPkg.priceCents,
          currency: dbPkg.currency,
          features,
        },
      });
    }

    const pkg = findPublishedPackage(slug);
    if (!pkg) throw new Error("NOT_FOUND");
    return json({ package: serializePackageDefinition(pkg) });
  } catch (error) {
    return routeError(error);
  }
}
