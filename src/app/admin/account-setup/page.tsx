import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountSetupForm } from "./AccountSetupForm";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/db";

export const metadata: Metadata = {
  title: "One-time super-admin setup | ITINFiling",
  robots: { index: false, follow: false },
};

const SETUP_KEY = "superadmin_account_reset_2026_09";

export default async function AccountSetupPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/admin/account-setup");
  if (user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const completed = await prisma.appSetting.findUnique({ where: { key: SETUP_KEY } });

  return (
    <main className="min-h-screen bg-bg-light px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[22px] border border-border bg-white p-7 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue">Platform security</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text-dark">
            One-time super-admin setup
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            This replaces every existing login account with the two super admins shown below.
            Historical order and application records are retained with anonymised user identities.
          </p>
          {completed ? (
            <div className="mt-8 rounded-lg border border-border bg-bg-light p-5 text-sm text-text-mid">
              This one-time setup has already been completed and cannot be run again.
            </div>
          ) : (
            <AccountSetupForm />
          )}
        </div>
      </div>
    </main>
  );
}
