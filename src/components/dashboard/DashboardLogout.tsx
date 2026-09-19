"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DashboardLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } finally {
          router.push("/");
          router.refresh();
        }
      }}
      className="w-full rounded-lg border border-border-mid px-3 py-2 text-sm font-semibold text-text-mid transition hover:border-blue hover:text-blue disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
