import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { PageHeading, Panel, StatCard, StatusBadge, EmptyState, formatMoney, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

const allowed = new Set(["orders", "customers", "applications", "documents", "finance", "communications", "tasks", "reports", "audit-log", "staff", "credentials"]);

function DashTable({ heads, rows }: { heads: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) return <EmptyState title="No records found" description="This section is empty." />;
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeading title={title} description={description} />
      <Panel>{children}</Panel>
    </>
  );
}

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
    return (
      <Section title="Orders" description="Track every paid ITIN service request from intake through completion.">
        <DashTable heads={["Reference", "Customer", "Package", "Status", "Amount", "Created"]} rows={items.map((x) => [
          <Link key="r" href={`/admin/orders/${x.id}`}>{x.reference}</Link>,
          <Link key="u" href={`/admin/customers/${x.user.id}`} style={{ color: "inherit", textDecoration: "none" }}>{x.user.fullName}<br /><span style={{ color: "#9AA7B4", fontSize: "12px" }}>{x.user.email}</span></Link>,
          x.package.name,
          <StatusBadge key="s" status={x.status} />,
          formatMoney(x.amountCents),
          formatDate(x.createdAt),
        ])} />
      </Section>
    );
  }

  if (section === "customers") {
    const items = await prisma.user.findMany({ where: { role: "CUSTOMER", deletedAt: null }, orderBy: { createdAt: "desc" }, include: { _count: { select: { orders: true } } }, take: 100 });
    return (
      <Section title="Customers" description="Customer identities, account state and filing activity.">
        <DashTable heads={["Customer", "Email", "Country", "WhatsApp", "Orders", "Status"]} rows={items.map((x) => [
          <Link key="n" href={`/admin/customers/${x.id}`}><strong>{x.fullName}</strong></Link>,
          x.email,
          x.country,
          x.whatsapp,
          x._count.orders,
          <StatusBadge key="s" status={x.status} />,
        ])} />
      </Section>
    );
  }

  if (section === "applications") {
    const items = await prisma.application.findMany({ orderBy: { updatedAt: "desc" }, include: { user: true, order: true }, take: 100 });
    return (
      <Section title="Applications" description="Review W-7 application progress, submissions and change requests.">
        <DashTable heads={["Order", "Applicant", "Status", "Declaration", "Submitted", "Updated"]} rows={items.map((x) => [
          <Link key="o" href={`/admin/orders/${x.order.id}`}>{x.order.reference}</Link>,
          <Link key="u" href={`/admin/customers/${x.user.id}`} style={{ color: "inherit", textDecoration: "none" }}>{x.user.fullName}<br /><span style={{ color: "#9AA7B4", fontSize: "12px" }}>{x.user.email}</span></Link>,
          <StatusBadge key="s" status={x.status} />,
          x.declarationAccepted ? "Accepted" : "Pending",
          x.submittedAt ? formatDate(x.submittedAt) : "—",
          formatDate(x.updatedAt),
        ])} />
      </Section>
    );
  }

  if (section === "documents") {
    const items = await prisma.applicationDocument.findMany({ orderBy: { createdAt: "desc" }, include: { application: { include: { user: true, order: true } } }, take: 100 });
    return (
      <Section title="Documents" description="Review customer uploads and document approval status.">
        <DashTable heads={["File", "Customer", "Order", "Type", "Status", "Uploaded"]} rows={items.map((x) => [
          <strong key="f">{x.fileName}</strong>,
          <Link key="u" href={`/admin/customers/${x.application.user.id}`}>{x.application.user.fullName}</Link>,
          <Link key="o" href={`/admin/orders/${x.application.order.id}`}>{x.application.order.reference}</Link>,
          x.kind,
          <StatusBadge key="s" status={x.status} />,
          formatDate(x.createdAt),
        ])} />
      </Section>
    );
  }

  if (section === "finance") {
    const items = await prisma.payment.findMany({ orderBy: { createdAt: "desc" }, include: { order: true, refunds: true }, take: 100 });
    const totals = await prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } });
    return (
      <>
        <PageHeading title="Finance" description="Payments, refunds and collected revenue." />
        <div className="dash-grid">
          <StatCard label="Collected revenue" value={formatMoney(totals._sum.amountCents ?? 0)} />
          <StatCard label="Payments" value={items.length} />
          <StatCard label="Refund records" value={items.reduce((n, x) => n + x.refunds.length, 0)} />
        </div>
        <Panel title="Transactions">
          <DashTable heads={["Order", "Provider", "Status", "Amount", "Refunds", "Created"]} rows={items.map((x) => [
            x.order.reference,
            x.provider,
            <StatusBadge key="s" status={x.status} />,
            formatMoney(x.amountCents),
            x.refunds.length,
            formatDate(x.createdAt),
          ])} />
        </Panel>
      </>
    );
  }

  // "packages" is handled by the dedicated admin/packages/page.tsx route

  if (section === "communications") {
    const items = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, include: { order: true }, take: 100 });
    const userIds = [...new Set(items.map((x) => x.userId).filter(Boolean))] as string[];
    const users = userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, fullName: true } }) : [];
    const userMap = new Map(users.map((u) => [u.id, u.fullName]));
    return (
      <Section title="Communications" description="Support messages and internal customer conversations.">
        <DashTable heads={["From", "Direction", "Subject", "Message", "Created"]} rows={items.map((x) => [
          x.userId ? <Link key="u" href={`/admin/customers/${x.userId}`}>{userMap.get(x.userId) ?? "Customer"}</Link> : "System",
          <StatusBadge key="d" status={x.direction === "INBOUND" ? "SUBMITTED" : "COMPLETED"} />,
          x.subject ?? "—",
          <span key="m" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "380px" }}>{x.body}</span>,
          formatDate(x.createdAt),
        ])} />
      </Section>
    );
  }

  if (section === "tasks") {
    const items = await prisma.task.findMany({ orderBy: [{ status: "asc" }, { dueAt: "asc" }], include: { order: true }, take: 100 });
    return (
      <Section title="Tasks" description="Operational work queue for reviews, follow-ups and filing actions.">
        <DashTable heads={["Task", "Order", "Status", "Due", "Detail"]} rows={items.map((x) => [
          <strong key="t">{x.title}</strong>,
          x.order?.reference ?? "—",
          <StatusBadge key="s" status={x.status} />,
          x.dueAt ? formatDate(x.dueAt) : "—",
          x.detail ?? "—",
        ])} />
      </Section>
    );
  }

  if (section === "audit-log") {
    const items = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 150 });
    return (
      <Section title="Audit log" description="Security and operational events across the platform.">
        <DashTable heads={["Action", "Actor", "Target", "Details", "Created"]} rows={items.map((x) => [
          <strong key="a">{x.action}</strong>,
          x.actorId ? "Authorized staff" : "System",
          x.target ?? "—",
          x.metaJson ? "Additional event details recorded" : "—",
          new Date(x.createdAt).toLocaleString(),
        ])} />
      </Section>
    );
  }

  if (section === "staff") {
    const items = await prisma.user.findMany({ where: { role: { in: ["STAFF", "ADMIN", "SUPER_ADMIN"] }, deletedAt: null }, orderBy: { createdAt: "desc" } });
    return (
      <Section title="Staff" description="Internal operators and administrative access levels.">
        <DashTable heads={["Name", "Email", "Role", "Status", "Created"]} rows={items.map((x) => [
          <strong key="n">{x.fullName}</strong>,
          x.email,
          <StatusBadge key="r" status={x.role} />,
          <StatusBadge key="s" status={x.status} />,
          formatDate(x.createdAt),
        ])} />
      </Section>
    );
  }

  if (section === "credentials") {
    const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
    return (
      <Section title="Credentials" description="Runtime integration configuration. Secret values are never displayed.">
        <DashTable heads={["Setting", "Configuration", "Updated"]} rows={settings.map((x) => [
          <strong key="k">{x.key}</strong>,
          <StatusBadge key="s" status="CONFIGURED" />,
          new Date(x.updatedAt).toLocaleString(),
        ])} />
      </Section>
    );
  }

  const [orders, customers, applications, documents, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER", deletedAt: null } }),
    prisma.application.count(),
    prisma.applicationDocument.count(),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountCents: true } }),
  ]);

  return (
    <>
      <PageHeading title="Reports" description="Live operational totals for the ITIN filing service." />
      <div className="dash-grid">
        <StatCard label="Orders" value={orders} />
        <StatCard label="Customers" value={customers} />
        <StatCard label="Applications" value={applications} />
        <StatCard label="Documents" value={documents} />
        <StatCard label="Revenue" value={formatMoney(revenue._sum.amountCents ?? 0)} />
      </div>
    </>
  );
}
