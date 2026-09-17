import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, routeError } from "@/server/http";
import { serializeOrder } from "@/server/serializers";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireUser();
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { package: true, user: true, application: true },
    });
    if (!order) throw new Error("NOT_FOUND");
    if (order.userId !== user.id) throw new Error("FORBIDDEN");
    return json({ order: serializeOrder(order) });
  } catch (error) {
    return routeError(error);
  }
}
