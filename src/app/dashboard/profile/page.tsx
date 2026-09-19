import { getCurrentUser } from "@/server/auth";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text-dark">{value || "—"}</span>
    </div>
  );
}

export default async function DashboardProfile() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-text-dark">Profile</h1>
      <div className="rounded-card border border-border bg-white px-6 py-2">
        <Row label="Full name" value={user?.fullName ?? ""} />
        <Row label="Email" value={user?.email ?? ""} />
        <Row label="WhatsApp" value={user?.whatsapp ?? ""} />
        <Row label="Country" value={user?.country ?? ""} />
      </div>
      <p className="text-[13px] text-text-muted">
        Need to update your details? Contact support and we&apos;ll help you make changes securely.
      </p>
    </div>
  );
}
