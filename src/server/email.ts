import nodemailer from "nodemailer";
import type { EmailContent } from "./email-templates";
import { getOperationalSettings } from "./operational-settings";

type MailPurpose = "otp" | "general";

export function resolveSmtpDelivery(smtp: Awaited<ReturnType<typeof getOperationalSettings>>["smtp"], purpose: MailPurpose) {
  const fromAddress = purpose === "otp" ? smtp.noReplyEmail : smtp.mainEmail;
  if (!smtp.host || !fromAddress || !smtp.apiToken) {
    throw new Error(`${purpose === "otp" ? "No-reply" : "Support"} email delivery is not fully configured.`);
  }
  const port = Number(smtp.port || "465");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("SMTP port is invalid.");
  return {
    host: smtp.host,
    port,
    secure: port === 465,
    auth: { user: smtp.username || "api_token", pass: smtp.apiToken },
    from: { name: smtp.fromName || "ITINReady", address: fromAddress },
    replyTo: smtp.mainEmail || undefined,
  };
}

export async function sendEmail(to: string, content: EmailContent, purpose: MailPurpose) {
  const { smtp } = await getOperationalSettings();
  const delivery = resolveSmtpDelivery(smtp, purpose);
  const transport = nodemailer.createTransport({
    host: delivery.host,
    port: delivery.port,
    secure: delivery.secure,
    auth: delivery.auth,
  });
  await transport.sendMail({
    from: delivery.from,
    replyTo: delivery.replyTo,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendEmailSafely(to: string, content: EmailContent, purpose: MailPurpose = "general") {
  try {
    await sendEmail(to, content, purpose);
    return true;
  } catch (error) {
    console.error("Transactional email could not be sent.", error);
    return false;
  }
}
