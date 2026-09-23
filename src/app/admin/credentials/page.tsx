import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth";
import { PageHeading } from "@/components/dashboard/DashboardPrimitives";
import { CredentialsManager } from "./CredentialsManager";

export const dynamic = "force-dynamic";
export default async function CredentialsPage() {
  const user = await getCurrentUser();
  if (user?.role !== "SUPER_ADMIN") redirect("/admin");
  return <div className="space-y-8"><PageHeading title="Credentials" description="Manage payment, bank, file storage and email delivery settings. Secret values are encrypted and never displayed." /><CredentialsManager /></div>;
}
