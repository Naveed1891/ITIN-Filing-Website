"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileUp,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api-client";
import { customerDashboardUrl, customerOrderDetailUrl } from "@/lib/customer-dashboard-url";
import type { ItinOrder } from "@/features/itin/types";

type CheckoutPollStatus = "pending" | "paid" | "application_ready" | "failed";

type CheckoutStatusResponse = {
  status: CheckoutPollStatus;
  paymentStatus?: string;
  orderReference?: string | null;
  applicationStatus?: string;
  applicationUnlocked?: boolean;
  nextUrl?: string | null;
  message?: string;
  order: ItinOrder | null;
};

function ConfirmationRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 border-t border-border py-3.5 first:border-t-0">
      <dt className="text-sm text-[#66758A]">{label}</dt>
      <dd className={`min-w-0 break-words text-right text-sm font-bold ${accent ? "text-blue" : "text-text-dark"}`}>
        {value}
      </dd>
    </div>
  );
}

const nextActions = [
  {
    title: "Start your application",
    description: "Enter the information required for your ITIN application.",
    icon: Play,
  },
  {
    title: "Upload required documents",
    description: "Add the files required for your selected application option.",
    icon: FileUp,
  },
  {
    title: "Submit for review",
    description: "Review your details and send the completed application.",
    icon: ClipboardCheck,
  },
];

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<ItinOrder | null>(null);
  const [status, setStatus] = useState<CheckoutPollStatus | "UNKNOWN">("UNKNOWN");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isTestMode = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!sessionId) {
      const timer = window.setTimeout(() => {
        setLoading(false);
        setError("Stripe session id is missing.");
      }, 0);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40;
    async function poll() {
      attempts += 1;
      try {
        const result = await apiFetch<CheckoutStatusResponse>(
          `/api/checkout/status?session_id=${encodeURIComponent(sessionId!)}`,
        );
        if (cancelled) return;
        setStatus(result.status);
        if (result.applicationUnlocked && result.nextUrl && !result.order) {
          window.location.assign(result.nextUrl);
          return;
        }
        if (result.order) {
          setOrder(result.order);
          setLoading(false);
          if (result.nextUrl) {
            window.setTimeout(() => {
              if (!cancelled) window.location.assign(result.nextUrl!);
            }, 1200);
          }
          return;
        }
        if (result.status === "failed") {
          setLoading(false);
          setError(result.message ?? "This checkout session could not be completed.");
          return;
        }
        if (attempts >= maxAttempts) {
          setLoading(false);
          setError(
            result.message ??
              "Payment was received, but your application is still being prepared. Refresh this page in a moment.",
          );
          return;
        }
        window.setTimeout(poll, 1500);
      } catch (cause) {
        if (cancelled) return;
        if (attempts < maxAttempts) {
          window.setTimeout(poll, 1500);
          return;
        }
        setLoading(false);
        setError(cause instanceof Error ? cause.message : "Unable to confirm your order.");
      }
    }
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <main className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 md:py-14">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center gap-3 text-sm text-[#66758A]" role="status">
            <LoaderCircle className="animate-spin text-blue" /> Confirming your order...
          </div>
        ) : !order ? (
          <div className="mx-auto max-w-[560px] rounded-[16px] border border-border bg-white p-7 text-center shadow-[0_24px_70px_-48px_rgba(11,33,56,0.5)] sm:p-9">
            <LockKeyhole className="mx-auto text-navy" size={34} />
            <h1 className="mt-4 text-2xl font-extrabold text-text-dark">Order not ready yet</h1>
            <p className="mt-2 text-sm leading-6 text-[#66758A]">{error || `Current status: ${status}`}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="md" onClick={() => window.location.reload()}>
                Refresh page
              </Button>
              <Link href={customerDashboardUrl("/dashboard/orders")} className="inline-flex items-center justify-center">
                <Button size="md" variant="outline">
                  My orders
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <article className="animate-step-in overflow-hidden rounded-[16px] border border-border bg-white shadow-[0_28px_80px_-52px_rgba(11,33,56,0.55)]">
            <div className="px-5 pb-8 pt-8 text-center sm:px-9 sm:pt-10">
              <div className="animate-pop-in relative mx-auto flex size-16 items-center justify-center rounded-full bg-[#F2C969]/30 text-[#112E51] ring-1 ring-[#F2C969]/70 shadow-[0_14px_32px_-14px_rgba(242,201,105,0.7)]">
                <Check size={29} strokeWidth={3} />
              </div>
              {isTestMode && (
                <span className="mt-4 inline-flex rounded-full border border-border bg-bg-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#66758A]">
                  Test mode
                </span>
              )}
              <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em] text-text-dark sm:text-[32px]">
                Payment successful
              </h1>
              <p className="mx-auto mt-3 max-w-[600px] text-sm leading-6 text-[#66758A] sm:text-[15px]">
                Your order has been confirmed by Stripe and your ITIN application is ready to begin.
              </p>
            </div>

            <div className="grid gap-6 border-t border-border p-5 sm:p-8 md:grid-cols-[1.08fr_0.92fr]">
              <section className="rounded-[12px] border border-border p-5">
                <h2 className="text-sm font-extrabold text-text-dark">Order confirmation</h2>
                <dl className="mt-3">
                  <ConfirmationRow label="Order reference" value={order.reference} />
                  <ConfirmationRow label="Package" value={order.packageName} />
                  <ConfirmationRow label="Amount paid" value={`$${order.amount}.00 ${order.currency}`} />
                  <ConfirmationRow label="Payment status" value="Paid" accent />
                  <ConfirmationRow label="Customer email" value={order.user?.email ?? "Your account"} />
                  <ConfirmationRow label="Account status" value="Ready" accent />
                  <ConfirmationRow label="Next step" value="Start your ITIN application" />
                </dl>
              </section>

              <section className="rounded-[12px] border border-blue/20 bg-blue/[0.035] p-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-white text-blue ring-1 ring-blue/15">
                  <KeyRound size={18} />
                </span>
                <h2 className="mt-4 text-lg font-extrabold text-text-dark">Your application is unlocked</h2>
                <p className="mt-2 text-sm leading-6 text-[#66758A]">
                  You can begin your application now and return later from Track Order.
                </p>
                {isTestMode && (
                  <p className="mt-3 text-xs leading-5 text-[#66758A]">
                    Test mode does not send account-access email.
                  </p>
                )}
              </section>
            </div>

            <section className="border-t border-border px-5 py-7 sm:px-8">
              <h2 className="text-sm font-extrabold text-text-dark">What happens next</h2>
              <ol className="mt-5 grid gap-4 md:grid-cols-3">
                {nextActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <li
                      key={action.title}
                      className="relative min-w-0 rounded-[12px] border border-border p-4 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-gold/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-light text-navy">
                          <Icon size={17} />
                        </span>
                        <span className="text-xs font-extrabold text-blue">0{index + 1}</span>
                      </div>
                      <h3 className="mt-3 text-sm font-extrabold text-text-dark">{action.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#66758A]">{action.description}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="flex flex-col gap-3 border-t border-border bg-bg-light/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <Link
                href={customerOrderDetailUrl(order)}
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#66758A] hover:text-navy hover:underline"
              >
                View order in dashboard <ArrowRight size={15} />
              </Link>
              <Link href={`/application/${order.id}`} className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Start ITIN application
                </Button>
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
