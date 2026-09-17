import { redirect } from "next/navigation";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

export default function LegacyDocumentsPage() {
  redirect(customerDashboardUrl("/dashboard/orders"));
}
