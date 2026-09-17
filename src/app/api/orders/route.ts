import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, routeError } from "@/server/http";
import { serializeOrder } from "@/server/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { package: true, application: true },
      orderBy: { createdAt: "desc" },
    });
    return json({ orders: orders.map(serializeOrder) });
  } catch (error) {
    return routeError(error);
  }
}
