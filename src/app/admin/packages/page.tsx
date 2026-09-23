import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { PageHeading } from "@/components/dashboard/DashboardPrimitives";
import { PackageManager } from "@/components/dashboard/PackageManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(actor.role)) redirect("/admin");

  const packages = await prisma.formPackage.findMany({
    orderBy: { priceCents: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  const serialized = packages.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.priceCents,
    currency: p.currency,
    features: JSON.parse(p.featuresJson) as string[],
    isActive: p.isActive,
    orderCount: p._count.orders,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <>
      <PageHeading
        title="Packages"
        description="Manage ITIN service packages, pricing and features. Changes are reflected on the website immediately."
      />
      <PackageManager
        initialPackages={serialized}
        isSuperAdmin={actor.role === "SUPER_ADMIN"}
      />
    </>
  );
}
