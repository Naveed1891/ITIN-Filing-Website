import { requireAdminModule } from "@/server/admin";
import { prisma } from "@/server/db";
import { DashboardTitle } from "@/components/dashboard/DashboardPrimitives";
import { PaymentProofs } from "./PaymentProofs";

export const dynamic = "force-dynamic";
export default async function FinancePage() {
  await requireAdminModule("finance");
  const transfers = await prisma.bankTransfer.findMany({ orderBy: { createdAt: "desc" }, include: { user: true, checkoutIntent: { include: { order: true, package: true } } }, take: 100 });
  return <div className="space-y-8"><DashboardTitle title="Finance" description="Review customer bank-transfer proofs before opening their applications." /><PaymentProofs initial={transfers.map((item) => ({ id: item.id, status: item.status, fileName: item.proofFileName, createdAt: item.createdAt.toISOString(), customer: item.user.fullName, email: item.user.email, reference: item.checkoutIntent.order?.reference ?? "Pending", packageName: item.checkoutIntent.package.name, amountCents: item.checkoutIntent.amountCents, currency: item.checkoutIntent.currency }))} /></div>;
}
