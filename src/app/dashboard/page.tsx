import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { serializeOrder } from "@/server/serializers";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export const dynamic = "force-dynamic";

function money(amount: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${amount.toFixed(2)}`;
}

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const rows = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        include: { package: true, application: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const orders = rows.map(serializeOrder);
  const active = orders.find((o) => o.applicationStatus !== "ACCEPTED" && o.status !== "COMPLETED");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-dark">Welcome back, {user?.fullName?.split(" ")[0] ?? "there"}</h1>
        <p className="mt-1 text-sm text-text-mid">Track your ITIN application and manage your documents.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Orders</p>
          <p className="mt-1 text-2xl font-extrabold text-text-dark">{orders.length}</p>
        </div>
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Active application</p>
          <p className="mt-1 text-sm font-semibold text-text-dark">
            {active ? <StatusBadge status={active.applicationStatus} /> : "None"}
          </p>
        </div>
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Need a new ITIN?</p>
          <Link href="/packages" className="mt-1 inline-block text-sm font-bold text-blue hover:underline">
            Start a new application →
          </Link>
        </div>
      </div>

      <div className="rounded-card border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-text-dark">Recent orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-semibold text-blue hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-text-mid">You don&apos;t have any orders yet.</p>
            <Link href="/packages" className="mt-3 inline-block rounded-btn bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid">
              Browse ITIN packages
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Link href={`/dashboard/orders/${encodeURIComponent(o.reference)}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bg-light">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-dark">{o.packageName}</p>
                    <p className="text-[12px] text-text-muted">{o.reference} · {money(o.amount, o.currency)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
