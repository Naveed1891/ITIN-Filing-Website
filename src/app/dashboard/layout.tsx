import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
export const metadata: Metadata = { title: "Dashboard | ITINReady", robots: { index: false, follow: false } };
export default async function DashboardLayout({ children }: { children: React.ReactNode }) { const user = await getCurrentUser(); if (!user) redirect("/login?returnTo=/dashboard"); if (["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role)) redirect("/admin"); return <div className="min-h-screen bg-[#F7F4EF]"><DashboardSidebar mode="customer" /><div className="lg:pl-72"><DashboardHeader name={user.fullName} /><main className="p-5 sm:p-8 lg:p-10">{children}</main></div></div>; }
