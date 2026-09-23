import { notFound } from "next/navigation";
import { requireAdminModule } from "@/server/admin";
import { prisma } from "@/server/db";
import { PageHeading, Panel } from "@/components/dashboard/DashboardPrimitives";
import { CommunicationReply } from "./CommunicationReply";

export const dynamic = "force-dynamic";
export default async function CommunicationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminModule("communications");
  const { id } = await params;
  const original = await prisma.message.findUnique({ where: { id } });
  if (!original?.userId) notFound();
  const [user, messages] = await Promise.all([prisma.user.findUnique({ where: { id: original.userId } }), prisma.message.findMany({ where: { userId: original.userId }, orderBy: { createdAt: "asc" } })]);
  if (!user) notFound();
  return <><PageHeading title={original.subject || "Communication"} description={`${user.fullName} · ${user.email}`} /><Panel title="Conversation"><div className="space-y-3">{messages.map((message) => <div key={message.id} className={`rounded-xl p-4 ${message.direction === "OUTBOUND" ? "ml-8 bg-blue/10" : "mr-8 bg-bg-light"}`}><b className="text-sm">{message.direction === "OUTBOUND" ? "ITINReady team" : user.fullName}</b><p className="mt-1 whitespace-pre-wrap text-sm text-text-mid">{message.body}</p></div>)}</div><CommunicationReply messageId={id} /></Panel></>;
}
