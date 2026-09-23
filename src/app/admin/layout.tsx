import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = { title: "Administration | ITINReady", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role)) redirect("/dashboard");
  return <div className="min-h-screen bg-[#F7F4EF]"><DashboardSidebar mode="admin" /><div className="lg:pl-72"><DashboardHeader name={`${user.fullName} · ${user.role.replace("_", " ")}`} /><main className="p-5 sm:p-8 lg:p-10">{children}</main></div></div>;
}
