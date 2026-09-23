"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Send } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export function SupportForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiFetch("/api/support", {
        method: "POST",
        body: JSON.stringify({ subject, body }),
      });
      setSuccess(true);
      setSubject("");
      setBody("");
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="dash-form" onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
      <label className="dash-label">
        Subject
        <input
          className="dash-input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Question about my application"
          required
          maxLength={200}
        />
      </label>
      <label className="dash-label">
        Message
        <textarea
          className="dash-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe your question or issue..."
          required
          rows={5}
          maxLength={5000}
          style={{ resize: "vertical", minHeight: "100px" }}
        />
      </label>
      {error && <div className="dash-error">{error}</div>}
      {success && (
        <div style={{ padding: "0.75rem 1rem", background: "color-mix(in srgb, #1f9d55 10%, transparent)", borderRadius: "10px", color: "#14713c", fontSize: "14px", fontWeight: 600 }}>
          Message sent! Our team will get back to you shortly.
        </div>
      )}
      <div className="dash-actions">
        <button type="submit" className="dash-btn dash-btn--primary" disabled={submitting}>
          {submitting ? <LoaderCircle size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
          {submitting ? " Sending…" : " Send message"}
        </button>
      </div>
    </form>
  );
}
