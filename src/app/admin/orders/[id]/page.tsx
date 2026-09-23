import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { getCurrentUser } from "@/server/auth";
import { PageHeading, Panel, StatusBadge, formatMoney, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await getCurrentUser();
  if (!actor) redirect("/login?returnTo=/admin");
  if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(actor.role)) redirect("/admin");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      package: true,
      application: { include: { documents: true } },
      payments: { include: { refunds: true } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) notFound();

  return (
    <>
      <PageHeading
        eyebrow={<Link href="/admin/orders" className="dash-back-link">&larr; All orders</Link>}
        title={`Order ${order.reference}`}
        description={`${order.package.name} · ${order.user.fullName}`}
        action={<StatusBadge status={order.status} />}
      />

      <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="dash-stat"><span className="dash-stat__label">Amount</span><span className="dash-stat__value">{formatMoney(order.amountCents)}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Currency</span><span className="dash-stat__value">{order.currency}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Created</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}>{formatDate(order.createdAt)}</span></div>
        <div className="dash-stat"><span className="dash-stat__label">Updated</span><span className="dash-stat__value" style={{ fontSize: "1rem" }}>{formatDate(order.updatedAt)}</span></div>
      </div>

      <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <Panel title="Customer">
          <dl className="dash-dl">
            <div><dt>Name</dt><dd><Link href={`/admin/customers/${order.user.id}`} className="dash-link">{order.user.fullName}</Link></dd></div>
            <div><dt>Email</dt><dd>{order.user.email}</dd></div>
            <div><dt>WhatsApp</dt><dd>{order.user.whatsapp}</dd></div>
            <div><dt>Country</dt><dd>{order.user.country}</dd></div>
          </dl>
        </Panel>

        <Panel title="Package">
          <dl className="dash-dl">
            <div><dt>Service</dt><dd>{order.package.name}</dd></div>
            <div><dt>Slug</dt><dd>{order.package.slug}</dd></div>
            <div><dt>Price</dt><dd>{formatMoney(order.package.priceCents)} {order.package.currency}</dd></div>
          </dl>
        </Panel>
      </div>

      {order.payments.length > 0 && (
        <Panel title="Payments">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Provider</th><th>Status</th><th>Amount</th><th>Refunds</th><th>Date</th></tr></thead>
              <tbody>
                {order.payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.provider}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{formatMoney(p.amountCents)}</td>
                    <td>{p.refunds.length}</td>
                    <td>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {order.application && (
        <Panel title="Application">
          <dl className="dash-dl">
            <div><dt>Status</dt><dd><StatusBadge status={order.application.status} /></dd></div>
            <div><dt>Declaration</dt><dd>{order.application.declarationAccepted ? "Accepted" : "Pending"}</dd></div>
            <div><dt>Submitted</dt><dd>{order.application.submittedAt ? formatDate(order.application.submittedAt) : "Not yet"}</dd></div>
            <div><dt>Last updated</dt><dd>{formatDate(order.application.updatedAt)}</dd></div>
          </dl>
          {order.application.documents.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, marginBottom: "0.5rem" }}>Documents ({order.application.documents.length})</h3>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead><tr><th>File</th><th>Type</th><th>Status</th><th>Uploaded</th></tr></thead>
                  <tbody>
                    {order.application.documents.map((d) => (
                      <tr key={d.id}>
                        <td><strong>{d.fileName}</strong></td>
                        <td>{d.kind}</td>
                        <td><StatusBadge status={d.status} /></td>
                        <td>{formatDate(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Panel>
      )}

      {order.statusHistory.length > 0 && (
        <Panel title="Status history">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>From</th><th>To</th><th>Note</th><th>Date</th></tr></thead>
              <tbody>
                {order.statusHistory.map((h) => (
                  <tr key={h.id}>
                    <td>{h.fromStatus ? <StatusBadge status={h.fromStatus} /> : "—"}</td>
                    <td><StatusBadge status={h.toStatus} /></td>
                    <td>{h.note ?? "—"}</td>
                    <td>{formatDate(h.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {order.tasks.length > 0 && (
        <Panel title="Tasks">
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Task</th><th>Status</th><th>Due</th><th>Detail</th></tr></thead>
              <tbody>
                {order.tasks.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.dueAt ? formatDate(t.dueAt) : "—"}</td>
                    <td>{t.detail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {order.notes.length > 0 && (
        <Panel title="Internal notes">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {order.notes.map((n) => (
              <div key={n.id} style={{ padding: "0.75rem 1rem", background: "#F7F4EF", borderRadius: "10px", fontSize: "14px" }}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.body}</p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "12px", color: "#9AA7B4" }}>{formatDate(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}
