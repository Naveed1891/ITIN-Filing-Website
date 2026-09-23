import { z } from "zod";
import { requireAdminModule } from "@/server/admin";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { supportReplyEmail } from "@/server/email-templates";
import { getAppUrl } from "@/server/stripe";

const schema = z.object({ body: z.string().trim().min(1).max(5000) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdminModule("communications");
    const { id } = await params;
    const original = await prisma.message.findUnique({ where: { id } });
    if (!original?.userId) throw new Error("NOT_FOUND");
    const input = await parseJson(request, schema);
    const user = await prisma.user.findUnique({ where: { id: original.userId } });
    if (!user) throw new Error("NOT_FOUND");
    const reply = await prisma.message.create({ data: { userId: user.id, orderId: original.orderId, channel: "INTERNAL", direction: "OUTBOUND", subject: original.subject || "Support reply", body: input.body, actorId: actor.id } });
    await prisma.notification.create({ data: { userId: user.id, title: "New support reply", body: input.body.slice(0, 180), href: "/dashboard/support" } });
    const settings = await getOperationalSettings();
    await sendEmailSafely(user.email, supportReplyEmail({ fullName: user.fullName, subject: reply.subject || "Support reply", reply: reply.body, dashboardUrl: `${getAppUrl()}/dashboard/support`, supportEmail: settings.smtp.mainEmail }));
    return json({ reply }, 201);
  } catch (error) { return routeError(error); }
}
