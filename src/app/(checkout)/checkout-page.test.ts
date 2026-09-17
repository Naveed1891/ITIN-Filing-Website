import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";

const checkoutPage = readFileSync(new URL("./checkout/page.tsx", import.meta.url), "utf8");

describe("selected package checkout page", () => {
  it("loads the selected package by slug instead of loading all packages", () => {
    expect(checkoutPage).toContain("/api/forms/${encodeURIComponent(packageSlug)}");
    expect(checkoutPage).not.toContain("/api/forms\")");
    expect(checkoutPage).not.toContain("packages.map");
  });

  it("shows the selected package summary and no package selection copy", () => {
    expect(checkoutPage).toContain("Selected ITIN form");
    expect(checkoutPage).toContain("selectedPackage.name");
    expect(checkoutPage).toContain("selectedPackage.features.map");
    expect(checkoutPage).not.toContain("Choose your ITIN package");
  });

  it("handles missing and unavailable package slugs", () => {
    expect(checkoutPage).toContain("Please select a package first");
    expect(checkoutPage).toContain("Selected package is unavailable");
    expect(checkoutPage).toContain("Back to packages");
  });

  it("preserves selected package during login and signup", () => {
    expect(checkoutPage).toContain("loginRedirectForPackage(selectedPackage.slug)");
    expect(checkoutPage).toContain("signupRedirectForPackage(selectedPackage.slug)");
  });
});
