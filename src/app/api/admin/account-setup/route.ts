import { z } from "zod";
import { firstPasswordError } from "@/lib/password";
import { getCurrentUser, hashPassword } from "@/server/auth";
import { prisma } from "@/server/db";
import { errorJson, json, parseJson, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

const SETUP_KEY = "superadmin_account_reset_2026_09";
const CONFIRMATION = "REMOVE ALL PREVIOUS USERS";
const replacementAdmins = [
  { email: "ceo@hopetexx.com", fullName: "CEO" },
  { email: "naveed@invoclouds.com", fullName: "Naveed" },
] as const;

const inputSchema = z.object({
  confirmation: z.literal(CONFIRMATION),
  ceoPassword: z.string().min(1, "Enter the CEO password."),
  naveedPassword: z.string().min(1, "Enter Naveed's password."),
});

export async function GET() {
  try {
    const actor = await getCurrentUser();
    if (!actor) throw new Error("UNAUTHENTICATED");
    if (actor.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");
    const completed = await prisma.appSetting.findUnique({ where: { key: SETUP_KEY } });
    return json({ available: !completed, confirmation: CONFIRMATION });
  } catch (error) {
    return routeError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await getCurrentUser();
    if (!actor) throw new Error("UNAUTHENTICATED");
    if (actor.role !== "SUPER_ADMIN") throw new Error("FORBIDDEN");

    const input = await parseJson(request, inputSchema);
    const passwords = [input.ceoPassword, input.naveedPassword];
    for (let index = 0; index < replacementAdmins.length; index += 1) {
      const password = passwords[index] ?? "";
      const passwordError = firstPasswordError(password);
      if (passwordError) return errorJson(passwordError, 400);
    }

    const passwordHashes = await Promise.all(passwords.map((password) => hashPassword(password)));
    const tombstoneHash = await hashPassword(crypto.randomUUID());

    await prisma.$transaction(async (tx) => {
      const completed = await tx.appSetting.findUnique({ where: { key: SETUP_KEY } });
      if (completed) throw new Error("This one-time account setup has already been completed.");

      const legacyUsers = await tx.user.findMany({ select: { id: true } });
      await tx.session.deleteMany();
      await tx.loginOtp.deleteMany();

      for (const legacy of legacyUsers) {
        await tx.user.update({
          where: { id: legacy.id },
          data: {
            fullName: "Deleted user",
            email: `deleted+${legacy.id}@invalid.local`,
            whatsapp: "+10000000000",
            country: "Removed",
            passwordHash: tombstoneHash,
            role: "CUSTOMER",
            status: "SUSPENDED",
            emailVerifiedAt: null,
            lockedUntil: null,
            deletedAt: new Date(),
          },
        });
      }

      const created = [];
      for (let index = 0; index < replacementAdmins.length; index += 1) {
        const admin = replacementAdmins[index];
        created.push(
          await tx.user.create({
            data: {
              fullName: admin.fullName,
              email: admin.email,
              whatsapp: "+10000000000",
              country: "United States",
              passwordHash: passwordHashes[index] ?? "",
              role: "SUPER_ADMIN",
              status: "ACTIVE",
              emailVerifiedAt: new Date(),
              termsAt: new Date(),
            },
            select: { id: true, email: true },
          }),
        );
      }

      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          action: "auth.replace_all_accounts",
          target: "User",
          metaJson: JSON.stringify({ replacementEmails: created.map((user) => user.email) }),
        },
      });
      await tx.appSetting.create({
        data: {
          key: SETUP_KEY,
          valueJson: JSON.stringify({
            completedAt: new Date().toISOString(),
            initiatedBy: actor.email,
            replacementEmails: created.map((user) => user.email),
          }),
        },
      });
    }, { maxWait: 5_000, timeout: 30_000 });

    return json({ ok: true });
  } catch (error) {
    return routeError(error);
  }
}
