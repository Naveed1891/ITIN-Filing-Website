import { json, parseJson, routeError } from "@/server/http";
import { getOperationalSettings } from "@/server/operational-settings";
import { sendEmailSafely } from "@/server/email";
import { partnerInquiryEmail, partnerConfirmationEmail } from "@/server/email-templates";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(200),
  website: z.string().trim().min(1, "Website is required.").max(300),
  businessType: z.string().trim().min(1, "Business type is required.").max(200),
  monthlyVolume: z.string().trim().min(1, "Expected monthly volume is required.").max(100),
  contactName: z.string().trim().min(1, "Contact name is required.").max(200),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(1, "Phone number is required.").max(30),
  country: z.string().trim().min(1, "Country is required.").max(100),
  goals: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, schema);
    const settings = await getOperationalSettings();
    const supportEmail = settings.smtp.mainEmail;

    if (supportEmail) {
      await sendEmailSafely(supportEmail, partnerInquiryEmail(input), "general");
      await sendEmailSafely(input.email, partnerConfirmationEmail(input), "general");
    }

    return json({ ok: true });
  } catch (error) {
    return routeError(error);
  }
}
