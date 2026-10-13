import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { SearchBar, readQuery } from "@/components/dashboard/SearchBar";
import { PageHeading, Panel, StatCard, StatusBadge, EmptyState, formatMoney, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

const allowed = new Set(["orders", "customers", "applications", "documents", "finance", "communications", "tasks", "reports", "audit-log", "staff", "credentials"]);

function DashTable({ heads, rows }: { heads: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) return <EmptyState title="No records found" description="Nothing matches here yet. Try a different search or check back later." />;
  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Section({ title, description, children, search }: { title: string; description: string; children: React.ReactNode; search?: { q?: string; placeholder: string; href: string } }) {
  return (
    <>
      <PageHeading title={title} description={description} />
      <Panel>
        {search && <SearchBar q={search.q} placeholder={search.placeholder} clearHref={search.href} />}
        {children}
      </Panel>
    </>
  );
}

type AdminDocumentItem = {
  id: string;
  kind: string;
  fileName: string;
  storageKey: string | null;
  status: string;
  createdAt: Date;
  application: {
    user: { id: string; fullName: string; email: string };
    order: { id: string; reference: string };
  };
};

function ClientDocumentFolders({ items }: { items: AdminDocumentItem[] }) {
  if (!items.length) return <EmptyState title="No client folders" description="No documents match this search yet." />;

  const folders = Array.from(
    items.reduce((grouped, document) => {
      const client = document.application.user;
      const folder = grouped.get(client.id);
      if (folder) folder.documents.push(document);
      else grouped.set(client.id, { client, documents: [document] });
      return grouped;
    }, new Map<string, { client: AdminDocumentItem["application"]["user"]; documents: AdminDocumentItem[] }>()),
  )
    .map(([, folder]) => ({
      ...folder,
      documents: folder.documents.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || a.fileName.localeCompare(b.fileName),
      ),
    }))
    .sort((a, b) => a.client.fullName.localeCompare(b.client.fullName, undefined, { sensitivity: "base" }) || a.client.email.localeCompare(b.client.email));

  return (
    <div className="space-y-4">
      {folders.map((folder, index) => (
        <details key={folder.client.id} className="overflow-hidden rounded-xl border border-border bg-white" open={folders.length === 1 || index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-bg-light px-5 py-4 marker:content-none">
            <span className="flex min-w-0 items-center gap-3">
              <span className="text-2xl" aria-hidden="true">📁</span>
              <span className="min-w-0">
                <Link href={`/admin/customers/${folder.client.id}`} className="block truncate font-extrabold text-text-dark">{folder.client.fullName}</Link>
                <span className="block truncate text-xs text-text-mid">{folder.client.email}</span>
              </span>
            </span>
            <span className="shrink-0 rounded-full border border-border bg-white px-3 py-1 text-xs font-bold text-text-mid">{folder.documents.length} {folder.documents.length === 1 ? "document" : "documents"}</span>
          </summary>
          <div className="dash-table-wrap border-t border-border">
            <table className="dash-table">
              <thead><tr><th>File</th><th>Order</th><th>Type</th><th>Status</th><th>Uploaded</th><th>Actions</th></tr></thead>
              <tbody>
                {folder.documents.map((document) => (
                  <tr key={document.id}>
                    <td>{document.storageKey ? <a href={`/api/admin/documents/${document.id}`} target="_blank" rel="noopener noreferrer" className="dash-link"><strong>{document.fileName}</strong></a> : <strong>{document.fileName}</strong>}</td>
                    <td><Link href={`/admin/orders/${document.application.order.id}`}>{document.application.order.reference}</Link></td>
                    <td>{document.kind.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ")}</td>
                    <td><StatusBadge status={document.status} /></td>
                    <td>{formatDate(document.createdAt)}</td>
                    <td>{document.storageKey ? <span style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}><a href={`/api/admin/documents/${document.id}`} target="_blank" rel="noopener noreferrer" className="dash-link" style={{ fontSize: "12px" }}>View</a><a href={`/api/admin/documents/${document.id}?download=1`} download={document.fileName} className="dash-link" style={{ fontSize: "12px" }}>Download</a></span> : <span style={{ fontSize: "12px", color: "#9AA7B4" }}>No file stored</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function AdminSectionPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ q?: string | string[] }> }) {
  const { section } = await params;
  const q = readQuery((await searchParams).q);
  const search = (placeholder: string) => ({ q, placeholder, href: `/admin/${section}` });
  const has = (value: string) => ({ contains: value });
  if (!allowed.has(section)) notFound();
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (section === "credentials" && actor?.role !== "SUPER_ADMIN") redirect("/admin");
  if (actor.role !== "SUPER_ADMIN") {
    const access = await prisma.staffPermission.findUnique({ where: { userId_module: { userId: actor.id, module: section } } });
    if (!access?.canView) redirect("/admin");
  }

  if (section === "orders") {
    const items = await prisma.order.findMany({
      where: q ? { OR: [{ reference: has(q) }, { id: q }, { user: { fullName: has(q) } }, { user: { email: has(q) } }, { package: { name: has(q) } }] } : undefined,
      orderBy: { createdAt: "desc" }, include: { user: true, package: true }, take: 100,
    });
    return (
      <Section title="Orders" description="Track every paid ITIN service request from intake through completion." search={search("Search by order ID, customer, email or package")}>
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
    const items = await prisma.user.findMany({ where: { role: "CUSTOMER", deletedAt: null, ...(q ? { OR: [{ fullName: has(q) }, { email: has(q) }, { country: has(q) }, { whatsapp: has(q) }, { orders: { some: { reference: has(q) } } }] } : {}) }, orderBy: { createdAt: "desc" }, include: { _count: { select: { orders: true } } }, take: 100 });
    return (
      <Section title="Customers" description="Customer identities, account state and filing activity." search={search("Search by name, email, country, phone or order ID")}>
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
    const items = await prisma.application.findMany({
      where: q ? { OR: [{ order: { reference: has(q) } }, { order: { id: q } }, { user: { fullName: has(q) } }, { user: { email: has(q) } }] } : undefined,
      orderBy: { updatedAt: "desc" }, include: { user: true, order: true }, take: 100,
    });
    return (
      <Section title="Applications" description="Review W-7 application progress, submissions and change requests." search={search("Search by order ID, applicant or email")}>
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
    const items = await prisma.applicationDocument.findMany({
      where: q ? { OR: [{ fileName: has(q) }, { kind: has(q) }, { application: { order: { reference: has(q) } } }, { application: { order: { id: q } } }, { application: { user: { fullName: has(q) } } }, { application: { user: { email: has(q) } } }] } : undefined,
      orderBy: { createdAt: "desc" }, include: { application: { include: { user: true, order: true } } } });
    return (
      <Section title="Documents" description="Browse secure client folders and review uploaded ITIN evidence." search={search("Search by order ID, customer, email, type or file name")}>
        <ClientDocumentFolders items={items} />
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
    const items = await prisma.message.findMany({
      where: q ? { OR: [{ subject: has(q) }, { body: has(q) }, { order: { reference: has(q) } }] } : undefined,
      orderBy: { createdAt: "desc" }, include: { order: true }, take: 100,
    });
    const userIds = [...new Set(items.map((x) => x.userId).filter(Boolean))] as string[];
    const users = userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, fullName: true } }) : [];
    const userMap = new Map(users.map((u) => [u.id, u.fullName]));
    return (
      <Section title="Communications" description="Support messages and internal customer conversations." search={search("Search by subject, message or order ID")}>
        <DashTable heads={["From", "Direction", "Subject", "Message", "Created"]} rows={items.map((x) => [
          x.userId ? <Link key="u" href={`/admin/customers/${x.userId}`}>{userMap.get(x.userId) ?? "Customer"}</Link> : "System",
          <StatusBadge key="d" status={x.direction === "INBOUND" ? "SUBMITTED" : "COMPLETED"} />,
          <Link key="subject" href={`/admin/communications/${x.id}`}>{x.subject ?? "View message"}</Link>,
          <span key="m" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "380px" }}>{x.body}</span>,
          formatDate(x.createdAt),
        ])} />
      </Section>
    );
  }

  if (section === "tasks") {
    const items = await prisma.task.findMany({
      where: q ? { OR: [{ title: has(q) }, { detail: has(q) }, { order: { reference: has(q) } }] } : undefined,
      orderBy: [{ status: "asc" }, { dueAt: "asc" }], include: { order: true }, take: 100,
    });
    return (
      <Section title="Tasks" description="Operational work queue for reviews, follow-ups and filing actions." search={search("Search by task, detail or order ID")}>
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
    const items = await prisma.auditLog.findMany({
      where: q ? { OR: [{ action: has(q) }, { target: has(q) }] } : undefined,
      orderBy: { createdAt: "desc" }, take: 150,
    });
    return (
      <Section title="Audit log" description="Security and operational events across the platform." search={search("Search by action or target")}>
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
