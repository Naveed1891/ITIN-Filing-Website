import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { normalizeEmail, requireUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmail } from "@/server/email";
import { otpEmail } from "@/server/email-templates";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendOtpSchema = z.object({
  action: z.literal("send-otp"),
  newEmail: z.email("Enter a valid email address."),
});

const verifySchema = z.object({
  action: z.literal("verify"),
  newEmail: z.email("Enter a valid email address."),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code."),
});

const schema = z.discriminatedUnion("action", [sendOtpSchema, verifySchema]);

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, schema);
    const newEmail = normalizeEmail(input.newEmail);

    if (newEmail === user.email) {
      return errorJson("This is already your email address.", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
      return errorJson("This email address is already in use.", 409);
    }

    if (input.action === "send-otp") {
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
      await sendEmail(
        newEmail,
        otpEmail({ code, minutes: 10, supportEmail: settings.smtp.mainEmail }),
        "otp",
      );
      return json({ otpSent: true });
    }

    const otp = await prisma.loginOtp.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!otp || otp.expiresAt <= new Date() || otp.attempts >= 5) {
      return errorJson("The verification code is invalid or expired.", 401);
    }

    const supplied = Buffer.from(createHash("sha256").update(input.code).digest("hex"));
    const stored = Buffer.from(otp.codeHash);
    if (supplied.length !== stored.length || !timingSafeEqual(supplied, stored)) {
      await prisma.loginOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return errorJson("The verification code is invalid or expired.", 401);
    }

    await prisma.$transaction([
      prisma.loginOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
      prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail, emailVerifiedAt: new Date() },
      }),
    ]);

    return json({ emailChanged: true, newEmail });
  } catch (error) {
    return routeError(error);
  }
}
