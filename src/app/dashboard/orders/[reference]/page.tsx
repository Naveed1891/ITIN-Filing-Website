import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

export const dynamic = "force-dynamic";

function money(cents: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}`;
}

export default async function OrderDetail({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const order = await prisma.order.findFirst({
    where: { reference: decodeURIComponent(reference), userId: user.id },
    include: { package: true, application: { include: { documents: true } } },
  });
  if (!order) notFound();

  const app = order.application;
  const canWork = order.status !== "PENDING_PAYMENT";
  const submitted = app?.status === "SUBMITTED" || app?.status === "ACCEPTED";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/orders" className="text-sm font-semibold text-blue hover:underline">← Back to orders</Link>
        <h1 className="mt-2 text-2xl font-extrabold text-text-dark">{order.package.name}</h1>
        <p className="text-[13px] text-text-muted">Order {order.reference}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Order status</p>
          <div className="mt-2"><StatusBadge status={order.status} /></div>
        </div>
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Amount paid</p>
          <p className="mt-1 text-lg font-extrabold text-text-dark">{money(order.amountCents, order.currency)}</p>
        </div>
        <div className="rounded-card border border-border bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">Application</p>
          <div className="mt-2"><StatusBadge status={app?.status ?? "NOT_STARTED"} /></div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-white p-6">
        <h2 className="text-base font-bold text-text-dark">Your ITIN application</h2>
        {!canWork ? (
          <p className="mt-2 text-sm text-text-mid">Your payment is being confirmed. The application unlocks once payment is complete.</p>
        ) : submitted ? (
          <>
            <p className="mt-2 text-sm text-text-mid">Your application has been submitted. Our team is processing it and will update you here.</p>
            <Link href={`/application/${order.id}`} className="mt-4 inline-block rounded-btn border border-border-mid px-5 py-2.5 text-sm font-semibold text-text-dark hover:border-blue hover:text-blue">
              View submitted application
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-text-mid">Complete your application form and upload your documents to proceed.</p>
            <Link href={`/application/${order.id}`} className="mt-4 inline-block rounded-btn bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-mid">
              {app && app.status !== "NOT_STARTED" ? "Continue application" : "Start application"}
            </Link>
          </>
        )}
      </div>

      {app && app.documents.length > 0 ? (
        <div className="rounded-card border border-border bg-white p-6">
          <h2 className="text-base font-bold text-text-dark">Uploaded documents</h2>
          <ul className="mt-3 divide-y divide-border">
            {app.documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-dark">{doc.fileName}</p>
                  <p className="text-[12px] text-text-muted">{doc.kind} · {(doc.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <StatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
