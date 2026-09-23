import Link from "next/link";
import type { ReactNode } from "react";

/* ── Page heading ──────────────────────────────────────────────────── */

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="dash-heading">
      <div>
        {eyebrow && <p className="dash-heading__eyebrow">{eyebrow}</p>}
        <h1 className="dash-heading__title">{title}</h1>
        {description && <p className="dash-heading__desc">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** @deprecated Use PageHeading */
export const DashboardTitle = PageHeading;

/* ── Panel ─────────────────────────────────────────────────────────── */

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`dash-panel ${className}`}>
      {title && <h2 className="dash-panel__title">{title}</h2>}
      {children}
    </section>
  );
}

/* ── Stat card ─────────────────────────────────────────────────────── */

export function StatCard({ label, value, hint, note }: { label: string; value: string | number; hint?: string; note?: string }) {
  return (
    <div className="dash-stat">
      <p className="dash-stat__label">{label}</p>
      <p className="dash-stat__value">{value}</p>
      {(hint || note) && <p className="dash-stat__hint">{hint || note}</p>}
    </div>
  );
}

/* ── Status badge ──────────────────────────────────────────────────── */

const STATUS_TONE: Record<string, string> = {
  COMPLETED: "ok", APPROVED: "ok", PAID: "ok", ACTIVE: "ok", SUCCEEDED: "ok", DONE: "ok", ACCEPTED: "ok",
  SUBMITTED: "info", UNDER_REVIEW: "info", IN_REVIEW: "info", PROCESSING: "info",
  APPLICATION_IN_PROGRESS: "info", IN_PROGRESS: "info", UPLOADED: "info", CONFIGURED: "info",
  AWAITING_APPLICATION: "warn", AWAITING_CUSTOMER: "warn", ADDITIONAL_INFO_REQUIRED: "warn",
  PENDING_PAYMENT: "warn", PENDING: "warn", NEEDS_REUPLOAD: "warn", REQUESTED: "warn",
  MORE_INFO_REQUIRED: "warn", DRAFT: "warn", NEEDS_CHANGES: "warn",
  NOT_STARTED: "muted", UNPAID: "muted", INACTIVE: "muted",
  CANCELLED: "bad", REFUNDED: "bad", REJECTED: "bad", FAILED: "bad",
  SUPER_ADMIN: "info", ADMIN: "info", STAFF: "info",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "muted";
  return (
    <span className={`dash-badge dash-badge--${tone}`}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

/** @deprecated Use StatusBadge */
export function StatusPill({ value }: { value: string }) {
  return <StatusBadge status={value} />;
}

/* ── Empty & error states ──────────────────────────────────────────── */

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="dash-empty">
      <p className="dash-empty__title">{title}</p>
      <p className="dash-empty__desc">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="dash-btn dash-btn--primary" style={{ marginTop: "1.25rem", display: "inline-flex" }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/** @deprecated Use EmptyState */
export function EmptyRow({ message }: { message: string }) {
  return <EmptyState title={message} description="" />;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="dash-error" role="alert">{message}</div>;
}

/* ── Formatters ────────────────────────────────────────────────────── */

export function formatMoney(cents: number, currency = "USD"): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : `${currency} `;
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
