import { z } from "zod";
import { requireSuperAdmin } from "@/server/admin";
import { getOperationalSettings, saveOperationalSettings, settingsForAdmin } from "@/server/operational-settings";
import { json, parseJson, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

const text = z.string().trim().max(1000);
const schema = z.object({
  bank: z.object({ accountName: text, bankName: text, accountNumber: text, routingNumber: text, iban: text, swiftCode: text, instructions: text }),
  stripe: z.object({ publishableKey: text, secretKey: text, webhookSecret: text }),
  s3: z.object({ endpoint: text, region: text, bucket: text, accessKeyId: text, secretAccessKey: text, publicBaseUrl: text }),
  smtp: z.object({
    host: text,
    port: text,
    mainEmail: z.union([z.literal(""), z.email()]),
    password: text,
    fromName: text,
    noReplyEmail: z.union([z.literal(""), z.email()]),
    noReplyPassword: text,
    secure: z.boolean(),
  }),
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
    await saveOperationalSettings({
      bank: input.bank,
      stripe: { publishableKey: input.stripe.publishableKey, secretKey: input.stripe.secretKey || current.stripe.secretKey, webhookSecret: input.stripe.webhookSecret || current.stripe.webhookSecret, enabled: false },
      s3: { ...input.s3, secretAccessKey: input.s3.secretAccessKey || current.s3.secretAccessKey },
      smtp: {
        ...input.smtp,
        password: input.smtp.password || current.smtp.password,
        noReplyPassword: input.smtp.noReplyPassword || current.smtp.noReplyPassword,
      },
    });
    return json({ ok: true, message: "Configuration saved to the database.", actor: actor.id });
  } catch (error) { return routeError(error); }
}
