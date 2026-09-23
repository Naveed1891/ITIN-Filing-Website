import { createHash, timingSafeEqual } from "node:crypto";
import { createSession, normalizeEmail, publicUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { loginOtpSchema } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, loginOtpSchema);
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(input.email) } });
    if (!user || user.status !== "ACTIVE" || user.deletedAt) return errorJson("The verification code is invalid or expired.", 401);
    const otp = await prisma.loginOtp.findFirst({ where: { userId: user.id, consumedAt: null }, orderBy: { createdAt: "desc" } });
    if (!otp || otp.expiresAt <= new Date() || otp.attempts >= 5) return errorJson("The verification code is invalid or expired.", 401);
    const supplied = Buffer.from(createHash("sha256").update(input.code).digest("hex"));
    const stored = Buffer.from(otp.codeHash);
    if (supplied.length !== stored.length || !timingSafeEqual(supplied, stored)) {
      await prisma.loginOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return errorJson("The verification code is invalid or expired.", 401);
    }
    await prisma.loginOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
    await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: user.emailVerifiedAt ?? new Date() } });
    await createSession(user.id);
    return json({ user: publicUser(user) });
  } catch (error) { return routeError(error); }
}
