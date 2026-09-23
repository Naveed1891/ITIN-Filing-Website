import { z } from "zod";
import { hashPassword, normalizeEmail } from "@/server/auth";
import { requireSuperAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { firstPasswordError } from "@/lib/password";

export const dynamic = "force-dynamic";
export const STAFF_MODULES = ["overview", "orders", "customers", "applications", "documents", "finance", "packages", "communications", "tasks", "reports", "audit-log"] as const;

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email(),
  password: z.string().min(1),
  role: z.enum(["STAFF", "ADMIN"]),
  modules: z.array(z.enum(STAFF_MODULES)),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    const staff = await prisma.user.findMany({ where: { role: { in: ["STAFF", "ADMIN", "SUPER_ADMIN"] }, deletedAt: null }, include: { staffPermissions: true }, orderBy: { createdAt: "desc" } });
    return json({ staff: staff.map((user) => ({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, status: user.status, createdAt: user.createdAt, staffPermissions: user.staffPermissions })), modules: STAFF_MODULES });
  } catch (error) { return routeError(error); }
}

export async function POST(request: Request) {
  try {
    const actor = await requireSuperAdmin();
    const input = await parseJson(request, schema);
    const passwordError = firstPasswordError(input.password, { email: input.email, name: input.fullName });
    if (passwordError) throw new Error(passwordError);
    const email = normalizeEmail(input.email);
    if (await prisma.user.findUnique({ where: { email } })) throw new Error("An account already exists for this email address.");
    const user = await prisma.user.create({ data: {
      fullName: input.fullName, email, passwordHash: await hashPassword(input.password), role: input.role,
      whatsapp: "Not provided", country: "Not provided", termsAt: new Date(), emailVerifiedAt: new Date(),
      staffPermissions: { create: input.modules.map((module) => ({ module, canView: true, canManage: true })) },
    } });
    await prisma.auditLog.create({ data: { actorId: actor.id, action: "Staff account created", target: user.email } });
    return json({ ok: true }, 201);
  } catch (error) { return routeError(error); }
}
