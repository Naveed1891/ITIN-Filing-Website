import { redirect } from "next/navigation";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

export default function LegacyReviewPage() {
  redirect(customerDashboardUrl("/dashboard/orders"));
}
