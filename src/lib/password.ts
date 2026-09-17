/**
 * Single source of truth for password rules, shared by the client checklist,
 * the Zod schema, and the server route. Keeping one implementation guarantees
 * the UI never claims a password is valid that the server would reject.
 */
export const PASSWORD_MIN_LENGTH = 12;

export interface PasswordContext {
  email?: string;
  name?: string;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export type PasswordStrength = "Weak" | "Good" | "Strong";

function containsPersonal(password: string, ctx: PasswordContext): boolean {
  const lower = password.toLowerCase();
  const email = (ctx.email ?? "").trim().toLowerCase();
  const emailLocal = email.split("@")[0] ?? "";
  const name = (ctx.name ?? "").trim().toLowerCase();
  const tokens = [email, emailLocal, ...name.split(/\s+/)].filter((t) => t.length >= 3);
  return tokens.some((t) => lower.includes(t));
}

export function passwordRequirements(
  password: string,
  ctx: PasswordContext = {},
): PasswordRequirement[] {
  const pw = password ?? "";
  return [
    { id: "length", label: `At least ${PASSWORD_MIN_LENGTH} characters`, met: pw.length >= PASSWORD_MIN_LENGTH },
    { id: "uppercase", label: "One uppercase letter", met: /[A-Z]/.test(pw) },
    { id: "lowercase", label: "One lowercase letter", met: /[a-z]/.test(pw) },
    { id: "number", label: "One number", met: /[0-9]/.test(pw) },
    { id: "notBlank", label: "Not only spaces", met: pw.trim().length > 0 },
    { id: "notPersonal", label: "Does not contain your name or email", met: !containsPersonal(pw, ctx) },
  ];
}

export function isPasswordValid(password: string, ctx: PasswordContext = {}): boolean {
  return passwordRequirements(password, ctx).every((r) => r.met);
}

/** First unmet requirement's label, or null when the password is valid. */
export function firstPasswordError(password: string, ctx: PasswordContext = {}): string | null {
  const failing = passwordRequirements(password, ctx).find((r) => !r.met);
  return failing ? failing.label : null;
}

export function passwordStrength(password: string): PasswordStrength {
  const pw = password ?? "";
  if (!pw) return "Weak";
  let score = 0;
  if (pw.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (pw.length >= 14) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 3) return "Weak";
  if (score <= 5) return "Good";
  return "Strong";
}
