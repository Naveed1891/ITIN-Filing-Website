import { findPublishedPackage, serializePackageDefinition } from "@/server/packages";
import { json, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const pkg = findPublishedPackage(slug);
    if (!pkg) throw new Error("NOT_FOUND");
    return json({ package: serializePackageDefinition(pkg) });
  } catch (error) {
    return routeError(error);
  }
}
