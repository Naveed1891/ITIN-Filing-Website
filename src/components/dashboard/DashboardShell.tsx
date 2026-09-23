"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign, Boxes, ClipboardCheck, FileText, FolderLock, Gauge, Headphones,
  History, ListTodo, Mail, Package, Settings, ShieldCheck, UserRound, Users,
} from "lucide-react";

type NavItem = { href: string; label: string; Icon: LucideIcon };

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", Icon: Gauge },
  { href: "/admin/orders", label: "Orders", Icon: ClipboardCheck },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/applications", label: "Applications", Icon: FileText },
  { href: "/admin/documents", label: "Documents", Icon: FolderLock },
  { href: "/admin/finance", label: "Finance", Icon: BadgeDollarSign },
  { href: "/admin/packages", label: "Packages", Icon: Package },
  { href: "/admin/communications", label: "Communications", Icon: Mail },
  { href: "/admin/tasks", label: "Tasks", Icon: ListTodo },
  { href: "/admin/reports", label: "Reports", Icon: Boxes },
  { href: "/admin/audit-log", label: "Audit Log", Icon: History },
  { href: "/admin/staff", label: "Staff", Icon: UserRound },
  { href: "/admin/credentials", label: "Credentials", Icon: Settings },
];

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", Icon: Gauge },
  { href: "/dashboard/orders", label: "My Requests", Icon: ClipboardCheck },
  { href: "/dashboard/documents", label: "Documents", Icon: FolderLock },
  { href: "/dashboard/notifications", label: "Notifications", Icon: Mail },
  { href: "/dashboard/support", label: "Support", Icon: Headphones },
  { href: "/dashboard/profile", label: "Profile", Icon: UserRound },
];

export function DashboardShell({
  mode,
  allowedModules,
  userName,
  children,
}: {
  mode: "admin" | "customer";
  allowedModules?: string[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const areaLabel = mode === "admin" ? "Administration" : "Client portal";

  const allNav = mode === "admin" ? ADMIN_NAV : CUSTOMER_NAV;
  const nav = mode === "admin" && allowedModules
    ? allNav.filter((item) => item.href === "/admin" || allowedModules.includes(item.href.replace("/admin/", "")))
    : allNav;

  async function signOut() {
    setSigningOut(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* best-effort */ }
    router.push("/");
    router.refresh();
  }

  function isActive(href: string): boolean {
    if (href === "/dashboard" || href === "/admin") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="dash">
      <aside className={`dash__sidebar${menuOpen ? " dash__sidebar--open" : ""}`}>
        <div className="dash__brand">
          <Link href="/" className="dash__brand-link">
            <span className="dash__brand-icon"><ShieldCheck size={22} /></span>
            ITIN<span className="dash__brand-gold">Ready</span>
          </Link>
          <p className="dash__area">{areaLabel}</p>
        </div>
        <nav className="dash__nav" aria-label={`${areaLabel} navigation`}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`dash__link${isActive(item.href) ? " dash__link--active" : ""}`}
            >
              <span className="dash__link-icon" aria-hidden><item.Icon size={17} /></span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="dash__sidebar-foot">
          <Link href="/" className="dash__back">← Back to website</Link>
        </div>
      </aside>

      <div className="dash__main">
        <header className="dash__topbar">
          <button
            type="button"
            className="dash__burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
          <div className="dash__topbar-spacer" />
          <div className="dash__user">
            <span className="dash__user-name">{userName}</span>
            <button type="button" onClick={signOut} disabled={signingOut} className="dash__signout">
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </header>
        <main className="dash__content">{children}</main>
      </div>

      {menuOpen && (
        <button type="button" className="dash__scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
