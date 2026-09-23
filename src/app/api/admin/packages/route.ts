import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes."),
  name: z.string().trim().min(1, "Name is required.").max(200),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  priceCents: z.number().int().min(0, "Price must be positive."),
  currency: z.string().trim().default("USD"),
  features: z.array(z.string().trim().min(1)).min(1, "At least one feature is required."),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const user = await requireUser();
    if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return errorJson("Forbidden.", 403);
    }
    const packages = await prisma.formPackage.findMany({
      orderBy: { priceCents: "asc" },
      include: { _count: { select: { orders: true } } },
    });
    return json({ packages });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.role !== "SUPER_ADMIN") {
      return errorJson("Only super admins can create packages.", 403);
    }
    const input = await parseJson(request, createSchema);
    const existing = await prisma.formPackage.findUnique({ where: { slug: input.slug } });
    if (existing) return errorJson("A package with this slug already exists.", 409);

    const pkg = await prisma.formPackage.create({
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        currency: input.currency,
        featuresJson: JSON.stringify(input.features),
        isActive: input.isActive,
      },
    });
    return json({ package: pkg }, 201);
  } catch (error) {
    return routeError(error);
  }
}
