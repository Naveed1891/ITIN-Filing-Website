import { requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { readStoredFile } from "@/server/storage";
import { errorJson, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    if (!["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role)) {
      return errorJson("Forbidden.", 403);
    }

    const { id } = await params;
    const doc = await prisma.applicationDocument.findUnique({ where: { id } });
    if (!doc) return errorJson("Document not found.", 404);
    if (!doc.storageKey) return errorJson("Document has no stored file.", 404);

    const buffer = await readStoredFile(doc.storageKey);

    const url = new URL(request.url);
    const isDownload = url.searchParams.has("download");
    const disposition = isDownload ? "attachment" : "inline";

    return new Response(buffer, {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(doc.fileName)}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
