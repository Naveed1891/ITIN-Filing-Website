import { redirect } from "next/navigation";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

export default function ApplicationIndexPage() {
  redirect(customerDashboardUrl("/dashboard/orders"));
}
