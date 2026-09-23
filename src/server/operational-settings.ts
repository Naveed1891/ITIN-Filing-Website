import { prisma } from "./db";
import { decryptSecret, encryptSecret } from "./secrets";

const KEY = "operational_integrations_v1";

export type OperationalSettings = {
  bank: { accountName: string; bankName: string; accountNumber: string; routingNumber: string; iban: string; swiftCode: string; instructions: string };
  stripe: { publishableKey: string; secretKey: string; webhookSecret: string; enabled: boolean };
  s3: { endpoint: string; region: string; bucket: string; accessKeyId: string; secretAccessKey: string; publicBaseUrl: string };
  smtp: { host: string; port: string; username: string; password: string; fromName: string; noReplyEmail: string; secure: boolean };
};

export const emptyOperationalSettings: OperationalSettings = {
  bank: { accountName: "", bankName: "", accountNumber: "", routingNumber: "", iban: "", swiftCode: "", instructions: "" },
  stripe: { publishableKey: "", secretKey: "", webhookSecret: "", enabled: false },
  s3: { endpoint: "", region: "", bucket: "", accessKeyId: "", secretAccessKey: "", publicBaseUrl: "" },
  smtp: { host: "", port: "587", username: "", password: "", fromName: "ITINReady", noReplyEmail: "", secure: true },
};

export async function getOperationalSettings(): Promise<OperationalSettings> {
  const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
  if (!row) return structuredClone(emptyOperationalSettings);
  try {
    const parsed = JSON.parse(decryptSecret(row.valueJson)) as Partial<OperationalSettings>;
    return {
      bank: { ...emptyOperationalSettings.bank, ...parsed.bank },
      stripe: { ...emptyOperationalSettings.stripe, ...parsed.stripe, enabled: false },
      s3: { ...emptyOperationalSettings.s3, ...parsed.s3 },
      smtp: { ...emptyOperationalSettings.smtp, ...parsed.smtp },
    };
  } catch {
    return structuredClone(emptyOperationalSettings);
  }
}

export async function saveOperationalSettings(settings: OperationalSettings) {
  const safe = { ...settings, stripe: { ...settings.stripe, enabled: false } };
  await prisma.appSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, valueJson: encryptSecret(JSON.stringify(safe)) },
    update: { valueJson: encryptSecret(JSON.stringify(safe)) },
  });
}

export function settingsForAdmin(settings: OperationalSettings) {
  return {
    bank: settings.bank,
    stripe: { publishableKey: settings.stripe.publishableKey, enabled: false, secretKeyConfigured: Boolean(settings.stripe.secretKey), webhookSecretConfigured: Boolean(settings.stripe.webhookSecret) },
    s3: { ...settings.s3, secretAccessKey: "", secretAccessKeyConfigured: Boolean(settings.s3.secretAccessKey) },
    smtp: { ...settings.smtp, password: "", passwordConfigured: Boolean(settings.smtp.password) },
  };
}
