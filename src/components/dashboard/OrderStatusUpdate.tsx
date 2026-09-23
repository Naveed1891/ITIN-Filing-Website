"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

const ORDER_STATUSES = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAID", label: "Paid" },
  { value: "APPLICATION_IN_PROGRESS", label: "Application In Progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "MORE_INFO_REQUIRED", label: "More Info Required" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === currentStatus) {
      setError("Select a different status.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      });
      setSuccess("Status updated. Email and notification sent to client.");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dash-form" style={{ maxWidth: "100%" }}>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <label className="dash-label">
          New status
          <select
            className="dash-input"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setError(""); setSuccess(""); }}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}{s.value === currentStatus ? " (current)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-label">
          Note to client <span style={{ fontWeight: 400, color: "#9AA7B4" }}>(optional)</span>
          <input
            className="dash-input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={2000}
            placeholder="e.g. Payment confirmed, application under review"
          />
        </label>
      </div>

      {error && <div className="dash-error">{error}</div>}
      {success && <div style={{ padding: "0.6rem 0.8rem", background: "#e6f9ed", border: "1px solid #1f9d55", borderRadius: "8px", color: "#0d6e3a", fontSize: "13px", fontWeight: 600 }}>{success}</div>}

      <div className="dash-actions">
        <button type="submit" className="dash-btn dash-btn--primary" disabled={submitting || status === currentStatus}>
          {submitting ? <LoaderCircle size={15} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={15} />}
          {submitting ? " Updating…" : " Update status"}
        </button>
      </div>
    </form>
  );
}
