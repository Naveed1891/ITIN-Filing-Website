import { packageDefinitions, serializePackageDefinition } from "@/server/packages";
import { json, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = packageDefinitions
      .filter((pkg) => pkg.active !== false && pkg.published !== false)
      .map(serializePackageDefinition);
    return json({ packages });
  } catch (error) {
    return routeError(error);
  }
}
