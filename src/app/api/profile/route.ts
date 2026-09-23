import { normalizeEmail, requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  fullName: z.string().trim().min(1, "Name is required.").max(200),
  whatsapp: z.string().trim().min(1, "Phone number is required.").max(30),
  country: z.string().trim().min(1, "Country is required.").max(100),
});

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: input.fullName,
        whatsapp: input.whatsapp,
        country: input.country,
      },
    });
    return json({
      user: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        whatsapp: updated.whatsapp,
        country: updated.country,
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
