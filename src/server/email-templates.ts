/**
 * ITINReady branded email templates. Table-based HTML for broad email-client
 * support, using the site's brand palette (navy #112E51 / blue #205493 / gold
 * #f2c969). Mirrors the DirectorKYC transactional-mail approach.
 */

const BRAND = {
  name: "ITINReady",
  navy: "#112E51",
  blue: "#205493",
  gold: "#f2c969",
  bg: "#F4F6F8",
  text: "#1B2B3A",
  muted: "#5A6B7B",
  border: "#E3E8EE",
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://itinready.com").replace(/\/$/, "");
}

function shell(opts: { heading: string; bodyHtml: string; preheader?: string; supportEmail?: string }): string {
  const appUrl = getAppUrl();
  const support = opts.supportEmail
    ? `<a href="mailto:${esc(opts.supportEmail)}" style="color:${BRAND.blue};text-decoration:none;">${esc(opts.supportEmail)}</a>`
    : "our support team";
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
<tr>
  <td style="background:${BRAND.navy};padding:20px 28px;">
    <img src="${appUrl}/images/brand/itinfiling-logo.png" alt="${BRAND.name}" height="40" style="height:40px;width:auto;max-width:220px;display:block;border:0;outline:none;text-decoration:none;" />
  </td>
</tr>
<tr>
  <td style="padding:30px 28px 28px;">
    <h1 style="margin:0 0 14px;color:${BRAND.text};font-size:21px;font-weight:800;line-height:1.25;">${esc(opts.heading)}</h1>
    ${opts.bodyHtml}
  </td>
</tr>
<tr>
  <td style="padding:20px 28px;background:#fafafa;border-top:1px solid ${BRAND.border};">
    <p style="margin:0 0 4px;color:${BRAND.muted};font-size:12px;line-height:1.6;">
      Need help? Contact ${support}. This is an automated message from ${BRAND.name}.
    </p>
    <p style="margin:0;color:${BRAND.muted};font-size:12px;line-height:1.6;">
      <a href="${appUrl}" style="color:${BRAND.blue};text-decoration:none;">itinready.com</a>
    </p>
    <p style="margin:10px 0 0;color:#9ca3af;font-size:11px;">&copy; ${year} ${BRAND.name}. All rights reserved.</p>
  </td>
</tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;"><tr>
<td style="border-radius:10px;background:${BRAND.blue};">
<a href="${esc(href)}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;">${esc(label)}</a>
</td></tr></table>`;
}

function dataRow(label: string, value: string): string {
  return `<tr>
<td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};color:${BRAND.muted};font-size:13px;">${esc(label)}</td>
<td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:14px;font-weight:600;text-align:right;">${esc(value)}</td>
</tr>`;
}

function dataTable(rows: Array<[string, string]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
${rows.map(([l, v]) => dataRow(l, v)).join("")}
</table>`;
}

function statusBadge(label: string, value: string): string {
  return `<div style="margin:14px 0;padding:14px 16px;background:${BRAND.bg};border-radius:10px;">
<span style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:.06em;">${esc(label)}</span><br>
<span style="color:${BRAND.navy};font-size:17px;font-weight:800;">${esc(value)}</span>
</div>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;color:${BRAND.text};font-size:15px;line-height:1.65;">${esc(text)}</p>`;
}

function note(text: string): string {
  return `<p style="margin:18px 0 0;padding:14px 16px;background:${BRAND.bg};border-radius:10px;color:${BRAND.muted};font-size:13px;line-height:1.6;">${esc(text)}</p>`;
}

export type EmailContent = { subject: string; text: string; html: string };

/* ── OTP verification ──────────────────────────────────────────────── */

export function otpEmail(opts: { code: string; minutes: number; supportEmail?: string }): EmailContent {
  const bodyHtml = `
${paragraph("Use the verification code below to finish signing in to your ITINReady account.")}
<div style="margin:6px 0 20px;padding:18px;background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:12px;text-align:center;">
<div style="font-size:32px;font-weight:800;letter-spacing:10px;color:${BRAND.navy};font-family:'Courier New',monospace;">${esc(opts.code)}</div>
</div>
${note(`This code expires in ${opts.minutes} minutes. If you did not try to sign in, you can safely ignore this email.`)}`;
  return {
    subject: `Your ITINReady verification code: ${opts.code}`,
    text: `Your ITINReady verification code is ${opts.code}. It expires in ${opts.minutes} minutes. If you did not request it, ignore this email.`,
    html: shell({ heading: "Verify your sign-in", bodyHtml, preheader: `Your code is ${opts.code}`, supportEmail: opts.supportEmail }),
  };
}

