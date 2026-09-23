import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/server/db";

export const metadata: Metadata = { title: "Administration | ITINReady", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role)) redirect("/dashboard");

  const permissions = user.role === "SUPER_ADMIN"
    ? undefined
    : (await prisma.staffPermission.findMany({ where: { userId: user.id, canView: true }, select: { module: true } })).map((p) => p.module);

  return (
    <DashboardShell
      mode="admin"
      allowedModules={permissions}
      userName={`${user.fullName} · ${user.role.replace("_", " ")}`}
    >
      {children}
    </DashboardShell>
  );
}
