"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AuthUser, ItinPackage } from "@/features/itin/types";

interface CheckoutReviewProps {
  customer: AuthUser;
  selectedPackage: ItinPackage;
  termsAccepted: boolean;
  submitting: boolean;
  error: string;
  onTermsChange: (accepted: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-t border-white/15 py-3.5 first:border-t-0">
      <dt className={strong ? "font-bold text-white" : "text-white/65"}>{label}</dt>
      <dd className={`text-right ${strong ? "text-xl font-extrabold text-white" : "font-semibold text-white"}`}>
        {value}
      </dd>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-t border-border py-3 first:border-t-0">
      <dt className="text-sm text-[#66758A]">{label}</dt>
      <dd className="min-w-0 break-words text-right text-sm font-semibold text-text-dark">{value}</dd>
    </div>
  );
}

export function CheckoutReview({
  customer,
  selectedPackage,
  termsAccepted,
  submitting,
  error,
  onTermsChange,
  onBack,
  onContinue,
}: CheckoutReviewProps) {
  const isTestMode = process.env.NODE_ENV === "development";

  return (
    <section className="mx-auto grid w-full max-w-[1240px] overflow-hidden rounded-[16px] border border-border bg-white shadow-[0_28px_80px_-52px_rgba(11,33,56,0.55)] xl:grid-cols-[42fr_58fr]">
      <div className="min-w-0 bg-[#112E51] p-6 text-white sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/brand/itinfiling-logo.png"
              alt="ITINFiling.com"
              width={4065}
              height={769}
              className="h-auto w-[150px] object-contain sm:w-[160px]"
              sizes="(max-width: 639px) 150px, 160px"
            />
          </Link>
          {isTestMode && (
            <span className="rounded-full border border-[#F2C969]/45 bg-[#F2C969]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F2C969]">
              Test mode
            </span>
          )}
        </div>

        <div className="mt-9 border-b border-white/15 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F2C969]">Order summary</p>
          <div className="mt-4 flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold leading-tight">{selectedPackage.name}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{selectedPackage.description}</p>
            </div>
            <p className="shrink-0 text-2xl font-extrabold">${selectedPackage.price}</p>
          </div>
        </div>

        <dl className="mt-2 text-sm">
          <SummaryRow label="Subtotal" value={`$${selectedPackage.price}.00 USD`} />
          <SummaryRow label="Tax, if applicable" value="Calculated at payment" />
          <SummaryRow label="Total due" value={`$${selectedPackage.price}.00 USD`} strong />
        </dl>

        <div className="mt-7 rounded-[12px] border border-white/15 bg-white/[0.05] p-5">
          <h3 className="text-sm font-bold">Included with your service</h3>
          <ul className="mt-4 space-y-3">
            {selectedPackage.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/75">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F2C969]/15 text-[#F2C969]">
                  <Check size={12} strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex items-start gap-3 border-t border-white/15 pt-6">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#F2C969]" />
          <div>
            <p className="text-sm font-bold">Secure checkout</p>
            <p className="mt-1 text-xs leading-5 text-white/60">Your payment details will be collected on Stripe&apos;s secure payment page.</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-[540px]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Secure checkout</p>
            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-text-dark sm:text-[32px]">
              Complete your order
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#66758A]">
              Review your details and service selection before continuing to secure payment.
            </p>
          </div>
          <span className="flex size-11 items-center justify-center rounded-full bg-bg-light text-navy">
            <LockKeyhole size={20} />
          </span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-[12px] border border-border p-5">
            <h2 className="text-sm font-extrabold text-text-dark">Customer details</h2>
            <dl className="mt-3">
              <DetailRow label="Full name" value={customer.fullName} />
              <DetailRow label="Email" value={customer.email} />
              <DetailRow label="WhatsApp" value={customer.whatsapp} />
              <DetailRow label="Country" value={customer.country} />
            </dl>
          </section>

          <section className="rounded-[12px] border border-border p-5">
            <h2 className="text-sm font-extrabold text-text-dark">Billing details</h2>
            <dl className="mt-3">
              <DetailRow label="Billing name" value={customer.fullName} />
              <DetailRow label="Billing country" value={customer.country} />
              <DetailRow label="Selected package" value={selectedPackage.name} />
              <DetailRow label="Currency" value="USD" />
            </dl>
          </section>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[12px] border border-border bg-bg-light/60 p-4">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => onTermsChange(event.target.checked)}
            className="mt-1 size-4 shrink-0 accent-[#205493]"
          />
          <span className="text-sm leading-6 text-text-mid">
            I agree to the terms of service and understand the{" "}
            <Link href="/privacy-policy" className="font-semibold text-blue hover:underline">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/refund-policy" className="font-semibold text-blue hover:underline">Refund Policy</Link>.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 rounded-[12px] border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <LockKeyhole size={17} className="shrink-0 text-blue" />
              <div>
                <p className="text-sm font-bold text-text-dark">Secure payment powered by Stripe</p>
                <p className="text-xs text-[#66758A]">Payment information is entered on the next step.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5" aria-label="Accepted card brands">
              {["VISA", "MC", "AMEX"].map((brand) => (
                <span key={brand} className="rounded border border-border bg-white px-2 py-1 text-[9px] font-extrabold text-navy">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="text" size="md" onClick={onBack} disabled={submitting} className="text-[#66758A]">
            <ChevronLeft size={16} /> Back to details
          </Button>
          <Button
            type="button"
            size="md"
            onClick={onContinue}
            disabled={!termsAccepted || submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <CreditCard size={16} />}
            {submitting ? "Continuing…" : "Continue to secure payment"}
          </Button>
        </div>
      </div>
    </section>
  );
}
