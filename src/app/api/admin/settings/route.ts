import { z } from "zod";
import { requireSuperAdmin } from "@/server/admin";
import { getOperationalSettings, saveOperationalSettings, settingsForAdmin } from "@/server/operational-settings";
import { json, parseJson, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

const text = z.string().trim().max(1000).default("");
const secretText = z.string().trim().max(4096).default("");
const schema = z.object({
  bank: z.object({ accountName: text, bankName: text, accountNumber: text, routingNumber: text, iban: text, swiftCode: text, instructions: text }),
  stripe: z.object({ publishableKey: text, secretKey: text, webhookSecret: text }),
  s3: z.object({ endpoint: text, region: text, bucket: text, accessKeyId: text, secretAccessKey: text, publicBaseUrl: text }),
  smtp: z.object({
    accountId: text,
    apiToken: secretText,
    host: text,
    port: text,
    username: z.literal("api_token").default("api_token"),
    mainEmail: z.union([z.literal(""), z.email()]).default(""),
    fromName: text,
    noReplyEmail: z.union([z.literal(""), z.email()]).default(""),
    secure: z.boolean().default(true),
  }).superRefine((smtp, context) => {
    if (smtp.port && (!/^\d{1,5}$/.test(smtp.port) || Number(smtp.port) < 1 || Number(smtp.port) > 65535)) {
      context.addIssue({ code: "custom", path: ["port"], message: "SMTP port must be between 1 and 65535." });
    }
  }),
  notifications: z.object({
    emailVerification: z.boolean().default(false),
    orders: z.boolean().default(false),
    payments: z.boolean().default(false),
    orderStatus: z.boolean().default(false),
  }).default({ emailVerification: false, orders: false, payments: false, orderStatus: false }),
});

export async function GET() {
  try {
    await requireSuperAdmin();
    return json({ settings: settingsForAdmin(await getOperationalSettings()) });
  } catch (error) { return routeError(error); }
}

export async function PUT(request: Request) {
  try {
    const actor = await requireSuperAdmin();
    const input = await parseJson(request, schema);
    const current = await getOperationalSettings();
    const smtp = {
      ...input.smtp,
      apiToken: input.smtp.apiToken || current.smtp.apiToken,
      username: "api_token",
      secure: input.smtp.port === "465",
    };
    const smtpStarted = Boolean(smtp.accountId || smtp.apiToken || smtp.mainEmail || smtp.noReplyEmail);
    if (smtpStarted && (!smtp.accountId || !smtp.host || !smtp.port || !smtp.apiToken || !smtp.mainEmail || !smtp.noReplyEmail)) {
      throw new Error("Complete the Cloudflare account ID, API token, SMTP host and port, support sender, and no-reply sender before saving email delivery settings.");
    }
    await saveOperationalSettings({
      bank: input.bank,
      stripe: { publishableKey: input.stripe.publishableKey, secretKey: input.stripe.secretKey || current.stripe.secretKey, webhookSecret: input.stripe.webhookSecret || current.stripe.webhookSecret, enabled: false },
      s3: { ...input.s3, secretAccessKey: input.s3.secretAccessKey || current.s3.secretAccessKey },
      smtp,
      notifications: input.notifications,
    });
    return json({ ok: true, message: "Configuration saved to the database.", actor: actor.id });
  } catch (error) { return routeError(error); }
}
