import { z } from "zod";
import { requireSuperAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { STAFF_MODULES } from "../route";

const schema = z.object({ role: z.enum(["STAFF", "ADMIN"]), status: z.enum(["ACTIVE", "SUSPENDED"]), modules: z.array(z.enum(STAFF_MODULES)) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireSuperAdmin();
    const { id } = await params;
    const input = await parseJson(request, schema);
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw new Error("NOT_FOUND");
    if (target.role === "SUPER_ADMIN") throw new Error("Super administrator accounts cannot be edited here.");
    await prisma.$transaction([
      prisma.user.update({ where: { id }, data: { role: input.role, status: input.status } }),
      prisma.staffPermission.deleteMany({ where: { userId: id } }),
      prisma.staffPermission.createMany({ data: input.modules.map((module) => ({ userId: id, module, canView: true, canManage: true })) }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.auditLog.create({ data: { actorId: actor.id, action: "Staff access updated", target: target.email } }),
    ]);
    return json({ ok: true });
  } catch (error) { return routeError(error); }
}
