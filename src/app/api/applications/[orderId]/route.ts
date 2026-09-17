import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { applicationPatchSchema } from "@/server/validation";

async function getOwnedApplicationLocal(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { application: { include: { documents: true } }, package: true },
  });
  if (!order) throw new Error("NOT_FOUND");
  if (order.userId !== userId) throw new Error("FORBIDDEN");
  if (order.status !== "PAID" && order.status !== "APPLICATION_IN_PROGRESS" && order.status !== "SUBMITTED") {
    throw new Error("Payment must be confirmed before accessing the application.");
  }
  if (!order.application) throw new Error("NOT_FOUND");
  return order.application;
}

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireUser();
    const { orderId } = await params;

    const application = await getOwnedApplicationLocal(orderId, user.id);
    return json({
      application: {
        id: application.id,
        status: application.status,
        application: JSON.parse(application.applicationJson),
        declarationAccepted: application.declarationAccepted,
        documents: application.documents,
      },
    });
  } catch (error) {
    return routeError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireUser();
    const { orderId } = await params;
    const input = await parseJson(request, applicationPatchSchema);

    const application = await getOwnedApplicationLocal(orderId, user.id);
    const updated = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: application.status === "NOT_STARTED" ? "DRAFT" : application.status,
        applicationJson: JSON.stringify(input.application),
        order: { update: { status: "APPLICATION_IN_PROGRESS" } },
      },
    });
    return json({ application: { id: updated.id, status: updated.status } });
  } catch (error) {
    return routeError(error);
  }
}
