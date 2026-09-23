import { createHash, timingSafeEqual } from "node:crypto";
import { createSession, hashPassword, normalizeEmail, publicUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";
import { firstPasswordError } from "@/lib/password";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit verification code."),
  password: z.string().min(1, "Password is required."),
  confirmPassword: z.string().min(1, "Confirm your password."),
}).superRefine((v, ctx) => {
  const err = firstPasswordError(v.password, { email: v.email });
  if (err) ctx.addIssue({ code: "custom", path: ["password"], message: err });
  if (v.password !== v.confirmPassword) {
    ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match." });
  }
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, schema);
    const email = normalizeEmail(input.email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== "ACTIVE" || user.deletedAt) {
      return errorJson("The verification code is invalid or expired.", 401);
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

    const passwordHash = await hashPassword(input.password);
    await prisma.$transaction([
      prisma.loginOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);

    await createSession(user.id);
    return json({ user: publicUser(user) });
  } catch (error) {
    return routeError(error);
  }
}
