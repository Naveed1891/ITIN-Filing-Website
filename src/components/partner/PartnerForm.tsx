"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { apiFetch } from "@/lib/api-client";

const BUSINESS_TYPES = [
  "Accountancy / bookkeeping firm",
  "Company formation agent",
  "Law firm / solicitors",
  "Corporate service provider",
  "Trust / fiduciary service provider",
  "Business consultancy / advisory",
  "Bank or financial institution",
  "Other",
];

const VOLUME_OPTIONS = ["1–10", "11–50", "51–100", "101–250", "251–500", "500+"];

export function PartnerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch("/api/partner", {
        method: "POST",
        body: JSON.stringify({
          companyName: form.get("companyName"),
          website: form.get("website"),
          businessType: form.get("businessType"),
          monthlyVolume: form.get("monthlyVolume"),
          contactName: form.get("contactName"),
          email: form.get("email"),
          phone: form.get("phone"),
          country: form.get("country"),
          goals: form.get("goals") || undefined,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle size={28} />
        </div>
        <h3 className="text-lg font-extrabold text-text-dark">Enquiry received!</h3>
        <p className="max-w-sm text-sm text-text-mid">
          Thank you for your interest. Our partnerships team will review your enquiry and reply within one working day.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">About your business</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Company name" name="companyName" placeholder="Acme Corp" required />
          <FormField label="Company website" name="website" placeholder="https://example.com" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-text-dark">Business type</span>
            <select
              name="businessType"
              required
              className="rounded-[10px] border border-border bg-bg-light px-4 py-3 text-sm text-text-dark focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15"
            >
              <option value="">Select type…</option>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-text-dark">Expected filings per month</span>
            <select
              name="monthlyVolume"
              required
              className="rounded-[10px] border border-border bg-bg-light px-4 py-3 text-sm text-text-dark focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15"
            >
              <option value="">Select range…</option>
              {VOLUME_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-text-muted">Primary contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" name="contactName" placeholder="John Smith" required />
          <FormField label="Work email" name="email" type="email" placeholder="john@company.com" autoComplete="email" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Phone number" name="phone" type="tel" placeholder="+1 234 567 8900" required />
          <FormField label="Country" name="country" placeholder="United States" required />
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text-dark">Partnership goals <span className="font-normal text-text-muted">(optional)</span></span>
        <textarea
          name="goals"
          maxLength={2000}
          rows={4}
          placeholder="Tell us about your business needs and what you're looking for in a partnership..."
          className="rounded-[10px] border border-border bg-bg-light px-4 py-3 text-sm text-text-dark placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15"
          style={{ resize: "vertical" }}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
        {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
        {submitting ? "Submitting…" : "Submit partnership enquiry"}
      </Button>
    </form>
  );
}
