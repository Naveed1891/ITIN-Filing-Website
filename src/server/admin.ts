import { requireUser } from "./auth";
import { prisma } from "./db";

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}

export async function requireAdminModule(module: string) {
  const user = await requireUser();
  if (user.role === "SUPER_ADMIN") return user;
  if (!["ADMIN", "STAFF"].includes(user.role)) throw new Error("FORBIDDEN");
  const permission = await prisma.staffPermission.findUnique({ where: { userId_module: { userId: user.id, module } } });
  if (!permission?.canView) throw new Error("FORBIDDEN");
  return user;
}
