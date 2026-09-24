import Link from "next/link";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { serializeOrder } from "@/server/serializers";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SearchBar, readQuery } from "@/components/dashboard/SearchBar";

export const dynamic = "force-dynamic";

function money(amount: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${amount.toFixed(2)}`;
}

export default async function DashboardOrders({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const q = readQuery((await searchParams).q);
  const user = await getCurrentUser();
  const rows = user
    ? await prisma.order.findMany({
        where: { userId: user.id, ...(q ? { OR: [{ reference: { contains: q } }, { package: { name: { contains: q } } }] } : {}) },
        include: { package: true, application: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const orders = rows.map(serializeOrder);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-text-dark">My Orders</h1>

      <SearchBar q={q} placeholder="Search by order ID or package" clearHref="/dashboard/orders" />

      {orders.length === 0 ? (
        <div className="rounded-card border border-border bg-white px-5 py-12 text-center">
          <p className="text-sm text-text-mid">{q ? "No orders match your search." : "No orders yet."}</p>
          <Link href="/packages" className="mt-3 inline-block rounded-btn bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid">
            Browse ITIN packages
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-bg-light text-[12px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Application</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-bg-light">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-text-dark">{o.packageName}</p>
                    <p className="text-[12px] text-text-muted">{o.reference}</p>
                  </td>
                  <td className="px-5 py-4 text-text-dark">{money(o.amount, o.currency)}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-4"><StatusBadge status={o.applicationStatus} /></td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/dashboard/orders/${encodeURIComponent(o.reference)}`} className="font-semibold text-blue hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