/* ── Order confirmation ────────────────────────────────────────────── */

export function orderConfirmationEmail(opts: {
  fullName: string;
  reference: string;
  packageName: string;
  amount: string;
  dashboardUrl: string;
  supportEmail?: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`Hi ${opts.fullName}, thanks for your order! Your payment has been received and your application is ready to start.`)}
${dataTable([
  ["Order reference", opts.reference],
  ["Service", opts.packageName],
  ["Amount paid", opts.amount],
])}
${button(opts.dashboardUrl, "Start your application")}`;
  return {
    subject: `ITINReady order confirmed - ${opts.reference}`,
    text: `Hi ${opts.fullName}, your ITINReady order ${opts.reference} (${opts.packageName}, ${opts.amount}) is confirmed. Start your application: ${opts.dashboardUrl}`,
    html: shell({ heading: "Your order is confirmed", bodyHtml, preheader: `Order ${opts.reference} confirmed`, supportEmail: opts.supportEmail }),
  };
}

/* ── Order status update ───────────────────────────────────────────── */

export function statusUpdateEmail(opts: {
  fullName: string;
  reference: string;
  status: string;
  message?: string;
  dashboardUrl: string;
  supportEmail?: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`Hi ${opts.fullName}, there is an update on your ITIN application ${opts.reference}.`)}
${statusBadge("New status", opts.status)}
${opts.message ? paragraph(opts.message) : ""}
${button(opts.dashboardUrl, "View your application")}`;
  return {
    subject: `Update on your ITIN application ${opts.reference}: ${opts.status}`,
    text: `Hi ${opts.fullName}, your ITIN application ${opts.reference} status is now ${opts.status}. ${opts.message ?? ""} View: ${opts.dashboardUrl}`,
    html: shell({ heading: "Application update", bodyHtml, preheader: `${opts.reference}: ${opts.status}`, supportEmail: opts.supportEmail }),
  };
}

/* ── Payment proof received ────────────────────────────────────────── */

export function paymentProofReceivedEmail(opts: {
  fullName: string;
  reference: string;
  amount: string;
  dashboardUrl: string;
  supportEmail?: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`Hi ${opts.fullName}, we received your bank-transfer proof for order ${opts.reference}.`)}
${statusBadge("Payment under review", opts.amount)}
${note("We will notify you once the payment is approved. Your application will open after approval.")}
${button(opts.dashboardUrl, "View your order")}`;
  return {
    subject: `Payment proof received - ${opts.reference}`,
    text: `Hi ${opts.fullName}, we received your payment proof for ${opts.reference} (${opts.amount}). We will notify you after review. ${opts.dashboardUrl}`,
    html: shell({ heading: "Payment proof received", bodyHtml, preheader: `${opts.reference} is awaiting payment review`, supportEmail: opts.supportEmail }),
  };
}

/* ── Password reset ───────────────────────────────────────────────── */

/* ── Contact form (to support inbox) ─────────────────────────────── */

export function contactFormEmail(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`A visitor submitted a contact form on itinready.com.`)}
${dataTable([
  ["Name", opts.name],
  ["Email", opts.email],
  ["Subject", opts.subject],
])}
<div style="margin:14px 0;padding:16px;background:${BRAND.bg};border-radius:10px;">
<p style="margin:0 0 6px;color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:.06em;">Message</p>
<p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${esc(opts.message)}</p>
</div>
${note(`Reply directly to ${opts.email} to respond.`)}`;
  return {
    subject: `Contact form: ${opts.subject}`,
    text: `Contact form from ${opts.name} (${opts.email}):\nSubject: ${opts.subject}\n\n${opts.message}`,
    html: shell({ heading: "New contact form submission", bodyHtml }),
  };
}

export function contactConfirmationEmail(opts: { name: string; subject: string; supportEmail?: string }): EmailContent {
  const bodyHtml = `<p style="margin:0 0 12px;color:${BRAND.text};font-size:15px;line-height:1.6;">Hi ${opts.name}, thank you for contacting ITINReady.</p><p style="margin:0;color:${BRAND.muted};font-size:14px;line-height:1.6;">We received your message about <strong>${opts.subject}</strong>. A member of our team will review it and respond as soon as possible.</p>`;
  return { subject: "We received your ITINReady message", text: `Hi ${opts.name}, we received your message about ${opts.subject}. Our team will respond as soon as possible.`, html: shell({ heading: "Message received", bodyHtml, supportEmail: opts.supportEmail }) };
}

