import Link from "next/link";
import {
  BadgeDollarSign, Boxes, ClipboardCheck, FileText, FolderLock, Gauge, Headphones,
  History, ListTodo, Mail, Package, Settings, ShieldCheck, UserRound, Users,
} from "lucide-react";

const adminItems = [
  ["/admin", "Overview", Gauge], ["/admin/orders", "Orders", ClipboardCheck],
  ["/admin/customers", "Customers", Users], ["/admin/applications", "Applications", FileText],
  ["/admin/documents", "Documents", FolderLock], ["/admin/finance", "Finance", BadgeDollarSign],
  ["/admin/packages", "Packages", Package], ["/admin/communications", "Communications", Mail],
  ["/admin/tasks", "Tasks", ListTodo], ["/admin/reports", "Reports", Boxes],
  ["/admin/audit-log", "Audit Log", History], ["/admin/staff", "Staff", UserRound],
  ["/admin/credentials", "Credentials", Settings],
] as const;

const customerItems = [
  ["/dashboard", "Overview", Gauge], ["/dashboard/orders", "My requests", ClipboardCheck],
  ["/dashboard/documents", "Documents", FolderLock],
  ["/dashboard/notifications", "Notifications", Mail],
  ["/dashboard/support", "Support", Headphones], ["/dashboard/profile", "Profile", UserRound],
] as const;

export function DashboardSidebar({ mode, allowedModules }: { mode: "admin" | "customer"; allowedModules?: string[] }) {
  const items = mode === "admin"
    ? adminItems.filter(([href]) => !allowedModules || href === "/admin" || allowedModules.includes(href.replace("/admin/", "")))
    : customerItems;
  return (
    <aside className="w-full bg-[#111D2B] text-white lg:fixed lg:inset-y-0 lg:w-72">
      <div className="flex h-full flex-col">
        <Link href="/" className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <span className="grid size-11 place-items-center rounded-xl bg-gold text-navy-deep"><ShieldCheck size={24} /></span>
          <span className="text-xl font-extrabold tracking-tight">ITIN<span className="text-gold">Ready</span></span>
        </Link>
        <div className="px-6 pb-2 pt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
          {mode === "admin" ? "Administration" : "Client portal"}
        </div>
        <nav className="grid gap-1 px-3 pb-6 sm:grid-cols-2 lg:block lg:overflow-y-auto">
          {items.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
              <Icon size={17} className="text-gold" aria-hidden />{label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-auto border-t border-white/10 px-6 py-5 text-sm text-white/65 hover:text-white">← Back to website</Link>
      </div>
    </aside>
  );
}
