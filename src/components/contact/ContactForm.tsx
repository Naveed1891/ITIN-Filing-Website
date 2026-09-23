"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { apiFetch } from "@/lib/api-client";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message. Please try again.");
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
        <h3 className="text-lg font-extrabold text-text-dark">Message sent!</h3>
        <p className="max-w-sm text-sm text-text-mid">
          Thank you for reaching out. Our team will get back to you within one working day.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-semibold text-blue hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Your name" name="name" placeholder="John Smith" required />
        <FormField label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </div>
      <FormField label="Subject" name="subject" placeholder="e.g. Question about ITIN eligibility" required />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-text-dark">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Describe your question or enquiry..."
          className="rounded-[10px] border border-border bg-bg-light px-4 py-3 text-sm text-text-dark placeholder:text-text-muted focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15"
          style={{ resize: "vertical", minHeight: "120px" }}
        />
      </label>
      {error && (
        <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
        {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
