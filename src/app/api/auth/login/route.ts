import { createSession, normalizeEmail, publicUser, verifyPassword } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { loginSchema } from "@/server/validation";
import { createHash, randomInt } from "node:crypto";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmail } from "@/server/email";
import { otpEmail } from "@/server/email-templates";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, loginSchema);

    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(input.email) },
    });
    const unavailable =
      !user ||
      user.status !== "ACTIVE" ||
      user.deletedAt !== null ||
      (user.lockedUntil !== null && user.lockedUntil > new Date());
    if (unavailable || !user || !(await verifyPassword(input.password, user.passwordHash))) {
      return errorJson("Invalid email or password.", 401);
    }
    const settings = await getOperationalSettings();
    if (settings.notifications.emailVerification) {
      const code = randomInt(100000, 1000000).toString();
      await prisma.$transaction([
        prisma.loginOtp.deleteMany({ where: { userId: user.id, consumedAt: null } }),
        prisma.loginOtp.create({ data: { userId: user.id, codeHash: createHash("sha256").update(code).digest("hex"), expiresAt: new Date(Date.now() + 10 * 60 * 1000) } }),
      ]);
      await sendEmail(user.email, otpEmail({ code, minutes: 10, supportEmail: settings.smtp.mainEmail }), "otp");
      return json({ otpRequired: true });
    }
    await createSession(user.id);
    return json({ user: publicUser(user) });
  } catch (error) {
    return routeError(error);
  }
}
