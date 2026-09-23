import Link from "next/link";
import { prisma } from "@/server/db";
import { DashboardTitle, EmptyRow, Panel, StatCard, StatusPill } from "@/components/dashboard/DashboardPrimitives";

export const dynamic = "force-dynamic";

function thirtyDaysAgo() {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
}

export default async function AdminOverviewPage() {
  const since = thirtyDaysAgo();
  const [openOrders, awaitingReview, pendingDocuments, completed, revenue, recent] = await Promise.all([
    prisma.order.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    prisma.application.count({ where: { status: "SUBMITTED" } }),
    prisma.applicationDocument.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({ where: { status: "PAID", createdAt: { gte: since } }, _sum: { amountCents: true } }),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: true, package: true } }),
  ]);
  return <div className="space-y-8"><DashboardTitle title="Operations overview" description="ITIN filing activity, review queues, documents and revenue at a glance." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Open orders" value={openOrders} /><StatCard label="Awaiting review" value={awaitingReview} /><StatCard label="Documents pending" value={pendingDocuments} /><StatCard label="Completed" value={completed} /><StatCard label="Revenue (30 days)" value={`$${((revenue._sum.amountCents ?? 0) / 100).toFixed(2)}`} /></div><Panel title="Recent orders">{recent.length ? <table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-text-muted"><tr><th className="pb-4">Reference</th><th>Customer</th><th>Service</th><th>Status</th><th>Amount</th><th>Created</th></tr></thead><tbody>{recent.map((order) => <tr key={order.id} className="border-t border-border"><td className="py-4 font-bold"><Link className="text-blue hover:underline" href={`/admin/orders`}>{order.reference}</Link></td><td>{order.user.fullName}<span className="block text-xs text-text-muted">{order.user.email}</span></td><td>{order.package.name}</td><td><StatusPill value={order.status} /></td><td>${(order.amountCents / 100).toFixed(2)}</td><td>{order.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table> : <EmptyRow message="No orders yet." />}</Panel></div>;
}
