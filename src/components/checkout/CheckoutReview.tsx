"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  CreditCard,
  FileImage,
  FileText,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Upload,
  X,
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
  onContinue: (proof: File) => void;
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_SIZE = 5 * 1024 * 1024;

function ProofUpload({
  proof,
  onSelect,
  disabled,
}: {
  proof: File | null;
  onSelect: (file: File | null) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!proof || !proof.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(proof);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const validate = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Only PDF, PNG, or JPEG files are accepted.";
    if (file.size > MAX_SIZE) return `File is too large (${formatFileSize(file.size)}). Maximum is 5 MB.`;
    return null;
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    const err = validate(file);
    if (err) {
      setFileError(err);
      onSelect(null);
    } else {
      setFileError("");
      onSelect(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  }

  if (proof) {
    const isImage = proof.type.startsWith("image/");
    return (
      <div className="mt-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#66758A]">Payment proof</p>
        <div className="flex items-start gap-4 rounded-[12px] border border-blue/25 bg-blue/[0.03] p-4">
          {isImage && preview ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
              <img src={preview} alt="Proof preview" className="size-full object-cover" />
            </div>
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-blue">
              <FileText size={28} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-dark">{proof.name}</p>
            <p className="mt-0.5 text-xs text-[#66758A]">
              {formatFileSize(proof.size)} · {isImage ? "Image" : "PDF"}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Check size={13} strokeWidth={3} />
              Ready to submit
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#66758A] transition-colors hover:bg-bg-light hover:text-text-dark"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#66758A]">Upload payment proof</p>
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-[14px] border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-blue bg-blue/[0.06]"
            : "border-border bg-bg-light/50 hover:border-blue/40 hover:bg-blue/[0.02]"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <span className={`flex size-12 items-center justify-center rounded-full transition-colors ${
          dragActive ? "bg-blue/15 text-blue" : "bg-white text-[#66758A] shadow-sm ring-1 ring-border"
        }`}>
          <Upload size={22} />
        </span>
        <div>
          <p className="text-sm font-semibold text-text-dark">
            {dragActive ? "Drop your file here" : "Drag and drop your receipt here"}
          </p>
          <p className="mt-1 text-xs text-[#66758A]">or click to browse files</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#66758A] ring-1 ring-border">
            <FileImage size={12} /> PNG / JPEG
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#66758A] ring-1 ring-border">
            <FileText size={12} /> PDF
          </span>
          <span className="text-[11px] text-[#9AA7B4]">Max 5 MB</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />
      </div>
      {fileError && (
        <p role="alert" className="mt-2 text-xs font-medium text-error">{fileError}</p>
      )}
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
  const [bank, setBank] = useState<Record<string, string> | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  useEffect(() => {
    fetch("/api/checkout/bank-details", { cache: "no-store" })
      .then((r) => r.json())
      .then((x) => setBank(x.bank))
      .catch(() => {});
  }, []);

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
        </div>

        <div className="mt-9 border-b border-white/15 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F2C969]">Order summary</p>
          <div className="mt-4 flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold leading-tight">{selectedPackage.name}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{selectedPackage.description}</p>
            </div>
            <p className="shrink-0 text-2xl font-extrabold">{selectedPackage.currency === "GBP" ? "£" : selectedPackage.currency === "EUR" ? "€" : "$"}{selectedPackage.price}</p>
          </div>
        </div>

        <dl className="mt-2 text-sm">
          <SummaryRow label="Subtotal" value={`${selectedPackage.currency === "GBP" ? "£" : "$"}${selectedPackage.price} ${selectedPackage.currency}`} />
          <SummaryRow label="Tax, if applicable" value="Calculated at payment" />
          <SummaryRow label="Total due" value={`${selectedPackage.currency === "GBP" ? "£" : "$"}${selectedPackage.price} ${selectedPackage.currency}`} strong />
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
            <p className="mt-1 text-xs leading-5 text-white/60">Your application opens after our team confirms your bank transfer.</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-[540px]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Secure checkout</p>
            <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-text-dark sm:text-[32px]">
              Pay by bank transfer
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#66758A]">
              Transfer the total shown, then upload a clear receipt or bank confirmation.
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

        <div className="mt-6 rounded-[14px] border border-border bg-bg-light/60 p-5 sm:p-6">
          <h2 className="text-sm font-extrabold text-text-dark">Bank account details</h2>
          <p className="mt-1 text-xs text-[#66758A]">Transfer the exact amount shown in the order summary to this account.</p>
          {bank ? (
            <dl className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {[
                ["Account holder", bank.accountName],
                ["Bank name", bank.bankName],
                ["Account number", bank.accountNumber || bank.iban],
                ["Routing / SWIFT", bank.routingNumber || bank.swiftCode || "Not applicable"],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-3.5">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA7B4]">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-text-dark">{value || "Contact support"}</dd>
                </div>
              ))}
              {bank.instructions && (
                <div className="bg-white p-3.5 sm:col-span-2">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9AA7B4]">Instructions</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-text-mid">{bank.instructions}</dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#66758A]">
              <LoaderCircle size={14} className="animate-spin" />
              Loading bank details...
            </div>
          )}

          <ProofUpload proof={proof} onSelect={setProof} disabled={submitting} />
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[12px] border border-border bg-bg-light/60 p-4">
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

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="text" size="md" onClick={onBack} disabled={submitting} className="text-[#66758A]">
            <ChevronLeft size={16} /> Back to details
          </Button>
          <Button
            type="button"
            size="md"
            onClick={() => proof && onContinue(proof)}
            disabled={!termsAccepted || !proof || submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <CreditCard size={16} />}
            {submitting ? "Uploading…" : "Submit payment proof"}
          </Button>
        </div>
      </div>
    </section>
  );
}
