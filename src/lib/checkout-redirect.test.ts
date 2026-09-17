import { describe, expect, it } from "vitest";
import {
  checkoutReturnTo,
  loginRedirectForPackage,
  signupRedirectForPackage,
} from "./checkout-redirect";

describe("checkout redirects", () => {
  it("preserves the selected package through login/signup", () => {
    expect(loginRedirectForPackage("itin-renewal")).toBe(
      "/login?returnTo=%2Fcheckout%3Fpackage%3Ditin-renewal",
    );
    expect(signupRedirectForPackage("itin-renewal")).toBe(
      "/signup?returnTo=%2Fcheckout%3Fpackage%3Ditin-renewal",
    );
    expect(checkoutReturnTo("new-itin-application")).toBe("/checkout?package=new-itin-application");
  });
});
