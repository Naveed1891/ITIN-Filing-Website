import type { ReactNode } from "react";

export function DashboardTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div>{eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue">{eyebrow}</p> : null}<h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-text-dark">{title}</h1><p className="mt-2 text-sm text-text-muted">{description}</p></div>;
}

export function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return <div className="rounded-card border border-border bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p><p className="mt-2 font-serif text-4xl font-bold text-text-dark">{value}</p>{note ? <p className="mt-2 text-xs text-text-muted">{note}</p> : null}</div>;
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="overflow-hidden rounded-card border border-border bg-white shadow-sm"><div className="border-b border-border px-6 py-5"><h2 className="text-xs font-bold uppercase tracking-[0.16em] text-blue">{title}</h2></div><div className="overflow-x-auto p-6">{children}</div></section>;
}

export function EmptyRow({ message }: { message: string }) {
  return <div className="py-10 text-center text-sm text-text-muted">{message}</div>;
}

export function StatusPill({ value }: { value: string }) {
  const positive = ["PAID", "COMPLETED", "ACCEPTED", "APPROVED", "DONE", "ACTIVE", "SUCCEEDED"].includes(value);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-blue/10 text-blue"}`}>{value.replaceAll("_", " ")}</span>;
}
