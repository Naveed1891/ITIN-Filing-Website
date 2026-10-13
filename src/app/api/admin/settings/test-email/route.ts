import { z } from "zod";
import { requireSuperAdmin } from "@/server/admin";
import { sendEmail } from "@/server/email";
import { json, parseJson, routeError } from "@/server/http";

export const dynamic = "force-dynamic";

const schema = z.object({ purpose: z.enum(["general", "otp"]) });

export async function POST(request: Request) {
  try {
    const actor = await requireSuperAdmin();
    const { purpose } = await parseJson(request, schema);
    const label = purpose === "otp" ? "OTP/no-reply" : "support";

    await sendEmail(
      actor.email,
      {
        subject: `ITINReady ${label} email test`,
        text: `Your ${label} email configuration is working.`,
        html: `<p>Your <strong>${label}</strong> email configuration is working.</p>`,
      },
      purpose,
    );

    return json({ ok: true, message: `Test email sent to ${actor.email}.` });
  } catch (error) {
    return routeError(error);
  }
}
