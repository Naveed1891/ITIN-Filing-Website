"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { PasswordField } from "@/components/ui/PasswordField";

const CONFIRMATION = "REMOVE ALL PREVIOUS USERS";

export function AccountSetupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    if (form.get("ceoPassword") !== form.get("ceoPasswordConfirm")) {
      setError("The CEO passwords do not match.");
      return;
    }
    if (form.get("naveedPassword") !== form.get("naveedPasswordConfirm")) {
      setError("Naveed's passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/admin/account-setup", {
        method: "POST",
        body: JSON.stringify({
          confirmation,
          ceoPassword: form.get("ceoPassword"),
          naveedPassword: form.get("naveedPassword"),
        }),
      });
      router.replace("/login");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Account setup failed.");
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 flex flex-col gap-6" onSubmit={submit}>
      <div className="rounded-lg border border-error-border bg-error-bg p-4 text-sm text-error">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 shrink-0" size={18} aria-hidden />
          <p>This action revokes every session and permanently disables all previous accounts.</p>
        </div>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-sm font-bold text-text-dark">CEO account</legend>
        <PasswordField label="Password" name="ceoPassword" autoComplete="new-password" required />
        <PasswordField label="Confirm password" name="ceoPasswordConfirm" autoComplete="new-password" required />
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-sm font-bold text-text-dark">naveed@invoclouds.com</legend>
        <PasswordField label="Password" name="naveedPassword" autoComplete="new-password" required />
        <PasswordField label="Confirm password" name="naveedPasswordConfirm" autoComplete="new-password" required />
      </fieldset>

      <FormField
        label={`Type ${CONFIRMATION} to confirm`}
        name="confirmation"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        autoComplete="off"
        required
      />
      {error ? <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">{error}</p> : null}
      <Button type="submit" variant="destructive" size="lg" fullWidth disabled={submitting || confirmation !== CONFIRMATION}>
        {submitting ? <LoaderCircle size={16} className="animate-spin" /> : null}
        Remove users and create super admins
      </Button>
    </form>
  );
}
