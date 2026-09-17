import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { documentUploadSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, documentUploadSchema);

    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: { application: true },
    });
    if (!order) throw new Error("NOT_FOUND");
    if (order.userId !== user.id) throw new Error("FORBIDDEN");
    if (!order.application) throw new Error("Payment must be confirmed before uploading documents.");

    await prisma.applicationDocument.createMany({
      data: input.documents.map((document) => ({
        applicationId: order.application!.id,
        kind: document.kind,
        fileName: document.fileName,
        size: document.size,
        mimeType: document.mimeType,
      })),
    });

    return json({
      ok: true,
      note: "Local development adapter stored document metadata only. Replace with object storage before production file handling.",
    });
  } catch (error) {
    return routeError(error);
  }
}