export function supportReplyEmail(opts: { fullName: string; subject: string; reply: string; dashboardUrl: string; supportEmail?: string }): EmailContent {
  const bodyHtml = `<p style="margin:0 0 12px;color:${BRAND.text};font-size:15px;line-height:1.6;">Hi ${opts.fullName}, our team replied to your support message.</p><div style="margin:14px 0;padding:16px;background:${BRAND.bg};border-left:4px solid ${BRAND.gold};border-radius:8px;"><strong style="color:${BRAND.navy};">${opts.subject}</strong><p style="margin:8px 0 0;color:${BRAND.text};font-size:14px;line-height:1.6;white-space:pre-wrap;">${opts.reply}</p></div>${button(opts.dashboardUrl, "View conversation")}`;
  return { subject: `Reply from ITINReady: ${opts.subject}`, text: `Hi ${opts.fullName}, our team replied: ${opts.reply}\n\nView your messages: ${opts.dashboardUrl}`, html: shell({ heading: "You have a new reply", bodyHtml, supportEmail: opts.supportEmail }) };
}

/* ── Partnership enquiry (to support inbox) ──────────────────────── */

export function partnerInquiryEmail(opts: {
  companyName: string;
  website: string;
  businessType: string;
  monthlyVolume: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  goals?: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`A new partnership enquiry was submitted on itinready.com.`)}
${dataTable([
  ["Company", opts.companyName],
  ["Website", opts.website],
  ["Business type", opts.businessType],
  ["Monthly volume", opts.monthlyVolume],
  ["Contact", opts.contactName],
  ["Email", opts.email],
  ["Phone", opts.phone],
  ["Country", opts.country],
])}
${opts.goals ? `<div style="margin:14px 0;padding:16px;background:${BRAND.bg};border-radius:10px;">
<p style="margin:0 0 6px;color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:.06em;">Partnership goals</p>
<p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.65;white-space:pre-wrap;">${esc(opts.goals)}</p>
</div>` : ""}`;
  return {
    subject: `Partnership enquiry - ${opts.companyName}`,
    text: `Partnership enquiry from ${opts.contactName} at ${opts.companyName} (${opts.email}). Business: ${opts.businessType}, Volume: ${opts.monthlyVolume}, Country: ${opts.country}.${opts.goals ? ` Goals: ${opts.goals}` : ""}`,
    html: shell({ heading: "New partnership enquiry", bodyHtml }),
  };
}

export function partnerConfirmationEmail(opts: {
  companyName: string;
  contactName: string;
  email: string;
}): EmailContent {
  const bodyHtml = `
${paragraph(`Hi ${opts.contactName}, thank you for your interest in partnering with ITINReady.`)}
${paragraph("We have received your enquiry and our partnerships team will review it shortly. You can expect a reply within one working day.")}
${dataTable([
  ["Company", opts.companyName],
  ["Email", opts.email],
])}
${note("If you have immediate questions, reply directly to this email.")}`;
  return {
    subject: "We received your partnership enquiry",
    text: `Hi ${opts.contactName}, thanks for your partnership enquiry for ${opts.companyName}. Our team will reply within one working day.`,
    html: shell({ heading: "Partnership enquiry received", bodyHtml }),
  };
}

/* ── Password reset ───────────────────────────────────────────────── */

export function passwordResetEmail(opts: { code: string; minutes: number; supportEmail?: string }): EmailContent {
  const bodyHtml = `
${paragraph("We received a request to reset your ITINReady account password. Use the code below to proceed.")}
<div style="margin:6px 0 20px;padding:18px;background:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:12px;text-align:center;">
<div style="font-size:32px;font-weight:800;letter-spacing:10px;color:${BRAND.navy};font-family:'Courier New',monospace;">${esc(opts.code)}</div>
</div>
${note(`This code expires in ${opts.minutes} minutes. If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.`)}`;
  return {
    subject: `Password reset code: ${opts.code}`,
    text: `Your ITINReady password reset code is ${opts.code}. It expires in ${opts.minutes} minutes. If you did not request it, ignore this email.`,
    html: shell({ heading: "Reset your password", bodyHtml, preheader: `Your code is ${opts.code}`, supportEmail: opts.supportEmail }),
  };
}
