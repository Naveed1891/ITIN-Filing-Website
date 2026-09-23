import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  priceCents: z.number().int().min(0).optional(),
  currency: z.string().trim().optional(),
  features: z.array(z.string().trim().min(1)).min(1).optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireUser();
    if (user.role !== "SUPER_ADMIN") {
      return errorJson("Only super admins can edit packages.", 403);
    }
    const pkg = await prisma.formPackage.findUnique({ where: { id } });
    if (!pkg) return errorJson("Package not found.", 404);

    const input = await parseJson(request, updateSchema);
    const updated = await prisma.formPackage.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.priceCents !== undefined && { priceCents: input.priceCents }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.features !== undefined && { featuresJson: JSON.stringify(input.features) }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
    return json({ package: updated });
  } catch (error) {
    return routeError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireUser();
    if (user.role !== "SUPER_ADMIN") {
      return errorJson("Only super admins can delete packages.", 403);
    }
    const pkg = await prisma.formPackage.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });
    if (!pkg) return errorJson("Package not found.", 404);
    if (pkg._count.orders > 0) {
      return errorJson("Cannot delete a package that has existing orders. Deactivate it instead.", 400);
    }
    await prisma.formPackage.delete({ where: { id } });
    return json({ deleted: true });
  } catch (error) {
    return routeError(error);
  }
}
