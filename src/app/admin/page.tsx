import Link from "next/link";
import { prisma } from "@/server/db";
import { PageHeading, Panel, StatCard, StatusBadge, EmptyState, formatMoney, formatDate } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [openOrders, awaitingReview, pendingDocuments, completed, revenue, recent] = await Promise.all([
    prisma.order.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.application.count({ where: { status: "SUBMITTED" } }),
    prisma.applicationDocument.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({ where: { status: "PAID", createdAt: { gte: since } }, _sum: { amountCents: true } }),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: true, package: true } }),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Administration"
        title="Operations overview"
        description="ITIN filing activity, review queues, documents and revenue at a glance."
      />

      <div className="dash-grid">
        <StatCard label="Open orders" value={openOrders} />
        <StatCard label="Awaiting review" value={awaitingReview} />
        <StatCard label="Documents pending" value={pendingDocuments} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Revenue (30 days)" value={formatMoney(revenue._sum.amountCents ?? 0)} />
      </div>

      <Panel title="Recent orders">
        {recent.length ? (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td><Link href={`/admin/orders/${order.id}`}>{order.reference}</Link></td>
                    <td>
                      <Link href={`/admin/customers/${order.user.id}`} style={{ color: "inherit", textDecoration: "none" }}>{order.user.fullName}</Link>
                      <br />
                      <span style={{ color: "#9AA7B4", fontSize: "12px" }}>{order.user.email}</span>
                    </td>
                    <td>{order.package.name}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>{formatMoney(order.amountCents)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No orders yet" description="Orders will appear here once customers start purchasing packages." />
        )}
      </Panel>
    </>
  );
}
