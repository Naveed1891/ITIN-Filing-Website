import { describe, expect, it } from "vitest";
import {
  createCheckoutSessionSchema,
  signupSchema,
} from "./validation";

describe("backend validation", () => {
  it("accepts a complete signup payload", () => {
    expect(() =>
      signupSchema.parse({
        fullName: "Jane Applicant",
        email: "jane@example.com",
        whatsapp: "+15551234567",
        country: "United States",
        password: "Password123!",
        confirmPassword: "Password123!",
        termsAccepted: true,
      }),
    ).not.toThrow();
  });

  it("rejects signup without terms acceptance", () => {
    expect(() =>
      signupSchema.parse({
        fullName: "Jane Applicant",
        email: "jane@example.com",
        whatsapp: "+15551234567",
        country: "United States",
        password: "Password123!",
        confirmPassword: "Password123!",
        termsAccepted: false,
      }),
    ).toThrow();
  });

  it("rejects passwords shorter than 12 characters", () => {
    expect(() =>
      signupSchema.parse({
        fullName: "Jane Applicant",
        email: "jane@example.com",
        whatsapp: "+15551234567",
        country: "United States",
        password: "Password12!",
        confirmPassword: "Password12!",
        termsAccepted: true,
      }),
    ).toThrow(/12 characters/);
  });

  it("does not accept browser-supplied checkout price or order status", () => {
    const parsed = createCheckoutSessionSchema.parse({
      packageSlug: "new-itin-application",
      priceCents: 1,
      status: "PAID",
    });

    expect(parsed).toEqual({ packageSlug: "new-itin-application" });
  });
});
