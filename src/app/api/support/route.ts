import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  body: z.string().trim().min(1, "Message is required.").max(5000),
});

export async function GET() {
  try {
    const user = await requireUser();
    const messages = await prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return json({ messages });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const message = await prisma.message.create({
      data: {
        userId: user.id,
        channel: "INTERNAL",
        direction: "INBOUND",
        subject: input.subject,
        body: input.body,
        actorId: user.id,
      },
    });
    return json({ message }, 201);
  } catch (error) {
    return routeError(error);
  }
}
