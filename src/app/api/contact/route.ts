import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { contactConfirmationEmail, contactFormEmail } from "@/server/email-templates";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.email("Enter a valid email address."),
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, schema);
    const settings = await getOperationalSettings();
    const supportEmail = settings.smtp.mainEmail;
    if (supportEmail) {
      await sendEmailSafely(
        supportEmail,
        contactFormEmail({
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
        }),
        "general",
      );
      await sendEmailSafely(input.email, contactConfirmationEmail({ name: input.name, subject: input.subject, supportEmail }), "general");
    }
    return json({ sent: true });
  } catch (error) {
    return routeError(error);
  }
}
