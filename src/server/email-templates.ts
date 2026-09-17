/**
 * ITINFiling branded email templates. Table-based HTML for broad email-client
 * support, using the site's brand palette (navy #112E51 / blue #205493 / gold
 * #f2c969). Mirrors the DirectorKYC transactional-mail approach.
 */

const BRAND = {
  name: "ITINFiling",
  navy: "#112E51",
  navyDeep: "#0B2138",
  blue: "#205493",
  gold: "#f2c969",
  bg: "#F4F6F8",
  text: "#1B2B3A",
  muted: "#5A6B7B",
  border: "#E3E8EE",
};

function shell(opts: { heading: string; bodyHtml: string; preheader?: string; supportEmail?: string }): string {
  const support = opts.supportEmail
    ? `<a href="mailto:${opts.supportEmail}" style="color:${BRAND.blue};text-decoration:none;">${opts.supportEmail}</a>`
    : "our support team";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${opts.heading}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="background:${BRAND.navy};padding:22px 28px;">
<span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:.2px;">ITIN<span style="color:${BRAND.gold};">Filing</span></span>
</td></tr>
<tr><td style="padding:32px 28px 8px;">
<h1 style="margin:0 0 14px;color:${BRAND.text};font-size:22px;line-height:1.25;">${opts.heading}</h1>
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:20px 28px 30px;">
<p style="margin:0;color:${BRAND.muted};font-size:12.5px;line-height:1.6;">
Need help? Contact ${support}. This is an automated message from ${BRAND.name}.
</p></td></tr>
<tr><td style="background:${BRAND.bg};padding:16px 28px;border-top:1px solid ${BRAND.border};">
<p style="margin:0;color:${BRAND.muted};font-size:11.5px;">&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td style="background:${BRAND.blue};border-radius:10px;">
<a href="${href}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${label}</a>
</td></tr></table>`;
}

export type EmailContent = { subject: string; text: string; html: string };

export function otpEmail(opts: { code: string; minutes: number; supportEmail?: string }): EmailContent {
  const bodyHtml = `
<p style="margin:0 0 12px;color:${BRAND.text};font-size:15px;line-height:1.6;">Use the verification code below to finish signing in to your ITINFiling account.</p>
<div style="margin:18px 0;padding:16px;text-align:center;background:${BRAND.bg};border:1px dashed ${BRAND.border};border-radius:10px;">
<span style="font-size:30px;font-weight:800;letter-spacing:8px;color:${BRAND.navy};">${opts.code}</span>
</div>
<p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">This code expires in ${opts.minutes} minutes. If you did not try to sign in, you can ignore this email.</p>`;
  return {
    subject: `Your ITINFiling verification code: ${opts.code}`,
    text: `Your ITINFiling verification code is ${opts.code}. It expires in ${opts.minutes} minutes. If you did not request it, ignore this email.`,
    html: shell({ heading: "Verify your sign-in", bodyHtml, preheader: `Your code is ${opts.code}`, supportEmail: opts.supportEmail }),
  };
}

export function orderConfirmationEmail(opts: {
  fullName: string;
  reference: string;
  packageName: string;
  amount: string;
  dashboardUrl: string;
  supportEmail?: string;
}): EmailContent {
  const bodyHtml = `
<p style="margin:0 0 12px;color:${BRAND.text};font-size:15px;line-height:1.6;">Hi ${opts.fullName}, thanks for your order. Your payment has been received and your application is ready to start.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;border:1px solid ${BRAND.border};border-radius:10px;">
<tr><td style="padding:12px 14px;color:${BRAND.muted};font-size:13px;">Order reference</td><td style="padding:12px 14px;text-align:right;color:${BRAND.text};font-size:13px;font-weight:700;">${opts.reference}</td></tr>
<tr><td style="padding:12px 14px;border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-size:13px;">Service</td><td style="padding:12px 14px;border-top:1px solid ${BRAND.border};text-align:right;color:${BRAND.text};font-size:13px;font-weight:700;">${opts.packageName}</td></tr>
<tr><td style="padding:12px 14px;border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-size:13px;">Amount paid</td><td style="padding:12px 14px;border-top:1px solid ${BRAND.border};text-align:right;color:${BRAND.text};font-size:13px;font-weight:700;">${opts.amount}</td></tr>
</table>
${button(opts.dashboardUrl, "Start your application")}`;
  return {
    subject: `ITINFiling order confirmed — ${opts.reference}`,
    text: `Hi ${opts.fullName}, your ITINFiling order ${opts.reference} (${opts.packageName}, ${opts.amount}) is confirmed. Start your application: ${opts.dashboardUrl}`,
    html: shell({ heading: "Your order is confirmed", bodyHtml, preheader: `Order ${opts.reference} confirmed`, supportEmail: opts.supportEmail }),
  };
}

export function statusUpdateEmail(opts: {
  fullName: string;
  reference: string;
  status: string;
  message?: string;
  dashboardUrl: string;
  supportEmail?: string;
}): EmailContent {
  const bodyHtml = `
<p style="margin:0 0 12px;color:${BRAND.text};font-size:15px;line-height:1.6;">Hi ${opts.fullName}, there is an update on your ITIN application <strong>${opts.reference}</strong>.</p>
<div style="margin:14px 0;padding:14px 16px;background:${BRAND.bg};border-radius:10px;">
<span style="color:${BRAND.muted};font-size:12px;text-transform:uppercase;letter-spacing:.06em;">New status</span><br>
<span style="color:${BRAND.navy};font-size:17px;font-weight:800;">${opts.status}</span>
</div>
${opts.message ? `<p style="margin:0 0 4px;color:${BRAND.text};font-size:14px;line-height:1.6;">${opts.message}</p>` : ""}
${button(opts.dashboardUrl, "View your application")}`;
  return {
    subject: `Update on your ITIN application ${opts.reference}: ${opts.status}`,
    text: `Hi ${opts.fullName}, your ITIN application ${opts.reference} status is now ${opts.status}. ${opts.message ?? ""} View: ${opts.dashboardUrl}`,
    html: shell({ heading: "Application update", bodyHtml, preheader: `${opts.reference}: ${opts.status}`, supportEmail: opts.supportEmail }),
  };
}
