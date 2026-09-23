import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { title: "Dashboard | ITINReady", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/dashboard");
  if (["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role)) redirect("/admin");
  return (
    <DashboardShell mode="customer" userName={user.fullName}>
      {children}
    </DashboardShell>
  );
}
