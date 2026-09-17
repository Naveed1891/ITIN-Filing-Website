import { redirect } from "next/navigation";
import { customerDashboardUrl } from "@/lib/customer-dashboard-url";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(customerDashboardUrl(`/dashboard/orders/${encodeURIComponent(orderId)}`));
}
