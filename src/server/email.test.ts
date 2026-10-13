import { describe, expect, it } from "vitest";
import { resolveSmtpDelivery } from "./email";
import { emptyOperationalSettings } from "./operational-settings";

const smtp = {
  ...emptyOperationalSettings.smtp,
  accountId: "account-id",
  apiToken: "shared-api-token",
  mainEmail: "support@itinready.com",
  noReplyEmail: "noreply@itinready.com",
};

describe("Cloudflare SMTP delivery", () => {
  it("uses the support address for general messages and the shared API token", () => {
    const delivery = resolveSmtpDelivery(smtp, "general");

    expect(delivery.auth).toEqual({ user: "api_token", pass: "shared-api-token" });
    expect(delivery.from).toEqual({ name: "ITINReady", address: "support@itinready.com" });
    expect(delivery.secure).toBe(true);
  });

  it("uses the no-reply address for OTP messages and support as reply-to", () => {
    const delivery = resolveSmtpDelivery(smtp, "otp");

    expect(delivery.from.address).toBe("noreply@itinready.com");
    expect(delivery.replyTo).toBe("support@itinready.com");
    expect(delivery.auth.pass).toBe("shared-api-token");
  });

  it("rejects an incomplete sender configuration", () => {
    expect(() => resolveSmtpDelivery({ ...smtp, noReplyEmail: "" }, "otp")).toThrow(
      "No-reply email delivery is not fully configured.",
    );
  });
});
