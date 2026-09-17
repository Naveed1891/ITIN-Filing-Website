import { createSession, normalizeEmail, publicUser, verifyPassword } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { loginSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, loginSchema);

    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(input.email) },
    });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return errorJson("Invalid email or password.", 401);
    }
    await createSession(user.id);
    return json({ user: publicUser(user) });
  } catch (error) {
    return routeError(error);
  }
}
