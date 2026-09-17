import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * AES-256-GCM encryption for credentials stored in the AppSetting table.
 * The key derives from SETTINGS_SECRET (falling back to SESSION_SECRET), so
 * stored secrets (Stripe keys, SMTP passwords, bank details) are never readable
 * from the database alone. Mirrors the DirectorKYC secrets vault.
 */
function key(): Buffer {
  const secret = process.env.SETTINGS_SECRET?.trim() || process.env.SESSION_SECRET?.trim();
  if (!secret) throw new Error("SETTINGS_SECRET or SESSION_SECRET must be set to store credentials.");
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") throw new Error("Malformed secret payload.");
  const iv = Buffer.from(parts[1], "base64url");
  const tag = Buffer.from(parts[2], "base64url");
  const data = Buffer.from(parts[3], "base64url");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
