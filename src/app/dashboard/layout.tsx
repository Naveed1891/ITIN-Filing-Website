import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { DashboardLogout } from "@/components/dashboard/DashboardLogout";

export const metadata: Metadata = {
  title: "Dashboard | ITINFiling",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "My Orders" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/dashboard");

  const isStaff = user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "STAFF";

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-8 md:flex-row">
        <aside className="md:w-[240px] md:shrink-0">
          <div className="rounded-card border border-border bg-white p-4">
            <Link href="/" className="mb-4 block px-2 text-lg font-extrabold text-navy">
              ITIN<span className="text-blue">Filing</span>
            </Link>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-text-mid transition hover:bg-bg-light hover:text-text-dark"
                >
                  {item.label}
                </Link>
              ))}
              {isStaff ? (
                <Link
                  href="/admin"
                  className="mt-1 rounded-lg bg-navy px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep"
                >
                  Admin dashboard →
                </Link>
              ) : null}
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <p className="px-3 text-[13px] font-semibold text-text-dark">{user.fullName}</p>
              <p className="px-3 text-[12px] text-text-muted">{user.email}</p>
              <div className="mt-3 px-1">
                <DashboardLogout />
              </div>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
