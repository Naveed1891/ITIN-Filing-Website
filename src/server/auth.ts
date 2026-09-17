import { cookies } from "next/headers";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { prisma } from "./db";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "itin_session";
const SESSION_DAYS = 30;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, key] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const stored = Buffer.from(key, "hex");
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getSessionBridgeToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function createSession(userIdOrBridgeToken: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: {
      userId: userIdOrBridgeToken,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { lastSeenAt: new Date() },
  });

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export function publicUser(user: {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    whatsapp: user.whatsapp,
    country: user.country,
  };
}
