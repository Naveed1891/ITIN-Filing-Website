import { createHash, randomInt } from "node:crypto";
import { normalizeEmail } from "@/server/auth";
import { prisma } from "@/server/db";
import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmail } from "@/server/email";
import { passwordResetEmail } from "@/server/email-templates";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.email("Enter a valid email address."),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, schema);
    const email = normalizeEmail(input.email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      return json({ sent: true });
    }

    const code = randomInt(100000, 1000000).toString();
    await prisma.$transaction([
      prisma.loginOtp.deleteMany({ where: { userId: user.id, consumedAt: null } }),
      prisma.loginOtp.create({
        data: {
          userId: user.id,
          codeHash: createHash("sha256").update(code).digest("hex"),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }),
    ]);

    const settings = await getOperationalSettings();
    try {
      await sendEmail(email, passwordResetEmail({ code, minutes: 10, supportEmail: settings.smtp.mainEmail }), "otp");
    } catch (err) {
      console.error("Password reset email delivery failed:", err);
      return json({ sent: true, smtpError: true });
    }

    return json({ sent: true });
  } catch (error) {
    return routeError(error);
  }
}
