import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { applicationSubmitSchema } from "@/server/validation";
import { uploadBase64File } from "@/server/storage";

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
    if (!order.application || order.status === "CANCELLED") throw new Error("This order is no longer active.");

    const uploadedDocuments = await Promise.all(input.documents.map(async (document) => ({
      ...document,
      storageKey: await uploadBase64File(`applications/${order.id}`, document.fileName, document.mimeType, document.fileBase64 ?? ""),
    })));

    const submittedAt = new Date();
    const nextOrderStatus = order.status === "PENDING_PAYMENT" ? "PENDING_PAYMENT" : "SUBMITTED";
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
            data: uploadedDocuments.map((document) => ({
              kind: document.kind,
              fileName: document.fileName,
              size: document.size,
              mimeType: document.mimeType,
              storageKey: document.storageKey,
            })),
          },
        },
        order: { update: { status: nextOrderStatus } },
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
