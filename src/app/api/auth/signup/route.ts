import { createSession, hashPassword, normalizeEmail, publicUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { signupSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, signupSchema);

    const email = normalizeEmail(input.email);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("An account with this email already exists.");

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName.trim(),
        email,
        whatsapp: input.whatsapp.trim(),
        country: input.country.trim(),
        passwordHash: await hashPassword(input.password),
        termsAt: new Date(),
      },
    });
    await createSession(user.id);
    return json({ user: publicUser(user) }, 201);
  } catch (error) {
    return routeError(error);
  }
}
