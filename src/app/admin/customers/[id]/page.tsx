import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { PageHeading, Panel, StatusBadge, formatMoney, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(actor.role)) redirect("/admin");

  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    include: {
      orders: { orderBy: { createdAt: "desc" }, include: { package: true } },
      applications: { orderBy: { updatedAt: "desc" }, include: { order: true, documents: true } },
    },
  });
  if (!customer || customer.deletedAt) notFound();

  return (
    <>
      <PageHeading
        eyebrow={<Link href="/admin/customers" className="dash-back-link">&larr; All customers</Link>}
        title={customer.fullName}
        description={customer.email}
        action={<StatusBadge status={customer.status} />}
      />

      <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="dash-stat"><span className="dash-stat__label">Orders</span><span className="dash-stat__value">{customer.orders.length}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Applications</span><span className="dash-stat__value">{customer.applications.length}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Total spent</span><span className="dash-stat__value">{formatMoney(customer.orders.reduce((s, o) => s + o.amountCents, 0))}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Joined</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}>{formatDate(customer.createdAt)}</span></div>
      </div>

      <Panel title="Profile">
        <dl className="dash-dl">
          <div><dt>Full name</dt><dd>{customer.fullName}</dd></div>
          <div><dt>Email</dt><dd>{customer.email}</dd></div>
          <div><dt>WhatsApp</dt><dd>{customer.whatsapp}</dd></div>
          <div><dt>Country</dt><dd>{customer.country}</dd></div>
          <div><dt>Email verified</dt><dd>{customer.emailVerifiedAt ? formatDate(customer.emailVerifiedAt) : "Not verified"}</dd></div>
          <div><dt>Status</dt><dd><StatusBadge status={customer.status} /></dd></div>
        </dl>
      </Panel>

      <Panel title="Orders">
        {customer.orders.length > 0 ? (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Reference</th><th>Package</th><th>Status</th><th>Amount</th><th>Created</th></tr></thead>
              <tbody>
                {customer.orders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.id}`} className="dash-link">{o.reference}</Link></td>
                    <td>{o.package.name}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{formatMoney(o.amountCents)}</td>
                    <td>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dash-empty__text">No orders yet.</p>
        )}
      </Panel>

      {customer.applications.length > 0 && (
        <Panel title="Applications">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Order</th><th>Status</th><th>Documents</th><th>Submitted</th><th>Updated</th></tr></thead>
              <tbody>
                {customer.applications.map((a) => (
                  <tr key={a.id}>
                    <td><Link href={`/admin/orders/${a.order.id}`} className="dash-link">{a.order.reference}</Link></td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>{a.documents.length}</td>
                    <td>{a.submittedAt ? formatDate(a.submittedAt) : "—"}</td>
                    <td>{formatDate(a.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </>
  );
}
