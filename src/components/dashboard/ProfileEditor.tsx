"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Check, Mail } from "lucide-react";
import { OtpInput } from "@/components/ui/OtpInput";
import { apiFetch } from "@/lib/api-client";

export function ProfileEditor({
  initialName,
  initialEmail,
  initialWhatsapp,
  initialCountry,
}: {
  initialName: string;
  initialEmail: string;
  initialWhatsapp: string;
  initialCountry: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [country, setCountry] = useState(initialCountry);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState(initialEmail);
  const [emailStep, setEmailStep] = useState<"idle" | "sending" | "otp" | "verifying">("idle");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ fullName, whatsapp, country }),
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function startEmailChange() {
    if (email === initialEmail) return;
    setEmailStep("sending");
    setEmailError("");
    try {
      await apiFetch("/api/profile/change-email", {
        method: "POST",
        body: JSON.stringify({ action: "send-otp", newEmail: email }),
      });
      setEmailStep("otp");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Could not send verification code.");
      setEmailStep("idle");
    }
  }

  async function verifyEmailCode(e: FormEvent) {
    e.preventDefault();
    setEmailStep("verifying");
    setEmailError("");
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const code = String(form.get("code"));
    try {
      await apiFetch("/api/profile/change-email", {
        method: "POST",
        body: JSON.stringify({ action: "verify", newEmail: email, code }),
      });
      setEmailSuccess(true);
      setEmailStep("idle");
      router.refresh();
      setTimeout(() => setEmailSuccess(false), 4000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Verification failed.");
      setEmailStep("otp");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <form className="dash-form" onSubmit={saveProfile} style={{ maxWidth: "100%" }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <label className="dash-label">
            Full name
            <input className="dash-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={200} />
          </label>
          <label className="dash-label">
            WhatsApp / Phone
            <input className="dash-input" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required maxLength={30} />
          </label>
          <label className="dash-label">
            Country
            <input className="dash-input" type="text" value={country} onChange={(e) => setCountry(e.target.value)} required maxLength={100} />
          </label>
        </div>
        {error && <div className="dash-error">{error}</div>}
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#14713c", fontSize: "14px", fontWeight: 600 }}>
            <Check size={16} /> Profile updated.
          </div>
        )}
        <div className="dash-actions">
          <button type="submit" className="dash-btn dash-btn--primary" disabled={saving}>
            {saving ? <LoaderCircle size={15} style={{ animation: "spin 1s linear infinite" }} /> : null}
            {saving ? " Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <div style={{ borderTop: "1px solid #E3E8EE", paddingTop: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.25rem", fontSize: "13.5px", fontWeight: 700, color: "#5A6B7B" }}>Email address</h3>
        <p style={{ margin: "0 0 1rem", fontSize: "13px", color: "#9AA7B4" }}>
          Changing your email requires verification on the new address.
        </p>

        {emailStep === "otp" || emailStep === "verifying" ? (
          <form onSubmit={verifyEmailCode} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#1B2B3A" }}>
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <OtpInput name="code" disabled={emailStep === "verifying"} />
            {emailError && <div className="dash-error">{emailError}</div>}
            <div className="dash-actions">
              <button type="submit" className="dash-btn dash-btn--primary" disabled={emailStep === "verifying"}>
                {emailStep === "verifying" ? "Verifying…" : "Verify and update email"}
              </button>
              <button type="button" className="dash-btn" onClick={() => { setEmailStep("idle"); setEmail(initialEmail); setEmailError(""); }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <label className="dash-label" style={{ flex: "1 1 240px", minWidth: 0 }}>
              <input className="dash-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <button
              type="button"
              className="dash-btn dash-btn--primary"
              disabled={email === initialEmail || emailStep === "sending"}
              onClick={startEmailChange}
              style={{ whiteSpace: "nowrap" }}
            >
              {emailStep === "sending" ? (
                <><LoaderCircle size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending code…</>
              ) : (
                <><Mail size={15} /> Verify new email</>
              )}
            </button>
          </div>
        )}
        {emailError && emailStep === "idle" && <div className="dash-error" style={{ marginTop: "0.75rem" }}>{emailError}</div>}
        {emailSuccess && (
          <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#14713c", fontSize: "14px", fontWeight: 600 }}>
            <Check size={16} /> Email updated successfully.
          </div>
        )}
      </div>
    </div>
  );
}
