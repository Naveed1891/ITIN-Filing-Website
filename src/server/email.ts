import nodemailer from "nodemailer";
import type { EmailContent } from "./email-templates";
import { getOperationalSettings } from "./operational-settings";

type MailPurpose = "otp" | "general";

export async function sendEmail(to: string, content: EmailContent, purpose: MailPurpose) {
  const { smtp } = await getOperationalSettings();
  const username = purpose === "otp" ? smtp.noReplyEmail : smtp.mainEmail;
  const password = purpose === "otp" ? smtp.noReplyPassword : smtp.password;
  if (!smtp.host || !username || !password) {
    throw new Error(`${purpose === "otp" ? "No-reply" : "Main"} email delivery is not fully configured.`);
  }
  const port = Number(smtp.port || "587");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("SMTP port is invalid.");
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port,
    secure: port === 465,
    auth: { user: username, pass: password },
  });
  await transport.sendMail({
    from: { name: smtp.fromName || "ITINReady", address: username },
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
