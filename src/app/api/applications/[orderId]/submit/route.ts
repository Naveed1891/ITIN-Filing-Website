import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { applicationSubmitSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await requireUser();
    const { orderId } = await params;
    const input = await parseJson(request, applicationSubmitSchema);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { application: true },
    });
    if (!order) throw new Error("NOT_FOUND");
    if (order.userId !== user.id) throw new Error("FORBIDDEN");
    if (!order.application || order.status === "PENDING_PAYMENT") {
      throw new Error("Payment must be confirmed before submitting the application.");
    }

    const submittedAt = new Date();
    const application = await prisma.application.update({
      where: { id: order.application.id },
      data: {
        status: "SUBMITTED",
        applicationJson: JSON.stringify(input.application),
        declarationAccepted: input.declarationAccepted,
        submittedAt,
        documents: {
          deleteMany: {},
          createMany: {
            data: input.documents.map((document) => ({
              kind: document.kind,
              fileName: document.fileName,
              size: document.size,
              mimeType: document.mimeType,
            })),
          },
        },
        order: { update: { status: "SUBMITTED" } },
      },
    });
    return json({
      application: {
        id: application.id,
        status: application.status,
        submittedAt: submittedAt.toISOString(),
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
