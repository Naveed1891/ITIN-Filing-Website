import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { DashboardTitle, EmptyRow, Panel, StatCard, StatusPill } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";
const allowed = new Set(["orders", "customers", "applications", "documents", "finance", "packages", "communications", "tasks", "reports", "audit-log", "staff", "credentials"]);
const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const Table = ({ heads, rows }: { heads: string[]; rows: React.ReactNode[][] }) => rows.length ? <table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="text-xs uppercase tracking-wider text-text-muted">{heads.map((h) => <th key={h} className="pb-4 pr-5">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-t border-border">{row.map((cell, j) => <td key={j} className="py-4 pr-5 align-top">{cell}</td>)}</tr>)}</tbody></table> : <EmptyRow message="No records found." />;

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!allowed.has(section)) notFound();
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (section === "credentials" && actor?.role !== "SUPER_ADMIN") redirect("/admin");
  if (actor.role !== "SUPER_ADMIN") {
    const access = await prisma.staffPermission.findUnique({ where: { userId_module: { userId: actor.id, module: section } } });
    if (!access?.canView) redirect("/admin");
  }

  if (section === "orders") {
    const items = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: true, package: true }, take: 100 });
    return <Module title="Orders" description="Track every paid ITIN service request from intake through completion."><Table heads={["Reference", "Customer", "Package", "Status", "Amount", "Created"]} rows={items.map((x) => [<b key="r">{x.reference}</b>, <span key="u">{x.user.fullName}<small className="block text-text-muted">{x.user.email}</small></span>, x.package.name, <StatusPill key="s" value={x.status} />, money(x.amountCents), x.createdAt.toLocaleDateString()])} /></Module>;
  }
  if (section === "customers") {
    const items = await prisma.user.findMany({ where: { role: "CUSTOMER", deletedAt: null }, orderBy: { createdAt: "desc" }, include: { _count: { select: { orders: true } } }, take: 100 });
    return <Module title="Customers" description="Customer identities, account state and filing activity."><Table heads={["Customer", "Email", "Country", "WhatsApp", "Orders", "Status"]} rows={items.map((x) => [<b key="n">{x.fullName}</b>, x.email, x.country, x.whatsapp, x._count.orders, <StatusPill key="s" value={x.status} />])} /></Module>;
  }
  if (section === "applications") {
    const items = await prisma.application.findMany({ orderBy: { updatedAt: "desc" }, include: { user: true, order: true }, take: 100 });
    return <Module title="Applications" description="Review W-7 application progress, submissions and change requests."><Table heads={["Order", "Applicant", "Status", "Declaration", "Submitted", "Updated"]} rows={items.map((x) => [x.order.reference, <span key="u">{x.user.fullName}<small className="block text-text-muted">{x.user.email}</small></span>, <StatusPill key="s" value={x.status} />, x.declarationAccepted ? "Accepted" : "Pending", x.submittedAt?.toLocaleDateString() ?? "—", x.updatedAt.toLocaleDateString()])} /></Module>;
  }
  if (section === "documents") {
    const items = await prisma.applicationDocument.findMany({ orderBy: { createdAt: "desc" }, include: { application: { include: { user: true, order: true } } }, take: 100 });
    return <Module title="Documents" description="Review customer uploads and document approval status."><Table heads={["File", "Customer", "Order", "Type", "Status", "Uploaded"]} rows={items.map((x) => [<b key="f">{x.fileName}</b>, x.application.user.fullName, x.application.order.reference, x.kind, <StatusPill key="s" value={x.status} />, x.createdAt.toLocaleDateString()])} /></Module>;
  }
  if (section === "finance") {
    const items = await prisma.payment.findMany({ orderBy: { createdAt: "desc" }, include: { order: true, refunds: true }, take: 100 });
    const totals = await prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } });
    return <div className="space-y-8"><DashboardTitle title="Finance" description="Payments, refunds and collected revenue." /><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Collected revenue" value={money(totals._sum.amountCents ?? 0)} /><StatCard label="Payments" value={items.length} /><StatCard label="Refund records" value={items.reduce((n, x) => n + x.refunds.length, 0)} /></div><Panel title="Transactions"><Table heads={["Order", "Provider", "Status", "Amount", "Refunds", "Created"]} rows={items.map((x) => [x.order.reference, x.provider, <StatusPill key="s" value={x.status} />, money(x.amountCents), x.refunds.length, x.createdAt.toLocaleDateString()])} /></Panel></div>;
  }
  if (section === "packages") {
    const items = await prisma.formPackage.findMany({ orderBy: { priceCents: "asc" }, include: { _count: { select: { orders: true } } } });
    return <Module title="Packages" description="ITIN service catalogue, pricing and order uptake."><Table heads={["Package", "Slug", "Price", "Currency", "Orders", "Status"]} rows={items.map((x) => [<b key="n">{x.name}</b>, x.slug, money(x.priceCents), x.currency, x._count.orders, <StatusPill key="s" value={x.isActive ? "ACTIVE" : "INACTIVE"} />])} /></Module>;
  }
  if (section === "communications") {
    const items = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, include: { order: true }, take: 100 });
    return <Module title="Communications" description="Email, WhatsApp and internal customer conversations."><Table heads={["Channel", "Direction", "Subject", "Order", "Message", "Created"]} rows={items.map((x) => [x.channel, x.direction, x.subject ?? "—", x.order?.reference ?? "—", <span key="m" className="line-clamp-2 max-w-md">{x.body}</span>, x.createdAt.toLocaleDateString()])} /></Module>;
  }
  if (section === "tasks") {
    const items = await prisma.task.findMany({ orderBy: [{ status: "asc" }, { dueAt: "asc" }], include: { order: true }, take: 100 });
    return <Module title="Tasks" description="Operational work queue for reviews, follow-ups and filing actions."><Table heads={["Task", "Order", "Status", "Due", "Detail"]} rows={items.map((x) => [<b key="t">{x.title}</b>, x.order?.reference ?? "—", <StatusPill key="s" value={x.status} />, x.dueAt?.toLocaleDateString() ?? "—", x.detail ?? "—"]) } /></Module>;
  }
  if (section === "audit-log") {
    const items = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 150 });
    return <Module title="Audit log" description="Security and operational events across the platform."><Table heads={["Action", "Actor", "Target", "Details", "Created"]} rows={items.map((x) => [<b key="a">{x.action}</b>, x.actorId ? "Authorized staff" : "System", x.target ?? "—", x.metaJson ? "Additional event details recorded" : "—", x.createdAt.toLocaleString()])} /></Module>;
  }
  if (section === "staff") {
    const items = await prisma.user.findMany({ where: { role: { in: ["STAFF", "ADMIN", "SUPER_ADMIN"] }, deletedAt: null }, orderBy: { createdAt: "desc" } });
    return <Module title="Staff" description="Internal operators and administrative access levels."><Table heads={["Name", "Email", "Role", "Status", "Created"]} rows={items.map((x) => [<b key="n">{x.fullName}</b>, x.email, <StatusPill key="r" value={x.role} />, <StatusPill key="s" value={x.status} />, x.createdAt.toLocaleDateString()])} /></Module>;
  }
  if (section === "credentials") {
    const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
    return <Module title="Credentials" description="Runtime integration configuration. Secret values are never displayed."><Table heads={["Setting", "Configuration", "Updated"]} rows={settings.map((x) => [<b key="k">{x.key}</b>, <StatusPill key="s" value="CONFIGURED" />, x.updatedAt.toLocaleString()])} /></Module>;
  }
  const [orders, customers, applications, documents, revenue] = await Promise.all([prisma.order.count(), prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }), prisma.application.count(), prisma.applicationDocument.count(), prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } })]);
  return <div className="space-y-8"><DashboardTitle title="Reports" description="Live operational totals for the ITIN filing service." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Orders" value={orders} /><StatCard label="Customers" value={customers} /><StatCard label="Applications" value={applications} /><StatCard label="Documents" value={documents} /><StatCard label="Revenue" value={money(revenue._sum.amountCents ?? 0)} /></div></div>;
}

function Module({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <div className="space-y-8"><DashboardTitle title={title} description={description} /><Panel title={title}>{children}</Panel></div>; }
